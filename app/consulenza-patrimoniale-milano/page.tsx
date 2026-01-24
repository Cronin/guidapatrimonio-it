import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar, Footer, ContactForm, JsonLd } from '@/components'

export const metadata: Metadata = {
  title: 'Consulenza Patrimoniale Milano | Wealth Management Milano',
  description: 'Consulenza patrimoniale indipendente a Milano. Wealth management, pianificazione finanziaria e ottimizzazione fiscale per HNWI nella capitale economica italiana.',
  keywords: 'consulenza patrimoniale milano, wealth management milano, consulente patrimoniale milano, pianificazione finanziaria milano, gestione patrimonio milano',
  openGraph: {
    title: 'Consulenza Patrimoniale Milano | Guida Patrimonio',
    description: 'Consulenza patrimoniale indipendente a Milano. Wealth management e pianificazione finanziaria per clienti HNWI.',
    type: 'website',
    locale: 'it_IT',
    url: 'https://guidapatrimonio.it/consulenza-patrimoniale-milano',
  },
  alternates: {
    canonical: 'https://guidapatrimonio.it/consulenza-patrimoniale-milano',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  '@id': 'https://guidapatrimonio.it/consulenza-patrimoniale-milano#local',
  name: 'Guida Patrimonio - Consulenza Patrimoniale Milano',
  description: 'Consulenza patrimoniale indipendente e wealth management per clienti HNWI a Milano',
  url: 'https://guidapatrimonio.it/consulenza-patrimoniale-milano',
  telephone: '+39 02 1234567',
  email: 'milano@guidapatrimonio.it',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Via Monte Napoleone',
    addressLocality: 'Milano',
    addressRegion: 'Lombardia',
    postalCode: '20121',
    addressCountry: 'IT',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 45.4654219,
    longitude: 9.1859243,
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'Milano',
    },
    {
      '@type': 'State',
      name: 'Lombardia',
    },
  ],
  priceRange: '$$$$',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  serviceType: [
    'Consulenza Patrimoniale',
    'Wealth Management',
    'Pianificazione Finanziaria',
    'Ottimizzazione Fiscale',
    'Family Office Advisory',
  ],
  parentOrganization: {
    '@id': 'https://guidapatrimonio.it/#organization',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quanto costa una consulenza patrimoniale a Milano?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La prima consulenza e gratuita e senza impegno. I costi della consulenza continuativa dipendono dalla complessita del patrimonio e dai servizi richiesti. Come consulenti indipendenti, non percepiamo commissioni sui prodotti: il nostro compenso e esclusivamente a parcella, garantendo totale allineamento di interessi con il cliente.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual e il patrimonio minimo per accedere alla consulenza?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'I nostri servizi di consulenza patrimoniale a Milano sono pensati per clienti HNWI con patrimoni a partire da 500.000 euro. Per patrimoni superiori a 2 milioni, offriamo servizi di family office advisory personalizzati.',
      },
    },
    {
      '@type': 'Question',
      name: 'Offrite consulenza anche in videochiamata?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Si, oltre agli incontri presso il nostro studio di Milano, offriamo consulenze in videochiamata per clienti che preferiscono la modalita remota o che risiedono in altre citta della Lombardia.',
      },
    },
  ],
}

