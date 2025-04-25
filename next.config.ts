import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Any other config options...
  // You don't need to place `module.exports` here.
};

// Export both config and headers
export default nextConfig;

export async function headers() {
  return [
    {
      source: '/embed',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'ALLOWALL',
        },
      ],
    },
  ];
}
