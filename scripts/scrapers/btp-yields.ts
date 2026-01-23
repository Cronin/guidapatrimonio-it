/**
 * BTP Yields Scraper
 * Fetches Italian government bond yields and calculates spread
 *
 * Sources (in priority order):
 * 1. WorldGovernmentBonds.com - Most reliable
 * 2. Investing.com - Backup
 * 3. Fallback static data
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

// Updated January 23, 2026 based on real market data from TradingEconomics
const FALLBACK_DATA = {
  btp: {
    '2Y': { yield: 2.22, change: 0 },
    '5Y': { yield: 2.81, change: 0 },
    '10Y': { yield: 3.50, change: 0 },
    '30Y': { yield: 4.34, change: 0 }
  },
  bund: { '10Y': { yield: 2.89, change: 0 } }
}

// User agents to rotate
const USER_AGENTS = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'
]

function getRandomUserAgent(): string {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)]
}

/**
 * Fetch yields from WorldGovernmentBonds.com via their API
 * The site uses a POST API to fetch yield curve data
 */
async function fetchWorldGovernmentBonds(): Promise<{
  btp: Record<string, YieldData>
  bund: Record<string, YieldData>
} | null> {
  console.log('Trying WorldGovernmentBonds.com API...')

  try {
    // The site uses a WordPress REST API to fetch yield data
    // We need to POST to their endpoint with the country symbol
    const italyResponse = await fetch('https://www.worldgovernmentbonds.com/wp-json/country/v1/historical', {
      method: 'POST',
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': 'https://www.worldgovernmentbonds.com',
        'Referer': 'https://www.worldgovernmentbonds.com/country/italy/'
      },
      body: JSON.stringify({
        country: 'Italy',
        symbol: '1'
      })
    })

    const btp: Record<string, YieldData> = {}
    const bund: Record<string, YieldData> = {}

    if (italyResponse.ok) {
      const data = await italyResponse.json()
      console.log('WorldGovernmentBonds API response:', JSON.stringify(data).slice(0, 500))

      // Parse the API response to extract yield curve data
      if (data && typeof data === 'object') {
        // The API might return yield curve data in various formats
        // Try to extract the yields for our target maturities
        const yieldCurve = data.yieldCurve || data.yield_curve || data.data || data
        if (Array.isArray(yieldCurve)) {
          for (const item of yieldCurve) {
            const maturity = item.maturity || item.term || item.years
            const yieldVal = item.yield || item.rate || item.value

            if (maturity && yieldVal) {
              const years = maturity.toString().replace(/[^0-9]/g, '')
              if (['2', '5', '10', '30'].includes(years)) {
                btp[`${years}Y`] = { yield: parseFloat(yieldVal), change: 0 }
              }
            }
          }
        }
      }
    } else {
      console.log('WorldGovernmentBonds API failed:', italyResponse.status)
    }

    // If API didn't work, fallback to HTML scraping
    if (Object.keys(btp).length === 0) {
      console.log('API returned no data, trying HTML scrape...')

      const italyHtmlResponse = await fetch('https://www.worldgovernmentbonds.com/country/italy/', {
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9,it;q=0.8',
          'Cache-Control': 'no-cache'
        }
      })

      if (italyHtmlResponse.ok) {
        const italyHtml = await italyHtmlResponse.text()

        // Try to extract from the page HTML
        const yield2y = extractYieldFromHtml(italyHtml, '2')
        const yield5y = extractYieldFromHtml(italyHtml, '5')
        const yield10y = extractYieldFromHtml(italyHtml, '10')
        const yield30y = extractYieldFromHtml(italyHtml, '30')

        if (yield2y) btp['2Y'] = { yield: yield2y, change: 0 }
        if (yield5y) btp['5Y'] = { yield: yield5y, change: 0 }
        if (yield10y) btp['10Y'] = { yield: yield10y, change: 0 }
        if (yield30y) btp['30Y'] = { yield: yield30y, change: 0 }

        // Also try to get from bond list table
        if (Object.keys(btp).length < 4) {
          const tableYields = extractFromBondTable(italyHtml)
          Object.assign(btp, { ...tableYields, ...btp })
        }

        console.log('Italy yields extracted from HTML:', btp)
      }
    }

    if (Object.keys(btp).length === 0) {
      console.log('Could not extract Italian yields')
      return null
    }

    // Fetch Germany data
    await new Promise(r => setTimeout(r, 1000))

    const germanyResponse = await fetch('https://www.worldgovernmentbonds.com/country/germany/', {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9,de;q=0.8'
      }
    })

    if (germanyResponse.ok) {
      const germanyHtml = await germanyResponse.text()
      const bund10y = extractYieldFromHtml(germanyHtml, '10')

      if (bund10y) {
        bund['10Y'] = { yield: bund10y, change: 0 }
      } else {
        const tableYields = extractFromBondTable(germanyHtml)
        if (tableYields['10Y']) bund['10Y'] = tableYields['10Y']
      }
      console.log('Germany yields extracted:', bund)
    }

    if (Object.keys(btp).length > 0) {
      return { btp, bund }
    }

    return null
  } catch (error) {
    console.error('WorldGovernmentBonds error:', error)
    return null
  }
}

