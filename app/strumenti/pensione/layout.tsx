import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simulatore Pensione INPS | Guida Patrimonio',
  description: 'Stima la tua pensione INPS: contributi, eta pensionabile, gap previdenziale. Pianifica la previdenza complementare.',
  keywords: ['simulatore pensione', 'calcolo pensione INPS', 'gap previdenziale', 'previdenza complementare', 'fondo pensione', 'pianificazione pensione'],
  openGraph: {
    title: 'Simulatore Pensione INPS',
    description: 'Calcola la pensione stimata e il gap previdenziale. Pianifica la tua previdenza integrativa.',
    type: 'website',
  },
}

export default function PensioneLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
