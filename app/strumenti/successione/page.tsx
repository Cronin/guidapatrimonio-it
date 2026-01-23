'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer } from '@/components'

interface Erede {
  id: string
  nome: string
  relazione: 'coniuge' | 'figlio' | 'fratello' | 'parente' | 'altro'
  quota: number
}

interface Bene {
  id: string
  descrizione: string
  valore: number
  tipo: 'immobile' | 'finanziario' | 'assicurazione' | 'altro'
}

const relazioniInfo = {
  coniuge: { nome: 'Coniuge', franchigia: 1000000, aliquota: 4, colore: 'bg-gray-500' },
  figlio: { nome: 'Figlio/Discendente', franchigia: 1000000, aliquota: 4, colore: 'bg-green-500' },
  fratello: { nome: 'Fratello/Sorella', franchigia: 100000, aliquota: 6, colore: 'bg-amber-500' },
  parente: { nome: 'Parente fino al 4° grado', franchigia: 0, aliquota: 6, colore: 'bg-orange-500' },
  altro: { nome: 'Altro soggetto', franchigia: 0, aliquota: 8, colore: 'bg-red-500' },
}

const tipiBeneInfo = {
  immobile: { nome: 'Immobili', colore: 'bg-amber-500', nota: 'Valore catastale rivalutato' },
  finanziario: { nome: 'Attività finanziarie', colore: 'bg-gray-500', nota: 'Conti, titoli, fondi' },
  assicurazione: { nome: 'Polizze vita', colore: 'bg-green-500', nota: 'Esenti da imposta' },
  altro: { nome: 'Altri beni', colore: 'bg-gray-500', nota: 'Auto, gioielli, arte' },
}

