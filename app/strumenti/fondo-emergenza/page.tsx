'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget, ToolPageSchema} from '@/components'

export default function CalcolatoreFondoEmergenza() {
  const [speseMensili, setSpeseMensili] = useState(2000)
  const [mesiCopertura, setMesiCopertura] = useState(6)
  const [fondiAttuali, setFondiAttuali] = useState(3000)
  const [risparmioMensile, setRisparmioMensile] = useState(300)
  const [situazioneLavorativa, setSituazioneLavorativa] = useState<'stabile' | 'precario' | 'autonomo'>('stabile')

  const risultati = useMemo(() => {
    // Mesi consigliati in base alla situazione
    const mesiConsigliati = {
      stabile: 3,
      precario: 6,
      autonomo: 9,
    }[situazioneLavorativa]

    const fondoNecessario = speseMensili * mesiCopertura
    const fondoConsigliato = speseMensili * mesiConsigliati
    const gap = Math.max(0, fondoNecessario - fondiAttuali)
    const mesiPerRaggiungere = gap > 0 ? Math.ceil(gap / risparmioMensile) : 0
    const progressoPercentuale = Math.min(100, (fondiAttuali / fondoNecessario) * 100)

    return {
      fondoNecessario,
      fondoConsigliato,
      mesiConsigliati,
      gap,
      mesiPerRaggiungere,
      progressoPercentuale,
      giaRaggiunto: fondiAttuali >= fondoNecessario,
    }
  }, [speseMensili, mesiCopertura, fondiAttuali, risparmioMensile, situazioneLavorativa])

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
      <ToolPageSchema slug="fondo-emergenza" />
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
            Calcolatore Fondo Emergenza
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Calcola quanto dovresti avere da parte per affrontare imprevisti senza stress.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">La tua situazione</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spese mensili essenziali: {formatCurrency(speseMensili)}
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="100"
                    value={speseMensili}
                    onChange={(e) => setSpeseMensili(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <p className="text-xs text-gray-400 mt-1">Affitto, utenze, cibo, trasporti, assicurazioni</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Situazione lavorativa</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'stabile', label: 'Stabile', desc: '3 mesi' },
                      { value: 'precario', label: 'Precario', desc: '6 mesi' },
                      { value: 'autonomo', label: 'Autonomo', desc: '9 mesi' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSituazioneLavorativa(opt.value as typeof situazioneLavorativa)}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          situazioneLavorativa === opt.value
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <div>{opt.label}</div>
                        <div className="text-xs opacity-70">{opt.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mesi di copertura desiderati: {mesiCopertura}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={mesiCopertura}
                    onChange={(e) => setMesiCopertura(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fondi attuali: {formatCurrency(fondiAttuali)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="30000"
                    step="500"
                    value={fondiAttuali}
                    onChange={(e) => setFondiAttuali(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Risparmio mensile: {formatCurrency(risparmioMensile)}
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="1500"
                    step="50"
                    value={risparmioMensile}
                    onChange={(e) => setRisparmioMensile(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {risultati.giaRaggiunto ? (
                <div className="bg-green-600 rounded-card p-6 text-white text-center">
                  <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="font-heading text-2xl">Obiettivo raggiunto!</p>
                  <p className="text-green-100 mt-2">Hai già un fondo emergenza adeguato</p>
                </div>
              ) : (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-card p-6">
                  <p className="text-amber-700 text-sm font-medium mb-1">Da accumulare</p>
                  <p className="font-heading text-3xl text-amber-700">{formatCurrency(risultati.gap)}</p>
                  <p className="text-amber-600 text-sm mt-2">
                    Ci vorranno circa <strong>{risultati.mesiPerRaggiungere} mesi</strong> risparmiando {formatCurrency(risparmioMensile)}/mese
                  </p>
                </div>
              )}

              <div className="bg-white rounded-card p-5 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Fondo emergenza necessario</p>
                <p className="font-heading text-2xl text-forest">{formatCurrency(risultati.fondoNecessario)}</p>
                <p className="text-xs text-gray-400 mt-1">{mesiCopertura} mesi × {formatCurrency(speseMensili)}</p>
              </div>

              <div className="bg-white rounded-card p-5 shadow-sm">
                <p className="text-gray-500 text-sm mb-3">Progresso</p>
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      risultati.progressoPercentuale >= 100 ? 'bg-green-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${risultati.progressoPercentuale}%` }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-sm">
                  <span className="text-gray-500">{formatCurrency(fondiAttuali)}</span>
                  <span className="font-medium text-forest">{risultati.progressoPercentuale.toFixed(0)}%</span>
                </div>
              </div>

              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-3">Perché un fondo emergenza?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Perdita di lavoro:</strong> tempo per trovarne uno nuovo senza panico</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Spese mediche:</strong> imprevisti di salute non coperti</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Riparazioni urgenti:</strong> auto, casa, elettrodomestici</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Serenità mentale:</strong> dormire tranquilli sapendo di essere coperti</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-card p-4">
                <p className="text-sm text-gray-800">
                  <strong>Suggerimento:</strong> Il fondo emergenza va tenuto in strumenti liquidi
                  e sicuri (conto deposito, BOT), non investito in azioni o altri strumenti volatili.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom pb-8">
        <RatingWidget toolSlug="fondo-emergenza" toolName="fondo-emergenza" />
      </div>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Una volta costruito il fondo emergenza?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Il passo successivo è investire il surplus. Un consulente indipendente
            può aiutarti a costruire un piano di investimento efficace.
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
