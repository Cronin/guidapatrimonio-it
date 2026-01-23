'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer } from '@/components'

interface Posizione {
  id: string
  nome: string
  ticker: string
  quantita: number
  prezzoCarico: number
  prezzoAttuale: number
  dataAcquisto: string
}

const STORAGE_KEY = 'guidapatrimonio_portfolio'

// Colori per il grafico a torta
const COLORI_TORTA = [
  '#1B4D3E', // forest
  '#2D6A4F', // green-600
  '#40916C', // green-400
  '#52B788', // green-300
  '#74C69D', // green-250
  '#95D5B2', // green-200
  '#D4A373', // gold
  '#878d96', // gray-400
  '#5e646e', // gray-500
  '#b0b7c1', // gray-300
]

export default function PortfolioTracker() {
  const [posizioni, setPosizioni] = useState<Posizione[]>([])
  const [mounted, setMounted] = useState(false)

  // Form state
  const [nome, setNome] = useState('')
  const [ticker, setTicker] = useState('')
  const [quantita, setQuantita] = useState('')
  const [prezzoCarico, setPrezzoCarico] = useState('')
  const [prezzoAttuale, setPrezzoAttuale] = useState('')
  const [dataAcquisto, setDataAcquisto] = useState('')

  // Sort state
  const [sortBy, setSortBy] = useState<'nome' | 'valore' | 'pl' | 'peso'>('valore')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setPosizioni(JSON.parse(stored))
      } catch (e) {
        console.error('Errore nel caricamento del portfolio:', e)
      }
    }
  }, [])

  // Save to localStorage when posizioni changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posizioni))
    }
  }, [posizioni, mounted])

  // Calcoli portafoglio
  const stats = useMemo(() => {
    if (posizioni.length === 0) {
      return {
        valoreAttuale: 0,
        costoTotale: 0,
        plTotale: 0,
        plPercentuale: 0,
        posizioniOrdinati: [],
      }
    }

    const valoreAttuale = posizioni.reduce((acc, p) => acc + p.quantita * p.prezzoAttuale, 0)
    const costoTotale = posizioni.reduce((acc, p) => acc + p.quantita * p.prezzoCarico, 0)
    const plTotale = valoreAttuale - costoTotale
    const plPercentuale = costoTotale > 0 ? (plTotale / costoTotale) * 100 : 0

    // Aggiungi calcoli per ogni posizione
    const posizioniConCalcoli = posizioni.map(p => {
      const valore = p.quantita * p.prezzoAttuale
      const costo = p.quantita * p.prezzoCarico
      const pl = valore - costo
      const plPercent = costo > 0 ? (pl / costo) * 100 : 0
      const peso = valoreAttuale > 0 ? (valore / valoreAttuale) * 100 : 0
      return { ...p, valore, costo, pl, plPercent, peso }
    })

    // Ordina
    const posizioniOrdinati = [...posizioniConCalcoli].sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'nome':
          comparison = a.nome.localeCompare(b.nome)
          break
        case 'valore':
          comparison = a.valore - b.valore
          break
        case 'pl':
          comparison = a.pl - b.pl
          break
        case 'peso':
          comparison = a.peso - b.peso
          break
      }
      return sortDir === 'asc' ? comparison : -comparison
    })

    return {
      valoreAttuale,
      costoTotale,
      plTotale,
      plPercentuale,
      posizioniOrdinati,
    }
  }, [posizioni, sortBy, sortDir])

  const handleSort = (column: 'nome' | 'valore' | 'pl' | 'peso') => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDir('desc')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!nome || !quantita || !prezzoCarico || !prezzoAttuale) {
      alert('Compila almeno Nome, Quantita, Prezzo di carico e Prezzo attuale')
      return
    }

    const nuovaPosizione: Posizione = {
      id: Date.now().toString(),
      nome,
      ticker: ticker || '',
      quantita: parseFloat(quantita),
      prezzoCarico: parseFloat(prezzoCarico),
      prezzoAttuale: parseFloat(prezzoAttuale),
      dataAcquisto: dataAcquisto || new Date().toISOString().split('T')[0],
    }

    setPosizioni([...posizioni, nuovaPosizione])

    // Reset form
    setNome('')
    setTicker('')
    setQuantita('')
    setPrezzoCarico('')
    setPrezzoAttuale('')
    setDataAcquisto('')
  }

  const handleRemove = (id: string) => {
    if (confirm('Sei sicuro di voler rimuovere questa posizione?')) {
      setPosizioni(posizioni.filter(p => p.id !== id))
    }
  }

  const handleUpdatePrezzo = (id: string, nuovoPrezzo: string) => {
    const prezzo = parseFloat(nuovoPrezzo)
    if (isNaN(prezzo) || prezzo < 0) return

    setPosizioni(posizioni.map(p =>
      p.id === id ? { ...p, prezzoAttuale: prezzo } : p
    ))
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : ''
    return `${sign}${value.toFixed(2)}%`
  }

  // Non renderizzare nulla finche non siamo montati (per evitare hydration mismatch)
  if (!mounted) {
    return (
      <main>
        <Navbar />
        <section className="bg-forest pt-navbar">
          <div className="container-custom py-12">
            <h1 className="font-heading text-[32px] md:text-[42px] text-white leading-tight">
              Portfolio Tracker Gratuito
            </h1>
          </div>
        </section>
        <section className="section-md bg-cream min-h-[60vh]">
          <div className="container-custom">
            <div className="text-center py-20">
              <p className="text-gray-500">Caricamento...</p>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

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
            Portfolio Tracker Gratuito
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Traccia i tuoi investimenti in azioni, ETF, fondi e obbligazioni. Calcola rendimento, P&amp;L e composizione del portafoglio. Alternativa gratuita a JustETF e Wallible.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-green-600 rounded-card p-5 text-white">
              <p className="text-green-100 text-sm mb-1">Valore Portafoglio</p>
              <p className="font-heading text-xl md:text-2xl">{formatCurrency(stats.valoreAttuale)}</p>
            </div>
            <div className="bg-white rounded-card p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Costo Totale</p>
              <p className="font-heading text-xl md:text-2xl text-forest">{formatCurrency(stats.costoTotale)}</p>
            </div>
            <div className="bg-white rounded-card p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">P&amp;L Totale</p>
              <p className={`font-heading text-xl md:text-2xl ${stats.plTotale >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.plTotale >= 0 ? '+' : ''}{formatCurrency(stats.plTotale)}
              </p>
            </div>
            <div className="bg-white rounded-card p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Rendimento %</p>
              <p className={`font-heading text-xl md:text-2xl ${stats.plPercentuale >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(stats.plPercentuale)}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Aggiungi Posizione */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-card p-6 shadow-sm sticky top-24">
                <h2 className="font-heading text-xl text-forest mb-6">Aggiungi Posizione</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Asset *
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="es. Vanguard FTSE All-World"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ticker / ISIN
                    </label>
                    <input
                      type="text"
                      value={ticker}
                      onChange={(e) => setTicker(e.target.value.toUpperCase())}
                      placeholder="es. VWCE o IE00BK5BQT80"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantita *
                      </label>
                      <input
                        type="number"
                        value={quantita}
                        onChange={(e) => setQuantita(e.target.value)}
                        placeholder="10"
                        step="0.0001"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prezzo Carico *
                      </label>
                      <input
                        type="number"
                        value={prezzoCarico}
                        onChange={(e) => setPrezzoCarico(e.target.value)}
                        placeholder="100.00"
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prezzo Attuale *
                      </label>
                      <input
                        type="number"
                        value={prezzoAttuale}
                        onChange={(e) => setPrezzoAttuale(e.target.value)}
                        placeholder="105.50"
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data Acquisto
                      </label>
                      <input
                        type="date"
                        value={dataAcquisto}
                        onChange={(e) => setDataAcquisto(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    + Aggiungi Posizione
                  </button>
                </form>

                <p className="text-xs text-gray-400 mt-4">
                  * I dati sono salvati solo nel tuo browser (localStorage). Non condividiamo nulla.
                </p>
              </div>
            </div>

            {/* Lista Posizioni e Grafici */}
            <div className="lg:col-span-2 space-y-6">
              {posizioni.length === 0 ? (
                <div className="bg-white rounded-card p-12 shadow-sm text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl text-forest mb-2">Il tuo portafoglio e vuoto</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Aggiungi la tua prima posizione usando il form a sinistra. Puoi tracciare azioni, ETF, fondi, obbligazioni e qualsiasi altro strumento finanziario.
                  </p>
                </div>
              ) : (
                <>
                  {/* Grafico a Torta Composizione */}
                  <div className="bg-white rounded-card p-6 shadow-sm">
                    <h3 className="font-heading text-lg text-forest mb-4">Composizione Portafoglio</h3>
                    <div className="flex flex-col md:flex-row items-center gap-6">
                      {/* Pie Chart */}
                      <div className="relative w-48 h-48">
                        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                          {(() => {
                            let cumulativePercent = 0
                            return stats.posizioniOrdinati.map((p, i) => {
                              const percent = p.peso
                              const startPercent = cumulativePercent
                              cumulativePercent += percent

                              // Calcolo per arco SVG
                              const startAngle = (startPercent / 100) * 2 * Math.PI
                              const endAngle = (cumulativePercent / 100) * 2 * Math.PI

                              const x1 = 50 + 40 * Math.cos(startAngle)
                              const y1 = 50 + 40 * Math.sin(startAngle)
                              const x2 = 50 + 40 * Math.cos(endAngle)
                              const y2 = 50 + 40 * Math.sin(endAngle)

                              const largeArcFlag = percent > 50 ? 1 : 0

                              return (
                                <path
                                  key={p.id}
                                  d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                                  fill={COLORI_TORTA[i % COLORI_TORTA.length]}
                                  className="transition-opacity hover:opacity-80"
                                />
                              )
                            })
                          })()}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-xs text-gray-500">Totale</p>
                            <p className="font-heading text-sm text-forest">{posizioni.length}</p>
                            <p className="text-xs text-gray-400">posizioni</p>
                          </div>
                        </div>
                      </div>

                      {/* Legenda */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {stats.posizioniOrdinati.map((p, i) => (
                          <div key={p.id} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-sm flex-shrink-0"
                              style={{ backgroundColor: COLORI_TORTA[i % COLORI_TORTA.length] }}
                            />
                            <span className="text-sm text-gray-700 truncate">{p.nome}</span>
                            <span className="text-sm text-gray-400 ml-auto">{p.peso.toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Lista Posizioni */}
                  <div className="bg-white rounded-card p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading text-lg text-forest">Le tue posizioni</h3>
                      <span className="text-sm text-gray-500">{posizioni.length} asset</span>
                    </div>

                    {/* Header ordinamento */}
                    <div className="hidden md:grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium pb-2 border-b mb-2">
                      <button
                        onClick={() => handleSort('nome')}
                        className="col-span-3 text-left hover:text-forest flex items-center gap-1"
                      >
                        Asset {sortBy === 'nome' && (sortDir === 'asc' ? '↑' : '↓')}
                      </button>
                      <div className="col-span-2 text-right">Quantita</div>
                      <button
                        onClick={() => handleSort('valore')}
                        className="col-span-2 text-right hover:text-forest flex items-center justify-end gap-1"
                      >
                        Valore {sortBy === 'valore' && (sortDir === 'asc' ? '↑' : '↓')}
                      </button>
                      <button
                        onClick={() => handleSort('pl')}
                        className="col-span-2 text-right hover:text-forest flex items-center justify-end gap-1"
                      >
                        P&amp;L {sortBy === 'pl' && (sortDir === 'asc' ? '↑' : '↓')}
                      </button>
                      <button
                        onClick={() => handleSort('peso')}
                        className="col-span-2 text-right hover:text-forest flex items-center justify-end gap-1"
                      >
                        Peso {sortBy === 'peso' && (sortDir === 'asc' ? '↑' : '↓')}
                      </button>
                      <div className="col-span-1"></div>
                    </div>

                    <div className="space-y-3">
                      {stats.posizioniOrdinati.map((p, i) => (
                        <div
                          key={p.id}
                          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                        >
                          {/* Mobile View */}
                          <div className="md:hidden space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-3 h-3 rounded-sm flex-shrink-0"
                                    style={{ backgroundColor: COLORI_TORTA[i % COLORI_TORTA.length] }}
                                  />
                                  <span className="font-medium text-forest">{p.nome}</span>
                                </div>
                                {p.ticker && (
                                  <span className="text-xs text-gray-400 ml-5">{p.ticker}</span>
                                )}
                              </div>
                              <button
                                onClick={() => handleRemove(p.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                title="Rimuovi"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-gray-500 text-xs">Quantita</p>
                                <p className="font-medium">{p.quantita}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Valore</p>
                                <p className="font-medium">{formatCurrency(p.valore)}</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">P&amp;L</p>
                                <p className={`font-medium ${p.pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {p.pl >= 0 ? '+' : ''}{formatCurrency(p.pl)} ({formatPercent(p.plPercent)})
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-xs">Peso</p>
                                <p className="font-medium">{p.peso.toFixed(1)}%</p>
                              </div>
                            </div>

                            {/* Barra P&L */}
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${p.pl >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                style={{
                                  width: `${Math.min(Math.abs(p.plPercent), 100)}%`,
                                  marginLeft: p.pl < 0 ? 'auto' : 0,
                                }}
                              />
                            </div>

                            {/* Aggiorna prezzo */}
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">Prezzo attuale:</span>
                              <input
                                type="number"
                                value={p.prezzoAttuale}
                                onChange={(e) => handleUpdatePrezzo(p.id, e.target.value)}
                                step="0.01"
                                min="0"
                                className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-green-500"
                              />
                            </div>
                          </div>

                          {/* Desktop View */}
                          <div className="hidden md:grid grid-cols-12 gap-2 items-center">
                            <div className="col-span-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-sm flex-shrink-0"
                                  style={{ backgroundColor: COLORI_TORTA[i % COLORI_TORTA.length] }}
                                />
                                <div className="min-w-0">
                                  <p className="font-medium text-forest truncate">{p.nome}</p>
                                  {p.ticker && (
                                    <p className="text-xs text-gray-400">{p.ticker}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-span-2 text-right">
                              <p className="font-medium">{p.quantita}</p>
                              <div className="flex items-center justify-end gap-1">
                                <span className="text-xs text-gray-400">@</span>
                                <input
                                  type="number"
                                  value={p.prezzoAttuale}
                                  onChange={(e) => handleUpdatePrezzo(p.id, e.target.value)}
                                  step="0.01"
                                  min="0"
                                  className="w-20 px-1 py-0.5 text-xs border border-gray-300 rounded text-right focus:ring-1 focus:ring-green-500"
                                />
                              </div>
                            </div>
                            <div className="col-span-2 text-right">
                              <p className="font-medium">{formatCurrency(p.valore)}</p>
                              <p className="text-xs text-gray-400">costo: {formatCurrency(p.costo)}</p>
                            </div>
                            <div className="col-span-2 text-right">
                              <p className={`font-medium ${p.pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {p.pl >= 0 ? '+' : ''}{formatCurrency(p.pl)}
                              </p>
                              <p className={`text-xs ${p.pl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {formatPercent(p.plPercent)}
                              </p>
                            </div>
                            <div className="col-span-2">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${p.pl >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                                    style={{ width: `${p.peso}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-600 w-12 text-right">{p.peso.toFixed(1)}%</span>
                              </div>
                            </div>
                            <div className="col-span-1 text-right">
                              <button
                                onClick={() => handleRemove(p.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                title="Rimuovi"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Barra per ogni asset con P&L colorato */}
                  <div className="bg-white rounded-card p-6 shadow-sm">
                    <h3 className="font-heading text-lg text-forest mb-4">Performance per Asset</h3>
                    <div className="space-y-3">
                      {stats.posizioniOrdinati.map((p) => (
                        <div key={p.id}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[60%]">{p.nome}</span>
                            <span className={`text-sm font-semibold ${p.pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatPercent(p.plPercent)}
                            </span>
                          </div>
                          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
                            {/* Barra centrata a 50% come punto zero */}
                            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300" />
                            {p.pl >= 0 ? (
                              <div
                                className="absolute top-0 bottom-0 bg-green-500 rounded-r-full"
                                style={{
                                  left: '50%',
                                  width: `${Math.min(p.plPercent / 2, 50)}%`,
                                }}
                              />
                            ) : (
                              <div
                                className="absolute top-0 bottom-0 bg-red-500 rounded-l-full"
                                style={{
                                  right: '50%',
                                  width: `${Math.min(Math.abs(p.plPercent) / 2, 50)}%`,
                                }}
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-3">
                      <span>-100%</span>
                      <span>0%</span>
                      <span>+100%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="mt-12 bg-white rounded-card p-6 shadow-sm">
            <h2 className="font-heading text-xl text-forest mb-4">Perche usare un Portfolio Tracker?</h2>
            <div className="prose prose-sm text-gray-600 max-w-none">
              <p>
                Un <strong>portfolio tracker</strong> ti permette di avere sempre sotto controllo i tuoi investimenti,
                monitorare le performance e capire come e composto il tuo patrimonio finanziario.
              </p>

              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-heading text-lg text-forest mt-0 mb-2">Controllo Totale</h3>
                  <p className="text-sm m-0">
                    Visualizza il valore di tutti i tuoi investimenti in un unico posto, indipendentemente da dove li detieni.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-heading text-lg text-forest mt-0 mb-2">Performance Reali</h3>
                  <p className="text-sm m-0">
                    Calcola il rendimento effettivo considerando prezzo di carico e prezzo attuale. Conosci sempre il tuo P&amp;L.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-heading text-lg text-forest mt-0 mb-2">Diversificazione</h3>
                  <p className="text-sm m-0">
                    Analizza la composizione del portafoglio per verificare se la tua asset allocation e bilanciata.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-800 m-0">
                  <strong>Privacy garantita:</strong> I dati del tuo portafoglio sono salvati solo nel tuo browser (localStorage).
                  Non vengono inviati a nessun server e non condividiamo nulla con terze parti.
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
            Vuoi ottimizzare il tuo portafoglio?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente finanziario indipendente puo aiutarti a riequilibrare il portafoglio,
            ridurre i costi e massimizzare i rendimenti.
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
