import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400,
  },
};

export default withNextIntl(nextConfig);
