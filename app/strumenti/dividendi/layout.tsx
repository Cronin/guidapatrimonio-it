import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portafoglio Dividendi - Income Strategy | Guida Patrimonio',
  description: 'Costruisci un portafoglio da dividendi: azioni high yield, aristocratici del dividendo, tassazione. Strategia income per HNWI.',
  keywords: ['dividendi', 'income investing', 'dividend aristocrats', 'high yield stocks', 'reddito passivo', 'HNWI', 'portafoglio dividendi', 'tassazione dividendi'],
  openGraph: {
    title: 'Portafoglio Dividendi - Reddito Passivo',
    description: 'Costruisci un portafoglio che genera reddito da dividendi. Selezione titoli e tassazione.',
    type: 'website',
  },
}

export default function DividendiLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
