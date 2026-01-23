'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer } from '@/components'

interface Posizione {
  id: string
  nome: string
  prezzoAcquisto: number
  prezzoAttuale: number
  quantita: number
  dataAcquisto?: string
}

interface MinusvalenzaPregressa {
  id: string
  anno: number
  importo: number
}

const ALIQUOTA_CAPITAL_GAIN = 0.26 // 26%
const ANNI_COMPENSAZIONE = 4

export default function TaxLossHarvestingCalculator() {
  const annoCorrente = new Date().getFullYear()

  const [posizioni, setPosizioni] = useState<Posizione[]>([
    { id: '1', nome: 'ETF MSCI World', prezzoAcquisto: 100, prezzoAttuale: 85, quantita: 50 },
    { id: '2', nome: 'Azioni Tech XYZ', prezzoAcquisto: 150, prezzoAttuale: 120, quantita: 30 },
    { id: '3', nome: 'ETF Obbligazionario', prezzoAcquisto: 50, prezzoAttuale: 55, quantita: 100 },
    { id: '4', nome: 'Azioni Energia ABC', prezzoAcquisto: 80, prezzoAttuale: 95, quantita: 40 },
  ])

  const [plusvalenzeRealizzate, setPlusvalenzeRealizzate] = useState<number>(10000)

  const [minusvalenzeRegresse, setMinusvalenzeRegresse] = useState<MinusvalenzaPregressa[]>([
    { id: '1', anno: annoCorrente - 1, importo: 2000 },
    { id: '2', anno: annoCorrente - 3, importo: 1500 },
  ])

  const [nuovaPosizione, setNuovaPosizione] = useState({
    nome: '',
    prezzoAcquisto: '',
    prezzoAttuale: '',
    quantita: '',
  })

  const [nuovaMinusvalenza, setNuovaMinusvalenza] = useState({
    anno: annoCorrente - 1,
    importo: '',
  })

  const [showRiacquistoInfo, setShowRiacquistoInfo] = useState(false)

  const risultati = useMemo(() => {
    // Calcola P&L per ogni posizione
    const posizioniConPL = posizioni.map(pos => {
      const valoreTotaleAcquisto = pos.prezzoAcquisto * pos.quantita
      const valoreTotaleAttuale = pos.prezzoAttuale * pos.quantita
      const profitLoss = valoreTotaleAttuale - valoreTotaleAcquisto
      const percentuale = ((pos.prezzoAttuale - pos.prezzoAcquisto) / pos.prezzoAcquisto) * 100
      return {
        ...pos,
        valoreTotaleAcquisto,
        valoreTotaleAttuale,
        profitLoss,
        percentuale,
        inPerdita: profitLoss < 0,
      }
    })

    // Posizioni in perdita (candidate per harvesting)
    const posizioniInPerdita = posizioniConPL.filter(p => p.inPerdita)
    const totaleMinusvalenzeLatenti = posizioniInPerdita.reduce((sum, p) => sum + Math.abs(p.profitLoss), 0)

    // Posizioni in profitto
    const posizioniInProfitto = posizioniConPL.filter(p => !p.inPerdita)
    const totalePlusvalenzeLatenti = posizioniInProfitto.reduce((sum, p) => sum + p.profitLoss, 0)

    // Minusvalenze pregresse (solo quelle ancora valide - ultimi 4 anni)
    const minusvalenzeValide = minusvalenzeRegresse.filter(m => m.anno >= annoCorrente - ANNI_COMPENSAZIONE)
    const totaleMinusvalenzeRegresse = minusvalenzeValide.reduce((sum, m) => sum + m.importo, 0)

    // Minusvalenze in scadenza (ultimo anno valido)
    const minusvalenzeInScadenza = minusvalenzeValide.filter(m => m.anno === annoCorrente - ANNI_COMPENSAZIONE)
    const totaleMinusvalenzeInScadenza = minusvalenzeInScadenza.reduce((sum, m) => sum + m.importo, 0)

    // Calcolo tasse senza harvesting
    const plusvalenzeTassabiliSenzaHarvesting = Math.max(0, plusvalenzeRealizzate - totaleMinusvalenzeRegresse)
    const tasseSenzaHarvesting = plusvalenzeTassabiliSenzaHarvesting * ALIQUOTA_CAPITAL_GAIN

    // Calcolo tasse con harvesting (vendendo tutte le posizioni in perdita)
    const minusvalenzeTotaliDisponibili = totaleMinusvalenzeRegresse + totaleMinusvalenzeLatenti
    const plusvalenzeTassabiliConHarvesting = Math.max(0, plusvalenzeRealizzate - minusvalenzeTotaliDisponibili)
    const tasseConHarvesting = plusvalenzeTassabiliConHarvesting * ALIQUOTA_CAPITAL_GAIN

    // Risparmio fiscale
    const risparmioFiscale = tasseSenzaHarvesting - tasseConHarvesting
    const risparmioMassimoTeorico = totaleMinusvalenzeLatenti * ALIQUOTA_CAPITAL_GAIN

    // Minusvalenze che andrebbero perse (scadenza imminente non utilizzate)
    const minusvalenzeSprecate = Math.max(0, totaleMinusvalenzeInScadenza - Math.min(totaleMinusvalenzeInScadenza, plusvalenzeRealizzate))

    // Analisi convenienza per posizione
    const analisiPosizioni = posizioniInPerdita.map(pos => {
      const minusvalenza = Math.abs(pos.profitLoss)
      const risparmio = minusvalenza * ALIQUOTA_CAPITAL_GAIN
      // Stima costi transazione (0.1% del valore)
      const costiTransazione = pos.valoreTotaleAttuale * 0.002 // 0.2% andata + ritorno
      const risparmioNetto = risparmio - costiTransazione
      const conviene = risparmioNetto > 0

      return {
        ...pos,
        minusvalenza,
        risparmio,
        costiTransazione,
        risparmioNetto,
        conviene,
      }
    }).sort((a, b) => b.risparmioNetto - a.risparmioNetto)

    return {
      posizioniConPL,
      posizioniInPerdita,
      posizioniInProfitto,
      totaleMinusvalenzeLatenti,
      totalePlusvalenzeLatenti,
      totaleMinusvalenzeRegresse,
      minusvalenzeValide,
      totaleMinusvalenzeInScadenza,
      minusvalenzeInScadenza,
      plusvalenzeTassabiliSenzaHarvesting,
      tasseSenzaHarvesting,
      plusvalenzeTassabiliConHarvesting,
      tasseConHarvesting,
      risparmioFiscale,
      risparmioMassimoTeorico,
      minusvalenzeSprecate,
      analisiPosizioni,
    }
  }, [posizioni, plusvalenzeRealizzate, minusvalenzeRegresse, annoCorrente])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
      signDisplay: 'always',
    }).format(value / 100)
  }

  const aggiungiPosizione = () => {
    if (nuovaPosizione.nome && nuovaPosizione.prezzoAcquisto && nuovaPosizione.prezzoAttuale && nuovaPosizione.quantita) {
      setPosizioni([...posizioni, {
        id: Date.now().toString(),
        nome: nuovaPosizione.nome,
        prezzoAcquisto: Number(nuovaPosizione.prezzoAcquisto),
        prezzoAttuale: Number(nuovaPosizione.prezzoAttuale),
        quantita: Number(nuovaPosizione.quantita),
      }])
      setNuovaPosizione({ nome: '', prezzoAcquisto: '', prezzoAttuale: '', quantita: '' })
    }
  }

  const rimuoviPosizione = (id: string) => {
    setPosizioni(posizioni.filter(p => p.id !== id))
  }

  const aggiungiMinusvalenza = () => {
    if (nuovaMinusvalenza.importo) {
      setMinusvalenzeRegresse([...minusvalenzeRegresse, {
        id: Date.now().toString(),
        anno: nuovaMinusvalenza.anno,
        importo: Number(nuovaMinusvalenza.importo),
      }])
      setNuovaMinusvalenza({ anno: annoCorrente - 1, importo: '' })
    }
  }

  const rimuoviMinusvalenza = (id: string) => {
    setMinusvalenzeRegresse(minusvalenzeRegresse.filter(m => m.id !== id))
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
            Tax Loss Harvesting Calculator
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Calcola il risparmio fiscale vendendo posizioni in perdita per compensare le plusvalenze.
            Ottimizza la tua posizione fiscale sfruttando la normativa italiana.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          {/* Risultato principale */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-green-600 rounded-card p-6 text-white">
              <p className="text-white/80 text-sm mb-1">Risparmio Fiscale Potenziale</p>
              <p className="font-heading text-3xl">{formatCurrency(risultati.risparmioFiscale)}</p>
              <p className="text-white/60 text-xs mt-1">Vendendo le posizioni in perdita</p>
            </div>
            <div className="bg-amber-600 rounded-card p-6 text-white">
              <p className="text-white/80 text-sm mb-1">Tasse Attuali</p>
              <p className="font-heading text-3xl">{formatCurrency(risultati.tasseSenzaHarvesting)}</p>
              <p className="text-white/60 text-xs mt-1">Su plusvalenze realizzate</p>
            </div>
            <div className="bg-blue-600 rounded-card p-6 text-white">
              <p className="text-white/80 text-sm mb-1">Tasse con Harvesting</p>
              <p className="font-heading text-3xl">{formatCurrency(risultati.tasseConHarvesting)}</p>
              <p className="text-white/60 text-xs mt-1">Dopo compensazione</p>
            </div>
            <div className="bg-red-600 rounded-card p-6 text-white">
              <p className="text-white/80 text-sm mb-1">Minusvalenze in Scadenza</p>
              <p className="font-heading text-3xl">{formatCurrency(risultati.totaleMinusvalenzeInScadenza)}</p>
              <p className="text-white/60 text-xs mt-1">Anno {annoCorrente - ANNI_COMPENSAZIONE}</p>
            </div>
          </div>

          {/* Alert minusvalenze in scadenza */}
          {risultati.totaleMinusvalenzeInScadenza > 0 && (
            <div className="bg-amber-100 border border-amber-300 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-amber-800 font-medium">
                    Attenzione: hai {formatCurrency(risultati.totaleMinusvalenzeInScadenza)} di minusvalenze in scadenza!
                  </p>
                  <p className="text-amber-700 text-sm mt-1">
                    Le minusvalenze dell&apos;anno {annoCorrente - ANNI_COMPENSAZIONE} scadranno a fine {annoCorrente}.
                    Considera di realizzare plusvalenze per compensarle prima che vadano perse.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Portafoglio */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-heading text-xl text-forest">Posizioni in Portafoglio</h2>
                  <p className="text-xs text-gray-500">Inserisci le tue posizioni attuali</p>
                </div>
              </div>

              <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                {posizioni.map((pos) => {
                  const pl = (pos.prezzoAttuale - pos.prezzoAcquisto) * pos.quantita
                  const perc = ((pos.prezzoAttuale - pos.prezzoAcquisto) / pos.prezzoAcquisto) * 100
                  const inPerdita = pl < 0
                  return (
                    <div key={pos.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{pos.nome}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${inPerdita ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {formatPercent(perc)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400">
                          {pos.quantita} x {formatCurrency(pos.prezzoAcquisto)} {'→'} {formatCurrency(pos.prezzoAttuale)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className={`font-medium text-sm ${inPerdita ? 'text-red-600' : 'text-green-600'}`}>
                            {formatCurrency(pl)}
                          </span>
                        </div>
                        <button
                          onClick={() => rimuoviPosizione(pos.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Aggiungi posizione</p>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Nome strumento (es. ETF S&P 500)"
                    value={nuovaPosizione.nome}
                    onChange={(e) => setNuovaPosizione({ ...nuovaPosizione, nome: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      placeholder="Prezzo acquisto"
                      value={nuovaPosizione.prezzoAcquisto}
                      onChange={(e) => setNuovaPosizione({ ...nuovaPosizione, prezzoAcquisto: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Prezzo attuale"
                      value={nuovaPosizione.prezzoAttuale}
                      onChange={(e) => setNuovaPosizione({ ...nuovaPosizione, prezzoAttuale: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Quantita"
                      value={nuovaPosizione.quantita}
                      onChange={(e) => setNuovaPosizione({ ...nuovaPosizione, quantita: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <button
                    onClick={aggiungiPosizione}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                  >
                    Aggiungi Posizione
                  </button>
                </div>
              </div>
            </div>

            {/* Plusvalenze e Minusvalenze */}
            <div className="space-y-6">
              {/* Plusvalenze realizzate */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-heading text-xl text-forest">Plusvalenze Realizzate</h2>
                    <p className="text-xs text-gray-500">Guadagni gia incassati quest&apos;anno</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Plusvalenze {annoCorrente}</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">EUR</span>
                      <input
                        type="number"
                        value={plusvalenzeRealizzate}
                        onChange={(e) => setPlusvalenzeRealizzate(Number(e.target.value) || 0)}
                        className="w-full pl-14 pr-3 py-3 border rounded-lg text-lg font-medium"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Tasse dovute: {formatCurrency(plusvalenzeRealizzate * ALIQUOTA_CAPITAL_GAIN)} (26%)
                    </p>
                  </div>
                </div>
              </div>

              {/* Minusvalenze pregresse */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-heading text-xl text-forest">Minusvalenze Pregresse</h2>
                    <p className="text-xs text-gray-500">Perdite degli anni precedenti (compensabili entro 4 anni)</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {minusvalenzeRegresse.length === 0 ? (
                    <p className="text-gray-400 text-sm p-3">Nessuna minusvalenza pregressa</p>
                  ) : (
                    minusvalenzeRegresse.map((m) => {
                      const anniRimanenti = ANNI_COMPENSAZIONE - (annoCorrente - m.anno)
                      const inScadenza = anniRimanenti <= 1
                      return (
                        <div key={m.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Anno {m.anno}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              inScadenza ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {anniRimanenti > 0 ? `${anniRimanenti} anni rimanenti` : 'Scade quest\'anno!'}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-red-600">{formatCurrency(m.importo)}</span>
                            <button
                              onClick={() => rimuoviMinusvalenza(m.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Aggiungi minusvalenza pregressa</p>
                  <div className="flex gap-2">
                    <select
                      value={nuovaMinusvalenza.anno}
                      onChange={(e) => setNuovaMinusvalenza({ ...nuovaMinusvalenza, anno: Number(e.target.value) })}
                      className="px-3 py-2 border rounded-lg text-sm"
                    >
                      {[...Array(ANNI_COMPENSAZIONE)].map((_, i) => (
                        <option key={i} value={annoCorrente - 1 - i}>Anno {annoCorrente - 1 - i}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Importo EUR"
                      value={nuovaMinusvalenza.importo}
                      onChange={(e) => setNuovaMinusvalenza({ ...nuovaMinusvalenza, importo: e.target.value })}
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />
                    <button
                      onClick={aggiungiMinusvalenza}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                    >
                      Aggiungi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Analisi dettagliata posizioni in perdita */}
          {risultati.analisiPosizioni.length > 0 && (
            <div className="bg-white rounded-card p-6 shadow-sm mb-8">
              <h2 className="font-heading text-xl text-forest mb-4">Posizioni Candidate per Tax Loss Harvesting</h2>
              <p className="text-sm text-gray-600 mb-4">
                Queste posizioni sono in perdita. Vendile per generare minusvalenze da compensare con le plusvalenze.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium text-gray-600">Strumento</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-600">Valore Attuale</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-600">Minusvalenza</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-600">Risparmio Fiscale</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-600">Costi Transazione*</th>
                      <th className="text-right py-3 px-2 font-medium text-gray-600">Risparmio Netto</th>
                      <th className="text-center py-3 px-2 font-medium text-gray-600">Conviene?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {risultati.analisiPosizioni.map((pos) => (
                      <tr key={pos.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <p className="font-medium">{pos.nome}</p>
                          <p className="text-xs text-gray-400">{formatPercent(pos.percentuale)}</p>
                        </td>
                        <td className="py-3 px-2 text-right">{formatCurrency(pos.valoreTotaleAttuale)}</td>
                        <td className="py-3 px-2 text-right text-red-600">{formatCurrency(pos.minusvalenza)}</td>
                        <td className="py-3 px-2 text-right text-green-600">{formatCurrency(pos.risparmio)}</td>
                        <td className="py-3 px-2 text-right text-gray-500">-{formatCurrency(pos.costiTransazione)}</td>
                        <td className={`py-3 px-2 text-right font-medium ${pos.risparmioNetto > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(pos.risparmioNetto)}
                        </td>
                        <td className="py-3 px-2 text-center">
                          {pos.conviene ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              Si
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              No
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                *Costi transazione stimati al 0.2% (commissioni di vendita e riacquisto)
              </p>
            </div>
          )}

          {/* Riepilogo compensazione */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">Senza Tax Loss Harvesting</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Plusvalenze realizzate</span>
                  <span className="font-medium text-green-600">{formatCurrency(plusvalenzeRealizzate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Minusvalenze pregresse</span>
                  <span className="font-medium text-red-600">-{formatCurrency(risultati.totaleMinusvalenzeRegresse)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-sm font-medium">Imponibile</span>
                  <span className="font-medium">{formatCurrency(risultati.plusvalenzeTassabiliSenzaHarvesting)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Imposta (26%)</span>
                  <span className="font-heading text-xl text-amber-600">{formatCurrency(risultati.tasseSenzaHarvesting)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm border-2 border-green-500">
              <h3 className="font-heading text-lg text-forest mb-4">Con Tax Loss Harvesting</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Plusvalenze realizzate</span>
                  <span className="font-medium text-green-600">{formatCurrency(plusvalenzeRealizzate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Minusvalenze pregresse</span>
                  <span className="font-medium text-red-600">-{formatCurrency(risultati.totaleMinusvalenzeRegresse)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Minusvalenze harvesting</span>
                  <span className="font-medium text-red-600">-{formatCurrency(risultati.totaleMinusvalenzeLatenti)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="text-sm font-medium">Imponibile</span>
                  <span className="font-medium">{formatCurrency(risultati.plusvalenzeTassabiliConHarvesting)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Imposta (26%)</span>
                  <span className="font-heading text-xl text-green-600">{formatCurrency(risultati.tasseConHarvesting)}</span>
                </div>
              </div>
            </div>

            <div className="bg-green-600 rounded-card p-6 text-white">
              <h3 className="font-heading text-lg mb-4">Il Tuo Risparmio</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-white/70 text-sm">Risparmio totale</p>
                  <p className="font-heading text-4xl">{formatCurrency(risultati.risparmioFiscale)}</p>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <p className="text-white/70 text-sm">Risparmio massimo teorico</p>
                  <p className="font-medium">{formatCurrency(risultati.risparmioMassimoTeorico)}</p>
                  <p className="text-white/60 text-xs mt-1">
                    Se avessi plusvalenze illimitate da compensare
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info box riacquisto */}
          <div className="bg-white rounded-card p-6 shadow-sm mb-8">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowRiacquistoInfo(!showRiacquistoInfo)}
            >
              <h3 className="font-heading text-lg text-forest">Vuoi mantenere l&apos;esposizione? Riacquista subito!</h3>
              <svg
                className={`w-5 h-5 text-gray-500 transition-transform ${showRiacquistoInfo ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {showRiacquistoInfo && (
              <div className="mt-4 space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Vantaggio Italia: No Wash Sale Rule!</h4>
                  <p className="text-sm text-green-700">
                    A differenza degli USA, in Italia non esiste la &quot;wash sale rule&quot;.
                    Puoi vendere un titolo in perdita e riacquistarlo <strong>immediatamente</strong>,
                    anche lo stesso giorno, mantenendo la tua esposizione al mercato.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Come fare</h4>
                    <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                      <li>Vendi la posizione in perdita</li>
                      <li>Realizzi la minusvalenza fiscale</li>
                      <li>Riacquista lo stesso strumento</li>
                      <li>Nuovo prezzo di carico = prezzo attuale</li>
                    </ol>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2">Attenzione ai costi</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>- Commissioni di vendita e acquisto</li>
                      <li>- Spread bid-ask sul mercato</li>
                      <li>- Possibile slippage in mercati volatili</li>
                      <li>- Conviene se risparmio {'>'} costi</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Regole fiscali */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">Regole Fiscali Italiane</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Aliquota capital gain:</strong> 26% su azioni, ETF, fondi, obbligazioni corporate</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Compensazione:</strong> Minusvalenze compensabili entro 4 anni dalla realizzazione</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Ordine:</strong> Le minusvalenze piu vecchie vengono compensate per prime</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>No wash sale:</strong> Puoi riacquistare immediatamente lo stesso strumento</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">Esempio Pratico</h3>
              <div className="space-y-4 text-sm">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Situazione:</strong> Hai venduto ETF con <span className="text-green-600 font-medium">+10.000 EUR</span> di plusvalenza
                  </p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Opportunita:</strong> Hai una posizione in perdita di <span className="text-red-600 font-medium">-5.000 EUR</span>
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Azione:</strong> Vendi la posizione in perdita e riacquistala subito
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg border-2 border-amber-200">
                  <p className="text-gray-700">
                    <strong>Risultato:</strong> Risparmi <span className="text-amber-600 font-bold">1.300 EUR</span> di tasse (26% di 5.000 EUR)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 rounded-card p-6">
            <p className="text-xs text-gray-500">
              <strong>Disclaimer:</strong> Questo calcolatore fornisce stime indicative a scopo educativo.
              Le imposte effettive possono variare in base alla tua situazione specifica, al regime fiscale applicabile
              (amministrato vs dichiarativo), e ad altre variabili. I costi di transazione sono stimati e possono
              variare in base al broker utilizzato. Si consiglia di consultare un commercialista o consulente fiscale
              per una valutazione accurata della propria situazione.
            </p>
          </div>
        </div>
      </section>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Ottimizza la fiscalita del tuo portafoglio
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Il tax loss harvesting e solo una delle strategie per ottimizzare la tassazione dei tuoi investimenti.
            Un consulente indipendente puo aiutarti a implementare una strategia fiscale completa.
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
