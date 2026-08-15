/**
 * Configuració del PROTOTIP v2.
 *
 * La web actual resol els seus enllaços amb `pathnames` de next-intl
 * (src/routing.ts), que declara un slug traduït per ruta i idioma. Aquí NO
 * s'hi enganxa a propòsit: si la v2 declarés rutes en aquell fitxer, tocaria
 * la web viva i els seus canonicals. El prototip viu sota /v2/{locale}/... amb
 * un helper propi, i el dia que es promocioni a producció es tradueixen els
 * slugs d'una sola vegada.
 */

export const V2_BASE = "/v2";
export const V2_LOCALES = ["ca", "es", "en", "fr"] as const;
export type V2Locale = (typeof V2_LOCALES)[number];
export const V2_DEFAULT_LOCALE: V2Locale = "ca";

export function isV2Locale(value: string): value is V2Locale {
  return (V2_LOCALES as readonly string[]).includes(value);
}

/**
 * Ruta pública del prototip. A diferència de la web actual, el català TAMBÉ
 * porta prefix (/v2/ca): sense middleware de next-intl no hi ha res que
 * reescrigui una URL sense idioma, i un prefix explícit fa que les quatre
 * versions siguin igual de fàcils d'obrir i de comparar.
 */
export function v2Path(locale: string, path = "/"): string {
  const clean = path === "/" ? "" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  return `${V2_BASE}/${locale}${clean}`;
}

// --- Contacte ---------------------------------------------------------------
// Dades reals, les mateixes que la web actual (reference/web-actual-contingut.md).

export const V2_PHONE_DISPLAY = "972 20 34 23";
export const V2_PHONE_TEL = "+34972203423";
export const V2_EMAIL = "info@cortinatgesesteba.com";
export const V2_INSTAGRAM = "https://www.instagram.com/cortinatgesesteba/";
export const V2_FACEBOOK = "https://www.facebook.com/CortinatgesEsteba";
export const V2_DECORESTEBA = "https://www.decoresteba.com";

/** Any de fundació. La xifra d'anys es CALCULA: la web actual diu "60 anys"
 *  perquè el text es va escriure el 2021 i ha quedat congelat des de llavors. */
export const V2_FOUNDED = 1961;
export function v2Years(now = new Date()): number {
  return now.getFullYear() - V2_FOUNDED;
}

// --- Botigues ---------------------------------------------------------------

export type V2Store = {
  key: "girona" | "blanes" | "palamos" | "matalasseria";
  /** Nom per a l'schema LocalBusiness (un per botiga). */
  legalName: string;
  street: string;
  zip: string;
  city: string;
  phoneDisplay: string;
  phoneTel: string;
  /** Coordenades per a l'schema i per a l'enllaç de "com arribar". */
  geo: { lat: number; lng: number };
  mapsQuery: string;
};

export const V2_STORES: V2Store[] = [
  {
    key: "girona",
    legalName: "Cortinatges Esteba Girona",
    street: "C/ Rutlla, 11",
    zip: "17002",
    city: "Girona",
    phoneDisplay: "972 20 34 23",
    phoneTel: "+34972203423",
    geo: { lat: 41.9761, lng: 2.8215 },
    mapsQuery: "Cortinatges Esteba, Carrer de la Rutlla 11, Girona",
  },
  {
    key: "blanes",
    legalName: "Cortinatges Esteba Blanes",
    street: "Rambla Joaquim Ruyra, 59",
    zip: "17300",
    city: "Blanes",
    phoneDisplay: "972 33 05 73",
    phoneTel: "+34972330573",
    geo: { lat: 41.6742, lng: 2.7906 },
    mapsQuery: "Cortinatges Esteba, Rambla Joaquim Ruyra 59, Blanes",
  },
  {
    key: "palamos",
    legalName: "Cortinatges Esteba Palamós",
    street: "C/ Miguel de Cervantes, 35",
    zip: "17230",
    city: "Palamós",
    phoneDisplay: "972 31 62 19",
    phoneTel: "+34972316219",
    geo: { lat: 41.8474, lng: 3.1288 },
    mapsQuery: "Cortinatges Esteba, Carrer Miguel de Cervantes 35, Palamós",
  },
  {
    key: "matalasseria",
    legalName: "Cortinatges Esteba Matalasseria",
    street: "C/ Rutlla, 20",
    zip: "17002",
    city: "Girona",
    phoneDisplay: "972 20 34 23",
    phoneTel: "+34972203423",
    geo: { lat: 41.9759, lng: 2.822 },
    mapsQuery: "Cortinatges Esteba Matalasseria, Carrer de la Rutlla 20, Girona",
  },
];

