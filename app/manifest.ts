import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Prizm',
    short_name: 'Prizm',
    description:
      'Sales, ops, commissions, integrations, and AI. One platform, built by operators.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0c16',
    theme_color: '#00cfee',
    icons: [
      {
        src: '/icon.png',
        sizes: 'any',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
