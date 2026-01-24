'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer, RelatedTools, toolCorrelations , RatingWidget, ToolPageSchema} from '@/components'

type ExitOption = 'trade_sale' | 'mbo' | 'family' | 'ipo'
type HoldingStructure = 'direct' | 'holding_pex' | 'reinvestment'

interface ExitOptionInfo {
  name: string
  description: string
  taxRate: number
  taxLabel: string
  pros: string[]
  cons: string[]
  timeline: string
  suitableFor: string
}

const exitOptions: Record<ExitOption, ExitOptionInfo> = {
  trade_sale: {
    name: 'Trade Sale',
    description: 'Vendita a competitor o investitore strategico',
    taxRate: 26,
    taxLabel: '26% capital gain (vendita diretta)',
    pros: [
      'Liquidità immediata',
      'Valutazioni spesso premium (sinergie)',
      'Processo relativamente rapido',
    ],
    cons: [
      'Perdita di controllo totale',
      'Due diligence invasiva',
      'Possibile impatto su dipendenti',
    ],
    timeline: '6-18 mesi',
    suitableFor: 'Imprenditori pronti a uscire completamente',
  },
  mbo: {
    name: 'Management Buyout (MBO)',
    description: 'Vendita al management interno',
    taxRate: 26,
    taxLabel: '26% capital gain',
    pros: [
      'Continuità aziendale garantita',
      'Management già formato',
      'Processo più riservato',
    ],
    cons: [
      'Spesso valutazioni inferiori',
      'Management potrebbe non avere capitali',
      'Strutture di pagamento dilazionate',
    ],
    timeline: '12-24 mesi',
    suitableFor: 'Chi vuole preservare la cultura aziendale',
  },
  family: {
    name: 'Passaggio Generazionale',
    description: 'Trasferimento a familiari',
    taxRate: 0,
    taxLabel: 'Esenzione con patto di famiglia',
    pros: [
      'Vantaggi fiscali significativi',
      'Continuità del legacy familiare',
      'Possibilità di mantenere ruolo',
    ],
    cons: [
      'Richiede eredi interessati e capaci',
      'Potenziali conflitti familiari',
      'Nessuna liquidità immediata',
    ],
    timeline: '2-5 anni di preparazione',
    suitableFor: 'Famiglie con successori motivati',
  },
  ipo: {
    name: 'IPO / Quotazione',
    description: 'Quotazione in borsa (AIM Italia, Euronext Growth)',
    taxRate: 26,
    taxLabel: '26% al momento della vendita azioni',
    pros: [
      'Massimizza la valutazione',
      'Liquidità parziale mantenendo controllo',
      'Prestigio e visibilità',
    ],
    cons: [
      'Costi elevati (2-5% del capitale)',
      'Obblighi di trasparenza continui',
      'Richiede fatturato minimo €5-10M',
    ],
    timeline: '18-36 mesi',
    suitableFor: 'Aziende con forte crescita e governance strutturata',
  },
}

const holdingStructures: Record<HoldingStructure, { name: string; effectiveRate: number; description: string; requirements: string[] }> = {
  direct: {
    name: 'Vendita Diretta (Persona Fisica)',
    effectiveRate: 26,
    description: 'Tassazione standard sulle plusvalenze',
    requirements: ['Nessuna struttura richiesta'],
  },
  holding_pex: {
    name: 'Holding con PEX (95% esenzione)',
    effectiveRate: 1.2,
    description: 'Participation Exemption: solo il 5% della plusvalenza è tassato IRES',
    requirements: [
      'Holding deve detenere partecipazione da almeno 12 mesi',
      'Partecipazione classificata come immobilizzazione',
      'Società ceduta deve essere commerciale',
      'Requisito di residenza (no paradisi fiscali)',
    ],
  },
  reinvestment: {
    name: 'Reinvestimento in Startup/PMI',
    effectiveRate: 13,
    description: 'Detrazione 50% se reinvestito in startup innovative entro 12 mesi',
    requirements: [
      'Reinvestimento in startup innovative o PMI innovative',
      'Mantenimento per almeno 3 anni',
      'Massimo €1M per startup, €300k per PMI',
    ],
  },
}

