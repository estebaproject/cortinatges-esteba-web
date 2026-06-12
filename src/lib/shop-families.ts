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
import { MOBLES, mobleEscena, mobleImage, type TipusMoble } from "@/lib/mobiliari";

// Re-exportar per als consumidors del hub (evita imports multiples).
export { CATIFA_FAMILIES };

/**
 * Tipus de moble destacats al hub /botiga.
 * Ordre visual editorial: primer seients, desprès taules, despès emmagatzematge i llits.
 */
export const MOBLE_TIPUS_HUB: TipusMoble[] = [
  "cadira",
  "butaca",
  "taula-menjador",
  "taula-cafe",
  "aparador",
  "llit",
  "sofa",
];

/** Nombre de catifes per família. */
export function countCatifaByFamilia(familia: CatifaFamilia): number {
  return CATIFES.filter((c) => c.familia === familia).length;
}

/** Nombre de mobles per tipus. */
export function countMobleByTipus(tipus: TipusMoble): number {
  return MOBLES.filter((m) => m.tipus === tipus).length;
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
 * Foto d'escena representativa d'un tipus de moble per al hub.
 * Regla determinista: escena.png del primer moble d'aquest tipus a MOBLES.
 * Segur: tots els 41 mobles tenen escena.png.
 */
export function mobleEscenaForTipus(tipus: TipusMoble): string {
  const moble = MOBLES.find((m) => m.tipus === tipus);
  return moble ? mobleEscena(moble.slug) : "/images/placeholder.png";
}

/**
 * Foto de PRODUCTE representativa d'un tipus de moble per al hub.
 * Les escenes són ambients (sovint mostren una taula encara que el tipus
 * sigui cadira o aparador) i confonen; la foto de producte sobre fons blanc
 * identifica el tipus a primera vista. Regla determinista: primer color del
 * primer moble del tipus.
 */
export function moblePhotoForTipus(tipus: TipusMoble): string {
  const moble = MOBLES.find((m) => m.tipus === tipus);
  if (!moble) return "/images/placeholder.png";
  const color = moble.colors[0]?.slug ?? "principal";
  return mobleImage(moble.slug, color);
}
