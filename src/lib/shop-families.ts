// Helpers de taxonomia per al hub /botiga i derivats.
// Dades derivades de CATIFES + MOBLES + manifests d'assets — cap fs en runtime.

import {
  CATIFES,
  CATIFA_FAMILIES,
  CATIFA_HAS_PRODUCTO,
  catifaProducto,
  catifaEscena,
  type CatifaFamilia,
} from "@/lib/catifes";
import {
  MOBLE_CATS,
  countMobleByCat,
  mobleImageForCat,
  type MobleCat,
} from "@/lib/mobiliari";

// Re-exportar per als consumidors del hub (evita imports multiples).
export { CATIFA_FAMILIES };

/**
 * Categories de moble destacades al hub /botiga.
 * Ordre visual editorial: seients, descans i mobles.
 */
export const MOBLE_CAT_HUB: MobleCat[] = MOBLE_CATS;

/** Nombre de catifes per família. */
export function countCatifaByFamilia(familia: CatifaFamilia): number {
  return CATIFES.filter((c) => c.familia === familia).length;
}

/** Nombre de mobles per categoria. */
export function countMobleByCategoria(cat: MobleCat): number {
  return countMobleByCat(cat);
}

/**
 * Foto representativa d'una família de catifes per al hub.
 * Regla determinista (SSG estable): primera catifa de la família amb foto
 * de producte (2.jpg); si cap en té, l'escena (1.jpg) de la primera.
 */
export function firstCatifaImageForFamilia(familia: CatifaFamilia): string {
  const inFamilia = CATIFES.filter((c) => c.familia === familia);
  const withProducto = inFamilia.find((c) => CATIFA_HAS_PRODUCTO.has(c.slug));
  if (withProducto) {
    return catifaProducto(withProducto.slug)!;
  }
  const first = inFamilia[0];
  return first ? catifaEscena(first.slug) : "/images/placeholder.png";
}

/**
 * Foto representativa d'una categoria de moble per al hub.
 * Regla determinista (SSG estable): hero (1.jpg) del primer moble d'aquesta
 * categoria al catàleg.
 */
export function moblePhotoForCategoria(cat: MobleCat): string {
  return mobleImageForCat(cat);
}
