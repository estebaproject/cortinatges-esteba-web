import type { MetadataRoute } from "next";
import { collectionHref, publicUrl } from "@/lib/site";
import { routing } from "@/routing";
import { PRODUCT_SLUGS } from "@/lib/products";

// Rutes INTERNES (les claus de `pathnames`). Les URLs públiques es deriven amb
// publicUrl(), que aplica els slugs traduïts de cada idioma. La botiga queda
// fora del sitemap a propòsit: no es publica fins a la migració a Shopify.
const STATIC_ROUTES = [
  "/",
  "/serveis",
  "/botigues",
  "/nosaltres",
  "/contacte",
  "/demana-pressupost",
  "/vols-treballar-amb-nosaltres",
  "/avis-legal",
  "/privacitat",
  "/cookies",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const hrefs = [
    ...STATIC_ROUTES,
    ...PRODUCT_SLUGS.map((slug) => collectionHref(slug)),
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const href of hrefs) {
    const isHome = href === "/";
    const isProduct = typeof href === "string" && href.startsWith("/colleccions/");

    // alternates hreflang: totes les versions d'idioma d'aquesta mateixa pàgina
    const languages: Record<string, string> = {};
    for (const locale of routing.locales) {
      languages[locale] = publicUrl(href, locale);
    }
    languages["x-default"] = publicUrl(href, routing.defaultLocale);

    for (const locale of routing.locales) {
      entries.push({
        url: publicUrl(href, locale),
        changeFrequency: isHome ? "weekly" : "monthly",
        priority: isHome ? 1 : isProduct ? 0.8 : 0.6,
        alternates: { languages },
      });
    }
  }

  return entries;
}
