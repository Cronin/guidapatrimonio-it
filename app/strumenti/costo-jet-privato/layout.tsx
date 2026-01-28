import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quanto Costa un Jet Privato | Possesso vs Fractional vs Charter',
  description: 'Calcola i costi reali di un jet privato: acquisto da 4M a 70M, costi fissi 500K-2M/anno, costo orario 2.500-8.000€. Confronto possesso, fractional e charter.',
  keywords: [
    'costo jet privato',
    'quanto costa un jet privato',
    'prezzo jet privato',
    'fractional jet ownership',
    'charter jet privato',
    'costo orario jet',
    'possesso jet privato',
    'jet card costo',
  ],
  openGraph: {
    title: 'Calcolatore Costo Jet Privato | Guida Patrimonio',
    description: 'Confronta possesso totale, fractional ownership, jet card e charter. Calcola il costo reale per ora di volo.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
