import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  variant?: 'light' | 'dark'
}

export default function Breadcrumbs({ items, variant = 'dark' }: BreadcrumbsProps) {
  const textColor = variant === 'light' ? 'text-white/60' : 'text-gray-500'
  const hoverColor = variant === 'light' ? 'hover:text-white' : 'hover:text-forest'
  const activeColor = variant === 'light' ? 'text-white' : 'text-forest'
  const separatorColor = variant === 'light' ? 'text-white/40' : 'text-gray-400'

  // Schema.org JSON-LD for breadcrumbs
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? `https://guidapatrimonio.it${item.href}` : undefined,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center gap-2 text-sm flex-wrap">
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <li key={index} className="flex items-center gap-2">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className={`${textColor} ${hoverColor} transition-colors inline-flex items-center gap-1`}
                  >
                    {index === 0 && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    )}
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? activeColor : textColor}>
                    {item.label}
                  </span>
                )}
                {!isLast && (
                  <svg className={`w-4 h-4 ${separatorColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </>
  )
}
