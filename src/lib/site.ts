// Configuració global del lloc. Font única de veritat per a SEO
// (canonical, sitemap, robots, dades estructurades, Open Graph).
// Quan es connecti el domini a Vercel, aquesta constant ja és correcta.
export const SITE_URL = "https://www.cortinatgesesteba.com";
export const SITE_NAME = "Cortinatges Esteba";
export const DEFAULT_OG_IMAGE = "/images/tradicional_8.jpg";
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
