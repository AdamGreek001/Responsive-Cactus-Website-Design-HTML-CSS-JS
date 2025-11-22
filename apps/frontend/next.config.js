/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@saas-platform/ui', '@saas-platform/types', '@saas-platform/utils'],
}

module.exports = nextConfig
