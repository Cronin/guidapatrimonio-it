import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Costo Auto da Collezione | Supercar, Hypercar e Classiche',
  description: 'Calcola i costi di possesso di supercar e auto storiche: assicurazione 1-2%, manutenzione 2-4%, storage, superbollo. Alcune si apprezzano +8%/anno.',
  keywords: [
    'costo mantenimento supercar',
    'costo auto da collezione',
    'assicurazione supercar',
    'superbollo ferrari',
    'auto da collezione investimento',
    'costo manutenzione ferrari',
    'storage auto lusso',
    'hypercar costo',
  ],
  openGraph: {
    title: 'Calcolatore Costo Auto da Collezione | Guida Patrimonio',
    description: 'Supercar, hypercar e auto storiche: calcola i costi reali di assicurazione, manutenzione, storage e apprezzamento.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
