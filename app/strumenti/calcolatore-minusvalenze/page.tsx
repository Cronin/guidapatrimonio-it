'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget, ToolPageSchema} from '@/components'

// Tipi di asset secondo normativa italiana
type TipoAsset = 'azioni' | 'etf' | 'etc' | 'obbligazioni' | 'certificati'

interface Minusvalenza {
  id: string
  importo: number
  dataRealizzazione: string
  tipo: TipoAsset
  descrizione?: string
}

interface Plusvalenza {
  id: string
  importo: number
  tipo: TipoAsset
  descrizione?: string
}

interface Compensazione {
  id: string
  data: string
  importoMinusvalenza: number
  importoPlusvalenza: number
  risparmio: number
  note?: string
}

// Categorie fiscali: "redditi diversi" vs "redditi capitale"
const REDDITI_DIVERSI: TipoAsset[] = ['azioni', 'etc', 'certificati']
const REDDITI_CAPITALE: TipoAsset[] = ['etf', 'obbligazioni']

const ALIQUOTA_CAPITAL_GAIN = 0.26 // 26%
const ANNI_SCADENZA = 4

const TIPO_ASSET_LABELS: Record<TipoAsset, string> = {
  azioni: 'Azioni',
  etf: 'ETF',
  etc: 'ETC',
  obbligazioni: 'Obbligazioni',
  certificati: 'Certificati',
}

const TIPO_ASSET_COLORS: Record<TipoAsset, { bg: string; text: string }> = {
  azioni: { bg: 'bg-blue-100', text: 'text-blue-700' },
  etf: { bg: 'bg-purple-100', text: 'text-purple-700' },
  etc: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  obbligazioni: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  certificati: { bg: 'bg-teal-100', text: 'text-teal-700' },
}

const LOCAL_STORAGE_KEY = 'guidapatrimonio_minusvalenze_v2'

// Animated number component
function AnimatedNumber({ value, format }: { value: number; format: (v: number) => string }) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    const duration = 500
    const steps = 20
    const stepDuration = duration / steps
    const increment = (value - displayValue) / steps
    let currentStep = 0

    const timer = setInterval(() => {
      currentStep++
      if (currentStep >= steps) {
        setDisplayValue(value)
        clearInterval(timer)
      } else {
        setDisplayValue((prev) => prev + increment)
      }
    }, stepDuration)

    return () => clearInterval(timer)
  }, [value])

  return <>{format(displayValue)}</>
}

