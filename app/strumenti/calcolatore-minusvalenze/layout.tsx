import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore Minusvalenze e Zainetto | Guida Patrimonio',
  description: 'Gestisci le minusvalenze e lo zainetto fiscale: compensazioni, scadenze, ottimizzazione. Strumento per HNWI e consulenti.',
  keywords: ['minusvalenze', 'zainetto fiscale', 'compensazione plusvalenze', 'tax loss harvesting', 'HNWI', 'ottimizzazione fiscale', 'capital gain Italia', 'risparmio fiscale'],
  openGraph: {
    title: 'Calcolatore Minusvalenze - Zainetto Fiscale',
    description: 'Gestisci le minusvalenze e calcola le compensazioni. Ottimizza lo zainetto fiscale.',
    type: 'website',
  },
}

export default function CalcolatoreMinusvalenzeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
