'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget, ToolPageSchema, ConsultationPopup, useConsultationPopup} from '@/components'
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from 'recharts'

export default function InteresseCompostoAvanzato() {
  // Input parameters
  const [capitaleIniziale, setCapitaleIniziale] = useState(10000)
  const [versamentoMensile, setVersamentoMensile] = useState(500)
  const [rendimentoBase, setRendimentoBase] = useState(7)
  const [orizzonteAnni, setOrizzonteAnni] = useState(25)
  const [inflazione, setInflazione] = useState(2)
  const [aliquotaTasse, setAliquotaTasse] = useState(26)
  const [obiettivo, setObiettivo] = useState(500000)

  // Consultation popup state
  const [showPopup, setShowPopup] = useState(false)
  const [popupAmount, setPopupAmount] = useState(0)
  const { shouldShowPopup, THRESHOLD } = useConsultationPopup()

  useEffect(() => {
    if (capitaleIniziale >= THRESHOLD && shouldShowPopup()) {
      setPopupAmount(capitaleIniziale)
      setShowPopup(true)
    }
  }, [capitaleIniziale, THRESHOLD, shouldShowPopup])

  // Scenario rates
  const rendimentoPessimistico = Math.max(1, rendimentoBase - 3)
  const rendimentoOttimistico = rendimentoBase + 3

  // Calculations
  const risultati = useMemo(() => {
    const calcola = (tassoAnnuo: number, anniExtra = 0) => {
      const tassoMensile = tassoAnnuo / 100 / 12
      const tassoInflazioneMensile = inflazione / 100 / 12
      const mesiTotali = (orizzonteAnni + anniExtra) * 12

      let valore = capitaleIniziale
      let versato = capitaleIniziale
      let interessiTotali = 0
      let interessiSuInteressi = 0
      let interessiSuCapitale = 0

      const datiMensili: {
        mese: number
        anno: number
        valore: number
        valoreReale: number
        versato: number
        interessi: number
        interessiSuInteressi: number
      }[] = []

      for (let m = 0; m <= mesiTotali; m++) {
        const interessiMese = m > 0 ? valore * tassoMensile : 0
        const interessiSuCapitaleMese = m > 0 ? (versato * tassoMensile) : 0
        const interessiSuInteressiMese = interessiMese - interessiSuCapitaleMese

        interessiTotali += interessiMese
        interessiSuCapitale += interessiSuCapitaleMese
        interessiSuInteressi += interessiSuInteressiMese

        if (m > 0) {
          valore = valore * (1 + tassoMensile) + versamentoMensile
          versato += versamentoMensile
        }

        // Deflate for real value
        const fattoreInflazione = Math.pow(1 + tassoInflazioneMensile, m)
        const valoreReale = valore / fattoreInflazione

        if (m % 12 === 0) {
          datiMensili.push({
            mese: m,
            anno: m / 12,
            valore,
            valoreReale,
            versato,
            interessi: interessiTotali,
            interessiSuInteressi,
          })
        }
      }

      return {
        valoreFinale: valore,
        valoreReale: valore / Math.pow(1 + inflazione / 100, orizzonteAnni + anniExtra),
        totaleVersato: versato,
        interessiTotali,
        interessiSuInteressi,
        interessiSuCapitale,
        datiAnnuali: datiMensili,
      }
    }

    const scenarioBase = calcola(rendimentoBase)
    const scenarioPessimistico = calcola(rendimentoPessimistico)
    const scenarioOttimistico = calcola(rendimentoOttimistico)

    // Scenario senza versamenti
    const scenarioSenzaVersamenti = (() => {
      const tassoMensile = rendimentoBase / 100 / 12
      let valore = capitaleIniziale
      for (let m = 0; m < orizzonteAnni * 12; m++) {
        valore = valore * (1 + tassoMensile)
      }
      return valore
    })()

    // Scenario con 1% in piu/meno
    const scenarioPlus1 = calcola(rendimentoBase + 1)
    const scenarioMinus1 = calcola(rendimentoBase - 1)

    // Iniziare 5 anni prima/dopo
    const scenarioPrima5Anni = calcola(rendimentoBase, 5)
    const scenarioDopo5Anni = calcola(rendimentoBase, -5)

    // Calcolo milestones
    const findMilestone = (target: number, data: typeof scenarioBase.datiAnnuali) => {
      const found = data.find(d => d.valore >= target)
      return found ? found.anno : null
    }

    const findInterestiMaggioriVersamenti = (data: typeof scenarioBase.datiAnnuali) => {
      const versamentoAnnuo = versamentoMensile * 12
      for (let i = 1; i < data.length; i++) {
        const interessiAnno = data[i].interessi - (data[i-1]?.interessi || 0)
        if (interessiAnno > versamentoAnnuo) {
          return data[i].anno
        }
      }
      return null
    }

    const milestones = {
      interessi_maggiori_versamenti: findInterestiMaggioriVersamenti(scenarioBase.datiAnnuali),
      raggiungi_100k: findMilestone(100000, scenarioBase.datiAnnuali),
      raggiungi_500k: findMilestone(500000, scenarioBase.datiAnnuali),
      raggiungi_1M: findMilestone(1000000, scenarioBase.datiAnnuali),
      raggiungi_obiettivo: findMilestone(obiettivo, scenarioBase.datiAnnuali),
    }

    // Calcolo tasse
    const guadagnoLordo = scenarioBase.valoreFinale - scenarioBase.totaleVersato
    const tasse = guadagnoLordo * (aliquotaTasse / 100)
    const valoreNettoTasse = scenarioBase.valoreFinale - tasse

    // Dati per grafico scenari
    const datiScenari = scenarioBase.datiAnnuali.map((d, i) => ({
      anno: d.anno,
      pessimistico: scenarioPessimistico.datiAnnuali[i]?.valore || 0,
      base: d.valore,
      ottimistico: scenarioOttimistico.datiAnnuali[i]?.valore || 0,
    }))

    // Dati per grafico stacked (capitale vs interessi)
    const datiStacked = scenarioBase.datiAnnuali.map(d => ({
      anno: d.anno,
      capitale: d.versato,
      interessi: d.interessi,
      interessiSuInteressi: d.interessiSuInteressi,
    }))

    // Dati nominale vs reale
    const datiNominaleReale = scenarioBase.datiAnnuali.map(d => ({
      anno: d.anno,
      nominale: d.valore,
      reale: d.valoreReale,
    }))

    return {
      scenarioBase,
      scenarioPessimistico,
      scenarioOttimistico,
      scenarioSenzaVersamenti,
      scenarioPlus1,
      scenarioMinus1,
      scenarioPrima5Anni,
      scenarioDopo5Anni,
      milestones,
      tasse,
      valoreNettoTasse,
      datiScenari,
      datiStacked,
      datiNominaleReale,
    }
  }, [capitaleIniziale, versamentoMensile, rendimentoBase, orizzonteAnni, inflazione, aliquotaTasse, obiettivo, rendimentoPessimistico, rendimentoOttimistico])

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(2)}M`
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`
    }
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatCurrencyFull = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const progressoObiettivo = Math.min(100, (risultati.scenarioBase.valoreFinale / obiettivo) * 100)

  return (
    <main>
      <ToolPageSchema slug="interesse-composto-avanzato" />
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
            Visualizzatore Interesse Composto Avanzato
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Analisi completa con scenari multipli, inflazione, tassazione e la magia degli interessi composti.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          {/* Input Parameters */}
          <div className="bg-white rounded-card p-6 shadow-sm mb-8">
            <h2 className="font-heading text-xl text-forest mb-6">Parametri di Investimento</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capitale iniziale: {formatCurrencyFull(capitaleIniziale)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="5000"
                  value={capitaleIniziale}
                  onChange={(e) => setCapitaleIniziale(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0</span>
                  <span>500.000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Versamento mensile: {formatCurrencyFull(versamentoMensile)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="50"
                  value={versamentoMensile}
                  onChange={(e) => setVersamentoMensile(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0</span>
                  <span>3.000</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rendimento base atteso: {rendimentoBase}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="0.5"
                  value={rendimentoBase}
                  onChange={(e) => setRendimentoBase(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>1%</span>
                  <span>15%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orizzonte temporale: {orizzonteAnni} anni
                </label>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={orizzonteAnni}
                  onChange={(e) => setOrizzonteAnni(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>5</span>
                  <span>50</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Inflazione media: {inflazione}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={inflazione}
                  onChange={(e) => setInflazione(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0%</span>
                  <span>5%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tassazione capital gain: {aliquotaTasse}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="1"
                  value={aliquotaTasse}
                  onChange={(e) => setAliquotaTasse(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0%</span>
                  <span>35%</span>
                </div>
              </div>
            </div>

            {/* Obiettivo */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Obiettivo patrimoniale: {formatCurrencyFull(obiettivo)}
              </label>
              <input
                type="range"
                min="50000"
                max="2000000"
                step="50000"
                value={obiettivo}
                onChange={(e) => setObiettivo(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>50k</span>
                <span>2M</span>
              </div>
            </div>
          </div>

          {/* Main Results Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-green-600 rounded-card p-5 text-white">
              <p className="text-green-100 text-sm mb-1">Valore Finale (Scenario Base)</p>
              <p className="font-heading text-2xl md:text-3xl">{formatCurrencyFull(risultati.scenarioBase.valoreFinale)}</p>
              <p className="text-green-200 text-xs mt-1">Lordo, prima delle tasse</p>
            </div>

            <div className="bg-white rounded-card p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Valore Netto (dopo tasse)</p>
              <p className="font-heading text-2xl md:text-3xl text-forest">{formatCurrencyFull(risultati.valoreNettoTasse)}</p>
              <p className="text-gray-400 text-xs mt-1">Tasse: {formatCurrencyFull(risultati.tasse)}</p>
            </div>

            <div className="bg-white rounded-card p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Valore Reale (oggi)</p>
              <p className="font-heading text-2xl md:text-3xl text-forest">{formatCurrencyFull(risultati.scenarioBase.valoreReale)}</p>
              <p className="text-gray-400 text-xs mt-1">Aggiustato per inflazione {inflazione}%</p>
            </div>

            <div className="bg-white rounded-card p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Totale Versato</p>
              <p className="font-heading text-2xl md:text-3xl text-forest">{formatCurrencyFull(risultati.scenarioBase.totaleVersato)}</p>
              <p className="text-green-600 text-xs mt-1">Guadagno: +{((risultati.scenarioBase.valoreFinale / risultati.scenarioBase.totaleVersato - 1) * 100).toFixed(0)}%</p>
            </div>
          </div>

          {/* Progress Bar to Goal */}
          <div className="bg-white rounded-card p-6 shadow-sm mb-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-heading text-lg text-forest">Progresso verso obiettivo</h3>
              <span className="text-sm text-gray-500">
                {formatCurrencyFull(risultati.scenarioBase.valoreFinale)} / {formatCurrencyFull(obiettivo)}
              </span>
            </div>
            <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressoObiettivo >= 100 ? 'bg-green-500' : 'bg-green-400'}`}
                style={{ width: `${Math.min(100, progressoObiettivo)}%` }}
              />
            </div>
            <p className="text-right text-sm text-forest font-medium mt-2">
              {progressoObiettivo >= 100
                ? 'Obiettivo raggiunto!'
                : `${progressoObiettivo.toFixed(1)}% - Mancano ${formatCurrencyFull(obiettivo - risultati.scenarioBase.valoreFinale)}`}
            </p>
            {risultati.milestones.raggiungi_obiettivo && (
              <p className="text-sm text-green-600 mt-1">
                Raggiungerai {formatCurrencyFull(obiettivo)} all&apos;anno {risultati.milestones.raggiungi_obiettivo}
              </p>
            )}
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Scenario Comparison Chart */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">3 Scenari: Pessimistico / Base / Ottimistico</h3>
              <p className="text-xs text-gray-500 mb-4">
                {rendimentoPessimistico}% / {rendimentoBase}% / {rendimentoOttimistico}% rendimento annuo
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={risultati.datiScenari}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="anno"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${v}a`}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrencyFull(Number(value))}
                    labelFormatter={(label) => `Anno ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="pessimistico"
                    stroke="#dc2626"
                    strokeWidth={2}
                    dot={false}
                    name={`Pessimistico (${rendimentoPessimistico}%)`}
                  />
                  <Line
                    type="monotone"
                    dataKey="base"
                    stroke="#2D6A4F"
                    strokeWidth={3}
                    dot={false}
                    name={`Base (${rendimentoBase}%)`}
                  />
                  <Line
                    type="monotone"
                    dataKey="ottimistico"
                    stroke="#059669"
                    strokeWidth={2}
                    dot={false}
                    name={`Ottimistico (${rendimentoOttimistico}%)`}
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-3 gap-4 mt-4 text-center text-sm">
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-red-600 font-medium">{formatCurrencyFull(risultati.scenarioPessimistico.valoreFinale)}</p>
                  <p className="text-xs text-red-500">Pessimistico</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-green-700 font-medium">{formatCurrencyFull(risultati.scenarioBase.valoreFinale)}</p>
                  <p className="text-xs text-green-600">Base</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-lg">
                  <p className="text-emerald-600 font-medium">{formatCurrencyFull(risultati.scenarioOttimistico.valoreFinale)}</p>
                  <p className="text-xs text-emerald-500">Ottimistico</p>
                </div>
              </div>
            </div>

            {/* Stacked Area: Capital vs Interest */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">Capitale Versato vs Interessi</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={risultati.datiStacked}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="anno"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${v}a`}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrencyFull(Number(value))}
                    labelFormatter={(label) => `Anno ${label}`}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="capitale"
                    stackId="1"
                    stroke="#1B4D3E"
                    fill="#1B4D3E"
                    name="Capitale Versato"
                  />
                  <Area
                    type="monotone"
                    dataKey="interessi"
                    stackId="1"
                    stroke="#40916C"
                    fill="#40916C"
                    name="Interessi Totali"
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="flex justify-between mt-4 text-sm">
                <div>
                  <span className="inline-block w-3 h-3 bg-forest rounded mr-2"></span>
                  Versato: {formatCurrencyFull(risultati.scenarioBase.totaleVersato)}
                </div>
                <div>
                  <span className="inline-block w-3 h-3 bg-green-500 rounded mr-2"></span>
                  Interessi: {formatCurrencyFull(risultati.scenarioBase.interessiTotali)}
                </div>
              </div>
            </div>

            {/* Nominal vs Real Value */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">Valore Nominale vs Reale</h3>
              <p className="text-xs text-gray-500 mb-4">
                L&apos;inflazione al {inflazione}% erode il potere d&apos;acquisto nel tempo
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={risultati.datiNominaleReale}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="anno"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${v}a`}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrencyFull(Number(value))}
                    labelFormatter={(label) => `Anno ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="nominale"
                    stroke="#2D6A4F"
                    strokeWidth={2}
                    dot={false}
                    name="Valore Nominale"
                  />
                  <Line
                    type="monotone"
                    dataKey="reale"
                    stroke="#D4A373"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="Valore Reale (potere d'acquisto)"
                  />
                </LineChart>
              </ResponsiveContainer>

              <div className="bg-amber-50 p-3 rounded-lg mt-4">
                <p className="text-sm text-amber-800">
                  <strong>Perdita potere d&apos;acquisto:</strong> {formatCurrencyFull(risultati.scenarioBase.valoreFinale - risultati.scenarioBase.valoreReale)}
                  <span className="text-amber-600"> ({((1 - risultati.scenarioBase.valoreReale / risultati.scenarioBase.valoreFinale) * 100).toFixed(1)}%)</span>
                </p>
              </div>
            </div>

            {/* Magic of Compounding */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">La Magia del Compounding</h3>
              <p className="text-xs text-gray-500 mb-4">
                Quanto degli interessi viene da &quot;interessi su interessi&quot;?
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={risultati.datiStacked}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="anno"
                    tick={{ fontSize: 12 }}
                    tickFormatter={(v) => `${v}a`}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatCurrency}
                  />
                  <Tooltip
                    formatter={(value) => formatCurrencyFull(Number(value))}
                    labelFormatter={(label) => `Anno ${label}`}
                  />
                  <Legend />
                  <Bar
                    dataKey="interessiSuInteressi"
                    fill="#059669"
                    name="Interessi su Interessi"
                  />
                  <Line
                    type="monotone"
                    dataKey="interessi"
                    stroke="#1B4D3E"
                    strokeWidth={2}
                    dot={false}
                    name="Interessi Totali"
                  />
                </ComposedChart>
              </ResponsiveContainer>

              <div className="bg-green-50 p-4 rounded-lg mt-4">
                <p className="text-sm text-green-800 font-medium mb-1">Interessi su Interessi: {formatCurrencyFull(risultati.scenarioBase.interessiSuInteressi)}</p>
                <p className="text-xs text-green-600">
                  {((risultati.scenarioBase.interessiSuInteressi / risultati.scenarioBase.interessiTotali) * 100).toFixed(1)}% dei tuoi guadagni viene dal compounding puro!
                </p>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div className="bg-white rounded-card p-6 shadow-sm mb-8">
            <h3 className="font-heading text-xl text-forest mb-6">Milestones</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {risultati.milestones.interessi_maggiori_versamenti && (
                <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <p className="text-green-800 font-medium">Anno {risultati.milestones.interessi_maggiori_versamenti}</p>
                  <p className="text-sm text-green-600 mt-1">Interessi annui &gt; Versamenti annui</p>
                  <p className="text-xs text-green-500 mt-1">Il tuo denaro lavora piu di te!</p>
                </div>
              )}

              {risultati.milestones.raggiungi_100k && (
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                  <p className="text-forest font-medium">Anno {risultati.milestones.raggiungi_100k}</p>
                  <p className="text-sm text-gray-600 mt-1">Raggiungi 100.000 EUR</p>
                </div>
              )}

              {risultati.milestones.raggiungi_500k && (
                <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-gray-400">
                  <p className="text-forest font-medium">Anno {risultati.milestones.raggiungi_500k}</p>
                  <p className="text-sm text-gray-600 mt-1">Raggiungi 500.000 EUR</p>
                </div>
              )}

              {risultati.milestones.raggiungi_1M && (
                <div className="p-4 bg-green-400/20 rounded-lg border-l-4 border-green-400">
                  <p className="text-forest font-medium">Anno {risultati.milestones.raggiungi_1M}</p>
                  <p className="text-sm text-gray-600 mt-1">Diventi milionario!</p>
                </div>
              )}
            </div>
          </div>

          {/* Comparisons */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* With vs Without Contributions */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">Con vs Senza Versamenti Periodici</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-forest">Con {formatCurrencyFull(versamentoMensile)}/mese</p>
                    <p className="text-sm text-gray-500">Versamenti totali: {formatCurrencyFull(risultati.scenarioBase.totaleVersato)}</p>
                  </div>
                  <p className="font-heading text-xl text-green-600">{formatCurrencyFull(risultati.scenarioBase.valoreFinale)}</p>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-600">Solo capitale iniziale</p>
                    <p className="text-sm text-gray-400">Nessun versamento aggiuntivo</p>
                  </div>
                  <p className="font-heading text-xl text-gray-500">{formatCurrencyFull(risultati.scenarioSenzaVersamenti)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg text-center">
                  <p className="text-green-800 font-medium">
                    Differenza: +{formatCurrencyFull(risultati.scenarioBase.valoreFinale - risultati.scenarioSenzaVersamenti)}
                  </p>
                </div>
              </div>
            </div>

            {/* Effect of 1% More/Less */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">Effetto di 1% in Piu o Meno</h3>
              <p className="text-xs text-gray-500 mb-4">Su {orizzonteAnni} anni, anche piccole differenze contano</p>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-red-700">{rendimentoBase - 1}% annuo</p>
                    <p className="text-sm text-red-500">1% in meno del base</p>
                  </div>
                  <p className="font-heading text-xl text-red-600">{formatCurrencyFull(risultati.scenarioMinus1.valoreFinale)}</p>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div>
                    <p className="font-medium text-forest">{rendimentoBase}% annuo</p>
                    <p className="text-sm text-gray-500">Scenario base</p>
                  </div>
                  <p className="font-heading text-xl text-green-600">{formatCurrencyFull(risultati.scenarioBase.valoreFinale)}</p>
                </div>
                <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg">
                  <div>
                    <p className="font-medium text-emerald-700">{rendimentoBase + 1}% annuo</p>
                    <p className="text-sm text-emerald-500">1% in piu del base</p>
                  </div>
                  <p className="font-heading text-xl text-emerald-600">{formatCurrencyFull(risultati.scenarioPlus1.valoreFinale)}</p>
                </div>
                <div className="text-center text-sm text-gray-600">
                  <p>1% in piu = <span className="text-green-600 font-medium">+{formatCurrencyFull(risultati.scenarioPlus1.valoreFinale - risultati.scenarioBase.valoreFinale)}</span></p>
                  <p>1% in meno = <span className="text-red-600 font-medium">-{formatCurrencyFull(risultati.scenarioBase.valoreFinale - risultati.scenarioMinus1.valoreFinale)}</span></p>
                </div>
              </div>
            </div>
          </div>

          {/* Starting Earlier/Later */}
          <div className="bg-white rounded-card p-6 shadow-sm mb-8">
            <h3 className="font-heading text-xl text-forest mb-4">L&apos;importanza di Iniziare Presto</h3>
            <p className="text-sm text-gray-500 mb-6">Effetto di iniziare 5 anni prima o 5 anni dopo</p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-5 bg-emerald-50 rounded-lg text-center">
                <p className="text-sm text-emerald-600 mb-2">Iniziando 5 anni PRIMA</p>
                <p className="font-heading text-2xl text-emerald-700">{formatCurrencyFull(risultati.scenarioPrima5Anni.valoreFinale)}</p>
                <p className="text-xs text-emerald-500 mt-2">
                  +{formatCurrencyFull(risultati.scenarioPrima5Anni.valoreFinale - risultati.scenarioBase.valoreFinale)} extra
                </p>
              </div>

              <div className="p-5 bg-green-100 rounded-lg text-center border-2 border-green-300">
                <p className="text-sm text-forest mb-2">Scenario attuale ({orizzonteAnni} anni)</p>
                <p className="font-heading text-2xl text-forest">{formatCurrencyFull(risultati.scenarioBase.valoreFinale)}</p>
              </div>

              {orizzonteAnni > 5 && (
                <div className="p-5 bg-amber-50 rounded-lg text-center">
                  <p className="text-sm text-amber-600 mb-2">Iniziando 5 anni DOPO</p>
                  <p className="font-heading text-2xl text-amber-700">{formatCurrencyFull(risultati.scenarioDopo5Anni.valoreFinale)}</p>
                  <p className="text-xs text-amber-500 mt-2">
                    -{formatCurrencyFull(risultati.scenarioBase.valoreFinale - risultati.scenarioDopo5Anni.valoreFinale)} persi
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Costo opportunita:</strong> Aspettare 5 anni ti costa {formatCurrencyFull(risultati.scenarioPrima5Anni.valoreFinale - risultati.scenarioDopo5Anni.valoreFinale)}.
                Piu del {((1 - risultati.scenarioDopo5Anni.valoreFinale / risultati.scenarioPrima5Anni.valoreFinale) * 100).toFixed(0)}% in meno!
              </p>
            </div>
          </div>

          {/* Year by Year Table */}
          <div className="bg-white rounded-card p-6 shadow-sm">
            <h3 className="font-heading text-xl text-forest mb-4">Tabella Anno per Anno</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Anno</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-600">Valore</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-600">Versato</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-600">Interessi Tot.</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-600">Valore Reale</th>
                  </tr>
                </thead>
                <tbody>
                  {risultati.scenarioBase.datiAnnuali.filter((_, i) => i % Math.max(1, Math.floor(orizzonteAnni / 10)) === 0 || i === risultati.scenarioBase.datiAnnuali.length - 1).map((dato) => (
                    <tr key={dato.anno} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{dato.anno}</td>
                      <td className="py-3 px-2 text-right text-forest font-medium">{formatCurrencyFull(dato.valore)}</td>
                      <td className="py-3 px-2 text-right text-gray-500">{formatCurrencyFull(dato.versato)}</td>
                      <td className="py-3 px-2 text-right text-green-600">{formatCurrencyFull(dato.interessi)}</td>
                      <td className="py-3 px-2 text-right text-amber-600">{formatCurrencyFull(dato.valoreReale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-green-50 rounded-card p-6">
            <h3 className="font-heading text-lg text-forest mb-3">Come usare questo strumento</h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong>Scenario Base ({rendimentoBase}%):</strong> Rappresenta un rendimento medio storico per un portafoglio diversificato globale (es. MSCI World).
              </p>
              <p>
                <strong>Scenario Pessimistico ({rendimentoPessimistico}%):</strong> Considera un periodo di rendimenti sotto la media.
              </p>
              <p>
                <strong>Scenario Ottimistico ({rendimentoOttimistico}%):</strong> Un periodo particolarmente favorevole per i mercati.
              </p>
              <p>
                <strong>Tassazione:</strong> In Italia, il capital gain su ETF e azioni e tassato al 26%. Fondi pensione e PIR godono di aliquote agevolate.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Vuoi ottimizzare la tua strategia di investimento?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente indipendente puo aiutarti a costruire un piano personalizzato,
            ottimizzare le tasse e scegliere gli strumenti giusti per i tuoi obiettivi.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom py-8">
        <RatingWidget toolSlug="interesse-composto-avanzato" toolName="interesse-composto-avanzato" />
      </div>

      <ConsultationPopup
        isOpen={showPopup}
        amount={popupAmount}
        onClose={() => setShowPopup(false)}
      />

      <Footer />
    </main>
  )
}
