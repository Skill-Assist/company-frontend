/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['bucket-skill-assist.s3.sa-east-1.amazonaws.com'],
  }
}

module.exports = nextConfig
