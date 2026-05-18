import type { Metadata } from 'next';
import { SITE_URL, SITE_NAME, CONTACT } from './constants';

const defaultTitle = 'Resto Fadey | Sistema POS para Restaurantes';
const defaultDescription =
  'Sistema POS moderno para restaurantes. Ventas, cocina, delivery, boletas electrónicas y control total desde una sola plataforma.';

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: defaultTitle,
    template: `%s | ${SITE_NAME}`,
  },
  description: defaultDescription,
  keywords: [
    'POS restaurantes',
    'sistema POS Perú',
    'punto de venta restaurante',
    'boletas electrónicas SUNAT',
    'software restaurante',
    'Resto Fadey',
    'POS delivery',
    'control de mesas',
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  other: {
    'contact:email': CONTACT.email,
    'contact:phone_number': CONTACT.phoneTel,
  },
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Resto Fadey - Sistema POS para Restaurantes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: ['/images/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
  },
  category: 'technology',
};
