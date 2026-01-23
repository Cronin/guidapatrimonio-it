import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Cache: 15 minutes
export const revalidate = 900

interface StockQuote {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  volume?: number
  marketCap?: number
}

interface FTSEMibData {
  value: number
  change: number
  changePercent: number
  open: number
  high: number
  low: number
  volume: number
  previousClose: number
}

interface BorsaItalianaData {
  lastUpdate: string
  source: string
  ftseMib: FTSEMibData
  topGainers: StockQuote[]
  topLosers: StockQuote[]
  bluechips: StockQuote[]
  history: Array<{
    date: string
    ftseMib: number
    change: number
  }>
}

// Fallback data
const FALLBACK_DATA: BorsaItalianaData = {
  lastUpdate: new Date().toISOString(),
  source: 'fallback',
  ftseMib: {
    value: 35850,
    change: 125,
    changePercent: 0.35,
    open: 35725,
    high: 35920,
    low: 35680,
    volume: 450000000,
    previousClose: 35725
  },
  topGainers: [
    { symbol: 'UCG.MI', name: 'UniCredit', price: 38.50, change: 1.25, changePercent: 3.36 },
    { symbol: 'ISP.MI', name: 'Intesa Sanpaolo', price: 3.85, change: 0.08, changePercent: 2.12 },
    { symbol: 'BAMI.MI', name: 'Banco BPM', price: 6.95, change: 0.12, changePercent: 1.76 },
  ],
  topLosers: [
    { symbol: 'TIT.MI', name: 'Telecom Italia', price: 0.25, change: -0.01, changePercent: -3.85 },
    { symbol: 'STLAM.MI', name: 'Stellantis', price: 12.50, change: -0.35, changePercent: -2.73 },
    { symbol: 'SPM.MI', name: 'Saipem', price: 2.15, change: -0.04, changePercent: -1.83 },
  ],
  bluechips: [
    { symbol: 'ENEL.MI', name: 'Enel', price: 6.85, change: 0.05, changePercent: 0.74, marketCap: 70000000000 },
    { symbol: 'ENI.MI', name: 'Eni', price: 14.20, change: 0.15, changePercent: 1.07, marketCap: 50000000000 },
    { symbol: 'UCG.MI', name: 'UniCredit', price: 38.50, change: 1.25, changePercent: 3.36, marketCap: 68000000000 },
    { symbol: 'ISP.MI', name: 'Intesa Sanpaolo', price: 3.85, change: 0.08, changePercent: 2.12, marketCap: 70000000000 },
    { symbol: 'G.MI', name: 'Generali', price: 25.50, change: 0.20, changePercent: 0.79, marketCap: 42000000000 },
  ],
  history: []
}

async function fetchYahooFinanceQuote(symbol: string): Promise<{
  price: number
  change: number
  changePercent: number
  open: number
  high: number
  low: number
  volume: number
  previousClose: number
  marketCap?: number
} | null> {
  try {
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
    const quote = result.indicators?.quote?.[0]

    const price = meta.regularMarketPrice
    const previousClose = meta.chartPreviousClose || meta.previousClose
    const change = price - previousClose
    const changePercent = (change / previousClose) * 100

    const lastIndex = quote?.close?.length ? quote.close.length - 1 : 0
    const open = quote?.open?.[lastIndex] || meta.regularMarketOpen || price
    const high = quote?.high?.[lastIndex] || meta.regularMarketDayHigh || price
    const low = quote?.low?.[lastIndex] || meta.regularMarketDayLow || price
    const volume = quote?.volume?.[lastIndex] || meta.regularMarketVolume || 0

    return {
      price: parseFloat(price.toFixed(4)),
      change: parseFloat(change.toFixed(4)),
      changePercent: parseFloat(changePercent.toFixed(2)),
      open: parseFloat(open.toFixed(4)),
      high: parseFloat(high.toFixed(4)),
      low: parseFloat(low.toFixed(4)),
      volume: Math.round(volume),
      previousClose: parseFloat(previousClose.toFixed(4)),
      marketCap: meta.marketCap
    }
  } catch {
    return null
  }
}

export async function GET() {
  try {
    // First, try to read from scraped file
    const dataPath = join(process.cwd(), 'data/scraped/borsa-italiana.json')

    if (existsSync(dataPath)) {
      const fileContent = readFileSync(dataPath, 'utf-8')
      const scrapedData: BorsaItalianaData = JSON.parse(fileContent)

      // Check if data is fresh (less than 1 hour old)
      const lastUpdate = new Date(scrapedData.lastUpdate)
      const now = new Date()
      const hoursOld = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60)

      if (hoursOld < 1) {
        return NextResponse.json({
          success: true,
          data: scrapedData,
          stale: false,
          fetchedAt: now.toISOString()
        })
      }
    }

    // If file is stale or missing, fetch fresh FTSE MIB data
    const ftseMibQuote = await fetchYahooFinanceQuote('FTSEMIB.MI')

    if (ftseMibQuote) {
      // Read existing data for other fields
      let existingData = FALLBACK_DATA
      if (existsSync(dataPath)) {
        try {
          existingData = JSON.parse(readFileSync(dataPath, 'utf-8'))
        } catch {
          // Use fallback
        }
      }

      const freshData: BorsaItalianaData = {
        ...existingData,
        lastUpdate: new Date().toISOString(),
        source: 'yahoo-finance-live',
        ftseMib: {
          value: Math.round(ftseMibQuote.price),
          change: Math.round(ftseMibQuote.change),
          changePercent: ftseMibQuote.changePercent,
          open: Math.round(ftseMibQuote.open),
          high: Math.round(ftseMibQuote.high),
          low: Math.round(ftseMibQuote.low),
          volume: ftseMibQuote.volume,
          previousClose: Math.round(ftseMibQuote.previousClose)
        }
      }

      return NextResponse.json({
        success: true,
        data: freshData,
        stale: false,
        fetchedAt: new Date().toISOString()
      })
    }

    // If everything fails, return fallback
    return NextResponse.json({
      success: true,
      data: FALLBACK_DATA,
      stale: true,
      error: 'Using fallback data',
      fetchedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error fetching Borsa Italiana data:', error)

    return NextResponse.json({
      success: true,
      data: FALLBACK_DATA,
      stale: true,
      error: 'Using fallback data',
      fetchedAt: new Date().toISOString()
    })
  }
}
