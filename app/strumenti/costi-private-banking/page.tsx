'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget, ToolPageSchema} from '@/components'

interface ScenarioData {
  name: string
  totalFee: number
  color: string
  description: string
}

export default function CostiPrivateBanking() {
  const [patrimonio, setPatrimonio] = useState(2000000)
  const [costoTotaleAttuale, setCostoTotaleAttuale] = useState(1.8)
  const [rendimentoLordo, setRendimentoLordo] = useState(7)
  const [anniProiezione, setAnniProiezione] = useState(20)

  const scenari: ScenarioData[] = [
    {
      name: 'Private Bank',
      totalFee: 2.0,
      color: '#dc2626',
      description: 'Commissione consulenza + prodotti interni + costi transazione'
    },
    {
      name: 'Consulente Indipendente',
      totalFee: 0.7,
      color: '#16a34a',
      description: 'Fee-only + ETF a basso costo'
    },
    {
      name: 'DIY con ETF',
      totalFee: 0.25,
      color: '#2563eb',
      description: 'Solo TER dei fondi, gestione autonoma'
    }
  ]

  const risultati = useMemo(() => {
    // Calcoli per lo scenario attuale (costo inserito dall'utente)
    const costoAnnuoAttuale = patrimonio * (costoTotaleAttuale / 100)
    const rendimentoNettoAttuale = rendimentoLordo - costoTotaleAttuale

    // Proiezioni per ogni scenario
    const proiezioni = scenari.map(scenario => {
      const rendimentoNetto = rendimentoLordo - scenario.totalFee
      const valori: number[] = []
      let valore = patrimonio

      for (let anno = 0; anno <= anniProiezione; anno++) {
        valori.push(valore)
        valore = valore * (1 + rendimentoNetto / 100)
      }

      return {
        ...scenario,
        rendimentoNetto,
        valori,
        valoreFinale: valori[anniProiezione],
        costoTotale: valori[anniProiezione] - valori[0] - (patrimonio * Math.pow(1 + rendimentoLordo / 100, anniProiezione) - patrimonio)
      }
    })

    // Calcolo valore senza costi (benchmark)
    let valoreSenzaCosti = patrimonio
    const valoriSenzaCosti: number[] = []
    for (let anno = 0; anno <= anniProiezione; anno++) {
      valoriSenzaCosti.push(valoreSenzaCosti)
      valoreSenzaCosti = valoreSenzaCosti * (1 + rendimentoLordo / 100)
    }

    // Quanto costa rimanere con la private bank vs consulente indipendente
    const privateBank = proiezioni.find(p => p.name === 'Private Bank')!
    const consulenteIndip = proiezioni.find(p => p.name === 'Consulente Indipendente')!
    const diy = proiezioni.find(p => p.name === 'DIY con ETF')!

    const differenzaVsIndipendente = consulenteIndip.valoreFinale - privateBank.valoreFinale
    const differenzaVsDIY = diy.valoreFinale - privateBank.valoreFinale

    // Erosione annua media
    const erosioneAnnuaPrivateBank = patrimonio * (privateBank.totalFee / 100)
    const erosioneAnnuaIndipendente = patrimonio * (consulenteIndip.totalFee / 100)
    const risparmiAnnuo = erosioneAnnuaPrivateBank - erosioneAnnuaIndipendente

    // Calcolo scenario attuale dell'utente
    let valoreAttualeUtente = patrimonio
    const valoriUtente: number[] = []
    for (let anno = 0; anno <= anniProiezione; anno++) {
      valoriUtente.push(valoreAttualeUtente)
      valoreAttualeUtente = valoreAttualeUtente * (1 + rendimentoNettoAttuale / 100)
    }

    return {
      costoAnnuoAttuale,
      rendimentoNettoAttuale,
      proiezioni,
      valoriSenzaCosti,
      valoreSenzaCosti: valoriSenzaCosti[anniProiezione],
      differenzaVsIndipendente,
      differenzaVsDIY,
      erosioneAnnuaPrivateBank,
      risparmiAnnuo,
      valoriUtente,
      valoreFinaleUtente: valoriUtente[anniProiezione]
    }
  }, [patrimonio, costoTotaleAttuale, rendimentoLordo, anniProiezione])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  // Trova il valore massimo per la scala del grafico
  const maxValue = Math.max(
    risultati.valoreSenzaCosti,
    ...risultati.proiezioni.map(p => p.valoreFinale)
  )

  return (
    <main>
      <ToolPageSchema slug="costi-private-banking" />
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
            Analizzatore Costi Private Banking
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Scopri quanto ti costano realmente le commissioni bancarie e quanto potresti risparmiare con alternative a basso costo.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">Il tuo portafoglio</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patrimonio gestito: {formatCurrency(patrimonio)}
                  </label>
                  <input
                    type="range"
                    min="500000"
                    max="10000000"
                    step="100000"
                    value={patrimonio}
                    onChange={(e) => setPatrimonio(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>500k</span>
                    <span>10M</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo totale attuale (TER + advisory): {formatPercent(costoTotaleAttuale)}
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={costoTotaleAttuale}
                    onChange={(e) => setCostoTotaleAttuale(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Include: commissione di gestione + costi prodotti + eventuali performance fee
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rendimento lordo atteso: {formatPercent(rendimentoLordo)}
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="10"
                    step="0.5"
                    value={rendimentoLordo}
                    onChange={(e) => setRendimentoLordo(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Media storica azionario globale: 7-8% annuo
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orizzonte temporale: {anniProiezione} anni
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={anniProiezione}
                    onChange={(e) => setAnniProiezione(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>
              </div>

              {/* Fee Breakdown */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="font-heading text-lg text-forest mb-4">Costi tipici del Private Banking</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commissione di consulenza</span>
                    <span className="text-gray-800 font-medium">0.5% - 1.0%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Costi prodotti (fondi interni)</span>
                    <span className="text-gray-800 font-medium">0.8% - 1.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Costi di transazione</span>
                    <span className="text-gray-800 font-medium">0.1% - 0.3%</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <span className="text-gray-800 font-medium">Totale tipico</span>
                    <span className="text-red-600 font-bold">1.5% - 2.5%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {/* Shocking Stats */}
              <div className="bg-red-600 rounded-card p-6 text-white">
                <p className="text-red-100 text-sm mb-1">Costo annuo del tuo portafoglio</p>
                <p className="font-heading text-4xl">{formatCurrency(risultati.costoAnnuoAttuale)}</p>
                <p className="text-red-200 text-sm mt-2">
                  = {formatCurrency(risultati.costoAnnuoAttuale / 12)}/mese che paghi alla banca
                </p>
              </div>

              {/* Comparison Cards */}
              <div className="grid grid-cols-1 gap-4">
                {risultati.proiezioni.map((scenario) => (
                  <div
                    key={scenario.name}
                    className="bg-white rounded-card p-5 shadow-sm border-l-4"
                    style={{ borderLeftColor: scenario.color }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-heading text-lg text-forest">{scenario.name}</p>
                        <p className="text-xs text-gray-500">{scenario.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Costo totale</p>
                        <p className="font-bold" style={{ color: scenario.color }}>
                          {formatPercent(scenario.totalFee)}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-end mt-3 pt-3 border-t border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500">Valore dopo {anniProiezione} anni</p>
                        <p className="font-heading text-xl text-forest">{formatCurrency(scenario.valoreFinale)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Rendimento netto</p>
                        <p className="font-medium text-gray-700">{formatPercent(scenario.rendimentoNetto)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Opportunity Cost */}
              <div className="bg-green-50 rounded-card p-6 border border-green-200">
                <h3 className="font-heading text-lg text-forest mb-3">
                  Quanto stai lasciando sul tavolo?
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">
                      Passando da Private Bank a Consulente Indipendente risparmi:
                    </p>
                    <p className="font-heading text-2xl text-green-600">
                      +{formatCurrency(risultati.differenzaVsIndipendente)}
                    </p>
                    <p className="text-xs text-gray-500">in {anniProiezione} anni</p>
                  </div>
                  <div className="pt-3 border-t border-green-200">
                    <p className="text-sm text-gray-600">
                      Risparmio annuo immediato:
                    </p>
                    <p className="font-heading text-xl text-green-600">
                      {formatCurrency(risultati.risparmiAnnuo)}/anno
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="mt-12 bg-white rounded-card p-6 shadow-sm">
            <h3 className="font-heading text-xl text-forest mb-6">
              Erosione del patrimonio nel tempo
            </h3>

            {/* Simple Bar Chart */}
            <div className="space-y-6">
              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-gray-300"></div>
                  <span>Senza costi (benchmark)</span>
                </div>
                {risultati.proiezioni.map(scenario => (
                  <div key={scenario.name} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: scenario.color }}></div>
                    <span>{scenario.name}</span>
                  </div>
                ))}
              </div>

              {/* Bars */}
              <div className="space-y-4">
                {/* Benchmark */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Senza costi (teorico)</span>
                    <span className="font-medium">{formatCurrency(risultati.valoreSenzaCosti)}</span>
                  </div>
                  <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gray-300 rounded-lg"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                {/* Scenarios */}
                {risultati.proiezioni.map(scenario => (
                  <div key={scenario.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{scenario.name} ({formatPercent(scenario.totalFee)})</span>
                      <span className="font-medium">{formatCurrency(scenario.valoreFinale)}</span>
                    </div>
                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div
                        className="h-full rounded-lg transition-all duration-500"
                        style={{
                          width: `${(scenario.valoreFinale / maxValue) * 100}%`,
                          backgroundColor: scenario.color
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Perdita vs benchmark: {formatCurrency(risultati.valoreSenzaCosti - scenario.valoreFinale)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline visualization */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h4 className="font-heading text-lg text-forest mb-4">
                Evoluzione del patrimonio ({formatCurrency(patrimonio)} iniziali)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 pr-4 text-gray-500 font-medium">Anno</th>
                      <th className="text-right py-2 px-4 text-gray-500 font-medium">Senza costi</th>
                      {risultati.proiezioni.map(s => (
                        <th key={s.name} className="text-right py-2 px-4 font-medium" style={{ color: s.color }}>
                          {s.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[0, 5, 10, 15, 20, 25, 30].filter(y => y <= anniProiezione).map(anno => (
                      <tr key={anno} className="border-b border-gray-100">
                        <td className="py-2 pr-4 text-gray-600">{anno}</td>
                        <td className="py-2 px-4 text-right text-gray-700">
                          {formatCurrency(risultati.valoriSenzaCosti[anno] || 0)}
                        </td>
                        {risultati.proiezioni.map(s => (
                          <td key={s.name} className="py-2 px-4 text-right" style={{ color: s.color }}>
                            {formatCurrency(s.valori[anno] || 0)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Educational Section */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-3">
                Perche i costi contano tanto?
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                I costi di gestione agiscono come un &quot;freno&quot; sui tuoi rendimenti, ogni anno.
                Grazie all&apos;interesse composto, anche piccole differenze di costo si amplificano
                enormemente nel lungo periodo.
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Esempio concreto:</strong> Su un portafoglio di {formatCurrency(patrimonio)},
                  la differenza tra 2% e 0.7% di costi (1.3% in meno) equivale a{' '}
                  <strong>{formatCurrency(patrimonio * 0.013)}/anno</strong> in piu nelle tue tasche.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-3">
                Cosa include il costo totale?
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">*</span>
                  <span><strong>Management fee:</strong> Commissione che paga il tuo consulente/banca</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">*</span>
                  <span><strong>TER prodotti:</strong> Costi interni dei fondi/ETF (spesso nascosti)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">*</span>
                  <span><strong>Costi transazione:</strong> Commissioni di acquisto/vendita</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">*</span>
                  <span><strong>Performance fee:</strong> Commissioni aggiuntive sui guadagni (se presenti)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom pb-8">
        <RatingWidget toolSlug="costi-private-banking" toolName="costi-private-banking" />
      </div>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Vuoi sapere esattamente quanto stai pagando?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente finanziario indipendente puo analizzare il tuo portafoglio attuale
            e mostrarti tutti i costi nascosti. Nessun conflitto di interesse.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Analisi Gratuita
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
