/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build a standalone server bundle (.next/standalone) so the Dockerfile
  // can copy and run the server without installing devDependencies in the image.
  output: 'standalone',

  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig
