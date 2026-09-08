// Registre únic de productes: les 14 fitxes publicades, amb les imatges
// curades. Els textos viuen a messages/{locale}.json sota el namespace
// "Products" — aquí només l'estructura i els actius.
//
// Les tres últimes (pèrgoles, tendals i tapisseria) venen de la consolidació de
// decoresteba.com. Les seves portades són fotos d'aquell web retallades per
// treure la marca d'aigua «N.» de la casa vella, que hi anava cremada dins de
// la imatge entre el 83% i el 100% de l'alçada. Els originals sencers estan
// guardats fora del repositori, a ~/Desktop/decoresteba-fotos-originals/ amb
// el seu índex: EL SERVIDOR D'ORIGEN NO ÉS NOSTRE i el dia que l'apaguin
// aquelles imatges desapareixeran d'internet sense avís.

export type Product = {
  slug: string;
  /** Carpeta dins /public/images/products/{slug}/ amb 1.jpg (hero) + galeria. */
  gallery: number;
  /** Marques/teles associades, per a la fitxa. */
  brands?: string[];
};

export const PRODUCTS: Product[] = [
  { slug: "tradicional", gallery: 4, brands: ["Designers Guild", "Romo", "Aldeco"] },
  { slug: "estor-paquet", gallery: 1 },
  { slug: "estor-enrotllable", gallery: 4, brands: ["Bandalux", "Vertisol"] },
  { slug: "panell-japones", gallery: 4 },
  { slug: "veneciana-alumini", gallery: 2 },
  { slug: "veneciana-fusta", gallery: 2 },
  { slug: "prisada", gallery: 4 },
  { slug: "vertical", gallery: 4 },
  { slug: "nit-i-dia", gallery: 3 },
  { slug: "mosquitera", gallery: 4, brands: ["EPID"] },
  { slug: "motoritzacio", gallery: 2, brands: ["Somfy"] },
  // Primera fitxa consolidada de decoresteba.com. La portada surt d'una foto
  // seva (correder_11), retallada per treure-hi la marca d'aigua de la casa
  // vella: v. el comentari de DRAFT_PRODUCTS aquí sota.
  { slug: "pergoles", gallery: 1 },
  { slug: "tendals", gallery: 1 },
  { slug: "tapisseria", gallery: 1 },
];

/**
 * Fitxa EN PREPARACIÓ — l'última de la consolidació de decoresteba.com.
 *
 * NO estan a `PRODUCTS` A PROPÒSIT. Tot el web consumeix `PRODUCTS` o
 * `PRODUCT_SLUGS`, de manera que mentre siguin aquí:
 *   · no surten al sitemap
 *   · no es generen estàticament (les seves URLs fan 404)
 *   · no apareixen ni a la graella de la portada ni a "altres col·leccions"
 *
 * PER A PUBLICAR-LES, quan el contingut i les fotos estiguin llestos:
 *   1. Omplir Products.{slug} a messages/*.json (els 4 idiomes).
 *   2. Posar-hi almenys UNA foto a public/images/products/{slug}/1.jpg i
 *      ajustar `gallery`. Sense hero la plantilla peta:
 *      `const [hero, ...gallery] = images`.
 *   3. Moure l'entrada d'aquest array a PRODUCTS.
 *   4. NOMÉS DESPRÉS, redirigir decoresteba.com. Mai les dues webs vives
 *      amb el mateix text.
 */
export const DRAFT_PRODUCTS: Product[] = [
  // MOQUETES ESTÀ AQUÍ PERQUÈ NO EN TENIM FOTOS, no perquè falti el text.
  // La secció /moquetas/ de decoresteba té 29 imatges i CAP és de moqueta:
  // comprovat pels noms de fitxer, no només pels `alt` — són 11 de tendals,
  // 7 de correder, 3 de parasols, i la resta de tapisseria, persianes,
  // mosquiteres i cortines. No hi ha ni un sol `tap_n.esteba_moquet*`.
  // Mentre no es facin fotos noves, aquesta fitxa no es pot publicar: seria
  // una pàgina de moquetes il·lustrada amb tendals.
  //
  // EL TEXT JA HI ÉS A MITGES: els specs porten les sis fibres que llistava el
  // web vell (polipropilè, llana, niló, acríliques, vegetals i polièster). El
  // que falta és la prosa i, sobretot, les fotos.
  //
  // La ruta ja existeix a routing.ts amb els quatre slugs. Mentrestant
  // /moquetas/ de decoresteba va a la graella de productes de la portada: NO a
  // /es/catifes, que és noindex i Disallow al robots mentre la botiga no es
  // publiqui, i un 301 cap allà llençaria el senyal.
  { slug: "moquetes", gallery: 0 },
];

export const PRODUCT_SLUGS = PRODUCTS.map((p) => p.slug);

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

/** Rutes d'imatge d'un producte: ["/images/products/{slug}/1.jpg", ...]. */
export function productImages(p: Product): string[] {
  return Array.from(
    { length: p.gallery },
    (_, i) => `/images/products/${p.slug}/${i + 1}.jpg`,
  );
}

export function productHero(slug: string): string {
  return `/images/products/${slug}/1.jpg`;
}
