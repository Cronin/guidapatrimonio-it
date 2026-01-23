import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aste Immobiliari Luxury Italia | Guida Patrimonio',
  description: 'Opportunita aste giudiziarie immobili di pregio: ville, attici, immobili storici. Guida per investitori HNWI e family office.',
  keywords: ['aste immobiliari luxury', 'aste giudiziarie', 'immobili pregio', 'ville asta', 'investimento immobiliare', 'HNWI', 'real estate', 'occasioni immobiliari'],
  openGraph: {
    title: 'Aste Immobiliari Luxury Italia',
    description: 'Scopri opportunita nelle aste giudiziarie: immobili di pregio a prezzi vantaggiosi.',
    type: 'website',
  },
}

export default function AsteImmobiliariLuxuryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
