/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'], 
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  }

};

module.exports = nextConfig;