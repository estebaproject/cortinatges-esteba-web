import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { routing } from "@/routing";
import { PRODUCT_SLUGS } from "@/lib/products";

// Rutes estàtiques + fitxes de producte, en els 4 idiomes.
const STATIC_ROUTES = [
  "",
  "serveis",
  "botigues",
  "nosaltres",
  "contacte",
  "demana-pressupost",
  "vols-treballar-amb-nosaltres",
  "avis-legal",
  "privacitat",
  "cookies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...STATIC_ROUTES,
    ...PRODUCT_SLUGS.map((slug) => `colleccions/${slug}`),
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of routes) {
    // alternates hreflang per a cada ruta
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
      const path = route ? `/${route}` : "";
      languages[locale] = `${SITE_URL}${prefix}${path}`;
    }
    languages["x-default"] = `${SITE_URL}${route ? `/${route}` : ""}`;

    for (const locale of routing.locales) {
      const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
      const path = route ? `/${route}` : "";
      entries.push({
        url: `${SITE_URL}${prefix}${path}`,
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1 : route.startsWith("colleccions") ? 0.8 : 0.6,
        alternates: { languages },
      });
    }
  }

  return entries;
}
