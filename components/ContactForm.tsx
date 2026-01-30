'use client'

import { useState, useEffect, useMemo } from 'react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

// Patrimonio minimo per qualificazione partner (in EUR)
const MIN_PATRIMONIO_PARTNER = 150000

const orizzonteOptions = [
  { value: '1-5', label: '1-5 anni', description: 'Breve termine' },
  { value: '5-10', label: '5-10 anni', description: 'Medio termine' },
  { value: '10-20', label: '10-20 anni', description: 'Lungo termine' },
  { value: '25-35', label: '25-35 anni', description: 'Molto lungo' },
]

const obiettivoOptions = [
  { value: 'crescita', label: 'Crescita del capitale', description: 'Massimizzare i rendimenti nel tempo', icon: 'chart' },
  { value: 'rendita', label: 'Rendita passiva', description: 'Ottenere entrate periodiche', icon: 'cash' },
  { value: 'protezione', label: 'Protezione patrimonio', description: 'Preservare il capitale', icon: 'shield' },
]

// Rendimenti annui per profilo
const PROFILI = {
  conservativo: { rendimento: 0.06, label: 'Conservativo', color: '#74C69D' },
  moderato: { rendimento: 0.10, label: 'Moderato', color: '#40916C' },
  aggressivo: { rendimento: 0.15, label: 'Aggressivo', color: '#1B4D3E' },
}

