import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore Rendita Immobiliare | Guida Patrimonio',
  description: 'Calcola il rendimento netto degli immobili a reddito: affitti, spese, fiscalita, cedolare secca. Analisi per investitori immobiliari.',
  keywords: ['rendita immobiliare', 'rendimento affitti', 'cedolare secca', 'investimento immobiliare', 'rendimento netto', 'HNWI', 'real estate income', 'fiscalita immobiliare'],
  openGraph: {
    title: 'Calcolatore Rendita Immobiliare',
    description: 'Calcola il rendimento netto dei tuoi immobili a reddito. Confronta regimi fiscali.',
    type: 'website',
  },
}

export default function RenditaImmobiliareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
