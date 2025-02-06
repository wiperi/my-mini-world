/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    trace: false,  // Disable trace
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