export default function CalcolatoreSuccessione() {
  const [eredi, setEredi] = useState<Erede[]>([
    { id: '1', nome: 'Coniuge', relazione: 'coniuge', quota: 50 },
    { id: '2', nome: 'Figlio 1', relazione: 'figlio', quota: 25 },
    { id: '3', nome: 'Figlio 2', relazione: 'figlio', quota: 25 },
  ])

  const [beni, setBeni] = useState<Bene[]>([
    { id: '1', descrizione: 'Abitazione principale', valore: 400000, tipo: 'immobile' },
    { id: '2', descrizione: 'Conto corrente e depositi', valore: 150000, tipo: 'finanziario' },
    { id: '3', descrizione: 'Portafoglio titoli', valore: 200000, tipo: 'finanziario' },
    { id: '4', descrizione: 'Polizza vita', valore: 100000, tipo: 'assicurazione' },
  ])

  const [nuovoErede, setNuovoErede] = useState({ nome: '', relazione: 'figlio' as Erede['relazione'], quota: 0 })
  const [nuovoBene, setNuovoBene] = useState({ descrizione: '', valore: '', tipo: 'finanziario' as Bene['tipo'] })
  const [modalitaConfronto, setModalitaConfronto] = useState(false)

  const risultati = useMemo(() => {
    // Totale patrimonio
    const totalePatrimonio = beni.reduce((sum, b) => sum + b.valore, 0)
    const assicurazioniEsenti = beni.filter(b => b.tipo === 'assicurazione').reduce((sum, b) => sum + b.valore, 0)
    const patrimonioTassabile = totalePatrimonio - assicurazioniEsenti

    // Calcolo per ogni erede
    const dettaglioEredi = eredi.map(erede => {
      const quotaPatrimonio = (patrimonioTassabile * erede.quota) / 100
      const info = relazioniInfo[erede.relazione]
      const imponibile = Math.max(0, quotaPatrimonio - info.franchigia)
      const imposta = imponibile * (info.aliquota / 100)

      return {
        ...erede,
        quotaPatrimonio,
        franchigia: info.franchigia,
        franchigiaUsata: Math.min(info.franchigia, quotaPatrimonio),
        imponibile,
        aliquota: info.aliquota,
        imposta,
      }
    })

    const totaleImposte = dettaglioEredi.reduce((sum, e) => sum + e.imposta, 0)
    const aliquotaEffettiva = totalePatrimonio > 0 ? (totaleImposte / totalePatrimonio) * 100 : 0

    // Calcolo donazione in vita (stesso sistema ma con franchigie separate per ogni atto)
    // Ipotesi: donazione scaglionata nel tempo permette di sfruttare meglio le franchigie
    const dettaglioDonazioniVita = eredi.map(erede => {
      const quotaPatrimonio = (patrimonioTassabile * erede.quota) / 100
      const info = relazioniInfo[erede.relazione]
      // Con donazioni multiple nel tempo, si possono sfruttare franchigie multiple
      // (le franchigie si rigenerano dopo 3 anni per alcuni casi)
      const imponibile = Math.max(0, quotaPatrimonio - info.franchigia)
      const imposta = imponibile * (info.aliquota / 100)

      return {
        ...erede,
        quotaPatrimonio,
        imponibile,
        imposta,
      }
    })

    const totaleImposteDonazione = dettaglioDonazioniVita.reduce((sum, e) => sum + e.imposta, 0)

    // Risparmio con polizze vita
    const quotaAssicurazionePerErede = assicurazioniEsenti / eredi.length
    const risparmiPolizze = eredi.reduce((sum, erede) => {
      const info = relazioniInfo[erede.relazione]
      return sum + (quotaAssicurazionePerErede * info.aliquota / 100)
    }, 0)

    // Breakdown patrimonio per tipo
    const patrimonioPerTipo = Object.keys(tipiBeneInfo).map(tipo => {
      const totale = beni.filter(b => b.tipo === tipo).reduce((sum, b) => sum + b.valore, 0)
      return {
        tipo,
        ...tipiBeneInfo[tipo as keyof typeof tipiBeneInfo],
        totale,
        percentuale: totalePatrimonio > 0 ? (totale / totalePatrimonio) * 100 : 0,
      }
    }).filter(t => t.totale > 0)

    return {
      totalePatrimonio,
      assicurazioniEsenti,
      patrimonioTassabile,
      dettaglioEredi,
      totaleImposte,
      aliquotaEffettiva,
      totaleImposteDonazione,
      risparmiPolizze,
      patrimonioPerTipo,
    }
  }, [eredi, beni])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const aggiungiErede = () => {
    if (nuovoErede.nome && nuovoErede.quota > 0) {
      setEredi([...eredi, {
        id: Date.now().toString(),
        nome: nuovoErede.nome,
        relazione: nuovoErede.relazione,
        quota: nuovoErede.quota,
      }])
      setNuovoErede({ nome: '', relazione: 'figlio', quota: 0 })
    }
  }

  const rimuoviErede = (id: string) => {
    setEredi(eredi.filter(e => e.id !== id))
  }

  const aggiungiBene = () => {
    if (nuovoBene.descrizione && nuovoBene.valore) {
      setBeni([...beni, {
        id: Date.now().toString(),
        descrizione: nuovoBene.descrizione,
        valore: Number(nuovoBene.valore),
        tipo: nuovoBene.tipo,
      }])
      setNuovoBene({ descrizione: '', valore: '', tipo: 'finanziario' })
    }
  }

  const rimuoviBene = (id: string) => {
    setBeni(beni.filter(b => b.id !== id))
  }

  const totaleQuote = eredi.reduce((sum, e) => sum + e.quota, 0)

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
            Calcolatore Successione e Donazioni
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Calcola le imposte di successione in Italia secondo le normative vigenti. Confronta eredita e donazione in vita.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          {/* Risultato principale */}
          <div className="bg-forest rounded-card p-8 text-white mb-8">
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-white/70 text-sm mb-1">Patrimonio totale</p>
                <p className="font-heading text-3xl">{formatCurrency(risultati.totalePatrimonio)}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">Esente (polizze vita)</p>
                <p className="font-heading text-3xl text-green-300">{formatCurrency(risultati.assicurazioniEsenti)}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">Imposte successione</p>
                <p className="font-heading text-3xl text-amber-300">{formatCurrency(risultati.totaleImposte)}</p>
              </div>
              <div>
                <p className="text-white/70 text-sm mb-1">Aliquota effettiva</p>
                <p className="font-heading text-3xl">{risultati.aliquotaEffettiva.toFixed(2)}%</p>
              </div>
            </div>
          </div>

          {/* Avviso quote */}
          {totaleQuote !== 100 && (
            <div className="bg-amber-100 border border-amber-300 rounded-lg p-4 mb-6">
              <p className="text-amber-800 text-sm">
                <strong>Attenzione:</strong> La somma delle quote ereditarie e {totaleQuote}%. Dovrebbe essere 100%.
              </p>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Eredi */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h2 className="font-heading text-xl text-forest mb-4">Eredi</h2>

              <div className="space-y-3 mb-6">
                {eredi.map((erede) => (
                  <div key={erede.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${relazioniInfo[erede.relazione].colore}`} />
                      <div>
                        <p className="font-medium text-sm">{erede.nome}</p>
                        <p className="text-xs text-gray-400">{relazioniInfo[erede.relazione].nome}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-forest">{erede.quota}%</span>
                      <button
                        onClick={() => rimuoviErede(erede.id)}
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
                <p className="text-sm font-medium text-gray-700 mb-3">Aggiungi erede</p>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Nome"
                    value={nuovoErede.nome}
                    onChange={(e) => setNuovoErede({ ...nuovoErede, nome: e.target.value })}
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                  <select
                    value={nuovoErede.relazione}
                    onChange={(e) => setNuovoErede({ ...nuovoErede, relazione: e.target.value as Erede['relazione'] })}
                    className="px-3 py-2 border rounded-lg text-sm"
                  >
                    {Object.entries(relazioniInfo).map(([key, val]) => (
                      <option key={key} value={key}>{val.nome}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Quota %"
                    value={nuovoErede.quota || ''}
                    onChange={(e) => setNuovoErede({ ...nuovoErede, quota: Number(e.target.value) })}
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <button
                  onClick={aggiungiErede}
                  className="w-full px-4 py-2 bg-forest text-white rounded-lg text-sm hover:bg-green-700"
                >
                  Aggiungi erede
                </button>
              </div>
            </div>

            {/* Beni */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h2 className="font-heading text-xl text-forest mb-4">Patrimonio ereditario</h2>

              <div className="space-y-3 mb-6">
                {beni.map((bene) => (
                  <div key={bene.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${tipiBeneInfo[bene.tipo].colore}`} />
                      <div>
                        <p className="font-medium text-sm">{bene.descrizione}</p>
                        <p className="text-xs text-gray-400">
                          {tipiBeneInfo[bene.tipo].nome}
                          {bene.tipo === 'assicurazione' && <span className="text-green-600 ml-1">(esente)</span>}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`font-medium ${bene.tipo === 'assicurazione' ? 'text-green-600' : 'text-forest'}`}>
                        {formatCurrency(bene.valore)}
                      </span>
                      <button
                        onClick={() => rimuoviBene(bene.id)}
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
                <p className="text-sm font-medium text-gray-700 mb-3">Aggiungi bene</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Descrizione"
                    value={nuovoBene.descrizione}
                    onChange={(e) => setNuovoBene({ ...nuovoBene, descrizione: e.target.value })}
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Valore"
                    value={nuovoBene.valore}
                    onChange={(e) => setNuovoBene({ ...nuovoBene, valore: e.target.value })}
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={nuovoBene.tipo}
                    onChange={(e) => setNuovoBene({ ...nuovoBene, tipo: e.target.value as Bene['tipo'] })}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  >
                    {Object.entries(tipiBeneInfo).map(([key, val]) => (
                      <option key={key} value={key}>{val.nome}</option>
                    ))}
                  </select>
                  <button
                    onClick={aggiungiBene}
                    className="px-4 py-2 bg-forest text-white rounded-lg text-sm hover:bg-green-700"
                  >
                    Aggiungi
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Dettaglio imposte per erede */}
          <div className="bg-white rounded-card p-6 shadow-sm mb-8">
            <h2 className="font-heading text-xl text-forest mb-4">Dettaglio imposte per erede</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Erede</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-600">Relazione</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-600">Quota</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-600">Valore</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-600">Franchigia</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-600">Imponibile</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-600">Aliquota</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-600">Imposta</th>
                  </tr>
                </thead>
                <tbody>
                  {risultati.dettaglioEredi.map((erede) => (
                    <tr key={erede.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{erede.nome}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center gap-1`}>
                          <span className={`w-2 h-2 rounded-full ${relazioniInfo[erede.relazione].colore}`} />
                          {relazioniInfo[erede.relazione].nome}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">{erede.quota}%</td>
                      <td className="py-3 px-2 text-right">{formatCurrency(erede.quotaPatrimonio)}</td>
                      <td className="py-3 px-2 text-right text-green-600">-{formatCurrency(erede.franchigiaUsata)}</td>
                      <td className="py-3 px-2 text-right">{formatCurrency(erede.imponibile)}</td>
                      <td className="py-3 px-2 text-right">{erede.aliquota}%</td>
                      <td className="py-3 px-2 text-right font-medium text-amber-600">{formatCurrency(erede.imposta)}</td>
                    </tr>
                  ))}
                  <tr className="bg-gray-50 font-medium">
                    <td colSpan={7} className="py-3 px-2 text-right">Totale imposte successione</td>
                    <td className="py-3 px-2 text-right text-amber-600">{formatCurrency(risultati.totaleImposte)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Info aliquote e franchigie */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">Franchigie e Aliquote Italia</h3>
              <div className="space-y-3">
                {Object.entries(relazioniInfo).map(([key, info]) => (
                  <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${info.colore}`} />
                      <span className="text-sm">{info.nome}</span>
                    </div>
                    <div className="text-right text-sm">
                      <span className="text-green-600 font-medium">
                        {info.franchigia > 0 ? formatCurrency(info.franchigia) : 'Nessuna'}
                      </span>
                      <span className="text-gray-400 mx-2">|</span>
                      <span className="text-amber-600 font-medium">{info.aliquota}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">Risparmio con pianificazione</h3>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Risparmio polizze vita</span>
                    <span className="font-heading text-lg text-green-600">{formatCurrency(risultati.risparmiPolizze)}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    I capitali delle polizze vita sono esenti da imposta di successione
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Patrimonio esente</span>
                    <span className="font-heading text-lg text-forest">{formatCurrency(risultati.assicurazioniEsenti)}</span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Totale beni non soggetti a tassazione
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Consiglio:</strong> Valuta con un consulente la pianificazione successoria anticipata.
                  </p>
                  <p className="text-xs text-gray-500">
                    Donazioni, polizze vita e altri strumenti possono ridurre significativamente il carico fiscale.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Composizione patrimonio */}
          <div className="bg-white rounded-card p-6 shadow-sm mb-8">
            <h3 className="font-heading text-lg text-forest mb-4">Composizione patrimonio</h3>
            <div className="h-4 rounded-full overflow-hidden flex mb-4">
              {risultati.patrimonioPerTipo.map((tipo) => (
                <div
                  key={tipo.tipo}
                  className={tipo.colore}
                  style={{ width: `${tipo.percentuale}%` }}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {risultati.patrimonioPerTipo.map((tipo) => (
                <div key={tipo.tipo} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${tipo.colore}`} />
                  <div>
                    <p className="font-medium">{tipo.nome}</p>
                    <p className="text-gray-500">{formatCurrency(tipo.totale)} ({tipo.percentuale.toFixed(0)}%)</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note informative */}
          <div className="bg-white rounded-card p-6 shadow-sm">
            <h3 className="font-heading text-lg text-forest mb-4">Informazioni importanti</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Polizze vita e previdenza</h4>
                <ul className="space-y-1">
                  <li>- I capitali delle polizze vita sono esenti da imposta di successione</li>
                  <li>- Le prestazioni pensionistiche sono anch&apos;esse esenti</li>
                  <li>- I TFR non riscossi godono di regime agevolato</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Immobili</h4>
                <ul className="space-y-1">
                  <li>- Il valore di riferimento e quello catastale rivalutato</li>
                  <li>- Prima casa dell&apos;erede: agevolazioni IMU/TASI</li>
                  <li>- Terreni agricoli: regimi speciali per coltivatori</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Franchigia per disabili</h4>
                <ul className="space-y-1">
                  <li>- Portatori di handicap grave: franchigia 1.500.000 EUR</li>
                  <li>- Si applica indipendentemente dal grado di parentela</li>
                  <li>- Si cumula con la franchigia ordinaria per parentela</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Aziende e partecipazioni</h4>
                <ul className="space-y-1">
                  <li>- Quote societarie: esenzione se prosecuzione attivita</li>
                  <li>- Aziende familiari: agevolazioni specifiche</li>
                  <li>- Obbligo di mantenimento per 5 anni</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500">
                <strong>Disclaimer:</strong> Questo calcolatore fornisce stime indicative basate sulla normativa italiana vigente.
                Le imposte effettive possono variare in base a specifiche circostanze, agevolazioni e interpretazioni fiscali.
                Si consiglia di consultare un professionista per una valutazione accurata della propria situazione.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Pianifica il passaggio del tuo patrimonio
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            La pianificazione successoria anticipata puo far risparmiare migliaia di euro ai tuoi eredi.
            Un consulente indipendente puo aiutarti a ottimizzare la trasmissione del patrimonio.
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
