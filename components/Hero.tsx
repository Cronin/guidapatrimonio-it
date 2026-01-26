import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image - Aerial forest view (DO NOT CHANGE THIS IMAGE) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop')`,
        }}
      />

      {/* Dark Navy Overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-3xl">
          {/* Premium Badge with Social Proof */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium tracking-wide">
                Wealth Management per patrimoni oltre 150K
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-[42px] md:text-[56px] lg:text-[72px] text-white leading-[1.05] mb-6">
            Fai crescere il tuo<br />
            patrimonio.
          </h1>

          {/* Value Proposition - Clear differentiator */}
          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-xl leading-relaxed font-medium">
            Rendite passive da obbligazioni corporate.
          </p>
          <p className="text-lg text-white/70 mb-8 max-w-xl leading-relaxed">
            Accedi a strategie di investimento esclusive con il supporto
            dei nostri partner con sede a Ginevra, Svizzera.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              href="#contatti"
              className="inline-flex items-center justify-center gap-2 bg-gold text-navy px-8 py-4 rounded font-semibold hover:bg-gold-light transition-colors shadow-lg"
            >
              Richiedi Callback Gratuito
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Quick Trust Signals */}
          <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Partner regolamentati
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Consulenza gratuita
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Sede in Svizzera
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-navy/95 backdrop-blur-sm border-t border-white/10">
        <div className="container-custom py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div>
              <p className="font-heading text-2xl md:text-3xl text-white">700+</p>
              <p className="text-white/60 text-sm mt-1">Clienti soddisfatti</p>
            </div>
            <div>
              <p className="font-heading text-2xl md:text-3xl text-white">20+</p>
              <p className="text-white/60 text-sm mt-1">Anni di esperienza</p>
            </div>
            <div>
              <p className="font-heading text-2xl md:text-3xl text-white">CSSF</p>
              <p className="text-white/60 text-sm mt-1">Regolamentazione</p>
            </div>
            <div>
              <p className="font-heading text-2xl md:text-3xl text-gold">High-Yield</p>
              <p className="text-white/60 text-sm mt-1">Corporate Bonds</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
