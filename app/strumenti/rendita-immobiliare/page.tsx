'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget, ToolPageSchema} from '@/components'

export default function CalcolatoreRenditaImmobiliare() {
  const [prezzoAcquisto, setPrezzoAcquisto] = useState(200000)
  const [speseAcquisto, setSpeseAcquisto] = useState(20000)
  const [affittoMensile, setAffittoMensile] = useState(800)
  const [speseAnnue, setSpeseAnnue] = useState(3000)
  const [tassoVacanza, setTassoVacanza] = useState(5)
  const [rivalutazioneAnnua, setRivalutazioneAnnua] = useState(1)

  const risultati = useMemo(() => {
    const investimentoTotale = prezzoAcquisto + speseAcquisto

    // Reddito lordo annuo
    const redditoLordo = affittoMensile * 12

    // Reddito effettivo (considerando vacanza)
    const redditoEffettivo = redditoLordo * (1 - tassoVacanza / 100)

    // Reddito netto (dopo spese)
    const redditoNetto = redditoEffettivo - speseAnnue

    // Rendimenti
    const rendimentoLordo = (redditoLordo / investimentoTotale) * 100
    const rendimentoNetto = (redditoNetto / investimentoTotale) * 100

    // Rendimento totale (con rivalutazione)
    const rendimentoTotale = rendimentoNetto + rivalutazioneAnnua

    // Cash on cash return (se comprato cash)
    const cashOnCash = (redditoNetto / investimentoTotale) * 100

    // Tempo per recuperare investimento
    const anniRecupero = redditoNetto > 0 ? investimentoTotale / redditoNetto : Infinity

    // Proiezione 10 anni
    const proiezione10Anni = {
      affitti: redditoNetto * 10,
      rivalutazione: prezzoAcquisto * Math.pow(1 + rivalutazioneAnnua / 100, 10) - prezzoAcquisto,
      totale: 0,
    }
    proiezione10Anni.totale = proiezione10Anni.affitti + proiezione10Anni.rivalutazione

    return {
      investimentoTotale,
      redditoLordo,
      redditoEffettivo,
      redditoNetto,
      rendimentoLordo,
      rendimentoNetto,
      rendimentoTotale,
      cashOnCash,
      anniRecupero,
      proiezione10Anni,
      redditoMensileNetto: redditoNetto / 12,
    }
  }, [prezzoAcquisto, speseAcquisto, affittoMensile, speseAnnue, tassoVacanza, rivalutazioneAnnua])

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
      <ToolPageSchema slug="rendita-immobiliare" />
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
            Calcolatore Rendita Immobiliare
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Valuta il rendimento di un investimento immobiliare da mettere a reddito.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">Dati dell&apos;immobile</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prezzo di acquisto: {formatCurrency(prezzoAcquisto)}
                  </label>
                  <input
                    type="range"
                    min="50000"
                    max="500000"
                    step="5000"
                    value={prezzoAcquisto}
                    onChange={(e) => setPrezzoAcquisto(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spese di acquisto: {formatCurrency(speseAcquisto)}
                  </label>
                  <input
                    type="range"
                    min="5000"
                    max="50000"
                    step="1000"
                    value={speseAcquisto}
                    onChange={(e) => setSpeseAcquisto(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">Notaio, agenzia, imposte, ristrutturazione</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Affitto mensile: {formatCurrency(affittoMensile)}
                  </label>
                  <input
                    type="range"
                    min="300"
                    max="3000"
                    step="50"
                    value={affittoMensile}
                    onChange={(e) => setAffittoMensile(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spese annue: {formatCurrency(speseAnnue)}
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="10000"
                    step="250"
                    value={speseAnnue}
                    onChange={(e) => setSpeseAnnue(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">IMU, condominio, manutenzione, assicurazione, tasse</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tasso di vacanza: {tassoVacanza}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={tassoVacanza}
                    onChange={(e) => setTassoVacanza(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">% del tempo in cui l&apos;immobile resta sfitto</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rivalutazione annua stimata: {rivalutazioneAnnua}%
                  </label>
                  <input
                    type="range"
                    min="-2"
                    max="5"
                    step="0.5"
                    value={rivalutazioneAnnua}
                    onChange={(e) => setRivalutazioneAnnua(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-green-600 rounded-card p-6 text-white">
                <p className="text-green-100 text-sm mb-1">Rendimento Netto Annuo</p>
                <p className="font-heading text-4xl">{risultati.rendimentoNetto.toFixed(2)}%</p>
                <p className="text-green-200 text-sm mt-2">
                  +{rivalutazioneAnnua}% rivalutazione = <strong>{risultati.rendimentoTotale.toFixed(2)}%</strong> totale
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Investimento Totale</p>
                  <p className="font-heading text-xl text-forest">{formatCurrency(risultati.investimentoTotale)}</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Reddito Netto Mensile</p>
                  <p className="font-heading text-xl text-green-600">{formatCurrency(risultati.redditoMensileNetto)}</p>
                </div>
              </div>

              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Dettaglio annuale</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Affitto lordo annuo</span>
                    <span className="font-medium">{formatCurrency(risultati.redditoLordo)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Perdita per vacanza ({tassoVacanza}%)</span>
                    <span>-{formatCurrency(risultati.redditoLordo - risultati.redditoEffettivo)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Spese annue</span>
                    <span>-{formatCurrency(speseAnnue)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-medium">
                    <span className="text-forest">Reddito netto annuo</span>
                    <span className="text-green-600">{formatCurrency(risultati.redditoNetto)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-card p-5 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Tempo di recupero investimento</p>
                <p className="font-heading text-xl text-forest">
                  {risultati.anniRecupero < 100 ? `${risultati.anniRecupero.toFixed(1)} anni` : 'Mai'}
                </p>
              </div>

              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Proiezione 10 anni</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Affitti netti cumulati</span>
                    <span className="font-medium text-green-600">+{formatCurrency(risultati.proiezione10Anni.affitti)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rivalutazione immobile</span>
                    <span className="font-medium text-green-600">+{formatCurrency(risultati.proiezione10Anni.rivalutazione)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-medium">
                    <span className="text-forest">Guadagno totale stimato</span>
                    <span className="text-green-600">{formatCurrency(risultati.proiezione10Anni.totale)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom pb-8">
        <RatingWidget toolSlug="rendita-immobiliare" toolName="rendita-immobiliare" />
      </div>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Immobiliare vs altri investimenti?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente indipendente può aiutarti a valutare se l&apos;immobiliare
            è la scelta giusta per il tuo portafoglio complessivo.
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
