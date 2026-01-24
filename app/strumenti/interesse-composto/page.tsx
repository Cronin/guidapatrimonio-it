'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer, JsonLd, createCalculatorSchema, createBreadcrumbSchema, createFAQSchema , RatingWidget} from '@/components'

// Static schema data
const calculatorSchema = createCalculatorSchema({
  name: 'Calcolatore Interesse Composto',
  description: 'Calcola la crescita del tuo capitale con l\'interesse composto. Simula rendimenti, versamenti periodici e proiezioni a lungo termine.',
  url: 'https://guidapatrimonio.it/strumenti/interesse-composto',
})

const breadcrumbSchema = createBreadcrumbSchema([
  { name: 'Home', url: 'https://guidapatrimonio.it' },
  { name: 'Strumenti', url: 'https://guidapatrimonio.it/strumenti' },
  { name: 'Calcolatore Interesse Composto', url: 'https://guidapatrimonio.it/strumenti/interesse-composto' },
])

const faqSchema = createFAQSchema([
  {
    question: 'Come funziona l\'interesse composto?',
    answer: 'L\'interesse composto e il meccanismo per cui gli interessi generati da un investimento vengono reinvestiti e generano a loro volta nuovi interessi. La formula e: Montante = Capitale x (1 + tasso)^anni.',
  },
  {
    question: 'Qual e la differenza tra interesse semplice e composto?',
    answer: 'L\'interesse semplice si calcola solo sul capitale iniziale, mentre l\'interesse composto si calcola anche sugli interessi gia maturati, creando un effetto esponenziale nel tempo.',
  },
  {
    question: 'Quanto rende l\'interesse composto?',
    answer: 'Con 10.000 EUR investiti al 7% annuo per 20 anni, otterresti circa 38.700 EUR - quasi 4 volte il capitale iniziale grazie all\'effetto dell\'interesse composto.',
  },
])

