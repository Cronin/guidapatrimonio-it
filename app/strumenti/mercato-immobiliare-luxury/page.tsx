'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar, Footer, RelatedTools, toolCorrelations , RatingWidget, FreeToolBanner} from '@/components'

// Static data - imported directly for SSG compatibility
const luxuryData = {
  lastUpdate: "2026-01-23",
  markets: [
    {
      id: "milano-centro",
      name: "Milano Centro Storico",
      zone: "Quadrilatero della Moda",
      city: "Milano",
      region: "Lombardia",
      pricePerSqm: 15000,
      priceRange: { min: 12000, max: 25000 },
      trend: 3.5,
      yoyChange: 5.2,
      topSales: "Fino a 25.000 EUR/mq",
      description: "Il cuore del lusso milanese, tra Via Montenapoleone e Via della Spiga. Richiesta internazionale costante.",
      coordinates: { lat: 45.4685, lng: 9.1924 },
      highlights: ["Fashion district", "Buyer internazionali", "Trophy assets"]
    },
    {
      id: "milano-brera",
      name: "Milano Brera",
      zone: "Brera / Garibaldi",
      city: "Milano",
      region: "Lombardia",
      pricePerSqm: 12000,
      priceRange: { min: 9000, max: 16000 },
      trend: 2.8,
      yoyChange: 4.1,
      topSales: "Fino a 16.000 EUR/mq",
      description: "Quartiere artistico e bohemien, ora tra i piu esclusivi. Forte domanda da professionisti e creativi.",
      coordinates: { lat: 45.4728, lng: 9.1862 },
      highlights: ["Arte e cultura", "Nightlife esclusiva", "Loft di pregio"]
    },
    {
      id: "roma-centro",
      name: "Roma Centro",
      zone: "Via Condotti / Piazza di Spagna",
      city: "Roma",
      region: "Lazio",
      pricePerSqm: 14000,
      priceRange: { min: 10000, max: 20000 },
      trend: 2.1,
      yoyChange: 3.5,
      topSales: "Fino a 20.000 EUR/mq",
      description: "Il triangolo d'oro romano, con vista sui monumenti storici. Mercato stabile e resiliente.",
      coordinates: { lat: 41.9057, lng: 12.4823 },
      highlights: ["Vista iconiche", "Patrimonio storico", "Clientela diplomatica"]
    },
    {
      id: "roma-parioli",
      name: "Roma Parioli",
      zone: "Parioli / Pinciano",
      city: "Roma",
      region: "Lazio",
      pricePerSqm: 8500,
      priceRange: { min: 6500, max: 12000 },
      trend: 1.8,
      yoyChange: 2.8,
      topSales: "Fino a 12.000 EUR/mq",
      description: "Quartiere residenziale elegante, preferito da famiglie facoltose e professionisti.",
      coordinates: { lat: 41.9264, lng: 12.4936 },
      highlights: ["Verde e tranquillita", "Scuole internazionali", "Ville con giardino"]
    },
    {
      id: "lago-como",
      name: "Lago di Como",
      zone: "Cernobbio / Bellagio",
      city: "Como",
      region: "Lombardia",
      pricePerSqm: 8000,
      priceRange: { min: 5000, max: 15000 },
      trend: 4.2,
      yoyChange: 6.8,
      topSales: "Fino a 15.000 EUR/mq per lakefront",
      description: "Destinazione iconica per VIP internazionali. Ville storiche con vista lago molto richieste.",
      coordinates: { lat: 45.8564, lng: 9.0852 },
      highlights: ["Ville storiche", "Vista lago", "Celebrity hotspot"]
    },
    {
      id: "portofino",
      name: "Portofino",
      zone: "Portofino / Santa Margherita",
      city: "Portofino",
      region: "Liguria",
      pricePerSqm: 18000,
      priceRange: { min: 12000, max: 30000 },
      trend: 1.5,
      yoyChange: 2.3,
      topSales: "Fino a 30.000 EUR/mq",
      description: "Il borgo piu esclusivo d'Italia. Offerta limitatissima, domanda sempre superiore.",
      coordinates: { lat: 44.3035, lng: 9.2096 },
      highlights: ["Esclusivita massima", "Yacht lifestyle", "Offerta limitata"]
    },
    {
      id: "forte-marmi",
      name: "Forte dei Marmi",
      zone: "Roma Imperiale",
      city: "Forte dei Marmi",
      region: "Toscana",
      pricePerSqm: 12000,
      priceRange: { min: 8000, max: 18000 },
      trend: 2.0,
      yoyChange: 3.0,
      topSales: "Fino a 18.000 EUR/mq",
      description: "Meta estiva dell'elite italiana e russa. Ville con spiaggia privata molto ricercate.",
      coordinates: { lat: 43.9614, lng: 10.1688 },
      highlights: ["Beach lifestyle", "Clientela VIP", "Ville con giardino"]
    },
    {
      id: "capri",
      name: "Capri",
      zone: "Centro / Marina Grande",
      city: "Capri",
      region: "Campania",
      pricePerSqm: 16000,
      priceRange: { min: 10000, max: 25000 },
      trend: 1.8,
      yoyChange: 2.5,
      topSales: "Fino a 25.000 EUR/mq",
      description: "L'isola dei VIP per eccellenza. Pochissime proprieta disponibili sul mercato.",
      coordinates: { lat: 40.5507, lng: 14.2426 },
      highlights: ["Isola esclusiva", "Vista Faraglioni", "Rarita assoluta"]
    },
    {
      id: "cortina",
      name: "Cortina d'Ampezzo",
      zone: "Centro / Pocol",
      city: "Cortina d'Ampezzo",
      region: "Veneto",
      pricePerSqm: 14000,
      priceRange: { min: 10000, max: 20000 },
      trend: 5.0,
      yoyChange: 8.2,
      topSales: "Fino a 20.000 EUR/mq",
      description: "In forte crescita per le Olimpiadi 2026. Chalet di lusso e residenze esclusive.",
      coordinates: { lat: 46.5404, lng: 12.1357 },
      highlights: ["Olimpiadi 2026", "Sci di lusso", "Boom investimenti"]
    },
    {
      id: "firenze-centro",
      name: "Firenze Centro",
      zone: "Oltrarno / Santo Spirito",
      city: "Firenze",
      region: "Toscana",
      pricePerSqm: 7500,
      priceRange: { min: 5500, max: 12000 },
      trend: 2.5,
      yoyChange: 3.8,
      topSales: "Fino a 12.000 EUR/mq",
      description: "Appartamenti in palazzi storici con vista su chiese e piazze rinascimentali.",
      coordinates: { lat: 43.7696, lng: 11.2558 },
      highlights: ["Patrimonio UNESCO", "Arte e storia", "Buyer americani"]
    },
    {
      id: "costa-smeralda",
      name: "Costa Smeralda",
      zone: "Porto Cervo / Cala di Volpe",
      city: "Arzachena",
      region: "Sardegna",
      pricePerSqm: 15000,
      priceRange: { min: 10000, max: 25000 },
      trend: 3.2,
      yoyChange: 4.5,
      topSales: "Fino a 25.000 EUR/mq",
      description: "Il playground estivo dei miliardari. Ville con accesso al mare privatissime.",
      coordinates: { lat: 41.0936, lng: 9.5374 },
      highlights: ["Mare cristallino", "Yacht club", "Privacy totale"]
    },
    {
      id: "venezia-centro",
      name: "Venezia Centro",
      zone: "San Marco / Dorsoduro",
      city: "Venezia",
      region: "Veneto",
      pricePerSqm: 9000,
      priceRange: { min: 6000, max: 15000 },
      trend: 1.2,
      yoyChange: 1.8,
      topSales: "Fino a 15.000 EUR/mq",
      description: "Palazzi storici sul Canal Grande. Mercato di nicchia per collezionisti.",
      coordinates: { lat: 45.4337, lng: 12.3382 },
      highlights: ["Palazzi storici", "Canal Grande", "Unicita mondiale"]
    }
  ],
  nationalStats: {
    avgLuxuryPrice: 12000,
    yoyGrowth: 4.2,
    transactionVolume: "3.2 miliardi EUR",
    foreignBuyerShare: 35,
    topNationalities: ["USA", "UK", "Germania", "Svizzera", "Francia"]
  },
  marketInsights: [
    {
      title: "Olimpiadi 2026 spingono Cortina",
      text: "I prezzi a Cortina d'Ampezzo sono cresciuti dell'8.2% nell'ultimo anno, trainati dagli investimenti per le Olimpiadi invernali."
    },
    {
      title: "Buyer americani dominano Firenze",
      text: "Il 45% degli acquirenti di immobili di lusso a Firenze proviene dagli Stati Uniti, attratti dal cambio favorevole e dal lifestyle toscano."
    },
    {
      title: "Lago di Como sempre piu esclusivo",
      text: "Con +6.8% anno su anno, il Lago di Como conferma il trend di crescita grazie alla domanda internazionale di ville storiche."
    }
  ]
}

