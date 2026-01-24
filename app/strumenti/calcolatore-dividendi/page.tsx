'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget} from '@/components'

interface ETFExample {
  nome: string
  ticker: string
  yield: number
  descrizione: string
}

const etfExamples: ETFExample[] = [
  { nome: 'Vanguard High Dividend Yield', ticker: 'VHYL', yield: 3.5, descrizione: 'ETF globale alto dividendo' },
  { nome: 'SPDR S&P 500 High Dividend', ticker: 'SPYD', yield: 4.5, descrizione: 'Top 80 titoli S&P per dividendo' },
  { nome: 'iShares Euro Dividend', ticker: 'IDVY', yield: 4.0, descrizione: 'Azioni europee alto dividendo' },
  { nome: 'BTP Italia', ticker: 'BTP', yield: 3.0, descrizione: 'Titoli di Stato italiani (tassazione 12.5%)' },
]

type RegimeFiscale = 'standard' | 'pex'

interface ProiezioneAnno {
  anno: number
  capitale: number
  dividendoLordo: number
  dividendoNetto: number
  dividendoMensileNetto: number
  valorePortafoglio: number
}

export default function CalcolatoreDividendi() {
  const [capitale, setCapitale] = useState(200000)
  const [dividendYield, setDividendYield] = useState(4)
  const [regimeFiscale, setRegimeFiscale] = useState<RegimeFiscale>('standard')
  const [reinvesti, setReinvesti] = useState(true)
  const [anni, setAnni] = useState(20)

  const aliquotaFiscale = regimeFiscale === 'standard' ? 26 : 1.2

  const risultati = useMemo(() => {
    // Calcolo CON reinvestimento
    const proiezioneConReinvestimento: ProiezioneAnno[] = []
    let capitaleReinvestito = capitale
    let dividendiTotaliReinvestiti = 0

    for (let anno = 1; anno <= anni; anno++) {
      const dividendoLordo = capitaleReinvestito * (dividendYield / 100)
      const dividendoNetto = dividendoLordo * (1 - aliquotaFiscale / 100)
      dividendiTotaliReinvestiti += dividendoNetto

      proiezioneConReinvestimento.push({
        anno,
        capitale: capitaleReinvestito,
        dividendoLordo,
        dividendoNetto,
        dividendoMensileNetto: dividendoNetto / 12,
        valorePortafoglio: capitaleReinvestito + dividendoNetto,
      })

      capitaleReinvestito += dividendoNetto
    }

    // Calcolo SENZA reinvestimento
    const proiezioneSenzaReinvestimento: ProiezioneAnno[] = []
    let capitaleSenzaReinvestimento = capitale
    let dividendiTotaliSenzaReinvestimento = 0

    for (let anno = 1; anno <= anni; anno++) {
      const dividendoLordo = capitaleSenzaReinvestimento * (dividendYield / 100)
      const dividendoNetto = dividendoLordo * (1 - aliquotaFiscale / 100)
      dividendiTotaliSenzaReinvestimento += dividendoNetto

      proiezioneSenzaReinvestimento.push({
        anno,
        capitale: capitaleSenzaReinvestimento,
        dividendoLordo,
        dividendoNetto,
        dividendoMensileNetto: dividendoNetto / 12,
        valorePortafoglio: capitaleSenzaReinvestimento,
      })
    }

    const primoAnno = proiezioneConReinvestimento[0]
    const ultimoAnnoReinvestito = proiezioneConReinvestimento[proiezioneConReinvestimento.length - 1]
    const ultimoAnnoNonReinvestito = proiezioneSenzaReinvestimento[proiezioneSenzaReinvestimento.length - 1]

    // Confronto
    const differenzaCapitale = ultimoAnnoReinvestito.valorePortafoglio - ultimoAnnoNonReinvestito.valorePortafoglio
    const differenzaDividendiMensili = ultimoAnnoReinvestito.dividendoMensileNetto - ultimoAnnoNonReinvestito.dividendoMensileNetto

    // Dati per grafico (ogni anno)
    const datiGrafico = proiezioneConReinvestimento.map((item, index) => ({
      anno: item.anno,
      conReinvestimento: item.valorePortafoglio,
      senzaReinvestimento: proiezioneSenzaReinvestimento[index].valorePortafoglio,
    }))

    return {
      // Anno 1
      dividendoLordoAnnuo: primoAnno.dividendoLordo,
      dividendoNettoAnnuo: primoAnno.dividendoNetto,
      dividendoMensileNetto: primoAnno.dividendoMensileNetto,
      taxPagata: primoAnno.dividendoLordo - primoAnno.dividendoNetto,

      // Finale con reinvestimento
      capitaleFinaleCon: ultimoAnnoReinvestito.valorePortafoglio,
      dividendoMensileNettoCon: ultimoAnnoReinvestito.dividendoMensileNetto,
      dividendiTotaliReinvestiti,

      // Finale senza reinvestimento
      capitaleFinaleSenza: ultimoAnnoNonReinvestito.valorePortafoglio,
      dividendoMensileNettoSenza: ultimoAnnoNonReinvestito.dividendoMensileNetto,
      dividendiTotaliSenzaReinvestimento,

      // Confronto
      differenzaCapitale,
      differenzaDividendiMensili,

      // Dati per visualizzazione
      proiezione: reinvesti ? proiezioneConReinvestimento : proiezioneSenzaReinvestimento,
      proiezioneTabella: (reinvesti ? proiezioneConReinvestimento : proiezioneSenzaReinvestimento)
        .filter((_, i, arr) => i === 0 || i === 4 || i === 9 || i === 14 || i === 19 || i === arr.length - 1),
      datiGrafico,
    }
  }, [capitale, dividendYield, aliquotaFiscale, reinvesti, anni])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const maxValoreGrafico = Math.max(...risultati.datiGrafico.map(d => d.conReinvestimento))

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
            Calcolatore Reddito da Dividendi
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Calcola il reddito da dividendi su un portafoglio di azioni o ETF. Simula l&apos;effetto del reinvestimento nel tempo.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">Parametri Investimento</h2>

              <div className="space-y-6">
                {/* Capitale */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capitale investito: {formatCurrency(capitale)}
                  </label>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={capitale}
                    onChange={(e) => setCapitale(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>10.000 EUR</span>
                    <span>1.000.000 EUR</span>
                  </div>
                </div>

                {/* Dividend Yield */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dividend Yield medio: {dividendYield}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="0.5"
                    value={dividendYield}
                    onChange={(e) => setDividendYield(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1%</span>
                    <span>8%</span>
                  </div>
                </div>

                {/* Regime Fiscale */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Regime Fiscale</label>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => setRegimeFiscale('standard')}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors text-left ${
                        regimeFiscale === 'standard'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span className="font-semibold">26% Standard</span>
                      <span className={regimeFiscale === 'standard' ? 'text-green-100' : 'text-gray-400'}>
                        {' '}- Tassazione ordinaria dividendi
                      </span>
                    </button>
                    <button
                      onClick={() => setRegimeFiscale('pex')}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors text-left ${
                        regimeFiscale === 'pex'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <span className="font-semibold">1.2% Regime PEX</span>
                      <span className={regimeFiscale === 'pex' ? 'text-green-100' : 'text-gray-400'}>
                        {' '}- Participation Exemption (holding)
                      </span>
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Il regime PEX si applica ai dividendi ricevuti da holding su partecipazioni qualificate (tassazione effettiva 1.2%)
                  </p>
                </div>

                {/* Reinvestimento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Reinvesto i dividendi?</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setReinvesti(true)}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        reinvesti ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Si, reinvesto
                    </button>
                    <button
                      onClick={() => setReinvesti(false)}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        !reinvesti ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      No, li spendo
                    </button>
                  </div>
                </div>

                {/* Orizzonte */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orizzonte temporale: {anni} anni
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="40"
                    step="1"
                    value={anni}
                    onChange={(e) => setAnni(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>5 anni</span>
                    <span>40 anni</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {/* Main Results */}
              <div className="bg-green-600 rounded-card p-6 text-white">
                <p className="text-green-100 text-sm mb-1">Dividendi Lordi Annui</p>
                <p className="font-heading text-3xl">{formatCurrency(risultati.dividendoLordoAnnuo)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Dividendi Netti (Anno 1)</p>
                  <p className="font-heading text-xl text-green-600">{formatCurrency(risultati.dividendoNettoAnnuo)}</p>
                  <p className="text-xs text-gray-400 mt-1">Tasse: {formatCurrency(risultati.taxPagata)}</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Dividendi Mensili Netti</p>
                  <p className="font-heading text-xl text-forest">{formatCurrency(risultati.dividendoMensileNetto)}</p>
                  <p className="text-xs text-gray-400 mt-1">Rendita mensile</p>
                </div>
              </div>

              {/* Con reinvestimento finale */}
              {reinvesti && (
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Dopo {anni} anni (con reinvestimento)</p>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-xs text-gray-400">Capitale</p>
                      <p className="font-heading text-xl text-forest">{formatCurrency(risultati.capitaleFinaleCon)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Dividendi mensili</p>
                      <p className="font-heading text-xl text-green-600">{formatCurrency(risultati.dividendoMensileNettoCon)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Confronto Con vs Senza Reinvestimento */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Confronto: Con vs Senza Reinvestimento</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Con reinvestimento</p>
                    <p className="font-heading text-lg text-green-700">{formatCurrency(risultati.capitaleFinaleCon)}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatCurrency(risultati.dividendoMensileNettoCon)}/mese</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Senza reinvestimento</p>
                    <p className="font-heading text-lg text-gray-700">{formatCurrency(risultati.capitaleFinaleSenza)}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatCurrency(risultati.dividendoMensileNettoSenza)}/mese</p>
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Differenza dopo {anni} anni:</strong> reinvestendo guadagni{' '}
                    <span className="font-semibold text-green-700">{formatCurrency(risultati.differenzaCapitale)}</span> in piu
                    e <span className="font-semibold text-green-700">{formatCurrency(risultati.differenzaDividendiMensili)}/mese</span> di dividendi extra.
                  </p>
                </div>
              </div>

              {/* Grafico Crescita */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Crescita Capitale nel Tempo</h3>
                <div className="h-52 flex items-end gap-1">
                  {risultati.datiGrafico
                    .filter((_, i) => i % Math.ceil(anni / 12) === 0 || i === risultati.datiGrafico.length - 1)
                    .map((dato) => (
                    <div key={dato.anno} className="flex-1 flex flex-col items-center gap-1">
                      {/* Barra con reinvestimento */}
                      <div className="w-full flex flex-col justify-end" style={{ height: '180px' }}>
                        <div
                          className="w-full bg-green-500 rounded-t transition-all duration-300"
                          style={{
                            height: `${(dato.conReinvestimento / maxValoreGrafico) * 100}%`,
                            minHeight: '4px'
                          }}
                          title={`Con reinvestimento: ${formatCurrency(dato.conReinvestimento)}`}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{dato.anno}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-4 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-green-500 rounded" /> Con reinvestimento
                  </span>
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">Anno</p>
              </div>

              {/* Tabella Proiezione */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Proiezione Dettagliata</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-500">Anno</th>
                        <th className="text-right py-2 text-gray-500">Capitale</th>
                        <th className="text-right py-2 text-gray-500">Div. Netto/anno</th>
                        <th className="text-right py-2 text-gray-500">Div. Netto/mese</th>
                      </tr>
                    </thead>
                    <tbody>
                      {risultati.proiezioneTabella.map((row) => (
                        <tr key={row.anno} className="border-b border-gray-100">
                          <td className="py-2 font-medium">{row.anno}</td>
                          <td className="text-right">{formatCurrency(row.capitale)}</td>
                          <td className="text-right text-green-600">{formatCurrency(row.dividendoNetto)}</td>
                          <td className="text-right text-green-600">{formatCurrency(row.dividendoMensileNetto)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* ETF Examples Table */}
          <div className="mt-12 bg-white rounded-card p-6 shadow-sm">
            <h2 className="font-heading text-xl text-forest mb-4">Esempi di ETF e Strumenti a Dividendo</h2>
            <p className="text-gray-600 text-sm mb-6">
              Ecco alcuni esempi di strumenti finanziari con dividend yield storici. I rendimenti passati non garantiscono rendimenti futuri.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Strumento</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Ticker</th>
                    <th className="text-center py-3 px-4 text-gray-600 font-semibold">Yield Storico</th>
                    <th className="text-left py-3 px-4 text-gray-600 font-semibold">Descrizione</th>
                    <th className="text-right py-3 px-4 text-gray-600 font-semibold">Dividendo su {formatCurrency(capitale)}</th>
                  </tr>
                </thead>
                <tbody>
                  {etfExamples.map((etf) => {
                    const dividendoLordo = capitale * (etf.yield / 100)
                    const aliquota = etf.ticker === 'BTP' ? 12.5 : aliquotaFiscale
                    const dividendoNetto = dividendoLordo * (1 - aliquota / 100)
                    return (
                      <tr key={etf.ticker} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{etf.nome}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-gray-700 font-mono text-xs">
                            {etf.ticker}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-700 font-semibold">
                            {etf.yield}%
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500">{etf.descrizione}</td>
                        <td className="py-3 px-4 text-right">
                          <div>
                            <span className="font-semibold text-green-600">{formatCurrency(dividendoNetto)}</span>
                            <span className="text-gray-400 text-xs">/anno netti</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatCurrency(dividendoNetto / 12)}/mese
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info */}
          <div className="mt-8 bg-white rounded-card p-6 shadow-sm">
            <h2 className="font-heading text-xl text-forest mb-4">Come funziona la tassazione sui dividendi?</h2>
            <div className="prose prose-sm text-gray-600 max-w-none">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-heading text-lg text-forest mt-0 mb-2">Regime Standard (26%)</h3>
                  <p className="mt-0">
                    I dividendi da azioni e ETF sono tassati al <strong>26%</strong> tramite ritenuta alla fonte.
                    Per i titoli di Stato italiani ed europei l&apos;aliquota e ridotta al <strong>12.5%</strong>.
                  </p>
                </div>
                <div>
                  <h3 className="font-heading text-lg text-forest mt-0 mb-2">Regime PEX (1.2%)</h3>
                  <p className="mt-0">
                    Il regime <strong>Participation Exemption</strong> si applica quando una holding detiene partecipazioni
                    qualificate. I dividendi sono esenti al 95%, portando l&apos;aliquota effettiva a circa <strong>1.2%</strong>.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <p className="text-sm text-gray-800 m-0">
                  <strong>Nota importante:</strong> I dividendi non sono garantiti e possono essere ridotti o sospesi.
                  Il dividend yield varia nel tempo in base al prezzo dell&apos;azione. Diversifica sempre il tuo portafoglio.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Vuoi costruire un portafoglio a dividendi?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            La strategia dividend investing richiede diversificazione e pianificazione.
            Un consulente indipendente puo aiutarti a scegliere gli strumenti giusti.
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
