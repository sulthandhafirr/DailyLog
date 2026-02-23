import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // 🔧 BUNDLER CONFIGURATION (Fix for Vercel build error)
  // Next.js 16 enables Turbopack by default, but this project uses custom webpack config.
  // Solution: Force webpack by setting turbopack option to false
  // @ts-expect-error - turbopack is valid in Next.js 16 but not in type definitions yet
  turbopack: false,
  
  // ✅ External packages for server components (Next.js 16+)
  serverExternalPackages: [
    'pdfkit',
    'fontkit',
    'png-js',
    'linebreak',
  ],
  
  // ✅ Webpack config for PDF dependencies
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude problematic PDF dependencies from webpack bundling
      config.externals = config.externals || [];
      config.externals.push({
        'pdfkit': 'commonjs pdfkit',
        'fontkit': 'commonjs fontkit',
        'png-js': 'commonjs png-js',
        'linebreak': 'commonjs linebreak',
      });
    }
    return config;
  },
};

export default nextConfig;
