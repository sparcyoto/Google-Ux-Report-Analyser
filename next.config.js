/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    // NEXT_PUBLIC_CRUX_API_KEY: process.env.CRUX_API_KEY,
  },
};

module.exports = nextConfig;
