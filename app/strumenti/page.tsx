import Link from 'next/link'
import { Navbar, Footer } from '@/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Strumenti Finanziari Gratuiti | Guida Patrimonio',
  description: 'Calcolatori finanziari gratuiti: interesse composto, PAC, mutuo, stipendio netto, FIRE, pensione e molto altro. Pianifica il tuo futuro finanziario.',
}

interface Tool {
  title: string
  description: string
  href: string
  icon: React.ReactNode
  external?: boolean
  isNew?: boolean
}

interface ToolCategory {
  title: string
  featured?: boolean
  tools: Tool[]
}

const toolCategories: ToolCategory[] = [
  {
    title: 'Intelligenza Artificiale',
    featured: true,
    tools: [
      {
        title: 'AI Wealth Advisor',
        description: 'Consulente patrimoniale virtuale basato su AI. Risposte immediate su fiscalita, successioni, trust e holding.',
        href: '/strumenti/ai-advisor',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        ),
        isNew: true,
      },
    ],
  },
  {
    title: 'Dashboard & Monitoraggio',
    tools: [
      {
        title: 'Dashboard Macro Italia',
        description: 'Spread BTP-Bund, tassi BCE, inflazione, FTSE MIB e cambi in tempo reale. Stile Bloomberg Terminal.',
        href: '/strumenti/dashboard-macro',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        isNew: true,
      },
    ],
  },
  {
    title: 'Investimenti',
    tools: [
      {
        title: 'Calcolatore Interesse Composto',
        description: 'Scopri come cresce il tuo capitale nel tempo grazie all\'interesse composto.',
        href: '/strumenti/interesse-composto',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        ),
      },
      {
        title: 'Simulatore PAC',
        description: 'Calcola quanto puoi accumulare con un Piano di Accumulo del Capitale.',
        href: '/strumenti/pac',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
      {
        title: 'Calcolatore Dividendi',
        description: 'Simula la rendita da azioni o ETF a dividendo e la crescita nel tempo.',
        href: '/strumenti/dividendi',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
      },
      {
        title: 'Calcolatore Inflazione',
        description: 'Scopri quanto vale oggi una somma del passato e quanto varrà in futuro.',
        href: '/strumenti/inflazione',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'Pianificazione',
    tools: [
      {
        title: 'Calcolatore FIRE',
        description: 'Financial Independence, Retire Early: calcola quando raggiungerai l\'indipendenza finanziaria.',
        href: '/strumenti/fire',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          </svg>
        ),
      },
      {
        title: 'Calcolatore Pensione',
        description: 'Stima quanto dovrai risparmiare per mantenere il tuo tenore di vita in pensione.',
        href: '/strumenti/pensione',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: 'Calcolatore Fondo Emergenza',
        description: 'Calcola quanto dovresti avere da parte per affrontare imprevisti senza stress.',
        href: '/strumenti/fondo-emergenza',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      },
      {
        title: 'Calcolatore Budget 50/30/20',
        description: 'Organizza le tue finanze con la regola del 50/30/20: necessità, desideri, risparmio.',
        href: '/strumenti/budget',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        ),
      },
      {
        title: 'Calcolatore Patrimonio Netto',
        description: 'Calcola il tuo patrimonio netto: attività meno passività.',
        href: '/strumenti/patrimonio-netto',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'Lavoro e Reddito',
    tools: [
      {
        title: 'Calcolatore Stipendio Netto',
        description: 'Converti la RAL in stipendio netto mensile con IRPEF, INPS e detrazioni.',
        href: '/strumenti/stipendio-netto',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
      },
      {
        title: 'Calcolatore TFR',
        description: 'Calcola il tuo TFR e confronta tenerlo in azienda vs fondo pensione.',
        href: '/strumenti/tfr',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'Prestiti e Debiti',
    tools: [
      {
        title: 'Calcolatore Mutuo',
        description: 'Calcola la rata del mutuo, gli interessi totali e il piano di ammortamento.',
        href: '/strumenti/mutuo',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
      },
      {
        title: 'Calcolatore Prestito',
        description: 'Calcola la rata e il costo totale di un prestito personale.',
        href: '/strumenti/prestito',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'Immobiliare',
    tools: [
      {
        title: 'Calcolo Plusvalenza Immobiliare',
        description: 'Calcola le tasse sulla vendita del tuo immobile e scopri se sei esente.',
        href: 'https://calcoloplusvalenza.it',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
        ),
        external: true,
      },
      {
        title: 'Calcolatore Rendita Immobiliare',
        description: 'Valuta il rendimento di un investimento immobiliare da mettere a reddito.',
        href: '/strumenti/rendita-immobiliare',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'Private Banking',
    tools: [
      {
        title: 'Confronto Private Banking Italia',
        description: 'Confronta le migliori private bank italiane e svizzere: soglie, commissioni, servizi e calcolatore costi.',
        href: '/strumenti/confronto-private-banking',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        isNew: true,
      },
      {
        title: 'Analizzatore Costi Private Banking',
        description: 'Scopri quanto ti costano realmente le commissioni e quanto potresti risparmiare.',
        href: '/strumenti/costi-private-banking',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
          </svg>
        ),
      },
      {
        title: 'Simulatore Family Office',
        description: 'Valuta se un Family Office ha senso per il tuo patrimonio e confronta i costi.',
        href: '/strumenti/family-office',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'Passaggio Generazionale',
    tools: [
      {
        title: 'Calcolatore Successione e Donazioni',
        description: 'Calcola le imposte di successione in Italia. Franchigie, aliquote e risparmio con polizze vita.',
        href: '/strumenti/successione',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
      },
      {
        title: 'Confronto Trust vs Donazione',
        description: 'Quale strumento scegliere per il passaggio generazionale? Analizza costi, protezione e flessibilita.',
        href: '/strumenti/trust-donazione',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        ),
      },
    ],
  },
  {
    title: 'Ottimizzazione Fiscale',
    tools: [
      {
        title: 'Simulatore Holding Company',
        description: 'Confronta persona fisica vs holding SRL. Regime PEX, break-even e proiezioni.',
        href: '/strumenti/holding',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        ),
      },
      {
        title: 'Calcolatore Flat Tax 100k',
        description: 'Regime forfettario per neo-residenti: confronta flat tax vs tassazione ordinaria.',
        href: '/strumenti/flat-tax-100k',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
          </svg>
        ),
      },
      {
        title: 'Pianificatore Exit Strategy',
        description: 'Vendita azienda: trade sale, MBO, IPO. Ottimizzazione fiscale con holding PEX.',
        href: '/strumenti/exit-strategy',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        ),
      },
      {
        title: 'Calcolatore IVAFE e IVIE',
        description: 'Calcola le imposte su investimenti e immobili all\'estero. Quadro RW incluso.',
        href: '/strumenti/ivafe-ivie',
        icon: (
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
      },
    ],
  },
]

export default function Strumenti() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-forest pt-navbar">
        <div className="container-custom py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="label text-green-300 mb-4">Strumenti Gratuiti</p>
            <h1 className="font-heading text-[36px] md:text-[48px] text-white leading-tight mb-6">
              Calcolatori Finanziari
            </h1>
            <p className="text-lg text-white/80">
              Oltre 20 strumenti gratuiti per pianificare il tuo futuro finanziario.
              Nessuna registrazione richiesta.
            </p>
          </div>
        </div>
      </section>

      {/* Tools by Category */}
      <section className="section-lg bg-cream">
        <div className="container-custom">
          {toolCategories.map((category) => (
            <div key={category.title} className="mb-12 last:mb-0">
              <h2 className="font-heading text-2xl text-forest mb-6">{category.title}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.title}
                    href={tool.href}
                    target={tool.external ? '_blank' : undefined}
                    rel={tool.external ? 'noopener noreferrer' : undefined}
                    className="group bg-white rounded-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                      {tool.icon}
                    </div>
                    <h3 className="font-heading text-xl text-forest mb-2 group-hover:text-green-600 transition-colors flex items-center gap-2">
                      {tool.title}
                      {tool.isNew && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                          NUOVO
                        </span>
                      )}
                      {tool.external && (
                        <svg className="w-4 h-4 inline opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                    </h3>
                    <p className="text-gray-500 text-sm">{tool.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section-md bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-h3-sm md:text-h3 text-white mb-4">
            Hai bisogno di una consulenza personalizzata?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            I calcolatori sono un buon punto di partenza, ma ogni situazione è unica.
            Parliamo del tuo caso specifico.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
