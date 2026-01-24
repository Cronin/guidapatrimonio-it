'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer, RelatedTools, toolCorrelations , RatingWidget, ToolPageSchema} from '@/components'

type TipoAsset = 'conto' | 'azioni' | 'obbligazioni' | 'etf' | 'fondi' | 'cripto' | 'altro_finanziario'
type TipoImmobile = 'residenziale' | 'commerciale' | 'terreno'
type TipoPaese = 'ue' | 'extra_ue' | 'paradiso_fiscale'

interface AssetFinanziario {
  id: string
  nome: string
  tipo: TipoAsset
  paese: string
  tipoPaese: TipoPaese
  valoreInizio: number // Valore al 1 gennaio
  valoreFine: number // Valore al 31 dicembre
  giorniDetenzione: number
}

interface Immobile {
  id: string
  nome: string
  tipo: TipoImmobile
  paese: string
  tipoPaese: TipoPaese
  valore: number // Valore catastale o di acquisto
  giorniDetenzione: number
}

const tipiAsset: Record<TipoAsset, string> = {
  conto: 'Conto corrente/deposito',
  azioni: 'Azioni',
  obbligazioni: 'Obbligazioni',
  etf: 'ETF',
  fondi: 'Fondi di investimento',
  cripto: 'Criptovalute',
  altro_finanziario: 'Altro strumento finanziario',
}

const tipiImmobile: Record<TipoImmobile, string> = {
  residenziale: 'Immobile residenziale',
  commerciale: 'Immobile commerciale',
  terreno: 'Terreno',
}

const paesiEU = [
  'Austria', 'Belgio', 'Bulgaria', 'Cipro', 'Croazia', 'Danimarca', 'Estonia', 'Finlandia',
  'Francia', 'Germania', 'Grecia', 'Irlanda', 'Lettonia', 'Lituania', 'Lussemburgo', 'Malta',
  'Paesi Bassi', 'Polonia', 'Portogallo', 'Repubblica Ceca', 'Romania', 'Slovacchia',
  'Slovenia', 'Spagna', 'Svezia', 'Ungheria'
]

const paesiExtraUE = [
  'Regno Unito', 'Svizzera', 'Stati Uniti', 'Canada', 'Australia', 'Giappone', 'Norvegia',
  'Singapore', 'Hong Kong', 'Nuova Zelanda', 'Brasile', 'Messico', 'India', 'Cina', 'Corea del Sud'
]

const paradisiFiscali = [
  'Isole Cayman', 'Isole Vergini Britanniche', 'Panama', 'Bahamas', 'Bermuda', 'Jersey',
  'Guernsey', 'Isola di Man', 'Liechtenstein', 'Monaco', 'Andorra', 'Barbados', 'Mauritius',
  'Seychelles', 'Emirati Arabi Uniti', 'Vanuatu'
]

// Aliquote 2024
const ALIQUOTA_IVAFE = 0.002 // 0.2%
const ALIQUOTA_IVAFE_CONTI = 34.20 // Imposta fissa per conti correnti
const ALIQUOTA_IVIE = 0.0076 // 0.76%
const ALIQUOTA_IVIE_PARADISO = 0.0106 // 1.06% per paradisi fiscali
const FRANCHIGIA_IVAFE = 5000 // Franchigia per IVAFE
const FRANCHIGIA_IVIE = 200 // Franchigia per IVIE

