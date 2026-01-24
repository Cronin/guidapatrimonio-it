// JSON-LD Structured Data Components for SEO

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[]
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// Organization Schema for the main site
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  '@id': 'https://guidapatrimonio.it/#organization',
  name: 'Guida Patrimonio',
  alternateName: 'GuidaPatrimonio',
  description: 'Consulenza patrimoniale indipendente per HNWI. Pianificazione finanziaria, wealth management, ottimizzazione fiscale.',
  url: 'https://guidapatrimonio.it',
  logo: {
    '@type': 'ImageObject',
    url: 'https://guidapatrimonio.it/logo.png',
    width: 512,
    height: 512,
  },
  image: 'https://guidapatrimonio.it/og-image.png',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Via Monte Napoleone 8',
    postalCode: '20121',
    addressLocality: 'Milano',
    addressRegion: 'Lombardia',
    addressCountry: 'IT',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 45.4686,
    longitude: 9.1954,
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Italia',
  },
  priceRange: '$$$$',
  serviceType: [
    'Consulenza Patrimoniale',
    'Pianificazione Finanziaria',
    'Wealth Management',
    'Pianificazione Successoria',
    'Ottimizzazione Fiscale',
    'Family Office Advisory',
  ],
  sameAs: [
    'https://linkedin.com/company/guidapatrimonio',
  ],
  knowsAbout: [
    'Wealth Management',
    'Private Banking',
    'Tax Planning',
    'Estate Planning',
    'Investment Advisory',
    'Family Office',
  ],
}

// WebSite Schema with SearchAction
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://guidapatrimonio.it/#website',
  url: 'https://guidapatrimonio.it',
  name: 'Guida Patrimonio',
  description: 'Consulenza patrimoniale indipendente per HNWI',
  publisher: {
    '@id': 'https://guidapatrimonio.it/#organization',
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://guidapatrimonio.it/strumenti?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'it-IT',
}

// SoftwareApplication Schema for calculators
export function createCalculatorSchema({
  name,
  description,
  url,
  category = 'FinanceApplication',
  aggregateRating,
}: {
  name: string
  description: string
  url: string
  category?: string
  aggregateRating?: {
    ratingValue: number
    ratingCount: number
    reviewCount?: number
  }
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url,
    applicationCategory: category,
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    provider: {
      '@id': 'https://guidapatrimonio.it/#organization',
    },
  }

  if (aggregateRating && aggregateRating.ratingCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      ratingCount: aggregateRating.ratingCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return schema
}

// Article Schema for blog posts
export function createArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author = 'Guida Patrimonio',
}: {
  title: string
  description: string
  url: string
  image?: string
  datePublished: string
  dateModified?: string
  author?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    image: image || 'https://guidapatrimonio.it/og-image.png',
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: author,
      url: 'https://guidapatrimonio.it',
    },
    publisher: {
      '@id': 'https://guidapatrimonio.it/#organization',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    inLanguage: 'it-IT',
  }
}

// NewsArticle Schema for news/notizie
export function createNewsArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  source,
}: {
  title: string
  description: string
  url: string
  image?: string
  datePublished: string
  dateModified?: string
  source?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description,
    url,
    image: image || 'https://guidapatrimonio.it/og-image.png',
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: source || 'Guida Patrimonio',
      url: 'https://guidapatrimonio.it',
    },
    publisher: {
      '@id': 'https://guidapatrimonio.it/#organization',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    inLanguage: 'it-IT',
  }
}

// FAQPage Schema
export function createFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// BreadcrumbList Schema
export function createBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// ItemList Schema for tool listings
export function createToolListSchema(
  tools: { name: string; description: string; url: string }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.description,
        url: tool.url,
        applicationCategory: 'FinanceApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'EUR',
        },
      },
    })),
  }
}
