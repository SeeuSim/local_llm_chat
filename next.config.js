var path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone',
  // async rewrites() {
  //   return [
  //     {
  //       source: '/pathA',
  //       destination: 'https://google.com',
  //     },
  //   ];
  // },
  env: {
    NEXT_PUBLIC_VAR_ONE: process.env.NEXT_PUBLIC_VAR_ONE,
    VAR_ONE: process.env.VAR_ONE,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
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
