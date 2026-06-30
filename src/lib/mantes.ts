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
  /**
   * Preu anterior real (€) per a rebaixes. OPCIONAL: només quan la manta està
   * realment en oferta. La card mostra el tatxat + -% + preu vermell només si
   * pvpAbans > pvp. LEGAL: ha de ser el preu aplicat els 30 dies previs.
   * Vegeu src/lib/discount.ts.
   */
  pvpAbans?: number;
  /** Nombre de mides disponibles per encàrrec. */
  nMides: number;
  /** Co-marca / fabricant. */
  marca: "Salgueiro Home";
  /**
   * Referència del proveïdor (codi de catàleg del fabricant). OPCIONAL i de
   * moment buida: els catàlegs de proveïdor no porten codi per producte. Quan
   * existeixi, alimenta el `mpn` del JSON-LD. El SKU propi es DERIVA (src/lib/sku.ts).
   */
  supplierRef?: string;
};

// Dades base (sense la marca, que és constant i s'afegeix al map de sota).
type MantaSeed = Omit<Manta, "marca">;

// ⚠️ REBAIXES PLACEHOLDER ⚠️ Els pvpAbans marcats "// PLACEHOLDER" són d'exemple
// perquè Federico vegi el look Kave amb descomptes a mantes. NO són preus reals:
// cal substituir-los pel preu realment aplicat els 30 dies previs (o esborrar-los).
const SEED: MantaSeed[] = [
  { slug: "agra", nom: "Agra", pvp: 52.95, nMides: 1 },
  { slug: "bombaim", nom: "Bombaim", pvp: 99.95, nMides: 1 },
  { slug: "dalin", nom: "Dalin", pvp: 19.95, pvpAbans: 29.95, nMides: 1 }, // PLACEHOLDER
  { slug: "harbin", nom: "Harbin", pvp: 54.95, nMides: 1 },
  { slug: "haryana", nom: "Haryana", pvp: 40.95, nMides: 1 },
  { slug: "riad", nom: "Riad", pvp: 37.95, pvpAbans: 54.95, nMides: 1 }, // PLACEHOLDER
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
