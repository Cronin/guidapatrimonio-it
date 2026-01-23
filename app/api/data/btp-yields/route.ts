import { NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

// Cache duration: 1 hour
export const revalidate = 3600

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
    value: number
    change: number
  }
  history: Array<{
    date: string
    btp10Y: number
    spread: number
  }>
}

// Fallback data if file doesn't exist
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

export async function GET() {
  try {
    // Try to read from the scraped data file
    const dataPath = path.join(process.cwd(), 'data/scraped/btp-yields.json')

    if (fs.existsSync(dataPath)) {
      const fileContent = fs.readFileSync(dataPath, 'utf-8')
      const data: BTPYieldsData = JSON.parse(fileContent)

      // Check if data is stale (older than 24 hours)
      const lastUpdate = new Date(data.lastUpdate)
      const now = new Date()
      const hoursSinceUpdate = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60)
      const isStale = hoursSinceUpdate > 24

      return NextResponse.json({
        success: true,
        data,
        stale: isStale,
        hoursOld: Math.round(hoursSinceUpdate * 10) / 10,
        source: 'file',
        fetchedAt: now.toISOString()
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
        }
      })
    }

    // If file doesn't exist, try to fetch live data
    console.log('BTP yields file not found, fetching live data...')

    const liveData = await fetchLiveYields()

    if (liveData) {
      return NextResponse.json({
        success: true,
        data: liveData,
        stale: false,
        hoursOld: 0,
        source: 'live',
        fetchedAt: new Date().toISOString()
      }, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
        }
      })
    }

    // Return fallback data
    return NextResponse.json({
      success: true,
      data: fallbackData,
      stale: true,
      hoursOld: null,
      source: 'fallback',
      fetchedAt: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600'
      }
    })

  } catch (error) {
    console.error('Error reading BTP yields:', error)

    return NextResponse.json({
      success: true,
      data: fallbackData,
      stale: true,
      error: 'Using fallback data',
      source: 'fallback',
      fetchedAt: new Date().toISOString()
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=900'
      }
    })
  }
}

// Simple live fetch function (simplified version of the scraper)
async function fetchLiveYields(): Promise<BTPYieldsData | null> {
  const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'

  const symbols = {
    BTP_2Y: 'IT2Y=X',
    BTP_5Y: 'IT5Y=X',
    BTP_10Y: 'IT10Y=X',
    BTP_30Y: 'IT30Y=X',
    BUND_10Y: 'DE10Y=X'
  }

  async function fetchYield(symbol: string): Promise<YieldData | null> {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=2d`
      const response = await fetch(url, {
        headers: { 'User-Agent': userAgent }
      })

      if (!response.ok) return null

      const data = await response.json()
      const result = data?.chart?.result?.[0]

      if (!result) return null

      const meta = result.meta
      const price = meta.regularMarketPrice
      const previousClose = meta.chartPreviousClose || meta.previousClose || price
      const change = price - previousClose

      return {
        yield: Math.round(price * 100) / 100,
        change: Math.round(change * 100) / 100
      }
    } catch {
      return null
    }
  }

  try {
    const [btp2Y, btp5Y, btp10Y, btp30Y, bund10Y] = await Promise.all([
      fetchYield(symbols.BTP_2Y),
      fetchYield(symbols.BTP_5Y),
      fetchYield(symbols.BTP_10Y),
      fetchYield(symbols.BTP_30Y),
      fetchYield(symbols.BUND_10Y),
    ])

    // If main 10Y failed, return null to use fallback
    if (!btp10Y) return null

    const btpYield10Y = btp10Y.yield
    const bundYield10Y = bund10Y?.yield ?? fallbackData.bund['10Y'].yield
    const spreadValue = Math.round((btpYield10Y - bundYield10Y) * 100)
    const spreadChange = Math.round(
      ((btp10Y.change || 0) - (bund10Y?.change || 0)) * 100
    )

    return {
      lastUpdate: new Date().toISOString(),
      source: 'yahoo-finance-live',
      btp: {
        '2Y': btp2Y || fallbackData.btp['2Y'],
        '5Y': btp5Y || fallbackData.btp['5Y'],
        '10Y': btp10Y,
        '30Y': btp30Y || fallbackData.btp['30Y'],
      },
      bund: {
        '10Y': bund10Y || fallbackData.bund['10Y']
      },
      spread: {
        value: spreadValue,
        change: spreadChange
      },
      history: []
    }
  } catch {
    return null
  }
}
