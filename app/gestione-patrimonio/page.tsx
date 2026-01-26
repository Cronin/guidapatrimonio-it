import Link from 'next/link'
import { Navbar, Footer, Contact } from '@/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestione Patrimonio | Wealth Management Italia | Guida Patrimonio',
  description: 'Gestione patrimonio professionale e indipendente. Wealth management italiano per proteggere e far crescere il tuo capitale con strategie personalizzate e senza conflitti di interesse.',
  keywords: 'gestione patrimonio, wealth management italia, gestione patrimoniale, gestione del patrimonio, asset management, gestione investimenti, private wealth management',
  openGraph: {
    title: 'Gestione Patrimonio | Wealth Management Italia | Guida Patrimonio',
    description: 'Wealth management indipendente per proteggere e far crescere il tuo patrimonio con strategie personalizzate.',
    type: 'website',
    locale: 'it_IT',
    url: 'https://guidapatrimonio.it/gestione-patrimonio',
  },
  alternates: {
    canonical: 'https://guidapatrimonio.it/gestione-patrimonio',
  },
}

const pillars = [
  {
    title: 'Investimenti',
    description: 'Costruzione di portafogli diversificati con ETF, obbligazioni, azioni e strumenti alternativi. Selezione basata su costi, efficienza fiscale e correlazione.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
  },
  {
    title: 'Immobiliare',
    description: 'Valutazione e ottimizzazione del patrimonio immobiliare. Analisi di rendimenti, fiscalita e strutture societarie per detenzione immobili.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: 'Liquidita',
    description: 'Gestione della liquidita operativa e strategica. Conti deposito, money market fund e strategie di cash management per ottimizzare i rendimenti.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Protezione',
    description: 'Strategie di protezione patrimoniale attraverso trust, holding, polizze vita e segregazione degli asset. Tutela da rischi professionali e familiari.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
]

const approaches = [
  {
    title: 'Visione Globale',
    description: 'Non guardiamo solo gli investimenti finanziari, ma l\'intero patrimonio: immobili, partecipazioni, liquidita, polizze. Solo cosi possiamo ottimizzare davvero.',
  },
  {
    title: 'Indipendenza Totale',
    description: 'Non vendiamo prodotti di terzi, non riceviamo retrocessioni. Il nostro unico interesse e far crescere il tuo patrimonio, non i nostri ricavi.',
  },
  {
    title: 'Efficienza dei Costi',
    description: 'Privilegiamo strumenti a basso costo (ETF, titoli diretti) rispetto a fondi attivi costosi. I costi risparmiati sono rendimento in piu per te.',
  },
  {
    title: 'Ottimizzazione Fiscale',
    description: 'Ogni decisione tiene conto dell\'impatto fiscale. Tax loss harvesting, regime del risparmio amministrato vs gestito, timing delle operazioni.',
  },
  {
    title: 'Controllo del Rischio',
    description: 'Diversificazione scientifica, asset allocation strategica, ribilanciamenti periodici. Proteggiamo il patrimonio prima di farlo crescere.',
  },
  {
    title: 'Trasparenza Assoluta',
    description: 'Report periodici dettagliati, accesso in tempo reale ai tuoi investimenti, costi espliciti e comprensibili. Nessuna sorpresa.',
  },
]

const bankDifferences = [
  {
    aspect: 'Modello di Business',
    bank: 'Vendita di prodotti propri e di terzi con commissioni',
    us: 'Fee-only basato su consulenza, nessuna commissione sui prodotti',
  },
  {
    aspect: 'Conflitto di Interesse',
    bank: 'Incentivo a vendere prodotti piu remunerativi per la banca',
    us: 'Zero conflitti, il nostro successo dipende dal tuo',
  },
  {
    aspect: 'Selezione Prodotti',
    bank: 'Limitata a prodotti della casa o con accordi di distribuzione',
    us: 'Accesso a tutti i prodotti sul mercato, scelti per merito',
  },
  {
    aspect: 'Costi Medi',
    bank: '2-3% annuo tra commissioni esplicite e nascoste',
    us: '0.3-0.5% per strumenti + fee consulenza trasparente',
  },
  {
    aspect: 'Reporting',
    bank: 'Report standardizzati, spesso poco chiari',
    us: 'Report personalizzati con analisi performance e costi',
  },
  {
    aspect: 'Approccio',
    bank: 'Focus su vendita, contatto sporadico',
    us: 'Relazione continuativa, disponibilita costante',
  },
]

const wealthLevels = [
  {
    range: '250K - 1M',
    title: 'Patrimoni in Crescita',
    services: [
      'Pianificazione finanziaria completa',
      'Costruzione portafoglio ETF ottimizzato',
      'Ottimizzazione fiscale base',
      'Review semestrale',
    ],
  },
  {
    range: '1M - 5M',
    title: 'Private Wealth',
    services: [
      'Tutti i servizi precedenti',
      'Asset allocation multi-asset',
      'Pianificazione successoria',
      'Valutazione strutture societarie',
      'Review trimestrale',
    ],
  },
  {
    range: '5M+',
    title: 'UHNW Management',
    services: [
      'Tutti i servizi precedenti',
      'Family office virtuale',
      'Investimenti alternativi',
      'Coordinamento team professionale',
      'Disponibilita continua',
    ],
  },
]

export default function GestionePatrimonio() {
  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center bg-forest pt-navbar">
        <div className="absolute inset-0 bg-forest opacity-90" />
        <div className="container-custom relative z-10 py-16">
          <div className="max-w-3xl">
            <p className="label text-green-300 mb-4">Wealth Management Italia</p>
            <h1 className="font-heading text-[36px] md:text-[48px] lg:text-[60px] text-white leading-[1.1] mb-6 font-semibold">
              Gestione Patrimonio<br />
              Professionale e<br />
              Indipendente
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl">
              Un approccio olistico alla gestione del tuo patrimonio. Investimenti,
              immobili, fiscalita e protezione: tutto integrato in una strategia unica.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#contatti" className="btn-primary inline-flex items-center gap-2">
                Richiedi un Incontro
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <Link href="#approccio" className="btn-transparent">
                Il Nostro Approccio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest mb-6">
              Cos&apos;e il wealth management?
            </h2>
            <div className="prose prose-lg text-gray-500">
              <p>
                Il <strong>wealth management</strong> (gestione patrimonio) e un servizio
                integrato che va oltre la semplice gestione degli investimenti. Comprende la
                pianificazione finanziaria, l&apos;ottimizzazione fiscale, la protezione
                patrimoniale e la pianificazione successoria.
              </p>
              <p>
                A differenza del private banking tradizionale, la nostra <strong>gestione
                patrimoniale indipendente</strong> non e vincolata a prodotti di una banca
                specifica. Selezioniamo gli strumenti migliori sul mercato, con un unico
                obiettivo: il tuo interesse.
              </p>
              <p>
                Il risultato? Costi inferiori, maggiore trasparenza, migliore allineamento
                di interessi e una strategia veramente personalizzata sulla tua situazione.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="section-md bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="label mb-4">I Pilastri</p>
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest">
              Le quattro aree della gestione patrimoniale
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="bg-cream-dark rounded-card p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                  {pillar.icon}
                </div>
                <h3 className="font-heading text-xl text-forest mb-3">{pillar.title}</h3>
                <p className="text-gray-500 text-sm">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section id="approccio" className="section-md bg-forest">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="label text-green-300 mb-4">Il Nostro Approccio</p>
            <h2 className="font-heading text-h3-sm md:text-h3 text-white">
              Come gestiamo il tuo patrimonio
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approaches.map((approach, index) => (
              <div key={approach.title} className="bg-white/10 backdrop-blur-sm rounded-card p-6">
                <div className="flex items-start gap-4">
                  <span className="text-green-400 font-heading text-2xl font-semibold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-heading text-lg text-white mb-2">{approach.title}</h3>
                    <p className="text-white/70 text-sm">{approach.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="label mb-4">Il Confronto</p>
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest">
              Wealth management indipendente vs banche
            </h2>
            <p className="text-gray-500 mt-4">
              Perche sempre piu investitori scelgono la gestione patrimoniale indipendente
            </p>
          </div>

          <div className="max-w-5xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left p-4 bg-gray-100 font-heading text-forest rounded-tl-lg">Aspetto</th>
                  <th className="text-left p-4 bg-gray-100 font-heading text-forest">Banca Tradizionale</th>
                  <th className="text-left p-4 bg-green-600 font-heading text-white rounded-tr-lg">Guida Patrimonio</th>
                </tr>
              </thead>
              <tbody>
                {bankDifferences.map((diff, index) => (
                  <tr key={diff.aspect} className={index % 2 === 0 ? 'bg-white' : 'bg-cream-dark'}>
                    <td className="p-4 font-medium text-forest">{diff.aspect}</td>
                    <td className="p-4 text-gray-500">{diff.bank}</td>
                    <td className="p-4 text-green-700 bg-green-50">{diff.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Wealth Levels */}
      <section className="section-md bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="label mb-4">Servizi per Livello</p>
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest">
              Soluzioni per ogni dimensione di patrimonio
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {wealthLevels.map((level, index) => (
              <div
                key={level.range}
                className={`rounded-card p-6 ${index === 1 ? 'bg-green-600 text-white' : 'bg-cream-dark'}`}
              >
                <div className={`text-sm font-medium mb-2 ${index === 1 ? 'text-green-200' : 'text-green-600'}`}>
                  {level.range} EUR
                </div>
                <h3 className={`font-heading text-xl mb-4 ${index === 1 ? 'text-white' : 'text-forest'}`}>
                  {level.title}
                </h3>
                <ul className="space-y-3">
                  {level.services.map((service) => (
                    <li key={service} className="flex items-start gap-2">
                      <svg className={`w-5 h-5 flex-shrink-0 ${index === 1 ? 'text-green-300' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className={`text-sm ${index === 1 ? 'text-white/90' : 'text-gray-600'}`}>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="section-sm bg-cream-dark">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-gray-400 text-sm mb-2">Strumenti di Gestione</p>
            <h3 className="font-heading text-xl text-forest">
              Analizza il tuo patrimonio con i nostri calcolatori
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link href="/strumenti/patrimonio-netto" className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100 hover:border-green-200">
              <h4 className="font-heading text-base text-forest mb-1">Patrimonio Netto</h4>
              <p className="text-sm text-gray-500">Mappa tutti i tuoi asset</p>
            </Link>
            <Link href="/strumenti/proiezione-patrimoniale" className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100 hover:border-green-200">
              <h4 className="font-heading text-base text-forest mb-1">Proiezione Patrimoniale</h4>
              <p className="text-sm text-gray-500">Simula la crescita nel tempo</p>
            </Link>
            <Link href="/strumenti/confronto-etf" className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100 hover:border-green-200">
              <h4 className="font-heading text-base text-forest mb-1">Confronto ETF</h4>
              <p className="text-sm text-gray-500">Analizza e confronta ETF</p>
            </Link>
            <Link href="/strumenti/costi-private-banking" className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100 hover:border-green-200">
              <h4 className="font-heading text-base text-forest mb-1">Costi Private Banking</h4>
              <p className="text-sm text-gray-500">Quanto ti costa la banca?</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-lg bg-green-600">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-h3-sm md:text-h3 text-white mb-6">
              Vuoi una gestione patrimonio diversa?
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Scopri come possiamo aiutarti a gestire, proteggere e far crescere il tuo
              patrimonio con un approccio veramente indipendente.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#contatti" className="btn-reverse">
                Richiedi un Incontro
              </Link>
              <Link href="/protezione-patrimonio" className="inline-flex items-center justify-center text-white font-medium hover:underline">
                Scopri la protezione patrimonio
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Contact />
      <Footer />
    </main>
  )
}
