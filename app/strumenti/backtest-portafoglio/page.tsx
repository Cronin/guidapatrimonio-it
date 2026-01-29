'use client'

import { useState, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget, ToolPageSchema} from '@/components'

// =============================================================================
// ASSET CLASS DATA - Rendimenti storici realistici basati su dati 1970-2024
// =============================================================================
const assetClassData = {
  azioniUSA: {
    rendimento: 10.2,
    volatilita: 15.3,
    label: 'Azioni USA (S&P 500)',
    color: '#2D6A4F',
    icon: ''
  },
  azioniEuropa: {
    rendimento: 7.5,
    volatilita: 14.8,
    label: 'Azioni Europa',
    color: '#40916C',
    icon: '🇪🇺'
  },
  azioniEmergenti: {
    rendimento: 8.5,
    volatilita: 22.5,
    label: 'Azioni Emergenti',
    color: '#52B788',
    icon: ''
  },
  obbligazioniGov: {
    rendimento: 3.2,
    volatilita: 5.5,
    label: 'Bond Governativi',
    color: '#1B4D3E',
    icon: ''
  },
  obbligazioniCorp: {
    rendimento: 4.5,
    volatilita: 7.2,
    label: 'Bond Corporate',
    color: '#2D5E4C',
    icon: ''
  },
  oro: {
    rendimento: 4.8,
    volatilita: 14.5,
    label: 'Oro',
    color: '#D4A373',
    icon: ''
  },
  reit: {
    rendimento: 7.8,
    volatilita: 18.2,
    label: 'Immobiliare/REIT',
    color: '#B08968',
    icon: ''
  },
  commodities: {
    rendimento: 3.5,
    volatilita: 18.0,
    label: 'Commodities',
    color: '#8B7355',
    icon: ''
  },
}

// Matrice di correlazione basata su dati storici
const correlazioni: Record<string, Record<string, number>> = {
  azioniUSA: { azioniUSA: 1, azioniEuropa: 0.82, azioniEmergenti: 0.72, obbligazioniGov: -0.25, obbligazioniCorp: 0.15, oro: 0.02, reit: 0.65, commodities: 0.35 },
  azioniEuropa: { azioniUSA: 0.82, azioniEuropa: 1, azioniEmergenti: 0.75, obbligazioniGov: -0.15, obbligazioniCorp: 0.18, oro: 0.05, reit: 0.58, commodities: 0.38 },
  azioniEmergenti: { azioniUSA: 0.72, azioniEuropa: 0.75, azioniEmergenti: 1, obbligazioniGov: -0.12, obbligazioniCorp: 0.20, oro: 0.12, reit: 0.52, commodities: 0.45 },
  obbligazioniGov: { azioniUSA: -0.25, azioniEuropa: -0.15, azioniEmergenti: -0.12, obbligazioniGov: 1, obbligazioniCorp: 0.72, oro: 0.28, reit: 0.08, commodities: -0.05 },
  obbligazioniCorp: { azioniUSA: 0.15, azioniEuropa: 0.18, azioniEmergenti: 0.20, obbligazioniGov: 0.72, obbligazioniCorp: 1, oro: 0.12, reit: 0.22, commodities: 0.15 },
  oro: { azioniUSA: 0.02, azioniEuropa: 0.05, azioniEmergenti: 0.12, obbligazioniGov: 0.28, obbligazioniCorp: 0.12, oro: 1, reit: 0.08, commodities: 0.35 },
  reit: { azioniUSA: 0.65, azioniEuropa: 0.58, azioniEmergenti: 0.52, obbligazioniGov: 0.08, obbligazioniCorp: 0.22, oro: 0.08, reit: 1, commodities: 0.28 },
  commodities: { azioniUSA: 0.35, azioniEuropa: 0.38, azioniEmergenti: 0.45, obbligazioniGov: -0.05, obbligazioniCorp: 0.15, oro: 0.35, commodities: 1, reit: 0.28 },
}

// =============================================================================
// PRESET PORTAFOGLI
// =============================================================================
const presetPortafogli = {
  aggressivo: {
    nome: 'Aggressivo',
    descrizione: '100% Azioni - Massimo rischio/rendimento',
    allocazione: { azioniUSA: 50, azioniEuropa: 25, azioniEmergenti: 25, obbligazioniGov: 0, obbligazioniCorp: 0, oro: 0, reit: 0, commodities: 0 },
    color: '#EF4444',
  },
  crescita: {
    nome: 'Crescita',
    descrizione: '80/20 - Alta esposizione azionaria',
    allocazione: { azioniUSA: 40, azioniEuropa: 20, azioniEmergenti: 20, obbligazioniGov: 10, obbligazioniCorp: 5, oro: 5, reit: 0, commodities: 0 },
    color: '#F59E0B',
  },
  bilanciato: {
    nome: 'Bilanciato',
    descrizione: '60/40 - Classico equilibrio',
    allocazione: { azioniUSA: 30, azioniEuropa: 15, azioniEmergenti: 15, obbligazioniGov: 20, obbligazioniCorp: 10, oro: 5, reit: 5, commodities: 0 },
    color: '#10B981',
  },
  conservativo: {
    nome: 'Conservativo',
    descrizione: '30/70 - Priorita alla stabilita',
    allocazione: { azioniUSA: 15, azioniEuropa: 10, azioniEmergenti: 5, obbligazioniGov: 40, obbligazioniCorp: 20, oro: 5, reit: 5, commodities: 0 },
    color: '#3B82F6',
  },
  difensivo: {
    nome: 'Difensivo',
    descrizione: '10/90 - Minimo rischio',
    allocazione: { azioniUSA: 5, azioniEuropa: 5, azioniEmergenti: 0, obbligazioniGov: 50, obbligazioniCorp: 25, oro: 10, reit: 5, commodities: 0 },
    color: '#6366F1',
  },
  allWeather: {
    nome: 'All Weather',
    descrizione: 'Stile Ray Dalio - Tutte le stagioni',
    allocazione: { azioniUSA: 20, azioniEuropa: 10, azioniEmergenti: 0, obbligazioniGov: 40, obbligazioniCorp: 0, oro: 15, reit: 0, commodities: 15 },
    color: '#8B5CF6',
  },
}

