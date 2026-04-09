/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  reloadOnOnline: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(gstatic|googleapis)\.com\/.*/i,
      handler: 'CacheFirst',
      options: { cacheName: 'google-fonts', expiration: { maxEntries: 4, maxAgeSeconds: 31536000 } },
    },
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: 'NetworkFirst',
      options: { cacheName: 'next-static', networkTimeoutSeconds: 10, expiration: { maxEntries: 64, maxAgeSeconds: 86400 } },
    },
    {
      urlPattern: /\/_next\/image\?.*/i,
      handler: 'NetworkFirst',
      options: { cacheName: 'next-image', networkTimeoutSeconds: 10, expiration: { maxEntries: 64, maxAgeSeconds: 86400 } },
    },
    {
      urlPattern: /\/api\/.*/i,
      handler: 'NetworkFirst',
      options: { cacheName: 'api', networkTimeoutSeconds: 10, expiration: { maxEntries: 16, maxAgeSeconds: 86400 } },
    },
    {
      urlPattern: ({ url }) => url.origin === self.location.origin,
      handler: 'NetworkFirst',
      options: { cacheName: 'pages', networkTimeoutSeconds: 10, expiration: { maxEntries: 32, maxAgeSeconds: 86400 } },
    },
  ],
});

const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = withPWA(nextConfig);