export default function CalcolatoreIVAFEIVIE() {
  const [assetFinanziari, setAssetFinanziari] = useState<AssetFinanziario[]>([
    { id: '1', nome: 'Conto Revolut', tipo: 'conto', paese: 'Lituania', tipoPaese: 'ue', valoreInizio: 5000, valoreFine: 8000, giorniDetenzione: 365 },
    { id: '2', nome: 'ETF S&P 500', tipo: 'etf', paese: 'Stati Uniti', tipoPaese: 'extra_ue', valoreInizio: 25000, valoreFine: 28000, giorniDetenzione: 365 },
  ])

  const [immobili, setImmobili] = useState<Immobile[]>([
    { id: '1', nome: 'Appartamento Barcellona', tipo: 'residenziale', paese: 'Spagna', tipoPaese: 'ue', valore: 180000, giorniDetenzione: 365 },
  ])

  const [nuovoAsset, setNuovoAsset] = useState({
    nome: '',
    tipo: 'etf' as TipoAsset,
    paese: 'Stati Uniti',
    valoreInizio: '',
    valoreFine: '',
    giorniDetenzione: '365',
  })

  const [nuovoImmobile, setNuovoImmobile] = useState({
    nome: '',
    tipo: 'residenziale' as TipoImmobile,
    paese: 'Francia',
    valore: '',
    giorniDetenzione: '365',
  })

  const getTipoPaese = (paese: string): TipoPaese => {
    if (paesiEU.includes(paese)) return 'ue'
    if (paradisiFiscali.includes(paese)) return 'paradiso_fiscale'
    return 'extra_ue'
  }

  const risultati = useMemo(() => {
    // Calcolo IVAFE
    let totaleIVAFE = 0
    let totaleValoreFinanziario = 0
    const dettagliIVAFE: { nome: string; valore: number; imposta: number; tipo: string }[] = []

    assetFinanziari.forEach((asset) => {
      const valoreMedia = (asset.valoreInizio + asset.valoreFine) / 2
      const valoreProRata = (valoreMedia * asset.giorniDetenzione) / 365
      totaleValoreFinanziario += valoreProRata

      let imposta = 0
      if (asset.tipo === 'conto') {
        // Per conti correnti: imposta fissa di 34.20 euro (pro-rata)
        imposta = (ALIQUOTA_IVAFE_CONTI * asset.giorniDetenzione) / 365
      } else {
        // Per altri asset: 0.2%
        imposta = valoreProRata * ALIQUOTA_IVAFE
      }

      totaleIVAFE += imposta
      dettagliIVAFE.push({
        nome: asset.nome,
        valore: valoreProRata,
        imposta,
        tipo: tipiAsset[asset.tipo],
      })
    })

    // Calcolo IVIE
    let totaleIVIE = 0
    let totaleValoreImmobiliare = 0
    const dettagliIVIE: { nome: string; valore: number; imposta: number; aliquota: number; paese: string }[] = []

    immobili.forEach((immobile) => {
      const valoreProRata = (immobile.valore * immobile.giorniDetenzione) / 365
      totaleValoreImmobiliare += valoreProRata

      const aliquota = immobile.tipoPaese === 'paradiso_fiscale' ? ALIQUOTA_IVIE_PARADISO : ALIQUOTA_IVIE
      let imposta = valoreProRata * aliquota

      // Franchigia di 200 euro per IVIE
      if (imposta < FRANCHIGIA_IVIE) {
        imposta = 0
      }

      totaleIVIE += imposta
      dettagliIVIE.push({
        nome: immobile.nome,
        valore: valoreProRata,
        imposta,
        aliquota: aliquota * 100,
        paese: immobile.paese,
      })
    })

    // Quadro RW summary
    const quadroRW = {
      totaleFinanziario: totaleValoreFinanziario,
      totaleImmobiliare: totaleValoreImmobiliare,
      totale: totaleValoreFinanziario + totaleValoreImmobiliare,
      numAsset: assetFinanziari.length + immobili.length,
    }

    // Confronto con Italia (semplificato)
    // In Italia: imposta di bollo 0.2% su strumenti finanziari, IMU variabile
    const costoSeInItalia = totaleValoreFinanziario * 0.002 + totaleValoreImmobiliare * 0.0086 // IMU media

    return {
      totaleIVAFE,
      totaleIVIE,
      totaleImposte: totaleIVAFE + totaleIVIE,
      dettagliIVAFE,
      dettagliIVIE,
      quadroRW,
      costoSeInItalia,
      differenza: (totaleIVAFE + totaleIVIE) - costoSeInItalia,
    }
  }, [assetFinanziari, immobili])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const aggiungiAsset = () => {
    if (nuovoAsset.nome && nuovoAsset.valoreFine) {
      const tipoPaese = getTipoPaese(nuovoAsset.paese)
      setAssetFinanziari([...assetFinanziari, {
        id: Date.now().toString(),
        nome: nuovoAsset.nome,
        tipo: nuovoAsset.tipo,
        paese: nuovoAsset.paese,
        tipoPaese,
        valoreInizio: Number(nuovoAsset.valoreInizio) || Number(nuovoAsset.valoreFine),
        valoreFine: Number(nuovoAsset.valoreFine),
        giorniDetenzione: Number(nuovoAsset.giorniDetenzione) || 365,
      }])
      setNuovoAsset({ nome: '', tipo: 'etf', paese: 'Stati Uniti', valoreInizio: '', valoreFine: '', giorniDetenzione: '365' })
    }
  }

  const aggiungiImmobile = () => {
    if (nuovoImmobile.nome && nuovoImmobile.valore) {
      const tipoPaese = getTipoPaese(nuovoImmobile.paese)
      setImmobili([...immobili, {
        id: Date.now().toString(),
        nome: nuovoImmobile.nome,
        tipo: nuovoImmobile.tipo,
        paese: nuovoImmobile.paese,
        tipoPaese,
        valore: Number(nuovoImmobile.valore),
        giorniDetenzione: Number(nuovoImmobile.giorniDetenzione) || 365,
      }])
      setNuovoImmobile({ nome: '', tipo: 'residenziale', paese: 'Francia', valore: '', giorniDetenzione: '365' })
    }
  }

  const rimuoviAsset = (id: string) => {
    setAssetFinanziari(assetFinanziari.filter(a => a.id !== id))
  }

  const rimuoviImmobile = (id: string) => {
    setImmobili(immobili.filter(i => i.id !== id))
  }

  return (
    <main>
      <ToolPageSchema slug="ivafe-ivie" />
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
            Calcolatore IVAFE e IVIE
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Calcola le imposte sui tuoi investimenti e immobili all&apos;estero.
            IVAFE per attivita finanziarie, IVIE per immobili.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          {/* Risultato principale */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-forest rounded-card p-6 text-white">
              <p className="text-white/80 text-sm mb-1">IVAFE (Asset Finanziari)</p>
              <p className="font-heading text-3xl">{formatCurrency(risultati.totaleIVAFE)}</p>
              <p className="text-white/60 text-xs mt-1">Aliquota: 0,2% oppure 34,20 EUR/anno per conti</p>
            </div>
            <div className="bg-amber-600 rounded-card p-6 text-white">
              <p className="text-white/80 text-sm mb-1">IVIE (Immobili)</p>
              <p className="font-heading text-3xl">{formatCurrency(risultati.totaleIVIE)}</p>
              <p className="text-white/60 text-xs mt-1">Aliquota: 0,76% (1,06% paradisi fiscali)</p>
            </div>
            <div className="bg-green-600 rounded-card p-6 text-white">
              <p className="text-white/80 text-sm mb-1">Totale Imposte Annue</p>
              <p className="font-heading text-3xl">{formatCurrency(risultati.totaleImposte)}</p>
              <p className="text-white/60 text-xs mt-1">Da versare con modello F24</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Asset Finanziari - IVAFE */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-heading text-xl text-forest">Asset Finanziari Esteri</h2>
                  <p className="text-xs text-gray-500">Conti, azioni, ETF, obbligazioni all&apos;estero</p>
                </div>
              </div>

              <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                {assetFinanziari.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{asset.nome}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          asset.tipoPaese === 'ue' ? 'bg-gray-100 text-gray-700' :
                          asset.tipoPaese === 'paradiso_fiscale' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {asset.paese}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{tipiAsset[asset.tipo]} - {asset.giorniDetenzione} giorni</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-medium text-forest text-sm">{formatCurrency(asset.valoreFine)}</span>
                      </div>
                      <button
                        onClick={() => rimuoviAsset(asset.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Aggiungi asset finanziario</p>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nome (es. ETF Vanguard)"
                      value={nuovoAsset.nome}
                      onChange={(e) => setNuovoAsset({ ...nuovoAsset, nome: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <select
                      value={nuovoAsset.tipo}
                      onChange={(e) => setNuovoAsset({ ...nuovoAsset, tipo: e.target.value as TipoAsset })}
                      className="px-3 py-2 border rounded-lg text-sm"
                    >
                      {Object.entries(tipiAsset).map(([key, val]) => (
                        <option key={key} value={key}>{val}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={nuovoAsset.paese}
                      onChange={(e) => setNuovoAsset({ ...nuovoAsset, paese: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm"
                    >
                      <optgroup label="Unione Europea">
                        {paesiEU.map(p => <option key={p} value={p}>{p}</option>)}
                      </optgroup>
                      <optgroup label="Extra UE">
                        {paesiExtraUE.map(p => <option key={p} value={p}>{p}</option>)}
                      </optgroup>
                      <optgroup label="Paradisi Fiscali">
                        {paradisiFiscali.map(p => <option key={p} value={p}>{p}</option>)}
                      </optgroup>
                    </select>
                    <input
                      type="number"
                      placeholder="Valore 31/12"
                      value={nuovoAsset.valoreFine}
                      onChange={(e) => setNuovoAsset({ ...nuovoAsset, valoreFine: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Giorni"
                      value={nuovoAsset.giorniDetenzione}
                      onChange={(e) => setNuovoAsset({ ...nuovoAsset, giorniDetenzione: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <button
                    onClick={aggiungiAsset}
                    className="w-full px-4 py-2 bg-forest text-white rounded-lg text-sm hover:bg-green-700"
                  >
                    Aggiungi Asset
                  </button>
                </div>
              </div>
            </div>

            {/* Immobili - IVIE */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-heading text-xl text-forest">Immobili Esteri</h2>
                  <p className="text-xs text-gray-500">Case, appartamenti, terreni all&apos;estero</p>
                </div>
              </div>

              <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                {immobili.length === 0 ? (
                  <p className="text-gray-400 text-sm p-3">Nessun immobile estero registrato</p>
                ) : (
                  immobili.map((immobile) => (
                    <div key={immobile.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{immobile.nome}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            immobile.tipoPaese === 'ue' ? 'bg-gray-100 text-gray-700' :
                            immobile.tipoPaese === 'paradiso_fiscale' ? 'bg-red-100 text-red-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {immobile.paese}
                          </span>
                          {immobile.tipoPaese === 'paradiso_fiscale' && (
                            <span className="text-xs text-red-600">1,06%</span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">{tipiImmobile[immobile.tipo]} - {immobile.giorniDetenzione} giorni</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-amber-600 text-sm">{formatCurrency(immobile.valore)}</span>
                        <button
                          onClick={() => rimuoviImmobile(immobile.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Aggiungi immobile</p>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nome (es. Appartamento Parigi)"
                      value={nuovoImmobile.nome}
                      onChange={(e) => setNuovoImmobile({ ...nuovoImmobile, nome: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <select
                      value={nuovoImmobile.tipo}
                      onChange={(e) => setNuovoImmobile({ ...nuovoImmobile, tipo: e.target.value as TipoImmobile })}
                      className="px-3 py-2 border rounded-lg text-sm"
                    >
                      {Object.entries(tipiImmobile).map(([key, val]) => (
                        <option key={key} value={key}>{val}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={nuovoImmobile.paese}
                      onChange={(e) => setNuovoImmobile({ ...nuovoImmobile, paese: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm"
                    >
                      <optgroup label="Unione Europea">
                        {paesiEU.map(p => <option key={p} value={p}>{p}</option>)}
                      </optgroup>
                      <optgroup label="Extra UE">
                        {paesiExtraUE.map(p => <option key={p} value={p}>{p}</option>)}
                      </optgroup>
                      <optgroup label="Paradisi Fiscali (1,06%)">
                        {paradisiFiscali.map(p => <option key={p} value={p}>{p}</option>)}
                      </optgroup>
                    </select>
                    <input
                      type="number"
                      placeholder="Valore EUR"
                      value={nuovoImmobile.valore}
                      onChange={(e) => setNuovoImmobile({ ...nuovoImmobile, valore: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Giorni"
                      value={nuovoImmobile.giorniDetenzione}
                      onChange={(e) => setNuovoImmobile({ ...nuovoImmobile, giorniDetenzione: e.target.value })}
                      className="px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                  <button
                    onClick={aggiungiImmobile}
                    className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg text-sm hover:bg-amber-700"
                  >
                    Aggiungi Immobile
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dettagli calcolo e Quadro RW */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {/* Dettaglio IVAFE */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">Dettaglio IVAFE</h3>
              {risultati.dettagliIVAFE.length === 0 ? (
                <p className="text-gray-400 text-sm">Nessun asset finanziario</p>
              ) : (
                <div className="space-y-3">
                  {risultati.dettagliIVAFE.map((d, i) => (
                    <div key={i} className="border-b pb-2 last:border-0">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">{d.nome}</span>
                        <span className="font-medium text-forest">{formatCurrency(d.imposta)}</span>
                      </div>
                      <p className="text-xs text-gray-400">Valore: {formatCurrency(d.valore)}</p>
                    </div>
                  ))}
                  <div className="pt-2 border-t-2 flex justify-between font-medium">
                    <span>Totale IVAFE</span>
                    <span className="text-forest">{formatCurrency(risultati.totaleIVAFE)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Dettaglio IVIE */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">Dettaglio IVIE</h3>
              {risultati.dettagliIVIE.length === 0 ? (
                <p className="text-gray-400 text-sm">Nessun immobile estero</p>
              ) : (
                <div className="space-y-3">
                  {risultati.dettagliIVIE.map((d, i) => (
                    <div key={i} className="border-b pb-2 last:border-0">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">{d.nome}</span>
                        <span className="font-medium text-amber-600">{formatCurrency(d.imposta)}</span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Valore: {formatCurrency(d.valore)} - Aliquota: {d.aliquota.toFixed(2)}%
                      </p>
                    </div>
                  ))}
                  <div className="pt-2 border-t-2 flex justify-between font-medium">
                    <span>Totale IVIE</span>
                    <span className="text-amber-600">{formatCurrency(risultati.totaleIVIE)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quadro RW */}
            <div className="bg-white rounded-card p-6 shadow-sm border-2 border-forest/20">
              <h3 className="font-heading text-lg text-forest mb-4">Quadro RW - Riepilogo</h3>
              <p className="text-xs text-gray-500 mb-4">
                Da compilare nella dichiarazione dei redditi per monitoraggio fiscale
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Asset finanziari</span>
                  <span className="font-medium">{formatCurrency(risultati.quadroRW.totaleFinanziario)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Immobili</span>
                  <span className="font-medium">{formatCurrency(risultati.quadroRW.totaleImmobiliare)}</span>
                </div>
                <div className="pt-2 border-t-2 flex justify-between font-medium text-forest">
                  <span>Totale attivita estere</span>
                  <span>{formatCurrency(risultati.quadroRW.totale)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">Numero posizioni</span>
                  <span className="font-medium">{risultati.quadroRW.numAsset}</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-xs text-yellow-800">
                  <strong>Obbligo di dichiarazione</strong> per attivita superiori a EUR 15.000 (conti)
                  o qualsiasi importo per investimenti e immobili.
                </p>
              </div>
            </div>
          </div>

          {/* Confronto Italia vs Estero */}
          <div className="mt-8 bg-white rounded-card p-6 shadow-sm">
            <h3 className="font-heading text-lg text-forest mb-4">Confronto: Detenere in Italia vs Estero</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Costo all&apos;estero (IVAFE + IVIE)</p>
                <p className="font-heading text-2xl text-gray-800">{formatCurrency(risultati.totaleImposte)}</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Costo equivalente in Italia</p>
                <p className="font-heading text-2xl text-gray-800">{formatCurrency(risultati.costoSeInItalia)}</p>
                <p className="text-xs text-gray-400">Bollo 0,2% + IMU media 0,86%</p>
              </div>
              <div className={`text-center p-4 rounded-lg ${risultati.differenza > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                <p className="text-sm text-gray-600 mb-1">Differenza</p>
                <p className={`font-heading text-2xl ${risultati.differenza > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {risultati.differenza > 0 ? '+' : ''}{formatCurrency(risultati.differenza)}
                </p>
                <p className="text-xs text-gray-500">
                  {risultati.differenza > 0 ? 'Estero piu costoso' : 'Estero piu conveniente'}
                </p>
              </div>
            </div>
          </div>

          {/* Info box */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-3">Cos&apos;e l&apos;IVAFE?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Imposta sulle Attivita Finanziarie detenute all&apos;Estero</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Aliquota: 0,2% del valore o EUR 34,20 per conti correnti</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Si applica a: conti, depositi, azioni, ETF, fondi, obbligazioni</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Calcolo pro-rata sui giorni di effettiva detenzione</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-3">Cos&apos;e l&apos;IVIE?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Imposta sul Valore degli Immobili situati all&apos;Estero</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Aliquota: 0,76% (standard) o 1,06% (paradisi fiscali)</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Base imponibile: valore catastale estero o prezzo d&apos;acquisto</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Franchigia: non dovuta se imposta &lt; EUR 200</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Hai attivita all&apos;estero? Ottimizza la tua fiscalita
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            La gestione fiscale degli investimenti internazionali e complessa.
            Ti aiutiamo a strutturare il tuo patrimonio in modo efficiente.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom pb-8">
        <RatingWidget toolSlug="ivafe-ivie" toolName="ivafe-ivie" />
      </div>

      <RelatedTools tools={toolCorrelations['ivafe-ivie']} />

      <Footer />
    </main>
  )
}
