const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // 优化图片和静态资源处理
  images: {
    domains: [], // 如果需要加载外部图片，在这里添加域名
  },

  // 改进 webpack 配置
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

  // 添加环境变量配置
  env: {
    NEXT_PUBLIC_ZHIPU_API_KEY: process.env.NEXT_PUBLIC_ZHIPU_API_KEY,
  },

  // 优化构建设置
  swcMinify: true,
  
  // 如果需要支持国际化路由，取消下面的注释
  // i18n: {
  //   locales: ['zh'],
  //   defaultLocale: 'zh',
  // },
};

module.exports = nextConfig;