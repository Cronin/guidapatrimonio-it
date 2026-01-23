export default function About() {
  return (
    <section id="chi-siamo" className="section-lg bg-cream">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <p className="label mb-4">Chi Siamo</p>
            <h2 className="font-heading text-h3 text-forest mb-6">
              Una guida esperta per il tuo patrimonio
            </h2>
            <p className="text-body-lg text-black/80 mb-6">
              Guida Patrimonio nasce dalla convinzione che ogni persona meriti
              una consulenza finanziaria trasparente, indipendente e
              personalizzata.
            </p>
            <p className="text-body-md text-black/70 mb-8">
              Non siamo legati a nessun prodotto finanziario o istituto bancario.
              Il nostro unico interesse è il tuo interesse. Lavoriamo al tuo fianco
              per costruire strategie che rispecchino i tuoi obiettivi di vita,
              non quelli di chi vende prodotti.
            </p>
            <a href="#contatti" className="btn-text group">
              Scopri il nostro approccio
              <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Image - People enjoying nature/outdoor like CWFG */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-card overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2070&auto=format&fit=crop"
                alt="Famiglia che pianifica il futuro insieme"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-green-100 rounded-card -z-10" />
          </div>
        </div>
      </div>
    </section>
  )
}
