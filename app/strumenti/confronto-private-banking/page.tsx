'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer, RelatedTools, toolCorrelations , RatingWidget, FreeToolBanner} from '@/components'

// Define bank data interface
interface PrivateBank {
  id: string
  name: string
  logo?: string
  brandColor: string
  sogliaMinima: number
  feeMin: number
  feeMax: number
  rating: number
  servizi: string[]
  pro: string[]
  contro: string[]
  tipo: 'italiana' | 'svizzera' | 'internazionale'
  nota?: string
}

// Bank data
const privateBanks: PrivateBank[] = [
  {
    id: 'banca-generali',
    name: 'Banca Generali Private',
    brandColor: '#C8102E',
    sogliaMinima: 500000,
    feeMin: 1.0,
    feeMax: 1.5,
    rating: 4,
    servizi: ['Wealth management', 'Consulenza fiscale', 'Trust', 'Passaggio generazionale'],
    pro: ['Rete capillare in Italia', 'Servizio personalizzato', 'Ampia gamma di prodotti'],
    contro: ['Fee nella media di mercato', 'Prodotti prevalentemente interni'],
    tipo: 'italiana',
  },
  {
    id: 'mediobanca',
    name: 'Mediobanca Private Banking',
    brandColor: '#003366',
    sogliaMinima: 1000000,
    feeMin: 0.8,
    feeMax: 1.2,
    rating: 5,
    servizi: ['Investment banking', 'M&A advisory', 'Wealth planning', 'Club deal'],
    pro: ['Expertise corporate e M&A', 'Accesso a deal esclusivi', 'Advisory sofisticato'],
    contro: ['Soglia di ingresso alta', 'Meno adatto a patrimoni "semplici"'],
    tipo: 'italiana',
  },
  {
    id: 'intesa-pb',
    name: 'Intesa Sanpaolo Private Banking',
    brandColor: '#00875A',
    sogliaMinima: 500000,
    feeMin: 0.9,
    feeMax: 1.4,
    rating: 4,
    servizi: ['Full service', 'Art advisory', 'Real estate', 'Filantropia'],
    pro: ['Dimensione e stabilita', 'Servizi accessori completi', 'Presenza territoriale'],
    contro: ['Approccio meno personalizzato', 'Burocrazia da grande gruppo'],
    tipo: 'italiana',
  },
  {
    id: 'ubs',
    name: 'UBS Italia',
    brandColor: '#EC0000',
    sogliaMinima: 2000000,
    feeMin: 0.7,
    feeMax: 1.0,
    rating: 5,
    servizi: ['Global wealth management', 'Multi-currency', 'Lombard loan', 'Family office'],
    pro: ['Network internazionale', 'Research di alto livello', 'Piattaforma globale'],
    contro: ['Focus su UHNWI (Ultra High Net Worth)', 'Soglia molto alta'],
    tipo: 'svizzera',
    nota: 'Include ex Credit Suisse Italia',
  },
  {
    id: 'pictet',
    name: 'Pictet Italia',
    brandColor: '#1E3A5F',
    sogliaMinima: 1000000,
    feeMin: 0.6,
    feeMax: 0.9,
    rating: 5,
    servizi: ['Gestione patrimoniale', 'Fondi proprietari', 'Wealth planning', 'ESG investing'],
    pro: ['Indipendenza (partnership)', 'Approccio svizzero conservativo', 'Fee competitive'],
    contro: ['Meno servizi accessori', 'Presenza territoriale limitata'],
    tipo: 'svizzera',
  },
  {
    id: 'lombard-odier',
    name: 'Lombard Odier Italia',
    brandColor: '#002855',
    sogliaMinima: 1000000,
    feeMin: 0.7,
    feeMax: 1.0,
    rating: 5,
    servizi: ['Wealth planning', 'Impact investing', 'Tecnologia avanzata', 'Sostenibilita'],
    pro: ['Leader nella sostenibilita', 'Tecnologia proprietaria', 'Partnership indipendente'],
    contro: ['Presenza in Italia limitata', 'Minore notorieta'],
    tipo: 'svizzera',
  },
  {
    id: 'banca-aletti',
    name: 'Banca Aletti (Banco BPM)',
    brandColor: '#D4121A',
    sogliaMinima: 250000,
    feeMin: 1.0,
    feeMax: 1.5,
    rating: 3,
    servizi: ['Private banking', 'Gestioni patrimoniali', 'Consulenza', 'Finanziamenti'],
    pro: ['Soglia di ingresso accessibile', 'Radicamento territoriale', 'Flessibilita'],
    contro: ['Meno esclusivo', 'Offerta meno sofisticata'],
    tipo: 'italiana',
  },
  {
    id: 'fineco-pb',
    name: 'Fineco Private Banking',
    brandColor: '#003DA5',
    sogliaMinima: 500000,
    feeMin: 0.5,
    feeMax: 1.0,
    rating: 4,
    servizi: ['Piattaforma digitale', 'Consulenza', 'Trading', 'Fondi pensione'],
    pro: ['Costi molto competitivi', 'Tecnologia eccellente', 'Trasparenza'],
    contro: ['Meno "white glove"', 'Servizi accessori limitati'],
    tipo: 'italiana',
  },
  {
    id: 'banca-patrimoni-sella',
    name: 'Banca Patrimoni Sella',
    brandColor: '#003C71',
    sogliaMinima: 500000,
    feeMin: 0.9,
    feeMax: 1.3,
    rating: 4,
    servizi: ['Family office light', 'Consulenza patrimoniale', 'Art banking', 'Filantropia'],
    pro: ['Approccio familiare', 'Attenzione al cliente', 'Innovazione'],
    contro: ['Dimensione minore', 'Rete meno capillare'],
    tipo: 'italiana',
  },
]

