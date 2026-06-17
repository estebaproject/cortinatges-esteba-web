// Persistència de comandes online de la botiga ESTEBA cap a l'ERP (Supabase).
//
// El rol `anon` (clau publishable) NOMÉS pot INSERT a `comandes_online` i
// `comanda_online_linies`. NO té SELECT ni UPDATE. Conseqüències directes:
//   - Mai fem `.select()` després d'un insert (fallaria per RLS). Insertem i prou.
//   - Generem `id` (uuid) i `numero` al client, així podem insertar les línies
//     amb `comanda_id` sense haver de llegir la cabecera de tornada.
//
// IMPORTANT (privacitat de marge): aquí MAI s'envia el cost intern. Només PVP
// públic (IVA inclòs), tal com arriba del cistell.
//
// HARDENING PENDENT (conegut, no resolt aquí):
//   - Validació del `total` al servidor (ara el client el calcula i l'envia;
//     un client maliciós podria manipular-lo). Cal recalcular-lo server-side
//     a partir d'un catàleg de confiança quan hi hagi backend/Edge Function.
//   - Anti-spam / rate limiting de l'INSERT anònim (captcha, límit per IP).
//   - Prova de consentiment immutable amb IP + User-Agent (només fiable
//     server-side; ara el `consentiment` és el snapshot client-side).

import { getSupabase } from "@/lib/supabase";

/** Estat inicial de tota comanda online: registrada, pendent de pagament. */
const INITIAL_ESTAT = "pendent_pagament";
const EMPRESA = "esteba";
const MONEDA = "EUR";

/** Una línia de comanda a persistir. Només dades públiques (PVP). */
export type OrderLineInput = {
  slug: string;
  nom: string;
  /** PVP unitari, IVA inclòs (€). MAI cost intern. */
  pvp: number;
  qty: number;
};

/** Dades del client recollides al formulari de checkout. */
export type OrderCustomerInput = {
  nom: string;
  cognoms: string;
  email: string;
  telefon: string;
  adreca: string;
  poblacio: string;
  cp: string;
  pais: string;
};

/** Tot el que cal per persistir una comanda. */
export type PersistOrderInput = {
  customer: OrderCustomerInput;
  lines: OrderLineInput[];
  subtotal: number;
  shipping: number;
  total: number;
  /** Snapshot de consentiment (es desa com a jsonb). */
  consent: unknown;
  /** Locale actiu del checkout (ca/es/...). */
  idioma: string;
  /** Notes lliures (opcional). */
  notes?: string | null;
};

export type PersistOrderResult = {
  /** uuid de la cabecera (generat al client). */
  id: string;
  /** Número de comanda assignat (ESTEBA-...). */
  numero: string;
};

/** Genera un número de comanda llegible i prou únic: ESTEBA-{base36 timestamp}. */
function generateNumero(): string {
  return `ESTEBA-${Date.now().toString(36).toUpperCase()}`;
}

/**
 * Detecta una violació de la restricció UNIQUE de `numero` (col·lisió). Postgres
 * retorna el codi 23505 (unique_violation). Si col·lisiona, reintentem amb un
 * número nou (idempotència simple). El primer petit retard evita que dos
 * timestamps base36 idèntics es repeteixin al reintent.
 */
function isUniqueViolation(error: { code?: string } | null): boolean {
  return error?.code === "23505";
}

const MAX_RETRIES = 3;

/**
 * Persisteix la comanda a l'ERP: cabecera + línies. Genera id i numero al
 * client. Reintenta si el `numero` col·lisiona (UNIQUE). Llança si falla
 * definitivament — el checkout NO ha de continuar al pagament en aquest cas.
 */
export async function persistOrder(
  input: PersistOrderInput,
): Promise<PersistOrderResult> {
  const supabase = getSupabase();

  let lastError: unknown = null;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const id = crypto.randomUUID();
    const numero = generateNumero();

    // 1) Cabecera. NO fem .select() (anon no té SELECT).
    const { error: headerError } = await supabase
      .from("comandes_online")
      .insert({
        id,
        numero,
        estat: INITIAL_ESTAT,
        empresa: EMPRESA,
        customer_id: null,
        nom: input.customer.nom,
        cognoms: input.customer.cognoms,
        email: input.customer.email,
        telefon: input.customer.telefon,
        adreca: input.customer.adreca,
        poblacio: input.customer.poblacio,
        cp: input.customer.cp,
        pais: input.customer.pais,
        subtotal: input.subtotal,
        enviament: input.shipping,
        total: input.total,
        moneda: MONEDA,
        consentiment: input.consent,
        idioma: input.idioma,
        notes: input.notes ?? null,
      });

    if (headerError) {
      // Col·lisió de número: reintentem amb un de nou.
      if (isUniqueViolation(headerError) && attempt < MAX_RETRIES - 1) {
        lastError = headerError;
        // Petit retard perquè el timestamp base36 canviï al reintent.
        await new Promise((r) => setTimeout(r, 5));
        continue;
      }
      throw new Error(`No s'ha pogut registrar la comanda: ${headerError.message}`);
    }

    // 2) Línies (snapshot). Una per cada línia del cistell.
    const linies = input.lines.map((l) => ({
      comanda_id: id,
      producte_slug: l.slug,
      nom: l.nom,
      variant: null,
      pvp_unitari: l.pvp,
      qty: l.qty,
      import: l.pvp * l.qty,
    }));

    const { error: linesError } = await supabase
      .from("comanda_online_linies")
      .insert(linies);

    if (linesError) {
      // La cabecera ja s'ha insertat però les línies no. Com que anon no pot
      // UPDATE/DELETE, no podem netejar la cabecera orfa: ho deixem registrat
      // perquè l'ERP ho pugui depurar, i fem fallar el flux (el client no
      // continua al pagament). Aquesta neteja és part del hardening server-side.
      throw new Error(`No s'han pogut registrar les línies: ${linesError.message}`);
    }

    return { id, numero };
  }

  throw new Error(
    `No s'ha pogut registrar la comanda després de ${MAX_RETRIES} intents: ` +
      String(lastError),
  );
}