export default function ConsulenzaPatrimonialeMilano() {
  return (
    <main>
      <Navbar />
      <JsonLd data={[localBusinessSchema, faqSchema]} />

      {/* Hero Section */}
      <section className="bg-forest pt-navbar">
        <div className="container-custom py-16 md:py-24">
          <div className="max-w-3xl">
            <p className="text-green-300 text-sm font-medium mb-4 tracking-wider uppercase">
              Consulenza Patrimoniale
            </p>
            <h1 className="font-heading text-[36px] md:text-[52px] text-white leading-tight mb-6">
              Consulenza Patrimoniale a Milano
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl">
              Wealth management indipendente nel cuore della capitale finanziaria italiana.
              Strategie personalizzate per proteggere e far crescere il tuo patrimonio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#contatti" className="btn-primary">
                Prenota Consulenza Gratuita
              </Link>
              <Link href="/strumenti" className="btn-secondary-light">
                Esplora i Nostri Strumenti
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading text-h3-sm md:text-h3 text-forest mb-6">
                Perche scegliere un consulente patrimoniale indipendente a Milano
              </h2>
              <div className="prose prose-lg text-gray-600">
                <p>
                  Milano rappresenta il cuore pulsante dell&apos;economia italiana e uno dei principali
                  hub finanziari europei. Con oltre 300 miliardi di euro di asset gestiti nella sola
                  area metropolitana, la citta offre opportunita uniche ma anche sfide complesse per
                  chi possiede patrimoni significativi.
                </p>
                <p>
                  Il mercato milanese e caratterizzato da una forte presenza di banche private,
                  gestori patrimoniali e family office. Tuttavia, la maggior parte di questi operatori
                  lavora a commissione, con potenziali conflitti di interesse. Come consulenti
                  <strong> fee-only</strong>, siamo remunerati esclusivamente dal cliente, garantendo
                  consigli imparziali e allineati ai tuoi obiettivi.
                </p>
                <p>
                  I nostri clienti milanesi sono tipicamente imprenditori, professionisti, dirigenti
                  e famiglie con patrimoni tra 500.000 e 20 milioni di euro che cercano una guida
                  indipendente per decisioni finanziarie importanti.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-card p-8 shadow-lg">
              <h3 className="font-heading text-xl text-forest mb-6">I vantaggi della nostra consulenza</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-forest">100% Indipendenti</p>
                    <p className="text-sm text-gray-500">Nessuna commissione sui prodotti, solo parcella trasparente</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-forest">Conoscenza del mercato locale</p>
                    <p className="text-sm text-gray-500">Esperti del contesto economico e fiscale lombardo</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-forest">Network professionale</p>
                    <p className="text-sm text-gray-500">Accesso a notai, avvocati e commercialisti selezionati</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-forest">Incontri flessibili</p>
                    <p className="text-sm text-gray-500">Di persona a Milano o in videochiamata</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-md bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest mb-4">
              I nostri servizi di wealth management a Milano
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Offriamo una gamma completa di servizi di consulenza patrimoniale,
              personalizzati sulle esigenze specifiche della clientela milanese.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-cream rounded-card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Asset Allocation Strategica</h3>
              <p className="text-sm text-gray-600">
                Costruzione di portafogli diversificati allineati al tuo profilo di rischio
                e agli obiettivi di lungo termine, con focus su ETF a basso costo.
              </p>
            </div>

            <div className="bg-cream rounded-card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Immobiliare Milano</h3>
              <p className="text-sm text-gray-600">
                Consulenza su investimenti immobiliari nel mercato milanese:
                residenziale di pregio, uffici, e opportunita nelle zone emergenti.
              </p>
            </div>

            <div className="bg-cream rounded-card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Ottimizzazione Fiscale</h3>
              <p className="text-sm text-gray-600">
                Strategie legali per ridurre il carico fiscale: regime PEX, holding,
                pianificazione delle minusvalenze e ottimizzazione dei capital gains.
              </p>
            </div>

            <div className="bg-cream rounded-card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Passaggio Generazionale</h3>
              <p className="text-sm text-gray-600">
                Pianificazione successoria per famiglie imprenditoriali milanesi:
                trust, donazioni, patti di famiglia e governance familiare.
              </p>
            </div>

            <div className="bg-cream rounded-card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Exit Strategy Aziendali</h3>
              <p className="text-sm text-gray-600">
                Supporto nella vendita di aziende e quote societarie, con ottimizzazione
                fiscale e reinvestimento del capitale per imprenditori lombardi.
              </p>
            </div>

            <div className="bg-cream rounded-card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Investimenti Internazionali</h3>
              <p className="text-sm text-gray-600">
                Gestione di patrimoni con componenti estere: IVAFE, IVIE,
                monitoraggio fiscale e diversificazione geografica.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Milano Market Section */}
      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest mb-6 text-center">
              Il mercato patrimoniale milanese
            </h2>
            <div className="prose prose-lg text-gray-600 mx-auto">
              <p>
                Milano e la capitale indiscussa della finanza italiana. La citta ospita la Borsa Italiana,
                le sedi di tutte le principali banche e asset manager, e un ecosistema di startup fintech
                in rapida crescita. Questa concentrazione crea opportunita uniche per gli investitori sofisticati.
              </p>
              <h3>Il mercato immobiliare di pregio</h3>
              <p>
                Il real estate milanese di alta gamma continua a essere uno degli investimenti piu solidi.
                Zone come Brera, Quadrilatero della Moda, CityLife e Porta Nuova registrano rendimenti
                costanti e domanda internazionale. Offriamo consulenza specifica per chi desidera
                diversificare nel mattone milanese.
              </p>
              <h3>Private equity e venture capital</h3>
              <p>
                L&apos;ecosistema imprenditoriale lombardo offre opportunita di investimento in PMI innovative
                e startup. Con la giusta selezione e due diligence, il private equity puo rappresentare
                una componente interessante per patrimoni oltre i 2 milioni di euro.
              </p>
              <h3>Fiscalita e strutture societarie</h3>
              <p>
                La Lombardia concentra il maggior numero di holding familiari italiane. Valutiamo insieme
                se strutture come la holding di partecipazioni possono ottimizzare il tuo carico fiscale,
                considerando regime PEX, pianificazione successoria e protezione patrimoniale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-md bg-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest mb-8 text-center">
              Domande frequenti
            </h2>
            <div className="space-y-6">
              <div className="bg-cream rounded-card p-6">
                <h3 className="font-heading text-lg text-forest mb-2">
                  Quanto costa una consulenza patrimoniale a Milano?
                </h3>
                <p className="text-gray-600">
                  La prima consulenza e gratuita e senza impegno. I costi della consulenza
                  continuativa dipendono dalla complessita del patrimonio e dai servizi richiesti.
                  Come consulenti indipendenti, non percepiamo commissioni sui prodotti:
                  il nostro compenso e esclusivamente a parcella, garantendo totale allineamento
                  di interessi con il cliente.
                </p>
              </div>
              <div className="bg-cream rounded-card p-6">
                <h3 className="font-heading text-lg text-forest mb-2">
                  Qual e il patrimonio minimo per accedere alla consulenza?
                </h3>
                <p className="text-gray-600">
                  I nostri servizi di consulenza patrimoniale a Milano sono pensati per clienti
                  HNWI con patrimoni a partire da 500.000 euro. Per patrimoni superiori a 2 milioni,
                  offriamo servizi di family office advisory personalizzati.
                </p>
              </div>
              <div className="bg-cream rounded-card p-6">
                <h3 className="font-heading text-lg text-forest mb-2">
                  Offrite consulenza anche in videochiamata?
                </h3>
                <p className="text-gray-600">
                  Si, oltre agli incontri presso il nostro studio di Milano, offriamo consulenze
                  in videochiamata per clienti che preferiscono la modalita remota o che risiedono
                  in altre citta della Lombardia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contatti" className="section-lg bg-cream-dark">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <p className="label mb-4">Contattaci a Milano</p>
              <h2 className="font-heading text-h3-sm md:text-h3 text-forest mb-6">
                Prenota una consulenza gratuita
              </h2>
              <p className="text-body-lg text-gray-500 mb-8">
                Incontriamoci nel nostro studio di Milano o in videochiamata.
                La prima consulenza e gratuita e senza impegno.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-forest">Sede Milano</p>
                    <p className="text-gray-500">
                      Via Monte Napoleone, 20121 Milano<br />
                      <span className="text-sm">Zona Quadrilatero della Moda</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-forest">Email</p>
                    <a href="mailto:milano@guidapatrimonio.it" className="text-gray-500 hover:text-green-600 transition-colors">
                      milano@guidapatrimonio.it
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-forest">Telefono</p>
                    <a href="tel:+390212345678" className="text-gray-500 hover:text-green-600 transition-colors">
                      +39 02 1234567
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-card p-8 shadow-lg">
              <h3 className="font-heading text-xl text-forest mb-6">
                Richiedi una consulenza gratuita
              </h3>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-md bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl md:text-3xl text-white mb-4">
            Inizia oggi a costruire il tuo futuro finanziario
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Unisciti ai nostri clienti milanesi che hanno scelto una consulenza
            patrimoniale veramente indipendente.
          </p>
          <Link href="#contatti" className="btn-reverse">
            Prenota Consulenza Gratuita
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
