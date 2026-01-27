'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget, ToolPageSchema, ConsultationPopup, useConsultationPopup} from '@/components'

interface BondData {
  name: string
  year: number
  yield: number
  type: 'BTP' | 'Corporate IG'
}

interface YieldData {
  yield: number
  change: number
}

interface BTPYieldsApiResponse {
  success: boolean
  data: {
    lastUpdate: string
    source: string
    btp: {
      '2Y': YieldData
      '5Y': YieldData
      '10Y': YieldData
      '30Y': YieldData
    }
    bund: {
      '10Y': YieldData
    }
    spread: {
      value: number
      change: number
    }
  }
  stale?: boolean
}

// Fallback BTP data (will be updated with live data)
const defaultBtpYields = {
  '2Y': 2.85,
  '5Y': 3.15,
  '10Y': 3.52,
  '30Y': 4.10
}

// Generate BTP data based on yield curve
function generateBtpData(yields: typeof defaultBtpYields): BondData[] {
  const currentYear = new Date().getFullYear()
  const bonds: BondData[] = []

  // Interpolate yields for each year based on the 2Y, 5Y, 10Y, 30Y anchors
  for (let yearsToMaturity = 1; yearsToMaturity <= 16; yearsToMaturity++) {
    const year = currentYear + yearsToMaturity
    let yieldValue: number

    if (yearsToMaturity <= 2) {
      yieldValue = yields['2Y']
    } else if (yearsToMaturity <= 5) {
      // Interpolate between 2Y and 5Y
      const t = (yearsToMaturity - 2) / 3
      yieldValue = yields['2Y'] + t * (yields['5Y'] - yields['2Y'])
    } else if (yearsToMaturity <= 10) {
      // Interpolate between 5Y and 10Y
      const t = (yearsToMaturity - 5) / 5
      yieldValue = yields['5Y'] + t * (yields['10Y'] - yields['5Y'])
    } else {
      // Interpolate between 10Y and 30Y
      const t = (yearsToMaturity - 10) / 20
      yieldValue = yields['10Y'] + t * (yields['30Y'] - yields['10Y'])
    }

    bonds.push({
      name: `BTP ${year}`,
      year,
      yield: Math.round(yieldValue * 100) / 100,
      type: 'BTP'
    })
  }

  return bonds
}

// Generate Corporate IG data (approximately 0.8% premium over BTP)
function generateCorporateData(btpData: BondData[]): BondData[] {
  const corporatePremium = 0.8 // 80 basis points premium
  return btpData.map(btp => ({
    name: `Corp IG ${btp.year}`,
    year: btp.year,
    yield: Math.round((btp.yield + corporatePremium) * 100) / 100,
    type: 'Corporate IG' as const
  }))
}

type TipoObbligazione = 'BTP' | 'Corporate IG' | 'Mix'
type Obiettivo = 'rendimento' | 'sicurezza'

interface LadderStep {
  anno: number
  importo: number
  bond: BondData
  cedolaAnnua: number
  cedolaNetta: number
}

