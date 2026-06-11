// Registre de catifes (alfombres) — co-marca Salgueiro Home. Generat des de
// DOCUMENTS/_catalog_extract/master_catalog.json (macro == "rugs", només les que
// tenen foto). Aquí viu només l'estructura i el preu públic (PVP, IVA inclòs);
// MAI el cost intern. Els noms de model són noms propis i no es tradueixen.
// Mateix patró que src/lib/products.ts.
//
// REGLA DE PREU (acordada amb Federico): pvpDesde = coste_min · 2,3 · 1,21 (IVA
// 21%), arrodonit a baix d'euro + 0,95. coste_min ve de DOCUMENTS/P2.json
// (Tarifa Coste 2026 Salgueiro). Marge 2,3 (no 2,5). Per recalcular, regenerar
// amb aquesta fórmula; no editar preus a mà.

/** Famílies de catàleg de Salgueiro Home. */
export type CatifaFamilia =
  | "catalogo"
  | "in_out"
  | "kids_collection"
  | "bath_collection";

export type Catifa = {
  slug: string;
  /** Nom propi del model (no es tradueix). */
  nom: string;
  familia: CatifaFamilia;
  /** Preu públic «des de», IVA inclòs (€). null si encara no informat. */
  pvpDesde: number | null;
  /** Nombre de mesures disponibles per encàrrec. */
  nMedides: number;
  /** Co-marca / fabricant. */
  marca: "Salgueiro Home";
};

// Dades base (sense la marca, que és constant i s'afegeix al map de sota).
type CatifaSeed = Omit<Catifa, "marca">;

