import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar, Footer, ContactForm, JsonLd } from '@/components'

export const metadata: Metadata = {
  title: 'Consulenza Patrimoniale Svizzera | Gestione Patrimonio Svizzera per Italiani',
  description: 'Consulenza patrimoniale per italiani con asset in Svizzera. Gestione patrimonio, ottimizzazione fiscale transfrontaliera, voluntary disclosure e pianificazione cross-border.',
  keywords: 'consulenza patrimoniale svizzera, gestione patrimonio svizzera, italiani svizzera, voluntary disclosure, fiscalita transfrontaliera, conti svizzeri, investimenti svizzera',
  openGraph: {
    title: 'Consulenza Patrimoniale Svizzera | Guida Patrimonio',
    description: 'Consulenza per italiani con patrimoni in Svizzera. Wealth management cross-border e ottimizzazione fiscale.',
    type: 'website',
    locale: 'it_IT',
    url: 'https://guidapatrimonio.it/consulenza-patrimoniale-svizzera',
  },
  alternates: {
    canonical: 'https://guidapatrimonio.it/consulenza-patrimoniale-svizzera',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'FinancialService',
  '@id': 'https://guidapatrimonio.it/consulenza-patrimoniale-svizzera#local',
  name: 'Guida Patrimonio - Consulenza Patrimoniale Svizzera',
  description: 'Consulenza patrimoniale per clienti italiani con asset in Svizzera. Wealth management cross-border.',
  url: 'https://guidapatrimonio.it/consulenza-patrimoniale-svizzera',
  telephone: '+39 02 1234567',
  email: 'svizzera@guidapatrimonio.it',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Via Monte Napoleone',
    addressLocality: 'Milano',
    addressRegion: 'Lombardia',
    postalCode: '20121',
    addressCountry: 'IT',
  },
  areaServed: [
    {
      '@type': 'Country',
      name: 'Italia',
    },
    {
      '@type': 'Country',
      name: 'Svizzera',
    },
  ],
  priceRange: '$$$$',
  serviceType: [
    'Consulenza Patrimoniale Cross-Border',
    'Wealth Management Svizzera',
    'Ottimizzazione Fiscale Transfrontaliera',
    'Voluntary Disclosure',
    'Pianificazione Successoria Internazionale',
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
      name: 'Come funziona la tassazione per italiani con conti in Svizzera?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'I residenti fiscali italiani devono dichiarare tutti i conti esteri, inclusi quelli svizzeri, nel quadro RW della dichiarazione dei redditi e pagare IVAFE (0,2% sul saldo) e imposte sui redditi finanziari (26% su interessi, dividendi e capital gains). Il segreto bancario svizzero non esiste piu per i residenti italiani grazie allo scambio automatico di informazioni (CRS).',
      },
    },
    {
      '@type': 'Question',
      name: 'Conviene ancora avere investimenti in Svizzera?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Si, per diversi motivi: stabilita politica ed economica, valuta forte (CHF), accesso a gestori patrimoniali di eccellenza, e alcune strutture di investimento non disponibili in Italia. Tuttavia, e fondamentale essere in regola fiscalmente. Valutiamo insieme se ha senso per la vostra situazione specifica.',
      },
    },
    {
      '@type': 'Question',
      name: 'Cos\'e la voluntary disclosure e come funziona?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'La voluntary disclosure e la procedura che permette di regolarizzare capitali non dichiarati detenuti all estero, pagando imposte, interessi e sanzioni ridotte. E l unico modo legale per sanare situazioni pregresse. Offriamo consulenza completa per valutare se e come procedere.',
      },
    },
  ],
}

