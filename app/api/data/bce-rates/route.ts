import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Cache: revalidate every hour
export const revalidate = 3600

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

// Fallback data in case file doesn't exist
const fallbackData: BceRatesData = {
  lastUpdate: new Date().toISOString(),
  source: 'ecb.europa.eu (fallback)',
  rates: {
    depositFacility: 2.00,
    mainRefinancing: 2.15,
    marginalLending: 2.40
  },
  history: [
    {
      date: '2025-06-11',
      depositFacility: 2.00,
      mainRefinancing: 2.15,
      marginalLending: 2.40
    },
    {
      date: '2025-04-17',
      depositFacility: 2.25,
      mainRefinancing: 2.40,
      marginalLending: 2.65
    },
    {
      date: '2024-12-12',
      depositFacility: 3.00,
      mainRefinancing: 3.15,
      marginalLending: 3.40
    }
  ]
}

export async function GET() {
  try {
    // Path to scraped data file
    const dataPath = join(process.cwd(), 'data/scraped/bce-rates.json')

    if (!existsSync(dataPath)) {
      console.warn('BCE rates file not found, using fallback data')
      return NextResponse.json({
        success: true,
        data: fallbackData,
        isFallback: true
      })
    }

    const fileContent = readFileSync(dataPath, 'utf-8')
    const data: BceRatesData = JSON.parse(fileContent)

    // Check if data is stale (older than 48 hours)
    const lastUpdate = new Date(data.lastUpdate)
    const now = new Date()
    const hoursOld = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60)

    return NextResponse.json({
      success: true,
      data,
      isFallback: false,
      isStale: hoursOld > 48,
      hoursOld: Math.round(hoursOld)
    })

  } catch (error) {
    console.error('Error reading BCE rates:', error)

    return NextResponse.json({
      success: true,
      data: fallbackData,
      isFallback: true,
      error: 'Failed to read scraped data'
    })
  }
}
