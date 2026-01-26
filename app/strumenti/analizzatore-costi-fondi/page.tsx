'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Navbar, Footer, RelatedTools, toolCorrelations , RatingWidget, ToolPageSchema} from '@/components'

interface FundInput {
  name: string
  ter: number
  color: string
}

interface YearlyData {
  year: number
  withCosts: number
  withoutCosts: number
  costImpact: number
  cumulativeCosts: number
  yearlyFees: number
}

// TER Benchmark data
const TER_BENCHMARKS = [
  {
    category: 'ETF Azionari Globali',
    range: '0.07% - 0.22%',
    terLow: 0.07,
    terHigh: 0.22,
    examples: 'VWCE (0.22%), SWDA (0.20%), LCWD (0.12%)',
    verdict: 'Ottimo',
    color: 'green'
  },
  {
    category: 'ETF Obbligazionari',
    range: '0.05% - 0.20%',
    terLow: 0.05,
    terHigh: 0.20,
    examples: 'AGGH (0.10%), XGLE (0.07%)',
    verdict: 'Ottimo',
    color: 'green'
  },
  {
    category: 'Fondi Indicizzati',
    range: '0.10% - 0.40%',
    terLow: 0.10,
    terHigh: 0.40,
    examples: 'Fidelity Index World (0.12%)',
    verdict: 'Buono',
    color: 'green'
  },
  {
    category: 'GPM Bancarie',
    range: '1.00% - 2.00%',
    terLow: 1.00,
    terHigh: 2.00,
    examples: 'Gestioni Patrimoniali bancarie',
    verdict: 'Caro',
    color: 'orange'
  },
  {
    category: 'Fondi Attivi Azionari',
    range: '1.50% - 2.50%',
    terLow: 1.50,
    terHigh: 2.50,
    examples: 'Fondi delle SGR bancarie italiane',
    verdict: 'Molto Caro',
    color: 'red'
  },
  {
    category: 'Polizze Unit Linked',
    range: '2.00% - 4.00%',
    terLow: 2.00,
    terHigh: 4.00,
    examples: 'Prodotti assicurativi-finanziari',
    verdict: 'Eccessivo',
    color: 'red'
  },
]