export function mapsUrl(store: V2Store): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.mapsQuery)}`;
}

// --- Estances ---------------------------------------------------------------
// L'eix que NO existeix a la web actual. El client no busca "panell japonès",
// busca "què poso al menjador". Cada estança porta a la col·lecció que la
// resol, amb una foto real del catàleg.

export type V2Room = {
  key: "sala" | "dormitori" | "cuina" | "exterior" | "oficina";
  image: string;
  /** Slug de col·lecció al qual porta (existeix a src/lib/products.ts). */
  collection: string;
};

export const V2_ROOMS: V2Room[] = [
  { key: "sala", image: "/images/products/tradicional/1.jpg", collection: "tradicional" },
  { key: "dormitori", image: "/images/products/estor-paquet/1.jpg", collection: "estor-paquet" },
  { key: "cuina", image: "/images/products/veneciana-alumini/1.jpg", collection: "veneciana-alumini" },
  { key: "exterior", image: "/images/products/mosquitera/1.jpg", collection: "mosquitera" },
  { key: "oficina", image: "/images/products/vertical/1.jpg", collection: "vertical" },
];

// --- Famílies de col·lecció -------------------------------------------------
// La web actual llista 11 fitxes + 3 externes en una sola graella plana de 14
// blocs iguals. Aquí s'agrupen: primer decideixes la família, després la peça.

export type V2Family = {
  key: "cortines" | "estors" | "complements";
  slugs: string[];
};

export const V2_FAMILIES: V2Family[] = [
  { key: "cortines", slugs: ["tradicional", "prisada", "panell-japones", "vertical"] },
  {
    key: "estors",
    slugs: ["estor-paquet", "estor-enrotllable", "nit-i-dia", "veneciana-alumini", "veneciana-fusta"],
  },
  { key: "complements", slugs: ["motoritzacio", "mosquitera"] },
];

// --- Procés -----------------------------------------------------------------
// Els 4 passos. La web actual els té com a 4 icones soltes sense ordre ni
// termini: no expliquen que hi ha un camí, que és exactament el dubte del
// client davant d'un producte a mida.

export const V2_PROCESS_KEYS = ["mides", "pressupost", "taller", "installacio"] as const;

// --- Preguntes freqüents ----------------------------------------------------
// Sis objeccions reals. Van amb schema FAQPage, que la web actual no té enlloc.

export const V2_FAQ_KEYS = [
  "cost",
  "termini",
  "domicili",
  "installacio",
  "zona",
  "garantia",
] as const;

// --- Serveis ----------------------------------------------------------------
// Reutilitza les fotos i els textos que JA hi ha al namespace `Serveis`.

export const V2_SERVICE_KEYS = [
  "assessorament",
  "disseny",
  "mides",
  "confeccio",
  "installacio",
] as const;

export const V2_SERVICE_PHOTOS: Record<(typeof V2_SERVICE_KEYS)[number], string> = {
  assessorament: "/images/serveis/assessorament.jpg",
  disseny: "/images/serveis/disseny.jpg",
  mides: "/images/serveis/mides.jpg",
  confeccio: "/images/serveis/confeccio.jpg",
  installacio: "/images/serveis/installacio.jpg",
};
