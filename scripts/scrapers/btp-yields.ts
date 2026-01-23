/**
 * BTP Yields Scraper
 * Fetches Italian government bond yields (BTP) from multiple sources
 * and calculates the BTP-Bund spread
 *
 * Usage: npx tsx scripts/scrapers/btp-yields.ts
 */

import * as fs from 'fs'
import * as path from 'path'

// Types
interface YieldData {
  yield: number
  change: number
}

interface BTPYieldsData {
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
    value: number  // in basis points
    change: number
  }
  history: Array<{
    date: string
    btp10Y: number
    spread: number
  }>
}

// Fallback data in case scraping fails
const fallbackData: BTPYieldsData = {
  lastUpdate: new Date().toISOString(),
  source: 'fallback',
  btp: {
    '2Y': { yield: 2.85, change: 0 },
    '5Y': { yield: 3.15, change: 0 },
    '10Y': { yield: 3.52, change: 0 },
    '30Y': { yield: 4.10, change: 0 }
  },
  bund: {
    '10Y': { yield: 2.30, change: 0 }
  },
  spread: {
    value: 122,
    change: 0
  },
  history: []
}

// User agent to avoid bot detection
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

// Yahoo Finance symbols for bonds
const YAHOO_SYMBOLS = {
  BTP_2Y: 'IT2Y=X',
  BTP_5Y: 'IT5Y=X',
  BTP_10Y: 'IT10Y=X',
  BTP_30Y: 'IT30Y=X',
  BUND_10Y: 'DE10Y=X'
}

