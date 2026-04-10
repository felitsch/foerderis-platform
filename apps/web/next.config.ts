import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@foerderis/ui", "@foerderis/db", "@foerderis/shared"],
};

export default nextConfig;
