// next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  swcMinify: true,
  
  experimental: {
    optimizeCss: true,
    esmExternals: true,
  },

  images: {
    domains: [],
  },

  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/styles': path.resolve(__dirname, 'src/styles'),
    };
    return config;
  },

  env: {
    NEXT_PUBLIC_ZHIPU_API_KEY: process.env.NEXT_PUBLIC_ZHIPU_API_KEY,
  }
};

module.exports = nextConfig;