import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Cache durata: 15 minuti
export const revalidate = 900

interface MacroData {
  spreadBtpBund: {
    value: number
    change: number
    lastUpdate: string
  }
  tassiBce: {
    depositi: number
    rifinanziamento: number
    marginale: number
    lastUpdate: string
  }
  inflazioneItalia: {
    value: number
    month: string
    lastUpdate: string
  }
  ftseMib: {
    value: number
    change: number
    changePercent: number
    lastUpdate: string
  }
  btp10y: {
    value: number
    change: number
    lastUpdate: string
  }
  forex: {
    eurUsd: number
    eurUsdChange: number
    eurChf: number
    eurChfChange: number
    lastUpdate: string
  }
}

interface BceRatesData {
  lastUpdate: string
  source: string
  rates: {
    depositFacility: number
    mainRefinancing: number
    marginalLending: number
  }
  history: Array<{
    date: string
    depositFacility: number
    mainRefinancing: number
    marginalLending: number
  }>
}

interface IstatInflazioneData {
  lastUpdate: string
  source: string
  current: {
    yoy: number
    mom: number
    core: number
    month: string
  }
  history: Array<{
    month: string
    yoy: number
    mom: number
  }>
}

// Fallback data in caso di errori
const fallbackData: MacroData = {
  spreadBtpBund: {
    value: 125,
    change: -2,
    lastUpdate: new Date().toISOString()
  },
  tassiBce: {
    depositi: 2.00,
    rifinanziamento: 2.15,
    marginale: 2.40,
    lastUpdate: new Date().toISOString()
  },
  inflazioneItalia: {
    value: 1.3,
    month: 'Dicembre 2025',
    lastUpdate: new Date().toISOString()
  },
  ftseMib: {
    value: 35850,
    change: 125,
    changePercent: 0.35,
    lastUpdate: new Date().toISOString()
  },
  btp10y: {
    value: 3.52,
    change: -0.02,
    lastUpdate: new Date().toISOString()
  },
  forex: {
    eurUsd: 1.0425,
    eurUsdChange: 0.0012,
    eurChf: 0.9385,
    eurChfChange: -0.0008,
    lastUpdate: new Date().toISOString()
  }
}

async function fetchYahooFinanceQuote(symbol: string): Promise<{ price: number; change: number; changePercent: number } | null> {
  try {
    // Yahoo Finance API endpoint
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      next: { revalidate: 900 }
    })

    if (!response.ok) return null

    const data = await response.json()
    const result = data?.chart?.result?.[0]

    if (!result) return null

    const meta = result.meta
    const price = meta.regularMarketPrice
    const previousClose = meta.chartPreviousClose || meta.previousClose
    const change = price - previousClose
    const changePercent = (change / previousClose) * 100

    return { price, change, changePercent }
  } catch {
    return null
  }
}

async function fetchBceRates(): Promise<{ depositi: number; rifinanziamento: number; marginale: number } | null> {
  try {
    // Read from scraped BCE rates file
    const dataPath = join(process.cwd(), 'data/scraped/bce-rates.json')

    if (existsSync(dataPath)) {
      const fileContent = readFileSync(dataPath, 'utf-8')
      const data: BceRatesData = JSON.parse(fileContent)

      // Check if data is not too stale (less than 7 days old)
      const lastUpdate = new Date(data.lastUpdate)
      const now = new Date()
      const daysOld = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)

      if (daysOld < 7) {
        return {
          depositi: data.rates.depositFacility,
          rifinanziamento: data.rates.mainRefinancing,
          marginale: data.rates.marginalLending
        }
      }
    }

    // Fallback to known recent rates (ECB updates infrequently)
    return {
      depositi: 2.00,
      rifinanziamento: 2.15,
      marginale: 2.40
    }
  } catch {
    return null
  }
}

