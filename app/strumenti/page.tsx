import Link from 'next/link'
import Image from 'next/image'
import { Navbar, Footer, JsonLd, createToolListSchema, createBreadcrumbSchema } from '@/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Strumenti Finanziari GRATIS | Alternativa JustETF, Wallible, Sharesight',
  description: 'Alternative GRATUITE a JustETF, Wallible, Sharesight, TasseTrading. Portfolio tracker, calcolatore plusvalenze, Monte Carlo, backtest. Risparmia €60-360/anno.',
  keywords: [
    'alternativa justetf gratis',
    'wallible gratis',
    'sharesight alternativa',
    'portfolio tracker gratis italia',
    'calcolatore plusvalenze gratis',
    'tassetrading alternativa gratis',
    'backtest portafoglio gratis',
    'simulatore monte carlo gratis',
    'analizzatore costi fondi gratis',
    'calcolatore minusvalenze gratis'
  ],
  openGraph: {
    title: 'Strumenti Finanziari GRATIS | Alternative a Software a Pagamento',
    description: 'Portfolio tracker, calcolatore plusvalenze, Monte Carlo e 40+ strumenti gratuiti. Risparmia €60-360/anno rispetto a JustETF, Wallible, Sharesight.',
    type: 'website',
  },
}

interface Tool {
  title: string
  description: string
  href: string
  alternativeTo?: string
  alternativeLogo?: string
  savedCost?: string
}

interface ToolCategory {
  title: string
  tools: Tool[]
}

// Software a pagamento che replichiamo
const paidAlternatives = [
  {
    name: 'JustETF Premium',
    logo: '/competitors/justetf.png',
    cost: '€60-240/anno',
    ourTool: 'Portfolio Tracker + Confronto ETF',
    href: '/strumenti/portfolio-tracker'
  },
  {
    name: 'Wallible Pro',
    logo: '/competitors/wallible.png',
    cost: '€59.90/anno',
    ourTool: 'Portfolio Tracker + Backtest',
    href: '/strumenti/portfolio-tracker'
  },
  {
    name: 'Sharesight',
    logo: '/competitors/sharesight.png',
    cost: '$276/anno',
    ourTool: 'Portfolio Tracker + Calcolatore Plusvalenze',
    href: '/strumenti/calcolatore-plusvalenze'
  },
  {
    name: 'TasseTrading',
    logo: '/competitors/tassetrading.png',
    cost: '€50-200/pratica',
    ourTool: 'Calcolatore Plusvalenze + Minusvalenze',
    href: '/strumenti/calcolatore-plusvalenze'
  },
  {
    name: 'Portfolio Visualizer',
    logo: '/competitors/portfoliovisualizer.png',
    cost: '$360/anno',
    ourTool: 'Backtest + Monte Carlo',
    href: '/strumenti/backtest-portafoglio'
  },
  {
    name: 'Kubera',
    logo: '/competitors/kubera.png',
    cost: '$249-360/anno',
    ourTool: 'Portfolio Tracker + Patrimonio Netto',
    href: '/strumenti/portfolio-tracker'
  },
]