// Animated counter component
function AnimatedNumber({ value, duration = 1000, prefix = '', suffix = '', className = '' }: {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const previousValue = useRef(0)

  useEffect(() => {
    const startValue = previousValue.current
    const difference = value - startValue
    const startTime = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = startValue + difference * easeOutQuart

      setDisplayValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        previousValue.current = value
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  const formattedValue = new Intl.NumberFormat('it-IT', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(displayValue))

  return (
    <span className={className}>
      {prefix}{formattedValue}{suffix}
    </span>
  )
}

export default function AnalizzatoreCostiFondi() {
  // Main calculator inputs
  const [capitale, setCapitale] = useState<string>('100000')
  const [ter, setTer] = useState<string>('1.5')
  const [commissioniIngresso, setCommissioniIngresso] = useState<string>('0')
  const [commissioniUscita, setCommissioniUscita] = useState<string>('0')
  const [commissioniPerformance, setCommissioniPerformance] = useState<string>('0')
  const [costiTransazione, setCostiTransazione] = useState<string>('0.10')
  const [rendimentoLordo, setRendimentoLordo] = useState<string>('7')
  const [orizzonte, setOrizzonte] = useState<number>(20)

  // Comparison funds
  const [showComparison, setShowComparison] = useState(false)
  const [funds, setFunds] = useState<FundInput[]>([
    { name: 'Fondo Attivo Banca', ter: 2.0, color: '#ef4444' },
    { name: 'ETF VWCE', ter: 0.22, color: '#22c55e' },
    { name: 'Il Tuo Fondo', ter: 1.5, color: '#3b82f6' },
  ])

  // Parse values
  const capitaleNum = parseFloat(capitale) || 0
  const terNum = parseFloat(ter) || 0
  const ingressoNum = parseFloat(commissioniIngresso) || 0
  const uscitaNum = parseFloat(commissioniUscita) || 0
  const performanceNum = parseFloat(commissioniPerformance) || 0
  const transazioneNum = parseFloat(costiTransazione) || 0
  const rendimentoNum = parseFloat(rendimentoLordo) || 0

  // Calculate yearly projections
  const yearlyData = useMemo<YearlyData[]>(() => {
    const data: YearlyData[] = []

    // Initial capital after entry fees
    const entryFee = capitaleNum * (ingressoNum / 100)
    const capitaleDopoIngresso = capitaleNum - entryFee

    let withCosts = capitaleDopoIngresso
    let withoutCosts = capitaleNum
    let cumulativeCosts = entryFee

    for (let year = 1; year <= orizzonte; year++) {
      // Without costs: pure gross return
      withoutCosts = withoutCosts * (1 + rendimentoNum / 100)

      // With costs: gross return minus all fees
      const grossReturn = withCosts * (rendimentoNum / 100)
      const terCost = withCosts * (terNum / 100)
      const transactionCost = withCosts * (transazioneNum / 100)
      const perfCost = grossReturn > 0 ? grossReturn * (performanceNum / 100) : 0
      const yearlyFees = terCost + transactionCost + perfCost

      withCosts = withCosts + grossReturn - yearlyFees

      // Track cumulative costs
      cumulativeCosts += yearlyFees

      // Apply exit fee only on final year
      let finalWithCosts = withCosts
      if (year === orizzonte) {
        const exitCost = withCosts * (uscitaNum / 100)
        finalWithCosts = withCosts - exitCost
        cumulativeCosts += exitCost
      }

      data.push({
        year,
        withCosts: year === orizzonte ? finalWithCosts : withCosts,
        withoutCosts,
        costImpact: withoutCosts - (year === orizzonte ? finalWithCosts : withCosts),
        cumulativeCosts,
        yearlyFees,
      })
    }

    return data
  }, [capitaleNum, terNum, ingressoNum, uscitaNum, performanceNum, transazioneNum, rendimentoNum, orizzonte])

  // Calculate comparison data
  const comparisonData = useMemo(() => {
    return funds.map(fund => {
      const entryFee = capitaleNum * (ingressoNum / 100)
      let value = capitaleNum - entryFee
      const yearlyValues: number[] = [capitaleNum]

      for (let year = 1; year <= orizzonte; year++) {
        const grossReturn = value * (rendimentoNum / 100)
        const terCost = value * (fund.ter / 100)
        const transactionCost = value * (transazioneNum / 100)
        value = value + grossReturn - terCost - transactionCost
        yearlyValues.push(value)
      }

      // Apply exit fee
      value = value * (1 - uscitaNum / 100)
      yearlyValues[yearlyValues.length - 1] = value

      const idealValue = capitaleNum * Math.pow(1 + rendimentoNum / 100, orizzonte)

      return {
        name: fund.name,
        ter: fund.ter,
        color: fund.color,
        finalValue: value,
        totalCost: idealValue - value,
        yearlyValues,
      }
    })
  }, [funds, capitaleNum, ingressoNum, uscitaNum, transazioneNum, rendimentoNum, orizzonte])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Final values
  const finalData = yearlyData[yearlyData.length - 1]
  const idealFinalValue = capitaleNum * Math.pow(1 + rendimentoNum / 100, orizzonte)

  // Calculate total cost percentage
  const totalCostPercentage = finalData ? ((finalData.costImpact / idealFinalValue) * 100) : 0

  // Calculate what percentage of returns are eaten by costs
  const returnsLostToCosts = finalData
    ? ((finalData.costImpact / (idealFinalValue - capitaleNum)) * 100)
    : 0

  // Update fund TER
  const updateFundTer = (index: number, newTer: number) => {
    const newFunds = [...funds]
    newFunds[index].ter = newTer
    setFunds(newFunds)
  }

  // Update fund name
  const updateFundName = (index: number, newName: string) => {
    const newFunds = [...funds]
    newFunds[index].name = newName
    setFunds(newFunds)
  }

  // Chart dimensions
  const chartWidth = 100
  const chartHeight = 60
  const maxValue = Math.max(finalData?.withoutCosts || 0, capitaleNum * 1.1)

  // Generate chart path
  const generatePath = (values: number[], isWithCosts: boolean) => {
    const points = values.map((val, i) => {
      const x = (i / orizzonte) * chartWidth
      const y = chartHeight - (val / maxValue) * chartHeight
      return `${x},${y}`
    })
    return `M ${points.join(' L ')}`
  }

  const withoutCostsPath = generatePath([capitaleNum, ...yearlyData.map(d => d.withoutCosts)], false)
  const withCostsPath = generatePath([capitaleNum * (1 - ingressoNum / 100), ...yearlyData.map(d => d.withCosts)], true)

  // Generate area path for the "lost money" visualization
  const generateAreaPath = () => {
    const topPoints = [capitaleNum, ...yearlyData.map(d => d.withoutCosts)].map((val, i) => {
      const x = (i / orizzonte) * chartWidth
      const y = chartHeight - (val / maxValue) * chartHeight
      return `${x},${y}`
    })
    const bottomPoints = [capitaleNum * (1 - ingressoNum / 100), ...yearlyData.map(d => d.withCosts)].map((val, i) => {
      const x = (i / orizzonte) * chartWidth
      const y = chartHeight - (val / maxValue) * chartHeight
      return `${x},${y}`
    }).reverse()

    return `M ${topPoints.join(' L ')} L ${bottomPoints.join(' L ')} Z`
  }

  // Get verdict for current TER
  const getTerVerdict = (currentTer: number) => {
    if (currentTer <= 0.25) return { text: 'Eccellente', color: 'text-green-600', bg: 'bg-green-100' }
    if (currentTer <= 0.50) return { text: 'Buono', color: 'text-green-500', bg: 'bg-green-50' }
    if (currentTer <= 1.00) return { text: 'Accettabile', color: 'text-yellow-600', bg: 'bg-yellow-100' }
    if (currentTer <= 1.50) return { text: 'Caro', color: 'text-orange-600', bg: 'bg-orange-100' }
    if (currentTer <= 2.00) return { text: 'Molto Caro', color: 'text-red-500', bg: 'bg-red-100' }
    return { text: 'Eccessivo!', color: 'text-red-700', bg: 'bg-red-200' }
  }

  const terVerdict = getTerVerdict(terNum)

  // Related tools
  const relatedTools = [
    { title: 'Confronto ETF', description: 'Trova ETF a basso costo', href: '/strumenti/confronto-etf', icon: 'scale' as const },
    { title: 'Portfolio Tracker', description: 'Monitora i tuoi investimenti', href: '/strumenti/portfolio-tracker', icon: 'chart' as const },
    { title: 'Backtest Portafoglio', description: 'Testa rendimenti storici', href: '/strumenti/backtest-portafoglio', icon: 'chart' as const },
    { title: 'PAC Simulator', description: 'Piano di Accumulo Capitale', href: '/strumenti/pac', icon: 'calculator' as const },
  ]

  return (
    <main className="min-h-screen bg-cream">
      <ToolPageSchema slug="analizzatore-costi-fondi" />
      <Navbar />

      {/* Hero */}
      <section className="bg-forest pt-navbar">
        <div className="container-custom py-16 md:py-24">
          <Link href="/strumenti" className="inline-flex items-center text-green-300 hover:text-white mb-4 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tutti gli strumenti
          </Link>
          <p className="text-green-300/60 text-sm font-medium tracking-wider uppercase mb-4">
            Scopri la verita sui costi
          </p>
          <h1 className="font-heading text-[36px] md:text-[48px] text-white leading-tight max-w-3xl">
            Analizzatore Costi Fondi
          </h1>
          <p className="text-lg text-white/60 mt-6 max-w-xl">
            Il TER che sembra &quot;solo l&apos;1.5%&quot; puo costarti <span className="text-red-400 font-semibold">decine di migliaia di euro</span>. Scopri quanto stai davvero pagando.
          </p>
        </div>
      </section>

      {/* Shock Value Banner */}
      {finalData && capitaleNum > 0 && (
        <section className="bg-red-600 py-6">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white">
              <div className="text-center md:text-left">
                <p className="text-red-200 text-sm">Con i costi attuali, in {orizzonte} anni perdi:</p>
                <p className="text-3xl md:text-4xl font-heading font-bold">
                  <AnimatedNumber value={finalData.costImpact} prefix="" suffix=" EUR" />
                </p>
              </div>
              <div className="text-center">
                <p className="text-red-200 text-sm">Dei tuoi guadagni potenziali</p>
                <p className="text-2xl md:text-3xl font-bold">
                  {returnsLostToCosts.toFixed(1)}% bruciato
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-red-200 text-sm">Costo annuo medio</p>
                <p className="text-2xl md:text-3xl font-bold">
                  {formatCurrency(finalData.cumulativeCosts / orizzonte)}/anno
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Calculator Section */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-5 gap-8">

            {/* Input Form - 2 columns */}
            <div className="lg:col-span-2 bg-white rounded-lg p-6 md:p-8 shadow-sm h-fit">
              <h2 className="font-heading text-2xl text-forest mb-6">Inserisci i dati del fondo</h2>

              <div className="space-y-5">
                {/* Capitale */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Capitale investito
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={capitale}
                      onChange={(e) => setCapitale(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-lg"
                      placeholder="100000"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">EUR</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[10000, 50000, 100000, 250000, 500000].map(val => (
                      <button
                        key={val}
                        onClick={() => setCapitale(val.toString())}
                        className={`text-xs px-2 py-1 rounded ${capitale === val.toString() ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {val >= 1000 ? `${val / 1000}k` : val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TER with verdict */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    TER (Total Expense Ratio)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={ter}
                      onChange={(e) => setTer(e.target.value)}
                      className="w-full px-4 py-3 pr-20 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-lg"
                      placeholder="1.5"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">
                      Costo annuale del fondo
                    </p>
                    <span className={`text-xs px-2 py-1 rounded font-medium ${terVerdict.bg} ${terVerdict.color}`}>
                      {terVerdict.text}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[0.2, 0.5, 1.0, 1.5, 2.0, 2.5].map(val => (
                      <button
                        key={val}
                        onClick={() => setTer(val.toString())}
                        className={`text-xs px-2 py-1 rounded ${ter === val.toString() ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {val}%
                      </button>
                    ))}
                  </div>
                </div>

                {/* Advanced costs toggle */}
                <details className="group">
                  <summary className="cursor-pointer text-sm text-green-600 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 group-open:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Costi aggiuntivi (commissioni, transazioni...)
                  </summary>

                  <div className="mt-4 space-y-4 pl-6 border-l-2 border-green-100">
                    {/* Commissioni Ingresso */}
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Commissioni di ingresso
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          value={commissioniIngresso}
                          onChange={(e) => setCommissioniIngresso(e.target.value)}
                          className="w-full px-4 py-2 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                          placeholder="0"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                      </div>
                    </div>

                    {/* Commissioni Uscita */}
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Commissioni di uscita
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          value={commissioniUscita}
                          onChange={(e) => setCommissioniUscita(e.target.value)}
                          className="w-full px-4 py-2 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                          placeholder="0"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                      </div>
                    </div>

                    {/* Commissioni Performance */}
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Commissioni di performance
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          value={commissioniPerformance}
                          onChange={(e) => setCommissioniPerformance(e.target.value)}
                          className="w-full px-4 py-2 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                          placeholder="0"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        % applicata sui rendimenti positivi
                      </p>
                    </div>

                    {/* Costi Transazione */}
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Costi di transazione annui
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.01"
                          value={costiTransazione}
                          onChange={(e) => setCostiTransazione(e.target.value)}
                          className="w-full px-4 py-2 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                          placeholder="0.10"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Spread, costi impliciti, turnover
                      </p>
                    </div>
                  </div>
                </details>

                {/* Rendimento Lordo Atteso */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Rendimento lordo atteso annuo
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={rendimentoLordo}
                      onChange={(e) => setRendimentoLordo(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-lg"
                      placeholder="7"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Media storica azionario globale: 7-8% annuo
                  </p>
                </div>

                {/* Orizzonte Temporale - Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Orizzonte temporale: <span className="text-forest font-semibold">{orizzonte} anni</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    value={orizzonte}
                    onChange={(e) => setOrizzonte(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1 anno</span>
                    <span>10</span>
                    <span>20</span>
                    <span>30</span>
                    <span>40 anni</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results - 3 columns */}
            <div className="lg:col-span-3 space-y-6">
              {/* Main Results Card */}
              <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
                <h2 className="font-heading text-2xl text-forest mb-6">Impatto dei costi in {orizzonte} anni</h2>

                {finalData && (
                  <div className="space-y-6">
                    {/* Key Numbers */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                        <p className="text-sm text-gray-500 mb-1">Senza costi (ideale)</p>
                        <p className="text-2xl md:text-3xl font-heading font-semibold text-green-600">
                          {formatCurrency(finalData.withoutCosts)}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          +{formatCurrency(finalData.withoutCosts - capitaleNum)} di guadagno
                        </p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                        <p className="text-sm text-gray-500 mb-1">Con i costi (realta)</p>
                        <p className="text-2xl md:text-3xl font-heading font-semibold text-red-600">
                          {formatCurrency(finalData.withCosts)}
                        </p>
                        <p className="text-xs text-red-600 mt-1">
                          +{formatCurrency(finalData.withCosts - capitaleNum)} di guadagno
                        </p>
                      </div>
                    </div>

                    {/* Big Impact Number */}
                    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                      <p className="text-red-200 text-sm mb-1">Soldi persi a causa dei costi</p>
                      <p className="text-4xl md:text-5xl font-heading font-bold">
                        <AnimatedNumber value={finalData.costImpact} prefix="-" suffix=" EUR" />
                      </p>
                      <div className="flex flex-wrap gap-4 mt-4">
                        <div className="bg-white/10 rounded px-3 py-2">
                          <p className="text-xs text-red-200">Del patrimonio finale</p>
                          <p className="text-lg font-semibold">{totalCostPercentage.toFixed(1)}%</p>
                        </div>
                        <div className="bg-white/10 rounded px-3 py-2">
                          <p className="text-xs text-red-200">Dei guadagni</p>
                          <p className="text-lg font-semibold">{returnsLostToCosts.toFixed(1)}%</p>
                        </div>
                        <div className="bg-white/10 rounded px-3 py-2">
                          <p className="text-xs text-red-200">Costi cumulati</p>
                          <p className="text-lg font-semibold">{formatCurrency(finalData.cumulativeCosts)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Visual Chart */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-600 mb-4">Crescita del capitale nel tempo</h3>
                      <div className="relative h-64">
                        <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 10}`} className="w-full h-full" preserveAspectRatio="none">
                          {/* Grid lines */}
                          {[0, 25, 50, 75, 100].map(percent => (
                            <line
                              key={percent}
                              x1="0"
                              y1={chartHeight - (percent / 100) * chartHeight}
                              x2={chartWidth}
                              y2={chartHeight - (percent / 100) * chartHeight}
                              stroke="#e5e7eb"
                              strokeWidth="0.3"
                            />
                          ))}

                          {/* Area between curves (lost money) */}
                          <path
                            d={generateAreaPath()}
                            fill="rgba(239, 68, 68, 0.2)"
                            className="animate-pulse"
                          />

                          {/* Without costs line */}
                          <path
                            d={withoutCostsPath}
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="0.8"
                            strokeLinecap="round"
                          />

                          {/* With costs line */}
                          <path
                            d={withCostsPath}
                            fill="none"
                            stroke="#ef4444"
                            strokeWidth="0.8"
                            strokeLinecap="round"
                          />
                        </svg>

                        {/* Legend */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-6 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-green-500"></div>
                            <span className="text-gray-600">Senza costi</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-red-500"></div>
                            <span className="text-gray-600">Con costi</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-red-500/20"></div>
                            <span className="text-gray-600">Soldi persi</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Yearly breakdown */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Evoluzione anno per anno</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-2 text-gray-500 font-medium">Anno</th>
                        <th className="text-right py-2 px-2 text-gray-500 font-medium">Senza costi</th>
                        <th className="text-right py-2 px-2 text-gray-500 font-medium">Con costi</th>
                        <th className="text-right py-2 px-2 text-gray-500 font-medium">Perso</th>
                        <th className="text-right py-2 px-2 text-gray-500 font-medium">Costi cumulati</th>
                      </tr>
                    </thead>
                    <tbody>
                      {yearlyData.filter((_, i) => i < 5 || i === 9 || i === 14 || i === 19 || i === yearlyData.length - 1).map((data) => (
                        <tr key={data.year} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-2 font-medium">{data.year}</td>
                          <td className="py-2 px-2 text-right text-green-600">{formatCurrency(data.withoutCosts)}</td>
                          <td className="py-2 px-2 text-right">{formatCurrency(data.withCosts)}</td>
                          <td className="py-2 px-2 text-right text-red-500 font-medium">-{formatCurrency(data.costImpact)}</td>
                          <td className="py-2 px-2 text-right text-gray-400">{formatCurrency(data.cumulativeCosts)}</td>
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

      {/* Comparison Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="bg-gray-50 rounded-lg p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-heading text-2xl text-forest">Confronta fino a 3 fondi</h3>
                <p className="text-gray-500 text-sm mt-1">Scopri quanto risparmi scegliendo prodotti a basso costo</p>
              </div>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showComparison
                    ? 'bg-forest text-white'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {showComparison ? 'Nascondi' : 'Mostra confronto'}
              </button>
            </div>

            {showComparison && (
              <div className="space-y-8">
                {/* Fund Inputs */}
                <div className="grid md:grid-cols-3 gap-4">
                  {funds.map((fund, index) => (
                    <div
                      key={index}
                      className="bg-white border-2 rounded-lg p-4"
                      style={{ borderColor: fund.color }}
                    >
                      <input
                        type="text"
                        value={fund.name}
                        onChange={(e) => updateFundName(index, e.target.value)}
                        className="w-full text-sm font-semibold text-forest mb-3 border-b border-transparent focus:border-green-400 focus:outline-none pb-1"
                      />
                      <label className="block text-xs text-gray-400 mb-1">TER annuo %</label>
                      <input
                        type="number"
                        step="0.01"
                        value={fund.ter}
                        onChange={(e) => updateFundTer(index, parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-lg font-semibold"
                      />
                    </div>
                  ))}
                </div>

                {/* Comparison Chart */}
                <div className="bg-white rounded-lg p-4">
                  <div className="relative h-64">
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight + 10}`} className="w-full h-full" preserveAspectRatio="none">
                      {/* Grid lines */}
                      {[0, 25, 50, 75, 100].map(percent => (
                        <line
                          key={percent}
                          x1="0"
                          y1={chartHeight - (percent / 100) * chartHeight}
                          x2={chartWidth}
                          y2={chartHeight - (percent / 100) * chartHeight}
                          stroke="#e5e7eb"
                          strokeWidth="0.3"
                        />
                      ))}

                      {/* Fund lines */}
                      {comparisonData.map((fund, idx) => {
                        const maxVal = Math.max(...comparisonData.flatMap(f => f.yearlyValues))
                        const path = fund.yearlyValues.map((val, i) => {
                          const x = (i / orizzonte) * chartWidth
                          const y = chartHeight - (val / maxVal) * chartHeight * 0.9
                          return `${x},${y}`
                        })
                        return (
                          <path
                            key={idx}
                            d={`M ${path.join(' L ')}`}
                            fill="none"
                            stroke={fund.color}
                            strokeWidth="0.8"
                            strokeLinecap="round"
                          />
                        )
                      })}
                    </svg>

                    {/* Legend */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-6 text-xs">
                      {comparisonData.map((fund, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <div className="w-3 h-0.5" style={{ backgroundColor: fund.color }}></div>
                          <span className="text-gray-600">{fund.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comparison Results */}
                <div className="grid md:grid-cols-3 gap-4">
                  {comparisonData
                    .sort((a, b) => b.finalValue - a.finalValue)
                    .map((fund, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-5 ${
                        index === 0
                          ? 'bg-green-50 border-2 border-green-400 ring-2 ring-green-400/20'
                          : 'bg-gray-50'
                      }`}
                    >
                      {index === 0 && (
                        <span className="inline-block text-xs bg-green-600 text-white px-2 py-0.5 rounded mb-2">
                          MIGLIORE
                        </span>
                      )}
                      <p className="font-heading text-lg text-forest">{fund.name}</p>
                      <p className="text-xs text-gray-400 mb-3">TER: {fund.ter}%</p>
                      <p className="text-2xl font-heading font-bold text-forest">
                        {formatCurrency(fund.finalValue)}
                      </p>
                      <p className="text-sm text-red-500 mt-1">
                        Costo totale: {formatCurrency(fund.totalCost)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Savings Highlight */}
                {comparisonData.length >= 2 && (
                  <div className="bg-green-600 rounded-lg p-6 text-white text-center">
                    <p className="text-green-100 text-sm mb-2">Scegliendo il fondo piu economico risparmi</p>
                    <p className="text-4xl font-heading font-bold">
                      {formatCurrency(
                        Math.max(...comparisonData.map(f => f.totalCost)) -
                        Math.min(...comparisonData.map(f => f.totalCost))
                      )}
                    </p>
                    <p className="text-green-100 text-sm mt-2">in {orizzonte} anni</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TER Benchmark Table */}
      <section className="py-12">
        <div className="container-custom">
          <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
            <h3 className="font-heading text-2xl text-forest mb-2">Tabella TER di riferimento</h3>
            <p className="text-gray-500 mb-6">Quanto dovresti pagare per tipo di prodotto finanziario</p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-forest">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-forest">Categoria</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-forest">TER Tipico</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-forest">Esempi</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-forest">Costo su 100k in 20 anni*</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-forest">Valutazione</th>
                  </tr>
                </thead>
                <tbody>
                  {TER_BENCHMARKS.map((item, i) => {
                    // Calculate cost for this TER
                    const avgTer = (item.terLow + item.terHigh) / 2
                    let value = 100000
                    for (let y = 0; y < 20; y++) {
                      value = value * (1 + 0.07) - value * (avgTer / 100)
                    }
                    const idealValue = 100000 * Math.pow(1.07, 20)
                    const cost = idealValue - value

                    return (
                      <tr key={i} className={`border-b border-gray-100 ${
                        item.color === 'green' ? 'hover:bg-green-50' :
                        item.color === 'orange' ? 'hover:bg-orange-50' : 'hover:bg-red-50'
                      }`}>
                        <td className="py-4 px-4">
                          <p className="font-medium text-forest">{item.category}</p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            item.color === 'green' ? 'bg-green-100 text-green-700' :
                            item.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {item.range}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-500">
                          {item.examples}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`font-semibold ${
                            item.color === 'green' ? 'text-green-600' :
                            item.color === 'orange' ? 'text-orange-600' :
                            'text-red-600'
                          }`}>
                            {formatCurrency(cost)}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                            item.color === 'green' ? 'bg-green-600 text-white' :
                            item.color === 'orange' ? 'bg-orange-500 text-white' :
                            'bg-red-600 text-white'
                          }`}>
                            {item.verdict}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              * Calcolato su 100.000 EUR con rendimento lordo 7% annuo per 20 anni. I costi effettivi possono variare.
            </p>
          </div>
        </div>
      </section>

      {/* Educational Wake Up Section */}
      <section className="py-16 bg-forest">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading text-3xl md:text-4xl text-white text-center mb-12">
              La verita scomoda sui fondi attivi
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Stat 1 */}
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-5xl font-heading font-bold text-red-400 mb-3">92%</div>
                <p className="text-lg text-white mb-2">dei fondi attivi NON batte il benchmark</p>
                <p className="text-sm text-white/60">
                  Su un orizzonte di 15 anni, il 92% dei fondi azionari attivi europei ha sottoperformato il proprio indice di riferimento.
                </p>
                <p className="text-xs text-green-300 mt-3">
                  Fonte: S&P SPIVA Europe Scorecard 2023
                </p>
              </div>

              {/* Stat 2 */}
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-5xl font-heading font-bold text-red-400 mb-3">1.7%</div>
                <p className="text-lg text-white mb-2">TER medio dei fondi azionari in Italia</p>
                <p className="text-sm text-white/60">
                  I fondi venduti allo sportello bancario hanno un TER medio del 1.7%, contro lo 0.20% degli ETF equivalenti.
                </p>
                <p className="text-xs text-green-300 mt-3">
                  Fonte: Morningstar European Fee Study 2023
                </p>
              </div>

              {/* Stat 3 */}
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-5xl font-heading font-bold text-green-400 mb-3">8.5x</div>
                <p className="text-lg text-white mb-2">il costo di un fondo attivo vs ETF</p>
                <p className="text-sm text-white/60">
                  Un fondo con TER 1.7% costa 8.5 volte di piu di un ETF con TER 0.20%. Su 20 anni, questa differenza puo superare 100.000 EUR.
                </p>
              </div>

              {/* Stat 4 */}
              <div className="bg-white/10 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-5xl font-heading font-bold text-green-400 mb-3">0.22%</div>
                <p className="text-lg text-white mb-2">TER del Vanguard FTSE All-World</p>
                <p className="text-sm text-white/60">
                  L&apos;ETF VWCE offre esposizione a 3.700+ azioni di tutto il mondo con un costo annuo di soli 22 centesimi ogni 100 EUR.
                </p>
              </div>
            </div>

            {/* Quote */}
            <blockquote className="border-l-4 border-green-400 pl-6 py-4 bg-white/5 rounded-r-lg">
              <p className="text-xl text-white italic mb-3">
                &quot;I costi sono l&apos;unico fattore prevedibile nei rendimenti futuri. Piu paghi, meno ottieni.&quot;
              </p>
              <footer className="text-green-300">
                - John Bogle, fondatore di Vanguard
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Example Calculation */}
      <section className="py-12 bg-red-50">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="font-heading text-2xl text-forest mb-6">Un esempio concreto</h3>
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <p className="text-gray-600 mb-4">
                Investi <span className="font-bold text-forest">100.000 EUR</span> per <span className="font-bold text-forest">20 anni</span> con rendimento lordo del <span className="font-bold text-forest">7%</span>:
              </p>

              <div className="grid md:grid-cols-3 gap-6 my-8">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-500 mb-1">ETF (TER 0.20%)</p>
                  <p className="text-3xl font-heading font-bold text-green-600">369.000 EUR</p>
                  <p className="text-xs text-green-600 mt-1">Costo: 17.000 EUR</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-gray-500 mb-1">Fondo Attivo (TER 1.5%)</p>
                  <p className="text-3xl font-heading font-bold text-orange-600">285.000 EUR</p>
                  <p className="text-xs text-orange-600 mt-1">Costo: 101.000 EUR</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-gray-500 mb-1">Polizza Unit Linked (TER 3%)</p>
                  <p className="text-3xl font-heading font-bold text-red-600">214.000 EUR</p>
                  <p className="text-xs text-red-600 mt-1">Costo: 172.000 EUR</p>
                </div>
              </div>

              <div className="bg-red-100 rounded-lg p-4 border border-red-200">
                <p className="text-red-800">
                  <span className="font-bold">La differenza tra ETF e polizza unit linked e di 155.000 EUR.</span>
                  <br />
                  Piu di quanto hai investito inizialmente!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-forest">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl text-white mb-6">
              Vuoi sapere quanto stai davvero pagando?
            </h2>
            <p className="text-lg text-white/70 mb-8">
              Molti investitori non conoscono i costi reali dei propri fondi. Facciamo un check-up gratuito del tuo portafoglio e scopriamo insieme se stai pagando troppo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#contatti"
                className="inline-flex items-center justify-center gap-2 bg-white text-forest px-8 py-4 rounded-lg font-semibold hover:bg-cream transition-colors text-lg"
              >
                Richiedi analisi gratuita
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <Link
                href="/strumenti/confronto-etf"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors text-lg"
              >
                Confronta ETF a basso costo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-gray-100">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h4 className="font-medium text-forest mb-3">Fonti e metodologia</h4>
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
              <li>- S&P Dow Jones Indices: SPIVA Europe Scorecard (2023)</li>
              <li>- Morningstar: European Fee Study (2023)</li>
              <li>- I calcoli assumono reinvestimento totale e non considerano la tassazione</li>
              <li>- I rendimenti passati non sono indicativi di quelli futuri</li>
            </ul>
            <p className="text-xs text-gray-500">
              <strong>Disclaimer:</strong> Questo strumento ha finalita esclusivamente educative e informative.
              I risultati sono simulazioni basate sui parametri inseriti e non costituiscono previsioni o promesse di rendimento.
              Prima di effettuare qualsiasi investimento, consulta un consulente finanziario indipendente.
              GuidaPatrimonio.it non e responsabile di decisioni di investimento basate su questo strumento.
            </p>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <RelatedTools tools={relatedTools} title="Strumenti correlati" />

      {/* Rating Widget */}
      <div className="container-custom py-8">
        <RatingWidget toolSlug="analizzatore-costi-fondi" toolName="Analizzatore Costi Fondi" />
      </div>

      <Footer />
    </main>
  )
}