type SortKey = 'price' | 'growth' | 'name'

export default function MercatoImmobiliareLuxury() {
  const [selectedMarket, setSelectedMarket] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortKey>('price')
  const [sqm, setSqm] = useState(150)
  const [selectedZone, setSelectedZone] = useState<string>('all')

  const regions = useMemo(() => {
    const uniqueRegions = Array.from(new Set(luxuryData.markets.map(m => m.region)))
    return uniqueRegions.sort()
  }, [])

  const sortedMarkets = useMemo(() => {
    let filtered = luxuryData.markets
    if (selectedZone !== 'all') {
      filtered = filtered.filter(m => m.region === selectedZone)
    }

    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return b.pricePerSqm - a.pricePerSqm
        case 'growth':
          return b.yoyChange - a.yoyChange
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })
  }, [sortBy, selectedZone])

  const selectedMarketData = useMemo(() => {
    return luxuryData.markets.find(m => m.id === selectedMarket)
  }, [selectedMarket])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('it-IT').format(value)
  }

  // Calculate price for selected sqm
  const calculatePrice = (pricePerSqm: number) => {
    return pricePerSqm * sqm
  }

  // Get color intensity based on price
  const getPriceColor = (price: number) => {
    const maxPrice = Math.max(...luxuryData.markets.map(m => m.pricePerSqm))
    const minPrice = Math.min(...luxuryData.markets.map(m => m.pricePerSqm))
    const ratio = (price - minPrice) / (maxPrice - minPrice)

    if (ratio > 0.75) return 'bg-amber-600'
    if (ratio > 0.5) return 'bg-amber-500'
    if (ratio > 0.25) return 'bg-amber-400'
    return 'bg-amber-300'
  }

  const getTrendColor = (trend: number) => {
    if (trend >= 5) return 'text-green-600'
    if (trend >= 3) return 'text-green-500'
    if (trend >= 0) return 'text-amber-600'
    return 'text-red-500'
  }

  return (
    <main className="bg-cream min-h-screen">
      <Navbar />
      <FreeToolBanner />

      {/* Hero - Luxury Style */}
      <section className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 pt-navbar overflow-hidden">
        {/* Background Image - Villa Carlotta Como */}
        <Image
          src="/images/finance/como-villa-carlotta.webp"
          alt="Villa storica sul Lago di Como, simbolo del mercato immobiliare di lusso italiano"
          fill
          priority
          className="object-cover opacity-20"
          sizes="100vw"
        />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A373' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="container-custom py-16 md:py-24 relative">
          <Link href="/strumenti" className="inline-flex items-center text-amber-300/80 hover:text-amber-200 mb-6 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tutti gli strumenti
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-12 bg-gradient-to-b from-amber-400 to-amber-600 rounded-full" />
            <span className="text-amber-400 text-sm font-medium tracking-widest uppercase">Mercato Premium</span>
          </div>

          <h1 className="font-heading text-[36px] md:text-[52px] text-white leading-tight max-w-2xl">
            Immobiliare di Lusso
            <span className="block text-amber-300">Italia</span>
          </h1>
          <p className="text-stone-300 mt-4 max-w-xl text-lg">
            Prezzi al metro quadro, trend di mercato e analisi delle zone piu esclusive del Paese.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <p className="text-amber-400/80 text-xs uppercase tracking-wider mb-1">Prezzo Medio</p>
              <p className="font-heading text-2xl text-white">{formatNumber(luxuryData.nationalStats.avgLuxuryPrice)}</p>
              <p className="text-stone-400 text-sm">EUR/mq</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <p className="text-amber-400/80 text-xs uppercase tracking-wider mb-1">Crescita YoY</p>
              <p className="font-heading text-2xl text-white">+{luxuryData.nationalStats.yoyGrowth}%</p>
              <p className="text-stone-400 text-sm">anno su anno</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <p className="text-amber-400/80 text-xs uppercase tracking-wider mb-1">Volume</p>
              <p className="font-heading text-2xl text-white">{luxuryData.nationalStats.transactionVolume}</p>
              <p className="text-stone-400 text-sm">transazioni/anno</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
              <p className="text-amber-400/80 text-xs uppercase tracking-wider mb-1">Buyer Esteri</p>
              <p className="font-heading text-2xl text-white">{luxuryData.nationalStats.foreignBuyerShare}%</p>
              <p className="text-stone-400 text-sm">del mercato</p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="bg-gradient-to-b from-stone-100 to-cream py-12 border-b border-stone-200">
        <div className="container-custom">
          <div className="bg-white rounded-xl shadow-lg border border-stone-200 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="font-heading text-xl text-stone-800 mb-2">Calcolatore Prezzi</h2>
                <p className="text-stone-500 text-sm">Quanto costa un appartamento di lusso nelle zone premium italiane?</p>
              </div>
              <div className="flex-shrink-0 w-full md:w-auto">
                <label className="block text-sm font-medium text-stone-600 mb-2">
                  Superficie: <span className="text-amber-600 font-semibold">{sqm} mq</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="10"
                  value={sqm}
                  onChange={(e) => setSqm(Number(e.target.value))}
                  className="w-full md:w-64 h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-xs text-stone-400 mt-1">
                  <span>50 mq</span>
                  <span>500 mq</span>
                </div>
              </div>
            </div>

            {/* Price comparison row */}
            <div className="mt-8 overflow-x-auto">
              <div className="flex gap-4 min-w-max pb-2">
                {sortedMarkets.slice(0, 6).map((market) => (
                  <div
                    key={market.id}
                    className="bg-stone-50 rounded-lg p-4 min-w-[160px] border border-stone-100 hover:border-amber-300 transition-colors cursor-pointer"
                    onClick={() => setSelectedMarket(market.id)}
                  >
                    <p className="text-stone-500 text-xs mb-1 truncate">{market.name}</p>
                    <p className="font-heading text-lg text-stone-800">{formatCurrency(calculatePrice(market.pricePerSqm))}</p>
                    <p className="text-amber-600 text-xs mt-1">{formatNumber(market.pricePerSqm)} EUR/mq</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container-custom">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex gap-2">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 focus:border-amber-400 focus:outline-none"
              >
                <option value="all">Tutte le regioni</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => setSortBy('price')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'price'
                    ? 'bg-amber-500 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-amber-300'
                }`}
              >
                Prezzo
              </button>
              <button
                onClick={() => setSortBy('growth')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'growth'
                    ? 'bg-amber-500 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-amber-300'
                }`}
              >
                Crescita
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === 'name'
                    ? 'bg-amber-500 text-white'
                    : 'bg-white border border-stone-200 text-stone-600 hover:border-amber-300'
                }`}
              >
                A-Z
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Market Cards */}
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-4">
                {sortedMarkets.map((market) => (
                  <div
                    key={market.id}
                    onClick={() => setSelectedMarket(market.id === selectedMarket ? null : market.id)}
                    className={`bg-white rounded-xl p-5 cursor-pointer transition-all border-2 ${
                      selectedMarket === market.id
                        ? 'border-amber-400 shadow-lg shadow-amber-100'
                        : 'border-transparent shadow hover:shadow-md hover:border-stone-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-heading text-lg text-stone-800">{market.name}</h3>
                        <p className="text-stone-500 text-sm">{market.zone}</p>
                      </div>
                      <div className={`${getPriceColor(market.pricePerSqm)} text-white text-xs font-medium px-2 py-1 rounded`}>
                        {market.region}
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-4">
                      <div>
                        <p className="text-stone-400 text-xs uppercase tracking-wider mb-1">Prezzo/mq</p>
                        <p className="font-heading text-2xl text-stone-800">{formatNumber(market.pricePerSqm)}</p>
                        <p className="text-stone-500 text-sm">EUR</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${getTrendColor(market.yoyChange)}`}>
                          +{market.yoyChange}%
                        </p>
                        <p className="text-stone-400 text-xs">anno su anno</p>
                      </div>
                    </div>

                    {/* Price range bar */}
                    <div className="mt-4 pt-4 border-t border-stone-100">
                      <div className="flex justify-between text-xs text-stone-500 mb-1">
                        <span>{formatNumber(market.priceRange.min)}</span>
                        <span>{formatNumber(market.priceRange.max)}</span>
                      </div>
                      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full"
                          style={{
                            width: `${((market.pricePerSqm - market.priceRange.min) / (market.priceRange.max - market.priceRange.min)) * 100}%`
                          }}
                        />
                      </div>
                      <p className="text-xs text-stone-400 mt-1 text-center">Range EUR/mq</p>
                    </div>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-1 mt-3">
                      {market.highlights.slice(0, 3).map((highlight, i) => (
                        <span key={i} className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Selected Market Detail */}
                {selectedMarketData ? (
                  <div className="bg-gradient-to-br from-stone-800 to-stone-900 rounded-xl p-6 text-white">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-1 h-8 bg-amber-400 rounded-full" />
                      <div>
                        <h3 className="font-heading text-xl">{selectedMarketData.name}</h3>
                        <p className="text-stone-400 text-sm">{selectedMarketData.city}, {selectedMarketData.region}</p>
                      </div>
                    </div>

                    <p className="text-stone-300 text-sm mb-6">{selectedMarketData.description}</p>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-white/10 rounded-lg p-3">
                        <p className="text-amber-400/80 text-xs uppercase mb-1">Prezzo medio</p>
                        <p className="font-heading text-xl">{formatNumber(selectedMarketData.pricePerSqm)}</p>
                        <p className="text-stone-400 text-xs">EUR/mq</p>
                      </div>
                      <div className="bg-white/10 rounded-lg p-3">
                        <p className="text-amber-400/80 text-xs uppercase mb-1">Crescita</p>
                        <p className="font-heading text-xl text-green-400">+{selectedMarketData.yoyChange}%</p>
                        <p className="text-stone-400 text-xs">anno su anno</p>
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-4 mb-4">
                      <p className="text-amber-400/80 text-xs uppercase mb-2">Top Sales</p>
                      <p className="text-white font-medium">{selectedMarketData.topSales}</p>
                    </div>

                    <div className="bg-amber-500/20 rounded-lg p-4">
                      <p className="text-amber-300 text-xs uppercase mb-2">Appartamento {sqm} mq</p>
                      <p className="font-heading text-2xl">{formatCurrency(calculatePrice(selectedMarketData.pricePerSqm))}</p>
                      <p className="text-stone-400 text-xs mt-1">stima indicativa</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-stone-100 rounded-xl p-6 text-center">
                    <svg className="w-12 h-12 text-stone-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <p className="text-stone-500">Seleziona una zona per vedere i dettagli</p>
                  </div>
                )}

                {/* Market Insights */}
                <div className="bg-white rounded-xl p-6 shadow">
                  <h3 className="font-heading text-lg text-stone-800 mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Insight di Mercato
                  </h3>
                  <div className="space-y-4">
                    {luxuryData.marketInsights.map((insight, index) => (
                      <div key={index} className="border-l-2 border-amber-400 pl-3">
                        <p className="font-medium text-stone-800 text-sm">{insight.title}</p>
                        <p className="text-stone-500 text-xs mt-1">{insight.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Nationalities */}
                <div className="bg-white rounded-xl p-6 shadow">
                  <h3 className="font-heading text-lg text-stone-800 mb-4">Buyer Internazionali</h3>
                  <div className="flex flex-wrap gap-2">
                    {luxuryData.nationalStats.topNationalities.map((nation, index) => (
                      <span
                        key={nation}
                        className={`px-3 py-1 rounded-full text-sm ${
                          index === 0 ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {nation}
                      </span>
                    ))}
                  </div>
                  <p className="text-stone-400 text-xs mt-3">
                    {luxuryData.nationalStats.foreignBuyerShare}% delle transazioni luxury coinvolge buyer esteri
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Price Comparison Chart */}
      <section className="py-12 bg-white border-t border-stone-200">
        <div className="container-custom">
          <h2 className="font-heading text-2xl text-stone-800 mb-8 text-center">Confronto Prezzi per Zona</h2>

          <div className="max-w-4xl mx-auto">
            {/* Bar Chart */}
            <div className="space-y-4">
              {[...luxuryData.markets]
                .sort((a, b) => b.pricePerSqm - a.pricePerSqm)
                .map((market) => {
                  const maxPrice = Math.max(...luxuryData.markets.map(m => m.pricePerSqm))
                  const widthPercent = (market.pricePerSqm / maxPrice) * 100

                  return (
                    <div key={market.id} className="group">
                      <div className="flex items-center gap-4">
                        <div className="w-32 md:w-40 flex-shrink-0">
                          <p className="font-medium text-stone-700 text-sm truncate">{market.name}</p>
                          <p className="text-stone-400 text-xs">{market.zone}</p>
                        </div>
                        <div className="flex-1">
                          <div className="h-8 bg-stone-100 rounded-lg overflow-hidden relative">
                            <div
                              className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-lg transition-all duration-500 group-hover:from-amber-500 group-hover:to-amber-700 flex items-center justify-end pr-3"
                              style={{ width: `${widthPercent}%` }}
                            >
                              <span className="text-white text-xs font-medium whitespace-nowrap">
                                {formatNumber(market.pricePerSqm)} EUR/mq
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="w-16 text-right flex-shrink-0">
                          <span className={`text-sm font-medium ${getTrendColor(market.yoyChange)}`}>
                            +{market.yoyChange}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </section>

      {/* Where to Invest */}
      <section className="py-16 bg-gradient-to-br from-stone-900 to-stone-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="text-amber-400 text-sm font-medium tracking-widest uppercase">Analisi</span>
            <h2 className="font-heading text-3xl md:text-4xl text-white mt-2">Dove Investire nel 2026</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* High Growth */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="font-heading text-xl text-white mb-2">Alta Crescita</h3>
              <p className="text-stone-400 text-sm mb-4">Zone con il maggiore apprezzamento atteso</p>
              <ul className="space-y-2">
                {[...luxuryData.markets]
                  .sort((a, b) => b.yoyChange - a.yoyChange)
                  .slice(0, 3)
                  .map(m => (
                    <li key={m.id} className="flex justify-between text-sm">
                      <span className="text-stone-300">{m.name}</span>
                      <span className="text-green-400 font-medium">+{m.yoyChange}%</span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Trophy Assets */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="font-heading text-xl text-white mb-2">Trophy Assets</h3>
              <p className="text-stone-400 text-sm mb-4">Le zone piu esclusive e prestigiose</p>
              <ul className="space-y-2">
                {[...luxuryData.markets]
                  .sort((a, b) => b.pricePerSqm - a.pricePerSqm)
                  .slice(0, 3)
                  .map(m => (
                    <li key={m.id} className="flex justify-between text-sm">
                      <span className="text-stone-300">{m.name}</span>
                      <span className="text-amber-400 font-medium">{formatNumber(m.pricePerSqm)} EUR</span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Value Opportunity */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-heading text-xl text-white mb-2">Value Opportunity</h3>
              <p className="text-stone-400 text-sm mb-4">Prestigio a prezzi piu accessibili</p>
              <ul className="space-y-2">
                {[...luxuryData.markets]
                  .sort((a, b) => a.pricePerSqm - b.pricePerSqm)
                  .slice(0, 3)
                  .map(m => (
                    <li key={m.id} className="flex justify-between text-sm">
                      <span className="text-stone-300">{m.name}</span>
                      <span className="text-blue-400 font-medium">{formatNumber(m.pricePerSqm)} EUR</span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-amber-500 to-amber-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl md:text-3xl text-white mb-4">
            Stai valutando un investimento immobiliare di pregio?
          </h2>
          <p className="text-amber-100 mb-8 max-w-lg mx-auto">
            Un consulente patrimoniale indipendente puo aiutarti a valutare l&apos;opportunita nel contesto del tuo portafoglio complessivo.
          </p>
          <Link
            href="/#contatti"
            className="inline-flex items-center gap-2 bg-white text-amber-600 font-semibold px-8 py-4 rounded-full hover:bg-stone-100 transition-colors"
          >
            Richiedi Consulenza Gratuita
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-stone-100 border-t border-stone-200">
        <div className="container-custom">
          <p className="text-stone-500 text-xs text-center max-w-2xl mx-auto">
            I dati presentati sono stime basate su ricerche di mercato e fonti pubbliche. I prezzi effettivi possono variare significativamente in base a posizione specifica, stato dell&apos;immobile, vista e altri fattori. Ultimo aggiornamento: {luxuryData.lastUpdate}. Questa pagina non costituisce consulenza finanziaria o immobiliare.
          </p>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom pb-8">
        <RatingWidget toolSlug="mercato-immobiliare-luxury" toolName="mercato-immobiliare-luxury" />
      </div>

      <RelatedTools tools={toolCorrelations['mercato-immobiliare-luxury']} />

      <Footer />
    </main>
  )
}
