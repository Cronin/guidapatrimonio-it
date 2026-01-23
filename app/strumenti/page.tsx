import Link from 'next/link'
import { Navbar, Footer } from '@/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Strumenti Finanziari Gratuiti | Guida Patrimonio',
  description: 'Calcolatori finanziari gratuiti per pianificare investimenti, pensione, mutuo e ottimizzazione fiscale.',
}

interface Tool {
  title: string
  href: string
  external?: boolean
}

interface ToolCategory {
  title: string
  tools: Tool[]
}

const toolCategories: ToolCategory[] = [
  {
    title: 'Investimenti',
    tools: [
      { title: 'Interesse Composto', href: '/strumenti/interesse-composto' },
      { title: 'Simulatore PAC', href: '/strumenti/pac' },
      { title: 'Calcolatore Dividendi', href: '/strumenti/calcolatore-dividendi' },
      { title: 'Inflazione', href: '/strumenti/inflazione' },
      { title: 'Portfolio Rebalancer', href: '/strumenti/portfolio-rebalancer' },
      { title: 'Confronto ETF', href: '/strumenti/confronto-etf' },
    ],
  },
  {
    title: 'Pianificazione',
    tools: [
      { title: 'Calcolatore FIRE', href: '/strumenti/fire' },
      { title: 'Pensione', href: '/strumenti/pensione' },
      { title: 'Fondo Emergenza', href: '/strumenti/fondo-emergenza' },
      { title: 'Budget 50/30/20', href: '/strumenti/budget' },
      { title: 'Patrimonio Netto', href: '/strumenti/patrimonio-netto' },
    ],
  },
  {
    title: 'Lavoro',
    tools: [
      { title: 'Stipendio Netto', href: '/strumenti/stipendio-netto' },
      { title: 'Calcolatore TFR', href: '/strumenti/tfr' },
    ],
  },
  {
    title: 'Immobiliare',
    tools: [
      { title: 'Rendita Immobiliare', href: '/strumenti/rendita-immobiliare' },
      { title: 'Plusvalenza Immobiliare', href: 'https://calcoloplusvalenza.it', external: true },
      { title: 'Calcolatore Mutuo', href: '/strumenti/mutuo' },
    ],
  },
  {
    title: 'Fiscalità',
    tools: [
      { title: 'Holding Company', href: '/strumenti/holding' },
      { title: 'Flat Tax 100k', href: '/strumenti/flat-tax-100k' },
      { title: 'IVAFE e IVIE', href: '/strumenti/ivafe-ivie' },
      { title: 'Exit Strategy', href: '/strumenti/exit-strategy' },
    ],
  },
  {
    title: 'Patrimonio',
    tools: [
      { title: 'Successione e Donazioni', href: '/strumenti/successione' },
      { title: 'Trust vs Donazione', href: '/strumenti/trust-donazione' },
      { title: 'Family Office', href: '/strumenti/family-office' },
      { title: 'Costi Private Banking', href: '/strumenti/costi-private-banking' },
    ],
  },
]

export default function Strumenti() {
  return (
    <main>
      <Navbar />

      {/* Hero - Minimal */}
      <section className="bg-forest pt-navbar">
        <div className="container-custom py-20 md:py-28">
          <h1 className="font-heading text-[40px] md:text-[56px] text-white leading-tight max-w-xl">
            Strumenti finanziari gratuiti
          </h1>
          <p className="text-lg text-white/70 mt-6 max-w-md">
            Calcola, pianifica, ottimizza. Nessuna registrazione.
          </p>
        </div>
      </section>

      {/* Tools - Clean Grid */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            {toolCategories.map((category) => (
              <div key={category.title}>
                <h2 className="text-sm font-medium text-forest/50 uppercase tracking-wider mb-6">
                  {category.title}
                </h2>
                <ul className="space-y-4">
                  {category.tools.map((tool) => (
                    <li key={tool.title}>
                      <Link
                        href={tool.href}
                        target={tool.external ? '_blank' : undefined}
                        rel={tool.external ? 'noopener noreferrer' : undefined}
                        className="group flex items-center justify-between text-forest hover:text-green-600 transition-colors"
                      >
                        <span className="font-heading text-lg">{tool.title}</span>
                        <svg
                          className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Minimal */}
      <section className="bg-cream py-16 md:py-20">
        <div className="container-custom text-center">
          <p className="text-forest/60 mb-3">Situazione complessa?</p>
          <h2 className="font-heading text-2xl md:text-3xl text-forest mb-8">
            Parliamo del tuo caso specifico
          </h2>
          <Link
            href="/#contatti"
            className="inline-flex items-center gap-2 text-forest font-medium border-b-2 border-forest pb-1 hover:text-green-600 hover:border-green-600 transition-colors"
          >
            Richiedi consulenza gratuita
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
