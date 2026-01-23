'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Navbar, Footer } from '@/components'

interface MacroData {
  spreadBtpBund: {
    value: number
    change: number
    lastUpdate: string
  }
  tassiBce: {
    depositi: number
    rifinanziamento: number
    lastUpdate: string
  }
  inflazioneItalia: {
    value: number
    month: string
    lastUpdate: string
  }
  ftseMib: {
    value: number
    change: number
    changePercent: number
    lastUpdate: string
  }
  btp10y: {
    value: number
    change: number
    lastUpdate: string
  }
  forex: {
    eurUsd: number
    eurUsdChange: number
    eurChf: number
    eurChfChange: number
    lastUpdate: string
  }
}

interface ApiResponse {
  success: boolean
  data: MacroData
  cached: boolean
  fetchedAt: string
}

export default function DashboardMacro() {
  const [data, setData] = useState<MacroData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastFetch, setLastFetch] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/macro-data')
      const result: ApiResponse = await response.json()

      if (result.success) {
        setData(result.data)
        setLastFetch(new Date(result.fetchedAt))
      } else {
        setError('Errore nel caricamento dei dati')
      }
    } catch {
      setError('Errore di connessione')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()

    // Auto-refresh ogni 5 minuti
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  const formatNumber = (num: number, decimals = 2) => {
    return new Intl.NumberFormat('it-IT', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num)
  }

  const formatPercent = (num: number) => {
    const sign = num >= 0 ? '+' : ''
    return `${sign}${formatNumber(num, 2)}%`
  }

  const formatChange = (num: number, suffix = '') => {
    const sign = num >= 0 ? '+' : ''
    return `${sign}${formatNumber(num, 2)}${suffix}`
  }

  const getChangeColor = (change: number, inverted = false) => {
    if (change === 0) return 'text-gray-400'
    const isPositive = inverted ? change < 0 : change >= 0
    return isPositive ? 'text-emerald-400' : 'text-red-400'
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Sparkline component (simplified bar chart)
  const Sparkline = ({ positive }: { positive: boolean }) => (
    <div className="flex items-end gap-0.5 h-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={`w-1 rounded-sm ${positive ? 'bg-emerald-500/60' : 'bg-red-500/60'}`}
          style={{
            height: `${Math.random() * 60 + 40}%`,
          }}
        />
      ))}
    </div>
  )

  return (
    <main className="min-h-screen bg-[#0a0e14]">
      <Navbar />

      {/* Terminal Header */}
      <section className="pt-navbar border-b border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Link
                href="/strumenti"
                className="inline-flex items-center text-gray-500 hover:text-emerald-400 mb-3 transition-colors text-sm font-mono"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                ../strumenti
              </Link>
              <h1 className="font-mono text-2xl md:text-3xl text-white tracking-tight">
                MACRO ITALIA <span className="text-emerald-400">TERMINAL</span>
              </h1>
              <p className="text-gray-500 font-mono text-sm mt-1">
                Indicatori macroeconomici in tempo reale
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded font-mono text-sm transition-colors disabled:opacity-50"
              >
                <svg
                  className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                REFRESH
              </button>
              {lastFetch && (
                <div className="text-gray-500 font-mono text-xs">
                  UPD: {formatTime(lastFetch)}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Status Bar */}
      <div className="border-b border-gray-800 bg-[#0d1117]">
        <div className="container-custom py-2">
          <div className="flex items-center gap-6 text-xs font-mono overflow-x-auto">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : error ? 'bg-red-400' : 'bg-emerald-400'}`} />
              <span className="text-gray-500">
                {loading ? 'FETCHING...' : error ? 'ERROR' : 'LIVE'}
              </span>
            </div>
            <div className="text-gray-600">|</div>
            <div className="text-gray-500">
              BORSA ITALIANA <span className="text-emerald-400">APERTA</span>
            </div>
            <div className="text-gray-600">|</div>
            <div className="text-gray-500">
              {new Date().toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <section className="py-8">
        <div className="container-custom">
          {error && !data && (
            <div className="bg-red-900/20 border border-red-800 rounded p-4 mb-6 text-red-400 font-mono text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* SPREAD BTP-BUND */}
            <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-500 font-mono text-xs uppercase tracking-wider">Spread BTP-Bund</p>
                  <p className="text-gray-600 font-mono text-[10px]">basis points</p>
                </div>
                <Sparkline positive={(data?.spreadBtpBund.change ?? 0) < 0} />
              </div>
              <div className="flex items-end gap-3">
                <span className="font-mono text-4xl text-white font-bold">
                  {loading ? '---' : data?.spreadBtpBund.value ?? '---'}
                </span>
                {data && (
                  <span className={`font-mono text-sm mb-1 ${getChangeColor(data.spreadBtpBund.change, true)}`}>
                    {formatChange(data.spreadBtpBund.change, ' bp')}
                  </span>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-800">
                <p className="text-gray-600 font-mono text-[10px]">
                  Differenziale rendimento titoli di stato Italia vs Germania
                </p>
              </div>
            </div>

            {/* TASSI BCE */}
            <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-500 font-mono text-xs uppercase tracking-wider">Tassi BCE</p>
                  <p className="text-gray-600 font-mono text-[10px]">European Central Bank</p>
                </div>
                <svg className="w-8 h-8 text-blue-500/50" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-mono text-sm">Depositi</span>
                  <span className="font-mono text-2xl text-cyan-400">
                    {loading ? '-.--%' : `${formatNumber(data?.tassiBce.depositi ?? 0)}%`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-mono text-sm">Rifinanziamento</span>
                  <span className="font-mono text-2xl text-cyan-400">
                    {loading ? '-.--%' : `${formatNumber(data?.tassiBce.rifinanziamento ?? 0)}%`}
                  </span>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-800">
                <p className="text-gray-600 font-mono text-[10px]">
                  Tassi di riferimento politica monetaria
                </p>
              </div>
            </div>

            {/* INFLAZIONE ITALIA */}
            <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-500 font-mono text-xs uppercase tracking-wider">Inflazione Italia</p>
                  <p className="text-gray-600 font-mono text-[10px]">ISTAT - CPI YoY</p>
                </div>
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500/10">
                  <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="flex items-end gap-3">
                <span className="font-mono text-4xl text-orange-400 font-bold">
                  {loading ? '-.-' : formatNumber(data?.inflazioneItalia.value ?? 0, 1)}
                </span>
                <span className="font-mono text-xl text-orange-400 mb-1">%</span>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-800">
                <p className="text-gray-600 font-mono text-[10px]">
                  {data?.inflazioneItalia.month ?? 'Dato mensile ISTAT'}
                </p>
              </div>
            </div>

            {/* FTSE MIB */}
            <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-500 font-mono text-xs uppercase tracking-wider">FTSE MIB</p>
                  <p className="text-gray-600 font-mono text-[10px]">Borsa Italiana</p>
                </div>
                <Sparkline positive={(data?.ftseMib.change ?? 0) >= 0} />
              </div>
              <div className="flex items-end gap-3">
                <span className="font-mono text-4xl text-white font-bold">
                  {loading ? '-----' : formatNumber(data?.ftseMib.value ?? 0, 0)}
                </span>
              </div>
              <div className="flex gap-4 mt-2">
                {data && (
                  <>
                    <span className={`font-mono text-sm ${getChangeColor(data.ftseMib.change)}`}>
                      {formatChange(data.ftseMib.change, '')}
                    </span>
                    <span className={`font-mono text-sm ${getChangeColor(data.ftseMib.changePercent)}`}>
                      ({formatPercent(data.ftseMib.changePercent)})
                    </span>
                  </>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-800">
                <p className="text-gray-600 font-mono text-[10px]">
                  Indice principale 40 azioni italiane
                </p>
              </div>
            </div>

            {/* BTP 10 ANNI */}
            <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-500 font-mono text-xs uppercase tracking-wider">BTP 10 Anni</p>
                  <p className="text-gray-600 font-mono text-[10px]">Rendimento</p>
                </div>
                <Sparkline positive={(data?.btp10y.change ?? 0) < 0} />
              </div>
              <div className="flex items-end gap-3">
                <span className="font-mono text-4xl text-yellow-400 font-bold">
                  {loading ? '-.--%' : `${formatNumber(data?.btp10y.value ?? 0)}%`}
                </span>
              </div>
              {data && (
                <div className="flex gap-4 mt-2">
                  <span className={`font-mono text-sm ${getChangeColor(data.btp10y.change, true)}`}>
                    {formatChange(data.btp10y.change, '%')}
                  </span>
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-gray-800">
                <p className="text-gray-600 font-mono text-[10px]">
                  Benchmark titoli di stato italiani
                </p>
              </div>
            </div>

            {/* FOREX */}
            <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-gray-500 font-mono text-xs uppercase tracking-wider">Forex</p>
                  <p className="text-gray-600 font-mono text-[10px]">Cambi principali EUR</p>
                </div>
                <svg className="w-8 h-8 text-purple-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-mono text-sm">EUR/USD</span>
                  <div className="text-right">
                    <span className="font-mono text-xl text-white">
                      {loading ? '--.----' : formatNumber(data?.forex.eurUsd ?? 0, 4)}
                    </span>
                    {data && (
                      <span className={`font-mono text-xs ml-2 ${getChangeColor(data.forex.eurUsdChange)}`}>
                        {formatChange(data.forex.eurUsdChange, '')}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-mono text-sm">EUR/CHF</span>
                  <div className="text-right">
                    <span className="font-mono text-xl text-white">
                      {loading ? '--.----' : formatNumber(data?.forex.eurChf ?? 0, 4)}
                    </span>
                    {data && (
                      <span className={`font-mono text-xs ml-2 ${getChangeColor(data.forex.eurChfChange)}`}>
                        {formatChange(data.forex.eurChfChange, '')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-800">
                <p className="text-gray-600 font-mono text-[10px]">
                  Tassi di cambio spot
                </p>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 bg-[#0d1117] border border-gray-800 rounded-lg p-6">
            <h2 className="font-mono text-lg text-white mb-4">
              <span className="text-emerald-400">#</span> Cosa significano questi indicatori?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-400 font-mono text-sm">
              <div>
                <h3 className="text-cyan-400 mb-2">Spread BTP-Bund</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Differenza tra il rendimento dei titoli di stato italiani (BTP) e tedeschi (Bund) a 10 anni.
                  Un valore alto indica maggiore rischio percepito per l&apos;Italia. Sopra 200 bp si parla di tensione.
                </p>
              </div>
              <div>
                <h3 className="text-cyan-400 mb-2">Tassi BCE</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  I tassi di riferimento della Banca Centrale Europea. Il tasso depositi influenza i rendimenti dei conti,
                  il rifinanziamento principale impatta sui mutui.
                </p>
              </div>
              <div>
                <h3 className="text-cyan-400 mb-2">Inflazione ISTAT</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Variazione annua dell&apos;indice dei prezzi al consumo in Italia. L&apos;obiettivo BCE e del 2%.
                  Valori alti erodono il potere d&apos;acquisto.
                </p>
              </div>
              <div>
                <h3 className="text-cyan-400 mb-2">FTSE MIB</h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Indice delle 40 principali societa quotate alla Borsa Italiana. Rappresenta circa l&apos;80%
                  della capitalizzazione di mercato italiana.
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 font-mono text-[10px]">
              Dati ritardati di 15 minuti. Fonte: Yahoo Finance, BCE, ISTAT. Solo a scopo informativo, non costituisce consulenza finanziaria.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#0d1117] border-t border-gray-800">
        <div className="container-custom text-center">
          <h2 className="font-mono text-xl text-white mb-3">
            Vuoi capire come questi dati impattano i tuoi investimenti?
          </h2>
          <p className="text-gray-500 font-mono text-sm mb-6 max-w-xl mx-auto">
            Un consulente indipendente puo aiutarti a interpretare il contesto macro
            e posizionare il tuo portafoglio di conseguenza.
          </p>
          <Link
            href="/#contatti"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-mono text-sm transition-colors"
          >
            RICHIEDI CONSULENZA
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
