// Detall comercial de mobiliari (variants + PVP per variant + termini).
// Generat des de DOCUMENTS/_mob/mobiliari_detall.json (43 mobles amb detall).
// Aqui viu NOMES el preu public (PVP, IVA inclos) i el termini d'entrega; MAI
// el cost intern. Mateix patro d'inlining que src/lib/catifes-detall.ts.
//
// NO editar a ma: regenerar des del JSON font.

/** Una variant concreta d'un moble (peca o acabat) amb el seu preu public. */
export type MobleVariant = {
  /** Nom complet de la variant tal com ve del cataleg (no es tradueix). */
  nom: string;
  /** Dimensio en cm ("40x40x40"), o null per a mobles sense dimensio (cadires). */
  dim: string | null;
  /** Preu public d'aquesta variant, IVA inclos. MAI cost. */
  pvp: number;
  /**
   * Preu anterior real (€) d'aquesta variant per a rebaixes. OPCIONAL: nomes
   * quan la variant esta realment en oferta. LEGAL: ha de ser el preu aplicat
   * els 30 dies previs. Vegeu src/lib/discount.ts.
   */
  pvpAbans?: number;
};

/** Detall comercial complet d'un moble. */
export type MobleDetall = {
  variants: MobleVariant[];
  /** Text legal del termini d'entrega (s'ha de mostrar ABANS de comprar). */
  termini: string;
};