/**
 * Extract yield for specific maturity from HTML
 */
function extractYieldFromHtml(html: string, years: string): number | null {
  // Pattern 1: Look for yield curve data (e.g., "10Y" or "10 Year" followed by percentage)
  const patterns = [
    // Format: 10 Year ... X.XX%
    new RegExp(`${years}\\s*(?:Year|Y|anni)[^%]*?([0-9]+\\.[0-9]+)%`, 'i'),
    // Format: data-maturity="10" ... data-yield="X.XX"
    new RegExp(`data-maturity=["']${years}["'][^>]*data-yield=["']([0-9]+\\.[0-9]+)["']`, 'i'),
    // Format in table cell: >10Y</td>...<td>X.XX%</td>
    new RegExp(`>${years}Y<\\/td>(?:[^<]*<td[^>]*>){1,3}[^<]*?([0-9]+\\.[0-9]+)%?`, 'i'),
    // Format: "residualMaturity":"10Y","yield":X.XX
    new RegExp(`"residualMaturity"\\s*:\\s*"${years}Y"[^}]*"yield"\\s*:\\s*([0-9]+\\.[0-9]+)`, 'i'),
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match && match[1]) {
      return parseFloat(match[1])
    }
  }

  return null
}

/**
 * Extract yields from the bond list table
 */
function extractFromBondTable(html: string): Record<string, YieldData> {
  const yields: Record<string, YieldData> = {}

  // Look for rows in the bond table with maturity and yield
  // Pattern: <tr>...<td>X Years</td>...<td>Y.YY%</td>...</tr>
  const rowPattern = /<tr[^>]*>[\s\S]*?(\d+)\s*(?:Years?|Y|anni)[\s\S]*?<td[^>]*>\s*([0-9]+\.[0-9]+)\s*%?\s*<\/td>[\s\S]*?<\/tr>/gi

  let match
  while ((match = rowPattern.exec(html)) !== null) {
    const years = match[1]
    const yieldValue = parseFloat(match[2])

    if (['2', '5', '10', '30'].includes(years) && !isNaN(yieldValue)) {
      yields[`${years}Y`] = { yield: yieldValue, change: 0 }
    }
  }

  // Alternative: Look for yield curve chart data
  const chartDataMatch = html.match(/yieldCurveData\s*=\s*(\[[\s\S]*?\])/i)
  if (chartDataMatch) {
    try {
      const data = JSON.parse(chartDataMatch[1])
      for (const item of data) {
        if (item.maturity && item.yield) {
          const years = item.maturity.toString().replace(/Y.*/, '')
          if (['2', '5', '10', '30'].includes(years)) {
            yields[`${years}Y`] = { yield: parseFloat(item.yield), change: 0 }
          }
        }
      }
    } catch (e) {
      // Ignore JSON parse errors
    }
  }

  return yields
}

/**
 * Fetch from Investing.com as backup
 */
async function fetchInvestingCom(): Promise<{
  btp: Record<string, YieldData>
  bund: Record<string, YieldData>
} | null> {
  console.log('Trying Investing.com...')

  const urls = {
    btp2y: 'https://www.investing.com/rates-bonds/italy-2-year-bond-yield',
    btp5y: 'https://www.investing.com/rates-bonds/italy-5-year-bond-yield',
    btp10y: 'https://www.investing.com/rates-bonds/italy-10-year-bond-yield',
    btp30y: 'https://www.investing.com/rates-bonds/italy-30-year-bond-yield',
    bund10y: 'https://www.investing.com/rates-bonds/germany-10-year-bond-yield'
  }

  const btp: Record<string, YieldData> = {}
  const bund: Record<string, YieldData> = {}

  try {
    for (const [key, url] of Object.entries(urls)) {
      await new Promise(r => setTimeout(r, 500)) // Delay between requests

      const response = await fetch(url, {
        headers: {
          'User-Agent': getRandomUserAgent(),
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache'
        }
      })

      if (!response.ok) {
        console.log(`Investing.com ${key} failed:`, response.status)
        continue
      }

      const html = await response.text()

      // Look for the current yield value
      // Pattern: data-test="instrument-price-last">X.XXX</span>
      const priceMatch = html.match(/data-test="instrument-price-last"[^>]*>([0-9]+\.[0-9]+)</i)
      const changeMatch = html.match(/data-test="instrument-price-change"[^>]*>([+-]?[0-9]+\.[0-9]+)</i)

      if (priceMatch) {
        const yieldValue = parseFloat(priceMatch[1])
        const change = changeMatch ? parseFloat(changeMatch[1]) : 0

        if (key.startsWith('btp')) {
          const maturity = key.replace('btp', '').toUpperCase()
          btp[maturity] = { yield: yieldValue, change }
        } else if (key === 'bund10y') {
          bund['10Y'] = { yield: yieldValue, change }
        }
      }
    }

    console.log('Investing.com yields:', { btp, bund })

    if (Object.keys(btp).length > 0) {
      return { btp, bund }
    }

    return null
  } catch (error) {
    console.error('Investing.com error:', error)
    return null
  }
}

