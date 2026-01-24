'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar, Footer, JsonLd, createFAQSchema, createBreadcrumbSchema } from '@/components'

// FAQ Data
const faqCategories = [
  {
    title: 'Consulenza Patrimoniale',
    faqs: [
      {
        question: "Cos'e la consulenza patrimoniale indipendente?",
        answer: "La consulenza patrimoniale indipendente e un servizio professionale offerto da consulenti che non hanno legami con banche o prodotti finanziari specifici. A differenza dei promotori finanziari tradizionali, il consulente indipendente viene remunerato esclusivamente dal cliente (fee-only), eliminando i conflitti di interesse. Questo modello garantisce consigli oggettivi su investimenti, pianificazione fiscale, passaggio generazionale e protezione del patrimonio, con l'unico obiettivo di massimizzare gli interessi del cliente.",
        relatedLinks: [
          { label: 'Calcolatore Patrimonio Netto', href: '/strumenti/patrimonio-netto' },
          { label: 'Contattaci', href: '/#contatti' }
        ]
      },
      {
        question: "Qual e la differenza tra consulente indipendente e promotore finanziario?",
        answer: "La differenza fondamentale sta nella remunerazione e nei potenziali conflitti di interesse. Il promotore finanziario e legato a una banca o rete e percepisce commissioni sui prodotti venduti, creando un incentivo a proporre prodotti piu remunerativi per se stesso. Il consulente indipendente (iscritto all'Albo OCF sezione fee-only) e pagato direttamente dal cliente con una parcella trasparente, senza alcun legame con case di investimento. Questo garantisce raccomandazioni imparziali basate esclusivamente sulle esigenze del cliente.",
        relatedLinks: [
          { label: 'Confronto Private Banking', href: '/strumenti/confronto-private-banking' },
          { label: 'Analizzatore Costi Fondi', href: '/strumenti/analizzatore-costi-fondi' }
        ]
      },
      {
        question: "Quanto costa una consulenza patrimoniale?",
        answer: "I costi variano in base alla complessita del patrimonio e ai servizi richiesti. Generalmente, la consulenza patrimoniale indipendente prevede: una tantum per il check-up iniziale (da 1.000 a 5.000 euro), oppure una fee annuale calcolata come percentuale del patrimonio gestito (tipicamente 0,3%-1% per patrimoni sopra il milione). Per confronto, il private banking tradizionale puo costare 1,5%-3% annuo considerando tutti i costi nascosti. La trasparenza dei costi e uno dei principali vantaggi della consulenza indipendente.",
        relatedLinks: [
          { label: 'Fee Analyzer', href: '/strumenti/costi-private-banking' },
          { label: 'Confronto Private Banking', href: '/strumenti/confronto-private-banking' }
        ]
      },
      {
        question: "Da che patrimonio conviene rivolgersi a un consulente?",
        answer: "Non esiste una soglia minima assoluta, ma la consulenza patrimoniale strutturata diventa particolarmente vantaggiosa a partire da 250.000-500.000 euro di patrimonio complessivo. Per patrimoni sotto questa soglia, i costi di consulenza potrebbero non essere giustificati rispetto ai benefici. Per patrimoni superiori a 1 milione di euro, la consulenza indipendente diventa quasi indispensabile per ottimizzare fiscalita, diversificazione e pianificazione successoria. Sopra i 5 milioni, si entra nel territorio del family office.",
        relatedLinks: [
          { label: 'Family Office Calculator', href: '/strumenti/family-office' },
          { label: 'Patrimonio Netto', href: '/strumenti/patrimonio-netto' }
        ]
      },
    ]
  },
  {
    title: 'Strumenti e Strategie',
    faqs: [
      {
        question: "Quando conviene creare una holding familiare?",
        answer: "La holding familiare diventa conveniente quando si posseggono partecipazioni in piu societa operative, immobili significativi o si pianifica un passaggio generazionale complesso. I vantaggi principali includono: regime PEX (tassazione al 5% invece del 26% sui capital gain da partecipazioni qualificate), consolidamento dei dividendi, protezione patrimoniale e semplificazione del passaggio generazionale. Generalmente, la struttura diventa efficiente con patrimoni aziendali/immobiliari superiori a 2-3 milioni di euro, considerando i costi di gestione annuali.",
        relatedLinks: [
          { label: 'Simulatore Holding', href: '/strumenti/holding' },
          { label: 'Exit Strategy', href: '/strumenti/exit-strategy' }
        ]
      },
      {
        question: "Cos'e un trust e quando serve?",
        answer: "Il trust e uno strumento giuridico di origine anglosassone, riconosciuto in Italia dalla Convenzione dell'Aja (1985), che permette di segregare beni affidandoli a un trustee per il beneficio di determinati soggetti. Serve principalmente per: protezione patrimoniale da aggressioni di creditori, pianificazione successoria complessa (figli minori, soggetti fragili), separazione tra patrimonio personale e aziendale, passaggio generazionale graduale. E particolarmente utile per patrimoni oltre i 3-5 milioni o in situazioni familiari articolate.",
        relatedLinks: [
          { label: 'Trust vs Donazione', href: '/strumenti/trust-donazione' },
          { label: 'Pianificatore Successione', href: '/strumenti/successione' }
        ]
      },
      {
        question: "Come funziona il passaggio generazionale di un'azienda?",
        answer: "Il passaggio generazionale aziendale e un processo complesso che richiede pianificazione pluriennale. Le opzioni principali sono: trasferimento diretto ai figli (donazione o successione), conferimento in holding con successiva cessione quote, patto di famiglia (accordo tra tutti i legittimari), trust o gestione fiduciaria, vendita a terzi (trade sale) o al management (MBO). Ogni opzione ha implicazioni fiscali diverse: la donazione di azienda puo beneficiare dell'esenzione totale da imposta se i beneficiari mantengono l'attivita per 5 anni.",
        relatedLinks: [
          { label: 'Exit Strategy Planner', href: '/strumenti/exit-strategy' },
          { label: 'Simulatore Holding', href: '/strumenti/holding' }
        ]
      },
      {
        question: "Qual e la differenza tra family office e private banking?",
        answer: "Il private banking e un servizio bancario per clienti con patrimoni elevati (tipicamente da 500.000 euro), che offre gestione investimenti, credito e servizi premium attraverso un banker dedicato, ma legato ai prodotti della banca. Il family office e una struttura indipendente (single o multi-family) che gestisce tutti gli aspetti patrimoniali di una o piu famiglie wealthy: investimenti, fiscalita, immobili, arte, passaggio generazionale, governance familiare. Il family office e adatto a patrimoni sopra i 10-20 milioni (single) o 3-5 milioni (multi-family).",
        relatedLinks: [
          { label: 'Family Office Calculator', href: '/strumenti/family-office' },
          { label: 'Confronto Private Banking', href: '/strumenti/confronto-private-banking' }
        ]
      },
    ]
  },
  {
    title: 'Fiscalita',
    faqs: [
      {
        question: "Come funziona la flat tax per neo-residenti?",
        answer: "Il regime dei neo-residenti (art. 24-bis TUIR) prevede un'imposta sostitutiva forfettaria di 100.000 euro annui su tutti i redditi prodotti all'estero, indipendentemente dall'importo. E accessibile a chi trasferisce la residenza fiscale in Italia dopo almeno 9 anni di residenza all'estero. Vantaggi: nessuna tassazione aggiuntiva su dividendi, capital gain, redditi immobiliari esteri; esenzione da IVAFE e IVIE; durata massima 15 anni. E ideale per imprenditori internazionali, manager con stock option estere, pensionati con patrimoni all'estero.",
        relatedLinks: [
          { label: 'Flat Tax Neo-Residenti', href: '/strumenti/flat-tax-100k' },
          { label: 'IVAFE/IVIE Calculator', href: '/strumenti/ivafe-ivie' }
        ]
      },
      {
        question: "Cosa sono IVAFE e IVIE?",
        answer: "IVAFE (Imposta sul Valore delle Attivita Finanziarie Estere) e IVIE (Imposta sul Valore degli Immobili all'Estero) sono imposte patrimoniali sui beni detenuti fuori dall'Italia. L'IVAFE e pari allo 0,2% annuo sul valore di mercato di conti correnti, depositi, investimenti finanziari esteri. L'IVIE e pari allo 0,76% sul valore catastale (o di acquisto) degli immobili esteri, con alcune riduzioni per l'abitazione principale. Entrambe vanno dichiarate nel quadro RW della dichiarazione dei redditi.",
        relatedLinks: [
          { label: 'IVAFE/IVIE Calculator', href: '/strumenti/ivafe-ivie' },
          { label: 'Flat Tax Neo-Residenti', href: '/strumenti/flat-tax-100k' }
        ]
      },
      {
        question: "Come si ottimizza la tassazione sui dividendi?",
        answer: "I dividendi da partecipazioni qualificate in societa italiane sono tassati al 26% come ritenuta a titolo d'imposta. Le strategie di ottimizzazione includono: utilizzo di una holding con regime PEX (tassazione effettiva circa 1,2% sui dividendi ricevuti), intestazione a societa semplice per sfruttare il regime della trasparenza, timing della distribuzione per ottimizzare l'IRPEF personale, reinvestimento in azienda invece di distribuzione. Per dividendi esteri, verificare i trattati contro le doppie imposizioni per recuperare ritenute alla fonte.",
        relatedLinks: [
          { label: 'Calcolatore Dividendi', href: '/strumenti/calcolatore-dividendi' },
          { label: 'Simulatore Holding', href: '/strumenti/holding' }
        ]
      },
      {
        question: "Conviene la cedolare secca o l'IRPEF?",
        answer: "La cedolare secca (21% per contratti liberi, 10% per canone concordato) conviene rispetto all'IRPEF ordinaria quando l'aliquota marginale supera queste percentuali. In pratica: con reddito complessivo sopra 28.000 euro, la cedolare al 21% e quasi sempre vantaggiosa; il canone concordato al 10% e conveniente per qualsiasi livello di reddito. Attenzione: con cedolare secca si rinuncia all'aggiornamento ISTAT del canone. Per immobili commerciali, la cedolare non e applicabile e si valutano strutture societarie alternative.",
        relatedLinks: [
          { label: 'Rendita Immobiliare', href: '/strumenti/rendita-immobiliare' },
          { label: 'Portafoglio Immobiliare', href: '/strumenti/portafoglio-immobiliare' }
        ]
      },
    ]
  },
  {
    title: 'Investimenti',
    faqs: [
      {
        question: "Qual e la giusta asset allocation per patrimoni elevati?",
        answer: "Non esiste un'allocazione universale, ma per patrimoni HNWI (High Net Worth Individual) si applicano principi specifici: diversificazione tra asset class decorrelate (azioni globali, obbligazioni, immobili, private equity, hedge fund, oro), allocazione geografica internazionale, componente illiquida maggiore (private market) grazie a orizzonti temporali lunghi, focus sulla preservazione del capitale oltre che sulla crescita. Una struttura tipica: 40-50% equity globale, 20-30% bond, 15-20% real estate, 10-15% alternativi. La personalizzazione dipende da eta, obiettivi e propensione al rischio.",
        relatedLinks: [
          { label: 'Ottimizzatore Allocazione', href: '/strumenti/ottimizzatore-allocazione' },
          { label: 'Portfolio Rebalancer', href: '/strumenti/portfolio-rebalancer' }
        ]
      },
      {
        question: "ETF o gestione attiva per grandi patrimoni?",
        answer: "Per la maggior parte degli investitori, inclusi gli HNWI, gli ETF a basso costo sovraperformano la gestione attiva nel lungo termine, specialmente sui mercati efficienti (USA, Europa developed). Tuttavia, per patrimoni elevati ha senso combinare: ETF per il core del portafoglio (60-70%), gestione attiva per mercati meno efficienti (emergenti, small cap), investimenti diretti in private equity/venture capital, real estate diretto. Il vantaggio degli ETF e la trasparenza dei costi: 0,1-0,3% annuo vs 1,5-2,5% della gestione attiva tradizionale.",
        relatedLinks: [
          { label: 'Confronto ETF', href: '/strumenti/confronto-etf' },
          { label: 'Analizzatore Costi Fondi', href: '/strumenti/analizzatore-costi-fondi' }
        ]
      },
      {
        question: "Come proteggere il patrimonio dall'inflazione?",
        answer: "Le strategie anti-inflazione per grandi patrimoni includono: investimenti in asset reali (immobili, infrastrutture, materie prime), azioni di aziende con pricing power (lusso, tech, healthcare), obbligazioni indicizzate all'inflazione (BTP Italia, TIPS americani), oro e metalli preziosi come hedge, esposizione valutaria diversificata, investimenti in private equity e aziende con ricavi legati all'inflazione. Per patrimoni importanti, la chiave e la diversificazione tra queste classi, evitando la concentrazione in liquidita o obbligazioni nominali a lungo termine.",
        relatedLinks: [
          { label: 'Calcolatore Inflazione', href: '/strumenti/inflazione' },
          { label: 'Dashboard Macro', href: '/strumenti/dashboard-macro' }
        ]
      },
    ]
  },
]

