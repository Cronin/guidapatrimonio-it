'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer } from '@/components'

export default function CalcolatoreDividendi() {
  const [investimento, setInvestimento] = useState(50000)
  const [dividendYield, setDividendYield] = useState(4)
  const [crescitaDividendo, setCrescitaDividendo] = useState(3)
  const [reinvesti, setReinvesti] = useState(true)
  const [anni, setAnni] = useState(20)
  const [aliquotaFiscale, setAliquotaFiscale] = useState(26)

  const risultati = useMemo(() => {
    const proiezione = []
    let capitale = investimento
    let dividendoAnnuoLordo = investimento * (dividendYield / 100)
    let dividendiTotaliLordi = 0
    let dividendiTotaliNetti = 0

    for (let anno = 1; anno <= anni; anno++) {
      const dividendoLordo = capitale * (dividendYield / 100)
      const dividendoNetto = dividendoLordo * (1 - aliquotaFiscale / 100)
      dividendiTotaliLordi += dividendoLordo
      dividendiTotaliNetti += dividendoNetto

      proiezione.push({
        anno,
        capitale,
        dividendoLordo,
        dividendoNetto,
        dividendoMensileNetto: dividendoNetto / 12,
        dividendiCumulatiNetti: dividendiTotaliNetti,
      })

      if (reinvesti) {
        capitale += dividendoNetto
      }
      // Crescita del dividendo (yield on cost aumenta)
      dividendoAnnuoLordo *= (1 + crescitaDividendo / 100)
    }

    const primoAnno = proiezione[0]
    const ultimoAnno = proiezione[proiezione.length - 1]

    // Yield on cost finale (se reinvestito)
    const yieldOnCost = reinvesti
      ? (ultimoAnno.dividendoLordo / investimento) * 100
      : dividendYield

    return {
      dividendoAnnuoLordoIniziale: primoAnno.dividendoLordo,
      dividendoAnnuoNettoIniziale: primoAnno.dividendoNetto,
      dividendoMensileNettoIniziale: primoAnno.dividendoMensileNetto,
      capitaleFInale: ultimoAnno.capitale,
      dividendoAnnuoLordoFinale: ultimoAnno.dividendoLordo,
      dividendoAnnuoNettoFinale: ultimoAnno.dividendoNetto,
      dividendoMensileNettoFinale: ultimoAnno.dividendoMensileNetto,
      dividendiTotaliNetti,
      yieldOnCost,
      proiezione: proiezione.filter((_, i) => i % 5 === 0 || i === proiezione.length - 1),
    }
  }, [investimento, dividendYield, crescitaDividendo, reinvesti, anni, aliquotaFiscale])

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

      <section className="bg-forest pt-navbar">
        <div className="container-custom py-12">
          <Link href="/strumenti" className="inline-flex items-center text-green-300 hover:text-white mb-4 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tutti gli strumenti
          </Link>
          <h1 className="font-heading text-[32px] md:text-[42px] text-white leading-tight">
            Calcolatore Dividendi
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Calcola quanto puoi guadagnare con azioni o ETF a dividendo e simula la crescita nel tempo.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">Parametri investimento</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capitale investito: {formatCurrency(investimento)}
                  </label>
                  <input
                    type="range"
                    min="5000"
                    max="500000"
                    step="5000"
                    value={investimento}
                    onChange={(e) => setInvestimento(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dividend Yield: {dividendYield}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={dividendYield}
                    onChange={(e) => setDividendYield(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">ETF globali: 2-3%, High dividend: 4-6%</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crescita dividendo annua: {crescitaDividendo}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value={crescitaDividendo}
                    onChange={(e) => setCrescitaDividendo(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">Dividend aristocrats: 5-7% di crescita storica</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orizzonte temporale: {anni} anni
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    value={anni}
                    onChange={(e) => setAnni(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aliquota fiscale: {aliquotaFiscale}%
                  </label>
                  <input
                    type="range"
                    min="12.5"
                    max="26"
                    step="0.5"
                    value={aliquotaFiscale}
                    onChange={(e) => setAliquotaFiscale(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">26% standard, 12.5% titoli di stato</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Reinvesto i dividendi?</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setReinvesti(true)}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        reinvesti ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Sì, reinvesto
                    </button>
                    <button
                      onClick={() => setReinvesti(false)}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        !reinvesti ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      No, li spendo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-green-600 rounded-card p-6 text-white">
                <p className="text-green-100 text-sm mb-1">Rendita Mensile Netta (Anno 1)</p>
                <p className="font-heading text-4xl">{formatCurrency(risultati.dividendoMensileNettoIniziale)}</p>
                <p className="text-green-200 text-sm mt-2">
                  {formatCurrency(risultati.dividendoAnnuoNettoIniziale)}/anno netti
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Rendita Mensile (Anno {anni})</p>
                  <p className="font-heading text-xl text-green-600">{formatCurrency(risultati.dividendoMensileNettoFinale)}</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Yield on Cost Finale</p>
                  <p className="font-heading text-xl text-forest">{risultati.yieldOnCost.toFixed(1)}%</p>
                </div>
              </div>

              {reinvesti && (
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Capitale dopo {anni} anni</p>
                  <p className="font-heading text-2xl text-forest">{formatCurrency(risultati.capitaleFInale)}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    +{formatCurrency(risultati.capitaleFInale - investimento)} da reinvestimento dividendi
                  </p>
                </div>
              )}

              <div className="bg-white rounded-card p-5 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Dividendi totali incassati ({anni} anni)</p>
                <p className="font-heading text-xl text-green-600">{formatCurrency(risultati.dividendiTotaliNetti)}</p>
              </div>

              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Proiezione nel tempo</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-500">Anno</th>
                        <th className="text-right py-2 text-gray-500">Capitale</th>
                        <th className="text-right py-2 text-gray-500">Dividendo/anno</th>
                        <th className="text-right py-2 text-gray-500">Dividendo/mese</th>
                      </tr>
                    </thead>
                    <tbody>
                      {risultati.proiezione.map((row) => (
                        <tr key={row.anno} className="border-b border-gray-100">
                          <td className="py-2">{row.anno}</td>
                          <td className="text-right">{formatCurrency(row.capitale)}</td>
                          <td className="text-right text-green-600">{formatCurrency(row.dividendoNetto)}</td>
                          <td className="text-right text-green-600">{formatCurrency(row.dividendoMensileNetto)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-card p-4">
                <p className="text-sm text-gray-800">
                  <strong>Nota:</strong> I dividendi non sono garantiti e possono essere tagliati.
                  Diversifica sempre il tuo portafoglio e non basare la tua strategia solo sui dividendi.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Costruire un portafoglio a dividendi?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            La strategia dividend è una delle tante possibili.
            Un consulente può aiutarti a capire se è adatta ai tuoi obiettivi.
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
