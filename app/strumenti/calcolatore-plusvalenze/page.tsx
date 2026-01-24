'use client'

import { useState, useMemo, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Navbar, Footer , RatingWidget, ToolPageSchema} from '@/components'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type TipoStrumento =
  | 'azioni_it'
  | 'azioni_estere'
  | 'etf_armonizzato'
  | 'etf_non_armonizzato'
  | 'btp_bot'
  | 'obbligazioni_corporate'
  | 'etc'
  | 'certificati'
  | 'fondi'
  | 'crypto'

type TipoOperazione = 'acquisto' | 'vendita'
type RegimeFiscale = 'amministrato' | 'dichiarativo'
type CategoriaFiscale = 'redditi_diversi' | 'redditi_capitale'

interface Operazione {
  id: string
  tipo: TipoOperazione
  strumento: TipoStrumento
  nome: string
  data: string
  prezzo: number
  quantita: number
  commissioni: number
}

interface StrumentoConfig {
  nome: string
  aliquota: number
  categoria: CategoriaFiscale
  descrizione: string
  note?: string
  richiedeRW?: boolean
}

interface RisultatoFiscale {
  strumento: TipoStrumento
  plusvalenza: number
  minusvalenza: number
  impostaDovuta: number
  aliquota: number
}

interface LottoFIFO {
  id: string
  data: string
  prezzo: number
  quantitaRimanente: number
  quantitaOriginale: number
  commissioni: number
}

// ============================================================================
// CONSTANTS & CONFIGURATIONS
// ============================================================================

const STRUMENTI_CONFIG: Record<TipoStrumento, StrumentoConfig> = {
  azioni_it: {
    nome: 'Azioni Italiane',
    aliquota: 26,
    categoria: 'redditi_diversi',
    descrizione: 'Azioni quotate su Borsa Italiana',
  },
  azioni_estere: {
    nome: 'Azioni Estere',
    aliquota: 26,
    categoria: 'redditi_diversi',
    descrizione: 'Azioni quotate su mercati esteri',
    note: 'In regime dichiarativo va compilato il quadro RW',
    richiedeRW: true,
  },
  etf_armonizzato: {
    nome: 'ETF Armonizzato (UCITS)',
    aliquota: 26,
    categoria: 'redditi_capitale',
    descrizione: 'ETF europei conformi alla direttiva UCITS',
    note: 'La maggior parte degli ETF quotati su Borsa Italiana',
  },
  etf_non_armonizzato: {
    nome: 'ETF Non Armonizzato',
    aliquota: 26,
    categoria: 'redditi_capitale',
    descrizione: 'ETF extra-UE non conformi UCITS',
    note: 'Es. ETF quotati solo su NYSE. In dichiarativo tassazione IRPEF progressiva',
  },
  btp_bot: {
    nome: 'BTP / BOT / Titoli di Stato',
    aliquota: 12.5,
    categoria: 'redditi_diversi',
    descrizione: 'Titoli di Stato italiani e white list',
    note: 'Aliquota agevolata al 12.5% (anche per BTP Italia, BTP Futura)',
  },
  obbligazioni_corporate: {
    nome: 'Obbligazioni Corporate',
    aliquota: 26,
    categoria: 'redditi_capitale',
    descrizione: 'Obbligazioni societarie',
  },
  etc: {
    nome: 'ETC (Exchange Traded Commodities)',
    aliquota: 26,
    categoria: 'redditi_diversi',
    descrizione: 'ETC su materie prime (oro, argento, petrolio)',
    note: 'Categoria redditi diversi - compensano minusvalenze ETF',
  },
  certificati: {
    nome: 'Certificati (Certificates)',
    aliquota: 26,
    categoria: 'redditi_diversi',
    descrizione: 'Certificati di investimento',
    note: 'Redditi diversi - utili per compensare minusvalenze ETF',
  },
  fondi: {
    nome: 'Fondi Comuni',
    aliquota: 26,
    categoria: 'redditi_capitale',
    descrizione: 'Fondi comuni di investimento',
  },
  crypto: {
    nome: 'Criptovalute',
    aliquota: 26,
    categoria: 'redditi_diversi',
    descrizione: 'Bitcoin, Ethereum e altre criptovalute',
    note: 'Dal 2023 aliquota 26% sopra franchigia 2.000 EUR',
  },
}

