'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer, RelatedTools, toolCorrelations, RatingWidget, ToolPageSchema } from '@/components'

type TipoJet = 'light' | 'midsize' | 'super_midsize' | 'large' | 'ultra_long'
type TipoProprietà = 'possesso_totale' | 'fractional_1_4' | 'fractional_1_8' | 'jet_card' | 'charter'

interface JetConfig {
  nome: string
  esempi: string
  prezzoAcquisto: number
  costoOraVolo: number
  autonomiaOre: number
  passeggeri: number
  hangarAnno: number
  assicurazioneAnno: number
  pilotiAnno: number
  manutAnno: number
}

const jetTypes: Record<TipoJet, JetConfig> = {
  light: {
    nome: 'Light Jet',
    esempi: 'Cessna Citation M2, Phenom 100',
    prezzoAcquisto: 4000000,
    costoOraVolo: 2500,
    autonomiaOre: 4,
    passeggeri: 6,
    hangarAnno: 60000,
    assicurazioneAnno: 40000,
    pilotiAnno: 180000,
    manutAnno: 150000,
  },
  midsize: {
    nome: 'Midsize Jet',
    esempi: 'Citation XLS+, Learjet 60',
    prezzoAcquisto: 10000000,
    costoOraVolo: 3500,
    autonomiaOre: 5,
    passeggeri: 8,
    hangarAnno: 80000,
    assicurazioneAnno: 80000,
    pilotiAnno: 220000,
    manutAnno: 300000,
  },
  super_midsize: {
    nome: 'Super Midsize Jet',
    esempi: 'Citation Longitude, Challenger 350',
    prezzoAcquisto: 22000000,
    costoOraVolo: 4500,
    autonomiaOre: 6,
    passeggeri: 10,
    hangarAnno: 100000,
    assicurazioneAnno: 150000,
    pilotiAnno: 280000,
    manutAnno: 450000,
  },
  large: {
    nome: 'Large Cabin Jet',
    esempi: 'Gulfstream G450, Falcon 900',
    prezzoAcquisto: 40000000,
    costoOraVolo: 6000,
    autonomiaOre: 8,
    passeggeri: 14,
    hangarAnno: 150000,
    assicurazioneAnno: 250000,
    pilotiAnno: 350000,
    manutAnno: 700000,
  },
  ultra_long: {
    nome: 'Ultra Long Range',
    esempi: 'Gulfstream G650, Global 7500',
    prezzoAcquisto: 70000000,
    costoOraVolo: 8000,
    autonomiaOre: 12,
    passeggeri: 16,
    hangarAnno: 200000,
    assicurazioneAnno: 400000,
    pilotiAnno: 450000,
    manutAnno: 1200000,
  },
}

const proprietaOptions: Record<TipoProprietà, { nome: string; descrizione: string; quotaAcquisto: number; quotaCostiFissi: number }> = {
  possesso_totale: {
    nome: 'Possesso Totale (100%)',
    descrizione: 'Proprietà completa del velivolo',
    quotaAcquisto: 1,
    quotaCostiFissi: 1,
  },
  fractional_1_4: {
    nome: 'Fractional 1/4',
    descrizione: '200 ore/anno garantite, costi condivisi',
    quotaAcquisto: 0.25,
    quotaCostiFissi: 0.30, // leggermente superiore per gestione
  },
  fractional_1_8: {
    nome: 'Fractional 1/8',
    descrizione: '100 ore/anno garantite, entry-level fractional',
    quotaAcquisto: 0.125,
    quotaCostiFissi: 0.18,
  },
  jet_card: {
    nome: 'Jet Card (25 ore)',
    descrizione: 'Prepagato, no proprietà, massima flessibilità',
    quotaAcquisto: 0,
    quotaCostiFissi: 0,
  },
  charter: {
    nome: 'Charter On-Demand',
    descrizione: 'Noleggio a viaggio, zero impegno',
    quotaAcquisto: 0,
    quotaCostiFissi: 0,
  },
}

