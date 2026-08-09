import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { shopDisallowPaths } from "@/lib/shop-visibility";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Botiga bloquejada temporalment fins a la migració a Shopify.
      // El PER QUÈ i el COM REVERTIR-HO són a src/lib/shop-visibility.ts.
      disallow: shopDisallowPaths(),
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
