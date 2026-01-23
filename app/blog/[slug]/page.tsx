import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar, Footer } from '@/components'
import { getPostBySlug, getAllPosts } from '@/content/blog/posts'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Articolo non trovato | Guida Patrimonio',
    }
  }

  return {
    title: `${post.title} | Guida Patrimonio`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      images: post.image ? [{ url: post.image, width: 1200, height: 630 }] : undefined,
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n')
    const elements: React.ReactNode[] = []
    let currentList: string[] = []
    let inTable = false
    let tableRows: string[][] = []

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc pl-6 space-y-2 my-4">
            {currentList.map((item, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            ))}
          </ul>
        )
        currentList = []
      }
    }

    const flushTable = () => {
      if (tableRows.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} className="overflow-x-auto my-6">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-green-50">
                  {tableRows[0].map((cell, i) => (
                    <th key={i} className="border border-gray-200 px-4 py-2 text-left font-medium text-forest">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(2).map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    {row.map((cell, j) => (
                      <td key={j} className="border border-gray-200 px-4 py-2" dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
        tableRows = []
        inTable = false
      }
    }

    const formatInline = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
    }

    for (const line of lines) {
      const trimmed = line.trim()

      // Table detection
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        flushList()
        inTable = true
        const cells = trimmed.slice(1, -1).split('|').map(c => c.trim())
        tableRows.push(cells)
        continue
      } else if (inTable) {
        flushTable()
      }

      // Headers
      if (trimmed.startsWith('## ')) {
        flushList()
        elements.push(
          <h2 key={elements.length} className="font-heading text-2xl text-forest mt-10 mb-4">
            {trimmed.slice(3)}
          </h2>
        )
      } else if (trimmed.startsWith('### ')) {
        flushList()
        elements.push(
          <h3 key={elements.length} className="font-heading text-xl text-forest mt-8 mb-3">
            {trimmed.slice(4)}
          </h3>
        )
      }
      // List items
      else if (trimmed.startsWith('- ') || trimmed.match(/^\d+\. /)) {
        const content = trimmed.replace(/^[-\d]+\.?\s*/, '')
        currentList.push(content)
      }
      // Empty line
      else if (trimmed === '') {
        flushList()
      }
      // Paragraph
      else if (trimmed.length > 0) {
        flushList()
        elements.push(
          <p key={elements.length} className="my-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
        )
      }
    }

    flushList()
    flushTable()

    return elements
  }

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-forest pt-navbar">
        <div className="container-custom py-12">
          <Link href="/blog" className="inline-flex items-center text-green-300 hover:text-white mb-6 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Torna al Blog
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium text-green-300 bg-green-800/50 px-2 py-1 rounded">
              {post.category}
            </span>
            <span className="text-sm text-white/60">
              {post.readTime} min lettura
            </span>
          </div>
          <h1 className="font-heading text-[32px] md:text-[42px] text-white leading-tight max-w-3xl">
            {post.title}
          </h1>
          <p className="text-white/60 mt-4">
            {new Date(post.date).toLocaleDateString('it-IT', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </section>

      {/* Featured Image */}
      {post.image && (
        <section className="bg-cream pt-8">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="rounded-card overflow-hidden shadow-lg">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '450px' }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className={`${post.image ? 'pt-8' : 'section-md'} pb-16 bg-cream`}>
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <article className="bg-white rounded-card p-8 md:p-12 shadow-sm">
              <div className="prose prose-lg max-w-none text-gray-700">
                {renderContent(post.content)}
              </div>
            </article>

            {/* CTA Box */}
            <div className="bg-green-600 rounded-card p-8 mt-8 text-center">
              <h3 className="font-heading text-2xl text-white mb-3">
                Hai domande su questo argomento?
              </h3>
              <p className="text-white/80 mb-6">
                Prenota una consulenza gratuita con un nostro esperto.
              </p>
              <Link href="/#contatti" className="btn-reverse">
                Richiedi Consulenza
              </Link>
            </div>

            {/* Related Posts */}
            <div className="mt-12">
              <h3 className="font-heading text-xl text-forest mb-6">Altri articoli che potrebbero interessarti</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {getAllPosts()
                  .filter(p => p.slug !== post.slug)
                  .slice(0, 2)
                  .map(relatedPost => (
                    <Link
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="bg-white rounded-card p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                        {relatedPost.category}
                      </span>
                      <h4 className="font-heading text-lg text-forest mt-3 line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
