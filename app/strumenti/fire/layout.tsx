import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore FIRE - Pensione Anticipata | Guida Patrimonio',
  description: 'Calcola quando potrai raggiungere FIRE: Financial Independence Retire Early. Simulatore per indipendenza finanziaria e pensione anticipata.',
  keywords: ['FIRE', 'indipendenza finanziaria', 'pensione anticipata', 'financial independence', 'retire early', 'tasso risparmio', 'HNWI', 'liberta finanziaria'],
  openGraph: {
    title: 'Calcolatore FIRE - Quando Sarai Libero?',
    description: 'Calcola gli anni per raggiungere l indipendenza finanziaria. Simulatore FIRE personalizzato.',
    type: 'website',
  },
}

export default function FireLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
