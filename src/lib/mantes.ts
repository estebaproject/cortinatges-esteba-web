// Registre de mantes (mantas / plaids) — co-marca Salgueiro Home. Generat des de
// DOCUMENTS/_decor/mantes.json (només les que tenen foto). Aquí viu només
// l'estructura i el preu públic (PVP, IVA inclòs); MAI el cost intern. Els noms
// de model són noms propis i no es tradueixen.
// Mateix patró minimalista que src/lib/mobiliari.ts i src/lib/catifes.ts.

export type Manta = {
  slug: string;
  /** Nom propi del model (no es tradueix). */
  nom: string;
  /** Preu públic «des de», IVA inclòs (€). */
  pvp: number;
  /** Nombre de mides disponibles per encàrrec. */
  nMides: number;
  /** Co-marca / fabricant. */
  marca: "Salgueiro Home";
};

// Dades base (sense la marca, que és constant i s'afegeix al map de sota).
type MantaSeed = Omit<Manta, "marca">;

const SEED: MantaSeed[] = [
  { slug: "agra", nom: "Agra", pvp: 52.95, nMides: 1 },
  { slug: "bombaim", nom: "Bombaim", pvp: 99.95, nMides: 1 },
  { slug: "dalin", nom: "Dalin", pvp: 19.95, nMides: 1 },
  { slug: "harbin", nom: "Harbin", pvp: 54.95, nMides: 1 },
  { slug: "haryana", nom: "Haryana", pvp: 40.95, nMides: 1 },
  { slug: "riad", nom: "Riad", pvp: 37.95, nMides: 1 },
  { slug: "surate", nom: "Surate", pvp: 45.95, nMides: 1 },
  { slug: "varanasi", nom: "Varanasi", pvp: 58.95, nMides: 1 },
];

export const MANTES: Manta[] = SEED.map((m) => ({
  ...m,
  marca: "Salgueiro Home" as const,
}));

export const MANTA_SLUGS = MANTES.map((m) => m.slug);

export function getManta(slug: string): Manta | undefined {
  return MANTES.find((m) => m.slug === slug);
}

/** Ruta del hero d'una manta: "/images/decor/{slug}/1.jpg". */
export function mantaImage(slug: string): string {
  return `/images/decor/${slug}/1.jpg`;
}
