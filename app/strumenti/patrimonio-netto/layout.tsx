import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore Patrimonio Netto | Guida Patrimonio',
  description: 'Calcola il tuo patrimonio netto: attivi meno passivi. Strumento semplice per conoscere la tua situazione patrimoniale complessiva.',
  keywords: ['patrimonio netto', 'calcolo attivi passivi', 'gestione patrimonio', 'finanza personale', 'HNWI', 'consulenza patrimoniale'],
  openGraph: {
    title: 'Calcolatore Patrimonio Netto',
    description: 'Calcola rapidamente il tuo patrimonio netto: somma attivi meno passivi.',
    type: 'website',
  },
}

export default function PatrimonioNettoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
