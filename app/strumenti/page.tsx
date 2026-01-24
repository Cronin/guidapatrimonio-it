import Link from 'next/link'
import { Navbar, Footer, JsonLd, createToolListSchema, createBreadcrumbSchema } from '@/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Strumenti Patrimoniali Professionali | Guida Patrimonio',
  description: 'Suite completa di 40+ strumenti per la gestione patrimoniale: portfolio tracker, calcolatore plusvalenze, simulatore Monte Carlo, pianificazione successoria. Valore €890/anno.',
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
    title: 'Suite Strumenti Patrimoniali | Valore €890/anno',
    description: 'Portfolio tracker, calcolatore fiscale, Monte Carlo e 40+ strumenti professionali. Accesso gratuito per gli utenti registrati.',
    type: 'website',
  },
}

interface Tool {
  title: string
  description: string
  href: string
  price: number
  featured?: boolean
}

interface ToolCategory {
  title: string
  tools: Tool[]
}

// Mese corrente per offerta dinamica
const currentMonth = new Date().toLocaleDateString('it-IT', { month: 'long' })

const toolCategories: ToolCategory[] = [
  {
    title: 'Calcolatori Fiscali',
    tools: [
      {
        title: 'Calcolatore Plusvalenze',
        description: 'Calcola tasse su azioni, ETF, obbligazioni. Aliquote 26% e 12.5%. Fiscalità italiana.',
        href: '/strumenti/calcolatore-plusvalenze',
        price: 49,
        featured: true
      },
      {
        title: 'Calcolatore Minusvalenze',
        description: 'Gestisci zainetto fiscale, scadenze 4 anni e compensazioni FIFO.',
        href: '/strumenti/calcolatore-minusvalenze',
        price: 39
      },
      {
        title: 'Tax Loss Harvesting',
        description: 'Ottimizza la compensazione tra plus e minusvalenze.',
        href: '/strumenti/tax-loss-harvesting',
        price: 29
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
        price: 89,
        featured: true
      },
      {
        title: 'Backtest Portafoglio',
        description: 'Rendimenti storici, CAGR, Sharpe ratio, drawdown analysis.',
        href: '/strumenti/backtest-portafoglio',
        price: 69,
        featured: true
      },
      {
        title: 'Simulatore Monte Carlo',
        description: 'Simula 10.000+ scenari probabilistici per proiezioni realistiche.',
        href: '/strumenti/simulatore-monte-carlo',
        price: 59,
        featured: true
      },
      {
        title: 'Analizzatore Costi Fondi',
        description: 'Calcola TER, commissioni nascoste. Confronta fino a 3 fondi.',
        href: '/strumenti/analizzatore-costi-fondi',
        price: 29
      },
      {
        title: 'Confronto ETF',
        description: 'Confronta ETF per TER, AUM, replica, tracking difference.',
        href: '/strumenti/confronto-etf',
        price: 39
      },
      {
        title: 'Simulatore PAC',
        description: 'Piano di Accumulo con interesse composto e tassazione italiana.',
        href: '/strumenti/pac',
        price: 19
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
        price: 79,
        featured: true
      },
      {
        title: 'Family Office Calculator',
        description: 'Analisi costi-benefici per patrimoni da €5M+.',
        href: '/strumenti/family-office',
        price: 89
      },
      {
        title: 'Exit Strategy Planner',
        description: 'Trade sale, MBO, IPO. Ottimizzazione fiscale con PEX.',
        href: '/strumenti/exit-strategy',
        price: 69
      },
    ],
  },
  {
    title: 'Passaggio Generazionale',
    tools: [
      {
        title: 'Trust vs Donazione',
        description: 'Protezione, controllo, fiscalità a confronto.',
        href: '/strumenti/trust-donazione',
        price: 59
      },
      {
        title: 'Pianificatore Successione',
        description: 'Imposte, franchigie, strategie di ottimizzazione.',
        href: '/strumenti/successione',
        price: 69,
        featured: true
      },
    ],
  },
  {
    title: 'Fiscalità Internazionale',
    tools: [
      {
        title: 'Flat Tax Neo-Residenti',
        description: 'Regime €100k per redditi esteri. Simulazione risparmio.',
        href: '/strumenti/flat-tax-100k',
        price: 49
      },
      {
        title: 'IVAFE / IVIE Calculator',
        description: 'Imposte su asset esteri. Calcolo e ottimizzazione.',
        href: '/strumenti/ivafe-ivie',
        price: 39
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
        price: 49
      },
      {
        title: 'Fee Analyzer',
        description: 'Management fee, performance fee, costi nascosti.',
        href: '/strumenti/costi-private-banking',
        price: 29
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
        price: 39
      },
      {
        title: 'Mercato Immobiliare Luxury',
        description: 'Prezzi al mq nelle zone premium italiane. Trend e analisi.',
        href: '/strumenti/mercato-immobiliare-luxury',
        price: 49
      },
      {
        title: 'Portafoglio Immobiliare',
        description: 'Ottimizzazione fiscale. Persona fisica vs società.',
        href: '/strumenti/portafoglio-immobiliare',
        price: 59
      },
    ],
  },
]

