'use client'

import { useState, useEffect, useMemo } from 'react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

// Patrimonio minimo per qualificazione partner (in EUR)
const MIN_PATRIMONIO_PARTNER = 150000

type Step = 'importo' | 'orizzonte' | 'obiettivo' | 'proiezione' | 'contatto'
const TOTAL_STEPS = 5

const orizzonteOptions = [
  { value: '1-5', label: '1-5 anni', description: 'Breve termine' },
  { value: '5-10', label: '5-10 anni', description: 'Medio termine' },
  { value: '10+', label: '10+ anni', description: 'Lungo termine' },
]

const obiettivoOptions = [
  { value: 'crescita', label: 'Crescita del capitale', description: 'Massimizzare i rendimenti nel tempo', icon: 'chart' },
  { value: 'rendita', label: 'Rendita passiva', description: 'Ottenere entrate periodiche', icon: 'cash' },
  { value: 'protezione', label: 'Protezione patrimonio', description: 'Preservare il capitale', icon: 'shield' },
]

// Rendimenti annui per profilo
const PROFILI = {
  conservativo: { rendimento: 0.06, label: 'Conservativo', color: '#74C69D' },
  moderato: { rendimento: 0.10, label: 'Moderato', color: '#40916C' },
  aggressivo: { rendimento: 0.15, label: 'Aggressivo', color: '#1B4D3E' },
}

