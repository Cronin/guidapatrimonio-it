import { MetadataRoute } from 'next'
import { getAllPosts } from '@/content/blog/posts'
import { getAllNews } from '@/content/news/articles'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://guidapatrimonio.it'
  const posts = getAllPosts()
  const news = getAllNews()

  const blogUrls = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const newsUrls = news.map(article => ({
    url: `${baseUrl}/notizie/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // All tools - comprehensive list
  const tools = [
    // Calcolatori Fiscali
    'calcolatore-plusvalenze',
    'calcolatore-minusvalenze',
    'tax-loss-harvesting',
    // Portfolio & Investimenti
    'portfolio-tracker',
    'backtest-portafoglio',
    'simulatore-monte-carlo',
    'analizzatore-costi-fondi',
    'confronto-etf',
    'pac',
    'calcolatore-dividendi',
    'dividendi',
    'ottimizzatore-allocazione',
    'portfolio-rebalancer',
    // Strutture Societarie
    'holding',
    'family-office',
    'exit-strategy',
    // Passaggio Generazionale
    'trust-donazione',
    'successione',
    // Fiscalità Internazionale
    'flat-tax-100k',
    'ivafe-ivie',
    'copertura-valutaria',
    // Private Wealth
    'confronto-private-banking',
    'costi-private-banking',
    // Real Estate Premium
    'aste-immobiliari-luxury',
    'mercato-immobiliare-luxury',
    'portafoglio-immobiliare',
    'rendita-immobiliare',
    'immobiliare-vs-azioni',
    // Luxury Assets
    'costo-mantenimento-yacht',
    'costo-jet-privato',
    'costo-auto-collezione',
    // Calcolatori Base
    'patrimonio-netto',
    'calcolatore-patrimonio-netto',
    'stipendio-netto',
    'mutuo',
    'prestito',
    'fondo-emergenza',
    'budget',
    'interesse-composto',
    'interesse-composto-avanzato',
    'inflazione',
    // FIRE & Pensione
    'fire',
    'pensione',
    'tfr',
    'tasso-prelievo-sicuro',
    'proiezione-patrimoniale',
    // Altri strumenti
    'dashboard-macro',
    'scala-obbligazionaria',
    'ai-advisor',
  ]

  const toolUrls = tools.map(tool => ({
    url: `${baseUrl}/strumenti/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Landing pages
  const landingPages = [
    { url: `${baseUrl}/investire-100mila`, priority: 0.8 },
    { url: `${baseUrl}/gestione-patrimonio`, priority: 0.8 },
    { url: `${baseUrl}/protezione-patrimonio`, priority: 0.8 },
    { url: `${baseUrl}/consulenza-patrimoniale`, priority: 0.8 },
    { url: `${baseUrl}/consulenza-patrimoniale-milano`, priority: 0.7 },
    { url: `${baseUrl}/consulenza-patrimoniale-roma`, priority: 0.7 },
    { url: `${baseUrl}/consulenza-patrimoniale-svizzera`, priority: 0.7 },
    { url: `${baseUrl}/faq`, priority: 0.5 },
  ]

  const landingUrls = landingPages.map(page => ({
    url: page.url,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: page.priority,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/strumenti`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...toolUrls,
    ...landingUrls,
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogUrls,
    {
      url: `${baseUrl}/notizie`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...newsUrls,
  ]
}
