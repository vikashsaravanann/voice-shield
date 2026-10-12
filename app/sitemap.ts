import { MetadataRoute } from 'next'

// Always use the production domain — never the Vercel preview URL
const PRODUCTION_URL = 'https://voiceshield.logicintelligencetechnologies.in'

interface SitemapRouteConfig {
  path: string
  lastModified: string
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

// Canonical public routes audit with genuine last modified dates (no artificial new Date())
// Excludes private workspace (/app/*), legacy aliases (/sandbox, /dashboard), and auth flows
const PUBLIC_CANONICAL_ROUTES: SitemapRouteConfig[] = [
  // Primary Product & Commercial Pages
  { path: '', lastModified: '2026-10-12T08:00:00.000Z', changeFrequency: 'weekly', priority: 1.0 },
  { path: '/features', lastModified: '2026-10-12T06:00:00.000Z', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/pricing', lastModified: '2026-10-12T06:00:00.000Z', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/demo', lastModified: '2026-10-12T06:00:00.000Z', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/how-it-works', lastModified: '2026-10-12T06:00:00.000Z', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/architecture', lastModified: '2026-10-12T07:30:00.000Z', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/docs', lastModified: '2026-10-12T07:30:00.000Z', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/security', lastModified: '2026-10-12T07:30:00.000Z', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/threat-intel', lastModified: '2026-10-12T06:00:00.000Z', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/integrations', lastModified: '2026-10-12T06:00:00.000Z', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/compliance', lastModified: '2026-10-12T06:00:00.000Z', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/report', lastModified: '2026-10-12T06:00:00.000Z', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/benefits', lastModified: '2026-10-11T16:00:00.000Z', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/use-cases', lastModified: '2026-10-11T16:00:00.000Z', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/industries', lastModified: '2026-10-11T16:00:00.000Z', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/about', lastModified: '2026-10-11T16:00:00.000Z', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/brief', lastModified: '2026-10-11T16:00:00.000Z', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/faq', lastModified: '2026-10-11T16:00:00.000Z', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', lastModified: '2026-10-12T06:00:00.000Z', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/changelog', lastModified: '2026-10-12T08:00:00.000Z', changeFrequency: 'daily', priority: 0.7 },
  { path: '/status', lastModified: '2026-10-12T08:00:00.000Z', changeFrequency: 'daily', priority: 0.7 },

  // Public Legal, Trust & Regulatory Pages
  { path: '/privacy', lastModified: '2026-10-11T12:00:00.000Z', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/terms', lastModified: '2026-10-11T12:00:00.000Z', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/cookie-policy', lastModified: '2026-10-11T12:00:00.000Z', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/acceptable-use', lastModified: '2026-10-11T12:00:00.000Z', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/accessibility', lastModified: '2026-10-11T12:00:00.000Z', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/ai-limitations', lastModified: '2026-10-11T12:00:00.000Z', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/data-retention', lastModified: '2026-10-11T12:00:00.000Z', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/telephony-consent', lastModified: '2026-10-11T12:00:00.000Z', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/responsible-disclosure', lastModified: '2026-10-11T12:00:00.000Z', changeFrequency: 'monthly', priority: 0.5 },
  { path: '/copyright', lastModified: '2026-10-11T12:00:00.000Z', changeFrequency: 'monthly', priority: 0.5 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = PRODUCTION_URL

  return PUBLIC_CANONICAL_ROUTES.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))
}
