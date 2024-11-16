const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    domains: [],
  },

  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },

  env: {
    NEXT_PUBLIC_ZHIPU_API_KEY: process.env.NEXT_PUBLIC_ZHIPU_API_KEY,
  },

  // 优化生产构建
  swcMinify: true,
  poweredByHeader: false,
  
  // 配置 API 路由超时
  serverRuntimeConfig: {
    // API 路由超时设置为 60 秒
    apiTimeout: 60000,
  },

  // Edge Runtime 配置
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
}

module.exports = nextConfig;