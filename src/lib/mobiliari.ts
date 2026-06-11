// Registre de mobles — co-marca Salgueiro Home. Generat des de
// DOCUMENTS/catalogo_2025.pdf (foto de producte sobre fons blanc) + preus de
// DOCUMENTS/P2.json. Aquí viu només l'estructura i el preu públic (PVP, IVA
// inclòs); MAI el cost intern. Els noms de model són noms propis.
//
// REGLA DE PREU (acordada amb Federico): pvpDesde = coste_min · 2,0 · 1,21 (IVA
// 21%), arrodonit a baix d'euro + 0,95. Marge 2,0 (no 2,3 com catifes) per la
// logística pesada del moble. Mateix patró que src/lib/catifes.ts.

export type TipusMoble =
  | "cadira" | "butaca" | "pouf"
  | "taula-menjador" | "taula-cafe" | "taula-centre" | "taula-auxiliar"
  | "tauleta-nit" | "aparador" | "consola" | "prestatgeria"
  | "sofa" | "llit" | "moble";

export type Moble = {
  slug: string;
  /** Nom propi del model (no es tradueix). */
  nom: string;
  tipus: TipusMoble;
  /** Preu públic «des de», IVA inclòs (€). */
  pvpDesde: number;
  /** Co-marca / fabricant. */
  marca: "Salgueiro Home";
};

type MobleSeed = Omit<Moble, "marca">;

const SEED: MobleSeed[] = [
  { slug: "annecy", nom: "Annecy", tipus: "cadira", pvpDesde: 318.95 },
  { slug: "calais", nom: "Calais", tipus: "cadira", pvpDesde: 90.95 },
  { slug: "cambrai", nom: "Cambrai", tipus: "cadira", pvpDesde: 273.95 },
  { slug: "dijon", nom: "Dijon", tipus: "cadira", pvpDesde: 287.95 },
  { slug: "grenoble", nom: "Grenoble", tipus: "cadira", pvpDesde: 65.95 },
  { slug: "havre", nom: "Havre", tipus: "butaca", pvpDesde: 244.95 },
  { slug: "limoges", nom: "Limoges", tipus: "cadira", pvpDesde: 153.95 },
  { slug: "nice", nom: "Nice", tipus: "cadira", pvpDesde: 460.95 },
  { slug: "nimes", nom: "Nimes", tipus: "cadira", pvpDesde: 151.95 },
  { slug: "pantin", nom: "Pantin", tipus: "cadira", pvpDesde: 147.95 },
  { slug: "rochelle", nom: "Rochelle", tipus: "cadira", pvpDesde: 156.95 },
  { slug: "sevres", nom: "Sevres", tipus: "cadira", pvpDesde: 225.95 },
  { slug: "toulouse", nom: "Toulouse", tipus: "cadira", pvpDesde: 265.95 },
  { slug: "chablis", nom: "Chablis", tipus: "butaca", pvpDesde: 589.95 },
  { slug: "leo", nom: "Leo", tipus: "taula-menjador", pvpDesde: 1103.95 },
  { slug: "pictor", nom: "Pictor", tipus: "taula-menjador", pvpDesde: 918.95 },
  { slug: "orion", nom: "Orion", tipus: "aparador", pvpDesde: 1954.95 },
  { slug: "lyra", nom: "Lyra", tipus: "taula-menjador", pvpDesde: 1853.95 },
  { slug: "columba", nom: "Columba", tipus: "taula-menjador", pvpDesde: 1828.95 },
  { slug: "auriga", nom: "Auriga", tipus: "taula-menjador", pvpDesde: 1418.95 },
  { slug: "pavo", nom: "Pavo", tipus: "aparador", pvpDesde: 974.95 },
  { slug: "taurus", nom: "Taurus", tipus: "aparador", pvpDesde: 1630.95 },
  { slug: "volans", nom: "Volans", tipus: "moble", pvpDesde: 555.95 },
  { slug: "vela", nom: "Vela", tipus: "taula-centre", pvpDesde: 1058.95 },
  { slug: "crater", nom: "Crater", tipus: "taula-cafe", pvpDesde: 536.95 },
  { slug: "canes", nom: "Canes", tipus: "taula-cafe", pvpDesde: 423.95 },
  { slug: "caelum", nom: "Caelum", tipus: "taula-cafe", pvpDesde: 441.95 },
  { slug: "cubo", nom: "Cubo", tipus: "taula-centre", pvpDesde: 575.95 },
  { slug: "lepus", nom: "Lepus", tipus: "taula-cafe", pvpDesde: 639.95 },
  { slug: "hydra", nom: "Hydra", tipus: "taula-cafe", pvpDesde: 767.95 },
  { slug: "ebro", nom: "Ebro", tipus: "sofa", pvpDesde: 824.95 },
  { slug: "tormes", nom: "Tormes", tipus: "llit", pvpDesde: 974.95 },
  { slug: "aragon", nom: "Aragon", tipus: "llit", pvpDesde: 1337.95 },
  { slug: "ara", nom: "Ara", tipus: "tauleta-nit", pvpDesde: 492.95 },
]

export const MOBLES: Moble[] = SEED.map((m) => ({ ...m, marca: "Salgueiro Home" }));

/** Ruta de la imatge principal d'un moble. */
export function mobleImage(slug: string): string {
  return `/images/mobiliari/${slug}.png`;
}
