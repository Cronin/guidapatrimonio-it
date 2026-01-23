import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Confronto Private Banking Italia 2026 | Guida Patrimonio',
  description: 'Confronta le migliori private bank italiane e svizzere: soglie, commissioni, servizi. Guida per HNWI con patrimonio 500k+.',
  keywords: ['private banking Italia', 'confronto private bank', 'HNWI', 'wealth management', 'Mediobanca', 'UBS Italia', 'Pictet', 'Banca Generali', 'gestione patrimonio'],
  openGraph: {
    title: 'Confronto Private Banking Italia 2026',
    description: 'Confronta private bank italiane e svizzere: fee, soglie, servizi. Trova la soluzione giusta per HNWI.',
    type: 'article',
    locale: 'it_IT',
    url: 'https://guidapatrimonio.it/strumenti/confronto-private-banking',
    siteName: 'Guida Patrimonio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Confronto Private Banking Italia 2026',
    description: 'Confronta le migliori private bank per HNWI: soglie, commissioni, servizi.',
  },
  alternates: {
    canonical: 'https://guidapatrimonio.it/strumenti/confronto-private-banking',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
