import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore Tasso Prelievo Sicuro | Guida Patrimonio',
  description: 'Calcola il tasso di prelievo sostenibile dal patrimonio: regola del 4%, sequence of returns risk. Per HNWI in pensione anticipata o FIRE.',
  keywords: ['tasso prelievo sicuro', 'safe withdrawal rate', 'regola 4%', 'FIRE', 'pensione anticipata', 'HNWI', 'rendita patrimonio', 'decumulo'],
  openGraph: {
    title: 'Tasso Prelievo Sicuro - Quanto Puoi Spendere?',
    description: 'Calcola quanto puoi prelevare annualmente senza esaurire il patrimonio. Analisi rischio sequenza rendimenti.',
    type: 'website',
  },
}

export default function TassoPrelievoSicuroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