const MOBILIARI_DETALL: Record<string, MobleDetall> = {
  "annecy": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Annecy", dim: null, pvp: 318.95 },
    ],
  },
  "arles": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Arles", dim: null, pvp: 329.95 },
    ],
  },
  "arles-butaca": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Arles", dim: null, pvp: 611.95 },
    ],
  },
  "calais": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Calais", dim: null, pvp: 90.95, pvpAbans: 129.95 }, // PLACEHOLDER rebaixa
    ],
  },
  "cambrai": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Cambrai", dim: null, pvp: 273.95 },
    ],
  },
  "dijon": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Dijon", dim: null, pvp: 287.95 },
    ],
  },
  "grenoble": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Grenoble", dim: null, pvp: 65.95, pvpAbans: 109.95 }, // PLACEHOLDER rebaixa
    ],
  },
  "limoges": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Limoges", dim: null, pvp: 153.95 },
    ],
  },
  "loriente": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Loriente", dim: null, pvp: 125.95 },
    ],
  },
  "nice": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Nice", dim: null, pvp: 460.95 },
    ],
  },
  "nimes": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Nimes", dim: null, pvp: 151.95 },
    ],
  },
  "pantin": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Pantin", dim: null, pvp: 147.95 },
    ],
  },
  "rochelle": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Rochelle", dim: null, pvp: 156.95 },
    ],
  },
  "scandinave-ii": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Scandinave II", dim: null, pvp: 63.95, pvpAbans: 99.95 }, // PLACEHOLDER rebaixa
    ],
  },
  "sevres": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Sevres", dim: null, pvp: 225.95 },
    ],
  },
  "toulouse": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Toulouse", dim: null, pvp: 265.95 },
    ],
  },
  "sg-vittel": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "SG Vittel", dim: null, pvp: 223.95 },
    ],
  },
  "chablis": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Chablis", dim: null, pvp: 589.95 },
    ],
  },
  "havre": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Havre", dim: null, pvp: 244.95 },
    ],
  },
  "rennes-c-reposapi-s": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Rennes C/Reposapiés", dim: null, pvp: 620.95 },
    ],
  },
  "aquila": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Mesa Comedor Aquila 210x110x76", dim: "210x110x76", pvp: 1410.95 },
    ],
  },
  "ara": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Mesita de Noche Ara 50x40x53 Nogal", dim: "50x40x53", pvp: 492.95 },
    ],
  },
  "auriga": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Mesa Comedor Auriga 160/200x90x76 Nogal", dim: "200x90x76", pvp: 1418.95 },
    ],
  },
  "caelum": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Mesa Cafe Caelum 80x35 Rosa Encimera Comp.Piedra", dim: "80x35", pvp: 567.95 },
      { nom: "Mesa Cafe Caelum 60x45 Rosa Encimera Comp.Piedra", dim: "60x45", pvp: 441.95 },
    ],
  },
  "canes": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Mesa Cafe Canes 80x38 Encimera Comp.Piedra", dim: "80x38", pvp: 625.95 },
      { nom: "Mesa Cafe Canes 55x56 Encimera Comp.Piedra", dim: "55x56", pvp: 423.95 },
    ],
  },
  "columba": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Mesa Comedor Extensible Columba Black Marble 180/260x90x76", dim: "260x90x76", pvp: 1828.95 },
      { nom: "Mesa Comedor Extensible Columba Golden Carrara 180/260x90x76", dim: "260x90x76", pvp: 1828.95 },
      { nom: "Mesa Comedor Extensible Columba Gloss L.Pandora 180/260x100x76", dim: "260x100x76", pvp: 1990.95 },
    ],
  },
  "crater": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Mesa Cafe Crater 80x45 Bronze Encimera Comp.Piedra", dim: "80x45", pvp: 795.95 },
      { nom: "Mesa Cafe Crater 60x55 Bronze Encimera Comp.Piedra", dim: "60x55", pvp: 536.95 },
    ],
  },
  "cubo": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Mesa Centro Cubo 40x40x40 Bordeaux Marm.Natural", dim: "40x40x40", pvp: 1103.95 },
      { nom: "Mesa Centro Cubo 35x35x50 Bordeaux Marm.Natural", dim: "35x35x50", pvp: 1164.95 },
      { nom: "Mesa Centro Cubo 30x30x50 Comp.Piedra", dim: "30x30x50", pvp: 767.95 },
      { nom: "Mesa Centro Cubo 38x38x38 Comp.Piedra", dim: "38x38x38", pvp: 575.95 },
    ],
  },
  "gemini": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Mesa Centro Gemini 60x60x50 Marron", dim: "60x60x50", pvp: 918.95 },
      { nom: "Mesa Centro Gemini 100x100x40 Marron", dim: "100x100x40", pvp: 1309.95 },
    ],
  },
  "hydra": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Mesa Cafe Hydra 74x56x38 Encimera Comp.Piedra", dim: "74x56x38", pvp: 767.95 },
      { nom: "Mesa Cafe Hydra 132x89x32 Encimera Comp.Piedra", dim: "132x89x32", pvp: 1091.95 },
    ],
  },
  "leo": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Mesa Comedor Extensible Leo 140/180x90x76 Comp.Piedra", dim: "180x90x76", pvp: 1103.95 },
    ],
  },
  "lepus": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Mesa Cafe Lepus 51x63x44 Encimera Comp.Piedra", dim: "51x63x44", pvp: 639.95 },
      { nom: "Mesa Cafe Lepus 110x72x33 Encimera Comp.Piedra", dim: "110x72x33", pvp: 899.95 },
    ],
  },
  "lyra": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Aparador Lyra 3P 160x40x85 Nogal", dim: "160x40x85", pvp: 1893.95 },
      { nom: "Mesa Comedor Lyra 180x90x76 Nogal, Encimera Comp.Piedra", dim: "180x90x76", pvp: 1853.95 },
    ],
  },
  "mosa": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Mesita de Noche Mosa 55x40x50 Roble", dim: "55x40x50", pvp: 435.95 },
    ],
  },
  "orion": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Aparador Orion Alto 3P Vidrio 141x40x127 Roble", dim: "141x40x127", pvp: 3214.95 },
      { nom: "Aparador Orion 4P 180x45x82 Roble", dim: "180x45x82", pvp: 1954.95 },
      { nom: "Mesa Comedor Orion 240x120x76 Roble", dim: "240x120x76", pvp: 2456.95 },
    ],
  },
  "pavo": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Aparador Pavo 2P+3 150x40x80 Beige", dim: "150x40x80", pvp: 974.95 },
    ],
  },
  "pegasus": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Aparador Pegasus 2P 120x40x76 Roble", dim: "120x40x76", pvp: 856.95 },
      { nom: "Aparador Pegasus 2P 120x40x76 Nogal", dim: "120x40x76", pvp: 943.95 },
      { nom: "Aparador Pegasus 3P 160x40x76 Roble", dim: "160x40x76", pvp: 1074.95 },
      { nom: "Aparador Pegasus 3P 160x40x76 Nogal", dim: "160x40x76", pvp: 1183.95 },
      { nom: "Mesa de TV Pegasus 120x40x55 Roble", dim: "120x40x55", pvp: 718.95 },
      { nom: "Mesa de TV Pegasus 120x40x55 Nogal", dim: "120x40x55", pvp: 791.95 },
      { nom: "Mesa de oficina Pegasus 120x60x76 Roble", dim: "120x60x76", pvp: 680.95 },
      { nom: "Mesa de Oficina 120x60x76 Nogal", dim: "120x60x76", pvp: 749.95 },
    ],
  },
  "pictor": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Mesa Comedor Pictor Ø 120x76", dim: "120x76", pvp: 918.95 },
      { nom: "Mesa Comedor Pictor Ø 135x76", dim: "135x76", pvp: 980.95 },
    ],
  },
  "puppis": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Mesita de Noche Puppis 60x45x60 Nogal", dim: "60x45x60", pvp: 533.95 },
    ],
  },
  "sagitta": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Sagitta Consola 120x35x75 Efecto Roble", dim: "120x35x75", pvp: 319.95 },
      { nom: "Sagitta Estanteria 90x40x171 Efecto Roble", dim: "90x40x171", pvp: 377.95 },
      { nom: "Sagitta Estanteria 160x40x106 Efecto Roble", dim: "160x40x106", pvp: 460.95 },
    ],
  },
  "taurus": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Aparador Taurus 4P 199x44x75 Nogal", dim: "199x44x75", pvp: 1630.95 },
    ],
  },
  "vela": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Mesa Centro Vela 140x75x38 Roble", dim: "140x75x38", pvp: 1058.95 },
    ],
  },
  "virgo": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Aparador Virgo 2P 104x39x125 Negro", dim: "104x39x125", pvp: 823.95 },
      { nom: "Aparador Virgo 2P+2 104x39x83 Blanco", dim: "104x39x83", pvp: 667.95 },
      { nom: "Aparador Virgo 2P+2 104x39x83 Negro", dim: "104x39x83", pvp: 667.95 },
      { nom: "Aparador Virgo 3P+3 154x39x83 Negro", dim: "154x39x83", pvp: 766.95 },
      { nom: "Mesita de Noche Virgo 54x39x56 Negro", dim: "54x39x56", pvp: 267.95 },
      { nom: "Mesa Centro Virgo 104x68x46 Negro", dim: "104x68x46", pvp: 389.95 },
      { nom: "Mesa de TV Virgo 154x39x56 Negro", dim: "154x39x56", pvp: 499.95 },
    ],
  },
  "volans": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [
      { nom: "Aparador Volans 2P+2 150x40x80 Negro", dim: "150x40x80", pvp: 639.95 },
      { nom: "Cómoda Volans 4G 80x40x90 Negro", dim: "80x40x90", pvp: 555.95 },
    ],
  },
};

/** Detall comercial d'un moble pel seu slug, o undefined si no existeix. */
export function getMobleDetall(slug: string): MobleDetall | undefined {
  return MOBILIARI_DETALL[slug];
}

/** Rang de preus [min, max] de totes les variants, o null si no en te cap. */
export function moblefPriceRange(
  detall: MobleDetall,
): { min: number; max: number } | null {
  if (detall.variants.length === 0) return null;
  const prices = detall.variants.map((v) => v.pvp);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/**
 * Etiqueta llegible d'una variant per a la UI. Si te dimensio, formata els
 * separadors "x" com "×" (idioma-neutral); si no, retorna el nom de la variant.
 */
export function formatVariantLabel(variant: MobleVariant): string {
  if (variant.dim) {
    return variant.dim.replace(/x/gi, "×");
  }
  return variant.nom;
}
