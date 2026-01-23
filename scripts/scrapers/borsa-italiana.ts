/**
 * Borsa Italiana Scraper
 * Fetches FTSE MIB data, top gainers/losers, and blue chips from Yahoo Finance
 *
 * Run: npx tsx scripts/scrapers/borsa-italiana.ts
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

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

const OUTPUT_PATH = join(process.cwd(), 'data/scraped/borsa-italiana.json')

// FTSE MIB 40 components - main Italian blue chips
const FTSE_MIB_COMPONENTS = [
  { symbol: 'UCG.MI', name: 'UniCredit' },
  { symbol: 'ISP.MI', name: 'Intesa Sanpaolo' },
  { symbol: 'ENEL.MI', name: 'Enel' },
  { symbol: 'ENI.MI', name: 'Eni' },
  { symbol: 'STM.MI', name: 'STMicroelectronics' },
  { symbol: 'G.MI', name: 'Generali' },
  { symbol: 'RACE.MI', name: 'Ferrari' },
  { symbol: 'STLAM.MI', name: 'Stellantis' },
  { symbol: 'TEN.MI', name: 'Tenaris' },
  { symbol: 'MONC.MI', name: 'Moncler' },
  { symbol: 'BAMI.MI', name: 'Banco BPM' },
  { symbol: 'PRY.MI', name: 'Prysmian' },
  { symbol: 'A2A.MI', name: 'A2A' },
  { symbol: 'SRG.MI', name: 'Snam' },
  { symbol: 'TRN.MI', name: 'Terna' },
  { symbol: 'PST.MI', name: 'Poste Italiane' },
  { symbol: 'CPR.MI', name: 'Campari' },
  { symbol: 'MB.MI', name: 'Mediobanca' },
  { symbol: 'FBK.MI', name: 'Finecobank' },
  { symbol: 'IG.MI', name: 'Italgas' },
  { symbol: 'TIT.MI', name: 'Telecom Italia' },
  { symbol: 'PIRC.MI', name: 'Pirelli' },
  { symbol: 'REC.MI', name: 'Recordati' },
  { symbol: 'AMP.MI', name: 'Amplifon' },
  { symbol: 'BPER.MI', name: 'BPER Banca' },
  { symbol: 'ERG.MI', name: 'ERG' },
  { symbol: 'SPM.MI', name: 'Saipem' },
  { symbol: 'HER.MI', name: 'Hera' },
  { symbol: 'DIA.MI', name: 'DiaSorin' },
  { symbol: 'INW.MI', name: 'Inwit' },
]

// Fallback data in case API fails
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
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    })

    if (!response.ok) {
      console.log(`Yahoo Finance returned ${response.status} for ${symbol}`)
      return null
    }

    const data = await response.json()
    const result = data?.chart?.result?.[0]

    if (!result) return null

    const meta = result.meta
    const quote = result.indicators?.quote?.[0]

    const price = meta.regularMarketPrice
    const previousClose = meta.chartPreviousClose || meta.previousClose
    const change = price - previousClose
    const changePercent = (change / previousClose) * 100

    // Get today's OHLC from the quote data
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
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error)
    return null
  }
}

function loadExistingData(): BorsaItalianaData | null {
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
  console.log('Starting Borsa Italiana scraper...')
  console.log('='.repeat(50))

  let source = 'yahoo-finance'

  // 1. Fetch FTSE MIB index
  console.log('\n1. Fetching FTSE MIB index...')
  const ftseMibQuote = await fetchYahooFinanceQuote('FTSEMIB.MI')

  let ftseMib: FTSEMibData
  if (ftseMibQuote) {
    ftseMib = {
      value: Math.round(ftseMibQuote.price),
      change: Math.round(ftseMibQuote.change),
      changePercent: ftseMibQuote.changePercent,
      open: Math.round(ftseMibQuote.open),
      high: Math.round(ftseMibQuote.high),
      low: Math.round(ftseMibQuote.low),
      volume: ftseMibQuote.volume,
      previousClose: Math.round(ftseMibQuote.previousClose)
    }
    console.log(`   FTSE MIB: ${ftseMib.value} (${ftseMib.changePercent >= 0 ? '+' : ''}${ftseMib.changePercent}%)`)
  } else {
    console.log('   Failed to fetch FTSE MIB, using fallback')
    ftseMib = FALLBACK_DATA.ftseMib
    source = 'partial-fallback'
  }

  // 2. Fetch individual stocks
  console.log('\n2. Fetching individual stocks...')
  const stockQuotes: StockQuote[] = []

  for (const stock of FTSE_MIB_COMPONENTS) {
    // Rate limit to avoid being blocked
    await new Promise(r => setTimeout(r, 200))

    const quote = await fetchYahooFinanceQuote(stock.symbol)
    if (quote) {
      stockQuotes.push({
        symbol: stock.symbol,
        name: stock.name,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        volume: quote.volume,
        marketCap: quote.marketCap
      })
      console.log(`   ${stock.name}: ${quote.price} (${quote.changePercent >= 0 ? '+' : ''}${quote.changePercent}%)`)
    } else {
      console.log(`   ${stock.name}: FAILED`)
    }
  }

  // 3. Sort for top gainers and losers
  console.log('\n3. Calculating top gainers/losers...')

  const sortedByChange = [...stockQuotes].sort((a, b) => b.changePercent - a.changePercent)
  const topGainers = sortedByChange.filter(s => s.changePercent > 0).slice(0, 5)
  const topLosers = sortedByChange.filter(s => s.changePercent < 0).slice(-5).reverse()

  console.log('   Top Gainers:')
  topGainers.forEach((s, i) => console.log(`     ${i + 1}. ${s.name}: +${s.changePercent}%`))

  console.log('   Top Losers:')
  topLosers.forEach((s, i) => console.log(`     ${i + 1}. ${s.name}: ${s.changePercent}%`))

  // 4. Sort by market cap for blue chips (use volume as fallback if marketCap not available)
  console.log('\n4. Identifying blue chips...')
  let sortedByMarketCap = [...stockQuotes]
    .filter(s => s.marketCap && s.marketCap > 0)
    .sort((a, b) => (b.marketCap || 0) - (a.marketCap || 0))
    .slice(0, 10)

  // If no marketCap data, use top stocks by volume
  if (sortedByMarketCap.length === 0) {
    console.log('   (No marketCap data, using top stocks by volume)')
    sortedByMarketCap = [...stockQuotes]
      .sort((a, b) => (b.volume || 0) - (a.volume || 0))
      .slice(0, 10)
  }

  console.log('   Top 10 Blue Chips:')
  sortedByMarketCap.forEach((s, i) => {
    const mcapBillions = s.marketCap ? `${(s.marketCap / 1e9).toFixed(1)}B` : `Vol: ${((s.volume || 0) / 1e6).toFixed(1)}M`
    console.log(`     ${i + 1}. ${s.name}: ${mcapBillions}`)
  })

  // 5. Update history
  const existing = loadExistingData()
  let history = existing?.history || []

  const today = new Date().toISOString().split('T')[0]
  const lastDate = history.length > 0 ? history[history.length - 1].date : ''

  if (lastDate !== today) {
    history.push({
      date: today,
      ftseMib: ftseMib.value,
      change: ftseMib.change
    })
  } else {
    history[history.length - 1] = {
      date: today,
      ftseMib: ftseMib.value,
      change: ftseMib.change
    }
  }

  // Keep last 30 days
  history = history.slice(-30)

  // 6. Build output
  const output: BorsaItalianaData = {
    lastUpdate: new Date().toISOString(),
    source: stockQuotes.length > 0 ? source : 'fallback',
    ftseMib,
    topGainers: topGainers.length > 0 ? topGainers : FALLBACK_DATA.topGainers,
    topLosers: topLosers.length > 0 ? topLosers : FALLBACK_DATA.topLosers,
    bluechips: sortedByMarketCap.length > 0 ? sortedByMarketCap : FALLBACK_DATA.bluechips,
    history
  }

  // 7. Save to file
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true })
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2))

  console.log('\n' + '='.repeat(50))
  console.log('Borsa Italiana data saved to', OUTPUT_PATH)
  console.log(`Source: ${output.source}`)
  console.log(`Stocks fetched: ${stockQuotes.length}/${FTSE_MIB_COMPONENTS.length}`)
  console.log(`FTSE MIB: ${ftseMib.value} (${ftseMib.changePercent >= 0 ? '+' : ''}${ftseMib.changePercent}%)`)
}

main().catch(console.error)
