'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer } from '@/components'

type Relazione = 'coniuge' | 'figlio' | 'fratello' | 'altro'
type Priorita = 'protezione' | 'controllo' | 'fiscale' | 'flessibilita'

const relazioniOptions: { value: Relazione; label: string; aliquota: number; franchigia: number }[] = [
  { value: 'coniuge', label: 'Coniuge / Figlio', aliquota: 4, franchigia: 1000000 },
  { value: 'figlio', label: 'Figlio disabile', aliquota: 4, franchigia: 1500000 },
  { value: 'fratello', label: 'Fratello / Sorella', aliquota: 6, franchigia: 100000 },
  { value: 'altro', label: 'Altri soggetti', aliquota: 8, franchigia: 0 },
]

export default function ConfrontoTrustDonazione() {
  // Input states
  const [valorePatrimonio, setValorePatrimonio] = useState(1500000)
  const [relazioneBeneficiario, setRelazioneBeneficiario] = useState<Relazione>('coniuge')
  const [numeroBeneficiari, setNumeroBeneficiari] = useState(2)
  const [includeImmobili, setIncludeImmobili] = useState(true)
  const [percentualeImmobili, setPercentualeImmobili] = useState(60)

  // Esigenze
  const [necessitaProtezione, setNecessitaProtezione] = useState(true)
  const [necessitaControllo, setNecessitaControllo] = useState(true)
  const [necessitaRevocabilita, setNecessitaRevocabilita] = useState(false)
  const [skipGeneration, setSkipGeneration] = useState(false)

  // Priorita principale
  const [prioritaPrincipale, setPrioritaPrincipale] = useState<Priorita>('protezione')

  const risultati = useMemo(() => {
    const relazione = relazioniOptions.find(r => r.value === relazioneBeneficiario)!

    // === COSTI TRUST ===
    const trustSetupMin = 10000
    const trustSetupMax = 25000
    const trustSetupMedio = (trustSetupMin + trustSetupMax) / 2

    // Costi annuali trust (gestione, contabilità, consulenza)
    const trustAnnualeMin = 5000
    const trustAnnualeMax = 15000
    const trustAnnualeMedio = (trustAnnualeMin + trustAnnualeMax) / 2

    // Stima durata trust (30 anni tipico per pianificazione generazionale)
    const durataAnni = 30
    const costoTotaleGestioneTrust = trustAnnualeMedio * durataAnni

    // Imposte ipotecarie e catastali su immobili (se trasferiti al trust)
    const valoreImmobili = includeImmobili ? valorePatrimonio * (percentualeImmobili / 100) : 0
    const impostaIpotecariaRegistro = valoreImmobili * 0.03 // 3% ipotecaria+catastale

    const costoTotaleTrust = trustSetupMedio + costoTotaleGestioneTrust + impostaIpotecariaRegistro

    // === COSTI DONAZIONE ===
    // Franchigia applicata per beneficiario
    const franchigiaTotale = relazione.franchigia * numeroBeneficiari
    const imponibileDonazione = Math.max(0, valorePatrimonio - franchigiaTotale)
    const impostaDonazione = imponibileDonazione * (relazione.aliquota / 100)

    // Imposte ipotecarie e catastali su immobili donati
    const imposteImmobiliDonazione = valoreImmobili * 0.03

    // Costi notarili donazione (circa 1-2% del valore, con minimi)
    const costiNotariliDonazione = Math.max(2000, valorePatrimonio * 0.015)

    const costoTotaleDonazione = impostaDonazione + imposteImmobiliDonazione + costiNotariliDonazione

    // === CONFRONTO CARATTERISTICHE ===
    const caratteristiche = [
      {
        aspetto: 'Protezione da creditori',
        trust: {
          valore: 5,
          nota: 'Efficace dopo 5 anni dalla costituzione (azione revocatoria)',
        },
        donazione: {
          valore: 2,
          nota: 'Vulnerabile: azione revocatoria entro 5 anni, collazione in successione',
        },
      },
      {
        aspetto: 'Mantenimento del controllo',
        trust: {
          valore: 5,
          nota: 'Il disponente puo essere guardiano, dare direttive, beneficiario del reddito',
        },
        donazione: {
          valore: 1,
          nota: 'Il donante perde ogni controllo sui beni donati',
        },
      },
      {
        aspetto: 'Revocabilita',
        trust: {
          valore: 4,
          nota: 'Possibile inserire clausola di revoca (trust revocabile)',
        },
        donazione: {
          valore: 2,
          nota: 'Revocabile solo per ingratitudine o sopravvenienza di figli',
        },
      },
      {
        aspetto: 'Flessibilita nella distribuzione',
        trust: {
          valore: 5,
          nota: 'Distribuzione programmata nel tempo, condizioni, eta beneficiari',
        },
        donazione: {
          valore: 1,
          nota: 'Trasferimento immediato e definitivo',
        },
      },
      {
        aspetto: 'Skip generation (saltare generazione)',
        trust: {
          valore: 5,
          nota: 'Ideale per trasferire ai nipoti, evitando doppia imposizione',
        },
        donazione: {
          valore: 2,
          nota: 'Possibile ma meno flessibile, puo creare tensioni familiari',
        },
      },
      {
        aspetto: 'Semplicita e costi',
        trust: {
          valore: 2,
          nota: 'Struttura complessa, costi di gestione annuali',
        },
        donazione: {
          valore: 5,
          nota: 'Un atto notarile, nessun costo di gestione successivo',
        },
      },
      {
        aspetto: 'Riservatezza',
        trust: {
          valore: 4,
          nota: 'Atto tra privati, iscrizione opponibile ma non pubblicita patrimonio',
        },
        donazione: {
          valore: 2,
          nota: 'Atto pubblico notarile, trascrizione nei registri immobiliari',
        },
      },
    ]

    // === PUNTEGGIO E RACCOMANDAZIONE ===
    let punteggioTrust = 0
    let punteggioDonazione = 0

    // Fattori di peso basati sulle esigenze
    if (necessitaProtezione) {
      punteggioTrust += 30
    }
    if (necessitaControllo) {
      punteggioTrust += 25
    }
    if (necessitaRevocabilita) {
      punteggioTrust += 15
      punteggioDonazione -= 10
    }
    if (skipGeneration) {
      punteggioTrust += 20
    }

    // Fattore costo (pesa negativamente sul trust se i costi sono alti)
    const rapportoCosti = costoTotaleDonazione > 0
      ? costoTotaleTrust / costoTotaleDonazione
      : 10

    if (rapportoCosti < 1.5) {
      punteggioTrust += 10 // Trust conveniente
    } else if (rapportoCosti > 3) {
      punteggioDonazione += 15 // Donazione molto piu economica
    }

    // Bonus per valore elevato (trust piu giustificato)
    if (valorePatrimonio > 2000000) {
      punteggioTrust += 15
    } else if (valorePatrimonio < 500000) {
      punteggioDonazione += 20 // Sotto 500k il trust e sproporzionato
    }

    // Priorita principale
    switch (prioritaPrincipale) {
      case 'protezione':
        punteggioTrust += 20
        break
      case 'controllo':
        punteggioTrust += 20
        break
      case 'fiscale':
        if (costoTotaleDonazione < costoTotaleTrust) {
          punteggioDonazione += 25
        } else {
          punteggioTrust += 10
        }
        break
      case 'flessibilita':
        punteggioTrust += 15
        break
    }

    // Normalizza punteggi
    const totale = Math.max(1, punteggioTrust + punteggioDonazione + 50)
    const percentualeTrust = Math.round((punteggioTrust + 50) / totale * 100)
    const percentualeDonazione = 100 - percentualeTrust

    let raccomandazione: 'trust' | 'donazione' | 'misto'
    let motivazione: string

    if (percentualeTrust > 65) {
      raccomandazione = 'trust'
      motivazione = 'Le tue esigenze di protezione patrimoniale e controllo rendono il trust la scelta piu adatta, nonostante i costi maggiori.'
    } else if (percentualeDonazione > 65) {
      raccomandazione = 'donazione'
      motivazione = 'Per il tuo caso, la donazione rappresenta la soluzione piu semplice ed economica. Il trust sarebbe sproporzionato.'
    } else {
      raccomandazione = 'misto'
      motivazione = 'Una combinazione di trust (per asset da proteggere) e donazione (per trasferimenti immediati) potrebbe essere ottimale.'
    }

    return {
      // Trust
      trustSetupMin,
      trustSetupMax,
      trustSetupMedio,
      trustAnnualeMin,
      trustAnnualeMax,
      trustAnnualeMedio,
      costoTotaleGestioneTrust,
      impostaIpotecariaRegistro,
      costoTotaleTrust,

      // Donazione
      franchigiaTotale,
      imponibileDonazione,
      impostaDonazione,
      imposteImmobiliDonazione,
      costiNotariliDonazione,
      costoTotaleDonazione,

      // Confronto
      caratteristiche,
      differenzaCosti: costoTotaleTrust - costoTotaleDonazione,

      // Raccomandazione
      percentualeTrust,
      percentualeDonazione,
      raccomandazione,
      motivazione,

      // Info relazione
      aliquota: relazione.aliquota,
      franchigia: relazione.franchigia,
    }
  }, [
    valorePatrimonio,
    relazioneBeneficiario,
    numeroBeneficiari,
    includeImmobili,
    percentualeImmobili,
    necessitaProtezione,
    necessitaControllo,
    necessitaRevocabilita,
    skipGeneration,
    prioritaPrincipale,
  ])

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
            Confronto Trust vs Donazione
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Quale strumento scegliere per il passaggio generazionale? Analizza costi, protezione patrimoniale e flessibilita.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Input Panel */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-xl text-forest mb-6">Il tuo patrimonio</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valore patrimonio: {formatCurrency(valorePatrimonio)}
                    </label>
                    <input
                      type="range"
                      min="200000"
                      max="10000000"
                      step="100000"
                      value={valorePatrimonio}
                      onChange={(e) => setValorePatrimonio(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>200k</span>
                      <span>10M</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Relazione con beneficiari
                    </label>
                    <select
                      value={relazioneBeneficiario}
                      onChange={(e) => setRelazioneBeneficiario(e.target.value as Relazione)}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    >
                      {relazioniOptions.map(r => (
                        <option key={r.value} value={r.value}>
                          {r.label} ({r.aliquota}%, franchigia {formatCurrency(r.franchigia)})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numero beneficiari: {numeroBeneficiari}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={numeroBeneficiari}
                      onChange={(e) => setNumeroBeneficiari(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>

                  <div className="pt-2 border-t">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeImmobili}
                        onChange={(e) => setIncludeImmobili(e.target.checked)}
                        className="w-4 h-4 text-green-600 rounded"
                      />
                      <span className="text-sm text-gray-700">Include immobili</span>
                    </label>

                    {includeImmobili && (
                      <div className="mt-3">
                        <label className="block text-sm text-gray-600 mb-2">
                          Quota immobiliare: {percentualeImmobili}%
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          step="5"
                          value={percentualeImmobili}
                          onChange={(e) => setPercentualeImmobili(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-xl text-forest mb-4">Le tue esigenze</h2>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={necessitaProtezione}
                      onChange={(e) => setNecessitaProtezione(e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Protezione da creditori</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={necessitaControllo}
                      onChange={(e) => setNecessitaControllo(e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Mantenere il controllo sui beni</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={necessitaRevocabilita}
                      onChange={(e) => setNecessitaRevocabilita(e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Possibilita di revocare</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={skipGeneration}
                      onChange={(e) => setSkipGeneration(e.target.checked)}
                      className="w-4 h-4 text-green-600 rounded"
                    />
                    <span className="text-sm text-gray-700">Skip generation (ai nipoti)</span>
                  </label>
                </div>

                <div className="mt-5 pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Priorita principale
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'protezione', label: 'Protezione' },
                      { value: 'controllo', label: 'Controllo' },
                      { value: 'fiscale', label: 'Risparmio fiscale' },
                      { value: 'flessibilita', label: 'Flessibilita' },
                    ].map(p => (
                      <button
                        key={p.value}
                        onClick={() => setPrioritaPrincipale(p.value as Priorita)}
                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                          prioritaPrincipale === p.value
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2 space-y-6">
              {/* Raccomandazione */}
              <div className={`rounded-card p-6 ${
                risultati.raccomandazione === 'trust'
                  ? 'bg-blue-600'
                  : risultati.raccomandazione === 'donazione'
                    ? 'bg-green-600'
                    : 'bg-purple-600'
              } text-white`}>
                <p className="text-white/80 text-sm mb-2">Raccomandazione</p>
                <h3 className="font-heading text-3xl mb-3">
                  {risultati.raccomandazione === 'trust' && 'Trust consigliato'}
                  {risultati.raccomandazione === 'donazione' && 'Donazione consigliata'}
                  {risultati.raccomandazione === 'misto' && 'Soluzione mista'}
                </h3>
                <p className="text-white/90">{risultati.motivazione}</p>

                <div className="mt-4 bg-white/20 rounded-lg p-3">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex-1">
                      <div className="h-3 bg-white/30 rounded-full overflow-hidden flex">
                        <div
                          className="bg-blue-300 h-full"
                          style={{ width: `${risultati.percentualeTrust}%` }}
                        />
                        <div
                          className="bg-green-300 h-full"
                          style={{ width: `${risultati.percentualeDonazione}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs mt-2 text-white/80">
                    <span>Trust {risultati.percentualeTrust}%</span>
                    <span>Donazione {risultati.percentualeDonazione}%</span>
                  </div>
                </div>
              </div>

              {/* Confronto Costi */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-card p-5 shadow-sm border-2 border-blue-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="font-heading text-lg text-blue-700">Trust</h3>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Costituzione</span>
                      <span className="font-medium">{formatCurrency(risultati.trustSetupMin)} - {formatCurrency(risultati.trustSetupMax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gestione annuale</span>
                      <span className="font-medium">{formatCurrency(risultati.trustAnnualeMin)} - {formatCurrency(risultati.trustAnnualeMax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gestione 30 anni</span>
                      <span className="font-medium">{formatCurrency(risultati.costoTotaleGestioneTrust)}</span>
                    </div>
                    {risultati.impostaIpotecariaRegistro > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Imposte immobili</span>
                        <span className="font-medium">{formatCurrency(risultati.impostaIpotecariaRegistro)}</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Costo totale stimato</span>
                      <span className="font-heading text-xl text-blue-700">{formatCurrency(risultati.costoTotaleTrust)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-card p-5 shadow-sm border-2 border-green-200">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-heading text-lg text-green-700">Donazione</h3>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Franchigia totale</span>
                      <span className="font-medium text-green-600">{formatCurrency(risultati.franchigiaTotale)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Imponibile ({risultati.aliquota}%)</span>
                      <span className="font-medium">{formatCurrency(risultati.imponibileDonazione)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Imposta donazione</span>
                      <span className="font-medium">{formatCurrency(risultati.impostaDonazione)}</span>
                    </div>
                    {risultati.imposteImmobiliDonazione > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Imposte immobili</span>
                        <span className="font-medium">{formatCurrency(risultati.imposteImmobiliDonazione)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Costi notarili</span>
                      <span className="font-medium">{formatCurrency(risultati.costiNotariliDonazione)}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-700">Costo totale</span>
                      <span className="font-heading text-xl text-green-700">{formatCurrency(risultati.costoTotaleDonazione)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Differenza costi */}
              <div className={`rounded-card p-4 ${
                risultati.differenzaCosti > 0 ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">
                    {risultati.differenzaCosti > 0
                      ? 'La donazione costa meno di:'
                      : 'Il trust costa meno di:'
                    }
                  </span>
                  <span className={`font-heading text-xl ${
                    risultati.differenzaCosti > 0 ? 'text-green-700' : 'text-blue-700'
                  }`}>
                    {formatCurrency(Math.abs(risultati.differenzaCosti))}
                  </span>
                </div>
              </div>

              {/* Confronto caratteristiche */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-xl text-forest mb-4">Confronto caratteristiche</h3>

                <div className="space-y-4">
                  {risultati.caratteristiche.map((c, i) => (
                    <div key={i} className="border-b pb-4 last:border-0 last:pb-0">
                      <p className="font-medium text-gray-800 mb-2">{c.aspetto}</p>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-blue-600">Trust</span>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, j) => (
                                <div
                                  key={j}
                                  className={`w-2 h-2 rounded-full ${
                                    j < c.trust.valore ? 'bg-blue-500' : 'bg-blue-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600">{c.trust.nota}</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-green-600">Donazione</span>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, j) => (
                                <div
                                  key={j}
                                  className={`w-2 h-2 rounded-full ${
                                    j < c.donazione.valore ? 'bg-green-500' : 'bg-green-200'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-gray-600">{c.donazione.nota}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info boxes */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-card p-5 border border-blue-100">
                  <h4 className="font-heading text-lg text-blue-800 mb-3">Quando scegliere il Trust</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Patrimonio significativo (oltre 1-2M)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Rischio di azioni legali o creditori</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Beneficiari minori o incapaci</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Esigenze di skip generation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Controllo sulla distribuzione nel tempo</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-card p-5 border border-green-100">
                  <h4 className="font-heading text-lg text-green-800 mb-3">Quando scegliere la Donazione</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Patrimonio sotto la franchigia</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Nessun rischio patrimoniale</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Beneficiari maggiorenni e capaci</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Trasferimento immediato desiderato</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Semplicita e costi contenuti</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="bg-amber-50 rounded-card p-4 border border-amber-200">
                <div className="flex gap-3">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p className="text-sm text-amber-800 font-medium">Importante</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Questo strumento fornisce stime indicative. I costi effettivi dipendono dalla complessita del caso,
                      dal professionista scelto e dalla struttura patrimoniale. Consulta sempre un professionista qualificato
                      prima di procedere con trust o donazioni.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Hai bisogno di una consulenza personalizzata?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            La pianificazione successoria richiede un approccio su misura.
            Un consulente indipendente puo aiutarti a scegliere la soluzione migliore.
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
