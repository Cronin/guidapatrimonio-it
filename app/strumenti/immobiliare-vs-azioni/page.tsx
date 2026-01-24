'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget, FreeToolBanner} from '@/components'

interface YearlyData {
  year: number
  immobiliare: number
  azionario: number
}

type TassazioneType = 'cedolare' | 'irpef'

export default function ImmobiliareVsAzioni() {
  // Input Immobiliare
  const [prezzoImmobile, setPrezzoImmobile] = useState(300000)
  const [costiAcquisto, setCostiAcquisto] = useState(10)
  const [affittoMensile, setAffittoMensile] = useState(1200)
  const [speseAnnue, setSpeseAnnue] = useState(4000)
  const [tassazione, setTassazione] = useState<TassazioneType>('cedolare')
  const [rivalutazioneImmobile, setRivalutazioneImmobile] = useState(1)
  const [mesiSfitto, setMesiSfitto] = useState(1)

  // Input Azionario
  const [rendimentoAzionario, setRendimentoAzionario] = useState(7)
  const [ter, setTer] = useState(0.2)

  // Orizzonte temporale
  const [anni, setAnni] = useState(20)

  const risultati = useMemo(() => {
    // === CALCOLO IMMOBILIARE ===
    const capitaleIniziale = prezzoImmobile * (1 + costiAcquisto / 100)

    // Reddito da affitto
    const affittoAnnuoLordo = affittoMensile * 12
    const affittoEffettivo = affittoMensile * (12 - mesiSfitto)

    // Tassazione affitto
    const aliquotaTassa = tassazione === 'cedolare' ? 0.21 : 0.38 // IRPEF medio 38%
    const affittoNetto = affittoEffettivo * (1 - aliquotaTassa)

    // Reddito netto (affitto - spese)
    const redditoNettoAnnuo = affittoNetto - speseAnnue

    // Rendimento netto immobiliare (cash flow yield)
    const yieldNettoImmobiliare = (redditoNettoAnnuo / capitaleIniziale) * 100

    // Rendimento totale immobiliare (yield + rivalutazione)
    const rendimentoTotaleImmobiliare = yieldNettoImmobiliare + rivalutazioneImmobile

    // === CALCOLO AZIONARIO ===
    const rendimentoLordoAzionario = rendimentoAzionario
    const rendimentoDopoTer = rendimentoAzionario - ter

    // Capital gain 26% solo sui guadagni realizzati
    // Per semplicita calcoliamo il rendimento netto effettivo
    // assumendo reinvestimento e tassazione finale
    const tassaCapitalGain = 0.26
    const rendimentoNettoAzionario = rendimentoDopoTer * (1 - tassaCapitalGain)

    // === PROIEZIONE NEL TEMPO ===
    const proiezione: YearlyData[] = []
    let capitaleImmobiliare = capitaleIniziale
    let valoreImmobile = prezzoImmobile
    let cashFlowCumulato = 0
    let capitaleAzionario = capitaleIniziale

    for (let anno = 0; anno <= anni; anno++) {
      if (anno === 0) {
        proiezione.push({
          year: anno,
          immobiliare: capitaleIniziale,
          azionario: capitaleIniziale,
        })
      } else {
        // Immobiliare: valore immobile + cash flow cumulato
        valoreImmobile *= (1 + rivalutazioneImmobile / 100)
        cashFlowCumulato += redditoNettoAnnuo
        capitaleImmobiliare = valoreImmobile * (1 + costiAcquisto / 100) + cashFlowCumulato

        // Azionario: crescita composta (tasse pagate alla vendita)
        const crescitaLorda = capitaleAzionario * (1 + rendimentoDopoTer / 100)
        capitaleAzionario = crescitaLorda

        proiezione.push({
          year: anno,
          immobiliare: capitaleImmobiliare,
          azionario: capitaleAzionario,
        })
      }
    }

    // Calcolo finale con tasse
    const valoreFinaleImmobiliare = proiezione[anni].immobiliare
    const valoreFinaleLordoAzionario = proiezione[anni].azionario
    const guadagnoAzionario = valoreFinaleLordoAzionario - capitaleIniziale
    const valoreFinaleAzionario = capitaleIniziale + guadagnoAzionario * (1 - tassaCapitalGain)

    // Break-even point
    let breakEvenYear = -1
    for (let i = 1; i < proiezione.length; i++) {
      if (proiezione[i].immobiliare >= proiezione[i].azionario && breakEvenYear === -1) {
        breakEvenYear = i
      }
    }

    // Vincitore
    const vincitore = valoreFinaleImmobiliare > valoreFinaleAzionario ? 'immobiliare' : 'azionario'
    const differenza = Math.abs(valoreFinaleImmobiliare - valoreFinaleAzionario)
    const differenzaPercentuale = (differenza / capitaleIniziale) * 100

    return {
      capitaleIniziale,

      // Immobiliare
      affittoAnnuoLordo,
      affittoEffettivo,
      affittoNetto,
      redditoNettoAnnuo,
      yieldLordo: (affittoAnnuoLordo / capitaleIniziale) * 100,
      yieldNettoImmobiliare,
      rendimentoTotaleImmobiliare,
      valoreFinaleImmobiliare,

      // Azionario
      rendimentoLordoAzionario,
      rendimentoDopoTer,
      rendimentoNettoAzionario,
      valoreFinaleAzionario,
      valoreFinaleLordoAzionario,

      // Confronto
      proiezione,
      breakEvenYear,
      vincitore,
      differenza,
      differenzaPercentuale,
    }
  }, [prezzoImmobile, costiAcquisto, affittoMensile, speseAnnue, tassazione, rivalutazioneImmobile, mesiSfitto, rendimentoAzionario, ter, anni])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number, decimals: number = 2) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`
  }

  // Calcolo per grafico
  const maxValue = Math.max(
    ...risultati.proiezione.map(d => Math.max(d.immobiliare, d.azionario))
  )

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
            Immobiliare vs Azioni
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Confronta il rendimento di un investimento immobiliare con un portafoglio azionario diversificato.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          {/* Side by Side Inputs */}
          <div className="grid lg:grid-cols-2 gap-8 mb-10">
            {/* Input Immobiliare */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h2 className="font-heading text-xl text-forest">Investimento Immobiliare</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prezzo immobile: {formatCurrency(prezzoImmobile)}
                  </label>
                  <input
                    type="range"
                    min="100000"
                    max="1000000"
                    step="10000"
                    value={prezzoImmobile}
                    onChange={(e) => setPrezzoImmobile(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costi acquisto (notaio, agenzia, imposte): {costiAcquisto}%
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="15"
                    step="0.5"
                    value={costiAcquisto}
                    onChange={(e) => setCostiAcquisto(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">= {formatCurrency(prezzoImmobile * costiAcquisto / 100)}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Affitto mensile lordo: {formatCurrency(affittoMensile)}
                  </label>
                  <input
                    type="range"
                    min="400"
                    max="4000"
                    step="50"
                    value={affittoMensile}
                    onChange={(e) => setAffittoMensile(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spese annue: {formatCurrency(speseAnnue)}
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="10000"
                    step="250"
                    value={speseAnnue}
                    onChange={(e) => setSpeseAnnue(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">IMU, condominio, manutenzione, assicurazione</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tassazione affitti
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="tassazione"
                        checked={tassazione === 'cedolare'}
                        onChange={() => setTassazione('cedolare')}
                        className="mr-2 accent-amber-600"
                      />
                      <span className="text-sm">Cedolare secca 21%</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="tassazione"
                        checked={tassazione === 'irpef'}
                        onChange={() => setTassazione('irpef')}
                        className="mr-2 accent-amber-600"
                      />
                      <span className="text-sm">IRPEF ~38%</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rivalutazione annua immobile: {rivalutazioneImmobile}%
                  </label>
                  <input
                    type="range"
                    min="-2"
                    max="5"
                    step="0.5"
                    value={rivalutazioneImmobile}
                    onChange={(e) => setRivalutazioneImmobile(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mesi sfitto medi/anno: {mesiSfitto}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    step="0.5"
                    value={mesiSfitto}
                    onChange={(e) => setMesiSfitto(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                </div>
              </div>
            </div>

            {/* Input Azionario */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h2 className="font-heading text-xl text-forest">Investimento Azionario</h2>
              </div>

              <div className="space-y-5">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>Stesso capitale investito:</strong>
                  </p>
                  <p className="font-heading text-2xl text-forest mt-1">
                    {formatCurrency(risultati.capitaleIniziale)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    (Prezzo immobile + costi acquisto)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rendimento atteso annuo: {rendimentoAzionario}%
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    step="0.5"
                    value={rendimentoAzionario}
                    onChange={(e) => setRendimentoAzionario(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Media storica MSCI World: ~7% reale
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    TER (costo ETF): {ter}%
                  </label>
                  <input
                    type="range"
                    min="0.05"
                    max="1"
                    step="0.05"
                    value={ter}
                    onChange={(e) => setTer(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    ETF globali: 0.1-0.3%, Fondi attivi: 1-2%
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-800">
                    <strong>Tassazione capital gain:</strong> 26%
                  </p>
                  <p className="text-xs text-forest mt-1">
                    Pagata solo alla vendita (effetto differimento fiscale)
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orizzonte temporale: {anni} anni
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={anni}
                    onChange={(e) => setAnni(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>5 anni</span>
                    <span>30 anni</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risultati Principali */}
          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            {/* Card Immobiliare */}
            <div className={`rounded-card p-6 ${risultati.vincitore === 'immobiliare' ? 'bg-amber-600 text-white' : 'bg-white shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-heading text-lg ${risultati.vincitore === 'immobiliare' ? 'text-white' : 'text-forest'}`}>
                  Immobiliare
                </h3>
                {risultati.vincitore === 'immobiliare' && (
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    VINCITORE
                  </span>
                )}
              </div>
              <p className={`text-sm ${risultati.vincitore === 'immobiliare' ? 'text-amber-100' : 'text-gray-500'} mb-1`}>
                Valore a {anni} anni
              </p>
              <p className="font-heading text-3xl mb-4">
                {formatCurrency(risultati.valoreFinaleImmobiliare)}
              </p>
              <div className={`space-y-2 text-sm ${risultati.vincitore === 'immobiliare' ? 'text-amber-100' : 'text-gray-600'}`}>
                <div className="flex justify-between">
                  <span>Yield lordo</span>
                  <span className="font-medium">{risultati.yieldLordo.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Yield netto (dopo tasse e spese)</span>
                  <span className="font-medium">{risultati.yieldNettoImmobiliare.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Rendimento totale (yield + rivalut.)</span>
                  <span className="font-medium">{formatPercent(risultati.rendimentoTotaleImmobiliare, 1)}</span>
                </div>
              </div>
            </div>

            {/* Card Azionario */}
            <div className={`rounded-card p-6 ${risultati.vincitore === 'azionario' ? 'bg-green-600 text-white' : 'bg-white shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-heading text-lg ${risultati.vincitore === 'azionario' ? 'text-white' : 'text-forest'}`}>
                  Azionario
                </h3>
                {risultati.vincitore === 'azionario' && (
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                    VINCITORE
                  </span>
                )}
              </div>
              <p className={`text-sm ${risultati.vincitore === 'azionario' ? 'text-green-100' : 'text-gray-500'} mb-1`}>
                Valore a {anni} anni (netto tasse)
              </p>
              <p className="font-heading text-3xl mb-4">
                {formatCurrency(risultati.valoreFinaleAzionario)}
              </p>
              <div className={`space-y-2 text-sm ${risultati.vincitore === 'azionario' ? 'text-green-100' : 'text-gray-600'}`}>
                <div className="flex justify-between">
                  <span>Rendimento lordo atteso</span>
                  <span className="font-medium">{risultati.rendimentoLordoAzionario.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Dopo TER ({ter}%)</span>
                  <span className="font-medium">{risultati.rendimentoDopoTer.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Rendimento netto (post 26% CG)</span>
                  <span className="font-medium">{formatPercent(risultati.rendimentoNettoAzionario, 1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Differenza e Break-even */}
          <div className="bg-forest rounded-card p-6 text-white mb-10">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-green-200 text-sm mb-1">Differenza a {anni} anni</p>
                <p className="font-heading text-2xl">
                  {formatCurrency(risultati.differenza)}
                </p>
                <p className="text-green-300 text-sm">
                  ({risultati.differenzaPercentuale.toFixed(0)}% del capitale)
                </p>
              </div>
              <div>
                <p className="text-green-200 text-sm mb-1">A favore di</p>
                <p className="font-heading text-2xl capitalize">
                  {risultati.vincitore === 'immobiliare' ? 'Immobiliare' : 'Azioni'}
                </p>
              </div>
              <div>
                <p className="text-green-200 text-sm mb-1">Break-even</p>
                <p className="font-heading text-2xl">
                  {risultati.breakEvenYear > 0 ? `Anno ${risultati.breakEvenYear}` : 'Mai'}
                </p>
                <p className="text-green-300 text-sm">
                  {risultati.breakEvenYear > 0 ? 'Immobiliare supera azioni' : 'Azioni sempre davanti'}
                </p>
              </div>
            </div>
          </div>

          {/* Grafico */}
          <div className="bg-white rounded-card p-6 shadow-sm mb-10">
            <h3 className="font-heading text-xl text-forest mb-6">Crescita del capitale nel tempo</h3>

            {/* Legenda */}
            <div className="flex gap-6 mb-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-amber-500 rounded"></div>
                <span>Immobiliare</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Azionario</span>
              </div>
            </div>

            {/* Chart Container */}
            <div className="relative h-64 md:h-80">
              {/* Y Axis Labels */}
              <div className="absolute left-0 top-0 bottom-8 w-20 flex flex-col justify-between text-xs text-gray-500">
                <span>{formatCurrency(maxValue)}</span>
                <span>{formatCurrency(maxValue * 0.75)}</span>
                <span>{formatCurrency(maxValue * 0.5)}</span>
                <span>{formatCurrency(maxValue * 0.25)}</span>
                <span>{formatCurrency(0)}</span>
              </div>

              {/* Chart Area */}
              <div className="ml-24 h-full pb-8 relative">
                {/* Grid Lines */}
                <div className="absolute inset-0 flex flex-col justify-between">
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} className="border-t border-gray-100 w-full"></div>
                  ))}
                </div>

                {/* Bars */}
                <div className="absolute inset-0 flex items-end justify-between gap-1">
                  {risultati.proiezione.filter((_, i) => i % Math.ceil(anni / 10) === 0 || i === anni).map((data, index) => {
                    const immHeight = (data.immobiliare / maxValue) * 100
                    const azHeight = (data.azionario / maxValue) * 100
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full flex justify-center gap-1 items-end" style={{ height: 'calc(100% - 24px)' }}>
                          <div
                            className="bg-amber-500 w-3 md:w-4 rounded-t transition-all duration-300"
                            style={{ height: `${immHeight}%` }}
                            title={`Anno ${data.year}: ${formatCurrency(data.immobiliare)}`}
                          ></div>
                          <div
                            className="bg-green-500 w-3 md:w-4 rounded-t transition-all duration-300"
                            style={{ height: `${azHeight}%` }}
                            title={`Anno ${data.year}: ${formatCurrency(data.azionario)}`}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 mt-2">{data.year}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Tabella comparativa per milestone */}
          <div className="bg-white rounded-card p-6 shadow-sm mb-10 overflow-x-auto">
            <h3 className="font-heading text-xl text-forest mb-4">Confronto a 10, 20, 30 anni</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium text-gray-600">Orizzonte</th>
                  <th className="text-right py-3 font-medium text-amber-600">Immobiliare</th>
                  <th className="text-right py-3 font-medium text-green-600">Azionario</th>
                  <th className="text-right py-3 font-medium text-gray-600">Differenza</th>
                </tr>
              </thead>
              <tbody>
                {[10, 20, 30].map(targetYear => {
                  const yearIndex = Math.min(targetYear, anni)
                  const immValue = risultati.proiezione[yearIndex]?.immobiliare || 0
                  const azValueLordo = risultati.proiezione[yearIndex]?.azionario || 0
                  const azGuadagno = azValueLordo - risultati.capitaleIniziale
                  const azValueNetto = risultati.capitaleIniziale + azGuadagno * 0.74
                  const diff = immValue - azValueNetto
                  return (
                    <tr key={targetYear} className="border-b border-gray-100">
                      <td className="py-3">{targetYear} anni</td>
                      <td className="py-3 text-right font-medium">{formatCurrency(immValue)}</td>
                      <td className="py-3 text-right font-medium">{formatCurrency(azValueNetto)}</td>
                      <td className={`py-3 text-right font-medium ${diff > 0 ? 'text-amber-600' : 'text-green-600'}`}>
                        {diff > 0 ? '+' : ''}{formatCurrency(diff)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Fattori Qualitativi */}
          <div className="bg-white rounded-card p-6 shadow-sm">
            <h3 className="font-heading text-xl text-forest mb-6">Fattori qualitativi da considerare</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-forest flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                  Pro Immobiliare
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Leva finanziaria:</strong> mutuo all&apos;80% = controlli 5x il capitale</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Reddito tangibile:</strong> affitto mensile costante</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Bassa volatilita percepita:</strong> non vedi oscillazioni giornaliere</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Protezione inflazione:</strong> affitti e valore seguono i prezzi</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-forest flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Pro Azionario
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Liquidita totale:</strong> vendi in 3 secondi, non 6 mesi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Zero gestione:</strong> niente inquilini, manutenzione, burocrazia</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Diversificazione globale:</strong> 1.500+ aziende in un ETF</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Efficienza fiscale:</strong> tasse solo alla vendita (differimento)</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-forest flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Contro Immobiliare
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Illiquido:</strong> vendita richiede mesi e costi (3-8%)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Concentrazione:</strong> tutto in un solo asset, una citta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Lavoro:</strong> gestione inquilini, riparazioni, morosita</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Costi nascosti:</strong> straordinari, IMU, ristrutturazioni</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-forest flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  Contro Azionario
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Volatilita:</strong> -30% in pochi mesi (es. 2020, 2022)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Psicologia:</strong> tentazione di vendere nei crolli</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Nessuna leva:</strong> difficile usare debito per investire</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Intangibile:</strong> non &quot;tocchi&quot; il tuo investimento</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Esempio Milano */}
          <div className="bg-amber-50 border border-amber-200 rounded-card p-6 mb-10">
            <h3 className="font-heading text-xl text-forest mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Esempio realistico: Milano 2025
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-medium text-gray-700 mb-2">Bilocale zona semi-centrale</p>
                <ul className="space-y-1 text-gray-600">
                  <li>Prezzo: 300.000 euro</li>
                  <li>Affitto: 1.200 euro/mese</li>
                  <li>Yield lordo: 4,8%</li>
                  <li>Spese: ~4.000 euro/anno</li>
                  <li>Cedolare secca 21%</li>
                  <li className="font-medium text-amber-700">Yield netto: ~3%</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-gray-700 mb-2">ETF World con stesso capitale</p>
                <ul className="space-y-1 text-gray-600">
                  <li>Capitale: 330.000 euro (prezzo + costi)</li>
                  <li>Rendimento atteso: 7%</li>
                  <li>TER: 0,2%</li>
                  <li>Capital gain: 26%</li>
                  <li className="font-medium text-green-700">Rendimento netto: ~5%</li>
                </ul>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 pt-4 border-t border-amber-200">
              <strong>Conclusione:</strong> In questo scenario tipico, le azioni vincono matematicamente.
              Ma se usi un mutuo 80% sull&apos;immobile, la leva cambia tutto: controlli 300k con 60k,
              moltiplicando il rendimento sul capitale proprio.
            </p>
          </div>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom pb-8">
        <RatingWidget toolSlug="immobiliare-vs-azioni" toolName="immobiliare-vs-azioni" />
      </div>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Immobiliare, azioni o entrambi?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            La risposta dipende dalla tua situazione. Un consulente indipendente
            ti aiuta a costruire il mix ottimale per i tuoi obiettivi.
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
