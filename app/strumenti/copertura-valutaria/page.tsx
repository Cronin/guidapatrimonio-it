'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget, ToolPageSchema} from '@/components'

interface ScenarioData {
  anno: number
  conHedging: number
  senzaHedging: number
  cambio: number
}

export default function CoperturaValutaria() {
  const [importoUSD, setImportoUSD] = useState(100000)
  const [orizzonteAnni, setOrizzonteAnni] = useState(5)
  const [costoHedgingAnnuo, setCostoHedgingAnnuo] = useState(1.0)
  const [rendimentoAttesoUSD, setRendimentoAttesoUSD] = useState(7)
  const [aspettativaCambio, setAspettativaCambio] = useState(0) // -30% a +30%
  const [cambioIniziale, setCambioIniziale] = useState(1.08)
  const [valutaEstera, setValutaEstera] = useState<'USD' | 'GBP' | 'CHF'>('USD')

  // Dati storici EUR/USD
  const datiStorici = {
    min20Anni: 0.85,
    max20Anni: 1.60,
    media20Anni: 1.15,
    attuale: 1.08,
  }

  const risultati = useMemo(() => {
    // Calcolo cambio finale atteso
    const variazioneAnnua = aspettativaCambio / 100 / orizzonteAnni
    let cambioFinale = cambioIniziale
    for (let i = 0; i < orizzonteAnni; i++) {
      cambioFinale *= (1 + variazioneAnnua)
    }

    // Valore iniziale in EUR
    const valoreInizialeEUR = importoUSD / cambioIniziale

    // Scenario CON hedging (valore in EUR stabile, ma costa il costo hedging)
    const rendimentoNettoHedged = rendimentoAttesoUSD - costoHedgingAnnuo
    let valoreFinaleConHedging = valoreInizialeEUR
    for (let i = 0; i < orizzonteAnni; i++) {
      valoreFinaleConHedging *= (1 + rendimentoNettoHedged / 100)
    }

    // Scenario SENZA hedging (rendimento pieno ma soggetto a cambio)
    let valoreFinaleSenzaHedgingUSD = importoUSD
    for (let i = 0; i < orizzonteAnni; i++) {
      valoreFinaleSenzaHedgingUSD *= (1 + rendimentoAttesoUSD / 100)
    }
    const valoreFinaleSenzaHedging = valoreFinaleSenzaHedgingUSD / cambioFinale

    // Costo totale hedging
    const costoTotaleHedging = valoreInizialeEUR * (Math.pow(1 + costoHedgingAnnuo / 100, orizzonteAnni) - 1)

    // Break-even: quanto deve muoversi il cambio per giustificare l'hedging
    // Se il costo hedging e' X% all'anno, il cambio deve apprezzarsi di X% all'anno per giustificare
    const breakEvenCambio = cambioIniziale * Math.pow(1 + costoHedgingAnnuo / 100, orizzonteAnni)
    const breakEvenVariazione = ((breakEvenCambio / cambioIniziale) - 1) * 100

    // Dati annuali per il grafico
    const datiAnnuali: ScenarioData[] = []
    let valoreHedged = valoreInizialeEUR
    let valoreUnhedgedUSD = importoUSD
    let cambioCorrente = cambioIniziale

    for (let anno = 0; anno <= orizzonteAnni; anno++) {
      datiAnnuali.push({
        anno,
        conHedging: valoreHedged,
        senzaHedging: valoreUnhedgedUSD / cambioCorrente,
        cambio: cambioCorrente,
      })

      if (anno < orizzonteAnni) {
        valoreHedged *= (1 + rendimentoNettoHedged / 100)
        valoreUnhedgedUSD *= (1 + rendimentoAttesoUSD / 100)
        cambioCorrente *= (1 + variazioneAnnua)
      }
    }

    // Scenari alternativi
    const scenariCambio = [
      { nome: 'Euro si rafforza (+20%)', variazione: 20, colore: 'text-red-600' },
      { nome: 'Stabile (0%)', variazione: 0, colore: 'text-gray-600' },
      { nome: 'Euro si indebolisce (-20%)', variazione: -20, colore: 'text-green-600' },
    ].map(scenario => {
      const cambioScenario = cambioIniziale * (1 + scenario.variazione / 100)
      const valoreUnhedged = valoreFinaleSenzaHedgingUSD / (cambioIniziale * (1 + scenario.variazione / 100))
      const differenza = valoreUnhedged - valoreFinaleConHedging
      const conviene = differenza > 0 ? 'NO hedging' : 'SI hedging'
      return {
        ...scenario,
        cambioFinale: cambioScenario,
        valoreUnhedged,
        differenza,
        conviene,
      }
    })

    return {
      valoreInizialeEUR,
      valoreFinaleConHedging,
      valoreFinaleSenzaHedging,
      cambioFinale,
      costoTotaleHedging,
      breakEvenCambio,
      breakEvenVariazione,
      datiAnnuali,
      scenariCambio,
      convieneHedging: valoreFinaleConHedging > valoreFinaleSenzaHedging,
      differenzaAssoluta: Math.abs(valoreFinaleConHedging - valoreFinaleSenzaHedging),
      differenzaPercentuale: ((valoreFinaleConHedging - valoreFinaleSenzaHedging) / valoreFinaleSenzaHedging) * 100,
    }
  }, [importoUSD, orizzonteAnni, costoHedgingAnnuo, rendimentoAttesoUSD, aspettativaCambio, cambioIniziale])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number, decimals: number = 2) => {
    return new Intl.NumberFormat('it-IT', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  }

  const maxValore = Math.max(
    ...risultati.datiAnnuali.map(d => Math.max(d.conHedging, d.senzaHedging))
  )

  const simboloValuta = valutaEstera === 'USD' ? '$' : valutaEstera === 'GBP' ? '£' : 'CHF'

  return (
    <main>
      <ToolPageSchema slug="copertura-valutaria" />
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
            Calcolatore Copertura Valutaria
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Calcola se conviene coprire il rischio cambio sui tuoi investimenti in valuta estera.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">Parametri investimento</h2>

              <div className="space-y-5">
                {/* Valuta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valuta estera
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['USD', 'GBP', 'CHF'] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => {
                          setValutaEstera(v)
                          if (v === 'USD') setCambioIniziale(1.08)
                          if (v === 'GBP') setCambioIniziale(0.85)
                          if (v === 'CHF') setCambioIniziale(0.93)
                        }}
                        className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                          valutaEstera === v ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Importo investito in {valutaEstera}: {simboloValuta}{formatNumber(importoUSD, 0)}
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={importoUSD}
                    onChange={(e) => setImportoUSD(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{simboloValuta}10.000</span>
                    <span>{simboloValuta}1.000.000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cambio EUR/{valutaEstera} attuale: {formatNumber(cambioIniziale, 2)}
                  </label>
                  <input
                    type="range"
                    min="0.70"
                    max="1.50"
                    step="0.01"
                    value={cambioIniziale}
                    onChange={(e) => setCambioIniziale(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    1 EUR = {formatNumber(cambioIniziale, 2)} {valutaEstera}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orizzonte temporale: {orizzonteAnni} anni
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={orizzonteAnni}
                    onChange={(e) => setOrizzonteAnni(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rendimento atteso investimento: {rendimentoAttesoUSD}%/anno
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="12"
                    step="0.5"
                    value={rendimentoAttesoUSD}
                    onChange={(e) => setRendimentoAttesoUSD(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">S&P 500 storico: ~10%/anno</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo hedging annuo: {formatNumber(costoHedgingAnnuo, 1)}%
                  </label>
                  <input
                    type="range"
                    min="0.2"
                    max="3"
                    step="0.1"
                    value={costoHedgingAnnuo}
                    onChange={(e) => setCostoHedgingAnnuo(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Tipico per ETF hedged: 0.5%-1.5% (diff. TER + costo forward)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aspettativa cambio su {orizzonteAnni} anni: {aspettativaCambio > 0 ? '+' : ''}{aspettativaCambio}%
                  </label>
                  <input
                    type="range"
                    min="-30"
                    max="30"
                    step="5"
                    value={aspettativaCambio}
                    onChange={(e) => setAspettativaCambio(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>EUR piu debole (-30%)</span>
                    <span>EUR piu forte (+30%)</span>
                  </div>
                </div>
              </div>

              {/* ETF Example Box */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">Esempio ETF S&P 500</p>
                <div className="grid grid-cols-2 gap-4 text-xs text-gray-800">
                  <div>
                    <p className="font-medium">CSPX (non hedged)</p>
                    <p>TER: 0.07%</p>
                  </div>
                  <div>
                    <p className="font-medium">IUSE (hedged EUR)</p>
                    <p>TER: 0.20%</p>
                  </div>
                </div>
                <p className="text-xs text-gray-700 mt-2">
                  Costo implicito hedging: ~0.5-1%/anno (differenziale tassi EUR-USD)
                </p>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {/* Main Result */}
              <div className={`rounded-card p-6 text-white ${risultati.convieneHedging ? 'bg-forest' : 'bg-green-600'}`}>
                <p className="text-white/80 text-sm mb-1">In base ai tuoi parametri</p>
                <p className="font-heading text-2xl mb-2">
                  {risultati.convieneHedging
                    ? 'Conviene fare hedging'
                    : 'Meglio NON fare hedging'}
                </p>
                <p className="text-white/70 text-sm">
                  Differenza: {formatCurrency(risultati.differenzaAssoluta)}
                  ({risultati.differenzaPercentuale > 0 ? '+' : ''}{formatNumber(risultati.differenzaPercentuale, 1)}%)
                </p>
              </div>

              {/* Comparison Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-card p-5 shadow-sm border-2 border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 bg-gray-500 rounded-full" />
                    <p className="text-gray-500 text-sm">CON Hedging</p>
                  </div>
                  <p className="font-heading text-xl text-forest">{formatCurrency(risultati.valoreFinaleConHedging)}</p>
                  <p className="text-xs text-gray-400 mt-1">Rendimento netto: {formatNumber(rendimentoAttesoUSD - costoHedgingAnnuo, 1)}%/anno</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full" />
                    <p className="text-gray-500 text-sm">SENZA Hedging</p>
                  </div>
                  <p className="font-heading text-xl text-forest">{formatCurrency(risultati.valoreFinaleSenzaHedging)}</p>
                  <p className="text-xs text-gray-400 mt-1">Cambio finale: {formatNumber(risultati.cambioFinale, 2)}</p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Valore iniziale in EUR</p>
                  <p className="font-heading text-lg text-forest">{formatCurrency(risultati.valoreInizialeEUR)}</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Costo totale hedging</p>
                  <p className="font-heading text-lg text-red-600">{formatCurrency(risultati.costoTotaleHedging)}</p>
                </div>
              </div>

              {/* Break-even */}
              <div className="bg-amber-50 border border-amber-200 rounded-card p-5">
                <p className="font-medium text-amber-900 mb-2">Break-even cambio</p>
                <p className="text-sm text-amber-800">
                  L&apos;hedging conviene se l&apos;EUR si rafforza di oltre{' '}
                  <strong>{formatNumber(risultati.breakEvenVariazione, 1)}%</strong> in {orizzonteAnni} anni
                </p>
                <p className="text-xs text-amber-700 mt-2">
                  Cambio break-even: {formatNumber(risultati.breakEvenCambio, 2)} (da {formatNumber(cambioIniziale, 2)})
                </p>
              </div>

              {/* Scenario Chart */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Proiezione valore in EUR</h3>
                <div className="h-64 flex items-end gap-2">
                  {risultati.datiAnnuali.map((dato) => (
                    <div key={dato.anno} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex gap-0.5 items-end" style={{ height: '200px' }}>
                        <div
                          className="flex-1 bg-gray-500 rounded-t"
                          style={{ height: `${(dato.conHedging / maxValore) * 100}%`, minHeight: '4px' }}
                        />
                        <div
                          className="flex-1 bg-green-500 rounded-t"
                          style={{ height: `${(dato.senzaHedging / maxValore) * 100}%`, minHeight: '4px' }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 mt-1">{dato.anno}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-4 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-gray-500 rounded" /> Con Hedging
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-green-500 rounded" /> Senza Hedging
                  </span>
                </div>
              </div>

              {/* Alternative Scenarios */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Scenari alternativi</h3>
                <div className="space-y-3">
                  {risultati.scenariCambio.map((scenario) => (
                    <div key={scenario.nome} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">{scenario.nome}</span>
                        <span className={`text-sm font-medium ${scenario.conviene === 'SI hedging' ? 'text-forest' : 'text-green-600'}`}>
                          {scenario.conviene}
                        </span>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>Cambio: {formatNumber(scenario.cambioFinale, 2)}</span>
                        <span>Senza hedging: {formatCurrency(scenario.valoreUnhedged)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Educational Content */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h2 className="font-heading text-xl text-forest mb-4">Come funziona l&apos;hedging valutario</h2>
              <div className="prose prose-sm text-gray-600 max-w-none">
                <p>
                  L&apos;<strong>hedging valutario</strong> (currency hedging) elimina il rischio di cambio
                  su investimenti in valuta estera, bloccando il tasso di cambio attuale.
                </p>

                <h3 className="font-heading text-lg text-forest mt-4 mb-2">Il costo dell&apos;hedging</h3>
                <p>
                  L&apos;hedging ha un costo, determinato principalmente dal <strong>differenziale dei tassi di interesse</strong>
                  tra le due valute. Se i tassi USA sono superiori a quelli dell&apos;eurozona, coprire EUR/USD costa denaro.
                </p>

                <h3 className="font-heading text-lg text-forest mt-4 mb-2">Quando ha senso</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Orizzonte breve (&lt;3 anni):</strong> La volatilita valutaria puo essere significativa</li>
                  <li><strong>Obiettivo preciso:</strong> Hai bisogno di una somma certa in EUR a una data specifica</li>
                  <li><strong>Bassa tolleranza al rischio:</strong> Non vuoi ulteriore volatilita</li>
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h2 className="font-heading text-xl text-forest mb-4">Quando NON conviene fare hedging</h2>
              <div className="prose prose-sm text-gray-600 max-w-none">
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Orizzonte lungo (&gt;10 anni):</strong> Nel lungo periodo, le valute tendono a oscillare
                    intorno alla media (mean reversion). Il costo cumulato dell&apos;hedging supera spesso i benefici.
                  </li>
                  <li>
                    <strong>Portafoglio diversificato:</strong> Se hai investimenti in piu valute, il rischio e gia
                    parzialmente diversificato.
                  </li>
                  <li>
                    <strong>Spese future in valuta:</strong> Se prevedi spese in USD (viaggi, acquisti),
                    l&apos;esposizione valutaria puo essere un hedge naturale.
                  </li>
                </ul>

                <h3 className="font-heading text-lg text-forest mt-4 mb-2">Dati storici EUR/USD</h3>
                <div className="bg-gray-50 p-4 rounded-lg mt-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Range 20 anni</p>
                      <p className="font-medium">{formatNumber(datiStorici.min20Anni, 2)} - {formatNumber(datiStorici.max20Anni, 2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Media storica</p>
                      <p className="font-medium">{formatNumber(datiStorici.media20Anni, 2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Attuale</p>
                      <p className="font-medium">{formatNumber(datiStorici.attuale, 2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">vs Media</p>
                      <p className={`font-medium ${datiStorici.attuale < datiStorici.media20Anni ? 'text-green-600' : 'text-red-600'}`}>
                        {datiStorici.attuale < datiStorici.media20Anni ? 'EUR sottovalutato' : 'EUR sopravvalutato'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-8 bg-green-50 border border-green-200 rounded-card p-6">
            <h2 className="font-heading text-xl text-forest mb-4">Raccomandazioni pratiche</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-forest mb-1">Orizzonte &gt;10 anni</h3>
                <p className="text-sm text-gray-600">
                  L&apos;hedging spesso <strong>non conviene</strong>. I costi cumulati superano i benefici statistici.
                </p>
              </div>
              <div>
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-forest mb-1">Orizzonte 3-10 anni</h3>
                <p className="text-sm text-gray-600">
                  <strong>Hedging parziale</strong> (50%) puo essere un buon compromesso.
                </p>
              </div>
              <div>
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-forest mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-forest mb-1">Orizzonte &lt;3 anni</h3>
                <p className="text-sm text-gray-600">
                  L&apos;hedging <strong>ha piu senso</strong>, specialmente se hai un obiettivo preciso in EUR.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Hai un portafoglio internazionale?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            La gestione del rischio valutario e solo uno degli aspetti da considerare.
            Un consulente puo aiutarti a ottimizzare l&apos;intero portafoglio.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom py-8">
        <RatingWidget toolSlug="copertura-valutaria" toolName="copertura-valutaria" />
      </div>

      <Footer />
    </main>
  )
}
