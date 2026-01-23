import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

export const revalidate = 3600 // Cache for 1 hour

interface Auction {
  id: string
  title: string
  location: string
  region: string
  province: string
  basePrice: number
  marketValue: number
  discount: number
  auctionDate: string
  tribunal: string
  type: 'villa' | 'attico' | 'appartamento' | 'commerciale' | 'terreno' | 'altro'
  sqm: number | null
  rooms: number | null
  description: string
  url: string
  imageUrl: string | null
  source: 'astegiudiziarie' | 'pvp'
  scrapedAt: string
}

interface AuctionData {
  lastUpdate: string
  source: string
  totalCount: number
  auctions: Auction[]
  stats: {
    avgDiscount: number
    avgPricePerSqm: number
    byRegion: Record<string, number>
    byType: Record<string, number>
    byPriceRange: Record<string, number>
  }
}

// Fallback data for when JSON file doesn't exist
const FALLBACK_DATA: AuctionData = {
  lastUpdate: new Date().toISOString(),
  source: 'fallback',
  totalCount: 20,
  auctions: [
    {
      id: 'AG-2024-MI-001',
      title: 'Villa con parco privato - Zona Brianza',
      location: 'Monza (MB)',
      region: 'lombardia',
      province: 'MB',
      basePrice: 1250000,
      marketValue: 1850000,
      discount: 32,
      auctionDate: '2026-02-15',
      tribunal: 'Milano',
      type: 'villa',
      sqm: 520,
      rooms: 8,
      description: 'Prestigiosa villa di inizio novecento con parco di 2500 mq, piscina e dependance.',
      url: 'https://www.astegiudiziarie.it/scheda/123456',
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      source: 'astegiudiziarie',
      scrapedAt: new Date().toISOString()
    },
    {
      id: 'AG-2024-CO-002',
      title: 'Villa Liberty sul Lago di Como',
      location: 'Cernobbio (CO)',
      region: 'lombardia',
      province: 'CO',
      basePrice: 2850000,
      marketValue: 4200000,
      discount: 32,
      auctionDate: '2026-02-28',
      tribunal: 'Como',
      type: 'villa',
      sqm: 680,
      rooms: 10,
      description: 'Storica villa Liberty con accesso diretto al lago e darsena privata.',
      url: 'https://www.astegiudiziarie.it/scheda/123457',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      source: 'astegiudiziarie',
      scrapedAt: new Date().toISOString()
    },
    {
      id: 'AG-2024-FI-003',
      title: 'Casale ristrutturato nel Chianti',
      location: 'Greve in Chianti (FI)',
      region: 'toscana',
      province: 'FI',
      basePrice: 980000,
      marketValue: 1400000,
      discount: 30,
      auctionDate: '2026-03-10',
      tribunal: 'Firenze',
      type: 'villa',
      sqm: 450,
      rooms: 7,
      description: 'Antico casale toscano con piscina infinity e uliveto.',
      url: 'https://www.astegiudiziarie.it/scheda/123458',
      imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
      source: 'astegiudiziarie',
      scrapedAt: new Date().toISOString()
    },
    {
      id: 'AG-2024-RM-004',
      title: 'Attico Parioli con terrazza panoramica',
      location: 'Roma (RM)',
      region: 'lazio',
      province: 'RM',
      basePrice: 1650000,
      marketValue: 2300000,
      discount: 28,
      auctionDate: '2026-02-20',
      tribunal: 'Roma',
      type: 'attico',
      sqm: 280,
      rooms: 5,
      description: 'Esclusivo attico nel cuore dei Parioli con terrazza di 150 mq.',
      url: 'https://www.astegiudiziarie.it/scheda/123459',
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      source: 'astegiudiziarie',
      scrapedAt: new Date().toISOString()
    },
    {
      id: 'AG-2024-VE-005',
      title: 'Palazzo storico sul Canal Grande',
      location: 'Venezia (VE)',
      region: 'veneto',
      province: 'VE',
      basePrice: 3200000,
      marketValue: 4800000,
      discount: 33,
      auctionDate: '2026-03-05',
      tribunal: 'Venezia',
      type: 'appartamento',
      sqm: 400,
      rooms: 6,
      description: 'Piano nobile di palazzo storico del XVI secolo con affacci sul Canal Grande.',
      url: 'https://www.astegiudiziarie.it/scheda/123460',
      imageUrl: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=800',
      source: 'astegiudiziarie',
      scrapedAt: new Date().toISOString()
    },
    {
      id: 'PVP-2024-GE-006',
      title: 'Villa sul mare - Portofino',
      location: 'Santa Margherita Ligure (GE)',
      region: 'liguria',
      province: 'GE',
      basePrice: 4500000,
      marketValue: 6500000,
      discount: 31,
      auctionDate: '2026-03-15',
      tribunal: 'Genova',
      type: 'villa',
      sqm: 550,
      rooms: 8,
      description: 'Prestigiosa villa con accesso diretto al mare e piscina a sfioro.',
      url: 'https://pvp.giustizia.it/scheda/234567',
      imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      source: 'pvp',
      scrapedAt: new Date().toISOString()
    },
    {
      id: 'AG-2024-NA-007',
      title: 'Villa Vesuviana con parco',
      location: 'Napoli (NA)',
      region: 'campania',
      province: 'NA',
      basePrice: 890000,
      marketValue: 1350000,
      discount: 34,
      auctionDate: '2026-02-25',
      tribunal: 'Napoli',
      type: 'villa',
      sqm: 480,
      rooms: 9,
      description: 'Villa settecentesca con affreschi originali e parco di 3000 mq.',
      url: 'https://www.astegiudiziarie.it/scheda/123461',
      imageUrl: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
      source: 'astegiudiziarie',
      scrapedAt: new Date().toISOString()
    },
    {
      id: 'AG-2024-TO-008',
      title: 'Loft industriale ristrutturato',
      location: 'Torino (TO)',
      region: 'piemonte',
      province: 'TO',
      basePrice: 720000,
      marketValue: 980000,
      discount: 27,
      auctionDate: '2026-03-01',
      tribunal: 'Torino',
      type: 'appartamento',
      sqm: 320,
      rooms: 4,
      description: 'Ex opificio ristrutturato in zona Lingotto con doppia altezza.',
      url: 'https://www.astegiudiziarie.it/scheda/123462',
      imageUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
      source: 'astegiudiziarie',
      scrapedAt: new Date().toISOString()
    },
    {
      id: 'PVP-2024-SS-009',
      title: 'Villa in Costa Smeralda',
      location: 'Arzachena (SS)',
      region: 'sardegna',
      province: 'SS',
      basePrice: 2100000,
      marketValue: 3200000,
      discount: 34,
      auctionDate: '2026-03-20',
      tribunal: 'Sassari',
      type: 'villa',
      sqm: 350,
      rooms: 6,
      description: 'Villa in stile mediterraneo con vista mare a pochi minuti da Porto Cervo.',
      url: 'https://pvp.giustizia.it/scheda/234568',
      imageUrl: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800',
      source: 'pvp',
      scrapedAt: new Date().toISOString()
    },
    {
      id: 'AG-2024-MI-010',
      title: 'Penthouse CityLife Milano',
      location: 'Milano (MI)',
      region: 'lombardia',
      province: 'MI',
      basePrice: 1850000,
      marketValue: 2600000,
      discount: 29,
      auctionDate: '2026-02-18',
      tribunal: 'Milano',
      type: 'attico',
      sqm: 220,
      rooms: 4,
      description: 'Spettacolare penthouse nel quartiere CityLife con terrazza di 80 mq.',
      url: 'https://www.astegiudiziarie.it/scheda/123463',
      imageUrl: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
      source: 'astegiudiziarie',
      scrapedAt: new Date().toISOString()
    }
  ],
  stats: {
    avgDiscount: 31,
    avgPricePerSqm: 4200,
    byRegion: {
      'lombardia': 4,
      'toscana': 1,
      'lazio': 1,
      'veneto': 1,
      'liguria': 1,
      'campania': 1,
      'piemonte': 1,
      'sardegna': 1
    },
    byType: {
      'villa': 6,
      'attico': 2,
      'appartamento': 2
    },
    byPriceRange: {
      '500k-750k': 1,
      '750k-1M': 2,
      '1M-2M': 4,
      '2M-5M': 3
    }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Query parameters for filtering
    const region = searchParams.get('region')
    const type = searchParams.get('type')
    const minPrice = searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : null
    const maxPrice = searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : null
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : null

    // Try to read from scraped data file
    const filePath = join(process.cwd(), 'data/scraped/aste-luxury.json')

    let data: AuctionData

    if (existsSync(filePath)) {
      data = JSON.parse(readFileSync(filePath, 'utf-8'))
    } else {
      data = FALLBACK_DATA
    }

    // Apply filters
    let filteredAuctions = [...data.auctions]

    if (region) {
      filteredAuctions = filteredAuctions.filter(a => a.region === region.toLowerCase())
    }

    if (type) {
      filteredAuctions = filteredAuctions.filter(a => a.type === type.toLowerCase())
    }

    if (minPrice !== null) {
      filteredAuctions = filteredAuctions.filter(a => a.basePrice >= minPrice)
    }

    if (maxPrice !== null) {
      filteredAuctions = filteredAuctions.filter(a => a.basePrice <= maxPrice)
    }

    // Sort by auction date (soonest first)
    filteredAuctions.sort((a, b) => new Date(a.auctionDate).getTime() - new Date(b.auctionDate).getTime())

    // Apply limit
    if (limit !== null) {
      filteredAuctions = filteredAuctions.slice(0, limit)
    }

    // Check staleness (> 48 hours old)
    const lastUpdate = new Date(data.lastUpdate)
    const hoursSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60)

    return NextResponse.json({
      ...data,
      auctions: filteredAuctions,
      filteredCount: filteredAuctions.length,
      stale: hoursSinceUpdate > 48
    })
  } catch (error) {
    console.error('Error reading auction data:', error)
    return NextResponse.json(FALLBACK_DATA)
  }
}
