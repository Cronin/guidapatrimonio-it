import Link from 'next/link'

export default function CTA() {
  return (
    <section className="section-md bg-cream">
      <div className="container-custom">
        <div className="bg-green-400 rounded-[24px] p-12 md:p-16 text-center">
          <h2 className="font-heading text-h3-sm md:text-h3 text-white mb-6">
            Pronto a prendere il controllo del tuo futuro finanziario?
          </h2>
          <p className="text-body-lg text-white/90 mb-10 max-w-xl mx-auto">
            Prenota una consulenza gratuita e senza impegno. Scopri come possiamo
            aiutarti a raggiungere i tuoi obiettivi.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#contatti" className="btn-reverse">
              Prenota una Consulenza
            </Link>
            <Link href="tel:+390212345678" className="btn-transparent">
              Chiama Ora
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
