'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 h-navbar">
      <div className="container-custom h-full flex items-center justify-between">
        {/* Logo - Clean balanced design */}
        <Link href="/" className="flex items-center">
          <span className="text-white text-xl tracking-wide">
            <span className="font-heading font-semibold">Guida</span>
            <span className="font-heading font-normal">Patrimonio</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="#chi-siamo" className="text-white text-body font-normal hover:opacity-80 transition-opacity">
            Chi Siamo
          </Link>
          <Link href="#servizi" className="text-white text-body font-normal hover:opacity-80 transition-opacity">
            Servizi
          </Link>
          <Link href="#come-lavoriamo" className="text-white text-body font-normal hover:opacity-80 transition-opacity">
            Come Lavoriamo
          </Link>
          <Link href="#risorse" className="text-white text-body font-normal hover:opacity-80 transition-opacity">
            Risorse
          </Link>
          <Link href="#contatti" className="text-white text-body font-normal hover:opacity-80 transition-opacity flex items-center gap-1">
            Contattaci
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-forest/95 backdrop-blur-md">
          <div className="container-custom py-6 flex flex-col gap-4">
            <Link href="#chi-siamo" className="text-white text-body-md py-2" onClick={() => setIsOpen(false)}>
              Chi Siamo
            </Link>
            <Link href="#servizi" className="text-white text-body-md py-2" onClick={() => setIsOpen(false)}>
              Servizi
            </Link>
            <Link href="#come-lavoriamo" className="text-white text-body-md py-2" onClick={() => setIsOpen(false)}>
              Come Lavoriamo
            </Link>
            <Link href="#risorse" className="text-white text-body-md py-2" onClick={() => setIsOpen(false)}>
              Risorse
            </Link>
            <Link href="#contatti" className="text-white text-body-md py-2 flex items-center gap-1" onClick={() => setIsOpen(false)}>
              Contattaci
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