export default function ExitStrategyPlanner() {
  // Business valuation inputs
  const [ebitda, setEbitda] = useState(500000)
  const [multiplo, setMultiplo] = useState(5)
  const [valoreManuale, setValoreManuale] = useState<number | null>(null)
  const [useManuale, setUseManuale] = useState(false)

  // Exit preferences
  const [exitOption, setExitOption] = useState<ExitOption>('trade_sale')
  const [holdingStructure, setHoldingStructure] = useState<HoldingStructure>('direct')
  const [earnoutPercentage, setEarnoutPercentage] = useState(20)
  const [earnoutYears, setEarnoutYears] = useState(3)

  // Post-exit planning
  const [speseAnnuePostExit, setSpeseAnnuePostExit] = useState(80000)
  const [tassoPrelievo, setTassoPrelievo] = useState(4)
  const [anniPreparazione, setAnniPreparazione] = useState(3)

  const risultati = useMemo(() => {
    // Business valuation
    const valoreAzienda = useManuale && valoreManuale ? valoreManuale : ebitda * multiplo

    // Tax calculation based on structure
    const selectedStructure = holdingStructures[holdingStructure]
    const taxRate = exitOption === 'family' ? 0 : selectedStructure.effectiveRate

    // Net proceeds calculation
    const plusvalenza = valoreAzienda * 0.8 // Assumendo costo storico 20% del valore
    const imposte = plusvalenza * (taxRate / 100)
    const nettoVendita = valoreAzienda - imposte

    // Earnout calculation
    const earnoutAmount = valoreAzienda * (earnoutPercentage / 100)
    const upfrontAmount = valoreAzienda - earnoutAmount
    const earnoutAnnuale = earnoutAmount / earnoutYears
    const earnoutTax = earnoutAmount * 0.8 * (taxRate / 100) // Tassato quando ricevuto
    const nettoEarnout = earnoutAmount - earnoutTax

    // FIRE calculation post-exit
    const fireNumber = speseAnnuePostExit / (tassoPrelievo / 100)
    const isFire = nettoVendita >= fireNumber
    const fireGap = fireNumber - nettoVendita
    const finanziamentoFire = (nettoVendita / fireNumber) * 100

    // Tax savings with holding
    const taxSavingsPex = plusvalenza * 0.26 - plusvalenza * 0.012
    const taxSavingsPercentage = ((0.26 - selectedStructure.effectiveRate / 100) / 0.26) * 100

    // Timeline milestones
    const oggi = new Date()
    const timeline = [
      { year: 0, milestone: 'Oggi: Inizio pianificazione', action: 'Valutazione aziendale e setup struttura' },
      { year: 1, milestone: `Anno 1: ${holdingStructure === 'holding_pex' ? 'Costituzione holding' : 'Ottimizzazione'}`, action: 'Preparazione documentale e due diligence interna' },
      { year: Math.floor(anniPreparazione / 2), milestone: `Anno ${Math.floor(anniPreparazione / 2)}: Ricerca acquirenti`, action: 'Mandato M&A advisor, primi contatti' },
      { year: anniPreparazione, milestone: `Anno ${anniPreparazione}: Exit`, action: 'Closing e trasferimento' },
      { year: anniPreparazione + earnoutYears, milestone: `Anno ${anniPreparazione + earnoutYears}: Fine earnout`, action: 'Incasso ultima tranche' },
    ]

    return {
      valoreAzienda,
      taxRate,
      plusvalenza,
      imposte,
      nettoVendita,
      earnoutAmount,
      upfrontAmount,
      earnoutAnnuale,
      nettoEarnout,
      fireNumber,
      isFire,
      fireGap,
      finanziamentoFire,
      taxSavingsPex,
      taxSavingsPercentage,
      timeline,
    }
  }, [ebitda, multiplo, valoreManuale, useManuale, exitOption, holdingStructure,
      earnoutPercentage, earnoutYears, speseAnnuePostExit, tassoPrelievo, anniPreparazione])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value / 100)
  }

  const selectedExit = exitOptions[exitOption]
  const selectedStructure = holdingStructures[holdingStructure]

  return (
    <main>
      <ToolPageSchema slug="exit-strategy" />
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
            Pianificatore Exit Strategy
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Pianifica la vendita della tua azienda: confronta opzioni, ottimizza la fiscalità
            e proietta il tuo patrimonio post-exit.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          {/* Valutazione Aziendale */}
          <div className="bg-white rounded-card p-6 shadow-sm mb-8">
            <h2 className="font-heading text-xl text-forest mb-6">1. Valutazione Aziendale</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={!useManuale}
                    onChange={() => setUseManuale(false)}
                    className="w-4 h-4 accent-green-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Calcola con multiplo EBITDA</span>
                </label>

                <div className={`space-y-4 ${useManuale ? 'opacity-50' : ''}`}>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      EBITDA annuo: {formatCurrency(ebitda)}
                    </label>
                    <input
                      type="range"
                      min="100000"
                      max="5000000"
                      step="50000"
                      value={ebitda}
                      onChange={(e) => setEbitda(Number(e.target.value))}
                      disabled={useManuale}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Multiplo EV/EBITDA: {multiplo}x
                    </label>
                    <input
                      type="range"
                      min="3"
                      max="12"
                      step="0.5"
                      value={multiplo}
                      onChange={(e) => setMultiplo(Number(e.target.value))}
                      disabled={useManuale}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      3-5x = settori maturi | 6-8x = tech/crescita | 8-12x = SaaS/premium
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 mb-4">
                  <input
                    type="checkbox"
                    checked={useManuale}
                    onChange={() => setUseManuale(true)}
                    className="w-4 h-4 accent-green-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Inserisci valore manualmente</span>
                </label>

                <div className={useManuale ? '' : 'opacity-50'}>
                  <label className="block text-sm text-gray-600 mb-2">
                    Valore azienda (Enterprise Value)
                  </label>
                  <input
                    type="number"
                    value={valoreManuale || ''}
                    onChange={(e) => setValoreManuale(Number(e.target.value) || null)}
                    disabled={!useManuale}
                    placeholder="es. 2.500.000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">Valore stimato azienda</p>
              <p className="font-heading text-3xl text-forest">{formatCurrency(risultati.valoreAzienda)}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Opzioni di Exit */}
            <div className="space-y-6">
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-xl text-forest mb-6">2. Opzione di Exit</h2>

                <div className="space-y-3">
                  {(Object.keys(exitOptions) as ExitOption[]).map((option) => (
                    <label
                      key={option}
                      className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                        exitOption === option
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="exitOption"
                          value={option}
                          checked={exitOption === option}
                          onChange={() => setExitOption(option)}
                          className="mt-1 w-4 h-4 accent-green-600"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-forest">{exitOptions[option].name}</p>
                          <p className="text-sm text-gray-500">{exitOptions[option].description}</p>
                          <p className="text-xs text-gray-400 mt-1">Timeline: {exitOptions[option].timeline}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dettagli opzione selezionata */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">{selectedExit.name}</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-green-700 mb-2">Vantaggi</p>
                    <ul className="space-y-1">
                      {selectedExit.pros.map((pro, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-red-700 mb-2">Svantaggi</p>
                    <ul className="space-y-1">
                      {selectedExit.cons.map((con, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-red-500 mt-0.5">-</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="text-sm text-gray-500 pt-2 border-t">
                    <strong>Ideale per:</strong> {selectedExit.suitableFor}
                  </p>
                </div>
              </div>

              {/* Struttura Fiscale */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-xl text-forest mb-6">3. Struttura Fiscale</h2>

                <div className="space-y-3">
                  {(Object.keys(holdingStructures) as HoldingStructure[]).map((structure) => (
                    <label
                      key={structure}
                      className={`block p-4 border rounded-lg cursor-pointer transition-all ${
                        holdingStructure === structure
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${exitOption === 'family' ? 'opacity-50 pointer-events-none' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="holdingStructure"
                          value={structure}
                          checked={holdingStructure === structure}
                          onChange={() => setHoldingStructure(structure)}
                          disabled={exitOption === 'family'}
                          className="mt-1 w-4 h-4 accent-green-600"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <p className="font-medium text-forest">{holdingStructures[structure].name}</p>
                            <span className={`text-sm font-bold ${
                              holdingStructures[structure].effectiveRate < 10 ? 'text-green-600' : 'text-gray-600'
                            }`}>
                              {holdingStructures[structure].effectiveRate}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{holdingStructures[structure].description}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {exitOption === 'family' && (
                  <p className="mt-4 text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                    Il passaggio generazionale con patto di famiglia gode di esenzione fiscale
                    se gli eredi proseguono l&apos;attivita per almeno 5 anni.
                  </p>
                )}

                {holdingStructure === 'holding_pex' && exitOption !== 'family' && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-2">Requisiti PEX:</p>
                    <ul className="text-xs text-green-700 space-y-1">
                      {selectedStructure.requirements.map((req, i) => (
                        <li key={i}>- {req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Earnout */}
              {exitOption !== 'family' && (
                <div className="bg-white rounded-card p-6 shadow-sm">
                  <h2 className="font-heading text-xl text-forest mb-6">4. Struttura Earnout</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">
                        Percentuale in earnout: {earnoutPercentage}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        step="5"
                        value={earnoutPercentage}
                        onChange={(e) => setEarnoutPercentage(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Pagamento condizionato a obiettivi futuri
                      </p>
                    </div>

                    {earnoutPercentage > 0 && (
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          Durata earnout: {earnoutYears} anni
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          step="1"
                          value={earnoutYears}
                          onChange={(e) => setEarnoutYears(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                      </div>
                    )}

                    <div className="p-3 bg-gray-50 rounded-lg text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Upfront (closing)</span>
                        <span className="font-medium">{formatCurrency(risultati.upfrontAmount)}</span>
                      </div>
                      {earnoutPercentage > 0 && (
                        <>
                          <div className="flex justify-between mb-1">
                            <span className="text-gray-600">Earnout totale</span>
                            <span className="font-medium">{formatCurrency(risultati.earnoutAmount)}</span>
                          </div>
                          <div className="flex justify-between text-gray-500">
                            <span>({earnoutYears} rate da)</span>
                            <span>{formatCurrency(risultati.earnoutAnnuale)}/anno</span>
                          </div>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-gray-500">
                      <strong>Nota fiscale:</strong> L&apos;earnout viene tassato nell&apos;anno di effettivo incasso.
                      Se condizionato a obiettivi, potrebbe essere trattato come reddito diverso.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Risultati e Proiezioni */}
            <div className="space-y-6">
              {/* Riepilogo Fiscale */}
              <div className="bg-forest rounded-card p-6 text-white">
                <h3 className="font-heading text-lg mb-4">Impatto Fiscale</h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-white/20">
                    <span className="text-white/70">Valore vendita</span>
                    <span className="font-heading text-xl">{formatCurrency(risultati.valoreAzienda)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Plusvalenza stimata</span>
                    <span>{formatCurrency(risultati.plusvalenza)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Aliquota effettiva</span>
                    <span className={risultati.taxRate < 10 ? 'text-green-300 font-bold' : ''}>
                      {risultati.taxRate}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-red-300">
                    <span>Imposte da pagare</span>
                    <span>-{formatCurrency(risultati.imposte)}</span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-white/20">
                    <span className="font-medium">Netto post-tax</span>
                    <span className="font-heading text-2xl text-green-300">{formatCurrency(risultati.nettoVendita)}</span>
                  </div>
                </div>

                {holdingStructure === 'holding_pex' && exitOption !== 'family' && (
                  <div className="mt-4 p-3 bg-green-900/50 rounded-lg">
                    <p className="text-sm text-green-200">
                      Risparmio fiscale con PEX rispetto a vendita diretta:
                    </p>
                    <p className="font-heading text-xl text-green-300">
                      {formatCurrency(risultati.taxSavingsPex)}
                    </p>
                    <p className="text-xs text-green-300/70">
                      ({formatPercentage(risultati.taxSavingsPercentage)} di risparmio)
                    </p>
                  </div>
                )}
              </div>

              {/* FIRE Post-Exit */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">5. Pianificazione Post-Exit (FIRE)</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Spese annue desiderate: {formatCurrency(speseAnnuePostExit)}
                    </label>
                    <input
                      type="range"
                      min="30000"
                      max="300000"
                      step="5000"
                      value={speseAnnuePostExit}
                      onChange={(e) => setSpeseAnnuePostExit(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">
                      Safe Withdrawal Rate: {tassoPrelievo}%
                    </label>
                    <input
                      type="range"
                      min="2.5"
                      max="5"
                      step="0.25"
                      value={tassoPrelievo}
                      onChange={(e) => setTassoPrelievo(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">FIRE Number necessario</span>
                    <span className="font-heading text-xl text-forest">{formatCurrency(risultati.fireNumber)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Netto dalla vendita</span>
                    <span className="font-heading text-xl">{formatCurrency(risultati.nettoVendita)}</span>
                  </div>
                </div>

                {risultati.isFire ? (
                  <div className="mt-4 p-4 bg-green-100 rounded-lg text-center">
                    <p className="text-green-800 font-medium">Obiettivo FIRE raggiunto!</p>
                    <p className="text-sm text-green-600 mt-1">
                      La vendita copre il {formatPercentage(risultati.finanziamentoFire)} del tuo FIRE number.
                      Avrai un surplus di {formatCurrency(risultati.nettoVendita - risultati.fireNumber)}.
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                    <p className="text-amber-800 font-medium">FIRE Number non ancora raggiunto</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Copri il {formatPercentage(risultati.finanziamentoFire)} del necessario.
                      Gap da colmare: {formatCurrency(risultati.fireGap)}
                    </p>
                    <p className="text-xs text-amber-600 mt-2">
                      Considera: ridurre le spese, aumentare il valore aziendale, o pianificare fonti di reddito aggiuntive post-exit.
                    </p>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">6. Timeline Preparazione</h3>

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2">
                    Anni di preparazione: {anniPreparazione}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={anniPreparazione}
                    onChange={(e) => setAnniPreparazione(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div className="space-y-4">
                  {risultati.timeline.map((step, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full ${
                          i === 0 ? 'bg-green-500' :
                          i === risultati.timeline.length - 1 ? 'bg-forest' : 'bg-gray-300'
                        }`} />
                        {i < risultati.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 my-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-forest text-sm">{step.milestone}</p>
                        <p className="text-xs text-gray-500">{step.action}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Checklist Preparazione */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Checklist Pre-Exit</h3>

                <ul className="space-y-2 text-sm">
                  {[
                    'Due diligence finanziaria interna (bilanci ultimi 3 anni)',
                    'Audit dei contratti chiave (clienti, fornitori, dipendenti)',
                    'Normalizzazione EBITDA (add-back costi personali)',
                    holdingStructure === 'holding_pex' ? 'Costituzione e capitalizzazione holding' : null,
                    'Data room virtuale preparata',
                    'Identificazione key-man risk e piani di successione',
                    'Valutazione indipendente (fairness opinion)',
                    'Selezione M&A advisor / investment bank',
                    'Contratti di riservatezza (NDA) pronti',
                    'Piano di comunicazione dipendenti e stakeholder',
                  ].filter(Boolean).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <span className="w-5 h-5 rounded border border-gray-300 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom pb-8">
        <RatingWidget toolSlug="exit-strategy" toolName="exit-strategy" />
      </div>

      <RelatedTools tools={toolCorrelations['exit-strategy']} />

      {/* CTA Section */}
      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Ogni exit e unica. Preparala con esperti.
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            La strutturazione fiscale, la negoziazione e la gestione del patrimonio post-exit
            richiedono competenze specializzate. Un consulente indipendente puo fare la differenza
            tra un&apos;exit mediocre e una straordinaria.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Strategica
          </Link>
        </div>
      </section>

      {/* Info Section */}
      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-2xl text-forest mb-6 text-center">
              Domande Frequenti sull&apos;Exit Strategy
            </h2>

            <div className="space-y-6">
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-medium text-forest mb-2">
                  Cos&apos;e la Participation Exemption (PEX)?
                </h3>
                <p className="text-sm text-gray-600">
                  La PEX e un regime fiscale che esenta dal 95% la plusvalenza realizzata dalla vendita
                  di partecipazioni qualificate. In pratica, invece di pagare il 26% sulla plusvalenza,
                  una holding paga solo IRES (24%) sul 5% della plusvalenza, risultando in un&apos;aliquota
                  effettiva di circa 1,2%. Richiede il possesso per almeno 12 mesi e altri requisiti specifici.
                </p>
              </div>

              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-medium text-forest mb-2">
                  Quando conviene costituire una holding?
                </h3>
                <p className="text-sm text-gray-600">
                  La holding conviene quando si prevede una cessione significativa (tipicamente oltre
                  1 milione di plusvalenza), quando si vuole reinvestire i proventi in altre attivita
                  imprenditoriali, o per pianificazione successoria. Il risparmio fiscale deve compensare
                  i costi di costituzione e gestione. Idealmente, la holding va costituita almeno 12-24 mesi
                  prima dell&apos;exit prevista.
                </p>
              </div>

              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-medium text-forest mb-2">
                  Come funziona l&apos;earnout dal punto di vista fiscale?
                </h3>
                <p className="text-sm text-gray-600">
                  L&apos;earnout e una componente del prezzo condizionata al raggiungimento di obiettivi futuri
                  (fatturato, EBITDA, retention clienti). Fiscalmente, viene tassato nell&apos;anno di effettivo
                  incasso come plusvalenza. Se gli obiettivi non vengono raggiunti, non c&apos;e tassazione
                  sulla parte non incassata. E importante strutturare l&apos;earnout in modo che sia qualificato
                  come corrispettivo della vendita e non come compenso per attivita lavorativa.
                </p>
              </div>

              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-medium text-forest mb-2">
                  Qual e il multiplo EBITDA tipico per la mia azienda?
                </h3>
                <p className="text-sm text-gray-600">
                  I multipli variano enormemente per settore, dimensione e caratteristiche specifiche.
                  In generale: manifatturiero tradizionale 3-5x, servizi B2B 4-7x, tech/software 6-10x,
                  SaaS con ricavi ricorrenti 8-15x. Fattori che aumentano il multiplo: crescita elevata,
                  margini sopra la media, clienti diversificati, management autonomo, IP proprietaria.
                  Una valutazione professionale e essenziale per non sottostimare o sopravvalutare.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
