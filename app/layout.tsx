import type { Metadata } from 'next'
import './globals.css'
import { JsonLd, organizationSchema, websiteSchema } from '@/components'

export const metadata: Metadata = {
  title: 'Guida Patrimonio | Consulenza Patrimoniale Indipendente',
  description: 'Pianificazione patrimoniale e consulenza finanziaria indipendente per proteggere e far crescere il tuo patrimonio. Strategia personalizzata per ogni fase della vita.',
  keywords: 'consulenza patrimoniale, pianificazione finanziaria, wealth management, investimenti, patrimonio, consulente finanziario indipendente',
  metadataBase: new URL('https://guidapatrimonio.it'),
  openGraph: {
    title: 'Guida Patrimonio | Consulenza Patrimoniale Indipendente',
    description: 'Pianificazione patrimoniale e consulenza finanziaria indipendente per proteggere e far crescere il tuo patrimonio.',
    type: 'website',
    locale: 'it_IT',
    url: 'https://guidapatrimonio.it',
    siteName: 'Guida Patrimonio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guida Patrimonio | Consulenza Patrimoniale Indipendente',
    description: 'Pianificazione patrimoniale e consulenza finanziaria indipendente.',
  },
  alternates: {
    canonical: 'https://guidapatrimonio.it',
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
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <JsonLd data={[organizationSchema, websiteSchema]} />
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
