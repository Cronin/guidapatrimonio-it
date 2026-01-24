'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget, FreeToolBanner} from '@/components'

// ETF Data Interface
interface ETF {
  id: string
  ticker: string
  name: string
  issuer: string
  category: 'azionario-globale' | 'sp500' | 'obbligazionario' | 'europa' | 'emergenti'
  ter: number // Total Expense Ratio in percentage
  aum: number // Assets Under Management in billions EUR
  accumulation: boolean // true = accumulating, false = distributing
  domicile: string
  replication: 'fisica' | 'sintetica'
  currency: string
  perf1y?: number // 1 year performance %
  perf3y?: number // 3 year performance %
  perf5y?: number // 5 year performance %
  description: string
}

// ETF Database with realistic data
const etfDatabase: ETF[] = [
  // Azionari Globali
  {
    id: 'vwce',
    ticker: 'VWCE',
    name: 'Vanguard FTSE All-World',
    issuer: 'Vanguard',
    category: 'azionario-globale',
    ter: 0.22,
    aum: 15,
    accumulation: true,
    domicile: 'Irlanda',
    replication: 'fisica',
    currency: 'EUR',
    perf1y: 18.5,
    perf3y: 8.2,
    perf5y: 10.1,
    description: 'Replica l\'indice FTSE All-World, esposizione a circa 4000 titoli azionari globali tra paesi sviluppati ed emergenti.',
  },
  {
    id: 'swda',
    ticker: 'SWDA',
    name: 'iShares Core MSCI World',
    issuer: 'iShares',
    category: 'azionario-globale',
    ter: 0.20,
    aum: 50,
    accumulation: true,
    domicile: 'Irlanda',
    replication: 'fisica',
    currency: 'EUR',
    perf1y: 19.2,
    perf3y: 8.8,
    perf5y: 10.5,
    description: 'Replica l\'indice MSCI World, esposizione a circa 1500 titoli azionari dei paesi sviluppati. Non include emergenti.',
  },
  {
    id: 'iwda',
    ticker: 'IWDA',
    name: 'iShares MSCI World',
    issuer: 'iShares',
    category: 'azionario-globale',
    ter: 0.20,
    aum: 40,
    accumulation: true,
    domicile: 'Irlanda',
    replication: 'fisica',
    currency: 'USD',
    perf1y: 19.0,
    perf3y: 8.6,
    perf5y: 10.4,
    description: 'Versione USD dell\'iShares Core MSCI World. Stesso indice, denominazione diversa.',
  },
  // S&P 500
  {
    id: 'vuaa',
    ticker: 'VUAA',
    name: 'Vanguard S&P 500',
    issuer: 'Vanguard',
    category: 'sp500',
    ter: 0.07,
    aum: 30,
    accumulation: true,
    domicile: 'Irlanda',
    replication: 'fisica',
    currency: 'EUR',
    perf1y: 22.5,
    perf3y: 10.2,
    perf5y: 12.8,
    description: 'Replica l\'S&P 500, le 500 maggiori aziende americane. TER tra i piu bassi del mercato.',
  },
  {
    id: 'cspx',
    ticker: 'CSPX',
    name: 'iShares Core S&P 500',
    issuer: 'iShares',
    category: 'sp500',
    ter: 0.07,
    aum: 60,
    accumulation: true,
    domicile: 'Irlanda',
    replication: 'fisica',
    currency: 'USD',
    perf1y: 22.3,
    perf3y: 10.1,
    perf5y: 12.7,
    description: 'ETF S&P 500 piu grande e liquido. Ideale per esposizione al mercato USA.',
  },
  {
    id: 'sxr8',
    ticker: 'SXR8',
    name: 'iShares S&P 500 EUR Hedged',
    issuer: 'iShares',
    category: 'sp500',
    ter: 0.07,
    aum: 45,
    accumulation: true,
    domicile: 'Germania',
    replication: 'fisica',
    currency: 'EUR',
    perf1y: 21.8,
    perf3y: 9.8,
    perf5y: 12.3,
    description: 'S&P 500 con domicilio tedesco. Stesso TER competitivo di altri ETF S&P 500.',
  },
  // Europa
  {
    id: 'meud',
    ticker: 'MEUD',
    name: 'Amundi MSCI Europe',
    issuer: 'Amundi',
    category: 'europa',
    ter: 0.15,
    aum: 8,
    accumulation: true,
    domicile: 'Lussemburgo',
    replication: 'fisica',
    currency: 'EUR',
    perf1y: 12.3,
    perf3y: 5.8,
    perf5y: 7.2,
    description: 'Esposizione alle principali aziende europee. Include UK.',
  },
  {
    id: 'exsa',
    ticker: 'EXSA',
    name: 'iShares STOXX Europe 600',
    issuer: 'iShares',
    category: 'europa',
    ter: 0.20,
    aum: 6,
    accumulation: true,
    domicile: 'Germania',
    replication: 'fisica',
    currency: 'EUR',
    perf1y: 11.8,
    perf3y: 5.5,
    perf5y: 6.9,
    description: '600 titoli europei per massima diversificazione nel continente.',
  },
  // Emergenti
  {
    id: 'eimi',
    ticker: 'EIMI',
    name: 'iShares Core MSCI EM IMI',
    issuer: 'iShares',
    category: 'emergenti',
    ter: 0.18,
    aum: 15,
    accumulation: true,
    domicile: 'Irlanda',
    replication: 'fisica',
    currency: 'EUR',
    perf1y: 8.5,
    perf3y: 2.1,
    perf5y: 4.3,
    description: 'Mercati emergenti con copertura IMI (small cap incluse). Cina, India, Brasile, Taiwan.',
  },
  {
    id: 'vfem',
    ticker: 'VFEM',
    name: 'Vanguard FTSE Emerging Markets',
    issuer: 'Vanguard',
    category: 'emergenti',
    ter: 0.22,
    aum: 5,
    accumulation: true,
    domicile: 'Irlanda',
    replication: 'fisica',
    currency: 'EUR',
    perf1y: 8.2,
    perf3y: 1.9,
    perf5y: 4.1,
    description: 'ETF emergenti di Vanguard. Alternativa a EIMI con indice FTSE.',
  },
  // Obbligazionari
  {
    id: 'aggh',
    ticker: 'AGGH',
    name: 'iShares Global Aggregate Bond',
    issuer: 'iShares',
    category: 'obbligazionario',
    ter: 0.10,
    aum: 8,
    accumulation: true,
    domicile: 'Irlanda',
    replication: 'fisica',
    currency: 'EUR',
    perf1y: 2.1,
    perf3y: -1.5,
    perf5y: 0.8,
    description: 'Obbligazioni globali investment grade. Diversificazione geografica e per emittente.',
  },
  {
    id: 'vgea',
    ticker: 'VGEA',
    name: 'Vanguard EUR Eurozone Gov Bond',
    issuer: 'Vanguard',
    category: 'obbligazionario',
    ter: 0.07,
    aum: 3,
    accumulation: true,
    domicile: 'Irlanda',
    replication: 'fisica',
    currency: 'EUR',
    perf1y: 3.2,
    perf3y: -2.1,
    perf5y: 0.3,
    description: 'Titoli di stato eurozona. Basso rischio, rendimento legato ai tassi BCE.',
  },
  {
    id: 'xg7s',
    ticker: 'XG7S',
    name: 'Xtrackers II Eurozone Gov Bond 7-10',
    issuer: 'Xtrackers',
    category: 'obbligazionario',
    ter: 0.15,
    aum: 2,
    accumulation: true,
    domicile: 'Lussemburgo',
    replication: 'fisica',
    currency: 'EUR',
    perf1y: 4.5,
    perf3y: -3.2,
    perf5y: 0.1,
    description: 'Titoli di stato eurozona con scadenza 7-10 anni. Maggiore duration, piu sensibile ai tassi.',
  },
]

