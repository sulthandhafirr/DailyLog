import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  // ✅ External packages for server components (Next.js 16+)
  serverExternalPackages: [
    'pdfkit',
    'fontkit',
    'png-js',
    'linebreak',
  ],
  
  // ✅ Webpack config for PDF dependencies (used when --webpack flag is set)
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
