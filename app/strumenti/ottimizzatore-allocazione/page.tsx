'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget} from '@/components'

type Obiettivo = 'crescita' | 'reddito' | 'preservazione'

interface Allocazione {
  azioni: {
    usa: number
    europa: number
    emergenti: number
  }
  obbligazioni: {
    governative: number
    corporate: number
    highYield: number
  }
  liquidita: number
  alternative: {
    oro: number
    reit: number
    commodities: number
  }
}

interface ProfiloPreset {
  nome: string
  descrizione: string
  eta: number
  orizzonte: number
  tolleranza: number
  obiettivo: Obiettivo
}

const profiliPreset: ProfiloPreset[] = [
  {
    nome: 'Conservativo',
    descrizione: 'Basso rischio, focus su preservazione del capitale',
    eta: 60,
    orizzonte: 5,
    tolleranza: 3,
    obiettivo: 'preservazione',
  },
  {
    nome: 'Bilanciato',
    descrizione: 'Rischio moderato, equilibrio tra crescita e stabilita',
    eta: 45,
    orizzonte: 15,
    tolleranza: 5,
    obiettivo: 'crescita',
  },
  {
    nome: 'Aggressivo',
    descrizione: 'Alto rischio, massimizzazione della crescita',
    eta: 30,
    orizzonte: 25,
    tolleranza: 8,
    obiettivo: 'crescita',
  },
]

