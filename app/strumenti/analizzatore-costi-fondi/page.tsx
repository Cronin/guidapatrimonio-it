'use client'

import { useState, useMemo } from 'react'
import { Navbar, Footer } from '@/components'

// Metadata must be in a separate file for client components, but we can export generateMetadata from layout
// For SEO, we'll add metadata in a separate metadata.ts file or handle via head

interface FundInput {
  name: string
  ter: number
}

interface YearlyData {
  year: number
  withCosts: number
  withoutCosts: number
  costImpact: number
  cumulativeCosts: number
}

export default function AnalizzatoreCostiFondi() {
  // Main calculator inputs
  const [capitale, setCapitale] = useState<string>('100000')
  const [ter, setTer] = useState<string>('1.5')
  const [commissioniIngresso, setCommissioniIngresso] = useState<string>('0')
  const [commissioniUscita, setCommissioniUscita] = useState<string>('0')
  const [commissioniPerformance, setCommissioniPerformance] = useState<string>('0')
  const [rendimentoLordo, setRendimentoLordo] = useState<string>('7')
  const [orizzonte, setOrizzonte] = useState<string>('20')

  // Comparison funds
  const [showComparison, setShowComparison] = useState(false)
  const [funds, setFunds] = useState<FundInput[]>([
    { name: 'Fondo Attivo', ter: 1.8 },
    { name: 'ETF Indicizzato', ter: 0.2 },
    { name: 'Fondo Passivo', ter: 0.5 },
  ])

  // Parse values
  const capitaleNum = parseFloat(capitale) || 0
  const terNum = parseFloat(ter) || 0
  const ingressoNum = parseFloat(commissioniIngresso) || 0
  const uscitaNum = parseFloat(commissioniUscita) || 0
  const performanceNum = parseFloat(commissioniPerformance) || 0
  const rendimentoNum = parseFloat(rendimentoLordo) || 0
  const orizzonteNum = parseInt(orizzonte) || 20

  // Calculate yearly projections
  const yearlyData = useMemo<YearlyData[]>(() => {
    const data: YearlyData[] = []

    // Initial capital after entry fees
    const capitaleDopoIngresso = capitaleNum * (1 - ingressoNum / 100)

    let withCosts = capitaleDopoIngresso
    let withoutCosts = capitaleNum
    let cumulativeCosts = capitaleNum - capitaleDopoIngresso // Entry fee cost

    for (let year = 1; year <= orizzonteNum; year++) {
      // Without costs: pure gross return
      withoutCosts = withoutCosts * (1 + rendimentoNum / 100)

      // With costs: gross return minus TER and performance fee
      const grossReturn = withCosts * (rendimentoNum / 100)
      const terCost = withCosts * (terNum / 100)
      const perfCost = grossReturn > 0 ? grossReturn * (performanceNum / 100) : 0

      withCosts = withCosts + grossReturn - terCost - perfCost

      // Track cumulative costs
      cumulativeCosts += terCost + perfCost

      // Apply exit fee only on final year
      let finalWithCosts = withCosts
      if (year === orizzonteNum) {
        const exitCost = withCosts * (uscitaNum / 100)
        finalWithCosts = withCosts - exitCost
        cumulativeCosts += exitCost
      }

      data.push({
        year,
        withCosts: year === orizzonteNum ? finalWithCosts : withCosts,
        withoutCosts,
        costImpact: withoutCosts - (year === orizzonteNum ? finalWithCosts : withCosts),
        cumulativeCosts,
      })
    }

    return data
  }, [capitaleNum, terNum, ingressoNum, uscitaNum, performanceNum, rendimentoNum, orizzonteNum])

  // Calculate comparison data
  const comparisonData = useMemo(() => {
    return funds.map(fund => {
      let value = capitaleNum * (1 - ingressoNum / 100)

      for (let year = 1; year <= orizzonteNum; year++) {
        const grossReturn = value * (rendimentoNum / 100)
        const terCost = value * (fund.ter / 100)
        value = value + grossReturn - terCost
      }

      // Apply exit fee
      value = value * (1 - uscitaNum / 100)

      return {
        name: fund.name,
        ter: fund.ter,
        finalValue: value,
        totalCost: capitaleNum * Math.pow(1 + rendimentoNum / 100, orizzonteNum) - value,
      }
    })
  }, [funds, capitaleNum, ingressoNum, uscitaNum, rendimentoNum, orizzonteNum])

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format percentage
  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value / 100)
  }

  // Final values
  const finalData = yearlyData[yearlyData.length - 1]
  const maxValue = finalData?.withoutCosts || 0

  // Calculate bar heights for chart
  const getBarHeight = (value: number) => {
    if (maxValue === 0) return 0
    return (value / maxValue) * 100
  }

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

  return (
    <main className="min-h-screen bg-cream">
      <Navbar />

      {/* Hero */}
      <section className="bg-forest pt-navbar">
        <div className="container-custom py-16 md:py-24">
          <p className="text-green-300/60 text-sm font-medium tracking-wider uppercase mb-4">
            Analisi costi
          </p>
          <h1 className="font-heading text-[36px] md:text-[48px] text-white leading-tight max-w-3xl">
            Analizzatore Costi Fondi
          </h1>
          <p className="text-lg text-white/60 mt-6 max-w-xl">
            Scopri quanto ti costano davvero fondi ed ETF. Il TER che sembra piccolo puo erodere enormemente i tuoi rendimenti nel tempo.
          </p>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">

            {/* Input Form */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
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
                </div>

                {/* TER */}
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
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-lg"
                      placeholder="1.5"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Costo annuale del fondo (gestione, custodia, amministrazione)
                  </p>
                </div>

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
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-lg"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
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
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-lg"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                </div>

                {/* Commissioni Performance */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Commissioni di performance (opzionale)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={commissioniPerformance}
                      onChange={(e) => setCommissioniPerformance(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-lg"
                      placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">%</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Percentuale applicata sui rendimenti positivi
                  </p>
                </div>

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

                {/* Orizzonte Temporale */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Orizzonte temporale
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={orizzonte}
                      onChange={(e) => setOrizzonte(e.target.value)}
                      className="w-full px-4 py-3 pr-16 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-lg"
                      placeholder="20"
                      min="1"
                      max="50"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">anni</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {/* Main Results Card */}
              <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
                <h2 className="font-heading text-2xl text-forest mb-6">Impatto dei costi</h2>

                {finalData && (
                  <div className="space-y-6">
                    {/* Key Numbers */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Senza costi</p>
                        <p className="text-2xl font-semibold text-green-600">
                          {formatCurrency(finalData.withoutCosts)}
                        </p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4">
                        <p className="text-sm text-gray-500 mb-1">Con i costi</p>
                        <p className="text-2xl font-semibold text-red-600">
                          {formatCurrency(finalData.withCosts)}
                        </p>
                      </div>
                    </div>

                    {/* Cost Impact */}
                    <div className="bg-forest rounded-lg p-6 text-white">
                      <p className="text-sm text-white/60 mb-2">Costi totali in {orizzonteNum} anni</p>
                      <p className="text-4xl font-heading font-semibold mb-2">
                        {formatCurrency(finalData.cumulativeCosts)}
                      </p>
                      <p className="text-sm text-white/70">
                        Hai perso <span className="text-red-300 font-semibold">{formatCurrency(finalData.costImpact)}</span> di potenziali guadagni
                      </p>
                    </div>

                    {/* Percentage Lost */}
                    <div className="border border-red-200 rounded-lg p-4 bg-red-50/50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Rendimento perso a causa dei costi</p>
                          <p className="text-2xl font-bold text-red-600">
                            {((finalData.costImpact / finalData.withoutCosts) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Visual Chart */}
              <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
                <h3 className="font-heading text-xl text-forest mb-6">Crescita del capitale</h3>

                <div className="flex items-end justify-center gap-8 h-48">
                  {/* Without Costs Bar */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-20 bg-green-400 rounded-t-lg transition-all duration-500"
                      style={{ height: `${getBarHeight(finalData?.withoutCosts || 0)}%` }}
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">Senza costi</p>
                    <p className="text-sm font-semibold text-green-600">
                      {formatCurrency(finalData?.withoutCosts || 0)}
                    </p>
                  </div>

                  {/* With Costs Bar */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-20 bg-red-400 rounded-t-lg transition-all duration-500"
                      style={{ height: `${getBarHeight(finalData?.withCosts || 0)}%` }}
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">Con costi</p>
                    <p className="text-sm font-semibold text-red-600">
                      {formatCurrency(finalData?.withCosts || 0)}
                    </p>
                  </div>

                  {/* Difference */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-20 bg-gray-300 rounded-t-lg transition-all duration-500"
                      style={{ height: `${getBarHeight(finalData?.costImpact || 0)}%` }}
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">Perso</p>
                    <p className="text-sm font-semibold text-gray-600">
                      {formatCurrency(finalData?.costImpact || 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Yearly Breakdown Table */}
      <section className="py-8">
        <div className="container-custom">
          <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm overflow-x-auto">
            <h3 className="font-heading text-xl text-forest mb-6">Evoluzione anno per anno</h3>

            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Anno</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Senza costi</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Con costi</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Differenza</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Costi cumulati</th>
                </tr>
              </thead>
              <tbody>
                {yearlyData.filter((_, i) => i < 5 || i === yearlyData.length - 1 || i % 5 === 4).map((data) => (
                  <tr key={data.year} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{data.year}</td>
                    <td className="py-3 px-4 text-right text-green-600">{formatCurrency(data.withoutCosts)}</td>
                    <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(data.withCosts)}</td>
                    <td className="py-3 px-4 text-right text-red-500">-{formatCurrency(data.costImpact)}</td>
                    <td className="py-3 px-4 text-right text-gray-500">{formatCurrency(data.cumulativeCosts)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-8">
        <div className="container-custom">
          <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading text-xl text-forest">Confronta piu fondi</h3>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className="text-green-600 text-sm font-medium hover:text-green-700"
              >
                {showComparison ? 'Nascondi' : 'Mostra confronto'}
              </button>
            </div>

            {showComparison && (
              <div className="space-y-6">
                {/* Fund Inputs */}
                <div className="grid md:grid-cols-3 gap-4">
                  {funds.map((fund, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <input
                        type="text"
                        value={fund.name}
                        onChange={(e) => updateFundName(index, e.target.value)}
                        className="w-full text-sm font-medium text-forest mb-3 border-b border-transparent focus:border-green-400 focus:outline-none pb-1"
                      />
                      <label className="block text-xs text-gray-400 mb-1">TER %</label>
                      <input
                        type="number"
                        step="0.01"
                        value={fund.ter}
                        onChange={(e) => updateFundTer(index, parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>
                  ))}
                </div>

                {/* Comparison Results */}
                <div className="grid md:grid-cols-3 gap-4">
                  {comparisonData.map((fund, index) => (
                    <div
                      key={index}
                      className={`rounded-lg p-5 ${
                        index === comparisonData.reduce((minIdx, curr, currIdx, arr) =>
                          curr.totalCost < arr[minIdx].totalCost ? currIdx : minIdx, 0)
                          ? 'bg-green-50 border-2 border-green-400'
                          : 'bg-gray-50'
                      }`}
                    >
                      <p className="font-medium text-forest mb-1">{fund.name}</p>
                      <p className="text-xs text-gray-400 mb-3">TER: {fund.ter}%</p>
                      <p className="text-2xl font-semibold text-forest mb-1">
                        {formatCurrency(fund.finalValue)}
                      </p>
                      <p className="text-sm text-red-500">
                        Costo totale: {formatCurrency(fund.totalCost)}
                      </p>
                      {index === comparisonData.reduce((minIdx, curr, currIdx, arr) =>
                        curr.totalCost < arr[minIdx].totalCost ? currIdx : minIdx, 0) && (
                        <span className="inline-block mt-2 text-xs bg-green-600 text-white px-2 py-1 rounded">
                          Piu conveniente
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Savings Highlight */}
                {comparisonData.length >= 2 && (
                  <div className="bg-forest rounded-lg p-6 text-white text-center">
                    <p className="text-sm text-white/60 mb-2">Scegliendo il fondo piu economico risparmi</p>
                    <p className="text-3xl font-heading font-semibold">
                      {formatCurrency(
                        Math.max(...comparisonData.map(f => f.totalCost)) -
                        Math.min(...comparisonData.map(f => f.totalCost))
                      )}
                    </p>
                    <p className="text-sm text-white/60 mt-2">in {orizzonteNum} anni</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Info Table */}
      <section className="py-12">
        <div className="container-custom">
          <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
            <h3 className="font-heading text-2xl text-forest mb-2">Costi tipici a confronto</h3>
            <p className="text-gray-500 mb-6">Quanto costa davvero investire in diversi strumenti</p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-forest">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-forest">Tipo di Fondo</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-forest">TER Medio</th>
                    <th className="text-right py-3 px-4 text-sm font-semibold text-forest">Costo su 100k in 20 anni*</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100 hover:bg-green-50">
                    <td className="py-4 px-4">
                      <p className="font-medium">ETF Azionari Globali</p>
                      <p className="text-xs text-gray-400">Es. iShares Core MSCI World</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        0.10% - 0.30%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-green-600">
                      7.000 - 20.000
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-green-50">
                    <td className="py-4 px-4">
                      <p className="font-medium">ETF Obbligazionari</p>
                      <p className="text-xs text-gray-400">Es. Xtrackers Euro Aggregate Bond</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        0.05% - 0.20%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-green-600">
                      3.500 - 14.000
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-yellow-50">
                    <td className="py-4 px-4">
                      <p className="font-medium">Fondi Indicizzati</p>
                      <p className="text-xs text-gray-400">Es. Fidelity Index World</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                        0.30% - 0.60%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-yellow-600">
                      20.000 - 38.000
                    </td>
                  </tr>
                  <tr className="border-b border-gray-100 hover:bg-orange-50">
                    <td className="py-4 px-4">
                      <p className="font-medium">Fondi Attivi Azionari</p>
                      <p className="text-xs text-gray-400">Gestione attiva tradizionale</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                        1.50% - 2.50%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-orange-600">
                      85.000 - 120.000
                    </td>
                  </tr>
                  <tr className="hover:bg-red-50">
                    <td className="py-4 px-4">
                      <p className="font-medium">Polizze Unit Linked</p>
                      <p className="text-xs text-gray-400">Prodotti assicurativi-finanziari</p>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                        2.00% - 3.50%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-red-600">
                      110.000 - 160.000
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              * Calcolato con rendimento lordo 7% annuo. I costi reali possono variare in base alle condizioni di mercato e alle commissioni aggiuntive.
            </p>
          </div>
        </div>
      </section>

      {/* Wake Up Section */}
      <section className="py-12 bg-forest">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl text-white mb-6">
              Stai pagando troppo?
            </h2>
            <p className="text-lg text-white/70 mb-4">
              L80% dei fondi attivi NON batte il benchmark dopo i costi.
            </p>
            <p className="text-white/60 mb-8">
              Un TER dell1.5% sembra poco, ma su 20 anni puo costarti <span className="text-green-300 font-semibold">decine di migliaia di euro</span>.
              Prima di investire, controlla sempre i costi. Ogni decimale conta.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/#contatti"
                className="inline-flex items-center justify-center gap-2 bg-white text-forest px-6 py-3 rounded-lg font-medium hover:bg-cream transition-colors"
              >
                Richiedi consulenza gratuita
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a
                href="/strumenti"
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Altri strumenti
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
