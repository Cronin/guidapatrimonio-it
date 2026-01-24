'use client'

import { useEffect, useState } from 'react'
import { getToolData } from '@/lib/toolsData'

interface ToolPageSchemaProps {
  slug: string
}

export default function ToolPageSchema({ slug }: ToolPageSchemaProps) {
  const [aggregate, setAggregate] = useState<{ ratingValue: number; ratingCount: number } | null>(null)
  const toolData = getToolData(slug)

  useEffect(() => {
    // Fetch rating data
    fetch(`/api/reviews?tool=${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.aggregate && data.aggregate.ratingCount > 0) {
          setAggregate(data.aggregate)
        }
      })
      .catch(() => {})
  }, [slug])

  // Build SoftwareApplication schema
  const softwareSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: toolData.name,
    description: toolData.description,
    url: `https://guidapatrimonio.it/strumenti/${slug}`,
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    provider: {
      '@type': 'Organization',
      name: 'Guida Patrimonio',
      url: 'https://guidapatrimonio.it',
    },
  }

  // Add aggregate rating if available
  if (aggregate && aggregate.ratingCount > 0) {
    softwareSchema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregate.ratingValue,
      ratingCount: aggregate.ratingCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  // Build FAQ schema if FAQs exist
  const faqSchema = toolData.faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: toolData.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  } : null

  const schemas = [softwareSchema]
  if (faqSchema) schemas.push(faqSchema)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
    />
  )
}
