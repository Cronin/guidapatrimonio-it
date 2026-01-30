import Link from 'next/link'

const vantaggi = [
  {
    title: 'Ottimizzazione Fiscale',
    description: 'La Svizzera offre regimi fiscali vantaggiosi per le holding, con esenzione sulla partecipazione e trattati contro la doppia imposizione.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
    ),
  },
  {
    title: 'Protezione Patrimoniale',
    description: 'Struttura giuridica solida che separa il patrimonio personale da quello aziendale, con la stabilità del sistema legale svizzero.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Accesso ai Mercati Globali',
    description: 'Una holding svizzera facilita operazioni internazionali, partecipazioni in società estere e gestione centralizzata degli investimenti.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Successione e Continuità',
    description: 'Pianificazione successoria efficiente: la holding permette il passaggio generazionale del patrimonio senza frammentare gli asset.',
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
]

export default function SwissHolding() {
  return (
    <section id="holding-svizzera" className="section-lg bg-cream-dark">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-green-400 text-sm font-medium tracking-wider uppercase mb-4">Servizi Esclusivi</p>
          <h2 className="font-heading text-3xl md:text-4xl text-forest mb-4">
            Apertura Holding in Svizzera
          </h2>
          <p className="text-gray-600 text-lg">
            Struttura il tuo patrimonio attraverso una holding svizzera: il veicolo preferito
            da imprenditori e famiglie con patrimoni importanti per ottimizzare fiscalità,
            protezione e successione.
          </p>
        </div>

        {/* Vantaggi grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {vantaggi.map((v, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="text-green-600 mb-4">
                {v.icon}
              </div>
              <h3 className="font-heading text-xl text-forest mb-3">
                {v.title}
              </h3>
              <p className="text-gray-600">
                {v.description}
              </p>
            </div>
          ))}
        </div>

        {/* Info box + CTA */}
        <div className="bg-forest rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h3 className="font-heading text-2xl text-white mb-3">
              Sede a Ginevra, regolamentazione CSSF
            </h3>
            <p className="text-white/80 text-lg mb-2">
              Il nostro partner con sede a Ginevra ti guida nell&apos;intero processo: dalla costituzione
              della holding alla strutturazione degli investimenti, con piena conformità normativa.
            </p>
            <p className="text-green-300 text-sm">
              Servizio riservato a patrimoni superiori a 500.000 EUR
            </p>
          </div>
          <div className="shrink-0 flex flex-col items-center gap-4">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-green-300 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/team/giacomo.jpg"
                  alt="Giacomo - Wealth Manager"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <span className="absolute bottom-0 right-0 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-forest" />
              </span>
            </div>
            <Link
              href="#contatti"
              className="inline-flex items-center gap-2 bg-white text-forest px-8 py-4 rounded-button font-semibold hover:bg-green-50 transition-colors"
            >
              Prenota una Consulenza
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
