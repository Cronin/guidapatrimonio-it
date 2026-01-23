import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ottimizzatore Asset Allocation | Guida Patrimonio',
  description: 'Ottimizza l asset allocation del portafoglio: frontiera efficiente, rischio/rendimento, diversificazione. Per HNWI e consulenti patrimoniali.',
  keywords: ['asset allocation', 'ottimizzazione portafoglio', 'frontiera efficiente', 'diversificazione', 'rischio rendimento', 'HNWI', 'wealth management', 'modern portfolio theory'],
  openGraph: {
    title: 'Ottimizzatore Asset Allocation',
    description: 'Trova l asset allocation ottimale per il tuo profilo di rischio. Analisi frontiera efficiente.',
    type: 'website',
  },
}

export default function OttimizzatoreAllocazioneLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
