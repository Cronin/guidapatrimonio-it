import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export const revalidate = 86400 // Cache for 24 hours

interface Market {
  id: string
  name: string
  zone: string
  city: string
  region: string
  pricePerSqm: number
  priceRange: {
    min: number
    max: number
  }
  trend: number
  yoyChange: number
  topSales: string
  description: string
  coordinates: { lat: number; lng: number }
  highlights: string[]
}

interface LuxuryRealEstateData {
  lastUpdate: string
  source: string
  markets: Market[]
  nationalStats: {
    avgLuxuryPrice: number
    yoyGrowth: number
    transactionVolume: string
    foreignBuyerShare: number
    topNationalities: string[]
  }
  marketInsights: {
    title: string
    text: string
  }[]
}

const FALLBACK_DATA: LuxuryRealEstateData = {
  lastUpdate: new Date().toISOString().split('T')[0],
  source: 'fallback',
  markets: [
    {
      id: 'milano-centro',
      name: 'Milano Centro Storico',
      zone: 'Quadrilatero della Moda',
      city: 'Milano',
      region: 'Lombardia',
      pricePerSqm: 15000,
      priceRange: { min: 12000, max: 25000 },
      trend: 3.5,
      yoyChange: 5.2,
      topSales: 'Fino a 25.000 EUR/mq',
      description: 'Il cuore del lusso milanese.',
      coordinates: { lat: 45.4685, lng: 9.1924 },
      highlights: ['Fashion district', 'Buyer internazionali']
    },
    {
      id: 'portofino',
      name: 'Portofino',
      zone: 'Portofino / Santa Margherita',
      city: 'Portofino',
      region: 'Liguria',
      pricePerSqm: 18000,
      priceRange: { min: 12000, max: 30000 },
      trend: 1.5,
      yoyChange: 2.3,
      topSales: 'Fino a 30.000 EUR/mq',
      description: 'Il borgo piu esclusivo d\'Italia.',
      coordinates: { lat: 44.3035, lng: 9.2096 },
      highlights: ['Esclusivita massima', 'Yacht lifestyle']
    },
    {
      id: 'cortina',
      name: 'Cortina d\'Ampezzo',
      zone: 'Centro',
      city: 'Cortina d\'Ampezzo',
      region: 'Veneto',
      pricePerSqm: 14000,
      priceRange: { min: 10000, max: 20000 },
      trend: 5.0,
      yoyChange: 8.2,
      topSales: 'Fino a 20.000 EUR/mq',
      description: 'In forte crescita per le Olimpiadi 2026.',
      coordinates: { lat: 46.5404, lng: 12.1357 },
      highlights: ['Olimpiadi 2026', 'Sci di lusso']
    }
  ],
  nationalStats: {
    avgLuxuryPrice: 12000,
    yoyGrowth: 4.2,
    transactionVolume: '3.2 miliardi EUR',
    foreignBuyerShare: 35,
    topNationalities: ['USA', 'UK', 'Germania', 'Svizzera', 'Francia']
  },
  marketInsights: []
}

export async function GET() {
  try {
    const filePath = join(process.cwd(), 'data/luxury-real-estate.json')

    if (existsSync(filePath)) {
      const data: LuxuryRealEstateData = JSON.parse(readFileSync(filePath, 'utf-8'))

      // Check staleness (data older than 30 days)
      const lastUpdate = new Date(data.lastUpdate)
      const daysSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24)

      return NextResponse.json({
        ...data,
        stale: daysSinceUpdate > 30
      })
    }

    return NextResponse.json(FALLBACK_DATA)
  } catch (error) {
    console.error('Error reading luxury real estate data:', error)
    return NextResponse.json(FALLBACK_DATA)
  }
}
