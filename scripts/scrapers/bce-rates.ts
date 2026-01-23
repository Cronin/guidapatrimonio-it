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
]

const OUTPUT_PATH = join(process.cwd(), 'data/scraped/bce-rates.json')

async function fetchBCERates(): Promise<BCERates['rates'] | null> {
  try {
    const response = await fetch(
      'https://data-api.ecb.europa.eu/service/data/FM/M.U2.EUR.4F.KR.MRR_FR.LEV?format=jsondata&lastNObservations=1',
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      }
    )

    if (!response.ok) {
      console.log('ECB API returned:', response.status)
      return null
    }

    const data = await response.json()
    const observations = data?.dataSets?.[0]?.series?.['0:0:0:0:0:0:0']?.observations
    
    if (observations) {
      const latestKey = Object.keys(observations).pop()
      const mainRefinancing = observations[latestKey]?.[0]

      if (mainRefinancing) {
        return {
          depositFacility: parseFloat((mainRefinancing - 0.15).toFixed(2)),
          mainRefinancing: parseFloat(mainRefinancing.toFixed(2)),
          marginalLending: parseFloat((mainRefinancing + 0.25).toFixed(2))
        }
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching from ECB API:', error)
    return null
  }
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

  let rates = await fetchBCERates()
  let source = 'ecb-api'

  if (!rates) {
    console.log('API failed, using known rates...')
    rates = getLatestKnownRates()
    source = 'fallback'
  }

  const existing = loadExistingData()
  let history = existing?.history || KNOWN_RATES_HISTORY

  const lastEntry = history[history.length - 1]
  if (lastEntry.depositFacility !== rates.depositFacility) {
    history.push({
      date: new Date().toISOString().split('T')[0],
      ...rates
    })
  }

  history = history.slice(-20)

  const output: BCERates = {
    lastUpdate: new Date().toISOString(),
    source,
    rates,
    effectiveDate: history[history.length - 1].date,
    history
  }

  mkdirSync(dirname(OUTPUT_PATH), { recursive: true })
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2))
  console.log('BCE rates saved to', OUTPUT_PATH)
  console.log('Current rates:', rates)
}

main().catch(console.error)
