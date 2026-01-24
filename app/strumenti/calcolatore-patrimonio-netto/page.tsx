'use client'

import { useState, useMemo, useRef } from 'react'
import Link from 'next/link'
import { Navbar, Footer, RatingWidget, ToolPageSchema} from '@/components'

// Asset categories with colors for pie chart
const categorieAttivi = {
  liquidita: { nome: 'Liquidita', colore: '#6B7280', hex: '#6B7280' },
  investimenti: { nome: 'Investimenti Finanziari', colore: '#10B981', hex: '#10B981' },
  immobili: { nome: 'Immobili', colore: '#F59E0B', hex: '#F59E0B' },
  previdenza: { nome: 'Previdenza', colore: '#3B82F6', hex: '#3B82F6' },
  assicurazioni: { nome: 'Assicurazioni Vita', colore: '#8B5CF6', hex: '#8B5CF6' },
  partecipazioni: { nome: 'Partecipazioni Aziendali', colore: '#EC4899', hex: '#EC4899' },
  lusso: { nome: 'Beni di Lusso', colore: '#F97316', hex: '#F97316' },
  crypto: { nome: 'Crypto', colore: '#EAB308', hex: '#EAB308' },
  crediti: { nome: 'Crediti', colore: '#14B8A6', hex: '#14B8A6' },
}

const categoriePassivi = {
  mutui: { nome: 'Mutui', colore: '#EF4444', hex: '#EF4444' },
  prestiti: { nome: 'Prestiti Personali', colore: '#F97316', hex: '#F97316' },
  auto: { nome: 'Finanziamenti Auto', colore: '#F59E0B', hex: '#F59E0B' },
  carte: { nome: 'Carte Revolving', colore: '#EC4899', hex: '#EC4899' },
  altri: { nome: 'Altri Debiti', colore: '#6B7280', hex: '#6B7280' },
}

// Benchmark data for Italian HNWI
const benchmarks = [
  { label: 'Top 1% Italia', valore: 1500000, percentile: 99 },
  { label: 'Top 5% Italia', valore: 500000, percentile: 95 },
  { label: 'Top 10% Italia', valore: 250000, percentile: 90 },
  { label: 'Top 25% Italia', valore: 150000, percentile: 75 },
  { label: 'Mediana Italia', valore: 75000, percentile: 50 },
]

const obiettivi = [
  { label: '1 Milione', valore: 1000000 },
  { label: '2 Milioni', valore: 2000000 },
  { label: '5 Milioni', valore: 5000000 },
]

interface AssetInput {
  id: string
  label: string
  valore: number
  categoria: keyof typeof categorieAttivi
  placeholder: string
}

interface DebtInput {
  id: string
  label: string
  valore: number
  categoria: keyof typeof categoriePassivi
  placeholder: string
}

