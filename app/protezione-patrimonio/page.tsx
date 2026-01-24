import Link from 'next/link'
import { Navbar, Footer, Contact } from '@/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Protezione Patrimonio | Asset Protection Italia | Guida Patrimonio',
  description: 'Strategie di protezione patrimonio e asset protection per imprenditori, professionisti e famiglie. Trust, holding, polizze vita: tutela il tuo patrimonio da rischi e aggressioni.',
  keywords: 'protezione patrimonio, asset protection, protezione patrimoniale, tutela patrimonio, trust patrimonio, holding protezione, polizza vita protezione, segregazione patrimonio',
  openGraph: {
    title: 'Protezione Patrimonio | Asset Protection Italia | Guida Patrimonio',
    description: 'Strategie professionali di asset protection per proteggere il tuo patrimonio da rischi professionali, familiari e fiscali.',
    type: 'website',
    locale: 'it_IT',
    url: 'https://guidapatrimonio.it/protezione-patrimonio',
  },
  alternates: {
    canonical: 'https://guidapatrimonio.it/protezione-patrimonio',
  },
}

const risks = [
  {
    title: 'Rischi Professionali',
    description: 'Cause legali, responsabilita professionale, fallimento aziendale. Gli imprenditori e i professionisti sono esposti a rischi che possono aggredire il patrimonio personale.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Rischi Familiari',
    description: 'Separazioni, divorzi, liti ereditarie. Eventi familiari possono mettere a rischio patrimoni costruiti in anni di lavoro se non adeguatamente strutturati.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Rischi Fiscali',
    description: 'Accertamenti, contenziosi, sanzioni. Una pianificazione fiscale inadeguata puo esporre a rischi significativi e costi imprevisti.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Rischi Successori',
    description: 'Litigiosita tra eredi, imposte di successione elevate, dispersione del patrimonio. Senza pianificazione, il passaggio generazionale puo distruggere valore.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
]

const strategies = [
  {
    title: 'Trust',
    description: 'Strumento giuridico che permette di segregare il patrimonio, sottraendolo alla disponibilita del disponente pur mantenendo benefici per se o per i propri cari.',
    benefits: [
      'Segregazione patrimoniale completa',
      'Protezione da creditori futuri',
      'Pianificazione successoria flessibile',
      'Tutela di soggetti deboli',
    ],
    considerations: [
      'Richiede spossessamento reale',
      'Costi di costituzione e gestione',
      'Complessita normativa',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Holding di Famiglia',
    description: 'Societa che detiene partecipazioni e asset familiari, centralizzando la gestione e offrendo vantaggi fiscali e di protezione.',
    benefits: [
      'Regime PEX su plusvalenze (95% esente)',
      'Separazione patrimonio personale/aziendale',
      'Facilitazione passaggio generazionale',
      'Governance familiare strutturata',
    ],
    considerations: [
      'Costi di costituzione e gestione',
      'Obblighi contabili e fiscali',
      'Necessita masse critiche',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: 'Polizze Vita',
    description: 'Contratti assicurativi che offrono protezione del capitale, vantaggi fiscali e impignorabilita in determinate condizioni.',
    benefits: [
      'Impignorabilita e insequestrabilita',
      'Esenzione da imposta di successione',
      'Differimento fiscale',
      'Designazione beneficiari flessibile',
    ],
    considerations: [
      'Costi di gestione variabili',
      'Rendimenti spesso bassi',
      'Vincoli di liquidita',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Fondo Patrimoniale',
    description: 'Vincolo di destinazione su beni immobili o mobili registrati per far fronte ai bisogni della famiglia.',
    benefits: [
      'Protezione da debiti non familiari',
      'Costi contenuti',
      'Gestione semplice',
    ],
    considerations: [
      'Protezione limitata (solo debiti extrafamiliari)',
      'Possibile revoca in caso di frode',
      'Non protegge da debiti pregressi',
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
]

const whenNeeded = [
  {
    situation: 'Avvio attivita imprenditoriale',
    why: 'Prima di assumere rischi professionali, e saggio segregare il patrimonio personale gia accumulato.',
  },
  {
    situation: 'Matrimonio o convivenza',
    why: 'Per definire regole chiare sulla gestione del patrimonio ed evitare sorprese in caso di separazione.',
  },
  {
    situation: 'Patrimonio significativo',
    why: 'Quando il patrimonio cresce, crescono anche i rischi e le opportunita di ottimizzazione.',
  },
  {
    situation: 'Figli o eredi',
    why: 'Per pianificare la trasmissione del patrimonio minimizzando conflitti e imposte.',
  },
  {
    situation: 'Attivita a rischio',
    why: 'Medici, avvocati, amministratori: professioni esposte a responsabilita civile.',
  },
  {
    situation: 'Internazionalizzazione',
    why: 'Patrimoni con asset in piu paesi richiedono strutture coordinate.',
  },
]

const processSteps = [
  {
    number: '01',
    title: 'Analisi dei Rischi',
    description: 'Mappiamo tutti i rischi a cui sei esposto: professionali, familiari, fiscali, successori. Identifichiamo le vulnerabilita del tuo patrimonio.',
  },
  {
    number: '02',
    title: 'Valutazione Asset',
    description: 'Analizziamo la composizione del patrimonio: immobili, partecipazioni, liquidita, polizze. Ogni asset ha caratteristiche e vulnerabilita diverse.',
  },
  {
    number: '03',
    title: 'Definizione Obiettivi',
    description: 'Capiamo cosa vuoi proteggere, da chi, e quali sono le tue priorita: famiglia, continuita aziendale, riservatezza.',
  },
  {
    number: '04',
    title: 'Strategia Personalizzata',
    description: 'Progettiamo una struttura di protezione su misura, combinando gli strumenti piu adatti: trust, holding, polizze, fondi.',
  },
  {
    number: '05',
    title: 'Implementazione',
    description: 'Coordiniamo notai, avvocati e commercialisti per implementare la strategia in modo efficace e conforme alla normativa.',
  },
]

export default function ProtezionePatrimonio() {
  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center bg-forest pt-navbar">
        <div className="absolute inset-0 bg-gradient-to-br from-forest via-green-600 to-forest opacity-90" />
        <div className="container-custom relative z-10 py-16">
          <div className="max-w-3xl">
            <p className="label text-green-300 mb-4">Asset Protection</p>
            <h1 className="font-heading text-[36px] md:text-[48px] lg:text-[60px] text-white leading-[1.1] mb-6 font-semibold">
              Protezione<br />
              Patrimonio<br />
              Professionale
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl">
              Strategie legali per proteggere il tuo patrimonio da rischi imprenditoriali,
              familiari e successori. Trust, holding, polizze: gli strumenti giusti per ogni situazione.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#contatti" className="btn-primary inline-flex items-center gap-2">
                Analisi Gratuita dei Rischi
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <Link href="#strategie" className="btn-transparent">
                Le Strategie
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Protection Section */}
      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest mb-6">
              Perche proteggere il patrimonio?
            </h2>
            <div className="prose prose-lg text-gray-500">
              <p>
                La <strong>protezione patrimoniale</strong> (asset protection) e l&apos;insieme
                di strategie legali che permettono di tutelare il patrimonio da eventi negativi:
                cause legali, fallimenti, divorzi, creditori, imposte successorie.
              </p>
              <p>
                Non si tratta di nascondere beni o evadere tasse - pratiche illegali e controproducenti -
                ma di <strong>strutturare il patrimonio in modo intelligente</strong> per renderlo
                meno vulnerabile a rischi prevedibili.
              </p>
              <p>
                La protezione patrimoniale e tanto piu efficace quanto piu viene pianificata
                <strong> in anticipo</strong>, prima che i rischi si materializzino. Agire quando
                i problemi sono gia sorti e spesso tardivo e meno efficace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Risks Section */}
      <section className="section-md bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="label mb-4">I Rischi</p>
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest">
              Da cosa proteggere il patrimonio
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {risks.map((risk) => (
              <div key={risk.title} className="bg-cream-dark rounded-card p-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                  {risk.icon}
                </div>
                <h3 className="font-heading text-xl text-forest mb-3">{risk.title}</h3>
                <p className="text-gray-500">{risk.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strategies Section */}
      <section id="strategie" className="section-md bg-forest">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="label text-green-300 mb-4">Le Strategie</p>
            <h2 className="font-heading text-h3-sm md:text-h3 text-white">
              Gli strumenti di protezione patrimoniale
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {strategies.map((strategy) => (
              <div key={strategy.title} className="bg-white rounded-card p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 flex-shrink-0">
                    {strategy.icon}
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl text-forest">{strategy.title}</h3>
                    <p className="text-gray-500 mt-2">{strategy.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-green-600 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Vantaggi
                    </h4>
                    <ul className="space-y-2">
                      {strategy.benefits.map((benefit) => (
                        <li key={benefit} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-green-500 mt-1">+</span>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-amber-600 mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Da considerare
                    </h4>
                    <ul className="space-y-2">
                      {strategy.considerations.map((consideration) => (
                        <li key={consideration} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-amber-500 mt-1">!</span>
                          {consideration}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* When Needed Section */}
      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="label mb-4">Quando Serve</p>
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest">
              Quando pensare alla protezione patrimoniale
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {whenNeeded.map((item) => (
              <div key={item.situation} className="bg-white rounded-card p-5 border-l-4 border-green-500">
                <h3 className="font-heading text-lg text-forest mb-2">{item.situation}</h3>
                <p className="text-sm text-gray-500">{item.why}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 px-4 py-2 rounded-full text-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>La protezione e piu efficace se pianificata <strong>prima</strong> che sorgano problemi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-md bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="label mb-4">Il Processo</p>
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest">
              Come costruiamo la tua protezione
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {processSteps.map((step, index) => (
              <div key={step.number} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-heading font-semibold">
                    {step.number}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="w-0.5 h-full bg-green-200 ml-6 mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="font-heading text-xl text-forest mb-2">{step.title}</h3>
                  <p className="text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="section-sm bg-cream-dark">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-gray-400 text-sm mb-2">Strumenti Correlati</p>
            <h3 className="font-heading text-xl text-forest">
              Approfondisci con i nostri simulatori
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link href="/strumenti/trust-donazione" className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100 hover:border-green-200">
              <h4 className="font-heading text-base text-forest mb-1">Trust vs Donazione</h4>
              <p className="text-sm text-gray-500">Confronta i due strumenti</p>
            </Link>
            <Link href="/strumenti/holding" className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100 hover:border-green-200">
              <h4 className="font-heading text-base text-forest mb-1">Simulatore Holding</h4>
              <p className="text-sm text-gray-500">Valuta i benefici fiscali</p>
            </Link>
            <Link href="/strumenti/successione" className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100 hover:border-green-200">
              <h4 className="font-heading text-base text-forest mb-1">Successione</h4>
              <p className="text-sm text-gray-500">Calcola le imposte</p>
            </Link>
            <Link href="/strumenti/patrimonio-netto" className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100 hover:border-green-200">
              <h4 className="font-heading text-base text-forest mb-1">Patrimonio Netto</h4>
              <p className="text-sm text-gray-500">Mappa i tuoi asset</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-lg bg-green-600">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-h3-sm md:text-h3 text-white mb-6">
              Proteggi il tuo patrimonio oggi
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Non aspettare che sia troppo tardi. Richiedi un&apos;analisi gratuita dei rischi
              e scopri le strategie piu adatte alla tua situazione.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#contatti" className="btn-reverse">
                Richiedi Analisi Gratuita
              </Link>
              <Link href="/consulenza-patrimoniale" className="inline-flex items-center justify-center text-white font-medium hover:underline">
                Scopri la consulenza patrimoniale
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
