// SKU propi de la botiga ESTEBA — DERIVAT, mai desat. El SKU és una funció pura
// del catàleg (catifa/moble/manta), el slug del model i la clau de variant que
// ja viatgen amb cada producte i cada línia del cistell. Com que no es
// persisteix enlloc, no hi ha migració de dades ni risc de quedar desincronitzat
// quan es regenera el catàleg: sempre es pot tornar a calcular a partir de dades
// estables que ja existeixen.
//
// Esquema:
//   - Prefix per catàleg: catifa→CAT-, moble→MOB-, manta→MAN-.
//   - SKU de producte = PREFIX + UPPERCASE(slug).
//       catifa "adore"   → "CAT-ADORE"
//       moble  "grenoble"→ "MOB-GRENOBLE"
//       manta  "agra"    → "MAN-AGRA"
//   - SKU de variant = SKU de producte + "-" + token de variant:
//       catifa/manta: la mida sanititzada (majúscules, sense espais ni ×,
//                     "Ø"→"D", "_"→"-"):
//         CAT-ADORE + "160x230"            → "CAT-ADORE-160X230"
//         CAT-X     + "Ø240"               → "CAT-X-D240"
//         CAT-X     + "pack_40x50_50x80"   → "CAT-X-PACK-40X50-50X80"
//       moble: "V" + la clau de variant del cistell ("{index}" o "{index}-{dim}"),
//              perquè els noms de variant es repeteixen i l'índex és la clau
//              estable (igual que el slug compost del cistell "grenoble#2-...":
//         MOB-GRENOBLE + "2-120x40x76"     → "MOB-GRENOBLE-V2-120X40X76"
//         MOB-X        + "0"               → "MOB-X-V0"
//
// Mòdul PUR: sense imports pesats ni dependències de framework.

/** Discriminador de catàleg, idèntic al de ShopItem (src/lib/shop-search.ts). */
export type CatalogType = "catifa" | "moble" | "manta";

const PREFIXES: Record<CatalogType, string> = {
  catifa: "CAT-",
  moble: "MOB-",
  manta: "MAN-",
};

/** Prefix de SKU per al catàleg. catifa→"CAT-", moble→"MOB-", manta→"MAN-". */
export function catalogPrefix(type: CatalogType): string {
  return PREFIXES[type];
}

/**
 * Normalitza una clau de variant a un token de SKU: majúscules, sense espais ni
 * el signe ×, "Ø"→"D" i "_"→"-".
 *
 * @example sanitizeVariantToken("160x230")          // "160X230"
 * @example sanitizeVariantToken("Ø240")             // "D240"
 * @example sanitizeVariantToken("pack_40x50_50x80") // "PACK-40X50-50X80"
 */
export function sanitizeVariantToken(key: string): string {
  return key
    .toUpperCase()
    .replace(/Ø/g, "D")
    .replace(/×/g, "")
    .replace(/\s+/g, "")
    .replace(/_/g, "-");
}

/**
 * SKU de producte: PREFIX + slug en majúscules.
 *
 * @example productSku("catifa", "adore")   // "CAT-ADORE"
 * @example productSku("moble", "grenoble") // "MOB-GRENOBLE"
 * @example productSku("manta", "agra")     // "MAN-AGRA"
 */
export function productSku(type: CatalogType, slug: string): string {
  return `${catalogPrefix(type)}${slug.toUpperCase()}`;
}

/**
 * SKU de variant: SKU de producte + "-" + token de variant. Per a moble el token
 * du el prefix "V" sobre la clau del cistell (índex + dimensió); per a
 * catifa/manta és la mida sanititzada.
 *
 * @example variantSku("catifa", "adore", "160x230")        // "CAT-ADORE-160X230"
 * @example variantSku("moble", "grenoble", "2-120x40x76")  // "MOB-GRENOBLE-V2-120X40X76"
 * @example variantSku("manta", "agra", "130x170")          // "MAN-AGRA-130X170"
 */
export function variantSku(
  type: CatalogType,
  slug: string,
  variantKey: string,
): string {
  const base = productSku(type, slug);
  const token =
    type === "moble"
      ? `V${sanitizeVariantToken(variantKey)}`
      : sanitizeVariantToken(variantKey);
  return `${base}-${token}`;
}

/**
 * Mapeja una ruta o href de producte ("/catifes/adore", "/mobiliari/grenoble")
 * al seu CatalogType. null si la ruta no correspon a cap catàleg conegut.
 */
export function catalogFromPath(path: string): CatalogType | null {
  if (path.includes("/mobiliari/")) return "moble";
  if (path.includes("/catifes/")) return "catifa";
  if (path.includes("/mantes/")) return "manta";
  return null;
}

/**
 * Deriva el SKU (de variant si n'hi ha, de producte altrament) d'una línia del
 * cistell a partir de dades que la línia ja porta: el seu `href` relatiu (per
 * inferir catàleg + slug base) i el seu `slug` compost (la clau de variant és el
 * sufix després de "#"). Retorna null si no es pot inferir el catàleg (p. ex.
 * cistells antics sense href): així el cistell mai es trenca.
 *
 * @example skuFromCartLine("/catifes/adore", "adore#160x230") // "CAT-ADORE-160X230"
 * @example skuFromCartLine("/mobiliari/grenoble", "grenoble#2-120x40x76") // "MOB-GRENOBLE-V2-120X40X76"
 */
export function skuFromCartLine(
  href: string | undefined,
  slug: string,
): string | null {
  if (!href) return null;
  const type = catalogFromPath(href);
  if (!type) return null;
  const baseSlug = href.split("/").filter(Boolean).pop();
  if (!baseSlug) return null;
  const hashIndex = slug.indexOf("#");
  if (hashIndex === -1) return productSku(type, baseSlug);
  const variantKey = slug.slice(hashIndex + 1);
  if (!variantKey) return productSku(type, baseSlug);
  return variantSku(type, baseSlug, variantKey);
}
