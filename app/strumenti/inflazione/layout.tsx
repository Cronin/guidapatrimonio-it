import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore Impatto Inflazione | Guida Patrimonio',
  description: 'Calcola l erosione del potere d acquisto: inflazione storica e proiezioni future. Proteggi il patrimonio dall inflazione.',
  keywords: ['inflazione', 'potere acquisto', 'erosione capitale', 'protezione inflazione', 'rendimento reale', 'BTP Italia', 'inflation linked bonds'],
  openGraph: {
    title: 'Calcolatore Impatto Inflazione',
    description: 'Quanto erode l inflazione? Calcola il potere d acquisto nel tempo e come proteggerti.',
    type: 'website',
  },
}

export default function InflazioneLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
