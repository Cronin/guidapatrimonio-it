import Link from 'next/link'

export default function CTA() {
  return (
    <section className="section-md bg-cream">
      <div className="container-custom">
        <div className="bg-forest rounded-[24px] p-12 md:p-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-green-300 flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/team/giacomo.jpg"
                  alt="Giacomo - Wealth Manager"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <span className="absolute bottom-0 right-0 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-forest" />
              </span>
            </div>
          </div>
          <h2 className="font-heading text-h3-sm md:text-h3 text-white mb-6">
            Vuoi ricevere rendite passive dalle obbligazioni?
          </h2>
          <p className="text-body-lg text-white/90 mb-10 max-w-xl mx-auto">
            Compila il form per essere ricontattato dai nostri partner svizzeri.
            Consulenza gratuita e senza impegno per patrimoni oltre 150K.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#contatti" className="inline-flex items-center justify-center gap-2 bg-white text-forest px-8 py-4 rounded-button font-semibold hover:bg-cream transition-colors">
              Richiedi Callback Gratuito
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
