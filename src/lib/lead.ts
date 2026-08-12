/**
 * Contracte compartit entre els formularis (client) i /api/lead (servidor).
 *
 * Els leads d'aquesta web són el canal de captació principal del negoci: el
 * pressupost a mida. Fins ara NO es registraven enlloc —el formulari només
 * obria WhatsApp o un `mailto:`— i si el navegador bloquejava la finestra o
 * l'usuari no tenia client de correu configurat, la petició es perdia sense
 * que ningú se n'assabentés. Ara s'envien des del SERVIDOR.
 */

export const LEAD_TYPES = ["budget", "jobs"] as const;
export type LeadType = (typeof LEAD_TYPES)[number];

/**
 * Categories del desplegable "tipus de producte", replicades del formulari de
 * /ca/contacte/ del WordPress. Cobreixen MÉS negoci que les 11 fitxes del web
 * (matalassos, tapisseria, tendals, roba de llit, parts de reparació): és el
 * catàleg real del que fa la casa, i per això es manté sencer.
 *
 * La clau és estable i en minúscules; l'etiqueta visible viu a
 * messages/*.json → FormBudget.products.{clau}, traduïda als 4 idiomes tal com
 * ja estava al WordPress.
 */
export const PRODUCT_OPTIONS = [
  "estor-enrotllable",
  "cortina-veneciana",
  "mosquiteres",
  "cortina-prisada",
  "cortina-tradicional",
  "estor-paquet",
  "cortina-vertical",
  "panell-japones",
  "cortina-nit-i-dia",
  "catifa-a-mida",
  "roba-de-casa",
  "roba-de-llit",
  "matalassos",
  "tapisseria",
  "tendals",
  // Faltava al desplegable del WordPress tot i que és un producte que es fa.
  "pergoles",
  "part-de-reparacio",
] as const;

export type ProductOption = (typeof PRODUCT_OPTIONS)[number];

/** Límits de longitud. Serveixen de validació i de tallafoc contra abusos. */
export const LIMITS = {
  nom: 120,
  telefon: 40,
  email: 180,
  mides: 200,
  missatge: 4000,
} as const;

/** Temps mínim entre que es pinta el formulari i s'envia. Sota d'això, és bot. */
export const MIN_FILL_MS = 3000;

/** Nom del camp esquer. Un humà no el veu; un bot l'omple. */
export const HONEYPOT_FIELD = "empresa_web";

export type LeadPayload = {
  type: LeadType;
  nom: string;
  telefon: string;
  email: string;
  /** Només `budget`. Clau de PRODUCT_OPTIONS. */
  producte?: string;
  /** Només `budget`. OPCIONAL a propòsit: qui encara no ha mesurat no s'ha
   *  d'encallar aquí. Al WordPress era obligatori. */
  mides?: string;
  missatge?: string;
  consent: boolean;
  locale: string;
  /** Ruta des d'on s'ha enviat, per a saber què estava mirant el client. */
  page: string;
  /** Esquer: ha d'arribar buit. */
  [HONEYPOT_FIELD]?: string;
  /** Marca de temps de quan s'ha pintat el formulari (trampa de temps). */
  renderedAt: number;
};

export type LeadResponse = { ok: true } | { ok: false; error: "invalid" | "send" };
