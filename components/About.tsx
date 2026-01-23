export default function About() {
  return (
    <section id="chi-siamo" className="section-lg bg-cream">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <p className="text-green-600 text-sm font-medium tracking-wider uppercase mb-4">Chi Siamo</p>
            <h2 className="font-heading text-3xl md:text-4xl text-forest mb-6">
              Consulenza indipendente per patrimoni complessi
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Non vendiamo prodotti finanziari. Non siamo legati a banche o assicurazioni.
              Il nostro compenso viene solo da te, quindi lavoriamo esclusivamente nel tuo interesse.
            </p>
            <p className="text-gray-600 mb-8">
              Ci specializziamo in situazioni che richiedono competenze trasversali:
              fiscalità, diritto societario, pianificazione successoria, asset protection.
              Quello che una banca tradizionale non può - o non vuole - fare.
            </p>

            {/* Key Points */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-forest">100% Fee-Only</p>
                  <p className="text-sm text-gray-500">Nessuna commissione nascosta</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-forest">Riservatezza totale</p>
                  <p className="text-sm text-gray-500">Massima discrezione</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-forest">Network di specialisti</p>
                  <p className="text-sm text-gray-500">Fiscalisti, notai, avvocati</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-forest">Esperienza cross-border</p>
                  <p className="text-sm text-gray-500">Italia, Svizzera, Europa</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=2070&auto=format&fit=crop"
                alt="Consulenza patrimoniale riservata"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
