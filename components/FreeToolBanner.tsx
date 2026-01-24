'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function FreeToolBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if already subscribed or dismissed
    const stored = localStorage.getItem('guidapatrimonio_subscribed')
    if (stored) {
      setSubscribed(true)
    }
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || loading) return

    setLoading(true)

    // For now just save locally - can integrate with email service later
    localStorage.setItem('guidapatrimonio_subscribed', 'true')
    localStorage.setItem('guidapatrimonio_email', email)

    setSubscribed(true)
    setLoading(false)
  }

  if (dismissed || subscribed) return null

  return (
    <div className="bg-gradient-to-r from-amber-50 to-amber-100 border-b border-amber-200">
      <div className="container-custom py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="bg-green-600 text-white px-2 py-0.5 rounded text-xs font-semibold">
              GRATIS
            </span>
            <p className="text-gray-700">
              <span className="hidden sm:inline">Questo strumento e </span>
              <strong>offerto gratuitamente</strong> a Gennaio 2026.
              <span className="hidden md:inline"> Iscriviti per accesso illimitato.</span>
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              placeholder="La tua email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-3 py-1.5 text-sm border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest/50 w-48"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-forest text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
            >
              Iscriviti gratis
            </button>
          </form>

          <button
            onClick={() => setDismissed(true)}
            className="absolute right-4 top-3 sm:relative sm:right-auto sm:top-auto text-gray-400 hover:text-gray-600"
            aria-label="Chiudi"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
