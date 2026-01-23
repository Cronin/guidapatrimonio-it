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
  image: 'https://guidapatrimonio.it/og-image.jpg',
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
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    bestRating: '5',
    worstRating: '1',
    ratingCount: '47',
    reviewCount: '47',
  },
  review: [
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Marco R.',
      },
      datePublished: '2024-12-15',
      reviewBody: 'Finalmente ho trovato qualcuno che mi spiega le cose con chiarezza, senza conflitti di interesse. La mia situazione patrimoniale non è mai stata così chiara.',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
    },
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Laura B.',
      },
      datePublished: '2024-11-20',
      reviewBody: 'Dopo anni di consulenze bancarie deludenti, Guida Patrimonio mi ha aiutato a risparmiare migliaia di euro in commissioni nascoste.',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
    },
    {
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: 'Giuseppe M.',
      },
      datePublished: '2024-10-08',
      reviewBody: 'Il piano di successione che abbiamo costruito insieme mi dà serenità per il futuro della mia famiglia. Professionalità e umanità rare.',
      reviewRating: {
        '@type': 'Rating',
        ratingValue: '5',
        bestRating: '5',
      },
    },
  ],
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
