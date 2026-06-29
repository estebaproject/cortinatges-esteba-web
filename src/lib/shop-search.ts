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
  /** Text de cerca pre-normalitzat (nom + categoria + família, 4 idiomes). */
  haystack: string;
};

// Plega diacrítics i normalitza majúscules: "Catifà" → "catifa", "Sillón" → "sillon".
const fold = (s: string): string =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

// Termes de categoria localitzats (ca/es/fr/en) per fer cercable la metadata, no
// només el nom propi del model. Es manté un mapa PETIT i estable aquí en comptes
// d'importar els 4 bundles complets de missatges (messages/*.json) dins d'aquesta
// utilitat pura: són paraules curtes de categoria que no canvien, i així el lib no
// queda acoblat a tot el paquet i18n ni a rutes de claus niades.
const TYPE_TERMS: Record<ShopItemType, string[]> = {
  catifa: ["catifa", "catifes", "alfombra", "alfombras", "tapis", "rug", "rugs"],
  moble: ["moble", "mobles", "mueble", "muebles", "meuble", "meubles", "mobilier", "furniture"],
  manta: ["manta", "mantes", "mantas", "plaid", "plaids", "blanket", "blankets"],
};

const CATIFA_FAMILY_TERMS: Record<string, string[]> = {
  catalogo: ["cataleg", "catalogo", "catalogue"],
  in_out: ["interior", "exterior", "indoor", "outdoor", "interieur", "exterieur"],
  bath_collection: ["bany", "bano", "bain", "bath"],
  kids_collection: ["infantil", "kids", "enfant"],
};

const MOBLE_CAT_TERMS: Record<string, string[]> = {
  cadira: ["cadira", "silla", "chaise", "chair"],
  butaca: ["butaca", "sillon", "fauteuil", "armchair"],
  pouf: ["pouf", "puf"],
  moble: ["moble", "mueble", "meuble", "furniture"],
};

/** Construeix el text de cerca normalitzat: nom + categoria + família, 4 idiomes. */
function buildHaystack(type: ShopItemType, nom: string, groupKey: string): string {
  const catTerms =
    type === "catifa"
      ? CATIFA_FAMILY_TERMS[groupKey] ?? []
      : type === "moble"
        ? MOBLE_CAT_TERMS[groupKey] ?? []
        : [];
  return fold([nom, groupKey, ...TYPE_TERMS[type], ...catTerms].join(" "));
}

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
    haystack: buildHaystack("moble", m.nom, m.cat),
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
    haystack: buildHaystack("catifa", c.nom, c.familia),
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
        haystack: buildHaystack("manta", m.nom, ""),
      }))
    : []),
];

/** Productes amb rebaixa real (pvpAbans > pvp). Mai inventa descomptes. */
export function onSaleItems(): ShopItem[] {
  return SHOP_ITEMS.filter((it) => it.pvp !== null && isOnSale(it.pvp, it.pvpAbans));
}

// Cerca a tota la botiga: insensible a majúscules i accents, cobreix nom +
// categoria/tipus + família en els 4 idiomes (ca/es/fr/en). Buit si no hi ha query.
export function searchItems(q: string): ShopItem[] {
  const needle = fold(q);
  if (!needle) return [];
  return SHOP_ITEMS.filter((it) => it.haystack.includes(needle));
}
