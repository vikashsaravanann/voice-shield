import { MetadataRoute } from 'next'

// Always use the production domain — never the Vercel preview URL
const PRODUCTION_URL = 'https://voiceshield.logicintelligencetechnologies.in'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api',
          '/api/',
          '/auth',
          '/auth/',
          '/dashboard',
          '/dashboard/',
          '/app',
          '/app/',
        ],
      },
      {
        userAgent: 'Yeti',
        allow: '/',
      },
    ],
    sitemap: `${PRODUCTION_URL}/sitemap.xml`,
  }
}
