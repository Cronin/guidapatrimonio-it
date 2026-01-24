'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget} from '@/components'

export default function CalcolatorePrestito() {
  const [importo, setImporto] = useState(15000)
  const [durata, setDurata] = useState(60)
  const [taeg, setTaeg] = useState(8)

  const risultati = useMemo(() => {
    const tassoMensile = taeg / 100 / 12
    const numRate = durata

    const rata = importo * (tassoMensile * Math.pow(1 + tassoMensile, numRate)) / (Math.pow(1 + tassoMensile, numRate) - 1)
    const totaleRimborsato = rata * numRate
    const totaleInteressi = totaleRimborsato - importo

    // Piano ammortamento
    const piano = []
    let residuo = importo
    for (let i = 1; i <= Math.min(numRate, 12); i++) {
      const interessiMese = residuo * tassoMensile
      const capitaleMese = rata - interessiMese
      residuo -= capitaleMese
      piano.push({
        rata: i,
        importoRata: rata,
        capitale: capitaleMese,
        interessi: interessiMese,
        residuo: Math.max(0, residuo),
      })
    }

    return { rata, totaleRimborsato, totaleInteressi, piano }
  }, [importo, durata, taeg])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  return (
    <main>
      <Navbar />

      <section className="bg-forest pt-navbar">
        <div className="container-custom py-12">
          <Link href="/strumenti" className="inline-flex items-center text-green-300 hover:text-white mb-4 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tutti gli strumenti
          </Link>
          <h1 className="font-heading text-[32px] md:text-[42px] text-white leading-tight">
            Calcolatore Prestito
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Calcola la rata e il costo totale di un prestito personale.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">Parametri del Prestito</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Importo: {formatCurrency(importo)}
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="75000"
                    step="500"
                    value={importo}
                    onChange={(e) => setImporto(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durata: {durata} mesi ({(durata/12).toFixed(1)} anni)
                  </label>
                  <input
                    type="range"
                    min="12"
                    max="120"
                    step="6"
                    value={durata}
                    onChange={(e) => setDurata(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TAEG: {taeg}%
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="20"
                    step="0.5"
                    value={taeg}
                    onChange={(e) => setTaeg(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">TAEG medio prestiti personali: 7-12%</p>
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
                  <p className="text-gray-500 text-sm mb-1">Totale da Rimborsare</p>
                  <p className="font-heading text-xl text-forest">{formatCurrency(risultati.totaleRimborsato)}</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Costo Interessi</p>
                  <p className="font-heading text-xl text-red-600">{formatCurrency(risultati.totaleInteressi)}</p>
                </div>
              </div>

              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Prime 12 rate</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-500">Rata</th>
                        <th className="text-right py-2 text-gray-500">Capitale</th>
                        <th className="text-right py-2 text-gray-500">Interessi</th>
                        <th className="text-right py-2 text-gray-500">Residuo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {risultati.piano.map((row) => (
                        <tr key={row.rata} className="border-b border-gray-100">
                          <td className="py-2">{row.rata}</td>
                          <td className="text-right">{formatCurrency(row.capitale)}</td>
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
        <RatingWidget toolSlug="prestito" toolName="prestito" />
      </div>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Prima di indebitarti, valuta le alternative
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente può aiutarti a capire se il prestito è la scelta giusta
            o se esistono alternative migliori per la tua situazione.
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
