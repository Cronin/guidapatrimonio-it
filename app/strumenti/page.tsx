import Link from 'next/link'
import { Navbar, Footer } from '@/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Strumenti Finanziari Gratuiti | Guida Patrimonio',
  description: 'Calcolatori finanziari gratuiti: interesse composto, PAC, inflazione, pensione. Pianifica il tuo futuro finanziario con i nostri strumenti.',
}

const tools = [
  {
    title: 'Calcolatore Interesse Composto',
    description: 'Scopri come cresce il tuo capitale nel tempo grazie all\'interesse composto, l\'ottava meraviglia del mondo.',
    href: '/strumenti/interesse-composto',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: 'Simulatore PAC',
    description: 'Calcola quanto puoi accumulare con un Piano di Accumulo del Capitale, investendo regolarmente ogni mese.',
    href: '/strumenti/pac',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Calcolatore Inflazione',
    description: 'Scopri quanto vale oggi una somma del passato e quanto varrà in futuro considerando l\'inflazione.',
    href: '/strumenti/inflazione',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
    ),
  },
  {
    title: 'Calcolatore Pensione',
    description: 'Stima quanto dovrai risparmiare per mantenere il tuo tenore di vita in pensione.',
    href: '/strumenti/pensione',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Calcolo Plusvalenza Immobiliare',
    description: 'Calcola le tasse sulla vendita del tuo immobile e scopri se sei esente dalla plusvalenza.',
    href: 'https://calcoloplusvalenza.it',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    external: true,
  },
]

export default function Strumenti() {
  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-forest pt-navbar">
        <div className="container-custom py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="label text-green-300 mb-4">Strumenti Gratuiti</p>
            <h1 className="font-heading text-[36px] md:text-[48px] text-white leading-tight mb-6">
              Calcolatori Finanziari
            </h1>
            <p className="text-lg text-white/80">
              Strumenti gratuiti per pianificare il tuo futuro finanziario.
              Nessuna registrazione richiesta.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="section-lg bg-cream">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.title}
                href={tool.href}
                target={tool.external ? '_blank' : undefined}
                rel={tool.external ? 'noopener noreferrer' : undefined}
                className="group bg-white rounded-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  {tool.icon}
                </div>
                <h2 className="font-heading text-xl text-forest mb-2 group-hover:text-green-600 transition-colors">
                  {tool.title}
                  {tool.external && (
                    <svg className="w-4 h-4 inline ml-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </h2>
                <p className="text-gray-500 text-sm">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-md bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-h3-sm md:text-h3 text-white mb-4">
            Hai bisogno di una consulenza personalizzata?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            I calcolatori sono un buon punto di partenza, ma ogni situazione è unica.
            Parliamo del tuo caso specifico.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
