'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget} from '@/components'

export default function CalcolatorePensione() {
  const [etaAttuale, setEtaAttuale] = useState(40)
  const [etaPensione, setEtaPensione] = useState(67)
  const [redditoAttuale, setRedditoAttuale] = useState(50000)
  const [percentualeDesiderata, setPercentualeDesiderata] = useState(80)
  const [pensioneStatale, setPensioneStatale] = useState(60)
  const [capitaleAttuale, setCapitaleAttuale] = useState(50000)
  const [rendimentoAtteso, setRendimentoAtteso] = useState(5)

  const risultati = useMemo(() => {
    const anniAlPensionamento = etaPensione - etaAttuale
    const aspettativaVita = 85
    const anniInPensione = aspettativaVita - etaPensione

    // Reddito desiderato in pensione (annuo)
    const redditoDesiderato = (redditoAttuale * percentualeDesiderata) / 100

    // Pensione statale stimata
    const pensioneStataleAnnua = (redditoAttuale * pensioneStatale) / 100

    // Gap da colmare
    const gapAnnuo = Math.max(0, redditoDesiderato - pensioneStataleAnnua)

    // Capitale necessario per colmare il gap (regola del 4%)
    const capitaleNecessario = gapAnnuo * 25

    // Capitale futuro con rendimento
    const tassoMensile = rendimentoAtteso / 100 / 12
    const mesi = anniAlPensionamento * 12
    const capitaleFuturoAttuale = capitaleAttuale * Math.pow(1 + tassoMensile, mesi)

    // Gap di capitale
    const gapCapitale = Math.max(0, capitaleNecessario - capitaleFuturoAttuale)

    // Versamento mensile necessario per colmare il gap
    let versamentoMensileNecessario = 0
    if (gapCapitale > 0 && mesi > 0) {
      // PMT = FV * r / ((1+r)^n - 1)
      versamentoMensileNecessario = gapCapitale * tassoMensile / (Math.pow(1 + tassoMensile, mesi) - 1)
    }

    return {
      anniAlPensionamento,
      anniInPensione,
      redditoDesiderato,
      pensioneStataleAnnua,
      gapAnnuo,
      capitaleNecessario,
      capitaleFuturoAttuale,
      gapCapitale,
      versamentoMensileNecessario,
      percentualecoperta: Math.min(100, ((pensioneStataleAnnua + (capitaleFuturoAttuale / 25)) / redditoDesiderato) * 100),
    }
  }, [etaAttuale, etaPensione, redditoAttuale, percentualeDesiderata, pensioneStatale, capitaleAttuale, rendimentoAtteso])

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
            Calcolatore Pensione
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Scopri quanto dovrai risparmiare per mantenere il tuo tenore di vita in pensione.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">I tuoi dati</h2>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Età attuale: {etaAttuale} anni
                    </label>
                    <input
                      type="range"
                      min="25"
                      max="65"
                      value={etaAttuale}
                      onChange={(e) => setEtaAttuale(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Età pensione: {etaPensione} anni
                    </label>
                    <input
                      type="range"
                      min={etaAttuale + 1}
                      max="70"
                      value={etaPensione}
                      onChange={(e) => setEtaPensione(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reddito annuo attuale: {formatCurrency(redditoAttuale)}
                  </label>
                  <input
                    type="range"
                    min="20000"
                    max="200000"
                    step="5000"
                    value={redditoAttuale}
                    onChange={(e) => setRedditoAttuale(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reddito desiderato in pensione: {percentualeDesiderata}% del reddito attuale
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    step="5"
                    value={percentualeDesiderata}
                    onChange={(e) => setPercentualeDesiderata(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">= {formatCurrency(redditoAttuale * percentualeDesiderata / 100)} / anno</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pensione statale stimata: {pensioneStatale}% del reddito
                  </label>
                  <input
                    type="range"
                    min="30"
                    max="80"
                    step="5"
                    value={pensioneStatale}
                    onChange={(e) => setPensioneStatale(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">= {formatCurrency(redditoAttuale * pensioneStatale / 100)} / anno</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risparmi attuali: {formatCurrency(capitaleAttuale)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="5000"
                    value={capitaleAttuale}
                    onChange={(e) => setCapitaleAttuale(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rendimento atteso investimenti: {rendimentoAtteso}%
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="0.5"
                    value={rendimentoAtteso}
                    onChange={(e) => setRendimentoAtteso(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {/* Status */}
              <div className={`rounded-card p-6 ${
                risultati.percentualecoperta >= 100
                  ? 'bg-green-100 border-2 border-green-300'
                  : 'bg-amber-50 border-2 border-amber-300'
              }`}>
                <p className={`text-sm font-medium mb-2 ${
                  risultati.percentualecoperta >= 100 ? 'text-green-700' : 'text-amber-700'
                }`}>
                  {risultati.percentualecoperta >= 100 ? 'Ottimo!' : 'Attenzione'}
                </p>
                <p className="text-gray-700">
                  {risultati.percentualecoperta >= 100
                    ? `Sei sulla buona strada! Con i risparmi attuali puoi raggiungere il ${risultati.percentualecoperta.toFixed(0)}% del tuo obiettivo.`
                    : `Attualmente copri solo il ${risultati.percentualecoperta.toFixed(0)}% del reddito desiderato in pensione.`
                  }
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Anni al pensionamento</p>
                  <p className="font-heading text-3xl text-forest">{risultati.anniAlPensionamento}</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Anni in pensione (stima)</p>
                  <p className="font-heading text-3xl text-forest">{risultati.anniInPensione}</p>
                </div>
              </div>

              <div className="bg-white rounded-card p-5 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Analisi del gap</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reddito desiderato</span>
                    <span className="font-medium">{formatCurrency(risultati.redditoDesiderato)}/anno</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pensione statale stimata</span>
                    <span className="font-medium text-green-600">-{formatCurrency(risultati.pensioneStataleAnnua)}/anno</span>
                  </div>
                  <hr />
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Gap da colmare</span>
                    <span className="font-heading text-xl text-red-600">{formatCurrency(risultati.gapAnnuo)}/anno</span>
                  </div>
                </div>
              </div>

              <div className="bg-green-600 rounded-card p-5 text-white">
                <p className="text-green-100 text-sm mb-1">Capitale necessario alla pensione</p>
                <p className="font-heading text-3xl">{formatCurrency(risultati.capitaleNecessario)}</p>
                <p className="text-green-200 text-xs mt-2">Basato sulla regola del 4% (25x spese annue)</p>
              </div>

              {risultati.gapCapitale > 0 && (
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <h3 className="font-heading text-lg text-forest mb-3">Per raggiungere l&apos;obiettivo</h3>
                  <p className="text-gray-600 mb-4">
                    Devi accumulare altri <strong>{formatCurrency(risultati.gapCapitale)}</strong> nei prossimi {risultati.anniAlPensionamento} anni.
                  </p>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Versamento mensile necessario:</p>
                    <p className="font-heading text-2xl text-green-600">{formatCurrency(risultati.versamentoMensileNecessario)}/mese</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="mt-12 bg-white rounded-card p-6 shadow-sm">
            <h2 className="font-heading text-xl text-forest mb-4">Note importanti</h2>
            <div className="prose prose-sm text-gray-600 max-w-none">
              <ul className="list-disc pl-5 space-y-2">
                <li>Questo è un calcolo semplificato. La pensione statale effettiva dipende da molti fattori (anni di contributi, tipo di lavoro, riforme future).</li>
                <li>La &quot;regola del 4%&quot; suggerisce che puoi prelevare il 4% del capitale ogni anno senza esaurirlo (in media su 30 anni).</li>
                <li>Non abbiamo considerato l&apos;inflazione - in termini reali, potresti aver bisogno di più capitale.</li>
                <li>I rendimenti passati non garantiscono quelli futuri. Un 5-7% è ragionevole per un portafoglio bilanciato di lungo termine.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Pianifica la tua pensione con un esperto
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente indipendente può aiutarti a costruire un piano pensionistico
            personalizzato, considerando tutti i fattori specifici della tua situazione.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom py-8">
        <RatingWidget toolSlug="pensione" toolName="pensione" />
      </div>

      <Footer />
    </main>
  )
}
