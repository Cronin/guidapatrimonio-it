import type { Metadata } from 'next'
import Link from 'next/link'
import { Navbar, Footer, ContactForm, JsonLd } from '@/components'

export const metadata: Metadata = {
  title: 'Consulenza Patrimoniale Roma | Consulente Patrimoniale Roma',
  description: 'Consulenza patrimoniale indipendente a Roma. Gestione patrimonio, pianificazione finanziaria e wealth management per professionisti e famiglie nella Capitale.',
  keywords: 'consulenza patrimoniale roma, consulente patrimoniale roma, wealth management roma, pianificazione finanziaria roma, gestione patrimonio roma',
  openGraph: {
    title: 'Consulenza Patrimoniale Roma | Guida Patrimonio',
    description: 'Consulenza patrimoniale indipendente a Roma. Wealth management e pianificazione finanziaria per clienti HNWI.',
    type: 'website',
    locale: 'it_IT',
    url: 'https://guidapatrimonio.it/consulenza-patrimoniale-roma',
  },
  alternates: {
    canonical: 'https://guidapatrimonio.it/consulenza-patrimoniale-roma',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  '@id': 'https://guidapatrimonio.it/consulenza-patrimoniale-roma#local',
  name: 'Guida Patrimonio - Consulenza Patrimoniale Roma',
  description: 'Consulenza patrimoniale indipendente e wealth management per clienti HNWI a Roma',
  url: 'https://guidapatrimonio.it/consulenza-patrimoniale-roma',
  telephone: '+39 06 1234567',
  email: 'roma@guidapatrimonio.it',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Via Veneto',
    addressLocality: 'Roma',
    addressRegion: 'Lazio',
    postalCode: '00187',
    addressCountry: 'IT',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 41.9027835,
    longitude: 12.4963655,
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'Roma',
    },
    {
      '@type': 'State',
      name: 'Lazio',
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
      name: 'Qual e la differenza tra un consulente patrimoniale e un private banker?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Il consulente patrimoniale indipendente lavora esclusivamente a parcella, senza commissioni sui prodotti consigliati. Il private banker, invece, e tipicamente remunerato dalla banca tramite commissioni sui prodotti venduti. Questo crea potenziali conflitti di interesse che il modello fee-only elimina completamente.',
      },
    },
    {
      '@type': 'Question',
      name: 'Offrite consulenza per investimenti immobiliari a Roma?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Si, la consulenza immobiliare e parte integrante del nostro servizio di wealth management a Roma. Analizziamo il mercato romano, valutiamo opportunita di investimento e vi supportiamo nelle decisioni relative al patrimonio immobiliare, incluse zone di pregio come Parioli, Prati e il Centro Storico.',
      },
    },
    {
      '@type': 'Question',
      name: 'Come funziona la prima consulenza gratuita?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La prima consulenza e un incontro conoscitivo di circa un ora, senza impegno. Analizziamo insieme la vostra situazione patrimoniale attuale, comprendiamo i vostri obiettivi e vi illustriamo come potremmo aiutarvi. Non e una vendita: e un dialogo per capire se possiamo lavorare insieme.',
      },
    },
  ],
}

