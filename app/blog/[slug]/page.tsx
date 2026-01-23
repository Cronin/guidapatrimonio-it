import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Navbar, Footer } from '@/components'
import { getPostBySlug, getAllPosts } from '@/content/blog/posts'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

interface TOCItem {
  id: string
  text: string
  level: number
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

// Generate Table of Contents from content
function extractTOC(content: string): TOCItem[] {
  const lines = content.trim().split('\n')
  const toc: TOCItem[] = []

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('## ')) {
      const text = trimmed.slice(3)
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      toc.push({ id, text, level: 2 })
    } else if (trimmed.startsWith('### ')) {
      const text = trimmed.slice(4)
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      toc.push({ id, text, level: 3 })
    }
  }

  return toc
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const toc = extractTOC(post.content)

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
          <ul key={`list-${elements.length}`} className="list-disc pl-6 space-y-3 my-6 text-gray-600">
            {currentList.map((item, i) => (
              <li key={i} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
            ))}
          </ul>
        )
        currentList = []
      }
    }

    const flushTable = () => {
      if (tableRows.length > 0) {
        elements.push(
          <div key={`table-${elements.length}`} className="overflow-x-auto my-8 rounded-lg border border-gray-200">
            <table className="min-w-full">
              <thead>
                <tr className="bg-forest/5">
                  {tableRows[0].map((cell, i) => (
                    <th key={i} className="px-5 py-3 text-left text-sm font-semibold text-forest border-b border-gray-200">
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tableRows.slice(2).map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    {row.map((cell, j) => (
                      <td key={j} className="px-5 py-3 text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />
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
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-800">$1</strong>')
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

      // Headers with IDs for TOC linking
      if (trimmed.startsWith('## ')) {
        flushList()
        const text = trimmed.slice(3)
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        elements.push(
          <h2 key={elements.length} id={id} className="font-heading text-2xl md:text-3xl text-forest mt-12 mb-5 scroll-mt-24">
            {text}
          </h2>
        )
      } else if (trimmed.startsWith('### ')) {
        flushList()
        const text = trimmed.slice(4)
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        elements.push(
          <h3 key={elements.length} id={id} className="font-heading text-xl md:text-2xl text-forest mt-10 mb-4 scroll-mt-24">
            {text}
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
          <p key={elements.length} className="my-5 text-lg leading-[1.8] text-gray-600" dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
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
        <div className="container-custom py-12 md:py-16">
          <Link href="/blog" className="inline-flex items-center text-green-300 hover:text-white mb-6 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Torna al Blog
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium text-green-300 bg-green-800/50 px-2.5 py-1 rounded-full">
              {post.category}
            </span>
            <span className="text-sm text-white/60">
              {post.readTime} min di lettura
            </span>
          </div>
          <h1 className="font-heading text-[32px] md:text-[48px] text-white leading-[1.15] max-w-4xl">
            {post.title}
          </h1>
          <p className="text-white/50 mt-5 text-lg">
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
            <div className="max-w-5xl mx-auto">
              <div className="rounded-xl overflow-hidden shadow-xl">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                  style={{ maxHeight: '500px' }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className={`${post.image ? 'pt-10' : 'section-md'} pb-20 bg-cream`}>
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {/* Table of Contents - Simple, at top */}
            {toc.filter(item => item.level === 2).length > 2 && (
              <nav className="bg-white rounded-xl p-6 mb-8 shadow-sm border border-gray-100">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Contenuti</p>
                <ol className="flex flex-wrap gap-x-6 gap-y-2">
                  {toc.filter(item => item.level === 2).map((item, idx) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        className="text-sm text-gray-600 hover:text-green-600 transition-colors"
                      >
                        <span className="text-gray-400 mr-1">{idx + 1}.</span>
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            <article className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-gray-100">
              <div className="max-w-none">
                {renderContent(post.content)}
              </div>
            </article>

            {/* CTA Box */}
            <div className="bg-forest rounded-xl p-8 md:p-10 mt-8 text-center">
              <h3 className="font-heading text-2xl text-white mb-3">
                Hai domande su questo argomento?
              </h3>
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                Prenota una consulenza riservata con un nostro esperto.
              </p>
              <Link href="/#contatti" className="inline-flex items-center gap-2 bg-white text-forest px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                Richiedi Consulenza
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            {/* Related Posts */}
            <div className="mt-12">
              <h3 className="font-heading text-xl text-forest mb-6">Articoli correlati</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {getAllPosts()
                  .filter(p => p.slug !== post.slug)
                  .slice(0, 2)
                  .map(relatedPost => (
                    <Link
                      key={relatedPost.slug}
                      href={`/blog/${relatedPost.slug}`}
                      className="group bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all"
                    >
                      <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">
                        {relatedPost.category}
                      </span>
                      <h4 className="font-heading text-base text-forest mt-2 group-hover:text-green-600 transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
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
