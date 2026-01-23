import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore Prestito Personale | Guida Patrimonio',
  description: 'Calcola la rata del prestito personale: TAN, TAEG, piano di ammortamento. Confronta offerte e scegli la migliore.',
  keywords: ['calcolo rata prestito', 'prestito personale', 'TAN TAEG', 'piano ammortamento', 'finanziamento', 'confronto prestiti'],
  openGraph: {
    title: 'Calcolatore Prestito Personale',
    description: 'Simula rata e costo totale del prestito. Confronta TAN e TAEG per scegliere l offerta migliore.',
    type: 'website',
  },
}

export default function PrestitoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
