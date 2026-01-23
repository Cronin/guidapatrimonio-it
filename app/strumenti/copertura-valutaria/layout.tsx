import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore Copertura Valutaria | Guida Patrimonio',
  description: 'Calcola il costo della copertura valutaria: hedging EUR/USD, EUR/CHF. Analisi rischio cambio per portafogli internazionali HNWI.',
  keywords: ['copertura valutaria', 'currency hedging', 'rischio cambio', 'EUR USD', 'EUR CHF', 'portafoglio internazionale', 'HNWI', 'diversificazione valutaria'],
  openGraph: {
    title: 'Calcolatore Copertura Valutaria',
    description: 'Analizza il rischio cambio e il costo della copertura. Per portafogli con esposizione valutaria.',
    type: 'website',
  },
}

export default function CoperturaValutariaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
