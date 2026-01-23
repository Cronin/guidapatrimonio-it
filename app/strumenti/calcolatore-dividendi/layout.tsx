import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore Rendimento Dividendi | Guida Patrimonio',
  description: 'Calcola il rendimento da dividendi: dividend yield, crescita dividendi, tassazione 26%. Pianifica una strategia income per il patrimonio.',
  keywords: ['dividendi', 'dividend yield', 'rendimento dividendi', 'azioni dividendo', 'tassazione dividendi', 'income investing', 'HNWI', 'reddito passivo'],
  openGraph: {
    title: 'Calcolatore Rendimento Dividendi',
    description: 'Simula il reddito da dividendi: yield, tassazione, reinvestimento. Strategia income investing.',
    type: 'website',
  },
}

export default function CalcolatoreDividendiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
