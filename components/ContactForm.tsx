'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefono: '',
    patrimonio: '',
    messaggio: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      // Per ora salviamo in localStorage come backup e mostriamo successo
      // In produzione collegare a Mailgun/email service
      const submissions = JSON.parse(localStorage.getItem('contact_submissions') || '[]')
      submissions.push({
        ...formData,
        timestamp: new Date().toISOString(),
      })
      localStorage.setItem('contact_submissions', JSON.stringify(submissions))

      setStatus('success')
      setFormData({ nome: '', email: '', telefono: '', patrimonio: '', messaggio: '' })
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

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-card p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-heading text-xl text-forest mb-2">Richiesta Inviata!</h3>
        <p className="text-gray-600 mb-4">
          Ti contatteremo entro 24 ore per fissare un appuntamento.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-green-600 font-medium hover:underline"
        >
          Invia un&apos;altra richiesta
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">
            Nome e Cognome *
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            required
            value={formData.nome}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none transition-all"
            placeholder="Mario Rossi"
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

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
            Telefono
          </label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none transition-all"
            placeholder="+39 333 1234567"
          />
        </div>
        <div>
          <label htmlFor="patrimonio" className="block text-sm font-medium text-gray-700 mb-1">
            Patrimonio da gestire
          </label>
          <select
            id="patrimonio"
            name="patrimonio"
            value={formData.patrimonio}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none transition-all bg-white"
          >
            <option value="">Seleziona...</option>
            <option value="50-100k">50.000 - 100.000 EUR</option>
            <option value="100-250k">100.000 - 250.000 EUR</option>
            <option value="250-500k">250.000 - 500.000 EUR</option>
            <option value="500k-1m">500.000 - 1.000.000 EUR</option>
            <option value="1m+">Oltre 1.000.000 EUR</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="messaggio" className="block text-sm font-medium text-gray-700 mb-1">
          Come possiamo aiutarti?
        </label>
        <textarea
          id="messaggio"
          name="messaggio"
          rows={4}
          value={formData.messaggio}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-400/20 outline-none transition-all resize-none"
          placeholder="Descrivi brevemente la tua situazione e i tuoi obiettivi..."
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
          'Richiedi Consulenza Gratuita'
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        I tuoi dati sono al sicuro. Non condivideremo mai le tue informazioni con terzi.
      </p>

      {status === 'error' && (
        <p className="text-red-500 text-sm text-center">
          Si è verificato un errore. Riprova o contattaci direttamente.
        </p>
      )}
    </form>
  )
}
