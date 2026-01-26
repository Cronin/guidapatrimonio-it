'use client'

import { useState, useEffect } from 'react'

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

export default function ContactForm() {
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

  // Effetto per simulare analisi del profilo
  useEffect(() => {
    if (status === 'analyzing') {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            // Dopo 3 secondi mostra success
            setTimeout(() => setStatus('success'), 500)
            return 100
          }
          return prev + 3
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [status])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        // Qualificato - mostra schermata analisi
        setLoadingProgress(0)
        setStatus('analyzing')
      } else {
        // Non qualificato
        setStatus('not-qualified')
      }
    } catch {
      setStatus('error')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const resetForm = () => {
    setFormData({ nome: '', cognome: '', email: '', telefono: '', patrimonio: '', messaggio: '' })
    setStatus('idle')
    setLoadingProgress(0)
  }

  // Schermata "Analisi in corso"
  if (status === 'analyzing') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-card p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 relative">
          {/* Cerchio animato */}
          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="#e5e7eb"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="40"
              cy="40"
              r="36"
              stroke="#40916C"
              strokeWidth="6"
              fill="none"
              strokeDasharray={`${loadingProgress * 2.26} 226`}
              strokeLinecap="round"
              className="transition-all duration-100"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold text-forest">{loadingProgress}%</span>
          </div>
        </div>
        <h3 className="font-heading text-xl text-forest mb-2">Analisi del tuo profilo in corso...</h3>
        <p className="text-gray-500 text-sm">
          Stiamo verificando la compatibilità con i nostri partner
        </p>
      </div>
    )
  }

  // Schermata "Matchato con successo"
  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-card p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-heading text-xl text-forest mb-3">Match Confermato!</h3>
        <p className="text-gray-600 mb-2">
          Sei stato matchato con successo.
        </p>
        <p className="text-gray-600 mb-6">
          <strong>Verrai contattato al più presto dal nostro partner con sede a Ginevra, Svizzera.</strong>
        </p>
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Risposta entro 24-48 ore lavorative
        </div>
        <button
          onClick={resetForm}
          className="text-forest font-medium hover:underline"
        >
          Invia un&apos;altra richiesta
        </button>
      </div>
    )
  }

  // Schermata "Non qualificato"
  if (status === 'not-qualified') {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-card p-8 text-center">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="font-heading text-xl text-forest mb-3">Grazie per l&apos;interesse!</h3>
        <p className="text-gray-600 mb-4">
          I servizi del nostro partner sono riservati a patrimoni superiori a <strong>€150.000</strong>.
        </p>
        <p className="text-gray-600 mb-6">
          Nel frattempo, puoi utilizzare gratuitamente tutti i nostri <a href="/strumenti" className="text-forest font-medium hover:underline">strumenti professionali</a> per la gestione patrimoniale.
        </p>
        <button
          onClick={resetForm}
          className="text-forest font-medium hover:underline"
        >
          Torna al form
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
            Nome *
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            required
            value={formData.nome}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none transition-all"
            placeholder="Mario"
          />
        </div>
        <div>
          <label htmlFor="cognome" className="block text-sm font-medium text-gray-700 mb-1">
            Cognome *
          </label>
          <input
            type="text"
            id="cognome"
            name="cognome"
            required
            value={formData.cognome}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none transition-all"
            placeholder="Rossi"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
            Telefono *
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            required
            value={formData.telefono}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none transition-all"
            placeholder="+39 333 1234567"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none transition-all"
            placeholder="mario@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="patrimonio" className="block text-sm font-medium text-gray-700 mb-1">
          Capitale da investire *
        </label>
        <select
          id="patrimonio"
          name="patrimonio"
          required
          value={formData.patrimonio}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none transition-all bg-white"
        >
          <option value="">Seleziona importo...</option>
          <option value="sotto-50k">Meno di €50.000</option>
          <option value="50-100k">€50.000 - €100.000</option>
          <option value="100-150k">€100.000 - €150.000</option>
          <option value="150-250k">€150.000 - €250.000</option>
          <option value="250-500k">€250.000 - €500.000</option>
          <option value="500k-1m">€500.000 - €1.000.000</option>
          <option value="1m+">Oltre €1.000.000</option>
        </select>
      </div>

      <div>
        <label htmlFor="messaggio" className="block text-sm font-medium text-gray-700 mb-1">
          Obiettivi di investimento (opzionale)
        </label>
        <textarea
          id="messaggio"
          name="messaggio"
          rows={3}
          value={formData.messaggio}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none transition-all resize-none"
          placeholder="Es: rendita passiva, pianificazione pensione, diversificazione..."
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Invio in corso...
          </span>
        ) : (
          'Richiedi Callback Gratuito'
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Inviando questo form acconsenti ad essere ricontattato. I tuoi dati sono protetti e non saranno condivisi.
      </p>

      {status === 'error' && (
        <p className="text-red-500 text-sm text-center">
          Si è verificato un errore. Riprova o contattaci via email.
        </p>
      )}
    </form>
  )
}
