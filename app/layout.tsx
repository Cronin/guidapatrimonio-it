import type { Metadata } from 'next'
import './globals.css'

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

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  name: 'Guida Patrimonio',
  description: 'Consulenza patrimoniale e finanziaria indipendente per proteggere e far crescere il tuo patrimonio.',
  url: 'https://guidapatrimonio.it',
  logo: 'https://guidapatrimonio.it/logo.png',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Milano',
    addressRegion: 'Lombardia',
    addressCountry: 'IT',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Italia',
  },
  priceRange: '$$',
  serviceType: ['Consulenza Patrimoniale', 'Pianificazione Finanziaria', 'Wealth Management', 'Pianificazione Successoria'],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
