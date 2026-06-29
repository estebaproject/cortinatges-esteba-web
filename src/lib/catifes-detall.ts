// Detall comercial de catifes (mesures + PVP per mesura + termini). Generat des
// de DOCUMENTS/_catifes_detall.json (82 catifes live) amb DOCUMENTS/_gen_catifes_detall.cjs.
// Aqui viu NOMES el preu public (PVP, IVA inclos) i el termini d'entrega; MAI
// el cost intern. Mateix patro d'inlining que src/lib/catifes.ts.
//
// NO editar a ma: regenerar des del JSON font.
//
// ⚠️ REBAIXES PLACEHOLDER ⚠️ Els pvpAbans marcats "// PLACEHOLDER" son d'exemple
// (catifes de bany mes economiques) perque es vegi el look Kave amb descomptes
// al panell de compra. NO son preus reals: substituir pels aplicats els 30 dies
// previs o esborrar-los. Han de quadrar amb els pvpAbans de src/lib/catifes.ts.

/** Una mesura concreta amb el seu preu public (IVA inclos). */
export type CatifaMida = {
  /** Clau de mesura tal com ve del cataleg ("160x230", "O240", "pack_40x50_50x80"...). */
  mida: string;
  /** Amplada en cm. null per a packs de diverses peces. */
  anchoCm: number | null;
  /** Alcada (o diametre per a rodones) en cm. null per a packs. */
  altoCm: number | null;
  /** Preu public d'aquesta mesura, IVA inclos. MAI cost. */
  pvp: number;
  /**
   * Preu anterior real (€) d'aquesta mesura per a rebaixes. OPCIONAL: nomes
   * quan la mesura esta realment en oferta. El panell de compra mostra el
   * tatxat + -% + preu vermell nomes si pvpAbans > pvp. LEGAL: ha de ser el
   * preu aplicat els 30 dies previs. Vegeu src/lib/discount.ts.
   */
  pvpAbans?: number;
};

/** Detall comercial complet d'una catifa. */
export type CatifaDetall = {
  mides: CatifaMida[];
  /** true => mostra el badge "Per encarrec". */
  perEncarrec: boolean;
  /** Text legal del termini d'entrega (s'ha de mostrar ABANS de comprar). */
  termini: string;
};

