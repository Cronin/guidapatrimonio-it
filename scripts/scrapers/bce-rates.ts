/**
 * BCE Interest Rates Scraper
 * Fetches official ECB interest rates and saves to JSON
 *
 * Run: npx tsx scripts/scrapers/bce-rates.ts
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

interface BCERates {
  lastUpdate: string
  source: string
  rates: {
    depositFacility: number
    mainRefinancing: number
    marginalLending: number
  }
  effectiveDate: string
  history: Array<{
    date: string
    depositFacility: number
    mainRefinancing: number
    marginalLending: number
  }>
}

// Known BCE rates history (fallback)
const KNOWN_RATES_HISTORY = [
  { date: '2024-06-12', depositFacility: 3.75, mainRefinancing: 4.25, marginalLending: 4.50 },
  { date: '2024-09-18', depositFacility: 3.50, mainRefinancing: 3.65, marginalLending: 3.90 },
  { date: '2024-10-23', depositFacility: 3.25, mainRefinancing: 3.40, marginalLending: 3.65 },
  { date: '2024-12-18', depositFacility: 3.00, mainRefinancing: 3.15, marginalLending: 3.40 },
  { date: '2025-01-30', depositFacility: 2.75, mainRefinancing: 2.90, marginalLending: 3.15 },
  { date: '2025-03-13', depositFacility: 2.50, mainRefinancing: 2.65, marginalLending: 2.90 },
  { date: '2025-04-17', depositFacility: 2.25, mainRefinancing: 2.40, marginalLending: 2.65 },
  { date: '2025-06-11', depositFacility: 2.00, mainRefinancing: 2.15, marginalLending: 2.40 },
]

const OUTPUT_PATH = join(process.cwd(), 'data/scraped/bce-rates.json')

// Map month abbreviations to numbers
const MONTH_MAP: Record<string, string> = {
  'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
  'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
  'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
}

function parseECBDate(dateStr: string): string {
  // Parse dates like "11 Jun." or "18 Dec."
  const match = dateStr.match(/(\d{1,2})\s+(\w{3})\.?/)
  if (!match) return ''

  const day = match[1].padStart(2, '0')
  const month = MONTH_MAP[match[2]]
  if (!month) return ''

  // Determine year based on current date
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  const parsedMonth = parseInt(month)

  // If the parsed month is significantly in the future, it's likely from last year
  // Otherwise use current year
  const year = (parsedMonth > currentMonth + 6) ? currentYear - 1 : currentYear

  return `${year}-${month}-${day}`
}

function parseECBDateWithYear(dateStr: string, year: number): string {
  // Parse dates like "11 Jun." or "18 Dec." with explicit year
  const match = dateStr.match(/(\d{1,2})\s+(\w{3,4})\.?/)
  if (!match) return ''

  const day = match[1].padStart(2, '0')
  // Handle both "Jun" and "Jun." formats, also handle 4-letter months like "Sept"
  const monthAbbr = match[2].substring(0, 3)
  const month = MONTH_MAP[monthAbbr]
  if (!month) return ''

  return `${year}-${month}-${day}`
}

async function fetchFromECBHtml(): Promise<{ rates: BCERates['rates'], effectiveDate: string } | null> {
  try {
    console.log('Fetching from ECB HTML page...')
    const response = await fetch(
      'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/key_ecb_interest_rates/html/index.en.html',
      {
        headers: {
          'Accept': 'text/html,application/xhtml+xml',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }
    )

    if (!response.ok) {
      console.log('ECB HTML page returned:', response.status)
      return null
    }

    const html = await response.text()

    // The table structure is:
    // <tr>
    //   <td class="number"><strong>2025</strong></td>  -- year
    //   <td class="number">11 Jun.</td>                -- date
    //   <td class="number">2.00</td>                   -- deposit facility
    //   <td class="number">2.15</td>                   -- main refinancing
    //   <td class="number">-</td>                      -- fixed rate tender
    //   <td class="number">2.40</td>                   -- marginal lending
    // </tr>

    // Find tbody section
    const tbodyMatch = html.match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i)
    if (!tbodyMatch) {
      console.log('Could not find tbody in HTML')
      return null
    }
    const tbody = tbodyMatch[1]

    // Pattern to match rows with year, date, and rates
    // Year can be in <strong> tags or just a number, or &nbsp; for continuation rows
    const rowPattern = /<tr[^>]*>\s*<td[^>]*>(?:<strong>)?(\d{4}|&nbsp;|\s*)(?:<\/strong>)?<\/td>\s*<td[^>]*>(\d{1,2}\s+\w{3,4}\.?)<\/td>\s*<td[^>]*>([−\d.]+)<\/td>\s*<td[^>]*>([−\d.]+)<\/td>\s*<td[^>]*>[-−\d.]*<\/td>\s*<td[^>]*>([−\d.]+)<\/td>/gi

    let match
    let latestYear = 0
    let latestDate = ''
    let latestRates: BCERates['rates'] | null = null

    while ((match = rowPattern.exec(tbody)) !== null) {
      const yearStr = match[1].trim()
      const dateStr = match[2]
      // Handle minus sign (−) vs hyphen (-)
      const depositFacility = parseFloat(match[3].replace('−', '-'))
      const mainRefinancing = parseFloat(match[4].replace('−', '-'))
      const marginalLending = parseFloat(match[5].replace('−', '-'))

      // Get year - either from current row or use latest seen year
      let year = latestYear
      if (yearStr && yearStr !== '&nbsp;' && /^\d{4}$/.test(yearStr)) {
        year = parseInt(yearStr)
        latestYear = year
      }

      // Skip if we don't have a year yet
      if (!year) continue

      // Validate the numbers are reasonable interest rates (-1 to 20%)
      if (depositFacility >= -1 && depositFacility <= 20 &&
          mainRefinancing >= -1 && mainRefinancing <= 20 &&
          marginalLending >= -1 && marginalLending <= 20) {

        const parsedDate = parseECBDateWithYear(dateStr, year)
        if (parsedDate && (!latestDate || parsedDate > latestDate)) {
          latestDate = parsedDate
          latestRates = { depositFacility, mainRefinancing, marginalLending }
        }
      }
    }

    if (latestRates && latestDate) {
      console.log(`Found rates from ${latestDate}:`, latestRates)
      return { rates: latestRates, effectiveDate: latestDate }
    }

    console.log('Could not parse rates from ECB HTML')
    return null
  } catch (error) {
    console.error('Error fetching from ECB HTML:', error)
    return null
  }
}

async function fetchFromTradingEconomics(): Promise<BCERates['rates'] | null> {
  try {
    console.log('Trying Trading Economics...')
    const response = await fetch(
      'https://tradingeconomics.com/euro-area/interest-rate',
      {
        headers: {
          'Accept': 'text/html,application/xhtml+xml',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }
    )

    if (!response.ok) {
      console.log('Trading Economics returned:', response.status)
      return null
    }

    const html = await response.text()

    // Look for the main interest rate value
    // Trading Economics shows the main refinancing rate prominently
    const rateMatch = html.match(/id="ticker"[^>]*>[\s\S]*?(\d+\.?\d*)\s*%?/i)

    if (rateMatch) {
      const mainRate = parseFloat(rateMatch[1])
      if (mainRate >= 0 && mainRate <= 20) {
        // Calculate other rates based on typical ECB spreads
        const rates = {
          depositFacility: parseFloat((mainRate - 0.15).toFixed(2)),
          mainRefinancing: mainRate,
          marginalLending: parseFloat((mainRate + 0.25).toFixed(2))
        }
        console.log('Found rates from Trading Economics:', rates)
        return rates
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching from Trading Economics:', error)
    return null
  }
}

async function fetchBCERates(): Promise<{ rates: BCERates['rates'], effectiveDate?: string, source: string } | null> {
  // Try ECB HTML page first (most reliable)
  const ecbResult = await fetchFromECBHtml()
  if (ecbResult) {
    return { ...ecbResult, source: 'ecb-html' }
  }

  // Try Trading Economics as backup
  const teRates = await fetchFromTradingEconomics()
  if (teRates) {
    return { rates: teRates, source: 'trading-economics' }
  }

  return null
}

function getLatestKnownRates(): BCERates['rates'] {
  const latest = KNOWN_RATES_HISTORY[KNOWN_RATES_HISTORY.length - 1]
  return {
    depositFacility: latest.depositFacility,
    mainRefinancing: latest.mainRefinancing,
    marginalLending: latest.marginalLending
  }
}

function loadExistingData(): BCERates | null {
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
  console.log('Starting BCE rates scraper...')

  const result = await fetchBCERates()
  let rates: BCERates['rates']
  let source: string
  let effectiveDate: string

  if (result) {
    rates = result.rates
    source = result.source
    effectiveDate = result.effectiveDate || new Date().toISOString().split('T')[0]
    console.log(`Successfully fetched rates from ${source}`)
  } else {
    console.log('All sources failed, using fallback known rates...')
    rates = getLatestKnownRates()
    source = 'fallback'
    effectiveDate = KNOWN_RATES_HISTORY[KNOWN_RATES_HISTORY.length - 1].date
  }

  const existing = loadExistingData()
  let history = existing?.history || KNOWN_RATES_HISTORY

  const lastEntry = history[history.length - 1]
  if (lastEntry.depositFacility !== rates.depositFacility) {
    history.push({
      date: effectiveDate,
      ...rates
    })
  }

  history = history.slice(-20)

  const output: BCERates = {
    lastUpdate: new Date().toISOString(),
    source,
    rates,
    effectiveDate,
    history
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true })
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2))
  console.log('BCE rates saved to', OUTPUT_PATH)
  console.log('Source:', source)
  console.log('Effective date:', effectiveDate)
  console.log('Current rates:', rates)
}

main().catch(console.error)
