import Link from 'next/link'
import { Navbar, Footer } from '@/components'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Come Investire 100.000 Euro nel 2025 | Guida Completa',
  description: 'Scopri come investire 100.000 euro in modo sicuro e redditizio. Guida completa alle migliori strategie di investimento per il tuo capitale.',
  keywords: 'investire 100000 euro, come investire 100mila euro, investire 100k, investimento 100000 euro',
}

const investmentOptions = [
  {
    title: 'Mercati Finanziari',
    description: 'ETF, azioni, obbligazioni. Rendimenti potenziali più alti ma richiedono competenza e tempo.',
    risk: 'Medio-Alto',
    horizon: '5+ anni',
  },
  {
    title: 'Immobiliare',
    description: 'Acquisto di immobili da affittare o rivendere. Capitale bloccato ma rendita costante.',
    risk: 'Medio',
    horizon: '10+ anni',
  },
  {
    title: 'Conti Deposito',
    description: 'Sicurezza garantita ma rendimenti bassi, spesso sotto l\'inflazione.',
    risk: 'Basso',
    horizon: '1-3 anni',
  },
  {
    title: 'Fondi Comuni',
    description: 'Gestione professionale ma commissioni elevate che erodono i rendimenti.',
    risk: 'Variabile',
    horizon: '3-7 anni',
  },
]

const mistakes = [
  {
    title: 'Affidarsi alla banca',
    description: 'Le banche vendono i propri prodotti, non quelli migliori per te. Conflitto di interesse strutturale.',
  },
  {
    title: 'Inseguire i rendimenti',
    description: 'Investire in base alle performance passate porta spesso a comprare ai massimi e vendere ai minimi.',
  },
  {
    title: 'Non diversificare',
    description: 'Concentrare tutto su pochi investimenti aumenta enormemente il rischio di perdite.',
  },
  {
    title: 'Ignorare i costi',
    description: 'Commissioni dell\'1-2% annuo sembrano poco, ma in 20 anni erodono il 30-40% del capitale.',
  },
]

export default function Investire100Mila() {
  return (
    <main>
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center bg-forest pt-navbar">
        <div className="absolute inset-0 bg-forest opacity-90" />
        <div className="container-custom relative z-10 py-16">
          <div className="max-w-3xl">
            <p className="label text-green-300 mb-4">Guida agli Investimenti</p>
            <h1 className="font-heading text-[36px] md:text-[48px] lg:text-[60px] text-white leading-[1.1] mb-6 font-semibold">
              Come Investire<br />
              100.000 Euro<br />
              nel 2025
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl">
              Hai accumulato un capitale importante. Ora la domanda cruciale:
              come farlo fruttare senza rischiare di perderlo?
            </p>
            <Link href="#consulenza" className="btn-primary inline-flex items-center gap-2">
              Parla con un Consulente
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest mb-6">
              100.000 euro sono un traguardo importante
            </h2>
            <div className="prose prose-lg text-gray-500">
              <p>
                Che tu li abbia risparmiati nel tempo, ricevuti da un&apos;eredità, o ottenuti dalla
                vendita di un immobile, <strong>100.000 euro rappresentano un capitale significativo</strong> che
                merita una gestione attenta e professionale.
              </p>
              <p>
                La tentazione di &quot;parcheggiarli&quot; sul conto corrente o affidarsi ciecamente
                alla banca è forte. Ma entrambe le scelte hanno un costo nascosto:
                l&apos;inflazione erode il potere d&apos;acquisto, mentre i prodotti bancari
                spesso privilegiano gli interessi dell&apos;istituto rispetto ai tuoi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Options */}
      <section className="section-md bg-white">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="label mb-4">Le Opzioni</p>
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest">
              Dove puoi investire 100.000 euro?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {investmentOptions.map((option) => (
              <div key={option.title} className="bg-cream-dark rounded-card p-6">
                <h3 className="font-heading text-xl text-forest mb-3">{option.title}</h3>
                <p className="text-gray-500 mb-4">{option.description}</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-400">
                    Rischio: <span className="text-forest font-medium">{option.risk}</span>
                  </span>
                  <span className="text-gray-400">
                    Orizzonte: <span className="text-forest font-medium">{option.horizon}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Mistakes */}
      <section className="section-md bg-forest">
        <div className="container-custom">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="label text-green-300 mb-4">Attenzione</p>
            <h2 className="font-heading text-h3-sm md:text-h3 text-white">
              I 4 errori da evitare
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {mistakes.map((mistake, index) => (
              <div key={mistake.title} className="bg-white/10 backdrop-blur-sm rounded-card p-6">
                <div className="flex items-start gap-4">
                  <span className="text-green-400 font-heading text-2xl font-semibold">
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-heading text-lg text-white mb-2">{mistake.title}</h3>
                    <p className="text-white/70 text-sm">{mistake.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <p className="label mb-4">La Soluzione</p>
            <h2 className="font-heading text-h3-sm md:text-h3 text-forest mb-6">
              Un consulente indipendente al tuo fianco
            </h2>
            <p className="text-lg text-gray-500 mb-8">
              A differenza di banche e promotori finanziari, un consulente patrimoniale
              indipendente non vende prodotti e non ha conflitti di interesse.
              Il suo unico obiettivo è proteggere e far crescere il tuo patrimonio.
            </p>

            <div className="grid md:grid-cols-3 gap-6 text-left mt-12">
              <div className="bg-white rounded-card p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg text-forest mb-2">Analisi Completa</h3>
                <p className="text-gray-500 text-sm">
                  Valutiamo la tua situazione patrimoniale, fiscale e i tuoi obiettivi di vita.
                </p>
              </div>

              <div className="bg-white rounded-card p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg text-forest mb-2">Strategia Su Misura</h3>
                <p className="text-gray-500 text-sm">
                  Creiamo un piano di investimento personalizzato, non un prodotto preconfezionato.
                </p>
              </div>

              <div className="bg-white rounded-card p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg text-forest mb-2">Monitoraggio Continuo</h3>
                <p className="text-gray-500 text-sm">
                  Ti accompagniamo nel tempo, adattando la strategia alle tue esigenze che cambiano.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="consulenza" className="section-lg bg-green-600">
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
              <Link href="/#contatti" className="btn-reverse">
                Prenota una Consulenza
              </Link>
              <Link href="/" className="inline-flex items-center justify-center text-white font-medium hover:underline">
                Scopri chi siamo
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="section-sm bg-cream-dark">
        <div className="container-custom">
          <div className="max-w-xl mx-auto text-center">
            <p className="text-gray-400 text-sm mb-4">Strumento Utile</p>
            <h3 className="font-heading text-xl text-forest mb-4">
              Hai venduto un immobile?
            </h3>
            <p className="text-gray-500 mb-6">
              Calcola gratuitamente le tasse sulla plusvalenza con il nostro strumento online.
            </p>
            <a
              href="https://calcoloplusvalenza.it"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Calcola Plusvalenza
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
