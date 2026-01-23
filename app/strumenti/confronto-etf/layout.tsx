import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Confronto ETF - Strumenti a Basso Costo | Guida Patrimonio',
  description: 'Confronta ETF: TER, tracking difference, liquidita, fiscalita. Scegli i migliori ETF per costruire un portafoglio efficiente.',
  keywords: ['confronto ETF', 'migliori ETF', 'TER ETF', 'ETF azionari', 'ETF obbligazionari', 'portafoglio ETF', 'investimento passivo', 'costi ETF'],
  openGraph: {
    title: 'Confronto ETF - Scegli i Migliori',
    description: 'Confronta ETF per costi, tracking e liquidita. Costruisci un portafoglio efficiente.',
    type: 'website',
  },
}

export default function ConfrontoEtfLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
