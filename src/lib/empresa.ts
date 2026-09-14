/**
 * LES DADES DE L'EMPRESA, EN UN SOL LLOC.
 *
 * Abans cada text legal portava les seves: el telèfon escrit a mà en sis
 * paràgrafs, i el NIF, el domicili i les dades registrals com a claudàtors
 * `[AIXÍ]` repetits setze vegades entre el català i el castellà, repartits
 * per tres documents. Omplir-los volia dir trobar-los tots i no descuidar-ne
 * cap — i a l'avís legal del web informatiu ni tan sols hi eren: allà el
 * titular es deia "EL TITULAR" i prou.
 *
 * Ara s'omplen AQUÍ, una vegada, i surten a tot arreu.
 *
 * COM S'ESCRIU ALS TEXTOS. Als documents legals es posa el nom de la dada
 * entre claus dobles —`{{nif}}`, `{{domicili}}`— i `dadesEmpresa()` les
 * substitueix quan es pinta la pàgina. El que encara no se sap surt marcat i
 * ben visible, perquè no es pugui publicar sense adonar-se'n.
 *
 * QUÈ FALTA. `DADES_PENDENTS` diu quines són `null`. Mentre n'hi hagi cap,
 * `LEGAL_PUBLICABLE` (a src/online/legal/content.ts) es queda a false encara
 * que algú posi `LEGAL_VALIDATED = true`: un text legal amb el NIF en blanc
 * no es pot publicar, i val més que ho impedeixi el codi que no pas la
 * memòria de qui el publica.
 */

/**
 * Una dada de l'empresa. `null` vol dir QUE ENCARA NO LA SABEM, no que no
 * calgui: no es posi mai una cadena inventada per fer marxar res.
 */
type Dada = string | null;

export const EMPRESA = {
  /** Raó social completa, com surt al registre. */
  denominacio: "Cortinatges Esteba S.L." as Dada,

  /**
   * NIF de la societat. Donat per Esteba el 14/09/2026 com a "b175119778", amb
   * una xifra de més: un CIF té 9 caràcters. L'únic CIF vàlid que en surt
   * traient-ne una (el control quadra) és B17519778, i coincideix amb el que
   * publiquen els registres d'empreses per a Cortinatges Esteba SL.
   */
  nif: "B17519778" as Dada,

  /**
   * Domicili social complet (carrer, número, codi postal, població,
   * província). No serveix el de cap de les botigues si no coincideix amb
   * el social: l'article 10 de la LSSI demana el domicili de l'entitat.
   */
  domicili: "C/ Rutlla, 11, 17002 Girona" as Dada,

  /**
   * Registre Mercantil. Tret de les inscripcions publicades al BORME (la més
   * recent, del novembre del 2021: T 1094, F 30, S 8, H GI 19652, I/A 3). El
   * full GI-19652 és el que identifica la societat al registre.
   */
  registre: "Registre Mercantil de Girona, tom 1094, foli 30, full GI-19652" as Dada,

  correu: "info@cortinatgesesteba.com" as Dada,
  telefon: "972 20 34 23" as Dada,

  /**
   * Termini màxim de resposta a una reclamació. Surt a les condicions i a la
   * política d'enviaments. El fixa la casa; un mes és el que se sol dir.
   */
  terminiResposta: null as Dada,

  /** Tarifa plana d'enviament a Espanya peninsular i Balears, en euros. */
  tarifaEnviament: null as Dada,

  /**
   * Import a partir del qual l'enviament és gratuït. Decidit el 12/09/2026.
   * A la franja de promeses i als textos legals ha de dir el mateix.
   */
  llindarEnviamentGratuit: "150" as Dada,
} as const;

/** Com s'escriu cada dada dins d'un text legal: `{{clau}}`. */
export type ClauEmpresa = keyof typeof EMPRESA;

/** Les dades que encara no sabem, en l'ordre en què s'han de demanar. */
export const DADES_PENDENTS: ClauEmpresa[] = (Object.keys(EMPRESA) as ClauEmpresa[]).filter(
  (k) => EMPRESA[k] === null,
);

/** Etiqueta llegible de cada dada, per a l'avís de la pàgina i per als avisos. */
export const NOM_DADA: Record<ClauEmpresa, string> = {
  denominacio: "denominació social",
  nif: "NIF",
  domicili: "domicili social",
  registre: "dades registrals",
  correu: "correu de contacte",
  telefon: "telèfon",
  terminiResposta: "termini de resposta a reclamacions",
  tarifaEnviament: "tarifa d'enviament",
  llindarEnviamentGratuit: "llindar d'enviament gratuït",
};

/**
 * Substitueix `{{clau}}` per la dada. El que falta no es deixa en blanc ni
 * s'inventa: es marca, perquè si algú publica sense omplir-ho es vegi a la
 * pàgina i no passi per bo.
 */
export function dadesEmpresa(text: string): string {
  return text.replace(/\{\{([a-zA-Z]+)\}\}/g, (coincidencia, clau: string) => {
    if (!(clau in EMPRESA)) return coincidencia;
    const valor = EMPRESA[clau as ClauEmpresa];
    return valor ?? `[PENDENT: ${NOM_DADA[clau as ClauEmpresa]}]`;
  });
}

/**
 * Tot el que queda per decidir dins d'un text legal, ja pintat.
 *
 * NO només les dades d'aquest fitxer: als textos hi ha marcadors d'altres
 * menes —els suplements de la catifa de gran format, o qui paga el transport
 * de tornada— que són decisions comercials i no dades de l'empresa. Un text
 * amb qualsevol d'aquests marcadors no es pot publicar, vinguin d'on
 * vinguin, així que en lloc de mantenir-ne una llista a mà es busca el patró:
 * qualsevol claudàtor en majúscules.
 *
 * Deixa en pau els claudàtors normals d'una frase (no n'hi ha d'haver, però
 * si algun dia n'hi ha, ha de començar en majúscula i seguir en majúscules
 * per confondre's amb un marcador).
 */
export function marcadorsPendents(text: string): string[] {
  const trobats = text.match(/\[[A-ZÀ-ÚÇ][^\]]*\]/g) ?? [];
  return [...new Set(trobats)];
}
