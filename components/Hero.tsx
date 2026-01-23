import Link from 'next/link'

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  )
}

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
          {/* Trust Badge with Stars */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} className="w-5 h-5 text-amber-400" />
              ))}
            </div>
            <span className="text-white/90 text-sm font-medium">
              4.9/5 da clienti verificati
            </span>
          </div>

          {/* Main Headline - Upright serif for trust and elegance */}
          <h1 className="font-heading text-[42px] md:text-[56px] lg:text-[72px] text-white leading-[1.1] mb-8 font-semibold">
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
