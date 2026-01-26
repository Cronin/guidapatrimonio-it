export default function About() {
  return (
    <section id="chi-siamo" className="section-lg bg-cream">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <p className="text-green-400 text-sm font-medium tracking-wider uppercase mb-4">Il Nostro Partner</p>
            <h2 className="font-heading text-3xl md:text-4xl text-forest mb-6">
              Wealth Management svizzero per investitori italiani
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Collaboriamo con una societa di gestione patrimoniale con sede in Svizzera,
              specializzata in obbligazioni corporate high-yield e strategie di investimento
              per patrimoni da 150.000 EUR in su.
            </p>
            <p className="text-gray-600 mb-8">
              Il nostro partner e regolamentato dalla CSSF (Commission de Surveillance du Secteur Financier)
              e offre soluzioni personalizzate per investitori che cercano rendimenti costanti
              attraverso cedole obbligazionarie.
            </p>

            {/* Key Points */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-forest">Regolamentazione CSSF</p>
                  <p className="text-sm text-gray-500">Lussemburgo e Svizzera</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-forest">700+ Clienti</p>
                  <p className="text-sm text-gray-500">In tutta Europa</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-forest">Corporate High-Yield</p>
                  <p className="text-sm text-gray-500">Specializzazione bond</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-forest">20+ Anni</p>
                  <p className="text-sm text-gray-500">Di esperienza</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image - Zurich from Wikipedia */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <img
                src="/images/about/zurich-skyline.jpg"
                alt="Zurich, Svizzera - sede del nostro partner"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-50 rounded-xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
