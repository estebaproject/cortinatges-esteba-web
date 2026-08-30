import type { MetadataRoute } from "next";
import { collectionHref, publicUrl } from "@/lib/site";
import { routing } from "@/routing";
import { PRODUCT_SLUGS } from "@/lib/products";

// Rutes INTERNES (les claus de `pathnames`). Les URLs públiques es deriven amb
// publicUrl(), que aplica els slugs traduïts de cada idioma. La botiga queda
// fora del sitemap a propòsit: no es publica fins a la migració a Shopify.
//
// ES DERIVEN DE `routing.pathnames`, NO S'ESCRIUEN A MÀ. Abans aquí hi havia
// una llista literal de 10 rutes i `pathnames` en declarava 11: `/concerta-cita`
// s'hi havia quedat fora. Eren QUATRE URLs vives —una per idioma—, enllaçades
// des de la capçalera, el peu, /contacte i /botigues, que emetien canonical
// autoreferencial i hreflang dels quatre idiomes i que Google no sabia que
// existien. I precisament la de demanar cita, que és la que porta feina.
//
// Ningú se n'havia adonat perquè una llista escrita a mà no falla: només es
// queda curta, en silenci. Derivant-la, afegir una ruta a `pathnames` ja la
// posa al sitemap i el descuit deixa de ser possible.
//
// L'ÚNIC FILTRE són les fitxes de producte, que entren per l'altra banda amb
// PRODUCT_SLUGS. Ha de ser així i no llistar totes les claus de `/colleccions/`:
// `pathnames` en declara 14 però tres són DRAFT_PRODUCTS (tendals, pergoles,
// tapisseria), que estan declarades per tipatge però NO publicades — a
// producció donen 404 amb `noindex`. PRODUCT_SLUGS només conté les 11 vives, o
// sigui que filtrant per prefix i deixant que els productes entrin per
// PRODUCT_SLUGS, els esborranys queden fora sols.
//
// Comprovat que la resta de rutes de `pathnames` són totes públiques i
// indexables: les 11 donen 200 amb canonical autoreferencial.
const STATIC_ROUTES = Object.keys(routing.pathnames).filter(
  (href) => !href.startsWith("/colleccions/"),
) as Array<Parameters<typeof publicUrl>[0]>;

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