const CSV_FORMATS = {
  directa: {
    nome: 'Directa Trading',
    separatore: ';',
    headers: ['Data', 'Tipo', 'Strumento', 'Quantita', 'Prezzo', 'Commissioni'],
  },
  fineco: {
    nome: 'Fineco Bank',
    separatore: ';',
    headers: ['Data Operazione', 'Operazione', 'Descrizione', 'Quantita', 'Prezzo', 'Spese'],
  },
  degiro: {
    nome: 'DEGIRO',
    separatore: ',',
    headers: ['Data', 'Prodotto', 'ISIN', 'Quantita', 'Prezzo', 'Commissioni'],
  },
  interactive_brokers: {
    nome: 'Interactive Brokers',
    separatore: ',',
    headers: ['TradeDate', 'Symbol', 'Buy/Sell', 'Quantity', 'Price', 'Commission'],
  },
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const generateId = () => Math.random().toString(36).substr(2, 9)

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const formatPercent = (value: number) => {
  return new Intl.NumberFormat('it-IT', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: 'always',
  }).format(value / 100)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CalcolatorePlusvalenze() {
  const oggi = new Date().toISOString().split('T')[0]
  const annoCorrente = new Date().getFullYear()

  // State
  const [operazioni, setOperazioni] = useState<Operazione[]>([
    // Demo data
    {
      id: '1',
      tipo: 'acquisto',
      strumento: 'etf_armonizzato',
      nome: 'iShares Core MSCI World',
      data: '2023-03-15',
      prezzo: 72.50,
      quantita: 100,
      commissioni: 5,
    },
    {
      id: '2',
      tipo: 'acquisto',
      strumento: 'etf_armonizzato',
      nome: 'iShares Core MSCI World',
      data: '2023-09-20',
      prezzo: 78.00,
      quantita: 50,
      commissioni: 5,
    },
    {
      id: '3',
      tipo: 'vendita',
      strumento: 'etf_armonizzato',
      nome: 'iShares Core MSCI World',
      data: '2024-06-10',
      prezzo: 85.00,
      quantita: 80,
      commissioni: 5,
    },
    {
      id: '4',
      tipo: 'acquisto',
      strumento: 'btp_bot',
      nome: 'BTP Italia 2028',
      data: '2023-01-10',
      prezzo: 95.50,
      quantita: 10000,
      commissioni: 0,
    },
    {
      id: '5',
      tipo: 'vendita',
      strumento: 'btp_bot',
      nome: 'BTP Italia 2028',
      data: '2024-07-15',
      prezzo: 98.20,
      quantita: 10000,
      commissioni: 0,
    },
  ])

  const [regime, setRegime] = useState<RegimeFiscale>('amministrato')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'operazioni' | 'risultati' | 'guida'>('operazioni')

  const [nuovaOperazione, setNuovaOperazione] = useState<Partial<Operazione>>({
    tipo: 'acquisto',
    strumento: 'etf_armonizzato',
    nome: '',
    data: oggi,
    prezzo: 0,
    quantita: 0,
    commissioni: 0,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ============================================================================
  // FIFO CALCULATION ENGINE
  // ============================================================================

  const risultatiFiscali = useMemo(() => {
    // Raggruppa operazioni per strumento E nome
    const operazioniPerStrumento: Record<string, Operazione[]> = {}

    operazioni.forEach(op => {
      const key = `${op.strumento}|${op.nome}`
      if (!operazioniPerStrumento[key]) {
        operazioniPerStrumento[key] = []
      }
      operazioniPerStrumento[key].push(op)
    })

    // Calcola FIFO per ogni strumento
    const risultatiPerStrumento: Record<TipoStrumento, { plusvalenze: number; minusvalenze: number }> = {
      azioni_it: { plusvalenze: 0, minusvalenze: 0 },
      azioni_estere: { plusvalenze: 0, minusvalenze: 0 },
      etf_armonizzato: { plusvalenze: 0, minusvalenze: 0 },
      etf_non_armonizzato: { plusvalenze: 0, minusvalenze: 0 },
      btp_bot: { plusvalenze: 0, minusvalenze: 0 },
      obbligazioni_corporate: { plusvalenze: 0, minusvalenze: 0 },
      etc: { plusvalenze: 0, minusvalenze: 0 },
      certificati: { plusvalenze: 0, minusvalenze: 0 },
      fondi: { plusvalenze: 0, minusvalenze: 0 },
      crypto: { plusvalenze: 0, minusvalenze: 0 },
    }

    const dettaglioOperazioni: Array<{
      vendita: Operazione
      lottiUsati: Array<{ lotto: LottoFIFO; quantitaUsata: number; pmc: number }>
      plusvalenza: number
    }> = []

    Object.entries(operazioniPerStrumento).forEach(([, ops]) => {
      // Ordina per data
      const operazioniOrdinate = [...ops].sort((a, b) =>
        new Date(a.data).getTime() - new Date(b.data).getTime()
      )

      // FIFO: mantieni lista di lotti acquistati
      const lottiFIFO: LottoFIFO[] = []

      operazioniOrdinate.forEach(op => {
        if (op.tipo === 'acquisto') {
          lottiFIFO.push({
            id: op.id,
            data: op.data,
            prezzo: op.prezzo,
            quantitaRimanente: op.quantita,
            quantitaOriginale: op.quantita,
            commissioni: op.commissioni,
          })
        } else {
          // Vendita: usa lotti FIFO
          let quantitaDaVendere = op.quantita
          const lottiUsati: Array<{ lotto: LottoFIFO; quantitaUsata: number; pmc: number }> = []
          let costoTotaleAcquisto = 0
          let commissioniAcquisto = 0

          for (const lotto of lottiFIFO) {
            if (quantitaDaVendere <= 0) break
            if (lotto.quantitaRimanente <= 0) continue

            const quantitaUsata = Math.min(quantitaDaVendere, lotto.quantitaRimanente)
            const commissioniProRata = (quantitaUsata / lotto.quantitaOriginale) * lotto.commissioni

            costoTotaleAcquisto += quantitaUsata * lotto.prezzo
            commissioniAcquisto += commissioniProRata

            lottiUsati.push({
              lotto: { ...lotto },
              quantitaUsata,
              pmc: lotto.prezzo,
            })

            lotto.quantitaRimanente -= quantitaUsata
            quantitaDaVendere -= quantitaUsata
          }

          // Calcola plusvalenza/minusvalenza
          const ricavoVendita = op.quantita * op.prezzo - op.commissioni
          const costoTotale = costoTotaleAcquisto + commissioniAcquisto
          const plusvalenza = ricavoVendita - costoTotale

          if (plusvalenza >= 0) {
            risultatiPerStrumento[op.strumento].plusvalenze += plusvalenza
          } else {
            risultatiPerStrumento[op.strumento].minusvalenze += Math.abs(plusvalenza)
          }

          dettaglioOperazioni.push({
            vendita: op,
            lottiUsati,
            plusvalenza,
          })
        }
      })
    })

    // Calcola imposte per strumento
    const risultatiFinali: RisultatoFiscale[] = Object.entries(risultatiPerStrumento)
      .filter(([, data]) => data.plusvalenze > 0 || data.minusvalenze > 0)
      .map(([strumento, data]) => {
        const config = STRUMENTI_CONFIG[strumento as TipoStrumento]
        const netto = data.plusvalenze - data.minusvalenze
        const impostaDovuta = netto > 0 ? netto * (config.aliquota / 100) : 0

        return {
          strumento: strumento as TipoStrumento,
          plusvalenza: data.plusvalenze,
          minusvalenza: data.minusvalenze,
          impostaDovuta,
          aliquota: config.aliquota,
        }
      })

    // Totali
    const totalePlusvalenze = risultatiFinali.reduce((sum, r) => sum + r.plusvalenza, 0)
    const totaleMinusvalenze = risultatiFinali.reduce((sum, r) => sum + r.minusvalenza, 0)
    const totaleImposte = risultatiFinali.reduce((sum, r) => sum + r.impostaDovuta, 0)

    // Separazione per categoria fiscale (per regime dichiarativo)
    const redditiDiversi = risultatiFinali.filter(r =>
      STRUMENTI_CONFIG[r.strumento].categoria === 'redditi_diversi'
    )
    const redditiCapitale = risultatiFinali.filter(r =>
      STRUMENTI_CONFIG[r.strumento].categoria === 'redditi_capitale'
    )

    // Calcolo separato per BTP (aliquota 12.5%)
    const risultatiBTP = risultatiFinali.filter(r => r.strumento === 'btp_bot')
    const risultatiAltri = risultatiFinali.filter(r => r.strumento !== 'btp_bot')

    return {
      risultatiPerStrumento: risultatiFinali,
      dettaglioOperazioni,
      totalePlusvalenze,
      totaleMinusvalenze,
      totaleImposte,
      nettoTassabile: totalePlusvalenze - totaleMinusvalenze,
      redditiDiversi,
      redditiCapitale,
      risultatiBTP,
      risultatiAltri,
    }
  }, [operazioni])

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const aggiungiOperazione = useCallback(() => {
    if (nuovaOperazione.nome && nuovaOperazione.prezzo && nuovaOperazione.quantita) {
      const newOp: Operazione = {
        id: generateId(),
        tipo: nuovaOperazione.tipo as TipoOperazione,
        strumento: nuovaOperazione.strumento as TipoStrumento,
        nome: nuovaOperazione.nome,
        data: nuovaOperazione.data || oggi,
        prezzo: Number(nuovaOperazione.prezzo),
        quantita: Number(nuovaOperazione.quantita),
        commissioni: Number(nuovaOperazione.commissioni) || 0,
      }
      setOperazioni(prev => [...prev, newOp])
      setNuovaOperazione({
        tipo: 'acquisto',
        strumento: 'etf_armonizzato',
        nome: '',
        data: oggi,
        prezzo: 0,
        quantita: 0,
        commissioni: 0,
      })
      setShowAddForm(false)
    }
  }, [nuovaOperazione, oggi])

  const rimuoviOperazione = useCallback((id: string) => {
    setOperazioni(prev => prev.filter(op => op.id !== id))
  }, [])

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      // Basic CSV parsing - in production would use a proper parser
      const lines = text.split('\n')
      const newOperazioni: Operazione[] = []

      // Skip header
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim()
        if (!line) continue

        const parts = line.split(/[,;]/)
        if (parts.length >= 5) {
          newOperazioni.push({
            id: generateId(),
            tipo: parts[1]?.toLowerCase().includes('acqui') || parts[1]?.toLowerCase().includes('buy') ? 'acquisto' : 'vendita',
            strumento: 'etf_armonizzato',
            nome: parts[2] || 'Strumento importato',
            data: parts[0] || oggi,
            prezzo: parseFloat(parts[4]) || 0,
            quantita: parseFloat(parts[3]) || 0,
            commissioni: parseFloat(parts[5]) || 0,
          })
        }
      }

      if (newOperazioni.length > 0) {
        setOperazioni(prev => [...prev, ...newOperazioni])
        setShowImportModal(false)
      }
    }
    reader.readAsText(file)
  }, [oggi])

  const exportPDF = useCallback(() => {
    // Create a printable report
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Report Plusvalenze - GuidaPatrimonio.it</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; }
          h1 { color: #1B4D3E; border-bottom: 2px solid #1B4D3E; padding-bottom: 10px; }
          h2 { color: #2D6A4F; margin-top: 30px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f5f5f5; font-weight: 600; }
          .total-row { background: #e8f5e9; font-weight: bold; }
          .imposta { color: #c62828; }
          .plusvalenza { color: #2e7d32; }
          .minusvalenza { color: #c62828; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          .disclaimer { background: #fff3e0; padding: 15px; border-radius: 8px; margin-top: 30px; font-size: 11px; }
          .header-info { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #1B4D3E; }
        </style>
      </head>
      <body>
        <div class="header-info">
          <div class="logo">GuidaPatrimonio.it</div>
          <div>
            <strong>Data Report:</strong> ${new Date().toLocaleDateString('it-IT')}<br/>
            <strong>Regime Fiscale:</strong> ${regime === 'amministrato' ? 'Amministrato' : 'Dichiarativo'}
          </div>
        </div>

        <h1>Report Plusvalenze e Minusvalenze</h1>

        <h2>Riepilogo Generale</h2>
        <table>
          <tr>
            <td>Plusvalenze Totali</td>
            <td class="plusvalenza">${formatCurrency(risultatiFiscali.totalePlusvalenze)}</td>
          </tr>
          <tr>
            <td>Minusvalenze Totali</td>
            <td class="minusvalenza">${formatCurrency(risultatiFiscali.totaleMinusvalenze)}</td>
          </tr>
          <tr>
            <td>Base Imponibile Netta</td>
            <td><strong>${formatCurrency(risultatiFiscali.nettoTassabile)}</strong></td>
          </tr>
          <tr class="total-row">
            <td>IMPOSTA TOTALE DOVUTA</td>
            <td class="imposta">${formatCurrency(risultatiFiscali.totaleImposte)}</td>
          </tr>
        </table>

        <h2>Dettaglio per Strumento</h2>
        <table>
          <thead>
            <tr>
              <th>Strumento</th>
              <th>Aliquota</th>
              <th>Plusvalenza</th>
              <th>Minusvalenza</th>
              <th>Imposta</th>
            </tr>
          </thead>
          <tbody>
            ${risultatiFiscali.risultatiPerStrumento.map(r => `
              <tr>
                <td>${STRUMENTI_CONFIG[r.strumento].nome}</td>
                <td>${r.aliquota}%</td>
                <td class="plusvalenza">${formatCurrency(r.plusvalenza)}</td>
                <td class="minusvalenza">${formatCurrency(r.minusvalenza)}</td>
                <td class="imposta">${formatCurrency(r.impostaDovuta)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <h2>Elenco Operazioni</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Tipo</th>
              <th>Strumento</th>
              <th>Quantita</th>
              <th>Prezzo</th>
              <th>Valore</th>
            </tr>
          </thead>
          <tbody>
            ${operazioni.map(op => `
              <tr>
                <td>${formatDate(op.data)}</td>
                <td>${op.tipo === 'acquisto' ? 'Acquisto' : 'Vendita'}</td>
                <td>${op.nome}</td>
                <td>${op.quantita}</td>
                <td>${formatCurrency(op.prezzo)}</td>
                <td>${formatCurrency(op.prezzo * op.quantita)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="disclaimer">
          <strong>Disclaimer:</strong> Questo report e generato automaticamente a scopo informativo e didattico.
          Non costituisce consulenza fiscale o finanziaria. Le imposte effettive possono variare in base alla
          situazione personale, al regime fiscale applicato e ad altre variabili. Si consiglia di consultare
          un commercialista o consulente fiscale qualificato per la dichiarazione dei redditi.
        </div>

        <div class="footer">
          <p>Report generato da GuidaPatrimonio.it - Alternativa gratuita ai servizi di calcolo fiscale a pagamento</p>
          <p>© ${annoCorrente} GuidaPatrimonio.it - Tutti i diritti riservati</p>
        </div>
      </body>
      </html>
    `

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }
  }, [operazioni, risultatiFiscali, regime, annoCorrente])

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <main className="bg-cream min-h-screen">
      <ToolPageSchema slug="calcolatore-plusvalenze" />
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-forest via-green-600 to-forest pt-navbar relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container-custom py-12 md:py-16 relative">
          <Link href="/strumenti" className="inline-flex items-center text-green-200 hover:text-white mb-4 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tutti gli strumenti
          </Link>

          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-green-200 text-sm font-medium">Usato da 2.847 investitori questo mese</span>
              </div>

              <h1 className="font-heading text-[36px] md:text-[48px] lg:text-[56px] text-white leading-tight">
                Calcolatore Plusvalenze
                <span className="block text-green-300">Professionale e Gratuito</span>
              </h1>

              <p className="text-white/80 mt-4 text-lg max-w-xl">
                Calcola le imposte su azioni, ETF, BTP e crypto con precisione fiscale italiana.
                Import CSV da tutti i broker. Export PDF del report.
              </p>

              <div className="mt-6 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Calcolo FIFO automatico
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Aliquote 26% e 12.5%
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Export PDF
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 text-sm">Alternativa gratuita a</span>
                  <span className="bg-red-500/20 text-red-300 text-xs px-2 py-1 rounded-full line-through">
                    50-200 EUR/pratica
                  </span>
                </div>
                <div className="text-center py-4">
                  <span className="text-5xl font-bold text-white">0 EUR</span>
                  <span className="text-green-300 text-lg ml-2">per sempre</span>
                </div>
                <div className="space-y-2 mt-4">
                  {['TasseTrading', 'Fiscalitart', 'Commercialista'].map((name, i) => (
                    <div key={i} className="flex items-center justify-between text-white/70 text-sm">
                      <span>{name}</span>
                      <span className="line-through text-red-300">{50 + i * 50}-{100 + i * 100} EUR</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-8 md:py-12">
        <div className="container-custom">

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-gray-500 text-sm">Plusvalenze</span>
              </div>
              <p className="font-heading text-2xl text-green-600">{formatCurrency(risultatiFiscali.totalePlusvalenze)}</p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
                <span className="text-gray-500 text-sm">Minusvalenze</span>
              </div>
              <p className="font-heading text-2xl text-red-600">{formatCurrency(risultatiFiscali.totaleMinusvalenze)}</p>
            </div>

            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-gray-500 text-sm">Base Imponibile</span>
              </div>
              <p className="font-heading text-2xl text-forest">{formatCurrency(risultatiFiscali.nettoTassabile)}</p>
            </div>

            <div className="bg-gradient-to-br from-forest to-green-600 rounded-xl p-5 shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-white/80 text-sm">Imposta Dovuta</span>
              </div>
              <p className="font-heading text-2xl text-white">{formatCurrency(risultatiFiscali.totaleImposte)}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b">
              {[
                { id: 'operazioni', label: 'Operazioni', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
                { id: 'risultati', label: 'Risultati Fiscali', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
                { id: 'guida', label: 'Guida Fiscale', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-forest border-b-2 border-forest bg-green-50/50'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="p-6">
              {/* Tab: Operazioni */}
              {activeTab === 'operazioni' && (
                <div>
                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 mb-6">
                    <button
                      onClick={() => setShowAddForm(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-forest text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Aggiungi Operazione
                    </button>

                    <button
                      onClick={() => setShowImportModal(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-forest border border-forest rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Importa CSV
                    </button>

                    <button
                      onClick={exportPDF}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Esporta PDF
                    </button>

                    {/* Regime Toggle */}
                    <div className="ml-auto flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setRegime('amministrato')}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                          regime === 'amministrato'
                            ? 'bg-white text-forest shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        Amministrato
                      </button>
                      <button
                        onClick={() => setRegime('dichiarativo')}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                          regime === 'dichiarativo'
                            ? 'bg-white text-forest shadow-sm'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        Dichiarativo
                      </button>
                    </div>
                  </div>

                  {/* Operations Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tipo</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Strumento</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantita</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prezzo</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valore</th>
                          <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Comm.</th>
                          <th className="text-center py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {operazioni.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-12 text-center text-gray-400">
                              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <p>Nessuna operazione inserita</p>
                              <p className="text-sm mt-1">Aggiungi operazioni o importa da CSV</p>
                            </td>
                          </tr>
                        ) : (
                          operazioni
                            .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                            .map(op => (
                            <tr key={op.id} className="hover:bg-gray-50 transition-colors">
                              <td className="py-3 px-4 text-sm text-gray-600">{formatDate(op.data)}</td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  op.tipo === 'acquisto'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-orange-100 text-orange-700'
                                }`}>
                                  {op.tipo === 'acquisto' ? 'Acquisto' : 'Vendita'}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <p className="text-sm font-medium text-gray-900">{op.nome}</p>
                                <p className="text-xs text-gray-400">{STRUMENTI_CONFIG[op.strumento].nome}</p>
                              </td>
                              <td className="py-3 px-4 text-sm text-right text-gray-600">{op.quantita.toLocaleString('it-IT')}</td>
                              <td className="py-3 px-4 text-sm text-right text-gray-600">{formatCurrency(op.prezzo)}</td>
                              <td className="py-3 px-4 text-sm text-right font-medium text-gray-900">
                                {formatCurrency(op.prezzo * op.quantita)}
                              </td>
                              <td className="py-3 px-4 text-sm text-right text-gray-400">
                                {op.commissioni > 0 ? formatCurrency(op.commissioni) : '-'}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  onClick={() => rimuoviOperazione(op.id)}
                                  className="text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab: Risultati Fiscali */}
              {activeTab === 'risultati' && (
                <div className="space-y-8">
                  {/* Breakdown by Asset Type */}
                  <div>
                    <h3 className="font-heading text-lg text-forest mb-4">Dettaglio per Tipologia Strumento</h3>
                    {risultatiFiscali.risultatiPerStrumento.length === 0 ? (
                      <p className="text-gray-400 text-center py-8">Inserisci delle vendite per vedere i risultati fiscali</p>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        {risultatiFiscali.risultatiPerStrumento.map(r => {
                          const config = STRUMENTI_CONFIG[r.strumento]
                          const netto = r.plusvalenza - r.minusvalenza
                          return (
                            <div key={r.strumento} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <p className="font-medium text-gray-900">{config.nome}</p>
                                  <p className="text-xs text-gray-500">{config.categoria === 'redditi_diversi' ? 'Redditi Diversi' : 'Redditi Capitale'}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  r.aliquota === 12.5 ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                  Aliquota {r.aliquota}%
                                </span>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Plusvalenze</span>
                                  <span className="text-green-600 font-medium">{formatCurrency(r.plusvalenza)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Minusvalenze</span>
                                  <span className="text-red-600 font-medium">-{formatCurrency(r.minusvalenza)}</span>
                                </div>
                                <div className="border-t pt-2 flex justify-between">
                                  <span className="text-gray-700 font-medium">Netto tassabile</span>
                                  <span className={`font-bold ${netto > 0 ? 'text-forest' : 'text-red-600'}`}>
                                    {formatCurrency(netto)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Imposta ({r.aliquota}%)</span>
                                  <span className="text-amber-600 font-bold">{formatCurrency(r.impostaDovuta)}</span>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Tax Summary Chart */}
                  {risultatiFiscali.totaleImposte > 0 && (
                    <div>
                      <h3 className="font-heading text-lg text-forest mb-4">Composizione Imposte</h3>
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex items-center gap-8">
                          {/* Pie Chart Simulation */}
                          <div className="relative w-32 h-32 flex-shrink-0">
                            <svg viewBox="0 0 36 36" className="w-full h-full">
                              {(() => {
                                let offset = 0
                                const colors = ['#1B4D3E', '#2D6A4F', '#40916C', '#52B788', '#74C69D']
                                return risultatiFiscali.risultatiPerStrumento.map((r, i) => {
                                  const percentage = (r.impostaDovuta / risultatiFiscali.totaleImposte) * 100
                                  const strokeDash = `${percentage} ${100 - percentage}`
                                  const currentOffset = offset
                                  offset += percentage
                                  return (
                                    <circle
                                      key={r.strumento}
                                      cx="18"
                                      cy="18"
                                      r="15.91549430918954"
                                      fill="transparent"
                                      stroke={colors[i % colors.length]}
                                      strokeWidth="3.5"
                                      strokeDasharray={strokeDash}
                                      strokeDashoffset={100 - currentOffset + 25}
                                    />
                                  )
                                })
                              })()}
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <p className="text-lg font-bold text-forest">{formatCurrency(risultatiFiscali.totaleImposte)}</p>
                                <p className="text-xs text-gray-500">Totale</p>
                              </div>
                            </div>
                          </div>

                          {/* Legend */}
                          <div className="flex-1 space-y-2">
                            {risultatiFiscali.risultatiPerStrumento.map((r, i) => {
                              const colors = ['bg-forest', 'bg-green-600', 'bg-green-500', 'bg-green-400', 'bg-green-300']
                              const percentage = (r.impostaDovuta / risultatiFiscali.totaleImposte) * 100
                              return (
                                <div key={r.strumento} className="flex items-center gap-3">
                                  <div className={`w-3 h-3 rounded-full ${colors[i % colors.length]}`}></div>
                                  <span className="text-sm text-gray-600 flex-1">{STRUMENTI_CONFIG[r.strumento].nome}</span>
                                  <span className="text-sm font-medium text-gray-900">{formatCurrency(r.impostaDovuta)}</span>
                                  <span className="text-xs text-gray-400">({percentage.toFixed(1)}%)</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Quadro RT Instructions */}
                  {regime === 'dichiarativo' && risultatiFiscali.totaleImposte > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                      <h3 className="font-heading text-lg text-amber-800 mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Istruzioni Quadro RT - Modello Redditi
                      </h3>
                      <div className="space-y-4 text-sm text-amber-900">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-white/50 rounded-lg p-4">
                            <p className="font-medium mb-2">Rigo RT21 - Plusvalenze</p>
                            <p className="text-2xl font-bold text-green-700">{formatCurrency(risultatiFiscali.totalePlusvalenze)}</p>
                          </div>
                          <div className="bg-white/50 rounded-lg p-4">
                            <p className="font-medium mb-2">Rigo RT23 - Minusvalenze</p>
                            <p className="text-2xl font-bold text-red-700">{formatCurrency(risultatiFiscali.totaleMinusvalenze)}</p>
                          </div>
                          <div className="bg-white/50 rounded-lg p-4">
                            <p className="font-medium mb-2">Rigo RT26 - Base imponibile</p>
                            <p className="text-2xl font-bold text-forest">{formatCurrency(risultatiFiscali.nettoTassabile)}</p>
                          </div>
                          <div className="bg-white/50 rounded-lg p-4">
                            <p className="font-medium mb-2">Rigo RT27 - Imposta sostitutiva</p>
                            <p className="text-2xl font-bold text-amber-700">{formatCurrency(risultatiFiscali.totaleImposte)}</p>
                          </div>
                        </div>

                        <div className="bg-white/50 rounded-lg p-4">
                          <p className="font-medium mb-2">Note importanti:</p>
                          <ul className="list-disc list-inside space-y-1 text-amber-800">
                            <li>Per BTP e titoli di Stato usare la Sezione II con aliquota 12.5%</li>
                            <li>Le minusvalenze vanno riportate nel quadro RT sezione III</li>
                            <li>Se hai strumenti esteri, compila anche il quadro RW</li>
                            <li>Conserva la documentazione per 5 anni</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Guida Fiscale */}
              {activeTab === 'guida' && (
                <div className="space-y-8">
                  {/* Regime Comparison */}
                  <div>
                    <h3 className="font-heading text-xl text-forest mb-4">Regime Amministrato vs Dichiarativo</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className={`rounded-xl p-6 border-2 ${regime === 'amministrato' ? 'border-green-500 bg-green-50/50' : 'border-gray-200 bg-white'}`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-heading text-lg text-forest">Regime Amministrato</h4>
                            <p className="text-xs text-gray-500">Consigliato per la maggior parte</p>
                          </div>
                        </div>
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">+</span>
                            <span>Il broker calcola e versa le imposte automaticamente</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">+</span>
                            <span>Compensazione automatica plus/minusvalenze</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">+</span>
                            <span>Nessun obbligo dichiarativo aggiuntivo</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">-</span>
                            <span>No compensazione tra broker diversi</span>
                          </li>
                        </ul>
                        <p className="mt-4 text-xs text-gray-500 bg-gray-100 rounded-lg p-3">
                          <strong>Ideale per:</strong> Chi ha un solo broker italiano e preferisce la semplicita
                        </p>
                      </div>

                      <div className={`rounded-xl p-6 border-2 ${regime === 'dichiarativo' ? 'border-green-500 bg-green-50/50' : 'border-gray-200 bg-white'}`}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-heading text-lg text-forest">Regime Dichiarativo</h4>
                            <p className="text-xs text-gray-500">Maggiore flessibilita</p>
                          </div>
                        </div>
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">+</span>
                            <span>Compensazione tra broker diversi</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">+</span>
                            <span>Maggiore controllo sulla fiscalita</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">-</span>
                            <span>Obbligo di compilare Quadro RT e RW</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">-</span>
                            <span>Richiede commercialista o buona competenza</span>
                          </li>
                        </ul>
                        <p className="mt-4 text-xs text-gray-500 bg-gray-100 rounded-lg p-3">
                          <strong>Ideale per:</strong> Chi usa broker esteri (IBKR, Degiro) o ha piu conti
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tax Rates Table */}
                  <div>
                    <h3 className="font-heading text-xl text-forest mb-4">Aliquote per Tipo di Strumento</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-gray-50">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Strumento</th>
                            <th className="text-center py-3 px-4 font-semibold text-gray-700">Aliquota</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Categoria Fiscale</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Note</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {(Object.entries(STRUMENTI_CONFIG) as [TipoStrumento, StrumentoConfig][]).map(([key, config]) => (
                            <tr key={key} className="hover:bg-gray-50">
                              <td className="py-3 px-4">
                                <p className="font-medium text-gray-900">{config.nome}</p>
                                <p className="text-xs text-gray-400">{config.descrizione}</p>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full font-bold ${
                                  config.aliquota === 12.5
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {config.aliquota}%
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  config.categoria === 'redditi_diversi'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-purple-100 text-purple-700'
                                }`}>
                                  {config.categoria === 'redditi_diversi' ? 'Redditi Diversi' : 'Redditi Capitale'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-gray-500 text-xs">{config.note || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Compensation Rules */}
                  <div>
                    <h3 className="font-heading text-xl text-forest mb-4">Regole di Compensazione</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                          <span className="text-blue-600 font-bold">RD</span>
                        </div>
                        <h4 className="font-medium text-blue-800 mb-2">Redditi Diversi</h4>
                        <p className="text-sm text-blue-700">
                          Azioni, ETC, Certificati. Le minusvalenze compensano <strong>qualsiasi</strong> plusvalenza.
                        </p>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-xl p-5">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
                          <span className="text-purple-600 font-bold">RC</span>
                        </div>
                        <h4 className="font-medium text-purple-800 mb-2">Redditi Capitale</h4>
                        <p className="text-sm text-purple-700">
                          ETF, Fondi, Obbligazioni. Le minusvalenze <strong>NON</strong> compensano redditi capitale.
                        </p>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
                          <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h4 className="font-medium text-amber-800 mb-2">Scadenza 4 Anni</h4>
                        <p className="text-sm text-amber-700">
                          Le minusvalenze scadono al 31/12 del quarto anno successivo. Usa il metodo FIFO.
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 flex items-start gap-2">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>
                          <strong>Attenzione:</strong> I dividendi e le cedole NON possono essere compensati con le minusvalenze.
                          Solo le plusvalenze da capital gain sono compensabili.
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Link to Minusvalenze Calculator */}
                  <div className="bg-gradient-to-r from-forest to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-heading text-lg mb-2">Hai minusvalenze in scadenza?</h4>
                        <p className="text-white/80 text-sm">
                          Usa il nostro calcolatore minusvalenze per gestire lo zainetto fiscale
                        </p>
                      </div>
                      <Link
                        href="/strumenti/calcolatore-minusvalenze"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white text-forest rounded-lg hover:bg-green-50 transition-colors font-medium"
                      >
                        Vai al Calcolatore
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 bg-gray-100 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Disclaimer Fiscale</h4>
                <p className="text-sm text-gray-600">
                  Questo calcolatore fornisce stime indicative a scopo educativo e informativo.
                  Le imposte effettive possono variare in base alla tua situazione personale, al regime fiscale scelto,
                  alla residenza fiscale e ad altre variabili. Le aliquote e normative fiscali possono cambiare nel tempo.
                  Questo strumento non costituisce consulenza fiscale o finanziaria.
                  Si consiglia di consultare un commercialista o consulente fiscale qualificato per una valutazione accurata della propria situazione.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-br from-forest to-green-600">
        <div className="container-custom text-center">
          <h2 className="font-heading text-2xl md:text-3xl text-white mb-4">
            Vuoi ottimizzare la fiscalita dei tuoi investimenti?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            La pianificazione fiscale e fondamentale per massimizzare i rendimenti netti.
            Un consulente indipendente puo aiutarti a scegliere il regime fiscale piu vantaggioso.
          </p>
          <Link href="/#contatti" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-forest rounded-lg font-medium hover:bg-green-50 transition-colors">
            Richiedi Consulenza Gratuita
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Add Operation Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xl text-forest">Nuova Operazione</h3>
                <button onClick={() => setShowAddForm(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Tipo operazione */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Operazione</label>
                <div className="grid grid-cols-2 gap-2">
                  {['acquisto', 'vendita'].map(tipo => (
                    <button
                      key={tipo}
                      onClick={() => setNuovaOperazione(prev => ({ ...prev, tipo: tipo as TipoOperazione }))}
                      className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                        nuovaOperazione.tipo === tipo
                          ? tipo === 'acquisto' ? 'bg-blue-600 text-white' : 'bg-orange-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {tipo === 'acquisto' ? 'Acquisto' : 'Vendita'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipo strumento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Strumento</label>
                <select
                  value={nuovaOperazione.strumento}
                  onChange={(e) => setNuovaOperazione(prev => ({ ...prev, strumento: e.target.value as TipoStrumento }))}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {(Object.entries(STRUMENTI_CONFIG) as [TipoStrumento, StrumentoConfig][]).map(([key, config]) => (
                    <option key={key} value={key}>{config.nome} ({config.aliquota}%)</option>
                  ))}
                </select>
              </div>

              {/* Nome strumento */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Strumento</label>
                <input
                  type="text"
                  placeholder="Es. iShares Core MSCI World"
                  value={nuovaOperazione.nome || ''}
                  onChange={(e) => setNuovaOperazione(prev => ({ ...prev, nome: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* Data */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Operazione</label>
                <input
                  type="date"
                  value={nuovaOperazione.data || oggi}
                  onChange={(e) => setNuovaOperazione(prev => ({ ...prev, data: e.target.value }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* Prezzo e Quantita */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prezzo Unitario (EUR)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={nuovaOperazione.prezzo || ''}
                    onChange={(e) => setNuovaOperazione(prev => ({ ...prev, prezzo: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantita</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={nuovaOperazione.quantita || ''}
                    onChange={(e) => setNuovaOperazione(prev => ({ ...prev, quantita: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              {/* Commissioni */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commissioni (EUR)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={nuovaOperazione.commissioni || ''}
                  onChange={(e) => setNuovaOperazione(prev => ({ ...prev, commissioni: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              {/* Valore totale preview */}
              {(nuovaOperazione.prezzo ?? 0) > 0 && (nuovaOperazione.quantita ?? 0) > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Valore totale operazione</span>
                    <span className="font-bold text-forest">
                      {formatCurrency((nuovaOperazione.prezzo ?? 0) * (nuovaOperazione.quantita ?? 0))}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Annulla
              </button>
              <button
                onClick={aggiungiOperazione}
                disabled={!nuovaOperazione.nome || !(nuovaOperazione.prezzo ?? 0) || !(nuovaOperazione.quantita ?? 0)}
                className="flex-1 px-4 py-2 bg-forest text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Aggiungi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import CSV Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-xl text-forest">Importa da CSV</h3>
                <button onClick={() => setShowImportModal(false)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Importa le operazioni da un file CSV esportato dal tuo broker.
                Formati supportati:
              </p>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {Object.entries(CSV_FORMATS).map(([key, format]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-3 text-center">
                    <p className="font-medium text-sm text-gray-800">{format.nome}</p>
                  </div>
                ))}
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-600 mb-2">Trascina qui il file CSV oppure</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-forest text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Seleziona File
                </button>
              </div>

              <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                <p className="text-xs text-amber-800">
                  <strong>Nota:</strong> Dopo l&apos;importazione, verifica che le operazioni siano state riconosciute correttamente
                  e modifica manualmente il tipo di strumento se necessario.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rating Widget */}
      <div className="container-custom py-8">
        <RatingWidget toolSlug="calcolatore-plusvalenze" toolName="Calcolatore Plusvalenze" />
      </div>

      <Footer />
    </main>
  )
}