// Simple Pie Chart component using SVG
function PieChart({ data, size = 200 }: { data: { nome: string; valore: number; colore: string }[]; size?: number }) {
  const total = data.reduce((sum, d) => sum + d.valore, 0)
  if (total === 0) return null

  let cumulativeAngle = 0
  const radius = size / 2
  const centerX = radius
  const centerY = radius

  const paths = data.map((segment, i) => {
    const angle = (segment.valore / total) * 360
    const startAngle = cumulativeAngle
    const endAngle = cumulativeAngle + angle
    cumulativeAngle = endAngle

    // Convert angles to radians
    const startRad = ((startAngle - 90) * Math.PI) / 180
    const endRad = ((endAngle - 90) * Math.PI) / 180

    const x1 = centerX + radius * Math.cos(startRad)
    const y1 = centerY + radius * Math.sin(startRad)
    const x2 = centerX + radius * Math.cos(endRad)
    const y2 = centerY + radius * Math.sin(endRad)

    const largeArc = angle > 180 ? 1 : 0

    const d = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`

    return (
      <path
        key={i}
        d={d}
        fill={segment.colore}
        stroke="white"
        strokeWidth="2"
      />
    )
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {paths}
    </svg>
  )
}

export default function CalcolatorePatrimonioNettoAvanzato() {
  // Asset inputs
  const [attivi, setAttivi] = useState<AssetInput[]>([
    { id: '1', label: 'Conti correnti e depositi', valore: 25000, categoria: 'liquidita', placeholder: 'es. 25.000' },
    { id: '2', label: 'Azioni, obbligazioni, fondi, ETF', valore: 80000, categoria: 'investimenti', placeholder: 'es. 80.000' },
    { id: '3', label: 'Immobili (valore di mercato)', valore: 350000, categoria: 'immobili', placeholder: 'es. 350.000' },
    { id: '4', label: 'Fondi pensione e TFR', valore: 45000, categoria: 'previdenza', placeholder: 'es. 45.000' },
    { id: '5', label: 'Polizze vita (valore riscatto)', valore: 15000, categoria: 'assicurazioni', placeholder: 'es. 15.000' },
    { id: '6', label: 'Partecipazioni aziendali', valore: 0, categoria: 'partecipazioni', placeholder: 'es. 100.000' },
    { id: '7', label: 'Auto, orologi, arte, gioielli', valore: 20000, categoria: 'lusso', placeholder: 'es. 20.000' },
    { id: '8', label: 'Bitcoin, Ethereum, altro', valore: 5000, categoria: 'crypto', placeholder: 'es. 5.000' },
    { id: '9', label: 'Prestiti a terzi', valore: 0, categoria: 'crediti', placeholder: 'es. 10.000' },
  ])

  // Debt inputs
  const [passivi, setPassivi] = useState<DebtInput[]>([
    { id: '1', label: 'Mutui (debito residuo)', valore: 150000, categoria: 'mutui', placeholder: 'es. 150.000' },
    { id: '2', label: 'Prestiti personali', valore: 5000, categoria: 'prestiti', placeholder: 'es. 5.000' },
    { id: '3', label: 'Finanziamenti auto', valore: 8000, categoria: 'auto', placeholder: 'es. 8.000' },
    { id: '4', label: 'Carte revolving', valore: 0, categoria: 'carte', placeholder: 'es. 2.000' },
    { id: '5', label: 'Altri debiti', valore: 0, categoria: 'altri', placeholder: 'es. 3.000' },
  ])

  // Growth projection inputs
  const [tassoRendimento, setTassoRendimento] = useState(5)
  const [anniProiezione, setAnniProiezione] = useState(10)

  const reportRef = useRef<HTMLDivElement>(null)

  const risultati = useMemo(() => {
    const totaleAttivi = attivi.reduce((sum, a) => sum + a.valore, 0)
    const totalePassivi = passivi.reduce((sum, p) => sum + p.valore, 0)
    const patrimonioNetto = totaleAttivi - totalePassivi

    // Breakdown per categoria attivi
    const attiviPerCategoria = Object.keys(categorieAttivi).map((cat) => {
      const totale = attivi.filter(a => a.categoria === cat).reduce((sum, a) => sum + a.valore, 0)
      return {
        categoria: cat,
        ...categorieAttivi[cat as keyof typeof categorieAttivi],
        totale,
        percentuale: totaleAttivi > 0 ? (totale / totaleAttivi) * 100 : 0,
      }
    }).filter(c => c.totale > 0)

    // Breakdown per categoria passivi
    const passiviPerCategoria = Object.keys(categoriePassivi).map((cat) => {
      const totale = passivi.filter(p => p.categoria === cat).reduce((sum, p) => sum + p.valore, 0)
      return {
        categoria: cat,
        ...categoriePassivi[cat as keyof typeof categoriePassivi],
        totale,
        percentuale: totalePassivi > 0 ? (totale / totalePassivi) * 100 : 0,
      }
    }).filter(c => c.totale > 0)

    // Liquidita vs Illiquido
    const liquidita = attivi.filter(a => ['liquidita', 'investimenti', 'crypto'].includes(a.categoria)).reduce((sum, a) => sum + a.valore, 0)
    const illiquido = attivi.filter(a => ['immobili', 'partecipazioni', 'lusso', 'previdenza', 'assicurazioni', 'crediti'].includes(a.categoria)).reduce((sum, a) => sum + a.valore, 0)

    // Rapporto debito/patrimonio
    const rapportoDebitoPatrimonio = totaleAttivi > 0 ? (totalePassivi / totaleAttivi) * 100 : 0
    const rapportoDebitoNetto = patrimonioNetto > 0 ? (totalePassivi / patrimonioNetto) * 100 : 0

    // Benchmark positioning
    const posizioneBenchmark = benchmarks.find(b => patrimonioNetto >= b.valore)
    const percentileStimato = posizioneBenchmark?.percentile || (patrimonioNetto >= 0 ? 40 : 20)

    // Progress towards goals
    const progressoObiettivi = obiettivi.map(o => ({
      ...o,
      progresso: Math.min(100, (patrimonioNetto / o.valore) * 100),
      mancante: Math.max(0, o.valore - patrimonioNetto),
    }))

    // Growth projection (compound)
    const proiezioneCreascita = []
    let capitale = patrimonioNetto
    for (let anno = 0; anno <= anniProiezione; anno++) {
      proiezioneCreascita.push({ anno, capitale })
      capitale = capitale * (1 + tassoRendimento / 100)
    }

    // Allocation suggestions
    const suggerimenti: string[] = []

    const percLiquidita = totaleAttivi > 0 ? (liquidita / totaleAttivi) * 100 : 0
    const percImmobili = totaleAttivi > 0 ? (attivi.find(a => a.categoria === 'immobili')?.valore || 0) / totaleAttivi * 100 : 0
    const percCrypto = totaleAttivi > 0 ? (attivi.find(a => a.categoria === 'crypto')?.valore || 0) / totaleAttivi * 100 : 0

    if (percLiquidita < 10) {
      suggerimenti.push('La liquidita e sotto il 10%. Considera di aumentare il fondo emergenza.')
    }
    if (percLiquidita > 40) {
      suggerimenti.push('Hai molta liquidita (>40%). Potresti investirla per battere l\'inflazione.')
    }
    if (percImmobili > 70) {
      suggerimenti.push('Oltre il 70% in immobili: valuta la diversificazione in asset finanziari.')
    }
    if (percCrypto > 10) {
      suggerimenti.push('Crypto oltre il 10%: asset molto volatile, considera il bilanciamento.')
    }
    if (rapportoDebitoPatrimonio > 50) {
      suggerimenti.push('Debiti elevati (>50% degli attivi). Priorita: riduzione debito.')
    }
    if (rapportoDebitoPatrimonio > 0 && rapportoDebitoPatrimonio <= 30) {
      suggerimenti.push('Buon rapporto debito/patrimonio. Mantieni questo equilibrio.')
    }
    if (passivi.find(p => p.categoria === 'carte')?.valore || 0 > 0) {
      suggerimenti.push('Debito su carte revolving: tasso molto alto, estingui prioritariamente.')
    }

    if (suggerimenti.length === 0) {
      suggerimenti.push('Allocazione equilibrata. Continua a monitorare periodicamente.')
    }

    return {
      totaleAttivi,
      totalePassivi,
      patrimonioNetto,
      attiviPerCategoria,
      passiviPerCategoria,
      liquidita,
      illiquido,
      rapportoDebitoPatrimonio,
      rapportoDebitoNetto,
      percentileStimato,
      progressoObiettivi,
      proiezioneCreascita,
      suggerimenti,
    }
  }, [attivi, passivi, tassoRendimento, anniProiezione])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const updateAttivo = (id: string, valore: number) => {
    setAttivi(attivi.map(a => a.id === id ? { ...a, valore } : a))
  }

  const updatePassivo = (id: string, valore: number) => {
    setPassivi(passivi.map(p => p.id === id ? { ...p, valore } : p))
  }

  const handlePrint = () => {
    window.print()
  }

  const pieDataAttivi = risultati.attiviPerCategoria.map(c => ({
    nome: c.nome,
    valore: c.totale,
    colore: c.hex,
  }))

  return (
    <main>
      <ToolPageSchema slug="calcolatore-patrimonio-netto" />
      <Navbar />

      <section className="bg-forest pt-navbar">
        <div className="container-custom py-12">
          <Link href="/strumenti" className="inline-flex items-center text-green-300 hover:text-white mb-4 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tutti gli strumenti
          </Link>
          <h1 className="font-heading text-[32px] md:text-[42px] text-white leading-tight">
            Calcolatore Patrimonio Netto Avanzato
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Analisi completa del tuo patrimonio con benchmark, proiezioni e suggerimenti di allocazione. Nessun dato salvato.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream print:bg-white" ref={reportRef}>
        <div className="container-custom">
          {/* Main result card */}
          <div className={`rounded-card p-8 text-white mb-8 ${risultati.patrimonioNetto >= 0 ? 'bg-gradient-to-r from-green-600 to-green-700' : 'bg-gradient-to-r from-red-600 to-red-700'}`}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <p className="text-white/80 text-sm mb-1">Il tuo Patrimonio Netto</p>
                <p className="font-heading text-4xl md:text-5xl">{formatCurrency(risultati.patrimonioNetto)}</p>
                <div className="flex flex-wrap gap-4 mt-4 text-sm">
                  <div>
                    <span className="text-white/70">Attivita:</span>{' '}
                    <span className="font-medium">{formatCurrency(risultati.totaleAttivi)}</span>
                  </div>
                  <div>
                    <span className="text-white/70">Passivita:</span>{' '}
                    <span className="font-medium">{formatCurrency(risultati.totalePassivi)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white/70 text-sm">Posizione stimata</p>
                <p className="font-heading text-2xl">Top {100 - risultati.percentileStimato}%</p>
                <p className="text-white/70 text-xs">della popolazione italiana</p>
              </div>
            </div>
          </div>

          {/* Input sections */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Assets */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h2 className="font-heading text-xl text-forest mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Attivita (cio che possiedi)
              </h2>

              <div className="space-y-4">
                {attivi.map((attivo) => (
                  <div key={attivo.id} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: categorieAttivi[attivo.categoria].hex }} />
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">{attivo.label}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">EUR</span>
                        <input
                          type="number"
                          value={attivo.valore || ''}
                          onChange={(e) => updateAttivo(attivo.id, Number(e.target.value) || 0)}
                          placeholder={attivo.placeholder}
                          className="w-full pl-12 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Totale Attivita</span>
                  <span className="font-heading text-xl text-green-600">{formatCurrency(risultati.totaleAttivi)}</span>
                </div>
              </div>
            </div>

            {/* Liabilities */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h2 className="font-heading text-xl text-forest mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Passivita (cio che devi)
              </h2>

              <div className="space-y-4">
                {passivi.map((passivo) => (
                  <div key={passivo.id} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: categoriePassivi[passivo.categoria].hex }} />
                    <div className="flex-1">
                      <label className="block text-sm text-gray-600 mb-1">{passivo.label}</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">EUR</span>
                        <input
                          type="number"
                          value={passivo.valore || ''}
                          onChange={(e) => updatePassivo(passivo.id, Number(e.target.value) || 0)}
                          placeholder={passivo.placeholder}
                          className="w-full pl-12 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Totale Passivita</span>
                  <span className="font-heading text-xl text-red-600">{formatCurrency(risultati.totalePassivi)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis section */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Asset allocation pie chart */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">Asset Allocation</h3>
              <div className="flex justify-center mb-4">
                <PieChart data={pieDataAttivi} size={180} />
              </div>
              <div className="space-y-2 text-sm">
                {risultati.attiviPerCategoria.map((cat) => (
                  <div key={cat.categoria} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.hex }} />
                      <span className="text-gray-600">{cat.nome}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{cat.percentuale.toFixed(0)}%</span>
                      <span className="text-gray-400 text-xs ml-2">{formatCurrency(cat.totale)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Liquid vs Illiquid */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">Liquidita vs Illiquido</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Asset Liquidi</span>
                    <span className="font-medium text-green-600">{formatCurrency(risultati.liquidita)}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${risultati.totaleAttivi > 0 ? (risultati.liquidita / risultati.totaleAttivi) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Contanti, investimenti, crypto</p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Asset Illiquidi</span>
                    <span className="font-medium text-amber-600">{formatCurrency(risultati.illiquido)}</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${risultati.totaleAttivi > 0 ? (risultati.illiquido / risultati.totaleAttivi) * 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Immobili, previdenza, partecipazioni, beni</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Rapporto liquido/illiquido:{' '}
                  <span className="font-medium">
                    {risultati.totaleAttivi > 0
                      ? `${((risultati.liquidita / risultati.totaleAttivi) * 100).toFixed(0)}% / ${((risultati.illiquido / risultati.totaleAttivi) * 100).toFixed(0)}%`
                      : '0% / 0%'
                    }
                  </span>
                </p>
              </div>
            </div>

            {/* Debt ratios */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">Indicatori Debito</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Rapporto Debito/Attivi</p>
                  <p className={`font-heading text-2xl ${risultati.rapportoDebitoPatrimonio > 50 ? 'text-red-600' : risultati.rapportoDebitoPatrimonio > 30 ? 'text-amber-600' : 'text-green-600'}`}>
                    {risultati.rapportoDebitoPatrimonio.toFixed(1)}%
                  </p>
                  <div className="h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${risultati.rapportoDebitoPatrimonio > 50 ? 'bg-red-500' : risultati.rapportoDebitoPatrimonio > 30 ? 'bg-amber-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(100, risultati.rapportoDebitoPatrimonio)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Ideale: sotto 30%</p>
                </div>
                <div className="pt-3 border-t">
                  <p className="text-gray-500 text-sm mb-1">Rapporto Debito/Patrimonio Netto</p>
                  <p className={`font-heading text-xl ${risultati.rapportoDebitoNetto > 100 ? 'text-red-600' : 'text-forest'}`}>
                    {risultati.patrimonioNetto > 0 ? `${risultati.rapportoDebitoNetto.toFixed(1)}%` : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Benchmark comparison */}
          <div className="bg-white rounded-card p-6 shadow-sm mb-8">
            <h3 className="font-heading text-lg text-forest mb-4">Confronto con Benchmark HNWI Italiani</h3>
            <div className="space-y-3">
              {benchmarks.map((b) => {
                const isAbove = risultati.patrimonioNetto >= b.valore
                const progress = Math.min(100, (risultati.patrimonioNetto / b.valore) * 100)
                return (
                  <div key={b.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={isAbove ? 'text-green-600 font-medium' : 'text-gray-600'}>{b.label}</span>
                      <span className="text-gray-500">{formatCurrency(b.valore)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${isAbove ? 'bg-green-500' : 'bg-gray-300'}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Fonte: stime basate su dati Banca d&apos;Italia e ISTAT sulla distribuzione della ricchezza delle famiglie italiane.
            </p>
          </div>

          {/* Goals progress */}
          <div className="bg-white rounded-card p-6 shadow-sm mb-8">
            <h3 className="font-heading text-lg text-forest mb-4">Progresso verso Obiettivi</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {risultati.progressoObiettivi.map((obj) => (
                <div key={obj.label} className="text-center">
                  <div className="relative inline-flex items-center justify-center w-24 h-24">
                    <svg className="w-24 h-24 transform -rotate-90">
                      <circle
                        className="text-gray-200"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="48"
                        cy="48"
                      />
                      <circle
                        className="text-green-500"
                        strokeWidth="8"
                        strokeDasharray={`${obj.progresso * 2.51} 251`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="48"
                        cy="48"
                      />
                    </svg>
                    <span className="absolute font-heading text-lg">{obj.progresso.toFixed(0)}%</span>
                  </div>
                  <p className="font-medium text-forest mt-2">{obj.label}</p>
                  {obj.mancante > 0 && (
                    <p className="text-sm text-gray-500">Mancano {formatCurrency(obj.mancante)}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Growth projection */}
          <div className="bg-white rounded-card p-6 shadow-sm mb-8">
            <h3 className="font-heading text-lg text-forest mb-4">Proiezione Crescita Patrimonio</h3>
            <div className="flex flex-wrap gap-4 mb-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Rendimento annuo atteso</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="0.5"
                    value={tassoRendimento}
                    onChange={(e) => setTassoRendimento(Number(e.target.value))}
                    className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <span className="font-medium text-forest w-12">{tassoRendimento}%</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Anni di proiezione</label>
                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="5"
                    value={anniProiezione}
                    onChange={(e) => setAnniProiezione(Number(e.target.value))}
                    className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <span className="font-medium text-forest w-12">{anniProiezione} anni</span>
                </div>
              </div>
            </div>

            {/* Simple bar chart */}
            <div className="h-48 flex items-end gap-1 md:gap-2">
              {risultati.proiezioneCreascita.map((p, i) => {
                const maxVal = risultati.proiezioneCreascita[risultati.proiezioneCreascita.length - 1].capitale
                const height = maxVal > 0 ? (p.capitale / maxVal) * 100 : 0
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-green-500 rounded-t transition-all hover:bg-green-600 min-h-[4px]"
                      style={{ height: `${Math.max(2, height)}%` }}
                      title={formatCurrency(p.capitale)}
                    />
                    {(i === 0 || i === risultati.proiezioneCreascita.length - 1 || i % 2 === 0) && (
                      <span className="text-xs text-gray-400 mt-1">{p.anno}a</span>
                    )}
                  </div>
                )
              })}
            </div>
            <div className="flex justify-between mt-4 text-sm">
              <div>
                <span className="text-gray-500">Oggi:</span>{' '}
                <span className="font-medium text-forest">{formatCurrency(risultati.patrimonioNetto)}</span>
              </div>
              <div>
                <span className="text-gray-500">Tra {anniProiezione} anni:</span>{' '}
                <span className="font-medium text-green-600">{formatCurrency(risultati.proiezioneCreascita[risultati.proiezioneCreascita.length - 1]?.capitale || 0)}</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Proiezione basata su interesse composto al {tassoRendimento}% annuo, senza nuovi apporti.
            </p>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-card p-6 shadow-sm mb-8">
            <h3 className="font-heading text-lg text-forest mb-4">Suggerimenti di Allocazione</h3>
            <div className="space-y-3">
              {risultati.suggerimenti.map((sug, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-700">{sug}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Print/Export button */}
          <div className="flex justify-center gap-4 print:hidden">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-6 py-3 bg-forest text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Stampa / Salva PDF
            </button>
          </div>

          {/* Privacy notice */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg text-center">
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Nessun dato viene salvato o trasmesso. Tutti i calcoli avvengono localmente nel tuo browser.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom pb-8">
        <RatingWidget toolSlug="calcolatore-patrimonio-netto" toolName="calcolatore-patrimonio-netto" />
      </div>

      <section className="section-sm bg-green-600 print:hidden">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Vuoi ottimizzare il tuo patrimonio?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente patrimoniale indipendente puo aiutarti a ottimizzare l&apos;allocazione,
            ridurre la fiscalita e pianificare la crescita del tuo patrimonio.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      <Footer />

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-white {
            background-color: white !important;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </main>
  )
}