export default function ScalaObbligazionaria() {
  const [capitale, setCapitale] = useState(300000)
  const [durataScala, setDurataScala] = useState(10)
  const [tipoObbligazione, setTipoObbligazione] = useState<TipoObbligazione>('BTP')
  const [obiettivo, setObiettivo] = useState<Obiettivo>('rendimento')
  const [intervalloAnni, setIntervalloAnni] = useState(2)

  // Consultation popup state
  const [showPopup, setShowPopup] = useState(false)
  const [popupAmount, setPopupAmount] = useState(0)
  const { shouldShowPopup, THRESHOLD } = useConsultationPopup()

  useEffect(() => {
    if (capitale >= THRESHOLD && shouldShowPopup()) {
      setPopupAmount(capitale)
      setShowPopup(true)
    }
  }, [capitale, THRESHOLD, shouldShowPopup])

  // Live BTP yields state
  const [btpYields, setBtpYields] = useState(defaultBtpYields)
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch live BTP yields on mount
  useEffect(() => {
    async function fetchYields() {
      try {
        const response = await fetch('/api/data/btp-yields')
        const result: BTPYieldsApiResponse = await response.json()

        if (result.success && result.data) {
          setBtpYields({
            '2Y': result.data.btp['2Y'].yield,
            '5Y': result.data.btp['5Y'].yield,
            '10Y': result.data.btp['10Y'].yield,
            '30Y': result.data.btp['30Y'].yield
          })
          setLastUpdate(result.data.lastUpdate)
        }
      } catch (error) {
        console.error('Error fetching BTP yields:', error)
        // Keep default values on error
      } finally {
        setIsLoading(false)
      }
    }

    fetchYields()
  }, [])

  // Generate bond data based on live yields
  const btpData = useMemo(() => generateBtpData(btpYields), [btpYields])
  const corporateData = useMemo(() => generateCorporateData(btpData), [btpData])

  const currentYear = new Date().getFullYear()

  const risultati = useMemo(() => {
    // Seleziona i bond in base al tipo
    let availableBonds: BondData[] = []
    if (tipoObbligazione === 'BTP') {
      availableBonds = btpData
    } else if (tipoObbligazione === 'Corporate IG') {
      availableBonds = corporateData
    } else {
      // Mix: alterna BTP e Corporate
      availableBonds = btpData.map((btp, i) =>
        i % 2 === 0 ? btp : corporateData.find(c => c.year === btp.year) || btp
      )
    }

    // Filtra bond per la durata della scala
    const endYear = currentYear + durataScala
    const filteredBonds = availableBonds.filter(
      b => b.year >= currentYear && b.year <= endYear
    )

    // Calcola numero di gradini
    const numSteps = Math.floor(durataScala / intervalloAnni)
    const importoPerStep = capitale / numSteps

    // Crea la scala selezionando bond a intervalli regolari
    const ladder: LadderStep[] = []
    for (let i = 0; i < numSteps; i++) {
      const targetYear = currentYear + (i + 1) * intervalloAnni

      // Trova il bond piu vicino all'anno target
      let selectedBond = filteredBonds.reduce((prev, curr) =>
        Math.abs(curr.year - targetYear) < Math.abs(prev.year - targetYear) ? curr : prev
      , filteredBonds[0])

      // Se obiettivo e sicurezza e siamo in mix, preferisci BTP
      if (obiettivo === 'sicurezza' && tipoObbligazione === 'Mix') {
        const btpOption = btpData.find(b => b.year === selectedBond.year)
        if (btpOption) selectedBond = btpOption
      }
      // Se obiettivo e rendimento e siamo in mix, preferisci Corporate
      if (obiettivo === 'rendimento' && tipoObbligazione === 'Mix') {
        const corpOption = corporateData.find(b => b.year === selectedBond.year)
        if (corpOption) selectedBond = corpOption
      }

      // Aliquota fiscale: 12.5% per BTP, 26% per Corporate
      const aliquota = selectedBond.type === 'BTP' ? 0.125 : 0.26
      const cedolaAnnua = importoPerStep * (selectedBond.yield / 100)
      const cedolaNetta = cedolaAnnua * (1 - aliquota)

      ladder.push({
        anno: selectedBond.year,
        importo: importoPerStep,
        bond: selectedBond,
        cedolaAnnua,
        cedolaNetta,
      })
    }

    // Sort by year
    ladder.sort((a, b) => a.anno - b.anno)

    // Calcola statistiche
    const rendimentoMedioPonderato = ladder.reduce((acc, step) =>
      acc + (step.bond.yield * step.importo), 0) / capitale

    const cedolaTotaleAnnua = ladder.reduce((acc, step) => acc + step.cedolaAnnua, 0)
    const cedolaTotaleNetta = ladder.reduce((acc, step) => acc + step.cedolaNetta, 0)
    const cedolaMensileNetta = cedolaTotaleNetta / 12

    // Flusso cedole per anno (semplificato: assumiamo cedole annuali)
    const flussoAnnuale: { anno: number; cedolaNetta: number; scadenza: number }[] = []
    for (let year = currentYear; year <= currentYear + durataScala; year++) {
      const cedoleAnno = ladder.filter(s => s.anno >= year).reduce((acc, s) => acc + s.cedolaNetta, 0)
      const scadenzaAnno = ladder.filter(s => s.anno === year).reduce((acc, s) => acc + s.importo, 0)
      flussoAnnuale.push({
        anno: year,
        cedolaNetta: cedoleAnno,
        scadenza: scadenzaAnno,
      })
    }

    return {
      ladder,
      rendimentoMedioPonderato,
      cedolaTotaleAnnua,
      cedolaTotaleNetta,
      cedolaMensileNetta,
      flussoAnnuale,
      numSteps,
      importoPerStep,
    }
  }, [capitale, durataScala, tipoObbligazione, obiettivo, intervalloAnni, currentYear])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <main>
      <ToolPageSchema slug="scala-obbligazionaria" />
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
            Bond Ladder Builder
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Costruisci una scala di obbligazioni per generare un flusso di cedole regolare e ridurre il rischio di tasso.
          </p>

          {/* Live Yields Indicator */}
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full">
            <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
            <span className="text-white/80 text-sm">
              {isLoading ? 'Caricamento rendimenti...' : (
                <>
                  Rendimenti BTP aggiornati
                  {lastUpdate && (
                    <span className="text-white/60 ml-1">
                      ({new Date(lastUpdate).toLocaleDateString('it-IT')})
                    </span>
                  )}
                </>
              )}
            </span>
          </div>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">Configura la tua scala</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capitale da investire: {formatCurrency(capitale)}
                  </label>
                  <input
                    type="range"
                    min="50000"
                    max="2000000"
                    step="10000"
                    value={capitale}
                    onChange={(e) => setCapitale(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durata scala: {durataScala} anni
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="15"
                    step="1"
                    value={durataScala}
                    onChange={(e) => setDurataScala(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Intervallo tra scadenze: ogni {intervalloAnni} anni
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="1"
                    value={intervalloAnni}
                    onChange={(e) => setIntervalloAnni(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    {risultati.numSteps} gradini da {formatCurrency(risultati.importoPerStep)} ciascuno
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Tipo obbligazioni</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['BTP', 'Corporate IG', 'Mix'] as TipoObbligazione[]).map((tipo) => (
                      <button
                        key={tipo}
                        onClick={() => setTipoObbligazione(tipo)}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          tipoObbligazione === tipo
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {tipo}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    BTP: tassazione 12.5% | Corporate IG: tassazione 26%
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Obiettivo</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setObiettivo('rendimento')}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        obiettivo === 'rendimento'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Max Rendimento
                    </button>
                    <button
                      onClick={() => setObiettivo('sicurezza')}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        obiettivo === 'sicurezza'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Max Sicurezza
                    </button>
                  </div>
                </div>
              </div>

              {/* Vantaggi della scala */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-medium text-forest mb-3">Vantaggi della scala obbligazionaria</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Liquidita regolare:</strong> scadenze distribuite nel tempo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Riduce rischio tasso:</strong> reinvesti a tassi diversi</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Flusso cedole costante:</strong> reddito prevedibile</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {/* Main Stats */}
              <div className="bg-green-600 rounded-card p-6 text-white">
                <p className="text-green-100 text-sm mb-1">Cedola Mensile Netta</p>
                <p className="font-heading text-4xl">{formatCurrency(risultati.cedolaMensileNetta)}</p>
                <p className="text-green-200 text-sm mt-2">
                  {formatCurrency(risultati.cedolaTotaleNetta)}/anno netti
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Rendimento Medio</p>
                  <p className="font-heading text-xl text-green-600">{risultati.rendimentoMedioPonderato.toFixed(2)}%</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Cedola Lorda Annua</p>
                  <p className="font-heading text-xl text-forest">{formatCurrency(risultati.cedolaTotaleAnnua)}</p>
                </div>
              </div>

              {/* Timeline Visual */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Timeline Scadenze</h3>
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-200"></div>

                  <div className="space-y-4">
                    {risultati.ladder.map((step, index) => (
                      <div key={index} className="relative flex items-start pl-10">
                        {/* Dot */}
                        <div className="absolute left-2 w-5 h-5 rounded-full bg-green-500 border-4 border-green-100 -translate-x-1/2"></div>

                        {/* Content */}
                        <div className="flex-1 bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-forest">{step.bond.name}</p>
                              <p className="text-xs text-gray-500">Scadenza {step.anno}</p>
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${
                              step.bond.type === 'BTP'
                                ? 'bg-gray-100 text-gray-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {step.bond.type}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <p className="text-gray-400 text-xs">Importo</p>
                              <p className="font-medium">{formatCurrency(step.importo)}</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Rendimento</p>
                              <p className="font-medium text-green-600">{step.bond.yield}%</p>
                            </div>
                            <div>
                              <p className="text-gray-400 text-xs">Cedola/anno</p>
                              <p className="font-medium">{formatCurrency(step.cedolaNetta)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Allocation Table */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Riepilogo Allocazione</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-500">Scadenza</th>
                        <th className="text-right py-2 text-gray-500">Importo</th>
                        <th className="text-right py-2 text-gray-500">Rendimento</th>
                        <th className="text-right py-2 text-gray-500">Cedola Netta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {risultati.ladder.map((step, index) => (
                        <tr key={index} className="border-b border-gray-100">
                          <td className="py-2">
                            <span className="font-medium">{step.anno}</span>
                            <span className="text-gray-400 text-xs ml-2">({step.bond.type})</span>
                          </td>
                          <td className="text-right">{formatCurrency(step.importo)}</td>
                          <td className="text-right text-green-600">{step.bond.yield}%</td>
                          <td className="text-right text-green-600">{formatCurrency(step.cedolaNetta)}</td>
                        </tr>
                      ))}
                      <tr className="font-semibold bg-gray-50">
                        <td className="py-2">Totale</td>
                        <td className="text-right">{formatCurrency(capitale)}</td>
                        <td className="text-right text-green-600">{risultati.rendimentoMedioPonderato.toFixed(2)}%</td>
                        <td className="text-right text-green-600">{formatCurrency(risultati.cedolaTotaleNetta)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Reinvestment Note */}
              <div className="bg-amber-50 border border-amber-200 rounded-card p-4">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-amber-800 mb-1">Strategia di Reinvestimento</p>
                    <p className="text-sm text-amber-700">
                      Quando un&apos;obbligazione scade, reinvesti il capitale nella scadenza piu lunga
                      per mantenere la scala. Questo ti permette di beneficiare dei tassi correnti
                      indipendentemente dalla direzione dei mercati.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-card p-4">
                <p className="text-sm text-gray-800">
                  <strong>Nota:</strong> I rendimenti indicati sono stime basate sui tassi attuali di mercato.
                  I rendimenti effettivi possono variare. I BTP godono della tassazione agevolata al 12.5%,
                  mentre le obbligazioni corporate sono tassate al 26%.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom pb-8">
        <RatingWidget toolSlug="scala-obbligazionaria" toolName="scala-obbligazionaria" />
      </div>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Vuoi costruire una scala obbligazionaria personalizzata?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            La scelta dei titoli giusti dipende dalla tua situazione fiscale,
            dalla tolleranza al rischio e dagli obiettivi di rendimento.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      <ConsultationPopup
        isOpen={showPopup}
        amount={popupAmount}
        onClose={() => setShowPopup(false)}
      />

      <Footer />
    </main>
  )
}
