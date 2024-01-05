var path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/pathA',
        destination: 'https://google.com',
      },
    ];
  },
  env: {
    NEXT_PUBLIC_VAR_ONE: process.env.NEXT_PUBLIC_VAR_ONE,
    VAR_ONE: process.env.VAR_ONE,
  },
  eslint: {
    dirs: ['.'],
  },
  reactStrictMode: true,

  experimental: {
    serverComponentsExternalPackages: ['sharp', 'onnxruntime-node'],
  },

  // For use with CMS like Nextra
  webpack: (config, options) => {
    config.resolve.modules.push(path.resolve('.'));

    if (!options.isServer) {
      config.resolve.fallback = {
        fs: false,
        module: false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
