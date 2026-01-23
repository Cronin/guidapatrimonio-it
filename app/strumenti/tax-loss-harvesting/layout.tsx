import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simulatore Tax Loss Harvesting | Guida Patrimonio',
  description: 'Ottimizza le minusvalenze fiscali: tax loss harvesting, compensazione plusvalenze, zainetto fiscale. Strategia per HNWI e investitori.',
  keywords: ['tax loss harvesting', 'minusvalenze', 'compensazione plusvalenze', 'zainetto fiscale', 'ottimizzazione fiscale', 'HNWI', 'capital gain', 'risparmio fiscale'],
  openGraph: {
    title: 'Tax Loss Harvesting - Ottimizza le Minusvalenze',
    description: 'Sfrutta le perdite per ridurre le tasse sulle plusvalenze. Strategia di ottimizzazione fiscale.',
    type: 'website',
  },
}

export default function TaxLossHarvestingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
