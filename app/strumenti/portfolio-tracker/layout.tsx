import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio Tracker - Monitora Investimenti | Guida Patrimonio',
  description: 'Traccia il tuo portafoglio investimenti: performance, allocazione, dividendi. Dashboard per monitoraggio patrimonio HNWI.',
  keywords: ['portfolio tracker', 'monitoraggio investimenti', 'performance portafoglio', 'allocazione asset', 'HNWI', 'wealth management', 'dividendi tracker'],
  openGraph: {
    title: 'Portfolio Tracker - Monitora il Portafoglio',
    description: 'Dashboard per tracciare performance, allocazione e dividendi del tuo portafoglio.',
    type: 'website',
  },
}

export default function PortfolioTrackerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
