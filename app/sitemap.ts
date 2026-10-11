import { MetadataRoute } from 'next'

// Always use the production domain — never the Vercel preview URL
const PRODUCTION_URL = 'https://voiceshield.logicintelligencetechnologies.in'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = PRODUCTION_URL

  const routes = [
    '',
    '/about',
    '/architecture',
    '/brief',
    '/demo',
    '/docs',
    '/privacy',
    '/sandbox',
    '/terms',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }))
}
