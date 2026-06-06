import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [],
  devIndicators: false,
  experimental: {
    turbopack: {
      root: '../../',
    },
  },
};

export default nextConfig;
