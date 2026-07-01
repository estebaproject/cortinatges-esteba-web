// Registre de mobiliari (mobles) — co-marca Salgueiro Home. Generat des de
// DOCUMENTS/_mob/mobiliari.json (només les peces que tenen foto, img:true).
// Aquí viu només l'estructura i el preu públic (PVP, IVA inclòs); MAI el cost
// intern. Els noms de model són noms propis i no es tradueixen.
// Mateix patró minimalista que src/lib/catifes.ts.

/** Categories de mobiliari de Salgueiro Home. */
export type MobleCat = "cadira" | "butaca" | "pouf" | "moble";

export type Moble = {
  slug: string;
  /** Nom propi del model (no es tradueix). */
  nom: string;
  cat: MobleCat;
  /** Preu públic, IVA inclòs (€). Per a "moble" és un «des de» (famílies). */
  pvp: number;
  /**
   * Preu anterior real (€) per a rebaixes. OPCIONAL: només quan la peça està
   * realment en oferta. La card mostra el tatxat + -% + preu vermell només si
   * pvpAbans > pvp. LEGAL: ha de ser el preu aplicat els 30 dies previs.
   * Vegeu src/lib/discount.ts.
   */
  pvpAbans?: number;
  /** Co-marca / fabricant. */
  marca: "Cortinatges Esteba";
  /**
   * Referència del proveïdor (codi de catàleg del fabricant). OPCIONAL i de
   * moment buida: els catàlegs de proveïdor no porten codi per producte. Quan
   * existeixi, alimenta el `mpn` del JSON-LD. El SKU propi es DERIVA (src/lib/sku.ts).
   */
  supplierRef?: string;
};

// Dades base (sense la marca, que és constant i s'afegeix al map de sota).
type MobleSeed = Omit<Moble, "marca">;

// Nota sobre slugs: el nom "Arles" existeix com a cadira i com a butaca a
// l'origen. Per garantir slugs únics (routing + carpeta d'imatge) la cadira
// manté "arles" i la butaca passa a "arles-butaca"; ambdues comparteixen la
// mateixa foto hero (/images/mobiliari/arles*/1.jpg, copiada a cada carpeta).
// Sense rebaixes actives: tots els mobles es venen al preu original. Si algun dia
// hi ha una oferta REAL, afegir pvpAbans (preu realment aplicat els 30 dies previs,
// art. 20 LOCM) i la card ja pinta el descompte a /rebaixes.
const SEED: MobleSeed[] = [
  // --- Cadires ---
  { slug: "annecy", nom: "Annecy", cat: "cadira", pvp: 318.95 },
  { slug: "arles", nom: "Arles", cat: "cadira", pvp: 329.95 },
  { slug: "calais", nom: "Calais", cat: "cadira", pvp: 90.95 },
  { slug: "cambrai", nom: "Cambrai", cat: "cadira", pvp: 273.95 },
  { slug: "dijon", nom: "Dijon", cat: "cadira", pvp: 287.95 },
  { slug: "grenoble", nom: "Grenoble", cat: "cadira", pvp: 65.95 },
  { slug: "limoges", nom: "Limoges", cat: "cadira", pvp: 153.95 },
  { slug: "loriente", nom: "Loriente", cat: "cadira", pvp: 125.95 },
  { slug: "nice", nom: "Nice", cat: "cadira", pvp: 460.95 },
  { slug: "nimes", nom: "Nimes", cat: "cadira", pvp: 151.95 },
  { slug: "pantin", nom: "Pantin", cat: "cadira", pvp: 147.95 },
  { slug: "rochelle", nom: "Rochelle", cat: "cadira", pvp: 156.95 },
  { slug: "scandinave-ii", nom: "Scandinave II", cat: "cadira", pvp: 63.95 },
  { slug: "sevres", nom: "Sevres", cat: "cadira", pvp: 225.95 },
  { slug: "toulouse", nom: "Toulouse", cat: "cadira", pvp: 265.95 },
  { slug: "sg-vittel", nom: "SG Vittel", cat: "cadira", pvp: 223.95 },
  // --- Butaques ---
  { slug: "arles-butaca", nom: "Arles", cat: "butaca", pvp: 611.95 },
  { slug: "chablis", nom: "Chablis", cat: "butaca", pvp: 589.95 },
  { slug: "havre", nom: "Havre", cat: "butaca", pvp: 244.95 },
  { slug: "rennes-c-reposapi-s", nom: "Rennes C/Reposapiés", cat: "butaca", pvp: 620.95 },
  // --- Mobles (famílies; pvp "des de") ---
  { slug: "aquila", nom: "Aquila", cat: "moble", pvp: 1410.95 },
  { slug: "ara", nom: "Ara", cat: "moble", pvp: 492.95 },
  { slug: "auriga", nom: "Auriga", cat: "moble", pvp: 1418.95 },
  { slug: "caelum", nom: "Caelum — 2 peces", cat: "moble", pvp: 441.95 },
  { slug: "canes", nom: "Canes — 2 peces", cat: "moble", pvp: 423.95 },
  { slug: "columba", nom: "Columba — 3 peces", cat: "moble", pvp: 1828.95 },
  { slug: "crater", nom: "Crater — 2 peces", cat: "moble", pvp: 536.95 },
  { slug: "cubo", nom: "Cubo — 4 peces", cat: "moble", pvp: 575.95 },
  { slug: "gemini", nom: "Gemini — 2 peces", cat: "moble", pvp: 918.95 },
  { slug: "hydra", nom: "Hydra — 2 peces", cat: "moble", pvp: 767.95 },
  { slug: "leo", nom: "Leo", cat: "moble", pvp: 1103.95 },
  { slug: "lepus", nom: "Lepus — 2 peces", cat: "moble", pvp: 639.95 },
  { slug: "lyra", nom: "Lyra — 2 peces", cat: "moble", pvp: 1853.95 },
  { slug: "mosa", nom: "Mosa", cat: "moble", pvp: 435.95 },
  { slug: "orion", nom: "Orion — 3 peces", cat: "moble", pvp: 1954.95 },
  { slug: "pavo", nom: "Pavo", cat: "moble", pvp: 974.95 },
  { slug: "pegasus", nom: "Pegasus — 8 peces", cat: "moble", pvp: 680.95 },
  { slug: "pictor", nom: "Pictor — 2 peces", cat: "moble", pvp: 918.95 },
  { slug: "puppis", nom: "Puppis", cat: "moble", pvp: 533.95 },
  { slug: "sagitta", nom: "Sagitta — 3 peces", cat: "moble", pvp: 319.95 },
  { slug: "taurus", nom: "Taurus", cat: "moble", pvp: 1630.95 },
  { slug: "vela", nom: "Vela", cat: "moble", pvp: 1058.95 },
  { slug: "virgo", nom: "Virgo — 7 peces", cat: "moble", pvp: 267.95 },
  { slug: "volans", nom: "Volans — 2 peces", cat: "moble", pvp: 555.95 },
];

