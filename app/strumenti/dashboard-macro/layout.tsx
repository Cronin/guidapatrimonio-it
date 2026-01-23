import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard Macroeconomia Italia | Guida Patrimonio',
  description: 'Indicatori macro Italia in tempo reale: spread BTP-Bund, tassi BCE, inflazione, FTSE MIB. Dati essenziali per gestione patrimonio HNWI.',
  keywords: ['macroeconomia Italia', 'spread BTP Bund', 'tassi BCE', 'inflazione Italia', 'FTSE MIB', 'indicatori economici', 'gestione patrimonio', 'HNWI'],
  openGraph: {
    title: 'Dashboard Macro Italia - Dati in Tempo Reale',
    description: 'Monitor macroeconomico Italia: spread, tassi, inflazione, borsa. Indicatori chiave per decisioni di investimento.',
    type: 'website',
  },
}

export default function DashboardMacroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
