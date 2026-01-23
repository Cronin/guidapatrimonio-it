import { MetadataRoute } from 'next'
import { getAllPosts } from '@/content/blog/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://guidapatrimonio.it'
  const posts = getAllPosts()

  const blogUrls = posts.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const tools = [
    'interesse-composto',
    'pac',
    'inflazione',
    'pensione',
    'mutuo',
    'stipendio-netto',
    'tfr',
    'prestito',
    'fire',
    'budget',
    'fondo-emergenza',
    'rendita-immobiliare',
    'dividendi',
    'patrimonio-netto',
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
  ]
}
