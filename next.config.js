/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    // NEXT_PUBLIC_CRUX_API_KEY: process.env.CRUX_API_KEY,
  },
  // Disable TypeScript type checking in build
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
