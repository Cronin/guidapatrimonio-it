import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analizzatore Costi Fondi e ETF | Guida Patrimonio',
  description: 'Calcola TER e commissioni nascoste di fondi ed ETF. Scopri l impatto sul rendimento. Strumento per HNWI e consulenti patrimoniali.',
  keywords: ['TER', 'costi fondi', 'commissioni ETF', 'analisi costi investimento', 'HNWI', 'gestione patrimonio', 'risparmio commissioni', 'wealth management'],
  openGraph: {
    title: 'Analizzatore Costi Fondi - TER e Commissioni',
    description: 'Scopri quanto ti costano davvero fondi ed ETF. Calcola l impatto delle commissioni sui rendimenti.',
    type: 'website',
  },
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
