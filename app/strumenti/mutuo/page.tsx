'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget, FreeToolBanner} from '@/components'

export default function CalcolatoreMutuo() {
  const [importo, setImporto] = useState(200000)
  const [durata, setDurata] = useState(25)
  const [tasso, setTasso] = useState(3.5)
  const [tipoTasso, setTipoTasso] = useState<'fisso' | 'variabile'>('fisso')

  const risultati = useMemo(() => {
    const tassoMensile = tasso / 100 / 12
    const numRate = durata * 12

    // Formula rata mutuo: M = P * [r(1+r)^n] / [(1+r)^n - 1]
    const rata = importo * (tassoMensile * Math.pow(1 + tassoMensile, numRate)) / (Math.pow(1 + tassoMensile, numRate) - 1)

    const totaleRimborsato = rata * numRate
    const totaleInteressi = totaleRimborsato - importo

    // Piano ammortamento primi 5 anni
    const pianoAmmortamento = []
    let capitaleResiduo = importo
    for (let anno = 1; anno <= Math.min(durata, 10); anno++) {
      let interessiAnno = 0
      let capitaleAnno = 0
      for (let mese = 0; mese < 12; mese++) {
        const interessiMese = capitaleResiduo * tassoMensile
        const capitaleMese = rata - interessiMese
        interessiAnno += interessiMese
        capitaleAnno += capitaleMese
        capitaleResiduo -= capitaleMese
      }
      pianoAmmortamento.push({
        anno,
        rata: rata * 12,
        interessi: interessiAnno,
        capitale: capitaleAnno,
        residuo: Math.max(0, capitaleResiduo),
      })
    }

    return {
      rata,
      totaleRimborsato,
      totaleInteressi,
      pianoAmmortamento,
    }
  }, [importo, durata, tasso])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <main>
      <Navbar />
      <FreeToolBanner />

      <section className="bg-forest pt-navbar">
        <div className="container-custom py-12">
          <Link href="/strumenti" className="inline-flex items-center text-green-300 hover:text-white mb-4 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tutti gli strumenti
          </Link>
          <h1 className="font-heading text-[32px] md:text-[42px] text-white leading-tight">
            Calcolatore Mutuo
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Calcola la rata del mutuo e scopri quanto pagherai di interessi nel tempo.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">Parametri del Mutuo</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Importo mutuo: {formatCurrency(importo)}
                  </label>
                  <input
                    type="range"
                    min="50000"
                    max="500000"
                    step="5000"
                    value={importo}
                    onChange={(e) => setImporto(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>50.000 €</span>
                    <span>500.000 €</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durata: {durata} anni
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={durata}
                    onChange={(e) => setDurata(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>5 anni</span>
                    <span>30 anni</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tasso di interesse: {tasso}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="0.1"
                    value={tasso}
                    onChange={(e) => setTasso(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1%</span>
                    <span>8%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Tipo di tasso</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setTipoTasso('fisso')}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        tipoTasso === 'fisso' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Tasso Fisso
                    </button>
                    <button
                      onClick={() => setTipoTasso('variabile')}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        tipoTasso === 'variabile' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Tasso Variabile
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-green-600 rounded-card p-6 text-white">
                <p className="text-green-100 text-sm mb-1">Rata Mensile</p>
                <p className="font-heading text-4xl">{formatCurrency(risultati.rata)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Totale Rimborsato</p>
                  <p className="font-heading text-xl text-forest">{formatCurrency(risultati.totaleRimborsato)}</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Totale Interessi</p>
                  <p className="font-heading text-xl text-red-600">{formatCurrency(risultati.totaleInteressi)}</p>
                </div>
              </div>

              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Piano Ammortamento (primi 10 anni)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-500 font-medium">Anno</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Rata annua</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Interessi</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Residuo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {risultati.pianoAmmortamento.map((row) => (
                        <tr key={row.anno} className="border-b border-gray-100">
                          <td className="py-2">{row.anno}</td>
                          <td className="text-right">{formatCurrency(row.rata)}</td>
                          <td className="text-right text-red-600">{formatCurrency(row.interessi)}</td>
                          <td className="text-right">{formatCurrency(row.residuo)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom pb-8">
        <RatingWidget toolSlug="mutuo" toolName="mutuo" />
      </div>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Stai comprando casa?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente indipendente può aiutarti a valutare l&apos;impatto del mutuo
            sulla tua pianificazione finanziaria complessiva.
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
