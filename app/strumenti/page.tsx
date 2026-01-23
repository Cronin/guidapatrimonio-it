import Link from 'next/link'
import { Navbar, Footer, JsonLd, createToolListSchema, createBreadcrumbSchema } from '@/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Strumenti Finanziari GRATIS | Calcolatori Investimenti Italia',
  description: 'Calcolatori GRATIS: plusvalenze, minusvalenze, portfolio tracker, Monte Carlo, backtest portafoglio. Alternative gratuite a JustETF e Wallible.',
  keywords: ['calcolatore plusvalenze gratis', 'portfolio tracker gratis', 'calcolatore minusvalenze', 'simulatore monte carlo', 'backtest portafoglio', 'analizzatore costi fondi', 'strumenti investimento gratuiti', 'alternativa justetf gratis'],
  openGraph: {
    title: 'Strumenti Finanziari GRATIS | Calcolatori Investimenti',
    description: 'Portfolio tracker, calcolatore plusvalenze, simulatore Monte Carlo e 40+ strumenti gratuiti per investitori italiani.',
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
    title: 'Calcolatori Fiscali GRATIS',
    tools: [
      {
        title: 'Calcolatore Plusvalenze GRATIS',
        description: 'Calcola tasse su azioni, ETF, obbligazioni. Aliquote 26% e 12.5%.',
        href: '/strumenti/calcolatore-plusvalenze'
      },
      {
        title: 'Calcolatore Minusvalenze GRATIS',
        description: 'Gestisci zainetto fiscale, scadenze e compensazioni.',
        href: '/strumenti/calcolatore-minusvalenze'
      },
      {
        title: 'Tax Loss Harvesting',
        description: 'Ottimizza la compensazione tra plus e minusvalenze.',
        href: '/strumenti/tax-loss-harvesting'
      },
    ],
  },
  {
    title: 'Portfolio & Investimenti GRATIS',
    tools: [
      {
        title: 'Portfolio Tracker GRATIS',
        description: 'Traccia azioni, ETF, fondi. Calcola P&L e composizione.',
        href: '/strumenti/portfolio-tracker'
      },
      {
        title: 'Backtest Portafoglio GRATIS',
        description: 'Simula rendimenti storici. CAGR, Sharpe ratio, confronto benchmark.',
        href: '/strumenti/backtest-portafoglio'
      },
      {
        title: 'Simulatore Monte Carlo GRATIS',
        description: 'Simula 1000+ scenari. Probabilità di successo investimenti.',
        href: '/strumenti/simulatore-monte-carlo'
      },
      {
        title: 'Analizzatore Costi Fondi GRATIS',
        description: 'Calcola TER, commissioni nascoste e impatto sul rendimento.',
        href: '/strumenti/analizzatore-costi-fondi'
      },
      {
        title: 'Simulatore PAC',
        description: 'Piano di Accumulo Capitale. Crescita con interesse composto.',
        href: '/strumenti/pac'
      },
      {
        title: 'Calcolatore Dividendi',
        description: 'Calcola rendita da dividendi. Simulazione reinvestimento.',
        href: '/strumenti/calcolatore-dividendi'
      },
    ],
  },
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
        description: 'Top private bank italiane e svizzere. Soglie e costi.',
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
    title: 'Real Estate',
    tools: [
      {
        title: 'Aste Immobiliari Luxury',
        description: 'Ville, attici e immobili di pregio alle aste giudiziarie. Sconti fino al 40%.',
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
      {
        title: 'Proiezione Patrimoniale',
        description: 'Simulazione crescita a 10-20-30 anni.',
        href: '/strumenti/proiezione-patrimoniale'
      },
    ],
  },
]

export default function Strumenti() {
  // Flatten all tools for schema
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
            Per patrimoni importanti
          </p>
          <h1 className="font-heading text-[40px] md:text-[56px] text-white leading-tight max-w-2xl">
            Strumenti per chi investe seriamente
          </h1>
          <p className="text-lg text-white/50 mt-6 max-w-lg">
            Holding, trust, family office, fiscalità internazionale.
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
              Ogni grande patrimonio ha esigenze uniche.
            </p>
            <Link
              href="/#contatti"
              className="inline-flex items-center gap-2 bg-forest text-white px-6 py-3 rounded font-medium hover:bg-green-700 transition-colors"
            >
              Consulenza riservata
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
