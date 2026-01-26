import Link from 'next/link'
import { Navbar, Footer, JsonLd, createToolListSchema, createBreadcrumbSchema } from '@/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Strumenti Patrimoniali Professionali | Guida Patrimonio',
  description: 'Suite completa di 40+ strumenti per la gestione patrimoniale: portfolio tracker, calcolatore plusvalenze, simulatore Monte Carlo, pianificazione successoria.',
  keywords: [
    'strumenti gestione patrimonio',
    'portfolio tracker professionale',
    'calcolatore plusvalenze italia',
    'simulatore monte carlo portafoglio',
    'pianificazione successoria',
    'holding familiare simulatore',
    'trust donazione confronto',
    'private banking confronto'
  ],
  openGraph: {
    title: 'Suite Strumenti Patrimoniali Professionali',
    description: 'Portfolio tracker, calcolatore fiscale, Monte Carlo e 40+ strumenti professionali per la gestione di patrimoni importanti.',
    type: 'website',
  },
}

interface Tool {
  title: string
  description: string
  href: string
  featured?: boolean
}

interface ToolCategory {
  title: string
  tools: Tool[]
}

const toolCategories: ToolCategory[] = [
  {
    title: 'Calcolatori Fiscali',
    tools: [
      {
        title: 'Calcolatore Plusvalenze',
        description: 'Calcola tasse su azioni, ETF, obbligazioni. Aliquote 26% e 12.5%. Fiscalita italiana.',
        href: '/strumenti/calcolatore-plusvalenze',
        featured: true
      },
      {
        title: 'Calcolatore Minusvalenze',
        description: 'Gestisci zainetto fiscale, scadenze 4 anni e compensazioni FIFO.',
        href: '/strumenti/calcolatore-minusvalenze',
      },
      {
        title: 'Tax Loss Harvesting',
        description: 'Ottimizza la compensazione tra plus e minusvalenze.',
        href: '/strumenti/tax-loss-harvesting',
      },
    ],
  },
  {
    title: 'Portfolio & Investimenti',
    tools: [
      {
        title: 'Portfolio Tracker Pro',
        description: 'Traccia azioni, ETF, fondi. Calcola P&L, allocazione, performance vs benchmark.',
        href: '/strumenti/portfolio-tracker',
        featured: true
      },
      {
        title: 'Backtest Portafoglio',
        description: 'Rendimenti storici, CAGR, Sharpe ratio, drawdown analysis.',
        href: '/strumenti/backtest-portafoglio',
        featured: true
      },
      {
        title: 'Simulatore Monte Carlo',
        description: 'Simula 10.000+ scenari probabilistici per proiezioni realistiche.',
        href: '/strumenti/simulatore-monte-carlo',
        featured: true
      },
      {
        title: 'Analizzatore Costi Fondi',
        description: 'Calcola TER, commissioni nascoste. Confronta fino a 3 fondi.',
        href: '/strumenti/analizzatore-costi-fondi',
      },
      {
        title: 'Confronto ETF',
        description: 'Confronta ETF per TER, AUM, replica, tracking difference.',
        href: '/strumenti/confronto-etf',
      },
      {
        title: 'Simulatore PAC',
        description: 'Piano di Accumulo con interesse composto e tassazione italiana.',
        href: '/strumenti/pac',
      },
    ],
  },
  {
    title: 'Strutture Societarie',
    tools: [
      {
        title: 'Simulatore Holding',
        description: 'Confronto persona fisica vs holding. Regime PEX, dividendi, exit.',
        href: '/strumenti/holding',
        featured: true
      },
      {
        title: 'Family Office Calculator',
        description: 'Analisi costi-benefici per patrimoni da 5M+.',
        href: '/strumenti/family-office',
      },
      {
        title: 'Exit Strategy Planner',
        description: 'Trade sale, MBO, IPO. Ottimizzazione fiscale con PEX.',
        href: '/strumenti/exit-strategy',
      },
    ],
  },
  {
    title: 'Passaggio Generazionale',
    tools: [
      {
        title: 'Trust vs Donazione',
        description: 'Protezione, controllo, fiscalita a confronto.',
        href: '/strumenti/trust-donazione',
      },
      {
        title: 'Pianificatore Successione',
        description: 'Imposte, franchigie, strategie di ottimizzazione.',
        href: '/strumenti/successione',
        featured: true
      },
    ],
  },
  {
    title: 'Fiscalita Internazionale',
    tools: [
      {
        title: 'Flat Tax Neo-Residenti',
        description: 'Regime 100k per redditi esteri. Simulazione risparmio.',
        href: '/strumenti/flat-tax-100k',
      },
      {
        title: 'IVAFE / IVIE Calculator',
        description: 'Imposte su asset esteri. Calcolo e ottimizzazione.',
        href: '/strumenti/ivafe-ivie',
      },
    ],
  },
  {
    title: 'Private Wealth',
    tools: [
      {
        title: 'Confronto Private Bank',
        description: 'Top private bank italiane e svizzere. Soglie, servizi, costi.',
        href: '/strumenti/confronto-private-banking',
      },
      {
        title: 'Fee Analyzer',
        description: 'Management fee, performance fee, costi nascosti.',
        href: '/strumenti/costi-private-banking',
      },
    ],
  },
  {
    title: 'Real Estate Premium',
    tools: [
      {
        title: 'Aste Immobiliari Luxury',
        description: 'Ville, attici e immobili di pregio alle aste giudiziarie.',
        href: '/strumenti/aste-immobiliari-luxury',
      },
      {
        title: 'Mercato Immobiliare Luxury',
        description: 'Prezzi al mq nelle zone premium italiane. Trend e analisi.',
        href: '/strumenti/mercato-immobiliare-luxury',
      },
      {
        title: 'Portafoglio Immobiliare',
        description: 'Ottimizzazione fiscale. Persona fisica vs societa.',
        href: '/strumenti/portafoglio-immobiliare',
      },
    ],
  },
]

