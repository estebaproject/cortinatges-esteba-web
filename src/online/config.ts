/**
 * Esteba Online — configuració de la secció de venda (/online).
 *
 * UN SOL INTERRUPTOR governa tot el que fa visible la botiga:
 *   - l'enllaç d'entrada a la capçalera, la franja de la portada i el peu,
 *   - el `noindex` de totes les pàgines de /online,
 *   - el `disallow` de robots.txt,
 *   - la presència de /online al sitemap,
 *   - i, quan hi hagi checkout, l'acceptació de comandes.
 *
 * Es llegeix d'una variable d'entorn PÚBLICA (cal que arribi al client, perquè
 * la capçalera és un component de client) per poder encendre la botiga en un
 * desplegament de PREVIEW de Vercel sense tocar codi: es posa
 * NEXT_PUBLIC_ONLINE_PUBLISHED=true només a l'entorn de preview, i producció
 * segueix apagada fins al dia de l'obertura.
 *
 * Qualsevol valor que no sigui exactament "true" és APAGAT. Sense variable,
 * apagat. És el valor segur.
 */
// PUBLICACIÓ DEL WEB INFORMATIU SENSE LA BOTIGA (14/09/2026). Aquesta
// branca porta només el web de serveis: les pàgines de /online no hi són. Si
// l'interruptor depengués de la variable d'entorn i a Vercel algú l'hagués
// posat a "true", la capçalera i el peu ensenyarien un botó cap a una botiga
// que dona 404. Per això aquí va FIXAT a false. Quan es fusioni la branca de
// la botiga, aquesta línia es substitueix per la que llegeix la variable.
export const ONLINE_PUBLISHED = false as boolean;

/** Nom públic de la botiga. Surt al peu i als títols. */
export const ONLINE_NAME = "Esteba Online";

/**
 * El mateix nom sense la paraula que el logotip ja diu.
 *
 * A la capçalera del web informatiu, el botó que porta a la botiga és a la
 * mateixa fila que el logotip, i el logotip ja porta "ESTEBA" escrit: el
 * botó deia "ESTEBA ONLINE" i la paraula sortia dues vegades a un pam de
 * distància. Amb el logotip al costat, "ONLINE" ja diu on porta.
 *
 * NO és per estalviar espai: al peu i als títols, on el logotip no fa
 * costat, hi va el nom sencer (`ONLINE_NAME`). La regla és aquesta —nom
 * curt només si el logotip és a la vista.
 */
export const ONLINE_NAME_SHORT = "Online";

/** Segment arrel de la botiga, invariable en els quatre idiomes. */
export const ONLINE_ROOT = "online";

/**
 * Subrutes de /online que NO s'han d'indexar MAI, ni amb la botiga oberta:
 * estat privat per usuari (cistell, checkout, comanda) o resultats dinàmics
 * (cerca). Es declaren ja ara perquè robots.txt i el sitemap no depenguin de
 * recordar-se'n quan s'implementin.
 */
export const ONLINE_PRIVATE_SEGMENTS = ["cistell", "checkout", "comanda", "cerca"] as const;

/**
 * Bloc `robots` per a la metadata de tota pàgina de /online.
 * Amb la botiga apagada: noindex + nofollow. Oberta: cap meta (indexable).
 */
export const ONLINE_ROBOTS = ONLINE_PUBLISHED
  ? undefined
  : { index: false, follow: false };

/**
 * Rutes a posar en `disallow` a robots.txt per als quatre idiomes (el català
 * va sense prefix). Apagada: tot /online. Oberta: només les privades.
 */
export function onlineDisallowPaths(locales: readonly string[], defaultLocale: string): string[] {
  const prefixes = locales.map((l) => (l === defaultLocale ? "" : `/${l}`));
  const segments = ONLINE_PUBLISHED
    ? ONLINE_PRIVATE_SEGMENTS.map((s) => `${ONLINE_ROOT}/${s}`)
    : [ONLINE_ROOT];
  return prefixes.flatMap((p) => segments.map((s) => `${p}/${s}`));
}

/**
 * Si una ruta interna de `pathnames` ha d'entrar al sitemap. Les que no són
 * de la botiga, sempre. Les de la botiga, només amb la botiga oberta i mai
 * les privades.
 */
export function onlineRouteInSitemap(href: string): boolean {
  if (!href.startsWith(`/${ONLINE_ROOT}`)) return true;
  if (!ONLINE_PUBLISHED) return false;
  return !ONLINE_PRIVATE_SEGMENTS.some((s) => href.startsWith(`/${ONLINE_ROOT}/${s}`));
}
