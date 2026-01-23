import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simulatore Holding Familiare | Guida Patrimonio',
  description: 'Calcola il risparmio fiscale di una holding: confronta tassazione PEX vs persona fisica. Ottimizzazione patrimonio per HNWI e imprenditori.',
  keywords: ['holding familiare', 'PEX', 'participation exemption', 'ottimizzazione fiscale', 'HNWI', 'gestione patrimonio', 'risparmio fiscale', 'consulenza patrimoniale'],
  openGraph: {
    title: 'Simulatore Holding Familiare - Risparmio Fiscale',
    description: 'Confronta tassazione persona fisica vs holding con PEX. Calcola il risparmio fiscale per dividendi e plusvalenze.',
    type: 'website',
  },
}

export default function HoldingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