const totalTools = toolCategories.reduce((sum, cat) => sum + cat.tools.length, 0)

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
      <section className="bg-navy pt-navbar">
        <div className="container-custom py-20 md:py-28">
          <p className="text-gold font-medium text-sm tracking-wider uppercase mb-4">
            {totalTools} Strumenti Professionali
          </p>
          <h1 className="font-heading text-[40px] md:text-[56px] text-white leading-tight max-w-2xl">
            Strumenti per la gestione patrimoniale
          </h1>
          <p className="text-lg text-white/70 mt-6 max-w-lg">
            Portfolio tracker, simulatori fiscali, pianificazione successoria.
            Una suite completa per chi gestisce patrimoni importanti.
          </p>
          <div className="mt-8">
            <Link
              href="/#contatti"
              className="inline-flex items-center justify-center gap-2 bg-gold text-navy px-6 py-3 rounded font-semibold hover:bg-gold-light transition-colors"
            >
              Richiedi una Consulenza
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-14">
            {toolCategories.map((category) => (
              <div key={category.title}>
                <h2 className="text-xs font-medium text-navy/40 uppercase tracking-wider mb-6">
                  {category.title}
                </h2>
                <ul className="space-y-5">
                  {category.tools.map((tool) => (
                    <li key={tool.title}>
                      <Link href={tool.href} className="group block">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-heading text-lg text-navy group-hover:text-gold transition-colors">
                            {tool.title}
                          </span>
                          {tool.featured && (
                            <span className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded">
                              Pro
                            </span>
                          )}
                        </div>
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

      {/* SEO Text Section */}
      <section className="bg-gray-50 py-12">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-xl text-navy mb-4">Perche offriamo questi strumenti</h2>
            <p className="text-gray-600 mb-4">
              Gestiamo patrimoni significativi e crediamo che la fiducia si costruisca con i fatti, non con le promesse.
              Questi strumenti professionali sono il nostro biglietto da visita: <strong>prima dimostriamo competenza,
              poi parliamo di collaborazione</strong>.
            </p>
            <p className="text-gray-600 mb-6">
              I nostri calcolatori sono progettati specificamente per la <strong>fiscalita italiana e svizzera</strong> e per le
              esigenze di chi gestisce patrimoni importanti. Holding, trust, successioni, fiscalita internazionale:
              ogni strumento riflette la complessita che affrontiamo quotidianamente con i nostri clienti.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy py-16 md:py-20">
        <div className="container-custom">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-gold text-sm font-medium mb-4">Patrimoni oltre 150K</p>
            <h2 className="font-heading text-2xl md:text-3xl text-white mb-4">
              Vuoi una consulenza personalizzata?
            </h2>
            <p className="text-white/60 mb-8">
              Parla con un esperto per capire come ottimizzare la gestione del tuo patrimonio
              con il supporto dei nostri partner internazionali.
            </p>
            <Link
              href="/#contatti"
              className="inline-flex items-center gap-2 bg-gold text-navy px-8 py-4 rounded font-semibold hover:bg-gold-light transition-colors"
            >
              Richiedi Callback Gratuito
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
