'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget} from '@/components'

export default function SimulatorePAC() {
  const [versamentoMensile, setVersamentoMensile] = useState(300)
  const [tassoAnnuo, setTassoAnnuo] = useState(7)
  const [anni, setAnni] = useState(20)
  const [capitaleIniziale, setCapitaleIniziale] = useState(0)

  const risultati = useMemo(() => {
    const tassoMensile = tassoAnnuo / 100 / 12
    const mesiTotali = anni * 12

    // Capitale iniziale cresciuto
    const capitaleInizialeFinale = capitaleIniziale * Math.pow(1 + tassoMensile, mesiTotali)

    // PAC: PMT * ((1+r)^n - 1) / r
    const montantePAC = versamentoMensile * ((Math.pow(1 + tassoMensile, mesiTotali) - 1) / tassoMensile)

    const montanteFinale = capitaleInizialeFinale + montantePAC
    const totaleVersato = capitaleIniziale + (versamentoMensile * mesiTotali)
    const interessiMaturati = montanteFinale - totaleVersato

    // Dati anno per anno
    const datiAnnuali = []
    let capitaleCorrente = capitaleIniziale
    for (let anno = 0; anno <= anni; anno++) {
      if (anno > 0) {
        for (let mese = 0; mese < 12; mese++) {
          capitaleCorrente = capitaleCorrente * (1 + tassoMensile) + versamentoMensile
        }
      }
      datiAnnuali.push({
        anno,
        valore: capitaleCorrente,
        versato: capitaleIniziale + (versamentoMensile * anno * 12),
      })
    }

    return {
      montanteFinale,
      totaleVersato,
      interessiMaturati,
      versamentoTotaleAnno: versamentoMensile * 12,
      datiAnnuali,
    }
  }, [versamentoMensile, tassoAnnuo, anni, capitaleIniziale])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const maxValore = Math.max(...risultati.datiAnnuali.map(d => d.valore))

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
            Simulatore PAC
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Calcola quanto puoi accumulare con un Piano di Accumulo del Capitale, investendo con costanza ogni mese.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form */}
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">Parametri del PAC</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Versamento mensile: {formatCurrency(versamentoMensile)}
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="2000"
                    step="50"
                    value={versamentoMensile}
                    onChange={(e) => setVersamentoMensile(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>50 EUR</span>
                    <span>2.000 EUR</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capitale iniziale (opzionale): {formatCurrency(capitaleIniziale)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={capitaleIniziale}
                    onChange={(e) => setCapitaleIniziale(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0 EUR</span>
                    <span>100.000 EUR</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rendimento annuo atteso: {tassoAnnuo}%
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    step="0.5"
                    value={tassoAnnuo}
                    onChange={(e) => setTassoAnnuo(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1%</span>
                    <span>12%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durata del PAC: {anni} anni
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={anni}
                    onChange={(e) => setAnni(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1 anno</span>
                    <span>40 anni</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Versamento annuo:</strong> {formatCurrency(risultati.versamentoTotaleAnno)}
                </p>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-600 rounded-card p-5 text-white">
                  <p className="text-green-100 text-sm mb-1">Capitale Accumulato</p>
                  <p className="font-heading text-2xl md:text-3xl">{formatCurrency(risultati.montanteFinale)}</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Interessi Maturati</p>
                  <p className="font-heading text-2xl md:text-3xl text-green-600">{formatCurrency(risultati.interessiMaturati)}</p>
                </div>
              </div>

              <div className="bg-white rounded-card p-5 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Totale Versato</p>
                <p className="font-heading text-xl text-forest">{formatCurrency(risultati.totaleVersato)}</p>
                <div className="mt-3 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${(risultati.totaleVersato / risultati.montanteFinale) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Il {((risultati.interessiMaturati / risultati.montanteFinale) * 100).toFixed(0)}% del capitale finale sono interessi!
                </p>
              </div>

              {/* Chart */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Crescita del PAC</h3>
                <div className="h-64 flex items-end gap-1">
                  {risultati.datiAnnuali.filter((_, i) => i % Math.ceil(anni / 15) === 0 || i === anni).map((dato) => (
                    <div key={dato.anno} className="flex-1 flex flex-col items-center">
                      <div className="w-full flex flex-col-reverse" style={{ height: `${(dato.valore / maxValore) * 100}%`, minHeight: '4px' }}>
                        <div
                          className="w-full bg-gray-300 rounded-t"
                          style={{ height: `${(dato.versato / dato.valore) * 100}%` }}
                        />
                        <div
                          className="w-full bg-green-500"
                          style={{ height: `${((dato.valore - dato.versato) / dato.valore) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 mt-1">{dato.anno}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-6 mt-4 text-xs">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-gray-300 rounded" /> Versato
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 bg-green-500 rounded" /> Interessi
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="mt-12 bg-white rounded-card p-6 shadow-sm">
            <h2 className="font-heading text-xl text-forest mb-4">Cos&apos;è un PAC?</h2>
            <div className="prose prose-sm text-gray-600 max-w-none">
              <p>
                Il <strong>Piano di Accumulo del Capitale (PAC)</strong> è una strategia di investimento
                che prevede versamenti periodici costanti, indipendentemente dall&apos;andamento del mercato.
              </p>
              <h3 className="font-heading text-lg text-forest mt-4 mb-2">Vantaggi del PAC</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Media del costo:</strong> Compri di più quando i prezzi sono bassi, di meno quando sono alti</li>
                <li><strong>Disciplina:</strong> Ti obbliga a risparmiare con regolarità</li>
                <li><strong>Accessibilità:</strong> Puoi iniziare anche con piccole somme</li>
                <li><strong>Riduzione del rischio:</strong> Eviti il rischio di entrare nel momento sbagliato</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Vuoi iniziare un PAC ottimizzato?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Un consulente indipendente può aiutarti a scegliere gli strumenti giusti
            e a costruire un PAC su misura per i tuoi obiettivi.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom py-8">
        <RatingWidget toolSlug="pac" toolName="pac" />
      </div>

      <Footer />
    </main>
  )
}
