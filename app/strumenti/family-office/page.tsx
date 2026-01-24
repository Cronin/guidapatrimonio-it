'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer, RelatedTools, toolCorrelations , RatingWidget, ToolPageSchema} from '@/components'

type ServiceOption = 'private-banking' | 'multi-fo' | 'single-fo'

interface ServiceFeature {
  name: string
  privateBank: string
  multiFO: string
  singleFO: string
}

const serviceFeatures: ServiceFeature[] = [
  { name: 'Gestione Investimenti', privateBank: 'Standard', multiFO: 'Avanzata', singleFO: 'Personalizzata' },
  { name: 'Pianificazione Fiscale', privateBank: 'Base', multiFO: 'Completa', singleFO: 'Dedicata' },
  { name: 'Consulenza Legale', privateBank: 'No', multiFO: 'Accesso', singleFO: 'Team interno' },
  { name: 'Passaggio Generazionale', privateBank: 'Limitato', multiFO: 'Si', singleFO: 'Completo' },
  { name: 'Concierge / Lifestyle', privateBank: 'No', multiFO: 'Limitato', singleFO: 'Dedicato 24/7' },
  { name: 'Real Estate Advisory', privateBank: 'No', multiFO: 'Si', singleFO: 'Team dedicato' },
  { name: 'Private Equity Access', privateBank: 'Limitato', multiFO: 'Si', singleFO: 'Deal flow esclusivo' },
  { name: 'Reporting Consolidato', privateBank: 'Base', multiFO: 'Completo', singleFO: 'Real-time' },
  { name: 'Governance Familiare', privateBank: 'No', multiFO: 'Consulenza', singleFO: 'Implementazione' },
  { name: 'Philanthropy Advisory', privateBank: 'No', multiFO: 'Si', singleFO: 'Fondazione dedicata' },
]

