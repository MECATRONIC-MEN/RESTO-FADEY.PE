import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import '@/styles/globals.css';
import { siteMetadata } from '@/lib/seo';
import { SITE_URL } from '@/lib/constants';
import { SessionProvider } from '@/components/providers/SessionProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

export const metadata: Metadata = {
  ...siteMetadata,
  /** Sin modo app en iOS — el sitio se abre como página web normal */
  appleWebApp: {
    capable: false,
    title: 'Resto Fadey',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Resto Fadey',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: SITE_URL,
  description:
    'Sistema POS moderno para restaurantes. Ventas, cocina, delivery, boletas electrónicas y control total.',
  offers: {
    '@type': 'Offer',
    price: '150',
    priceCurrency: 'PEN',
  },
  areaServed: {
    '@type': 'Country',
    name: 'Perú',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="icon" href="/images/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <meta name="theme-color" content="#0a2340" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