export const MOBLES: Moble[] = SEED.map((m) => ({
  ...m,
  marca: "Cortinatges Esteba" as const,
}));

export const MOBLE_SLUGS = MOBLES.map((m) => m.slug);

/** Ordre estable de les categories per agrupar/filtrar a la UI. */
export const MOBLE_CATS: MobleCat[] = ["cadira", "butaca", "pouf", "moble"];

export function getMoble(slug: string): Moble | undefined {
  return MOBLES.find((m) => m.slug === slug);
}

/** Ruta del hero d'un moble: "/images/mobiliari/{slug}/1.jpg". */
export function mobleImage(slug: string): string {
  return `/images/mobiliari/${slug}/1.jpg`;
}

/** Compta els mobles d'una categoria (per al hub /botiga). */
export function countMobleByCat(cat: MobleCat): number {
  return MOBLES.filter((m) => m.cat === cat).length;
}

/**
 * Foto representativa d'una categoria de moble (primer moble del catàleg amb
 * aquesta categoria). Determinista per a SSG estable.
 */
export function mobleImageForCat(cat: MobleCat): string {
  const moble = MOBLES.find((m) => m.cat === cat);
  return moble ? mobleImage(moble.slug) : "/images/placeholder.png";
}

// Mobles la foto dels quals és una ESCENA d'ambient (no un retall sobre blanc):
// es veuen millor amb object-cover (omplen el quadrat) que amb contain (marges
// grisos). Detectat a la revisió foto-a-foto. La resta queda contain (retalls).
const MOBLE_COVER_SLUGS = new Set<string>([
  "aquila", "ara", "auriga", "caelum", "canes", "columba", "crater", "cubo",
  "gemini", "hydra", "leo", "lepus", "lyra", "mosa", "orion", "pavo", "pegasus",
  "pictor", "puppis", "sagitta", "taurus", "vela", "virgo", "volans",
]);

/** object-fit recomanat per a la foto d'un moble (cover per a escenes). */
export function mobleImgFit(slug: string): "contain" | "cover" {
  return MOBLE_COVER_SLUGS.has(slug) ? "cover" : "contain";
}
