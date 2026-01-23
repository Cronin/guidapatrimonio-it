import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simulatore Monte Carlo Investimenti | Guida Patrimonio',
  description: 'Simula 1000+ scenari per i tuoi investimenti: probabilita di successo, worst/best case, range risultati. Strumento per HNWI e wealth planning.',
  keywords: ['Monte Carlo', 'simulazione investimenti', 'probabilita successo', 'risk analysis', 'HNWI', 'wealth planning', 'portafoglio', 'scenari investimento'],
  openGraph: {
    title: 'Simulatore Monte Carlo - Analisi Scenari',
    description: 'Simula migliaia di scenari per valutare la probabilita di raggiungere i tuoi obiettivi finanziari.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
