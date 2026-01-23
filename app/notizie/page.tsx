import Link from 'next/link'
import { Navbar, Footer } from '@/components'
import { getAllNews } from '@/content/news/articles'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notizie | Guida Patrimonio',
  description: 'Le notizie che contano per chi gestisce grandi patrimoni. Mercati, fiscalita, immobiliare di lusso, wealth management. Aggiornamenti per HNWI.',
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  'Mercati': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'Fiscalita': { bg: 'bg-red-100', text: 'text-red-700' },
  'Immobiliare': { bg: 'bg-blue-100', text: 'text-blue-700' },
  'Wealth': { bg: 'bg-green-100', text: 'text-green-700' },
  'Lifestyle': { bg: 'bg-purple-100', text: 'text-purple-700' },
}

export default function NotizieIndex() {
  const news = getAllNews()
  const featured = news[0]
  const rest = news.slice(1)

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-forest pt-navbar">
        <div className="container-custom py-12 md:py-16">
          <div className="max-w-2xl">
            <p className="label text-green-300 mb-3">Notizie</p>
            <h1 className="font-heading text-[32px] md:text-[42px] text-white leading-tight mb-4">
              Le Notizie che Contano
            </h1>
            <p className="text-base text-white/80">
              Mercati, fiscalita, wealth management. Solo cio che interessa a chi gestisce patrimoni significativi.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section className="bg-cream py-12">
          <div className="container-custom">
            <Link href={`/notizie/${featured.slug}`} className="block group">
              <article className="grid md:grid-cols-2 gap-8 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                {featured.image && (
                  <div className="h-64 md:h-auto overflow-hidden">
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${categoryColors[featured.category]?.bg || 'bg-gray-100'} ${categoryColors[featured.category]?.text || 'text-gray-700'}`}>
                      {featured.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(featured.date).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl text-forest mb-4 group-hover:text-green-600 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-gray-600 mb-6">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-green-600 font-medium inline-flex items-center gap-2">
                      Leggi l'articolo
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                    {featured.source && (
                      <span className="text-xs text-gray-400">
                        Fonte: {featured.source}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          </div>
        </section>
      )}

      {/* News Grid */}
      <section className="section-lg bg-cream">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((article) => (
              <article key={article.slug} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                {article.image && (
                  <Link href={`/notizie/${article.slug}`}>
                    <div className="h-44 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </Link>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${categoryColors[article.category]?.bg || 'bg-gray-100'} ${categoryColors[article.category]?.text || 'text-gray-700'}`}>
                      {article.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {article.readTime} min
                    </span>
                  </div>
                  <h3 className="font-heading text-lg text-forest mb-2 line-clamp-2">
                    <Link href={`/notizie/${article.slug}`} className="hover:text-green-600 transition-colors">
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {new Date(article.date).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                    <Link
                      href={`/notizie/${article.slug}`}
                      className="text-green-600 text-sm font-medium hover:underline inline-flex items-center gap-1"
                    >
                      Leggi
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-md bg-forest">
        <div className="container-custom text-center">
          <h2 className="font-heading text-h3-sm md:text-h3 text-white mb-4">
            Ricevi le Notizie Importanti
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Solo le notizie che impattano i grandi patrimoni. Niente rumore, solo segnali.
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