// Flatten FAQs for schema
const allFaqs = faqCategories.flatMap(cat => cat.faqs)

// Accordion Item Component
function AccordionItem({
  faq,
  isOpen,
  onToggle
}: {
  faq: typeof allFaqs[0]
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full py-6 flex items-start justify-between text-left group"
        aria-expanded={isOpen}
      >
        <span className="font-heading text-lg md:text-xl text-forest pr-4 group-hover:text-green-600 transition-colors">
          {faq.question}
        </span>
        <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full border border-forest/20 transition-all ${isOpen ? 'bg-forest text-white rotate-180' : 'text-forest'}`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] pb-6' : 'max-h-0'}`}
      >
        <p className="text-gray-600 leading-relaxed mb-4">
          {faq.answer}
        </p>
        {faq.relatedLinks && faq.relatedLinks.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-sm text-gray-400">Strumenti correlati:</span>
            {faq.relatedLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-green-600 hover:text-green-700 underline underline-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (question: string) => {
    setOpenItems(prev => ({
      ...prev,
      [question]: !prev[question]
    }))
  }

  const faqSchema = createFAQSchema(allFaqs.map(f => ({ question: f.question, answer: f.answer })))
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: 'Home', url: 'https://guidapatrimonio.it' },
    { name: 'FAQ', url: 'https://guidapatrimonio.it/faq' },
  ])

  return (
    <main>
      <JsonLd data={[faqSchema, breadcrumbSchema]} />
      <Navbar />

      {/* Hero */}
      <section className="bg-forest pt-navbar">
        <div className="container-custom py-20 md:py-28">
          <p className="text-green-300/60 text-sm font-medium tracking-wider uppercase mb-4">
            Domande Frequenti
          </p>
          <h1 className="font-heading text-[40px] md:text-[56px] text-white leading-tight max-w-3xl">
            Tutto quello che devi sapere sulla gestione patrimoniale
          </h1>
          <p className="text-lg text-white/50 mt-6 max-w-2xl">
            Risposte chiare e complete alle domande piu comuni su consulenza patrimoniale,
            strumenti di protezione, fiscalita e strategie di investimento.
          </p>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="bg-cream border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="flex flex-wrap gap-4">
            {faqCategories.map(category => (
              <a
                key={category.title}
                href={`#${category.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm text-forest hover:text-green-600 transition-colors"
              >
                {category.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            {faqCategories.map((category, catIndex) => (
              <div
                key={category.title}
                id={category.title.toLowerCase().replace(/\s+/g, '-')}
                className={catIndex > 0 ? 'mt-16' : ''}
              >
                <h2 className="text-xs font-medium text-forest/40 uppercase tracking-wider mb-8">
                  {category.title}
                </h2>
                <div>
                  {category.faqs.map((faq) => (
                    <AccordionItem
                      key={faq.question}
                      faq={faq}
                      isOpen={!!openItems[faq.question]}
                      onToggle={() => toggleItem(faq.question)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream py-16 md:py-20">
        <div className="container-custom">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-heading text-2xl md:text-3xl text-forest mb-4">
              Non hai trovato la risposta?
            </h2>
            <p className="text-gray-500 mb-8">
              Ogni situazione patrimoniale e unica. Contattaci per una consulenza personalizzata.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contatti"
                className="inline-flex items-center justify-center gap-2 bg-forest text-white px-6 py-3 rounded font-medium hover:bg-green-700 transition-colors"
              >
                Richiedi Consulenza
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/strumenti"
                className="inline-flex items-center justify-center gap-2 bg-white text-forest border border-forest/20 px-6 py-3 rounded font-medium hover:bg-gray-50 transition-colors"
              >
                Esplora Strumenti
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