export default function InteresseComposto() {
  const [capitale, setCapitale] = useState(10000)
  const [tassoAnnuo, setTassoAnnuo] = useState(7)
  const [anni, setAnni] = useState(20)
  const [apporti, setApporti] = useState(0)
  const [frequenzaApporti, setFrequenzaApporti] = useState<'mensile' | 'annuale'>('mensile')

  const risultati = useMemo(() => {
    const tassoPerPeriodo = frequenzaApporti === 'mensile'
      ? tassoAnnuo / 100 / 12
      : tassoAnnuo / 100
    const periodiTotali = frequenzaApporti === 'mensile' ? anni * 12 : anni

    // Calcolo con formula interesse composto + versamenti periodici
    let montanteFinale = capitale * Math.pow(1 + tassoPerPeriodo, periodiTotali)

    if (apporti > 0) {
      // Formula rendita: PMT * ((1+r)^n - 1) / r
      montanteFinale += apporti * ((Math.pow(1 + tassoPerPeriodo, periodiTotali) - 1) / tassoPerPeriodo)
    }

    const totaleVersato = capitale + (apporti * periodiTotali)
    const interessiMaturati = montanteFinale - totaleVersato

    // Calcolo anno per anno per il grafico
    const datiAnnuali = []
    let capitaleCorrente = capitale
    for (let anno = 0; anno <= anni; anno++) {
      if (anno > 0) {
        const periodiAnno = frequenzaApporti === 'mensile' ? 12 : 1
        for (let p = 0; p < periodiAnno; p++) {
          capitaleCorrente = capitaleCorrente * (1 + tassoPerPeriodo) + apporti
        }
      }
      datiAnnuali.push({
        anno,
        valore: capitaleCorrente,
        versato: capitale + (apporti * (frequenzaApporti === 'mensile' ? anno * 12 : anno)),
      })
    }

    return {
      montanteFinale,
      totaleVersato,
      interessiMaturati,
      datiAnnuali,
    }
  }, [capitale, tassoAnnuo, anni, apporti, frequenzaApporti])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const maxValore = Math.max(...risultati.datiAnnuali.map(d => d.valore))

  return (
    <main>
      <JsonLd data={[calculatorSchema, breadcrumbSchema, faqSchema]} />
      <Navbar />

      {/* Hero */}
      <section className="bg-forest pt-navbar">
        <div className="container-custom py-12">
          <Link href="/strumenti" className="inline-flex items-center text-green-300 hover:text-white mb-4 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tutti gli strumenti
          </Link>
          <h1 className="font-heading text-[32px] md:text-[42px] text-white leading-tight">
            Calcolatore Interesse Composto
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Scopri la potenza dell&apos;interesse composto, definito da Einstein &quot;l&apos;ottava meraviglia del mondo&quot;.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">Parametri</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capitale iniziale: {formatCurrency(capitale)}
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="500000"
                    step="1000"
                    value={capitale}
                    onChange={(e) => setCapitale(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1.000 EUR</span>
                    <span>500.000 EUR</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rendimento annuo atteso: {tassoAnnuo}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={tassoAnnuo}
                    onChange={(e) => setTassoAnnuo(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1%</span>
                    <span>15%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orizzonte temporale: {anni} anni
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={anni}
                    onChange={(e) => setAnni(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1 anno</span>
                    <span>40 anni</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Versamenti periodici: {formatCurrency(apporti)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={apporti}
                    onChange={(e) => setApporti(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0 EUR</span>
                    <span>2.000 EUR</span>
                  </div>
                </div>

                {apporti > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequenza versamenti
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="frequenza"
                          checked={frequenzaApporti === 'mensile'}
                          onChange={() => setFrequenzaApporti('mensile')}
                          className="mr-2 accent-green-600"
                        />
                        Mensile
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="frequenza"
                          checked={frequenzaApporti === 'annuale'}
                          onChange={() => setFrequenzaApporti('annuale')}
                          className="mr-2 accent-green-600"
                        />
                        Annuale
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-600 rounded-card p-5 text-white">
                  <p className="text-green-100 text-sm mb-1">Montante Finale</p>
                  <p className="font-heading text-2xl md:text-3xl">{formatCurrency(risultati.montanteFinale)}</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Interessi Maturati</p>
                  <p className="font-heading text-2xl md:text-3xl text-green-600">{formatCurrency(risultati.interessiMaturati)}</p>
                </div>
              </div>

              <div className="bg-white rounded-card p-5 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Totale Versato</p>
                <p className="font-heading text-xl text-forest">{formatCurrency(risultati.totaleVersato)}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Guadagno: {((risultati.montanteFinale / risultati.totaleVersato - 1) * 100).toFixed(1)}%
                </p>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Crescita nel tempo</h3>
                <div className="h-64 flex items-end gap-1">
                  {risultati.datiAnnuali.filter((_, i) => i % Math.ceil(anni / 20) === 0 || i === anni).map((dato) => (
                    <div key={dato.anno} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-green-500 rounded-t transition-all duration-300 relative group"
                        style={{ height: `${(dato.valore / maxValore) * 100}%`, minHeight: '4px' }}
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-forest text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {formatCurrency(dato.valore)}
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 mt-1">{dato.anno}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">Anno</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-12 bg-white rounded-card p-6 shadow-sm">
            <h2 className="font-heading text-xl text-forest mb-4">Come funziona l&apos;interesse composto?</h2>
            <div className="prose prose-sm text-gray-600 max-w-none">
              <p>
                L&apos;interesse composto è il meccanismo per cui gli interessi generati da un investimento
                vengono reinvestiti e generano a loro volta nuovi interessi. È la differenza fondamentale
                tra l&apos;interesse semplice (che si calcola solo sul capitale iniziale) e quello composto.
              </p>
              <p className="mt-4">
                <strong>Formula:</strong> Montante = Capitale × (1 + tasso)^anni
              </p>
              <p className="mt-4">
                <strong>Esempio pratico:</strong> Con 10.000 EUR investiti al 7% annuo per 20 anni,
                otterresti circa 38.700 EUR - quasi 4 volte il capitale iniziale!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Vuoi sapere come investire al meglio?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente indipendente può aiutarti a costruire un portafoglio
            adatto ai tuoi obiettivi e alla tua tolleranza al rischio.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom py-8">
        <RatingWidget toolSlug="interesse-composto" toolName="interesse-composto" />
      </div>

      <Footer />
    </main>
  )
}
