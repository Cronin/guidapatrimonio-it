import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Confronto Private Banking Italia 2024 - Quale Scegliere? | Guida Patrimonio',
  description: 'Confronta le migliori private bank italiane e svizzere: Banca Generali, Mediobanca, UBS, Pictet, Fineco. Soglie di ingresso, commissioni, servizi e calcolatore costi.',
  keywords: 'private banking italia, confronto private bank, banca generali private, mediobanca private banking, ubs italia, pictet, lombard odier, fineco private banking, commissioni private banking, soglia minima private banking',
  openGraph: {
    title: 'Confronto Private Banking Italia 2024 - Quale Scegliere?',
    description: 'Confronta le migliori private bank italiane e svizzere: soglie di ingresso, commissioni, servizi. Calcolatore costi incluso.',
    type: 'article',
    locale: 'it_IT',
    url: 'https://guidapatrimonio.it/strumenti/confronto-private-banking',
    siteName: 'Guida Patrimonio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Confronto Private Banking Italia 2024',
    description: 'Confronta le migliori private bank: soglie, commissioni, servizi.',
  },
  alternates: {
    canonical: 'https://guidapatrimonio.it/strumenti/confronto-private-banking',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
