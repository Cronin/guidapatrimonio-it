import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image - Aerial forest view from TOP like CWFG */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop')`,
        }}
      />

      {/* Dark Overlay - subtle */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content - MINIMAL like CWFG */}
      <div className="container-custom relative z-10">
        <div className="max-w-2xl">
          {/* Main Headline - Simple, 3 lines max */}
          <h1 className="font-heading text-[42px] md:text-[56px] lg:text-[72px] text-white leading-[1.1] mb-8 italic font-normal">
            Costruisci il futuro<br />
            finanziario che<br />
            desideri.
          </h1>

          {/* Subtitle - ONE short line */}
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-md">
            Entra nel tuo percorso. Usa il patrimonio come strumento per vivere la vita che vuoi.
          </p>

          {/* Single CTA Button */}
          <Link href="#contatti" className="btn-primary inline-flex items-center gap-2">
            Inizia Ora
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
