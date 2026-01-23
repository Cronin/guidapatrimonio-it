'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer } from '@/components'

interface SimulationResult {
  anno: number
  patrimonio: number
  prelievoAnnuo: number
  prelievoReale: number
}

interface Scenario {
  name: string
  data: SimulationResult[]
  annoEsaurimento: number | null
  probabilitaSuccesso: number
  patrimonioFinale: number
}

export default function CalcolatoreTassoPrelievoSicuro() {
  const [patrimonio, setPatrimonio] = useState(1000000)
  const [tassoPrelievo, setTassoPrelievo] = useState(4)
  const [rendimentoAtteso, setRendimentoAtteso] = useState(6)
  const [inflazione, setInflazione] = useState(2)
  const [orizzonteTemporale, setOrizzonteTemporale] = useState(30)

  const risultati = useMemo(() => {
    const prelievoAnnuoIniziale = patrimonio * (tassoPrelievo / 100)
    const prelievoMensile = prelievoAnnuoIniziale / 12
    const rendimentoReale = rendimentoAtteso - inflazione

    // Funzione per simulare un singolo scenario
    const simulaScenario = (
      rendimentoAnni: number[],
      nome: string
    ): Scenario => {
      const data: SimulationResult[] = []
      let patrimonioCorrente = patrimonio
      let prelievoCorrente = prelievoAnnuoIniziale
      let annoEsaurimento: number | null = null

      for (let anno = 0; anno <= orizzonteTemporale; anno++) {
        if (anno === 0) {
          data.push({
            anno,
            patrimonio: patrimonioCorrente,
            prelievoAnnuo: prelievoCorrente,
            prelievoReale: prelievoCorrente,
          })
          continue
        }

        // Applica rendimento dell'anno
        const rendimentoAnno = rendimentoAnni[anno - 1] || rendimentoAtteso
        patrimonioCorrente = patrimonioCorrente * (1 + rendimentoAnno / 100)

        // Aggiusta prelievo per inflazione
        prelievoCorrente = prelievoCorrente * (1 + inflazione / 100)

        // Preleva
        patrimonioCorrente -= prelievoCorrente

        // Verifica esaurimento
        if (patrimonioCorrente <= 0 && annoEsaurimento === null) {
          annoEsaurimento = anno
          patrimonioCorrente = 0
        }

        data.push({
          anno,
          patrimonio: Math.max(0, patrimonioCorrente),
          prelievoAnnuo: prelievoCorrente,
          prelievoReale: prelievoAnnuoIniziale, // In termini reali rimane costante
        })
      }

      const patrimonioFinale = data[data.length - 1].patrimonio
      const probabilitaSuccesso = annoEsaurimento === null ? 100 : 0

      return {
        name: nome,
        data,
        annoEsaurimento,
        probabilitaSuccesso,
        patrimonioFinale,
      }
    }

    // Scenario ottimistico: rendimenti superiori alla media nei primi anni
    const rendimentiOttimistici = Array.from({ length: orizzonteTemporale }, (_, i) => {
      if (i < 5) return rendimentoAtteso + 3 // Primi 5 anni: +3%
      if (i < 10) return rendimentoAtteso + 1 // Anni 5-10: +1%
      return rendimentoAtteso - 0.5 // Dopo: -0.5%
    })

    // Scenario base: rendimenti costanti
    const rendimentiBase = Array.from({ length: orizzonteTemporale }, () => rendimentoAtteso)

    // Scenario pessimistico (sequence of returns risk): rendimenti negativi nei primi anni
    const rendimentiPessimistici = Array.from({ length: orizzonteTemporale }, (_, i) => {
      if (i < 3) return -15 // Primi 3 anni: crash
      if (i < 5) return 5 // Ripresa
      if (i < 10) return rendimentoAtteso + 2 // Compensazione
      return rendimentoAtteso
    })

    const scenarioOttimistico = simulaScenario(rendimentiOttimistici, 'Ottimistico')
    const scenarioBase = simulaScenario(rendimentiBase, 'Base')
    const scenarioPessimistico = simulaScenario(rendimentiPessimistici, 'Pessimistico')

    // Monte Carlo semplificato (100 simulazioni)
    let successi = 0
    const numSimulazioni = 100

    for (let sim = 0; sim < numSimulazioni; sim++) {
      let patSim = patrimonio
      let prelSim = prelievoAnnuoIniziale
      let esaurito = false

      for (let anno = 1; anno <= orizzonteTemporale && !esaurito; anno++) {
        // Rendimento casuale con distribuzione normale approssimata
        // Media = rendimentoAtteso, StdDev = 15% (tipico per azionario)
        const u1 = Math.random()
        const u2 = Math.random()
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
        const rendimentoCasuale = rendimentoAtteso + z * 15

        patSim = patSim * (1 + rendimentoCasuale / 100)
        prelSim = prelSim * (1 + inflazione / 100)
        patSim -= prelSim

        if (patSim <= 0) {
          esaurito = true
        }
      }

      if (!esaurito) {
        successi++
      }
    }

    const probabilitaMonteCarlo = (successi / numSimulazioni) * 100

    // Tabella di riferimento SWR
    const tabellaRiferimento = [
      { patrimonio: 500000, swr3: 500000 * 0.03 / 12, swr4: 500000 * 0.04 / 12, swr5: 500000 * 0.05 / 12 },
      { patrimonio: 750000, swr3: 750000 * 0.03 / 12, swr4: 750000 * 0.04 / 12, swr5: 750000 * 0.05 / 12 },
      { patrimonio: 1000000, swr3: 1000000 * 0.03 / 12, swr4: 1000000 * 0.04 / 12, swr5: 1000000 * 0.05 / 12 },
      { patrimonio: 1500000, swr3: 1500000 * 0.03 / 12, swr4: 1500000 * 0.04 / 12, swr5: 1500000 * 0.05 / 12 },
      { patrimonio: 2000000, swr3: 2000000 * 0.03 / 12, swr4: 2000000 * 0.04 / 12, swr5: 2000000 * 0.05 / 12 },
    ]

    return {
      prelievoAnnuoIniziale,
      prelievoMensile,
      rendimentoReale,
      scenarioOttimistico,
      scenarioBase,
      scenarioPessimistico,
      probabilitaMonteCarlo,
      tabellaRiferimento,
    }
  }, [patrimonio, tassoPrelievo, rendimentoAtteso, inflazione, orizzonteTemporale])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatCurrencyShort = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M'
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(0) + 'k'
    }
    return value.toFixed(0)
  }

  // Calcola il massimo per il grafico
  const maxPatrimonio = Math.max(
    ...risultati.scenarioOttimistico.data.map(d => d.patrimonio),
    ...risultati.scenarioBase.data.map(d => d.patrimonio),
    ...risultati.scenarioPessimistico.data.map(d => d.patrimonio)
  )

  // Determina il colore della probabilita
  const getProbabilitaColor = (prob: number) => {
    if (prob >= 90) return 'text-green-600 bg-green-50'
    if (prob >= 75) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getProbabilitaLabel = (prob: number) => {
    if (prob >= 90) return 'Alta'
    if (prob >= 75) return 'Media'
    if (prob >= 50) return 'Bassa'
    return 'Molto Bassa'
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
            Calcolatore Tasso di Prelievo Sicuro
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Scopri quanto puoi prelevare dal tuo patrimonio senza esaurirlo.
            Basato sulla 4% Rule del Trinity Study e analisi Monte Carlo.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">I tuoi parametri</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patrimonio investito: {formatCurrency(patrimonio)}
                  </label>
                  <input
                    type="range"
                    min="100000"
                    max="5000000"
                    step="50000"
                    value={patrimonio}
                    onChange={(e) => setPatrimonio(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>100k</span>
                    <span>5M</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tasso di prelievo annuo (SWR): {tassoPrelievo}%
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    step="0.25"
                    value={tassoPrelievo}
                    onChange={(e) => setTassoPrelievo(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>2% (conservativo)</span>
                    <span>6% (aggressivo)</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 bg-green-50 p-2 rounded">
                    <strong>4%</strong> = Regola classica (Trinity Study, 30 anni, 95% successo storico)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rendimento atteso portafoglio: {rendimentoAtteso}%
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="8"
                    step="0.5"
                    value={rendimentoAtteso}
                    onChange={(e) => setRendimentoAtteso(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>3% (obbligaz.)</span>
                    <span>8% (azionario)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inflazione attesa: {inflazione}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="4"
                    step="0.5"
                    value={inflazione}
                    onChange={(e) => setInflazione(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1%</span>
                    <span>4%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orizzonte temporale: {orizzonteTemporale} anni
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="50"
                    step="5"
                    value={orizzonteTemporale}
                    onChange={(e) => setOrizzonteTemporale(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>20 anni</span>
                    <span>50 anni</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    <strong>Rendimento reale netto:</strong> {risultati.rendimentoReale.toFixed(1)}%
                    <span className="text-gray-400"> ({rendimentoAtteso}% - {inflazione}% inflazione)</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {/* Main Result */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-600 rounded-card p-5 text-white">
                  <p className="text-green-100 text-sm mb-1">Prelievo Annuo</p>
                  <p className="font-heading text-2xl md:text-3xl">{formatCurrency(risultati.prelievoAnnuoIniziale)}</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Prelievo Mensile</p>
                  <p className="font-heading text-2xl md:text-3xl text-forest">{formatCurrency(risultati.prelievoMensile)}</p>
                </div>
              </div>

              {/* Probabilita di Successo */}
              <div className={`rounded-card p-5 ${getProbabilitaColor(risultati.probabilitaMonteCarlo)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium mb-1">Probabilita di Successo (Monte Carlo)</p>
                    <p className="font-heading text-3xl">{risultati.probabilitaMonteCarlo.toFixed(0)}%</p>
                    <p className="text-sm mt-1 opacity-80">{getProbabilitaLabel(risultati.probabilitaMonteCarlo)}</p>
                  </div>
                  <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center" style={{
                    borderColor: risultati.probabilitaMonteCarlo >= 90 ? '#16a34a' : risultati.probabilitaMonteCarlo >= 75 ? '#ca8a04' : '#dc2626'
                  }}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {risultati.probabilitaMonteCarlo >= 75 ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      )}
                    </svg>
                  </div>
                </div>
                <p className="text-xs mt-3 opacity-70">
                  Su {orizzonteTemporale} anni con 100 simulazioni stocastiche (volatilita 15% annua)
                </p>
              </div>

              {/* Scenari */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Scenari di Mercato</h3>

                <div className="space-y-4">
                  {/* Ottimistico */}
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">Ottimistico</p>
                      <p className="text-xs text-green-600">Mercati in crescita nei primi anni</p>
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-lg text-green-700">
                        {formatCurrencyShort(risultati.scenarioOttimistico.patrimonioFinale)}
                      </p>
                      <p className="text-xs text-green-600">
                        {risultati.scenarioOttimistico.annoEsaurimento
                          ? `Esaurito anno ${risultati.scenarioOttimistico.annoEsaurimento}`
                          : 'Non esaurito'}
                      </p>
                    </div>
                  </div>

                  {/* Base */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-800">Base</p>
                      <p className="text-xs text-gray-600">Rendimenti costanti ({rendimentoAtteso}%/anno)</p>
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-lg text-gray-700">
                        {formatCurrencyShort(risultati.scenarioBase.patrimonioFinale)}
                      </p>
                      <p className="text-xs text-gray-600">
                        {risultati.scenarioBase.annoEsaurimento
                          ? `Esaurito anno ${risultati.scenarioBase.annoEsaurimento}`
                          : 'Non esaurito'}
                      </p>
                    </div>
                  </div>

                  {/* Pessimistico */}
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-red-800">Pessimistico</p>
                      <p className="text-xs text-red-600">Crash nei primi 3 anni (-15%/anno)</p>
                    </div>
                    <div className="text-right">
                      <p className="font-heading text-lg text-red-700">
                        {formatCurrencyShort(risultati.scenarioPessimistico.patrimonioFinale)}
                      </p>
                      <p className="text-xs text-red-600">
                        {risultati.scenarioPessimistico.annoEsaurimento
                          ? `Esaurito anno ${risultati.scenarioPessimistico.annoEsaurimento}`
                          : 'Non esaurito'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grafico */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Evoluzione Patrimonio</h3>
                <div className="h-64 relative">
                  {/* Asse Y */}
                  <div className="absolute left-0 top-0 bottom-6 w-12 flex flex-col justify-between text-xs text-gray-400">
                    <span>{formatCurrencyShort(maxPatrimonio)}</span>
                    <span>{formatCurrencyShort(maxPatrimonio / 2)}</span>
                    <span>0</span>
                  </div>

                  {/* Area grafico */}
                  <div className="ml-14 h-full pb-6 relative">
                    {/* Griglia orizzontale */}
                    <div className="absolute inset-0 flex flex-col justify-between">
                      {[0, 1, 2].map(i => (
                        <div key={i} className="border-b border-gray-100 w-full" />
                      ))}
                    </div>

                    {/* Linee */}
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                      {/* Ottimistico */}
                      <polyline
                        fill="none"
                        stroke="#22c55e"
                        strokeWidth="2"
                        points={risultati.scenarioOttimistico.data.map((d, i) => {
                          const x = (i / orizzonteTemporale) * 100
                          const y = 100 - (d.patrimonio / maxPatrimonio) * 100
                          return `${x}%,${y}%`
                        }).join(' ')}
                      />
                      {/* Base */}
                      <polyline
                        fill="none"
                        stroke="#6b7280"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        points={risultati.scenarioBase.data.map((d, i) => {
                          const x = (i / orizzonteTemporale) * 100
                          const y = 100 - (d.patrimonio / maxPatrimonio) * 100
                          return `${x}%,${y}%`
                        }).join(' ')}
                      />
                      {/* Pessimistico */}
                      <polyline
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        points={risultati.scenarioPessimistico.data.map((d, i) => {
                          const x = (i / orizzonteTemporale) * 100
                          const y = 100 - (d.patrimonio / maxPatrimonio) * 100
                          return `${x}%,${y}%`
                        }).join(' ')}
                      />
                      {/* Linea zero */}
                      <line x1="0" y1="100%" x2="100%" y2="100%" stroke="#e5e7eb" strokeWidth="1" />
                    </svg>
                  </div>

                  {/* Asse X */}
                  <div className="ml-14 flex justify-between text-xs text-gray-400 mt-1">
                    <span>Anno 0</span>
                    <span>Anno {Math.floor(orizzonteTemporale / 2)}</span>
                    <span>Anno {orizzonteTemporale}</span>
                  </div>
                </div>

                {/* Legenda */}
                <div className="flex justify-center gap-6 mt-4 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-0.5 bg-green-500" /> Ottimistico
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-0.5 bg-gray-500 border-dashed" style={{borderTopWidth: '2px', borderStyle: 'dashed'}} /> Base
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-0.5 bg-red-500" /> Pessimistico
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabella Riferimento */}
          <div className="mt-12 bg-white rounded-card p-6 shadow-sm">
            <h2 className="font-heading text-xl text-forest mb-4">Tabella di Riferimento SWR</h2>
            <p className="text-gray-600 text-sm mb-6">
              Prelievo mensile in base al patrimonio e al tasso di prelievo scelto.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Patrimonio</th>
                    <th className="text-center py-3 px-4 font-medium text-green-700 bg-green-50">3% SWR</th>
                    <th className="text-center py-3 px-4 font-medium text-green-700 bg-green-100">4% SWR</th>
                    <th className="text-center py-3 px-4 font-medium text-yellow-700 bg-yellow-50">5% SWR</th>
                  </tr>
                </thead>
                <tbody>
                  {risultati.tabellaRiferimento.map((row, i) => (
                    <tr key={i} className={`border-b ${row.patrimonio === patrimonio ? 'bg-blue-50' : ''}`}>
                      <td className="py-3 px-4 font-medium text-gray-800">
                        {formatCurrency(row.patrimonio)}
                        {row.patrimonio === patrimonio && (
                          <span className="ml-2 text-xs text-blue-600">(tuo)</span>
                        )}
                      </td>
                      <td className="text-center py-3 px-4 bg-green-50/50">
                        {formatCurrency(row.swr3)}/mese
                      </td>
                      <td className="text-center py-3 px-4 bg-green-100/50 font-medium">
                        {formatCurrency(row.swr4)}/mese
                      </td>
                      <td className="text-center py-3 px-4 bg-yellow-50/50">
                        {formatCurrency(row.swr5)}/mese
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-3">Cos&apos;e la 4% Rule?</h3>
              <p className="text-sm text-gray-600 mb-3">
                La <strong>regola del 4%</strong> deriva dal Trinity Study (1998) che analizzava
                portafogli 50/50 azioni/obbligazioni USA su periodi di 30 anni.
              </p>
              <p className="text-sm text-gray-600">
                Con un prelievo iniziale del 4% aggiustato annualmente per l&apos;inflazione,
                il portafoglio non si esauriva nel <strong>95% dei casi storici</strong>.
              </p>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-3">Sequence of Returns Risk</h3>
              <p className="text-sm text-gray-600 mb-3">
                Il rischio maggiore non e il rendimento medio, ma <strong>quando</strong> arrivano
                i rendimenti negativi.
              </p>
              <p className="text-sm text-gray-600">
                Un crash nei primi anni di pensionamento puo essere devastante perche si preleva
                da un patrimonio ridotto. Per questo mostriamo lo scenario pessimistico.
              </p>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-3">SWR Conservativo vs Aggressivo</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><strong>2-3%:</strong> Molto conservativo, adatto per orizzonti 40+ anni</li>
                <li><strong>4%:</strong> Standard storico, 30 anni, portafoglio bilanciato</li>
                <li><strong>5-6%:</strong> Aggressivo, solo per orizzonti brevi o flessibilita alta</li>
              </ul>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-3">Strategie per Aumentare il Successo</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li><strong>Flessibilita:</strong> Ridurre prelievi in anni negativi</li>
                <li><strong>Guardrails:</strong> Regole automatiche di aumento/riduzione</li>
                <li><strong>Bucket strategy:</strong> 2-3 anni di spese in liquidita</li>
                <li><strong>Reddito parziale:</strong> Lavoro part-time nei primi anni</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Pianifica la tua indipendenza finanziaria
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente indipendente puo aiutarti a costruire un piano di decumulo
            personalizzato, considerando la tua situazione specifica e i tuoi obiettivi.
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
