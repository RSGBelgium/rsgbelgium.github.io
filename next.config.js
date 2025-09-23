/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure allowed development origins for cross-origin requests
  allowedDevOrigins: [
    '10.40.147.252',
    'localhost',
    '127.0.0.1',
    // Add any other IP addresses or domains you use for development
  ],

  // Other Next.js configuration options can be added here
  trailingSlash: false,

  // Enable experimental features if needed
  experimental: {
    // Add any experimental features you want to enable
  },

  // Configure image domains if you're using next/image
  images: {
    domains: [
      'rsg-belgium.be',
      // Add other domains as needed
    ],
  },
};

module.exports = nextConfig;