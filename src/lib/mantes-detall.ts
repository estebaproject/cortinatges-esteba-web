// Detall comercial de mantes (mesura + PVP per mesura + termini). Generat des de
// DOCUMENTS/_decor/mantes_detall.json (8 mantes live). Aqui viu NOMES el preu
// public (PVP, IVA inclos) i el termini d'entrega; MAI el cost intern. Mateix
// patro d'inlining que src/lib/catifes-detall.ts i src/lib/mobiliari-detall.ts.
//
// Cada manta te una unica mesura (variant unica) => ve preseleccionada al panell.
//
// NO editar a ma: regenerar des del JSON font.

/** Una mesura concreta d'una manta amb el seu preu public (IVA inclos). */
export type MantaVariant = {
  /** Clau de mesura tal com ve del cataleg ("130x170", "150x200"...). */
  mida: string;
  /** Preu public d'aquesta mesura, IVA inclos. MAI cost. */
  pvp: number;
  /**
   * Preu anterior real (€) d'aquesta mesura per a rebaixes. OPCIONAL: nomes
   * quan la mesura esta realment en oferta. LEGAL: ha de ser el preu aplicat
   * els 30 dies previs. Vegeu src/lib/discount.ts.
   */
  pvpAbans?: number;
};

/** Detall comercial complet d'una manta. */
export type MantaDetall = {
  variants: MantaVariant[];
  /** Text legal del termini d'entrega (s'ha de mostrar ABANS de comprar). */
  termini: string;
};

const MANTES_DETALL: Record<string, MantaDetall> = {
  "agra": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [{ mida: "130x170", pvp: 52.95 }],
  },
  "bombaim": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [{ mida: "150x200", pvp: 99.95 }],
  },
  "dalin": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [{ mida: "130x170", pvp: 19.95, pvpAbans: 29.95 }], // PLACEHOLDER rebaixa
  },
  "harbin": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [{ mida: "130x170", pvp: 54.95 }],
  },
  "haryana": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [{ mida: "130x170", pvp: 40.95 }],
  },
  "riad": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [{ mida: "130x170", pvp: 37.95, pvpAbans: 54.95 }], // PLACEHOLDER rebaixa
  },
  "surate": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [{ mida: "130x170", pvp: 45.95 }],
  },
  "varanasi": {
    termini: "Termini d'entrega segons producte i condicions de venda. Et confirmem el termini exacte abans de tancar la comanda.",
    variants: [{ mida: "130x170", pvp: 58.95 }],
  },
};

/** Detall comercial d'una manta pel seu slug, o undefined si no existeix. */
export function getMantaDetall(slug: string): MantaDetall | undefined {
  return MANTES_DETALL[slug];
}

/** Rang de preus [min, max] de totes les mesures, o null si no en te cap. */
export function mantaPriceRange(
  detall: MantaDetall,
): { min: number; max: number } | null {
  if (detall.variants.length === 0) return null;
  const prices = detall.variants.map((v) => v.pvp);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

/**
 * Etiqueta llegible d'una mesura per a la UI ("130x170" => 130×170 cm).
 * Idioma-neutral: nomes formata numeros i unitats.
 */
export function formatMantaMidaLabel(mida: string): string {
  const rect = mida.match(/^(\d+)x(\d+)$/i);
  if (rect) {
    return `${rect[1]}×${rect[2]} cm`;
  }
  return mida.replace(/x/gi, "×");
}
