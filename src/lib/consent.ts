// Captura del consentiment legal del checkout (botiga ESTEBA).
//
// Registra QUINS consentiments ha marcat l'usuari i QUAN, segons el document
// DOCUMENTS/legal/flujo-checkout.md (secció 4: registre i conservació de la
// prova del consentiment).
//
// ⚠️ ABAST ACTUAL (client-side):
//   Ara mateix el web NO té backend (ni Supabase ni rutes API). Per tant aquest
//   registre és NOMÉS client-side: timestamp + versió de textos + quins
//   checkboxes s'han marcat. Es desa a localStorage com a evidència provisional.
//
//   FALTA PER A PRODUCCIÓ (requereix backend):
//     - IP del client (només es pot capturar de forma fiable al servidor;
//       mai s'ha de confiar en valors enviats pel navegador).
//     - User-Agent registrat al servidor lligat a la comanda.
//     - Persistència IMMUTABLE lligada a l'order_id (Supabase / BD).
//     - Snapshot de la informació precontractual mostrada (total, enviament,
//       termini, règim de desistiment per línia).
//   Sense aquesta prova servidor-side no es pot acreditar el compliment de
//   l'art. 97 ni oposar l'exclusió de l'art. 103.c (vegeu secció 4 del doc).

/** Versió dels textos legals acceptats. Cal pujar-la quan canviïn les polítiques. */
export const LEGAL_TEXTS_VERSION = "2026-06-v1";

/** Tipus de consentiment, alineat amb els checkboxes C1–C4 del document legal. */
export type ConsentType =
  /** C1 — Condicions de venda / contractació + enviaments + devolucions. */
  | "terms"
  /** C2 — Política de privacitat i tractament de dades. */
  | "privacy"
  /** C3 — Exclusió del dret de desistiment (NOMÉS si hi ha producte per encàrrec). */
  | "withdrawal_exclusion"
  /** C4 — Màrqueting (opcional). */
  | "marketing";

export type ConsentRecord = {
  type: ConsentType;
  granted: boolean;
  /** ISO 8601 (client). El registre fiable amb IP queda per al backend. */
  timestamp: string;
};

export type ConsentSnapshot = {
  reference: string;
  textsVersion: string;
  records: ConsentRecord[];
  /** Avís explícit: aquesta prova encara NO inclou IP ni registre servidor-side. */
  serverSideProofPending: true;
};

const CONSENT_STORAGE_KEY = "esteba-consent-log";

/**
 * Construeix el registre de consentiment a partir de l'estat dels checkboxes.
 * Inclou un timestamp client i la versió dels textos acceptats.
 */
export function buildConsentSnapshot(
  reference: string,
  granted: Partial<Record<ConsentType, boolean>>,
): ConsentSnapshot {
  const now = new Date().toISOString();
  const types: ConsentType[] = [
    "terms",
    "privacy",
    "withdrawal_exclusion",
    "marketing",
  ];
  const records: ConsentRecord[] = types
    .filter((type) => type in granted)
    .map((type) => ({
      type,
      granted: Boolean(granted[type]),
      timestamp: now,
    }));

  return {
    reference,
    textsVersion: LEGAL_TEXTS_VERSION,
    records,
    serverSideProofPending: true,
  };
}

/**
 * Desa la prova de consentiment a localStorage (evidència provisional
 * client-side). Substituir per persistència servidor-side quan hi hagi backend.
 */
export function persistConsentSnapshot(snapshot: ConsentSnapshot): void {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    const log: ConsentSnapshot[] = raw ? JSON.parse(raw) : [];
    log.push(snapshot);
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(log));
  } catch {
    /* no-op: quota o mode privat. La prova fiable és la del backend (futur). */
  }
}
