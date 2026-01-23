'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Navbar, Footer, RelatedTools, toolCorrelations } from '@/components'

interface Auction {
  id: string
  title: string
  location: string
  region: string
  province: string
  basePrice: number
  marketValue: number
  discount: number
  auctionDate: string
  tribunal: string
  type: 'villa' | 'attico' | 'appartamento' | 'commerciale' | 'terreno' | 'altro'
  sqm: number | null
  rooms: number | null
  description: string
  url: string
  imageUrl: string | null
  source: 'astegiudiziarie' | 'pvp'
}

interface AuctionData {
  lastUpdate: string
  source: string
  totalCount: number
  filteredCount: number
  auctions: Auction[]
  stats: {
    avgDiscount: number
    avgPricePerSqm: number
    byRegion: Record<string, number>
    byType: Record<string, number>
    byPriceRange: Record<string, number>
  }
  stale: boolean
}

const REGIONS = [
  { value: '', label: 'Tutte le regioni' },
  { value: 'lombardia', label: 'Lombardia' },
  { value: 'lazio', label: 'Lazio' },
  { value: 'toscana', label: 'Toscana' },
  { value: 'veneto', label: 'Veneto' },
  { value: 'piemonte', label: 'Piemonte' },
  { value: 'liguria', label: 'Liguria' },
  { value: 'emilia-romagna', label: 'Emilia-Romagna' },
  { value: 'campania', label: 'Campania' },
  { value: 'sicilia', label: 'Sicilia' },
  { value: 'sardegna', label: 'Sardegna' },
  { value: 'puglia', label: 'Puglia' },
  { value: 'trentino-alto-adige', label: 'Trentino-Alto Adige' },
  { value: 'friuli-venezia-giulia', label: 'Friuli-Venezia Giulia' },
  { value: 'umbria', label: 'Umbria' },
  { value: 'marche', label: 'Marche' },
  { value: 'abruzzo', label: 'Abruzzo' },
  { value: 'calabria', label: 'Calabria' },
  { value: 'basilicata', label: 'Basilicata' },
  { value: 'molise', label: 'Molise' },
  { value: 'valle-d-aosta', label: 'Valle d\'Aosta' },
]

const TYPES = [
  { value: '', label: 'Tutti i tipi' },
  { value: 'villa', label: 'Ville e Casali' },
  { value: 'attico', label: 'Attici e Penthouse' },
  { value: 'appartamento', label: 'Appartamenti' },
  { value: 'commerciale', label: 'Commerciali' },
  { value: 'terreno', label: 'Terreni' },
]

const PRICE_RANGES = [
  { value: '', label: 'Tutti i prezzi', min: null, max: null },
  { value: '500k-750k', label: '500k - 750k', min: 500000, max: 750000 },
  { value: '750k-1M', label: '750k - 1M', min: 750000, max: 1000000 },
  { value: '1M-2M', label: '1M - 2M', min: 1000000, max: 2000000 },
  { value: '2M-5M', label: '2M - 5M', min: 2000000, max: 5000000 },
  { value: '5M+', label: 'Oltre 5M', min: 5000000, max: null },
]

