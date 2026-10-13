import { MetadataRoute } from 'next'

// Always use the production domain — never the Vercel preview URL
const PRODUCTION_URL = 'https://voiceshield.logicintelligencetechnologies.in'

interface SitemapRouteConfig {
  path: string
  lastModified: string
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority: number
}

// Canonical public routes audit with verifiable release baseline timestamps (QA-04 / QA-50 compliant)
// Excludes private workspace (/app/*), legacy aliases (/sandbox, /dashboard), and auth flows
const LAST_RELEASE_DATE = '2026-10-14T00:00:00.000Z'

const PUBLIC_CANONICAL_ROUTES: SitemapRouteConfig[] = [
  // Primary Product & Commercial Pages
  { path: '', lastModified: LAST_RELEASE_DATE, changeFrequency: 'weekly', priority: 1.0 },
  { path: '/features', lastModified: LAST_RELEASE_DATE, changeFrequency: 'weekly', priority: 0.9 },
  { path: '/pricing', lastModified: LAST_RELEASE_DATE, changeFrequency: 'weekly', priority: 0.9 },
  { path: '/demo', lastModified: LAST_RELEASE_DATE, changeFrequency: 'weekly', priority: 0.9 },
  { path: '/how-it-works', lastModified: LAST_RELEASE_DATE, changeFrequency: 'weekly', priority: 0.8 },
  { path: '/architecture', lastModified: LAST_RELEASE_DATE, changeFrequency: 'weekly', priority: 0.8 },
  { path: '/docs', lastModified: LAST_RELEASE_DATE, changeFrequency: 'weekly', priority: 0.8 },
  { path: '/security', lastModified: LAST_RELEASE_DATE, changeFrequency: 'weekly', priority: 0.8 },
  { path: '/threat-intel', lastModified: LAST_RELEASE_DATE, changeFrequency: 'weekly', priority: 0.8 },
  { path: '/integrations', lastModified: LAST_RELEASE_DATE, changeFrequency: 'weekly', priority: 0.8 },
  { path: '/compliance', lastModified: LAST_RELEASE_DATE, changeFrequency: 'weekly', priority: 0.8 },
  { path: '/report', lastModified: LAST_RELEASE_DATE, changeFrequency: 'monthly', priority: 0.8 },
  { path: '/benefits', lastModified: LAST_RELEASE_DATE, changeFrequency: 'monthly', priority: 0.7 },
  { path: '/use-cases', lastModified: LAST_RELEASE_DATE, changeFrequency: 'monthly', priority: 0.7 },
  { path: '/industries', lastModified: LAST_RELEASE_DATE, changeFrequency: 'monthly', priority: 0.7 },
  { path: '/about', lastModified: LAST_RELEASE_DATE, changeFrequency: 'monthly', priority: 0.7 },
  { path: '/brief', lastModified: LAST_RELEASE_DATE, changeFrequency: 'monthly', priority: 0.7 },
  { path: '/faq', lastModified: LAST_RELEASE_DATE, changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', lastModified: LAST_RELEASE_DATE, changeFrequency: 'monthly', priority: 0.8 },
  { path: '/changelog', lastModified: LAST_RELEASE_DATE, changeFrequency: 'daily', priority: 0.7 },
  { path: '/status', lastModified: LAST_RELEASE_DATE, changeFrequency: 'daily', priority: 0.7 },

  // Public Legal, Trust & Regulatory Pages
  { path: '/privacy', lastModified: LAST_RELEASE_DATE, changeFrequency: 'monthly', priority: 0.5 },
  { path: '/terms', lastModified: LAST_RELEASE_DATE, changeFrequency: 'monthly', priority: 0.5 },
  { path: '/cookie-policy', lastModified: LAST_RELEASE_DATE, changeFrequency: 'monthly', priority: 0.5 },
  { path: '/acceptable-use', lastModified: LAST_RELEASE_DATE, changeFrequency: 'monthly', priority: 0.5 },
  { path: '/accessibility', lastModified: LAST_RELEASE_DATE, changeFrequency: 'monthly', priority: 0.5 },
  { path: '/ai-limitations', lastModified: LAST_RELEASE_DATE, changeFrequency: 'monthly', priority: 0.5 },
  { path: '/data-retention', lastModified: LAST_RELEASE_DATE, changeFrequency: 'monthly', priority: 0.5 },
  { path: '/telephony-consent', lastModified: LAST_RELEASE_DATE, changeFrequency: 'monthly', priority: 0.5 },
  { path: '/responsible-disclosure', lastModified: LAST_RELEASE_DATE, changeFrequency: 'monthly', priority: 0.5 },
  { path: '/copyright', lastModified: LAST_RELEASE_DATE, changeFrequency: 'monthly', priority: 0.5 },
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