// Benchmark per confronto
const benchmarks = {
  sp500: {
    nome: '100% S&P 500',
    allocazione: { azioniUSA: 100, azioniEuropa: 0, azioniEmergenti: 0, obbligazioniGov: 0, obbligazioniCorp: 0, oro: 0, reit: 0, commodities: 0 },
    color: '#2563EB',
  },
  classico6040: {
    nome: '60/40 Tradizionale',
    allocazione: { azioniUSA: 40, azioniEuropa: 20, azioniEmergenti: 0, obbligazioniGov: 30, obbligazioniCorp: 10, oro: 0, reit: 0, commodities: 0 },
    color: '#D97706',
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
  commodities: number
}

interface YearData {
  anno: number
  valore: number
  rendimento: number
  drawdown: number
  drawdownFromPeak: number
}

interface MetrichePortafoglio {
  cagr: number
  volatilita: number
  sharpeRatio: number
  sortinoRatio: number
  maxDrawdown: number
  maxDrawdownDuration: number
  bestYear: number
  worstYear: number
  valoreFinale: number
  rendimentoTotale: number
  crescitaAnnuale: YearData[]
  anniPositivi: number
  anniNegativi: number
  rendimentoMedioPositivo: number
  rendimentoMedioNegativo: number
  var95: number // Value at Risk 95%
  rollingReturns3y: number[]
  rollingReturns5y: number[]
}

// =============================================================================
// FUNZIONE SIMULAZIONE MONTE CARLO
// =============================================================================
function simulaPortafoglio(
  allocazione: Allocazione,
  capitaleIniziale: number,
  versamentoAnnuale: number,
  anni: number,
  seed: number = 42
): MetrichePortafoglio {
  const keys = Object.keys(allocazione) as (keyof Allocazione)[]

  // Calcola rendimento medio pesato
  let rendimentoMedio = 0
  keys.forEach(key => {
    const peso = allocazione[key] / 100
    if (assetClassData[key]) {
      rendimentoMedio += peso * assetClassData[key].rendimento
    }
  })

  // Calcola volatilita del portafoglio (con correlazioni)
  let varianza = 0
  keys.forEach(key1 => {
    keys.forEach(key2 => {
      const peso1 = allocazione[key1] / 100
      const peso2 = allocazione[key2] / 100
      const asset1 = assetClassData[key1]
      const asset2 = assetClassData[key2]
      if (asset1 && asset2 && correlazioni[key1] && correlazioni[key1][key2] !== undefined) {
        const vol1 = asset1.volatilita / 100
        const vol2 = asset2.volatilita / 100
        const corr = correlazioni[key1][key2]
        varianza += peso1 * peso2 * vol1 * vol2 * corr
      }
    })
  })
  const volatilita = Math.sqrt(varianza) * 100

  // Generatore numeri pseudo-random con seed
  const random = seedRandom(seed)

  // Simula rendimenti annuali con distribuzione normale
  const rendimentiAnnuali: number[] = []
  for (let i = 0; i < anni; i++) {
    // Box-Muller transform per generare numeri normali
    const u1 = random()
    const u2 = random()
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    const rendimentoAnno = rendimentoMedio + volatilita * z
    rendimentiAnnuali.push(rendimentoAnno)
  }

  // Calcola crescita del capitale
  const crescitaAnnuale: YearData[] = []
  let valoreCorrente = capitaleIniziale
  let piccoMassimo = capitaleIniziale
  let maxDrawdown = 0
  let currentDrawdownStart = 0
  let maxDrawdownDuration = 0
  let currentDrawdownDuration = 0
  let anniPositivi = 0
  let anniNegativi = 0
  let sommaRendimentiPositivi = 0
  let sommaRendimentiNegativi = 0
  let sommaRendimentiNegativiQuadrati = 0

  crescitaAnnuale.push({
    anno: 0,
    valore: capitaleIniziale,
    rendimento: 0,
    drawdown: 0,
    drawdownFromPeak: 0,
  })

  for (let anno = 1; anno <= anni; anno++) {
    const rendimento = rendimentiAnnuali[anno - 1]

    // Applica rendimento
    valoreCorrente = valoreCorrente * (1 + rendimento / 100)

    // Aggiungi versamento annuale (fine anno)
    valoreCorrente += versamentoAnnuale

    // Calcola drawdown
    if (valoreCorrente > piccoMassimo) {
      piccoMassimo = valoreCorrente
      currentDrawdownDuration = 0
    } else {
      currentDrawdownDuration++
    }

    const drawdownFromPeak = ((piccoMassimo - valoreCorrente) / piccoMassimo) * 100
    if (drawdownFromPeak > maxDrawdown) {
      maxDrawdown = drawdownFromPeak
    }
    if (currentDrawdownDuration > maxDrawdownDuration) {
      maxDrawdownDuration = currentDrawdownDuration
    }

    // Statistiche anni positivi/negativi
    if (rendimento >= 0) {
      anniPositivi++
      sommaRendimentiPositivi += rendimento
    } else {
      anniNegativi++
      sommaRendimentiNegativi += rendimento
      sommaRendimentiNegativiQuadrati += rendimento * rendimento
    }

    crescitaAnnuale.push({
      anno,
      valore: valoreCorrente,
      rendimento,
      drawdown: drawdownFromPeak,
      drawdownFromPeak,
    })
  }

  // Calcola CAGR reale basato sulla simulazione
  const totaleVersato = capitaleIniziale + versamentoAnnuale * anni
  const cagr = ((Math.pow(valoreCorrente / capitaleIniziale, 1 / anni) - 1) * 100)

  // Sharpe Ratio (risk-free rate 2.5%)
  const riskFreeRate = 2.5
  const sharpeRatio = volatilita > 0 ? (rendimentoMedio - riskFreeRate) / volatilita : 0

  // Sortino Ratio (usa solo volatilita negativa)
  const downsideDeviation = anniNegativi > 0
    ? Math.sqrt(sommaRendimentiNegativiQuadrati / anniNegativi)
    : volatilita
  const sortinoRatio = downsideDeviation > 0 ? (rendimentoMedio - riskFreeRate) / downsideDeviation : 0

  // Best/Worst year
  const bestYear = Math.max(...rendimentiAnnuali)
  const worstYear = Math.min(...rendimentiAnnuali)

  // VaR 95% (approssimazione parametrica)
  const var95 = -(rendimentoMedio - 1.645 * volatilita)

  // Rolling returns
  const rollingReturns3y: number[] = []
  const rollingReturns5y: number[] = []

  for (let i = 3; i <= anni; i++) {
    const start = crescitaAnnuale[i - 3].valore
    const end = crescitaAnnuale[i].valore
    const rolling = (Math.pow(end / start, 1 / 3) - 1) * 100
    rollingReturns3y.push(rolling)
  }

  for (let i = 5; i <= anni; i++) {
    const start = crescitaAnnuale[i - 5].valore
    const end = crescitaAnnuale[i].valore
    const rolling = (Math.pow(end / start, 1 / 5) - 1) * 100
    rollingReturns5y.push(rolling)
  }

  return {
    cagr,
    volatilita,
    sharpeRatio,
    sortinoRatio,
    maxDrawdown,
    maxDrawdownDuration,
    bestYear,
    worstYear,
    valoreFinale: valoreCorrente,
    rendimentoTotale: ((valoreCorrente - totaleVersato) / totaleVersato) * 100,
    crescitaAnnuale,
    anniPositivi,
    anniNegativi,
    rendimentoMedioPositivo: anniPositivi > 0 ? sommaRendimentiPositivi / anniPositivi : 0,
    rendimentoMedioNegativo: anniNegativi > 0 ? sommaRendimentiNegativi / anniNegativi : 0,
    var95,
    rollingReturns3y,
    rollingReturns5y,
  }
}

// Generatore pseudo-random con seed
function seedRandom(seed: number) {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
}

// =============================================================================
// COMPONENTI UI
// =============================================================================

function MetricCard({
  label,
  value,
  subtext,
  variant = 'default',
  tooltip,
  large = false,
}: {
  label: string
  value: string | number
  subtext?: string
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'primary'
  tooltip?: string
  large?: boolean
}) {
  const variantStyles = {
    default: 'bg-white border-gray-200',
    success: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200',
    danger: 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200',
    warning: 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200',
    primary: 'bg-gradient-to-br from-forest to-green-800 border-green-700 text-white',
  }

  const textStyles = {
    default: 'text-forest',
    success: 'text-green-700',
    danger: 'text-red-600',
    warning: 'text-amber-700',
    primary: 'text-white',
  }

  const subtextStyles = {
    default: 'text-gray-500',
    success: 'text-green-600',
    danger: 'text-red-500',
    warning: 'text-amber-600',
    primary: 'text-green-100',
  }

  return (
    <div
      className={`rounded-xl border ${variantStyles[variant]} p-4 ${large ? 'p-6' : 'p-4'} shadow-sm hover:shadow-md transition-shadow relative group`}
    >
      {tooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
          {tooltip}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
        </div>
      )}
      <p className={`text-xs font-medium uppercase tracking-wide ${variant === 'primary' ? 'text-green-200' : 'text-gray-500'} mb-1`}>
        {label}
      </p>
      <p className={`font-heading ${large ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'} ${textStyles[variant]}`}>
        {value}
      </p>
      {subtext && (
        <p className={`text-xs mt-1 ${subtextStyles[variant]}`}>
          {subtext}
        </p>
      )}
    </div>
  )
}

