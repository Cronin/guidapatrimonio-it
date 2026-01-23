'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer } from '@/components'

// Tipi di asset secondo normativa italiana
type TipoAsset = 'azioni' | 'etf' | 'etc' | 'obbligazioni' | 'certificati'

interface Minusvalenza {
  id: string
  importo: number
  dataRealizzazione: string
  tipo: TipoAsset
  descrizione?: string
}

interface Plusvalenza {
  id: string
  importo: number
  tipo: TipoAsset
  descrizione?: string
}

// Categorie fiscali: "redditi diversi" vs "redditi capitale"
const REDDITI_DIVERSI: TipoAsset[] = ['azioni', 'etc', 'certificati']
const REDDITI_CAPITALE: TipoAsset[] = ['etf', 'obbligazioni']

const ALIQUOTA_CAPITAL_GAIN = 0.26 // 26%
const ANNI_SCADENZA = 4

const TIPO_ASSET_LABELS: Record<TipoAsset, string> = {
  azioni: 'Azioni',
  etf: 'ETF',
  etc: 'ETC',
  obbligazioni: 'Obbligazioni',
  certificati: 'Certificati',
}

export default function CalcolatoreMinusvalenze() {
  const oggi = new Date()
  const annoCorrente = oggi.getFullYear()

  // Minusvalenze nello zainetto fiscale
  const [minusvalenze, setMinusvalenze] = useState<Minusvalenza[]>([
    {
      id: '1',
      importo: 5000,
      dataRealizzazione: `${annoCorrente - 3}-06-15`,
      tipo: 'etf',
      descrizione: 'ETF MSCI World venduto in perdita',
    },
    {
      id: '2',
      importo: 2000,
      dataRealizzazione: `${annoCorrente - 1}-03-20`,
      tipo: 'azioni',
      descrizione: 'Azioni tech vendute',
    },
    {
      id: '3',
      importo: 1500,
      dataRealizzazione: `${annoCorrente}-01-10`,
      tipo: 'etc',
      descrizione: 'ETC oro',
    },
  ])

  // Plusvalenze da compensare
  const [plusvalenze, setPlusvalenze] = useState<Plusvalenza[]>([
    {
      id: '1',
      importo: 8000,
      tipo: 'azioni',
      descrizione: 'Vendita azioni in profitto',
    },
  ])

  // Form per nuova minusvalenza
  const [nuovaMinusvalenza, setNuovaMinusvalenza] = useState({
    importo: '',
    dataRealizzazione: '',
    tipo: 'azioni' as TipoAsset,
    descrizione: '',
  })

  // Form per nuova plusvalenza
  const [nuovaPlusvalenza, setNuovaPlusvalenza] = useState({
    importo: '',
    tipo: 'azioni' as TipoAsset,
    descrizione: '',
  })

  // Calcoli
  const risultati = useMemo(() => {
    // Data limite per scadenza (4 anni fa)
    const dataLimiteScadenza = new Date(oggi)
    dataLimiteScadenza.setFullYear(dataLimiteScadenza.getFullYear() - ANNI_SCADENZA)

    // Filtra minusvalenze ancora valide (non scadute)
    const minusvalenzeValide = minusvalenze.filter((m) => {
      const dataReal = new Date(m.dataRealizzazione)
      return dataReal > dataLimiteScadenza
    })

    // Ordina per scadenza (FIFO - prima quelle piu vecchie)
    const minusvalenzeOrdinate = [...minusvalenzeValide].sort((a, b) => {
      return new Date(a.dataRealizzazione).getTime() - new Date(b.dataRealizzazione).getTime()
    })

    // Calcola scadenza per ogni minusvalenza
    const minusvalenzeConScadenza = minusvalenzeOrdinate.map((m) => {
      const dataReal = new Date(m.dataRealizzazione)
      const dataScadenza = new Date(dataReal)
      dataScadenza.setFullYear(dataScadenza.getFullYear() + ANNI_SCADENZA)
      // Scadenza a fine anno
      dataScadenza.setMonth(11)
      dataScadenza.setDate(31)

      const giorniAllaScadenza = Math.ceil(
        (dataScadenza.getTime() - oggi.getTime()) / (1000 * 60 * 60 * 24)
      )
      const mesiAllaScadenza = Math.ceil(giorniAllaScadenza / 30)

      return {
        ...m,
        dataScadenza,
        giorniAllaScadenza,
        mesiAllaScadenza,
        inScadenza6Mesi: mesiAllaScadenza <= 6 && mesiAllaScadenza > 0,
        inScadenza12Mesi: mesiAllaScadenza <= 12 && mesiAllaScadenza > 0,
      }
    })

    // Separa minusvalenze per categoria fiscale
    // Minusvalenze da ETF/obbligazioni (redditi capitale) compensano SOLO redditi diversi
    // Minusvalenze da azioni/ETC/certificati (redditi diversi) compensano ENTRAMBI
    const minusvalenzeRedditiCapitale = minusvalenzeConScadenza.filter((m) =>
      REDDITI_CAPITALE.includes(m.tipo)
    )
    const minusvalenzeRedditiDiversi = minusvalenzeConScadenza.filter((m) =>
      REDDITI_DIVERSI.includes(m.tipo)
    )

    // Totali
    const totaleMinusvalenze = minusvalenzeConScadenza.reduce((sum, m) => sum + m.importo, 0)
    const totaleMinusvalenzeRedditiCapitale = minusvalenzeRedditiCapitale.reduce(
      (sum, m) => sum + m.importo,
      0
    )
    const totaleMinusvalenzeRedditiDiversi = minusvalenzeRedditiDiversi.reduce(
      (sum, m) => sum + m.importo,
      0
    )

    // Minusvalenze in scadenza
    const minusvalenzeInScadenza6Mesi = minusvalenzeConScadenza.filter((m) => m.inScadenza6Mesi)
    const totaleInScadenza6Mesi = minusvalenzeInScadenza6Mesi.reduce((sum, m) => sum + m.importo, 0)

    const minusvalenzeInScadenza12Mesi = minusvalenzeConScadenza.filter((m) => m.inScadenza12Mesi)
    const totaleInScadenza12Mesi = minusvalenzeInScadenza12Mesi.reduce(
      (sum, m) => sum + m.importo,
      0
    )

    // Plusvalenze per categoria
    const plusvalenzeRedditiDiversi = plusvalenze.filter((p) => REDDITI_DIVERSI.includes(p.tipo))
    const plusvalenzeRedditiCapitale = plusvalenze.filter((p) => REDDITI_CAPITALE.includes(p.tipo))

    const totalePlusvalenzeRedditiDiversi = plusvalenzeRedditiDiversi.reduce(
      (sum, p) => sum + p.importo,
      0
    )
    const totalePlusvalenzeRedditiCapitale = plusvalenzeRedditiCapitale.reduce(
      (sum, p) => sum + p.importo,
      0
    )
    const totalePlusvalenze = totalePlusvalenzeRedditiDiversi + totalePlusvalenzeRedditiCapitale

    // Calcolo compensazione FIFO
    // 1. Minusvalenze da ETF/obbligazioni compensano SOLO plusvalenze redditi diversi (azioni, ETC, certificati)
    // 2. Minusvalenze da azioni/ETC/certificati compensano qualsiasi plusvalenza

    let minusvalenzeRedditiCapitaleRimanenti = totaleMinusvalenzeRedditiCapitale
    let minusvalenzeRedditiDiversiRimanenti = totaleMinusvalenzeRedditiDiversi

    let plusvalenzeRedditiDiversiRimanenti = totalePlusvalenzeRedditiDiversi
    let plusvalenzeRedditiCapitaleRimanenti = totalePlusvalenzeRedditiCapitale

    // Prima compensiamo le plusvalenze redditi diversi con le minusvalenze ETF (che POSSONO compensare solo queste)
    const compensazioneETFsuAzioni = Math.min(
      minusvalenzeRedditiCapitaleRimanenti,
      plusvalenzeRedditiDiversiRimanenti
    )
    minusvalenzeRedditiCapitaleRimanenti -= compensazioneETFsuAzioni
    plusvalenzeRedditiDiversiRimanenti -= compensazioneETFsuAzioni

    // Poi compensiamo le plusvalenze redditi diversi rimanenti con minusvalenze azioni
    const compensazioneAzioniSuAzioni = Math.min(
      minusvalenzeRedditiDiversiRimanenti,
      plusvalenzeRedditiDiversiRimanenti
    )
    minusvalenzeRedditiDiversiRimanenti -= compensazioneAzioniSuAzioni
    plusvalenzeRedditiDiversiRimanenti -= compensazioneAzioniSuAzioni

    // Infine compensiamo le plusvalenze redditi capitale (ETF) con minusvalenze azioni rimanenti
    const compensazioneAzioniSuETF = Math.min(
      minusvalenzeRedditiDiversiRimanenti,
      plusvalenzeRedditiCapitaleRimanenti
    )
    minusvalenzeRedditiDiversiRimanenti -= compensazioneAzioniSuETF
    plusvalenzeRedditiCapitaleRimanenti -= compensazioneAzioniSuETF

    const totaleCompensato = compensazioneETFsuAzioni + compensazioneAzioniSuAzioni + compensazioneAzioniSuETF
    const minusvalenzeRimanenti = minusvalenzeRedditiCapitaleRimanenti + minusvalenzeRedditiDiversiRimanenti
    const plusvalenzeNonCompensate = plusvalenzeRedditiDiversiRimanenti + plusvalenzeRedditiCapitaleRimanenti

    // Risparmio fiscale
    const risparmioFiscale = totaleCompensato * ALIQUOTA_CAPITAL_GAIN
    const tasseDaPagareSenzaCompensazione = totalePlusvalenze * ALIQUOTA_CAPITAL_GAIN
    const tasseDaPagareConCompensazione = plusvalenzeNonCompensate * ALIQUOTA_CAPITAL_GAIN

    // Risparmio potenziale se si realizzassero plusvalenze per usare minusvalenze in scadenza
    const risparmioPotenziale6Mesi = totaleInScadenza6Mesi * ALIQUOTA_CAPITAL_GAIN
    const risparmioPotenziale12Mesi = totaleInScadenza12Mesi * ALIQUOTA_CAPITAL_GAIN

    return {
      minusvalenzeConScadenza,
      totaleMinusvalenze,
      totaleMinusvalenzeRedditiCapitale,
      totaleMinusvalenzeRedditiDiversi,
      minusvalenzeInScadenza6Mesi,
      totaleInScadenza6Mesi,
      minusvalenzeInScadenza12Mesi,
      totaleInScadenza12Mesi,
      totalePlusvalenze,
      totalePlusvalenzeRedditiDiversi,
      totalePlusvalenzeRedditiCapitale,
      totaleCompensato,
      minusvalenzeRimanenti,
      plusvalenzeNonCompensate,
      risparmioFiscale,
      tasseDaPagareSenzaCompensazione,
      tasseDaPagareConCompensazione,
      risparmioPotenziale6Mesi,
      risparmioPotenziale12Mesi,
      compensazioneETFsuAzioni,
      compensazioneAzioniSuAzioni,
      compensazioneAzioniSuETF,
    }
  }, [minusvalenze, plusvalenze, oggi, annoCorrente])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const aggiungiMinusvalenza = () => {
    if (nuovaMinusvalenza.importo && nuovaMinusvalenza.dataRealizzazione) {
      setMinusvalenze([
        ...minusvalenze,
        {
          id: Date.now().toString(),
          importo: Number(nuovaMinusvalenza.importo),
          dataRealizzazione: nuovaMinusvalenza.dataRealizzazione,
          tipo: nuovaMinusvalenza.tipo,
          descrizione: nuovaMinusvalenza.descrizione || undefined,
        },
      ])
      setNuovaMinusvalenza({
        importo: '',
        dataRealizzazione: '',
        tipo: 'azioni',
        descrizione: '',
      })
    }
  }

  const rimuoviMinusvalenza = (id: string) => {
    setMinusvalenze(minusvalenze.filter((m) => m.id !== id))
  }

  const aggiungiPlusvalenza = () => {
    if (nuovaPlusvalenza.importo) {
      setPlusvalenze([
        ...plusvalenze,
        {
          id: Date.now().toString(),
          importo: Number(nuovaPlusvalenza.importo),
          tipo: nuovaPlusvalenza.tipo,
          descrizione: nuovaPlusvalenza.descrizione || undefined,
        },
      ])
      setNuovaPlusvalenza({
        importo: '',
        tipo: 'azioni',
        descrizione: '',
      })
    }
  }

  const rimuoviPlusvalenza = (id: string) => {
    setPlusvalenze(plusvalenze.filter((p) => p.id !== id))
  }

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#1B4D3E] pt-navbar">
        <div className="container-custom py-12">
          <Link
            href="/strumenti"
            className="inline-flex items-center text-green-300 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tutti gli strumenti
          </Link>
          <h1 className="font-heading text-[32px] md:text-[42px] text-white leading-tight">
            Calcolatore Minusvalenze e Zainetto Fiscale
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Gestisci le tue minusvalenze, controlla le scadenze e calcola le compensazioni secondo le
            regole fiscali italiane. Non perdere il tuo credito fiscale!
          </p>
        </div>
      </section>

      <section className="section-md bg-[#fcfcfa]">
        <div className="container-custom">
          {/* Alert minusvalenze in scadenza */}
          {risultati.totaleInScadenza6Mesi > 0 && (
            <div className="bg-red-100 border-2 border-red-400 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg
                  className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <p className="text-red-800 font-bold text-lg">
                    ATTENZIONE: {formatCurrency(risultati.totaleInScadenza6Mesi)} in scadenza entro 6
                    mesi!
                  </p>
                  <p className="text-red-700 text-sm mt-1">
                    Considera di realizzare plusvalenze per non perdere{' '}
                    <strong>{formatCurrency(risultati.risparmioPotenziale6Mesi)}</strong> di risparmio
                    fiscale potenziale.
                  </p>
                  {risultati.minusvalenzeInScadenza6Mesi.map((m) => (
                    <p key={m.id} className="text-red-600 text-xs mt-1">
                      - {formatCurrency(m.importo)} ({TIPO_ASSET_LABELS[m.tipo]}) scade il{' '}
                      {m.dataScadenza.toLocaleDateString('it-IT')}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Riepilogo principale */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#2D6A4F] rounded-lg p-6 text-white">
              <p className="text-white/80 text-sm mb-1">Minusvalenze Disponibili</p>
              <p className="font-heading text-3xl">{formatCurrency(risultati.totaleMinusvalenze)}</p>
              <p className="text-white/60 text-xs mt-1">Totale zainetto fiscale</p>
            </div>
            <div className="bg-[#1B4D3E] rounded-lg p-6 text-white">
              <p className="text-white/80 text-sm mb-1">Compensazione Possibile</p>
              <p className="font-heading text-3xl">{formatCurrency(risultati.totaleCompensato)}</p>
              <p className="text-white/60 text-xs mt-1">Su plusvalenze inserite</p>
            </div>
            <div className="bg-green-600 rounded-lg p-6 text-white">
              <p className="text-white/80 text-sm mb-1">Risparmio Fiscale</p>
              <p className="font-heading text-3xl">{formatCurrency(risultati.risparmioFiscale)}</p>
              <p className="text-white/60 text-xs mt-1">26% delle compensazioni</p>
            </div>
            <div className="bg-amber-600 rounded-lg p-6 text-white">
              <p className="text-white/80 text-sm mb-1">In Scadenza (12 mesi)</p>
              <p className="font-heading text-3xl">{formatCurrency(risultati.totaleInScadenza12Mesi)}</p>
              <p className="text-white/60 text-xs mt-1">
                Risparmio potenziale: {formatCurrency(risultati.risparmioPotenziale12Mesi)}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Zainetto Fiscale - Minusvalenze */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="font-heading text-xl text-[#1B4D3E]">Zainetto Fiscale</h2>
                  <p className="text-xs text-gray-500">
                    Le tue minusvalenze (ordinate per scadenza - FIFO)
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {risultati.minusvalenzeConScadenza.length === 0 ? (
                  <p className="text-gray-400 text-sm p-3">Nessuna minusvalenza inserita</p>
                ) : (
                  risultati.minusvalenzeConScadenza.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        m.inScadenza6Mesi
                          ? 'bg-red-50 border-red-500'
                          : m.inScadenza12Mesi
                          ? 'bg-amber-50 border-amber-500'
                          : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-red-600">
                              {formatCurrency(m.importo)}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                REDDITI_CAPITALE.includes(m.tipo)
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {TIPO_ASSET_LABELS[m.tipo]}
                            </span>
                            {m.inScadenza6Mesi && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">
                                SCADE PRESTO!
                              </span>
                            )}
                          </div>
                          {m.descrizione && (
                            <p className="text-xs text-gray-500 mt-1">{m.descrizione}</p>
                          )}
                          <div className="flex gap-4 mt-1 text-xs text-gray-400">
                            <span>Realizzata: {formatDate(m.dataRealizzazione)}</span>
                            <span>
                              Scade: {m.dataScadenza.toLocaleDateString('it-IT')} (
                              {m.mesiAllaScadenza} mesi)
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={() => rimuoviMinusvalenza(m.id)}
                          className="text-gray-400 hover:text-red-500 ml-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Form aggiungi minusvalenza */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Aggiungi minusvalenza</p>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        EUR
                      </span>
                      <input
                        type="number"
                        placeholder="Importo"
                        value={nuovaMinusvalenza.importo}
                        onChange={(e) =>
                          setNuovaMinusvalenza({ ...nuovaMinusvalenza, importo: e.target.value })
                        }
                        className="w-full pl-12 pr-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <input
                      type="date"
                      value={nuovaMinusvalenza.dataRealizzazione}
                      onChange={(e) =>
                        setNuovaMinusvalenza({
                          ...nuovaMinusvalenza,
                          dataRealizzazione: e.target.value,
                        })
                      }
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={nuovaMinusvalenza.tipo}
                      onChange={(e) =>
                        setNuovaMinusvalenza({
                          ...nuovaMinusvalenza,
                          tipo: e.target.value as TipoAsset,
                        })
                      }
                      className="px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="azioni">Azioni</option>
                      <option value="etf">ETF</option>
                      <option value="etc">ETC</option>
                      <option value="obbligazioni">Obbligazioni</option>
                      <option value="certificati">Certificati</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Descrizione (opzionale)"
                      value={nuovaMinusvalenza.descrizione}
                      onChange={(e) =>
                        setNuovaMinusvalenza({ ...nuovaMinusvalenza, descrizione: e.target.value })
                      }
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <button
                    onClick={aggiungiMinusvalenza}
                    className="w-full px-4 py-2 bg-[#1B4D3E] text-white rounded-lg text-sm hover:bg-[#2D6A4F]"
                  >
                    Aggiungi Minusvalenza
                  </button>
                </div>
              </div>
            </div>

            {/* Plusvalenze da compensare */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="font-heading text-xl text-[#1B4D3E]">Plusvalenze da Compensare</h2>
                  <p className="text-xs text-gray-500">Inserisci i guadagni realizzati</p>
                </div>
              </div>

              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                {plusvalenze.length === 0 ? (
                  <p className="text-gray-400 text-sm p-3">Nessuna plusvalenza inserita</p>
                ) : (
                  plusvalenze.map((p) => (
                    <div key={p.id} className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-green-600">
                              +{formatCurrency(p.importo)}
                            </span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full ${
                                REDDITI_CAPITALE.includes(p.tipo)
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {TIPO_ASSET_LABELS[p.tipo]}
                            </span>
                          </div>
                          {p.descrizione && (
                            <p className="text-xs text-gray-500 mt-1">{p.descrizione}</p>
                          )}
                        </div>
                        <button
                          onClick={() => rimuoviPlusvalenza(p.id)}
                          className="text-gray-400 hover:text-red-500 ml-2"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Form aggiungi plusvalenza */}
              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Aggiungi plusvalenza</p>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                        EUR
                      </span>
                      <input
                        type="number"
                        placeholder="Importo"
                        value={nuovaPlusvalenza.importo}
                        onChange={(e) =>
                          setNuovaPlusvalenza({ ...nuovaPlusvalenza, importo: e.target.value })
                        }
                        className="w-full pl-12 pr-3 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <select
                      value={nuovaPlusvalenza.tipo}
                      onChange={(e) =>
                        setNuovaPlusvalenza({
                          ...nuovaPlusvalenza,
                          tipo: e.target.value as TipoAsset,
                        })
                      }
                      className="px-3 py-2 border rounded-lg text-sm"
                    >
                      <option value="azioni">Azioni</option>
                      <option value="etf">ETF</option>
                      <option value="etc">ETC</option>
                      <option value="obbligazioni">Obbligazioni</option>
                      <option value="certificati">Certificati</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Descrizione (opzionale)"
                    value={nuovaPlusvalenza.descrizione}
                    onChange={(e) =>
                      setNuovaPlusvalenza({ ...nuovaPlusvalenza, descrizione: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <button
                    onClick={aggiungiPlusvalenza}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                  >
                    Aggiungi Plusvalenza
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dettaglio compensazione */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-heading text-lg text-[#1B4D3E] mb-4">Senza Compensazione</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Plusvalenze totali</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(risultati.totalePlusvalenze)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-sm font-medium">Tasse da pagare (26%)</span>
                  <span className="font-heading text-xl text-red-600">
                    {formatCurrency(risultati.tasseDaPagareSenzaCompensazione)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border-2 border-green-500">
              <h3 className="font-heading text-lg text-[#1B4D3E] mb-4">Con Compensazione</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Plusvalenze totali</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(risultati.totalePlusvalenze)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Minusvalenze compensate</span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(risultati.totaleCompensato)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Imponibile netto</span>
                  <span className="font-medium">
                    {formatCurrency(risultati.plusvalenzeNonCompensate)}
                  </span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-sm font-medium">Tasse da pagare (26%)</span>
                  <span className="font-heading text-xl text-green-600">
                    {formatCurrency(risultati.tasseDaPagareConCompensazione)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#2D6A4F] rounded-lg p-6 text-white">
              <h3 className="font-heading text-lg mb-4">Il Tuo Risparmio</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-white/70 text-sm">Risparmio fiscale</p>
                  <p className="font-heading text-4xl">{formatCurrency(risultati.risparmioFiscale)}</p>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <p className="text-white/70 text-sm">Minusvalenze rimanenti</p>
                  <p className="font-medium">{formatCurrency(risultati.minusvalenzeRimanenti)}</p>
                  <p className="text-white/60 text-xs mt-1">
                    Utilizzabili per future plusvalenze
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Dettaglio compensazioni per tipo */}
          {risultati.totaleCompensato > 0 && (
            <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
              <h3 className="font-heading text-lg text-[#1B4D3E] mb-4">
                Dettaglio Compensazioni (FIFO)
              </h3>
              <div className="space-y-3">
                {risultati.compensazioneETFsuAzioni > 0 && (
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <p className="font-medium text-purple-800">
                        Minusvalenze ETF/Obbligazioni su Azioni/ETC/Certificati
                      </p>
                      <p className="text-xs text-purple-600">
                        Le minusvalenze da ETF possono compensare solo redditi diversi
                      </p>
                    </div>
                    <span className="font-heading text-lg text-purple-700">
                      {formatCurrency(risultati.compensazioneETFsuAzioni)}
                    </span>
                  </div>
                )}
                {risultati.compensazioneAzioniSuAzioni > 0 && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-800">
                        Minusvalenze Azioni/ETC/Certificati su Azioni/ETC/Certificati
                      </p>
                      <p className="text-xs text-blue-600">Compensazione redditi diversi</p>
                    </div>
                    <span className="font-heading text-lg text-blue-700">
                      {formatCurrency(risultati.compensazioneAzioniSuAzioni)}
                    </span>
                  </div>
                )}
                {risultati.compensazioneAzioniSuETF > 0 && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div>
                      <p className="font-medium text-green-800">
                        Minusvalenze Azioni/ETC/Certificati su ETF/Obbligazioni
                      </p>
                      <p className="text-xs text-green-600">
                        Le minusvalenze da azioni possono compensare anche ETF
                      </p>
                    </div>
                    <span className="font-heading text-lg text-green-700">
                      {formatCurrency(risultati.compensazioneAzioniSuETF)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Regole fiscali italiane */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-heading text-lg text-[#1B4D3E] mb-4">
                Regole Compensazione Italia
              </h3>
              <div className="space-y-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="font-medium text-purple-800 text-sm">Minusvalenze da ETF/Obbligazioni</p>
                  <p className="text-xs text-purple-700 mt-1">
                    Sono &quot;redditi da capitale&quot;. Possono compensare <strong>SOLO</strong>{' '}
                    plusvalenze da azioni, ETC, certificati (redditi diversi).
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800 text-sm">
                    Minusvalenze da Azioni/ETC/Certificati
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Sono &quot;redditi diversi&quot;. Possono compensare <strong>QUALSIASI</strong>{' '}
                    plusvalenza (azioni, ETF, obbligazioni, etc).
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800 text-sm">Scadenza 4 anni</p>
                  <p className="text-xs text-gray-700 mt-1">
                    Le minusvalenze scadono al 31/12 del quarto anno successivo a quello di
                    realizzazione. Usa il metodo FIFO (prima le piu vecchie).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-heading text-lg text-[#1B4D3E] mb-4">Suggerimenti</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>Minusvalenze ETF:</strong> Se hai minusvalenze da ETF, vendere azioni in
                    guadagno per compensarle (non il contrario).
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>Prima della scadenza:</strong> Realizza plusvalenze per usare
                    minusvalenze in scadenza, anche se dovresti poi riacquistare.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>Certificati a leva:</strong> Le plusvalenze da certificati compensano
                    minusvalenze ETF. Strumenti utili per &quot;recuperare&quot; lo zainetto.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>Regime amministrato:</strong> Il broker compensa automaticamente ma solo
                    nello stesso dossier titoli.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-xs text-gray-500">
              <strong>Disclaimer:</strong> Questo calcolatore fornisce stime indicative a scopo
              educativo basate sulla normativa fiscale italiana vigente. Le regole di compensazione
              possono variare in base al regime fiscale (amministrato vs dichiarativo) e alla
              tipologia specifica di strumento finanziario. Si consiglia di verificare le proprie
              minusvalenze con l&apos;estratto conto del broker e di consultare un commercialista per
              una valutazione accurata della propria situazione fiscale.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-[#2D6A4F]">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Non lasciare scadere le tue minusvalenze
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Una corretta pianificazione fiscale puo farti risparmiare migliaia di euro. Un consulente
            indipendente puo aiutarti a ottimizzare lo zainetto fiscale.
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
