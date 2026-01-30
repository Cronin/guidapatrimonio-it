import Image from 'next/image'
import ContactForm from './ContactForm'

function GiacomoAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  }
  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-green-200 flex-shrink-0`}>
      <Image
        src="/images/team/giacomo.jpg"
        alt="Giacomo - Wealth Manager"
        width={96}
        height={96}
        className="w-full h-full object-cover object-top"
      />
    </div>
  )
}

export { GiacomoAvatar }

export default function Contact() {
  return (
    <section id="contatti" className="section-lg bg-cream-dark">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left - Info */}
          <div>
            <p className="label mb-4">Contatti</p>
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest mb-6">
              Parliamo dei tuoi obiettivi
            </h2>
            <p className="text-body-lg text-gray-500 mb-8">
              Contattaci per una consulenza personalizzata sulla gestione
              del tuo patrimonio. Il nostro team è a disposizione dal lunedì
              al venerdì, dalle 9:00 alle 18:00.
            </p>

            {/* Giacomo card */}
            <div className="flex items-center gap-4 bg-white rounded-xl p-5 border border-gray-100 mb-8">
              <GiacomoAvatar size="md" />
              <div>
                <p className="font-heading text-lg text-forest">Giacomo</p>
                <p className="text-sm text-gray-500">Wealth Manager Associato</p>
                <p className="text-xs text-green-600 mt-1">Disponibile per consulenze</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-forest">Email</p>
                  <a href="mailto:info@guidapatrimonio.it" className="text-gray-500 hover:text-green-400 transition-colors">
                    info@guidapatrimonio.it
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-forest">Telefono</p>
                  <a href="tel:+393756448324" className="text-gray-500 hover:text-green-400 transition-colors">
                    +39 375 644 8324
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-forest">Sede</p>
                  <p className="text-gray-500">
                    Via Monte Napoleone 28<br />
                    20121 Milano (MI)<br />
                    <span className="text-sm">Ricevimento su appuntamento</span>
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-forest">Orari</p>
                  <p className="text-gray-500">
                    Lun - Ven: 09:00 - 18:00<br />
                    <span className="text-sm">Sab e Dom: chiuso</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-400 mb-4">Garanzie</p>
              <div className="flex flex-wrap gap-4">
                <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Partner regolamentato CSSF
                </span>
                <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Consulenza senza impegno
                </span>
                <span className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Riservatezza garantita
                </span>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-white rounded-card p-8 shadow-lg">
            <h3 className="font-heading text-xl text-forest mb-6">
              Richiedi un callback
            </h3>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  )
}
