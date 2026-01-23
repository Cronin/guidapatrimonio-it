import Link from 'next/link'
import { Navbar, Footer } from '@/components'
import { getAllPosts } from '@/content/blog/posts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Guida Patrimonio',
  description: 'Articoli e guide su investimenti, pianificazione finanziaria, risparmio e gestione del patrimonio. Consigli pratici da esperti indipendenti.',
}

export default function BlogIndex() {
  const posts = getAllPosts()

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-forest pt-navbar">
        <div className="container-custom py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="label text-green-300 mb-4">Blog</p>
            <h1 className="font-heading text-[36px] md:text-[48px] text-white leading-tight mb-6">
              Guide e Approfondimenti
            </h1>
            <p className="text-lg text-white/80">
              Articoli pratici su investimenti, risparmio e pianificazione finanziaria.
              Scritti da consulenti indipendenti, senza conflitti di interesse.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="section-lg bg-cream">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.slug} className="bg-white rounded-card overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-green-600 to-forest flex items-center justify-center">
                  <span className="text-white/20 font-heading text-6xl">GP</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                      {post.category}
                    </span>
                    <span className="text-xs text-gray-400">
                      {post.readTime} min lettura
                    </span>
                  </div>
                  <h2 className="font-heading text-xl text-forest mb-3 line-clamp-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-green-600 transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {new Date(post.date).toLocaleDateString('it-IT', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-green-600 text-sm font-medium hover:underline inline-flex items-center gap-1"
                    >
                      Leggi
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-md bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-h3-sm md:text-h3 text-white mb-4">
            Resta aggiornato
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Ricevi i nuovi articoli e guide esclusive direttamente nella tua inbox.
            Niente spam, solo contenuti di valore.
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
