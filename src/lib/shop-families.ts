// Helpers de taxonomia per al hub /botiga i derivats.
// Dades derivades de CATIFES + MOBLES + manifests d'assets — cap fs en runtime.

import {
  CATIFES,
  CATIFA_FAMILIES,
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
 * Regla determinista (SSG estable): ESCENA (1.jpg) de la primera catifa de la
 * família. Fem servir l'escena i no la foto de producte (2.jpg) perquè algunes
 * famílies (bany) tenen fotos d'embalatge amb marca d'aigua a 2.jpg.
 */
export function firstCatifaImageForFamilia(familia: CatifaFamilia): string {
  const first = CATIFES.find((c) => c.familia === familia);
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
