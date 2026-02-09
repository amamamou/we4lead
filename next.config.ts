import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',       // your backend is http
        hostname: 'localhost',  // host of your backend
        port: '8080',           // optional, specify port
        pathname: '/uploads/**' // optional, match all uploads
      },
    ],
  },
};

export default nextConfig;
