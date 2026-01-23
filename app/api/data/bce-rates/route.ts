import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export const revalidate = 3600 // Cache for 1 hour

const FALLBACK_RATES = {
  lastUpdate: new Date().toISOString(),
  source: 'fallback',
  rates: {
    depositFacility: 3.00,
    mainRefinancing: 3.15,
    marginalLending: 3.40
  },
  effectiveDate: '2024-12-18',
  history: []
}

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'data/scraped/bce-rates.json')
    
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf-8'))
      
      // Check staleness (> 48 hours old)
      const lastUpdate = new Date(data.lastUpdate)
      const hoursSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60)
      
      return NextResponse.json({
        ...data,
        stale: hoursSinceUpdate > 48
      })
    }
    
    return NextResponse.json(FALLBACK_RATES)
  } catch (error) {
    console.error('Error reading BCE rates:', error)
    return NextResponse.json(FALLBACK_RATES)
  }
}
