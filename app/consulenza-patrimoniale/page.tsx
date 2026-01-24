import Link from 'next/link'
import { Navbar, Footer, Contact } from '@/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Consulenza Patrimoniale Indipendente | Guida Patrimonio',
  description: 'Consulenza patrimoniale indipendente e personalizzata. Il tuo consulente patrimoniale di fiducia per proteggere, gestire e far crescere il tuo patrimonio senza conflitti di interesse.',
  keywords: 'consulenza patrimoniale, consulente patrimoniale, consulenza patrimoniale indipendente, consulente finanziario indipendente, wealth advisor, pianificazione patrimoniale',
  openGraph: {
    title: 'Consulenza Patrimoniale Indipendente | Guida Patrimonio',
    description: 'Un consulente patrimoniale indipendente al tuo fianco per proteggere e far crescere il tuo patrimonio.',
    type: 'website',
    locale: 'it_IT',
    url: 'https://guidapatrimonio.it/consulenza-patrimoniale',
  },
  alternates: {
    canonical: 'https://guidapatrimonio.it/consulenza-patrimoniale',
  },
}

const services = [
  {
    title: 'Analisi Patrimoniale Completa',
    description: 'Mappiamo ogni asset: immobili, investimenti, partecipazioni, liquidita. Identifichiamo rischi nascosti e opportunita di ottimizzazione.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Pianificazione Finanziaria',
    description: 'Definiamo obiettivi di breve, medio e lungo termine. Costruiamo un piano di investimento coerente con il tuo profilo di rischio.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
  },
  {
    title: 'Ottimizzazione Fiscale',
    description: 'Riduciamo il carico fiscale in modo lecito sfruttando regimi agevolati, strutture societarie e pianificazione successoria.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Protezione Patrimoniale',
    description: 'Strutturiamo il patrimonio per proteggerlo da rischi imprenditoriali, matrimoniali e successori attraverso trust, holding e polizze.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Passaggio Generazionale',
    description: 'Pianifichiamo la trasmissione del patrimonio ai tuoi eredi minimizzando imposte e conflitti familiari.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'Monitoraggio Continuo',
    description: 'Ti accompagniamo nel tempo con revisioni periodiche per adattare la strategia alle tue esigenze che cambiano.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

const targetClients = [
  {
    title: 'Imprenditori e Professionisti',
    description: 'Hai costruito un patrimonio con il tuo lavoro e vuoi proteggerlo dai rischi professionali e ottimizzare la fiscalita.',
  },
  {
    title: 'Famiglie con Patrimonio',
    description: 'Vuoi pianificare il passaggio generazionale, evitando conflitti e minimizzando le imposte di successione.',
  },
  {
    title: 'Investitori con Portafogli Complessi',
    description: 'Hai investimenti diversificati e cerchi una visione d\'insieme e un\'ottimizzazione coordinata.',
  },
  {
    title: 'Chi Riceve Eredita o Liquidazioni',
    description: 'Hai ricevuto un capitale importante e vuoi investirlo in modo prudente e consapevole.',
  },
]

const processSteps = [
  {
    number: '01',
    title: 'Primo Incontro Conoscitivo',
    description: 'Una chiamata gratuita e senza impegno per capire la tua situazione, i tuoi obiettivi e le tue preoccupazioni. Nessuna pressione commerciale.',
  },
  {
    number: '02',
    title: 'Analisi Approfondita',
    description: 'Raccogliamo tutti i dati patrimoniali, fiscali e familiari. Analizziamo punti di forza, vulnerabilita e opportunita di miglioramento.',
  },
  {
    number: '03',
    title: 'Proposta Strategica',
    description: 'Ti presentiamo un piano personalizzato con raccomandazioni concrete, tempistiche e costi stimati. Decidi tu se procedere.',
  },
  {
    number: '04',
    title: 'Implementazione',
    description: 'Mettiamo in pratica la strategia insieme, coordinando professionisti (notai, commercialisti, avvocati) quando necessario.',
  },
  {
    number: '05',
    title: 'Monitoraggio e Revisione',
    description: 'Incontri periodici per verificare i risultati, adattare la strategia e affrontare nuove esigenze o opportunita.',
  },
]

const differences = [
  {
    traditional: 'Vendono prodotti della banca',
    independent: 'Consigliano strumenti sul mercato',
  },
  {
    traditional: 'Guadagnano su commissioni prodotti',
    independent: 'Onorario trasparente e concordato',
  },
  {
    traditional: 'Obiettivi di vendita trimestrali',
    independent: 'Focus sui tuoi obiettivi a lungo termine',
  },
  {
    traditional: 'Cambiano interlocutore spesso',
    independent: 'Rapporto personale continuativo',
  },
  {
    traditional: 'Portafogli standardizzati',
    independent: 'Strategie su misura',
  },
]

export default function ConsulenzaPatrimoniale() {
  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center bg-forest pt-navbar">
        <div className="absolute inset-0 bg-gradient-to-br from-forest via-green-600 to-forest opacity-90" />
        <div className="container-custom relative z-10 py-16">
          <div className="max-w-3xl">
            <p className="label text-green-300 mb-4">Consulenza Patrimoniale</p>
            <h1 className="font-heading text-[36px] md:text-[48px] lg:text-[60px] text-white leading-[1.1] mb-6 font-semibold">
              Il Tuo Consulente<br />
              Patrimoniale<br />
              Indipendente
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl">
              Nessun prodotto da vendere, nessun conflitto di interesse. Solo consigli
              personalizzati per proteggere e far crescere il tuo patrimonio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#contatti" className="btn-primary inline-flex items-center gap-2">
                Richiedi Consulenza Gratuita
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <Link href="#servizi" className="btn-transparent">
                Scopri i Servizi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest mb-6">
              Cos&apos;e la consulenza patrimoniale?
            </h2>
            <div className="prose prose-lg text-gray-500">
              <p>
                La <strong>consulenza patrimoniale</strong> e un servizio di pianificazione finanziaria
                globale che considera tutti gli aspetti del tuo patrimonio: investimenti, immobili,
                aziende, fiscalita, protezione e successione.
              </p>
              <p>
                A differenza della semplice gestione degli investimenti, un <strong>consulente
                patrimoniale</strong> analizza la tua situazione complessiva per creare una strategia
                integrata che ottimizzi ogni aspetto del tuo patrimonio.
              </p>
              <p>
                L&apos;obiettivo non e solo far crescere il capitale, ma <strong>proteggere cio che hai
                costruito</strong>, ridurre i rischi, ottimizzare la fiscalita e pianificare il
                trasferimento alle generazioni future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servizi" className="section-md bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="label mb-4">I Nostri Servizi</p>
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest">
              Cosa comprende la consulenza patrimoniale
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.title} className="bg-cream-dark rounded-card p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                  {service.icon}
                </div>
                <h3 className="font-heading text-xl text-forest mb-3">{service.title}</h3>
                <p className="text-gray-500">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is It For */}
      <section className="section-md bg-forest">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="label text-green-300 mb-4">Per Chi</p>
            <h2 className="font-heading text-h3-sm md:text-h3 text-white">
              A chi si rivolge la consulenza patrimoniale
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {targetClients.map((client) => (
              <div key={client.title} className="bg-white/10 backdrop-blur-sm rounded-card p-6">
                <h3 className="font-heading text-lg text-white mb-2">{client.title}</h3>
                <p className="text-white/70">{client.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <p className="text-white/60 text-sm mb-4">
              Non serve essere milionari. La consulenza patrimoniale e utile a partire da 250.000 euro di patrimonio.
            </p>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="label mb-4">Il Processo</p>
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest">
              Come funziona la consulenza patrimoniale
            </h2>
          </div>

          <div className="max-w-3xl mx-auto">
            {processSteps.map((step, index) => (
              <div key={step.number} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-heading font-semibold">
                    {step.number}
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="w-0.5 h-full bg-green-200 ml-6 mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="font-heading text-xl text-forest mb-2">{step.title}</h3>
                  <p className="text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="section-md bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="label mb-4">La Differenza</p>
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest">
              Consulente indipendente vs banca tradizionale
            </h2>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-card border border-gray-200">
            <div className="grid grid-cols-2">
              <div className="bg-gray-100 p-4 text-center font-semibold text-gray-700">
                Banca / Promotore
              </div>
              <div className="bg-green-600 p-4 text-center font-semibold text-white">
                Consulente Indipendente
              </div>
            </div>
            {differences.map((diff, index) => (
              <div key={index} className="grid grid-cols-2 border-t border-gray-200">
                <div className="p-4 text-gray-500 flex items-center">
                  <svg className="w-5 h-5 text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {diff.traditional}
                </div>
                <div className="p-4 bg-green-50 text-forest flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {diff.independent}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="section-sm bg-cream-dark">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-gray-400 text-sm mb-2">Strumenti Utili</p>
            <h3 className="font-heading text-xl text-forest">
              Esplora i nostri calcolatori gratuiti
            </h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Link href="/strumenti/patrimonio-netto" className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100 hover:border-green-200">
              <h4 className="font-heading text-base text-forest mb-1">Patrimonio Netto</h4>
              <p className="text-sm text-gray-500">Calcola il valore del tuo patrimonio</p>
            </Link>
            <Link href="/strumenti/holding" className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100 hover:border-green-200">
              <h4 className="font-heading text-base text-forest mb-1">Simulatore Holding</h4>
              <p className="text-sm text-gray-500">Valuta una struttura societaria</p>
            </Link>
            <Link href="/strumenti/successione" className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100 hover:border-green-200">
              <h4 className="font-heading text-base text-forest mb-1">Successione</h4>
              <p className="text-sm text-gray-500">Stima le imposte di successione</p>
            </Link>
            <Link href="/strumenti/trust-donazione" className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100 hover:border-green-200">
              <h4 className="font-heading text-base text-forest mb-1">Trust vs Donazione</h4>
              <p className="text-sm text-gray-500">Confronta le opzioni di trasferimento</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-lg bg-green-600">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-heading text-h3-sm md:text-h3 text-white mb-6">
              Inizia con una consulenza gratuita
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Prenota una chiamata conoscitiva senza impegno. Analizzeremo insieme
              la tua situazione e ti daremo un primo parere onesto su come procedere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#contatti" className="btn-reverse">
                Prenota una Consulenza
              </Link>
              <Link href="/gestione-patrimonio" className="inline-flex items-center justify-center text-white font-medium hover:underline">
                Scopri la gestione patrimonio
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Contact />
      <Footer />
    </main>
  )
}