// Category labels
const categoryLabels: Record<string, string> = {
  'azionario-globale': 'Azionario Globale',
  'sp500': 'S&P 500',
  'europa': 'Europa',
  'emergenti': 'Mercati Emergenti',
  'obbligazionario': 'Obbligazionario',
}

// Category colors
const categoryColors: Record<string, { bg: string; text: string }> = {
  'azionario-globale': { bg: 'bg-gray-100', text: 'text-gray-700' },
  'sp500': { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  'europa': { bg: 'bg-green-100', text: 'text-green-700' },
  'emergenti': { bg: 'bg-amber-100', text: 'text-amber-700' },
  'obbligazionario': { bg: 'bg-gray-100', text: 'text-gray-700' },
}

export default function ConfrontoETF() {
  // Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('tutti')
  const [maxTer, setMaxTer] = useState<number>(0.5)
  const [sortBy, setSortBy] = useState<'ter' | 'aum' | 'perf1y'>('aum')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Comparison state
  const [selectedETFs, setSelectedETFs] = useState<string[]>([])

  // Calculator state
  const [investimento, setInvestimento] = useState<number>(100000)
  const [anni, setAnni] = useState<number>(20)
  const [rendimentoAtteso, setRendimentoAtteso] = useState<number>(7)

  // Filter and sort ETFs
  const filteredETFs = useMemo(() => {
    let etfs = etfDatabase.filter((etf) => {
      if (categoryFilter !== 'tutti' && etf.category !== categoryFilter) return false
      if (etf.ter > maxTer) return false
      return true
    })

    etfs.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'ter':
          comparison = a.ter - b.ter
          break
        case 'aum':
          comparison = a.aum - b.aum
          break
        case 'perf1y':
          comparison = (a.perf1y || 0) - (b.perf1y || 0)
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return etfs
  }, [categoryFilter, maxTer, sortBy, sortDirection])

  // Selected ETFs for comparison
  const comparisonETFs = useMemo(() => {
    return etfDatabase.filter((etf) => selectedETFs.includes(etf.id))
  }, [selectedETFs])

  // Calculate TER impact over time
  const calculateTerImpact = (ter: number) => {
    const r = rendimentoAtteso / 100
    const terDecimal = ter / 100
    const netReturn = r - terDecimal

    // Without TER (gross return)
    const grossValue = investimento * Math.pow(1 + r, anni)
    // With TER (net return)
    const netValue = investimento * Math.pow(1 + netReturn, anni)
    // Cost of TER
    const terCost = grossValue - netValue

    // Annual cost on current investment
    const annualCost = investimento * terDecimal

    return {
      grossValue,
      netValue,
      terCost,
      annualCost,
      terCostPercent: (terCost / grossValue) * 100,
    }
  }

  const toggleETFSelection = (etfId: string) => {
    if (selectedETFs.includes(etfId)) {
      setSelectedETFs(selectedETFs.filter((id) => id !== etfId))
    } else if (selectedETFs.length < 3) {
      setSelectedETFs([...selectedETFs, etfId])
    }
  }

  const toggleSort = (field: 'ter' | 'aum' | 'perf1y') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDirection(field === 'ter' ? 'asc' : 'desc')
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatAUM = (value: number) => {
    return `${value.toFixed(0)}B`
  }

  const formatPercent = (value: number | undefined) => {
    if (value === undefined) return 'N/A'
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  return (
    <main>
      <Navbar />
      <FreeToolBanner />

      {/* Hero */}
      <section className="bg-forest pt-navbar">
        <div className="container-custom py-12">
          <Link
            href="/strumenti"
            className="inline-flex items-center text-green-300 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tutti gli strumenti
          </Link>
          <h1 className="font-heading text-[32px] md:text-[42px] text-white leading-tight">
            Confronto ETF
          </h1>
          <p className="text-white/70 mt-2 max-w-2xl">
            Confronta i principali ETF per scegliere il migliore per il tuo portafoglio.
            Analizza TER, AUM, performance e calcola l&apos;impatto dei costi nel lungo periodo.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          {/* Filters */}
          <div className="bg-white rounded-card p-6 shadow-sm mb-8">
            <h2 className="font-heading text-xl text-forest mb-4">Filtra ETF</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="tutti">Tutte le categorie</option>
                  <option value="azionario-globale">Azionario Globale</option>
                  <option value="sp500">S&P 500</option>
                  <option value="europa">Europa</option>
                  <option value="emergenti">Mercati Emergenti</option>
                  <option value="obbligazionario">Obbligazionario</option>
                </select>
              </div>

              {/* TER Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TER massimo: {maxTer.toFixed(2)}%
                </label>
                <input
                  type="range"
                  min="0.05"
                  max="0.50"
                  step="0.01"
                  value={maxTer}
                  onChange={(e) => setMaxTer(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
              </div>

              {/* Sort */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordina per</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSort('aum')}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                      sortBy === 'aum'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-green-400'
                    }`}
                  >
                    AUM {sortBy === 'aum' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </button>
                  <button
                    onClick={() => toggleSort('ter')}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                      sortBy === 'ter'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-green-400'
                    }`}
                  >
                    TER {sortBy === 'ter' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                  <button
                    onClick={() => toggleSort('perf1y')}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                      sortBy === 'perf1y'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-green-400'
                    }`}
                  >
                    Perf. 1Y {sortBy === 'perf1y' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results count and selection info */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">
              {filteredETFs.length} ETF trovati su {etfDatabase.length}
            </p>
            <p className="text-sm text-green-600">
              {selectedETFs.length}/3 selezionati per confronto
            </p>
          </div>

          {/* ETF Table */}
          <div className="bg-white rounded-card shadow-sm overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-forest text-white">
                  <tr>
                    <th className="text-left px-4 py-4 font-heading font-medium w-10"></th>
                    <th className="text-left px-4 py-4 font-heading font-medium">ETF</th>
                    <th className="text-center px-4 py-4 font-heading font-medium">Categoria</th>
                    <th className="text-right px-4 py-4 font-heading font-medium cursor-pointer hover:bg-green-600 transition-colors" onClick={() => toggleSort('ter')}>
                      TER {sortBy === 'ter' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-right px-4 py-4 font-heading font-medium cursor-pointer hover:bg-green-600 transition-colors" onClick={() => toggleSort('aum')}>
                      AUM {sortBy === 'aum' && (sortDirection === 'desc' ? '↓' : '↑')}
                    </th>
                    <th className="text-center px-4 py-4 font-heading font-medium">Tipo</th>
                    <th className="text-right px-4 py-4 font-heading font-medium cursor-pointer hover:bg-green-600 transition-colors hidden md:table-cell" onClick={() => toggleSort('perf1y')}>
                      Perf. 1Y {sortBy === 'perf1y' && (sortDirection === 'desc' ? '↓' : '↑')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredETFs.map((etf, index) => (
                    <tr
                      key={etf.id}
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                        selectedETFs.includes(etf.id) ? 'bg-green-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                      }`}
                      onClick={() => toggleETFSelection(etf.id)}
                    >
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedETFs.includes(etf.id)}
                          onChange={() => {}}
                          disabled={!selectedETFs.includes(etf.id) && selectedETFs.length >= 3}
                          className="w-4 h-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-heading text-forest font-medium">{etf.ticker}</p>
                          <p className="text-sm text-gray-500">{etf.name}</p>
                          <p className="text-xs text-gray-400">{etf.issuer} - {etf.domicile}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${categoryColors[etf.category].bg} ${categoryColors[etf.category].text}`}>
                          {categoryLabels[etf.category]}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={`font-medium ${etf.ter <= 0.10 ? 'text-green-600' : etf.ter <= 0.20 ? 'text-forest' : 'text-amber-600'}`}>
                          {etf.ter.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="font-medium text-forest">{formatAUM(etf.aum)}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${etf.accumulation ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-700'}`}>
                          {etf.accumulation ? 'Acc' : 'Dist'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right hidden md:table-cell">
                        <span className={`font-medium ${(etf.perf1y || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercent(etf.perf1y)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Side-by-Side Comparison */}
          {comparisonETFs.length >= 2 && (
            <div className="bg-white rounded-card p-6 shadow-sm mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-xl text-forest">Confronto Side-by-Side</h2>
                <button
                  onClick={() => setSelectedETFs([])}
                  className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                  Cancella selezione
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-forest">
                      <th className="text-left py-3 text-gray-500 font-medium">Caratteristica</th>
                      {comparisonETFs.map((etf) => (
                        <th key={etf.id} className="text-center py-3 font-heading text-forest">
                          {etf.ticker}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">Nome completo</td>
                      {comparisonETFs.map((etf) => (
                        <td key={etf.id} className="py-3 text-center text-sm">{etf.name}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="py-3 text-gray-600">Emittente</td>
                      {comparisonETFs.map((etf) => (
                        <td key={etf.id} className="py-3 text-center">{etf.issuer}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600 font-medium">TER</td>
                      {comparisonETFs.map((etf) => {
                        const minTer = Math.min(...comparisonETFs.map(e => e.ter))
                        return (
                          <td key={etf.id} className={`py-3 text-center font-medium ${etf.ter === minTer ? 'text-green-600' : 'text-forest'}`}>
                            {etf.ter.toFixed(2)}%
                            {etf.ter === minTer && <span className="ml-1 text-xs">*</span>}
                          </td>
                        )
                      })}
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="py-3 text-gray-600 font-medium">AUM</td>
                      {comparisonETFs.map((etf) => {
                        const maxAum = Math.max(...comparisonETFs.map(e => e.aum))
                        return (
                          <td key={etf.id} className={`py-3 text-center font-medium ${etf.aum === maxAum ? 'text-green-600' : 'text-forest'}`}>
                            {formatAUM(etf.aum)}
                            {etf.aum === maxAum && <span className="ml-1 text-xs">*</span>}
                          </td>
                        )
                      })}
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">Tipo</td>
                      {comparisonETFs.map((etf) => (
                        <td key={etf.id} className="py-3 text-center">
                          {etf.accumulation ? 'Accumulazione' : 'Distribuzione'}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="py-3 text-gray-600">Domicilio</td>
                      {comparisonETFs.map((etf) => (
                        <td key={etf.id} className="py-3 text-center">{etf.domicile}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">Valuta</td>
                      {comparisonETFs.map((etf) => (
                        <td key={etf.id} className="py-3 text-center">{etf.currency}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="py-3 text-gray-600">Replicazione</td>
                      {comparisonETFs.map((etf) => (
                        <td key={etf.id} className="py-3 text-center capitalize">{etf.replication}</td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">Performance 1Y</td>
                      {comparisonETFs.map((etf) => (
                        <td key={etf.id} className={`py-3 text-center font-medium ${(etf.perf1y || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercent(etf.perf1y)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <td className="py-3 text-gray-600">Performance 3Y (ann.)</td>
                      {comparisonETFs.map((etf) => (
                        <td key={etf.id} className={`py-3 text-center font-medium ${(etf.perf3y || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercent(etf.perf3y)}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-gray-600">Performance 5Y (ann.)</td>
                      {comparisonETFs.map((etf) => (
                        <td key={etf.id} className={`py-3 text-center font-medium ${(etf.perf5y || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatPercent(etf.perf5y)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-4">* Valore migliore nel confronto</p>
            </div>
          )}

          {/* TER Impact Calculator */}
          <div className="bg-white rounded-card p-6 shadow-sm mb-8">
            <h2 className="font-heading text-xl text-forest mb-4">
              Calcolatore Impatto TER
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Scopri quanto ti costa il TER nel lungo periodo. Anche piccole differenze hanno un impatto enorme con l&apos;interesse composto.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investimento iniziale: {formatCurrency(investimento)}
                </label>
                <input
                  type="range"
                  min="10000"
                  max="500000"
                  step="10000"
                  value={investimento}
                  onChange={(e) => setInvestimento(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orizzonte temporale: {anni} anni
                </label>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="5"
                  value={anni}
                  onChange={(e) => setAnni(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rendimento lordo atteso: {rendimentoAtteso}%
                </label>
                <input
                  type="range"
                  min="3"
                  max="12"
                  step="0.5"
                  value={rendimentoAtteso}
                  onChange={(e) => setRendimentoAtteso(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
              </div>
            </div>

            {/* TER Impact Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[0.07, 0.10, 0.20, 0.30].map((ter) => {
                const impact = calculateTerImpact(ter)
                return (
                  <div
                    key={ter}
                    className={`border rounded-lg p-4 ${ter === 0.07 ? 'border-green-400 bg-green-50' : 'border-gray-200'}`}
                  >
                    <p className="text-sm text-gray-500 mb-1">TER {ter.toFixed(2)}%</p>
                    <p className="font-heading text-lg text-forest mb-2">
                      {formatCurrency(impact.netValue)}
                    </p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Costo TER totale</span>
                        <span className="text-red-600 font-medium">-{formatCurrency(impact.terCost)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Costo annuo su {formatCurrency(investimento)}</span>
                        <span className="text-gray-700">{formatCurrency(impact.annualCost)}/anno</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Esempio concreto:</strong> Su {formatCurrency(investimento)} investiti per {anni} anni al {rendimentoAtteso}% lordo,
                la differenza tra un ETF allo 0.07% e uno allo 0.30% di TER e di{' '}
                <strong>{formatCurrency(calculateTerImpact(0.30).terCost - calculateTerImpact(0.07).terCost)}</strong> a tuo sfavore.
              </p>
            </div>
          </div>

          {/* Info Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">Come leggere i dati</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">TER</span>
                  <span>Total Expense Ratio: costo annuo dell&apos;ETF in % sul patrimonio. Piu basso = meglio.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">AUM</span>
                  <span>Assets Under Management: patrimonio gestito. ETF piu grandi = piu liquidi e stabili.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">Acc/Dist</span>
                  <span>Accumulazione reinveste i dividendi. Distribuzione li paga (tassati al 26%).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold">Domicilio</span>
                  <span>Irlanda e Lussemburgo offrono vantaggi fiscali per investitori europei.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">Consigli per la scelta</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Per la maggior parte degli investitori, un ETF globale (VWCE, SWDA) e sufficiente.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Preferisci ETF ad accumulazione per efficienza fiscale (no tasse sui dividendi).</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>A parita di indice, scegli quello con TER piu basso e AUM piu alto.</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>La performance passata non garantisce quella futura. Guarda i fondamentali.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-forest mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-gray-800 font-medium">Nota informativa</p>
                <p className="text-sm text-gray-700 mt-1">
                  I dati sono indicativi e potrebbero non essere aggiornati. I rendimenti passati non sono indicativi
                  di quelli futuri. Prima di investire, verifica sempre i dati ufficiali su{' '}
                  <a href="https://www.justetf.com/it/" target="_blank" rel="noopener noreferrer" className="underline">justETF</a> o sul sito dell&apos;emittente.
                  Questo strumento non costituisce consulenza finanziaria.
                </p>
              </div>
            </div>
          </div>

          {/* Related Tools */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/strumenti/pac"
              className="group bg-white rounded-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2 group-hover:text-green-600 transition-colors">
                Simulatore PAC
              </h3>
              <p className="text-sm text-gray-500">
                Calcola quanto puoi accumulare investendo regolarmente in ETF.
              </p>
            </Link>

            <Link
              href="/strumenti/interesse-composto"
              className="group bg-white rounded-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-forest mb-4 group-hover:bg-forest group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2 group-hover:text-green-600 transition-colors">
                Calcolatore Interesse Composto
              </h3>
              <p className="text-sm text-gray-500">
                Scopri il potere dell&apos;interesse composto sui tuoi investimenti.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Vuoi costruire un portafoglio ETF ottimizzato?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente finanziario indipendente puo aiutarti a scegliere gli ETF giusti
            per i tuoi obiettivi, senza conflitti di interesse.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom py-8">
        <RatingWidget toolSlug="confronto-etf" toolName="confronto-etf" />
      </div>

      <Footer />
    </main>
  )
}
