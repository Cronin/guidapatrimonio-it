import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore Mutuo Casa | Guida Patrimonio',
  description: 'Calcola la rata del mutuo: fisso vs variabile, piano ammortamento, TAEG. Strumento per acquisto prima casa e investimento.',
  keywords: ['calcolatore mutuo', 'rata mutuo', 'mutuo fisso variabile', 'piano ammortamento', 'TAEG mutuo', 'acquisto casa', 'finanziamento immobiliare'],
  openGraph: {
    title: 'Calcolatore Mutuo Casa',
    description: 'Simula la rata del mutuo e il piano di ammortamento. Confronta tasso fisso e variabile.',
    type: 'website',
  },
}

export default function MutuoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
