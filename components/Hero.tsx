import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image - Luxury estate/wealth imagery */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2075&auto=format&fit=crop')`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-3xl">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            <span className="text-white/90 text-sm font-medium tracking-wide">
              Consulenza riservata per patrimoni oltre €1M
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-[42px] md:text-[56px] lg:text-[72px] text-white leading-[1.05] mb-8">
            Gestione patrimoniale<br />
            per chi ha già<br />
            costruito.
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-white/70 mb-10 max-w-xl leading-relaxed">
            Holding, trust, family office, fiscalità internazionale.
            Strategie concrete per proteggere e far crescere patrimoni importanti.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="#contatti"
              className="inline-flex items-center justify-center gap-2 bg-white text-forest px-8 py-4 rounded font-medium hover:bg-gray-100 transition-colors"
            >
              Richiedi Consulenza Riservata
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/strumenti"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded font-medium hover:bg-white/10 transition-colors"
            >
              Esplora Strumenti
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-forest/90 backdrop-blur-sm">
        <div className="container-custom py-6">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-heading text-2xl md:text-3xl text-white">€50M+</p>
              <p className="text-white/60 text-sm mt-1">Patrimoni gestiti</p>
            </div>
            <div>
              <p className="font-heading text-2xl md:text-3xl text-white">15+</p>
              <p className="text-white/60 text-sm mt-1">Anni di esperienza</p>
            </div>
            <div>
              <p className="font-heading text-2xl md:text-3xl text-white">100%</p>
              <p className="text-white/60 text-sm mt-1">Fee-only indipendente</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
