'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer } from '@/components'

interface AssetClass {
  name: string
  color: string
  currentPercent: number
  targetPercent: number
}

interface RiskProfile {
  name: string
  description: string
  allocation: {
    azioni: number
    obbligazioni: number
    liquidita: number
    immobiliare: number
    oro: number
  }
}

const riskProfiles: RiskProfile[] = [
  {
    name: 'Conservativo',
    description: 'Basso rischio, focus su stabilita e preservazione del capitale',
    allocation: { azioni: 20, obbligazioni: 50, liquidita: 15, immobiliare: 10, oro: 5 },
  },
  {
    name: 'Moderato',
    description: 'Bilanciamento tra crescita e stabilita',
    allocation: { azioni: 40, obbligazioni: 35, liquidita: 10, immobiliare: 10, oro: 5 },
  },
  {
    name: 'Bilanciato',
    description: 'Mix equilibrato tra tutte le asset class',
    allocation: { azioni: 50, obbligazioni: 25, liquidita: 10, immobiliare: 10, oro: 5 },
  },
  {
    name: 'Dinamico',
    description: 'Orientato alla crescita con rischio moderato-alto',
    allocation: { azioni: 65, obbligazioni: 15, liquidita: 5, immobiliare: 10, oro: 5 },
  },
  {
    name: 'Aggressivo',
    description: 'Alto rischio, massima esposizione azionaria',
    allocation: { azioni: 80, obbligazioni: 5, liquidita: 5, immobiliare: 5, oro: 5 },
  },
]

