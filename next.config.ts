import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    // Ensure the app folder is the root for dev server resolution
    root: __dirname,
  },
  // Silence dev cross-origin warnings by allowing local network origins
  allowedDevOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000'],
};

export default nextConfig;