const SEED: CatifaSeed[] = [
  { slug: "adore", nom: "Adore", familia: "catalogo", pvpDesde: 94.95, nMedides: 4 },
  { slug: "almeria", nom: "Almeria", familia: "catalogo", pvpDesde: 37.95, nMedides: 6 },
  { slug: "almond-chenille", nom: "Almond Chenille", familia: "catalogo", pvpDesde: 286.95, nMedides: 7 },
  { slug: "ametist-chenille", nom: "Ametist Chenille", familia: "catalogo", pvpDesde: 297.95, nMedides: 4 },
  { slug: "antik-canvas", nom: "Antik Canvas", familia: "catalogo", pvpDesde: 62.95, nMedides: 4 },
  { slug: "antik-chenille", nom: "Antik Chenille", familia: "catalogo", pvpDesde: 87.95, nMedides: 7 },
  { slug: "antik-cloud", nom: "Antik Cloud", familia: "catalogo", pvpDesde: 87.95, nMedides: 7 },
  { slug: "antik-tebas", nom: "Antik Tebas", familia: "catalogo", pvpDesde: 87.95, nMedides: 6 },
  { slug: "batik", nom: "Batik", familia: "catalogo", pvpDesde: 62.95, nMedides: 5 },
  { slug: "belize", nom: "Belize", familia: "in_out", pvpDesde: 72.95, nMedides: 4 },
  { slug: "bliss", nom: "Bliss", familia: "catalogo", pvpDesde: 297.95, nMedides: 4 },
  { slug: "boheme", nom: "Boheme", familia: "catalogo", pvpDesde: 45.95, nMedides: 7 },
  { slug: "bohemian", nom: "Bohemian", familia: "catalogo", pvpDesde: 45.95, nMedides: 7 },
  { slug: "boho", nom: "Boho", familia: "catalogo", pvpDesde: 121.95, nMedides: 5 },
  { slug: "bosco", nom: "Bosco", familia: "catalogo", pvpDesde: 95.95, nMedides: 5 },
  { slug: "buckley", nom: "Buckley", familia: "catalogo", pvpDesde: 103.95, nMedides: 5 },
  { slug: "bukhara", nom: "Bukhara", familia: "catalogo", pvpDesde: 105.95, nMedides: 5 },
  { slug: "burma", nom: "Burma", familia: "catalogo", pvpDesde: 297.95, nMedides: 4 },
  { slug: "caban-kilim", nom: "Caban Kilim", familia: "catalogo", pvpDesde: 34.95, nMedides: 5 },
  { slug: "camille", nom: "Camille", familia: "catalogo", pvpDesde: 152.95, nMedides: 5 },
  { slug: "carrara-chenille", nom: "Carrara Chenille", familia: "catalogo", pvpDesde: 281.95, nMedides: 4 },
  { slug: "cloud-chenille", nom: "Cloud Chenille", familia: "catalogo", pvpDesde: 286.95, nMedides: 6 },
  { slug: "colorful", nom: "Colorful", familia: "kids_collection", pvpDesde: 113.95, nMedides: 3 },
  { slug: "corinto", nom: "Corinto", familia: "in_out", pvpDesde: 86.95, nMedides: 6 },
  { slug: "cubist-chenille", nom: "Cubist Chenille", familia: "catalogo", pvpDesde: 333.95, nMedides: 7 },
  { slug: "dallas", nom: "Dallas", familia: "in_out", pvpDesde: 54.95, nMedides: 6 },
  { slug: "denon", nom: "Denon", familia: "in_out", pvpDesde: 46.95, nMedides: 6 },
  { slug: "edges-chenille", nom: "Edges Chenille", familia: "catalogo", pvpDesde: 286.95, nMedides: 7 },
  { slug: "fez", nom: "Fez", familia: "catalogo", pvpDesde: 167.95, nMedides: 5 },
  { slug: "gallery-chenille", nom: "Gallery Chenille", familia: "catalogo", pvpDesde: 281.95, nMedides: 4 },
  { slug: "garden-chenille", nom: "Garden Chenille", familia: "in_out", pvpDesde: 135.95, nMedides: 4 },
  { slug: "glam-velvet", nom: "Glam Velvet", familia: "catalogo", pvpDesde: null, nMedides: 0 },
  { slug: "gradient-chenille", nom: "Gradient Chenille", familia: "catalogo", pvpDesde: 281.95, nMedides: 4 },
  { slug: "gropius-chenille", nom: "Gropius Chenille", familia: "catalogo", pvpDesde: 286.95, nMedides: 6 },
  { slug: "heritage-chenille", nom: "Heritage Chenille", familia: "catalogo", pvpDesde: 635.95, nMedides: 5 },
  { slug: "himalaya", nom: "Himalaya", familia: "catalogo", pvpDesde: 374.95, nMedides: 4 },
  { slug: "jambi", nom: "Jambi", familia: "catalogo", pvpDesde: 124.95, nMedides: 9 },
  { slug: "jaspe", nom: "Jaspe", familia: "catalogo", pvpDesde: 153.95, nMedides: 6 },
  { slug: "junko", nom: "Junko", familia: "in_out", pvpDesde: 74.95, nMedides: 4 },
  { slug: "kira", nom: "Kira", familia: "catalogo", pvpDesde: 152.95, nMedides: 7 },
  { slug: "lace-chenille", nom: "Lace Chenille", familia: "catalogo", pvpDesde: 286.95, nMedides: 7 },
  { slug: "lake-chenille", nom: "Lake Chenille", familia: "catalogo", pvpDesde: 297.95, nMedides: 4 },
  { slug: "magritt", nom: "Magritt", familia: "catalogo", pvpDesde: 281.95, nMedides: 4 },
  { slug: "malmo", nom: "Malmo", familia: "catalogo", pvpDesde: 137.95, nMedides: 5 },
  { slug: "marne", nom: "Marne", familia: "catalogo", pvpDesde: 62.95, nMedides: 5 },
  { slug: "miura", nom: "Miura", familia: "catalogo", pvpDesde: 513.95, nMedides: 3 },
  { slug: "monetti", nom: "Monetti", familia: "catalogo", pvpDesde: 152.95, nMedides: 7 },
  { slug: "moon-chenille", nom: "Moon Chenille", familia: "catalogo", pvpDesde: 286.95, nMedides: 7 },
  { slug: "mori", nom: "Mori", familia: "catalogo", pvpDesde: 513.95, nMedides: 3 },
  { slug: "nagano", nom: "Nagano", familia: "catalogo", pvpDesde: 140.95, nMedides: 4 },
  { slug: "namur", nom: "Namur", familia: "catalogo", pvpDesde: 88.95, nMedides: 5 },
  { slug: "nassau", nom: "Nassau", familia: "in_out", pvpDesde: 161.95, nMedides: 4 },
  { slug: "natural-dots", nom: "Natural Dots", familia: "catalogo", pvpDesde: 417.95, nMedides: 3 },
  { slug: "natural-link", nom: "Natural Link", familia: "catalogo", pvpDesde: 298.95, nMedides: 3 },
  { slug: "ombre-chenille", nom: "Ombre Chenille", familia: "in_out", pvpDesde: 135.95, nMedides: 4 },
  { slug: "papua", nom: "Papua", familia: "catalogo", pvpDesde: 433.95, nMedides: 4 },
  { slug: "pinot", nom: "Pinot", familia: "catalogo", pvpDesde: 57.95, nMedides: 5 },
  { slug: "polo", nom: "Polo", familia: "catalogo", pvpDesde: 106.95, nMedides: 4 },
  { slug: "rainbow", nom: "Rainbow", familia: "in_out", pvpDesde: 45.95, nMedides: 5 },
  { slug: "rustik-chenille", nom: "Rustik Chenille", familia: "catalogo", pvpDesde: 286.95, nMedides: 6 },
  { slug: "sahara", nom: "Sahara", familia: "catalogo", pvpDesde: 189.95, nMedides: 4 },
  { slug: "samba", nom: "Samba", familia: "catalogo", pvpDesde: 100.95, nMedides: 5 },
  { slug: "sandalo", nom: "Sandalo", familia: "in_out", pvpDesde: 175.95, nMedides: 4 },
  { slug: "santiago", nom: "Santiago", familia: "in_out", pvpDesde: 86.95, nMedides: 5 },
  { slug: "sisalana", nom: "Sisalana", familia: "in_out", pvpDesde: 66.95, nMedides: 6 },
  { slug: "sultana", nom: "Sultana", familia: "catalogo", pvpDesde: 87.95, nMedides: 3 },
  { slug: "tatami", nom: "Tatami", familia: "in_out", pvpDesde: 75.95, nMedides: 6 },
  { slug: "tatami-design", nom: "Tatami Design", familia: "in_out", pvpDesde: 75.95, nMedides: 5 },
  { slug: "tender", nom: "Tender", familia: "catalogo", pvpDesde: 43.95, nMedides: 6 },
  { slug: "touch", nom: "Touch", familia: "catalogo", pvpDesde: 64.95, nMedides: 12 },
  { slug: "varadero", nom: "Varadero", familia: "in_out", pvpDesde: 86.95, nMedides: 6 },
  { slug: "vegas", nom: "Vegas", familia: "catalogo", pvpDesde: 118.95, nMedides: 5 },
  { slug: "veneza", nom: "Veneza", familia: "bath_collection", pvpDesde: 24.95, nMedides: 2 },
  { slug: "viena", nom: "Viena", familia: "bath_collection", pvpDesde: 29.95, nMedides: 2 },
  { slug: "vienciana", nom: "Vienciana", familia: "bath_collection", pvpDesde: 18.95, nMedides: 1 },
  { slug: "zen", nom: "Zen", familia: "catalogo", pvpDesde: 77.95, nMedides: 6 },
];

