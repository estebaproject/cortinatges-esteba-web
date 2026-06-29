// Catàleg unificat de la botiga — agrega mobiliari + catifes + mantes en una
// sola llista normalitzada. La fan servir la pàgina de Rebaixes (/rebaixes) i la
// de cerca global (/cerca), que abans només cobrien mobiliari.
// Només dades públiques; el preu pot ser null (catifes per encàrrec).

import { MOBLES, mobleImage, mobleImgFit } from "@/lib/mobiliari";
import { VISIBLE_CATIFES, catifaEscena, catifaImgFit } from "@/lib/catifes";
import { MANTES, mantaImage } from "@/lib/mantes";
import { isOnSale } from "@/lib/discount";
import { SHOW_MANTES } from "@/lib/site";

export type ShopItemType = "moble" | "catifa" | "manta";

export type ShopItem = {
  type: ShopItemType;
  slug: string;
  nom: string;
  /** Ruta RELATIVA a la fitxa, sense prefix de locale ("/mobiliari/grenoble"). */
  path: string;
  image: string;
  fit: "contain" | "cover";
  /** Preu públic (€) o «des de»; null per a catifes només per encàrrec. */
  pvp: number | null;
  /** Preu anterior real (€) per a rebaixes (opcional). */
  pvpAbans?: number;
  /** Clau de grup per a l'etiqueta: MobleCat | CatifaFamilia | "" (manta). */
  groupKey: string;
  /** true si pvp és un «des de» (famílies de moble, catifes, mantes). */
  fromPrice: boolean;
};

/** Llista única de tots els productes de la botiga. Determinista (SSG estable). */
export const SHOP_ITEMS: ShopItem[] = [
  ...MOBLES.map((m): ShopItem => ({
    type: "moble",
    slug: m.slug,
    nom: m.nom,
    path: `/mobiliari/${m.slug}`,
    image: mobleImage(m.slug),
    fit: mobleImgFit(m.slug),
    pvp: m.pvp,
    pvpAbans: m.pvpAbans,
    groupKey: m.cat,
    fromPrice: m.cat === "moble",
  })),
  ...VISIBLE_CATIFES.map((c): ShopItem => ({
    type: "catifa",
    slug: c.slug,
    nom: c.nom,
    path: `/catifes/${c.slug}`,
    image: catifaEscena(c.slug),
    fit: catifaImgFit(c.slug),
    pvp: c.pvpDesde,
    pvpAbans: c.pvpAbans,
    groupKey: c.familia,
    fromPrice: true,
  })),
  ...(SHOW_MANTES
    ? MANTES.map((m): ShopItem => ({
        type: "manta",
        slug: m.slug,
        nom: m.nom,
        path: `/mantes/${m.slug}`,
        image: mantaImage(m.slug),
        fit: "cover",
        pvp: m.pvp,
        pvpAbans: m.pvpAbans,
        groupKey: "",
        fromPrice: true,
      }))
    : []),
];

/** Productes amb rebaixa real (pvpAbans > pvp). Mai inventa descomptes. */
export function onSaleItems(): ShopItem[] {
  return SHOP_ITEMS.filter((it) => it.pvp !== null && isOnSale(it.pvp, it.pvpAbans));
}

/** Cerca per nom (case-insensitive) a tota la botiga. Buit si no hi ha query. */
export function searchItems(q: string): ShopItem[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  return SHOP_ITEMS.filter((it) => it.nom.toLowerCase().includes(needle));
}
