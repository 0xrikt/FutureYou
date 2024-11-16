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
  
  // 确保正确处理 CSS modules
  compiler: {
    // 移除 console.log 在生产环境
    removeConsole: process.env.NODE_ENV === 'production',
  }
}

module.exports = nextConfig;