const toolCategories: ToolCategory[] = [
  {
    title: 'Calcolatori Fiscali GRATIS',
    tools: [
      {
        title: 'Calcolatore Plusvalenze GRATIS',
        description: 'Calcola tasse su azioni, ETF, obbligazioni. Aliquote 26% e 12.5%. Alternativa a TasseTrading.',
        href: '/strumenti/calcolatore-plusvalenze',
        alternativeTo: 'TasseTrading',
        alternativeLogo: '/competitors/tassetrading.png',
        savedCost: '€50-200'
      },
      {
        title: 'Calcolatore Minusvalenze GRATIS',
        description: 'Gestisci zainetto fiscale, scadenze 4 anni e compensazioni FIFO.',
        href: '/strumenti/calcolatore-minusvalenze',
        alternativeTo: 'TasseTrading',
        alternativeLogo: '/competitors/tassetrading.png',
        savedCost: '€50-200'
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
        description: 'Traccia azioni, ETF, fondi. Calcola P&L. Alternativa a JustETF, Wallible, Sharesight.',
        href: '/strumenti/portfolio-tracker',
        alternativeTo: 'JustETF/Wallible',
        alternativeLogo: '/competitors/justetf.png',
        savedCost: '€60-276'
      },
      {
        title: 'Backtest Portafoglio GRATIS',
        description: 'Rendimenti storici, CAGR, Sharpe ratio. Alternativa a Portfolio Visualizer.',
        href: '/strumenti/backtest-portafoglio',
        alternativeTo: 'Portfolio Visualizer',
        alternativeLogo: '/competitors/portfoliovisualizer.png',
        savedCost: '$360'
      },
      {
        title: 'Simulatore Monte Carlo GRATIS',
        description: 'Simula 1000+ scenari probabilistici. Alternativa a Portfolio Visualizer.',
        href: '/strumenti/simulatore-monte-carlo',
        alternativeTo: 'Portfolio Visualizer',
        alternativeLogo: '/competitors/portfoliovisualizer.png',
        savedCost: '$360'
      },
      {
        title: 'Analizzatore Costi Fondi GRATIS',
        description: 'Calcola TER, commissioni nascoste. Confronta fino a 3 fondi.',
        href: '/strumenti/analizzatore-costi-fondi'
      },
      {
        title: 'Confronto ETF',
        description: 'Confronta ETF per TER, AUM, replica. Come JustETF ma gratis.',
        href: '/strumenti/confronto-etf',
        alternativeTo: 'JustETF Premium',
        alternativeLogo: '/competitors/justetf.png',
        savedCost: '€60-240'
      },
      {
        title: 'Simulatore PAC',
        description: 'Piano di Accumulo con interesse composto e tassazione italiana.',
        href: '/strumenti/pac'
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
            100% Gratuiti - Risparmia fino a €360/anno
          </p>
          <h1 className="font-heading text-[40px] md:text-[56px] text-white leading-tight max-w-2xl">
            Alternative gratuite a JustETF, Wallible e Sharesight
          </h1>
          <p className="text-lg text-white/50 mt-6 max-w-lg">
            Portfolio tracker, calcolatore plusvalenze, simulatore Monte Carlo e 40+ strumenti professionali. Gratis.
          </p>
        </div>
      </section>

      {/* Tabella confronto software a pagamento */}
      <section className="bg-amber-50 py-12 border-b border-amber-200">
        <div className="container-custom">
          <h2 className="font-heading text-2xl text-forest mb-6 text-center">
            Quanto risparmi con i nostri strumenti gratuiti?
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-4 px-4 font-medium text-gray-600">Software a Pagamento</th>
                  <th className="text-left py-4 px-4 font-medium text-gray-600">Costo</th>
                  <th className="text-left py-4 px-4 font-medium text-gray-600">Nostra Alternativa Gratis</th>
                  <th className="text-center py-4 px-4 font-medium text-gray-600">Risparmio</th>
                </tr>
              </thead>
              <tbody>
                {paidAlternatives.map((alt, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={alt.logo}
                          alt={alt.name}
                          width={24}
                          height={24}
                          className="rounded"
                        />
                        <span className="font-medium text-gray-800">{alt.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-red-600 font-medium line-through">{alt.cost}</td>
                    <td className="py-4 px-4">
                      <Link href={alt.href} className="text-green-600 hover:text-green-700 font-medium">
                        {alt.ourTool} →
                      </Link>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        GRATIS
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-gray-500 text-sm mt-4">
            I prezzi indicati sono quelli pubblicati sui siti ufficiali dei rispettivi software (gennaio 2026)
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
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-heading text-lg text-forest group-hover:text-green-600 transition-colors">
                            {tool.title}
                          </span>
                          {tool.alternativeTo && (
                            <span className="inline-flex items-center gap-1.5 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              <span>vs</span>
                              {tool.alternativeLogo && (
                                <Image
                                  src={tool.alternativeLogo}
                                  alt={tool.alternativeTo}
                                  width={16}
                                  height={16}
                                  className="rounded-sm"
                                />
                              )}
                              <span>{tool.alternativeTo}</span>
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mt-0.5">
                          {tool.description}
                        </p>
                        {tool.savedCost && (
                          <p className="text-xs text-green-600 mt-1">
                            Risparmia {tool.savedCost}/anno
                          </p>
                        )}
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
          <div className="max-w-3xl mx-auto prose prose-sm">
            <h2 className="font-heading text-xl text-forest">Perché offriamo questi strumenti gratis?</h2>
            <p className="text-gray-600">
              Crediamo che gli strumenti finanziari di base debbano essere accessibili a tutti gli investitori italiani,
              non solo a chi può permettersi abbonamenti da €60-360 all&apos;anno. I nostri calcolatori sono progettati
              specificamente per la <strong>fiscalità italiana</strong> (aliquote 26% e 12.5%, regime amministrato vs dichiarativo,
              compensazione minusvalenze).
            </p>
            <h3 className="font-heading text-lg text-forest mt-6">Alternative gratuite ai software più popolari</h3>
            <ul className="text-gray-600 space-y-2">
              <li><strong>Alternativa a JustETF Premium:</strong> Il nostro Portfolio Tracker e Confronto ETF offrono funzionalità simili senza abbonamento.</li>
              <li><strong>Alternativa a Wallible Pro:</strong> Portfolio Tracker con import posizioni e calcolo P&L in tempo reale.</li>
              <li><strong>Alternativa a Sharesight:</strong> Calcolatore Plusvalenze ottimizzato per la fiscalità italiana, non australiana.</li>
              <li><strong>Alternativa a TasseTrading:</strong> Calcola plusvalenze e minusvalenze senza pagare €50-200 per pratica.</li>
              <li><strong>Alternativa a Portfolio Visualizer:</strong> Backtest e Monte Carlo con 1000+ simulazioni.</li>
            </ul>
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
