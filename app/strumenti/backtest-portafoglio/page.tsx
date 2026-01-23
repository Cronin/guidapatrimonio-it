'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer } from '@/components'

// Dati storici medi per asset class (stime basate su dati storici 1970-2024)
const assetClassData = {
  azioniUSA: { rendimento: 10, volatilita: 15, label: 'Azioni USA', color: '#2D6A4F' },
  azioniEuropa: { rendimento: 7, volatilita: 14, label: 'Azioni Europa', color: '#40916C' },
  azioniEmergenti: { rendimento: 8, volatilita: 22, label: 'Azioni Emergenti', color: '#52B788' },
  obbligazioniGov: { rendimento: 3, volatilita: 5, label: 'Obbligazioni Gov', color: '#1B4D3E' },
  obbligazioniCorp: { rendimento: 4, volatilita: 7, label: 'Obbligazioni Corp', color: '#2D5E4C' },
  oro: { rendimento: 5, volatilita: 15, label: 'Oro', color: '#D4A373' },
  reit: { rendimento: 7, volatilita: 12, label: 'Immobiliare/REIT', color: '#B08968' },
}

// Matrice di correlazione semplificata
const correlazioni: Record<string, Record<string, number>> = {
  azioniUSA: { azioniUSA: 1, azioniEuropa: 0.8, azioniEmergenti: 0.7, obbligazioniGov: -0.2, obbligazioniCorp: 0.1, oro: 0, reit: 0.6 },
  azioniEuropa: { azioniUSA: 0.8, azioniEuropa: 1, azioniEmergenti: 0.7, obbligazioniGov: -0.1, obbligazioniCorp: 0.1, oro: 0, reit: 0.5 },
  azioniEmergenti: { azioniUSA: 0.7, azioniEuropa: 0.7, azioniEmergenti: 1, obbligazioniGov: -0.1, obbligazioniCorp: 0.1, oro: 0.1, reit: 0.5 },
  obbligazioniGov: { azioniUSA: -0.2, azioniEuropa: -0.1, azioniEmergenti: -0.1, obbligazioniGov: 1, obbligazioniCorp: 0.7, oro: 0.3, reit: 0.1 },
  obbligazioniCorp: { azioniUSA: 0.1, azioniEuropa: 0.1, azioniEmergenti: 0.1, obbligazioniGov: 0.7, obbligazioniCorp: 1, oro: 0.1, reit: 0.2 },
  oro: { azioniUSA: 0, azioniEuropa: 0, azioniEmergenti: 0.1, obbligazioniGov: 0.3, obbligazioniCorp: 0.1, oro: 1, reit: 0.1 },
  reit: { azioniUSA: 0.6, azioniEuropa: 0.5, azioniEmergenti: 0.5, obbligazioniGov: 0.1, obbligazioniCorp: 0.2, oro: 0.1, reit: 1 },
}

// Benchmark predefiniti
const benchmarks = {
  sp500: {
    nome: '100% Azioni USA',
    allocazione: { azioniUSA: 100, azioniEuropa: 0, azioniEmergenti: 0, obbligazioniGov: 0, obbligazioniCorp: 0, oro: 0, reit: 0 },
  },
  classico6040: {
    nome: '60/40 Classico',
    allocazione: { azioniUSA: 40, azioniEuropa: 20, azioniEmergenti: 0, obbligazioniGov: 30, obbligazioniCorp: 10, oro: 0, reit: 0 },
  },
}

type Allocazione = {
  azioniUSA: number
  azioniEuropa: number
  azioniEmergenti: number
  obbligazioniGov: number
  obbligazioniCorp: number
  oro: number
  reit: number
}

interface MetrichePortafoglio {
  cagr: number
  volatilita: number
  sharpeRatio: number
  maxDrawdown: number
  bestYear: number
  worstYear: number
  valoreFinale: number
  crescitaAnnuale: Array<{ anno: number; valore: number }>
}

