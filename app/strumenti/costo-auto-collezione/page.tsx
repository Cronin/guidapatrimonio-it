'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer, RelatedTools, toolCorrelations, RatingWidget, ToolPageSchema } from '@/components'

type TipoAuto = 'supercar_moderna' | 'hypercar' | 'classica_anni60' | 'classica_anni70' | 'youngtimer'
type TipoStorage = 'garage_privato' | 'storage_climatizzato' | 'concierge_premium'
type TipoAssicurazione = 'standard' | 'agreed_value' | 'collezione'

interface AutoConfig {
  nome: string
  esempi: string
  valoreMin: number
  valoreMax: number
  assicurazionePct: number
  manutenzionePct: number
  svalutazioneAnnua: number
}

const autoTypes: Record<TipoAuto, AutoConfig> = {
  supercar_moderna: {
    nome: 'Supercar Moderna',
    esempi: 'Ferrari 296, Lamborghini Huracan, McLaren 720S',
    valoreMin: 250000,
    valoreMax: 500000,
    assicurazionePct: 0.015,
    manutenzionePct: 0.03,
    svalutazioneAnnua: -0.08,
  },
  hypercar: {
    nome: 'Hypercar',
    esempi: 'Ferrari SF90, Porsche 918, McLaren P1',
    valoreMin: 800000,
    valoreMax: 3000000,
    assicurazionePct: 0.012,
    manutenzionePct: 0.025,
    svalutazioneAnnua: 0.05, // apprezzamento
  },
  classica_anni60: {
    nome: 'Classica Anni 60',
    esempi: 'Ferrari 250, Porsche 911 S, Jaguar E-Type',
    valoreMin: 200000,
    valoreMax: 5000000,
    assicurazionePct: 0.008,
    manutenzionePct: 0.04,
    svalutazioneAnnua: 0.08, // apprezzamento storico
  },
  classica_anni70: {
    nome: 'Classica Anni 70-80',
    esempi: 'Ferrari 308, Porsche 930, BMW M1',
    valoreMin: 100000,
    valoreMax: 800000,
    assicurazionePct: 0.010,
    manutenzionePct: 0.035,
    svalutazioneAnnua: 0.06,
  },
  youngtimer: {
    nome: 'Youngtimer (1990-2005)',
    esempi: 'Ferrari F355, Porsche 993, BMW E30 M3',
    valoreMin: 80000,
    valoreMax: 400000,
    assicurazionePct: 0.012,
    manutenzionePct: 0.025,
    svalutazioneAnnua: 0.04,
  },
}

const storageOptions: Record<TipoStorage, { nome: string; costoMese: number; descrizione: string }> = {
  garage_privato: {
    nome: 'Garage Privato',
    costoMese: 0,
    descrizione: 'Box di proprietà o in affitto standard',
  },
  storage_climatizzato: {
    nome: 'Storage Climatizzato',
    costoMese: 400,
    descrizione: 'Deposito specializzato con clima controllato',
  },
  concierge_premium: {
    nome: 'Concierge Premium',
    costoMese: 1200,
    descrizione: 'Storage + manutenzione + preparazione su richiesta',
  },
}

const assicurazioneOptions: Record<TipoAssicurazione, { nome: string; moltiplicatore: number; descrizione: string }> = {
  standard: {
    nome: 'Polizza Standard',
    moltiplicatore: 1,
    descrizione: 'Copertura base, valore commerciale',
  },
  agreed_value: {
    nome: 'Agreed Value',
    moltiplicatore: 1.3,
    descrizione: 'Valore concordato, perizia inclusa',
  },
  collezione: {
    nome: 'Polizza Collezione',
    moltiplicatore: 0.8,
    descrizione: 'Multi-veicolo, km limitati, premio ridotto',
  },
}

