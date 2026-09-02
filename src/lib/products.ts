// Registre únic de productes (model híbrid): les 10 categories reals de la web
// actual, amb les imatges curades. Els textos viuen a messages/{locale}.json
// sota el namespace "Products" — aquí només l'estructura i els actius.

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
];

/**
 * Fitxes EN PREPARACIÓ — consolidació de decoresteba.com (la societat de
 * l'oncle, que passa a Cortinatges Esteba).
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
  { slug: "tendals", gallery: 0 },
  // Ja té la foto de portada (pas 2 de la llista de dalt): 707x560, la de
  // Bandalux. `gallery: 1` és el TOTAL incloent-hi la portada, o sigui que
  // `productImages` retorna només `1.jpg` i no hi ha secció de galeria.
  // SEGUEIX SENSE PUBLICAR: falta el pas 1, el text de `Products.pergoles`,
  // que en català és tot cadenes buides i en es/en/fr ni hi és.
  { slug: "pergoles", gallery: 1 },
  { slug: "tapisseria", gallery: 0 },
  // MOQUETES ESTÀ AQUÍ PERQUÈ NO EN TENIM FOTOS, no perquè falti el text.
  // La secció /moquetas/ de decoresteba té 29 imatges i CAP és de moqueta:
  // comprovat pels noms de fitxer, no només pels `alt` — són 11 de tendals,
  // 7 de correder, 3 de parasols, i la resta de tapisseria, persianes,
  // mosquiteres i cortines. No hi ha ni un sol `tap_n.esteba_moquet*`.
  // Mentre no es facin fotos noves, aquesta fitxa no es pot publicar: seria
  // una pàgina de moquetes il·lustrada amb tendals.
  //
  // La ruta SÍ que existeix ja a routing.ts, amb els quatre slugs, perquè el
  // dia que hi hagi material només calgui escriure el text i moure aquesta
  // línia a PRODUCTS. Mentrestant /moquetas/ de decoresteba redirigeix a
  // /es/catifes, que és el parent temàtic més proper.
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