const REGION_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'lombardia': { lat: 45.47, lng: 9.19 },
  'lazio': { lat: 41.90, lng: 12.50 },
  'toscana': { lat: 43.77, lng: 11.25 },
  'veneto': { lat: 45.44, lng: 11.88 },
  'piemonte': { lat: 45.07, lng: 7.69 },
  'liguria': { lat: 44.41, lng: 8.93 },
  'emilia-romagna': { lat: 44.49, lng: 11.34 },
  'campania': { lat: 40.85, lng: 14.27 },
  'sicilia': { lat: 37.60, lng: 14.02 },
  'sardegna': { lat: 40.12, lng: 9.00 },
  'puglia': { lat: 41.13, lng: 16.87 },
  'trentino-alto-adige': { lat: 46.50, lng: 11.35 },
  'friuli-venezia-giulia': { lat: 45.65, lng: 13.77 },
  'umbria': { lat: 42.71, lng: 12.39 },
  'marche': { lat: 43.62, lng: 13.52 },
  'abruzzo': { lat: 42.35, lng: 13.40 },
  'calabria': { lat: 39.05, lng: 16.52 },
  'basilicata': { lat: 40.64, lng: 15.80 },
  'molise': { lat: 41.56, lng: 14.67 },
  'valle-d-aosta': { lat: 45.74, lng: 7.32 },
}

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  }
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatFullCurrency(value: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function getDaysUntil(dateString: string): number {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = date.getTime() - now.getTime()
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function getTypeLabel(type: string): string {
  const found = TYPES.find(t => t.value === type)
  return found ? found.label : type
}

function getRegionLabel(region: string): string {
  const found = REGIONS.find(r => r.value === region)
  return found ? found.label : region
}

export default function AsteImmobiliariLuxury() {
  const [data, setData] = useState<AuctionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [selectedRegion, setSelectedRegion] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedPriceRange, setSelectedPriceRange] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'discount'>('date')

  // Fetch data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (selectedRegion) params.set('region', selectedRegion)
        if (selectedType) params.set('type', selectedType)

        const priceRange = PRICE_RANGES.find(p => p.value === selectedPriceRange)
        if (priceRange?.min) params.set('minPrice', priceRange.min.toString())
        if (priceRange?.max) params.set('maxPrice', priceRange.max.toString())

        const response = await fetch(`/api/data/aste-luxury?${params}`)
        if (!response.ok) throw new Error('Errore nel caricamento dei dati')

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedRegion, selectedType, selectedPriceRange])

  // Sort auctions
  const sortedAuctions = useMemo(() => {
    if (!data?.auctions) return []

    return [...data.auctions].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.auctionDate).getTime() - new Date(b.auctionDate).getTime()
        case 'price':
          return a.basePrice - b.basePrice
        case 'discount':
          return b.discount - a.discount
        default:
          return 0
      }
    })
  }, [data?.auctions, sortBy])

  // Region distribution for map
  const regionDistribution = useMemo(() => {
    if (!data?.stats.byRegion) return []

    const maxCount = Math.max(...Object.values(data.stats.byRegion))

    return Object.entries(data.stats.byRegion)
      .map(([region, count]) => ({
        region,
        count,
        coords: REGION_COORDINATES[region],
        size: Math.max(24, Math.min(60, (count / maxCount) * 60)),
      }))
      .filter(r => r.coords)
  }, [data?.stats.byRegion])

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
            Aste Immobiliari di Lusso
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Scopri opportunita immobiliari esclusive a prezzi vantaggiosi. Ville, attici e immobili di pregio in vendita giudiziaria.
          </p>
        </div>
      </section>

      {/* Stats Overview */}
      {data && !loading && (
        <section className="bg-cream border-b border-gray-200">
          <div className="container-custom py-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Aste disponibili</p>
                <p className="font-heading text-2xl text-forest">{data.totalCount}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Sconto medio</p>
                <p className="font-heading text-2xl text-green-600">-{data.stats.avgDiscount}%</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Prezzo medio/mq</p>
                <p className="font-heading text-2xl text-forest">{formatCurrency(data.stats.avgPricePerSqm)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-sm text-gray-500">Regioni coperte</p>
                <p className="font-heading text-2xl text-forest">{Object.keys(data.stats.byRegion).length}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="bg-cream py-8 md:py-12">
        <div className="container-custom">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-card p-5 shadow-sm sticky top-24">
                <h2 className="font-heading text-lg text-forest mb-4">Filtri</h2>

                <div className="space-y-4">
                  {/* Region Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Regione</label>
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      {REGIONS.map((region) => (
                        <option key={region.value} value={region.value}>
                          {region.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Type Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipologia</label>
                    <select
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      {TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fascia di prezzo</label>
                    <select
                      value={selectedPriceRange}
                      onChange={(e) => setSelectedPriceRange(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      {PRICE_RANGES.map((range) => (
                        <option key={range.value} value={range.value}>
                          {range.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ordina per</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'date' | 'price' | 'discount')}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="date">Data asta (prossime)</option>
                      <option value="price">Prezzo (crescente)</option>
                      <option value="discount">Sconto (maggiore)</option>
                    </select>
                  </div>

                  {/* Reset */}
                  {(selectedRegion || selectedType || selectedPriceRange) && (
                    <button
                      onClick={() => {
                        setSelectedRegion('')
                        setSelectedType('')
                        setSelectedPriceRange('')
                      }}
                      className="w-full text-sm text-green-600 hover:text-green-700 py-2"
                    >
                      Rimuovi filtri
                    </button>
                  )}
                </div>

                {/* Distribution by Type */}
                {data && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Per tipologia</h3>
                    <div className="space-y-2">
                      {Object.entries(data.stats.byType)
                        .sort((a, b) => b[1] - a[1])
                        .map(([type, count]) => (
                          <div key={type} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{getTypeLabel(type)}</span>
                            <span className="font-medium text-forest">{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Distribution by Price */}
                {data && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">Per fascia prezzo</h3>
                    <div className="space-y-2">
                      {Object.entries(data.stats.byPriceRange)
                        .sort((a, b) => {
                          const order = ['500k-750k', '750k-1M', '1M-2M', '2M-5M', '5M+']
                          return order.indexOf(a[0]) - order.indexOf(b[0])
                        })
                        .map(([range, count]) => (
                          <div key={range} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{range}</span>
                            <span className="font-medium text-forest">{count}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Loading State */}
              {loading && (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  {error}
                </div>
              )}

              {/* Results */}
              {!loading && !error && data && (
                <>
                  {/* Results Header */}
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-600">
                      <span className="font-medium text-forest">{data.filteredCount}</span> immobili trovati
                      {data.stale && (
                        <span className="ml-2 text-amber-600 text-sm">
                          (dati non aggiornati)
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-400">
                      Aggiornato: {new Date(data.lastUpdate).toLocaleDateString('it-IT')}
                    </p>
                  </div>

                  {/* Map Preview */}
                  <div className="bg-white rounded-card p-4 shadow-sm mb-6">
                    <h3 className="font-heading text-lg text-forest mb-3">Distribuzione geografica</h3>
                    <div className="relative bg-gradient-to-b from-blue-50 to-green-50 rounded-lg overflow-hidden" style={{ height: '250px' }}>
                      {/* Simplified Italy map representation */}
                      <svg viewBox="0 0 400 450" className="w-full h-full">
                        {/* Italy outline - simplified */}
                        <path
                          d="M180,30 L220,25 L270,45 L310,55 L340,80 L360,100 L370,130 L365,160 L350,185 L340,210 L330,240 L315,270 L295,300 L275,320 L255,345 L240,365 L225,380 L210,395 L200,410 L185,420 L170,415 L165,395 L175,370 L185,345 L175,320 L160,300 L145,275 L130,250 L120,225 L115,200 L120,175 L130,150 L145,125 L160,100 L175,75 L180,50 L180,30 Z M60,290 L90,280 L110,295 L100,320 L70,330 L50,315 L60,290 Z"
                          fill="#e8f5e9"
                          stroke="#2D6A4F"
                          strokeWidth="2"
                        />
                        {/* Region markers */}
                        {regionDistribution.map((region) => {
                          // Convert lat/lng to SVG coordinates (approximate)
                          const x = ((region.coords.lng - 6) / 13) * 350 + 25
                          const y = ((47.5 - region.coords.lat) / 12) * 400 + 25
                          return (
                            <g key={region.region}>
                              <circle
                                cx={x}
                                cy={y}
                                r={region.size / 2}
                                fill="#2D6A4F"
                                fillOpacity="0.6"
                                stroke="#1B4D3E"
                                strokeWidth="2"
                              />
                              <text
                                x={x}
                                y={y + 4}
                                textAnchor="middle"
                                fill="white"
                                fontSize="12"
                                fontWeight="bold"
                              >
                                {region.count}
                              </text>
                            </g>
                          )
                        })}
                      </svg>
                      <div className="absolute bottom-2 right-2 bg-white/80 rounded px-2 py-1 text-xs text-gray-500">
                        Clicca su una regione per filtrare
                      </div>
                    </div>
                  </div>

                  {/* Auction Cards */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {sortedAuctions.map((auction) => {
                      const daysUntil = getDaysUntil(auction.auctionDate)
                      const isUrgent = daysUntil <= 14

                      return (
                        <div key={auction.id} className="bg-white rounded-card shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          {/* Image */}
                          <div className="relative h-48 bg-gray-200">
                            {auction.imageUrl ? (
                              <Image
                                src={auction.imageUrl}
                                alt={auction.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-400">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                              </div>
                            )}

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex gap-2">
                              <span className="bg-green-600 text-white text-xs font-medium px-2 py-1 rounded">
                                -{auction.discount}%
                              </span>
                              {isUrgent && (
                                <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                                  {daysUntil <= 0 ? 'Oggi' : `${daysUntil}g`}
                                </span>
                              )}
                            </div>

                            {/* Type Badge */}
                            <div className="absolute top-3 right-3">
                              <span className="bg-white/90 text-forest text-xs font-medium px-2 py-1 rounded">
                                {getTypeLabel(auction.type)}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-4">
                            <h3 className="font-heading text-lg text-forest mb-1 line-clamp-1">
                              {auction.title}
                            </h3>
                            <p className="text-sm text-gray-500 mb-3 flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              {auction.location}
                            </p>

                            {/* Price Info */}
                            <div className="flex items-baseline gap-3 mb-3">
                              <span className="font-heading text-xl text-forest">
                                {formatFullCurrency(auction.basePrice)}
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                {formatFullCurrency(auction.marketValue)}
                              </span>
                            </div>

                            {/* Details */}
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                              {auction.sqm && (
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
                                  </svg>
                                  {auction.sqm} mq
                                </span>
                              )}
                              {auction.rooms && (
                                <span className="flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                  </svg>
                                  {auction.rooms} vani
                                </span>
                              )}
                              <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                                Trib. {auction.tribunal}
                              </span>
                            </div>

                            {/* Auction Date */}
                            <div className="flex items-center justify-between pt-3 border-t">
                              <div className="text-sm">
                                <span className="text-gray-500">Asta: </span>
                                <span className={`font-medium ${isUrgent ? 'text-red-600' : 'text-forest'}`}>
                                  {formatDate(auction.auctionDate)}
                                </span>
                              </div>
                              <a
                                href={auction.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                              >
                                Dettagli
                                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* No Results */}
                  {sortedAuctions.length === 0 && (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <h3 className="font-heading text-xl text-gray-600 mb-2">Nessun immobile trovato</h3>
                      <p className="text-gray-500">Prova a modificare i filtri di ricerca</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-white py-12 md:py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-2xl md:text-3xl text-forest mb-6 text-center">
              Perche investire in aste immobiliari?
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg text-forest mb-2">Sconti fino al 40%</h3>
                <p className="text-sm text-gray-600">
                  Gli immobili all&apos;asta partono da prezzi base significativamente inferiori al valore di mercato.
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg text-forest mb-2">Procedura garantita</h3>
                <p className="text-sm text-gray-600">
                  Le aste giudiziarie sono supervisionate dal tribunale, garantendo trasparenza e sicurezza.
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-heading text-lg text-forest mb-2">Immobili di pregio</h3>
                <p className="text-sm text-gray-600">
                  Ville storiche, attici esclusivi e proprieta uniche normalmente fuori mercato.
                </p>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800">
                <strong>Nota:</strong> L&apos;acquisto all&apos;asta richiede competenze specifiche.
                Consigliamo di affidarsi a professionisti per la valutazione degli immobili,
                la verifica documentale e l&apos;assistenza nella procedura.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-600 py-12 md:py-16">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl md:text-3xl text-white mb-4">
            Vuoi investire in aste immobiliari?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente patrimoniale indipendente puo aiutarti a valutare le opportunita,
            strutturare l&apos;operazione e integrare l&apos;investimento nel tuo portafoglio.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      <RelatedTools tools={toolCorrelations['aste-immobiliari-luxury']} />

      <Footer />
    </main>
  )
}
