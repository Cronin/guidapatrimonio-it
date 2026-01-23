'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer } from '@/components'

type TipoAsset =
  | 'etf_armonizzato'
  | 'etf_non_armonizzato'
  | 'azioni_it'
  | 'azioni_estere'
  | 'btp_bot'
  | 'obbligazioni_corporate'

interface AssetInfo {
  nome: string
  aliquota: number
  descrizione: string
  note?: string
}

const ASSET_CONFIG: Record<TipoAsset, AssetInfo> = {
  etf_armonizzato: {
    nome: 'ETF Armonizzato (UCITS)',
    aliquota: 26,
    descrizione: 'ETF europei conformi alla direttiva UCITS',
    note: 'La maggior parte degli ETF quotati su Borsa Italiana'
  },
  etf_non_armonizzato: {
    nome: 'ETF Non Armonizzato',
    aliquota: 26,
    descrizione: 'ETF extra-UE non conformi UCITS',
    note: 'Es. ETF quotati solo su NYSE, in regime dichiarativo potrebbero avere tassazione IRPEF progressiva'
  },
  azioni_it: {
    nome: 'Azioni Italiane',
    aliquota: 26,
    descrizione: 'Azioni quotate su Borsa Italiana',
  },
  azioni_estere: {
    nome: 'Azioni Estere',
    aliquota: 26,
    descrizione: 'Azioni quotate su mercati esteri',
    note: 'In regime dichiarativo va compilato il quadro RW'
  },
  btp_bot: {
    nome: 'BTP / BOT / Titoli di Stato',
    aliquota: 12.5,
    descrizione: 'Titoli di Stato italiani e white list',
    note: 'Aliquota agevolata al 12.5%'
  },
  obbligazioni_corporate: {
    nome: 'Obbligazioni Corporate',
    aliquota: 26,
    descrizione: 'Obbligazioni societarie',
  },
}

type RegimeFiscale = 'amministrato' | 'dichiarativo'