export default function CalcolatoreFamilyOffice() {
  const [patrimonio, setPatrimonio] = useState(20000000) // 20M default
  const [complessita, setComplessita] = useState(3) // 1-5 scala
  const [numFamiliari, setNumFamiliari] = useState(4)
  const [attivitaEstere, setAttivitaEstere] = useState(false)
  const [holdingStrutture, setHoldingStrutture] = useState(false)
  const [realEstate, setRealEstate] = useState(true)

  const risultati = useMemo(() => {
    // Costi Private Banking (1-2% AUM)
    const costoPrivateBank = patrimonio * 0.015 // 1.5% medio

    // Costi Multi-Family Office (0.3-0.8% AUM)
    // Varia in base alla complessita
    const multiFORate = 0.003 + (complessita * 0.001) // 0.4% - 0.8%
    const costoMultiFO = patrimonio * multiFORate

    // Costi Single Family Office (fisso + variabile)
    // Staff: CEO/CIO (200k), CFO (150k), Analyst (80k), Admin (50k) = 480k
    // Office + Tech: 50-100k
    // Legal/Audit esterni: 50-100k
    const costoBaseSFO = 400000 // Minimo struttura base
    const costoVariabileSFO = Math.max(0, (patrimonio - 30000000) * 0.001) // 0.1% sopra 30M
    const costoSingleFO = costoBaseSFO + costoVariabileSFO

    // Risparmio fiscale stimato (tax optimization)
    const risparmioFiscalePrivateBank = patrimonio * 0.001 // 0.1%
    const risparmioFiscaleMultiFO = patrimonio * 0.005 // 0.5%
    const risparmioFiscaleSFO = patrimonio * 0.008 // 0.8%

    // Alpha (rendimento extra) stimato
    const alphaPrivateBank = patrimonio * 0.002 // 0.2%
    const alphaMultiFO = patrimonio * 0.004 // 0.4%
    const alphaSFO = patrimonio * 0.006 // 0.6%

    // Valore tempo risparmiato (ore/anno * tariffa oraria implicita)
    const tempoRisparmiatoPrivateBank = 50 * 500 // 50 ore * 500 EUR
    const tempoRisparmiatoMultiFO = 200 * 500 // 200 ore
    const tempoRisparmiatoSFO = 500 * 500 // 500 ore (team dedicato)

    // Calcolo ROI netto
    const roiPrivateBank = (risparmioFiscalePrivateBank + alphaPrivateBank + tempoRisparmiatoPrivateBank) - costoPrivateBank
    const roiMultiFO = (risparmioFiscaleMultiFO + alphaMultiFO + tempoRisparmiatoMultiFO) - costoMultiFO
    const roiSFO = (risparmioFiscaleSFO + alphaSFO + tempoRisparmiatoSFO) - costoSingleFO

    // Determina opzione consigliata
    let opzioneConsigliata: ServiceOption = 'private-banking'
    if (patrimonio >= 30000000 && roiSFO > roiMultiFO) {
      opzioneConsigliata = 'single-fo'
    } else if (patrimonio >= 5000000 && roiMultiFO > roiPrivateBank) {
      opzioneConsigliata = 'multi-fo'
    }

    // Break-even points
    const breakEvenMultiFO = costoBaseSFO / (multiFORate - 0.001) // Quando SFO diventa conveniente
    const breakEvenPrivateBank = 1000000 // Soglia minima sensata

    // Fattori di complessita
    const moltiplicatoreComplessita = 1 +
      (attivitaEstere ? 0.15 : 0) +
      (holdingStrutture ? 0.1 : 0) +
      (realEstate ? 0.05 : 0) +
      (numFamiliari > 5 ? 0.1 : 0)

    return {
      costoPrivateBank,
      costoMultiFO,
      costoSingleFO,
      risparmioFiscalePrivateBank,
      risparmioFiscaleMultiFO,
      risparmioFiscaleSFO,
      alphaPrivateBank,
      alphaMultiFO,
      alphaSFO,
      tempoRisparmiatoPrivateBank,
      tempoRisparmiatoMultiFO,
      tempoRisparmiatoSFO,
      roiPrivateBank,
      roiMultiFO,
      roiSFO,
      opzioneConsigliata,
      breakEvenMultiFO,
      breakEvenPrivateBank,
      moltiplicatoreComplessita,
      multiFORate,
    }
  }, [patrimonio, complessita, numFamiliari, attivitaEstere, holdingStrutture, realEstate])

  const formatCurrency = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(value / 1000000) + ' M'
    }
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return (value * 100).toFixed(2) + '%'
  }

  const getOptionLabel = (option: ServiceOption) => {
    switch (option) {
      case 'private-banking': return 'Private Banking'
      case 'multi-fo': return 'Multi-Family Office'
      case 'single-fo': return 'Single Family Office'
    }
  }

  const getRangeLabel = (option: ServiceOption) => {
    switch (option) {
      case 'private-banking': return '1M - 5M EUR'
      case 'multi-fo': return '5M - 30M EUR'
      case 'single-fo': return '30M+ EUR'
    }
  }

  return (
    <main>
      <ToolPageSchema slug="family-office" />
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
            Calcolatore Family Office
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Confronta le opzioni di gestione patrimoniale per famiglie UHNWI:
            Private Banking, Multi-Family Office e Single Family Office.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="space-y-6">
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-xl text-forest mb-6">Il tuo profilo patrimoniale</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patrimonio complessivo: {formatCurrency(patrimonio)}
                    </label>
                    <input
                      type="range"
                      min="1000000"
                      max="100000000"
                      step="1000000"
                      value={patrimonio}
                      onChange={(e) => setPatrimonio(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1 M EUR</span>
                      <span>100 M EUR</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Complessita patrimoniale: {complessita}/5
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      value={complessita}
                      onChange={(e) => setComplessita(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Semplice</span>
                      <span>Molto complessa</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Membri della famiglia: {numFamiliari}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      step="1"
                      value={numFamiliari}
                      onChange={(e) => setNumFamiliari(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1</span>
                      <span>15+</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Fattori di complessita</h3>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={attivitaEstere}
                      onChange={(e) => setAttivitaEstere(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Attivita e residenze estere</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={holdingStrutture}
                      onChange={(e) => setHoldingStrutture(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Holding e strutture societarie</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={realEstate}
                      onChange={(e) => setRealEstate(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">Patrimonio immobiliare significativo</span>
                  </label>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">
                    Moltiplicatore complessita: <strong className="text-forest">{(risultati.moltiplicatoreComplessita * 100 - 100).toFixed(0)}%</strong> costi aggiuntivi stimati
                  </p>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {/* Recommendation */}
              <div className="bg-green-600 rounded-card p-6 text-white">
                <p className="text-green-100 text-sm mb-1">Soluzione consigliata per il tuo profilo</p>
                <p className="font-heading text-2xl">{getOptionLabel(risultati.opzioneConsigliata)}</p>
                <p className="text-green-200 text-sm mt-2">
                  Range tipico: {getRangeLabel(risultati.opzioneConsigliata)}
                </p>
              </div>

              {/* Cost Comparison */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Confronto Costi Annui</h3>

                <div className="space-y-4">
                  {/* Private Banking */}
                  <div className="border-b border-gray-100 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-800">Private Banking</p>
                        <p className="text-xs text-gray-500">~1.5% dell&apos;AUM</p>
                      </div>
                      <p className="font-heading text-lg text-forest">{formatCurrency(risultati.costoPrivateBank)}</p>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gray-400 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (risultati.costoPrivateBank / risultati.costoSingleFO) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Multi-FO */}
                  <div className="border-b border-gray-100 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-800">Multi-Family Office</p>
                        <p className="text-xs text-gray-500">~{formatPercentage(risultati.multiFORate)} dell&apos;AUM</p>
                      </div>
                      <p className="font-heading text-lg text-forest">{formatCurrency(risultati.costoMultiFO)}</p>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (risultati.costoMultiFO / risultati.costoSingleFO) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Single FO */}
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-800">Single Family Office</p>
                        <p className="text-xs text-gray-500">Costi fissi + variabili</p>
                      </div>
                      <p className="font-heading text-lg text-forest">{formatCurrency(risultati.costoSingleFO)}</p>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ROI Analysis */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Analisi ROI Netto Annuo</h3>
                <p className="text-xs text-gray-500 mb-4">
                  Considera: risparmio fiscale, alpha sui rendimenti, valore del tempo risparmiato
                </p>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Private Bank</p>
                    <p className={`font-heading text-lg ${risultati.roiPrivateBank >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {risultati.roiPrivateBank >= 0 ? '+' : ''}{formatCurrency(risultati.roiPrivateBank)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg border-2 border-green-200">
                    <p className="text-xs text-gray-500 mb-1">Multi-FO</p>
                    <p className={`font-heading text-lg ${risultati.roiMultiFO >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {risultati.roiMultiFO >= 0 ? '+' : ''}{formatCurrency(risultati.roiMultiFO)}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Single FO</p>
                    <p className={`font-heading text-lg ${risultati.roiSFO >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {risultati.roiSFO >= 0 ? '+' : ''}{formatCurrency(risultati.roiSFO)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Break-even */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Soglie di Break-Even</h3>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-gray-400 rounded-full flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Private Banking</p>
                      <p className="text-xs text-gray-500">Da 1M EUR - Servizi standardizzati</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Multi-Family Office</p>
                      <p className="text-xs text-gray-500">Da 5M EUR - Ottimale tra 10-30M EUR</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-amber-500 rounded-full flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-gray-800">Single Family Office</p>
                      <p className="text-xs text-gray-500">Da 30M EUR - Economie di scala oltre 50M EUR</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                  <p className="text-xs text-amber-800">
                    Il Single FO diventa conveniente rispetto al Multi-FO oltre circa {formatCurrency(risultati.breakEvenMultiFO)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Comparison Matrix */}
          <div className="mt-12 bg-white rounded-card p-6 shadow-sm overflow-x-auto">
            <h2 className="font-heading text-xl text-forest mb-6">Matrice Servizi a Confronto</h2>

            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Servizio</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-400">Private Banking</th>
                  <th className="text-center py-3 px-4 font-medium text-green-600">Multi-Family Office</th>
                  <th className="text-center py-3 px-4 font-medium text-amber-600">Single Family Office</th>
                </tr>
              </thead>
              <tbody>
                {serviceFeatures.map((feature, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                    <td className="py-3 px-4 text-sm font-medium text-gray-800">{feature.name}</td>
                    <td className="py-3 px-4 text-sm text-center text-gray-500">{feature.privateBank}</td>
                    <td className="py-3 px-4 text-sm text-center text-gray-700">{feature.multiFO}</td>
                    <td className="py-3 px-4 text-sm text-center text-gray-800 font-medium">{feature.singleFO}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Educational Content */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-card p-6 shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Private Banking</h3>
              <p className="text-sm text-gray-600">
                Servizio bancario premium per clienti affluent. Offre gestione patrimoniale standardizzata,
                accesso a prodotti esclusivi e un relationship manager dedicato. Ideale per patrimoni
                liquidi fino a 5M EUR.
              </p>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm border-2 border-green-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Multi-Family Office</h3>
              <p className="text-sm text-gray-600">
                Struttura che serve piu famiglie UHNWI, condividendo costi e competenze. Offre servizi
                completi (investimenti, fiscale, legale, lifestyle) a costi inferiori rispetto a un SFO.
                Ottimale tra 5M e 30M EUR.
              </p>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Single Family Office</h3>
              <p className="text-sm text-gray-600">
                Struttura dedicata esclusivamente a una famiglia. Team interno di professionisti
                (CEO, CIO, CFO, legali) che gestisce ogni aspetto patrimoniale. Massima personalizzazione
                e riservatezza. Sensato oltre i 30M EUR.
              </p>
            </div>
          </div>

          {/* Value Breakdown */}
          <div className="mt-12 bg-white rounded-card p-6 shadow-sm">
            <h2 className="font-heading text-xl text-forest mb-6">Scomposizione del Valore Creato</h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium text-gray-800 mb-3">Risparmio Fiscale Annuo</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Private Banking</span>
                    <span className="font-medium">{formatCurrency(risultati.risparmioFiscalePrivateBank)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Multi-FO</span>
                    <span className="font-medium text-green-600">{formatCurrency(risultati.risparmioFiscaleMultiFO)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Single FO</span>
                    <span className="font-medium">{formatCurrency(risultati.risparmioFiscaleSFO)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-3">Alpha sui Rendimenti</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Private Banking (+0.2%)</span>
                    <span className="font-medium">{formatCurrency(risultati.alphaPrivateBank)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Multi-FO (+0.4%)</span>
                    <span className="font-medium text-green-600">{formatCurrency(risultati.alphaMultiFO)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Single FO (+0.6%)</span>
                    <span className="font-medium">{formatCurrency(risultati.alphaSFO)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-3">Valore Tempo Risparmiato</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Private Banking (50h)</span>
                    <span className="font-medium">{formatCurrency(risultati.tempoRisparmiatoPrivateBank)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Multi-FO (200h)</span>
                    <span className="font-medium text-green-600">{formatCurrency(risultati.tempoRisparmiatoMultiFO)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Single FO (500h)</span>
                    <span className="font-medium">{formatCurrency(risultati.tempoRisparmiatoSFO)}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-6">
              * Stime basate su dati di mercato. Il valore effettivo dipende dalla qualita del servizio e dalla situazione specifica.
              Tariffa oraria implicita: 500 EUR/ora per tempo del principal.
            </p>
          </div>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom pb-8">
        <RatingWidget toolSlug="family-office" toolName="family-office" />
      </div>

      <RelatedTools tools={toolCorrelations['family-office']} />

      {/* CTA */}
      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Quale struttura e giusta per la tua famiglia?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            La scelta tra Private Banking, Multi-FO e Single-FO dipende da molti fattori.
            Un consulente indipendente puo aiutarti a valutare le opzioni senza conflitti di interesse.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Riservata
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
