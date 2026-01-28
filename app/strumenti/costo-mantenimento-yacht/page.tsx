'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer, RelatedTools, toolCorrelations, RatingWidget, ToolPageSchema } from '@/components'

type TipoMarina = 'mediterraneo_standard' | 'mediterraneo_premium' | 'caraibi' | 'nord_europa'
type TipoEquipaggio = 'nessuno' | 'solo_capitano' | 'capitano_marinaio' | 'equipaggio_completo'
type Bandiera = 'italiana' | 'ue' | 'extra_ue' | 'paradiso'

interface CostiMarina {
  nome: string
  costoMetroAnno: number
  descrizione: string
}

interface CostiEquipaggio {
  nome: string
  costoAnnuo: number
  descrizione: string
}

const marineOptions: Record<TipoMarina, CostiMarina> = {
  mediterraneo_standard: {
    nome: 'Mediterraneo Standard',
    costoMetroAnno: 800,
    descrizione: 'Sardegna, Croazia, Grecia'
  },
  mediterraneo_premium: {
    nome: 'Mediterraneo Premium',
    costoMetroAnno: 2500,
    descrizione: 'Monaco, Porto Cervo, St. Tropez'
  },
  caraibi: {
    nome: 'Caraibi',
    costoMetroAnno: 600,
    descrizione: 'BVI, Bahamas, St. Martin'
  },
  nord_europa: {
    nome: 'Nord Europa',
    costoMetroAnno: 500,
    descrizione: 'Olanda, Germania, Scandinavia'
  }
}

const equipaggioOptions: Record<TipoEquipaggio, CostiEquipaggio> = {
  nessuno: {
    nome: 'Nessun equipaggio fisso',
    costoAnnuo: 0,
    descrizione: 'Gestione in autonomia o skipper a chiamata'
  },
  solo_capitano: {
    nome: 'Solo Capitano',
    costoAnnuo: 72000,
    descrizione: 'Capitano full-time (alloggio incluso)'
  },
  capitano_marinaio: {
    nome: 'Capitano + Marinaio',
    costoAnnuo: 114000,
    descrizione: 'Equipaggio base per yacht 20-30m'
  },
  equipaggio_completo: {
    nome: 'Equipaggio completo',
    costoAnnuo: 240000,
    descrizione: 'Capitano, marinaio, stewardess, chef'
  }
}

const bandiereOptions: Record<Bandiera, { nome: string; ivie: boolean; aliquota: number }> = {
  italiana: { nome: 'Bandiera Italiana', ivie: false, aliquota: 0 },
  ue: { nome: 'Bandiera UE (Malta, Olanda)', ivie: true, aliquota: 0.0076 },
  extra_ue: { nome: 'Bandiera Extra-UE (Cayman, BVI)', ivie: true, aliquota: 0.0076 },
  paradiso: { nome: 'Paradiso Fiscale', ivie: true, aliquota: 0.0106 }
}