// Calcola valore totale e prezzo abbonamento
const totalValue = toolCategories.reduce((sum, cat) =>
  sum + cat.tools.reduce((catSum, tool) => catSum + tool.price, 0), 0
)
const subscriptionPrice = Math.round(totalValue / 3)

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
          <div className="inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
            Solo per {currentMonth}: accesso completo gratuito
          </div>
          <h1 className="font-heading text-[40px] md:text-[56px] text-white leading-tight max-w-2xl">
            40+ strumenti professionali per la gestione patrimoniale
          </h1>
          <p className="text-lg text-white/70 mt-6 max-w-lg">
            Portfolio tracker, simulatori fiscali, pianificazione successoria.
            Una suite completa per chi gestisce patrimoni importanti.
          </p>

          {/* Pricing */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-white/50 line-through text-2xl">€{totalValue}</span>
              <span className="font-heading text-4xl text-white">€{subscriptionPrice}</span>
              <span className="text-white/70">/anno</span>
            </div>
            <p className="text-white/50 text-sm mb-4">
              Abbonamento annuale per tutti gli strumenti
            </p>
            <div className="bg-gold/20 rounded px-3 py-2 mb-4">
              <p className="text-gold text-sm font-medium">
                🎁 Solo per {currentMonth}: registrati e ottieni accesso gratuito per sempre
              </p>
            </div>
            <Link
              href="/#contatti"
              className="inline-flex items-center justify-center gap-2 bg-white text-forest px-6 py-3 rounded font-semibold hover:bg-gray-100 transition-colors w-full"
            >
              Registrati Gratis
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="bg-cream py-12 border-b border-gray-200">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-heading text-3xl text-forest">€{totalValue}</p>
              <p className="text-gray-500 text-sm mt-1">Valore totale della suite</p>
            </div>
            <div>
              <p className="font-heading text-3xl text-forest">{toolCategories.reduce((sum, cat) => sum + cat.tools.length, 0)}</p>
              <p className="text-gray-500 text-sm mt-1">Strumenti professionali</p>
            </div>
            <div>
              <p className="font-heading text-3xl text-green-600">€0</p>
              <p className="text-gray-500 text-sm mt-1">Per sempre se ti registri in {currentMonth}</p>
            </div>
          </div>
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
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-heading text-lg text-forest group-hover:text-green-600 transition-colors">
                            {tool.title}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            €{tool.price}
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
            <h2 className="font-heading text-xl text-forest mb-4">Perché strumenti da €{totalValue} sono gratuiti?</h2>
            <p className="text-gray-600 mb-4">
              Gestiamo patrimoni significativi e crediamo che la fiducia si costruisca con i fatti, non con le promesse.
              Questi strumenti professionali sono il nostro biglietto da visita: <strong>prima dimostriamo competenza,
              poi parliamo di collaborazione</strong>.
            </p>
            <p className="text-gray-600 mb-6">
              I nostri calcolatori sono progettati specificamente per la <strong>fiscalità italiana e svizzera</strong> e per le
              esigenze di chi gestisce patrimoni importanti. Holding, trust, successioni, fiscalità internazionale:
              ogni strumento riflette la complessità che affrontiamo quotidianamente con i nostri clienti.
            </p>
            <h3 className="font-heading text-lg text-forest mt-6 mb-3">Cosa include la suite completa</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Portfolio Tracker Pro</strong> — allocazione, benchmark, export (€89)</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Simulatore Holding</strong> — confronto PF vs società (€79)</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>Simulatore Monte Carlo</strong> — 10.000 scenari (€59)</span>
              </div>
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span><strong>+ altri 37 strumenti</strong> — fiscalità, successioni, real estate</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest py-16 md:py-20">
        <div className="container-custom">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-gold text-sm font-medium mb-4">Offerta limitata</p>
            <h2 className="font-heading text-2xl md:text-3xl text-white mb-4">
              Registrati ora, accesso gratuito per sempre
            </h2>
            <p className="text-white/60 mb-8">
              Chi si registra entro {currentMonth} mantiene l&apos;accesso a tutti gli strumenti
              senza costi, anche quando introdurremo i piani a pagamento.
            </p>
            <Link
              href="/#contatti"
              className="inline-flex items-center gap-2 bg-white text-forest px-8 py-4 rounded font-semibold hover:bg-gray-100 transition-colors"
            >
              Registrati Gratuitamente
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
