import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore Interesse Composto | Guida Patrimonio',
  description: 'Calcola la potenza dell interesse composto: crescita capitale nel tempo, confronto scenari. La formula della ricchezza spiegata.',
  keywords: ['interesse composto', 'compound interest', 'crescita capitale', 'investimenti lungo termine', 'formula ricchezza', 'simulatore investimenti'],
  openGraph: {
    title: 'Calcolatore Interesse Composto',
    description: 'Scopri come cresce il tuo capitale con l interesse composto. Simulatore con versamenti periodici.',
    type: 'website',
  },
}

export default function InteresseCompostoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