export default function PortfolioRebalancer() {
  const [patrimonio, setPatrimonio] = useState(500000)
  const [commissionePercent, setCommissionePercent] = useState(0.1)

  // Allocazione attuale
  const [currentAzioni, setCurrentAzioni] = useState(45)
  const [currentObbligazioni, setCurrentObbligazioni] = useState(30)
  const [currentLiquidita, setCurrentLiquidita] = useState(10)
  const [currentImmobiliare, setCurrentImmobiliare] = useState(10)
  const [currentOro, setCurrentOro] = useState(5)

  // Allocazione target
  const [targetAzioni, setTargetAzioni] = useState(50)
  const [targetObbligazioni, setTargetObbligazioni] = useState(25)
  const [targetLiquidita, setTargetLiquidita] = useState(10)
  const [targetImmobiliare, setTargetImmobiliare] = useState(10)
  const [targetOro, setTargetOro] = useState(5)

  const currentTotal = currentAzioni + currentObbligazioni + currentLiquidita + currentImmobiliare + currentOro
  const targetTotal = targetAzioni + targetObbligazioni + targetLiquidita + targetImmobiliare + targetOro

  const assetClasses: AssetClass[] = useMemo(() => [
    { name: 'Azioni', color: '#2D6A4F', currentPercent: currentAzioni, targetPercent: targetAzioni },
    { name: 'Obbligazioni', color: '#40916C', currentPercent: currentObbligazioni, targetPercent: targetObbligazioni },
    { name: 'Liquidita', color: '#52B788', currentPercent: currentLiquidita, targetPercent: targetLiquidita },
    { name: 'Immobiliare', color: '#74C69D', currentPercent: currentImmobiliare, targetPercent: targetImmobiliare },
    { name: 'Oro/Commodities', color: '#D4A373', currentPercent: currentOro, targetPercent: targetOro },
  ], [currentAzioni, currentObbligazioni, currentLiquidita, currentImmobiliare, currentOro,
      targetAzioni, targetObbligazioni, targetLiquidita, targetImmobiliare, targetOro])

  const risultati = useMemo(() => {
    const operazioni = assetClasses.map(asset => {
      const valoreAttuale = (asset.currentPercent / 100) * patrimonio
      const valoreTarget = (asset.targetPercent / 100) * patrimonio
      const differenza = valoreTarget - valoreAttuale
      const drift = asset.targetPercent - asset.currentPercent

      return {
        name: asset.name,
        color: asset.color,
        valoreAttuale,
        valoreTarget,
        differenza,
        drift,
        operazione: differenza > 0 ? 'COMPRARE' : differenza < 0 ? 'VENDERE' : 'MANTENERE',
      }
    })

    // Calcola il totale da movimentare (solo operazioni di acquisto/vendita)
    const totaleMovimentato = operazioni.reduce((sum, op) => sum + Math.abs(op.differenza), 0) / 2
    const costoCommissioni = totaleMovimentato * (commissionePercent / 100)

    // Calcola il drift massimo
    const maxDrift = Math.max(...operazioni.map(op => Math.abs(op.drift)))

    return {
      operazioni,
      totaleMovimentato,
      costoCommissioni,
      maxDrift,
      portafoglioSbilanciato: maxDrift > 10,
    }
  }, [assetClasses, patrimonio, commissionePercent])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const applyProfile = (profile: RiskProfile) => {
    setTargetAzioni(profile.allocation.azioni)
    setTargetObbligazioni(profile.allocation.obbligazioni)
    setTargetLiquidita(profile.allocation.liquidita)
    setTargetImmobiliare(profile.allocation.immobiliare)
    setTargetOro(profile.allocation.oro)
  }

  // Funzione per generare il path del grafico a torta
  const generatePieChart = (data: { percent: number; color: string }[], size: number) => {
    const center = size / 2
    const radius = size / 2 - 4
    let startAngle = -90 // Inizia dall'alto

    return data.map((slice, index) => {
      if (slice.percent === 0) return null

      const angle = (slice.percent / 100) * 360
      const endAngle = startAngle + angle

      const startRad = (startAngle * Math.PI) / 180
      const endRad = (endAngle * Math.PI) / 180

      const x1 = center + radius * Math.cos(startRad)
      const y1 = center + radius * Math.sin(startRad)
      const x2 = center + radius * Math.cos(endRad)
      const y2 = center + radius * Math.sin(endRad)

      const largeArcFlag = angle > 180 ? 1 : 0

      const path = `M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

      startAngle = endAngle

      return <path key={index} d={path} fill={slice.color} />
    })
  }

  const currentPieData = assetClasses.map(a => ({ percent: a.currentPercent, color: a.color }))
  const targetPieData = assetClasses.map(a => ({ percent: a.targetPercent, color: a.color }))

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
            Portfolio Rebalancer
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Analizza la composizione del tuo portafoglio e calcola le operazioni necessarie per ribilanciarlo verso l&apos;allocazione target.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          {/* Alert sbilanciamento */}
          {risultati.portafoglioSbilanciato && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
              <svg className="w-6 h-6 text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-semibold text-amber-800">Portafoglio sbilanciato</p>
                <p className="text-sm text-amber-700">
                  Il drift massimo e del {risultati.maxDrift.toFixed(1)}%, superiore alla soglia consigliata del 10%.
                  Considera di ribilanciare il portafoglio.
                </p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Allocazione */}
            <div className="space-y-6">
              {/* Patrimonio */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-xl text-forest mb-6">Patrimonio Totale</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valore portafoglio: {formatCurrency(patrimonio)}
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="5000000"
                    step="10000"
                    value={patrimonio}
                    onChange={(e) => setPatrimonio(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>10.000 EUR</span>
                    <span>5.000.000 EUR</span>
                  </div>
                </div>
              </div>

              {/* Allocazione Attuale */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xl text-forest">Allocazione Attuale</h2>
                  <span className={`text-sm font-medium ${currentTotal === 100 ? 'text-green-600' : 'text-red-500'}`}>
                    Totale: {currentTotal}%
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Azioni: {currentAzioni}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={currentAzioni}
                      onChange={(e) => setCurrentAzioni(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Obbligazioni: {currentObbligazioni}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={currentObbligazioni}
                      onChange={(e) => setCurrentObbligazioni(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Liquidita: {currentLiquidita}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={currentLiquidita}
                      onChange={(e) => setCurrentLiquidita(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Immobiliare: {currentImmobiliare}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={currentImmobiliare}
                      onChange={(e) => setCurrentImmobiliare(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Oro/Commodities: {currentOro}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={currentOro}
                      onChange={(e) => setCurrentOro(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>
                </div>
              </div>

              {/* Allocazione Target */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-xl text-forest">Allocazione Target</h2>
                  <span className={`text-sm font-medium ${targetTotal === 100 ? 'text-green-600' : 'text-red-500'}`}>
                    Totale: {targetTotal}%
                  </span>
                </div>

                {/* Profili di rischio */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Suggerimenti per profilo di rischio:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {riskProfiles.map((profile) => (
                      <button
                        key={profile.name}
                        onClick={() => applyProfile(profile)}
                        className="px-3 py-1.5 text-sm rounded-full border border-green-300 text-green-700 hover:bg-green-50 transition-colors"
                        title={profile.description}
                      >
                        {profile.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Azioni: {targetAzioni}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={targetAzioni}
                      onChange={(e) => setTargetAzioni(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Obbligazioni: {targetObbligazioni}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={targetObbligazioni}
                      onChange={(e) => setTargetObbligazioni(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Liquidita: {targetLiquidita}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={targetLiquidita}
                      onChange={(e) => setTargetLiquidita(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Immobiliare: {targetImmobiliare}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={targetImmobiliare}
                      onChange={(e) => setTargetImmobiliare(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Oro/Commodities: {targetOro}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={targetOro}
                      onChange={(e) => setTargetOro(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Risultati */}
            <div className="space-y-6">
              {/* Grafici a torta */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-xl text-forest mb-6">Confronto Allocazione</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto mb-3">
                      {currentTotal === 100 ? generatePieChart(currentPieData, 100) : (
                        <circle cx="50" cy="50" r="46" fill="#e5e7eb" />
                      )}
                    </svg>
                    <p className="font-medium text-forest">Attuale</p>
                  </div>
                  <div className="text-center">
                    <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto mb-3">
                      {targetTotal === 100 ? generatePieChart(targetPieData, 100) : (
                        <circle cx="50" cy="50" r="46" fill="#e5e7eb" />
                      )}
                    </svg>
                    <p className="font-medium text-forest">Target</p>
                  </div>
                </div>
                {/* Legenda */}
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {assetClasses.map((asset) => (
                    <div key={asset.name} className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: asset.color }} />
                      <span className="text-xs text-gray-600">{asset.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operazioni da effettuare */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-xl text-forest mb-6">Operazioni di Ribilanciamento</h2>

                {currentTotal !== 100 || targetTotal !== 100 ? (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p>Le allocazioni devono sommare a 100%</p>
                    <p className="text-sm mt-1">Attuale: {currentTotal}% | Target: {targetTotal}%</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {risultati.operazioni.map((op) => (
                      <div
                        key={op.name}
                        className={`p-4 rounded-lg border ${
                          op.operazione === 'MANTENERE'
                            ? 'bg-gray-50 border-gray-200'
                            : op.operazione === 'COMPRARE'
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: op.color }} />
                            <span className="font-medium text-gray-800">{op.name}</span>
                          </div>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              op.operazione === 'MANTENERE'
                                ? 'bg-gray-200 text-gray-600'
                                : op.operazione === 'COMPRARE'
                                ? 'bg-green-200 text-green-700'
                                : 'bg-red-200 text-red-700'
                            }`}
                          >
                            {op.operazione}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-gray-500">Attuale</p>
                            <p className="font-medium">{formatCurrency(op.valoreAttuale)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Target</p>
                            <p className="font-medium">{formatCurrency(op.valoreTarget)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Differenza</p>
                            <p className={`font-medium ${op.differenza > 0 ? 'text-green-600' : op.differenza < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                              {op.differenza > 0 ? '+' : ''}{formatCurrency(op.differenza)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Drift: {op.drift > 0 ? '+' : ''}{op.drift.toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Costi stimati */}
              {currentTotal === 100 && targetTotal === 100 && (
                <div className="bg-white rounded-card p-6 shadow-sm">
                  <h2 className="font-heading text-xl text-forest mb-4">Costi Stimati</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Commissione di negoziazione: {commissionePercent}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={commissionePercent}
                        onChange={(e) => setCommissionePercent(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>0%</span>
                        <span>1%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Totale Movimentato</p>
                        <p className="font-heading text-xl text-forest">{formatCurrency(risultati.totaleMovimentato)}</p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">Costo Commissioni</p>
                        <p className="font-heading text-xl text-amber-700">{formatCurrency(risultati.costoCommissioni)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profili di rischio dettagliati */}
          <div className="mt-12 bg-white rounded-card p-6 shadow-sm">
            <h2 className="font-heading text-xl text-forest mb-6">Profili di Rischio Suggeriti</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Profilo</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Azioni</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Obbligazioni</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Liquidita</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Immobiliare</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Oro</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Descrizione</th>
                  </tr>
                </thead>
                <tbody>
                  {riskProfiles.map((profile) => (
                    <tr key={profile.name} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-forest">{profile.name}</td>
                      <td className="text-center py-3 px-4">{profile.allocation.azioni}%</td>
                      <td className="text-center py-3 px-4">{profile.allocation.obbligazioni}%</td>
                      <td className="text-center py-3 px-4">{profile.allocation.liquidita}%</td>
                      <td className="text-center py-3 px-4">{profile.allocation.immobiliare}%</td>
                      <td className="text-center py-3 px-4">{profile.allocation.oro}%</td>
                      <td className="py-3 px-4 text-gray-500">{profile.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 bg-white rounded-card p-6 shadow-sm">
            <h2 className="font-heading text-xl text-forest mb-4">Cos&apos;e il Ribilanciamento?</h2>
            <div className="prose prose-sm text-gray-600 max-w-none">
              <p>
                Il <strong>ribilanciamento del portafoglio</strong> e il processo di riallineamento
                delle percentuali delle diverse asset class alla tua allocazione target originale.
                Col tempo, i rendimenti diversi delle varie classi di attivo possono far deviare
                il portafoglio dalla strategia prevista.
              </p>
              <h3 className="font-heading text-lg text-forest mt-4 mb-2">Perche Ribilanciare?</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Controllo del rischio:</strong> Mantiene il profilo di rischio coerente con i tuoi obiettivi</li>
                <li><strong>Disciplina:</strong> Evita decisioni emotive comprando basso e vendendo alto</li>
                <li><strong>Diversificazione:</strong> Preserva i benefici della diversificazione nel tempo</li>
              </ul>
              <h3 className="font-heading text-lg text-forest mt-4 mb-2">Quando Ribilanciare?</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Soglia percentuale:</strong> Quando una classe devia oltre il 5-10% dal target</li>
                <li><strong>Periodicita fissa:</strong> Annualmente o semestralmente</li>
                <li><strong>Eventi significativi:</strong> Cambio di obiettivi o situazione personale</li>
              </ul>
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
            Un consulente indipendente puo aiutarti a definire l&apos;allocazione ottimale
            in base ai tuoi obiettivi, orizzonte temporale e propensione al rischio.
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