function ProgressBar({
  value,
  max = 100,
  color = '#2D6A4F',
  showValue = true,
  height = 'h-2'
}: {
  value: number
  max?: number
  color?: string
  showValue?: boolean
  height?: string
}) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 bg-gray-200 rounded-full ${height} overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-500`}
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
      {showValue && (
        <span className="text-sm font-medium text-gray-600 w-12 text-right">
          {value.toFixed(0)}%
        </span>
      )}
    </div>
  )
}

// =============================================================================
// COMPONENTE PRINCIPALE
// =============================================================================
export default function BacktestPortafoglio() {
  const [allocazione, setAllocazione] = useState<Allocazione>({
    azioniUSA: 30,
    azioniEuropa: 15,
    azioniEmergenti: 10,
    obbligazioniGov: 20,
    obbligazioniCorp: 10,
    oro: 5,
    reit: 5,
    commodities: 5,
  })

  const [capitaleIniziale, setCapitaleIniziale] = useState(100000)
  const [versamentoAnnuale, setVersamentoAnnuale] = useState(5000)
  const [periodoBacktest, setPeriodoBacktest] = useState(20)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeTab, setActiveTab] = useState<'crescita' | 'drawdown' | 'rolling'>('crescita')
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [ribilanciamentoAnnuale, setRibilanciamentoAnnuale] = useState(true)

  const totaleAllocazione = Object.values(allocazione).reduce((sum, val) => sum + val, 0)
  const isValidAllocazione = totaleAllocazione === 100

  const handleAllocazioneChange = useCallback((key: keyof Allocazione, value: number) => {
    setSelectedPreset(null) // Reset preset quando si modifica manualmente
    setAllocazione(prev => ({ ...prev, [key]: value }))
  }, [])

  const applyPreset = useCallback((presetKey: string) => {
    const preset = presetPortafogli[presetKey as keyof typeof presetPortafogli]
    if (preset) {
      setAllocazione(preset.allocazione)
      setSelectedPreset(presetKey)
    }
  }, [])

  // Calcola metriche per tutti i portafogli
  const metriche = useMemo(() => {
    if (!isValidAllocazione) return null
    return simulaPortafoglio(allocazione, capitaleIniziale, versamentoAnnuale, periodoBacktest, 42)
  }, [allocazione, capitaleIniziale, versamentoAnnuale, periodoBacktest, isValidAllocazione])

  const metricheSP500 = useMemo(() => {
    return simulaPortafoglio(benchmarks.sp500.allocazione, capitaleIniziale, versamentoAnnuale, periodoBacktest, 42)
  }, [capitaleIniziale, versamentoAnnuale, periodoBacktest])

  const metriche6040 = useMemo(() => {
    return simulaPortafoglio(benchmarks.classico6040.allocazione, capitaleIniziale, versamentoAnnuale, periodoBacktest, 42)
  }, [capitaleIniziale, versamentoAnnuale, periodoBacktest])

  // Formatting helpers
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        notation: 'compact',
        compactDisplay: 'short',
      }).format(value)
    }
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatCurrencyFull = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number, decimals: number = 1, showPlus: boolean = true) => {
    const prefix = showPlus && value >= 0 ? '+' : ''
    return `${prefix}${value.toFixed(decimals)}%`
  }

  // Trova il valore massimo per il grafico
  const maxValoreGrafico = useMemo(() => {
    if (!metriche) return metricheSP500.valoreFinale
    const allValues = [
      ...metriche.crescitaAnnuale.map(d => d.valore),
      ...metricheSP500.crescitaAnnuale.map(d => d.valore),
      ...metriche6040.crescitaAnnuale.map(d => d.valore),
    ]
    return Math.max(...allValues) * 1.1
  }, [metriche, metricheSP500, metriche6040])

  // Calcola composizione visiva del portafoglio
  const composizioneVisiva = useMemo(() => {
    const keys = Object.keys(allocazione) as (keyof Allocazione)[]
    return keys
      .filter(key => allocazione[key] > 0 && assetClassData[key])
      .sort((a, b) => allocazione[b] - allocazione[a])
      .map(key => ({
        key,
        value: allocazione[key],
        ...assetClassData[key],
      }))
  }, [allocazione])

  return (
    <main className="bg-gray-50 min-h-screen">
      <ToolPageSchema slug="backtest-portafoglio" />
      <Navbar />

      {/* Hero Section - Bloomberg Style */}
      <section className="bg-forest pt-navbar relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container-custom py-10 md:py-14 relative">
          <Link href="/strumenti" className="inline-flex items-center text-green-300 hover:text-white mb-4 transition-colors text-sm">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tutti gli strumenti
          </Link>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-500/20 text-green-300 text-xs font-medium px-3 py-1 rounded-full border border-green-500/30">
                  PROFESSIONALE
                </span>
                <span className="text-green-400/60 text-xs">v2.0</span>
              </div>
              <h1 className="font-heading text-[32px] md:text-[42px] text-white leading-tight">
                Backtest Portafoglio
              </h1>
              <p className="text-white/60 mt-2 max-w-xl text-sm md:text-base">
                Simula i rendimenti storici del tuo portafoglio con Monte Carlo.
                Confronta allocazioni diverse e analizza metriche professionali.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/10">
              <p className="text-green-300 text-xs font-medium mb-1">ALTERNATIVA GRATUITA A</p>
              <p className="text-white font-heading text-lg">Portfolio Visualizer</p>
              <p className="text-green-400/60 text-xs">Valore: $360/anno</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container-custom">
          <div className="grid lg:grid-cols-12 gap-6 lg:gap-8">

            {/* Left Column - Input */}
            <div className="lg:col-span-5 space-y-6">

              {/* Preset Portafogli */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-lg text-forest">Preset Rapidi</h2>
                  <span className="text-xs text-gray-400">Clicca per applicare</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {Object.entries(presetPortafogli).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => applyPreset(key)}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        selectedPreset === key
                          ? 'border-green-500 bg-green-50 shadow-sm'
                          : 'border-gray-100 hover:border-green-200 hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className="w-3 h-3 rounded-full mb-2"
                        style={{ backgroundColor: preset.color }}
                      />
                      <p className={`text-sm font-medium ${
                        selectedPreset === key ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {preset.nome}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                        {preset.descrizione}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Orizzonte Temporale */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="font-heading text-lg text-forest mb-4">Orizzonte Temporale</h2>
                <div className="grid grid-cols-5 gap-2">
                  {[10, 15, 20, 30, 40].map((anni) => (
                    <button
                      key={anni}
                      onClick={() => setPeriodoBacktest(anni)}
                      className={`py-3 rounded-xl border-2 transition-all text-center ${
                        periodoBacktest === anni
                          ? 'border-green-500 bg-green-50 shadow-sm'
                          : 'border-gray-100 hover:border-green-200'
                      }`}
                    >
                      <span className={`block font-heading text-lg ${
                        periodoBacktest === anni ? 'text-green-700' : 'text-gray-700'
                      }`}>
                        {anni}
                      </span>
                      <span className="text-xs text-gray-400">anni</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Allocazione Asset */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-heading text-lg text-forest">Allocazione Asset</h2>
                  <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    isValidAllocazione
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {totaleAllocazione}% / 100%
                  </div>
                </div>

                {!isValidAllocazione && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                    {totaleAllocazione < 100
                      ? `Aggiungi ancora ${100 - totaleAllocazione}% per completare l'allocazione`
                      : `Riduci l'allocazione di ${totaleAllocazione - 100}%`
                    }
                  </div>
                )}

                {/* Composizione visiva */}
                <div className="mb-5">
                  <div className="h-4 rounded-full overflow-hidden flex bg-gray-100">
                    {composizioneVisiva.map((asset, idx) => (
                      <div
                        key={asset.key}
                        className="h-full transition-all duration-300"
                        style={{
                          width: `${asset.value}%`,
                          backgroundColor: asset.color,
                        }}
                        title={`${asset.label}: ${asset.value}%`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
                    {composizioneVisiva.map(asset => (
                      <div key={asset.key} className="flex items-center gap-1.5 text-xs text-gray-600">
                        <span
                          className="w-2.5 h-2.5 rounded-sm"
                          style={{ backgroundColor: asset.color }}
                        />
                        <span>{asset.label}</span>
                        <span className="text-gray-400">({asset.value}%)</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-4">
                  {(Object.keys(assetClassData) as (keyof typeof assetClassData)[]).map((key) => {
                    const asset = assetClassData[key]
                    const value = allocazione[key] || 0
                    return (
                      <div key={key} className="group">
                        <div className="flex justify-between items-center mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{asset.icon}</span>
                            <label className="text-sm font-medium text-gray-700">
                              {asset.label}
                            </label>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              {asset.rendimento}% / {asset.volatilita}%
                            </span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={value}
                              onChange={(e) => handleAllocazioneChange(key, Math.min(100, Math.max(0, Number(e.target.value))))}
                              className="w-14 text-right text-sm font-medium text-forest bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                            />
                          </div>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={value}
                          onChange={(e) => handleAllocazioneChange(key, Number(e.target.value))}
                          className="w-full h-1.5 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-600"
                          style={{
                            background: `linear-gradient(to right, ${asset.color} 0%, ${asset.color} ${value}%, #e5e7eb ${value}%, #e5e7eb 100%)`
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Parametri Backtest */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <h2 className="font-heading text-lg text-forest mb-5">Parametri Simulazione</h2>

                <div className="space-y-6">
                  {/* Capitale Iniziale */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Capitale iniziale
                      </label>
                      <span className="text-lg font-heading text-forest">
                        {formatCurrencyFull(capitaleIniziale)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="2000000"
                      step="10000"
                      value={capitaleIniziale}
                      onChange={(e) => setCapitaleIniziale(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>10K</span>
                      <span>2M</span>
                    </div>
                  </div>

                  {/* Versamento Annuale */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-gray-700">
                        Versamento annuale (PAC)
                      </label>
                      <span className="text-lg font-heading text-forest">
                        {formatCurrencyFull(versamentoAnnuale)}
                      </span>
                    </div>
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
                      <span>0</span>
                      <span>50K/anno</span>
                    </div>
                  </div>

                  {/* Toggle Ribilanciamento */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Ribilanciamento annuale</span>
                      <p className="text-xs text-gray-400 mt-0.5">Riporta l&apos;allocazione ai pesi target</p>
                    </div>
                    <button
                      onClick={() => setRibilanciamentoAnnuale(!ribilanciamentoAnnuale)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${
                        ribilanciamentoAnnuale ? 'bg-green-500' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                          ribilanciamentoAnnuale ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Results */}
            <div className="lg:col-span-7 space-y-6">
              {metriche && isValidAllocazione ? (
                <>
                  {/* KPI Cards Row 1 */}
                  <div className="grid grid-cols-2 gap-4">
                    <MetricCard
                      label="Valore Finale"
                      value={formatCurrencyFull(metriche.valoreFinale)}
                      subtext={`Dopo ${periodoBacktest} anni`}
                      variant="primary"
                      large
                    />
                    <MetricCard
                      label="CAGR"
                      value={formatPercent(metriche.cagr, 2)}
                      subtext="Rendimento annuo composto"
                      variant="success"
                      tooltip="Compound Annual Growth Rate - Tasso di crescita annuo composto"
                      large
                    />
                  </div>

                  {/* KPI Cards Row 2 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <MetricCard
                      label="Volatilita"
                      value={`${metriche.volatilita.toFixed(1)}%`}
                      subtext="Rischio annualizzato"
                      tooltip="Deviazione standard annualizzata dei rendimenti"
                    />
                    <MetricCard
                      label="Sharpe Ratio"
                      value={metriche.sharpeRatio.toFixed(2)}
                      subtext={metriche.sharpeRatio >= 1 ? 'Buono' : metriche.sharpeRatio >= 0.5 ? 'Discreto' : 'Basso'}
                      variant={metriche.sharpeRatio >= 1 ? 'success' : 'default'}
                      tooltip="Rendimento per unita di rischio. >1 = buono, >2 = eccellente"
                    />
                    <MetricCard
                      label="Sortino Ratio"
                      value={metriche.sortinoRatio.toFixed(2)}
                      subtext="Risk-adjusted (downside)"
                      tooltip="Come Sharpe ma considera solo volatilita negativa"
                    />
                    <MetricCard
                      label="Max Drawdown"
                      value={`-${metriche.maxDrawdown.toFixed(1)}%`}
                      subtext={`${metriche.maxDrawdownDuration} anni recovery`}
                      variant="danger"
                      tooltip="Massima perdita dal picco al minimo"
                    />
                  </div>

                  {/* KPI Cards Row 3 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <MetricCard
                      label="Best Year"
                      value={formatPercent(metriche.bestYear)}
                      variant="success"
                    />
                    <MetricCard
                      label="Worst Year"
                      value={formatPercent(metriche.worstYear)}
                      variant="danger"
                    />
                    <MetricCard
                      label="Anni Positivi"
                      value={`${metriche.anniPositivi}/${periodoBacktest}`}
                      subtext={`Media: ${formatPercent(metriche.rendimentoMedioPositivo)}`}
                    />
                    <MetricCard
                      label="VaR 95%"
                      value={`-${metriche.var95.toFixed(1)}%`}
                      subtext="Perdita massima attesa (95%)"
                      variant="warning"
                      tooltip="Value at Risk: perdita massima attesa nel 95% dei casi"
                    />
                  </div>

                  {/* Chart Tabs */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="border-b border-gray-100">
                      <div className="flex">
                        {[
                          { id: 'crescita', label: 'Crescita Capitale', icon: '' },
                          { id: 'drawdown', label: 'Drawdown', icon: '' },
                          { id: 'rolling', label: 'Rolling Returns', icon: '' },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`flex-1 px-4 py-3.5 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                              activeTab === tab.id
                                ? 'text-forest border-b-2 border-forest bg-green-50/50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span>{tab.icon}</span>
                            <span className="hidden sm:inline">{tab.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-5">
                      {/* Crescita Chart */}
                      {activeTab === 'crescita' && (
                        <div>
                          <div className="h-72 md:h-80 flex items-end gap-[2px] relative overflow-hidden">
                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400 -ml-2 w-16 text-right">
                              <span>{formatCurrency(maxValoreGrafico)}</span>
                              <span>{formatCurrency(maxValoreGrafico / 2)}</span>
                              <span>{formatCurrency(capitaleIniziale)}</span>
                            </div>

                            {/* Chart area */}
                            <div className="flex-1 ml-16 h-full flex items-end gap-[2px] relative">
                              {/* Grid lines */}
                              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                                {[0, 1, 2].map(i => (
                                  <div key={i} className="border-t border-gray-100 border-dashed" />
                                ))}
                              </div>

                              {metriche.crescitaAnnuale
                                .filter((_, i) => i % Math.max(1, Math.ceil(periodoBacktest / 20)) === 0 || i === periodoBacktest)
                                .map((dato, idx, arr) => {
                                  const sp500Valore = metricheSP500.crescitaAnnuale[dato.anno]?.valore || 0
                                  const valore6040 = metriche6040.crescitaAnnuale[dato.anno]?.valore || 0
                                  const barWidth = `${100 / arr.length - 1}%`

                                  return (
                                    <div
                                      key={idx}
                                      className="flex-1 flex flex-col items-center gap-1 group relative"
                                      style={{ minWidth: '20px' }}
                                    >
                                      {/* Tooltip */}
                                      <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 shadow-lg pointer-events-none">
                                        <div className="font-medium mb-1">Anno {dato.anno}</div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                          <span className="w-2 h-2 rounded-full bg-green-500" />
                                          <span>Tuo: {formatCurrencyFull(dato.valore)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                          <span className="w-2 h-2 rounded-full bg-green-500" />
                                          <span>S&P500: {formatCurrencyFull(sp500Valore)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                                          <span>60/40: {formatCurrencyFull(valore6040)}</span>
                                        </div>
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900" />
                                      </div>

                                      {/* Bars */}
                                      <div className="w-full flex gap-[1px] items-end h-64">
                                        <div
                                          className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all duration-300 hover:from-green-500 hover:to-green-300"
                                          style={{ height: `${Math.max(4, (dato.valore / maxValoreGrafico) * 100)}%` }}
                                        />
                                        <div
                                          className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t transition-all duration-300"
                                          style={{ height: `${Math.max(4, (sp500Valore / maxValoreGrafico) * 100)}%` }}
                                        />
                                        <div
                                          className="flex-1 bg-gradient-to-t from-amber-500 to-amber-300 rounded-t transition-all duration-300"
                                          style={{ height: `${Math.max(4, (valore6040 / maxValoreGrafico) * 100)}%` }}
                                        />
                                      </div>
                                      <span className="text-[10px] text-gray-400">{dato.anno}</span>
                                    </div>
                                  )
                                })}
                            </div>
                          </div>

                          {/* Legend */}
                          <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded bg-gradient-to-t from-green-600 to-green-400" />
                              <span className="text-sm text-gray-600">Il Tuo Portafoglio</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded bg-gradient-to-t from-green-600 to-green-400" />
                              <span className="text-sm text-gray-600">100% S&P 500</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-3 h-3 rounded bg-gradient-to-t from-amber-500 to-amber-300" />
                              <span className="text-sm text-gray-600">60/40 Classico</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Drawdown Chart */}
                      {activeTab === 'drawdown' && (
                        <div>
                          <div className="h-72 md:h-80 relative">
                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400 -ml-2 w-12 text-right">
                              <span>0%</span>
                              <span>-15%</span>
                              <span>-30%</span>
                              <span>-45%</span>
                            </div>

                            {/* Chart area */}
                            <div className="ml-14 h-full relative">
                              {/* Baseline */}
                              <div className="absolute top-0 left-0 right-0 h-px bg-gray-300" />

                              {/* Danger zones */}
                              <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-transparent to-amber-50" />
                              <div className="absolute top-1/3 left-0 right-0 h-1/3 bg-gradient-to-b from-amber-50 to-red-50" />
                              <div className="absolute top-2/3 left-0 right-0 h-1/3 bg-gradient-to-b from-red-50 to-red-100" />

                              {/* Drawdown line */}
                              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.1" />
                                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.4" />
                                  </linearGradient>
                                </defs>

                                {/* Area fill */}
                                <path
                                  d={`
                                    M 0,0
                                    ${metriche.crescitaAnnuale.map((d, i) =>
                                      `L ${(i / periodoBacktest) * 100},${(d.drawdownFromPeak / 45) * 100}`
                                    ).join(' ')}
                                    L 100,0 Z
                                  `}
                                  fill="url(#drawdownGradient)"
                                />

                                {/* Line */}
                                <path
                                  d={`
                                    M 0,0
                                    ${metriche.crescitaAnnuale.map((d, i) =>
                                      `L ${(i / periodoBacktest) * 100},${(d.drawdownFromPeak / 45) * 100}`
                                    ).join(' ')}
                                  `}
                                  fill="none"
                                  stroke="#EF4444"
                                  strokeWidth="2"
                                  vectorEffect="non-scaling-stroke"
                                />
                              </svg>

                              {/* Max drawdown marker */}
                              <div
                                className="absolute bg-red-500 text-white text-xs px-2 py-1 rounded shadow-lg"
                                style={{
                                  top: `${(metriche.maxDrawdown / 45) * 100}%`,
                                  left: '50%',
                                  transform: 'translate(-50%, -100%)'
                                }}
                              >
                                Max DD: -{metriche.maxDrawdown.toFixed(1)}%
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Max Drawdown</p>
                                <p className="text-lg font-heading text-red-600">-{metriche.maxDrawdown.toFixed(1)}%</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Durata Recovery</p>
                                <p className="text-lg font-heading text-gray-700">{metriche.maxDrawdownDuration} anni</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Anni Negativi</p>
                                <p className="text-lg font-heading text-gray-700">{metriche.anniNegativi}/{periodoBacktest}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Rolling Returns Chart */}
                      {activeTab === 'rolling' && (
                        <div>
                          <div className="h-72 md:h-80 relative">
                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400 -ml-2 w-12 text-right">
                              <span>+20%</span>
                              <span>+10%</span>
                              <span>0%</span>
                              <span>-10%</span>
                            </div>

                            {/* Chart area */}
                            <div className="ml-14 h-full relative">
                              {/* Zero line */}
                              <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-300" />

                              {/* Rolling returns bars */}
                              <div className="flex items-center h-full gap-1">
                                {metriche.rollingReturns3y.map((ret, idx) => {
                                  const isPositive = ret >= 0
                                  const height = Math.min(Math.abs(ret) / 20 * 50, 50)

                                  return (
                                    <div
                                      key={idx}
                                      className="flex-1 flex flex-col items-center justify-center h-full relative group"
                                    >
                                      {/* Tooltip */}
                                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                        Anno {idx + 3}: {formatPercent(ret)}
                                      </div>

                                      <div
                                        className={`w-full rounded transition-all ${
                                          isPositive
                                            ? 'bg-gradient-to-t from-green-500 to-green-400'
                                            : 'bg-gradient-to-b from-red-500 to-red-400'
                                        }`}
                                        style={{
                                          height: `${height}%`,
                                          marginTop: isPositive ? 'auto' : 0,
                                          marginBottom: isPositive ? 0 : 'auto',
                                          transform: `translateY(${isPositive ? '-50%' : '50%'})`
                                        }}
                                      />
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="grid grid-cols-4 gap-4 text-center">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Rolling 3Y Min</p>
                                <p className="text-lg font-heading text-red-600">
                                  {formatPercent(Math.min(...metriche.rollingReturns3y))}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Rolling 3Y Max</p>
                                <p className="text-lg font-heading text-green-600">
                                  {formatPercent(Math.max(...metriche.rollingReturns3y))}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Rolling 3Y Avg</p>
                                <p className="text-lg font-heading text-gray-700">
                                  {formatPercent(metriche.rollingReturns3y.reduce((a, b) => a + b, 0) / metriche.rollingReturns3y.length)}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">% Periodi Positivi</p>
                                <p className="text-lg font-heading text-gray-700">
                                  {((metriche.rollingReturns3y.filter(r => r > 0).length / metriche.rollingReturns3y.length) * 100).toFixed(0)}%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comparison Table */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-5 border-b border-gray-100">
                      <h3 className="font-heading text-lg text-forest">Confronto con Benchmark</h3>
                      <p className="text-sm text-gray-500 mt-1">Analisi comparativa delle performance</p>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left py-3 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Metrica</th>
                            <th className="text-right py-3 px-5 text-xs font-semibold uppercase tracking-wider text-green-600 bg-green-50">
                              <div className="flex items-center justify-end gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                Tuo Portafoglio
                              </div>
                            </th>
                            <th className="text-right py-3 px-5 text-xs font-semibold text-green-600 uppercase tracking-wider">
                              <div className="flex items-center justify-end gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500" />
                                S&P 500
                              </div>
                            </th>
                            <th className="text-right py-3 px-5 text-xs font-semibold text-amber-600 uppercase tracking-wider">
                              <div className="flex items-center justify-end gap-2">
                                <span className="w-2 h-2 rounded-full bg-amber-500" />
                                60/40
                              </div>
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {[
                            { label: 'CAGR', key: 'cagr', format: (v: number) => formatPercent(v, 2), higher: true },
                            { label: 'Volatilita', key: 'volatilita', format: (v: number) => `${v.toFixed(1)}%`, higher: false },
                            { label: 'Sharpe Ratio', key: 'sharpeRatio', format: (v: number) => v.toFixed(2), higher: true },
                            { label: 'Sortino Ratio', key: 'sortinoRatio', format: (v: number) => v.toFixed(2), higher: true },
                            { label: 'Max Drawdown', key: 'maxDrawdown', format: (v: number) => `-${v.toFixed(1)}%`, higher: false },
                            { label: 'Best Year', key: 'bestYear', format: (v: number) => formatPercent(v), higher: true },
                            { label: 'Worst Year', key: 'worstYear', format: (v: number) => formatPercent(v), higher: true },
                            { label: 'Valore Finale', key: 'valoreFinale', format: (v: number) => formatCurrencyFull(v), higher: true },
                          ].map((row) => {
                            const values = [
                              metriche[row.key as keyof MetrichePortafoglio] as number,
                              metricheSP500[row.key as keyof MetrichePortafoglio] as number,
                              metriche6040[row.key as keyof MetrichePortafoglio] as number,
                            ]

                            // Determine best value
                            const bestIdx = row.higher
                              ? values.indexOf(Math.max(...values))
                              : values.indexOf(Math.min(...values))

                            return (
                              <tr key={row.key} className="hover:bg-gray-50">
                                <td className="py-3.5 px-5 text-sm text-gray-700 font-medium">{row.label}</td>
                                <td className={`py-3.5 px-5 text-right font-medium bg-green-50/50 ${
                                  bestIdx === 0 ? 'text-green-600' : 'text-gray-600'
                                }`}>
                                  <div className="flex items-center justify-end gap-2">
                                    {bestIdx === 0 && <span className="text-green-500">★</span>}
                                    {row.format(values[0])}
                                  </div>
                                </td>
                                <td className={`py-3.5 px-5 text-right ${
                                  bestIdx === 1 ? 'text-green-600 font-medium' : 'text-gray-600'
                                }`}>
                                  <div className="flex items-center justify-end gap-2">
                                    {bestIdx === 1 && <span className="text-green-500">★</span>}
                                    {row.format(values[1])}
                                  </div>
                                </td>
                                <td className={`py-3.5 px-5 text-right ${
                                  bestIdx === 2 ? 'text-amber-600 font-medium' : 'text-gray-600'
                                }`}>
                                  <div className="flex items-center justify-end gap-2">
                                    {bestIdx === 2 && <span className="text-amber-500">★</span>}
                                    {row.format(values[2])}
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                      <p className="text-xs text-gray-500 text-center">
                        ★ indica il miglior valore per ogni metrica (piu alto per rendimenti, piu basso per rischio)
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl text-forest mb-2">Configura il Portafoglio</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Imposta l&apos;allocazione degli asset in modo che il totale sia esattamente 100%
                    per visualizzare le metriche di backtest.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => applyPreset('bilanciato')}
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      Usa Preset Bilanciato
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Educational Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Metriche di Rendimento</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-forest">CAGR</p>
                  <p>Compound Annual Growth Rate. Il tasso di crescita annuo che trasforma il capitale iniziale nel valore finale.</p>
                </div>
                <div>
                  <p className="font-medium text-forest">Rolling Returns</p>
                  <p>Rendimenti su finestre temporali mobili. Mostra la variabilita dei rendimenti nel tempo.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Metriche di Rischio</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-forest">Volatilita</p>
                  <p>Deviazione standard dei rendimenti. Misura quanto oscillano i rendimenti attorno alla media.</p>
                </div>
                <div>
                  <p className="font-medium text-forest">Max Drawdown</p>
                  <p>La massima perdita percentuale dal picco al minimo. Indica il &quot;dolore massimo&quot; del portafoglio.</p>
                </div>
                <div>
                  <p className="font-medium text-forest">VaR 95%</p>
                  <p>Value at Risk: la perdita massima attesa nel 95% degli scenari su base annua.</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Rapporti Risk-Adjusted</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div>
                  <p className="font-medium text-forest">Sharpe Ratio</p>
                  <p>Rendimento in eccesso per unita di rischio totale. Valori &gt;1 sono buoni, &gt;2 eccellenti.</p>
                </div>
                <div>
                  <p className="font-medium text-forest">Sortino Ratio</p>
                  <p>Come lo Sharpe ma considera solo la volatilita negativa (downside). Piu rilevante per investitori avversi al rischio.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-heading text-lg text-amber-800 mb-2">Disclaimer Importante</h3>
                <div className="text-sm text-amber-700 space-y-2">
                  <p>
                    <strong>Simulazione basata su dati storici medi.</strong> I rendimenti mostrati sono stime basate su
                    medie storiche a lungo termine e simulazioni Monte Carlo. I risultati reali varieranno significativamente.
                  </p>
                  <p>
                    <strong>I rendimenti passati non garantiscono risultati futuri.</strong> Le correlazioni tra asset
                    cambiano nel tempo, specialmente durante crisi finanziarie quando tendono ad aumentare.
                  </p>
                  <p>
                    Questo strumento ha <strong>scopo esclusivamente educativo</strong> e non costituisce consulenza
                    finanziaria, raccomandazione di investimento o sollecitazione all&apos;acquisto di strumenti finanziari.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-forest relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container-custom text-center relative">
          <span className="inline-block bg-white/10 text-green-300 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            CONSULENZA PERSONALIZZATA
          </span>
          <h2 className="font-heading text-2xl md:text-3xl text-white mb-4">
            Vuoi ottimizzare il tuo portafoglio reale?
          </h2>
          <p className="text-white/70 mb-8 max-w-lg mx-auto">
            Un consulente finanziario indipendente puo aiutarti a costruire un portafoglio
            personalizzato, considerando la tua situazione fiscale, gli obiettivi e la tolleranza al rischio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contatti"
              className="inline-flex items-center justify-center gap-2 bg-white text-forest px-8 py-3.5 rounded-xl font-medium hover:bg-gray-100 transition-colors shadow-lg"
            >
              Richiedi Consulenza Gratuita
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/strumenti"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-white/20 transition-colors border border-white/20"
            >
              Altri Strumenti Gratuiti
            </Link>
          </div>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom py-8">
        <RatingWidget toolSlug="backtest-portafoglio" toolName="backtest-portafoglio" />
      </div>

      <Footer />
    </main>
  )
}
