'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer, RelatedTools, toolCorrelations , RatingWidget, FreeToolBanner} from '@/components'

// IRPEF brackets 2024
const IRPEF_BRACKETS = [
  { limit: 28000, rate: 0.23 },
  { limit: 50000, rate: 0.35 },
  { limit: Infinity, rate: 0.43 },
]

// Additional local taxes (addizionali regionali/comunali) - average estimate
const ADDIZIONALI_RATE = 0.025 // ~2.5% average

export default function CalcolatoreFlatTax() {
  const [redditoEstero, setRedditoEstero] = useState(300000)
  const [anniPermanenza, setAnniPermanenza] = useState(10)
  const [familiari, setFamiliari] = useState(0)
  const [patrimonioEstero, setPatrimonioEstero] = useState(1000000)
  const [hasRequirements, setHasRequirements] = useState(true)

  const risultati = useMemo(() => {
    // Flat tax calculation
    const flatTaxBase = 100000
    const flatTaxFamiliari = familiari * 25000
    const flatTaxTotale = flatTaxBase + flatTaxFamiliari

    // IRPEF calculation on foreign income
    const calcolaIRPEF = (reddito: number) => {
      let imposta = 0
      let remaining = reddito

      for (const bracket of IRPEF_BRACKETS) {
        const prevLimit = IRPEF_BRACKETS[IRPEF_BRACKETS.indexOf(bracket) - 1]?.limit || 0
        const taxableInBracket = Math.min(remaining, bracket.limit - prevLimit)
        if (taxableInBracket > 0) {
          imposta += taxableInBracket * bracket.rate
          remaining -= taxableInBracket
        }
        if (remaining <= 0) break
      }

      // Add local taxes
      imposta += reddito * ADDIZIONALI_RATE

      return imposta
    }

    const irpefTotale = calcolaIRPEF(redditoEstero)
    const aliquotaEffettivaIRPEF = (irpefTotale / redditoEstero) * 100

    // IVAFE (tax on foreign financial assets) - 0.2% per year
    const ivafe = patrimonioEstero * 0.002

    // IVIE (tax on foreign real estate) - 0.76% average
    // We'll assume 30% of patrimonio is real estate
    const patrimonioImmobiliare = patrimonioEstero * 0.3
    const ivie = patrimonioImmobiliare * 0.0076

    // Total under ordinary regime
    const totaleOrdinario = irpefTotale + ivafe + ivie

    // Total under flat tax (no IVAFE/IVIE)
    const totaleFlatTax = flatTaxTotale

    // Annual savings
    const risparmioAnnuo = totaleOrdinario - totaleFlatTax

    // Break-even point calculation
    // Find income where IRPEF = flat tax
    const calcolaBreakEven = () => {
      let testIncome = 50000
      while (testIncome < 5000000) {
        const testIRPEF = calcolaIRPEF(testIncome)
        if (testIRPEF >= flatTaxTotale) {
          return testIncome
        }
        testIncome += 1000
      }
      return testIncome
    }

    const breakEven = calcolaBreakEven()
    const breakEvenConIVAFE = breakEven - (ivafe + ivie) / 0.43 // Adjust for asset taxes saved

    // 15-year projection
    const proiezione = []
    let cumulativoFlatTax = 0
    let cumulativoOrdinario = 0

    for (let anno = 1; anno <= 15; anno++) {
      cumulativoFlatTax += totaleFlatTax
      cumulativoOrdinario += totaleOrdinario

      proiezione.push({
        anno,
        flatTax: totaleFlatTax,
        ordinario: totaleOrdinario,
        cumulativoFlatTax,
        cumulativoOrdinario,
        risparmioCumulativo: cumulativoOrdinario - cumulativoFlatTax,
      })
    }

    // Total savings over planned years
    const risparmioTotale = risparmioAnnuo * Math.min(anniPermanenza, 15)

    return {
      flatTaxTotale,
      irpefTotale,
      ivafe,
      ivie,
      totaleOrdinario,
      risparmioAnnuo,
      risparmioTotale,
      aliquotaEffettivaIRPEF,
      aliquotaEffettivaFlat: (flatTaxTotale / redditoEstero) * 100,
      breakEven,
      breakEvenConIVAFE,
      proiezione,
      conveniente: risparmioAnnuo > 0,
    }
  }, [redditoEstero, anniPermanenza, familiari, patrimonioEstero])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return value.toFixed(1) + '%'
  }

  return (
    <main>
      <Navbar />
      <FreeToolBanner />

      <section className="bg-forest pt-navbar">
        <div className="container-custom py-12">
          <Link href="/strumenti" className="inline-flex items-center text-green-300 hover:text-white mb-4 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tutti gli strumenti
          </Link>
          <h1 className="font-heading text-[32px] md:text-[42px] text-white leading-tight">
            Calcolatore Flat Tax Neo-Residenti
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Valuta la convenienza del regime forfettario a 100.000 euro per i nuovi residenti fiscali in Italia.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-xl text-forest mb-6">I tuoi dati</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reddito estero annuo: {formatCurrency(redditoEstero)}
                    </label>
                    <input
                      type="range"
                      min="50000"
                      max="2000000"
                      step="10000"
                      value={redditoEstero}
                      onChange={(e) => setRedditoEstero(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>50k</span>
                      <span>2M</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patrimonio estero: {formatCurrency(patrimonioEstero)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="100000"
                      value={patrimonioEstero}
                      onChange={(e) => setPatrimonioEstero(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0</span>
                      <span>10M</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anni di permanenza previsti: {anniPermanenza} anni
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="15"
                      step="1"
                      value={anniPermanenza}
                      onChange={(e) => setAnniPermanenza(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <p className="text-xs text-gray-400 mt-1">Il regime dura massimo 15 anni</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Familiari che optano per il regime: {familiari}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="1"
                      value={familiari}
                      onChange={(e) => setFamiliari(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                    <p className="text-xs text-gray-400 mt-1">+25.000 euro per ogni familiare</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Verifica requisiti</h3>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasRequirements}
                      onChange={(e) => setHasRequirements(e.target.checked)}
                      className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">
                      Non sono stato residente fiscale in Italia per almeno <strong>9 degli ultimi 10 anni</strong>
                    </span>
                  </label>
                </div>
                {!hasRequirements && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-700">
                      Non soddisfi i requisiti per accedere al regime forfettario neo-residenti.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className={`rounded-card p-6 text-white ${risultati.conveniente ? 'bg-green-600' : 'bg-amber-600'}`}>
                <p className="text-white/80 text-sm mb-1">
                  {risultati.conveniente ? 'Risparmio annuo con Flat Tax' : 'Maggior costo con Flat Tax'}
                </p>
                <p className="font-heading text-4xl">
                  {formatCurrency(Math.abs(risultati.risparmioAnnuo))}
                </p>
                <p className="text-white/80 text-sm mt-2">
                  {risultati.conveniente
                    ? `La flat tax e conveniente per te`
                    : `Il regime ordinario e piu vantaggioso`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Flat Tax annua</p>
                  <p className="font-heading text-xl text-forest">{formatCurrency(risultati.flatTaxTotale)}</p>
                  <p className="text-xs text-gray-400 mt-1">Aliquota: {formatPercent(risultati.aliquotaEffettivaFlat)}</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Regime ordinario</p>
                  <p className="font-heading text-xl text-forest">{formatCurrency(risultati.totaleOrdinario)}</p>
                  <p className="text-xs text-gray-400 mt-1">Aliquota: {formatPercent(risultati.aliquotaEffettivaIRPEF + (risultati.ivafe + risultati.ivie) / redditoEstero * 100)}</p>
                </div>
              </div>

              <div className="bg-white rounded-card p-5 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-3">Dettaglio regime ordinario</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">IRPEF + addizionali</span>
                    <span className="font-medium">{formatCurrency(risultati.irpefTotale)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVAFE (attivita finanziarie)</span>
                    <span className="font-medium">{formatCurrency(risultati.ivafe)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVIE (immobili esteri)</span>
                    <span className="font-medium">{formatCurrency(risultati.ivie)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-medium text-gray-800">Totale</span>
                    <span className="font-medium text-forest">{formatCurrency(risultati.totaleOrdinario)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-card p-5 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Break-even point</p>
                <p className="font-heading text-xl text-forest">{formatCurrency(risultati.breakEven)}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Con redditi inferiori, il regime ordinario e piu conveniente
                </p>
              </div>

              {risultati.conveniente && (
                <div className="bg-green-50 rounded-card p-5 border border-green-200">
                  <p className="text-gray-700 text-sm mb-1">Risparmio totale su {anniPermanenza} anni</p>
                  <p className="font-heading text-2xl text-green-700">{formatCurrency(risultati.risparmioTotale)}</p>
                </div>
              )}
            </div>
          </div>

          {/* 15-year projection table */}
          <div className="mt-8 bg-white rounded-card p-6 shadow-sm overflow-x-auto">
            <h3 className="font-heading text-xl text-forest mb-4">Proiezione 15 anni</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-600">Anno</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600">Flat Tax</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600">Ordinario</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-600">Risparmio annuo</th>
                  <th className="text-right py-3 px-2 font-medium text-green-600">Risparmio cumulato</th>
                </tr>
              </thead>
              <tbody>
                {risultati.proiezione.map((row) => (
                  <tr
                    key={row.anno}
                    className={`border-b border-gray-100 ${row.anno > anniPermanenza ? 'opacity-40' : ''}`}
                  >
                    <td className="py-2 px-2">{row.anno}</td>
                    <td className="py-2 px-2 text-right">{formatCurrency(row.flatTax)}</td>
                    <td className="py-2 px-2 text-right">{formatCurrency(row.ordinario)}</td>
                    <td className="py-2 px-2 text-right">
                      <span className={row.ordinario - row.flatTax > 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatCurrency(row.ordinario - row.flatTax)}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right font-medium text-green-600">
                      {formatCurrency(row.risparmioCumulativo)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Info section */}
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-3">Come funziona la Flat Tax</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex gap-2">
                  <span className="text-green-600">1.</span>
                  <span>Imposta sostitutiva di 100.000 euro su tutti i redditi esteri</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">2.</span>
                  <span>Esenzione totale da IVAFE e IVIE sui patrimoni esteri</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">3.</span>
                  <span>Nessun obbligo di monitoraggio fiscale (quadro RW)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">4.</span>
                  <span>Esenzione imposta di successione su beni esteri</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-green-600">5.</span>
                  <span>Possibilita di escludere alcuni Paesi dall&apos;opzione</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-3">Requisiti di accesso</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex gap-2">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Non essere stato residente fiscale in Italia per almeno 9 dei 10 anni precedenti</span>
                </li>
                <li className="flex gap-2">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Trasferire la residenza fiscale in Italia</span>
                </li>
                <li className="flex gap-2">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Esercitare l&apos;opzione entro i termini di legge</span>
                </li>
                <li className="flex gap-2">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Durata massima: 15 anni (rinnovabile anno per anno)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 bg-amber-50 rounded-card p-5 border border-amber-200">
            <p className="text-sm text-amber-800">
              <strong>Nota:</strong> Questo calcolatore fornisce una stima indicativa. I redditi prodotti in Italia
              rimangono soggetti a tassazione ordinaria. Consulta un professionista per una valutazione
              completa della tua situazione fiscale.
            </p>
          </div>
        </div>
      </section>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Stai valutando il trasferimento in Italia?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            La pianificazione fiscale internazionale richiede un&apos;analisi approfondita.
            Un consulente esperto puo aiutarti a valutare tutte le opzioni disponibili.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom pb-8">
        <RatingWidget toolSlug="flat-tax-100k" toolName="flat-tax-100k" />
      </div>

      <RelatedTools tools={toolCorrelations['flat-tax-100k']} />

      <Footer />
    </main>
  )
}
