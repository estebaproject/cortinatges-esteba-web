// Registre de catifes (alfombres) — co-marca Salgueiro Home. Generat des de
// DOCUMENTS/_catalog_extract/master_catalog.json (macro == "rugs", només les que
// tenen foto). Aquí viu només l'estructura i el preu públic (PVP, IVA inclòs);
// MAI el cost intern. Els noms de model són noms propis i no es tradueixen.
// Mateix patró que src/lib/products.ts.

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
  { slug: "adore", nom: "Adore", familia: "catalogo", pvpDesde: 102.95, nMedides: 4 },
  { slug: "almeria", nom: "Almeria", familia: "catalogo", pvpDesde: 40.95, nMedides: 6 },
  { slug: "almond-chenille", nom: "Almond Chenille", familia: "catalogo", pvpDesde: 311.9, nMedides: 7 },
  { slug: "ametist-chenille", nom: "Ametist Chenille", familia: "catalogo", pvpDesde: 323.95, nMedides: 4 },
  { slug: "antik-canvas", nom: "Antik Canvas", familia: "catalogo", pvpDesde: 67.95, nMedides: 4 },
  { slug: "antik-chenille", nom: "Antik Chenille", familia: "catalogo", pvpDesde: 94.95, nMedides: 7 },
  { slug: "antik-cloud", nom: "Antik Cloud", familia: "catalogo", pvpDesde: 94.95, nMedides: 7 },
  { slug: "antik-tebas", nom: "Antik Tebas", familia: "catalogo", pvpDesde: 94.95, nMedides: 6 },
  { slug: "batik", nom: "Batik", familia: "catalogo", pvpDesde: 67.95, nMedides: 5 },
  { slug: "belize", nom: "Belize", familia: "in_out", pvpDesde: 79.9, nMedides: 4 },
  { slug: "bliss", nom: "Bliss", familia: "catalogo", pvpDesde: 323.95, nMedides: 4 },
  { slug: "boheme", nom: "Boheme", familia: "catalogo", pvpDesde: 49.9, nMedides: 7 },
  { slug: "bohemian", nom: "Bohemian", familia: "catalogo", pvpDesde: 49.9, nMedides: 7 },
  { slug: "boho", nom: "Boho", familia: "catalogo", pvpDesde: 131.95, nMedides: 5 },
  { slug: "bosco", nom: "Bosco", familia: "catalogo", pvpDesde: 104.9, nMedides: 5 },
  { slug: "buckley", nom: "Buckley", familia: "catalogo", pvpDesde: 112.95, nMedides: 5 },
  { slug: "bukhara", nom: "Bukhara", familia: "catalogo", pvpDesde: 114.95, nMedides: 5 },
  { slug: "burma", nom: "Burma", familia: "catalogo", pvpDesde: 323.95, nMedides: 4 },
  { slug: "caban-kilim", nom: "Caban Kilim", familia: "catalogo", pvpDesde: 37.95, nMedides: 5 },
  { slug: "camille", nom: "Camille", familia: "catalogo", pvpDesde: 165.95, nMedides: 5 },
  { slug: "carrara-chenille", nom: "Carrara Chenille", familia: "catalogo", pvpDesde: 305.95, nMedides: 4 },
  { slug: "cloud-chenille", nom: "Cloud Chenille", familia: "catalogo", pvpDesde: 311.9, nMedides: 6 },
  { slug: "colorful", nom: "Colorful", familia: "kids_collection", pvpDesde: 123.95, nMedides: 3 },
  { slug: "corinto", nom: "Corinto", familia: "in_out", pvpDesde: 94.9, nMedides: 6 },
  { slug: "cubist-chenille", nom: "Cubist Chenille", familia: "catalogo", pvpDesde: 363.95, nMedides: 7 },
  { slug: "dallas", nom: "Dallas", familia: "in_out", pvpDesde: 58.95, nMedides: 6 },
  { slug: "denon", nom: "Denon", familia: "in_out", pvpDesde: 50.95, nMedides: 6 },
  { slug: "edges-chenille", nom: "Edges Chenille", familia: "catalogo", pvpDesde: 311.9, nMedides: 7 },
  { slug: "fez", nom: "Fez", familia: "catalogo", pvpDesde: 182.9, nMedides: 5 },
  { slug: "gallery-chenille", nom: "Gallery Chenille", familia: "catalogo", pvpDesde: 305.95, nMedides: 4 },
  { slug: "garden-chenille", nom: "Garden Chenille", familia: "in_out", pvpDesde: 147.9, nMedides: 4 },
  { slug: "glam-velvet", nom: "Glam Velvet", familia: "catalogo", pvpDesde: null, nMedides: 0 },
  { slug: "gradient-chenille", nom: "Gradient Chenille", familia: "catalogo", pvpDesde: 305.95, nMedides: 4 },
  { slug: "gropius-chenille", nom: "Gropius Chenille", familia: "catalogo", pvpDesde: 311.9, nMedides: 6 },
  { slug: "heritage-chenille", nom: "Heritage Chenille", familia: "catalogo", pvpDesde: 691.9, nMedides: 5 },
  { slug: "himalaya", nom: "Himalaya", familia: "catalogo", pvpDesde: 407.95, nMedides: 4 },
  { slug: "jambi", nom: "Jambi", familia: "catalogo", pvpDesde: 135.95, nMedides: 9 },
  { slug: "jaspe", nom: "Jaspe", familia: "catalogo", pvpDesde: 166.95, nMedides: 6 },
  { slug: "junko", nom: "Junko", familia: "in_out", pvpDesde: 80.95, nMedides: 4 },
  { slug: "kira", nom: "Kira", familia: "catalogo", pvpDesde: 165.95, nMedides: 7 },
  { slug: "lace-chenille", nom: "Lace Chenille", familia: "catalogo", pvpDesde: 311.9, nMedides: 7 },
  { slug: "lake-chenille", nom: "Lake Chenille", familia: "catalogo", pvpDesde: 323.95, nMedides: 4 },
  { slug: "magritt", nom: "Magritt", familia: "catalogo", pvpDesde: 305.95, nMedides: 4 },
  { slug: "malmo", nom: "Malmo", familia: "catalogo", pvpDesde: 149.9, nMedides: 5 },
  { slug: "marne", nom: "Marne", familia: "catalogo", pvpDesde: 67.95, nMedides: 5 },
  { slug: "miura", nom: "Miura", familia: "catalogo", pvpDesde: 558.9, nMedides: 3 },
  { slug: "monetti", nom: "Monetti", familia: "catalogo", pvpDesde: 165.95, nMedides: 7 },
  { slug: "moon-chenille", nom: "Moon Chenille", familia: "catalogo", pvpDesde: 311.9, nMedides: 7 },
  { slug: "mori", nom: "Mori", familia: "catalogo", pvpDesde: 558.9, nMedides: 3 },
  { slug: "nagano", nom: "Nagano", familia: "catalogo", pvpDesde: 152.95, nMedides: 4 },
  { slug: "namur", nom: "Namur", familia: "catalogo", pvpDesde: 96.95, nMedides: 5 },
  { slug: "nassau", nom: "Nassau", familia: "in_out", pvpDesde: 175.9, nMedides: 4 },
  { slug: "natural-dots", nom: "Natural Dots", familia: "catalogo", pvpDesde: 454.9, nMedides: 3 },
  { slug: "natural-link", nom: "Natural Link", familia: "catalogo", pvpDesde: 324.9, nMedides: 3 },
  { slug: "ombre-chenille", nom: "Ombre Chenille", familia: "in_out", pvpDesde: 147.9, nMedides: 4 },
  { slug: "papua", nom: "Papua", familia: "catalogo", pvpDesde: 470.95, nMedides: 4 },
  { slug: "pinot", nom: "Pinot", familia: "catalogo", pvpDesde: 62.95, nMedides: 5 },
  { slug: "polo", nom: "Polo", familia: "catalogo", pvpDesde: 115.9, nMedides: 4 },
  { slug: "rainbow", nom: "Rainbow", familia: "in_out", pvpDesde: 49.95, nMedides: 5 },
  { slug: "rustik-chenille", nom: "Rustik Chenille", familia: "catalogo", pvpDesde: 311.9, nMedides: 6 },
  { slug: "sahara", nom: "Sahara", familia: "catalogo", pvpDesde: 205.95, nMedides: 4 },
  { slug: "samba", nom: "Samba", familia: "catalogo", pvpDesde: 109.95, nMedides: 5 },
  { slug: "sandalo", nom: "Sandalo", familia: "in_out", pvpDesde: 191.9, nMedides: 4 },
  { slug: "santiago", nom: "Santiago", familia: "in_out", pvpDesde: 94.9, nMedides: 5 },
  { slug: "sisalana", nom: "Sisalana", familia: "in_out", pvpDesde: 71.95, nMedides: 6 },
  { slug: "sultana", nom: "Sultana", familia: "catalogo", pvpDesde: 94.95, nMedides: 3 },
  { slug: "tatami", nom: "Tatami", familia: "in_out", pvpDesde: 81.95, nMedides: 6 },
  { slug: "tatami-design", nom: "Tatami Design", familia: "in_out", pvpDesde: 81.95, nMedides: 5 },
  { slug: "tender", nom: "Tender", familia: "catalogo", pvpDesde: 47.95, nMedides: 6 },
  { slug: "touch", nom: "Touch", familia: "catalogo", pvpDesde: 69.95, nMedides: 12 },
  { slug: "varadero", nom: "Varadero", familia: "in_out", pvpDesde: 94.9, nMedides: 6 },
  { slug: "vegas", nom: "Vegas", familia: "catalogo", pvpDesde: 128.95, nMedides: 5 },
  { slug: "veneza", nom: "Veneza", familia: "bath_collection", pvpDesde: 26.9, nMedides: 2 },
  { slug: "viena", nom: "Viena", familia: "bath_collection", pvpDesde: 31.95, nMedides: 2 },
  { slug: "vienciana", nom: "Vienciana", familia: "bath_collection", pvpDesde: 20.95, nMedides: 1 },
  { slug: "zen", nom: "Zen", familia: "catalogo", pvpDesde: 84.95, nMedides: 6 },
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
