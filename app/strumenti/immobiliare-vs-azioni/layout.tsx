import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Immobiliare vs Azioni: Confronto | Guida Patrimonio',
  description: 'Confronta investimento immobiliare e azionario: rendimenti storici, rischi, fiscalita, liquidita. Guida per scelte di asset allocation.',
  keywords: ['immobiliare vs azioni', 'investimenti immobiliari', 'mercato azionario', 'asset allocation', 'rendimento immobiliare', 'HNWI', 'diversificazione patrimonio'],
  openGraph: {
    title: 'Immobiliare vs Azioni - Dove Investire?',
    description: 'Confronto tra investimento immobiliare e azionario: pro, contro, rendimenti, fiscalita.',
    type: 'website',
  },
}

export default function ImmobiliareVsAzioniLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
