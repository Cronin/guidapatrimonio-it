/**
 * BTP Yields Scraper
 * Fetches Italian government bond yields and calculates spread
 *
 * Run: npx tsx scripts/scrapers/btp-yields.ts
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

interface YieldData {
  yield: number
  change: number
}

interface BTPYields {
  lastUpdate: string
  source: string
  btp: {
    '2Y': YieldData
    '5Y': YieldData
    '10Y': YieldData
    '30Y': YieldData
  }
  bund: {
    '10Y': YieldData
  }
  spread: {
    value: number
    change: number
  }
  history: Array<{
    date: string
    btp10Y: number
    bund10Y: number
    spread: number
  }>
}

const OUTPUT_PATH = join(process.cwd(), 'data/scraped/btp-yields.json')

const SYMBOLS = {
  btp2y: 'IT2Y=RR',
  btp5y: 'IT5Y=RR',
  btp10y: 'IT10Y=RR',
  btp30y: 'IT30Y=RR',
  bund10y: 'DE10Y=RR'
}

const FALLBACK_DATA = {
  btp: {
    '2Y': { yield: 2.85, change: -0.02 },
    '5Y': { yield: 3.15, change: -0.01 },
    '10Y': { yield: 3.52, change: -0.03 },
    '30Y': { yield: 4.10, change: 0.01 }
  },
  bund: { '10Y': { yield: 2.30, change: -0.01 } }
}

async function fetchYahooFinance(symbol: string): Promise<{ price: number, change: number } | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    })

    if (!response.ok) return null

    const data = await response.json()
    const meta = data?.chart?.result?.[0]?.meta
    const price = meta?.regularMarketPrice
    const previousClose = meta?.previousClose || meta?.chartPreviousClose

    if (price !== undefined) {
      const change = previousClose ? parseFloat((price - previousClose).toFixed(3)) : 0
      return { price: parseFloat(price.toFixed(3)), change }
    }
    return null
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error)
    return null
  }
}

function loadExistingData(): BTPYields | null {
  try {
    if (existsSync(OUTPUT_PATH)) {
      return JSON.parse(readFileSync(OUTPUT_PATH, 'utf-8'))
    }
  } catch (error) {
    console.error('Error loading existing data:', error)
  }
  return null
}

async function main() {
  console.log('Starting BTP yields scraper...')

  let source = 'yahoo-finance'
  const btpData = { ...FALLBACK_DATA.btp }
  const bundData = { ...FALLBACK_DATA.bund }

  console.log('Fetching BTP 2Y...')
  const btp2y = await fetchYahooFinance(SYMBOLS.btp2y)
  await new Promise(r => setTimeout(r, 500))

  console.log('Fetching BTP 5Y...')
  const btp5y = await fetchYahooFinance(SYMBOLS.btp5y)
  await new Promise(r => setTimeout(r, 500))

  console.log('Fetching BTP 10Y...')
  const btp10y = await fetchYahooFinance(SYMBOLS.btp10y)
  await new Promise(r => setTimeout(r, 500))

  console.log('Fetching BTP 30Y...')
  const btp30y = await fetchYahooFinance(SYMBOLS.btp30y)
  await new Promise(r => setTimeout(r, 500))

  console.log('Fetching Bund 10Y...')
  const bund10y = await fetchYahooFinance(SYMBOLS.bund10y)

  if (btp2y) btpData['2Y'] = { yield: btp2y.price, change: btp2y.change }
  if (btp5y) btpData['5Y'] = { yield: btp5y.price, change: btp5y.change }
  if (btp10y) btpData['10Y'] = { yield: btp10y.price, change: btp10y.change }
  if (btp30y) btpData['30Y'] = { yield: btp30y.price, change: btp30y.change }
  if (bund10y) bundData['10Y'] = { yield: bund10y.price, change: bund10y.change }

  const gotRealData = btp2y || btp5y || btp10y || btp30y || bund10y
  if (!gotRealData) {
    console.log('All sources failed, using fallback')
    source = 'fallback'
  }

  const spreadValue = Math.round((btpData['10Y'].yield - bundData['10Y'].yield) * 100)
  const spreadChange = Math.round((btpData['10Y'].change - bundData['10Y'].change) * 100)

  const existing = loadExistingData()
  let history = existing?.history || []

  const today = new Date().toISOString().split('T')[0]
  const lastDate = history.length > 0 ? history[history.length - 1].date : ''

  if (lastDate !== today) {
    history.push({
      date: today,
      btp10Y: btpData['10Y'].yield,
      bund10Y: bundData['10Y'].yield,
      spread: spreadValue
    })
  } else {
    history[history.length - 1] = {
      date: today,
      btp10Y: btpData['10Y'].yield,
      bund10Y: bundData['10Y'].yield,
      spread: spreadValue
    }
  }

  history = history.slice(-30)

  const output: BTPYields = {
    lastUpdate: new Date().toISOString(),
    source,
    btp: btpData,
    bund: bundData,
    spread: { value: spreadValue, change: spreadChange },
    history
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true })
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2))
  console.log('BTP yields saved to', OUTPUT_PATH)
  console.log('BTP 10Y:', btpData['10Y'].yield, '%, Spread:', spreadValue, 'bp')
}

main().catch(console.error)
