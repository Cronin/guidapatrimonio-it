'use client'

import { useEffect, useCallback } from 'react'

interface ConsultationPopupProps {
  isOpen: boolean
  amount: number
  onClose: () => void
}

const POPUP_SESSION_KEY = 'guidapatrimonio_consultation_popup_shown'

export default function ConsultationPopup({ isOpen, amount, onClose }: ConsultationPopupProps) {
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }, [onClose])

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  // Mark popup as shown in session
  useEffect(() => {
    if (isOpen) {
      sessionStorage.setItem(POPUP_SESSION_KEY, 'true')
    }
  }, [isOpen])

  const handleConsultation = () => {
    onClose()
    // Smooth scroll to contact section
    const contactSection = document.getElementById('contatti')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      // If on tool page, redirect to home with hash
      window.location.href = '/#contatti'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-8 animate-fade-in-up border-2 border-green-400">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Chiudi"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>

        {/* Content */}
        <div className="text-center">
          <h3 className="font-heading text-2xl text-forest mb-3">
            Il tuo profilo è perfetto per una consulenza personalizzata
          </h3>
          <p className="text-gray-600 mb-6">
            Con un patrimonio di <span className="font-semibold text-green-600">{formatCurrency(amount)}</span>,
            potresti beneficiare dei servizi esclusivi dei nostri partner svizzeri.
          </p>

          {/* Benefits */}
          <div className="bg-green-50 rounded-lg p-4 mb-6 text-left">
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Partner con sede a Ginevra, Svizzera</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Regolamentazione CSSF</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Rendita passiva da cedole obbligazionarie corporate</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleConsultation}
              className="w-full bg-green-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Richiedi Consulenza Gratuita
            </button>
            <button
              onClick={onClose}
              className="w-full text-gray-500 font-medium py-3 px-6 hover:text-gray-700 transition-colors"
            >
              Continua a usare il tool
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook to manage popup state
export function useConsultationPopup() {
  const checkShouldShowPopup = () => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem(POPUP_SESSION_KEY) !== 'true'
  }

  return {
    shouldShowPopup: checkShouldShowPopup,
    THRESHOLD: 100000,
  }
}
