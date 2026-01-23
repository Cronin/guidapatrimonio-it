import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mercato Immobiliare di Lusso Italia 2026 | Prezzi e Trend | Guida Patrimonio',
  description: 'Tracker prezzi immobili di lusso in Italia: Milano, Roma, Portofino, Como, Cortina. Prezzi al mq, trend di mercato e analisi delle zone premium.',
  keywords: 'immobiliare lusso italia, prezzi case lusso milano, immobili pregio portofino, ville lago como, appartamenti lusso roma, cortina immobiliare',
  openGraph: {
    title: 'Mercato Immobiliare di Lusso Italia 2026',
    description: 'Prezzi al metro quadro e trend nelle zone premium italiane: Milano, Roma, Portofino, Como, Cortina e altre destinazioni esclusive.',
    type: 'website',
    locale: 'it_IT',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