export default function CalcolatoreMinusvalenze() {
  const oggi = new Date()
  const annoCorrente = oggi.getFullYear()

  // State
  const [minusvalenze, setMinusvalenze] = useState<Minusvalenza[]>([])
  const [plusvalenze, setPlusvalenze] = useState<Plusvalenza[]>([])
  const [storicoCompensazioni, setStoricoCompensazioni] = useState<Compensazione[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [showReminderModal, setShowReminderModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'zainetto' | 'simulazione' | 'strategia' | 'storico'>('zainetto')
  const [plusvalenzaIpotetica, setPlusvalenzaIpotetica] = useState(10000)

  // Form per nuova minusvalenza
  const [nuovaMinusvalenza, setNuovaMinusvalenza] = useState({
    importo: '',
    dataRealizzazione: '',
    tipo: 'azioni' as TipoAsset,
    descrizione: '',
  })

  // Form per nuova plusvalenza
  const [nuovaPlusvalenza, setNuovaPlusvalenza] = useState({
    importo: '',
    tipo: 'azioni' as TipoAsset,
    descrizione: '',
  })

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.minusvalenze) setMinusvalenze(data.minusvalenze)
        if (data.plusvalenze) setPlusvalenze(data.plusvalenze)
        if (data.storicoCompensazioni) setStoricoCompensazioni(data.storicoCompensazioni)
      } else {
        // Demo data per nuovi utenti
        setMinusvalenze([
          {
            id: '1',
            importo: 5000,
            dataRealizzazione: `${annoCorrente - 3}-06-15`,
            tipo: 'etf',
            descrizione: 'ETF MSCI World venduto in perdita',
          },
          {
            id: '2',
            importo: 2000,
            dataRealizzazione: `${annoCorrente - 1}-03-20`,
            tipo: 'azioni',
            descrizione: 'Azioni tech vendute',
          },
          {
            id: '3',
            importo: 1500,
            dataRealizzazione: `${annoCorrente}-01-10`,
            tipo: 'etc',
            descrizione: 'ETC oro',
          },
        ])
        setPlusvalenze([
          {
            id: '1',
            importo: 8000,
            tipo: 'azioni',
            descrizione: 'Vendita azioni in profitto',
          },
        ])
      }
    } catch (e) {
      console.error('Errore nel caricamento dati:', e)
    }
    setIsLoaded(true)
  }, [annoCorrente])

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          minusvalenze,
          plusvalenze,
          storicoCompensazioni,
          lastUpdated: new Date().toISOString(),
        })
      )
    }
  }, [minusvalenze, plusvalenze, storicoCompensazioni, isLoaded])

  // Calcoli
  const risultati = useMemo(() => {
    // Data limite per scadenza (4 anni fa)
    const dataLimiteScadenza = new Date(oggi)
    dataLimiteScadenza.setFullYear(dataLimiteScadenza.getFullYear() - ANNI_SCADENZA)

    // Filtra minusvalenze ancora valide (non scadute)
    const minusvalenzeValide = minusvalenze.filter((m) => {
      const dataReal = new Date(m.dataRealizzazione)
      return dataReal > dataLimiteScadenza
    })

    // Ordina per scadenza (FIFO - prima quelle piu vecchie)
    const minusvalenzeOrdinate = [...minusvalenzeValide].sort((a, b) => {
      return new Date(a.dataRealizzazione).getTime() - new Date(b.dataRealizzazione).getTime()
    })

    // Calcola scadenza per ogni minusvalenza
    const minusvalenzeConScadenza = minusvalenzeOrdinate.map((m) => {
      const dataReal = new Date(m.dataRealizzazione)
      const annoRealizzazione = dataReal.getFullYear()
      const dataScadenza = new Date(annoRealizzazione + ANNI_SCADENZA, 11, 31)

      const giorniAllaScadenza = Math.ceil(
        (dataScadenza.getTime() - oggi.getTime()) / (1000 * 60 * 60 * 24)
      )
      const mesiAllaScadenza = Math.ceil(giorniAllaScadenza / 30)

      return {
        ...m,
        annoRealizzazione,
        dataScadenza,
        giorniAllaScadenza,
        mesiAllaScadenza,
        inScadenza3Mesi: giorniAllaScadenza <= 90 && giorniAllaScadenza > 0,
        inScadenza6Mesi: giorniAllaScadenza <= 180 && giorniAllaScadenza > 0,
        inScadenza12Mesi: giorniAllaScadenza <= 365 && giorniAllaScadenza > 0,
        scaduta: giorniAllaScadenza <= 0,
        percentualeVitaRimanente: Math.max(0, Math.min(100, (giorniAllaScadenza / (365 * 4)) * 100)),
      }
    })

    // Raggruppa per anno
    const minusvalenzePerAnno: Record<number, typeof minusvalenzeConScadenza> = {}
    for (let i = 0; i <= ANNI_SCADENZA; i++) {
      const anno = annoCorrente - i
      minusvalenzePerAnno[anno] = minusvalenzeConScadenza.filter((m) => m.annoRealizzazione === anno)
    }

    // Separa minusvalenze per categoria fiscale
    const minusvalenzeRedditiCapitale = minusvalenzeConScadenza.filter((m) =>
      REDDITI_CAPITALE.includes(m.tipo)
    )
    const minusvalenzeRedditiDiversi = minusvalenzeConScadenza.filter((m) =>
      REDDITI_DIVERSI.includes(m.tipo)
    )

    // Totali
    const totaleMinusvalenze = minusvalenzeConScadenza.reduce((sum, m) => sum + m.importo, 0)
    const totaleMinusvalenzeRedditiCapitale = minusvalenzeRedditiCapitale.reduce(
      (sum, m) => sum + m.importo,
      0
    )
    const totaleMinusvalenzeRedditiDiversi = minusvalenzeRedditiDiversi.reduce(
      (sum, m) => sum + m.importo,
      0
    )

    // Minusvalenze in scadenza
    const minusvalenzeInScadenza3Mesi = minusvalenzeConScadenza.filter((m) => m.inScadenza3Mesi)
    const totaleInScadenza3Mesi = minusvalenzeInScadenza3Mesi.reduce((sum, m) => sum + m.importo, 0)

    const minusvalenzeInScadenza6Mesi = minusvalenzeConScadenza.filter((m) => m.inScadenza6Mesi)
    const totaleInScadenza6Mesi = minusvalenzeInScadenza6Mesi.reduce((sum, m) => sum + m.importo, 0)

    const minusvalenzeInScadenza12Mesi = minusvalenzeConScadenza.filter((m) => m.inScadenza12Mesi)
    const totaleInScadenza12Mesi = minusvalenzeInScadenza12Mesi.reduce(
      (sum, m) => sum + m.importo,
      0
    )

    // Plusvalenze per categoria
    const plusvalenzeRedditiDiversi = plusvalenze.filter((p) => REDDITI_DIVERSI.includes(p.tipo))
    const plusvalenzeRedditiCapitale = plusvalenze.filter((p) => REDDITI_CAPITALE.includes(p.tipo))

    const totalePlusvalenzeRedditiDiversi = plusvalenzeRedditiDiversi.reduce(
      (sum, p) => sum + p.importo,
      0
    )
    const totalePlusvalenzeRedditiCapitale = plusvalenzeRedditiCapitale.reduce(
      (sum, p) => sum + p.importo,
      0
    )
    const totalePlusvalenze = totalePlusvalenzeRedditiDiversi + totalePlusvalenzeRedditiCapitale

    // Calcolo compensazione FIFO
    let minusvalenzeRedditiCapitaleRimanenti = totaleMinusvalenzeRedditiCapitale
    let minusvalenzeRedditiDiversiRimanenti = totaleMinusvalenzeRedditiDiversi

    let plusvalenzeRedditiDiversiRimanenti = totalePlusvalenzeRedditiDiversi
    let plusvalenzeRedditiCapitaleRimanenti = totalePlusvalenzeRedditiCapitale

    const compensazioneETFsuAzioni = Math.min(
      minusvalenzeRedditiCapitaleRimanenti,
      plusvalenzeRedditiDiversiRimanenti
    )
    minusvalenzeRedditiCapitaleRimanenti -= compensazioneETFsuAzioni
    plusvalenzeRedditiDiversiRimanenti -= compensazioneETFsuAzioni

    const compensazioneAzioniSuAzioni = Math.min(
      minusvalenzeRedditiDiversiRimanenti,
      plusvalenzeRedditiDiversiRimanenti
    )
    minusvalenzeRedditiDiversiRimanenti -= compensazioneAzioniSuAzioni
    plusvalenzeRedditiDiversiRimanenti -= compensazioneAzioniSuAzioni

    const compensazioneAzioniSuETF = Math.min(
      minusvalenzeRedditiDiversiRimanenti,
      plusvalenzeRedditiCapitaleRimanenti
    )
    minusvalenzeRedditiDiversiRimanenti -= compensazioneAzioniSuETF
    plusvalenzeRedditiCapitaleRimanenti -= compensazioneAzioniSuETF

    const totaleCompensato = compensazioneETFsuAzioni + compensazioneAzioniSuAzioni + compensazioneAzioniSuETF
    const minusvalenzeRimanenti = minusvalenzeRedditiCapitaleRimanenti + minusvalenzeRedditiDiversiRimanenti
    const plusvalenzeNonCompensate = plusvalenzeRedditiDiversiRimanenti + plusvalenzeRedditiCapitaleRimanenti

    // Risparmio fiscale
    const risparmioFiscale = totaleCompensato * ALIQUOTA_CAPITAL_GAIN
    const tasseDaPagareSenzaCompensazione = totalePlusvalenze * ALIQUOTA_CAPITAL_GAIN
    const tasseDaPagareConCompensazione = plusvalenzeNonCompensate * ALIQUOTA_CAPITAL_GAIN

    // Risparmio potenziale se si realizzassero plusvalenze per usare minusvalenze in scadenza
    const risparmioPotenziale3Mesi = totaleInScadenza3Mesi * ALIQUOTA_CAPITAL_GAIN
    const risparmioPotenziale6Mesi = totaleInScadenza6Mesi * ALIQUOTA_CAPITAL_GAIN
    const risparmioPotenziale12Mesi = totaleInScadenza12Mesi * ALIQUOTA_CAPITAL_GAIN

    // Calcolo plusvalenza necessaria per azzerare zainetto
    const plusvalenzaNecessariaPerAzzerare = totaleMinusvalenze

    // Simulazione con plusvalenza ipotetica
    const simulaCompensazione = (plusIpotetica: number) => {
      let plusRimanente = plusIpotetica
      const dettaglioFIFO: Array<{ minusvalenza: typeof minusvalenzeConScadenza[0]; importoCompensato: number }> = []

      // Ordina per scadenza (FIFO)
      const minusOrdinate = [...minusvalenzeConScadenza].sort((a, b) => a.giorniAllaScadenza - b.giorniAllaScadenza)

      for (const m of minusOrdinate) {
        if (plusRimanente <= 0) break

        // Verifica compatibilita fiscale
        const isMinusRedditoCapitale = REDDITI_CAPITALE.includes(m.tipo)

        // Minusvalenze da redditi capitale (ETF/obbligazioni) compensano solo redditi diversi
        // Per semplicita nella simulazione, assumiamo che la plusvalenza ipotetica sia da redditi diversi
        const compensabile = !isMinusRedditoCapitale || true // Semplificato: compensa tutto

        if (compensabile) {
          const importoCompensato = Math.min(m.importo, plusRimanente)
          dettaglioFIFO.push({ minusvalenza: m, importoCompensato })
          plusRimanente -= importoCompensato
        }
      }

      const totaleCompensatoSim = plusIpotetica - plusRimanente
      const risparmioSim = totaleCompensatoSim * ALIQUOTA_CAPITAL_GAIN

      return { dettaglioFIFO, totaleCompensato: totaleCompensatoSim, risparmio: risparmioSim, plusvalenzeRimanenti: plusRimanente }
    }

    const simulazione = simulaCompensazione(plusvalenzaIpotetica)

    return {
      minusvalenzeConScadenza,
      minusvalenzePerAnno,
      totaleMinusvalenze,
      totaleMinusvalenzeRedditiCapitale,
      totaleMinusvalenzeRedditiDiversi,
      minusvalenzeInScadenza3Mesi,
      totaleInScadenza3Mesi,
      minusvalenzeInScadenza6Mesi,
      totaleInScadenza6Mesi,
      minusvalenzeInScadenza12Mesi,
      totaleInScadenza12Mesi,
      totalePlusvalenze,
      totalePlusvalenzeRedditiDiversi,
      totalePlusvalenzeRedditiCapitale,
      totaleCompensato,
      minusvalenzeRimanenti,
      plusvalenzeNonCompensate,
      risparmioFiscale,
      tasseDaPagareSenzaCompensazione,
      tasseDaPagareConCompensazione,
      risparmioPotenziale3Mesi,
      risparmioPotenziale6Mesi,
      risparmioPotenziale12Mesi,
      compensazioneETFsuAzioni,
      compensazioneAzioniSuAzioni,
      compensazioneAzioniSuETF,
      plusvalenzaNecessariaPerAzzerare,
      simulazione,
    }
  }, [minusvalenze, plusvalenze, oggi, annoCorrente, plusvalenzaIpotetica])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const aggiungiMinusvalenza = () => {
    if (nuovaMinusvalenza.importo && nuovaMinusvalenza.dataRealizzazione) {
      setMinusvalenze([
        ...minusvalenze,
        {
          id: Date.now().toString(),
          importo: Number(nuovaMinusvalenza.importo),
          dataRealizzazione: nuovaMinusvalenza.dataRealizzazione,
          tipo: nuovaMinusvalenza.tipo,
          descrizione: nuovaMinusvalenza.descrizione || undefined,
        },
      ])
      setNuovaMinusvalenza({
        importo: '',
        dataRealizzazione: '',
        tipo: 'azioni',
        descrizione: '',
      })
    }
  }

  const rimuoviMinusvalenza = (id: string) => {
    setMinusvalenze(minusvalenze.filter((m) => m.id !== id))
  }

  const aggiungiPlusvalenza = () => {
    if (nuovaPlusvalenza.importo) {
      setPlusvalenze([
        ...plusvalenze,
        {
          id: Date.now().toString(),
          importo: Number(nuovaPlusvalenza.importo),
          tipo: nuovaPlusvalenza.tipo,
          descrizione: nuovaPlusvalenza.descrizione || undefined,
        },
      ])
      setNuovaPlusvalenza({
        importo: '',
        tipo: 'azioni',
        descrizione: '',
      })
    }
  }

  const rimuoviPlusvalenza = (id: string) => {
    setPlusvalenze(plusvalenze.filter((p) => p.id !== id))
  }

  const registraCompensazione = () => {
    if (risultati.totaleCompensato > 0) {
      setStoricoCompensazioni([
        ...storicoCompensazioni,
        {
          id: Date.now().toString(),
          data: oggi.toISOString().split('T')[0],
          importoMinusvalenza: risultati.totaleCompensato,
          importoPlusvalenza: risultati.totalePlusvalenze,
          risparmio: risultati.risparmioFiscale,
          note: `Compensazione automatica`,
        },
      ])
    }
  }

  const exportPDF = useCallback(() => {
    // Genera contenuto per il PDF (in realta sara una pagina stampabile)
    const content = `
RIEPILOGO ZAINETTO FISCALE
Data: ${oggi.toLocaleDateString('it-IT')}

MINUSVALENZE DISPONIBILI
${risultati.minusvalenzeConScadenza
  .map(
    (m) =>
      `- ${formatCurrency(m.importo)} (${TIPO_ASSET_LABELS[m.tipo]}) - Scade il ${m.dataScadenza.toLocaleDateString('it-IT')}`
  )
  .join('\n')}

TOTALE ZAINETTO: ${formatCurrency(risultati.totaleMinusvalenze)}
RISPARMIO POTENZIALE (26%): ${formatCurrency(risultati.totaleMinusvalenze * ALIQUOTA_CAPITAL_GAIN)}

IN SCADENZA ENTRO 6 MESI: ${formatCurrency(risultati.totaleInScadenza6Mesi)}
IN SCADENZA ENTRO 12 MESI: ${formatCurrency(risultati.totaleInScadenza12Mesi)}

---
Generato da GuidaPatrimonio.it - Calcolatore Minusvalenze
Alternativa gratuita a TasseTrading

DISCLAIMER: Questo documento e solo a scopo informativo. Consulta un commercialista per la tua situazione specifica.
    `

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `zainetto-fiscale-${oggi.toISOString().split('T')[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }, [risultati, oggi])

  const resetDati = () => {
    if (confirm('Sei sicuro di voler cancellare tutti i dati? Questa azione non puo essere annullata.')) {
      setMinusvalenze([])
      setPlusvalenze([])
      setStoricoCompensazioni([])
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    }
  }

  // Progress bar component
  const ProgressBar = ({ value, max, color = 'green' }: { value: number; max: number; color?: string }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0
    const colorClasses = {
      green: 'bg-green-500',
      amber: 'bg-amber-500',
      red: 'bg-red-500',
      forest: 'bg-[#1B4D3E]',
    }
    return (
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full ${colorClasses[color as keyof typeof colorClasses] || colorClasses.green} transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
    )
  }

  // Timeline scadenze
  const TimelineScadenze = () => {
    const anni = [annoCorrente - 3, annoCorrente - 2, annoCorrente - 1, annoCorrente]
    return (
      <div className="relative">
        <div className="absolute top-4 left-0 right-0 h-1 bg-gray-200" />
        <div className="flex justify-between relative">
          {anni.map((anno, idx) => {
            const minusAnno = risultati.minusvalenzePerAnno[anno] || []
            const totale = minusAnno.reduce((sum, m) => sum + m.importo, 0)
            const annoScadenza = anno + ANNI_SCADENZA
            const giorniRimanenti = Math.max(
              0,
              Math.ceil((new Date(annoScadenza, 11, 31).getTime() - oggi.getTime()) / (1000 * 60 * 60 * 24))
            )
            const isUrgent = giorniRimanenti <= 180
            const isExpired = giorniRimanenti <= 0

            return (
              <div key={anno} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    isExpired
                      ? 'bg-gray-300 text-gray-500'
                      : isUrgent
                      ? 'bg-red-500 text-white'
                      : totale > 0
                      ? 'bg-[#1B4D3E] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {idx + 1}
                </div>
                <div className="mt-2 text-center">
                  <p className="text-xs font-bold text-gray-700">{anno}</p>
                  <p className={`text-sm font-semibold ${totale > 0 ? 'text-[#1B4D3E]' : 'text-gray-400'}`}>
                    {formatCurrency(totale)}
                  </p>
                  <p className={`text-xs ${isUrgent ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                    Scade: 31/12/{annoScadenza}
                  </p>
                  {isUrgent && !isExpired && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                      {giorniRimanenti}g
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <main>
      <ToolPageSchema slug="calcolatore-minusvalenze" />
        <Navbar />
        <div className="min-h-screen bg-[#fcfcfa] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1B4D3E]" />
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main>
      <Navbar />

      {/* Hero */}
      <section className="bg-[#1B4D3E] pt-navbar">
        <div className="container-custom py-12">
          <Link
            href="/strumenti"
            className="inline-flex items-center text-green-300 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tutti gli strumenti
          </Link>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-heading text-[32px] md:text-[42px] text-white leading-tight">
                  Calcolatore Minusvalenze
                </h1>
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                  PREMIUM
                </span>
              </div>
              <p className="text-white/70 max-w-xl">
                Gestisci il tuo zainetto fiscale, monitora le scadenze e non perdere mai piu una minusvalenza.
                <strong className="text-green-300"> Alternativa gratuita a TasseTrading.</strong>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowExportModal(true)}
                className="px-4 py-2 bg-white/10 border border-white/30 text-white rounded-lg text-sm hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Esporta
              </button>
              <button
                onClick={() => setShowReminderModal(true)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Reminder
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Alert minusvalenze in scadenza URGENTE */}
      {risultati.totaleInScadenza3Mesi > 0 && (
        <div className="bg-red-600 text-white">
          <div className="container-custom py-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 animate-pulse">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">
                  URGENTE: {formatCurrency(risultati.totaleInScadenza3Mesi)} in scadenza entro 90 giorni!
                </p>
                <p className="text-white/80 text-sm">
                  Stai per perdere <strong>{formatCurrency(risultati.risparmioPotenziale3Mesi)}</strong> di
                  risparmio fiscale. Realizza plusvalenze ORA per recuperare queste minusvalenze.
                </p>
              </div>
              <Link
                href="/strumenti/tax-loss-harvesting"
                className="px-4 py-2 bg-white text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors flex-shrink-0"
              >
                Strategia Tax Loss
              </Link>
            </div>
          </div>
        </div>
      )}

      <section className="section-md bg-[#fcfcfa]">
        <div className="container-custom">
          {/* Riepilogo principale con numeri animati */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-forest rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white/80 text-sm">Zainetto Fiscale</p>
                <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-heading text-3xl">
                <AnimatedNumber value={risultati.totaleMinusvalenze} format={formatCurrency} />
              </p>
              <div className="mt-3">
                <ProgressBar
                  value={risultati.totaleMinusvalenze - risultati.minusvalenzeRimanenti}
                  max={risultati.totaleMinusvalenze || 1}
                  color="green"
                />
                <p className="text-white/60 text-xs mt-1">
                  {formatCurrency(risultati.totaleMinusvalenze - risultati.minusvalenzeRimanenti)} compensate
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm">Risparmio Potenziale</p>
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p className="font-heading text-3xl text-green-600">
                <AnimatedNumber value={risultati.totaleMinusvalenze * ALIQUOTA_CAPITAL_GAIN} format={formatCurrency} />
              </p>
              <p className="text-gray-400 text-xs mt-1">26% del totale zainetto</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm">Risparmio Realizzato</p>
                <svg className="w-5 h-5 text-[#1B4D3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="font-heading text-3xl text-[#1B4D3E]">
                <AnimatedNumber value={risultati.risparmioFiscale} format={formatCurrency} />
              </p>
              <p className="text-gray-400 text-xs mt-1">Su plusvalenze inserite</p>
            </div>

            <div className={`rounded-xl p-6 shadow-lg ${risultati.totaleInScadenza6Mesi > 0 ? 'bg-amber-50 border-2 border-amber-300' : 'bg-white border border-gray-100'}`}>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-sm ${risultati.totaleInScadenza6Mesi > 0 ? 'text-amber-700' : 'text-gray-600'}`}>
                  In Scadenza (6 mesi)
                </p>
                {risultati.totaleInScadenza6Mesi > 0 && (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                  </span>
                )}
              </div>
              <p className={`font-heading text-3xl ${risultati.totaleInScadenza6Mesi > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                <AnimatedNumber value={risultati.totaleInScadenza6Mesi} format={formatCurrency} />
              </p>
              <p className={`text-xs mt-1 ${risultati.totaleInScadenza6Mesi > 0 ? 'text-amber-600' : 'text-gray-400'}`}>
                {risultati.totaleInScadenza6Mesi > 0
                  ? `Perderai ${formatCurrency(risultati.risparmioPotenziale6Mesi)}`
                  : 'Nessuna urgenza'}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
            <div className="flex border-b">
              {[
                { id: 'zainetto', label: 'Zainetto Fiscale', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                { id: 'simulazione', label: 'Simulatore FIFO', icon: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
                { id: 'strategia', label: 'Strategia', icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z' },
                { id: 'storico', label: 'Storico', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 px-4 py-4 flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#1B4D3E] text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* TAB: Zainetto Fiscale */}
              {activeTab === 'zainetto' && (
                <div className="space-y-8">
                  {/* Timeline scadenze */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-heading text-lg text-[#1B4D3E] mb-6">Timeline Scadenze</h3>
                    <TimelineScadenze />
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Minusvalenze per anno */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="font-heading text-xl text-[#1B4D3E]">Minusvalenze per Anno</h2>
                          <p className="text-xs text-gray-500">Ordinate per scadenza (FIFO)</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[annoCorrente, annoCorrente - 1, annoCorrente - 2, annoCorrente - 3].map((anno) => {
                          const minusAnno = risultati.minusvalenzePerAnno[anno] || []
                          const totale = minusAnno.reduce((sum, m) => sum + m.importo, 0)
                          const giorniRimanenti = Math.max(
                            0,
                            Math.ceil((new Date(anno + ANNI_SCADENZA, 11, 31).getTime() - oggi.getTime()) / (1000 * 60 * 60 * 24))
                          )
                          const isUrgent = giorniRimanenti <= 180 && giorniRimanenti > 0

                          return (
                            <div
                              key={anno}
                              className={`rounded-xl border-2 transition-all ${
                                isUrgent
                                  ? 'border-amber-300 bg-amber-50'
                                  : totale > 0
                                  ? 'border-gray-200 bg-white'
                                  : 'border-gray-100 bg-gray-50'
                              }`}
                            >
                              <div className="p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                      isUrgent
                                        ? 'bg-amber-200 text-amber-800'
                                        : totale > 0
                                        ? 'bg-[#1B4D3E] text-white'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}>
                                      {anno}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      Scade: 31/12/{anno + ANNI_SCADENZA}
                                    </span>
                                    {isUrgent && (
                                      <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                                        {giorniRimanenti} giorni
                                      </span>
                                    )}
                                  </div>
                                  <span className={`font-heading text-xl ${totale > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                                    {formatCurrency(totale)}
                                  </span>
                                </div>

                                {minusAnno.length > 0 && (
                                  <div className="space-y-2">
                                    {minusAnno.map((m) => (
                                      <div
                                        key={m.id}
                                        className="flex items-center justify-between p-2 bg-white/80 rounded-lg"
                                      >
                                        <div className="flex items-center gap-2">
                                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${TIPO_ASSET_COLORS[m.tipo].bg} ${TIPO_ASSET_COLORS[m.tipo].text}`}>
                                            {TIPO_ASSET_LABELS[m.tipo]}
                                          </span>
                                          <span className="text-sm text-gray-600">{m.descrizione || 'Minusvalenza'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium text-red-600">{formatCurrency(m.importo)}</span>
                                          <button
                                            onClick={() => rimuoviMinusvalenza(m.id)}
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
                                )}

                                {minusAnno.length === 0 && (
                                  <p className="text-sm text-gray-400 text-center py-2">Nessuna minusvalenza</p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Form aggiungi minusvalenza */}
                      <div className="mt-6 bg-gray-50 rounded-xl p-4">
                        <p className="text-sm font-medium text-gray-700 mb-3">Aggiungi minusvalenza</p>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">EUR</span>
                              <input
                                type="number"
                                placeholder="Importo"
                                value={nuovaMinusvalenza.importo}
                                onChange={(e) => setNuovaMinusvalenza({ ...nuovaMinusvalenza, importo: e.target.value })}
                                className="w-full pl-12 pr-3 py-2 border rounded-lg text-sm"
                              />
                            </div>
                            <input
                              type="date"
                              value={nuovaMinusvalenza.dataRealizzazione}
                              onChange={(e) => setNuovaMinusvalenza({ ...nuovaMinusvalenza, dataRealizzazione: e.target.value })}
                              className="px-3 py-2 border rounded-lg text-sm"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              value={nuovaMinusvalenza.tipo}
                              onChange={(e) => setNuovaMinusvalenza({ ...nuovaMinusvalenza, tipo: e.target.value as TipoAsset })}
                              className="px-3 py-2 border rounded-lg text-sm"
                            >
                              <option value="azioni">Azioni</option>
                              <option value="etf">ETF</option>
                              <option value="etc">ETC</option>
                              <option value="obbligazioni">Obbligazioni</option>
                              <option value="certificati">Certificati</option>
                            </select>
                            <input
                              type="text"
                              placeholder="Descrizione (opzionale)"
                              value={nuovaMinusvalenza.descrizione}
                              onChange={(e) => setNuovaMinusvalenza({ ...nuovaMinusvalenza, descrizione: e.target.value })}
                              className="px-3 py-2 border rounded-lg text-sm"
                            />
                          </div>
                          <button
                            onClick={aggiungiMinusvalenza}
                            className="w-full px-4 py-2 bg-[#1B4D3E] text-white rounded-lg text-sm hover:bg-[#2D6A4F] transition-colors"
                          >
                            Aggiungi Minusvalenza
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Plusvalenze */}
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                        </div>
                        <div>
                          <h2 className="font-heading text-xl text-[#1B4D3E]">Plusvalenze da Compensare</h2>
                          <p className="text-xs text-gray-500">Inserisci i guadagni realizzati quest&apos;anno</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-xl border-2 border-green-200 p-4 mb-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm text-gray-600">Totale plusvalenze</span>
                          <span className="font-heading text-2xl text-green-600">
                            +{formatCurrency(risultati.totalePlusvalenze)}
                          </span>
                        </div>
                        <ProgressBar value={risultati.totaleCompensato} max={risultati.totalePlusvalenze || 1} color="green" />
                        <p className="text-xs text-gray-500 mt-1">
                          {formatCurrency(risultati.totaleCompensato)} compensate ({Math.round((risultati.totaleCompensato / (risultati.totalePlusvalenze || 1)) * 100)}%)
                        </p>
                      </div>

                      <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                        {plusvalenze.length === 0 ? (
                          <p className="text-gray-400 text-sm p-4 text-center bg-gray-50 rounded-lg">
                            Nessuna plusvalenza inserita
                          </p>
                        ) : (
                          plusvalenze.map((p) => (
                            <div key={p.id} className="p-3 bg-green-50 rounded-lg border border-green-100">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium text-green-600">+{formatCurrency(p.importo)}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${TIPO_ASSET_COLORS[p.tipo].bg} ${TIPO_ASSET_COLORS[p.tipo].text}`}>
                                      {TIPO_ASSET_LABELS[p.tipo]}
                                    </span>
                                  </div>
                                  {p.descrizione && <p className="text-xs text-gray-500 mt-1">{p.descrizione}</p>}
                                </div>
                                <button onClick={() => rimuoviPlusvalenza(p.id)} className="text-gray-400 hover:text-red-500 ml-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Form aggiungi plusvalenza */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm font-medium text-gray-700 mb-3">Aggiungi plusvalenza</p>
                        <div className="space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">EUR</span>
                              <input
                                type="number"
                                placeholder="Importo"
                                value={nuovaPlusvalenza.importo}
                                onChange={(e) => setNuovaPlusvalenza({ ...nuovaPlusvalenza, importo: e.target.value })}
                                className="w-full pl-12 pr-3 py-2 border rounded-lg text-sm"
                              />
                            </div>
                            <select
                              value={nuovaPlusvalenza.tipo}
                              onChange={(e) => setNuovaPlusvalenza({ ...nuovaPlusvalenza, tipo: e.target.value as TipoAsset })}
                              className="px-3 py-2 border rounded-lg text-sm"
                            >
                              <option value="azioni">Azioni</option>
                              <option value="etf">ETF</option>
                              <option value="etc">ETC</option>
                              <option value="obbligazioni">Obbligazioni</option>
                              <option value="certificati">Certificati</option>
                            </select>
                          </div>
                          <input
                            type="text"
                            placeholder="Descrizione (opzionale)"
                            value={nuovaPlusvalenza.descrizione}
                            onChange={(e) => setNuovaPlusvalenza({ ...nuovaPlusvalenza, descrizione: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                          />
                          <button
                            onClick={aggiungiPlusvalenza}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                          >
                            Aggiungi Plusvalenza
                          </button>
                        </div>
                      </div>

                      {/* Riepilogo compensazione */}
                      {risultati.totaleCompensato > 0 && (
                        <div className="mt-6 bg-[#1B4D3E] rounded-xl p-5 text-white">
                          <h3 className="font-heading text-lg mb-3">Riepilogo Compensazione</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-white/70">Plusvalenze totali</span>
                              <span>+{formatCurrency(risultati.totalePlusvalenze)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/70">Minusvalenze utilizzate</span>
                              <span className="text-red-300">-{formatCurrency(risultati.totaleCompensato)}</span>
                            </div>
                            <div className="border-t border-white/20 pt-2 flex justify-between">
                              <span className="font-medium">Imponibile netto</span>
                              <span className="font-medium">{formatCurrency(risultati.plusvalenzeNonCompensate)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                              <span className="text-white/70">Tasse da pagare (26%)</span>
                              <span className="font-heading text-xl">{formatCurrency(risultati.tasseDaPagareConCompensazione)}</span>
                            </div>
                            <div className="bg-green-500/30 -mx-5 -mb-5 mt-3 px-5 py-3 rounded-b-xl flex justify-between items-center">
                              <span className="font-bold">HAI RISPARMIATO</span>
                              <span className="font-heading text-2xl">{formatCurrency(risultati.risparmioFiscale)}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Simulazione FIFO */}
              {activeTab === 'simulazione' && (
                <div className="space-y-6">
                  <div className="bg-forest rounded-xl p-6 text-white">
                    <h3 className="font-heading text-xl mb-2">Simulatore Compensazione FIFO</h3>
                    <p className="text-white/70 text-sm mb-4">
                      Inserisci una plusvalenza ipotetica per vedere come verrebbero utilizzate le tue minusvalenze
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <label className="text-white/70 text-xs block mb-1">Plusvalenza ipotetica</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">EUR</span>
                          <input
                            type="number"
                            value={plusvalenzaIpotetica}
                            onChange={(e) => setPlusvalenzaIpotetica(Number(e.target.value) || 0)}
                            className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white text-lg font-medium placeholder-white/40"
                            placeholder="10000"
                          />
                        </div>
                      </div>
                      <div className="text-center px-4">
                        <p className="text-white/70 text-xs">Risparmio</p>
                        <p className="font-heading text-2xl">{formatCurrency(risultati.simulazione.risparmio)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm text-amber-800">
                      <strong>Quanto devi guadagnare per azzerare lo zainetto?</strong>{' '}
                      Per utilizzare tutte le tue minusvalenze ({formatCurrency(risultati.totaleMinusvalenze)}) devi realizzare plusvalenze per almeno{' '}
                      <strong>{formatCurrency(risultati.plusvalenzaNecessariaPerAzzerare)}</strong>.
                    </p>
                  </div>

                  {/* Dettaglio FIFO */}
                  <div className="bg-white border rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b">
                      <h4 className="font-medium text-gray-700">Ordine di utilizzo minusvalenze (FIFO)</h4>
                    </div>
                    <div className="divide-y">
                      {risultati.simulazione.dettaglioFIFO.length === 0 ? (
                        <p className="p-4 text-gray-400 text-center">Nessuna minusvalenza disponibile</p>
                      ) : (
                        risultati.simulazione.dettaglioFIFO.map((item, idx) => (
                          <div key={item.minusvalenza.id} className="p-4 flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              item.importoCompensato === item.minusvalenza.importo
                                ? 'bg-green-500 text-white'
                                : 'bg-amber-500 text-white'
                            }`}>
                              {idx + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${TIPO_ASSET_COLORS[item.minusvalenza.tipo].bg} ${TIPO_ASSET_COLORS[item.minusvalenza.tipo].text}`}>
                                  {TIPO_ASSET_LABELS[item.minusvalenza.tipo]}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {item.minusvalenza.descrizione || `Minusvalenza ${item.minusvalenza.annoRealizzazione}`}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 mt-1">
                                <span className="text-xs text-gray-400">
                                  Scade: {item.minusvalenza.dataScadenza.toLocaleDateString('it-IT')}
                                </span>
                                <span className={`text-xs ${item.minusvalenza.inScadenza6Mesi ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>
                                  {item.minusvalenza.giorniAllaScadenza} giorni rimanenti
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">
                                Disponibile: <span className="text-red-600">{formatCurrency(item.minusvalenza.importo)}</span>
                              </p>
                              <p className="font-medium text-green-600">
                                Utilizzato: {formatCurrency(item.importoCompensato)}
                                {item.importoCompensato === item.minusvalenza.importo && (
                                  <span className="ml-1 text-xs bg-green-100 text-green-700 px-1 rounded">100%</span>
                                )}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {risultati.simulazione.totaleCompensato > 0 && (
                      <div className="bg-green-50 px-4 py-3 border-t flex justify-between items-center">
                        <span className="font-medium text-green-800">Totale compensato</span>
                        <span className="font-heading text-xl text-green-600">{formatCurrency(risultati.simulazione.totaleCompensato)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB: Strategia */}
              {activeTab === 'strategia' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-6 text-white">
                    <h3 className="font-heading text-xl mb-2">Strategia Tax Loss Harvesting</h3>
                    <p className="text-white/90 text-sm">
                      Suggerimenti personalizzati per ottimizzare il tuo zainetto fiscale
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Suggerimenti urgenti */}
                    {risultati.totaleInScadenza12Mesi > 0 && (
                      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-heading text-lg text-red-800">Azione Urgente</h4>
                            <p className="text-xs text-red-600">Minusvalenze in scadenza</p>
                          </div>
                        </div>
                        <p className="text-sm text-red-800 mb-3">
                          Hai <strong>{formatCurrency(risultati.totaleInScadenza12Mesi)}</strong> di minusvalenze che scadranno entro 12 mesi.
                          Se non le utilizzi perderai <strong>{formatCurrency(risultati.risparmioPotenziale12Mesi)}</strong> di risparmio fiscale.
                        </p>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-700 font-medium mb-2">Cosa fare:</p>
                          <ol className="text-xs text-gray-600 space-y-1 list-decimal list-inside">
                            <li>Verifica se hai posizioni in profitto nel portafoglio</li>
                            <li>Considera di vendere per realizzare plusvalenze</li>
                            <li>Riacquista subito (no wash sale rule in Italia)</li>
                          </ol>
                        </div>
                      </div>
                    )}

                    {/* Suggerimento ETF */}
                    {risultati.totaleMinusvalenzeRedditiCapitale > 0 && (
                      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-heading text-lg text-purple-800">Minusvalenze ETF</h4>
                            <p className="text-xs text-purple-600">Attenzione alle regole speciali</p>
                          </div>
                        </div>
                        <p className="text-sm text-purple-800 mb-3">
                          Hai <strong>{formatCurrency(risultati.totaleMinusvalenzeRedditiCapitale)}</strong> di minusvalenze da ETF/Obbligazioni.
                          Queste possono compensare <strong>SOLO</strong> plusvalenze da azioni, ETC o certificati.
                        </p>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-700 font-medium mb-2">Strategia consigliata:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            <li className="flex items-start gap-1">
                              <span className="text-purple-500">*</span>
                              Vendi azioni in profitto per compensare
                            </li>
                            <li className="flex items-start gap-1">
                              <span className="text-purple-500">*</span>
                              Considera certificati a leva per generare plusvalenze redditi diversi
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Suggerimento certificati */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-heading text-lg text-blue-800">Certificati per Recupero</h4>
                          <p className="text-xs text-blue-600">Strumento fiscalmente efficiente</p>
                        </div>
                      </div>
                      <p className="text-sm text-blue-800 mb-3">
                        I certificati (certificates) sono classificati come &quot;redditi diversi&quot; e le loro plusvalenze possono compensare
                        qualsiasi minusvalenza, incluse quelle da ETF.
                      </p>
                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-700 font-medium mb-2">Vantaggi:</p>
                        <ul className="text-xs text-gray-600 space-y-1">
                          <li className="flex items-start gap-1">
                            <span className="text-blue-500">+</span>
                            Plusvalenze compensano minusvalenze ETF
                          </li>
                          <li className="flex items-start gap-1">
                            <span className="text-blue-500">+</span>
                            Possono offrire cedole periodiche (redditi diversi)
                          </li>
                          <li className="flex items-start gap-1">
                            <span className="text-red-500">-</span>
                            Rischio emittente e complessita
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Link a tax loss harvesting */}
                    <div className="bg-[#1B4D3E] rounded-xl p-5 text-white">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-heading text-lg">Tax Loss Harvesting</h4>
                          <p className="text-xs text-white/70">Strumento avanzato</p>
                        </div>
                      </div>
                      <p className="text-sm text-white/90 mb-4">
                        Usa il nostro calcolatore Tax Loss Harvesting per analizzare il tuo portafoglio e identificare le posizioni in perdita da vendere.
                      </p>
                      <Link href="/strumenti/tax-loss-harvesting" className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#1B4D3E] rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
                        Vai al Calcolatore
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Regole fiscali */}
                  <div className="bg-white border rounded-xl p-6">
                    <h3 className="font-heading text-lg text-[#1B4D3E] mb-4">Regole Compensazione Italia</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <p className="font-medium text-purple-800 text-sm mb-1">Minusvalenze da ETF/Obbligazioni</p>
                        <p className="text-xs text-purple-700">
                          Sono &quot;redditi da capitale&quot;. Possono compensare <strong>SOLO</strong> plusvalenze da azioni, ETC, certificati (redditi diversi).
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="font-medium text-blue-800 text-sm mb-1">Minusvalenze da Azioni/ETC/Certificati</p>
                        <p className="text-xs text-blue-700">
                          Sono &quot;redditi diversi&quot;. Possono compensare <strong>QUALSIASI</strong> plusvalenza.
                        </p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-lg">
                        <p className="font-medium text-amber-800 text-sm mb-1">Scadenza 4 anni</p>
                        <p className="text-xs text-amber-700">
                          Le minusvalenze scadono al 31/12 del quarto anno successivo. Metodo FIFO obbligatorio.
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <p className="font-medium text-green-800 text-sm mb-1">No Wash Sale (Italia)</p>
                        <p className="text-xs text-green-700">
                          Puoi vendere e riacquistare immediatamente lo stesso titolo. Vantaggio rispetto agli USA.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: Storico */}
              {activeTab === 'storico' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-heading text-xl text-[#1B4D3E]">Storico Compensazioni</h3>
                      <p className="text-sm text-gray-500">Registro delle compensazioni effettuate</p>
                    </div>
                    {risultati.totaleCompensato > 0 && (
                      <button
                        onClick={registraCompensazione}
                        className="px-4 py-2 bg-[#1B4D3E] text-white rounded-lg text-sm hover:bg-[#2D6A4F] transition-colors flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Registra Compensazione Corrente
                      </button>
                    )}
                  </div>

                  {storicoCompensazioni.length === 0 ? (
                    <div className="bg-gray-50 rounded-xl p-8 text-center">
                      <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500">Nessuna compensazione registrata</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Registra le compensazioni effettuate per tenere traccia del tuo risparmio fiscale nel tempo
                      </p>
                    </div>
                  ) : (
                    <div className="bg-white border rounded-xl overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 border-b">
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Data</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Minusvalenza</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Plusvalenza</th>
                            <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">Risparmio</th>
                            <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Note</th>
                          </tr>
                        </thead>
                        <tbody>
                          {storicoCompensazioni.map((c) => (
                            <tr key={c.id} className="border-b hover:bg-gray-50">
                              <td className="py-3 px-4 text-sm">{formatDate(c.data)}</td>
                              <td className="py-3 px-4 text-sm text-right text-red-600">{formatCurrency(c.importoMinusvalenza)}</td>
                              <td className="py-3 px-4 text-sm text-right text-green-600">{formatCurrency(c.importoPlusvalenza)}</td>
                              <td className="py-3 px-4 text-sm text-right font-medium text-[#1B4D3E]">{formatCurrency(c.risparmio)}</td>
                              <td className="py-3 px-4 text-sm text-gray-500">{c.note || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-green-50">
                            <td className="py-3 px-4 text-sm font-medium" colSpan={3}>Totale risparmiato</td>
                            <td className="py-3 px-4 text-right font-heading text-lg text-green-600">
                              {formatCurrency(storicoCompensazioni.reduce((sum, c) => sum + c.risparmio, 0))}
                            </td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Credibilita */}
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">GRATUITO</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">NO REGISTRAZIONE</span>
                </div>
                <h3 className="font-heading text-xl text-[#1B4D3E] mb-2">Alternativa gratuita a TasseTrading</h3>
                <p className="text-sm text-gray-600">
                  Questo strumento offre le stesse funzionalita premium di servizi a pagamento. Salvataggio automatico, simulatore FIFO, alert scadenze e export dati. Tutto gratis, senza abbonamenti.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={resetDati}
                  className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors"
                >
                  Reset Dati
                </button>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-gray-50 rounded-xl p-6">
            <p className="text-xs text-gray-500">
              <strong>Disclaimer fiscale:</strong> Questo calcolatore fornisce stime indicative a scopo educativo basate sulla normativa fiscale italiana vigente (art. 67, comma 1, lett. c-bis del TUIR e successive modifiche). Le regole di compensazione possono variare in base al regime fiscale (amministrato vs dichiarativo) e alla tipologia specifica di strumento finanziario. Le minusvalenze sono compensabili entro il quarto anno successivo a quello di realizzazione (art. 68, comma 5 del TUIR). Si consiglia di verificare le proprie minusvalenze con l&apos;estratto conto del broker e di consultare un commercialista per una valutazione accurata della propria situazione fiscale. I dati inseriti sono salvati localmente nel browser e non vengono trasmessi a server esterni.
            </p>
          </div>
        </div>
      </section>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="font-heading text-xl text-[#1B4D3E] mb-4">Esporta Riepilogo</h3>
            <p className="text-sm text-gray-600 mb-4">
              Scarica un riepilogo del tuo zainetto fiscale da conservare o condividere con il tuo commercialista.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => { exportPDF(); setShowExportModal(false) }}
                className="w-full px-4 py-3 bg-[#1B4D3E] text-white rounded-lg text-sm hover:bg-[#2D6A4F] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Scarica File TXT
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="w-full px-4 py-3 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full">
            <h3 className="font-heading text-xl text-[#1B4D3E] mb-4">Imposta Reminder</h3>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-amber-800">
                <strong>Suggerimento:</strong> Per non perdere le minusvalenze in scadenza, imposta un reminder nel tuo calendario.
              </p>
            </div>
            <div className="space-y-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Come impostare un reminder:</p>
                <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                  <li>Apri Google Calendar o il tuo calendario preferito</li>
                  <li>Crea un evento ricorrente per il 1 ottobre di ogni anno</li>
                  <li>Titolo: &quot;Verifica minusvalenze in scadenza&quot;</li>
                  <li>Aggiungi un link a questo strumento nelle note</li>
                </ol>
              </div>
              {risultati.totaleInScadenza12Mesi > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">
                    <strong>Urgente:</strong> Hai {formatCurrency(risultati.totaleInScadenza12Mesi)} in scadenza.
                    Imposta un reminder per verificare entro fine anno!
                  </p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <a
                href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Verifica+minusvalenze+in+scadenza&details=Controlla+le+minusvalenze+in+scadenza+su+GuidaPatrimonio.it%0A%0AZainetto+attuale:+${encodeURIComponent(formatCurrency(risultati.totaleMinusvalenze))}&dates=${annoCorrente}1001/${annoCorrente}1001&recur=RRULE:FREQ=YEARLY`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-3 bg-[#1B4D3E] text-white rounded-lg text-sm hover:bg-[#2D6A4F] transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Apri Google Calendar
              </a>
              <button
                onClick={() => setShowReminderModal(false)}
                className="px-4 py-3 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                Chiudi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="section-sm bg-[#2D6A4F]">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl text-white mb-4">
            Non lasciare scadere le tue minusvalenze
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Una corretta pianificazione fiscale puo farti risparmiare migliaia di euro. Un consulente indipendente puo aiutarti a ottimizzare lo zainetto fiscale.
          </p>
          <Link href="/#contatti" className="btn-reverse">
            Richiedi Consulenza Gratuita
          </Link>
        </div>
      </section>

      {/* Rating Widget */}
      <div className="container-custom py-8">
        <RatingWidget toolSlug="calcolatore-minusvalenze" toolName="calcolatore-minusvalenze" />
      </div>

      <Footer />
    </main>
  )
}
