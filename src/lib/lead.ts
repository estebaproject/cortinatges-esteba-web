/**
 * Contracte compartit entre els formularis (client) i /api/lead (servidor).
 *
 * Els leads d'aquesta web són el canal de captació principal del negoci: el
 * pressupost a mida. Fins ara NO es registraven enlloc —el formulari només
 * obria WhatsApp o un `mailto:`— i si el navegador bloquejava la finestra o
 * l'usuari no tenia client de correu configurat, la petició es perdia sense
 * que ningú se n'assabentés. Ara s'envien des del SERVIDOR.
 */

export const LEAD_TYPES = ["budget", "jobs", "cita"] as const;
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


/* ------------------------------------------------------------------ CITES */

/**
 * Cites presencials. Substitueixen el Calendly que hi havia al WordPress.
 *
 * NO hi ha sincronització de calendari i és una decisió, no una mancança: el
 * client demana FRANJA, no hora exacta, i la cita no queda reservada fins que
 * la confirmeu vosaltres per correu. Oferir "les 10:30" sense mirar cap agenda
 * seria prometre una cosa que no es pot garantir; oferir "dimarts al matí"
 * i confirmar-ho a mà, no.
 *
 * Conseqüència assumida: dues persones poden demanar la mateixa franja. Amb
 * confirmació manual això no és un problema — però el formulari ho ha de DIR,
 * i per això el text parla de petició i no de reserva.
 */
export const FRANGES = ["mati", "tarda"] as const;
export type Franja = (typeof FRANGES)[number];

/** Horari real de les botigues. L'hora es mostra; no es tria. */
export const HORARI: Record<Franja, string> = {
  mati: "10:00 – 12:30",
  tarda: "17:00 – 19:00",
};

/** Amb quanta antelació es pot demanar, com a màxim. */
export const DIES_VISTA = 120;

/**
 * Quines franges hi ha un dia donat. Diumenge tancat; dissabte només matí.
 *
 * La data arriba com "AAAA-MM-DD" i es desmunta A MÀ, amb els tres números per
 * separat, en lloc de fer `new Date(text)`. Dos motius, i tots dos han fallat
 * en proves:
 *
 * 1. `new Date("2026-08-23")` s'interpreta en UTC. Per a un visitant a l'hora
 *    de Girona no passa res, però la web és en quatre idiomes: a Nova York
 *    aquell text cau al dissabte al vespre i `getDay()` retorna dissabte. Un
 *    diumenge tancat passaria a estar obert segons on visqui qui mira.
 *
 * 2. JavaScript NORMALITZA en silenci els components fora de rang: el mes 13
 *    es converteix en gener de l'any següent i el 30 de febrer en el 2 de març.
 *    Sense comprovar-ho, "2026-02-30" es validava contra el dia equivocat i
 *    passava. Per això, després de construir la data, es comprova que els tres
 *    números hi hagin sobreviscut igual.
 */
export function frangesDelDia(dataISO: string): Franja[] {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dataISO);
  if (!m) return [];
  const any = Number(m[1]);
  const mes = Number(m[2]);
  const dia = Number(m[3]);
  const d = new Date(any, mes - 1, dia);
  // La data existeix de debò? (mes 13, 30 de febrer, 31 d'abril…)
  if (d.getFullYear() !== any || d.getMonth() !== mes - 1 || d.getDate() !== dia) return [];
  const setmana = d.getDay();
  if (setmana === 0) return [];          // diumenge, tancat
  if (setmana === 6) return ["mati"];    // dissabte, només matí
  return ["mati", "tarda"];
}

/**
 * Validació completa de data i franja. La fan servir el formulari i el
 * servidor: la del navegador és comoditat, la del servidor és la que mana.
 */
export function citaValida(dataISO: string, franja: string): boolean {
  const opcions = frangesDelDia(dataISO);
  // Si el dia no existeix o és tancat, `frangesDelDia` ja retorna llista buida.
  if (!opcions.includes(franja as Franja)) return false;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dataISO)!;
  const demanada = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  const avui = new Date();
  avui.setHours(0, 0, 0, 0);
  if (demanada < avui) return false;
  const limit = new Date(avui);
  limit.setDate(limit.getDate() + DIES_VISTA);
  return demanada <= limit;
}

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
  /** Només `cita`. Clau de STORE_KEYS: quina botiga. */
  botiga?: string;
  /** Només `cita`. Data demanada, "AAAA-MM-DD". */
  data?: string;
  /** Només `cita`. "mati" o "tarda". */
  franja?: string;
  consent: boolean;
  locale: string;
  /** Ruta des d'on s'ha enviat, per a saber què estava mirant el client. */
  page: string;
  /** Esquer: ha d'arribar buit. */
  [HONEYPOT_FIELD]?: string;
  /** Marca de temps de quan s'ha pintat el formulari (trampa de temps). */
  renderedAt: number;
};

export type LeadResponse =
  | { ok: true }
  | {
      ok: false;
      error: "invalid" | "send";
      /** Detall de diagnòstic. NOMÉS fora de producció o amb LEAD_DEBUG=1. */
      detail?: string;
      from?: string;
      to?: string;
      /** Empremta de la clau (llargada, espais, prefix). Mai la clau. */
      key?: string;
    };
