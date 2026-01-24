'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget} from '@/components'

interface Property {
  id: string
  nome: string
  tipo: 'residenziale' | 'commerciale' | 'box' | 'terreno'
  citta: string
  valoreAcquisto: number
  valoreCatastale: number
  affittoMensile: number
  speseAnnue: number
  mutuo: {
    attivo: boolean
    residuo: number
    rata: number
    interessiAnnui: number
  }
  aliquotaIMU: number // per mille
  contrattoAgevolato: boolean // per cedolare 10%
}

type RegimeFiscale = 'cedolare' | 'irpef' | 'societa'

const tipiImmobile = [
  { value: 'residenziale', label: 'Residenziale' },
  { value: 'commerciale', label: 'Commerciale' },
  { value: 'box', label: 'Box/Garage' },
  { value: 'terreno', label: 'Terreno' },
]

const cittaEsempio = [
  'Milano', 'Roma', 'Torino', 'Bologna', 'Firenze', 'Napoli', 'Genova', 'Altro'
]

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

const defaultProperty: Omit<Property, 'id'> = {
  nome: '',
  tipo: 'residenziale',
  citta: 'Milano',
  valoreAcquisto: 150000,
  valoreCatastale: 50000,
  affittoMensile: 700,
  speseAnnue: 1500,
  mutuo: {
    attivo: false,
    residuo: 0,
    rata: 0,
    interessiAnnui: 0,
  },
  aliquotaIMU: 10.6, // aliquota standard
  contrattoAgevolato: false,
}

