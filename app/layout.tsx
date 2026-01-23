import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Guida Patrimonio | Consulenza Patrimoniale Indipendente',
  description: 'Pianificazione patrimoniale e consulenza finanziaria indipendente per proteggere e far crescere il tuo patrimonio. Strategia personalizzata per ogni fase della vita.',
  keywords: 'consulenza patrimoniale, pianificazione finanziaria, wealth management, investimenti, patrimonio, consulente finanziario indipendente',
  openGraph: {
    title: 'Guida Patrimonio | Consulenza Patrimoniale Indipendente',
    description: 'Pianificazione patrimoniale e consulenza finanziaria indipendente per proteggere e far crescere il tuo patrimonio.',
    type: 'website',
    locale: 'it_IT',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