function calcolaMetriche(allocazione: Allocazione, capitaleIniziale: number, versamentoAnnuale: number, anni: number): MetrichePortafoglio {
  const keys = Object.keys(allocazione) as (keyof Allocazione)[]

  // Calcola rendimento medio pesato
  let rendimentoMedio = 0
  keys.forEach(key => {
    const peso = allocazione[key] / 100
    rendimentoMedio += peso * assetClassData[key].rendimento
  })

  // Calcola volatilita del portafoglio (con correlazioni)
  let varianza = 0
  keys.forEach(key1 => {
    keys.forEach(key2 => {
      const peso1 = allocazione[key1] / 100
      const peso2 = allocazione[key2] / 100
      const vol1 = assetClassData[key1].volatilita / 100
      const vol2 = assetClassData[key2].volatilita / 100
      const corr = correlazioni[key1][key2]
      varianza += peso1 * peso2 * vol1 * vol2 * corr
    })
  })
  const volatilita = Math.sqrt(varianza) * 100

  // Sharpe Ratio (assumendo risk-free rate del 2%)
  const riskFreeRate = 2
  const sharpeRatio = (rendimentoMedio - riskFreeRate) / volatilita

  // Max Drawdown stimato (approssimazione basata su volatilita)
  // Formula empirica: drawdown ~= volatilita * 2.5 per portafogli diversificati
  const maxDrawdown = Math.min(60, volatilita * 2.5)

  // Best/Worst year stimati (basati su distribuzione normale)
  const bestYear = rendimentoMedio + volatilita * 1.5
  const worstYear = rendimentoMedio - volatilita * 1.5

  // Calcola crescita del capitale
  const crescitaAnnuale: Array<{ anno: number; valore: number }> = []
  let valoreCorrente = capitaleIniziale
  const tassoAnnuo = rendimentoMedio / 100

  for (let anno = 0; anno <= anni; anno++) {
    crescitaAnnuale.push({ anno, valore: valoreCorrente })
    if (anno < anni) {
      valoreCorrente = valoreCorrente * (1 + tassoAnnuo) + versamentoAnnuale
    }
  }

  return {
    cagr: rendimentoMedio,
    volatilita,
    sharpeRatio,
    maxDrawdown,
    bestYear,
    worstYear,
    valoreFinale: valoreCorrente,
    crescitaAnnuale,
  }
}