export default function OttimizzatorePortafoglio() {
  const [properties, setProperties] = useState<Property[]>([
    { ...defaultProperty, id: generateId(), nome: 'Appartamento 1' },
  ])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProperty, setNewProperty] = useState<Omit<Property, 'id'>>({ ...defaultProperty })
  const [scaglioneIRPEF, setScaglioneIRPEF] = useState(35) // aliquota marginale IRPEF
  const [regimeConsigliato, setRegimeConsigliato] = useState<RegimeFiscale>('cedolare')

  const analisi = useMemo(() => {
    const analisiPerImmobile = properties.map((prop) => {
      const affittoLordo = prop.affittoMensile * 12
      const redditoNettoPrimaTasse = affittoLordo - prop.speseAnnue

      // IMU calculation
      const baseIMU = prop.valoreCatastale * 1.05 * 1.6 // rivalutazione 5% + coefficiente 160
      const imu = (baseIMU * prop.aliquotaIMU) / 1000

      // Cedolare secca calculation
      const aliquotaCedolare = prop.contrattoAgevolato ? 0.10 : 0.21
      const tasseCedolare = affittoLordo * aliquotaCedolare
      const nettoPostCedolare = redditoNettoPrimaTasse - tasseCedolare - imu

      // IRPEF calculation (con deduzione 5% forfettaria per spese)
      const imponibileIRPEF = affittoLordo * 0.95
      const tasseIRPEF = imponibileIRPEF * (scaglioneIRPEF / 100)
      const addizionaliIRPEF = imponibileIRPEF * 0.03 // stima addizionali regionali/comunali
      const nettoPostIRPEF = redditoNettoPrimaTasse - tasseIRPEF - addizionaliIRPEF - imu

      // Con mutuo: interessi deducibili solo con IRPEF (19% fino a 4000 euro)
      let detrazioneInteressi = 0
      if (prop.mutuo.attivo && prop.tipo === 'residenziale') {
        const interessiDetraibili = Math.min(prop.mutuo.interessiAnnui, 4000)
        detrazioneInteressi = interessiDetraibili * 0.19
      }
      const nettoPostIRPEFConDetrazione = nettoPostIRPEF + detrazioneInteressi

      // Rendimento
      const rendimentoLordoPercent = (affittoLordo / prop.valoreAcquisto) * 100
      const rendimentoNettoCedolare = (nettoPostCedolare / prop.valoreAcquisto) * 100
      const rendimentoNettoIRPEF = (nettoPostIRPEFConDetrazione / prop.valoreAcquisto) * 100

      // Best regime
      const migliorRegime = nettoPostCedolare >= nettoPostIRPEFConDetrazione ? 'cedolare' : 'irpef'

      return {
        property: prop,
        affittoLordo,
        redditoNettoPrimaTasse,
        imu,
        cedolare: {
          aliquota: aliquotaCedolare * 100,
          tasse: tasseCedolare,
          netto: nettoPostCedolare,
          rendimento: rendimentoNettoCedolare,
        },
        irpef: {
          tasse: tasseIRPEF + addizionaliIRPEF,
          detrazioneInteressi,
          netto: nettoPostIRPEFConDetrazione,
          rendimento: rendimentoNettoIRPEF,
        },
        rendimentoLordo: rendimentoLordoPercent,
        migliorRegime,
        migliorNetto: Math.max(nettoPostCedolare, nettoPostIRPEFConDetrazione),
        migliorRendimento: Math.max(rendimentoNettoCedolare, rendimentoNettoIRPEF),
      }
    })

    // Portfolio totals
    const totaleValore = properties.reduce((acc, p) => acc + p.valoreAcquisto, 0)
    const totaleAffittiLordi = analisiPerImmobile.reduce((acc, a) => acc + a.affittoLordo, 0)
    const totaleIMU = analisiPerImmobile.reduce((acc, a) => acc + a.imu, 0)
    const totaleSpeseAnnue = properties.reduce((acc, p) => acc + p.speseAnnue, 0)
    const totaleMutuoResiduo = properties.reduce((acc, p) => acc + (p.mutuo.attivo ? p.mutuo.residuo : 0), 0)

    // Total with optimal regime per property
    const totaleNettoOttimale = analisiPerImmobile.reduce((acc, a) => acc + a.migliorNetto, 0)
    const rendimentoMedioOttimale = totaleValore > 0 ? (totaleNettoOttimale / totaleValore) * 100 : 0

    // Total if all cedolare
    const totaleNettoCedolare = analisiPerImmobile.reduce((acc, a) => acc + a.cedolare.netto, 0)

    // Total if all IRPEF
    const totaleNettoIRPEF = analisiPerImmobile.reduce((acc, a) => acc + a.irpef.netto, 0)

    // Societa semplice calculation (for 4+ properties)
    // IRES 24% + IRAP ~3.9% on rental income, but different deductions
    const baseSocieta = totaleAffittiLordi - totaleSpeseAnnue - totaleIMU
    const tasseSocieta = baseSocieta > 0 ? baseSocieta * 0.279 : 0 // IRES + IRAP
    const nettoSocieta = baseSocieta - tasseSocieta

    // Diversification analysis
    const tipiDistribuzione = properties.reduce((acc, p) => {
      acc[p.tipo] = (acc[p.tipo] || 0) + p.valoreAcquisto
      return acc
    }, {} as Record<string, number>)

    const cittaDistribuzione = properties.reduce((acc, p) => {
      acc[p.citta] = (acc[p.citta] || 0) + p.valoreAcquisto
      return acc
    }, {} as Record<string, number>)

    // Worst performers (rendimento sotto 3%)
    const worstPerformers = analisiPerImmobile
      .filter(a => a.migliorRendimento < 3)
      .sort((a, b) => a.migliorRendimento - b.migliorRendimento)

    // Best performers
    const bestPerformers = [...analisiPerImmobile]
      .sort((a, b) => b.migliorRendimento - a.migliorRendimento)
      .slice(0, 3)

    // Leverage ratio
    const leverageRatio = totaleValore > 0 ? (totaleMutuoResiduo / totaleValore) * 100 : 0

    // Recommended regime
    let raccomandazione: RegimeFiscale = 'cedolare'
    let motivazione = ''

    if (properties.length >= 4 && nettoSocieta > totaleNettoOttimale * 1.1) {
      raccomandazione = 'societa'
      motivazione = 'Con 4+ immobili, la societa semplice potrebbe offrire vantaggi fiscali e di gestione.'
    } else if (totaleNettoIRPEF > totaleNettoCedolare && totaleMutuoResiduo > 0) {
      raccomandazione = 'irpef'
      motivazione = 'IRPEF conviene grazie alla detrazione degli interessi passivi del mutuo.'
    } else {
      raccomandazione = 'cedolare'
      motivazione = 'La cedolare secca offre tassazione fissa e nessun aumento ISTAT.'
    }

    return {
      perImmobile: analisiPerImmobile,
      totali: {
        valore: totaleValore,
        affittiLordi: totaleAffittiLordi,
        imu: totaleIMU,
        speseAnnue: totaleSpeseAnnue,
        mutuoResiduo: totaleMutuoResiduo,
        nettoOttimale: totaleNettoOttimale,
        nettoCedolare: totaleNettoCedolare,
        nettoIRPEF: totaleNettoIRPEF,
        nettoSocieta,
        rendimentoMedio: rendimentoMedioOttimale,
      },
      diversificazione: {
        tipi: tipiDistribuzione,
        citta: cittaDistribuzione,
      },
      worstPerformers,
      bestPerformers,
      leverage: leverageRatio,
      raccomandazione: {
        regime: raccomandazione,
        motivazione,
      },
    }
  }, [properties, scaglioneIRPEF])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  const addProperty = () => {
    if (!newProperty.nome) {
      setNewProperty({ ...newProperty, nome: `Immobile ${properties.length + 1}` })
    }
    setProperties([
      ...properties,
      { ...newProperty, id: generateId(), nome: newProperty.nome || `Immobile ${properties.length + 1}` },
    ])
    setNewProperty({ ...defaultProperty })
    setShowAddForm(false)
  }

  const removeProperty = (id: string) => {
    setProperties(properties.filter((p) => p.id !== id))
  }

  const updateProperty = (id: string, updates: Partial<Property>) => {
    setProperties(
      properties.map((p) => (p.id === id ? { ...p, ...updates } : p))
    )
  }

  return (
    <main>
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
            Ottimizzatore Portafoglio Immobiliare
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Analizza il tuo portafoglio immobiliare, ottimizza la fiscalita e identifica gli immobili da valorizzare o cedere.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          {/* Portfolio Summary Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-green-600 rounded-card p-5 text-white">
              <p className="text-green-100 text-sm mb-1">Valore Portafoglio</p>
              <p className="font-heading text-2xl">{formatCurrency(analisi.totali.valore)}</p>
              <p className="text-green-200 text-xs mt-1">{properties.length} immobili</p>
            </div>
            <div className="bg-white rounded-card p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Reddito Netto Annuo</p>
              <p className="font-heading text-2xl text-green-600">{formatCurrency(analisi.totali.nettoOttimale)}</p>
              <p className="text-gray-400 text-xs mt-1">Regime ottimale</p>
            </div>
            <div className="bg-white rounded-card p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Rendimento Medio</p>
              <p className="font-heading text-2xl text-forest">{formatPercent(analisi.totali.rendimentoMedio)}</p>
              <p className="text-gray-400 text-xs mt-1">Netto da tasse</p>
            </div>
            <div className="bg-white rounded-card p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Leverage</p>
              <p className="font-heading text-2xl text-forest">{formatPercent(analisi.leverage)}</p>
              <p className="text-gray-400 text-xs mt-1">Mutui / Valore</p>
            </div>
          </div>

          {/* Tax Comparison */}
          <div className="bg-white rounded-card p-6 shadow-sm mb-8">
            <h2 className="font-heading text-xl text-forest mb-4">Confronto Regimi Fiscali</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Il tuo scaglione IRPEF marginale: {scaglioneIRPEF}%
              </label>
              <input
                type="range"
                min="23"
                max="43"
                step="1"
                value={scaglioneIRPEF}
                onChange={(e) => setScaglioneIRPEF(Number(e.target.value))}
                className="w-full max-w-md h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
              />
              <div className="flex justify-between max-w-md text-xs text-gray-400 mt-1">
                <span>23% (fino 28k)</span>
                <span>35% (28-50k)</span>
                <span>43% (oltre 50k)</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-6">
              <div className={`rounded-lg p-4 border-2 ${analisi.raccomandazione.regime === 'cedolare' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-forest">Cedolare Secca</h3>
                  {analisi.raccomandazione.regime === 'cedolare' && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Consigliato</span>
                  )}
                </div>
                <p className="text-2xl font-heading text-forest">{formatCurrency(analisi.totali.nettoCedolare)}</p>
                <p className="text-sm text-gray-500 mt-1">Netto annuo totale</p>
                <p className="text-xs text-gray-400 mt-2">21% (o 10% canone concordato)</p>
              </div>

              <div className={`rounded-lg p-4 border-2 ${analisi.raccomandazione.regime === 'irpef' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-forest">IRPEF Ordinaria</h3>
                  {analisi.raccomandazione.regime === 'irpef' && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Consigliato</span>
                  )}
                </div>
                <p className="text-2xl font-heading text-forest">{formatCurrency(analisi.totali.nettoIRPEF)}</p>
                <p className="text-sm text-gray-500 mt-1">Netto annuo totale</p>
                <p className="text-xs text-gray-400 mt-2">Aliquota marginale {scaglioneIRPEF}%</p>
              </div>

              <div className={`rounded-lg p-4 border-2 ${analisi.raccomandazione.regime === 'societa' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-forest">Societa Semplice</h3>
                  {analisi.raccomandazione.regime === 'societa' && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Consigliato</span>
                  )}
                </div>
                <p className="text-2xl font-heading text-forest">{formatCurrency(analisi.totali.nettoSocieta)}</p>
                <p className="text-sm text-gray-500 mt-1">Netto annuo totale</p>
                <p className="text-xs text-gray-400 mt-2">IRES 24% + IRAP 3.9%</p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-800">
                <strong>Raccomandazione:</strong> {analisi.raccomandazione.motivazione}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Properties List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading text-xl text-forest">I Tuoi Immobili</h2>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="btn-primary text-sm py-2 px-4"
                >
                  + Aggiungi Immobile
                </button>
              </div>

              {/* Add Property Form */}
              {showAddForm && (
                <div className="bg-white rounded-card p-6 shadow-sm border-2 border-green-500">
                  <h3 className="font-heading text-lg text-forest mb-4">Nuovo Immobile</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                      <input
                        type="text"
                        value={newProperty.nome}
                        onChange={(e) => setNewProperty({ ...newProperty, nome: e.target.value })}
                        placeholder="Es: Bilocale Via Roma"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                      <select
                        value={newProperty.tipo}
                        onChange={(e) => setNewProperty({ ...newProperty, tipo: e.target.value as Property['tipo'] })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {tipiImmobile.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Citta</label>
                      <select
                        value={newProperty.citta}
                        onChange={(e) => setNewProperty({ ...newProperty, citta: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {cittaEsempio.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Valore di acquisto</label>
                      <input
                        type="number"
                        value={newProperty.valoreAcquisto}
                        onChange={(e) => setNewProperty({ ...newProperty, valoreAcquisto: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rendita catastale</label>
                      <input
                        type="number"
                        value={newProperty.valoreCatastale}
                        onChange={(e) => setNewProperty({ ...newProperty, valoreCatastale: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Affitto mensile</label>
                      <input
                        type="number"
                        value={newProperty.affittoMensile}
                        onChange={(e) => setNewProperty({ ...newProperty, affittoMensile: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Spese annue</label>
                      <input
                        type="number"
                        value={newProperty.speseAnnue}
                        onChange={(e) => setNewProperty({ ...newProperty, speseAnnue: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Aliquota IMU (per mille)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newProperty.aliquotaIMU}
                        onChange={(e) => setNewProperty({ ...newProperty, aliquotaIMU: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProperty.contrattoAgevolato}
                          onChange={(e) => setNewProperty({ ...newProperty, contrattoAgevolato: e.target.checked })}
                          className="mr-2 accent-green-600"
                        />
                        <span className="text-sm text-gray-700">Canone concordato (10%)</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newProperty.mutuo.attivo}
                          onChange={(e) => setNewProperty({
                            ...newProperty,
                            mutuo: { ...newProperty.mutuo, attivo: e.target.checked }
                          })}
                          className="mr-2 accent-green-600"
                        />
                        <span className="text-sm text-gray-700">Ha mutuo attivo</span>
                      </label>
                    </div>
                    {newProperty.mutuo.attivo && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Debito residuo</label>
                          <input
                            type="number"
                            value={newProperty.mutuo.residuo}
                            onChange={(e) => setNewProperty({
                              ...newProperty,
                              mutuo: { ...newProperty.mutuo, residuo: Number(e.target.value) }
                            })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Interessi annui</label>
                          <input
                            type="number"
                            value={newProperty.mutuo.interessiAnnui}
                            onChange={(e) => setNewProperty({
                              ...newProperty,
                              mutuo: { ...newProperty.mutuo, interessiAnnui: Number(e.target.value) }
                            })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex justify-end space-x-3 mt-4">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Annulla
                    </button>
                    <button
                      onClick={addProperty}
                      className="btn-primary text-sm py-2 px-4"
                    >
                      Aggiungi
                    </button>
                  </div>
                </div>
              )}

              {/* Property Cards */}
              {analisi.perImmobile.map((item) => (
                <div key={item.property.id} className="bg-white rounded-card p-5 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-heading text-lg text-forest">{item.property.nome}</h3>
                      <p className="text-sm text-gray-500">
                        {tipiImmobile.find(t => t.value === item.property.tipo)?.label} - {item.property.citta}
                      </p>
                    </div>
                    <button
                      onClick={() => removeProperty(item.property.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Valore</p>
                      <p className="font-medium">{formatCurrency(item.property.valoreAcquisto)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Affitto/anno</p>
                      <p className="font-medium">{formatCurrency(item.affittoLordo)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">IMU annua</p>
                      <p className="font-medium text-red-600">-{formatCurrency(item.imu)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Rendimento lordo</p>
                      <p className="font-medium">{formatPercent(item.rendimentoLordo)}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                    <div className={`p-3 rounded-lg ${item.migliorRegime === 'cedolare' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">Cedolare {item.cedolare.aliquota}%</p>
                        {item.migliorRegime === 'cedolare' && (
                          <span className="text-xs text-green-600 font-medium">Migliore</span>
                        )}
                      </div>
                      <p className="font-medium text-forest">{formatCurrency(item.cedolare.netto)}</p>
                      <p className="text-xs text-gray-400">Rend. {formatPercent(item.cedolare.rendimento)}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${item.migliorRegime === 'irpef' ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-500">IRPEF {scaglioneIRPEF}%</p>
                        {item.migliorRegime === 'irpef' && (
                          <span className="text-xs text-green-600 font-medium">Migliore</span>
                        )}
                      </div>
                      <p className="font-medium text-forest">{formatCurrency(item.irpef.netto)}</p>
                      <p className="text-xs text-gray-400">Rend. {formatPercent(item.irpef.rendimento)}</p>
                    </div>
                  </div>

                  {item.property.mutuo.attivo && item.irpef.detrazioneInteressi > 0 && (
                    <div className="mt-2 text-xs text-forest">
                      Include detrazione interessi mutuo: {formatCurrency(item.irpef.detrazioneInteressi)}
                    </div>
                  )}

                  {item.migliorRendimento < 3 && (
                    <div className="mt-3 p-2 bg-amber-50 rounded-lg">
                      <p className="text-xs text-amber-700">
                        <strong>Attenzione:</strong> Rendimento sotto il 3%. Valuta se cedere questo immobile per reinvestire.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Analysis Sidebar */}
            <div className="space-y-6">
              {/* Worst Performers */}
              {analisi.worstPerformers.length > 0 && (
                <div className="bg-amber-50 rounded-card p-5 border border-amber-200">
                  <h3 className="font-heading text-lg text-amber-800 mb-3">Candidati alla Cessione</h3>
                  <p className="text-sm text-amber-700 mb-3">
                    Immobili con rendimento inferiore al 3% netto:
                  </p>
                  <ul className="space-y-2">
                    {analisi.worstPerformers.map((item) => (
                      <li key={item.property.id} className="text-sm">
                        <span className="font-medium text-amber-800">{item.property.nome}</span>
                        <span className="text-amber-600 ml-2">({formatPercent(item.migliorRendimento)})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Best Performers */}
              <div className="bg-green-50 rounded-card p-5 border border-green-200">
                <h3 className="font-heading text-lg text-green-800 mb-3">Top Performer</h3>
                <ul className="space-y-2">
                  {analisi.bestPerformers.map((item, idx) => (
                    <li key={item.property.id} className="text-sm flex items-center">
                      <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center mr-2">
                        {idx + 1}
                      </span>
                      <span className="font-medium text-green-800">{item.property.nome}</span>
                      <span className="text-green-600 ml-auto">{formatPercent(item.migliorRendimento)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Diversification */}
              <div className="bg-white rounded-card p-5 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-3">Diversificazione</h3>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Per tipologia:</p>
                  <div className="space-y-2">
                    {Object.entries(analisi.diversificazione.tipi).map(([tipo, valore]) => (
                      <div key={tipo} className="flex items-center">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600 capitalize">{tipo}</span>
                            <span className="font-medium">{((valore / analisi.totali.valore) * 100).toFixed(0)}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${(valore / analisi.totali.valore) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-2">Per citta:</p>
                  <div className="space-y-2">
                    {Object.entries(analisi.diversificazione.citta).map(([citta, valore]) => (
                      <div key={citta} className="flex items-center">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-600">{citta}</span>
                            <span className="font-medium">{((valore / analisi.totali.valore) * 100).toFixed(0)}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gray-500 rounded-full"
                              style={{ width: `${(valore / analisi.totali.valore) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {Object.keys(analisi.diversificazione.citta).length === 1 && (
                  <div className="mt-3 p-2 bg-amber-50 rounded-lg">
                    <p className="text-xs text-amber-700">
                      Tutti gli immobili sono nella stessa citta. Considera di diversificare geograficamente.
                    </p>
                  </div>
                )}
              </div>

              {/* IMU Summary */}
              <div className="bg-white rounded-card p-5 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-3">Riepilogo Costi Fissi</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">IMU totale annua</span>
                    <span className="font-medium text-red-600">-{formatCurrency(analisi.totali.imu)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Altre spese annue</span>
                    <span className="font-medium text-red-600">-{formatCurrency(analisi.totali.speseAnnue)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <span className="text-gray-600">Totale costi fissi</span>
                    <span className="font-medium text-red-600">-{formatCurrency(analisi.totali.imu + analisi.totali.speseAnnue)}</span>
                  </div>
                </div>
              </div>

              {/* Leverage Analysis */}
              {analisi.totali.mutuoResiduo > 0 && (
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <h3 className="font-heading text-lg text-forest mb-3">Analisi Leva Finanziaria</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Debito totale</span>
                      <span className="font-medium">{formatCurrency(analisi.totali.mutuoResiduo)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valore portafoglio</span>
                      <span className="font-medium">{formatCurrency(analisi.totali.valore)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Equity</span>
                      <span className="font-medium text-green-600">{formatCurrency(analisi.totali.valore - analisi.totali.mutuoResiduo)}</span>
                    </div>
                    <hr />
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loan-to-Value</span>
                      <span className={`font-medium ${analisi.leverage > 70 ? 'text-red-600' : analisi.leverage > 50 ? 'text-amber-600' : 'text-green-600'}`}>
                        {formatPercent(analisi.leverage)}
                      </span>
                    </div>
                  </div>
                  {analisi.leverage > 70 && (
                    <div className="mt-3 p-2 bg-red-50 rounded-lg">
                      <p className="text-xs text-red-700">
                        Leva elevata. In caso di calo dei valori immobiliari, potresti trovarti in difficolta.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Societa Semplice Info */}
              {properties.length >= 3 && (
                <div className="bg-gray-50 rounded-card p-5 border border-gray-200">
                  <h3 className="font-heading text-lg text-gray-800 mb-3">Societa Semplice</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Con {properties.length} immobili, potrebbe convenire intestarli a una Societa Semplice:
                  </p>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>- Protezione patrimoniale</li>
                    <li>- Passaggio generazionale agevolato</li>
                    <li>- Gestione semplificata</li>
                    <li>- Possibile ottimizzazione fiscale</li>
                  </ul>
                  <p className="text-xs text-forest mt-3">
                    Netto stimato con SS: {formatCurrency(analisi.totali.nettoSocieta)}/anno
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom pb-8">
        <RatingWidget toolSlug="portafoglio-immobiliare" toolName="portafoglio-immobiliare" />
      </div>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Ottimizza il tuo portafoglio immobiliare
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente patrimoniale indipendente puo aiutarti a strutturare
            al meglio i tuoi investimenti immobiliari e scegliere il regime fiscale ottimale.
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
