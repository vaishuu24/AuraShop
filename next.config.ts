import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Partial Prerendering — instant static shell + streamed dynamic product data
    ppr: true,
  },
  images: {
    // Allow external image domains when real product imagery is added
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'cdn.vexo.store' },
    ],
  },
};

export default nextConfig;
