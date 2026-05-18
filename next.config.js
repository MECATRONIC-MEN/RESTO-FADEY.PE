/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evita .next en OneDrive (symlinks EINVAL). Solo en `npm run dev`.
  ...(process.env.npm_lifecycle_event === 'dev' && {
    distDir: 'node_modules/.cache/next-dev',
  }),
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;
