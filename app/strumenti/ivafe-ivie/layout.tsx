import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore IVAFE e IVIE | Guida Patrimonio',
  description: 'Calcola IVAFE (attivita finanziarie estere) e IVIE (immobili esteri): imposte patrimoniali per residenti italiani con asset internazionali.',
  keywords: ['IVAFE', 'IVIE', 'imposta patrimonio estero', 'attivita finanziarie estere', 'immobili esteri', 'fiscalita internazionale', 'HNWI', 'consulenza patrimoniale'],
  openGraph: {
    title: 'Calcolatore IVAFE e IVIE',
    description: 'Simula le imposte su attivita finanziarie e immobili detenuti all estero. Per residenti italiani con patrimonio internazionale.',
    type: 'website',
  },
}

export default function IvafeiVieLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