export default function CalcolatoreCostoJet() {
  const [tipoJet, setTipoJet] = useState<TipoJet>('midsize')
  const [tipoProprieta, setTipoProprieta] = useState<TipoProprietà>('possesso_totale')
  const [oreVoloAnno, setOreVoloAnno] = useState(150)
  const [bandieraEstera, setBandieraEstera] = useState(false)

  const jet = jetTypes[tipoJet]
  const proprieta = proprietaOptions[tipoProprieta]

  const risultati = useMemo(() => {
    // Costo acquisto (quota)
    const costoAcquisto = jet.prezzoAcquisto * proprieta.quotaAcquisto

    // Costi fissi annui
    const costiFissiBase = jet.hangarAnno + jet.assicurazioneAnno + jet.pilotiAnno + jet.manutAnno
    const costiFissi = costiFissiBase * proprieta.quotaCostiFissi

    // Costi variabili (ore volo)
    let costiVariabili = 0
    if (tipoProprieta === 'jet_card') {
      // Jet card: prezzo premium ~30% sopra costo orario
      costiVariabili = jet.costoOraVolo * 1.3 * oreVoloAnno
    } else if (tipoProprieta === 'charter') {
      // Charter: prezzo premium ~50% sopra
      costiVariabili = jet.costoOraVolo * 1.5 * oreVoloAnno
    } else {
      // Possesso/fractional: carburante + manutenzione variabile
      costiVariabili = jet.costoOraVolo * oreVoloAnno
    }

    // IVIE se registrato estero (0.76%)
    const costoIVIE = bandieraEstera ? costoAcquisto * 0.0076 : 0

    // Management fee (per fractional)
    const managementFee = proprieta.quotaAcquisto > 0 && proprieta.quotaAcquisto < 1
      ? costoAcquisto * 0.05
      : 0

    // Totale annuo
    const costoAnnuoTotale = costiFissi + costiVariabili + costoIVIE + managementFee

    // Costo per ora di volo effettiva
    const costoPerOra = oreVoloAnno > 0 ? costoAnnuoTotale / oreVoloAnno : 0

    // Ammortamento (15% primo anno, 8% successivi)
    const ammortamentoAnnuo = costoAcquisto * 0.08

    // Confronto con charter puro
    const costoCharterEquivalente = jet.costoOraVolo * 1.5 * oreVoloAnno

    return {
      costoAcquisto,
      costiFissi,
      costiVariabili,
      costoIVIE,
      managementFee,
      costoAnnuoTotale,
      costoPerOra,
      ammortamentoAnnuo,
      costoTotaleConAmmortamento: costoAnnuoTotale + ammortamentoAnnuo,
      costoCharterEquivalente,
      convenientePossesso: costoAnnuoTotale < costoCharterEquivalente,
      breakEvenOre: costiFissi > 0
        ? Math.round(costiFissi / (jet.costoOraVolo * 0.5))
        : 0,
    }
  }, [tipoJet, tipoProprieta, oreVoloAnno, bandieraEstera, jet, proprieta])

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
        notation: 'compact',
      }).format(value)
    }
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <main>
      <ToolPageSchema slug="costo-jet-privato" />
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
            Calcolatore Costo Jet Privato
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Confronta possesso totale, fractional ownership, jet card e charter.
            Calcola il costo reale per ora di volo.
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
              <p className="text-white/60 text-xs mt-1">Per {oreVoloAnno} ore di volo</p>
            </div>
            <div className="bg-green-600 rounded-card p-6 text-white">
              <p className="text-white/80 text-sm mb-1">Costo per Ora di Volo</p>
              <p className="font-heading text-3xl">{formatCurrency(risultati.costoPerOra)}</p>
              <p className="text-white/60 text-xs mt-1">Tutto incluso</p>
            </div>
            <div className={`rounded-card p-6 text-white ${risultati.convenientePossesso ? 'bg-green-500' : 'bg-amber-600'}`}>
              <p className="text-white/80 text-sm mb-1">vs Charter On-Demand</p>
              <p className="font-heading text-3xl">
                {risultati.convenientePossesso ? 'Conviene' : 'Non conviene'}
              </p>
              <p className="text-white/60 text-xs mt-1">
                Charter: {formatCurrency(risultati.costoCharterEquivalente)}/anno
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configurazione */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-heading text-xl text-forest">Configurazione</h2>
                  <p className="text-xs text-gray-500">Seleziona tipo jet e modalita</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Tipo Jet */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria jet</label>
                  <select
                    value={tipoJet}
                    onChange={(e) => setTipoJet(e.target.value as TipoJet)}
                    className="w-full px-4 py-3 border rounded-lg text-sm"
                  >
                    {Object.entries(jetTypes).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.nome} - {val.esempi} ({formatCurrency(val.prezzoAcquisto)})
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-500">
                    <div>Autonomia: {jet.autonomiaOre}h</div>
                    <div>Passeggeri: {jet.passeggeri}</div>
                    <div>Costo/ora: {formatCurrency(jet.costoOraVolo)}</div>
                  </div>
                </div>

                {/* Tipo Proprieta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Modalita di accesso</label>
                  <select
                    value={tipoProprieta}
                    onChange={(e) => setTipoProprieta(e.target.value as TipoProprietà)}
                    className="w-full px-4 py-3 border rounded-lg text-sm"
                  >
                    {Object.entries(proprietaOptions).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.nome}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-400">{proprieta.descrizione}</p>
                </div>

                {/* Ore Volo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ore di volo/anno: {oreVoloAnno}
                  </label>
                  <input
                    type="range"
                    min="25"
                    max="500"
                    step="25"
                    value={oreVoloAnno}
                    onChange={(e) => setOreVoloAnno(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>25h</span>
                    <span>250h</span>
                    <span>500h</span>
                  </div>
                </div>

                {/* IVIE */}
                {proprieta.quotaAcquisto > 0 && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      id="ivie"
                      checked={bandieraEstera}
                      onChange={(e) => setBandieraEstera(e.target.checked)}
                      className="w-4 h-4 accent-forest"
                    />
                    <label htmlFor="ivie" className="text-sm text-gray-700">
                      Registrazione estera (IVIE 0,76%)
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-heading text-xl text-forest">Breakdown Costi</h2>
                  <p className="text-xs text-gray-500">Dettaglio voci di spesa annue</p>
                </div>
              </div>

              <div className="space-y-4">
                {risultati.costoAcquisto > 0 && (
                  <div className="p-3 bg-forest/5 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">Investimento iniziale (quota)</span>
                      <span className="font-heading text-lg text-forest">{formatCurrency(risultati.costoAcquisto)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Ammortamento: {formatCurrency(risultati.ammortamentoAnnuo)}/anno</p>
                  </div>
                )}

                {risultati.costiFissi > 0 && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Costi fissi (hangar, piloti, assic.)</span>
                    <span className="font-medium text-forest">{formatCurrency(risultati.costiFissi)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Costi variabili ({oreVoloAnno} ore)</span>
                  <span className="font-medium text-forest">{formatCurrency(risultati.costiVariabili)}</span>
                </div>

                {risultati.costoIVIE > 0 && (
                  <div className="flex justify-between items-center py-2 border-b bg-amber-50 -mx-2 px-2 rounded">
                    <span className="text-sm text-amber-800">IVIE (registrazione estera)</span>
                    <span className="font-medium text-amber-600">{formatCurrency(risultati.costoIVIE)}</span>
                  </div>
                )}

                {risultati.managementFee > 0 && (
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-sm text-gray-600">Management fee (fractional)</span>
                    <span className="font-medium text-forest">{formatCurrency(risultati.managementFee)}</span>
                  </div>
                )}

                <div className="pt-4 border-t-2 border-forest">
                  <div className="flex justify-between items-center">
                    <span className="font-heading text-lg text-forest">Totale Annuo</span>
                    <span className="font-heading text-2xl text-forest">{formatCurrency(risultati.costoAnnuoTotale)}</span>
                  </div>
                  {risultati.ammortamentoAnnuo > 0 && (
                    <p className="text-xs text-gray-400 mt-1 text-right">
                      Con ammortamento: {formatCurrency(risultati.costoTotaleConAmmortamento)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Break-even analysis */}
          {risultati.breakEvenOre > 0 && (
            <div className="mt-8 bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">Analisi Break-Even: Quando conviene possedere?</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Break-even</p>
                  <p className="font-heading text-2xl text-forest">{risultati.breakEvenOre}h</p>
                  <p className="text-xs text-gray-400">ore/anno</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Il tuo utilizzo</p>
                  <p className="font-heading text-2xl text-gray-800">{oreVoloAnno}h</p>
                  <p className="text-xs text-gray-400">ore/anno</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Costo/ora possesso</p>
                  <p className="font-heading text-2xl text-forest">{formatCurrency(risultati.costoPerOra)}</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Costo/ora charter</p>
                  <p className="font-heading text-2xl text-gray-800">{formatCurrency(jet.costoOraVolo * 1.5)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Info boxes */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-3">Possesso vs Fractional vs Charter</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-20 font-medium text-forest flex-shrink-0">&lt;50h/anno</span>
                  <span>Charter on-demand e la scelta piu razionale</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-20 font-medium text-forest flex-shrink-0">50-150h</span>
                  <span>Jet card o fractional 1/8 offrono buon compromesso</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-20 font-medium text-forest flex-shrink-0">150-300h</span>
                  <span>Fractional 1/4 o possesso condiviso</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-20 font-medium text-forest flex-shrink-0">&gt;300h</span>
                  <span>Possesso totale diventa competitivo</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-3">Costi nascosti da considerare</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Deadhead flights</strong>: voli vuoti per riposizionamento</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Manutenzioni impreviste</strong>: budget +15-20%</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Crew training</strong>: addestramento ricorrente piloti</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Upgrade avionica</strong>: mandati normativi periodici</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Vuoi ottimizzare i costi della mobilita premium?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Per patrimoni oltre 150K, offriamo consulenza su come strutturare
            al meglio le spese per beni di lusso e mobilita.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      <div className="container-custom pb-8">
        <RatingWidget toolSlug="costo-jet-privato" toolName="costo-jet-privato" />
      </div>

      <RelatedTools tools={toolCorrelations['costo-jet-privato'] || []} />

      <Footer />
    </main>
  )
}
