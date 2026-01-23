import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore Stipendio Netto | Guida Patrimonio',
  description: 'Calcola lo stipendio netto da lordo: IRPEF, contributi INPS, addizionali. Strumento preciso per dipendenti e manager.',
  keywords: ['stipendio netto', 'calcolo netto lordo', 'IRPEF', 'contributi INPS', 'busta paga', 'tassazione lavoro', 'RAL netto'],
  openGraph: {
    title: 'Calcolatore Stipendio Netto da Lordo',
    description: 'Da RAL a netto mensile: calcola IRPEF, contributi, addizionali regionali e comunali.',
    type: 'website',
  },
}

export default function StipendioNettoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
