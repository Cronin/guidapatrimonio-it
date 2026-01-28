import Link from 'next/link'

interface RelatedTool {
  title: string
  description: string
  href: string
  icon: 'chart' | 'building' | 'shield' | 'calculator' | 'family' | 'globe' | 'home' | 'money' | 'briefcase' | 'scale' | 'yacht'
}

interface RelatedToolsProps {
  tools: RelatedTool[]
  title?: string
}

const iconMap = {
  chart: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  ),
  building: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  calculator: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  family: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  ),
  globe: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  money: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  briefcase: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  scale: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
    </svg>
  ),
  yacht: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 17h18M5 17l2-7h10l2 7M12 3v7m-4-3l4 3 4-3" />
    </svg>
  ),
}

// Tool correlations map
export const toolCorrelations: Record<string, RelatedTool[]> = {
  holding: [
    { title: 'Trust vs Donazione', description: 'Protezione patrimoniale e passaggio generazionale', href: '/strumenti/trust-donazione', icon: 'shield' },
    { title: 'Exit Strategy', description: 'Pianifica la vendita con ottimizzazione PEX', href: '/strumenti/exit-strategy', icon: 'briefcase' },
    { title: 'Family Office', description: 'Confronto costi gestione patrimoni UHNWI', href: '/strumenti/family-office', icon: 'family' },
    { title: 'Patrimonio Netto', description: 'Calcola il valore del tuo patrimonio', href: '/strumenti/patrimonio-netto', icon: 'calculator' },
  ],
  'trust-donazione': [
    { title: 'Successione', description: 'Calcola le imposte di successione', href: '/strumenti/successione', icon: 'scale' },
    { title: 'Simulatore Holding', description: 'Struttura societaria per protezione', href: '/strumenti/holding', icon: 'building' },
    { title: 'Family Office', description: 'Gestione patrimoni familiari', href: '/strumenti/family-office', icon: 'family' },
    { title: 'Portafoglio Immobiliare', description: 'Ottimizzazione fiscale immobili', href: '/strumenti/portafoglio-immobiliare', icon: 'home' },
  ],
  successione: [
    { title: 'Trust vs Donazione', description: 'Confronto strumenti passaggio generazionale', href: '/strumenti/trust-donazione', icon: 'shield' },
    { title: 'Simulatore Holding', description: 'Strutture per la continuita aziendale', href: '/strumenti/holding', icon: 'building' },
    { title: 'Patrimonio Netto', description: 'Valuta il patrimonio da trasferire', href: '/strumenti/patrimonio-netto', icon: 'calculator' },
    { title: 'Proiezione Patrimoniale', description: 'Simula la crescita nel tempo', href: '/strumenti/proiezione-patrimoniale', icon: 'chart' },
  ],
  'family-office': [
    { title: 'Simulatore Holding', description: 'Struttura societaria ottimale', href: '/strumenti/holding', icon: 'building' },
    { title: 'Confronto Private Banking', description: 'Top private bank a confronto', href: '/strumenti/confronto-private-banking', icon: 'money' },
    { title: 'Patrimonio Netto', description: 'Calcola il tuo patrimonio complessivo', href: '/strumenti/patrimonio-netto', icon: 'calculator' },
    { title: 'Trust vs Donazione', description: 'Pianificazione successoria', href: '/strumenti/trust-donazione', icon: 'shield' },
  ],
  'exit-strategy': [
    { title: 'Simulatore Holding', description: 'Ottimizza con regime PEX', href: '/strumenti/holding', icon: 'building' },
    { title: 'FIRE Calculator', description: 'Indipendenza finanziaria post-exit', href: '/strumenti/fire', icon: 'chart' },
    { title: 'Proiezione Patrimoniale', description: 'Simula il patrimonio futuro', href: '/strumenti/proiezione-patrimoniale', icon: 'calculator' },
    { title: 'Family Office', description: 'Gestisci il patrimonio post-exit', href: '/strumenti/family-office', icon: 'family' },
  ],
  'dashboard-macro': [
    { title: 'Scala Obbligazionaria', description: 'Costruisci una bond ladder BTP', href: '/strumenti/scala-obbligazionaria', icon: 'chart' },
    { title: 'Confronto ETF', description: 'Analizza e confronta ETF', href: '/strumenti/confronto-etf', icon: 'scale' },
    { title: 'Inflazione', description: 'Calcola impatto inflazione', href: '/strumenti/inflazione', icon: 'calculator' },
    { title: 'Interesse Composto', description: 'Proiezione rendimenti', href: '/strumenti/interesse-composto', icon: 'money' },
  ],
  'mercato-immobiliare-luxury': [
    { title: 'Aste Immobiliari Luxury', description: 'Ville e attici alle aste giudiziarie', href: '/strumenti/aste-immobiliari-luxury', icon: 'home' },
    { title: 'Portafoglio Immobiliare', description: 'Ottimizza la fiscalita immobiliare', href: '/strumenti/portafoglio-immobiliare', icon: 'building' },
    { title: 'Rendita Immobiliare', description: 'Calcola il rendimento da affitto', href: '/strumenti/rendita-immobiliare', icon: 'money' },
    { title: 'Immobiliare vs Azioni', description: 'Confronto asset class', href: '/strumenti/immobiliare-vs-azioni', icon: 'scale' },
  ],
  'aste-immobiliari-luxury': [
    { title: 'Mercato Immobiliare Luxury', description: 'Prezzi zone premium italiane', href: '/strumenti/mercato-immobiliare-luxury', icon: 'home' },
    { title: 'Portafoglio Immobiliare', description: 'Struttura fiscale ottimale', href: '/strumenti/portafoglio-immobiliare', icon: 'building' },
    { title: 'Mutuo', description: 'Calcola rata e sostenibilita', href: '/strumenti/mutuo', icon: 'calculator' },
    { title: 'Rendita Immobiliare', description: 'ROI da affitto', href: '/strumenti/rendita-immobiliare', icon: 'money' },
  ],
  'confronto-private-banking': [
    { title: 'Family Office', description: 'Alternative per grandi patrimoni', href: '/strumenti/family-office', icon: 'family' },
    { title: 'Costi Private Banking', description: 'Analisi fee e costi nascosti', href: '/strumenti/costi-private-banking', icon: 'calculator' },
    { title: 'Patrimonio Netto', description: 'Valuta se raggiungi le soglie', href: '/strumenti/patrimonio-netto', icon: 'money' },
    { title: 'Confronto ETF', description: 'Alternative low-cost', href: '/strumenti/confronto-etf', icon: 'chart' },
  ],
  'patrimonio-netto': [
    { title: 'Proiezione Patrimoniale', description: 'Simula crescita futura', href: '/strumenti/proiezione-patrimoniale', icon: 'chart' },
    { title: 'FIRE Calculator', description: 'Quanto ti serve per il FIRE?', href: '/strumenti/fire', icon: 'calculator' },
    { title: 'Family Office', description: 'Opzioni per grandi patrimoni', href: '/strumenti/family-office', icon: 'family' },
    { title: 'Successione', description: 'Pianifica il passaggio generazionale', href: '/strumenti/successione', icon: 'scale' },
  ],
  fire: [
    { title: 'Interesse Composto', description: 'Calcola crescita investimenti', href: '/strumenti/interesse-composto', icon: 'chart' },
    { title: 'Tasso Prelievo Sicuro', description: 'Safe withdrawal rate ottimale', href: '/strumenti/tasso-prelievo-sicuro', icon: 'calculator' },
    { title: 'Patrimonio Netto', description: 'Calcola il tuo patrimonio attuale', href: '/strumenti/patrimonio-netto', icon: 'money' },
    { title: 'PAC', description: 'Piano di accumulo per il FIRE', href: '/strumenti/pac', icon: 'briefcase' },
  ],
  'flat-tax-100k': [
    { title: 'IVAFE/IVIE Calculator', description: 'Imposte su asset esteri', href: '/strumenti/ivafe-ivie', icon: 'globe' },
    { title: 'Stipendio Netto', description: 'Confronta con regime ordinario', href: '/strumenti/stipendio-netto', icon: 'calculator' },
    { title: 'Simulatore Holding', description: 'Strutture per redditi esteri', href: '/strumenti/holding', icon: 'building' },
    { title: 'Family Office', description: 'Gestione patrimoni internazionali', href: '/strumenti/family-office', icon: 'family' },
  ],
  'ivafe-ivie': [
    { title: 'Flat Tax Neo-Residenti', description: 'Regime 100k per redditi esteri', href: '/strumenti/flat-tax-100k', icon: 'globe' },
    { title: 'Copertura Valutaria', description: 'Gestisci rischio cambio', href: '/strumenti/copertura-valutaria', icon: 'shield' },
    { title: 'Portafoglio Immobiliare', description: 'Immobili esteri', href: '/strumenti/portafoglio-immobiliare', icon: 'home' },
    { title: 'Costo Mantenimento Yacht', description: 'Calcola IVIE su yacht esteri', href: '/strumenti/costo-mantenimento-yacht', icon: 'yacht' },
  ],
  'costo-mantenimento-yacht': [
    { title: 'IVAFE/IVIE Calculator', description: 'Calcola imposte su beni esteri', href: '/strumenti/ivafe-ivie', icon: 'globe' },
    { title: 'Aste Immobiliari Luxury', description: 'Immobili di pregio alle aste', href: '/strumenti/aste-immobiliari-luxury', icon: 'home' },
    { title: 'Mercato Immobiliare Luxury', description: 'Prezzi zone premium', href: '/strumenti/mercato-immobiliare-luxury', icon: 'building' },
    { title: 'Family Office', description: 'Gestione patrimoni UHNWI', href: '/strumenti/family-office', icon: 'family' },
  ],
}

export default function RelatedTools({ tools, title = 'Strumenti Correlati' }: RelatedToolsProps) {
  return (
    <section className="bg-gray-50 py-12 md:py-16">
      <div className="container-custom">
        <h2 className="font-heading text-xl md:text-2xl text-forest mb-6">{title}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group bg-white rounded-lg p-5 shadow-sm hover:shadow-md border border-gray-100 hover:border-green-200 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors flex-shrink-0">
                  {iconMap[tool.icon]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading text-base text-forest group-hover:text-green-600 transition-colors truncate">
                    {tool.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex items-center text-green-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Vai allo strumento
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