export const CATIFES: Catifa[] = SEED.map((c) => ({
  ...c,
  marca: "Salgueiro Home" as const,
}));

export const CATIFA_SLUGS = CATIFES.map((c) => c.slug);

/** Ordre estable de les famílies per agrupar/filtrar a la UI. */
export const CATIFA_FAMILIES: CatifaFamilia[] = [
  "catalogo",
  "in_out",
  "kids_collection",
  "bath_collection",
];

export function getCatifa(slug: string): Catifa | undefined {
  return CATIFES.find((c) => c.slug === slug);
}

/** Ruta del hero d'una catifa: "/images/catifes/{slug}/1.jpg". */
export function catifaImage(slug: string): string {
  return `/images/catifes/${slug}/1.jpg`;
}

// ---------------------------------------------------------------------------
// Manifests estàtics d'assets (auditades manualment; NO detecció runtime).
// Actualitzar si s'afegeixen fotos noves al repo.
// ---------------------------------------------------------------------------

/** Slugs que tenen foto de producte (2.jpg). 72 de 76. */
export const CATIFA_HAS_PRODUCTO = new Set<string>([
  "adore", "almeria", "almond-chenille", "ametist-chenille", "antik-canvas",
  "antik-cloud", "antik-tebas", "batik", "belize", "bliss", "boheme",
  "bohemian", "bosco", "bukhara", "burma", "caban-kilim", "camille",
  "carrara-chenille", "cloud-chenille", "colorful", "corinto",
  "cubist-chenille", "dallas", "denon", "edges-chenille", "fez",
  "gallery-chenille", "garden-chenille", "glam-velvet", "gradient-chenille",
  "gropius-chenille", "heritage-chenille", "himalaya", "jaspe", "junko",
  "kira", "lace-chenille", "lake-chenille", "magritt", "marne", "miura",
  "monetti", "moon-chenille", "mori", "nagano", "namur", "nassau",
  "natural-dots", "natural-link", "ombre-chenille", "papua", "pinot", "polo",
  "rainbow", "rustik-chenille", "sahara", "samba", "sandalo", "santiago",
  "sisalana", "sultana", "tatami", "tatami-design", "tender", "touch",
  "varadero", "vegas", "veneza", "viena", "vienciana", "zen",
]);

