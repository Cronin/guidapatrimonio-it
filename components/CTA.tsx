import Link from 'next/link'

export default function CTA() {
  return (
    <section className="section-md bg-cream">
      <div className="container-custom">
        <div className="bg-navy rounded-[24px] p-12 md:p-16 text-center">
          <h2 className="font-heading text-h3-sm md:text-h3 text-white mb-6">
            Vuoi ricevere rendite passive dalle obbligazioni?
          </h2>
          <p className="text-body-lg text-white/90 mb-10 max-w-xl mx-auto">
            Compila il form per essere ricontattato dai nostri partner svizzeri.
            Consulenza gratuita e senza impegno per patrimoni oltre 150K.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#contatti" className="inline-flex items-center justify-center gap-2 bg-gold text-navy px-8 py-4 rounded font-semibold hover:bg-gold-light transition-colors">
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
