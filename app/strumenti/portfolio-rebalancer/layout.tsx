import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio Rebalancer - Ribilanciamento | Guida Patrimonio',
  description: 'Ribilancia il tuo portafoglio: calcola gli aggiustamenti per tornare all asset allocation target. Strumento per gestione attiva.',
  keywords: ['ribilanciamento portafoglio', 'portfolio rebalancing', 'asset allocation', 'gestione portafoglio', 'HNWI', 'wealth management', 'diversificazione'],
  openGraph: {
    title: 'Portfolio Rebalancer - Mantieni l Allocazione',
    description: 'Calcola come ribilanciare il portafoglio per tornare all asset allocation obiettivo.',
    type: 'website',
  },
}

export default function PortfolioRebalancerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