export default function BacktestPortafoglio() {
  const [allocazione, setAllocazione] = useState<Allocazione>({
    azioniUSA: 30,
    azioniEuropa: 15,
    azioniEmergenti: 10,
    obbligazioniGov: 20,
    obbligazioniCorp: 10,
    oro: 5,
    reit: 10,
  })

  const [capitaleIniziale, setCapitaleIniziale] = useState(100000)
  const [versamentoAnnuale, setVersamentoAnnuale] = useState(0)
  const [periodoBacktest, setPeriodoBacktest] = useState(20)

  const totaleAllocazione = Object.values(allocazione).reduce((sum, val) => sum + val, 0)
  const isValidAllocazione = totaleAllocazione === 100

  const handleAllocazioneChange = (key: keyof Allocazione, value: number) => {
    setAllocazione(prev => ({ ...prev, [key]: value }))
  }

  // Calcola metriche per il portafoglio utente e i benchmark
  const metriche = useMemo(() => {
    if (!isValidAllocazione) return null
    return calcolaMetriche(allocazione, capitaleIniziale, versamentoAnnuale, periodoBacktest)
  }, [allocazione, capitaleIniziale, versamentoAnnuale, periodoBacktest, isValidAllocazione])

  const metricheSP500 = useMemo(() => {
    return calcolaMetriche(benchmarks.sp500.allocazione, capitaleIniziale, versamentoAnnuale, periodoBacktest)
  }, [capitaleIniziale, versamentoAnnuale, periodoBacktest])

  const metriche6040 = useMemo(() => {
    return calcolaMetriche(benchmarks.classico6040.allocazione, capitaleIniziale, versamentoAnnuale, periodoBacktest)
  }, [capitaleIniziale, versamentoAnnuale, periodoBacktest])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number, decimals: number = 1) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
  }

  // Trova il valore massimo per il grafico
  const maxValoreGrafico = useMemo(() => {
    if (!metriche) return metricheSP500.valoreFinale
    return Math.max(
      metriche.valoreFinale,
      metricheSP500.valoreFinale,
      metriche6040.valoreFinale
    )
  }, [metriche, metricheSP500, metriche6040])

  return (
    <main>
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
            Backtest Portafoglio
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Simula i rendimenti storici del tuo portafoglio. Confronta diverse allocazioni con benchmark classici e scopri l&apos;importanza della diversificazione.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Allocazione */}
            <div className="space-y-6">
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-xl text-forest mb-2">Allocazione Asset</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Imposta la percentuale per ogni asset class. Il totale deve essere 100%.
                </p>

                {/* Indicatore totale */}
                <div className={`mb-6 p-3 rounded-lg ${isValidAllocazione ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${isValidAllocazione ? 'text-green-700' : 'text-red-700'}`}>
                      Totale Allocazione
                    </span>
                    <span className={`font-heading text-xl ${isValidAllocazione ? 'text-green-700' : 'text-red-700'}`}>
                      {totaleAllocazione}%
                    </span>
                  </div>
                  {!isValidAllocazione && (
                    <p className="text-sm text-red-600 mt-1">
                      {totaleAllocazione < 100 ? `Aggiungi ${100 - totaleAllocazione}%` : `Rimuovi ${totaleAllocazione - 100}%`}
                    </p>
                  )}
                </div>

                <div className="space-y-5">
                  {(Object.keys(assetClassData) as (keyof typeof assetClassData)[]).map((key) => {
                    const asset = assetClassData[key]
                    return (
                      <div key={key}>
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-sm"
                              style={{ backgroundColor: asset.color }}
                            />
                            <label className="text-sm font-medium text-gray-700">
                              {asset.label}
                            </label>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">
                              ~{asset.rendimento}% rend. | {asset.volatilita}% vol.
                            </span>
                            <span className="font-medium text-forest w-12 text-right">
                              {allocazione[key]}%
                            </span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={allocazione[key]}
                          onChange={(e) => handleAllocazioneChange(key, Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Parametri */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-xl text-forest mb-6">Parametri Backtest</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capitale iniziale: {formatCurrency(capitaleIniziale)}
                    </label>
                    <input
                      type="range"
                      min="10000"
                      max="1000000"
                      step="10000"
                      value={capitaleIniziale}
                      onChange={(e) => setCapitaleIniziale(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>10.000 EUR</span>
                      <span>1.000.000 EUR</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Versamento annuale: {formatCurrency(versamentoAnnuale)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={versamentoAnnuale}
                      onChange={(e) => setVersamentoAnnuale(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0 EUR</span>
                      <span>50.000 EUR/anno</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Periodo backtest
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[10, 15, 20, 30].map((anni) => (
                        <button
                          key={anni}
                          onClick={() => setPeriodoBacktest(anni)}
                          className={`p-3 rounded-lg border-2 transition-all text-center ${
                            periodoBacktest === anni
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <span className={`block font-medium ${periodoBacktest === anni ? 'text-green-700' : 'text-gray-700'}`}>
                            {anni}
                          </span>
                          <span className="text-xs text-gray-500">anni</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risultati */}
            <div className="space-y-6">
              {/* Metriche principali */}
              {metriche && isValidAllocazione ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-600 rounded-card p-5 text-white">
                      <p className="text-green-100 text-sm mb-1">Valore Finale</p>
                      <p className="font-heading text-2xl md:text-3xl">{formatCurrency(metriche.valoreFinale)}</p>
                      <p className="text-green-200 text-xs mt-1">
                        Dopo {periodoBacktest} anni
                      </p>
                    </div>
                    <div className="bg-white rounded-card p-5 shadow-sm">
                      <p className="text-gray-500 text-sm mb-1">CAGR</p>
                      <p className="font-heading text-2xl md:text-3xl text-forest">{metriche.cagr.toFixed(1)}%</p>
                      <p className="text-gray-400 text-xs mt-1">Rendimento annuo medio</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white rounded-card p-4 shadow-sm">
                      <p className="text-gray-500 text-xs mb-1">Volatilita</p>
                      <p className="font-heading text-xl text-forest">{metriche.volatilita.toFixed(1)}%</p>
                    </div>
                    <div className="bg-white rounded-card p-4 shadow-sm">
                      <p className="text-gray-500 text-xs mb-1">Sharpe Ratio</p>
                      <p className="font-heading text-xl text-forest">{metriche.sharpeRatio.toFixed(2)}</p>
                    </div>
                    <div className="bg-white rounded-card p-4 shadow-sm">
                      <p className="text-gray-500 text-xs mb-1">Max Drawdown</p>
                      <p className="font-heading text-xl text-red-600">-{metriche.maxDrawdown.toFixed(0)}%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-card p-4 shadow-sm">
                      <p className="text-gray-500 text-xs mb-1">Best Year Stimato</p>
                      <p className="font-heading text-lg text-green-600">{formatPercent(metriche.bestYear)}</p>
                    </div>
                    <div className="bg-white rounded-card p-4 shadow-sm">
                      <p className="text-gray-500 text-xs mb-1">Worst Year Stimato</p>
                      <p className="font-heading text-lg text-red-600">{formatPercent(metriche.worstYear)}</p>
                    </div>
                  </div>

                  {/* Grafico confronto */}
                  <div className="bg-white rounded-card p-6 shadow-sm">
                    <h3 className="font-heading text-lg text-forest mb-4">Crescita del Capitale</h3>
                    <div className="h-64 flex items-end gap-1 border-b border-l border-gray-200 relative">
                      {/* Y axis labels */}
                      <div className="absolute -left-2 top-0 text-xs text-gray-400 -translate-x-full">
                        {formatCurrency(maxValoreGrafico)}
                      </div>
                      <div className="absolute -left-2 bottom-0 text-xs text-gray-400 -translate-x-full">
                        {formatCurrency(capitaleIniziale)}
                      </div>

                      {metriche.crescitaAnnuale.filter((_, i) => i % Math.ceil(periodoBacktest / 15) === 0 || i === periodoBacktest).map((dato, idx) => {
                        const sp500Valore = metricheSP500.crescitaAnnuale[dato.anno]?.valore || 0
                        const valore6040 = metriche6040.crescitaAnnuale[dato.anno]?.valore || 0

                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                            {/* Tooltip */}
                            <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-forest text-white text-xs px-3 py-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                              <div>Tuo: {formatCurrency(dato.valore)}</div>
                              <div>S&P500: {formatCurrency(sp500Valore)}</div>
                              <div>60/40: {formatCurrency(valore6040)}</div>
                            </div>

                            {/* Bars */}
                            <div className="w-full flex gap-0.5 items-end h-52">
                              <div
                                className="flex-1 bg-green-500 rounded-t transition-all duration-300"
                                style={{ height: `${(dato.valore / maxValoreGrafico) * 100}%`, minHeight: '4px' }}
                              />
                              <div
                                className="flex-1 bg-blue-400 rounded-t transition-all duration-300"
                                style={{ height: `${(sp500Valore / maxValoreGrafico) * 100}%`, minHeight: '4px' }}
                              />
                              <div
                                className="flex-1 bg-amber-400 rounded-t transition-all duration-300"
                                style={{ height: `${(valore6040 / maxValoreGrafico) * 100}%`, minHeight: '4px' }}
                              />
                            </div>
                            <span className="text-xs text-gray-400">{dato.anno}</span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-green-500" />
                        <span className="text-xs text-gray-600">Il Tuo Portafoglio</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-blue-400" />
                        <span className="text-xs text-gray-600">100% S&P500</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-amber-400" />
                        <span className="text-xs text-gray-600">60/40</span>
                      </div>
                    </div>
                  </div>

                  {/* Tabella confronto */}
                  <div className="bg-white rounded-card p-6 shadow-sm">
                    <h3 className="font-heading text-lg text-forest mb-4">Confronto con Benchmark</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-2 font-medium text-gray-600">Metrica</th>
                            <th className="text-right py-3 px-2 font-medium text-green-600">Tuo Portafoglio</th>
                            <th className="text-right py-3 px-2 font-medium text-blue-500">100% S&P500</th>
                            <th className="text-right py-3 px-2 font-medium text-amber-600">60/40</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-100">
                            <td className="py-3 px-2 text-gray-700">CAGR</td>
                            <td className="py-3 px-2 text-right font-medium text-forest">{metriche.cagr.toFixed(1)}%</td>
                            <td className="py-3 px-2 text-right">{metricheSP500.cagr.toFixed(1)}%</td>
                            <td className="py-3 px-2 text-right">{metriche6040.cagr.toFixed(1)}%</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-3 px-2 text-gray-700">Volatilita</td>
                            <td className="py-3 px-2 text-right font-medium text-forest">{metriche.volatilita.toFixed(1)}%</td>
                            <td className="py-3 px-2 text-right">{metricheSP500.volatilita.toFixed(1)}%</td>
                            <td className="py-3 px-2 text-right">{metriche6040.volatilita.toFixed(1)}%</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-3 px-2 text-gray-700">Sharpe Ratio</td>
                            <td className="py-3 px-2 text-right font-medium text-forest">{metriche.sharpeRatio.toFixed(2)}</td>
                            <td className="py-3 px-2 text-right">{metricheSP500.sharpeRatio.toFixed(2)}</td>
                            <td className="py-3 px-2 text-right">{metriche6040.sharpeRatio.toFixed(2)}</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-3 px-2 text-gray-700">Max Drawdown</td>
                            <td className="py-3 px-2 text-right font-medium text-red-600">-{metriche.maxDrawdown.toFixed(0)}%</td>
                            <td className="py-3 px-2 text-right text-red-500">-{metricheSP500.maxDrawdown.toFixed(0)}%</td>
                            <td className="py-3 px-2 text-right text-red-500">-{metriche6040.maxDrawdown.toFixed(0)}%</td>
                          </tr>
                          <tr className="border-b border-gray-100">
                            <td className="py-3 px-2 text-gray-700">Worst Year</td>
                            <td className="py-3 px-2 text-right font-medium">{formatPercent(metriche.worstYear)}</td>
                            <td className="py-3 px-2 text-right">{formatPercent(metricheSP500.worstYear)}</td>
                            <td className="py-3 px-2 text-right">{formatPercent(metriche6040.worstYear)}</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-2 text-gray-700 font-medium">Valore Finale</td>
                            <td className="py-3 px-2 text-right font-bold text-green-600">{formatCurrency(metriche.valoreFinale)}</td>
                            <td className="py-3 px-2 text-right font-medium">{formatCurrency(metricheSP500.valoreFinale)}</td>
                            <td className="py-3 px-2 text-right font-medium">{formatCurrency(metriche6040.valoreFinale)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-card p-8 shadow-sm text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="font-heading text-xl text-forest mb-2">Imposta l&apos;allocazione</h3>
                  <p className="text-gray-500">
                    Assicurati che il totale delle percentuali sia esattamente 100% per vedere i risultati del backtest.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Info educativa */}
          <div className="mt-12 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h2 className="font-heading text-xl text-forest mb-4">Come Leggere le Metriche</h2>
              <div className="space-y-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-forest">CAGR (Compound Annual Growth Rate)</h4>
                  <p>Il tasso di crescita annuo composto. Indica quanto cresce in media il portafoglio ogni anno.</p>
                </div>
                <div>
                  <h4 className="font-medium text-forest">Volatilita</h4>
                  <p>Misura quanto oscilla il valore del portafoglio. Piu alta = piu rischio ma potenzialmente piu rendimento.</p>
                </div>
                <div>
                  <h4 className="font-medium text-forest">Sharpe Ratio</h4>
                  <p>Rendimento aggiustato per il rischio. Valori sopra 1 sono buoni, sopra 2 eccellenti.</p>
                </div>
                <div>
                  <h4 className="font-medium text-forest">Max Drawdown</h4>
                  <p>La massima perdita potenziale dal picco. Importante per capire quanto potresti &quot;soffrire&quot; nei momenti peggiori.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <h2 className="font-heading text-xl text-forest mb-4">Perche Diversificare?</h2>
              <div className="prose prose-sm text-gray-600">
                <p>
                  La diversificazione e l&apos;unico &quot;pasto gratis&quot; negli investimenti. Combinando asset con basse correlazioni:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-3">
                  <li>Riduci la volatilita complessiva del portafoglio</li>
                  <li>Limiti le perdite nei momenti di crisi</li>
                  <li>Mantieni un rendimento atteso ragionevole</li>
                  <li>Dormi meglio la notte</li>
                </ul>
                <p className="mt-4">
                  Nota come un portafoglio diversificato spesso ha uno Sharpe Ratio migliore del 100% azioni,
                  pur avendo un rendimento assoluto inferiore.
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-card p-6">
            <h3 className="font-heading text-lg text-amber-800 mb-2">Disclaimer Importante</h3>
            <p className="text-sm text-amber-700">
              Questo strumento utilizza <strong>medie storiche approssimative</strong> per stimare i rendimenti futuri.
              I risultati reali possono variare significativamente. I rendimenti passati non garantiscono risultati futuri.
              Le correlazioni tra asset class cambiano nel tempo, specialmente durante le crisi.
              Questo tool ha scopo puramente educativo e non costituisce consulenza finanziaria.
              Prima di investire, consulta sempre un professionista qualificato.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Vuoi un&apos;analisi professionale del tuo portafoglio?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente finanziario indipendente puo aiutarti a costruire un portafoglio
            ottimizzato per i tuoi obiettivi, tenendo conto di tasse, costi e situazione personale.
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
