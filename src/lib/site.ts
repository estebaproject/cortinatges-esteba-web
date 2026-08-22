import { getPathname } from "@/navigation";

// Configuració global del lloc. Font única de veritat per a SEO
// (canonical, sitemap, robots, dades estructurades, Open Graph).
//
// FORMA CANÒNICA: SENSE www. El domini històric ja resol a no-www (www fa 302
// cap a no-www) i tot l'històric d'enllaços hi apunta.
//
// Es llegeix de NEXT_PUBLIC_SITE_URL perquè els deploys de preview de Vercel no
// emetin canonicals de producció. Es normalitza treient la barra final per
// evitar dobles barres en concatenar rutes.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://cortinatgesesteba.com"
).replace(/\/+$/, "");
export const SITE_NAME = "Cortinatges Esteba";
/**
 * Imatge que surt quan algú comparteix el web (WhatsApp, Facebook, X…).
 *
 * ABANS apuntava a /images/tradicional_8.jpg, que fa 768x1024 —VERTICAL— i es
 * declarava aquí sota com a 1200x630. Les xarxes es creuen el que se'ls diu:
 * la targeta sortia retallada o deformada cada vegada que es compartia.
 *
 * Ara és una imatge feta a mida, 1200x630 de debò, amb el logo blanc sobre el
 * blau de la casa. Quan hi hagi una foto horitzontal que valgui la pena,
 * aquest és el lloc per canviar-la: la mida ja és la bona.
 */
export const DEFAULT_OG_IMAGE = "/images/og-cortinatges-esteba.jpg";
export const CONTACT_EMAIL = "info@cortinatgesesteba.com";

// Feature flag: secció de mantes oculta de tota la UI (dades i rutes intactes).
export const SHOW_MANTES = false;

// Construeix el bloc `alternates` (canonical + hreflang languages) per a una
// ruta donada, seguint l'esquema d'URLs del lloc: català sense prefix i la
// resta d'idiomes amb prefix `/{locale}`. `locale` és l'idioma actual de la
// pàgina; `segment` és la secció (p. ex. "catifes"); `slug` opcional afegeix la
// fitxa (p. ex. "lucca"). El canonical és AUTOREFERENCIAL (apunta a l'URL de
// l'idioma actual), mentre que `languages` llista tots els idiomes i `x-default`
// apunta al català (per defecte), coherent amb el layout arrel.
// Rutes DECLARADES a `pathnames` (institucionals i fitxes de producte). Per a
// aquestes, la URL pública NO coincideix amb la ruta interna, així que el
// canonical i els hreflang s'han de construir amb getPathname(): si es
// construïssin a mà s'apuntaria a URLs que ja no existeixen.
type LocalizedHref = Parameters<typeof getPathname>[0]["href"];

/**
 * Href intern d'una fitxa de producte, tipat per a getPathname(). Concentra
 * aquí l'única conversió: `slug` és dinàmic però totes les fitxes estan
 * declarades a `pathnames`, així que la ruta sempre hi és.
 */
export function collectionHref(slug: string): LocalizedHref {
  return `/colleccions/${slug}` as LocalizedHref;
}

/**
 * Ruta pública RELATIVA d'una ruta declarada a `pathnames`. Per als enllaços
 * interns: si s'enllacés la ruta interna, cada clic passaria per una redirecció.
 */
export function publicPath(href: LocalizedHref, locale: string): string {
  return getPathname({ href, locale });
}

/** URL pública absoluta d'una ruta declarada a `pathnames`, per a un idioma. */
export function publicUrl(href: LocalizedHref, locale: string): string {
  return `${SITE_URL}${publicPath(href, locale)}`;
}

/**
 * `alternates` (canonical autoreferencial + hreflang dels 4 idiomes + x-default)
 * per a una ruta declarada a `pathnames`. És la que han d'usar TOTES les pàgines
 * institucionals: sense això hereten les del layout, que apunten a la portada.
 */
export function localizedAlternatesFor(
  href: LocalizedHref,
  locale: string,
): {
  canonical: string;
  languages: Record<string, string>;
} {
  const url = (loc: string) => publicUrl(href, loc);
  return {
    canonical: url(locale),
    languages: {
      ca: url("ca"),
      es: url("es"),
      en: url("en"),
      fr: url("fr"),
      "x-default": url("ca"),
    },
  };
}

/**
 * Bloc `openGraph` d'una pàgina declarada a `pathnames`.
 *
 * CAL SEMPRE que una pàgina declari `alternates`: el layout arrel posa un
 * `openGraph.url` que apunta a la PORTADA de l'idioma, i Next.js NO fusiona
 * `openGraph` en profunditat — si la pàgina no el sobreescriu, se'l queda i
 * contradiu el canonical. Es va detectar just així: canonical correcte i
 * og:url apuntant a la portada.
 */
export function openGraphFor(
  href: LocalizedHref,
  locale: string,
  title: string,
  description?: string,
) {
  return {
    type: "website" as const,
    locale,
    siteName: SITE_NAME,
    url: publicUrl(href, locale),
    title,
    ...(description ? { description } : {}),
    images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  };
}

// Rutes NO declarades a `pathnames` (tota la botiga). Aquí la URL pública sí
// coincideix amb la ruta interna, així que es construeix a mà com sempre.
export function localizedAlternates(
  locale: string,
  segment: string,
  slug?: string,
): {
  canonical: string;
  languages: Record<string, string>;
} {
  const parts = [segment, slug].filter(Boolean).join("/");
  const path = parts ? `/${parts}` : "";
  const url = (loc: string) =>
    loc === "ca" ? `${SITE_URL}${path}` : `${SITE_URL}/${loc}${path}`;
  return {
    canonical: url(locale),
    languages: {
      ca: url("ca"),
      es: url("es"),
      en: url("en"),
      fr: url("fr"),
      "x-default": url("ca"),
    },
  };
}
