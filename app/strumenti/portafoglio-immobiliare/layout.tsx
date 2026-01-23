import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analizzatore Portafoglio Immobiliare | Guida Patrimonio',
  description: 'Analizza il tuo portafoglio immobiliare: rendimento netto, fiscalita, cedolare secca vs IRPEF. Per investitori immobiliari e HNWI.',
  keywords: ['portafoglio immobiliare', 'rendimento affitti', 'cedolare secca', 'investimenti immobiliari', 'HNWI', 'IMU', 'fiscalita immobiliare', 'real estate'],
  openGraph: {
    title: 'Analizzatore Portafoglio Immobiliare',
    description: 'Calcola il rendimento netto dei tuoi immobili: affitti, fiscalita, IMU, mutui. Confronta regimi fiscali.',
    type: 'website',
  },
}

export default function PortafoglioImmobiliareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
