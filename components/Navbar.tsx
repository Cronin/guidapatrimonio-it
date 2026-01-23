'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="absolute top-0 left-0 right-0 z-50 h-navbar">
      <div className="container-custom h-full flex items-center justify-between">
        {/* Logo - Icon + Text */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo-white.png"
            alt="Guida Patrimonio"
            width={40}
            height={40}
            className="w-10 h-10"
          />
          <span className="text-white text-2xl">
            <span className="font-heading font-medium">Guida</span>
            <span className="font-heading font-semibold">Patrimonio</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/#chi-siamo" className="text-white text-body font-normal hover:opacity-80 transition-opacity">
            Chi Siamo
          </Link>
          <Link href="/strumenti" className="text-white text-body font-normal hover:opacity-80 transition-opacity">
            Strumenti
          </Link>
          <Link href="/blog" className="text-white text-body font-normal hover:opacity-80 transition-opacity">
            Blog
          </Link>
          <Link href="/#contatti" className="text-white text-body font-medium hover:opacity-80 transition-opacity border-b border-white/40 hover:border-white pb-0.5">
            Contattaci
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
            <Link href="/#chi-siamo" className="text-white text-body-md py-2" onClick={() => setIsOpen(false)}>
              Chi Siamo
            </Link>
            <Link href="/strumenti" className="text-white text-body-md py-2" onClick={() => setIsOpen(false)}>
              Strumenti
            </Link>
            <Link href="/blog" className="text-white text-body-md py-2" onClick={() => setIsOpen(false)}>
              Blog
            </Link>
            <Link href="/#contatti" className="text-white text-body-md py-2 font-medium" onClick={() => setIsOpen(false)}>
              Contattaci
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
