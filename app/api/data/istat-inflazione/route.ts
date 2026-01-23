import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export const revalidate = 3600 // Cache for 1 hour

interface InflazioneData {
  lastUpdate: string
  source: string
  current: {
    yoy: number
    mom: number
    core: number
    month: string
  }
  history: Array<{
    month: string
    yoy: number
    mom: number
  }>
}

const FALLBACK_DATA: InflazioneData = {
  lastUpdate: new Date().toISOString(),
  source: 'fallback',
  current: {
    yoy: 1.3,
    mom: 0.1,
    core: 1.8,
    month: 'Dicembre 2025'
  },
  history: [
    { month: '2025-12', yoy: 1.3, mom: 0.1 },
    { month: '2025-11', yoy: 1.4, mom: 0.2 },
    { month: '2025-10', yoy: 1.0, mom: 0.3 },
    { month: '2025-09', yoy: 0.7, mom: 0.2 },
    { month: '2025-08', yoy: 1.1, mom: 0.4 },
    { month: '2025-07', yoy: 1.3, mom: 0.5 }
  ]
}

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'data/scraped/istat-inflazione.json')

    if (existsSync(filePath)) {
      const data: InflazioneData = JSON.parse(readFileSync(filePath, 'utf-8'))

      // Check staleness (> 48 hours old)
      const lastUpdate = new Date(data.lastUpdate)
      const hoursSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60)

      return NextResponse.json({
        success: true,
        ...data,
        stale: hoursSinceUpdate > 48
      })
    }

    return NextResponse.json({
      success: true,
      ...FALLBACK_DATA,
      stale: true
    })
  } catch (error) {
    console.error('Error reading ISTAT inflazione:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to read inflation data',
      ...FALLBACK_DATA
    })
  }
}
