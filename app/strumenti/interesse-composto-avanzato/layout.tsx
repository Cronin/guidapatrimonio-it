import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simulatore Interesse Composto Avanzato | Guida Patrimonio',
  description: 'Simulatore avanzato interesse composto: versamenti variabili, inflazione, tassazione, scenari multipli. Proiezioni realistiche patrimonio.',
  keywords: ['interesse composto avanzato', 'simulatore investimenti', 'proiezione patrimonio', 'tassazione capital gain', 'inflazione', 'HNWI', 'pianificazione patrimoniale'],
  openGraph: {
    title: 'Simulatore Interesse Composto Avanzato',
    description: 'Proiezioni realistiche: versamenti variabili, inflazione, tasse. Simula la crescita del patrimonio.',
    type: 'website',
  },
}

export default function InteresseCompostoAvanzatoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
