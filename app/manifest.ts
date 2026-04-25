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
  }
}
