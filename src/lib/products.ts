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
