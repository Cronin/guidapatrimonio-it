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

  const tools = [
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
    // Private Wealth
    'confronto-private-banking',
    'costi-private-banking',
    // Real Estate
    'mercato-immobiliare-luxury',
    'portafoglio-immobiliare',
    'proiezione-patrimoniale',
  ]

  const toolUrls = tools.map(tool => ({
    url: `${baseUrl}/strumenti/${tool}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/investire-100mila`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/strumenti`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    ...toolUrls,
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
