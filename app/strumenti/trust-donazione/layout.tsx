import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Trust vs Donazione: Confronto | Guida Patrimonio',
  description: 'Confronta trust e donazione per passaggio generazionale: costi, imposte, protezione patrimonio. Guida alla scelta per HNWI e family office.',
  keywords: ['trust italia', 'donazione', 'passaggio generazionale', 'pianificazione successoria', 'protezione patrimonio', 'HNWI', 'family office', 'consulenza patrimoniale'],
  openGraph: {
    title: 'Trust vs Donazione - Quale Scegliere?',
    description: 'Simulatore per confrontare trust e donazione: imposte, costi, vantaggi e svantaggi per la pianificazione successoria.',
    type: 'website',
  },
}

export default function TrustDonazioneLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