export default function CalcolatoreCostoAutoCollezione() {
  const [tipoAuto, setTipoAuto] = useState<TipoAuto>('supercar_moderna')
  const [valoreAuto, setValoreAuto] = useState(350000)
  const [tipoStorage, setTipoStorage] = useState<TipoStorage>('garage_privato')
  const [tipoAssicurazione, setTipoAssicurazione] = useState<TipoAssicurazione>('agreed_value')
  const [kmAnno, setKmAnno] = useState(3000)
  const [eventiAnno, setEventiAnno] = useState(4) // raduni, track day, etc.

  const auto = autoTypes[tipoAuto]
  const storage = storageOptions[tipoStorage]
  const assicurazione = assicurazioneOptions[tipoAssicurazione]

  const risultati = useMemo(() => {
    // Assicurazione
    const costoAssicurazione = valoreAuto * auto.assicurazionePct * assicurazione.moltiplicatore

    // Manutenzione (base + km)
    const manutBase = valoreAuto * auto.manutenzionePct
    const manutKm = (kmAnno / 1000) * 500 // 500€ ogni 1000km extra
    const costoManutenzione = manutBase + manutKm

    // Storage
    const costoStorage = storage.costoMese * 12

    // Bollo (superbollo per auto >185kW)
    const kw = valoreAuto > 500000 ? 450 : valoreAuto > 200000 ? 350 : 250
    const bollo = kw > 185 ? 800 + (kw - 185) * 20 : 500

    // Revisione e tagliandi
    const revisioneTagliandi = 2000

    // Eventi (raduni, track day)
    const costoEventi = eventiAnno * 800

    // Trasporto (per eventi lontani)
    const costoTrasporto = eventiAnno > 2 ? eventiAnno * 400 : 0

    // Totale costi annui
    const costoAnnuoTotale = costoAssicurazione + costoManutenzione + costoStorage +
                            bollo + revisioneTagliandi + costoEventi + costoTrasporto

    // Variazione valore (apprezzamento o svalutazione)
    const variazioneValore = valoreAuto * auto.svalutazioneAnnua

    // Costo netto (costi - apprezzamento)
    const costoNetto = costoAnnuoTotale - variazioneValore

    // Costo per km
    const costoPerKm = kmAnno > 0 ? costoAnnuoTotale / kmAnno : 0

    // Costo per uso (considerando eventi)
    const usiTotali = Math.max(eventiAnno * 2 + Math.floor(kmAnno / 100), 1) // stima uscite
    const costoPerUso = costoAnnuoTotale / usiTotali

    return {
      costoAssicurazione,
      costoManutenzione,
      costoStorage,
      bollo,
      revisioneTagliandi,
      costoEventi,
      costoTrasporto,
      costoAnnuoTotale,
      variazioneValore,
      costoNetto,
      costoPerKm,
      costoPerUso,
      apprezza: auto.svalutazioneAnnua > 0,
    }
  }, [tipoAuto, valoreAuto, tipoStorage, tipoAssicurazione, kmAnno, eventiAnno, auto, storage, assicurazione])

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
      <ToolPageSchema slug="costo-auto-collezione" />
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
            Calcolatore Costo Auto da Collezione
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Supercar, hypercar e auto storiche: calcola i costi reali di
            assicurazione, manutenzione, storage e apprezzamento.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          {/* Risultato principale */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="bg-forest rounded-card p-6 text-white">
              <p className="text-white/80 text-sm mb-1">Costi Annui Totali</p>
              <p className="font-heading text-3xl">{formatCurrency(risultati.costoAnnuoTotale)}</p>
              <p className="text-white/60 text-xs mt-1">
                {((risultati.costoAnnuoTotale / valoreAuto) * 100).toFixed(1)}% del valore
              </p>
            </div>
            <div className={`rounded-card p-6 text-white ${risultati.apprezza ? 'bg-green-500' : 'bg-amber-600'}`}>
              <p className="text-white/80 text-sm mb-1">Variazione Valore</p>
              <p className="font-heading text-3xl">
                {risultati.variazioneValore >= 0 ? '+' : ''}{formatCurrency(risultati.variazioneValore)}
              </p>
              <p className="text-white/60 text-xs mt-1">
                {risultati.apprezza ? 'Apprezzamento stimato' : 'Svalutazione stimata'}
              </p>
            </div>
            <div className={`rounded-card p-6 text-white ${risultati.costoNetto <= 0 ? 'bg-green-600' : 'bg-gray-700'}`}>
              <p className="text-white/80 text-sm mb-1">Costo Netto Annuo</p>
              <p className="font-heading text-3xl">{formatCurrency(risultati.costoNetto)}</p>
              <p className="text-white/60 text-xs mt-1">
                {risultati.costoNetto <= 0 ? 'Investimento che rende!' : 'Costi - apprezzamento'}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configurazione */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="font-heading text-xl text-forest">Configurazione</h2>
                  <p className="text-xs text-gray-500">Seleziona tipo auto e utilizzo</p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Tipo Auto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria auto</label>
                  <select
                    value={tipoAuto}
                    onChange={(e) => {
                      const newType = e.target.value as TipoAuto
                      setTipoAuto(newType)
                      const config = autoTypes[newType]
                      setValoreAuto(Math.round((config.valoreMin + config.valoreMax) / 2))
                    }}
                    className="w-full px-4 py-3 border rounded-lg text-sm"
                  >
                    {Object.entries(autoTypes).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.nome} - {val.esempi}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Valore */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valore auto: {formatCurrency(valoreAuto)}
                  </label>
                  <input
                    type="range"
                    min={auto.valoreMin}
                    max={auto.valoreMax}
                    step={10000}
                    value={valoreAuto}
                    onChange={(e) => setValoreAuto(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>{formatCurrency(auto.valoreMin)}</span>
                    <span>{formatCurrency(auto.valoreMax)}</span>
                  </div>
                </div>

                {/* Storage */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo storage</label>
                  <select
                    value={tipoStorage}
                    onChange={(e) => setTipoStorage(e.target.value as TipoStorage)}
                    className="w-full px-4 py-3 border rounded-lg text-sm"
                  >
                    {Object.entries(storageOptions).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.nome} {val.costoMese > 0 ? `(${formatCurrency(val.costoMese)}/mese)` : '(incluso)'}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-400">{storage.descrizione}</p>
                </div>

                {/* Assicurazione */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo assicurazione</label>
                  <select
                    value={tipoAssicurazione}
                    onChange={(e) => setTipoAssicurazione(e.target.value as TipoAssicurazione)}
                    className="w-full px-4 py-3 border rounded-lg text-sm"
                  >
                    {Object.entries(assicurazioneOptions).map(([key, val]) => (
                      <option key={key} value={key}>{val.nome}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-400">{assicurazione.descrizione}</p>
                </div>

                {/* Km Anno */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Km/anno: {kmAnno.toLocaleString('it-IT')}
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="500"
                    value={kmAnno}
                    onChange={(e) => setKmAnno(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>500</span>
                    <span>5.000</span>
                    <span>10.000</span>
                  </div>
                </div>

                {/* Eventi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Eventi/anno (raduni, track day): {eventiAnno}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    value={eventiAnno}
                    onChange={(e) => setEventiAnno(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-forest"
                  />
                </div>
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
                  <h2 className="font-heading text-xl text-forest">Breakdown Costi Annui</h2>
                  <p className="text-xs text-gray-500">Dettaglio voci di spesa</p>
                </div>
              </div>

              <div className="space-y-3">
                <CostItem label="Assicurazione" value={risultati.costoAssicurazione} formatCurrency={formatCurrency} />
                <CostItem label="Manutenzione e tagliandi" value={risultati.costoManutenzione} formatCurrency={formatCurrency} />
                {risultati.costoStorage > 0 && (
                  <CostItem label="Storage" value={risultati.costoStorage} formatCurrency={formatCurrency} />
                )}
                <CostItem label="Bollo / Superbollo" value={risultati.bollo} formatCurrency={formatCurrency} />
                <CostItem label="Revisione" value={risultati.revisioneTagliandi} formatCurrency={formatCurrency} />
                {risultati.costoEventi > 0 && (
                  <CostItem label={`Eventi (${eventiAnno})`} value={risultati.costoEventi} formatCurrency={formatCurrency} />
                )}
                {risultati.costoTrasporto > 0 && (
                  <CostItem label="Trasporto eventi" value={risultati.costoTrasporto} formatCurrency={formatCurrency} />
                )}

                <div className="pt-4 border-t-2 border-forest">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-heading text-lg text-forest">Totale Costi</span>
                    <span className="font-heading text-2xl text-forest">{formatCurrency(risultati.costoAnnuoTotale)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Costo per km</span>
                    <span className="font-medium">{formatCurrency(risultati.costoPerKm)}/km</span>
                  </div>
                </div>

                {/* Apprezzamento */}
                <div className={`mt-4 p-4 rounded-lg ${risultati.apprezza ? 'bg-green-50' : 'bg-amber-50'}`}>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${risultati.apprezza ? 'text-green-700' : 'text-amber-700'}`}>
                      {risultati.apprezza ? 'Apprezzamento stimato' : 'Svalutazione stimata'}
                    </span>
                    <span className={`font-heading text-xl ${risultati.apprezza ? 'text-green-600' : 'text-amber-600'}`}>
                      {risultati.variazioneValore >= 0 ? '+' : ''}{formatCurrency(risultati.variazioneValore)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Trend storico: {(auto.svalutazioneAnnua * 100).toFixed(0)}%/anno per questa categoria
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info boxes */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-3">Auto come investimento</h3>
              <p className="text-sm text-gray-600 mb-4">
                Alcune categorie di auto tendono ad apprezzarsi nel tempo,
                trasformando una passione in un investimento.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Classiche anni 60</strong>: +8% medio annuo (Ferrari 250, Porsche 911)</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Hypercar limited</strong>: +5% (918, P1, LaFerrari)</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span><strong>Supercar moderne</strong>: -8% (svalutazione normale)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-3">Consigli per collezionisti</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-forest text-white flex items-center justify-center text-xs flex-shrink-0">1</span>
                  <span><strong>Documentazione completa</strong>: service book, fatture, storia proprietari</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-forest text-white flex items-center justify-center text-xs flex-shrink-0">2</span>
                  <span><strong>Colori originali</strong>: combinazioni di fabbrica valgono di piu</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-forest text-white flex items-center justify-center text-xs flex-shrink-0">3</span>
                  <span><strong>Km bassi ma non zero</strong>: auto usate regolarmente si conservano meglio</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded-full bg-forest text-white flex items-center justify-center text-xs flex-shrink-0">4</span>
                  <span><strong>Assicurazione agreed value</strong>: protegge il valore reale in caso di sinistro</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Una collezione auto puo far parte di un portafoglio diversificato
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Per patrimoni oltre 150K, offriamo consulenza su come integrare
            passion assets nella tua strategia patrimoniale.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      <div className="container-custom pb-8">
        <RatingWidget toolSlug="costo-auto-collezione" toolName="costo-auto-collezione" />
      </div>

      <RelatedTools tools={toolCorrelations['costo-auto-collezione'] || []} />

      <Footer />
    </main>
  )
}

function CostItem({ label, value, formatCurrency }: { label: string; value: number; formatCurrency: (v: number) => string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-medium text-forest">{formatCurrency(value)}</span>
    </div>
  )
}
