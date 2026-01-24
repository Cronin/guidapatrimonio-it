'use client'

import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget, ToolPageSchema} from '@/components'

// Box-Muller transform for generating normal distribution
function randomNormal(): number {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

type Preset = 'conservativo' | 'bilanciato' | 'aggressivo' | 'custom'
type SimulationMode = 'accumulo' | 'fire'
type ContributionFrequency = 'mensile' | 'annuale'

interface SimulationResult {
  anno: number
  p5: number
  p10: number
  p25: number
  p50: number
  p75: number
  p90: number
  p95: number
}

interface FIREResult {
  anniSopravvivenza: number[]
  probabilitaSopravvivenza: number[]
  probabilitaSuccesso30Anni: number
  safWithdrawalRate: number
  etaEsaurimentoP5: number
  etaEsaurimentoP50: number
  etaEsaurimentoP95: number
}

interface SimulationOutput {
  percorsi: SimulationResult[]
  valoreFinaleP5: number
  valoreFinaleP10: number
  valoreFinaleP25: number
  valoreFinaleP50: number
  valoreFinaleP75: number
  valoreFinaleP90: number
  valoreFinaleP95: number
  probabilitaRaddoppio: number
  probabilitaObiettivo: number
  totaleVersato: number
  cagr: number
  valoreFinaleRealeP50: number
  fire?: FIREResult
}

export default function SimulatoreMonteCarloPage() {
  // Input state
  const [capitale, setCapitale] = useState(100000)
  const [versamento, setVersamento] = useState(500)
  const [frequenzaVersamento, setFrequenzaVersamento] = useState<ContributionFrequency>('mensile')
  const [rendimentoMedio, setRendimentoMedio] = useState(7)
  const [volatilita, setVolatilita] = useState(15)
  const [inflazione, setInflazione] = useState(2)
  const [anni, setAnni] = useState(25)
  const [numSimulazioni, setNumSimulazioni] = useState(5000)
  const [obiettivo, setObiettivo] = useState(500000)
  const [preset, setPreset] = useState<Preset>('bilanciato')
  const [mode, setMode] = useState<SimulationMode>('accumulo')

  // FIRE specific inputs
  const [prelievoAnnuale, setPrelievoAnnuale] = useState(40000)
  const [etaAttuale, setEtaAttuale] = useState(40)
  const [aspettativaVita, setAspettativaVita] = useState(90)

  // UI state
  const [hoveredYear, setHoveredYear] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationProgress, setAnimationProgress] = useState(100)
  const chartRef = useRef<SVGSVGElement>(null)

  const presets = {
    conservativo: { rendimento: 4, volatilita: 8, label: 'Conservativo', desc: '80% Bond, 20% Azioni', color: 'blue' },
    bilanciato: { rendimento: 7, volatilita: 15, label: 'Bilanciato', desc: '60% Azioni, 40% Bond', color: 'green' },
    aggressivo: { rendimento: 9, volatilita: 20, label: 'Aggressivo', desc: '100% Azioni Globali', color: 'orange' },
  }

  const handlePresetChange = (newPreset: Preset) => {
    setPreset(newPreset)
    if (newPreset !== 'custom') {
      setRendimentoMedio(presets[newPreset].rendimento)
      setVolatilita(presets[newPreset].volatilita)
    }
  }

  const runAnimation = useCallback(() => {
    setIsAnimating(true)
    setAnimationProgress(0)
    let progress = 0
    const interval = setInterval(() => {
      progress += 2
      setAnimationProgress(progress)
      if (progress >= 100) {
        clearInterval(interval)
        setIsAnimating(false)
      }
    }, 20)
  }, [])

  const risultati = useMemo<SimulationOutput>(() => {
    const rendimentoAnnuo = rendimentoMedio / 100
    const devStdAnnua = volatilita / 100
    const inflazioneAnnua = inflazione / 100
    const rendimentoReale = rendimentoAnnuo - inflazioneAnnua

    const versamentoAnnuo = frequenzaVersamento === 'mensile'
      ? versamento * 12
      : versamento

    // Generate all simulations
    const simulazioni: number[][] = []
    const simulazioniFIRE: { valori: number[], annoEsaurimento: number }[] = []

    for (let sim = 0; sim < numSimulazioni; sim++) {
      if (mode === 'accumulo') {
        // Accumulation mode
        const percorso: number[] = [capitale]
        let valoreCorrente = capitale

        for (let anno = 1; anno <= anni; anno++) {
          const rendimentoRandom = rendimentoAnnuo + devStdAnnua * randomNormal()
          valoreCorrente = valoreCorrente * (1 + rendimentoRandom) + versamentoAnnuo
          percorso.push(Math.max(0, valoreCorrente))
        }

        simulazioni.push(percorso)
      } else {
        // FIRE/Decumulation mode
        const percorso: number[] = [capitale]
        let valoreCorrente = capitale
        let annoEsaurimento = aspettativaVita - etaAttuale // Default: never runs out
        const anniDecumulo = aspettativaVita - etaAttuale

        for (let anno = 1; anno <= anniDecumulo; anno++) {
          const rendimentoRandom = rendimentoAnnuo + devStdAnnua * randomNormal()
          // Adjust withdrawal for inflation
          const prelievoInflazionato = prelievoAnnuale * Math.pow(1 + inflazioneAnnua, anno)
          valoreCorrente = valoreCorrente * (1 + rendimentoRandom) - prelievoInflazionato

          if (valoreCorrente <= 0 && annoEsaurimento === anniDecumulo) {
            annoEsaurimento = anno
          }

          percorso.push(Math.max(0, valoreCorrente))
        }

        simulazioni.push(percorso)
        simulazioniFIRE.push({ valori: percorso, annoEsaurimento })
      }
    }

    // Calculate percentiles for each year
    const maxAnni = mode === 'fire' ? aspettativaVita - etaAttuale : anni
    const percorsi: SimulationResult[] = []

    for (let anno = 0; anno <= maxAnni; anno++) {
      const valoriAnno = simulazioni.map(s => s[anno] || 0).sort((a, b) => a - b)
      const n = valoriAnno.length

      percorsi.push({
        anno,
        p5: valoriAnno[Math.floor(n * 0.05)],
        p10: valoriAnno[Math.floor(n * 0.10)],
        p25: valoriAnno[Math.floor(n * 0.25)],
        p50: valoriAnno[Math.floor(n * 0.50)],
        p75: valoriAnno[Math.floor(n * 0.75)],
        p90: valoriAnno[Math.floor(n * 0.90)],
        p95: valoriAnno[Math.floor(n * 0.95)],
      })
    }

    // Final statistics
    const finalYear = mode === 'fire' ? aspettativaVita - etaAttuale : anni
    const valoriFinali = simulazioni.map(s => s[finalYear] || 0)
    const valoriOrdinati = [...valoriFinali].sort((a, b) => a - b)
    const n = valoriOrdinati.length
    const totaleVersato = mode === 'fire' ? capitale : capitale + versamentoAnnuo * anni

    // Probability calculations
    const raddoppioCount = valoriFinali.filter(v => v >= totaleVersato * 2).length
    const probabilitaRaddoppio = (raddoppioCount / n) * 100

    const obiettivoCount = valoriFinali.filter(v => v >= obiettivo).length
    const probabilitaObiettivo = (obiettivoCount / n) * 100

    // CAGR calculation (for median)
    const valoreFinaleP50 = valoriOrdinati[Math.floor(n * 0.50)]
    const cagr = mode === 'accumulo'
      ? (Math.pow(valoreFinaleP50 / capitale, 1 / anni) - 1) * 100
      : 0

    // Real value (inflation adjusted)
    const valoreFinaleRealeP50 = valoreFinaleP50 / Math.pow(1 + inflazioneAnnua, finalYear)

    // FIRE specific calculations
    let fire: FIREResult | undefined
    if (mode === 'fire') {
      const anniSopravvivenza: number[] = []
      const probabilitaSopravvivenza: number[] = []

      // Calculate survival probability for each year
      for (let anno = 0; anno <= aspettativaVita - etaAttuale; anno++) {
        const sopravvissuti = simulazioniFIRE.filter(s => s.annoEsaurimento > anno).length
        anniSopravvivenza.push(anno)
        probabilitaSopravvivenza.push((sopravvissuti / numSimulazioni) * 100)
      }

      // 30-year success probability
      const trentAnniSopravvissuti = simulazioniFIRE.filter(s => s.annoEsaurimento > 30).length
      const probabilitaSuccesso30Anni = (trentAnniSopravvissuti / numSimulazioni) * 100

      // Calculate safe withdrawal rate (4% rule check)
      const tassoPrelievo = (prelievoAnnuale / capitale) * 100

      // Binary search for safe withdrawal rate (95% success at 30 years)
      let swr = 4.0
      const testSWR = (rate: number): number => {
        let successi = 0
        for (let sim = 0; sim < Math.min(1000, numSimulazioni); sim++) {
          let valore = capitale
          let survived = true
          for (let anno = 1; anno <= 30; anno++) {
            const rendimentoRandom = rendimentoAnnuo + devStdAnnua * randomNormal()
            const prelievo = capitale * (rate / 100) * Math.pow(1 + inflazioneAnnua, anno)
            valore = valore * (1 + rendimentoRandom) - prelievo
            if (valore <= 0) {
              survived = false
              break
            }
          }
          if (survived) successi++
        }
        return (successi / Math.min(1000, numSimulazioni)) * 100
      }

      // Find SWR for 95% success
      for (let rate = 2.0; rate <= 6.0; rate += 0.1) {
        if (testSWR(rate) >= 95) {
          swr = rate
        }
      }

      // Age at depletion for different percentiles
      const anniEsaurimento = simulazioniFIRE.map(s => s.annoEsaurimento).sort((a, b) => a - b)
      const etaEsaurimentoP5 = etaAttuale + anniEsaurimento[Math.floor(numSimulazioni * 0.05)]
      const etaEsaurimentoP50 = etaAttuale + anniEsaurimento[Math.floor(numSimulazioni * 0.50)]
      const etaEsaurimentoP95 = etaAttuale + anniEsaurimento[Math.floor(numSimulazioni * 0.95)]

      fire = {
        anniSopravvivenza,
        probabilitaSopravvivenza,
        probabilitaSuccesso30Anni,
        safWithdrawalRate: swr,
        etaEsaurimentoP5,
        etaEsaurimentoP50,
        etaEsaurimentoP95,
      }
    }

    return {
      percorsi,
      valoreFinaleP5: valoriOrdinati[Math.floor(n * 0.05)],
      valoreFinaleP10: valoriOrdinati[Math.floor(n * 0.10)],
      valoreFinaleP25: valoriOrdinati[Math.floor(n * 0.25)],
      valoreFinaleP50,
      valoreFinaleP75: valoriOrdinati[Math.floor(n * 0.75)],
      valoreFinaleP90: valoriOrdinati[Math.floor(n * 0.90)],
      valoreFinaleP95: valoriOrdinati[Math.floor(n * 0.95)],
      probabilitaRaddoppio,
      probabilitaObiettivo,
      totaleVersato,
      cagr,
      valoreFinaleRealeP50,
      fire,
    }
  }, [capitale, versamento, frequenzaVersamento, rendimentoMedio, volatilita, inflazione, anni, numSimulazioni, obiettivo, mode, prelievoAnnuale, etaAttuale, aspettativaVita])

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        notation: 'compact',
      }).format(value)
    }
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('it-IT').format(Math.round(value))
  }

  // Chart dimensions
  const maxAnni = mode === 'fire' ? aspettativaVita - etaAttuale : anni
  const maxValore = Math.max(...risultati.percorsi.map(p => p.p95), capitale * 1.1)
  const minValore = Math.min(...risultati.percorsi.map(p => p.p5), 0)
  const chartHeight = 350
  const chartPadding = { top: 20, right: 20, bottom: 40, left: 80 }

  const getY = (value: number) => {
    const range = maxValore - minValore
    if (range === 0) return chartHeight / 2
    return chartPadding.top + (chartHeight - chartPadding.top - chartPadding.bottom) * (1 - (value - minValore) / range)
  }

  const getX = (anno: number) => {
    return chartPadding.left + (anno / maxAnni) * (100 - chartPadding.left / 10 - chartPadding.right / 10) * 10
  }

  // Generate smooth path using cardinal spline
  const generateSmoothPath = (data: SimulationResult[], key: keyof SimulationResult) => {
    if (data.length === 0) return ''

    const points = data.map((d, i) => ({
      x: getX(d.anno),
      y: getY(d[key] as number),
    }))

    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  }

  const generateAreaPath = (data: SimulationResult[], keyTop: keyof SimulationResult, keyBottom: keyof SimulationResult) => {
    if (data.length === 0) return ''

    const topPoints = data.map((d) => ({
      x: getX(d.anno),
      y: getY(d[keyTop] as number),
    }))

    const bottomPoints = [...data].reverse().map((d) => ({
      x: getX(d.anno),
      y: getY(d[keyBottom] as number),
    }))

    const topPath = topPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const bottomPath = bottomPoints.map((p) => `L ${p.x} ${p.y}`).join(' ')

    return `${topPath} ${bottomPath} Z`
  }

  // Get tooltip data for hovered year
  const tooltipData = hoveredYear !== null ? risultati.percorsi.find(p => p.anno === hoveredYear) : null

  return (
    <main>
      <ToolPageSchema slug="simulatore-monte-carlo" />
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-forest via-green-800 to-green-900 pt-navbar relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
        </div>
        <div className="container-custom py-12 relative">
          <Link href="/strumenti" className="inline-flex items-center text-green-300 hover:text-white mb-4 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tutti gli strumenti
          </Link>
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 className="font-heading text-[32px] md:text-[48px] text-white leading-tight">
                Simulatore Monte Carlo
              </h1>
              <p className="text-white/80 mt-3 max-w-2xl text-lg">
                Analisi probabilistica avanzata per investimenti e pianificazione FIRE.
                Simula fino a 10.000 scenari per calcolare le tue probabilita di successo.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
              <p className="text-green-300 text-xs font-medium">Alternativa gratuita a</p>
              <p className="text-white font-heading text-lg">Portfolio Visualizer</p>
              <p className="text-green-200 text-xs">Valore: $360/anno</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          {/* Mode Selector */}
          <div className="mb-8">
            <div className="inline-flex bg-white rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setMode('accumulo')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  mode === 'accumulo'
                    ? 'bg-forest text-white shadow-md'
                    : 'text-gray-600 hover:text-forest'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  Accumulo (PAC)
                </span>
              </button>
              <button
                onClick={() => setMode('fire')}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  mode === 'fire'
                    ? 'bg-forest text-white shadow-md'
                    : 'text-gray-600 hover:text-forest'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                  Decumulo (FIRE)
                </span>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form - Left Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Presets */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-heading text-lg text-forest mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Asset Allocation
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.entries(presets) as [Preset, typeof presets.conservativo][]).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handlePresetChange(key)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        preset === key
                          ? 'border-green-600 bg-green-50 shadow-sm'
                          : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                      }`}
                    >
                      {preset === key && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                      <p className={`font-semibold text-sm ${preset === key ? 'text-green-700' : 'text-gray-700'}`}>
                        {value.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{value.desc}</p>
                      <div className="mt-2 text-xs text-gray-400">
                        {value.rendimento}% / {value.volatilita}%
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Parameters */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-heading text-lg text-forest mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Capitale e {mode === 'fire' ? 'Prelievi' : 'Versamenti'}
                </h2>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">Capitale iniziale</label>
                      <span className="text-sm font-bold text-forest">{formatCurrency(capitale)}</span>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="2000000"
                      step="10000"
                      value={capitale}
                      onChange={(e) => setCapitale(Number(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-green-200 to-green-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>10k</span>
                      <span>2M</span>
                    </div>
                  </div>

                  {mode === 'accumulo' ? (
                    <>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">Versamento periodico</label>
                          <span className="text-sm font-bold text-forest">{formatCurrency(versamento)}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="5000"
                          step="50"
                          value={versamento}
                          onChange={(e) => setVersamento(Number(e.target.value))}
                          className="w-full h-2 bg-gradient-to-r from-green-200 to-green-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:shadow-lg"
                        />
                        <div className="flex justify-between mt-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setFrequenzaVersamento('mensile')}
                              className={`px-3 py-1 text-xs rounded-full transition-all ${
                                frequenzaVersamento === 'mensile'
                                  ? 'bg-forest text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              Mensile
                            </button>
                            <button
                              onClick={() => setFrequenzaVersamento('annuale')}
                              className={`px-3 py-1 text-xs rounded-full transition-all ${
                                frequenzaVersamento === 'annuale'
                                  ? 'bg-forest text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              Annuale
                            </button>
                          </div>
                          <span className="text-xs text-gray-400">{formatCurrency(frequenzaVersamento === 'mensile' ? versamento * 12 : versamento)}/anno</span>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">Orizzonte temporale</label>
                          <span className="text-sm font-bold text-forest">{anni} anni</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="50"
                          step="1"
                          value={anni}
                          onChange={(e) => setAnni(Number(e.target.value))}
                          className="w-full h-2 bg-gradient-to-r from-green-200 to-green-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:shadow-lg"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">Obiettivo</label>
                          <span className="text-sm font-bold text-forest">{formatCurrency(obiettivo)}</span>
                        </div>
                        <input
                          type="range"
                          min="50000"
                          max="5000000"
                          step="50000"
                          value={obiettivo}
                          onChange={(e) => setObiettivo(Number(e.target.value))}
                          className="w-full h-2 bg-gradient-to-r from-green-200 to-green-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:shadow-lg"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700">Prelievo annuale</label>
                          <span className="text-sm font-bold text-amber-600">{formatCurrency(prelievoAnnuale)}</span>
                        </div>
                        <input
                          type="range"
                          min="10000"
                          max="200000"
                          step="1000"
                          value={prelievoAnnuale}
                          onChange={(e) => setPrelievoAnnuale(Number(e.target.value))}
                          className="w-full h-2 bg-gradient-to-r from-amber-200 to-amber-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:shadow-lg"
                        />
                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                          <span>Tasso prelievo: {((prelievoAnnuale / capitale) * 100).toFixed(1)}%</span>
                          <span>{formatCurrency(prelievoAnnuale / 12)}/mese</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700">Eta attuale</label>
                            <span className="text-sm font-bold text-forest">{etaAttuale}</span>
                          </div>
                          <input
                            type="range"
                            min="25"
                            max="70"
                            step="1"
                            value={etaAttuale}
                            onChange={(e) => setEtaAttuale(Number(e.target.value))}
                            className="w-full h-2 bg-gradient-to-r from-green-200 to-green-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:shadow-lg"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700">Aspettativa</label>
                            <span className="text-sm font-bold text-forest">{aspettativaVita}</span>
                          </div>
                          <input
                            type="range"
                            min="75"
                            max="100"
                            step="1"
                            value={aspettativaVita}
                            onChange={(e) => setAspettativaVita(Number(e.target.value))}
                            className="w-full h-2 bg-gradient-to-r from-green-200 to-green-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:shadow-lg"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Market Parameters */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-heading text-lg text-forest mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                  </svg>
                  Parametri di Mercato
                </h2>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">Rendimento atteso (nominale)</label>
                      <span className="text-sm font-bold text-green-600">{rendimentoMedio}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="0.5"
                      value={rendimentoMedio}
                      onChange={(e) => {
                        setRendimentoMedio(Number(e.target.value))
                        setPreset('custom')
                      }}
                      className="w-full h-2 bg-gradient-to-r from-green-200 to-green-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:shadow-lg"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">Volatilita (dev. standard)</label>
                      <span className="text-sm font-bold text-amber-600">{volatilita}%</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="35"
                      step="1"
                      value={volatilita}
                      onChange={(e) => {
                        setVolatilita(Number(e.target.value))
                        setPreset('custom')
                      }}
                      className="w-full h-2 bg-gradient-to-r from-amber-200 to-red-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-600 [&::-webkit-slider-thumb]:shadow-lg"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">Inflazione attesa</label>
                      <span className="text-sm font-bold text-red-500">{inflazione}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={inflazione}
                      onChange={(e) => setInflazione(Number(e.target.value))}
                      className="w-full h-2 bg-gradient-to-r from-gray-200 to-red-300 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:shadow-lg"
                    />
                    <p className="text-xs text-gray-400 mt-1">Rendimento reale: {(rendimentoMedio - inflazione).toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              {/* Simulation Settings */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h2 className="font-heading text-lg text-forest mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Simulazione
                </h2>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Numero simulazioni</label>
                    <span className="text-sm font-bold text-forest">{numSimulazioni.toLocaleString('it-IT')}</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="10000"
                    step="1000"
                    value={numSimulazioni}
                    onChange={(e) => setNumSimulazioni(Number(e.target.value))}
                    className="w-full h-2 bg-gradient-to-r from-green-200 to-green-400 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-forest [&::-webkit-slider-thumb]:shadow-lg"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1.000</span>
                    <span>10.000</span>
                  </div>
                </div>
                <button
                  onClick={runAnimation}
                  disabled={isAnimating}
                  className="w-full mt-4 py-3 bg-forest text-white rounded-xl font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isAnimating ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Simulazione in corso...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Esegui Simulazione
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results - Right Columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Fan Chart */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-xl text-forest">
                    {mode === 'fire' ? 'Proiezione Patrimonio FIRE' : 'Distribuzione Scenari'}
                  </h3>
                  {tooltipData && (
                    <div className="bg-forest text-white px-4 py-2 rounded-lg text-sm">
                      Anno {tooltipData.anno}: {formatCurrency(tooltipData.p50)} (mediana)
                    </div>
                  )}
                </div>

                <div className="relative" style={{ height: chartHeight + 20 }}>
                  <svg
                    ref={chartRef}
                    viewBox={`0 0 1000 ${chartHeight}`}
                    preserveAspectRatio="none"
                    className="w-full h-full"
                    style={{ height: chartHeight }}
                    onMouseMove={(e) => {
                      const rect = chartRef.current?.getBoundingClientRect()
                      if (rect) {
                        const x = e.clientX - rect.left
                        const yearPercent = (x - (chartPadding.left * rect.width / 1000)) / ((1000 - chartPadding.left - chartPadding.right) * rect.width / 1000)
                        const year = Math.round(yearPercent * maxAnni)
                        if (year >= 0 && year <= maxAnni) {
                          setHoveredYear(year)
                        }
                      }
                    }}
                    onMouseLeave={() => setHoveredYear(null)}
                  >
                    <defs>
                      <linearGradient id="gradientP5P95" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.15" />
                      </linearGradient>
                      <linearGradient id="gradientP25P75" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0.1" />
                      </linearGradient>
                      <linearGradient id="gradientP10P90" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
                      <line
                        key={pct}
                        x1={chartPadding.left}
                        y1={chartPadding.top + (chartHeight - chartPadding.top - chartPadding.bottom) * pct}
                        x2={1000 - chartPadding.right}
                        y2={chartPadding.top + (chartHeight - chartPadding.top - chartPadding.bottom) * pct}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                      />
                    ))}

                    {/* Area 5%-95% */}
                    <path
                      d={generateAreaPath(risultati.percorsi, 'p95', 'p5')}
                      fill="url(#gradientP5P95)"
                      style={{
                        opacity: animationProgress / 100,
                        transition: 'opacity 0.3s',
                      }}
                    />

                    {/* Area 10%-90% */}
                    <path
                      d={generateAreaPath(risultati.percorsi, 'p90', 'p10')}
                      fill="url(#gradientP10P90)"
                      style={{
                        opacity: animationProgress / 100,
                      }}
                    />

                    {/* Area 25%-75% */}
                    <path
                      d={generateAreaPath(risultati.percorsi, 'p75', 'p25')}
                      fill="url(#gradientP25P75)"
                      style={{
                        opacity: animationProgress / 100,
                      }}
                    />

                    {/* P5 line (worst case) */}
                    <path
                      d={generateSmoothPath(risultati.percorsi, 'p5')}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      opacity="0.7"
                    />

                    {/* P95 line (best case) */}
                    <path
                      d={generateSmoothPath(risultati.percorsi, 'p95')}
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                      opacity="0.7"
                    />

                    {/* Median line */}
                    <path
                      d={generateSmoothPath(risultati.percorsi, 'p50')}
                      fill="none"
                      stroke="#1B4D3E"
                      strokeWidth="3"
                    />

                    {/* Zero line for FIRE mode */}
                    {mode === 'fire' && minValore <= 0 && (
                      <line
                        x1={chartPadding.left}
                        y1={getY(0)}
                        x2={1000 - chartPadding.right}
                        y2={getY(0)}
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeDasharray="8 4"
                      />
                    )}

                    {/* Hover line */}
                    {hoveredYear !== null && (
                      <>
                        <line
                          x1={getX(hoveredYear)}
                          y1={chartPadding.top}
                          x2={getX(hoveredYear)}
                          y2={chartHeight - chartPadding.bottom}
                          stroke="#1B4D3E"
                          strokeWidth="1"
                          strokeDasharray="4 4"
                        />
                        {tooltipData && (
                          <>
                            <circle cx={getX(hoveredYear)} cy={getY(tooltipData.p50)} r="6" fill="#1B4D3E" />
                            <circle cx={getX(hoveredYear)} cy={getY(tooltipData.p5)} r="4" fill="#ef4444" />
                            <circle cx={getX(hoveredYear)} cy={getY(tooltipData.p95)} r="4" fill="#22c55e" />
                          </>
                        )}
                      </>
                    )}

                    {/* Y-axis labels */}
                    {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                      const value = maxValore - (maxValore - minValore) * pct
                      return (
                        <text
                          key={pct}
                          x={chartPadding.left - 10}
                          y={chartPadding.top + (chartHeight - chartPadding.top - chartPadding.bottom) * pct + 4}
                          textAnchor="end"
                          fontSize="11"
                          fill="#6b7280"
                        >
                          {formatCurrency(value)}
                        </text>
                      )
                    })}

                    {/* X-axis labels */}
                    {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
                      const anno = Math.round(maxAnni * pct)
                      return (
                        <text
                          key={pct}
                          x={getX(anno)}
                          y={chartHeight - 10}
                          textAnchor="middle"
                          fontSize="11"
                          fill="#6b7280"
                        >
                          {mode === 'fire' ? `Eta ${etaAttuale + anno}` : `Anno ${anno}`}
                        </text>
                      )
                    })}
                  </svg>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-3 rounded" style={{ background: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.15), rgba(239, 68, 68, 0.15))' }}></div>
                    <span className="text-xs text-gray-600">Range 5%-95%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-3 rounded" style={{ background: 'linear-gradient(to bottom, rgba(34, 197, 94, 0.3), rgba(34, 197, 94, 0.1))' }}></div>
                    <span className="text-xs text-gray-600">Range 25%-75%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-forest"></div>
                    <span className="text-xs text-gray-600">Mediana (50%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-red-500" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #ef4444, #ef4444 6px, transparent 6px, transparent 10px)' }}></div>
                    <span className="text-xs text-gray-600">Worst (5%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-green-500" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #22c55e, #22c55e 6px, transparent 6px, transparent 10px)' }}></div>
                    <span className="text-xs text-gray-600">Best (95%)</span>
                  </div>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-forest to-green-700 rounded-2xl p-5 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-green-200 text-sm">Caso Mediano (50%)</p>
                  </div>
                  <p className="font-heading text-3xl">{formatCurrency(risultati.valoreFinaleP50)}</p>
                  {mode === 'accumulo' && (
                    <p className="text-green-200 text-xs mt-2">
                      Reale (netto inflazione): {formatCurrency(risultati.valoreFinaleRealeP50)}
                    </p>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-red-500">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-gray-500 text-sm">Worst Case (5%)</p>
                  </div>
                  <p className="font-heading text-2xl text-red-600">{formatCurrency(risultati.valoreFinaleP5)}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {mode === 'fire' ? 'Patrimonio residuo' : `${((risultati.valoreFinaleP5 / risultati.totaleVersato - 1) * 100).toFixed(0)}% vs versato`}
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-5 shadow-sm border-l-4 border-green-500">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    <p className="text-gray-500 text-sm">Best Case (95%)</p>
                  </div>
                  <p className="font-heading text-2xl text-green-600">{formatCurrency(risultati.valoreFinaleP95)}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {mode === 'fire' ? 'Patrimonio residuo' : `+${((risultati.valoreFinaleP95 / risultati.totaleVersato - 1) * 100).toFixed(0)}% vs versato`}
                  </p>
                </div>
              </div>

              {/* Probability Cards */}
              <div className="grid sm:grid-cols-2 gap-4">
                {mode === 'accumulo' ? (
                  <>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-gray-700 font-semibold">Probabilita raggiungere obiettivo</p>
                          <p className="text-xs text-gray-400 mt-1">Target: {formatCurrency(obiettivo)}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-heading text-3xl ${risultati.probabilitaObiettivo >= 70 ? 'text-green-600' : risultati.probabilitaObiettivo >= 40 ? 'text-amber-600' : 'text-red-600'}`}>
                            {risultati.probabilitaObiettivo.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-4 rounded-full transition-all duration-500 ${
                            risultati.probabilitaObiettivo >= 70 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                            risultati.probabilitaObiettivo >= 40 ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
                            'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                          style={{ width: `${Math.min(risultati.probabilitaObiettivo, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-gray-700 font-semibold">CAGR Atteso (Mediano)</p>
                          <p className="text-xs text-gray-400 mt-1">Compound Annual Growth Rate</p>
                        </div>
                        <p className="font-heading text-3xl text-forest">{risultati.cagr.toFixed(1)}%</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">Versato totale</p>
                          <p className="font-semibold text-forest">{formatCurrency(risultati.totaleVersato)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Guadagno mediano</p>
                          <p className="font-semibold text-green-600">+{formatCurrency(risultati.valoreFinaleP50 - risultati.totaleVersato)}</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* FIRE specific cards */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-gray-700 font-semibold">Probabilita di Successo FIRE</p>
                          <p className="text-xs text-gray-400 mt-1">Patrimonio dura fino a eta {aspettativaVita}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-heading text-3xl ${
                            (risultati.fire?.probabilitaSopravvivenza[risultati.fire.probabilitaSopravvivenza.length - 1] || 0) >= 90 ? 'text-green-600' :
                            (risultati.fire?.probabilitaSopravvivenza[risultati.fire.probabilitaSopravvivenza.length - 1] || 0) >= 70 ? 'text-amber-600' : 'text-red-600'
                          }`}>
                            {(risultati.fire?.probabilitaSopravvivenza[risultati.fire.probabilitaSopravvivenza.length - 1] || 0).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                        <div
                          className={`h-4 rounded-full transition-all duration-500 ${
                            (risultati.fire?.probabilitaSopravvivenza[risultati.fire.probabilitaSopravvivenza.length - 1] || 0) >= 90 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                            (risultati.fire?.probabilitaSopravvivenza[risultati.fire.probabilitaSopravvivenza.length - 1] || 0) >= 70 ? 'bg-gradient-to-r from-amber-400 to-amber-600' :
                            'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                          style={{ width: `${risultati.fire?.probabilitaSopravvivenza[risultati.fire.probabilitaSopravvivenza.length - 1] || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-gray-700 font-semibold">Safe Withdrawal Rate</p>
                          <p className="text-xs text-gray-400 mt-1">Tasso con 95% probabilita di successo a 30 anni</p>
                        </div>
                        <p className="font-heading text-3xl text-forest">{risultati.fire?.safWithdrawalRate.toFixed(1)}%</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-gray-500">Tasso attuale</p>
                          <p className={`font-semibold ${((prelievoAnnuale / capitale) * 100) <= (risultati.fire?.safWithdrawalRate || 4) ? 'text-green-600' : 'text-red-600'}`}>
                            {((prelievoAnnuale / capitale) * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Prelievo safe</p>
                          <p className="font-semibold text-green-600">{formatCurrency(capitale * (risultati.fire?.safWithdrawalRate || 4) / 100)}/anno</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* FIRE Age Depletion Cards */}
              {mode === 'fire' && risultati.fire && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-heading text-lg text-forest mb-4">Eta di Esaurimento Patrimonio</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-red-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Pessimistico (5%)</p>
                      <p className="font-heading text-2xl text-red-600">
                        {risultati.fire.etaEsaurimentoP5 >= aspettativaVita ? 'Mai' : `${risultati.fire.etaEsaurimentoP5} anni`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {risultati.fire.etaEsaurimentoP5 >= aspettativaVita ? 'Patrimonio sopravvive' : `tra ${risultati.fire.etaEsaurimentoP5 - etaAttuale} anni`}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-amber-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Mediano (50%)</p>
                      <p className="font-heading text-2xl text-amber-600">
                        {risultati.fire.etaEsaurimentoP50 >= aspettativaVita ? 'Mai' : `${risultati.fire.etaEsaurimentoP50} anni`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {risultati.fire.etaEsaurimentoP50 >= aspettativaVita ? 'Patrimonio sopravvive' : `tra ${risultati.fire.etaEsaurimentoP50 - etaAttuale} anni`}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Ottimistico (95%)</p>
                      <p className="font-heading text-2xl text-green-600">
                        {risultati.fire.etaEsaurimentoP95 >= aspettativaVita ? 'Mai' : `${risultati.fire.etaEsaurimentoP95} anni`}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {risultati.fire.etaEsaurimentoP95 >= aspettativaVita ? 'Patrimonio sopravvive' : `tra ${risultati.fire.etaEsaurimentoP95 - etaAttuale} anni`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Percentile Table */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="font-heading text-lg text-forest mb-4">Distribuzione Valori Finali</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-3 font-semibold text-gray-600">Percentile</th>
                        <th className="text-right py-3 px-3 font-semibold text-gray-600">Valore Finale</th>
                        {mode === 'accumulo' && (
                          <th className="text-right py-3 px-3 font-semibold text-gray-600">vs Versato</th>
                        )}
                        <th className="text-left py-3 px-3 font-semibold text-gray-600">Significato</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { p: 5, val: risultati.valoreFinaleP5, label: 'Worst case', color: 'red' },
                        { p: 10, val: risultati.valoreFinaleP10, label: 'Molto pessimistico', color: 'orange' },
                        { p: 25, val: risultati.valoreFinaleP25, label: 'Pessimistico', color: 'amber' },
                        { p: 50, val: risultati.valoreFinaleP50, label: 'Mediano (tipico)', color: 'green', highlight: true },
                        { p: 75, val: risultati.valoreFinaleP75, label: 'Ottimistico', color: 'emerald' },
                        { p: 90, val: risultati.valoreFinaleP90, label: 'Molto ottimistico', color: 'teal' },
                        { p: 95, val: risultati.valoreFinaleP95, label: 'Best case', color: 'cyan' },
                      ].map((row) => (
                        <tr key={row.p} className={`border-b border-gray-100 ${row.highlight ? 'bg-green-50' : ''}`}>
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center gap-2 ${
                              row.color === 'red' ? 'text-red-600' :
                              row.color === 'orange' ? 'text-orange-600' :
                              row.color === 'amber' ? 'text-amber-600' :
                              row.color === 'green' ? 'text-green-700 font-bold' :
                              row.color === 'emerald' ? 'text-emerald-600' :
                              row.color === 'teal' ? 'text-teal-600' :
                              'text-cyan-600'
                            }`}>
                              {row.p}%
                            </span>
                          </td>
                          <td className={`py-3 px-3 text-right font-semibold ${row.highlight ? 'text-forest' : ''}`}>
                            {formatCurrency(row.val)}
                          </td>
                          {mode === 'accumulo' && (
                            <td className={`py-3 px-3 text-right ${
                              row.val >= risultati.totaleVersato ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {row.val >= risultati.totaleVersato ? '+' : ''}{((row.val / risultati.totaleVersato - 1) * 100).toFixed(1)}%
                            </td>
                          )}
                          <td className="py-3 px-3 text-gray-500">{row.label}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Methodology Section */}
          <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-forest/10 rounded-xl">
                <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="font-heading text-2xl text-forest">Metodologia Monte Carlo</h2>
                <p className="text-gray-500 mt-1">Come funziona questa simulazione professionale</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-cream rounded-xl p-5">
                <h4 className="font-heading text-forest mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-forest text-white rounded-full flex items-center justify-center text-sm">1</span>
                  Generazione Scenari
                </h4>
                <p className="text-sm text-gray-600">
                  Utilizziamo la distribuzione normale (Box-Muller transform) per generare fino a 10.000
                  possibili percorsi di rendimento basati su media e deviazione standard storica.
                </p>
              </div>
              <div className="bg-cream rounded-xl p-5">
                <h4 className="font-heading text-forest mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-forest text-white rounded-full flex items-center justify-center text-sm">2</span>
                  Calcolo Percentili
                </h4>
                <p className="text-sm text-gray-600">
                  Per ogni anno ordiniamo i risultati e calcoliamo i percentili (5, 10, 25, 50, 75, 90, 95)
                  per mostrare la distribuzione delle probabilita.
                </p>
              </div>
              <div className="bg-cream rounded-xl p-5">
                <h4 className="font-heading text-forest mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-forest text-white rounded-full flex items-center justify-center text-sm">3</span>
                  Analisi FIRE
                </h4>
                <p className="text-sm text-gray-600">
                  In modalita decumulo, calcoliamo la probabilita che il patrimonio duri fino
                  all&apos;aspettativa di vita e il Safe Withdrawal Rate ottimale.
                </p>
              </div>
            </div>

            <div className="mt-8 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex gap-3">
                <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="font-semibold text-amber-800">Disclaimer Importante</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Questa simulazione si basa su assunzioni statistiche e rendimenti storici che non garantiscono risultati futuri.
                    I mercati finanziari sono imprevedibili e i rendimenti passati non sono indicativi di quelli futuri.
                    Consulta un consulente finanziario qualificato prima di prendere decisioni di investimento.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom py-8">
        <RatingWidget toolSlug="simulatore-monte-carlo" toolName="Simulatore Monte Carlo" />
      </div>

      {/* CTA */}
      <section className="section-sm bg-gradient-to-br from-forest to-green-700">
        <div className="container-custom text-center">
          <h2 className="font-heading text-3xl text-white mb-4">
            Vuoi una pianificazione finanziaria personalizzata?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente indipendente puo aiutarti a costruire un piano finanziario
            su misura per i tuoi obiettivi di vita e la tua tolleranza al rischio.
          </p>
          <Link href="/#contatti" className="inline-flex items-center gap-2 bg-white text-forest px-8 py-4 rounded-xl font-semibold hover:bg-green-50 transition-all shadow-lg">
            Richiedi Consulenza Gratuita
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
