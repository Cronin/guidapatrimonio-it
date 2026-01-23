import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mercato Immobiliare Luxury Italia 2026 | Guida Patrimonio',
  description: 'Prezzi e trend immobili di lusso Italia: Milano, Roma, Portofino, Como. Dashboard per investitori HNWI e family office.',
  keywords: ['immobiliare lusso Italia', 'prezzi case lusso Milano', 'immobili pregio', 'ville lago Como', 'HNWI', 'real estate luxury', 'investimenti immobiliari', 'family office'],
  openGraph: {
    title: 'Mercato Immobiliare Luxury Italia 2026',
    description: 'Dashboard prezzi e trend zone premium: Milano, Roma, Portofino, Como, Cortina. Per investitori HNWI.',
    type: 'website',
    locale: 'it_IT',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
