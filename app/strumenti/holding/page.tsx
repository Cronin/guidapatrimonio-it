'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer, RelatedTools, toolCorrelations , RatingWidget} from '@/components'

export default function SimulatoreHolding() {
  // Input values
  const [valorePortafoglio, setValorePortafoglio] = useState(1000000)
  const [dividendiAnnui, setDividendiAnnui] = useState(30000)
  const [plusvalenzaAnnua, setPlusvalenzaAnnua] = useState(50000)
  const [redditoImmobiliare, setRedditoImmobiliare] = useState(0)
  const [costiGestioneHolding, setCostiGestioneHolding] = useState(4000)
  const [anniProiezione, setAnniProiezione] = useState(10)

  const risultati = useMemo(() => {
    // === TASSAZIONE PERSONA FISICA ===
    // Dividendi: 26% flat
    const tassaDividendiPF = dividendiAnnui * 0.26
    const dividendiNettiPF = dividendiAnnui - tassaDividendiPF

    // Plusvalenze: 26% flat
    const tassaPlusvalenzePF = plusvalenzaAnnua * 0.26
    const plusvalenzeNettePF = plusvalenzaAnnua - tassaPlusvalenzePF

    // Redditi immobiliari: cedolare secca 21% (semplificato)
    const tassaImmobiliPF = redditoImmobiliare * 0.21
    const immobiliNettiPF = redditoImmobiliare - tassaImmobiliPF

    // Totale persona fisica
    const redditoLordoPF = dividendiAnnui + plusvalenzaAnnua + redditoImmobiliare
    const tasseTotaliPF = tassaDividendiPF + tassaPlusvalenzePF + tassaImmobiliPF
    const redditoNettoPF = redditoLordoPF - tasseTotaliPF

    // === TASSAZIONE HOLDING (SRL) ===
    // Dividendi: tassati al 5% per PEX, poi IRES 24% = 1.2% effettivo
    const baseImponibileDividendiHolding = dividendiAnnui * 0.05 // Solo 5% tassabile
    const tassaDividendiHolding = baseImponibileDividendiHolding * 0.24 // IRES 24%
    const aliquotaEffettivaDividendiHolding = (tassaDividendiHolding / dividendiAnnui) * 100

    // Plusvalenze: regime PEX - solo 5% tassabile con IRES 24% = 1.2% effettivo
    // (se requisiti PEX soddisfatti: holding period 12 mesi, etc.)
    const baseImponibilePlusvalenzeHolding = plusvalenzaAnnua * 0.05
    const tassaPlusvalenzeHolding = baseImponibilePlusvalenzeHolding * 0.24
    const aliquotaEffettivaPlusvalenzeHolding = (tassaPlusvalenzeHolding / plusvalenzaAnnua) * 100

    // Redditi immobiliari: IRES 24% + IRAP ~3.9% = ~27.9%
    const tassaImmobiliHolding = redditoImmobiliare * 0.279
    const immobiliNettiHolding = redditoImmobiliare - tassaImmobiliHolding

    // Totale holding (prima di costi gestione)
    const tasseTotaliHolding = tassaDividendiHolding + tassaPlusvalenzeHolding + tassaImmobiliHolding
    const redditoNettoHoldingLordo = redditoLordoPF - tasseTotaliHolding
    const redditoNettoHolding = redditoNettoHoldingLordo - costiGestioneHolding

    // === COMPARAZIONE ===
    const risparmioBruttoAnnuo = tasseTotaliPF - tasseTotaliHolding
    const risparmioNettoAnnuo = redditoNettoHolding - redditoNettoPF
    const convenienzaHolding = risparmioNettoAnnuo > 0

    // Break-even: a quale reddito la holding diventa conveniente
    // Risparmio fiscale = Tasse PF - Tasse Holding
    // Break-even quando Risparmio fiscale = Costi gestione
    // Per dividendi: risparmio = 26% - 1.2% = 24.8% del reddito
    // Per plusvalenze: risparmio = 26% - 1.2% = 24.8% del reddito
    const aliquotaRisparmioDividendi = 0.26 - 0.012
    const aliquotaRisparmioPlusvalenze = 0.26 - 0.012
    const aliquotaRisparmioMedia = (aliquotaRisparmioDividendi + aliquotaRisparmioPlusvalenze) / 2

    // Break-even reddito finanziario
    const breakEvenReddito = costiGestioneHolding / aliquotaRisparmioMedia

    // Stima break-even patrimonio (assumendo rendimento medio 4%)
    const rendimentoMedioStimato = 0.04
    const breakEvenPatrimonio = breakEvenReddito / rendimentoMedioStimato

    // === PROIEZIONE MULTI-ANNO ===
    const proiezioneAnni = []
    let cumulativoPF = 0
    let cumulativoHolding = 0

    for (let anno = 1; anno <= anniProiezione; anno++) {
      cumulativoPF += redditoNettoPF
      cumulativoHolding += redditoNettoHolding

      proiezioneAnni.push({
        anno,
        nettoPF: redditoNettoPF,
        nettoHolding: redditoNettoHolding,
        cumulativoPF,
        cumulativoHolding,
        differenzaCumulativa: cumulativoHolding - cumulativoPF,
      })
    }

    // Anni per recuperare costi costituzione holding (~2500-3000)
    const costiCostituzione = 2500
    const anniRecuperoCosti = risparmioNettoAnnuo > 0 ? costiCostituzione / risparmioNettoAnnuo : Infinity

    return {
      // Persona fisica
      redditoLordoPF,
      tasseTotaliPF,
      redditoNettoPF,
      tassaDividendiPF,
      tassaPlusvalenzePF,
      tassaImmobiliPF,
      aliquotaEffettivaPF: (tasseTotaliPF / redditoLordoPF) * 100,

      // Holding
      tasseTotaliHolding,
      redditoNettoHoldingLordo,
      redditoNettoHolding,
      tassaDividendiHolding,
      tassaPlusvalenzeHolding,
      tassaImmobiliHolding,
      aliquotaEffettivaDividendiHolding,
      aliquotaEffettivaPlusvalenzeHolding,
      aliquotaEffettivaHolding: redditoLordoPF > 0 ? (tasseTotaliHolding / redditoLordoPF) * 100 : 0,

      // Comparazione
      risparmioBruttoAnnuo,
      risparmioNettoAnnuo,
      convenienzaHolding,
      breakEvenReddito,
      breakEvenPatrimonio,
      anniRecuperoCosti,

      // Proiezione
      proiezioneAnni,
      risparmioTotale10Anni: proiezioneAnni[anniProiezione - 1]?.differenzaCumulativa || 0,
    }
  }, [valorePortafoglio, dividendiAnnui, plusvalenzaAnnua, redditoImmobiliare, costiGestioneHolding, anniProiezione])

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
            Simulatore Holding Company
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Confronta la tassazione tra detenzione diretta e holding company (SRL).
            Scopri quando conviene costituire una holding per ottimizzare il carico fiscale.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Panel */}
            <div className="space-y-6">
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-xl text-forest mb-6">Il tuo patrimonio</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valore portafoglio investimenti: {formatCurrency(valorePortafoglio)}
                    </label>
                    <input
                      type="range"
                      min="100000"
                      max="5000000"
                      step="50000"
                      value={valorePortafoglio}
                      onChange={(e) => setValorePortafoglio(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <p className="text-xs text-gray-400 mt-1">Azioni, ETF, fondi, obbligazioni</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dividendi annui percepiti: {formatCurrency(dividendiAnnui)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="5000"
                      value={dividendiAnnui}
                      onChange={(e) => setDividendiAnnui(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <p className="text-xs text-gray-400 mt-1">Da partecipazioni qualificate e non qualificate</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Plusvalenze annue realizzate: {formatCurrency(plusvalenzaAnnua)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="300000"
                      step="5000"
                      value={plusvalenzaAnnua}
                      onChange={(e) => setPlusvalenzaAnnua(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <p className="text-xs text-gray-400 mt-1">Capital gains da vendita titoli</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Redditi immobiliari annui: {formatCurrency(redditoImmobiliare)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="150000"
                      step="5000"
                      value={redditoImmobiliare}
                      onChange={(e) => setRedditoImmobiliare(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <p className="text-xs text-gray-400 mt-1">Affitti da immobili</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-xl text-forest mb-6">Costi Holding</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Costi gestione annui: {formatCurrency(costiGestioneHolding)}
                    </label>
                    <input
                      type="range"
                      min="2000"
                      max="10000"
                      step="500"
                      value={costiGestioneHolding}
                      onChange={(e) => setCostiGestioneHolding(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <p className="text-xs text-gray-400 mt-1">Commercialista, bilancio, camera commercio, PEC, etc.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Orizzonte temporale: {anniProiezione} anni
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="20"
                      step="1"
                      value={anniProiezione}
                      onChange={(e) => setAnniProiezione(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>
                </div>
              </div>

              {/* Info Box PEX */}
              <div className="bg-gray-50 border border-gray-200 rounded-card p-5">
                <h3 className="font-heading text-lg text-gray-800 mb-2">Regime PEX (Participation Exemption)</h3>
                <p className="text-sm text-gray-700 mb-3">
                  Il regime PEX permette alle holding di tassare solo il 5% di dividendi e plusvalenze
                  da partecipazioni qualificate, con un&apos;aliquota effettiva dell&apos;1,2% invece del 26%.
                </p>
                <p className="text-xs text-forest">
                  Requisiti: holding period 12 mesi, partecipazione in societa commerciale,
                  residenza fiscale in Paese white list.
                </p>
              </div>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {/* Main Comparison Card */}
              <div className={`rounded-card p-6 text-white ${risultati.convenienzaHolding ? 'bg-green-600' : 'bg-gray-600'}`}>
                <p className="text-white/80 text-sm mb-1">
                  {risultati.convenienzaHolding ? 'Risparmio annuo con Holding' : 'Costo aggiuntivo Holding'}
                </p>
                <p className="font-heading text-4xl">
                  {risultati.convenienzaHolding ? '+' : ''}{formatCurrency(risultati.risparmioNettoAnnuo)}
                </p>
                <p className="text-white/70 text-sm mt-2">
                  {risultati.convenienzaHolding
                    ? `La holding ti fa risparmiare ${formatCurrency(risultati.risparmioTotale10Anni)} in ${anniProiezione} anni`
                    : `Con questi numeri la holding non conviene ancora`
                  }
                </p>
              </div>

              {/* Side by Side Comparison */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-card p-5 shadow-sm border-2 border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <p className="text-gray-600 font-medium text-sm">Persona Fisica</p>
                  </div>
                  <p className="font-heading text-2xl text-gray-700">{formatCurrency(risultati.redditoNettoPF)}</p>
                  <p className="text-gray-500 text-xs mt-1">netto annuo</p>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Tasse: {formatCurrency(risultati.tasseTotaliPF)}</p>
                    <p className="text-xs text-red-500">Aliquota: {formatPercent(risultati.aliquotaEffettivaPF)}</p>
                  </div>
                </div>

                <div className="bg-white rounded-card p-5 shadow-sm border-2 border-green-500">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <p className="text-forest font-medium text-sm">Holding SRL</p>
                  </div>
                  <p className="font-heading text-2xl text-green-600">{formatCurrency(risultati.redditoNettoHolding)}</p>
                  <p className="text-gray-500 text-xs mt-1">netto annuo</p>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">Tasse: {formatCurrency(risultati.tasseTotaliHolding)}</p>
                    <p className="text-xs text-green-600">Aliquota: {formatPercent(risultati.aliquotaEffettivaHolding)}</p>
                  </div>
                </div>
              </div>

              {/* Tax Breakdown */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Dettaglio tassazione</h3>

                <div className="space-y-4">
                  {dividendiAnnui > 0 && (
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="text-gray-600">Dividendi</div>
                      <div className="text-center">
                        <span className="text-red-600">26%</span>
                        <span className="text-gray-400 text-xs block">PF</span>
                      </div>
                      <div className="text-center">
                        <span className="text-green-600">{formatPercent(risultati.aliquotaEffettivaDividendiHolding)}</span>
                        <span className="text-gray-400 text-xs block">Holding</span>
                      </div>
                    </div>
                  )}

                  {plusvalenzaAnnua > 0 && (
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="text-gray-600">Plusvalenze</div>
                      <div className="text-center">
                        <span className="text-red-600">26%</span>
                        <span className="text-gray-400 text-xs block">PF</span>
                      </div>
                      <div className="text-center">
                        <span className="text-green-600">{formatPercent(risultati.aliquotaEffettivaPlusvalenzeHolding)}</span>
                        <span className="text-gray-400 text-xs block">Holding (PEX)</span>
                      </div>
                    </div>
                  )}

                  {redditoImmobiliare > 0 && (
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="text-gray-600">Immobili</div>
                      <div className="text-center">
                        <span className="text-orange-600">21%</span>
                        <span className="text-gray-400 text-xs block">Cedolare</span>
                      </div>
                      <div className="text-center">
                        <span className="text-orange-600">27.9%</span>
                        <span className="text-gray-400 text-xs block">IRES+IRAP</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Costi gestione holding</span>
                    <span className="text-red-600">-{formatCurrency(costiGestioneHolding)}/anno</span>
                  </div>
                </div>
              </div>

              {/* Break-even Analysis */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Analisi Break-even</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reddito minimo per convenienza</span>
                    <span className="font-medium text-forest">{formatCurrency(risultati.breakEvenReddito)}/anno</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Patrimonio minimo stimato</span>
                    <span className="font-medium text-forest">{formatCurrency(risultati.breakEvenPatrimonio)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Recupero costi costituzione</span>
                    <span className="font-medium text-forest">
                      {risultati.anniRecuperoCosti < 100
                        ? `${risultati.anniRecuperoCosti.toFixed(1)} anni`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  * Basato su rendimento medio stimato del 4% annuo
                </p>
              </div>

              {/* Projection Table */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Proiezione {anniProiezione} anni</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 text-gray-500 font-medium">Anno</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Cum. PF</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Cum. Holding</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Diff.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {risultati.proiezioneAnni
                        .filter((_, i) => i === 0 || i === 4 || i === 9 || i === risultati.proiezioneAnni.length - 1)
                        .map((anno) => (
                          <tr key={anno.anno} className="border-b border-gray-100">
                            <td className="py-2 font-medium">{anno.anno}</td>
                            <td className="py-2 text-right text-gray-600">{formatCurrency(anno.cumulativoPF)}</td>
                            <td className="py-2 text-right text-green-600">{formatCurrency(anno.cumulativoHolding)}</td>
                            <td className={`py-2 text-right font-medium ${anno.differenzaCumulativa >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {anno.differenzaCumulativa >= 0 ? '+' : ''}{formatCurrency(anno.differenzaCumulativa)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-card p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Vantaggi Holding</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Regime PEX: 95% esenzione plusvalenze</li>
                <li>Dividendi tassati all&apos;1,2% effettivo</li>
                <li>Reinvestimento senza tassazione</li>
                <li>Protezione patrimoniale</li>
                <li>Pianificazione successoria</li>
              </ul>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Svantaggi e Costi</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Costi costituzione: 2.500-3.500 EUR</li>
                <li>Costi annui: 3.000-6.000 EUR</li>
                <li>Complessita amministrativa</li>
                <li>Obblighi di bilancio</li>
                <li>Exit tax su trasferimento asset</li>
              </ul>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-heading text-lg text-forest mb-2">Quando Conviene</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>Patrimonio superiore a 500.000 EUR</li>
                <li>Redditi finanziari rilevanti e costanti</li>
                <li>Strategia di lungo termine (10+ anni)</li>
                <li>Volonta di reinvestire i proventi</li>
                <li>Esigenze di protezione patrimoniale</li>
              </ul>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 bg-gray-100 rounded-card p-5">
            <p className="text-xs text-gray-500">
              <strong>Disclaimer:</strong> Questo simulatore fornisce stime indicative basate sulla normativa fiscale italiana vigente.
              Le aliquote e i regimi fiscali possono variare. Il regime PEX richiede il rispetto di specifici requisiti
              (holding period, residenza fiscale, attivita commerciale della partecipata).
              Si consiglia di consultare un commercialista o consulente fiscale prima di prendere decisioni.
              I redditi trattenuti nella holding sono soggetti a ulteriore tassazione in caso di distribuzione alla persona fisica.
            </p>
          </div>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom pb-8">
        <RatingWidget toolSlug="holding" toolName="holding" />
      </div>

      <RelatedTools tools={toolCorrelations.holding} />

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Vuoi valutare una struttura holding?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente patrimoniale indipendente puo aiutarti a valutare se una holding
            e la soluzione giusta per ottimizzare il tuo patrimonio.
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
