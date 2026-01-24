'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Navbar, Footer, RelatedTools, toolCorrelations , RatingWidget, FreeToolBanner} from '@/components'

interface Asset {
  id: string
  nome: string
  valore: number
  categoria: 'liquidita' | 'investimenti' | 'immobili' | 'altro'
}

interface Debt {
  id: string
  nome: string
  valore: number
  categoria: 'mutuo' | 'prestiti' | 'carte' | 'altro'
}

const categorieAttivi = {
  liquidita: { nome: 'Liquidità', colore: 'bg-gray-500' },
  investimenti: { nome: 'Investimenti', colore: 'bg-green-500' },
  immobili: { nome: 'Immobili', colore: 'bg-amber-500' },
  altro: { nome: 'Altro', colore: 'bg-gray-500' },
}

const categoriePassivi = {
  mutuo: { nome: 'Mutui', colore: 'bg-red-500' },
  prestiti: { nome: 'Prestiti', colore: 'bg-orange-500' },
  carte: { nome: 'Carte di credito', colore: 'bg-pink-500' },
  altro: { nome: 'Altri debiti', colore: 'bg-gray-500' },
}

export default function CalcolatorePatrimonioNetto() {
  const [attivi, setAttivi] = useState<Asset[]>([
    { id: '1', nome: 'Conto corrente', valore: 15000, categoria: 'liquidita' },
    { id: '2', nome: 'Conto deposito', valore: 20000, categoria: 'liquidita' },
    { id: '3', nome: 'ETF/Fondi', valore: 50000, categoria: 'investimenti' },
    { id: '4', nome: 'Casa di proprietà', valore: 250000, categoria: 'immobili' },
  ])

  const [passivi, setPassivi] = useState<Debt[]>([
    { id: '1', nome: 'Mutuo casa', valore: 120000, categoria: 'mutuo' },
  ])

  const [nuovoAttivo, setNuovoAttivo] = useState({ nome: '', valore: '', categoria: 'liquidita' as Asset['categoria'] })
  const [nuovoPassivo, setNuovoPassivo] = useState({ nome: '', valore: '', categoria: 'mutuo' as Debt['categoria'] })

  const risultati = useMemo(() => {
    const totaleAttivi = attivi.reduce((sum, a) => sum + a.valore, 0)
    const totalePassivi = passivi.reduce((sum, p) => sum + p.valore, 0)
    const patrimonioNetto = totaleAttivi - totalePassivi

    // Breakdown per categoria
    const attiviPerCategoria = Object.keys(categorieAttivi).map((cat) => {
      const totale = attivi.filter(a => a.categoria === cat).reduce((sum, a) => sum + a.valore, 0)
      return {
        categoria: cat,
        ...categorieAttivi[cat as keyof typeof categorieAttivi],
        totale,
        percentuale: totaleAttivi > 0 ? (totale / totaleAttivi) * 100 : 0,
      }
    }).filter(c => c.totale > 0)

    const passiviPerCategoria = Object.keys(categoriePassivi).map((cat) => {
      const totale = passivi.filter(p => p.categoria === cat).reduce((sum, p) => sum + p.valore, 0)
      return {
        categoria: cat,
        ...categoriePassivi[cat as keyof typeof categoriePassivi],
        totale,
        percentuale: totalePassivi > 0 ? (totale / totalePassivi) * 100 : 0,
      }
    }).filter(c => c.totale > 0)

    // Indicatori
    const rapportoDebitoPatrimonio = totaleAttivi > 0 ? (totalePassivi / totaleAttivi) * 100 : 0
    const liquiditaDisponibile = attivi.filter(a => a.categoria === 'liquidita').reduce((sum, a) => sum + a.valore, 0)

    return {
      totaleAttivi,
      totalePassivi,
      patrimonioNetto,
      attiviPerCategoria,
      passiviPerCategoria,
      rapportoDebitoPatrimonio,
      liquiditaDisponibile,
    }
  }, [attivi, passivi])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const aggiungiAttivo = () => {
    if (nuovoAttivo.nome && nuovoAttivo.valore) {
      setAttivi([...attivi, {
        id: Date.now().toString(),
        nome: nuovoAttivo.nome,
        valore: Number(nuovoAttivo.valore),
        categoria: nuovoAttivo.categoria,
      }])
      setNuovoAttivo({ nome: '', valore: '', categoria: 'liquidita' })
    }
  }

  const aggiungiPassivo = () => {
    if (nuovoPassivo.nome && nuovoPassivo.valore) {
      setPassivi([...passivi, {
        id: Date.now().toString(),
        nome: nuovoPassivo.nome,
        valore: Number(nuovoPassivo.valore),
        categoria: nuovoPassivo.categoria,
      }])
      setNuovoPassivo({ nome: '', valore: '', categoria: 'mutuo' })
    }
  }

  const rimuoviAttivo = (id: string) => {
    setAttivi(attivi.filter(a => a.id !== id))
  }

  const rimuoviPassivo = (id: string) => {
    setPassivi(passivi.filter(p => p.id !== id))
  }

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
            Calcolatore Patrimonio Netto
          </h1>
          <p className="text-white/70 mt-2 max-w-xl">
            Calcola il tuo patrimonio netto: attività meno passività. Il punto di partenza per ogni piano finanziario.
          </p>
        </div>
      </section>

      <section className="section-md bg-cream">
        <div className="container-custom">
          {/* Risultato principale */}
          <div className={`rounded-card p-8 text-white mb-8 ${risultati.patrimonioNetto >= 0 ? 'bg-green-600' : 'bg-red-600'}`}>
            <p className="text-white/80 text-sm mb-1">Il tuo Patrimonio Netto</p>
            <p className="font-heading text-5xl">{formatCurrency(risultati.patrimonioNetto)}</p>
            <div className="flex gap-6 mt-4 text-sm">
              <div>
                <span className="text-white/70">Attività:</span>{' '}
                <span className="font-medium">{formatCurrency(risultati.totaleAttivi)}</span>
              </div>
              <div>
                <span className="text-white/70">Passività:</span>{' '}
                <span className="font-medium">{formatCurrency(risultati.totalePassivi)}</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Attivi */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h2 className="font-heading text-xl text-forest mb-4">Attività (ciò che possiedi)</h2>

              <div className="space-y-3 mb-6">
                {attivi.map((attivo) => (
                  <div key={attivo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${categorieAttivi[attivo.categoria].colore}`} />
                      <div>
                        <p className="font-medium text-sm">{attivo.nome}</p>
                        <p className="text-xs text-gray-400">{categorieAttivi[attivo.categoria].nome}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-green-600">{formatCurrency(attivo.valore)}</span>
                      <button
                        onClick={() => rimuoviAttivo(attivo.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Aggiungi attività</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Nome (es. Conto BancaX)"
                    value={nuovoAttivo.nome}
                    onChange={(e) => setNuovoAttivo({ ...nuovoAttivo, nome: e.target.value })}
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Valore €"
                    value={nuovoAttivo.valore}
                    onChange={(e) => setNuovoAttivo({ ...nuovoAttivo, valore: e.target.value })}
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={nuovoAttivo.categoria}
                    onChange={(e) => setNuovoAttivo({ ...nuovoAttivo, categoria: e.target.value as Asset['categoria'] })}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  >
                    {Object.entries(categorieAttivi).map(([key, val]) => (
                      <option key={key} value={key}>{val.nome}</option>
                    ))}
                  </select>
                  <button
                    onClick={aggiungiAttivo}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                  >
                    Aggiungi
                  </button>
                </div>
              </div>
            </div>

            {/* Passivi */}
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h2 className="font-heading text-xl text-forest mb-4">Passività (ciò che devi)</h2>

              <div className="space-y-3 mb-6">
                {passivi.length === 0 ? (
                  <p className="text-gray-400 text-sm p-3">Nessun debito registrato</p>
                ) : (
                  passivi.map((passivo) => (
                    <div key={passivo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${categoriePassivi[passivo.categoria].colore}`} />
                        <div>
                          <p className="font-medium text-sm">{passivo.nome}</p>
                          <p className="text-xs text-gray-400">{categoriePassivi[passivo.categoria].nome}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-red-600">{formatCurrency(passivo.valore)}</span>
                        <button
                          onClick={() => rimuoviPassivo(passivo.id)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-700 mb-3">Aggiungi passività</p>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Nome (es. Mutuo casa)"
                    value={nuovoPassivo.nome}
                    onChange={(e) => setNuovoPassivo({ ...nuovoPassivo, nome: e.target.value })}
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Valore €"
                    value={nuovoPassivo.valore}
                    onChange={(e) => setNuovoPassivo({ ...nuovoPassivo, valore: e.target.value })}
                    className="px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={nuovoPassivo.categoria}
                    onChange={(e) => setNuovoPassivo({ ...nuovoPassivo, categoria: e.target.value as Debt['categoria'] })}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  >
                    {Object.entries(categoriePassivi).map(([key, val]) => (
                      <option key={key} value={key}>{val.nome}</option>
                    ))}
                  </select>
                  <button
                    onClick={aggiungiPassivo}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                  >
                    Aggiungi
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown e indicatori */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">Composizione Attivi</h3>
              <div className="h-4 rounded-full overflow-hidden flex mb-4">
                {risultati.attiviPerCategoria.map((cat) => (
                  <div
                    key={cat.categoria}
                    className={cat.colore}
                    style={{ width: `${cat.percentuale}%` }}
                  />
                ))}
              </div>
              <div className="space-y-2 text-sm">
                {risultati.attiviPerCategoria.map((cat) => (
                  <div key={cat.categoria} className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${cat.colore}`} />
                      <span className="text-gray-600">{cat.nome}</span>
                    </div>
                    <span className="font-medium">{cat.percentuale.toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-4">Indicatori</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Rapporto Debito/Patrimonio</p>
                  <p className={`font-heading text-xl ${risultati.rapportoDebitoPatrimonio > 50 ? 'text-red-600' : 'text-green-600'}`}>
                    {risultati.rapportoDebitoPatrimonio.toFixed(0)}%
                  </p>
                  <p className="text-xs text-gray-400">Idealmente sotto il 30%</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Liquidità disponibile</p>
                  <p className="font-heading text-xl text-forest">
                    {formatCurrency(risultati.liquiditaDisponibile)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-card p-6 shadow-sm">
              <h3 className="font-heading text-lg text-forest mb-3">Perché calcolare il patrimonio?</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Avere una visione completa delle tue finanze</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Monitorare i progressi nel tempo</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Identificare aree di miglioramento</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Pianificare obiettivi finanziari</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm bg-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Vuoi ottimizzare il tuo patrimonio?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Conoscere il tuo patrimonio netto è il primo passo. Il secondo è farlo crescere
            in modo efficiente. Parliamone insieme.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom pb-8">
        <RatingWidget toolSlug="patrimonio-netto" toolName="patrimonio-netto" />
      </div>

      <RelatedTools tools={toolCorrelations['patrimonio-netto']} />

      <Footer />
    </main>
  )
}
