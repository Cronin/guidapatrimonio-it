'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer } from '@/components'

export default function CalcolatoreFIRE() {
  const [speseAnnue, setSpeseAnnue] = useState(30000)
  const [patrimonioAttuale, setPatrimonioAttuale] = useState(50000)
  const [risparmioMensile, setRisparmioMensile] = useState(1000)
  const [rendimentoAtteso, setRendimentoAtteso] = useState(6)
  const [tassoPrelievo, setTassoPrelievo] = useState(4)

  const risultati = useMemo(() => {
    // Capitale necessario per FIRE (regola del 4% o personalizzata)
    const capitaleNecessario = speseAnnue / (tassoPrelievo / 100)

    // Anni per raggiungere FIRE
    const tassoMensile = rendimentoAtteso / 100 / 12
    const gap = capitaleNecessario - patrimonioAttuale

    let anniPerFire = 0
    let capitale = patrimonioAttuale

    if (gap <= 0) {
      anniPerFire = 0
    } else {
      // Simulazione mese per mese
      let mesi = 0
      while (capitale < capitaleNecessario && mesi < 600) { // max 50 anni
        capitale = capitale * (1 + tassoMensile) + risparmioMensile
        mesi++
      }
      anniPerFire = mesi / 12
    }

    // Calcolo anno per anno per grafico
    const proiezione = []
    capitale = patrimonioAttuale
    for (let anno = 0; anno <= Math.ceil(anniPerFire) + 5 && anno <= 50; anno++) {
      proiezione.push({
        anno,
        capitale,
        target: capitaleNecessario,
      })
      for (let m = 0; m < 12; m++) {
        capitale = capitale * (1 + tassoMensile) + risparmioMensile
      }
    }

    const progressoAttuale = (patrimonioAttuale / capitaleNecessario) * 100
    const risparmiTotali = risparmioMensile * 12 * anniPerFire
    const interessiGuadagnati = capitaleNecessario - patrimonioAttuale - risparmiTotali

    return {
      capitaleNecessario,
      anniPerFire,
      progressoAttuale,
      risparmiTotali,
      interessiGuadagnati,
      proiezione,
      giaFire: patrimonioAttuale >= capitaleNecessario,
    }
  }, [speseAnnue, patrimonioAttuale, risparmioMensile, rendimentoAtteso, tassoPrelievo])

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
            Calcolatore FIRE
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Financial Independence, Retire Early: calcola quando potrai raggiungere l&apos;indipendenza finanziaria.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">I tuoi numeri</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spese annue desiderate in FIRE: {formatCurrency(speseAnnue)}
                  </label>
                  <input
                    type="range"
                    min="15000"
                    max="100000"
                    step="1000"
                    value={speseAnnue}
                    onChange={(e) => setSpeseAnnue(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patrimonio attuale: {formatCurrency(patrimonioAttuale)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="5000"
                    value={patrimonioAttuale}
                    onChange={(e) => setPatrimonioAttuale(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risparmio mensile: {formatCurrency(risparmioMensile)}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={risparmioMensile}
                    onChange={(e) => setRisparmioMensile(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rendimento atteso: {rendimentoAtteso}%
                  </label>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    step="0.5"
                    value={rendimentoAtteso}
                    onChange={(e) => setRendimentoAtteso(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tasso di prelievo (SWR): {tassoPrelievo}%
                  </label>
                  <input
                    type="range"
                    min="2.5"
                    max="5"
                    step="0.25"
                    value={tassoPrelievo}
                    onChange={(e) => setTassoPrelievo(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">4% = regola classica (25x spese)</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {risultati.giaFire ? (
                <div className="bg-green-600 rounded-card p-6 text-white text-center">
                  <div className="text-5xl mb-3">🎉</div>
                  <p className="font-heading text-2xl">Sei già FIRE!</p>
                  <p className="text-green-100 mt-2">Il tuo patrimonio copre già le tue spese annue</p>
                </div>
              ) : (
                <div className="bg-green-600 rounded-card p-6 text-white">
                  <p className="text-green-100 text-sm mb-1">Anni per raggiungere FIRE</p>
                  <p className="font-heading text-4xl">{risultati.anniPerFire.toFixed(1)}</p>
                  <p className="text-green-200 text-sm mt-1">
                    {risultati.anniPerFire < 50 ? `Anno ${new Date().getFullYear() + Math.ceil(risultati.anniPerFire)}` : 'Obiettivo troppo lontano'}
                  </p>
                </div>
              )}

              <div className="bg-white rounded-card p-5 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Capitale necessario (FIRE number)</p>
                <p className="font-heading text-2xl text-forest">{formatCurrency(risultati.capitaleNecessario)}</p>
                <p className="text-xs text-gray-400 mt-1">{speseAnnue} × {(100/tassoPrelievo).toFixed(0)} = {formatCurrency(risultati.capitaleNecessario)}</p>
              </div>

              <div className="bg-white rounded-card p-5 shadow-sm">
                <p className="text-gray-500 text-sm mb-3">Progresso attuale</p>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, risultati.progressoAttuale)}%` }}
                  />
                </div>
                <p className="text-right text-sm text-forest font-medium mt-2">
                  {risultati.progressoAttuale.toFixed(1)}%
                </p>
              </div>

              {!risultati.giaFire && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-card p-5 shadow-sm">
                    <p className="text-gray-500 text-sm mb-1">Risparmi necessari</p>
                    <p className="font-heading text-lg text-forest">{formatCurrency(Math.max(0, risultati.risparmiTotali))}</p>
                  </div>
                  <div className="bg-white rounded-card p-5 shadow-sm">
                    <p className="text-gray-500 text-sm mb-1">Interessi guadagnati</p>
                    <p className="font-heading text-lg text-green-600">{formatCurrency(Math.max(0, risultati.interessiGuadagnati))}</p>
                  </div>
                </div>
              )}

              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-3">Cos&apos;è il FIRE?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  FIRE (Financial Independence, Retire Early) è un movimento che punta
                  ad accumulare abbastanza patrimonio da vivere dei suoi rendimenti,
                  senza dover più lavorare per necessità.
                </p>
                <p className="text-sm text-gray-600">
                  La <strong>regola del 4%</strong> suggerisce che puoi prelevare il 4% del tuo
                  patrimonio ogni anno senza esaurirlo (con alta probabilità su 30+ anni).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Costruisci il tuo percorso verso la libertà finanziaria
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un piano FIRE personalizzato richiede strategia. Un consulente indipendente
            può aiutarti a ottimizzare investimenti, tasse e risparmi.
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
