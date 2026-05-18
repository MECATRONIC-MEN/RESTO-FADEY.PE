import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Resto Fadey',
    short_name: 'Resto Fadey',
    description: 'Sistema POS y gestión para restaurantes en Perú',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a2340',
    theme_color: '#0a2340',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
