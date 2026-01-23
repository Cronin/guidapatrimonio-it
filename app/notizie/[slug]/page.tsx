import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar, Footer, JsonLd, createNewsArticleSchema, createBreadcrumbSchema } from '@/components'
import { getNewsBySlug, getAllNews } from '@/content/news/articles'
import type { Metadata } from 'next'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const news = getAllNews()
  return news.map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = getNewsBySlug(slug)

  if (!article) {
    return {
      title: 'Articolo non trovato | Guida Patrimonio',
    }
  }

  return {
    title: `${article.title} | Guida Patrimonio`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.date,
      images: article.image ? [article.image] : [],
    },
  }
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  'Mercati': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'Fiscalita': { bg: 'bg-red-100', text: 'text-red-700' },
  'Immobiliare': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Wealth': { bg: 'bg-green-100', text: 'text-green-700' },
  'Lifestyle': { bg: 'bg-purple-100', text: 'text-purple-700' },
}

function parseContent(content: string) {
  const lines = content.trim().split('\n')
  const elements: JSX.Element[] = []
  let currentList: string[] = []
  let currentTable: { headers: string[]; rows: string[][] } | null = null
  let key = 0

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={key++} className="list-disc list-inside space-y-2 mb-6 text-gray-600">
          {currentList.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: formatText(item) }} />
          ))}
        </ul>
      )
      currentList = []
    }
  }

  const flushTable = () => {
    if (currentTable && currentTable.headers.length > 0) {
      elements.push(
        <div key={key++} className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                {currentTable.headers.map((header, i) => (
                  <th key={i} className="text-left py-3 px-4 font-semibold text-forest">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTable.rows.map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  {row.map((cell, j) => (
                    <td key={j} className="py-3 px-4 text-gray-600" dangerouslySetInnerHTML={{ __html: formatText(cell) }} />
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      currentTable = null
    }
  }

  const formatText = (text: string) => {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
  }

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('## ')) {
      flushList()
      flushTable()
      elements.push(
        <h2 key={key++} className="font-heading text-xl md:text-2xl text-forest mt-8 mb-4">
          {trimmed.slice(3)}
        </h2>
      )
    } else if (trimmed.startsWith('### ')) {
      flushList()
      flushTable()
      elements.push(
        <h3 key={key++} className="font-heading text-lg text-forest mt-6 mb-3">
          {trimmed.slice(4)}
        </h3>
      )
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      flushTable()
      currentList.push(trimmed.slice(2))
    } else if (trimmed.startsWith('|')) {
      flushList()
      const cells = trimmed.split('|').filter(c => c.trim()).map(c => c.trim())
      if (cells.length > 0) {
        if (!currentTable) {
          currentTable = { headers: cells, rows: [] }
        } else if (cells.every(c => /^[-:]+$/.test(c))) {
          // Skip separator row
        } else {
          currentTable.rows.push(cells)
        }
      }
    } else if (trimmed === '') {
      flushList()
      flushTable()
    } else {
      flushList()
      flushTable()
      elements.push(
        <p key={key++} className="text-gray-600 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: formatText(trimmed) }} />
      )
    }
  }

  flushList()
  flushTable()

  return elements
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params
  const article = getNewsBySlug(slug)
  const allNews = getAllNews()

  if (!article) {
    notFound()
  }

  const relatedNews = allNews
    .filter(n => n.slug !== article.slug && n.category === article.category)
    .slice(0, 3)

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-forest pt-navbar">
        <div className="container-custom py-12 md:py-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <Link href="/notizie" className="text-green-300 hover:text-white transition-colors text-sm">
                Notizie
              </Link>
              <span className="text-white/40">/</span>
              <span className={`text-xs font-medium px-2 py-1 rounded ${categoryColors[article.category]?.bg || 'bg-gray-100'} ${categoryColors[article.category]?.text || 'text-gray-700'}`}>
                {article.category}
              </span>
            </div>
            <h1 className="font-heading text-[28px] md:text-[38px] text-white leading-tight mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
              <span>
                {new Date(article.date).toLocaleDateString('it-IT', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              <span className="text-white/40">|</span>
              <span>{article.readTime} min lettura</span>
              {article.source && (
                <>
                  <span className="text-white/40">|</span>
                  <span>Fonte: {article.source}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {article.image && (
        <section className="bg-cream">
          <div className="container-custom -mt-4">
            <div className="max-w-4xl mx-auto">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl shadow-lg"
              />
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="section-lg bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <article className="bg-white rounded-xl p-8 md:p-12 shadow-sm">
              <p className="text-lg text-gray-700 font-medium mb-8 pb-8 border-b border-gray-100">
                {article.excerpt}
              </p>

              <div className="prose-custom">
                {parseContent(article.content)}
              </div>

              {/* Source Link */}
              {article.sourceUrl && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Fonte originale:{' '}
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      {article.source}
                    </a>
                  </p>
                </div>
              )}
            </article>

            {/* Share */}
            <div className="mt-8 flex items-center justify-between">
              <Link
                href="/notizie"
                className="text-green-600 font-medium hover:underline inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Tutte le notizie
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="section-md bg-white">
          <div className="container-custom">
            <h2 className="font-heading text-2xl text-forest mb-8">
              Altre Notizie su {article.category}
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedNews.map((related) => (
                <article key={related.slug} className="bg-cream rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                  {related.image && (
                    <Link href={`/notizie/${related.slug}`}>
                      <div className="h-40 overflow-hidden">
                        <img
                          src={related.image}
                          alt={related.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    </Link>
                  )}
                  <div className="p-5">
                    <h3 className="font-heading text-base text-forest mb-2 line-clamp-2">
                      <Link href={`/notizie/${related.slug}`} className="hover:text-green-600 transition-colors">
                        {related.title}
                      </Link>
                    </h3>
                    <span className="text-xs text-gray-400">
                      {new Date(related.date).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-md bg-forest">
        <div className="container-custom text-center">
          <h2 className="font-heading text-h3-sm md:text-h3 text-white mb-4">
            Resta Aggiornato
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Ricevi le notizie importanti per il tuo patrimonio direttamente nella tua inbox.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Iscriviti alla Newsletter
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