const CATIFES_DETALL: Record<string, CatifaDetall> = {
  "adore": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 94.95 },
      { mida: "120x170", anchoCm: 120, altoCm: 170, pvp: 150.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 270.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 426.95 },
    ],
  },
  "almeria": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "60x115", anchoCm: 60, altoCm: 115, pvp: 37.95 },
      { mida: "70x140", anchoCm: 70, altoCm: 140, pvp: 53.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 151.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 198.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 312.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 439.95 },
    ],
  },
  "almond-chenille": {
    perEncarrec: true,
    termini: "Medida 170x240 en stock, restantes por encargo: plazo 60 días.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 286.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 667.95 },
      { mida: "170x240", anchoCm: 170, altoCm: 240, pvp: 972.95 },
      { mida: "200x280", anchoCm: 200, altoCm: 280, pvp: 1335.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 1945.95 },
      { mida: "280x390", anchoCm: 280, altoCm: 390, pvp: 2604.95 },
      { mida: "Ø240", anchoCm: 240, altoCm: 240, pvp: 1373.95 },
    ],
  },
  "ametist-chenille": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 297.95 },
      { mida: "155x230", anchoCm: 155, altoCm: 230, pvp: 379.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 616.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 867.95 },
    ],
  },
  "antik-canvas": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 62.95 },
      { mida: "120x180", anchoCm: 120, altoCm: 180, pvp: 112.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 190.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 300.95 },
    ],
  },
  "antik-chenille": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "068x120", anchoCm: 68, altoCm: 120, pvp: 87.95 },
      { mida: "100x150", anchoCm: 100, altoCm: 150, pvp: 159.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 297.95 },
      { mida: "155x230", anchoCm: 155, altoCm: 230, pvp: 379.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 616.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 867.95 },
      { mida: "300x400", anchoCm: 300, altoCm: 400, pvp: 1274.95 },
    ],
  },
  "antik-cloud": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "68x120", anchoCm: 68, altoCm: 120, pvp: 87.95 },
      { mida: "100x150", anchoCm: 100, altoCm: 150, pvp: 159.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 297.95 },
      { mida: "155x230", anchoCm: 155, altoCm: 230, pvp: 379.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 616.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 867.95 },
      { mida: "300x400", anchoCm: 300, altoCm: 400, pvp: 1274.95 },
    ],
  },
  "antik-tebas": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "068x120", anchoCm: 68, altoCm: 120, pvp: 87.95 },
      { mida: "100x150", anchoCm: 100, altoCm: 150, pvp: 159.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 297.95 },
      { mida: "155x230", anchoCm: 155, altoCm: 230, pvp: 379.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 616.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 867.95 },
    ],
  },
  "batik": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 62.95 },
      { mida: "133x195", anchoCm: 133, altoCm: 195, pvp: 134.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 190.95 },
      { mida: "190x290", anchoCm: 190, altoCm: 290, pvp: 285.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 422.95 },
    ],
  },
  "belize": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 72.95 },
      { mida: "120x170", anchoCm: 120, altoCm: 170, pvp: 113.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 204.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 322.95 },
    ],
  },
  "bliss": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 297.95 },
      { mida: "155x230", anchoCm: 155, altoCm: 230, pvp: 379.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 616.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 867.95 },
    ],
  },
  "boheme": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "60x115", anchoCm: 60, altoCm: 115, pvp: 45.95 },
      { mida: "67x135", anchoCm: 67, altoCm: 135, pvp: 58.95 },
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 78.95 },
      { mida: "133x190", anchoCm: 133, altoCm: 190, pvp: 165.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 240.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 378.95 },
      { mida: "240x330", anchoCm: 240, altoCm: 330, pvp: 516.95 },
    ],
  },
  "bohemian": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "60x115", anchoCm: 60, altoCm: 115, pvp: 45.95 },
      { mida: "67x135", anchoCm: 67, altoCm: 135, pvp: 58.95 },
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 78.95 },
      { mida: "133x190", anchoCm: 133, altoCm: 190, pvp: 165.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 240.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 378.95 },
      { mida: "240x330", anchoCm: 240, altoCm: 330, pvp: 516.95 },
    ],
  },
  "boho": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 121.95 },
      { mida: "133x190", anchoCm: 133, altoCm: 190, pvp: 254.95 },
      { mida: "160x240", anchoCm: 160, altoCm: 240, pvp: 387.95 },
      { mida: "200x280", anchoCm: 200, altoCm: 280, pvp: 564.95 },
      { mida: "240x330", anchoCm: 240, altoCm: 330, pvp: 797.95 },
    ],
  },
  "bosco": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 95.95 },
      { mida: "120x180", anchoCm: 120, altoCm: 180, pvp: 172.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 293.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 461.95 },
      { mida: "240x330", anchoCm: 240, altoCm: 330, pvp: 630.95 },
    ],
  },
  "buckley": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 103.95 },
      { mida: "120x170", anchoCm: 120, altoCm: 170, pvp: 169.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 305.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 481.95 },
      { mida: "Ø160", anchoCm: 160, altoCm: 160, pvp: 234.95 },
    ],
  },
  "bukhara": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 105.95 },
      { mida: "80x300", anchoCm: 80, altoCm: 300, pvp: 210.95 },
      { mida: "120x180", anchoCm: 120, altoCm: 180, pvp: 189.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 322.95 },
      { mida: "200x300", anchoCm: 200, altoCm: 300, pvp: 525.95 },
    ],
  },
  "bulgari": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 886.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 1396.95 },
      { mida: "250x350", anchoCm: 250, altoCm: 350, pvp: 2107.95 },
    ],
  },
  "burma": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 297.95 },
      { mida: "155x230", anchoCm: 155, altoCm: 230, pvp: 379.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 616.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 867.95 },
    ],
  },
  "caban-kilim": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "60x120", anchoCm: 60, altoCm: 120, pvp: 34.95 },
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 57.95 },
      { mida: "120x180", anchoCm: 120, altoCm: 180, pvp: 102.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 175.95 },
      { mida: "200x300", anchoCm: 200, altoCm: 300, pvp: 285.95 },
    ],
  },
  "camille": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 152.95 },
      { mida: "133x195", anchoCm: 133, altoCm: 195, pvp: 329.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 467.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 736.95 },
      { mida: "240x330", anchoCm: 240, altoCm: 330, pvp: 1005.95 },
    ],
  },
  "carrara-chenille": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 281.95 },
      { mida: "155x230", anchoCm: 155, altoCm: 230, pvp: 358.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 582.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 819.95 },
    ],
  },
  "chameleon": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 1058.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 1668.95 },
      { mida: "250x350", anchoCm: 250, altoCm: 350, pvp: 2517.95 },
    ],
  },
  "cloud-chenille": {
    perEncarrec: true,
    termini: "Medida 170x240 en stock, restantes por encargo: plazo 60 días.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 286.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 667.95 },
      { mida: "170x240", anchoCm: 170, altoCm: 240, pvp: 972.95 },
      { mida: "200x280", anchoCm: 200, altoCm: 280, pvp: 1335.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 1945.95 },
      { mida: "280x390", anchoCm: 280, altoCm: 390, pvp: 2604.95 },
    ],
  },
  "colorful": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "120x170", anchoCm: 120, altoCm: 170, pvp: 113.95 },
      { mida: "120x180", anchoCm: 120, altoCm: 180, pvp: 120.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 204.95 },
    ],
  },
  "corinto": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 86.95 },
      { mida: "120x170", anchoCm: 120, altoCm: 170, pvp: 146.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 201.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 265.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 418.95 },
      { mida: "240x330", anchoCm: 240, altoCm: 330, pvp: 570.95 },
    ],
  },
  "cripto": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 977.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 1540.95 },
      { mida: "250x350", anchoCm: 250, altoCm: 350, pvp: 2323.95 },
    ],
  },
  "cubist-chenille": {
    perEncarrec: true,
    termini: "Medida 170x240 en stock, restantes por encargo: plazo 60 días.",
    mides: [
      { mida: "100x140", anchoCm: 100, altoCm: 140, pvp: 333.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 667.95 },
      { mida: "170x240", anchoCm: 170, altoCm: 240, pvp: 972.95 },
      { mida: "200x280", anchoCm: 200, altoCm: 280, pvp: 1335.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 1945.95 },
      { mida: "280x390", anchoCm: 280, altoCm: 390, pvp: 2604.95 },
      { mida: "Ø240", anchoCm: 240, altoCm: 240, pvp: 1373.95 },
    ],
  },
  "dallas": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "60x120", anchoCm: 60, altoCm: 120, pvp: 54.95 },
      { mida: "67x250", anchoCm: 67, altoCm: 250, pvp: 126.95 },
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 90.95 },
      { mida: "120x170", anchoCm: 120, altoCm: 170, pvp: 153.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 210.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 277.95 },
    ],
  },
  "denon": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "60x120", anchoCm: 60, altoCm: 120, pvp: 46.95 },
      { mida: "67x250", anchoCm: 67, altoCm: 250, pvp: 107.95 },
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 77.95 },
      { mida: "120x170", anchoCm: 120, altoCm: 170, pvp: 130.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 179.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 235.95 },
    ],
  },
  "edges-chenille": {
    perEncarrec: true,
    termini: "Medida 170x240 en stock, restantes por encargo: plazo 60 días.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 286.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 667.95 },
      { mida: "170x240", anchoCm: 170, altoCm: 240, pvp: 972.95 },
      { mida: "200x280", anchoCm: 200, altoCm: 280, pvp: 1335.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 1945.95 },
      { mida: "280x390", anchoCm: 280, altoCm: 390, pvp: 2604.95 },
      { mida: "Ø240", anchoCm: 240, altoCm: 240, pvp: 1373.95 },
    ],
  },
  "fez": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 167.95 },
      { mida: "133x195", anchoCm: 133, altoCm: 195, pvp: 362.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 513.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 809.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 1138.95 },
    ],
  },
  "gallery-chenille": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 281.95 },
      { mida: "155x230", anchoCm: 155, altoCm: 230, pvp: 358.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 582.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 819.95 },
    ],
  },
  "garden-chenille": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "123x180", anchoCm: 123, altoCm: 180, pvp: 135.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 225.95 },
      { mida: "206x290", anchoCm: 206, altoCm: 290, pvp: 365.95 },
      { mida: "246x340", anchoCm: 246, altoCm: 340, pvp: 512.95 },
    ],
  },
  "gradient-chenille": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 281.95 },
      { mida: "155x230", anchoCm: 155, altoCm: 230, pvp: 358.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 582.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 819.95 },
    ],
  },
  "griffe": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "70x140", anchoCm: 70, altoCm: 140, pvp: 269.95 },
      { mida: "90x150", anchoCm: 90, altoCm: 150, pvp: 371.95 },
      { mida: "130x190", anchoCm: 130, altoCm: 190, pvp: 679.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 1011.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 1594.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 2242.95 },
    ],
  },
  "gropius-chenille": {
    perEncarrec: true,
    termini: "Medida 170x240 en stock, restantes por encargo: plazo 60 días.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 286.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 667.95 },
      { mida: "170x240", anchoCm: 170, altoCm: 240, pvp: 972.95 },
      { mida: "200x280", anchoCm: 200, altoCm: 280, pvp: 1335.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 1945.95 },
      { mida: "280x390", anchoCm: 280, altoCm: 390, pvp: 2604.95 },
    ],
  },
  "heritage-chenille": {
    perEncarrec: true,
    termini: "Medida 170x240 en stock, restantes por encargo: plazo 60 días.",
    mides: [
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 635.95 },
      { mida: "170x240", anchoCm: 170, altoCm: 240, pvp: 926.95 },
      { mida: "200x280", anchoCm: 200, altoCm: 280, pvp: 1271.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 1853.95 },
      { mida: "280x390", anchoCm: 280, altoCm: 390, pvp: 2479.95 },
    ],
  },
  "himalaya": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 374.95 },
      { mida: "155x230", anchoCm: 155, altoCm: 230, pvp: 477.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 776.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 1091.95 },
    ],
  },
  "jambi": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "070x140", anchoCm: 70, altoCm: 140, pvp: 124.95 },
      { mida: "080x150", anchoCm: 80, altoCm: 150, pvp: 152.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 356.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 468.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 738.95 },
      { mida: "250x350", anchoCm: 250, altoCm: 350, pvp: 1114.95 },
      { mida: "Ø160", anchoCm: 160, altoCm: 160, pvp: 326.95 },
      { mida: "Ø200", anchoCm: 200, altoCm: 200, pvp: 509.95 },
      { mida: "Ø250", anchoCm: 250, altoCm: 250, pvp: 795.95 },
    ],
  },
  "jaspe": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "67x230", anchoCm: 67, altoCm: 230, pvp: 197.95 },
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 153.95 },
      { mida: "133x195", anchoCm: 133, altoCm: 195, pvp: 331.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 470.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 740.95 },
      { mida: "240x330", anchoCm: 240, altoCm: 330, pvp: 1011.95 },
    ],
  },
  "junko": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 74.95 },
      { mida: "120x170", anchoCm: 120, altoCm: 170, pvp: 117.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 210.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 332.95 },
    ],
  },
  "kira": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 152.95 },
      { mida: "133x195", anchoCm: 133, altoCm: 195, pvp: 329.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 467.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 736.95 },
      { mida: "240x330", anchoCm: 240, altoCm: 330, pvp: 1005.95 },
      { mida: "160x230_oval", anchoCm: 160, altoCm: 230, pvp: 485.95 },
      { mida: "240x330_oval", anchoCm: 240, altoCm: 330, pvp: 1043.95 },
    ],
  },
  "lace-chenille": {
    perEncarrec: true,
    termini: "Medida 170x240 en stock, restantes por encargo: plazo 60 días.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 286.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 667.95 },
      { mida: "170x240", anchoCm: 170, altoCm: 240, pvp: 972.95 },
      { mida: "200x280", anchoCm: 200, altoCm: 280, pvp: 1335.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 1945.95 },
      { mida: "280x390", anchoCm: 280, altoCm: 390, pvp: 2604.95 },
      { mida: "Ø240", anchoCm: 240, altoCm: 240, pvp: 1373.95 },
    ],
  },
  "lake-chenille": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 297.95 },
      { mida: "155x230", anchoCm: 155, altoCm: 230, pvp: 379.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 616.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 867.95 },
    ],
  },
  "magritt": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "133x195", anchoCm: 133, altoCm: 195, pvp: 281.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 399.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 628.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 884.95 },
    ],
  },
  "malmo": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "100x140", anchoCm: 100, altoCm: 140, pvp: 137.95 },
      { mida: "135x195", anchoCm: 135, altoCm: 195, pvp: 258.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 360.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 568.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 800.95 },
    ],
  },
  "marne": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 62.95 },
      { mida: "133x195", anchoCm: 133, altoCm: 195, pvp: 134.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 190.95 },
      { mida: "190x290", anchoCm: 190, altoCm: 290, pvp: 285.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 422.95 },
    ],
  },
  "miura": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 513.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 809.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 1138.95 },
    ],
  },
  "monetti": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 152.95 },
      { mida: "133x195", anchoCm: 133, altoCm: 195, pvp: 329.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 467.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 736.95 },
      { mida: "240x330", anchoCm: 240, altoCm: 330, pvp: 1005.95 },
      { mida: "Ø200", anchoCm: 200, altoCm: 200, pvp: 527.95 },
      { mida: "Ø240", anchoCm: 240, altoCm: 240, pvp: 759.95 },
    ],
  },
  "moon-chenille": {
    perEncarrec: true,
    termini: "Medida 170x240 en stock, restantes por encargo: plazo 60 días.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 286.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 667.95 },
      { mida: "170x240", anchoCm: 170, altoCm: 240, pvp: 972.95 },
      { mida: "200x280", anchoCm: 200, altoCm: 280, pvp: 1335.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 1945.95 },
      { mida: "280x390", anchoCm: 280, altoCm: 390, pvp: 2604.95 },
      { mida: "Ø240", anchoCm: 240, altoCm: 240, pvp: 1373.95 },
    ],
  },
  "mori": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 513.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 809.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 1138.95 },
    ],
  },
  "nagano": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 140.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 430.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 678.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 954.95 },
    ],
  },
  "namur": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 88.95 },
      { mida: "133x190", anchoCm: 133, altoCm: 190, pvp: 187.95 },
      { mida: "160x240", anchoCm: 160, altoCm: 240, pvp: 284.95 },
      { mida: "200x280", anchoCm: 200, altoCm: 280, pvp: 414.95 },
      { mida: "240x330", anchoCm: 240, altoCm: 330, pvp: 585.95 },
    ],
  },
  "nassau": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "123x180", anchoCm: 123, altoCm: 180, pvp: 161.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 268.95 },
      { mida: "206x290", anchoCm: 206, altoCm: 290, pvp: 435.95 },
      { mida: "246x340", anchoCm: 246, altoCm: 340, pvp: 609.95 },
    ],
  },
  "natural-dots": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 417.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 658.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 926.95 },
    ],
  },
  "natural-link": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 298.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 470.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 661.95 },
    ],
  },
  "ombre-chenille": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "123x180", anchoCm: 123, altoCm: 180, pvp: 135.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 225.95 },
      { mida: "206x290", anchoCm: 206, altoCm: 290, pvp: 365.95 },
      { mida: "246x340", anchoCm: 246, altoCm: 340, pvp: 512.95 },
    ],
  },
  "papua": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 433.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 682.95 },
      { mida: "250x350", anchoCm: 250, altoCm: 350, pvp: 1029.95 },
      { mida: "300x400", anchoCm: 300, altoCm: 400, pvp: 1412.95 },
    ],
  },
  "pebble": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "200x252", anchoCm: 200, altoCm: 252, pvp: 1213.95 },
    ],
  },
  "pinot": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 57.95 },
      { mida: "133x195", anchoCm: 133, altoCm: 195, pvp: 125.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 177.95 },
      { mida: "190x290", anchoCm: 190, altoCm: 290, pvp: 265.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 393.95 },
    ],
  },
  "polo": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 106.95 },
      { mida: "120x170", anchoCm: 120, altoCm: 170, pvp: 169.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 305.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 481.95 },
    ],
  },
  "rainbow": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 45.95 },
      { mida: "120x170", anchoCm: 120, altoCm: 170, pvp: 77.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 106.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 139.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 220.95 },
    ],
  },
  "rustik-chenille": {
    perEncarrec: true,
    termini: "Medida 170x240 en stock, restantes por encargo: plazo 60 días.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 286.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 667.95 },
      { mida: "170x240", anchoCm: 170, altoCm: 240, pvp: 972.95 },
      { mida: "200x280", anchoCm: 200, altoCm: 280, pvp: 1335.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 1945.95 },
      { mida: "280x390", anchoCm: 280, altoCm: 390, pvp: 2604.95 },
    ],
  },
  "sahara": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "130x190", anchoCm: 130, altoCm: 190, pvp: 189.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 281.95 },
      { mida: "190x290", anchoCm: 190, altoCm: 290, pvp: 421.95 },
      { mida: "230x330", anchoCm: 230, altoCm: 330, pvp: 580.95 },
    ],
  },
  "samba": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x125", anchoCm: 80, altoCm: 125, pvp: 100.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 282.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 370.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 583.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 821.95 },
    ],
  },
  "sandalo": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "123x180", anchoCm: 123, altoCm: 180, pvp: 175.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 292.95 },
      { mida: "206x290", anchoCm: 206, altoCm: 290, pvp: 473.95 },
      { mida: "246x340", anchoCm: 246, altoCm: 340, pvp: 663.95 },
    ],
  },
  "santiago": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 86.95 },
      { mida: "120x170", anchoCm: 120, altoCm: 170, pvp: 146.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 201.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 265.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 418.95 },
    ],
  },
  "siena": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "70x140", anchoCm: 70, altoCm: 140, pvp: 340.95 },
      { mida: "90x150", anchoCm: 90, altoCm: 150, pvp: 468.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 972.95 },
      { mida: "170x240", anchoCm: 170, altoCm: 240, pvp: 1416.95 },
      { mida: "200x300", anchoCm: 200, altoCm: 300, pvp: 2083.95 },
      { mida: "250x350", anchoCm: 250, altoCm: 350, pvp: 3037.95 },
    ],
  },
  "sisalana": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 66.95 },
      { mida: "120x170", anchoCm: 120, altoCm: 170, pvp: 112.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 154.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 202.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 319.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 448.95 },
    ],
  },
  "sultana": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 87.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 267.95 },
      { mida: "200x300", anchoCm: 200, altoCm: 300, pvp: 436.95 },
    ],
  },
  "tatami": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "67x250", anchoCm: 67, altoCm: 250, pvp: 100.95 },
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 75.95 },
      { mida: "120x170", anchoCm: 120, altoCm: 170, pvp: 121.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 166.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 219.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 345.95 },
    ],
  },
  "tatami-design": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 75.95 },
      { mida: "120x170", anchoCm: 120, altoCm: 170, pvp: 121.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 166.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 219.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 345.95 },
    ],
  },
  "tender": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "060x115", anchoCm: 60, altoCm: 115, pvp: 43.95 },
      { mida: "080x150", anchoCm: 80, altoCm: 150, pvp: 76.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 177.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 233.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 367.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 517.95 },
    ],
  },
  "touch": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "60x115", anchoCm: 60, altoCm: 115, pvp: 67.95 },
      { mida: "67x250", anchoCm: 67, altoCm: 250, pvp: 151.95 },
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 114.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 252.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 331.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 522.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 734.95 },
      { mida: "Ø80", anchoCm: 80, altoCm: 80, pvp: 64.95 },
      { mida: "Ø120", anchoCm: 120, altoCm: 120, pvp: 144.95 },
      { mida: "Ø160", anchoCm: 160, altoCm: 160, pvp: 257.95 },
      { mida: "Ø200", anchoCm: 200, altoCm: 200, pvp: 401.95 },
      { mida: "Ø240", anchoCm: 240, altoCm: 240, pvp: 578.95 },
    ],
  },
  "varadero": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 86.95 },
      { mida: "80x240", anchoCm: 80, altoCm: 240, pvp: 138.95 },
      { mida: "120x170", anchoCm: 120, altoCm: 170, pvp: 146.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 201.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 265.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 418.95 },
    ],
  },
  "vegas": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "080x150", anchoCm: 80, altoCm: 150, pvp: 118.95 },
      { mida: "140x200", anchoCm: 140, altoCm: 200, pvp: 275.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 362.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 570.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 802.95 },
    ],
  },
  "veneza": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "pack_40x50_50x80", anchoCm: null, altoCm: null, pvp: 32.95 },
      { mida: "Ø067", anchoCm: 67, altoCm: 67, pvp: 24.95, pvpAbans: 34.95 }, // PLACEHOLDER rebaixa
    ],
  },
  "viena": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "pack_40x50_50x80", anchoCm: null, altoCm: null, pvp: 39.95 },
      { mida: "Ø067", anchoCm: 67, altoCm: 67, pvp: 29.95, pvpAbans: 39.95 }, // PLACEHOLDER rebaixa
    ],
  },
  "vienciana": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "50x80", anchoCm: 50, altoCm: 80, pvp: 18.95, pvpAbans: 27.95 }, // PLACEHOLDER rebaixa
    ],
  },
  "window": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 886.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 1396.95 },
      { mida: "250x350", anchoCm: 250, altoCm: 350, pvp: 2107.95 },
    ],
  },
  "zen": {
    perEncarrec: false,
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    mides: [
      { mida: "80x150", anchoCm: 80, altoCm: 150, pvp: 77.95 },
      { mida: "130x190", anchoCm: 130, altoCm: 190, pvp: 160.95 },
      { mida: "160x230", anchoCm: 160, altoCm: 230, pvp: 237.95 },
      { mida: "200x290", anchoCm: 200, altoCm: 290, pvp: 375.95 },
      { mida: "240x340", anchoCm: 240, altoCm: 340, pvp: 527.95 },
      { mida: "300x400", anchoCm: 300, altoCm: 400, pvp: 775.95 },
    ],
  },
};