// Star rating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-gold' : 'text-gray-200'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function ConfrontoPrivateBanking() {
  // Filters state
  const [sogliaFilter, setSogliaFilter] = useState<number>(0)
  const [feeMaxFilter, setFeeMaxFilter] = useState<number>(2)
  const [tipoFilter, setTipoFilter] = useState<string>('tutti')
  const [sortBy, setSortBy] = useState<'fee' | 'soglia' | 'rating'>('rating')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Cost calculator state
  const [patrimonio, setPatrimonio] = useState<number>(1000000)
  const [expandedBank, setExpandedBank] = useState<string | null>(null)

  // Filter and sort banks
  const filteredBanks = useMemo(() => {
    let banks = privateBanks.filter((bank) => {
      if (sogliaFilter > 0 && bank.sogliaMinima > sogliaFilter) return false
      if (bank.feeMin > feeMaxFilter) return false
      if (tipoFilter !== 'tutti' && bank.tipo !== tipoFilter) return false
      return true
    })

    // Sort
    banks.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'fee':
          comparison = a.feeMin - b.feeMin
          break
        case 'soglia':
          comparison = a.sogliaMinima - b.sogliaMinima
          break
        case 'rating':
          comparison = a.rating - b.rating
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    return banks
  }, [sogliaFilter, feeMaxFilter, tipoFilter, sortBy, sortDirection])

  // Calculate costs for each bank
  const costsPerBank = useMemo(() => {
    return privateBanks.map((bank) => ({
      ...bank,
      costoAnnuoMin: patrimonio * (bank.feeMin / 100),
      costoAnnuoMax: patrimonio * (bank.feeMax / 100),
      costoMensileMin: (patrimonio * (bank.feeMin / 100)) / 12,
      costoMensileMax: (patrimonio * (bank.feeMax / 100)) / 12,
    }))
  }, [patrimonio])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(1)}%`
  }

  const toggleSort = (field: 'fee' | 'soglia' | 'rating') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortDirection(field === 'fee' || field === 'soglia' ? 'asc' : 'desc')
    }
  }

  return (
    <main>
      <Navbar />
      <FreeToolBanner />

      {/* Hero Section */}
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
            Confronto Private Banking Italia 2024
          </h1>
          <p className="text-white/70 mt-2 max-w-2xl">
            Confronta le principali private bank e boutique finanziarie italiane: soglie di ingresso,
            commissioni, servizi offerti e punti di forza. Trova la soluzione giusta per il tuo patrimonio.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          {/* Filters */}
          <div className="bg-white rounded-card p-6 shadow-sm mb-8">
            <h2 className="font-heading text-xl text-forest mb-4">Filtra e Ordina</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {/* Soglia Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soglia massima di ingresso
                </label>
                <select
                  value={sogliaFilter}
                  onChange={(e) => setSogliaFilter(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value={0}>Tutte le soglie</option>
                  <option value={250000}>Fino a 250.000</option>
                  <option value={500000}>Fino a 500.000</option>
                  <option value={1000000}>Fino a 1.000.000</option>
                  <option value={2000000}>Fino a 2.000.000</option>
                </select>
              </div>

              {/* Fee Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fee massima: {formatPercent(feeMaxFilter)}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={feeMaxFilter}
                  onChange={(e) => setFeeMaxFilter(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
              </div>

              {/* Tipo Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo di banca</label>
                <select
                  value={tipoFilter}
                  onChange={(e) => setTipoFilter(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="tutti">Tutte</option>
                  <option value="italiana">Italiane</option>
                  <option value="svizzera">Svizzere</option>
                  <option value="internazionale">Internazionali</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ordina per</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleSort('rating')}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                      sortBy === 'rating'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-green-400'
                    }`}
                  >
                    Rating {sortBy === 'rating' && (sortDirection === 'desc' ? '↓' : '↑')}
                  </button>
                  <button
                    onClick={() => toggleSort('fee')}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                      sortBy === 'fee'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-green-400'
                    }`}
                  >
                    Fee {sortBy === 'fee' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                  <button
                    onClick={() => toggleSort('soglia')}
                    className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
                      sortBy === 'soglia'
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-green-400'
                    }`}
                  >
                    Soglia {sortBy === 'soglia' && (sortDirection === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results count */}
          <p className="text-sm text-gray-500 mb-4">
            {filteredBanks.length} banche trovate su {privateBanks.length}
          </p>

          {/* Comparison Table (Desktop) */}
          <div className="hidden lg:block bg-white rounded-card shadow-sm overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-forest text-white">
                  <tr>
                    <th className="text-left px-6 py-4 font-heading font-medium">Banca</th>
                    <th className="text-center px-4 py-4 font-heading font-medium">Tipo</th>
                    <th className="text-right px-4 py-4 font-heading font-medium cursor-pointer hover:bg-green-600 transition-colors" onClick={() => toggleSort('soglia')}>
                      Soglia Min. {sortBy === 'soglia' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-right px-4 py-4 font-heading font-medium cursor-pointer hover:bg-green-600 transition-colors" onClick={() => toggleSort('fee')}>
                      Fee Annua {sortBy === 'fee' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th className="text-center px-4 py-4 font-heading font-medium cursor-pointer hover:bg-green-600 transition-colors" onClick={() => toggleSort('rating')}>
                      Rating {sortBy === 'rating' && (sortDirection === 'desc' ? '↓' : '↑')}
                    </th>
                    <th className="text-center px-4 py-4 font-heading font-medium">Dettagli</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBanks.map((bank, index) => (
                    <>
                      <tr
                        key={bank.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-3 h-10 rounded"
                              style={{ backgroundColor: bank.brandColor }}
                            />
                            <div>
                              <p className="font-heading text-forest font-medium">{bank.name}</p>
                              {bank.nota && (
                                <p className="text-xs text-gray-400">{bank.nota}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                              bank.tipo === 'svizzera'
                                ? 'bg-red-100 text-red-700'
                                : bank.tipo === 'internazionale'
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {bank.tipo.charAt(0).toUpperCase() + bank.tipo.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="font-medium text-forest">
                            {formatCurrency(bank.sogliaMinima)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className="font-medium text-forest">
                            {formatPercent(bank.feeMin)} - {formatPercent(bank.feeMax)}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center">
                            <StarRating rating={bank.rating} />
                          </div>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => setExpandedBank(expandedBank === bank.id ? null : bank.id)}
                            className="text-green-600 hover:text-green-700 font-medium text-sm"
                          >
                            {expandedBank === bank.id ? 'Chiudi' : 'Espandi'}
                          </button>
                        </td>
                      </tr>
                      {expandedBank === bank.id && (
                        <tr className="bg-cream">
                          <td colSpan={6} className="px-6 py-6">
                            <div className="grid md:grid-cols-3 gap-6">
                              <div>
                                <h4 className="font-heading text-forest mb-2">Servizi</h4>
                                <ul className="space-y-1">
                                  {bank.servizi.map((servizio) => (
                                    <li key={servizio} className="text-sm text-gray-600 flex items-center gap-2">
                                      <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      {servizio}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-heading text-forest mb-2">Punti di forza</h4>
                                <ul className="space-y-1">
                                  {bank.pro.map((punto) => (
                                    <li key={punto} className="text-sm text-gray-600 flex items-start gap-2">
                                      <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                      {punto}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-heading text-forest mb-2">Punti di attenzione</h4>
                                <ul className="space-y-1">
                                  {bank.contro.map((punto) => (
                                    <li key={punto} className="text-sm text-gray-600 flex items-start gap-2">
                                      <svg className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                      </svg>
                                      {punto}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cards (Mobile) */}
          <div className="lg:hidden space-y-4 mb-8">
            {filteredBanks.map((bank) => (
              <div
                key={bank.id}
                className="bg-white rounded-card shadow-sm overflow-hidden"
              >
                <div
                  className="h-2"
                  style={{ backgroundColor: bank.brandColor }}
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-heading text-lg text-forest">{bank.name}</h3>
                      {bank.nota && (
                        <p className="text-xs text-gray-400">{bank.nota}</p>
                      )}
                    </div>
                    <StarRating rating={bank.rating} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Soglia minima</p>
                      <p className="font-medium text-forest">{formatCurrency(bank.sogliaMinima)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fee annua</p>
                      <p className="font-medium text-forest">
                        {formatPercent(bank.feeMin)} - {formatPercent(bank.feeMax)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        bank.tipo === 'svizzera'
                          ? 'bg-red-100 text-red-700'
                          : bank.tipo === 'internazionale'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {bank.tipo.charAt(0).toUpperCase() + bank.tipo.slice(1)}
                    </span>
                    {bank.servizi.slice(0, 2).map((servizio) => (
                      <span key={servizio} className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                        {servizio}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setExpandedBank(expandedBank === bank.id ? null : bank.id)}
                    className="w-full text-center py-2 text-green-600 font-medium text-sm border-t border-gray-100"
                  >
                    {expandedBank === bank.id ? 'Nascondi dettagli' : 'Mostra dettagli'}
                  </button>

                  {expandedBank === bank.id && (
                    <div className="pt-4 border-t border-gray-100 space-y-4">
                      <div>
                        <h4 className="font-heading text-sm text-forest mb-2">Servizi</h4>
                        <div className="flex flex-wrap gap-1">
                          {bank.servizi.map((servizio) => (
                            <span key={servizio} className="px-2 py-1 rounded text-xs bg-green-50 text-green-700">
                              {servizio}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-heading text-sm text-forest mb-2">Pro</h4>
                        <ul className="space-y-1">
                          {bank.pro.map((punto) => (
                            <li key={punto} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-green-500">+</span>
                              {punto}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-heading text-sm text-forest mb-2">Contro</h4>
                        <ul className="space-y-1">
                          {bank.contro.map((punto) => (
                            <li key={punto} className="text-sm text-gray-600 flex items-start gap-2">
                              <span className="text-amber-500">-</span>
                              {punto}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Cost Calculator */}
          <div className="bg-white rounded-card p-6 shadow-sm mb-8">
            <h2 className="font-heading text-xl text-forest mb-4">
              Calcolatore Costi: Quanto Pagheresti?
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              Inserisci il tuo patrimonio per vedere quanto pagheresti di commissioni con ogni banca.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Il tuo patrimonio: {formatCurrency(patrimonio)}
              </label>
              <input
                type="range"
                min="250000"
                max="5000000"
                step="50000"
                value={patrimonio}
                onChange={(e) => setPatrimonio(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>250k</span>
                <span>5M</span>
              </div>
            </div>

            {/* Cost comparison grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {costsPerBank
                .filter((bank) => bank.sogliaMinima <= patrimonio)
                .sort((a, b) => a.feeMin - b.feeMin)
                .map((bank) => (
                  <div
                    key={bank.id}
                    className="border border-gray-200 rounded-lg p-4 hover:border-green-400 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-2 h-6 rounded"
                        style={{ backgroundColor: bank.brandColor }}
                      />
                      <p className="font-heading text-forest text-sm">{bank.name}</p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Costo annuo</span>
                        <span className="font-medium text-forest">
                          {formatCurrency(bank.costoAnnuoMin)} - {formatCurrency(bank.costoAnnuoMax)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Costo mensile</span>
                        <span className="font-medium text-gray-600">
                          {formatCurrency(bank.costoMensileMin)} - {formatCurrency(bank.costoMensileMax)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {costsPerBank.filter((bank) => bank.sogliaMinima <= patrimonio).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Nessuna banca disponibile per patrimoni sotto {formatCurrency(250000)}.</p>
                <p className="text-sm mt-2">La soglia minima piu bassa e di {formatCurrency(250000)}.</p>
              </div>
            )}
          </div>

          {/* Comparison Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-card p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Fee piu basse</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong className="text-forest">Fineco Private Banking</strong> e <strong className="text-forest">Pictet</strong>
                {' '}offrono le fee piu competitive, a partire dallo 0.5-0.6% annuo.
              </p>
              <p className="text-xs text-gray-400">
                Ideali per chi vuole minimizzare i costi.
              </p>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center text-gold mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Piu accessibili</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong className="text-forest">Banca Aletti</strong> ha la soglia piu bassa (250.000),
                seguita da diverse banche a 500.000.
              </p>
              <p className="text-xs text-gray-400">
                Per patrimoni in crescita che vogliono iniziare.
              </p>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Svizzere top</h3>
              <p className="text-sm text-gray-600 mb-2">
                <strong className="text-forest">Pictet</strong>, <strong className="text-forest">Lombard Odier</strong> e
                {' '}<strong className="text-forest">UBS</strong> offrono l&apos;approccio svizzero: solidita, discrezione, indipendenza.
              </p>
              <p className="text-xs text-gray-400">
                Per chi cerca qualita e riservatezza.
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm text-amber-800 font-medium">Disclaimer</p>
                <p className="text-sm text-amber-700 mt-1">
                  I dati riportati sono indicativi e possono variare in base al profilo del cliente,
                  al patrimonio effettivo e alle condizioni di mercato. Le fee possono includere o escludere
                  diversi elementi (consulenza, prodotti, transazioni). Verificare sempre direttamente con
                  gli istituti per informazioni aggiornate e personalizzate.
                </p>
              </div>
            </div>
          </div>

          {/* Related Tools */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link
              href="/strumenti/costi-private-banking"
              className="group bg-white rounded-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2 group-hover:text-green-600 transition-colors">
                Analizzatore Costi Private Banking
              </h3>
              <p className="text-sm text-gray-500">
                Scopri quanto ti costano realmente le commissioni e quanto potresti risparmiare.
              </p>
            </Link>

            <Link
              href="/strumenti/family-office"
              className="group bg-white rounded-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2 group-hover:text-green-600 transition-colors">
                Simulatore Family Office
              </h3>
              <p className="text-sm text-gray-500">
                Valuta se un Family Office ha senso per il tuo patrimonio.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Vuoi una consulenza indipendente?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente finanziario indipendente puo aiutarti a scegliere la soluzione migliore
            per il tuo patrimonio, senza conflitti di interesse.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom pb-8">
        <RatingWidget toolSlug="confronto-private-banking" toolName="confronto-private-banking" />
      </div>

      <RelatedTools tools={toolCorrelations['confronto-private-banking']} />

      <Footer />
    </main>
  )
}