export default function ConsulenzaPatrimonialeSvizzera() {
  return (
    <main>
      <Navbar />
      <JsonLd data={[localBusinessSchema, faqSchema]} />

      {/* Hero Section */}
      <section className="relative pt-navbar overflow-hidden">
        {/* Background Image - Lugano Svizzera */}
        <Image
          src="/images/finance/svizzera-lugano.webp"
          alt="Panorama di Lugano in Svizzera, destinazione per la gestione patrimoniale cross-border"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-forest/80" />

        <div className="container-custom py-16 md:py-24 relative z-10">
          <div className="max-w-3xl">
            <p className="text-green-300 text-sm font-medium mb-4 tracking-wider uppercase">
              Consulenza Cross-Border
            </p>
            <h1 className="font-heading text-[36px] md:text-[52px] text-white leading-tight mb-6">
              Consulenza Patrimoniale per Italiani con Asset in Svizzera
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl">
              Gestione patrimonio cross-border, ottimizzazione fiscale transfrontaliera
              e pianificazione per italiani con investimenti in Svizzera.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#contatti" className="btn-primary">
                Prenota Consulenza Gratuita
              </Link>
              <Link href="/strumenti/ivafe-ivie" className="btn-secondary-light">
                Calcola IVAFE/IVIE
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
                Perche gli italiani scelgono la Svizzera
              </h2>
              <div className="prose prose-lg text-gray-600">
                <p>
                  La Svizzera rimane una delle destinazioni preferite per la gestione patrimoniale
                  degli italiani HNWI. Nonostante la fine del segreto bancario e l&apos;introduzione
                  dello scambio automatico di informazioni (CRS), il Paese elvetico offre vantaggi
                  concreti che continuano ad attrarre investitori italiani.
                </p>
                <p>
                  Tuttavia, la gestione di patrimoni cross-border richiede competenze specifiche:
                  dalla fiscalita transfrontaliera agli obblighi di monitoraggio, dalla scelta
                  della banca giusta alla strutturazione ottimale degli investimenti. Errori in
                  questo ambito possono costare caro, sia in termini di sanzioni che di opportunita mancate.
                </p>
                <p>
                  Come consulenti <strong>indipendenti</strong>, non siamo legati a nessuna banca
                  svizzera. Questo ci permette di consigliarvi in modo imparziale, valutando se
                  la Svizzera e davvero la scelta migliore per la vostra situazione e, in caso
                  positivo, quale struttura e quale istituto scegliere.
                </p>
              </div>
            </div>
            <div className="bg-white rounded-card p-8 shadow-lg">
              <h3 className="font-heading text-xl text-forest mb-6">Vantaggi della Svizzera</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-forest">Stabilita politica ed economica</p>
                    <p className="text-sm text-gray-500">Neutralita storica e sistema federale collaudato</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-forest">Franco svizzero forte</p>
                    <p className="text-sm text-gray-500">Diversificazione valutaria naturale vs EUR</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-forest">Eccellenza nel wealth management</p>
                    <p className="text-sm text-gray-500">Tradizione secolare nella gestione patrimoniale</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-forest">Prodotti esclusivi</p>
                    <p className="text-sm text-gray-500">Accesso a fondi e strutture non disponibili in Italia</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="font-medium text-forest">Vicinanza geografica</p>
                    <p className="text-sm text-gray-500">Lugano, Chiasso e Zurigo a poche ore dall Italia</p>
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
              I nostri servizi per clienti con asset in Svizzera
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Consulenza completa per la gestione di patrimoni cross-border,
              dalla regolarizzazione alla pianificazione fiscale ottimale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-cream rounded-card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Regolarizzazione e Compliance</h3>
              <p className="text-sm text-gray-600">
                Assistenza nella voluntary disclosure per capitali non dichiarati,
                verifica della compliance fiscale attuale e correzione di errori pregressi.
              </p>
            </div>

            <div className="bg-cream rounded-card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Ottimizzazione IVAFE/IVIE</h3>
              <p className="text-sm text-gray-600">
                Strategie per minimizzare l impatto di IVAFE (0,2%) e IVIE sugli asset svizzeri,
                inclusa la scelta della struttura di detenzione ottimale.
              </p>
            </div>

            <div className="bg-cream rounded-card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Selezione Banche Svizzere</h3>
              <p className="text-sm text-gray-600">
                Valutazione indipendente delle banche svizzere per clientela italiana:
                UBS, Credit Suisse, Julius Bar, Pictet, Lombard Odier e boutique banks.
              </p>
            </div>

            <div className="bg-cream rounded-card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Pianificazione Successoria Cross-Border</h3>
              <p className="text-sm text-gray-600">
                Strutturazione del passaggio generazionale per patrimoni distribuiti
                tra Italia e Svizzera, evitando doppie imposizioni e conflitti di legge.
              </p>
            </div>

            <div className="bg-cream rounded-card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Immobili in Svizzera</h3>
              <p className="text-sm text-gray-600">
                Consulenza per l acquisto di immobili in Svizzera (Lex Koller),
                gestione fiscale e ottimizzazione della detenzione.
              </p>
            </div>

            <div className="bg-cream rounded-card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Frontalieri e Residenti</h3>
              <p className="text-sm text-gray-600">
                Consulenza specifica per frontalieri italiani in Svizzera e per chi
                sta valutando il trasferimento della residenza.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Fiscal Section */}
      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest mb-6 text-center">
              La fiscalita per italiani con asset in Svizzera
            </h2>
            <div className="prose prose-lg text-gray-600 mx-auto">
              <p>
                La fine del segreto bancario svizzero per i residenti italiani (grazie all&apos;accordo
                CRS - Common Reporting Standard) ha cambiato radicalmente lo scenario. Oggi,
                detenere asset in Svizzera e perfettamente legale, ma richiede piena trasparenza
                fiscale verso l&apos;Italia.
              </p>

              <h3>Obblighi dichiarativi</h3>
              <p>
                I residenti fiscali italiani devono dichiarare tutti gli asset svizzeri nel
                <strong> quadro RW</strong> della dichiarazione dei redditi. Questo include:
              </p>
              <ul>
                <li>Conti correnti e depositi</li>
                <li>Titoli e investimenti finanziari</li>
                <li>Polizze assicurative</li>
                <li>Immobili</li>
                <li>Partecipazioni societarie</li>
                <li>Cassette di sicurezza</li>
              </ul>

              <h3>Imposte applicabili</h3>
              <p>
                Oltre alla dichiarazione, sono dovute specifiche imposte:
              </p>
              <ul>
                <li><strong>IVAFE</strong>: 0,2% annuo sul valore degli asset finanziari</li>
                <li><strong>IVIE</strong>: 0,76% sul valore degli immobili (o 0,4% per abitazione principale)</li>
                <li><strong>Imposte sui redditi</strong>: 26% su interessi, dividendi e capital gains</li>
              </ul>

              <h3>Voluntary disclosure</h3>
              <p>
                Per chi ha asset non dichiarati, la voluntary disclosure rappresenta l&apos;unica via
                per regolarizzare la posizione evitando conseguenze penali. La procedura prevede
                il pagamento di imposte evase, interessi e sanzioni ridotte. Valutiamo insieme
                se e quando procedere con la regolarizzazione.
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
                  Come funziona la tassazione per italiani con conti in Svizzera?
                </h3>
                <p className="text-gray-600">
                  I residenti fiscali italiani devono dichiarare tutti i conti esteri, inclusi
                  quelli svizzeri, nel quadro RW della dichiarazione dei redditi e pagare IVAFE
                  (0,2% sul saldo) e imposte sui redditi finanziari (26% su interessi, dividendi
                  e capital gains). Il segreto bancario svizzero non esiste piu per i residenti
                  italiani grazie allo scambio automatico di informazioni (CRS).
                </p>
              </div>
              <div className="bg-cream rounded-card p-6">
                <h3 className="font-heading text-lg text-forest mb-2">
                  Conviene ancora avere investimenti in Svizzera?
                </h3>
                <p className="text-gray-600">
                  Si, per diversi motivi: stabilita politica ed economica, valuta forte (CHF),
                  accesso a gestori patrimoniali di eccellenza, e alcune strutture di investimento
                  non disponibili in Italia. Tuttavia, e fondamentale essere in regola fiscalmente.
                  Valutiamo insieme se ha senso per la vostra situazione specifica.
                </p>
              </div>
              <div className="bg-cream rounded-card p-6">
                <h3 className="font-heading text-lg text-forest mb-2">
                  Cos&apos;e la voluntary disclosure e come funziona?
                </h3>
                <p className="text-gray-600">
                  La voluntary disclosure e la procedura che permette di regolarizzare capitali
                  non dichiarati detenuti all&apos;estero, pagando imposte, interessi e sanzioni ridotte.
                  E l&apos;unico modo legale per sanare situazioni pregresse. Offriamo consulenza
                  completa per valutare se e come procedere.
                </p>
              </div>
              <div className="bg-cream rounded-card p-6">
                <h3 className="font-heading text-lg text-forest mb-2">
                  Quali banche svizzere consigliate per clienti italiani?
                </h3>
                <p className="text-gray-600">
                  Come consulenti indipendenti, non abbiamo accordi con banche specifiche.
                  Valutiamo caso per caso quale istituto sia piu adatto alle vostre esigenze,
                  considerando costi, servizi, soglie minime e specializzazione. Spesso
                  le boutique banks offrono condizioni migliori delle grandi istituzioni
                  per patrimoni di media dimensione.
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
              <p className="label mb-4">Consulenza Cross-Border</p>
              <h2 className="font-heading text-h3-sm md:text-h3 text-forest mb-6">
                Prenota una consulenza riservata
              </h2>
              <p className="text-body-lg text-gray-500 mb-8">
                Discutiamo in modo riservato della tua situazione. Le consulenze possono
                avvenire presso il nostro studio di Milano o in videochiamata sicura.
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
                    <p className="font-medium text-forest">Sede Principale</p>
                    <p className="text-gray-500">
                      Milano, Italia<br />
                      <span className="text-sm">Consulenze anche a Lugano su appuntamento</span>
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
                    <a href="mailto:svizzera@guidapatrimonio.it" className="text-gray-500 hover:text-green-600 transition-colors">
                      svizzera@guidapatrimonio.it
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-forest">Riservatezza garantita</p>
                    <p className="text-gray-500">
                      Tutte le comunicazioni sono protette dal segreto professionale
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  <strong>Nota:</strong> Se hai asset non dichiarati in Svizzera, la prima cosa da
                  fare e valutare con calma la situazione. Non agire d&apos;impulso. Una consulenza
                  riservata ti aiutera a capire le opzioni disponibili.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-card p-8 shadow-lg">
              <h3 className="font-heading text-xl text-forest mb-6">
                Richiedi una consulenza riservata
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
            Gestisci i tuoi asset svizzeri in modo ottimale
          </h2>
          <p className="text-white/80 mb-8 max-w-lg mx-auto">
            Che tu voglia regolarizzare una situazione pregressa o semplicemente
            ottimizzare la gestione dei tuoi investimenti in Svizzera, possiamo aiutarti.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="#contatti" className="btn-reverse">
              Prenota Consulenza Riservata
            </Link>
            <Link href="/strumenti/ivafe-ivie" className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Calcola IVAFE/IVIE
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
