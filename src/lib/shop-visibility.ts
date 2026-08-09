import type { Metadata } from "next";
import { routing } from "@/routing";

/* ═══════════════════════════════════════════════════════════════════════════
 *  BLOQUEIG TEMPORAL DE LA BOTIGA ALS CERCADORS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  PER QUÈ HI ÉS
 *  La web informativa substitueix el WordPress de cortinatgesesteba.com, però
 *  la part de venda online (catifes, mobiliari, mantes) NO es publica: migrarà
 *  a Shopify. El codi es manté viu i navegable —no s'esborra res— però no ha
 *  d'aparèixer a Google, perquè avui serviria preus del catàleg estàtic i un
 *  checkout que no cobra (src/lib/payment.ts és un stub).
 *
 *  QUAN ES TREU
 *  El dia que la botiga passi a Shopify, o si es decideix publicar-la aquí.
 *
 *  COM ES REVERTEIX
 *  Canviant NOMÉS la constant SHOP_PUBLISHED de sota a `true`. Res més.
 *  Això desactiva alhora els `disallow` de robots.txt i els `noindex` de totes
 *  les pàgines de botiga, perquè totes dues coses en surten.
 *
 *  NOTA TÈCNICA (important si algun dia s'ha de desindexar de veritat)
 *  `disallow` a robots.txt i `noindex` a la pàgina són parcialment
 *  contradictoris: si Google no pot RASTREJAR la pàgina, tampoc pot LLEGIR-HI
 *  el noindex. Aquí no és problema perquè aquestes URLs no han estat mai
 *  indexades (són d'un domini que encara no s'ha publicat): el disallow ja
 *  n'evita l'entrada a l'índex i el noindex és el cinturó de seguretat per si
 *  hi arriba per un enllaç extern. Si algun dia calgués TREURE de l'índex unes
 *  URLs ja indexades, s'hauria de fer al revés: noindex SENSE disallow, i
 *  esperar que Google les recrawlegi.
 * ═══════════════════════════════════════════════════════════════════════════ */

/** Única palanca. `true` = botiga visible als cercadors. */
export const SHOP_PUBLISHED = false;

/**
 * Segments de CATÀLEG (sense prefix d'idioma). Aquests SÍ que depenen del flag:
 * el dia que la botiga es publiqui, han de tornar a ser indexables.
 * Cobreixen les subrutes: `/catifes` inclou `/catifes/lucca` (robots.txt fa
 * match per prefix).
 */
export const SHOP_SEGMENTS = [
  "botiga",
  "catifes",
  "mobiliari",
  "mantes",
  "rebaixes",
] as const;

/**
 * Segments que NO s'han d'indexar MAI, ni tan sols amb la botiga publicada:
 * - `cistell` i `checkout`: estat privat per usuari, sense contingut públic.
 *   (`/checkout` cobreix també `/checkout/confirmacio`.)
 * - `cerca`: resultats dinàmics per query; indexar-los genera contingut prim
 *   i infinites URLs amb ?q=.
 * Per això van a part i NO els afecta SHOP_PUBLISHED.
 */
export const ALWAYS_PRIVATE_SEGMENTS = ["cistell", "checkout", "cerca"] as const;

/**
 * Bloc `robots` per a la metadata de TOTA pàgina de botiga.
 * Quan SHOP_PUBLISHED sigui `true` retorna `undefined` i Next.js no emet
 * cap meta robots: la pàgina torna a ser indexable.
 */
export const SHOP_ROBOTS: Metadata["robots"] = SHOP_PUBLISHED
  ? undefined
  : { index: false, follow: false };

/**
 * Rutes a posar en `disallow` a robots.txt, en els 4 idiomes.
 * El català no porta prefix (localePrefix "as-needed"), la resta sí.
 */
export function shopDisallowPaths(): string[] {
  const prefixes = routing.locales.map((l) =>
    l === routing.defaultLocale ? "" : `/${l}`,
  );
  const segments: string[] = [
    ...ALWAYS_PRIVATE_SEGMENTS,
    ...(SHOP_PUBLISHED ? [] : SHOP_SEGMENTS),
  ];
  return prefixes.flatMap((p) => segments.map((s) => `${p}/${s}`));
}
