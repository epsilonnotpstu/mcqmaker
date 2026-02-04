import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    // Force the correct workspace root to avoid resolving from parent directory
    root: __dirname,
  },
  experimental: {
    // Allow local dev origins to silence cross-origin warnings
    allowedDevOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://192.168.0.121:3000'],
  },
};

export default nextConfig;
