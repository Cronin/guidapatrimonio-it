import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore TFR e Liquidazione | Guida Patrimonio',
  description: 'Calcola il TFR maturato e la tassazione separata. Confronta TFR in azienda vs fondo pensione. Simulatore liquidazione.',
  keywords: ['TFR', 'liquidazione', 'trattamento fine rapporto', 'tassazione TFR', 'fondo pensione TFR', 'calcolo TFR', 'previdenza complementare'],
  openGraph: {
    title: 'Calcolatore TFR e Liquidazione',
    description: 'Calcola il TFR lordo e netto. Confronta lasciare in azienda vs destinare al fondo pensione.',
    type: 'website',
  },
}

export default function TfrLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