export default function CalcolatorePlusvalenze() {
  const [prezzoAcquisto, setPrezzoAcquisto] = useState(10000)
  const [prezzoVendita, setPrezzoVendita] = useState(15000)
  const [quantita, setQuantita] = useState(100)
  const [tipoAsset, setTipoAsset] = useState<TipoAsset>('etf_armonizzato')
  const [regime, setRegime] = useState<RegimeFiscale>('amministrato')

  const risultati = useMemo(() => {
    const assetInfo = ASSET_CONFIG[tipoAsset]
    const aliquota = assetInfo.aliquota

    const costoTotaleAcquisto = prezzoAcquisto * quantita
    const ricavoTotaleVendita = prezzoVendita * quantita
    const plusvalenzaLorda = ricavoTotaleVendita - costoTotaleAcquisto
    const isPlusvalenza = plusvalenzaLorda > 0

    const impostaDovuta = isPlusvalenza ? plusvalenzaLorda * (aliquota / 100) : 0
    const plusvalenzaNetta = plusvalenzaLorda - impostaDovuta

    const rendimentoLordoPerc = costoTotaleAcquisto > 0
      ? ((ricavoTotaleVendita - costoTotaleAcquisto) / costoTotaleAcquisto) * 100
      : 0
    const rendimentoNettoPerc = costoTotaleAcquisto > 0
      ? (plusvalenzaNetta / costoTotaleAcquisto) * 100
      : 0

    return {
      assetInfo,
      aliquota,
      costoTotaleAcquisto,
      ricavoTotaleVendita,
      plusvalenzaLorda,
      isPlusvalenza,
      impostaDovuta,
      plusvalenzaNetta,
      rendimentoLordoPerc,
      rendimentoNettoPerc,
    }
  }, [prezzoAcquisto, prezzoVendita, quantita, tipoAsset])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      signDisplay: 'always',
    }).format(value / 100)
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
            Calcolatore Plusvalenze
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Calcola le imposte sulle plusvalenze di azioni, ETF e obbligazioni.
            Scopri l&apos;aliquota corretta e il rendimento netto dei tuoi investimenti.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">Dati dell&apos;Operazione</h2>

              <div className="space-y-6">
                {/* Tipo Asset */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Tipo di Strumento</label>
                  <div className="grid grid-cols-1 gap-2">
                    {(Object.entries(ASSET_CONFIG) as [TipoAsset, AssetInfo][]).map(([key, config]) => (
                      <button
                        key={key}
                        onClick={() => setTipoAsset(key)}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors text-left ${
                          tipoAsset === key
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-semibold">{config.nome}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            tipoAsset === key ? 'bg-white/20' : 'bg-gray-200'
                          }`}>
                            {config.aliquota}%
                          </span>
                        </div>
                        <span className={tipoAsset === key ? 'text-green-100 text-xs' : 'text-gray-400 text-xs'}>
                          {config.descrizione}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Prezzo Acquisto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prezzo di Acquisto (per unita): {formatCurrency(prezzoAcquisto)}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50000"
                    step="1"
                    value={prezzoAcquisto}
                    onChange={(e) => setPrezzoAcquisto(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1 EUR</span>
                    <span>50.000 EUR</span>
                  </div>
                  <input
                    type="number"
                    value={prezzoAcquisto}
                    onChange={(e) => setPrezzoAcquisto(Number(e.target.value) || 0)}
                    className="mt-2 w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Inserisci importo esatto"
                  />
                </div>

                {/* Prezzo Vendita */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prezzo di Vendita (per unita): {formatCurrency(prezzoVendita)}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50000"
                    step="1"
                    value={prezzoVendita}
                    onChange={(e) => setPrezzoVendita(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1 EUR</span>
                    <span>50.000 EUR</span>
                  </div>
                  <input
                    type="number"
                    value={prezzoVendita}
                    onChange={(e) => setPrezzoVendita(Number(e.target.value) || 0)}
                    className="mt-2 w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Inserisci importo esatto"
                  />
                </div>

                {/* Quantita */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantita: {quantita} unita
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10000"
                    step="1"
                    value={quantita}
                    onChange={(e) => setQuantita(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1</span>
                    <span>10.000</span>
                  </div>
                  <input
                    type="number"
                    value={quantita}
                    onChange={(e) => setQuantita(Number(e.target.value) || 1)}
                    className="mt-2 w-full px-3 py-2 border rounded-lg text-sm"
                    placeholder="Inserisci quantita esatta"
                  />
                </div>

                {/* Regime Fiscale */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Regime Fiscale</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setRegime('amministrato')}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        regime === 'amministrato'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Amministrato
                    </button>
                    <button
                      onClick={() => setRegime('dichiarativo')}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        regime === 'dichiarativo'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Dichiarativo
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {/* Main Result */}
              <div className={`rounded-card p-6 text-white ${risultati.isPlusvalenza ? 'bg-green-600' : 'bg-red-600'}`}>
                <p className="text-white/80 text-sm mb-1">
                  {risultati.isPlusvalenza ? 'Plusvalenza Lorda' : 'Minusvalenza'}
                </p>
                <p className="font-heading text-3xl">{formatCurrency(Math.abs(risultati.plusvalenzaLorda))}</p>
                <p className="text-white/60 text-xs mt-1">
                  Rendimento lordo: {formatPercent(risultati.rendimentoLordoPerc)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Costo Totale Acquisto</p>
                  <p className="font-heading text-xl text-forest">{formatCurrency(risultati.costoTotaleAcquisto)}</p>
                  <p className="text-xs text-gray-400 mt-1">{quantita} x {formatCurrency(prezzoAcquisto)}</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Ricavo Totale Vendita</p>
                  <p className="font-heading text-xl text-green-600">{formatCurrency(risultati.ricavoTotaleVendita)}</p>
                  <p className="text-xs text-gray-400 mt-1">{quantita} x {formatCurrency(prezzoVendita)}</p>
                </div>
              </div>

              {/* Imposta e Netto */}
              {risultati.isPlusvalenza && (
                <div className="bg-white rounded-card p-6 shadow-sm">
                  <h3 className="font-heading text-lg text-forest mb-4">Calcolo Imposta</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Plusvalenza lorda</span>
                      <span className="font-medium text-green-600">{formatCurrency(risultati.plusvalenzaLorda)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">
                        Aliquota ({risultati.assetInfo.nome})
                      </span>
                      <span className="font-medium">{risultati.aliquota}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-sm text-gray-600">Imposta dovuta</span>
                      <span className="font-medium text-red-600">-{formatCurrency(risultati.impostaDovuta)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 bg-green-50 -mx-6 px-6 -mb-6 rounded-b-card">
                      <span className="font-medium text-forest">Plusvalenza Netta</span>
                      <span className="font-heading text-xl text-green-600">{formatCurrency(risultati.plusvalenzaNetta)}</span>
                    </div>
                  </div>
                </div>
              )}

              {!risultati.isPlusvalenza && risultati.plusvalenzaLorda < 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-card p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-amber-800">Minusvalenza realizzata</p>
                      <p className="text-sm text-amber-700 mt-1">
                        Le minusvalenze possono essere compensate con future plusvalenze entro 4 anni.
                        In regime amministrato, la banca gestisce automaticamente la compensazione.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Rendimento */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Rendimento</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Rendimento Lordo</p>
                    <p className={`font-heading text-2xl ${risultati.rendimentoLordoPerc >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatPercent(risultati.rendimentoLordoPerc)}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Rendimento Netto</p>
                    <p className={`font-heading text-2xl ${risultati.rendimentoNettoPerc >= 0 ? 'text-green-700' : 'text-red-600'}`}>
                      {formatPercent(risultati.rendimentoNettoPerc)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Note asset */}
              {risultati.assetInfo.note && (
                <div className="bg-blue-50 border border-blue-200 rounded-card p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Nota:</strong> {risultati.assetInfo.note}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tabella Aliquote */}
          <div className="mt-12 bg-white rounded-card p-6 shadow-sm">
            <h2 className="font-heading text-xl text-forest mb-4">Tabella Aliquote per Tipo di Asset</h2>
            <p className="text-gray-600 text-sm mb-6">
              Le aliquote italiane sulle plusvalenze finanziarie (capital gain) variano in base al tipo di strumento.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Strumento Finanziario</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold">Aliquota</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.entries(ASSET_CONFIG) as [TipoAsset, AssetInfo][]).map(([key, config]) => (
                    <tr key={key} className={`border-b border-gray-100 hover:bg-gray-50 ${tipoAsset === key ? 'bg-green-50' : ''}`}>
                      <td className="py-3 px-4">
                        <p className="font-medium">{config.nome}</p>
                        <p className="text-xs text-gray-400">{config.descrizione}</p>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full font-semibold ${
                          config.aliquota === 12.5
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {config.aliquota}%
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{config.note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regime Amministrato vs Dichiarativo */}
          <div className="mt-8 bg-white rounded-card p-6 shadow-sm">
            <h2 className="font-heading text-xl text-forest mb-4">Regime Amministrato vs Dichiarativo</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`p-5 rounded-lg border-2 ${regime === 'amministrato' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                <h3 className="font-heading text-lg text-forest mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Regime Amministrato
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">+</span>
                    <span>La banca/broker calcola e versa le imposte automaticamente</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">+</span>
                    <span>Compensazione automatica tra plusvalenze e minusvalenze</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">+</span>
                    <span>Nessun obbligo dichiarativo (eccetto IVAFE se titoli esteri)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">-</span>
                    <span>Non puoi compensare minusvalenze tra diversi intermediari</span>
                  </li>
                </ul>
                <p className="mt-4 text-xs text-gray-500">
                  <strong>Ideale per:</strong> Chi vuole semplicita e ha un solo broker
                </p>
              </div>

              <div className={`p-5 rounded-lg border-2 ${regime === 'dichiarativo' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                <h3 className="font-heading text-lg text-forest mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Regime Dichiarativo
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">+</span>
                    <span>Puoi compensare minusvalenze tra diversi broker</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">+</span>
                    <span>Maggiore flessibilita nella gestione fiscale</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">-</span>
                    <span>Devi calcolare e dichiarare tutto tu (o il commercialista)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">-</span>
                    <span>Obbligo di compilare quadro RT e RW del Modello Redditi</span>
                  </li>
                </ul>
                <p className="mt-4 text-xs text-gray-500">
                  <strong>Ideale per:</strong> Chi ha piu broker o vuole ottimizzare la fiscalita
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-700">
                <strong>Consiglio:</strong> Se hai un patrimonio superiore a 100.000 EUR investito o utilizzi broker esteri (es. Interactive Brokers, Degiro),
                valuta attentamente pro e contro di ciascun regime con un commercialista esperto in fiscalita finanziaria.
              </p>
            </div>
          </div>

          {/* Compensazione Minusvalenze */}
          <div className="mt-8 bg-white rounded-card p-6 shadow-sm">
            <h2 className="font-heading text-xl text-forest mb-4">Compensazione delle Minusvalenze</h2>
            <div className="prose prose-sm text-gray-600 max-w-none">
              <p>
                In Italia, le <strong>minusvalenze</strong> (perdite su vendita di strumenti finanziari) possono essere compensate
                con le <strong>plusvalenze</strong> realizzate nei 4 anni successivi.
              </p>

              <div className="grid md:grid-cols-3 gap-4 mt-4 not-prose">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Redditi Diversi</h4>
                  <p className="text-sm text-green-700">
                    Plusvalenze da azioni, ETF, fondi, obbligazioni sono &quot;redditi diversi&quot; e si compensano tra loro.
                  </p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-2">4 Anni di Tempo</h4>
                  <p className="text-sm text-amber-700">
                    Le minusvalenze realizzate nel 2024 possono compensare plusvalenze fino al 31/12/2028.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Ordine Cronologico</h4>
                  <p className="text-sm text-blue-700">
                    Le minusvalenze piu vecchie vengono compensate per prime (FIFO).
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg not-prose">
                <p className="text-sm text-red-800">
                  <strong>Attenzione:</strong> I dividendi e le cedole <strong>non possono</strong> essere compensati con le minusvalenze.
                  Solo le plusvalenze da capital gain sono compensabili.
                </p>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 bg-gray-50 rounded-card p-6">
            <p className="text-xs text-gray-500">
              <strong>Disclaimer:</strong> Questo calcolatore fornisce stime indicative a scopo educativo e informativo.
              Le imposte effettive possono variare in base alla tua situazione personale, al regime fiscale scelto,
              alla residenza fiscale e ad altre variabili. Le aliquote e normative fiscali possono cambiare nel tempo.
              Questo strumento non costituisce consulenza fiscale o finanziaria.
              Si consiglia di consultare un commercialista o consulente fiscale qualificato per una valutazione accurata della propria situazione.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Vuoi ottimizzare la fiscalita dei tuoi investimenti?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            La pianificazione fiscale e fondamentale per massimizzare i rendimenti netti.
            Un consulente indipendente puo aiutarti a scegliere il regime fiscale piu vantaggioso.
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
