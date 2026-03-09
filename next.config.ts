import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  serverExternalPackages: [
    'pdfkit',
    'fontkit',
    'png-js',
    'linebreak',
  ],
  
  webpack: (config, { isServer }) => {
    if (isServer) {
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
