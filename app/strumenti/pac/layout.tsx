import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simulatore PAC - Piano Accumulo | Guida Patrimonio',
  description: 'Simula un Piano di Accumulo Capitale: versamenti periodici, interesse composto, confronto scenari. Dollar cost averaging spiegato.',
  keywords: ['PAC', 'piano accumulo capitale', 'dollar cost averaging', 'investimento periodico', 'ETF PAC', 'interesse composto', 'risparmio investito'],
  openGraph: {
    title: 'Simulatore PAC - Piano Accumulo Capitale',
    description: 'Calcola la crescita del tuo PAC: versamenti mensili, rendimento atteso, capitale finale.',
    type: 'website',
  },
}

export default function PacLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
