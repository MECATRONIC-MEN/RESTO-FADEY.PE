import type { MetadataRoute } from 'next';

/**
 * Manifiesto web (no PWA instalable).
 * La landing es sitio web; la instalación como app queda solo para uso interno opcional.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Resto Fadey',
    short_name: 'Resto Fadey',
    description: 'Sistema POS y gestión para restaurantes en Perú',
    start_url: '/',
    display: 'browser',
    background_color: '#0a2340',
    theme_color: '#0a2340',
    icons: [
      {
        src: '/images/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
