// Rebaixes (descomptes REALS) — lògica compartida per mobiliari, catifes i mantes.
//
// Un producte/variant està en rebaixa quan té un `pvpAbans` (preu anterior real)
// estrictament superior al `pvp` actual. El descompte es calcula; mai s'emmagatzema.
//
// LEGAL (Espanya · Llei d'Ordenació del Comerç Minorista, art. 20): el preu
// anterior anunciat ha de ser el realment aplicat de forma continuada durant
// els 30 dies previs. MAI s'ha d'inventar un "abans" per simular un descompte.
// Per això `pvpAbans` és sempre opcional: si no hi ha oferta real, no hi és, i
// la card es mostra neta amb un sol preu.

/** true si el producte té un preu anterior real superior a l'actual. */
export function isOnSale(pvp: number, pvpAbans?: number | null): pvpAbans is number {
  return typeof pvpAbans === "number" && pvpAbans > pvp;
}

/** Percentatge de descompte arrodonit (ex. 40 per a un -40%), o null si no hi ha oferta. */
export function discountPct(pvp: number, pvpAbans?: number | null): number | null {
  if (!isOnSale(pvp, pvpAbans)) return null;
  return Math.round((1 - pvp / pvpAbans) * 100);
}

/** Format de preu en euros segons el locale actiu (2 decimals). */
export function formatEur(n: number, locale: string): string {
  return `${n.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}
