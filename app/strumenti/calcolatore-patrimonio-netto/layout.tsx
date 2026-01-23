import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore Patrimonio Netto Avanzato | Guida Patrimonio',
  description: 'Calcola il tuo patrimonio netto: asset allocation, benchmark HNWI Italia, proiezioni crescita. Strumento completo per pianificazione patrimoniale.',
  keywords: ['patrimonio netto', 'calcolo patrimonio', 'asset allocation', 'HNWI', 'benchmark patrimonio', 'gestione patrimonio', 'consulenza patrimoniale', 'wealth planning'],
  openGraph: {
    title: 'Calcolatore Patrimonio Netto - Analisi Completa',
    description: 'Analizza il tuo patrimonio: breakdown per categoria, confronto benchmark italiani, proiezioni di crescita.',
    type: 'website',
  },
}

export default function CalcolatorePatrimonioNettoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
