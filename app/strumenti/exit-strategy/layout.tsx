import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simulatore Exit Strategy Azienda | Guida Patrimonio',
  description: 'Pianifica la exit strategy aziendale: trade sale, MBO, IPO, passaggio generazionale. Simulatore fiscale per imprenditori e HNWI.',
  keywords: ['exit strategy', 'vendita azienda', 'MBO', 'trade sale', 'passaggio generazionale', 'plusvalenza cessione', 'holding PEX', 'HNWI', 'imprenditori'],
  openGraph: {
    title: 'Exit Strategy Azienda - Simulatore Fiscale',
    description: 'Confronta opzioni di exit: trade sale, MBO, family succession. Calcola tassazione e ottimizza con holding.',
    type: 'website',
  },
}

export default function ExitStrategyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
