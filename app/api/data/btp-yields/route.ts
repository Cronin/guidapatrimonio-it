import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export const revalidate = 3600 // Cache for 1 hour

const FALLBACK_DATA = {
  lastUpdate: new Date().toISOString(),
  source: 'fallback',
  btp: {
    '2Y': { yield: 2.85, change: -0.02 },
    '5Y': { yield: 3.15, change: -0.01 },
    '10Y': { yield: 3.52, change: -0.03 },
    '30Y': { yield: 4.10, change: 0.01 }
  },
  bund: {
    '10Y': { yield: 2.30, change: -0.01 }
  },
  spread: {
    value: 122,
    change: -2
  },
  history: []
}

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'data/scraped/btp-yields.json')
    
    if (existsSync(filePath)) {
      const data = JSON.parse(readFileSync(filePath, 'utf-8'))
      
      // Check staleness
      const lastUpdate = new Date(data.lastUpdate)
      const hoursSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60)
      
      return NextResponse.json({
        ...data,
        stale: hoursSinceUpdate > 24
      })
    }
    
    return NextResponse.json(FALLBACK_DATA)
  } catch (error) {
    console.error('Error reading BTP yields:', error)
    return NextResponse.json(FALLBACK_DATA)
  }
}
