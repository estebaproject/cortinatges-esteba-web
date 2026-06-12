// Registre de mobles — Salgueiro Home. Foto(s) de DOCUMENTS/catalogo_2025.pdf
// (variants de color sobre fons blanc) + preus de DOCUMENTS/P2.json.
// Només PVP públic (IVA inclòs), MAI cost. PVP = coste · 2,0 · 1,21, floor+0,95.
// Imatges: /images/mobiliari/{slug}/{colorSlug}.png

export type MobleColor = { slug: string; nom: string };
export type TipusMoble =
  | "cadira" | "butaca" | "pouf" | "taula-menjador" | "taula-cafe"
  | "taula-centre" | "taula-auxiliar" | "tauleta-nit" | "aparador"
  | "consola" | "comoda" | "escriptori" | "prestatgeria" | "sofa" | "llit" | "moble";
export type Moble = {
  slug: string; nom: string; tipus: TipusMoble; pvpDesde: number;
  colors: MobleColor[]; marca: "Salgueiro Home";
};
const SEED: Omit<Moble,"marca">[] = [
  { slug: "annecy", nom: "Annecy", tipus: "cadira", pvpDesde: 318.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "arles", nom: "Arles", tipus: "butaca", pvpDesde: 611.95, colors: [{ slug: "cinza", nom: "Gris" }, { slug: "taupe", nom: "Taupe" }] },
  { slug: "arles-cadira", nom: "Arles", tipus: "cadira", pvpDesde: 329.95, colors: [{ slug: "cinza", nom: "Gris" }, { slug: "taupe", nom: "Taupe" }] },
  { slug: "calais", nom: "Calais", tipus: "cadira", pvpDesde: 90.95, colors: [{ slug: "branco", nom: "Blanc" }, { slug: "bege", nom: "Beix" }, { slug: "cinza", nom: "Gris" }] },
  { slug: "cambrai", nom: "Cambrai", tipus: "cadira", pvpDesde: 273.95, colors: [{ slug: "creme", nom: "Creme" }, { slug: "bege", nom: "Beix" }, { slug: "laranja", nom: "Taronja" }, { slug: "cinza", nom: "Gris" }] },
  { slug: "dijon", nom: "Dijon", tipus: "cadira", pvpDesde: 287.95, colors: [{ slug: "bege", nom: "Beix" }, { slug: "cinzaclaro", nom: "Gris clar" }, { slug: "verde", nom: "Verd" }] },
  { slug: "grenoble", nom: "Grenoble", tipus: "cadira", pvpDesde: 65.95, colors: [{ slug: "bege", nom: "Beix" }, { slug: "taupe", nom: "Taupe" }, { slug: "castanho", nom: "Marró" }, { slug: "azul", nom: "Blau" }, { slug: "cinza", nom: "Gris" }, { slug: "cinzaescuro", nom: "Gris fosc" }, { slug: "ouro", nom: "Daurat" }] },
  { slug: "havre", nom: "Havre", tipus: "butaca", pvpDesde: 244.95, colors: [{ slug: "bege", nom: "Beix" }, { slug: "cinza", nom: "Gris" }, { slug: "laranja", nom: "Taronja" }] },
  { slug: "limoges", nom: "Limoges", tipus: "cadira", pvpDesde: 153.95, colors: [{ slug: "bege", nom: "Beix" }, { slug: "taupe", nom: "Taupe" }, { slug: "verde", nom: "Verd" }, { slug: "laranja", nom: "Taronja" }, { slug: "cinza", nom: "Gris" }, { slug: "cinzaescuro", nom: "Gris fosc" }] },
  { slug: "loriente", nom: "Loriente", tipus: "cadira", pvpDesde: 125.95, colors: [{ slug: "creme", nom: "Creme" }, { slug: "bege", nom: "Beix" }, { slug: "verde", nom: "Verd" }, { slug: "azul", nom: "Blau" }, { slug: "cinza", nom: "Gris" }] },
  { slug: "nice", nom: "Nice", tipus: "cadira", pvpDesde: 460.95, colors: [{ slug: "creme", nom: "Creme" }] },
  { slug: "nimes", nom: "Nimes", tipus: "cadira", pvpDesde: 151.95, colors: [{ slug: "bege", nom: "Beix" }, { slug: "cinza", nom: "Gris" }] },
  { slug: "pantin", nom: "Pantin", tipus: "cadira", pvpDesde: 147.95, colors: [{ slug: "creme", nom: "Creme" }, { slug: "castanho", nom: "Marró" }, { slug: "cinza", nom: "Gris" }] },
  { slug: "rochelle", nom: "Rochelle", tipus: "cadira", pvpDesde: 156.95, colors: [{ slug: "verde", nom: "Verd" }, { slug: "azul", nom: "Blau" }, { slug: "cinza", nom: "Gris" }, { slug: "cinzaescuro", nom: "Gris fosc" }] },
  { slug: "scandinaveii", nom: "Scandinave II", tipus: "cadira", pvpDesde: 63.95, colors: [{ slug: "cinza", nom: "Gris" }, { slug: "cinzaescuro", nom: "Gris fosc" }, { slug: "preto", nom: "Negre" }, { slug: "azul", nom: "Blau" }, { slug: "taupe", nom: "Taupe" }, { slug: "bege", nom: "Beix" }, { slug: "amarelo", nom: "Groc" }] },
  { slug: "sevres", nom: "Sevres", tipus: "cadira", pvpDesde: 225.95, colors: [{ slug: "creme", nom: "Creme" }, { slug: "bege", nom: "Beix" }, { slug: "preto", nom: "Negre" }] },
  { slug: "toulouse", nom: "Toulouse", tipus: "cadira", pvpDesde: 265.95, colors: [{ slug: "begecastanho", nom: "Beix Marró" }, { slug: "begepreto", nom: "Beix Negre" }] },
  { slug: "chablis", nom: "Chablis", tipus: "butaca", pvpDesde: 589.95, colors: [{ slug: "creme", nom: "Creme" }, { slug: "bege", nom: "Beix" }, { slug: "cinza", nom: "Gris" }] },
  { slug: "leo", nom: "Leo", tipus: "taula-menjador", pvpDesde: 1103.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "pictor", nom: "Pictor", tipus: "taula-menjador", pvpDesde: 918.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "aquila", nom: "Aquila", tipus: "taula-menjador", pvpDesde: 1410.95, colors: [{ slug: "preto", nom: "Negre" }] },
  { slug: "orion-mesa", nom: "Orion", tipus: "taula-menjador", pvpDesde: 2456.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "orion-aparador", nom: "Orion", tipus: "aparador", pvpDesde: 1954.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "lyra-mesa", nom: "Lyra", tipus: "taula-menjador", pvpDesde: 1853.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "columba", nom: "Columba", tipus: "taula-menjador", pvpDesde: 1828.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "auriga", nom: "Auriga", tipus: "taula-menjador", pvpDesde: 1418.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "pavo", nom: "Pavo", tipus: "aparador", pvpDesde: 974.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "taurus", nom: "Taurus", tipus: "aparador", pvpDesde: 1630.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "volans-aparador", nom: "Volans", tipus: "aparador", pvpDesde: 639.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "volans-comoda", nom: "Volans", tipus: "comoda", pvpDesde: 555.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "virgo", nom: "Virgo", tipus: "aparador", pvpDesde: 667.95, colors: [{ slug: "preto", nom: "Negre" }, { slug: "branco", nom: "Blanc" }] },
  { slug: "pegasus-aparador", nom: "Pegasus", tipus: "aparador", pvpDesde: 856.95, colors: [{ slug: "nogueira", nom: "Noguera" }, { slug: "carvalho", nom: "Roure" }] },
  { slug: "pegasus-escriptori", nom: "Pegasus", tipus: "escriptori", pvpDesde: 680.95, colors: [{ slug: "nogueira", nom: "Noguera" }, { slug: "carvalho", nom: "Roure" }] },
  { slug: "vela", nom: "Vela", tipus: "taula-centre", pvpDesde: 1058.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "crater", nom: "Crater", tipus: "taula-cafe", pvpDesde: 536.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "canes", nom: "Canes", tipus: "taula-cafe", pvpDesde: 423.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "caelum", nom: "Caelum", tipus: "taula-cafe", pvpDesde: 441.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "cubo", nom: "Cubo", tipus: "taula-centre", pvpDesde: 575.95, colors: [{ slug: "bordeaux", nom: "Bordeus" }] },
  { slug: "lepus", nom: "Lepus", tipus: "taula-cafe", pvpDesde: 639.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "hydra", nom: "Hydra", tipus: "taula-cafe", pvpDesde: 767.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "ebro", nom: "Ebro", tipus: "sofa", pvpDesde: 824.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "tormes", nom: "Tormes", tipus: "llit", pvpDesde: 974.95, colors: [{ slug: "creme", nom: "Creme" }, { slug: "bege", nom: "Beix" }, { slug: "verde", nom: "Verd" }] },
  { slug: "aragon", nom: "Aragon", tipus: "llit", pvpDesde: 1337.95, colors: [{ slug: "creme", nom: "Creme" }, { slug: "bege", nom: "Beix" }, { slug: "verde", nom: "Verd" }] },
  { slug: "ara", nom: "Ara", tipus: "tauleta-nit", pvpDesde: 492.95, colors: [{ slug: "principal", nom: "" }] },
  { slug: "pakra", nom: "Pakra", tipus: "taula-auxiliar", pvpDesde: 538.95, colors: [{ slug: "principal", nom: "" }] },
]
export const MOBLES: Moble[] = SEED.map((m) => ({ ...m, marca: "Salgueiro Home" }));
/** Imatge d'un color concret (o la principal = colors[0]). */
export function mobleImage(slug: string, colorSlug: string): string {
  return `/images/mobiliari/${slug}/${colorSlug}.png`;
}

/** Ruta de la foto d'escena d'un moble (sempre existeix: 41/41). */
export function mobleEscena(slug: string): string {
  return `/images/mobiliari/${slug}/escena.png`;
}

/**
 * Llista de slides per a la galeria de la ficha d'un moble.
 * Ordre: escena (cover) → 1 slide per cada color (contain).
 */
export function mobleSlides(moble: Moble): import("@/lib/catifes").GallerySlide[] {
  const slides: import("@/lib/catifes").GallerySlide[] = [
    {
      src: mobleEscena(moble.slug),
      alt: moble.nom,
      kind: "escena",
      fit: "cover",
    },
  ];
  for (const color of moble.colors) {
    slides.push({
      src: mobleImage(moble.slug, color.slug),
      alt: color.nom ? `${moble.nom} · ${color.nom}` : moble.nom,
      kind: "color",
      colorSlug: color.slug,
      fit: "contain",
    });
  }
  return slides;
}
