'use client'

import { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget, ToolPageSchema, ConsultationPopup, useConsultationPopup} from '@/components'

export default function CalcolatoreTFR() {
  const [ralAttuale, setRalAttuale] = useState(35000)
  const [anniLavoro, setAnniLavoro] = useState(10)
  const [anniMancanti, setAnniMancanti] = useState(20)
  const [crescitaRal, setCrescitaRal] = useState(2)
  const [destinazione, setDestinazione] = useState<'azienda' | 'fondo'>('azienda')
  const [rendimentoFondo, setRendimentoFondo] = useState(3)

  // Consultation popup state
  const [showPopup, setShowPopup] = useState(false)
  const [popupAmount, setPopupAmount] = useState(0)
  const { shouldShowPopup, THRESHOLD } = useConsultationPopup()

  // Check for high value input
  useEffect(() => {
    if (ralAttuale >= THRESHOLD && shouldShowPopup()) {
      setPopupAmount(ralAttuale)
      setShowPopup(true)
    }
  }, [ralAttuale, THRESHOLD, shouldShowPopup])

  const risultati = useMemo(() => {
    // TFR = RAL / 13.5 per ogni anno
    // Rivalutazione TFR in azienda: 1.5% + 75% inflazione (stimiamo 2.5% totale)
    const rivalutazioneTfr = 0.025
    const inflazione = 0.02

    // Calcolo TFR già maturato
    let tfrMaturato = 0
    let ralStorica = ralAttuale / Math.pow(1 + crescitaRal/100, anniLavoro)
    for (let i = 0; i < anniLavoro; i++) {
      const quotaAnnua = ralStorica / 13.5
      const anniRivalutazione = anniLavoro - i - 1
      tfrMaturato += quotaAnnua * Math.pow(1 + rivalutazioneTfr, anniRivalutazione)
      ralStorica *= (1 + crescitaRal/100)
    }

    // Calcolo TFR futuro
    let tfrFuturoAzienda = tfrMaturato
    let tfrFuturoFondo = tfrMaturato
    let ralFutura = ralAttuale

    for (let i = 0; i < anniMancanti; i++) {
      const quotaAnnua = ralFutura / 13.5

      // In azienda
      tfrFuturoAzienda = (tfrFuturoAzienda + quotaAnnua) * (1 + rivalutazioneTfr)

      // In fondo pensione
      tfrFuturoFondo = (tfrFuturoFondo + quotaAnnua) * (1 + rendimentoFondo/100)

      ralFutura *= (1 + crescitaRal/100)
    }

    // Tassazione TFR
    // In azienda: tassazione separata (aliquota media ultimi 5 anni, stimiamo 23%)
    const tassazioneTfrAzienda = 0.23
    // In fondo pensione: tassazione agevolata (max 15%, min 9% dopo 35 anni)
    const anniTotali = anniLavoro + anniMancanti
    const tassazioneFondo = Math.max(0.09, 0.15 - (Math.min(anniTotali, 35) - 15) * 0.003)

    const nettoAzienda = tfrFuturoAzienda * (1 - tassazioneTfrAzienda)
    const nettoFondo = tfrFuturoFondo * (1 - tassazioneFondo)

    const differenza = nettoFondo - nettoAzienda
    const vantaggioPercentuale = ((nettoFondo / nettoAzienda) - 1) * 100

    return {
      tfrMaturato,
      tfrFuturoAzienda,
      tfrFuturoFondo,
      tassazioneTfrAzienda: tassazioneTfrAzienda * 100,
      tassazioneFondo: tassazioneFondo * 100,
      nettoAzienda,
      nettoFondo,
      differenza,
      vantaggioPercentuale,
    }
  }, [ralAttuale, anniLavoro, anniMancanti, crescitaRal, rendimentoFondo])

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
      <ConsultationPopup
        isOpen={showPopup}
        amount={popupAmount}
        onClose={() => setShowPopup(false)}
      />
      <ToolPageSchema slug="tfr" />
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
            Calcolatore TFR
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Calcola il tuo TFR e confronta: meglio lasciarlo in azienda o versarlo in un fondo pensione?
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">I tuoi dati</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RAL attuale: {formatCurrency(ralAttuale)}
                  </label>
                  <input
                    type="range"
                    min="20000"
                    max="100000"
                    step="1000"
                    value={ralAttuale}
                    onChange={(e) => setRalAttuale(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anni già lavorati: {anniLavoro}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={anniLavoro}
                      onChange={(e) => setAnniLavoro(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Anni mancanti: {anniMancanti}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="40"
                      value={anniMancanti}
                      onChange={(e) => setAnniMancanti(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crescita RAL annua stimata: {crescitaRal}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={crescitaRal}
                    onChange={(e) => setCrescitaRal(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rendimento fondo pensione: {rendimentoFondo}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="7"
                    step="0.5"
                    value={rendimentoFondo}
                    onChange={(e) => setRendimentoFondo(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">Media storica fondi pensione: 3-4%</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-card p-5 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">TFR già maturato (stima)</p>
                <p className="font-heading text-2xl text-forest">{formatCurrency(risultati.tfrMaturato)}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-card p-5 shadow-sm border-2 border-gray-200">
                  <p className="text-gray-500 text-sm mb-1">TFR in Azienda</p>
                  <p className="font-heading text-xl text-forest">{formatCurrency(risultati.tfrFuturoAzienda)}</p>
                  <p className="text-xs text-gray-400 mt-1">Lordo a fine carriera</p>
                  <hr className="my-3" />
                  <p className="text-sm text-gray-600">Tassazione: {risultati.tassazioneTfrAzienda.toFixed(0)}%</p>
                  <p className="font-heading text-lg text-forest mt-1">{formatCurrency(risultati.nettoAzienda)}</p>
                  <p className="text-xs text-gray-400">Netto</p>
                </div>

                <div className="bg-green-50 rounded-card p-5 shadow-sm border-2 border-green-300">
                  <p className="text-green-700 text-sm mb-1">TFR in Fondo Pensione</p>
                  <p className="font-heading text-xl text-green-700">{formatCurrency(risultati.tfrFuturoFondo)}</p>
                  <p className="text-xs text-green-600 mt-1">Lordo a fine carriera</p>
                  <hr className="my-3 border-green-200" />
                  <p className="text-sm text-green-700">Tassazione: {risultati.tassazioneFondo.toFixed(0)}%</p>
                  <p className="font-heading text-lg text-green-700 mt-1">{formatCurrency(risultati.nettoFondo)}</p>
                  <p className="text-xs text-green-600">Netto</p>
                </div>
              </div>

              {risultati.differenza > 0 && (
                <div className="bg-green-600 rounded-card p-5 text-white">
                  <p className="text-green-100 text-sm mb-1">Vantaggio Fondo Pensione</p>
                  <p className="font-heading text-3xl">+{formatCurrency(risultati.differenza)}</p>
                  <p className="text-green-200 text-sm mt-1">
                    +{risultati.vantaggioPercentuale.toFixed(1)}% rispetto a lasciarlo in azienda
                  </p>
                </div>
              )}

              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-3">Perché il fondo pensione conviene?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Tassazione agevolata:</strong> dal 15% al 9% (vs 23%+ in azienda)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Rendimenti potenzialmente superiori</strong> alla rivalutazione TFR</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Deduzione fiscale</strong> sui contributi volontari aggiuntivi</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom pb-8">
        <RatingWidget toolSlug="tfr" toolName="tfr" />
      </div>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Non sai quale fondo pensione scegliere?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente indipendente può aiutarti a scegliere il fondo più adatto
            alle tue esigenze, senza conflitti di interesse.
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