/** Detall comercial d'una catifa pel seu slug, o undefined si no existeix. */
export function getCatifaDetall(slug: string): CatifaDetall | undefined {
  return CATIFES_DETALL[slug];
}

/** Rang de preus [min, max] de totes les mesures, o null si no en te cap. */
export function catifaPriceRange(
  detall: CatifaDetall,
): { min: number; max: number } | null {
  if (detall.mides.length === 0) return null;
  const prices = detall.mides.map((m) => m.pvp);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/**
 * Etiqueta llegible d'una mesura per a la UI. Converteix les claus crues del
 * cataleg ("160x230" => 160×230 cm, "O240" => diametre, "_oval" => sufix oval,
 * "pack_40x50_50x80" => pack). Idioma-neutral: nomes formata numeros i unitats.
 */
export function formatMidaLabel(mida: string): string {
  if (mida.startsWith("pack_")) {
    const parts = mida
      .slice(5)
      .split("_")
      .map((p) => p.replace(/x/gi, "\u00d7"));
    return parts.join(" + ") + " (pack)";
  }
  let suffix = "";
  let base = mida;
  if (base.endsWith("_oval")) {
    base = base.slice(0, -5);
    suffix = " oval";
  }
  const diam = base.match(/^[\u00d8O\u00f8](\d+)$/i);
  if (diam) {
    return "\u00d8" + Number(diam[1]) + " cm" + suffix;
  }
  const rect = base.match(/^(\d+)x(\d+)$/i);
  if (rect) {
    return rect[1] + "\u00d7" + rect[2] + " cm" + suffix;
  }
  return base.replace(/x/gi, "\u00d7") + suffix;
}
