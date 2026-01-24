import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image - Aerial forest view */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop')`,
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="max-w-3xl">
          {/* Premium Badge with Social Proof */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium tracking-wide">
                Consulenza riservata per patrimoni oltre 500K
              </span>
            </div>
            <div className="inline-flex items-center gap-2 bg-gold/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <svg className="w-4 h-4 text-gold" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white/90 text-sm font-medium">
                4.9/5 da 47 clienti
              </span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="font-heading text-[42px] md:text-[56px] lg:text-[72px] text-white leading-[1.05] mb-6">
            Proteggi e fai crescere<br />
            il tuo patrimonio.
          </h1>

          {/* Value Proposition - Clear differentiator */}
          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-xl leading-relaxed font-medium">
            Consulenza indipendente, 100% fee-only.
          </p>
          <p className="text-lg text-white/70 mb-8 max-w-xl leading-relaxed">
            Holding, trust, family office, fiscalita internazionale.
            Strategie concrete senza conflitti di interesse.
          </p>

          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link
              href="#contatti"
              className="inline-flex items-center justify-center gap-2 bg-white text-forest px-8 py-4 rounded font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Prenota Call Gratuita
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          {/* Quick Trust Signals */}
          <div className="flex flex-wrap items-center gap-6 text-white/60 text-sm">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Nessun prodotto da vendere
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Prima call gratuita
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Riservatezza garantita
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-forest/95 backdrop-blur-sm border-t border-white/10">
        <div className="container-custom py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
            <div>
              <p className="font-heading text-2xl md:text-3xl text-white">50M+</p>
              <p className="text-white/60 text-sm mt-1">Patrimoni assistiti</p>
            </div>
            <div>
              <p className="font-heading text-2xl md:text-3xl text-white">15+</p>
              <p className="text-white/60 text-sm mt-1">Anni di esperienza</p>
            </div>
            <div>
              <p className="font-heading text-2xl md:text-3xl text-white">100%</p>
              <p className="text-white/60 text-sm mt-1">Fee-only</p>
            </div>
            <div>
              <p className="font-heading text-2xl md:text-3xl text-white">47</p>
              <p className="text-white/60 text-sm mt-1">Famiglie seguite</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
