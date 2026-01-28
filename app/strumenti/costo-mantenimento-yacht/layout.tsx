import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quanto Costa Mantenere uno Yacht 20-30 Metri | Calcolatore 2025',
  description: 'Calcola i costi reali di mantenimento yacht: ormeggio (800-2500€/m), equipaggio, assicurazione 2%, manutenzione 10%, IVIE per bandiera estera. La regola del 10%.',
  keywords: [
    'quanto costa mantenere uno yacht',
    'costo mantenimento yacht 20 metri',
    'costo mantenimento yacht 25 metri',
    'costo yacht',
    'prezzo yacht',
    'costo ormeggio yacht',
    'equipaggio yacht costo',
    'assicurazione yacht',
    'IVIE yacht bandiera estera',
  ],
  openGraph: {
    title: 'Calcolatore Costo Mantenimento Yacht | Guida Patrimonio',
    description: 'Calcola quanto costa mantenere uno yacht di 20, 25 o 30 metri. Ormeggio, equipaggio, assicurazione, manutenzione e IVIE.',
    type: 'website',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
