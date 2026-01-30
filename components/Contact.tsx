import ContactForm from './ContactForm'

function GiacomoAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  }
  return (
    <div className="relative inline-block flex-shrink-0">
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-green-200`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/team/giacomo.jpg"
          alt="Giacomo - Wealth Manager"
          className="w-full h-full object-cover object-top"
        />
      </div>
      {/* Pulsing green dot */}
      <span className="absolute bottom-0 right-0 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white" />
      </span>
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
              Compila il form per essere ricontattato dai nostri partner.
              Ti aiuteremo a capire se le soluzioni di investimento proposte
              sono adatte al tuo profilo.
            </p>

            {/* Giacomo card */}
            <div className="flex items-center gap-4 bg-white rounded-xl p-5 border border-gray-100 mb-8">
              <GiacomoAvatar size="md" />
              <div>
                <p className="font-heading text-lg text-forest">Giacomo</p>
                <p className="text-sm text-gray-500">Wealth Manager Associato</p>
                <span className="inline-flex items-center gap-1.5 mt-1.5 bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                  </span>
                  Disponibile ora
                </span>
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

              {/* Location */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-forest">Partner</p>
                  <p className="text-gray-500">
                    Ginevra, Svizzera<br />
                    <span className="text-sm">Consulenze in videochiamata</span>
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
