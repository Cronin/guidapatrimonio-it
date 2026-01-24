import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore Plusvalenze Azioni ETF BTP Gratis | Alternativa a TasseTrading',
  description: 'Calcolatore plusvalenze gratuito: calcola tasse su azioni, ETF, BTP, crypto con FIFO automatico. Import CSV da Directa, Fineco, Degiro. Export PDF. Alternativa gratis a TasseTrading.',
  keywords: [
    'calcolatore plusvalenze',
    'calcolo plusvalenze azioni',
    'tasse ETF Italia',
    'capital gain calculator',
    'TasseTrading alternativa gratis',
    'FIFO calcolo',
    'tassazione investimenti',
    'aliquota 26%',
    'BTP 12.5%',
    'regime amministrato dichiarativo',
    'quadro RT',
    'import CSV broker',
    'Directa Fineco Degiro',
  ],
  openGraph: {
    title: 'Calcolatore Plusvalenze Professionale e Gratuito',
    description: 'Calcola le plusvalenze su azioni, ETF, BTP, crypto. FIFO automatico, import CSV, export PDF. Alternativa gratuita a TasseTrading.',
    type: 'website',
    images: [
      {
        url: '/og/calcolatore-plusvalenze.png',
        width: 1200,
        height: 630,
        alt: 'Calcolatore Plusvalenze - GuidaPatrimonio.it',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calcolatore Plusvalenze Gratis - Alternativa a TasseTrading',
    description: 'Calcola tasse su azioni, ETF, BTP con precisione fiscale italiana. FIFO automatico, import da tutti i broker.',
  },
  alternates: {
    canonical: 'https://guidapatrimonio.it/strumenti/calcolatore-plusvalenze',
  },
}

export default function CalcolatorePlusvalenzeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