export default function ConsulenzaPatrimonialeRoma() {
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
              Consulenza Patrimoniale a Roma
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl">
              Wealth management indipendente nella Capitale. Proteggi e fai crescere
              il tuo patrimonio con un consulente che lavora solo per i tuoi interessi.
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
                Consulenza patrimoniale indipendente nella Capitale
              </h2>
              <div className="prose prose-lg text-gray-600">
                <p>
                  Roma rappresenta un mercato patrimoniale unico in Italia. La citta eterna
                  ospita una concentrazione significativa di professionisti ad alto reddito,
                  funzionari pubblici di alto livello, diplomatici e famiglie storiche con
                  patrimoni immobiliari di grande valore.
                </p>
                <p>
                  La specificita romana richiede competenze particolari: dalla gestione di
                  immobili di pregio nel centro storico (spesso soggetti a vincoli) alla
                  comprensione delle dinamiche del settore pubblico, fino alla consulenza
                  per professionisti e liberi professionisti che operano nella Capitale.
                </p>
                <p>
                  Come consulenti <strong>fee-only</strong>, non abbiamo prodotti da vendere.
                  Il nostro unico obiettivo e aiutarti a prendere le migliori decisioni
                  finanziarie per la tua situazione specifica. Lavoriamo con professionisti,
                  dirigenti, imprenditori e famiglie romane con patrimoni da 500.000 euro in su.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-card p-8 shadow-lg">
              <h3 className="font-heading text-xl text-forest mb-6">Perche scegliere un consulente indipendente</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-forest">Zero conflitti di interesse</p>
                    <p className="text-sm text-gray-500">Non riceviamo commissioni da banche o SGR</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-forest">Esperienza nel mercato romano</p>
                    <p className="text-sm text-gray-500">Conosciamo le specificita locali del real estate e della fiscalita</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-forest">Approccio olistico</p>
                    <p className="text-sm text-gray-500">Consideriamo tutti gli aspetti del patrimonio familiare</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-forest">Rete di professionisti</p>
                    <p className="text-sm text-gray-500">Collaboriamo con notai, avvocati e commercialisti selezionati</p>
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
              Servizi di wealth management a Roma
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Una consulenza patrimoniale completa, pensata per le esigenze
              specifiche dei nostri clienti romani.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-cream rounded-card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Pianificazione Finanziaria</h3>
              <p className="text-sm text-gray-600">
                Definizione degli obiettivi, analisi della situazione attuale e
                costruzione di un piano finanziario personalizzato per il lungo termine.
              </p>
            </div>

            <div className="bg-cream rounded-card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Consulenza Immobiliare Roma</h3>
              <p className="text-sm text-gray-600">
                Valutazione del patrimonio immobiliare, analisi di investimenti nel
                mercato romano, gestione di immobili vincolati e di pregio.
              </p>
            </div>

            <div className="bg-cream rounded-card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Ottimizzazione Fiscale</h3>
              <p className="text-sm text-gray-600">
                Strategie per ridurre legalmente il carico fiscale: PIR, regime PEX,
                pianificazione delle plusvalenze e minusvalenze.
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
                Pianificazione successoria per famiglie romane: testamento, trust,
                donazioni e patti di famiglia per trasmettere il patrimonio.
              </p>
            </div>

            <div className="bg-cream rounded-card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Protezione Patrimoniale</h3>
              <p className="text-sm text-gray-600">
                Strutture e strategie per proteggere il patrimonio da rischi
                professionali, familiari e di mercato.
              </p>
            </div>

            <div className="bg-cream rounded-card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Consulenza per Professionisti</h3>
              <p className="text-sm text-gray-600">
                Servizi dedicati a liberi professionisti romani: avvocati, medici,
                commercialisti, notai. Gestione previdenziale e investimenti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roma Market Section */}
      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest mb-6 text-center">
              Il mercato patrimoniale di Roma
            </h2>
            <div className="prose prose-lg text-gray-600 mx-auto">
              <p>
                Roma e la seconda piazza finanziaria italiana, con caratteristiche uniche.
                La Capitale ospita il piu grande patrimonio immobiliare storico del paese,
                una forte presenza del settore pubblico e delle professioni liberali,
                e un tessuto economico diversificato.
              </p>
              <h3>Il mercato immobiliare di pregio romano</h3>
              <p>
                Il real estate di lusso a Roma presenta dinamiche particolari. Zone come
                Parioli, Prati, Aventino, Trastevere e il Centro Storico mantengono valori
                elevati, spesso con immobili soggetti a vincoli architettonici. Offriamo
                consulenza specifica per la valorizzazione e gestione di questi asset.
              </p>
              <h3>Professionisti e alte cariche</h3>
              <p>
                Roma concentra un&apos;elevata percentuale di professionisti ad alto reddito:
                avvocati, notai, medici specialisti, dirigenti pubblici. Per loro offriamo
                consulenza specifica sulla previdenza integrativa, gestione delle casse
                professionali e ottimizzazione fiscale del reddito da lavoro autonomo.
              </p>
              <h3>Pianificazione per famiglie storiche</h3>
              <p>
                Molte famiglie romane detengono patrimoni tramandati da generazioni,
                spesso concentrati in immobili. Aiutiamo nella diversificazione, nella
                gestione delle dinamiche familiari e nella pianificazione successoria
                per preservare il patrimonio nelle generazioni future.
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
                  Qual e la differenza tra un consulente patrimoniale e un private banker?
                </h3>
                <p className="text-gray-600">
                  Il consulente patrimoniale indipendente lavora esclusivamente a parcella,
                  senza commissioni sui prodotti consigliati. Il private banker, invece,
                  e tipicamente remunerato dalla banca tramite commissioni sui prodotti venduti.
                  Questo crea potenziali conflitti di interesse che il modello fee-only elimina completamente.
                </p>
              </div>
              <div className="bg-cream rounded-card p-6">
                <h3 className="font-heading text-lg text-forest mb-2">
                  Offrite consulenza per investimenti immobiliari a Roma?
                </h3>
                <p className="text-gray-600">
                  Si, la consulenza immobiliare e parte integrante del nostro servizio di
                  wealth management a Roma. Analizziamo il mercato romano, valutiamo opportunita
                  di investimento e vi supportiamo nelle decisioni relative al patrimonio immobiliare,
                  incluse zone di pregio come Parioli, Prati e il Centro Storico.
                </p>
              </div>
              <div className="bg-cream rounded-card p-6">
                <h3 className="font-heading text-lg text-forest mb-2">
                  Come funziona la prima consulenza gratuita?
                </h3>
                <p className="text-gray-600">
                  La prima consulenza e un incontro conoscitivo di circa un&apos;ora, senza impegno.
                  Analizziamo insieme la vostra situazione patrimoniale attuale, comprendiamo i
                  vostri obiettivi e vi illustriamo come potremmo aiutarvi. Non e una vendita:
                  e un dialogo per capire se possiamo lavorare insieme.
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
              <p className="label mb-4">Contattaci a Roma</p>
              <h2 className="font-heading text-h3-sm md:text-h3 text-forest mb-6">
                Prenota una consulenza gratuita
              </h2>
              <p className="text-body-lg text-gray-500 mb-8">
                Incontriamoci nel nostro studio di Roma o in videochiamata.
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
                    <p className="font-medium text-forest">Sede Roma</p>
                    <p className="text-gray-500">
                      Via Veneto, 00187 Roma<br />
                      <span className="text-sm">Zona Via Veneto / Porta Pinciana</span>
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
                    <a href="mailto:roma@guidapatrimonio.it" className="text-gray-500 hover:text-green-600 transition-colors">
                      roma@guidapatrimonio.it
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
                    <a href="tel:+390612345678" className="text-gray-500 hover:text-green-600 transition-colors">
                      +39 06 1234567
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
            Unisciti ai nostri clienti romani che hanno scelto una consulenza
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
