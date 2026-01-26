'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

// Patrimonio minimo per qualificazione partner (in EUR)
const MIN_PATRIMONIO_PARTNER = 150000

// Mappa valori form a importi numerici per qualificazione
const patrimonioValues: Record<string, number> = {
  'sotto-50k': 25000,
  '50-100k': 75000,
  '100-150k': 125000,
  '150-250k': 200000,
  '250-500k': 375000,
  '500k-1m': 750000,
  '1m+': 1500000,
}

const patrimonioOptions = [
  { value: 'sotto-50k', label: 'Meno di €50.000' },
  { value: '50-100k', label: '€50.000 - €100.000' },
  { value: '100-150k', label: '€100.000 - €150.000' },
  { value: '150-250k', label: '€150.000 - €250.000' },
  { value: '250-500k', label: '€250.000 - €500.000' },
  { value: '500k-1m', label: '€500.000 - €1.000.000' },
  { value: '1m+', label: 'Oltre €1.000.000' },
]

type Step = 'nome' | 'cognome' | 'email' | 'telefono' | 'patrimonio' | 'messaggio'

const steps: Step[] = ['nome', 'cognome', 'email', 'telefono', 'patrimonio', 'messaggio']

export default function ContactForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    patrimonio: '',
    messaggio: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'analyzing' | 'success' | 'not-qualified' | 'error'>('idle')
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward')
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  // Focus input when step changes
  useEffect(() => {
    if (status === 'idle' && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [currentStep, status])

  // Effetto per simulare analisi del profilo
  useEffect(() => {
    if (status === 'analyzing') {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setStatus('success'), 500)
            return 100
          }
          return prev + 3
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [status])

  const validateCurrentStep = useCallback(() => {
    const step = steps[currentStep]
    const value = formData[step]

    if (step === 'messaggio') return true // Optional
    if (!value.trim()) return false

    if (step === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value)
    }

    return true
  }, [currentStep, formData])

  const goToNextStep = useCallback(() => {
    if (!validateCurrentStep()) return

    if (currentStep < steps.length - 1) {
      setDirection('forward')
      setCurrentStep(prev => prev + 1)
    } else {
      handleSubmit()
    }
  }, [currentStep, validateCurrentStep])

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setDirection('backward')
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      goToNextStep()
    }
  }

  const handleSubmit = async () => {
    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          nome: `${formData.nome} ${formData.cognome}`.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit')
      }

      // Track conversion in GA4
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          event_category: 'form',
          event_label: 'contact_form_submission',
          value: formData.patrimonio || 'non_specificato',
        })
      }

      // Verifica qualificazione
      const patrimonioValue = patrimonioValues[formData.patrimonio] || 0

      if (patrimonioValue >= MIN_PATRIMONIO_PARTNER) {
        setLoadingProgress(0)
        setStatus('analyzing')
      } else {
        setStatus('not-qualified')
      }
    } catch {
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handlePatrimonioSelect = (value: string) => {
    setFormData(prev => ({ ...prev, patrimonio: value }))
    setTimeout(() => goToNextStep(), 300)
  }

  const resetForm = () => {
    setFormData({ nome: '', cognome: '', email: '', telefono: '', patrimonio: '', messaggio: '' })
    setStatus('idle')
    setLoadingProgress(0)
    setCurrentStep(0)
  }

  const progress = ((currentStep + 1) / steps.length) * 100

  // Schermata "Analisi in corso"
  if (status === 'analyzing') {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 mx-auto mb-8 relative">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="44" stroke="#e5e7eb" strokeWidth="6" fill="none" />
            <circle
              cx="48"
              cy="48"
              r="44"
              stroke="#40916C"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${loadingProgress * 2.76} 276`}
              strokeLinecap="round"
              className="transition-all duration-100"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-semibold text-forest">{loadingProgress}%</span>
          </div>
        </div>
        <h3 className="font-heading text-2xl text-forest mb-3">Analisi del tuo profilo</h3>
        <p className="text-gray-500">Stiamo verificando la compatibilità con i nostri partner...</p>
      </div>
    )
  }

  // Schermata "Matchato con successo"
  if (status === 'success') {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-heading text-2xl text-forest mb-4">Match Confermato!</h3>
        <p className="text-gray-600 mb-2 text-lg">Sei stato abbinato con successo.</p>
        <p className="text-gray-600 mb-8 text-lg">
          <strong>Verrai contattato dal nostro partner<br />con sede a Ginevra, Svizzera.</strong>
        </p>
        <div className="flex items-center justify-center gap-2 text-gray-500 mb-8">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Risposta entro 24-48 ore lavorative
        </div>
        <button onClick={resetForm} className="text-forest font-medium hover:underline">
          Invia un&apos;altra richiesta
        </button>
      </div>
    )
  }

  // Schermata "Non qualificato"
  if (status === 'not-qualified') {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="font-heading text-2xl text-forest mb-4">Grazie per l&apos;interesse!</h3>
        <p className="text-gray-600 mb-4 text-lg">
          I servizi del nostro partner sono riservati<br />a patrimoni superiori a <strong>€150.000</strong>.
        </p>
        <p className="text-gray-600 mb-8">
          Puoi utilizzare gratuitamente i nostri{' '}
          <a href="/strumenti" className="text-forest font-medium hover:underline">strumenti professionali</a>.
        </p>
        <button onClick={resetForm} className="text-forest font-medium hover:underline">
          Torna al form
        </button>
      </div>
    )
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <svg className="animate-spin w-12 h-12 text-forest" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-gray-500 mt-4">Invio in corso...</p>
      </div>
    )
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="font-heading text-2xl text-forest mb-4">Errore</h3>
        <p className="text-gray-600 mb-8">Si è verificato un errore. Riprova.</p>
        <button onClick={resetForm} className="text-forest font-medium hover:underline">
          Riprova
        </button>
      </div>
    )
  }

  const renderStep = () => {
    const step = steps[currentStep]
    const stepNumber = currentStep + 1

    const baseInputClass = "w-full bg-transparent border-b-2 border-gray-300 focus:border-forest outline-none py-3 text-xl md:text-2xl text-forest placeholder:text-gray-400 transition-colors"

    switch (step) {
      case 'nome':
        return (
          <div>
            <label className="block text-sm text-gray-500 mb-2">{stepNumber} →</label>
            <h3 className="font-heading text-2xl md:text-3xl text-forest mb-6">Come ti chiami?</h3>
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Il tuo nome"
              className={baseInputClass}
              autoComplete="given-name"
            />
          </div>
        )

      case 'cognome':
        return (
          <div>
            <label className="block text-sm text-gray-500 mb-2">{stepNumber} →</label>
            <h3 className="font-heading text-2xl md:text-3xl text-forest mb-6">Qual è il tuo cognome?</h3>
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="text"
              name="cognome"
              value={formData.cognome}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Il tuo cognome"
              className={baseInputClass}
              autoComplete="family-name"
            />
          </div>
        )

      case 'email':
        return (
          <div>
            <label className="block text-sm text-gray-500 mb-2">{stepNumber} →</label>
            <h3 className="font-heading text-2xl md:text-3xl text-forest mb-6">Qual è la tua email?</h3>
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="nome@email.com"
              className={baseInputClass}
              autoComplete="email"
            />
          </div>
        )

      case 'telefono':
        return (
          <div>
            <label className="block text-sm text-gray-500 mb-2">{stepNumber} →</label>
            <h3 className="font-heading text-2xl md:text-3xl text-forest mb-6">Il tuo numero di telefono?</h3>
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="+39 333 1234567"
              className={baseInputClass}
              autoComplete="tel"
            />
          </div>
        )

      case 'patrimonio':
        return (
          <div>
            <label className="block text-sm text-gray-500 mb-2">{stepNumber} →</label>
            <h3 className="font-heading text-2xl md:text-3xl text-forest mb-6">
              Quanto vorresti investire?
            </h3>
            <div className="grid gap-3">
              {patrimonioOptions.map((option, index) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handlePatrimonioSelect(option.value)}
                  className={`w-full text-left px-5 py-4 rounded-lg border-2 transition-all ${
                    formData.patrimonio === option.value
                      ? 'border-forest bg-green-50 text-forest'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="inline-block w-6 h-6 text-center text-sm border rounded mr-3 align-middle">
                    {String.fromCharCode(65 + index)}
                  </span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )

      case 'messaggio':
        return (
          <div>
            <label className="block text-sm text-gray-500 mb-2">{stepNumber} →</label>
            <h3 className="font-heading text-2xl md:text-3xl text-forest mb-2">
              Obiettivi di investimento
            </h3>
            <p className="text-gray-500 mb-6 text-sm">Opzionale - premi Invio per saltare</p>
            <textarea
              ref={inputRef as React.RefObject<HTMLTextAreaElement>}
              name="messaggio"
              value={formData.messaggio}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Es: rendita passiva, pianificazione pensione, diversificazione..."
              rows={3}
              className="w-full bg-transparent border-2 border-gray-200 focus:border-forest outline-none p-4 text-lg text-forest placeholder:text-gray-400 transition-colors rounded-lg resize-none"
            />
          </div>
        )
    }
  }

  return (
    <div className="min-h-[400px] flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-gray-200 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-forest transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step content with animation */}
      <div className="flex-1 relative overflow-hidden">
        <div
          key={currentStep}
          className={`animate-fade-in ${direction === 'forward' ? 'animate-slide-left' : 'animate-slide-right'}`}
        >
          {renderStep()}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={goToPrevStep}
          disabled={currentStep === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            currentStep === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:text-forest hover:bg-gray-50'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Indietro
        </button>

        <div className="text-sm text-gray-400">
          {currentStep + 1} / {steps.length}
        </div>

        <button
          type="button"
          onClick={goToNextStep}
          disabled={!validateCurrentStep() && steps[currentStep] !== 'messaggio'}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
            validateCurrentStep() || steps[currentStep] === 'messaggio'
              ? 'bg-forest text-white hover:bg-green-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentStep === steps.length - 1 ? 'Invia' : 'Continua'}
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Keyboard hint */}
      <p className="text-center text-xs text-gray-400 mt-4">
        Premi <kbd className="px-2 py-0.5 bg-gray-100 rounded text-gray-500">Enter ↵</kbd> per continuare
      </p>
    </div>
  )
}
