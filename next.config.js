/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'], // Add any image domains you need
  },
  // Ensure we catch build-time errors
  typescript: {
    // Don't fail builds on TS errors during development
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  // Add any environment variables you want available at build time
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  }
};

module.exports = nextConfig;