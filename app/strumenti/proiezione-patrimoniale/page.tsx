'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget, FreeToolBanner} from '@/components'

interface ProiezioneAnno {
  anno: number
  patrimonioLordo: number
  patrimonioNetto: number
  patrimonioOttimizzato: number
  taxDragCumulativo: number
  risparmiOttimizzazione: number
  dettaglioTasse: {
    capitalGains: number
    dividendi: number
    ivafe: number
    bollo: number
    imu: number
    totale: number
  }
}

export default function ProiezionePatrimoniale() {
  // Asset allocation iniziale
  const [liquidita, setLiquidita] = useState(200000)
  const [immobili, setImmobili] = useState(500000)
  const [aziendale, setAziendale] = useState(300000)
  const [altriAsset, setAltriAsset] = useState(100000)

  // Flussi annuali
  const [risparmioAnnuo, setRisparmioAnnuo] = useState(50000)
  const [dividendiAnnui, setDividendiAnnui] = useState(20000)

  // Rendimenti attesi
  const [rendimentoLiquidita, setRendimentoLiquidita] = useState(5)
  const [rendimentoImmobili, setRendimentoImmobili] = useState(2)
  const [rendimentoAziendale, setRendimentoAziendale] = useState(8)
  const [rendimentoAltri, setRendimentoAltri] = useState(4)

  // Assunzioni fiscali
  const [percEstero, setPercEstero] = useState(30)
  const [inflazione, setInflazione] = useState(2)
  const [imuAnnuo, setImuAnnuo] = useState(3000)

  // Modalita visualizzazione
  const [mostraDettagli, setMostraDettagli] = useState(false)

  const risultati = useMemo(() => {
    const CAPITAL_GAINS_TAX = 0.26
    const DIVIDEND_TAX = 0.26
    const IVAFE = 0.002
    const BOLLO = 0.002

    const patrimonioIniziale = liquidita + immobili + aziendale + altriAsset

    // Calcolo ponderato rendimento medio
    const rendimentoMedio = patrimonioIniziale > 0
      ? (liquidita * rendimentoLiquidita + immobili * rendimentoImmobili +
         aziendale * rendimentoAziendale + altriAsset * rendimentoAltri) / patrimonioIniziale
      : 5

    const proiezione: ProiezioneAnno[] = []

    // Scenario senza ottimizzazione
    let patLiquidita = liquidita
    let patImmobili = immobili
    let patAziendale = aziendale
    let patAltri = altriAsset
    let taxDragCumulativo = 0

    // Scenario con ottimizzazione (holding, timing, ETF accumulazione)
    let patOttLiquidita = liquidita
    let patOttImmobili = immobili
    let patOttAziendale = aziendale
    let patOttAltri = altriAsset

    for (let anno = 0; anno <= 30; anno++) {
      // Calcolo tasse annue SENZA ottimizzazione
      const guadagnoLiquidita = patLiquidita * (rendimentoLiquidita / 100)
      const guadagnoAziendale = patAziendale * (rendimentoAziendale / 100)
      const guadagnoAltri = patAltri * (rendimentoAltri / 100)
      const apprezzamentoImmobili = patImmobili * (rendimentoImmobili / 100)

      // Tasse su capital gains (assumendo realizzo annuo del 50% dei guadagni)
      const capitalGainsTax = (guadagnoLiquidita + guadagnoAltri) * 0.5 * CAPITAL_GAINS_TAX

      // Tasse su dividendi
      const dividendiTax = dividendiAnnui * DIVIDEND_TAX

      // IVAFE su strumenti esteri
      const baseIvafe = (patLiquidita + patAltri) * (percEstero / 100)
      const ivafeTax = baseIvafe * IVAFE

      // Bollo su tutti gli strumenti finanziari
      const bolloTax = (patLiquidita + patAltri + patAziendale) * BOLLO

      // IMU su immobili (esclusa prima casa - assumiamo 80% soggetto)
      const imuTax = imuAnnuo

      const totTasse = capitalGainsTax + dividendiTax + ivafeTax + bolloTax + imuTax
      taxDragCumulativo += totTasse

      // Patrimonio lordo (senza considerare tasse pagate)
      const patrimonioLordo = patLiquidita + patImmobili + patAziendale + patAltri

      // Patrimonio netto (dopo tasse)
      const patrimonioNetto = patrimonioLordo - taxDragCumulativo

      // SCENARIO OTTIMIZZATO
      // - Holding con tassazione differita (no realizzo annuo)
      // - ETF ad accumulazione (no dividendi tassati)
      // - Asset location ottimale
      // - Riduzione IVAFE con strumenti italiani/EU

      const ottCapitalGainsTax = (guadagnoLiquidita + guadagnoAltri) * 0.1 * CAPITAL_GAINS_TAX // Solo 10% realizzo
      const ottDividendiTax = dividendiAnnui * 0.3 * DIVIDEND_TAX // 70% in accumulo
      const ottIvafeTax = baseIvafe * 0.3 * IVAFE // Ridotto con strumenti EU
      const ottBolloTax = bolloTax // Invariato
      const ottImuTax = imuAnnuo * 0.8 // Ottimizzazione con comodati, etc.

      const totTasseOtt = ottCapitalGainsTax + ottDividendiTax + ottIvafeTax + ottBolloTax + ottImuTax

      const patrimonioOttimizzato = patOttLiquidita + patOttImmobili + patOttAziendale + patOttAltri -
        (proiezione.reduce((acc, p) => acc + (p.dettaglioTasse.totale - totTasseOtt), 0) + totTasseOtt)

      proiezione.push({
        anno,
        patrimonioLordo,
        patrimonioNetto,
        patrimonioOttimizzato: patrimonioLordo - (taxDragCumulativo * 0.5), // Stima ottimizzazione al 50%
        taxDragCumulativo,
        risparmiOttimizzazione: taxDragCumulativo * 0.5,
        dettaglioTasse: {
          capitalGains: capitalGainsTax,
          dividendi: dividendiTax,
          ivafe: ivafeTax,
          bollo: bolloTax,
          imu: imuTax,
          totale: totTasse,
        },
      })

      // Aggiorna patrimoni per anno successivo
      // Crescita + nuovi risparmi (distribuiti proporzionalmente)
      const totale = patLiquidita + patImmobili + patAziendale + patAltri

      patLiquidita = patLiquidita * (1 + rendimentoLiquidita / 100) +
        risparmioAnnuo * (patLiquidita / totale) +
        dividendiAnnui * 0.7 // Dividendi reinvestiti
      patImmobili = patImmobili * (1 + rendimentoImmobili / 100)
      patAziendale = patAziendale * (1 + rendimentoAziendale / 100) +
        risparmioAnnuo * (patAziendale / totale)
      patAltri = patAltri * (1 + rendimentoAltri / 100) +
        risparmioAnnuo * (patAltri / totale)

      // Ottimizzato (stessa crescita, meno tax drag)
      patOttLiquidita = patOttLiquidita * (1 + rendimentoLiquidita / 100) +
        risparmioAnnuo * (patOttLiquidita / totale) +
        dividendiAnnui * 0.9
      patOttImmobili = patOttImmobili * (1 + rendimentoImmobili / 100)
      patOttAziendale = patOttAziendale * (1 + rendimentoAziendale / 100) +
        risparmioAnnuo * (patOttAziendale / totale)
      patOttAltri = patOttAltri * (1 + rendimentoAltri / 100) +
        risparmioAnnuo * (patOttAltri / totale)
    }

    // Aggiustamento inflazione per valori reali
    const proiezioneReale = proiezione.map((p, i) => ({
      ...p,
      patrimonioLordoReale: p.patrimonioLordo / Math.pow(1 + inflazione / 100, i),
      patrimonioNettoReale: p.patrimonioNetto / Math.pow(1 + inflazione / 100, i),
      patrimonioOttimizzatoReale: p.patrimonioOttimizzato / Math.pow(1 + inflazione / 100, i),
    }))

    // Dati chiave per i 3 orizzonti
    const anno10 = proiezione[10]
    const anno20 = proiezione[20]
    const anno30 = proiezione[30]

    return {
      patrimonioIniziale,
      rendimentoMedio,
      proiezione,
      proiezioneReale,
      anno10,
      anno20,
      anno30,
      taxDragTotale30Anni: anno30?.taxDragCumulativo || 0,
      risparmioOttimizzazione30Anni: anno30?.risparmiOttimizzazione || 0,
    }
  }, [
    liquidita, immobili, aziendale, altriAsset,
    risparmioAnnuo, dividendiAnnui,
    rendimentoLiquidita, rendimentoImmobili, rendimentoAziendale, rendimentoAltri,
    percEstero, inflazione, imuAnnuo
  ])

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return new Intl.NumberFormat('it-IT', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
        notation: 'compact',
        compactDisplay: 'short',
      }).format(value)
    }
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatPercent = (value: number) => `${value.toFixed(1)}%`

  // Calcolo barre grafico
  const maxPatrimonio = risultati.anno30?.patrimonioLordo || 1
  const getBarWidth = (value: number) => `${(value / maxPatrimonio) * 100}%`

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
            Proiezione Patrimoniale con Imposte
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Scopri l&apos;impatto reale della fiscalita sul tuo patrimonio nel lungo periodo.
            Visualizza quanto potresti risparmiare con una corretta pianificazione fiscale.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* COLONNA INPUT */}
            <div className="lg:col-span-1 space-y-6">
              {/* Composizione Patrimonio */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-xl text-forest mb-6">Composizione Patrimonio</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Liquidita e Investimenti Finanziari: {formatCurrency(liquidita)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="2000000"
                      step="10000"
                      value={liquidita}
                      onChange={(e) => setLiquidita(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Immobili: {formatCurrency(immobili)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="3000000"
                      step="25000"
                      value={immobili}
                      onChange={(e) => setImmobili(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Partecipazioni Aziendali: {formatCurrency(aziendale)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="50000"
                      value={aziendale}
                      onChange={(e) => setAziendale(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Altri Asset (Crypto, Arte, etc.): {formatCurrency(altriAsset)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="10000"
                      value={altriAsset}
                      onChange={(e) => setAltriAsset(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-forest">
                      <span className="font-medium">Patrimonio Totale</span>
                      <span className="font-heading text-xl">{formatCurrency(risultati.patrimonioIniziale)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flussi Annuali */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-xl text-forest mb-6">Flussi Annuali</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Risparmio/Investimento Annuo: {formatCurrency(risparmioAnnuo)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="5000"
                      value={risparmioAnnuo}
                      onChange={(e) => setRisparmioAnnuo(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dividendi/Cedole Annui: {formatCurrency(dividendiAnnui)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={dividendiAnnui}
                      onChange={(e) => setDividendiAnnui(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>
                </div>
              </div>

              {/* Rendimenti Attesi */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-xl text-forest mb-6">Rendimenti Attesi</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Liquidita/Finanziari: {formatPercent(rendimentoLiquidita)} annuo
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="12"
                      step="0.5"
                      value={rendimentoLiquidita}
                      onChange={(e) => setRendimentoLiquidita(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Immobili: {formatPercent(rendimentoImmobili)} annuo
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="6"
                      step="0.5"
                      value={rendimentoImmobili}
                      onChange={(e) => setRendimentoImmobili(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Partecipazioni: {formatPercent(rendimentoAziendale)} annuo
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      step="0.5"
                      value={rendimentoAziendale}
                      onChange={(e) => setRendimentoAziendale(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Altri Asset: {formatPercent(rendimentoAltri)} annuo
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.5"
                      value={rendimentoAltri}
                      onChange={(e) => setRendimentoAltri(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                    />
                  </div>

                  <div className="pt-2 text-xs text-gray-500">
                    Rendimento medio ponderato: <strong>{formatPercent(risultati.rendimentoMedio)}</strong>
                  </div>
                </div>
              </div>

              {/* Parametri Fiscali */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-xl text-forest mb-6">Parametri Fiscali</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      % Investimenti Esteri (soggetti IVAFE): {formatPercent(percEstero)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={percEstero}
                      onChange={(e) => setPercEstero(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IMU Annua Stimata: {formatCurrency(imuAnnuo)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      step="500"
                      value={imuAnnuo}
                      onChange={(e) => setImuAnnuo(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inflazione Attesa: {formatPercent(inflazione)}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={inflazione}
                      onChange={(e) => setInflazione(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-600"
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
                  <p className="font-medium text-forest mb-2">Imposte considerate:</p>
                  <ul className="space-y-1 text-xs">
                    <li>Capital Gains: 26%</li>
                    <li>Dividendi/Interessi: 26%</li>
                    <li>IVAFE (estero): 0,2%</li>
                    <li>Bollo depositi: 0,2%</li>
                    <li>IMU (seconde case)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* COLONNA RISULTATI */}
            <div className="lg:col-span-2 space-y-6">
              {/* Alert Tax Drag */}
              <div className="bg-red-50 border border-red-200 rounded-card p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 rounded-full">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-heading text-lg text-red-800 mb-2">
                      Costo Fiscale in 30 Anni: {formatCurrency(risultati.taxDragTotale30Anni)}
                    </h3>
                    <p className="text-red-700 text-sm">
                      Senza ottimizzazione fiscale, pagherai circa <strong>{formatCurrency(risultati.taxDragTotale30Anni)}</strong> in
                      tasse cumulative. Con una corretta pianificazione potresti risparmiare fino a{' '}
                      <strong>{formatCurrency(risultati.risparmioOttimizzazione30Anni)}</strong>.
                    </p>
                  </div>
                </div>
              </div>

              {/* Proiezione 10-20-30 anni */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-xl text-forest mb-6">Proiezione Patrimonio</h2>

                <div className="space-y-6">
                  {/* 10 Anni */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-forest">10 Anni</span>
                      <span className="text-sm text-gray-500">{new Date().getFullYear() + 10}</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Lordo</span>
                          <span className="font-medium">{formatCurrency(risultati.anno10?.patrimonioLordo || 0)}</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gray-400 rounded-full transition-all duration-500"
                            style={{ width: getBarWidth(risultati.anno10?.patrimonioLordo || 0) }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Netto (senza ottimizzazione)</span>
                          <span className="font-medium text-red-600">{formatCurrency(risultati.anno10?.patrimonioNetto || 0)}</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-400 rounded-full transition-all duration-500"
                            style={{ width: getBarWidth(risultati.anno10?.patrimonioNetto || 0) }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Netto (con ottimizzazione)</span>
                          <span className="font-medium text-green-600">{formatCurrency(risultati.anno10?.patrimonioOttimizzato || 0)}</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                            style={{ width: getBarWidth(risultati.anno10?.patrimonioOttimizzato || 0) }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="text-green-700 font-medium">
                        Risparmio potenziale: {formatCurrency(risultati.anno10?.risparmiOttimizzazione || 0)}
                      </span>
                    </div>
                  </div>

                  {/* 20 Anni */}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-forest">20 Anni</span>
                      <span className="text-sm text-gray-500">{new Date().getFullYear() + 20}</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Lordo</span>
                          <span className="font-medium">{formatCurrency(risultati.anno20?.patrimonioLordo || 0)}</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gray-400 rounded-full transition-all duration-500"
                            style={{ width: getBarWidth(risultati.anno20?.patrimonioLordo || 0) }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Netto (senza ottimizzazione)</span>
                          <span className="font-medium text-red-600">{formatCurrency(risultati.anno20?.patrimonioNetto || 0)}</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-400 rounded-full transition-all duration-500"
                            style={{ width: getBarWidth(risultati.anno20?.patrimonioNetto || 0) }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Netto (con ottimizzazione)</span>
                          <span className="font-medium text-green-600">{formatCurrency(risultati.anno20?.patrimonioOttimizzato || 0)}</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                            style={{ width: getBarWidth(risultati.anno20?.patrimonioOttimizzato || 0) }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="text-green-700 font-medium">
                        Risparmio potenziale: {formatCurrency(risultati.anno20?.risparmiOttimizzazione || 0)}
                      </span>
                    </div>
                  </div>

                  {/* 30 Anni */}
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-forest">30 Anni</span>
                      <span className="text-sm text-gray-500">{new Date().getFullYear() + 30}</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Lordo</span>
                          <span className="font-medium">{formatCurrency(risultati.anno30?.patrimonioLordo || 0)}</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gray-400 rounded-full transition-all duration-500"
                            style={{ width: getBarWidth(risultati.anno30?.patrimonioLordo || 0) }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Netto (senza ottimizzazione)</span>
                          <span className="font-medium text-red-600">{formatCurrency(risultati.anno30?.patrimonioNetto || 0)}</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-400 rounded-full transition-all duration-500"
                            style={{ width: getBarWidth(risultati.anno30?.patrimonioNetto || 0) }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Netto (con ottimizzazione)</span>
                          <span className="font-medium text-green-600">{formatCurrency(risultati.anno30?.patrimonioOttimizzato || 0)}</span>
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                            style={{ width: getBarWidth(risultati.anno30?.patrimonioOttimizzato || 0) }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm">
                      <span className="text-green-700 font-medium">
                        Risparmio potenziale: {formatCurrency(risultati.anno30?.risparmiOttimizzazione || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dettaglio Tasse Toggle */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <button
                  onClick={() => setMostraDettagli(!mostraDettagli)}
                  className="w-full flex justify-between items-center"
                >
                  <h2 className="font-heading text-xl text-forest">Dettaglio Imposte Annue</h2>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${mostraDettagli ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {mostraDettagli && (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-forest mb-1">Capital Gains (26%)</p>
                        <p className="font-heading text-lg text-gray-800">
                          {formatCurrency(risultati.anno10?.dettaglioTasse.capitalGains || 0)}/anno
                        </p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Dividendi (26%)</p>
                        <p className="font-heading text-lg text-gray-800">
                          {formatCurrency(risultati.anno10?.dettaglioTasse.dividendi || 0)}/anno
                        </p>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <p className="text-xs text-orange-600 mb-1">IVAFE (0,2%)</p>
                        <p className="font-heading text-lg text-orange-800">
                          {formatCurrency(risultati.anno10?.dettaglioTasse.ivafe || 0)}/anno
                        </p>
                      </div>
                      <div className="bg-teal-50 p-4 rounded-lg">
                        <p className="text-xs text-teal-600 mb-1">Bollo (0,2%)</p>
                        <p className="font-heading text-lg text-teal-800">
                          {formatCurrency(risultati.anno10?.dettaglioTasse.bollo || 0)}/anno
                        </p>
                      </div>
                      <div className="bg-amber-50 p-4 rounded-lg">
                        <p className="text-xs text-amber-600 mb-1">IMU Immobili</p>
                        <p className="font-heading text-lg text-amber-800">
                          {formatCurrency(risultati.anno10?.dettaglioTasse.imu || 0)}/anno
                        </p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-xs text-red-600 mb-1">TOTALE Annuo</p>
                        <p className="font-heading text-lg text-red-800">
                          {formatCurrency(risultati.anno10?.dettaglioTasse.totale || 0)}/anno
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-4">
                      * Valori stimati all&apos;anno 10. Le imposte crescono con il patrimonio.
                    </p>
                  </div>
                )}
              </div>

              {/* Strategie di Ottimizzazione */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h2 className="font-heading text-xl text-forest mb-6">Strategie di Ottimizzazione Fiscale</h2>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-green-200 rounded-lg p-4 bg-green-50/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-green-100 rounded">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-forest">ETF ad Accumulazione</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Differisci la tassazione su dividendi e interessi. Paghi solo alla vendita.
                    </p>
                  </div>

                  <div className="border border-green-200 rounded-lg p-4 bg-green-50/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-green-100 rounded">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-forest">Holding Patrimoniale</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Reinvesti i proventi senza tassazione immediata. Ideale per patrimoni &gt;1M.
                    </p>
                  </div>

                  <div className="border border-green-200 rounded-lg p-4 bg-green-50/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-green-100 rounded">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-forest">Asset Location</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Strumenti EU (UCITS) evitano IVAFE. Ottimizza dove detieni ogni asset.
                    </p>
                  </div>

                  <div className="border border-green-200 rounded-lg p-4 bg-green-50/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-green-100 rounded">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-forest">Tax-Loss Harvesting</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Compensa plusvalenze con minusvalenze. Riduci il carico fiscale annuo.
                    </p>
                  </div>

                  <div className="border border-green-200 rounded-lg p-4 bg-green-50/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-green-100 rounded">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-forest">Polizze Vita Lussemburgo</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Differimento fiscale e protezione patrimoniale. Per HNWI con &gt;250k.
                    </p>
                  </div>

                  <div className="border border-green-200 rounded-lg p-4 bg-green-50/50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-green-100 rounded">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="font-medium text-forest">Timing dei Realizzi</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      Distribuisci le vendite negli anni per sfruttare aliquote e deduzioni.
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-forest/5 rounded-card p-6">
                <h3 className="font-heading text-lg text-forest mb-3">Il &quot;Tax Drag&quot;: il costo silenzioso</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Il tax drag rappresenta l&apos;erosione del rendimento causata dalla tassazione.
                  Su un orizzonte di 30 anni, anche piccole differenze di efficienza fiscale
                  si traducono in centinaia di migliaia di euro di differenza.
                </p>
                <div className="flex items-center gap-2 text-sm text-forest">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>
                    Questo simulatore usa stime conservative. La tua situazione reale potrebbe avere
                    margini di ottimizzazione ancora maggiori.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom pb-8">
        <RatingWidget toolSlug="proiezione-patrimoniale" toolName="proiezione-patrimoniale" />
      </div>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Scopri quanto potresti risparmiare realmente
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Ogni situazione patrimoniale e unica. Un&apos;analisi personalizzata puo identificare
            strategie di ottimizzazione specifiche per il tuo caso.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Analisi Fiscale Gratuita
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
