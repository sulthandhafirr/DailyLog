import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
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
