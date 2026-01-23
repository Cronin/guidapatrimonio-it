import Link from 'next/link'
import { Navbar, Footer, JsonLd, createToolListSchema, createBreadcrumbSchema } from '@/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Strumenti Gestione Patrimonio HNWI | Guida Patrimonio',
  description: 'Simulatori per HNWI: holding, trust, family office, exit strategy, pianificazione successoria, ottimizzazione fiscale internazionale. Per patrimoni da €1M+.',
  keywords: ['gestione patrimonio', 'HNWI', 'family office', 'holding familiare', 'trust italia', 'pianificazione successoria', 'private banking', 'flat tax italia'],
  openGraph: {
    title: 'Strumenti per Gestione Grandi Patrimoni',
    description: 'Simulatori per holding, trust, family office, fiscalità internazionale. Per patrimoni oltre €1M.',
    type: 'website',
  },
}

interface Tool {
  title: string
  description: string
  href: string
}

interface ToolCategory {
  title: string
  tools: Tool[]
}

const toolCategories: ToolCategory[] = [
  {
    title: 'Strutture Societarie',
    tools: [
      {
        title: 'Simulatore Holding',
        description: 'Confronto persona fisica vs holding. Regime PEX, dividendi, exit.',
        href: '/strumenti/holding'
      },
      {
        title: 'Family Office Calculator',
        description: 'Analisi costi-benefici per patrimoni da €5M+.',
        href: '/strumenti/family-office'
      },
      {
        title: 'Exit Strategy Planner',
        description: 'Trade sale, MBO, IPO. Ottimizzazione fiscale con PEX.',
        href: '/strumenti/exit-strategy'
      },
    ],
  },
  {
    title: 'Passaggio Generazionale',
    tools: [
      {
        title: 'Trust vs Donazione',
        description: 'Protezione, controllo, fiscalità a confronto.',
        href: '/strumenti/trust-donazione'
      },
      {
        title: 'Pianificatore Successione',
        description: 'Imposte, franchigie, strategie di ottimizzazione.',
        href: '/strumenti/successione'
      },
    ],
  },
  {
    title: 'Fiscalità Internazionale',
    tools: [
      {
        title: 'Flat Tax Neo-Residenti',
        description: 'Regime €100k per redditi esteri. Simulazione risparmio.',
        href: '/strumenti/flat-tax-100k'
      },
      {
        title: 'IVAFE / IVIE Calculator',
        description: 'Imposte su asset esteri. Calcolo e ottimizzazione.',
        href: '/strumenti/ivafe-ivie'
      },
    ],
  },
  {
    title: 'Private Wealth',
    tools: [
      {
        title: 'Confronto Private Bank',
        description: 'Top private bank italiane e svizzere. Soglie, servizi, costi.',
        href: '/strumenti/confronto-private-banking'
      },
      {
        title: 'Fee Analyzer',
        description: 'Management fee, performance fee, costi nascosti.',
        href: '/strumenti/costi-private-banking'
      },
    ],
  },
  {
    title: 'Real Estate Premium',
    tools: [
      {
        title: 'Aste Immobiliari Luxury',
        description: 'Ville, attici e immobili di pregio alle aste giudiziarie.',
        href: '/strumenti/aste-immobiliari-luxury'
      },
      {
        title: 'Mercato Immobiliare Luxury',
        description: 'Prezzi al mq nelle zone premium italiane. Trend e analisi.',
        href: '/strumenti/mercato-immobiliare-luxury'
      },
      {
        title: 'Portafoglio Immobiliare',
        description: 'Ottimizzazione fiscale. Persona fisica vs società.',
        href: '/strumenti/portafoglio-immobiliare'
      },
    ],
  },
]

export default function Strumenti() {
  const allTools = toolCategories.flatMap(cat =>
    cat.tools.map(tool => ({
      name: tool.title,
      description: tool.description,
      url: `https://guidapatrimonio.it${tool.href}`,
    }))
  )

  const toolListSchema = createToolListSchema(allTools)
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: 'https://guidapatrimonio.it' },
    { name: 'Strumenti', url: 'https://guidapatrimonio.it/strumenti' },
  ])

  return (
    <main>
      <JsonLd data={[toolListSchema, breadcrumbSchema]} />
      <Navbar />

      {/* Hero */}
      <section className="bg-forest pt-navbar">
        <div className="container-custom py-20 md:py-28">
          <p className="text-green-300/60 text-sm font-medium tracking-wider uppercase mb-4">
            Per patrimoni oltre €1M
          </p>
          <h1 className="font-heading text-[40px] md:text-[56px] text-white leading-tight max-w-2xl">
            Strumenti per wealth management
          </h1>
          <p className="text-lg text-white/50 mt-6 max-w-lg">
            Holding, trust, family office, exit strategy, fiscalità internazionale.
          </p>
        </div>
      </section>

      {/* Tools */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-14">
            {toolCategories.map((category) => (
              <div key={category.title}>
                <h2 className="text-xs font-medium text-forest/40 uppercase tracking-wider mb-6">
                  {category.title}
                </h2>
                <ul className="space-y-5">
                  {category.tools.map((tool) => (
                    <li key={tool.title}>
                      <Link href={tool.href} className="group block">
                        <span className="font-heading text-lg text-forest group-hover:text-green-600 transition-colors">
                          {tool.title}
                        </span>
                        <p className="text-sm text-gray-400 mt-0.5">
                          {tool.description}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-16 md:py-20">
        <div className="container-custom">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-heading text-2xl md:text-3xl text-forest mb-4">
              Situazione complessa?
            </h2>
            <p className="text-gray-500 mb-8">
              Ogni grande patrimonio ha esigenze uniche. Parliamone.
            </p>
            <Link
              href="/#contatti"
              className="inline-flex items-center gap-2 bg-forest text-white px-6 py-3 rounded font-medium hover:bg-green-700 transition-colors"
            >
              Richiedi Consulenza Riservata
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