// Helper function to add delay between requests
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchYahooFinanceYield(symbol: string, retries = 3): Promise<YieldData | null> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // Add delay before request to avoid rate limiting
      if (attempt > 0) {
        await delay(2000 * attempt)
      }

      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`

      const response = await fetch(url, {
        headers: {
          'User-Agent': userAgent,
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
        }
      })

      if (response.status === 429) {
        console.log(`Rate limited for ${symbol}, attempt ${attempt + 1}/${retries}`)
        await delay(5000 * (attempt + 1))
        continue
      }

      if (!response.ok) {
        console.error(`Yahoo Finance error for ${symbol}: ${response.status}`)
        return null
      }

      const data = await response.json()
      const result = data?.chart?.result?.[0]

      if (!result) {
        console.error(`No result for ${symbol}`)
        return null
      }

      const meta = result.meta
      const price = meta.regularMarketPrice
      const previousClose = meta.chartPreviousClose || meta.previousClose || price
      const change = price - previousClose

      return {
        yield: Math.round(price * 100) / 100,  // Round to 2 decimals
        change: Math.round(change * 100) / 100
      }
    } catch (error) {
      console.error(`Error fetching ${symbol} (attempt ${attempt + 1}):`, error)
      if (attempt < retries - 1) {
        await delay(3000)
      }
    }
  }
  return null
}

async function fetchFromWorldGovernmentBonds(): Promise<Partial<BTPYieldsData['btp']> | null> {
  try {
    // World Government Bonds provides yield data via a simple page
    // We'll parse the JSON data they embed
    const url = 'https://www.worldgovernmentbonds.com/country/italy/'

    const response = await fetch(url, {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml',
      }
    })

    if (!response.ok) {
      console.error(`World Government Bonds error: ${response.status}`)
      return null
    }

    const html = await response.text()

    // Parse yields from the HTML
    // Look for patterns like "2-Year Yield" followed by percentage
    const yields: Partial<BTPYieldsData['btp']> = {}

    // Match 2Y yield
    const match2Y = html.match(/2[- ]?[Yy]ear[^>]*>[\s\S]*?(\d+\.\d+)%/i)
    if (match2Y) {
      yields['2Y'] = { yield: parseFloat(match2Y[1]), change: 0 }
    }

    // Match 5Y yield
    const match5Y = html.match(/5[- ]?[Yy]ear[^>]*>[\s\S]*?(\d+\.\d+)%/i)
    if (match5Y) {
      yields['5Y'] = { yield: parseFloat(match5Y[1]), change: 0 }
    }

    // Match 10Y yield
    const match10Y = html.match(/10[- ]?[Yy]ear[^>]*>[\s\S]*?(\d+\.\d+)%/i)
    if (match10Y) {
      yields['10Y'] = { yield: parseFloat(match10Y[1]), change: 0 }
    }

    // Match 30Y yield
    const match30Y = html.match(/30[- ]?[Yy]ear[^>]*>[\s\S]*?(\d+\.\d+)%/i)
    if (match30Y) {
      yields['30Y'] = { yield: parseFloat(match30Y[1]), change: 0 }
    }

    return Object.keys(yields).length > 0 ? yields : null
  } catch (error) {
    console.error('Error fetching from World Government Bonds:', error)
    return null
  }
}

async function fetchFromInvesting(): Promise<BTPYieldsData['btp'] | null> {
  try {
    console.log('Trying Investing.com...')

    // Investing.com URLs for Italian government bonds
    const urls = {
      '10Y': 'https://www.investing.com/rates-bonds/italy-10-year-bond-yield'
    }

    const response = await fetch(urls['10Y'], {
      headers: {
        'User-Agent': userAgent,
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9,it;q=0.8',
      }
    })

    if (!response.ok) {
      console.error(`Investing.com error: ${response.status}`)
      return null
    }

    const html = await response.text()

    // Try to extract the 10Y yield from the page
    // Look for patterns like "3.52%" in the price area
    const yieldMatch = html.match(/data-test="instrument-price-last"[^>]*>([0-9]+\.[0-9]+)/i)
      || html.match(/<span[^>]*class="[^"]*last[^"]*"[^>]*>([0-9]+\.[0-9]+)/i)
      || html.match(/last-price[^>]*>([0-9]+\.[0-9]+)/i)

    if (yieldMatch) {
      const yield10Y = parseFloat(yieldMatch[1])
      console.log(`Found 10Y yield from Investing.com: ${yield10Y}%`)

      // Estimate other yields based on typical curve shape
      // These are approximations based on typical Italian yield curve
      return {
        '2Y': { yield: Math.round((yield10Y - 0.65) * 100) / 100, change: 0 },
        '5Y': { yield: Math.round((yield10Y - 0.35) * 100) / 100, change: 0 },
        '10Y': { yield: yield10Y, change: 0 },
        '30Y': { yield: Math.round((yield10Y + 0.55) * 100) / 100, change: 0 }
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching from Investing.com:', error)
    return null
  }
}

async function fetchAllYields(): Promise<BTPYieldsData> {
  console.log('Fetching BTP yields...')

  // Try Yahoo Finance first - fetch sequentially to avoid rate limiting
  console.log('Trying Yahoo Finance (sequential to avoid rate limiting)...')

  const btp10Y = await fetchYahooFinanceYield(YAHOO_SYMBOLS.BTP_10Y)
  await delay(1000)
  const bund10Y = await fetchYahooFinanceYield(YAHOO_SYMBOLS.BUND_10Y)
  await delay(1000)
  const btp2Y = await fetchYahooFinanceYield(YAHOO_SYMBOLS.BTP_2Y)
  await delay(1000)
  const btp5Y = await fetchYahooFinanceYield(YAHOO_SYMBOLS.BTP_5Y)
  await delay(1000)
  const btp30Y = await fetchYahooFinanceYield(YAHOO_SYMBOLS.BTP_30Y)

  // If Yahoo Finance fails, try alternative sources
  let btpYields: BTPYieldsData['btp']
  let source = 'yahoo-finance'

  if (!btp10Y) {
    console.log('Yahoo Finance failed, trying Investing.com...')
    const investingData = await fetchFromInvesting()

    if (investingData) {
      source = 'investing.com'
      btpYields = investingData
    } else {
      console.log('Investing.com failed, trying World Government Bonds...')
      const wgbData = await fetchFromWorldGovernmentBonds()

      if (wgbData) {
        source = 'worldgovernmentbonds.com'
        btpYields = {
          '2Y': wgbData['2Y'] || fallbackData.btp['2Y'],
          '5Y': wgbData['5Y'] || fallbackData.btp['5Y'],
          '10Y': wgbData['10Y'] || fallbackData.btp['10Y'],
          '30Y': wgbData['30Y'] || fallbackData.btp['30Y'],
        }
      } else {
        console.log('All sources failed, using fallback data')
        source = 'fallback'
        btpYields = fallbackData.btp
      }
    }
  } else {
    btpYields = {
      '2Y': btp2Y || fallbackData.btp['2Y'],
      '5Y': btp5Y || fallbackData.btp['5Y'],
      '10Y': btp10Y,
      '30Y': btp30Y || fallbackData.btp['30Y'],
    }
  }

  // Calculate spread (BTP 10Y - Bund 10Y) in basis points
  const btpYield10Y = btpYields['10Y'].yield
  const bundYield10Y = bund10Y?.yield ?? fallbackData.bund['10Y'].yield
  const spreadValue = Math.round((btpYield10Y - bundYield10Y) * 100)
  const spreadChange = Math.round(
    ((btpYields['10Y'].change || 0) - (bund10Y?.change || 0)) * 100
  )

  // Load existing history
  const dataPath = path.join(process.cwd(), 'data/scraped/btp-yields.json')
  let history: BTPYieldsData['history'] = []

  try {
    if (fs.existsSync(dataPath)) {
      const existingData = JSON.parse(fs.readFileSync(dataPath, 'utf-8')) as BTPYieldsData
      history = existingData.history || []
    }
  } catch {
    console.log('No existing history found')
  }

  // Add today's data to history (keep last 30 days)
  const today = new Date().toISOString().split('T')[0]
  const existingToday = history.find(h => h.date === today)

  if (!existingToday) {
    history.unshift({
      date: today,
      btp10Y: btpYield10Y,
      spread: spreadValue
    })
    // Keep only last 30 entries
    history = history.slice(0, 30)
  } else {
    // Update today's entry
    existingToday.btp10Y = btpYield10Y
    existingToday.spread = spreadValue
  }

  return {
    lastUpdate: new Date().toISOString(),
    source,
    btp: btpYields,
    bund: {
      '10Y': bund10Y || fallbackData.bund['10Y']
    },
    spread: {
      value: spreadValue,
      change: spreadChange
    },
    history
  }
}

async function main() {
  console.log('=== BTP Yields Scraper ===\n')

  try {
    const data = await fetchAllYields()

    // Ensure directory exists
    const dataDir = path.join(process.cwd(), 'data/scraped')
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    // Save to file
    const outputPath = path.join(dataDir, 'btp-yields.json')
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2))

    console.log('\n=== Results ===')
    console.log(`Source: ${data.source}`)
    console.log(`Last Update: ${data.lastUpdate}`)
    console.log('\nBTP Yields:')
    console.log(`  2Y:  ${data.btp['2Y'].yield}% (${data.btp['2Y'].change >= 0 ? '+' : ''}${data.btp['2Y'].change}%)`)
    console.log(`  5Y:  ${data.btp['5Y'].yield}% (${data.btp['5Y'].change >= 0 ? '+' : ''}${data.btp['5Y'].change}%)`)
    console.log(`  10Y: ${data.btp['10Y'].yield}% (${data.btp['10Y'].change >= 0 ? '+' : ''}${data.btp['10Y'].change}%)`)
    console.log(`  30Y: ${data.btp['30Y'].yield}% (${data.btp['30Y'].change >= 0 ? '+' : ''}${data.btp['30Y'].change}%)`)
    console.log('\nBund 10Y:')
    console.log(`  ${data.bund['10Y'].yield}% (${data.bund['10Y'].change >= 0 ? '+' : ''}${data.bund['10Y'].change}%)`)
    console.log('\nSpread BTP-Bund:')
    console.log(`  ${data.spread.value} bp (${data.spread.change >= 0 ? '+' : ''}${data.spread.change} bp)`)
    console.log(`\nSaved to: ${outputPath}`)

  } catch (error) {
    console.error('Fatal error:', error)
    process.exit(1)
  }
}

// Export for use as module
export { fetchAllYields, BTPYieldsData }

// Run if called directly
main()
