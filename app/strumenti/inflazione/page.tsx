'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer } from '@/components'

export default function CalcolatoreInflazione() {
  const [importo, setImporto] = useState(100000)
  const [inflazione, setInflazione] = useState(3)
  const [anni, setAnni] = useState(10)
  const [modalita, setModalita] = useState<'futuro' | 'passato'>('futuro')

  const risultati = useMemo(() => {
    const fattore = Math.pow(1 + inflazione / 100, anni)

    if (modalita === 'futuro') {
      // Quanto varrà in futuro?
      const valoreFuturoNominale = importo
      const potereAcquistoFuturo = importo / fattore
      const perditaPotereAcquisto = importo - potereAcquistoFuturo

      return {
        valoreOriginale: importo,
        valoreCalcolato: potereAcquistoFuturo,
        differenza: perditaPotereAcquisto,
        percentualePerdita: ((importo - potereAcquistoFuturo) / importo) * 100,
        descrizione: `Tra ${anni} anni, ${formatCurrency(importo)} avranno il potere d'acquisto di ${formatCurrency(potereAcquistoFuturo)} di oggi.`,
      }
    } else {
      // Quanto valeva in passato?
      const valorePassato = importo * fattore
      const differenza = valorePassato - importo

      return {
        valoreOriginale: importo,
        valoreCalcolato: valorePassato,
        differenza: differenza,
        percentualePerdita: ((valorePassato - importo) / valorePassato) * 100,
        descrizione: `${anni} anni fa, servivano ${formatCurrency(valorePassato)} per avere lo stesso potere d'acquisto di ${formatCurrency(importo)} di oggi.`,
      }
    }
  }, [importo, inflazione, anni, modalita])

  function formatCurrency(value: number) {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Dati per il grafico
  const datiGrafico = useMemo(() => {
    const dati = []
    for (let anno = 0; anno <= anni; anno++) {
      const fattore = Math.pow(1 + inflazione / 100, anno)
      if (modalita === 'futuro') {
        dati.push({
          anno,
          valore: importo / fattore,
        })
      } else {
        dati.push({
          anno,
          valore: importo * Math.pow(1 + inflazione / 100, anni - anno),
        })
      }
    }
    return dati
  }, [importo, inflazione, anni, modalita])

  const maxValore = Math.max(...datiGrafico.map(d => d.valore))

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
            Calcolatore Inflazione
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Scopri come l&apos;inflazione erode il potere d&apos;acquisto del tuo denaro nel tempo.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">Parametri</h2>

              {/* Modalità */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Cosa vuoi calcolare?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setModalita('futuro')}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      modalita === 'futuro'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Valore Futuro
                  </button>
                  <button
                    onClick={() => setModalita('passato')}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      modalita === 'passato'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Valore Passato
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Importo: {formatCurrency(importo)}
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="1000000"
                    step="1000"
                    value={importo}
                    onChange={(e) => setImporto(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1.000 EUR</span>
                    <span>1.000.000 EUR</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tasso di inflazione annuo: {inflazione}%
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={inflazione}
                    onChange={(e) => setInflazione(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0.5%</span>
                    <span>10%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Media storica Italia: ~2-3% | Media 2022-2024: ~6-8%
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Periodo: {anni} anni
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={anni}
                    onChange={(e) => setAnni(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1 anno</span>
                    <span>30 anni</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {/* Main Result */}
              <div className="bg-red-50 border-2 border-red-200 rounded-card p-6">
                <p className="text-red-600 text-sm font-medium mb-2">Risultato</p>
                <p className="text-gray-700 text-lg">{risultati.descrizione}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Importo Originale</p>
                  <p className="font-heading text-2xl text-forest">{formatCurrency(risultati.valoreOriginale)}</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Potere d&apos;Acquisto Reale</p>
                  <p className="font-heading text-2xl text-red-600">{formatCurrency(risultati.valoreCalcolato)}</p>
                </div>
              </div>

              <div className="bg-white rounded-card p-5 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Perdita di valore</p>
                <p className="font-heading text-xl text-red-500">-{formatCurrency(Math.abs(modalita === 'futuro' ? risultati.differenza : importo - risultati.valoreCalcolato))}</p>
                <p className="text-xs text-gray-400 mt-1">
                  -{risultati.percentualePerdita.toFixed(1)}% del potere d&apos;acquisto
                </p>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">
                  {modalita === 'futuro' ? 'Erosione del potere d\'acquisto' : 'Valore equivalente nel tempo'}
                </h3>
                <div className="h-48 flex items-end gap-1">
                  {datiGrafico.filter((_, i) => i % Math.ceil(anni / 10) === 0 || i === anni).map((dato, index) => (
                    <div key={dato.anno} className="flex-1 flex flex-col items-center">
                      <div
                        className={`w-full rounded-t transition-all duration-300 ${
                          modalita === 'futuro'
                            ? index === 0 ? 'bg-green-500' : 'bg-red-400'
                            : index === datiGrafico.length - 1 ? 'bg-green-500' : 'bg-red-400'
                        }`}
                        style={{ height: `${(dato.valore / maxValore) * 100}%`, minHeight: '4px' }}
                      />
                      <span className="text-xs text-gray-400 mt-1">
                        {modalita === 'futuro' ? `+${dato.anno}` : `-${anni - dato.anno}`}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 text-center mt-2">Anni</p>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-12 bg-white rounded-card p-6 shadow-sm">
            <h2 className="font-heading text-xl text-forest mb-4">Perché l&apos;inflazione è importante?</h2>
            <div className="prose prose-sm text-gray-600 max-w-none">
              <p>
                L&apos;inflazione è l&apos;aumento generalizzato dei prezzi nel tempo. Anche se il tuo denaro
                rimane lo stesso nominalmente, il suo potere d&apos;acquisto diminuisce.
              </p>
              <p className="mt-4">
                <strong>Esempio concreto:</strong> Con un&apos;inflazione del 3% annuo, 100.000 EUR di oggi
                avranno tra 20 anni lo stesso potere d&apos;acquisto di soli ~55.000 EUR attuali.
              </p>
              <p className="mt-4">
                <strong>La soluzione:</strong> Investire il proprio capitale in modo che il rendimento
                superi l&apos;inflazione, preservando e possibilmente aumentando il potere d&apos;acquisto nel tempo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Proteggi il tuo patrimonio dall&apos;inflazione
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente indipendente può aiutarti a costruire un portafoglio
            che protegga il tuo capitale dalla perdita di potere d&apos;acquisto.
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
