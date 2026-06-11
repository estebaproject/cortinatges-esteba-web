// Registre de decoració (mantes) — Salgueiro Home. Foto de DOCUMENTS/catalogo_2025.pdf,
// preus de DOCUMENTS/P2.json (decoracion_mantas). Només PVP públic (IVA inclòs), MAI cost.
// REGLA DE PREU: pvpDesde = coste · 2,3 · 1,21 (IVA), floor+0,95. Marge 2,3 (provisional,
// igual que catifes; ajustable). Mateix patró que catifes.ts / mobiliari.ts.

export type Manta = { slug: string; nom: string; mida: string; pvpDesde: number; marca: "Salgueiro Home" };
const SEED: Omit<Manta,"marca">[] = [
  { slug: "harbin", nom: "Harbin", mida: "130x170", pvpDesde: 50.95 },
  { slug: "dalin", nom: "Dalin", mida: "130x170", pvpDesde: 17.95 },
  { slug: "bombaim", nom: "Bombaim", mida: "150x200", pvpDesde: 91.95 },
  { slug: "varanasi", nom: "Varanasi", mida: "130x170", pvpDesde: 54.95 },
]
export const MANTES: Manta[] = SEED.map((m) => ({ ...m, marca: "Salgueiro Home" }));

/** Foto de producte principal (4/4 slugs). Era /decoracio/{slug}.png — CORREGIT. */
export function mantaImage(slug: string): string {
  return `/images/decoracio/${slug}/principal.png`;
}

/** Foto d'escena contextual (4/4 slugs). */
export function mantaEscena(slug: string): string {
  return `/images/decoracio/${slug}/escena.png`;
}

/**
 * Llista de slides per a la galeria de la ficha d'una manta.
 * Ordre: escena (cover) → principal (contain).
 */
export function mantaSlides(slug: string, nom: string): import("@/lib/catifes").GallerySlide[] {
  return [
    { src: mantaEscena(slug), alt: nom, kind: "escena", fit: "cover" },
    { src: mantaImage(slug), alt: nom, kind: "producto", fit: "contain" },
  ];
}