export default function OttimizzatoreAllocazione() {
  const [eta, setEta] = useState(40)
  const [orizzonte, setOrizzonte] = useState(15)
  const [tolleranza, setTolleranza] = useState(5)
  const [obiettivo, setObiettivo] = useState<Obiettivo>('crescita')
  const [patrimonio, setPatrimonio] = useState(500000)

  const allocazione = useMemo((): Allocazione => {
    // Regola base: 120 - eta = % azioni
    let baseAzioni = 120 - eta

    // Modifica per tolleranza al rischio (scala 1-10)
    // Tolleranza 5 = neutro, <5 riduce azioni, >5 aumenta azioni
    const tolleranzaModifier = (tolleranza - 5) * 3
    baseAzioni = baseAzioni + tolleranzaModifier

    // Modifica per orizzonte temporale
    // Orizzonte corto (<5 anni) riduce azioni, lungo (>15) aumenta
    if (orizzonte < 5) {
      baseAzioni = baseAzioni * 0.6
    } else if (orizzonte < 10) {
      baseAzioni = baseAzioni * 0.8
    } else if (orizzonte > 20) {
      baseAzioni = baseAzioni * 1.1
    }

    // Modifica per obiettivo
    if (obiettivo === 'reddito') {
      baseAzioni = baseAzioni * 0.8
    } else if (obiettivo === 'preservazione') {
      baseAzioni = baseAzioni * 0.5
    }

    // Normalizza tra 10% e 90%
    const percAzioni = Math.min(90, Math.max(10, baseAzioni))

    // Calcola obbligazioni base
    let percObbligazioni = (100 - percAzioni) * 0.7

    // Se obiettivo reddito, aumenta obbligazioni
    if (obiettivo === 'reddito') {
      percObbligazioni = Math.min(60, percObbligazioni * 1.3)
    }

    // Liquidita: minimo 5%, aumenta per preservazione
    let percLiquidita = obiettivo === 'preservazione' ? 15 : (obiettivo === 'reddito' ? 10 : 5)

    // Alternative: il resto
    let percAlternative = 100 - percAzioni - percObbligazioni - percLiquidita

    // Normalizza se necessario
    const totale = percAzioni + percObbligazioni + percLiquidita + percAlternative
    const factor = 100 / totale

    const azioniFinale = Math.round(percAzioni * factor)
    const obbligazioniFinale = Math.round(percObbligazioni * factor)
    const liquiditaFinale = Math.round(percLiquidita * factor)
    const alternativeFinale = 100 - azioniFinale - obbligazioniFinale - liquiditaFinale

    // Distribuzione azioni geografica basata su tolleranza
    const emergentiRatio = tolleranza > 6 ? 0.20 : (tolleranza > 4 ? 0.15 : 0.10)
    const usaRatio = 0.50 + (tolleranza > 6 ? 0.05 : 0)
    const europaRatio = 1 - usaRatio - emergentiRatio

    // Distribuzione obbligazioni
    const highYieldRatio = tolleranza > 6 ? 0.15 : (tolleranza > 4 ? 0.10 : 0.05)
    const corporateRatio = obiettivo === 'reddito' ? 0.45 : 0.35
    const govRatio = 1 - corporateRatio - highYieldRatio

    // Distribuzione alternative
    const oroRatio = obiettivo === 'preservazione' ? 0.6 : 0.4
    const reitRatio = obiettivo === 'reddito' ? 0.4 : 0.35
    const commoditiesRatio = 1 - oroRatio - reitRatio

    return {
      azioni: {
        usa: Math.round(azioniFinale * usaRatio),
        europa: Math.round(azioniFinale * europaRatio),
        emergenti: Math.round(azioniFinale * emergentiRatio),
      },
      obbligazioni: {
        governative: Math.round(obbligazioniFinale * govRatio),
        corporate: Math.round(obbligazioniFinale * corporateRatio),
        highYield: Math.round(obbligazioniFinale * highYieldRatio),
      },
      liquidita: liquiditaFinale,
      alternative: {
        oro: Math.round(alternativeFinale * oroRatio),
        reit: Math.round(alternativeFinale * reitRatio),
        commodities: Math.round(alternativeFinale * commoditiesRatio),
      },
    }
  }, [eta, orizzonte, tolleranza, obiettivo])

  const totaleAzioni = allocazione.azioni.usa + allocazione.azioni.europa + allocazione.azioni.emergenti
  const totaleObbligazioni = allocazione.obbligazioni.governative + allocazione.obbligazioni.corporate + allocazione.obbligazioni.highYield
  const totaleAlternative = allocazione.alternative.oro + allocazione.alternative.reit + allocazione.alternative.commodities

  // Metriche di rischio/rendimento
  const metriche = useMemo(() => {
    // Rendimento atteso basato su allocazione (stime storiche)
    const rendimentoAzioni = 7 // media storica
    const rendimentoObbligazioni = 3
    const rendimentoLiquidita = 2
    const rendimentoAlternative = 4

    const rendimentoAtteso =
      (totaleAzioni / 100) * rendimentoAzioni +
      (totaleObbligazioni / 100) * rendimentoObbligazioni +
      (allocazione.liquidita / 100) * rendimentoLiquidita +
      (totaleAlternative / 100) * rendimentoAlternative

    // Volatilita attesa (deviazione standard)
    const volatilitaAzioni = 18
    const volatilitaObbligazioni = 6
    const volatilitaLiquidita = 1
    const volatilitaAlternative = 12

    // Semplificazione: media ponderata (in realta sarebbe piu complesso con correlazioni)
    const volatilitaAttesa =
      (totaleAzioni / 100) * volatilitaAzioni +
      (totaleObbligazioni / 100) * volatilitaObbligazioni +
      (allocazione.liquidita / 100) * volatilitaLiquidita +
      (totaleAlternative / 100) * volatilitaAlternative

    // Max drawdown stimato (approssimazione)
    const maxDrawdown = volatilitaAttesa * 2.5

    // Range rendimento (1 deviazione standard)
    const rendimentoMin = rendimentoAtteso - volatilitaAttesa
    const rendimentoMax = rendimentoAtteso + volatilitaAttesa

    return {
      rendimentoAtteso: rendimentoAtteso.toFixed(1),
      rendimentoMin: rendimentoMin.toFixed(1),
      rendimentoMax: rendimentoMax.toFixed(1),
      volatilita: volatilitaAttesa.toFixed(1),
      maxDrawdown: maxDrawdown.toFixed(0),
    }
  }, [allocazione, totaleAzioni, totaleObbligazioni, totaleAlternative])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const applicaProfilo = (profilo: ProfiloPreset) => {
    setEta(profilo.eta)
    setOrizzonte(profilo.orizzonte)
    setTolleranza(profilo.tolleranza)
    setObiettivo(profilo.obiettivo)
  }

  // Dati per il grafico a torta
  const pieData = [
    { label: 'Azioni USA', value: allocazione.azioni.usa, color: '#2D6A4F' },
    { label: 'Azioni Europa', value: allocazione.azioni.europa, color: '#40916C' },
    { label: 'Azioni Emergenti', value: allocazione.azioni.emergenti, color: '#52B788' },
    { label: 'Obbl. Governative', value: allocazione.obbligazioni.governative, color: '#1B4D3E' },
    { label: 'Obbl. Corporate', value: allocazione.obbligazioni.corporate, color: '#2D5E4C' },
    { label: 'Obbl. High Yield', value: allocazione.obbligazioni.highYield, color: '#3D7A60' },
    { label: 'Liquidita', value: allocazione.liquidita, color: '#95D5B2' },
    { label: 'Oro', value: allocazione.alternative.oro, color: '#D4A373' },
    { label: 'REIT', value: allocazione.alternative.reit, color: '#B08968' },
    { label: 'Commodities', value: allocazione.alternative.commodities, color: '#C9B99A' },
  ].filter(d => d.value > 0)

  // Calcola angoli per il grafico a torta SVG
  const pieSlices = useMemo(() => {
    let currentAngle = -90 // Inizia dall'alto
    const slices: Array<{
      path: string
      color: string
      label: string
      value: number
      midAngle: number
    }> = []

    pieData.forEach((segment) => {
      const angle = (segment.value / 100) * 360
      const startAngle = currentAngle
      const endAngle = currentAngle + angle
      const midAngle = startAngle + angle / 2

      // Calcola i punti per l'arco
      const startRad = (startAngle * Math.PI) / 180
      const endRad = (endAngle * Math.PI) / 180

      const x1 = 100 + 80 * Math.cos(startRad)
      const y1 = 100 + 80 * Math.sin(startRad)
      const x2 = 100 + 80 * Math.cos(endRad)
      const y2 = 100 + 80 * Math.sin(endRad)

      const largeArc = angle > 180 ? 1 : 0

      const path = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArc} 1 ${x2} ${y2} Z`

      slices.push({
        path,
        color: segment.color,
        label: segment.label,
        value: segment.value,
        midAngle,
      })

      currentAngle = endAngle
    })

    return slices
  }, [pieData])

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
            Ottimizzatore Allocazione Portafoglio
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Calcola l&apos;allocazione ottimale per il tuo portafoglio in base al tuo profilo di rischio, eta e obiettivi finanziari.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          {/* Profili Preset */}
          <div className="mb-8">
            <h2 className="font-heading text-xl text-forest mb-4">Profili Predefiniti</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {profiliPreset.map((profilo) => (
                <button
                  key={profilo.nome}
                  onClick={() => applicaProfilo(profilo)}
                  className="bg-white rounded-card p-4 shadow-sm hover:shadow-md transition-all text-left border-2 border-transparent hover:border-green-400"
                >
                  <h3 className="font-heading text-lg text-forest">{profilo.nome}</h3>
                  <p className="text-sm text-gray-500 mt-1">{profilo.descrizione}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                      Eta: {profilo.eta}
                    </span>
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                      Rischio: {profilo.tolleranza}/10
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">Il Tuo Profilo</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Eta: {eta} anni
                  </label>
                  <input
                    type="range"
                    min="25"
                    max="75"
                    step="1"
                    value={eta}
                    onChange={(e) => setEta(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>25 anni</span>
                    <span>75 anni</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orizzonte temporale: {orizzonte} anni
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={orizzonte}
                    onChange={(e) => setOrizzonte(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1 anno</span>
                    <span>40 anni</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tolleranza al rischio: {tolleranza}/10
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={tolleranza}
                    onChange={(e) => setTolleranza(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1 (molto basso)</span>
                    <span>10 (molto alto)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Obiettivo di investimento
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'crescita' as const, label: 'Crescita', desc: 'Massimizzare il capitale' },
                      { value: 'reddito' as const, label: 'Reddito', desc: 'Generare entrate passive' },
                      { value: 'preservazione' as const, label: 'Preservazione', desc: 'Proteggere il capitale' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setObiettivo(opt.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          obiettivo === opt.value
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-green-300'
                        }`}
                      >
                        <span className={`block font-medium ${obiettivo === opt.value ? 'text-green-700' : 'text-gray-700'}`}>
                          {opt.label}
                        </span>
                        <span className="text-xs text-gray-500">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patrimonio totale: {formatCurrency(patrimonio)}
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
                    <span>10.000</span>
                    <span>5.000.000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {/* Pie Chart */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Allocazione Suggerita</h3>
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="w-52 h-52 relative">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {pieSlices.map((slice, index) => (
                        <path
                          key={index}
                          d={slice.path}
                          fill={slice.color}
                          stroke="white"
                          strokeWidth="2"
                          className="transition-all duration-300 hover:opacity-80"
                        />
                      ))}
                      <circle cx="100" cy="100" r="40" fill="white" />
                      <text x="100" y="95" textAnchor="middle" className="text-xs fill-gray-500">Totale</text>
                      <text x="100" y="115" textAnchor="middle" className="text-lg font-bold fill-forest">100%</text>
                    </svg>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-2 text-sm">
                    {pieData.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-600 truncate">{item.label}</span>
                        <span className="font-medium text-forest ml-auto">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Allocazione Dettagliata */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Dettaglio Allocazione</h3>

                <div className="space-y-4">
                  {/* Azioni */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-forest">Azioni ({totaleAzioni}%)</span>
                      <span className="text-green-600 font-semibold">{formatCurrency(patrimonio * totaleAzioni / 100)}</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                      <div className="bg-[#2D6A4F] h-full" style={{ width: `${(allocazione.azioni.usa / totaleAzioni) * 100}%` }} />
                      <div className="bg-[#40916C] h-full" style={{ width: `${(allocazione.azioni.europa / totaleAzioni) * 100}%` }} />
                      <div className="bg-[#52B788] h-full" style={{ width: `${(allocazione.azioni.emergenti / totaleAzioni) * 100}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>USA {allocazione.azioni.usa}%</span>
                      <span>Europa {allocazione.azioni.europa}%</span>
                      <span>Emergenti {allocazione.azioni.emergenti}%</span>
                    </div>
                  </div>

                  {/* Obbligazioni */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-forest">Obbligazioni ({totaleObbligazioni}%)</span>
                      <span className="text-green-600 font-semibold">{formatCurrency(patrimonio * totaleObbligazioni / 100)}</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                      <div className="bg-[#1B4D3E] h-full" style={{ width: `${(allocazione.obbligazioni.governative / totaleObbligazioni) * 100}%` }} />
                      <div className="bg-[#2D5E4C] h-full" style={{ width: `${(allocazione.obbligazioni.corporate / totaleObbligazioni) * 100}%` }} />
                      <div className="bg-[#3D7A60] h-full" style={{ width: `${(allocazione.obbligazioni.highYield / totaleObbligazioni) * 100}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Gov {allocazione.obbligazioni.governative}%</span>
                      <span>Corporate {allocazione.obbligazioni.corporate}%</span>
                      <span>High Yield {allocazione.obbligazioni.highYield}%</span>
                    </div>
                  </div>

                  {/* Liquidita */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-forest">Liquidita ({allocazione.liquidita}%)</span>
                      <span className="text-green-600 font-semibold">{formatCurrency(patrimonio * allocazione.liquidita / 100)}</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div className="bg-[#95D5B2] h-full" style={{ width: '100%' }} />
                    </div>
                  </div>

                  {/* Alternative */}
                  {totaleAlternative > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-forest">Alternative ({totaleAlternative}%)</span>
                        <span className="text-green-600 font-semibold">{formatCurrency(patrimonio * totaleAlternative / 100)}</span>
                      </div>
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                        <div className="bg-[#D4A373] h-full" style={{ width: `${(allocazione.alternative.oro / totaleAlternative) * 100}%` }} />
                        <div className="bg-[#B08968] h-full" style={{ width: `${(allocazione.alternative.reit / totaleAlternative) * 100}%` }} />
                        <div className="bg-[#C9B99A] h-full" style={{ width: `${(allocazione.alternative.commodities / totaleAlternative) * 100}%` }} />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Oro {allocazione.alternative.oro}%</span>
                        <span>REIT {allocazione.alternative.reit}%</span>
                        <span>Commodities {allocazione.alternative.commodities}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Metriche */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-600 rounded-card p-5 text-white">
                  <p className="text-green-100 text-sm mb-1">Rendimento Atteso</p>
                  <p className="font-heading text-2xl">{metriche.rendimentoAtteso}%</p>
                  <p className="text-green-200 text-xs mt-1">Range: {metriche.rendimentoMin}% - {metriche.rendimentoMax}%</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Volatilita Attesa</p>
                  <p className="font-heading text-2xl text-forest">{metriche.volatilita}%</p>
                  <p className="text-gray-400 text-xs mt-1">Deviazione standard annua</p>
                </div>
              </div>

              <div className="bg-white rounded-card p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Max Drawdown Storico Stimato</p>
                    <p className="font-heading text-xl text-red-600">-{metriche.maxDrawdown}%</p>
                  </div>
                  <div className="w-16 h-16 relative">
                    <svg viewBox="0 0 36 36" className="w-full h-full">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#fee2e2"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="3"
                        strokeDasharray={`${Number(metriche.maxDrawdown)}, 100`}
                      />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  Perdita massima potenziale in scenari di crisi
                </p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-12 bg-white rounded-card p-6 shadow-sm">
            <h2 className="font-heading text-xl text-forest mb-4">Come Funziona l&apos;Ottimizzatore</h2>
            <div className="prose prose-sm text-gray-600 max-w-none">
              <p>
                L&apos;ottimizzatore utilizza la <strong>Regola 120 modificata</strong>: sottraendo la tua eta da 120 si ottiene
                la percentuale base di azioni. Questa viene poi aggiustata in base a:
              </p>
              <ul className="list-disc pl-5 space-y-1 mt-3">
                <li><strong>Tolleranza al rischio:</strong> un punteggio alto aumenta l&apos;esposizione azionaria e agli emergenti</li>
                <li><strong>Orizzonte temporale:</strong> orizzonti brevi (&lt;5 anni) riducono significativamente le azioni</li>
                <li><strong>Obiettivo:</strong> &quot;reddito&quot; aumenta obbligazioni corporate, &quot;preservazione&quot; aumenta liquidita e oro</li>
              </ul>

              <h3 className="font-heading text-lg text-forest mt-6 mb-2">Disclaimer</h3>
              <p className="text-gray-500 text-sm">
                Questo strumento fornisce indicazioni generali basate su principi di asset allocation consolidati.
                Non costituisce consulenza finanziaria personalizzata. I rendimenti passati non garantiscono
                risultati futuri. Prima di investire, consulta un consulente finanziario qualificato.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Vuoi un&apos;allocazione personalizzata?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente indipendente puo aiutarti a costruire un portafoglio
            ottimizzato per la tua situazione specifica, considerando aspetti fiscali e patrimoniali.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom py-8">
        <RatingWidget toolSlug="ottimizzatore-allocazione" toolName="ottimizzatore-allocazione" />
      </div>

      <Footer />
    </main>
  )
}
