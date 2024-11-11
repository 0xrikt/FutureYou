const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    // 设置路径别名
    config.resolve.alias['@'] = path.resolve(__dirname, 'src');
    config.resolve.alias['@/lib'] = path.resolve(__dirname, 'src/lib');
    return config;
  },
}

module.exports = nextConfig;
