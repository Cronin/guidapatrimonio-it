import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore Flat Tax 100.000 Euro | Guida Patrimonio',
  description: 'Simula il regime flat tax 100k per neo-residenti: confronto con IRPEF, risparmio fiscale, requisiti. Per HNWI che trasferiscono residenza in Italia.',
  keywords: ['flat tax 100000', 'flat tax neo residenti', 'regime impatriati', 'HNWI Italia', 'ottimizzazione fiscale', 'trasferimento residenza', 'consulenza patrimoniale'],
  openGraph: {
    title: 'Flat Tax 100.000 Euro - Conviene Trasferirsi?',
    description: 'Calcola il risparmio fiscale del regime flat tax per neo-residenti HNWI. Confronto con tassazione ordinaria.',
    type: 'website',
  },
}

export default function FlatTaxLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