export default function CalcolatoreCostoYacht() {
  const [lunghezza, setLunghezza] = useState(20)
  const [valoreYacht, setValoreYacht] = useState(800000)
  const [tipoMarina, setTipoMarina] = useState<TipoMarina>('mediterraneo_standard')
  const [tipoEquipaggio, setTipoEquipaggio] = useState<TipoEquipaggio>('nessuno')
  const [bandiera, setBandiera] = useState<Bandiera>('italiana')
  const [settimaneUso, setSettimaneUso] = useState(6)
  const [consumoOrario, setConsumoOrario] = useState(80) // litri/ora
  const [oreNavigazione, setOreNavigazione] = useState(100) // ore/anno

  const risultati = useMemo(() => {
    // Ormeggio
    const costoOrmeggio = lunghezza * marineOptions[tipoMarina].costoMetroAnno

    // Equipaggio
    const costoEquipaggio = equipaggioOptions[tipoEquipaggio].costoAnnuo

    // Assicurazione (1.5-2.5% del valore, usiamo 2%)
    const costoAssicurazione = valoreYacht * 0.02

    // Manutenzione (regola del 10% - include antivegetativa, motori, elettronica, interni)
    const costoManutenzione = valoreYacht * 0.10

    // Carburante (diesel marino ~1.2€/litro)
    const costoCarburante = consumoOrario * oreNavigazione * 1.2

    // Licenze, permessi, registrazione
    const costoLicenze = 3000 + (lunghezza > 24 ? 2000 : 0)

    // IVIE (se bandiera estera)
    const configBandiera = bandiereOptions[bandiera]
    const costoIVIE = configBandiera.ivie ? valoreYacht * configBandiera.aliquota : 0

    // Tassa di stazionamento (Italia, per yacht >10m)
    const tassaStazionamento = lunghezza > 10 ? lunghezza * 30 : 0

    // Totali
    const costoAnnuoTotale = costoOrmeggio + costoEquipaggio + costoAssicurazione +
                            costoManutenzione + costoCarburante + costoLicenze +
                            costoIVIE + tassaStazionamento

    // Costo per settimana di utilizzo effettivo
    const costoPerSettimana = settimaneUso > 0 ? costoAnnuoTotale / settimaneUso : 0

    // Confronto con charter (stima: 15-25% valore yacht per settimana in alta stagione)
    const costoCharterSettimana = valoreYacht * 0.01 // ~1% del valore per settimana (semplificato)
    const costoCharterEquivalente = costoCharterSettimana * settimaneUso

    // Ammortamento ipotetico (20% primo anno, 10% successivi)
    const ammortamentoAnnuo = valoreYacht * 0.10

    return {
      costoOrmeggio,
      costoEquipaggio,
      costoAssicurazione,
      costoManutenzione,
      costoCarburante,
      costoLicenze,
      costoIVIE,
      tassaStazionamento,
      costoAnnuoTotale,
      costoPerSettimana,
      costoCharterSettimana,
      costoCharterEquivalente,
      ammortamentoAnnuo,
      costoTotaleConAmmortamento: costoAnnuoTotale + ammortamentoAnnuo,
      percentualeValore: (costoAnnuoTotale / valoreYacht) * 100
    }
  }, [lunghezza, valoreYacht, tipoMarina, tipoEquipaggio, bandiera, settimaneUso, consumoOrario, oreNavigazione])

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
    }).format(value / 100)
  }

  return (
    <main>
      <ToolPageSchema slug="costo-mantenimento-yacht" />
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
            Calcolatore Costo Mantenimento Yacht
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Calcola i costi reali di possesso di uno yacht: ormeggio, equipaggio,
            manutenzione, assicurazione e fiscalita (IVIE).
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          {/* Risultato principale */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-forest rounded-card p-6 text-white">
              <p className="text-white/80 text-sm mb-1">Costo Annuo Totale</p>
              <p className="font-heading text-3xl">{formatCurrency(risultati.costoAnnuoTotale)}</p>
              <p className="text-white/60 text-xs mt-1">{formatPercent(risultati.percentualeValore)} del valore yacht</p>
            </div>
            <div className="bg-green-600 rounded-card p-6 text-white">
              <p className="text-white/80 text-sm mb-1">Costo per Settimana di Uso</p>
              <p className="font-heading text-3xl">{formatCurrency(risultati.costoPerSettimana)}</p>
              <p className="text-white/60 text-xs mt-1">Basato su {settimaneUso} settimane/anno</p>
            </div>
            <div className="bg-amber-600 rounded-card p-6 text-white">
              <p className="text-white/80 text-sm mb-1">Con Ammortamento</p>
              <p className="font-heading text-3xl">{formatCurrency(risultati.costoTotaleConAmmortamento)}</p>
              <p className="text-white/60 text-xs mt-1">Include svalutazione ~10%/anno</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configurazione Yacht */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-heading text-xl text-forest">Configurazione Yacht</h2>
                  <p className="text-xs text-gray-500">Inserisci i dati del tuo yacht</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Lunghezza */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lunghezza: {lunghezza} metri
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={lunghezza}
                    onChange={(e) => setLunghezza(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>10m</span>
                    <span>30m</span>
                    <span>50m</span>
                  </div>
                </div>

                {/* Valore */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valore yacht: {formatCurrency(valoreYacht)}
                  </label>
                  <input
                    type="range"
                    min="200000"
                    max="10000000"
                    step="100000"
                    value={valoreYacht}
                    onChange={(e) => setValoreYacht(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>200K</span>
                    <span>5M</span>
                    <span>10M</span>
                  </div>
                </div>

                {/* Marina */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location ormeggio</label>
                  <select
                    value={tipoMarina}
                    onChange={(e) => setTipoMarina(e.target.value as TipoMarina)}
                    className="w-full px-4 py-3 border rounded-lg text-sm"
                  >
                    {Object.entries(marineOptions).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.nome} - {val.descrizione} ({formatCurrency(val.costoMetroAnno)}/m/anno)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Equipaggio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Equipaggio</label>
                  <select
                    value={tipoEquipaggio}
                    onChange={(e) => setTipoEquipaggio(e.target.value as TipoEquipaggio)}
                    className="w-full px-4 py-3 border rounded-lg text-sm"
                  >
                    {Object.entries(equipaggioOptions).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.nome} {val.costoAnnuo > 0 ? `(${formatCurrency(val.costoAnnuo)}/anno)` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bandiera */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bandiera di registrazione</label>
                  <select
                    value={bandiera}
                    onChange={(e) => setBandiera(e.target.value as Bandiera)}
                    className="w-full px-4 py-3 border rounded-lg text-sm"
                  >
                    {Object.entries(bandiereOptions).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.nome} {val.ivie ? `(IVIE: ${(val.aliquota * 100).toFixed(2)}%)` : '(No IVIE)'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Utilizzo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Settimane di utilizzo/anno: {settimaneUso}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={settimaneUso}
                    onChange={(e) => setSettimaneUso(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1</span>
                    <span>10</span>
                    <span>20</span>
                  </div>
                </div>

                {/* Consumo e navigazione */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Consumo (L/ora)</label>
                    <input
                      type="number"
                      value={consumoOrario}
                      onChange={(e) => setConsumoOrario(Number(e.target.value))}
                      className="w-full px-4 py-3 border rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ore navigazione/anno</label>
                    <input
                      type="number"
                      value={oreNavigazione}
                      onChange={(e) => setOreNavigazione(Number(e.target.value))}
                      className="w-full px-4 py-3 border rounded-lg text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Breakdown costi */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-heading text-xl text-forest">Breakdown Costi Annui</h2>
                  <p className="text-xs text-gray-500">Dettaglio delle voci di spesa</p>
                </div>
              </div>

              <div className="space-y-4">
                <CostRow
                  label="Ormeggio / Marina"
                  value={risultati.costoOrmeggio}
                  percent={(risultati.costoOrmeggio / risultati.costoAnnuoTotale) * 100}
                  formatCurrency={formatCurrency}
                />
                <CostRow
                  label="Equipaggio"
                  value={risultati.costoEquipaggio}
                  percent={(risultati.costoEquipaggio / risultati.costoAnnuoTotale) * 100}
                  formatCurrency={formatCurrency}
                />
                <CostRow
                  label="Manutenzione (10% valore)"
                  value={risultati.costoManutenzione}
                  percent={(risultati.costoManutenzione / risultati.costoAnnuoTotale) * 100}
                  formatCurrency={formatCurrency}
                />
                <CostRow
                  label="Assicurazione (2% valore)"
                  value={risultati.costoAssicurazione}
                  percent={(risultati.costoAssicurazione / risultati.costoAnnuoTotale) * 100}
                  formatCurrency={formatCurrency}
                />
                <CostRow
                  label="Carburante"
                  value={risultati.costoCarburante}
                  percent={(risultati.costoCarburante / risultati.costoAnnuoTotale) * 100}
                  formatCurrency={formatCurrency}
                />
                <CostRow
                  label="Licenze e registrazione"
                  value={risultati.costoLicenze}
                  percent={(risultati.costoLicenze / risultati.costoAnnuoTotale) * 100}
                  formatCurrency={formatCurrency}
                />
                {risultati.costoIVIE > 0 && (
                  <CostRow
                    label="IVIE (bandiera estera)"
                    value={risultati.costoIVIE}
                    percent={(risultati.costoIVIE / risultati.costoAnnuoTotale) * 100}
                    formatCurrency={formatCurrency}
                    highlight
                  />
                )}
                <CostRow
                  label="Tassa stazionamento Italia"
                  value={risultati.tassaStazionamento}
                  percent={(risultati.tassaStazionamento / risultati.costoAnnuoTotale) * 100}
                  formatCurrency={formatCurrency}
                />

                <div className="pt-4 border-t-2 border-forest">
                  <div className="flex justify-between items-center">
                    <span className="font-heading text-lg text-forest">Totale Annuo</span>
                    <span className="font-heading text-2xl text-forest">{formatCurrency(risultati.costoAnnuoTotale)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Confronto Charter */}
          <div className="mt-8 bg-white rounded-card p-6 shadow-sm">
            <h3 className="font-heading text-lg text-forest mb-4">Possesso vs Charter: Conviene comprare?</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Costo possesso per {settimaneUso} settimane</p>
                <p className="font-heading text-2xl text-forest">{formatCurrency(risultati.costoAnnuoTotale)}</p>
                <p className="text-xs text-gray-400">+ {formatCurrency(risultati.ammortamentoAnnuo)} ammortamento</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Charter equivalente ({settimaneUso} settimane)</p>
                <p className="font-heading text-2xl text-gray-800">{formatCurrency(risultati.costoCharterEquivalente)}</p>
                <p className="text-xs text-gray-400">{formatCurrency(risultati.costoCharterSettimana)}/settimana stimato</p>
              </div>
              <div className={`text-center p-4 rounded-lg ${
                risultati.costoAnnuoTotale > risultati.costoCharterEquivalente ? 'bg-red-50' : 'bg-green-50'
              }`}>
                <p className="text-sm text-gray-600 mb-1">Differenza</p>
                <p className={`font-heading text-2xl ${
                  risultati.costoAnnuoTotale > risultati.costoCharterEquivalente ? 'text-red-600' : 'text-green-600'
                }`}>
                  {risultati.costoAnnuoTotale > risultati.costoCharterEquivalente ? '+' : ''}
                  {formatCurrency(risultati.costoAnnuoTotale - risultati.costoCharterEquivalente)}
                </p>
                <p className="text-xs text-gray-500">
                  {risultati.costoAnnuoTotale > risultati.costoCharterEquivalente
                    ? 'Charter piu conveniente'
                    : 'Possesso piu conveniente'}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center">
              * Il charter conviene tipicamente per usi &lt;8-10 settimane/anno. Oltre, il possesso diventa competitivo.
            </p>
          </div>

          {/* Info boxes */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-3">La regola del 10%</h3>
              <p className="text-sm text-gray-600 mb-4">
                Nel settore nautico si usa la &quot;regola del 10%&quot;: il costo annuo di mantenimento
                di uno yacht e circa il 10% del suo valore di acquisto.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Yacht 500K = circa 50K/anno di mantenimento</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Yacht 2M = circa 200K/anno di mantenimento</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Con equipaggio full-time, si arriva al 15-20%</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-3">IVIE su yacht esteri</h3>
              <p className="text-sm text-gray-600 mb-4">
                Se il tuo yacht e registrato sotto bandiera estera, sei soggetto all&apos;IVIE
                (Imposta sul Valore degli Immobili all&apos;Estero), anche se si tratta di un bene mobile.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span><strong>0,76%</strong> per bandiere UE ed extra-UE</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span><strong>1,06%</strong> per paradisi fiscali (Cayman, BVI, etc.)</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Bandiera italiana = niente IVIE</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Stai valutando un acquisto importante?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Per patrimoni oltre 150K, offriamo consulenza personalizzata su come
            strutturare al meglio i tuoi investimenti in beni di lusso.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      <div className="container-custom pb-8">
        <RatingWidget toolSlug="costo-mantenimento-yacht" toolName="costo-mantenimento-yacht" />
      </div>

      <RelatedTools tools={toolCorrelations['costo-mantenimento-yacht'] || []} />

      <Footer />
    </main>
  )
}

function CostRow({
  label,
  value,
  percent,
  formatCurrency,
  highlight = false
}: {
  label: string
  value: number
  percent: number
  formatCurrency: (v: number) => string
  highlight?: boolean
}) {
  if (value === 0) return null

  return (
    <div className={`${highlight ? 'bg-amber-50 -mx-2 px-2 py-2 rounded-lg' : ''}`}>
      <div className="flex justify-between items-center mb-1">
        <span className={`text-sm ${highlight ? 'text-amber-800 font-medium' : 'text-gray-600'}`}>{label}</span>
        <span className={`font-medium ${highlight ? 'text-amber-600' : 'text-forest'}`}>{formatCurrency(value)}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${highlight ? 'bg-amber-400' : 'bg-green-400'}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
    </div>
  )
}