export default function ContactForm() {
  const [importo, setImporto] = useState(100000)
  const [orizzonte, setOrizzonte] = useState('')
  const [obiettivo, setObiettivo] = useState('')
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'analyzing' | 'success' | 'not-qualified' | 'error'>('idle')
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Calcolo proiezioni
  const proiezioni = useMemo(() => {
    const anni = orizzonte === '1-5' ? 5 : orizzonte === '5-10' ? 10 : orizzonte === '10-20' ? 20 : 30
    const result: { anno: number; conservativo: number; moderato: number; aggressivo: number }[] = []

    for (let i = 0; i <= anni; i++) {
      result.push({
        anno: i,
        conservativo: importo * Math.pow(1 + PROFILI.conservativo.rendimento, i),
        moderato: importo * Math.pow(1 + PROFILI.moderato.rendimento, i),
        aggressivo: importo * Math.pow(1 + PROFILI.aggressivo.rendimento, i),
      })
    }
    return result
  }, [importo, orizzonte])

  // Animazione loading
  useEffect(() => {
    if (status === 'analyzing') {
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setStatus('success'), 500)
            return 100
          }
          return prev + 3
        })
      }, 100)
      return () => clearInterval(interval)
    }
  }, [status])

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    }
    if (value >= 1000) {
      return `${Math.round(value / 1000)}k`
    }
    return `${value}€`
  }

  const handleSubmit = async () => {
    if (!nome || !email || !orizzonte || !obiettivo) return

    setStatus('loading')

    try {
      // Map importo to patrimonio value for backward compatibility
      const patrimonioValue = importo < 50000 ? 'sotto-50k' :
        importo < 100000 ? '50-100k' :
        importo < 150000 ? '100-150k' :
        importo < 250000 ? '150-250k' :
        importo < 500000 ? '250-500k' :
        importo < 1000000 ? '500k-1m' : '1m+'

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          telefono,
          patrimonio: patrimonioValue,
          messaggio: `Obiettivo: ${obiettivo}, Orizzonte: ${orizzonte}, Importo: ${formatCurrency(importo)}`,
        }),
      })

      if (!response.ok) throw new Error('Failed to submit')

      // Track conversion
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          event_category: 'form',
          event_label: 'contact_form_pleo',
          value: importo,
        })
      }

      if (importo >= MIN_PATRIMONIO_PARTNER) {
        setLoadingProgress(0)
        setStatus('analyzing')
      } else {
        setStatus('not-qualified')
      }
    } catch {
      setStatus('error')
    }
  }

  const resetForm = () => {
    setImporto(100000)
    setOrizzonte('')
    setObiettivo('')
    setNome('')
    setEmail('')
    setTelefono('')
    setStatus('idle')
    setLoadingProgress(0)
  }

  // Check if form is complete
  const formComplete = nome && email && orizzonte && obiettivo

  // ============================================================================
  // STATUS SCREENS
  // ============================================================================

  if (status === 'analyzing') {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
        <div className="w-24 h-24 mx-auto mb-8 relative">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
            <circle cx="48" cy="48" r="44" stroke="#e5e7eb" strokeWidth="6" fill="none" />
            <circle
              cx="48" cy="48" r="44"
              stroke="#40916C" strokeWidth="6" fill="none"
              strokeDasharray={`${loadingProgress * 2.76} 276`}
              strokeLinecap="round"
              className="transition-all duration-100"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-semibold text-forest">{loadingProgress}%</span>
          </div>
        </div>
        <h3 className="font-heading text-2xl text-forest mb-3">Analisi del tuo profilo</h3>
        <p className="text-gray-500">Stiamo verificando la compatibilita con i nostri partner...</p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-heading text-2xl text-forest mb-4">Match Confermato!</h3>
        <p className="text-gray-600 mb-2 text-lg">Sei stato abbinato con successo.</p>
        <p className="text-gray-600 mb-8 text-lg">
          <strong>Verrai contattato dal nostro partner<br />con sede a Ginevra, Svizzera.</strong>
        </p>
        <div className="flex items-center justify-center gap-2 text-gray-500 mb-8">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Risposta entro 24-48 ore lavorative
        </div>
        <button onClick={resetForm} className="text-forest font-medium hover:underline">
          Invia un&apos;altra richiesta
        </button>
      </div>
    )
  }

  if (status === 'not-qualified') {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="font-heading text-2xl text-forest mb-4">Grazie per l&apos;interesse!</h3>
        <p className="text-gray-600 mb-4 text-lg">
          I servizi del nostro partner sono riservati<br />a patrimoni superiori a <strong>€150.000</strong>.
        </p>
        <p className="text-gray-600 mb-8">
          Puoi utilizzare gratuitamente i nostri{' '}
          <a href="/strumenti" className="text-forest font-medium hover:underline">strumenti professionali</a>.
        </p>
        <button onClick={resetForm} className="text-forest font-medium hover:underline">
          Torna al form
        </button>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <svg className="animate-spin w-12 h-12 text-forest" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <p className="text-gray-500 mt-4">Invio in corso...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center text-center px-4">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="font-heading text-2xl text-forest mb-4">Errore</h3>
        <p className="text-gray-600 mb-8">Si è verificato un errore. Riprova.</p>
        <button onClick={resetForm} className="text-forest font-medium hover:underline">
          Riprova
        </button>
      </div>
    )
  }

  // ============================================================================
  // CHART COMPONENT
  // ============================================================================
  const anni = orizzonte === '1-5' ? 5 : orizzonte === '5-10' ? 10 : orizzonte === '10-20' ? 20 : 30
  const maxValue = (proiezioni[proiezioni.length - 1]?.aggressivo || importo * 2) * 1.15
  const minValue = 0
  const chartHeight = 160
  const midValue = maxValue / 2

  // Hover state for interactive tooltip
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // Calculate percentage gains
  const finalConservativo = proiezioni[proiezioni.length - 1]?.conservativo || importo
  const finalModerato = proiezioni[proiezioni.length - 1]?.moderato || importo
  const finalAggressivo = proiezioni[proiezioni.length - 1]?.aggressivo || importo
  const pctConservativo = ((finalConservativo - importo) / importo * 100).toFixed(0)
  const pctModerato = ((finalModerato - importo) / importo * 100).toFixed(0)
  const pctAggressivo = ((finalAggressivo - importo) / importo * 100).toFixed(0)

  // ============================================================================
  // MAIN RENDER - ALL IN ONE PAGE
  // ============================================================================

  return (
    <div className="space-y-8">
      {/* SECTION 1: Importo */}
      <div>
        <h3 className="font-heading text-xl text-forest mb-4">
          Quanto vorresti investire?
        </h3>
        <div className="text-4xl font-heading text-forest mb-4 text-center">
          {formatCurrency(importo)}
        </div>
        <input
          type="range"
          min="10000"
          max="2000000"
          step="10000"
          value={importo}
          onChange={(e) => setImporto(Number(e.target.value))}
          className="w-full h-3 bg-gray-200 rounded-full appearance-none cursor-pointer accent-green-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>€10k</span>
          <span>€500k</span>
          <span>€1M</span>
          <span>€2M+</span>
        </div>
        {importo >= MIN_PATRIMONIO_PARTNER && (
          <div className="bg-green-50 rounded-lg p-3 text-sm text-green-700 mt-4">
            <span className="font-medium">Perfetto!</span> Con questo importo sei idoneo per i servizi dei nostri partner svizzeri.
          </div>
        )}
      </div>

      {/* SECTION 2: Orizzonte temporale */}
      <div>
        <h3 className="font-heading text-xl text-forest mb-4">
          Orizzonte temporale
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {orizzonteOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setOrizzonte(option.value)}
              className={`text-center px-2 py-3 rounded-xl border-2 transition-all ${
                orizzonte === option.value
                  ? 'border-forest bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-heading text-sm text-forest">{option.label}</div>
              <div className="text-xs text-gray-500">{option.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 3: Obiettivo */}
      <div>
        <h3 className="font-heading text-xl text-forest mb-4">
          Obiettivo principale
        </h3>
        <div className="grid gap-2">
          {obiettivoOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setObiettivo(option.value)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                obiettivo === option.value
                  ? 'border-forest bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0">
                  {option.icon === 'chart' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  )}
                  {option.icon === 'cash' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {option.icon === 'shield' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="font-heading text-forest">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 4: Proiezione (visible only after selecting orizzonte + obiettivo) */}
      {orizzonte && obiettivo && <div>
        <h3 className="font-heading text-xl text-forest mb-4">
          Proiezione in {anni} anni
        </h3>
          <div className="bg-gray-50 rounded-xl p-4 relative overflow-hidden">
            <svg
              viewBox={`0 0 320 ${chartHeight + 40}`}
              className="w-full cursor-crosshair"
              preserveAspectRatio="xMidYMid meet"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                const x = (e.clientX - rect.left) / rect.width * 320
                const chartX = x - 40
                if (chartX >= 0 && chartX <= 270) {
                  const index = Math.round((chartX / 270) * anni)
                  setHoveredIndex(Math.min(index, proiezioni.length - 1))
                }
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <defs>
                {/* Area gradient fills */}
                <linearGradient id="gradAgg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PROFILI.aggressivo.color} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={PROFILI.aggressivo.color} stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="gradMod" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PROFILI.moderato.color} stopOpacity="0.2" />
                  <stop offset="100%" stopColor={PROFILI.moderato.color} stopOpacity="0.02" />
                </linearGradient>
                <linearGradient id="gradCon" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={PROFILI.conservativo.color} stopOpacity="0.15" />
                  <stop offset="100%" stopColor={PROFILI.conservativo.color} stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
                <line
                  key={pct}
                  x1="40"
                  y1={chartHeight - pct * chartHeight + 10}
                  x2="310"
                  y2={chartHeight - pct * chartHeight + 10}
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                  strokeDasharray={pct === 0 ? '0' : '4,4'}
                />
              ))}

              {/* Area fills - from line down to baseline */}
              {[
                { key: 'aggressivo' as const, grad: 'url(#gradAgg)', field: 'crescita' },
                { key: 'moderato' as const, grad: 'url(#gradMod)', field: 'rendita' },
                { key: 'conservativo' as const, grad: 'url(#gradCon)', field: 'protezione' },
              ].map(({ key, grad, field }) => {
                const baseline = chartHeight + 10
                const pts = proiezioni.map((p, i) => {
                  const x = 40 + (i / anni) * 270
                  const y = chartHeight - ((p[key]) / maxValue) * chartHeight + 10
                  return `${x},${Math.max(10, y)}`
                })
                const lastX = 40 + 270
                const firstX = 40
                return (
                  <polygon
                    key={key}
                    fill={grad}
                    opacity={obiettivo && obiettivo !== field ? 0.15 : 0.8}
                    className="transition-all duration-700 ease-out"
                    points={`${firstX},${baseline} ${pts.join(' ')} ${lastX},${baseline}`}
                  />
                )
              })}

              {/* Lines */}
              {[
                { key: 'aggressivo' as const, color: PROFILI.aggressivo.color, obj: 'crescita' },
                { key: 'moderato' as const, color: PROFILI.moderato.color, obj: 'rendita' },
                { key: 'conservativo' as const, color: PROFILI.conservativo.color, obj: 'protezione' },
              ].map(({ key, color, obj }) => (
                <polyline
                  key={key}
                  fill="none"
                  stroke={color}
                  strokeWidth={obiettivo === obj ? '3.5' : '2'}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={obiettivo && obiettivo !== obj ? 0.3 : 1}
                  className="transition-all duration-700 ease-out"
                  points={proiezioni.map((p, i) => {
                    const x = 40 + (i / anni) * 270
                    const y = chartHeight - ((p[key]) / maxValue) * chartHeight + 10
                    return `${x},${Math.max(10, y)}`
                  }).join(' ')}
                />
              ))}

              {/* End value labels on the right edge */}
              {proiezioni.length > 0 && [
                { key: 'aggressivo' as const, color: PROFILI.aggressivo.color, obj: 'crescita' },
                { key: 'moderato' as const, color: PROFILI.moderato.color, obj: 'rendita' },
                { key: 'conservativo' as const, color: PROFILI.conservativo.color, obj: 'protezione' },
              ].map(({ key, color, obj }) => {
                const last = proiezioni[proiezioni.length - 1]
                const y = chartHeight - ((last[key]) / maxValue) * chartHeight + 10
                return (
                  <g key={`label-${key}`} opacity={obiettivo && obiettivo !== obj ? 0.3 : 1} className="transition-all duration-700 ease-out">
                    <circle cx="310" cy={Math.max(10, y)} r="4" fill={color} stroke="white" strokeWidth="1.5" />
                  </g>
                )
              })}

              {/* Starting value label on Y-axis */}
              {(() => {
                const yStart = chartHeight - ((importo) / maxValue) * chartHeight + 10
                return (
                  <>
                    <line x1="36" y1={Math.max(10, yStart)} x2="44" y2={Math.max(10, yStart)} stroke="#6b7280" strokeWidth="1" />
                    <text x="5" y={Math.max(10, yStart) + 3} fontSize="9" fill="#6b7280" textAnchor="start" fontWeight="500">{formatCurrency(importo)}</text>
                  </>
                )
              })()}

              {/* Hover vertical line and dots */}
              {hoveredIndex !== null && proiezioni[hoveredIndex] && (() => {
                const p = proiezioni[hoveredIndex]
                const x = 40 + (hoveredIndex / anni) * 270
                const yAgg = chartHeight - ((p.aggressivo) / maxValue) * chartHeight + 10
                const yMod = chartHeight - ((p.moderato) / maxValue) * chartHeight + 10
                const yCon = chartHeight - ((p.conservativo) / maxValue) * chartHeight + 10
                return (
                  <>
                    <line x1={x} y1="10" x2={x} y2={chartHeight + 10} stroke="#9ca3af" strokeWidth="1" strokeDasharray="3,3" />
                    <circle cx={x} cy={Math.max(10, yAgg)} r="6" fill={PROFILI.aggressivo.color} stroke="white" strokeWidth="2" />
                    <circle cx={x} cy={Math.max(10, yMod)} r="6" fill={PROFILI.moderato.color} stroke="white" strokeWidth="2" />
                    <circle cx={x} cy={Math.max(10, yCon)} r="6" fill={PROFILI.conservativo.color} stroke="white" strokeWidth="2" />
                  </>
                )
              })()}

              {/* X axis labels */}
              <text x="40" y={chartHeight + 30} fontSize="10" fill="#9ca3af" textAnchor="middle">0</text>
              <text x="175" y={chartHeight + 30} fontSize="10" fill="#9ca3af" textAnchor="middle">{Math.round(anni/2)}</text>
              <text x="310" y={chartHeight + 30} fontSize="10" fill="#9ca3af" textAnchor="middle">{anni}</text>
              <text x="175" y={chartHeight + 39} fontSize="8" fill="#c0c0c0" textAnchor="middle">anni</text>

              {/* Y axis labels - 0 at bottom, mid, max at top */}
              <text x="5" y="15" fontSize="9" fill="#6b7280" textAnchor="start" fontWeight="500">{formatCurrency(maxValue / 1.15)}</text>
              <text x="5" y={chartHeight / 2 + 10} fontSize="9" fill="#9ca3af" textAnchor="start">{formatCurrency(midValue / 1.15)}</text>
              <text x="5" y={chartHeight + 10} fontSize="9" fill="#9ca3af" textAnchor="start">0</text>
            </svg>

            {/* Hover tooltip */}
            {hoveredIndex !== null && proiezioni[hoveredIndex] && (
              <div className="absolute top-2 right-2 bg-white rounded-lg shadow-lg p-3 text-xs border border-gray-200 z-10 min-w-[140px]">
                <div className="font-semibold text-gray-700 mb-2 pb-1 border-b border-gray-100">Anno {hoveredIndex}</div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: PROFILI.aggressivo.color}} /> Aggressivo</span>
                    <span className="font-medium">{formatCurrency(proiezioni[hoveredIndex].aggressivo)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: PROFILI.moderato.color}} /> Moderato</span>
                    <span className="font-medium">{formatCurrency(proiezioni[hoveredIndex].moderato)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: PROFILI.conservativo.color}} /> Conservativo</span>
                    <span className="font-medium">{formatCurrency(proiezioni[hoveredIndex].conservativo)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Legend with values AND percentages - highlights based on obiettivo */}
          <div className="grid grid-cols-3 gap-3 mt-4 text-center">
            <div className={`rounded-lg p-3 border-2 transition-all duration-300 ${
              obiettivo === 'protezione'
                ? 'bg-green-50 border-green-400 scale-105'
                : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center gap-1 justify-center mb-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PROFILI.conservativo.color }} />
                <span className="text-xs text-gray-500">{PROFILI.conservativo.label}</span>
              </div>
              <div className="font-heading text-forest text-sm">{formatCurrency(finalConservativo)}</div>
              <div className="text-xs text-green-600 font-medium">+{pctConservativo}%</div>
              {obiettivo === 'protezione' && <div className="text-xs text-forest font-semibold mt-1">Consigliato</div>}
            </div>
            <div className={`rounded-lg p-3 border-2 transition-all duration-300 ${
              obiettivo === 'rendita'
                ? 'bg-green-50 border-green-400 scale-105'
                : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center gap-1 justify-center mb-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PROFILI.moderato.color }} />
                <span className="text-xs text-gray-500">{PROFILI.moderato.label}</span>
              </div>
              <div className="font-heading text-forest text-sm">{formatCurrency(finalModerato)}</div>
              <div className="text-xs text-green-600 font-medium">+{pctModerato}%</div>
              {obiettivo === 'rendita' && <div className="text-xs text-forest font-semibold mt-1">Consigliato</div>}
            </div>
            <div className={`rounded-lg p-3 border-2 transition-all duration-300 ${
              obiettivo === 'crescita'
                ? 'bg-green-50 border-green-400 scale-105'
                : 'bg-white border-gray-100'
            }`}>
              <div className="flex items-center gap-1 justify-center mb-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: PROFILI.aggressivo.color }} />
                <span className="text-xs text-gray-500">{PROFILI.aggressivo.label}</span>
              </div>
              <div className="font-heading text-forest text-sm">{formatCurrency(finalAggressivo)}</div>
              <div className="text-xs text-green-600 font-medium">+{pctAggressivo}%</div>
              {obiettivo === 'crescita' && <div className="text-xs text-forest font-semibold mt-1">Consigliato</div>}
            </div>
          </div>

          {importo >= MIN_PATRIMONIO_PARTNER && (
            <div className="bg-green-50 rounded-lg p-3 text-sm text-green-700 mt-4 text-center">
              <span className="font-semibold">Match perfetto!</span> Il tuo profilo è ideale per i nostri partner svizzeri.
            </div>
          )}
        </div>}

      {/* Prompt to complete selections */}
      {(!orizzonte || !obiettivo) && (
        <div className="bg-gray-50 rounded-xl p-6 text-center border-2 border-dashed border-gray-200">
          <div className="text-gray-400 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">Completa le selezioni per vedere la proiezione</p>
          <p className="text-sm text-gray-400 mt-1">
            {!orizzonte && !obiettivo
              ? 'Seleziona orizzonte temporale e obiettivo principale'
              : !orizzonte
                ? 'Seleziona l\'orizzonte temporale'
                : 'Seleziona l\'obiettivo principale'}
          </p>
        </div>
      )}

      {/* SECTION 5: Contact Info */}
      {orizzonte && obiettivo && <div>
        <h3 className="font-heading text-xl text-forest mb-4">
          I tuoi dati
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome e cognome *"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-forest focus:outline-none text-forest placeholder:text-gray-400"
            autoComplete="name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email *"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-forest focus:outline-none text-forest placeholder:text-gray-400"
            autoComplete="email"
          />
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Telefono (opzionale)"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-forest focus:outline-none text-forest placeholder:text-gray-400"
            autoComplete="tel"
          />
        </div>
        <p className="text-xs text-gray-400 mt-3">
          * Campi obbligatori. I tuoi dati sono al sicuro.
        </p>
      </div>}

      {/* SUBMIT BUTTON */}
      {orizzonte && obiettivo && <button
        type="button"
        onClick={handleSubmit}
        disabled={!formComplete}
        className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-lg transition-all ${
          formComplete
            ? 'bg-forest text-white hover:bg-green-600'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Richiedi consulenza gratuita
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>}
    </div>
  )
}
