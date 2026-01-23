import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simulatore Family Office | Guida Patrimonio',
  description: 'Calcola se ti conviene un family office: single vs multi family office vs private banking. Analisi costi e servizi per patrimoni HNWI.',
  keywords: ['family office', 'single family office', 'multi family office', 'private banking', 'HNWI', 'gestione patrimonio', 'wealth management', 'consulenza patrimoniale'],
  openGraph: {
    title: 'Family Office: Quando Conviene?',
    description: 'Confronta i costi di Private Banking, Multi-Family Office e Single Family Office. Scopri la soluzione giusta per il tuo patrimonio.',
    type: 'website',
  },
}

export default function FamilyOfficeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
