import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Budget Planner - Pianificatore Spese | Guida Patrimonio',
  description: 'Pianifica il budget familiare: entrate, uscite, risparmio. Base per costruire un patrimonio solido.',
  keywords: ['budget', 'pianificazione spese', 'budget familiare', 'risparmio', 'gestione denaro', 'finanza personale', 'controllo spese'],
  openGraph: {
    title: 'Budget Planner - Controlla le Spese',
    description: 'Organizza entrate e uscite per massimizzare il risparmio. Il primo passo verso la ricchezza.',
    type: 'website',
  },
}

export default function BudgetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
