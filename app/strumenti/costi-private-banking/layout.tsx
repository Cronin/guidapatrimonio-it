import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analizzatore Costi Private Banking | Guida Patrimonio',
  description: 'Scopri il vero costo del private banking: TER, commissioni nascoste, performance drag. Confronta con consulenza indipendente e DIY.',
  keywords: ['costi private banking', 'commissioni gestione', 'TER fondi', 'consulenza indipendente', 'fee only', 'HNWI', 'risparmio commissioni', 'wealth management'],
  openGraph: {
    title: 'Costi Private Banking - Quanto Stai Pagando?',
    description: 'Analizza il costo reale della gestione patrimoniale: fee nascoste, impatto sul rendimento, alternative.',
    type: 'website',
  },
}

export default function CostiPrivateBankingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
