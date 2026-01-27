'use client'

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget, ToolPageSchema} from '@/components'

interface Posizione {
  id: string
  nome: string
  ticker: string
  categoria: 'azioni' | 'etf' | 'obbligazioni' | 'fondi' | 'crypto' | 'immobili' | 'liquidita' | 'altro'
  quantita: number
  prezzoCarico: number
  prezzoAttuale: number
  dataAcquisto: string
  sogliaAllocazione?: number
  dividendoAnnuo?: number
}

interface HistoricalPoint {
  date: string
  value: number
}

const STORAGE_KEY = 'guidapatrimonio_portfolio_v2'
const HISTORY_KEY = 'guidapatrimonio_portfolio_history'

// Colori per il grafico a torta - premium palette
const COLORI_TORTA = [
  '#1B4D3E', // forest
  '#2D6A4F', // green-600
  '#40916C', // green-400
  '#52B788', // green-300
  '#74C69D', // green-250
  '#95D5B2', // green-200
  '#368859', // green-500
  '#5e646e', // gray-500
  '#878d96', // gray-400
  '#b0b7c1', // gray-300
]

// Genera colore deterministic dal ticker per badge (fallback)
const getTickerColor = (ticker: string): string => {
  const colors = ['#1B4D3E', '#2D6A4F', '#40916C', '#52B788', '#368859', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4']
  let hash = 0
  for (let i = 0; i < ticker.length; i++) {
    hash = ticker.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

// Mappa ticker -> dominio azienda per logo (espandibile)
const TICKER_DOMAINS: Record<string, string> = {
  'TSLA': 'tesla.com',
  'AAPL': 'apple.com',
  'MSFT': 'microsoft.com',
  'GOOGL': 'google.com',
  'GOOG': 'google.com',
  'AMZN': 'amazon.com',
  'META': 'meta.com',
  'NVDA': 'nvidia.com',
  'JPM': 'jpmorganchase.com',
  'V': 'visa.com',
  'MA': 'mastercard.com',
  'DIS': 'disney.com',
  'NFLX': 'netflix.com',
  'PYPL': 'paypal.com',
  'INTC': 'intel.com',
  'AMD': 'amd.com',
  'CRM': 'salesforce.com',
  'ORCL': 'oracle.com',
  'IBM': 'ibm.com',
  'CSCO': 'cisco.com',
  'ADBE': 'adobe.com',
  'QCOM': 'qualcomm.com',
  'TXN': 'ti.com',
  'AVGO': 'broadcom.com',
  'COST': 'costco.com',
  'WMT': 'walmart.com',
  'HD': 'homedepot.com',
  'MCD': 'mcdonalds.com',
  'NKE': 'nike.com',
  'SBUX': 'starbucks.com',
  'KO': 'coca-cola.com',
  'PEP': 'pepsi.com',
  'PG': 'pg.com',
  'JNJ': 'jnj.com',
  'UNH': 'unitedhealthgroup.com',
  'PFE': 'pfizer.com',
  'ABBV': 'abbvie.com',
  'MRK': 'merck.com',
  'LLY': 'lilly.com',
  'TMO': 'thermofisher.com',
  'BA': 'boeing.com',
  'CAT': 'caterpillar.com',
  'GE': 'ge.com',
  'MMM': '3m.com',
  'HON': 'honeywell.com',
  'UPS': 'ups.com',
  'FDX': 'fedex.com',
  'XOM': 'exxonmobil.com',
  'CVX': 'chevron.com',
  'COP': 'conocophillips.com',
  // ETF comuni
  'VWCE': 'vanguard.com',
  'IWDA': 'ishares.com',
  'EUNL': 'ishares.com',
  'SWDA': 'ishares.com',
  'CSPX': 'ishares.com',
  'VUAA': 'vanguard.com',
  'VUSA': 'vanguard.com',
  'SPY': 'ssga.com',
  'QQQ': 'invesco.com',
  'VTI': 'vanguard.com',
  'VOO': 'vanguard.com',
  'IVV': 'ishares.com',
}

// Componente TickerLogo - mostra logo reale o fallback a badge colorato
const TickerLogo = ({ ticker, name, size = 'md' }: { ticker: string; name: string; size?: 'sm' | 'md' | 'lg' }) => {
  const [logoError, setLogoError] = useState(false)

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const textSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs'
  }

  const domain = ticker ? TICKER_DOMAINS[ticker.toUpperCase()] : null
  const logoUrl = domain ? `https://logo.clearbit.com/${domain}` : null

  // Se abbiamo un logo e non c'è errore, mostralo
  if (logoUrl && !logoError) {
    return (
      <div className={`${sizeClasses[size]} rounded-lg overflow-hidden flex-shrink-0 bg-white border border-gray-100`}>
        <img
          src={logoUrl}
          alt={ticker}
          className="w-full h-full object-contain p-0.5"
          onError={() => setLogoError(true)}
        />
      </div>
    )
  }

  // Fallback: badge colorato con iniziali
  const color = getTickerColor(ticker || name)
  const initials = ticker ? ticker.slice(0, 3) : name.slice(0, 2).toUpperCase()

  return (
    <div
      className={`${sizeClasses[size]} rounded-lg flex items-center justify-center font-bold text-white flex-shrink-0 shadow-sm ${textSizes[size]}`}
      style={{ backgroundColor: color }}
      title={ticker || name}
    >
      {initials}
    </div>
  )
}

// Componente TickerBadge legacy (per retrocompatibilità)
const TickerBadge = ({ ticker, size = 'md' }: { ticker: string; size?: 'sm' | 'md' | 'lg' }) => {
  return <TickerLogo ticker={ticker} name={ticker} size={size} />
}

// Colori per categorie
const COLORI_CATEGORIE: Record<string, string> = {
  azioni: '#1B4D3E',
  etf: '#2D6A4F',
  obbligazioni: '#40916C',
  fondi: '#52B788',
  crypto: '#368859',
  immobili: '#74C69D',
  liquidita: '#878d96',
  altro: '#b0b7c1',
}

// Benchmark simulati (rendimenti medi annui)
const BENCHMARKS = {
  'MSCI World': 8.5,
  'S&P 500': 10.2,
  'FTSE MIB': 4.3,
  'BTP Italia 10Y': 3.5,
}

export default function PortfolioTracker() {
  const [posizioni, setPosizioni] = useState<Posizione[]>([])
  const [historicalData, setHistoricalData] = useState<HistoricalPoint[]>([])
  const [mounted, setMounted] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedBenchmark, setSelectedBenchmark] = useState<keyof typeof BENCHMARKS>('MSCI World')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [animatedValue, setAnimatedValue] = useState(0)
  const exportRef = useRef<HTMLDivElement>(null)

  // Form state
  const [nome, setNome] = useState('')
  const [ticker, setTicker] = useState('')
  const [categoria, setCategoria] = useState<Posizione['categoria']>('etf')
  const [quantita, setQuantita] = useState('')
  const [prezzoCarico, setPrezzoCarico] = useState('')
  const [prezzoAttuale, setPrezzoAttuale] = useState('')
  const [dataAcquisto, setDataAcquisto] = useState('')
  const [sogliaAllocazione, setSogliaAllocazione] = useState('')
  const [dividendoAnnuo, setDividendoAnnuo] = useState('')

  // Sort state
  const [sortBy, setSortBy] = useState<'nome' | 'valore' | 'pl' | 'peso' | 'categoria'>('valore')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  // View state
  const [viewMode, setViewMode] = useState<'assets' | 'categorie'>('assets')

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
    const history = localStorage.getItem(HISTORY_KEY)
    if (history) {
      try {
        setHistoricalData(JSON.parse(history))
      } catch (e) {
        console.error('Errore nel caricamento della cronologia:', e)
      }
    }
  }, [])

  // Save to localStorage when posizioni changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posizioni))

      // Save historical snapshot once per day
      const today = new Date().toISOString().split('T')[0]
      const lastEntry = historicalData[historicalData.length - 1]

      if (posizioni.length > 0 && (!lastEntry || lastEntry.date !== today)) {
        const currentValue = posizioni.reduce((acc, p) => acc + p.quantita * p.prezzoAttuale, 0)
        const newHistory = [...historicalData, { date: today, value: currentValue }].slice(-365) // Keep 1 year
        setHistoricalData(newHistory)
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory))
      }
    }
  }, [posizioni, mounted, historicalData])

  // Animate total value
  useEffect(() => {
    if (mounted && posizioni.length > 0) {
      const targetValue = posizioni.reduce((acc, p) => acc + p.quantita * p.prezzoAttuale, 0)
      const duration = 1000
      const startTime = Date.now()
      const startValue = animatedValue

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        setAnimatedValue(startValue + (targetValue - startValue) * easeOut)

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [posizioni, mounted])

  // Click outside to close export menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setShowExportMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Calcoli portafoglio
  const stats = useMemo(() => {
    if (posizioni.length === 0) {
      return {
        valoreAttuale: 0,
        costoTotale: 0,
        plTotale: 0,
        plPercentuale: 0,
        posizioniOrdinati: [],
        categorieStats: {},
        dividendiTotali: 0,
        yieldMedio: 0,
        alertRibilanciamento: [],
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
      const dividendiAnnui = (p.dividendoAnnuo || 0) * p.quantita
      return { ...p, valore, costo, pl, plPercent, peso, dividendiAnnui }
    })

    // Stats per categoria
    const categorieStats: Record<string, { valore: number; peso: number; pl: number }> = {}
    posizioniConCalcoli.forEach(p => {
      if (!categorieStats[p.categoria]) {
        categorieStats[p.categoria] = { valore: 0, peso: 0, pl: 0 }
      }
      categorieStats[p.categoria].valore += p.valore
      categorieStats[p.categoria].peso += p.peso
      categorieStats[p.categoria].pl += p.pl
    })

    // Dividendi totali e yield medio
    const dividendiTotali = posizioniConCalcoli.reduce((acc, p) => acc + p.dividendiAnnui, 0)
    const yieldMedio = valoreAttuale > 0 ? (dividendiTotali / valoreAttuale) * 100 : 0

    // Alert ribilanciamento
    const alertRibilanciamento = posizioniConCalcoli.filter(p =>
      p.sogliaAllocazione && p.peso > p.sogliaAllocazione
    ).map(p => ({
      nome: p.nome,
      pesoAttuale: p.peso,
      soglia: p.sogliaAllocazione!,
      eccesso: p.peso - p.sogliaAllocazione!,
    }))

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
        case 'categoria':
          comparison = a.categoria.localeCompare(b.categoria)
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
      categorieStats,
      dividendiTotali,
      yieldMedio,
      alertRibilanciamento,
    }
  }, [posizioni, sortBy, sortDir])

  // Performance temporali simulate (basate sulla data di acquisto)
  const performanceTemporali = useMemo(() => {
    if (historicalData.length === 0 || stats.valoreAttuale === 0) {
      return { ytd: 0, m1: 0, m3: 0, y1: 0 }
    }

    const now = new Date()
    const currentValue = stats.valoreAttuale

    // Trova valori storici
    const findValueAtDate = (daysAgo: number) => {
      const targetDate = new Date(now)
      targetDate.setDate(targetDate.getDate() - daysAgo)
      const targetDateStr = targetDate.toISOString().split('T')[0]

      // Find closest date
      let closest = historicalData[0]
      for (const point of historicalData) {
        if (point.date <= targetDateStr) {
          closest = point
        }
      }
      return closest?.value || currentValue
    }

    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const daysFromYearStart = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24))

    const ytdValue = findValueAtDate(daysFromYearStart)
    const m1Value = findValueAtDate(30)
    const m3Value = findValueAtDate(90)
    const y1Value = findValueAtDate(365)

    return {
      ytd: ytdValue > 0 ? ((currentValue - ytdValue) / ytdValue) * 100 : 0,
      m1: m1Value > 0 ? ((currentValue - m1Value) / m1Value) * 100 : 0,
      m3: m3Value > 0 ? ((currentValue - m3Value) / m3Value) * 100 : 0,
      y1: y1Value > 0 ? ((currentValue - y1Value) / y1Value) * 100 : 0,
    }
  }, [historicalData, stats.valoreAttuale])

  const handleSort = (column: 'nome' | 'valore' | 'pl' | 'peso' | 'categoria') => {
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
      id: editingId || Date.now().toString(),
      nome,
      ticker: ticker || '',
      categoria,
      quantita: parseFloat(quantita),
      prezzoCarico: parseFloat(prezzoCarico),
      prezzoAttuale: parseFloat(prezzoAttuale),
      dataAcquisto: dataAcquisto || new Date().toISOString().split('T')[0],
      sogliaAllocazione: sogliaAllocazione ? parseFloat(sogliaAllocazione) : undefined,
      dividendoAnnuo: dividendoAnnuo ? parseFloat(dividendoAnnuo) : undefined,
    }

    if (editingId) {
      setPosizioni(posizioni.map(p => p.id === editingId ? nuovaPosizione : p))
      setEditingId(null)
    } else {
      setPosizioni([...posizioni, nuovaPosizione])
    }

    resetForm()
  }

  const resetForm = () => {
    setNome('')
    setTicker('')
    setCategoria('etf')
    setQuantita('')
    setPrezzoCarico('')
    setPrezzoAttuale('')
    setDataAcquisto('')
    setSogliaAllocazione('')
    setDividendoAnnuo('')
    setEditingId(null)
  }

  const handleEdit = (p: Posizione) => {
    setEditingId(p.id)
    setNome(p.nome)
    setTicker(p.ticker)
    setCategoria(p.categoria)
    setQuantita(p.quantita.toString())
    setPrezzoCarico(p.prezzoCarico.toString())
    setPrezzoAttuale(p.prezzoAttuale.toString())
    setDataAcquisto(p.dataAcquisto)
    setSogliaAllocazione(p.sogliaAllocazione?.toString() || '')
    setDividendoAnnuo(p.dividendoAnnuo?.toString() || '')
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

  // Export functions
  const exportToCSV = useCallback(() => {
    const headers = ['Nome', 'Ticker', 'Categoria', 'Quantita', 'Prezzo Carico', 'Prezzo Attuale', 'Valore', 'P&L Euro', 'P&L %', 'Peso %', 'Data Acquisto']
    const rows = stats.posizioniOrdinati.map(p => [
      p.nome,
      p.ticker,
      p.categoria,
      p.quantita,
      p.prezzoCarico,
      p.prezzoAttuale,
      p.valore.toFixed(2),
      p.pl.toFixed(2),
      p.plPercent.toFixed(2),
      p.peso.toFixed(2),
      p.dataAcquisto,
    ])

    const csv = [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `portfolio_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    setShowExportMenu(false)
  }, [stats.posizioniOrdinati])

  const exportToJSON = useCallback(() => {
    const data = {
      exportDate: new Date().toISOString(),
      summary: {
        valoreAttuale: stats.valoreAttuale,
        costoTotale: stats.costoTotale,
        plTotale: stats.plTotale,
        plPercentuale: stats.plPercentuale,
        dividendiTotali: stats.dividendiTotali,
        yieldMedio: stats.yieldMedio,
      },
      posizioni: stats.posizioniOrdinati,
      categorieStats: stats.categorieStats,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `portfolio_${new Date().toISOString().split('T')[0]}.json`
    link.click()
    setShowExportMenu(false)
  }, [stats])

  // Doughnut chart component
  const DoughnutChart = ({ data, size = 200 }: { data: { label: string; value: number; color: string }[]; size?: number }) => {
    const total = data.reduce((acc, d) => acc + d.value, 0)
    if (total === 0) return null

    let cumulativePercent = 0
    const paths = data.map((d, i) => {
      const percent = (d.value / total) * 100
      const startPercent = cumulativePercent
      cumulativePercent += percent

      const startAngle = (startPercent / 100) * 2 * Math.PI
      const endAngle = (cumulativePercent / 100) * 2 * Math.PI

      const innerRadius = 30
      const outerRadius = 45

      const x1Outer = 50 + outerRadius * Math.cos(startAngle - Math.PI / 2)
      const y1Outer = 50 + outerRadius * Math.sin(startAngle - Math.PI / 2)
      const x2Outer = 50 + outerRadius * Math.cos(endAngle - Math.PI / 2)
      const y2Outer = 50 + outerRadius * Math.sin(endAngle - Math.PI / 2)
      const x1Inner = 50 + innerRadius * Math.cos(endAngle - Math.PI / 2)
      const y1Inner = 50 + innerRadius * Math.sin(endAngle - Math.PI / 2)
      const x2Inner = 50 + innerRadius * Math.cos(startAngle - Math.PI / 2)
      const y2Inner = 50 + innerRadius * Math.sin(startAngle - Math.PI / 2)

      const largeArcFlag = percent > 50 ? 1 : 0

      return (
        <path
          key={i}
          d={`
            M ${x1Outer} ${y1Outer}
            A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2Outer} ${y2Outer}
            L ${x1Inner} ${y1Inner}
            A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x2Inner} ${y2Inner}
            Z
          `}
          fill={d.color}
          className="transition-all duration-300 hover:opacity-80"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
        />
      )
    })

    return (
      <svg viewBox="0 0 100 100" style={{ width: size, height: size }}>
        {paths}
      </svg>
    )
  }

  // Line chart component for historical performance
  const LineChart = ({ data, width = 300, height = 100 }: { data: HistoricalPoint[]; width?: number; height?: number }) => {
    if (data.length < 2) return null

    const values = data.map(d => d.value)
    const minValue = Math.min(...values) * 0.95
    const maxValue = Math.max(...values) * 1.05
    const range = maxValue - minValue

    const points = data.map((d, i) => ({
      x: (i / (data.length - 1)) * (width - 40) + 20,
      y: height - 20 - ((d.value - minValue) / range) * (height - 40),
    }))

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

    // Area fill
    const areaD = `${pathD} L ${points[points.length - 1].x} ${height - 20} L ${points[0].x} ${height - 20} Z`

    const isPositive = values[values.length - 1] >= values[0]

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={isPositive ? '#2D6A4F' : '#dc2626'} stopOpacity="0.3" />
            <stop offset="100%" stopColor={isPositive ? '#2D6A4F' : '#dc2626'} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill="url(#areaGradient)" />
        <path d={pathD} fill="none" stroke={isPositive ? '#2D6A4F' : '#dc2626'} strokeWidth="2" strokeLinecap="round" />
        {points.length > 0 && (
          <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" fill={isPositive ? '#2D6A4F' : '#dc2626'} />
        )}
      </svg>
    )
  }

  // Non renderizzare nulla finche non siamo montati (per evitare hydration mismatch)
  if (!mounted) {
    return (
      <main>
      <ToolPageSchema slug="portfolio-tracker" />
        <Navbar />
        <section className="bg-forest pt-navbar">
          <div className="container-custom py-12">
            <h1 className="font-heading text-[32px] md:text-[42px] text-white leading-tight">
              Portfolio Tracker Premium
            </h1>
          </div>
        </section>
        <section className="section-md bg-cream min-h-[60vh]">
          <div className="container-custom">
            <div className="text-center py-20">
              <div className="inline-flex items-center gap-2 text-gray-500">
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Caricamento portfolio...
              </div>
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

      {/* Hero Premium */}
      <section className="bg-forest pt-navbar">
        <div className="container-custom py-10 md:py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Link href="/strumenti" className="inline-flex items-center text-green-300 hover:text-white mb-3 transition-colors text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Tutti gli strumenti
              </Link>
              <h1 className="font-heading text-[28px] md:text-[38px] text-white leading-tight">
                Portfolio Tracker Premium
              </h1>
              <p className="text-white/70 mt-2 max-w-xl text-sm md:text-base">
                Traccia azioni, ETF, fondi, obbligazioni e crypto. Analisi performance, dividend yield, alert ribilanciamento.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 bg-green-400 text-forest px-4 py-2 rounded-full text-sm font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                100% GRATIS
              </span>
            </div>
          </div>

          {/* Competitor comparison badge */}
          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-white/80 text-sm">
            <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Alternativa gratuita a JustETF Premium (€240/anno) e Sharesight (€180/anno)
          </div>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          {/* Premium Dashboard Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-8">
            {/* Main Value Card */}
            <div className="col-span-2 lg:col-span-2 bg-forest rounded-xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <p className="text-green-200 text-sm mb-1 font-medium">Valore Totale Portafoglio</p>
              <p className="font-heading text-3xl md:text-4xl lg:text-5xl tracking-tight">
                {formatCurrency(animatedValue)}
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div>
                  <p className="text-xs text-green-200">P&L Totale</p>
                  <p className={`font-semibold ${stats.plTotale >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {stats.plTotale >= 0 ? '+' : ''}{formatCurrency(stats.plTotale)}
                  </p>
                </div>
                <div className="w-px h-8 bg-white/20" />
                <div>
                  <p className="text-xs text-green-200">Rendimento</p>
                  <p className={`font-semibold ${stats.plPercentuale >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {formatPercent(stats.plPercentuale)}
                  </p>
                </div>
              </div>
              {/* Mini line chart */}
              {historicalData.length >= 2 && (
                <div className="mt-4 -mx-2">
                  <LineChart data={historicalData.slice(-30)} height={50} />
                </div>
              )}
            </div>

            {/* Performance Cards */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xs mb-1">YTD</p>
              <p className={`font-heading text-xl md:text-2xl ${performanceTemporali.ytd >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(performanceTemporali.ytd)}
              </p>
              <p className="text-xs text-gray-400 mt-1">Anno corrente</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xs mb-1">1 Mese</p>
              <p className={`font-heading text-xl md:text-2xl ${performanceTemporali.m1 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(performanceTemporali.m1)}
              </p>
              <p className="text-xs text-gray-400 mt-1">Ultimo mese</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xs mb-1">1 Anno</p>
              <p className={`font-heading text-xl md:text-2xl ${performanceTemporali.y1 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercent(performanceTemporali.y1)}
              </p>
              <p className="text-xs text-gray-400 mt-1">12 mesi</p>
            </div>
          </div>

          {/* Secondary Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xs mb-1">Costo Totale</p>
              <p className="font-heading text-lg text-forest">{formatCurrency(stats.costoTotale)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xs mb-1">Dividendi Annui</p>
              <p className="font-heading text-lg text-forest">{formatCurrency(stats.dividendiTotali)}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xs mb-1">Dividend Yield</p>
              <p className="font-heading text-lg text-forest">{stats.yieldMedio.toFixed(2)}%</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-gray-500 text-xs mb-1">Numero Posizioni</p>
              <p className="font-heading text-lg text-forest">{posizioni.length}</p>
            </div>
          </div>

          {/* Alert Ribilanciamento */}
          {stats.alertRibilanciamento.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-amber-800 mb-1">Alert Ribilanciamento</h3>
                  <div className="space-y-1">
                    {stats.alertRibilanciamento.map((alert, i) => (
                      <p key={i} className="text-sm text-amber-700">
                        <span className="font-medium">{alert.nome}</span>: peso {alert.pesoAttuale.toFixed(1)}% supera soglia {alert.soglia}% (+{alert.eccesso.toFixed(1)}%)
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Form Aggiungi Posizione */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm border border-gray-100 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-heading text-lg text-forest">
                    {editingId ? 'Modifica Posizione' : 'Aggiungi Posizione'}
                  </h2>
                  {editingId && (
                    <button onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-700">
                      Annulla
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Nome Asset *
                    </label>
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="es. Vanguard FTSE All-World"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Ticker / ISIN
                      </label>
                      <input
                        type="text"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value.toUpperCase())}
                        placeholder="VWCE"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Categoria
                      </label>
                      <select
                        value={categoria}
                        onChange={(e) => setCategoria(e.target.value as Posizione['categoria'])}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors bg-white"
                      >
                        <option value="etf">ETF</option>
                        <option value="azioni">Azioni</option>
                        <option value="obbligazioni">Obbligazioni</option>
                        <option value="fondi">Fondi</option>
                        <option value="crypto">Crypto</option>
                        <option value="immobili">Immobili</option>
                        <option value="liquidita">Liquidita</option>
                        <option value="altro">Altro</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Quantita *
                      </label>
                      <input
                        type="number"
                        value={quantita}
                        onChange={(e) => setQuantita(e.target.value)}
                        placeholder="10"
                        step="0.0001"
                        min="0"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        PMC (Prezzo Medio) *
                      </label>
                      <input
                        type="number"
                        value={prezzoCarico}
                        onChange={(e) => setPrezzoCarico(e.target.value)}
                        placeholder="100.00"
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Prezzo Attuale *
                      </label>
                      <input
                        type="number"
                        value={prezzoAttuale}
                        onChange={(e) => setPrezzoAttuale(e.target.value)}
                        placeholder="105.50"
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Data Acquisto
                      </label>
                      <input
                        type="date"
                        value={dataAcquisto}
                        onChange={(e) => setDataAcquisto(e.target.value)}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors"
                      />
                    </div>
                  </div>

                  {/* Advanced options */}
                  <details className="group">
                    <summary className="text-xs font-medium text-gray-500 cursor-pointer hover:text-gray-700 flex items-center gap-1">
                      <svg className="w-3 h-3 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Opzioni avanzate
                    </summary>
                    <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">
                          Soglia Allocazione %
                        </label>
                        <input
                          type="number"
                          value={sogliaAllocazione}
                          onChange={(e) => setSogliaAllocazione(e.target.value)}
                          placeholder="25"
                          step="1"
                          min="0"
                          max="100"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors"
                        />
                        <p className="text-xs text-gray-400 mt-1">Alert se superata</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1.5">
                          Dividendo/Unita
                        </label>
                        <input
                          type="number"
                          value={dividendoAnnuo}
                          onChange={(e) => setDividendoAnnuo(e.target.value)}
                          placeholder="1.50"
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm transition-colors"
                        />
                        <p className="text-xs text-gray-400 mt-1">Annuale</p>
                      </div>
                    </div>
                  </details>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    {editingId ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Salva Modifiche
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Aggiungi Posizione
                      </>
                    )}
                  </button>
                </form>

                <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Dati salvati solo nel tuo browser
                </p>

                {/* Preview posizione in tempo reale */}
                {(nome || ticker) && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Anteprima Posizione</p>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <TickerLogo ticker={ticker} name={nome || 'Asset'} size="lg" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-forest truncate">{nome || 'Nome asset'}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {ticker && <span className="font-mono">{ticker}</span>}
                            <span className="px-1.5 py-0.5 bg-gray-200 rounded capitalize text-gray-600">{categoria}</span>
                          </div>
                        </div>
                      </div>
                      {quantita && prezzoAttuale && (
                        <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-gray-400 text-xs">Valore</p>
                            <p className="font-semibold text-forest">
                              {formatCurrency(parseFloat(quantita || '0') * parseFloat(prezzoAttuale || '0'))}
                            </p>
                          </div>
                          {prezzoCarico && parseFloat(prezzoCarico) > 0 && (
                            <div className="text-right">
                              <p className="text-gray-400 text-xs">P&L</p>
                              {(() => {
                                const q = parseFloat(quantita || '0')
                                const pa = parseFloat(prezzoAttuale || '0')
                                const pc = parseFloat(prezzoCarico || '0')
                                const pl = (pa - pc) * q
                                const plPercent = pc > 0 ? ((pa - pc) / pc) * 100 : 0
                                return (
                                  <p className={`font-semibold ${pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {pl >= 0 ? '+' : ''}{formatCurrency(pl)} ({pl >= 0 ? '+' : ''}{plPercent.toFixed(1)}%)
                                  </p>
                                )
                              })()}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lista Posizioni e Grafici */}
            <div className="lg:col-span-2 space-y-6 order-1 lg:order-2">
              {posizioni.length === 0 ? (
                <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-gray-100 text-center">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="font-heading text-xl text-forest mb-2">Inizia a tracciare il tuo patrimonio</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Aggiungi la tua prima posizione usando il form. Puoi tracciare azioni, ETF, fondi, obbligazioni, crypto e immobili.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['ETF', 'Azioni', 'Obbligazioni', 'Crypto', 'Fondi'].map(cat => (
                      <span key={cat} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm">
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {/* Historical Performance Chart - Full Width */}
                  {historicalData.length >= 2 && (
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-heading text-base text-forest">Andamento Portafoglio</h3>
                          <p className="text-xs text-gray-500 mt-0.5">Storico valore totale</p>
                        </div>
                        <div className="flex items-center gap-3">
                          {performanceTemporali.y1 !== 0 && (
                            <div className={`text-right ${performanceTemporali.y1 >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              <p className="text-xs text-gray-500">12 mesi</p>
                              <p className="font-semibold">{formatPercent(performanceTemporali.y1)}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="h-[200px]">
                        <svg viewBox="0 0 800 200" className="w-full h-full" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor={stats.plTotale >= 0 ? '#2D6A4F' : '#dc2626'} stopOpacity="0.2" />
                              <stop offset="100%" stopColor={stats.plTotale >= 0 ? '#2D6A4F' : '#dc2626'} stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          {/* Grid lines */}
                          {[0, 1, 2, 3, 4].map(i => (
                            <line key={i} x1="40" y1={20 + i * 40} x2="780" y2={20 + i * 40} stroke="#e5e7eb" strokeDasharray="4" />
                          ))}
                          {/* Chart */}
                          {(() => {
                            const values = historicalData.map(d => d.value)
                            const minVal = Math.min(...values) * 0.95
                            const maxVal = Math.max(...values) * 1.05
                            const range = maxVal - minVal || 1
                            const points = historicalData.map((d, i) => ({
                              x: 40 + (i / (historicalData.length - 1)) * 740,
                              y: 180 - ((d.value - minVal) / range) * 160,
                            }))
                            const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
                            const areaD = `${pathD} L ${points[points.length - 1].x} 180 L ${points[0].x} 180 Z`
                            return (
                              <>
                                <path d={areaD} fill="url(#chartAreaGradient)" />
                                <path d={pathD} fill="none" stroke={stats.plTotale >= 0 ? '#2D6A4F' : '#dc2626'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="6" fill={stats.plTotale >= 0 ? '#2D6A4F' : '#dc2626'} />
                                <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3" fill="white" />
                              </>
                            )
                          })()}
                          {/* Y axis labels */}
                          {(() => {
                            const values = historicalData.map(d => d.value)
                            const minVal = Math.min(...values) * 0.95
                            const maxVal = Math.max(...values) * 1.05
                            return [0, 1, 2, 3, 4].map(i => {
                              const val = maxVal - (i / 4) * (maxVal - minVal)
                              return (
                                <text key={i} x="35" y={24 + i * 40} textAnchor="end" className="text-[10px] fill-gray-400">
                                  {val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val.toFixed(0)}
                                </text>
                              )
                            })
                          })()}
                        </svg>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-2 px-10">
                        <span>{historicalData[0]?.date?.slice(5) || ''}</span>
                        <span>{historicalData[Math.floor(historicalData.length / 2)]?.date?.slice(5) || ''}</span>
                        <span>{historicalData[historicalData.length - 1]?.date?.slice(5) || ''}</span>
                      </div>
                    </div>
                  )}

                  {/* Charts Row */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Pie Chart Asset Allocation */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading text-base text-forest">Asset Allocation</h3>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setViewMode('assets')}
                            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${viewMode === 'assets' ? 'bg-forest text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          >
                            Asset
                          </button>
                          <button
                            onClick={() => setViewMode('categorie')}
                            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${viewMode === 'categorie' ? 'bg-forest text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                          >
                            Categorie
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="flex-shrink-0">
                          {viewMode === 'assets' ? (
                            <DoughnutChart
                              data={stats.posizioniOrdinati.map((p, i) => ({
                                label: p.nome,
                                value: p.valore,
                                color: COLORI_TORTA[i % COLORI_TORTA.length],
                              }))}
                              size={140}
                            />
                          ) : (
                            <DoughnutChart
                              data={Object.entries(stats.categorieStats).map(([cat, data]) => ({
                                label: cat,
                                value: data.valore,
                                color: COLORI_CATEGORIE[cat] || '#b0b7c1',
                              }))}
                              size={140}
                            />
                          )}
                        </div>
                        <div className="flex-1 space-y-1.5 max-h-[140px] overflow-y-auto">
                          {viewMode === 'assets' ? (
                            stats.posizioniOrdinati.slice(0, 6).map((p, i) => (
                              <div key={p.id} className="flex items-center gap-2 text-sm">
                                <div
                                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                                  style={{ backgroundColor: COLORI_TORTA[i % COLORI_TORTA.length] }}
                                />
                                <span className="text-gray-700 truncate flex-1">{p.nome}</span>
                                <span className="text-gray-500 font-medium">{p.peso.toFixed(1)}%</span>
                              </div>
                            ))
                          ) : (
                            Object.entries(stats.categorieStats).map(([cat, data]) => (
                              <div key={cat} className="flex items-center gap-2 text-sm">
                                <div
                                  className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                                  style={{ backgroundColor: COLORI_CATEGORIE[cat] }}
                                />
                                <span className="text-gray-700 capitalize flex-1">{cat}</span>
                                <span className="text-gray-500 font-medium">{data.peso.toFixed(1)}%</span>
                              </div>
                            ))
                          )}
                          {viewMode === 'assets' && stats.posizioniOrdinati.length > 6 && (
                            <p className="text-xs text-gray-400">+{stats.posizioniOrdinati.length - 6} altri</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Benchmark Comparison */}
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-heading text-base text-forest">vs Benchmark</h3>
                        <select
                          value={selectedBenchmark}
                          onChange={(e) => setSelectedBenchmark(e.target.value as keyof typeof BENCHMARKS)}
                          className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white focus:ring-1 focus:ring-green-500"
                        >
                          {Object.keys(BENCHMARKS).map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm text-gray-600">Il tuo portafoglio</span>
                            <span className={`text-sm font-semibold ${stats.plPercentuale >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {formatPercent(stats.plPercentuale)}
                            </span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${stats.plPercentuale >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(Math.max(stats.plPercentuale + 50, 0), 100)}%` }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm text-gray-600">{selectedBenchmark}</span>
                            <span className="text-sm font-semibold text-gray-700">
                              +{BENCHMARKS[selectedBenchmark].toFixed(1)}% (media annua)
                            </span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-400 rounded-full"
                              style={{ width: `${Math.min(BENCHMARKS[selectedBenchmark] + 50, 100)}%` }}
                            />
                          </div>
                        </div>
                        <div className="pt-2 border-t border-gray-100">
                          <p className={`text-sm font-medium ${stats.plPercentuale >= BENCHMARKS[selectedBenchmark] ? 'text-green-600' : 'text-amber-600'}`}>
                            {stats.plPercentuale >= BENCHMARKS[selectedBenchmark]
                              ? `Stai battendo il benchmark di ${(stats.plPercentuale - BENCHMARKS[selectedBenchmark]).toFixed(1)} punti`
                              : `Sottoperformance di ${(BENCHMARKS[selectedBenchmark] - stats.plPercentuale).toFixed(1)} punti`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading text-lg text-forest">
                      Le tue posizioni <span className="text-gray-400 font-normal text-sm">({posizioni.length})</span>
                    </h3>
                    <div className="flex items-center gap-2" ref={exportRef}>
                      <div className="relative">
                        <button
                          onClick={() => setShowExportMenu(!showExportMenu)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Esporta
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        {showExportMenu && (
                          <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10">
                            <button
                              onClick={exportToCSV}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              CSV (Excel)
                            </button>
                            <button
                              onClick={exportToJSON}
                              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                              </svg>
                              JSON
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Positions Table */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Desktop Table Header */}
                    <div className="hidden lg:grid grid-cols-12 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      <button
                        onClick={() => handleSort('nome')}
                        className="col-span-3 text-left hover:text-forest flex items-center gap-1"
                      >
                        Asset {sortBy === 'nome' && (sortDir === 'asc' ? '↑' : '↓')}
                      </button>
                      <button
                        onClick={() => handleSort('categoria')}
                        className="col-span-1 text-left hover:text-forest flex items-center gap-1"
                      >
                        Cat {sortBy === 'categoria' && (sortDir === 'asc' ? '↑' : '↓')}
                      </button>
                      <div className="col-span-1 text-right">Qty</div>
                      <div className="col-span-1 text-right">PMC</div>
                      <div className="col-span-1 text-right">Prezzo</div>
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
                        P&L {sortBy === 'pl' && (sortDir === 'asc' ? '↑' : '↓')}
                      </button>
                      <div className="col-span-1 text-right">Peso</div>
                    </div>

                    <div className="divide-y divide-gray-100">
                      {stats.posizioniOrdinati.map((p, i) => (
                        <div
                          key={p.id}
                          className="px-4 py-4 hover:bg-gray-50 transition-colors"
                        >
                          {/* Mobile View */}
                          <div className="lg:hidden space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <TickerLogo ticker={p.ticker} name={p.nome} size="md" />
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-forest truncate">{p.nome}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    {p.ticker && (
                                      <span className="text-xs text-gray-400 font-mono">{p.ticker}</span>
                                    )}
                                    <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded capitalize">
                                      {p.categoria}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleEdit(p)}
                                  className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                  title="Modifica"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleRemove(p.id)}
                                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                  title="Rimuovi"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                              <div>
                                <p className="text-gray-400 text-xs">Valore</p>
                                <p className="font-semibold text-forest">{formatCurrency(p.valore)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-gray-400 text-xs">P&L</p>
                                <p className={`font-semibold ${p.pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                  {p.pl >= 0 ? '+' : ''}{formatCurrency(p.pl)} ({Math.abs(p.plPercent) > 999 ? '>999%' : (p.plPercent >= 0 ? '+' : '') + p.plPercent.toFixed(1) + '%'})
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-400">Peso nel portafoglio</span>
                              <span className="font-medium text-gray-700">{p.peso.toFixed(1)}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full transition-all duration-300"
                                style={{ width: `${p.peso}%` }}
                              />
                            </div>
                          </div>

                          {/* Desktop View */}
                          <div className="hidden lg:grid grid-cols-12 gap-3 items-center">
                            <div className="col-span-3">
                              <div className="flex items-center gap-3">
                                <TickerLogo ticker={p.ticker} name={p.nome} size="sm" />
                                <div className="min-w-0">
                                  <p className="font-medium text-forest truncate">{p.nome}</p>
                                  {p.ticker && (
                                    <p className="text-xs text-gray-400 font-mono">{p.ticker}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-span-1">
                              <span className="text-xs px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded capitalize">
                                {p.categoria}
                              </span>
                            </div>
                            <div className="col-span-1 text-right">
                              <p className="text-sm font-medium">{p.quantita}</p>
                            </div>
                            <div className="col-span-1 text-right">
                              <p className="text-sm text-gray-600">{formatCurrency(p.prezzoCarico)}</p>
                            </div>
                            <div className="col-span-1 text-right">
                              <input
                                type="number"
                                value={p.prezzoAttuale}
                                onChange={(e) => handleUpdatePrezzo(p.id, e.target.value)}
                                step="0.01"
                                min="0"
                                className="w-full px-1.5 py-1 text-sm text-right border border-gray-200 rounded focus:ring-1 focus:ring-green-500 focus:border-green-500"
                              />
                            </div>
                            <div className="col-span-2 text-right">
                              <p className="text-sm font-semibold text-forest">{formatCurrency(p.valore)}</p>
                            </div>
                            <div className="col-span-2 text-right">
                              <p className={`text-sm font-semibold ${p.pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {p.pl >= 0 ? '+' : ''}{formatCurrency(p.pl)} <span className="text-xs font-normal opacity-75">({Math.abs(p.plPercent) > 999 ? '>999%' : (p.plPercent >= 0 ? '+' : '') + p.plPercent.toFixed(1) + '%'})</span>
                              </p>
                            </div>
                            <div className="col-span-1 flex items-center justify-end gap-2">
                              <span className="text-sm font-medium text-gray-600">{p.peso.toFixed(1)}%</span>
                              <div className="flex items-center gap-0.5">
                                <button
                                  onClick={() => handleEdit(p)}
                                  className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
                                  title="Modifica"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => handleRemove(p.id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                  title="Rimuovi"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance per Asset */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <h3 className="font-heading text-base text-forest mb-4">Performance per Asset</h3>
                    <div className="space-y-3">
                      {stats.posizioniOrdinati.slice(0, 8).map((p) => (
                        <div key={p.id}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 truncate max-w-[60%]">{p.nome}</span>
                            <span className={`text-sm font-semibold ${p.pl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {p.pl >= 0 ? '+' : ''}{Math.abs(p.plPercent) > 9999 ? '>9999%' : formatPercent(p.plPercent)}
                            </span>
                          </div>
                          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300" />
                            {p.pl >= 0 ? (
                              <div
                                className="absolute top-0 bottom-0 bg-green-500 rounded-r-full transition-all duration-500"
                                style={{
                                  left: '50%',
                                  width: `${Math.min(p.plPercent / 2, 50)}%`,
                                }}
                              />
                            ) : (
                              <div
                                className="absolute top-0 bottom-0 bg-red-500 rounded-l-full transition-all duration-500"
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
                    {stats.posizioniOrdinati.length > 8 && (
                      <p className="text-xs text-gray-400 mt-3 text-center">
                        Mostrando i primi 8 asset. Esporta per vedere tutti.
                      </p>
                    )}
                    <div className="flex justify-between text-xs text-gray-400 mt-3 pt-2 border-t border-gray-100">
                      <span>-100%</span>
                      <span>0%</span>
                      <span>+100%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Tracking Completo</h3>
              <p className="text-sm text-gray-600">
                Monitora azioni, ETF, fondi, obbligazioni, crypto e immobili in un unico dashboard. Calcoli automatici di P&L e performance.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Alert Intelligenti</h3>
              <p className="text-sm text-gray-600">
                Imposta soglie di allocazione per ogni asset. Ricevi alert quando un titolo supera il peso massimo desiderato.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">100% Privacy</h3>
              <p className="text-sm text-gray-600">
                I dati restano nel tuo browser (localStorage). Non vengono inviati a server. Nessuna registrazione richiesta.
              </p>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="mt-8 bg-gray-50 rounded-xl p-5 border border-gray-200">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-gray-700 font-medium">Privacy garantita</p>
                <p className="text-sm text-gray-500 mt-0.5">
                  Tutti i dati del tuo portafoglio sono salvati esclusivamente nel tuo browser (localStorage).
                  Non inviamo nulla ai nostri server e non condividiamo informazioni con terze parti.
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

      {/* Rating Widget */}
      <div className="container-custom py-8">
        <RatingWidget toolSlug="portfolio-tracker" toolName="portfolio-tracker" />
      </div>

      <Footer />
    </main>
  )
}
