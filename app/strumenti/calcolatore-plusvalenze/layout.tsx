import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore Plusvalenze Azioni ETF | Guida Patrimonio',
  description: 'Calcola le plusvalenze su azioni, ETF, obbligazioni. Aliquote 26% e 12.5%, regime amministrato vs dichiarativo. Per HNWI e investitori.',
  keywords: ['plusvalenze', 'capital gain Italia', 'tassazione ETF', 'tasse azioni', 'HNWI', 'aliquota 26%', 'BTP 12.5%', 'ottimizzazione fiscale'],
  openGraph: {
    title: 'Calcolatore Plusvalenze - Capital Gain Italia',
    description: 'Calcola le plusvalenze su azioni, ETF, BTP. Aliquote 26% e 12.5%, regime amministrato e dichiarativo.',
    type: 'website',
  },
}

export default function CalcolatorePlusvalenzeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