/**
 * Try to fetch from Borsa Italiana
 */
async function fetchBorsaItaliana(): Promise<{
  btp: Record<string, YieldData>
  bund: Record<string, YieldData>
} | null> {
  console.log('Trying Borsa Italiana...')

  try {
    // Borsa Italiana has a JSON API for bond data
    const response = await fetch('https://www.borsaitaliana.it/borsa/obbligazioni/mot/btp/lista.html', {
      headers: {
        'User-Agent': getRandomUserAgent(),
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'it-IT,it;q=0.9,en;q=0.8'
      }
    })

    if (!response.ok) {
      console.log('Borsa Italiana failed:', response.status)
      return null
    }

    const html = await response.text()

    // Extract BTP yields from the table
    // The table contains BTP data with yield column
    const btp: Record<string, YieldData> = {}

    // Look for benchmark BTPs (2Y, 5Y, 10Y, 30Y approximations)
    // This is more complex as Borsa Italiana shows individual bonds, not benchmarks

    return null // Borsa Italiana requires more complex parsing
  } catch (error) {
    console.error('Borsa Italiana error:', error)
    return null
  }
}

/**
 * Fetch from ECB Statistical Data Warehouse
 * This is the official source but may have slight delay
 */
async function fetchECB(): Promise<{
  btp: Record<string, YieldData>
  bund: Record<string, YieldData>
} | null> {
  console.log('Trying ECB Statistical Data Warehouse...')

  try {
    // ECB SDMX API - using the correct endpoint format
    // Format: https://data-api.ecb.europa.eu/service/data/{flowRef}/{key}
    const ecbBaseUrl = 'https://data-api.ecb.europa.eu/service/data'

    const btp: Record<string, YieldData> = {}
    const bund: Record<string, YieldData> = {}

    // Try Italy government bond yields
    // YC = Yield Curve data
    const italyMaturities = [
      { key: 'SR_2Y', maturity: '2Y' },
      { key: 'SR_5Y', maturity: '5Y' },
      { key: 'SR_10Y', maturity: '10Y' },
      { key: 'SR_30Y', maturity: '30Y' }
    ]

    for (const { key, maturity } of italyMaturities) {
      try {
        const url = `${ecbBaseUrl}/YC/B.IT.EUR.4F.G_N_A.SV_C_YM.${key}?format=jsondata&lastNObservations=1`

        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
            'User-Agent': getRandomUserAgent()
          }
        })

        if (response.ok) {
          const data = await response.json()
          const value = extractECBValue(data)
          if (value !== null) {
            btp[maturity] = { yield: value, change: 0 }
            console.log(`ECB Italy ${maturity}:`, value)
          }
        }

        await new Promise(r => setTimeout(r, 300))
      } catch (e) {
        // Continue to next maturity
      }
    }

    // Germany 10Y
    try {
      const de10yUrl = `${ecbBaseUrl}/YC/B.DE.EUR.4F.G_N_A.SV_C_YM.SR_10Y?format=jsondata&lastNObservations=1`

      const de10yResponse = await fetch(de10yUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': getRandomUserAgent()
        }
      })

      if (de10yResponse.ok) {
        const de10yData = await de10yResponse.json()
        const value = extractECBValue(de10yData)
        if (value !== null) {
          bund['10Y'] = { yield: value, change: 0 }
          console.log('ECB Germany 10Y:', value)
        }
      }
    } catch (e) {
      // Ignore Germany fetch error
    }

    console.log('ECB yields:', { btp, bund })

    if (Object.keys(btp).length > 0 || Object.keys(bund).length > 0) {
      return { btp, bund }
    }

    return null
  } catch (error) {
    console.error('ECB error:', error)
    return null
  }
}