export default function ContactForm() {
  const [currentStep, setCurrentStep] = useState<Step>('importo')
  const [importo, setImporto] = useState(100000)
  const [orizzonte, setOrizzonte] = useState('')
  const [obiettivo, setObiettivo] = useState('')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'analyzing' | 'success' | 'not-qualified' | 'error'>('idle')
  const [loadingProgress, setLoadingProgress] = useState(0)

  const stepIndex = ['importo', 'orizzonte', 'obiettivo', 'proiezione', 'contatto'].indexOf(currentStep)
  const progress = ((stepIndex + 1) / TOTAL_STEPS) * 100

  // Calcolo proiezioni
  const proiezioni = useMemo(() => {
    const anni = orizzonte === '1-5' ? 5 : orizzonte === '5-10' ? 10 : 20
    const result: { anno: number; conservativo: number; moderato: number; aggressivo: number }[] = []

    for (let i = 0; i <= anni; i++) {
      result.push({
        anno: i,
        conservativo: importo * Math.pow(1 + PROFILI.conservativo.rendimento, i),
        moderato: importo * Math.pow(1 + PROFILI.moderato.rendimento, i),
        aggressivo: importo * Math.pow(1 + PROFILI.aggressivo.rendimento, i),
      })
    }
    return result
  }, [importo, orizzonte])

  // Animazione loading
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

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const goNext = () => {
    if (currentStep === 'importo') setCurrentStep('orizzonte')
    else if (currentStep === 'orizzonte' && orizzonte) setCurrentStep('obiettivo')
    else if (currentStep === 'obiettivo' && obiettivo) setCurrentStep('proiezione')
    else if (currentStep === 'proiezione') setCurrentStep('contatto')
  }

  const goBack = () => {
    if (currentStep === 'orizzonte') setCurrentStep('importo')
    else if (currentStep === 'obiettivo') setCurrentStep('orizzonte')
    else if (currentStep === 'proiezione') setCurrentStep('obiettivo')
    else if (currentStep === 'contatto') setCurrentStep('proiezione')
  }

  const handleSubmit = async () => {
    if (!nome || !email) return

    setStatus('loading')

    try {
      // Map importo to patrimonio value for backward compatibility
      const patrimonioValue = importo < 50000 ? 'sotto-50k' :
        importo < 100000 ? '50-100k' :
        importo < 150000 ? '100-150k' :
        importo < 250000 ? '150-250k' :
        importo < 500000 ? '250-500k' :
        importo < 1000000 ? '500k-1m' : '1m+'

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          telefono,
          patrimonio: patrimonioValue,
          messaggio: `Obiettivo: ${obiettivo}, Orizzonte: ${orizzonte}, Importo: ${formatCurrency(importo)}`,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit')

      // Track conversion
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          event_category: 'form',
          event_label: 'contact_form_pleo',
          value: importo,
        })
      }

      if (importo >= MIN_PATRIMONIO_PARTNER) {
        setLoadingProgress(0)
        setStatus('analyzing')
      } else {
        setStatus('not-qualified')
      }
    } catch {
      setStatus('error')
    }
  }

  const resetForm = () => {
    setCurrentStep('importo')
    setImporto(100000)
    setOrizzonte('')
    setObiettivo('')
    setNome('')
    setEmail('')
    setTelefono('')
    setStatus('idle')
    setLoadingProgress(0)
  }

  // ============================================================================
  // STATUS SCREENS
  // ============================================================================

  if (status === 'analyzing') {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 mx-auto mb-8 relative">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="44" stroke="#e5e7eb" strokeWidth="6" fill="none" />
            <circle
              cx="48" cy="48" r="44"
              stroke="#40916C" strokeWidth="6" fill="none"
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
        <p className="text-gray-500">Stiamo verificando la compatibilita con i nostri partner...</p>
      </div>
    )
  }

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

  // ============================================================================
  // STEP CONTENT
  // ============================================================================

  const renderStep = () => {
    switch (currentStep) {
      case 'importo':
        return (
          <div className="text-center">
            <h3 className="font-heading text-2xl md:text-3xl text-forest mb-2">
              Quanto vorresti investire?
            </h3>
            <p className="text-gray-500 mb-8">Usa lo slider per selezionare l&apos;importo</p>

            <div className="mb-8">
              <div className="text-5xl md:text-6xl font-heading text-forest mb-4">
                {formatCurrency(importo)}
              </div>
              <input
                type="range"
                min="10000"
                max="2000000"
                step="10000"
                value={importo}
                onChange={(e) => setImporto(Number(e.target.value))}
                className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>€10k</span>
                <span>€500k</span>
                <span>€1M</span>
                <span>€2M+</span>
              </div>
            </div>

            {importo >= MIN_PATRIMONIO_PARTNER && (
              <div className="bg-green-50 rounded-lg p-4 text-sm text-green-700 mb-4">
                <span className="font-medium">Perfetto!</span> Con questo importo sei idoneo per i servizi dei nostri partner svizzeri.
              </div>
            )}
          </div>
        )

      case 'orizzonte':
        return (
          <div className="text-center">
            <h3 className="font-heading text-2xl md:text-3xl text-forest mb-2">
              Qual è il tuo orizzonte temporale?
            </h3>
            <p className="text-gray-500 mb-8">Quanto tempo pensi di tenere investito il capitale</p>

            <div className="grid gap-3 max-w-md mx-auto">
              {orizzonteOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setOrizzonte(option.value)
                    setTimeout(goNext, 300)
                  }}
                  className={`w-full text-left px-6 py-5 rounded-xl border-2 transition-all ${
                    orizzonte === option.value
                      ? 'border-forest bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-heading text-lg text-forest">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 'obiettivo':
        return (
          <div className="text-center">
            <h3 className="font-heading text-2xl md:text-3xl text-forest mb-2">
              Qual è il tuo obiettivo principale?
            </h3>
            <p className="text-gray-500 mb-8">Seleziona quello che meglio descrive le tue priorita</p>

            <div className="grid gap-3 max-w-md mx-auto">
              {obiettivoOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setObiettivo(option.value)
                    setTimeout(goNext, 300)
                  }}
                  className={`w-full text-left px-6 py-5 rounded-xl border-2 transition-all ${
                    obiettivo === option.value
                      ? 'border-forest bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                      {option.icon === 'chart' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      )}
                      {option.icon === 'cash' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {option.icon === 'shield' && (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="font-heading text-lg text-forest">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 'proiezione':
        const anni = orizzonte === '1-5' ? 5 : orizzonte === '5-10' ? 10 : 20
        const maxValue = proiezioni[proiezioni.length - 1]?.aggressivo || importo * 2
        const chartHeight = 180

        return (
          <div className="text-center">
            <h3 className="font-heading text-2xl md:text-3xl text-forest mb-2">
              Proiezione del tuo patrimonio
            </h3>
            <p className="text-gray-500 mb-6">Ecco come potrebbe crescere il tuo investimento in {anni} anni</p>

            {/* Chart */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <svg viewBox={`0 0 320 ${chartHeight + 40}`} className="w-full" preserveAspectRatio="xMidYMid meet">
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
                  <line
                    key={pct}
                    x1="40"
                    y1={chartHeight - pct * chartHeight + 10}
                    x2="310"
                    y2={chartHeight - pct * chartHeight + 10}
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                ))}

                {/* Aggressivo line */}
                <polyline
                  fill="none"
                  stroke={PROFILI.aggressivo.color}
                  strokeWidth="2.5"
                  points={proiezioni.map((p, i) => {
                    const x = 40 + (i / anni) * 270
                    const y = chartHeight - ((p.aggressivo - importo) / (maxValue - importo)) * chartHeight + 10
                    return `${x},${Math.max(10, y)}`
                  }).join(' ')}
                />

                {/* Moderato line */}
                <polyline
                  fill="none"
                  stroke={PROFILI.moderato.color}
                  strokeWidth="2.5"
                  points={proiezioni.map((p, i) => {
                    const x = 40 + (i / anni) * 270
                    const y = chartHeight - ((p.moderato - importo) / (maxValue - importo)) * chartHeight + 10
                    return `${x},${Math.max(10, y)}`
                  }).join(' ')}
                />

                {/* Conservativo line */}
                <polyline
                  fill="none"
                  stroke={PROFILI.conservativo.color}
                  strokeWidth="2.5"
                  points={proiezioni.map((p, i) => {
                    const x = 40 + (i / anni) * 270
                    const y = chartHeight - ((p.conservativo - importo) / (maxValue - importo)) * chartHeight + 10
                    return `${x},${Math.max(10, y)}`
                  }).join(' ')}
                />

                {/* X axis labels */}
                <text x="40" y={chartHeight + 30} fontSize="10" fill="#9ca3af" textAnchor="middle">0</text>
                <text x="175" y={chartHeight + 30} fontSize="10" fill="#9ca3af" textAnchor="middle">{Math.round(anni/2)} anni</text>
                <text x="310" y={chartHeight + 30} fontSize="10" fill="#9ca3af" textAnchor="middle">{anni} anni</text>

                {/* Y axis labels */}
                <text x="35" y="15" fontSize="9" fill="#9ca3af" textAnchor="end">{formatCurrency(maxValue)}</text>
                <text x="35" y={chartHeight + 10} fontSize="9" fill="#9ca3af" textAnchor="end">{formatCurrency(importo)}</text>
              </svg>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-6 mb-6 text-sm">
              {Object.entries(PROFILI).map(([key, value]) => {
                const finalValue = proiezioni[proiezioni.length - 1]?.[key as keyof typeof proiezioni[0]] || 0
                return (
                  <div key={key} className="text-center">
                    <div className="flex items-center gap-2 justify-center mb-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: value.color }} />
                      <span className="text-gray-600">{value.label}</span>
                    </div>
                    <div className="font-heading text-forest">{formatCurrency(finalValue as number)}</div>
                  </div>
                )
              })}
            </div>

            {importo >= MIN_PATRIMONIO_PARTNER && (
              <div className="bg-green-50 rounded-lg p-4 text-sm text-green-700">
                <span className="font-semibold">Match perfetto!</span> Il tuo profilo è ideale per i nostri partner svizzeri specializzati in obbligazioni corporate ad alto rendimento.
              </div>
            )}
          </div>
        )

      case 'contatto':
        return (
          <div className="text-center">
            <h3 className="font-heading text-2xl md:text-3xl text-forest mb-2">
              Lasciaci i tuoi dati
            </h3>
            <p className="text-gray-500 mb-8">Ti invieremo un report personalizzato gratuito</p>

            <div className="max-w-sm mx-auto space-y-4">
              <div>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome e cognome"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-forest focus:outline-none text-forest placeholder:text-gray-400"
                  autoComplete="name"
                />
              </div>
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-forest focus:outline-none text-forest placeholder:text-gray-400"
                  autoComplete="email"
                />
              </div>
              <div>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Telefono (opzionale)"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-forest focus:outline-none text-forest placeholder:text-gray-400"
                  autoComplete="tel"
                />
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              I tuoi dati sono al sicuro. Non li condivideremo mai con terzi.
            </p>
          </div>
        )
    }
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="min-h-[450px] flex flex-col">
      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-forest transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step indicator */}
      <div className="flex justify-center gap-2 mb-8">
        {['importo', 'orizzonte', 'obiettivo', 'proiezione', 'contatto'].map((step, i) => (
          <div
            key={step}
            className={`w-2 h-2 rounded-full transition-colors ${
              i <= stepIndex ? 'bg-forest' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="flex-1">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={goBack}
          disabled={currentStep === 'importo'}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            currentStep === 'importo'
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
          {stepIndex + 1} / {TOTAL_STEPS}
        </div>

        {currentStep === 'contatto' ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!nome || !email}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              nome && email
                ? 'bg-forest text-white hover:bg-green-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Invia richiesta
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : currentStep !== 'orizzonte' && currentStep !== 'obiettivo' ? (
          <button
            type="button"
            onClick={goNext}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-forest text-white hover:bg-green-600 transition-all"
          >
            Continua
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <div className="w-24" /> // Spacer for alignment
        )}
      </div>
    </div>
  )
}
