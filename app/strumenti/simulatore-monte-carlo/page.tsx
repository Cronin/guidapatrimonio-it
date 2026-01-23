'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer } from '@/components'

// Box-Muller transform for generating normal distribution
function randomNormal(): number {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
}

type Preset = 'conservativo' | 'bilanciato' | 'aggressivo' | 'custom'

interface SimulationResult {
  anno: number
  p5: number
  p25: number
  p50: number
  p75: number
  p95: number
}

interface SimulationOutput {
  percorsi: SimulationResult[]
  valoreFinaleP5: number
  valoreFinaleP25: number
  valoreFinaleP50: number
  valoreFinaleP75: number
  valoreFinaleP95: number
  probabilitaRaddoppio: number
  probabilitaObiettivo: number
  totaleVersato: number
}

export default function SimulatoreMonteCarloPage() {
  const [capitale, setCapitale] = useState(50000)
  const [versamentoMensile, setVersamentoMensile] = useState(500)
  const [rendimentoMedio, setRendimentoMedio] = useState(6)
  const [volatilita, setVolatilita] = useState(12)
  const [anni, setAnni] = useState(20)
  const [numSimulazioni, setNumSimulazioni] = useState(1000)
  const [obiettivo, setObiettivo] = useState(200000)
  const [preset, setPreset] = useState<Preset>('bilanciato')

  const presets = {
    conservativo: { rendimento: 4, volatilita: 8, label: 'Conservativo', desc: 'Obbligazioni, depositi' },
    bilanciato: { rendimento: 6, volatilita: 12, label: 'Bilanciato', desc: '60% azioni, 40% bond' },
    aggressivo: { rendimento: 8, volatilita: 18, label: 'Aggressivo', desc: '100% azioni globali' },
  }

  const handlePresetChange = (newPreset: Preset) => {
    setPreset(newPreset)
    if (newPreset !== 'custom') {
      setRendimentoMedio(presets[newPreset].rendimento)
      setVolatilita(presets[newPreset].volatilita)
    }
  }

  const risultati = useMemo<SimulationOutput>(() => {
    const rendimentoAnnuo = rendimentoMedio / 100
    const devStdAnnua = volatilita / 100
    const versamentoAnnuo = versamentoMensile * 12

    // Genera tutte le simulazioni
    const simulazioni: number[][] = []

    for (let sim = 0; sim < numSimulazioni; sim++) {
      const percorso: number[] = [capitale]
      let valoreCorrente = capitale

      for (let anno = 1; anno <= anni; anno++) {
        // Rendimento casuale con distribuzione normale
        const rendimentoRandom = rendimentoAnnuo + devStdAnnua * randomNormal()
        valoreCorrente = valoreCorrente * (1 + rendimentoRandom) + versamentoAnnuo
        percorso.push(Math.max(0, valoreCorrente))
      }

      simulazioni.push(percorso)
    }

    // Calcola percentili per ogni anno
    const percorsi: SimulationResult[] = []
    for (let anno = 0; anno <= anni; anno++) {
      const valoriAnno = simulazioni.map(s => s[anno]).sort((a, b) => a - b)
      const n = valoriAnno.length

      percorsi.push({
        anno,
        p5: valoriAnno[Math.floor(n * 0.05)],
        p25: valoriAnno[Math.floor(n * 0.25)],
        p50: valoriAnno[Math.floor(n * 0.50)],
        p75: valoriAnno[Math.floor(n * 0.75)],
        p95: valoriAnno[Math.floor(n * 0.95)],
      })
    }

    // Statistiche finali
    const valoriFinali = simulazioni.map(s => s[anni])
    const valoriOrdinati = [...valoriFinali].sort((a, b) => a - b)
    const n = valoriOrdinati.length
    const totaleVersato = capitale + versamentoAnnuo * anni

    // Probabilita raddoppio (rispetto al totale versato)
    const raddoppioCount = valoriFinali.filter(v => v >= totaleVersato * 2).length
    const probabilitaRaddoppio = (raddoppioCount / n) * 100

    // Probabilita raggiungere obiettivo
    const obiettivoCount = valoriFinali.filter(v => v >= obiettivo).length
    const probabilitaObiettivo = (obiettivoCount / n) * 100

    return {
      percorsi,
      valoreFinaleP5: valoriOrdinati[Math.floor(n * 0.05)],
      valoreFinaleP25: valoriOrdinati[Math.floor(n * 0.25)],
      valoreFinaleP50: valoriOrdinati[Math.floor(n * 0.50)],
      valoreFinaleP75: valoriOrdinati[Math.floor(n * 0.75)],
      valoreFinaleP95: valoriOrdinati[Math.floor(n * 0.95)],
      probabilitaRaddoppio,
      probabilitaObiettivo,
      totaleVersato,
    }
  }, [capitale, versamentoMensile, rendimentoMedio, volatilita, anni, numSimulazioni, obiettivo])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Calcola dimensioni del grafico
  const maxValore = Math.max(...risultati.percorsi.map(p => p.p95))
  const minValore = Math.min(...risultati.percorsi.map(p => p.p5))
  const chartHeight = 300
  const chartWidth = 100 // percentuale

  const getY = (value: number) => {
    const range = maxValore - minValore
    return chartHeight - ((value - minValore) / range) * chartHeight
  }

  // Genera path SVG per le aree
  const generateAreaPath = (data: SimulationResult[], keyTop: keyof SimulationResult, keyBottom: keyof SimulationResult) => {
    const points = data.map((d, i) => ({
      x: (i / anni) * 100,
      yTop: getY(d[keyTop] as number),
      yBottom: getY(d[keyBottom] as number),
    }))

    const topPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.yTop}`).join(' ')
    const bottomPath = [...points].reverse().map((p, i) => `${i === 0 ? 'L' : 'L'} ${p.x} ${p.yBottom}`).join(' ')

    return `${topPath} ${bottomPath} Z`
  }

  const generateLinePath = (data: SimulationResult[], key: keyof SimulationResult) => {
    return data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${(i / anni) * 100} ${getY(d[key] as number)}`).join(' ')
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
            Simulatore Monte Carlo
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Simula migliaia di scenari possibili per i tuoi investimenti e scopri la probabilita di raggiungere i tuoi obiettivi finanziari.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form - Colonna sinistra */}
            <div className="lg:col-span-1 space-y-6">
              {/* Presets */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-lg text-forest mb-4">Profilo di Rischio</h2>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(presets) as [Preset, typeof presets.conservativo][]).map(([key, value]) => (
                    <button
                      key={key}
                      onClick={() => handlePresetChange(key)}
                      className={`p-3 rounded-lg border-2 transition-all text-center ${
                        preset === key
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <p className={`font-medium text-sm ${preset === key ? 'text-green-600' : 'text-gray-700'}`}>
                        {value.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{value.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Parametri Input */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-lg text-forest mb-4">Parametri Investimento</h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capitale iniziale: {formatCurrency(capitale)}
                    </label>
                    <input
                      type="range"
                      min="1000"
                      max="500000"
                      step="1000"
                      value={capitale}
                      onChange={(e) => setCapitale(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1.000</span>
                      <span>500.000</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Versamento mensile (PAC): {formatCurrency(versamentoMensile)}
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
                      Rendimento medio atteso: {rendimentoMedio}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="0.5"
                      value={rendimentoMedio}
                      onChange={(e) => {
                        setRendimentoMedio(Number(e.target.value))
                        setPreset('custom')
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0%</span>
                      <span>15%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Volatilita (deviazione standard): {volatilita}%
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="1"
                      value={volatilita}
                      onChange={(e) => {
                        setVolatilita(Number(e.target.value))
                        setPreset('custom')
                      }}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1%</span>
                      <span>30%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orizzonte temporale: {anni} anni
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      step="1"
                      value={anni}
                      onChange={(e) => setAnni(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>5 anni</span>
                      <span>40 anni</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numero simulazioni: {numSimulazioni.toLocaleString('it-IT')}
                    </label>
                    <input
                      type="range"
                      min="100"
                      max="5000"
                      step="100"
                      value={numSimulazioni}
                      onChange={(e) => setNumSimulazioni(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>100</span>
                      <span>5.000</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Obiettivo patrimoniale: {formatCurrency(obiettivo)}
                    </label>
                    <input
                      type="range"
                      min="50000"
                      max="2000000"
                      step="10000"
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
              </div>
            </div>

            {/* Results - Colonna centrale e destra */}
            <div className="lg:col-span-2 space-y-6">
              {/* Grafico Ventaglio */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Distribuzione Scenari</h3>
                <div className="relative" style={{ height: chartHeight + 60 }}>
                  <svg
                    viewBox={`0 0 100 ${chartHeight}`}
                    preserveAspectRatio="none"
                    className="w-full h-full"
                    style={{ height: chartHeight }}
                  >
                    {/* Area 5-95 percentile */}
                    <path
                      d={generateAreaPath(risultati.percorsi, 'p95', 'p5')}
                      fill="#2D6A4F"
                      fillOpacity="0.15"
                    />
                    {/* Area 25-75 percentile */}
                    <path
                      d={generateAreaPath(risultati.percorsi, 'p75', 'p25')}
                      fill="#2D6A4F"
                      fillOpacity="0.25"
                    />
                    {/* Linea mediana */}
                    <path
                      d={generateLinePath(risultati.percorsi, 'p50')}
                      fill="none"
                      stroke="#1B4D3E"
                      strokeWidth="0.5"
                    />
                    {/* Linea p5 (worst case) */}
                    <path
                      d={generateLinePath(risultati.percorsi, 'p5')}
                      fill="none"
                      stroke="#dc2626"
                      strokeWidth="0.3"
                      strokeDasharray="1 1"
                    />
                    {/* Linea p95 (best case) */}
                    <path
                      d={generateLinePath(risultati.percorsi, 'p95')}
                      fill="none"
                      stroke="#16a34a"
                      strokeWidth="0.3"
                      strokeDasharray="1 1"
                    />
                  </svg>
                  {/* Asse Y labels */}
                  <div className="absolute left-0 top-0 bottom-0 w-16 flex flex-col justify-between text-xs text-gray-500 -ml-2" style={{ height: chartHeight }}>
                    <span>{formatCurrency(maxValore)}</span>
                    <span>{formatCurrency((maxValore + minValore) / 2)}</span>
                    <span>{formatCurrency(minValore)}</span>
                  </div>
                  {/* Asse X labels */}
                  <div className="flex justify-between text-xs text-gray-500 mt-2 px-14">
                    <span>Anno 0</span>
                    <span>Anno {Math.round(anni / 2)}</span>
                    <span>Anno {anni}</span>
                  </div>
                </div>
                {/* Legenda */}
                <div className="flex flex-wrap gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-3 rounded" style={{ backgroundColor: 'rgba(45, 106, 79, 0.15)' }}></div>
                    <span className="text-gray-600">Range 5%-95%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-3 rounded" style={{ backgroundColor: 'rgba(45, 106, 79, 0.4)' }}></div>
                    <span className="text-gray-600">Range 25%-75%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-0.5 bg-forest"></div>
                    <span className="text-gray-600">Mediana (50%)</span>
                  </div>
                </div>
              </div>

              {/* Cards Risultati */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-green-600 rounded-card p-5 text-white">
                  <p className="text-green-100 text-sm mb-1">Caso Mediano (50%)</p>
                  <p className="font-heading text-2xl">{formatCurrency(risultati.valoreFinaleP50)}</p>
                  <p className="text-green-200 text-xs mt-1">Risultato piu probabile</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm border-l-4 border-red-500">
                  <p className="text-gray-500 text-sm mb-1">Worst Case (5%)</p>
                  <p className="font-heading text-2xl text-red-600">{formatCurrency(risultati.valoreFinaleP5)}</p>
                  <p className="text-gray-400 text-xs mt-1">Scenario pessimistico</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm border-l-4 border-green-500">
                  <p className="text-gray-500 text-sm mb-1">Best Case (95%)</p>
                  <p className="font-heading text-2xl text-green-600">{formatCurrency(risultati.valoreFinaleP95)}</p>
                  <p className="text-gray-400 text-xs mt-1">Scenario ottimistico</p>
                </div>
              </div>

              {/* Probabilita */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-gray-700 font-medium">Probabilita raggiungere obiettivo</p>
                    <p className="font-heading text-2xl text-forest">{risultati.probabilitaObiettivo.toFixed(1)}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(risultati.probabilitaObiettivo, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Target: {formatCurrency(obiettivo)}</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-gray-700 font-medium">Probabilita raddoppio capitale</p>
                    <p className="font-heading text-2xl text-forest">{risultati.probabilitaRaddoppio.toFixed(1)}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all"
                      style={{ width: `${Math.min(risultati.probabilitaRaddoppio, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Versato: {formatCurrency(risultati.totaleVersato)} - Target: {formatCurrency(risultati.totaleVersato * 2)}</p>
                </div>
              </div>

              {/* Tabella Percentili */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Distribuzione Valori Finali</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-2 font-medium text-gray-600">Percentile</th>
                        <th className="text-right py-3 px-2 font-medium text-gray-600">Valore</th>
                        <th className="text-right py-3 px-2 font-medium text-gray-600">vs Versato</th>
                        <th className="text-left py-3 px-2 font-medium text-gray-600">Interpretazione</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-2 text-red-600 font-medium">5%</td>
                        <td className="py-3 px-2 text-right">{formatCurrency(risultati.valoreFinaleP5)}</td>
                        <td className="py-3 px-2 text-right text-red-600">
                          {((risultati.valoreFinaleP5 / risultati.totaleVersato - 1) * 100).toFixed(1)}%
                        </td>
                        <td className="py-3 px-2 text-gray-500">Solo 5% fara peggio</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-2 text-orange-600 font-medium">25%</td>
                        <td className="py-3 px-2 text-right">{formatCurrency(risultati.valoreFinaleP25)}</td>
                        <td className="py-3 px-2 text-right">
                          {((risultati.valoreFinaleP25 / risultati.totaleVersato - 1) * 100).toFixed(1)}%
                        </td>
                        <td className="py-3 px-2 text-gray-500">Scenario cauto</td>
                      </tr>
                      <tr className="border-b border-gray-100 bg-green-50">
                        <td className="py-3 px-2 text-forest font-bold">50%</td>
                        <td className="py-3 px-2 text-right font-bold">{formatCurrency(risultati.valoreFinaleP50)}</td>
                        <td className="py-3 px-2 text-right font-bold text-green-600">
                          +{((risultati.valoreFinaleP50 / risultati.totaleVersato - 1) * 100).toFixed(1)}%
                        </td>
                        <td className="py-3 px-2 text-gray-600 font-medium">Caso mediano</td>
                      </tr>
                      <tr className="border-b border-gray-100">
                        <td className="py-3 px-2 text-blue-600 font-medium">75%</td>
                        <td className="py-3 px-2 text-right">{formatCurrency(risultati.valoreFinaleP75)}</td>
                        <td className="py-3 px-2 text-right text-green-600">
                          +{((risultati.valoreFinaleP75 / risultati.totaleVersato - 1) * 100).toFixed(1)}%
                        </td>
                        <td className="py-3 px-2 text-gray-500">Scenario favorevole</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-2 text-green-600 font-medium">95%</td>
                        <td className="py-3 px-2 text-right">{formatCurrency(risultati.valoreFinaleP95)}</td>
                        <td className="py-3 px-2 text-right text-green-600">
                          +{((risultati.valoreFinaleP95 / risultati.totaleVersato - 1) * 100).toFixed(1)}%
                        </td>
                        <td className="py-3 px-2 text-gray-500">Solo 5% fara meglio</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-12 bg-white rounded-card p-6 shadow-sm">
            <h2 className="font-heading text-xl text-forest mb-4">Come funziona la simulazione Monte Carlo?</h2>
            <div className="prose prose-sm text-gray-600 max-w-none">
              <p>
                La <strong>simulazione Monte Carlo</strong> e una tecnica statistica che genera migliaia di scenari
                possibili per il tuo investimento, basandosi su rendimento atteso e volatilita storica.
                Ogni simulazione rappresenta un possibile &quot;futuro&quot; del mercato.
              </p>
              <div className="grid md:grid-cols-3 gap-6 mt-6 not-prose">
                <div className="bg-cream rounded-lg p-4">
                  <h4 className="font-heading text-forest mb-2">Rendimento Medio</h4>
                  <p className="text-sm text-gray-600">
                    Il rendimento annuo atteso. Storicamente, le azioni globali hanno reso circa 7-8% annuo,
                    le obbligazioni 3-4%.
                  </p>
                </div>
                <div className="bg-cream rounded-lg p-4">
                  <h4 className="font-heading text-forest mb-2">Volatilita</h4>
                  <p className="text-sm text-gray-600">
                    La deviazione standard misura quanto i rendimenti possono oscillare. Piu alta = piu rischio
                    ma anche piu potenziale guadagno.
                  </p>
                </div>
                <div className="bg-cream rounded-lg p-4">
                  <h4 className="font-heading text-forest mb-2">Percentili</h4>
                  <p className="text-sm text-gray-600">
                    Il percentile 50 e la mediana (caso tipico). Il 5% rappresenta lo scenario pessimistico,
                    il 95% quello ottimistico.
                  </p>
                </div>
              </div>
              <p className="mt-6 text-xs text-gray-500">
                <strong>Disclaimer:</strong> Questa simulazione si basa su ipotesi statistiche e rendimenti passati
                che non garantiscono risultati futuri. Consulta un professionista prima di prendere decisioni di investimento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Vuoi una strategia personalizzata?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente indipendente puo aiutarti a costruire un portafoglio
            adatto ai tuoi obiettivi e alla tua tolleranza al rischio.
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
