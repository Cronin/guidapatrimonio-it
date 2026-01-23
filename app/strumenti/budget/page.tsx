'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer } from '@/components'

export default function CalcolatoreBudget() {
  const [redditoNetto, setRedditoNetto] = useState(2500)
  const [metodo, setMetodo] = useState<'50-30-20' | 'personalizzato'>('50-30-20')
  const [percentualeNecessita, setPercentualeNecessita] = useState(50)
  const [percentualeDesideri, setPercentualeDesideri] = useState(30)

  const risultati = useMemo(() => {
    const percNecessita = metodo === '50-30-20' ? 50 : percentualeNecessita
    const percDesideri = metodo === '50-30-20' ? 30 : percentualeDesideri
    const percRisparmio = 100 - percNecessita - percDesideri

    const necessita = (redditoNetto * percNecessita) / 100
    const desideri = (redditoNetto * percDesideri) / 100
    const risparmio = (redditoNetto * percRisparmio) / 100

    const risparmioAnnuo = risparmio * 12

    // Esempi di categorie
    const categorieNecessita = [
      { nome: 'Affitto/Mutuo', max: necessita * 0.5 },
      { nome: 'Utenze', max: necessita * 0.15 },
      { nome: 'Spesa alimentare', max: necessita * 0.2 },
      { nome: 'Trasporti', max: necessita * 0.1 },
      { nome: 'Assicurazioni', max: necessita * 0.05 },
    ]

    const categorieDesideri = [
      { nome: 'Ristoranti/Svago', max: desideri * 0.4 },
      { nome: 'Shopping', max: desideri * 0.25 },
      { nome: 'Viaggi', max: desideri * 0.2 },
      { nome: 'Hobby', max: desideri * 0.15 },
    ]

    return {
      necessita,
      desideri,
      risparmio,
      percNecessita,
      percDesideri,
      percRisparmio,
      risparmioAnnuo,
      categorieNecessita,
      categorieDesideri,
    }
  }, [redditoNetto, metodo, percentualeNecessita, percentualeDesideri])

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
            Calcolatore Budget 50/30/20
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Organizza le tue finanze con la regola del 50/30/20: necessità, desideri, risparmio.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">Il tuo reddito</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reddito netto mensile: {formatCurrency(redditoNetto)}
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="10000"
                    step="100"
                    value={redditoNetto}
                    onChange={(e) => setRedditoNetto(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Metodo di budgeting</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setMetodo('50-30-20')}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        metodo === '50-30-20' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      50/30/20 Classico
                    </button>
                    <button
                      onClick={() => setMetodo('personalizzato')}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        metodo === 'personalizzato' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Personalizzato
                    </button>
                  </div>
                </div>

                {metodo === 'personalizzato' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Necessità: {percentualeNecessita}%
                      </label>
                      <input
                        type="range"
                        min="30"
                        max="70"
                        value={percentualeNecessita}
                        onChange={(e) => setPercentualeNecessita(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Desideri: {percentualeDesideri}%
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="50"
                        value={percentualeDesideri}
                        onChange={(e) => setPercentualeDesideri(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        Risparmio: <strong className="text-green-600">{100 - percentualeNecessita - percentualeDesideri}%</strong>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Visual Breakdown */}
              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Divisione del budget</h3>
                <div className="h-8 rounded-full overflow-hidden flex">
                  <div className="bg-gray-500" style={{ width: `${risultati.percNecessita}%` }} />
                  <div className="bg-amber-500" style={{ width: `${risultati.percDesideri}%` }} />
                  <div className="bg-green-500" style={{ width: `${risultati.percRisparmio}%` }} />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Necessità {risultati.percNecessita}%</span>
                  <span>Desideri {risultati.percDesideri}%</span>
                  <span>Risparmio {risultati.percRisparmio}%</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-card p-4 border-2 border-gray-200">
                  <p className="text-gray-700 text-xs font-medium mb-1">Necessità</p>
                  <p className="font-heading text-xl text-gray-700">{formatCurrency(risultati.necessita)}</p>
                </div>
                <div className="bg-amber-50 rounded-card p-4 border-2 border-amber-200">
                  <p className="text-amber-700 text-xs font-medium mb-1">Desideri</p>
                  <p className="font-heading text-xl text-amber-700">{formatCurrency(risultati.desideri)}</p>
                </div>
                <div className="bg-green-50 rounded-card p-4 border-2 border-green-200">
                  <p className="text-green-700 text-xs font-medium mb-1">Risparmio</p>
                  <p className="font-heading text-xl text-green-700">{formatCurrency(risultati.risparmio)}</p>
                </div>
              </div>

              <div className="bg-green-600 rounded-card p-5 text-white">
                <p className="text-green-100 text-sm mb-1">Risparmio annuo</p>
                <p className="font-heading text-3xl">{formatCurrency(risultati.risparmioAnnuo)}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <h4 className="font-medium text-gray-700 mb-3 text-sm">Necessità ({risultati.percNecessita}%)</h4>
                  <ul className="space-y-2 text-sm">
                    {risultati.categorieNecessita.map((cat) => (
                      <li key={cat.nome} className="flex justify-between">
                        <span className="text-gray-600">{cat.nome}</span>
                        <span className="font-medium">{formatCurrency(cat.max)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <h4 className="font-medium text-amber-700 mb-3 text-sm">Desideri ({risultati.percDesideri}%)</h4>
                  <ul className="space-y-2 text-sm">
                    {risultati.categorieDesideri.map((cat) => (
                      <li key={cat.nome} className="flex justify-between">
                        <span className="text-gray-600">{cat.nome}</span>
                        <span className="font-medium">{formatCurrency(cat.max)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Vuoi far lavorare i tuoi risparmi?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Risparmiare è il primo passo. Il secondo è investire in modo intelligente.
            Scopri come con una consulenza personalizzata.
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
