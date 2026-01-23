const clientTypes = [
  {
    title: 'Imprenditori in Exit',
    description: 'Hai venduto o stai vendendo la tua azienda. Serve una strategia per ottimizzare la plusvalenza e reinvestire il capitale.',
    patrimony: 'Da €2M',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: 'Famiglie Patrimoniali',
    description: 'Gestisci un patrimonio familiare multi-generazionale. Trust, holding, patti di famiglia per proteggere e trasferire.',
    patrimony: 'Da €5M',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    title: 'Investitori Internazionali',
    description: 'Residenza in Italia con asset all\'estero, o viceversa. Ottimizzazione fiscale cross-border, IVAFE, IVIE, CRS.',
    patrimony: 'Da €1M',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Neo-Residenti Italia',
    description: 'Ti stai trasferendo in Italia e vuoi valutare il regime Flat Tax €100k o altre opzioni di ottimizzazione fiscale.',
    patrimony: 'Da €3M',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
]

export default function WhoWeHelp() {
  return (
    <section id="chi-aiutiamo" className="section-lg bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-green-600 text-sm font-medium tracking-wider uppercase mb-4">Chi Aiutiamo</p>
          <h2 className="font-heading text-3xl md:text-4xl text-forest mb-4">
            Consulenza per situazioni complesse
          </h2>
          <p className="text-gray-600 text-lg">
            Non offriamo prodotti finanziari. Offriamo strategia, struttura e ottimizzazione
            per patrimoni che richiedono competenze specifiche.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {clientTypes.map((client, index) => (
            <div
              key={index}
              className="bg-cream rounded-xl p-8 hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="text-forest">
                  {client.icon}
                </div>
                <span className="text-xs font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
                  {client.patrimony}
                </span>
              </div>
              <h3 className="font-heading text-xl text-forest mb-3">
                {client.title}
              </h3>
              <p className="text-gray-600">
                {client.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
