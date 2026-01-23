import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Proiezione Crescita Patrimonio | Guida Patrimonio',
  description: 'Simula la crescita del tuo patrimonio: proiezioni a 10-30 anni con tax drag, ottimizzazione fiscale. Strumento per pianificazione HNWI.',
  keywords: ['proiezione patrimonio', 'crescita patrimonio', 'tax drag', 'interesse composto', 'HNWI', 'pianificazione patrimoniale', 'wealth planning', 'ottimizzazione fiscale'],
  openGraph: {
    title: 'Proiezione Crescita Patrimonio',
    description: 'Simula come crescera il tuo patrimonio: rendimenti, tasse, inflazione. Confronta scenari ottimizzati.',
    type: 'website',
  },
}

export default function ProiezionePatrimonialeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
