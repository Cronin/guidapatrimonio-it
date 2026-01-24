'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget} from '@/components'

export default function CalcolatoreStipendioNetto() {
  const [ral, setRal] = useState(35000)
  const [tipoContratto, setTipoContratto] = useState<'indeterminato' | 'determinato'>('indeterminato')
  const [regione, setRegione] = useState('lombardia')
  const [numMensilita, setNumMensilita] = useState(13)
  const [coniuge, setConiuge] = useState(false)
  const [figli, setFigli] = useState(0)

  const risultati = useMemo(() => {
    // Contributi INPS dipendente (circa 9.19%)
    const contributiInps = ral * 0.0919

    // Imponibile fiscale
    const imponibileFiscale = ral - contributiInps

    // IRPEF 2024 con aliquote progressive
    let irpefLorda = 0
    if (imponibileFiscale <= 28000) {
      irpefLorda = imponibileFiscale * 0.23
    } else if (imponibileFiscale <= 50000) {
      irpefLorda = 28000 * 0.23 + (imponibileFiscale - 28000) * 0.35
    } else {
      irpefLorda = 28000 * 0.23 + 22000 * 0.35 + (imponibileFiscale - 50000) * 0.43
    }

    // Detrazioni lavoro dipendente (semplificate)
    let detrazioniLavoro = 0
    if (imponibileFiscale <= 15000) {
      detrazioniLavoro = 1955
    } else if (imponibileFiscale <= 28000) {
      detrazioniLavoro = 1910 + 1190 * ((28000 - imponibileFiscale) / 13000)
    } else if (imponibileFiscale <= 50000) {
      detrazioniLavoro = 1910 * ((50000 - imponibileFiscale) / 22000)
    }

    // Detrazioni figli (semplificate - assegno unico ha sostituito parte)
    const detrazioniFigli = figli * 500 // Stima semplificata

    const irpefNetta = Math.max(0, irpefLorda - detrazioniLavoro - detrazioniFigli)

    // Addizionali regionali e comunali (stima media)
    const addizionaleRegionale = imponibileFiscale * 0.0173
    const addizionaleComunale = imponibileFiscale * 0.008

    const totaleImposte = irpefNetta + addizionaleRegionale + addizionaleComunale

    const nettoAnnuo = ral - contributiInps - totaleImposte
    const nettoMensile = nettoAnnuo / numMensilita

    const aliquotaEffettiva = (totaleImposte / ral) * 100
    const cuneofiscale = ((contributiInps + totaleImposte) / ral) * 100

    return {
      lordo: ral,
      contributiInps,
      imponibileFiscale,
      irpefLorda,
      detrazioniLavoro,
      irpefNetta,
      addizionaleRegionale,
      addizionaleComunale,
      totaleImposte,
      nettoAnnuo,
      nettoMensile,
      aliquotaEffettiva,
      cuneofiscale,
    }
  }, [ral, numMensilita, figli])

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
            Calcolo Stipendio Netto
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Calcola il tuo stipendio netto partendo dalla RAL (Retribuzione Annua Lorda).
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-card p-6 shadow-sm h-fit">
              <h2 className="font-heading text-xl text-forest mb-6">I tuoi dati</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RAL (Retribuzione Annua Lorda): {formatCurrency(ral)}
                  </label>
                  <input
                    type="range"
                    min="15000"
                    max="150000"
                    step="1000"
                    value={ral}
                    onChange={(e) => setRal(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>15.000 €</span>
                    <span>150.000 €</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Numero mensilità</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[12, 13, 14].map((n) => (
                      <button
                        key={n}
                        onClick={() => setNumMensilita(n)}
                        className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                          numMensilita === n ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {n} mensilità
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Figli a carico: {figli}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="1"
                    value={figli}
                    onChange={(e) => setFigli(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-800">
                  <strong>Nota:</strong> Questo è un calcolo semplificato. Il netto effettivo può variare
                  in base a detrazioni specifiche, bonus, welfare aziendale, ecc.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-green-600 rounded-card p-6 text-white">
                <p className="text-green-100 text-sm mb-1">Stipendio Netto Mensile</p>
                <p className="font-heading text-4xl">{formatCurrency(risultati.nettoMensile)}</p>
                <p className="text-green-200 text-sm mt-2">su {numMensilita} mensilità</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Netto Annuo</p>
                  <p className="font-heading text-xl text-forest">{formatCurrency(risultati.nettoAnnuo)}</p>
                </div>
                <div className="bg-white rounded-card p-5 shadow-sm">
                  <p className="text-gray-500 text-sm mb-1">Cuneo Fiscale</p>
                  <p className="font-heading text-xl text-red-600">{risultati.cuneofiscale.toFixed(1)}%</p>
                </div>
              </div>

              <div className="bg-white rounded-card p-6 shadow-sm">
                <h3 className="font-heading text-lg text-forest mb-4">Dettaglio trattenute</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">RAL</span>
                    <span className="font-medium">{formatCurrency(risultati.lordo)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Contributi INPS (9.19%)</span>
                    <span>-{formatCurrency(risultati.contributiInps)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>IRPEF netta</span>
                    <span>-{formatCurrency(risultati.irpefNetta)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Addizionale regionale</span>
                    <span>-{formatCurrency(risultati.addizionaleRegionale)}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>Addizionale comunale</span>
                    <span>-{formatCurrency(risultati.addizionaleComunale)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-medium">
                    <span className="text-forest">Netto Annuo</span>
                    <span className="text-green-600">{formatCurrency(risultati.nettoAnnuo)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-card p-5 shadow-sm">
                <p className="text-gray-500 text-sm mb-1">Aliquota IRPEF effettiva</p>
                <p className="font-heading text-xl text-forest">{risultati.aliquotaEffettiva.toFixed(1)}%</p>
                <div className="mt-3 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 rounded-full"
                    style={{ width: `${risultati.aliquotaEffettiva}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom pb-8">
        <RatingWidget toolSlug="stipendio-netto" toolName="stipendio-netto" />
      </div>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Vuoi ottimizzare la tua situazione fiscale?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Esistono strategie legali per ridurre il carico fiscale e aumentare
            il tuo netto. Scopri come con una consulenza personalizzata.
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
