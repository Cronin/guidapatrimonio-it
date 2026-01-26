const clientTypes = [
  {
    title: 'Investitori da €150K+',
    description: 'Vuoi rendite passive stabili attraverso cedole obbligazionarie? Il nostro partner svizzero gestisce portafogli corporate high-yield.',
    patrimony: 'Da €150K',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: 'Pianificazione Pensione',
    description: 'Hai oltre 50 anni e vuoi costruire un reddito passivo per la pensione? Le cedole bond offrono flussi di cassa prevedibili.',
    patrimony: 'Da €250K',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Diversificazione Patrimonio',
    description: 'Troppo esposto su immobili o azioni? I bond corporate high-yield offrono rendimenti interessanti con rischio controllato.',
    patrimony: 'Da €500K',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
  },
  {
    title: 'Patrimoni Importanti',
    description: 'Gestisci oltre 1M e cerchi soluzioni esclusive? Accedi a strategie di investimento normalmente riservate a clienti istituzionali.',
    patrimony: 'Da €1M',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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
          <p className="text-gold text-sm font-medium tracking-wider uppercase mb-4">Per Chi</p>
          <h2 className="font-heading text-3xl md:text-4xl text-navy mb-4">
            Soluzioni per ogni profilo di investitore
          </h2>
          <p className="text-gray-600 text-lg">
            Il nostro partner svizzero offre strategie di investimento in obbligazioni corporate
            high-yield per diverse esigenze patrimoniali.
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
                <div className="text-navy">
                  {client.icon}
                </div>
                <span className="text-xs font-medium text-navy bg-navy-100 px-3 py-1 rounded-full">
                  {client.patrimony}
                </span>
              </div>
              <h3 className="font-heading text-xl text-navy mb-3">
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
