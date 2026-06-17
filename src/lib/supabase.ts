// Client Supabase (browser) de la botiga ESTEBA.
//
// Connecta el checkout públic amb la BD de l'ERP. El rol `anon` (clau
// publishable) NOMÉS pot INSERT a `comandes_online` i `comanda_online_linies`:
// no té SELECT ni UPDATE. Per això mai s'ha de fer `.select()` després d'un
// insert (fallaria per RLS) — vegeu src/lib/order.ts.
//
// La clau publishable és pública per disseny (s'exposa al navegador). MAI
// s'ha d'usar aquí la service_role: no la tenim ni hi ha de constar.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/**
 * Retorna el client Supabase (singleton). Llegeix les variables públiques
 * NEXT_PUBLIC_SUPABASE_URL i NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
 *
 * Si falten (p. ex. `.env.local` encara no creat), llança un error clar perquè
 * el checkout pugui degradar amb un missatge a l'usuari en comptes de petar
 * amb un error opac.
 */
export function getSupabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase no està configurat: falten NEXT_PUBLIC_SUPABASE_URL i/o " +
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY a .env.local.",
    );
  }

  client = createClient(url, key, {
    auth: {
      // El checkout públic no autentica usuaris: no cal persistir sessió.
      persistSession: false,
      autoRefreshToken: false,
    },
  });
  return client;
}
