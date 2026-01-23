import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calcolatore Fondo Emergenza | Guida Patrimonio',
  description: 'Calcola quanto serve nel fondo emergenza: 3-12 mesi di spese, dove tenerlo, rendimento vs liquidita. Base della pianificazione finanziaria.',
  keywords: ['fondo emergenza', 'cuscinetto liquidita', 'riserva cash', 'pianificazione finanziaria', 'gestione liquidita', 'conto deposito', 'sicurezza finanziaria'],
  openGraph: {
    title: 'Calcolatore Fondo Emergenza',
    description: 'Quanto serve nel fondo emergenza? Calcola la riserva ideale per imprevisti.',
    type: 'website',
  },
}

export default function FondoEmergenzaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
