import type { Metadata } from 'next'
import Script from 'next/script'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { JsonLd, organizationSchema, websiteSchema } from '@/components'

// TODO: Create GA4 property on analytics.google.com and update this ID
const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'
// TODO: Create Clarity project on clarity.microsoft.com and update this ID
const CLARITY_ID = 'XXXXXXXXXX'

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['300', '400', '500', '600', '700'],
})

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
    images: [{
      url: 'https://guidapatrimonio.it/og-default.png',
      width: 1200,
      height: 630,
      alt: 'Guida Patrimonio - Consulenza Patrimoniale per Grandi Patrimoni',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Guida Patrimonio | Consulenza Patrimoniale Indipendente',
    description: 'Pianificazione patrimoniale e consulenza finanziaria indipendente.',
    images: ['https://guidapatrimonio.it/og-default.png'],
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
    <html lang="it" className={`${playfair.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <JsonLd data={[organizationSchema, websiteSchema]} />

        {/* Google Analytics 4 */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA4_MEASUREMENT_ID}');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="clarity-script" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${CLARITY_ID}");
          `}
        </Script>
      </head>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  )
}