/** Slugs que tenen foto de detall (3.jpg). 53 de 76. */
export const CATIFA_HAS_DETALL = new Set<string>([
  "adore", "almeria", "almond-chenille", "ametist-chenille", "antik-tebas",
  "batik", "belize", "bliss", "boheme", "bohemian", "bosco", "burma",
  "caban-kilim", "camille", "carrara-chenille", "cloud-chenille", "colorful",
  "cubist-chenille", "dallas", "denon", "edges-chenille", "gallery-chenille",
  "garden-chenille", "gropius-chenille", "heritage-chenille", "himalaya",
  "junko", "lace-chenille", "lake-chenille", "marne", "miura", "mori",
  "namur", "nassau", "natural-dots", "ombre-chenille", "papua", "pinot",
  "polo", "rainbow", "rustik-chenille", "sahara", "samba", "sandalo",
  "santiago", "sisalana", "tatami-design", "tatami", "tender", "varadero",
  "veneza", "viena", "vienciana", "zen",
]);

// ---------------------------------------------------------------------------
// Helpers de ruta d'imatge (server-safe, client-safe)
// ---------------------------------------------------------------------------

/** Escena (1.jpg) — sempre existeix. */
export function catifaEscena(slug: string): string {
  return `/images/catifes/${slug}/1.jpg`;
}

/** Foto de producte (2.jpg) o null si no existeix per a aquest slug. */
export function catifaProducto(slug: string): string | null {
  return CATIFA_HAS_PRODUCTO.has(slug)
    ? `/images/catifes/${slug}/2.jpg`
    : null;
}

/** Foto de detall (3.jpg) o null si no existeix per a aquest slug. */
export function catifaDetall(slug: string): string | null {
  return CATIFA_HAS_DETALL.has(slug)
    ? `/images/catifes/${slug}/3.jpg`
    : null;
}

// ---------------------------------------------------------------------------
// GallerySlide — importat aquí per evitar import circular amb ProductGallery.
// ProductGallery importarà GallerySlide des d'aquí o des de shop-families.
// ---------------------------------------------------------------------------
export type GallerySlide = {
  src: string;
  alt: string;
  kind: "escena" | "producto" | "detall" | "color";
  colorSlug?: string;
  fit?: "cover" | "contain";
};

/**
 * Llista de slides per a la galeria de la ficha d'una catifa.
 * Ordre: escena (cover) → producto (contain) → detall (contain).
 * Omets els slides inexistents (mai thumbnails morts).
 */
export function catifaSlides(slug: string, nom: string): GallerySlide[] {
  const slides: GallerySlide[] = [
    { src: catifaEscena(slug), alt: nom, kind: "escena", fit: "cover" },
  ];
  const producto = catifaProducto(slug);
  if (producto) {
    slides.push({ src: producto, alt: nom, kind: "producto", fit: "contain" });
  }
  const detall = catifaDetall(slug);
  if (detall) {
    slides.push({ src: detall, alt: nom, kind: "detall", fit: "contain" });
  }
  return slides;
}
