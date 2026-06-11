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
export function mantaImage(slug: string): string { return `/images/decoracio/${slug}.png`; }