async function fetchInflazioneIstat(): Promise<{ value: number; month: string } | null> {
  try {
    // Read from scraped ISTAT inflation file
    const dataPath = join(process.cwd(), 'data/scraped/istat-inflazione.json')

    if (existsSync(dataPath)) {
      const fileContent = readFileSync(dataPath, 'utf-8')
      const data: IstatInflazioneData = JSON.parse(fileContent)

      // Check if data is not too stale (less than 7 days old)
      const lastUpdate = new Date(data.lastUpdate)
      const now = new Date()
      const daysOld = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)

      if (daysOld < 7 && data.current) {
        return {
          value: data.current.yoy,
          month: data.current.month
        }
      }
    }

    // Fallback to known recent rates
    return {
      value: 1.3,
      month: 'Dicembre 2025'
    }
  } catch {
    return null
  }
}

export async function GET() {
  try {
    const now = new Date().toISOString()

    // Fetch data in parallel
    const [
      ftseMibData,
      btpData,
      bundData,
      eurUsdData,
      eurChfData,
    ] = await Promise.all([
      fetchYahooFinanceQuote('FTSEMIB.MI'),
      fetchYahooFinanceQuote('IT10Y=X'),    // BTP 10 anni
      fetchYahooFinanceQuote('DE10Y=X'),    // Bund 10 anni (per calcolare spread)
      fetchYahooFinanceQuote('EURUSD=X'),
      fetchYahooFinanceQuote('EURCHF=X'),
    ])

    const bceRates = await fetchBceRates()
    const inflazioneData = await fetchInflazioneIstat()

    // Calculate spread BTP-Bund
    let spreadValue = fallbackData.spreadBtpBund.value
    let spreadChange = fallbackData.spreadBtpBund.change

    if (btpData && bundData) {
      spreadValue = Math.round((btpData.price - bundData.price) * 100) // in basis points
      // Approximate change based on BTP change
      spreadChange = Math.round(btpData.change * 100)
    }

    const macroData: MacroData = {
      spreadBtpBund: {
        value: spreadValue,
        change: spreadChange,
        lastUpdate: now
      },
      tassiBce: {
        depositi: bceRates?.depositi ?? fallbackData.tassiBce.depositi,
        rifinanziamento: bceRates?.rifinanziamento ?? fallbackData.tassiBce.rifinanziamento,
        marginale: bceRates?.marginale ?? fallbackData.tassiBce.marginale,
        lastUpdate: now
      },
      inflazioneItalia: {
        value: inflazioneData?.value ?? fallbackData.inflazioneItalia.value,
        month: inflazioneData?.month ?? fallbackData.inflazioneItalia.month,
        lastUpdate: now
      },
      ftseMib: {
        value: ftseMibData?.price ?? fallbackData.ftseMib.value,
        change: ftseMibData?.change ?? fallbackData.ftseMib.change,
        changePercent: ftseMibData?.changePercent ?? fallbackData.ftseMib.changePercent,
        lastUpdate: now
      },
      btp10y: {
        value: btpData?.price ?? fallbackData.btp10y.value,
        change: btpData?.change ?? fallbackData.btp10y.change,
        lastUpdate: now
      },
      forex: {
        eurUsd: eurUsdData?.price ?? fallbackData.forex.eurUsd,
        eurUsdChange: eurUsdData?.change ?? fallbackData.forex.eurUsdChange,
        eurChf: eurChfData?.price ?? fallbackData.forex.eurChf,
        eurChfChange: eurChfData?.change ?? fallbackData.forex.eurChfChange,
        lastUpdate: now
      }
    }

    return NextResponse.json({
      success: true,
      data: macroData,
      cached: false,
      fetchedAt: now
    })

  } catch (error) {
    console.error('Error fetching macro data:', error)

    // Return fallback data on error
    return NextResponse.json({
      success: true,
      data: fallbackData,
      cached: true,
      error: 'Using fallback data',
      fetchedAt: new Date().toISOString()
    })
  }
}