/**
 * Extract value from ECB SDMX JSON response
 */
function extractECBValue(data: unknown): number | null {
  try {
    const d = data as { dataSets?: Array<{ series?: Record<string, { observations?: Record<string, unknown[]> }> }> }
    if (d?.dataSets?.[0]?.series) {
      const series = d.dataSets[0].series
      const firstKey = Object.keys(series)[0]
      if (firstKey && series[firstKey]?.observations) {
        const obs = series[firstKey].observations
        const lastKey = Object.keys(obs).pop()
        if (lastKey) {
          const value = obs[lastKey][0]
          if (typeof value === 'number') {
            return parseFloat(value.toFixed(3))
          }
        }
      }
    }
  } catch {
    // Ignore parsing errors
  }
  return null
}

/**
 * Fetch from TradingEconomics calendar/indicators page
 * This is a backup source with publicly accessible data
 */
async function fetchTradingEconomics(): Promise<{
  btp: Record<string, YieldData>
  bund: Record<string, YieldData>
} | null> {
  console.log('Trying TradingEconomics...')

  const btp: Record<string, YieldData> = {}
  const bund: Record<string, YieldData> = {}

  try {
    // TradingEconomics has a public API for indicators
    // Try their bond yield indicators
    const indicators = [
      { url: 'https://tradingeconomics.com/italy/government-bond-yield', key: '10Y', country: 'italy' },
      { url: 'https://tradingeconomics.com/italy/2-year-note-yield', key: '2Y', country: 'italy' },
      { url: 'https://tradingeconomics.com/italy/5-year-note-yield', key: '5Y', country: 'italy' },
      { url: 'https://tradingeconomics.com/italy/30-year-bond-yield', key: '30Y', country: 'italy' },
      { url: 'https://tradingeconomics.com/germany/government-bond-yield', key: '10Y', country: 'germany' }
    ]

    for (const { url, key, country } of indicators) {
      try {
        const response = await fetch(url, {
          headers: {
            'User-Agent': getRandomUserAgent(),
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9'
          }
        })

        if (!response.ok) continue

        const html = await response.text()

        // TradingEconomics shows yield in a span with id="p" or similar patterns
        const yieldPatterns = [
          /<span[^>]*id="p"[^>]*>([0-9]+\.[0-9]+)/i,
          /data-value="([0-9]+\.[0-9]+)"/i,
          /"last"\s*:\s*"?([0-9]+\.[0-9]+)"?/i,
          />([0-9]+\.[0-9]{2,3})<\/span>\s*<span[^>]*class="[^"]*percent/i
        ]

        for (const pattern of yieldPatterns) {
          const match = html.match(pattern)
          if (match && match[1]) {
            const yieldVal = parseFloat(match[1])
            if (yieldVal > 0 && yieldVal < 20) {
              if (country === 'italy') {
                btp[key] = { yield: yieldVal, change: 0 }
              } else {
                bund[key] = { yield: yieldVal, change: 0 }
              }
              console.log(`TradingEconomics ${country} ${key}:`, yieldVal)
              break
            }
          }
        }

        await new Promise(r => setTimeout(r, 500))
      } catch (e) {
        // Continue to next indicator
      }
    }

    console.log('TradingEconomics yields:', { btp, bund })

    if (Object.keys(btp).length > 0 || Object.keys(bund).length > 0) {
      return { btp, bund }
    }

    return null
  } catch (error) {
    console.error('TradingEconomics error:', error)
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

/**
 * Merge partial yield data with fallback
 */
function mergeWithFallback(
  data: { btp: Record<string, YieldData>; bund: Record<string, YieldData> } | null
): { btp: typeof FALLBACK_DATA.btp; bund: typeof FALLBACK_DATA.bund } {
  const btp = { ...FALLBACK_DATA.btp }
  const bund = { ...FALLBACK_DATA.bund }

  if (data) {
    if (data.btp['2Y']) btp['2Y'] = data.btp['2Y']
    if (data.btp['5Y']) btp['5Y'] = data.btp['5Y']
    if (data.btp['10Y']) btp['10Y'] = data.btp['10Y']
    if (data.btp['30Y']) btp['30Y'] = data.btp['30Y']
    if (data.bund['10Y']) bund['10Y'] = data.bund['10Y']
  }

  return { btp, bund }
}

async function main() {
  console.log('Starting BTP yields scraper...')
  console.log('=' .repeat(50))

  let source = 'fallback'
  let fetchedData: { btp: Record<string, YieldData>; bund: Record<string, YieldData> } | null = null

  // Try sources in order of reliability

  // 1. WorldGovernmentBonds.com (most reliable)
  fetchedData = await fetchWorldGovernmentBonds()
  if (fetchedData && Object.keys(fetchedData.btp).length >= 2) {
    source = 'worldgovernmentbonds.com'
    console.log('SUCCESS: Got data from WorldGovernmentBonds.com')
  }

  // 2. If WorldGovernmentBonds failed or incomplete, try ECB
  if (!fetchedData || Object.keys(fetchedData.btp).length < 2) {
    console.log('\n' + '-'.repeat(50))
    const ecbData = await fetchECB()
    if (ecbData && Object.keys(ecbData.btp).length > 0) {
      if (!fetchedData) {
        fetchedData = ecbData
      } else {
        // Merge ECB data with existing data
        if (ecbData.btp['10Y'] && !fetchedData.btp['10Y']) {
          fetchedData.btp['10Y'] = ecbData.btp['10Y']
        }
        if (ecbData.bund['10Y'] && !fetchedData.bund['10Y']) {
          fetchedData.bund['10Y'] = ecbData.bund['10Y']
        }
      }
      source = fetchedData === ecbData ? 'ecb' : `${source}+ecb`
      console.log('SUCCESS: Got additional data from ECB')
    }
  }

  // 3. If still missing data, try TradingEconomics
  if (!fetchedData || Object.keys(fetchedData.btp).length < 2) {
    console.log('\n' + '-'.repeat(50))
    const tradingEconData = await fetchTradingEconomics()
    if (tradingEconData && Object.keys(tradingEconData.btp).length > 0) {
      if (!fetchedData) {
        fetchedData = tradingEconData
      } else {
        // Merge TradingEconomics data
        for (const key of ['2Y', '5Y', '10Y', '30Y'] as const) {
          if (tradingEconData.btp[key] && !fetchedData.btp[key]) {
            fetchedData.btp[key] = tradingEconData.btp[key]
          }
        }
        if (tradingEconData.bund['10Y'] && !fetchedData.bund['10Y']) {
          fetchedData.bund['10Y'] = tradingEconData.bund['10Y']
        }
      }
      source = source === 'fallback' ? 'tradingeconomics' : `${source}+tradingeconomics`
      console.log('SUCCESS: Got additional data from TradingEconomics')
    }
  }

  // 4. If still missing data, try Investing.com as last resort
  if (!fetchedData || Object.keys(fetchedData.btp).length < 2) {
    console.log('\n' + '-'.repeat(50))
    const investingData = await fetchInvestingCom()
    if (investingData && Object.keys(investingData.btp).length > 0) {
      if (!fetchedData) {
        fetchedData = investingData
      } else {
        // Merge Investing.com data
        for (const key of ['2Y', '5Y', '10Y', '30Y'] as const) {
          if (investingData.btp[key] && !fetchedData.btp[key]) {
            fetchedData.btp[key] = investingData.btp[key]
          }
        }
        if (investingData.bund['10Y'] && !fetchedData.bund['10Y']) {
          fetchedData.bund['10Y'] = investingData.bund['10Y']
        }
      }
      source = source === 'fallback' ? 'investing.com' : `${source}+investing.com`
      console.log('SUCCESS: Got additional data from Investing.com')
    }
  }

  // 5. If no data at all, use fallback
  if (!fetchedData || Object.keys(fetchedData.btp).length === 0) {
    console.log('\n' + '!'.repeat(50))
    console.log('WARNING: All sources failed, using fallback data')
    source = 'fallback'
  }

  // Merge with fallback for any missing values
  const { btp: btpData, bund: bundData } = mergeWithFallback(fetchedData)

  console.log('\n' + '='.repeat(50))
  console.log('Final data:')
  console.log('Source:', source)
  console.log('BTP 2Y:', btpData['2Y'].yield, '%')
  console.log('BTP 5Y:', btpData['5Y'].yield, '%')
  console.log('BTP 10Y:', btpData['10Y'].yield, '%')
  console.log('BTP 30Y:', btpData['30Y'].yield, '%')
  console.log('Bund 10Y:', bundData['10Y'].yield, '%')

  const spreadValue = Math.round((btpData['10Y'].yield - bundData['10Y'].yield) * 100)
  const spreadChange = Math.round((btpData['10Y'].change - bundData['10Y'].change) * 100)

  console.log('Spread BTP-Bund:', spreadValue, 'bp')

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
  console.log('\n' + '='.repeat(50))
  console.log('BTP yields saved to', OUTPUT_PATH)
}

main().catch(console.error)
