/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evita .next en OneDrive (symlinks EINVAL). Solo en `npm run dev`.
  ...(process.env.npm_lifecycle_event === 'dev' && {
    distDir: 'node_modules/.cache/next-dev',
  }),
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co', pathname: '/storage/v1/object/public/**' },
      { protocol: 'https', hostname: '**.vercel.app' },
      { protocol: 'https', hostname: '**.vercel-storage.com' },
    ],
  },
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;
