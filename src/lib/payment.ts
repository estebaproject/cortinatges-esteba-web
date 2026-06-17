// Capa de pagament abstracta de la botiga ESTEBA.
//
// ⚠️ STUB — INTEGRACIÓ DE PAGAMENT PENDENT.
// De moment NO hi ha passarel·la de pagament real. `initiatePayment` retorna
// l'estat "pendent_integracio" i el flux redirigeix a la pàgina de confirmació
// amb un flag perquè s'entengui que la comanda NO s'ha cobrat.
//
// INTEGRACIÓ FUTURA — Redsys:
//   La botiga preveu Redsys (passarel·la de la majoria de bancs espanyols).
//   Redsys necessita credencials del banc que ENCARA NO TENIM:
//     - Codi de comerç (FUC / merchant code)
//     - Número de terminal
//     - Clau secreta de signatura (SHA-256)
//     - URLs de notificació/retorn (OK/KO)
//   El cobrament 100% es fa a la passarel·la (redirecció + formulari signat),
//   i la confirmació real arriba per la notificació servidor-a-servidor de
//   Redsys. Això requereix BACKEND (rutes API / Supabase) que ARA NO existeix
//   al web públic. Quan hi hagi credencials + backend:
//     1. Afegir una implementació `RedsysPaymentProvider` que compleixi
//        aquesta mateixa interfície `PaymentProvider`.
//     2. Construir el formulari signat (Ds_MerchantParameters + Ds_Signature).
//     3. Gestionar la notificació de Redsys al backend i confirmar la comanda
//        només llavors (mai confiar en la redirecció del navegador).
//   La resta del flux de checkout no hauria de canviar: només s'intercanvia
//   el provider.

/** Línia de comanda enviada a la passarel·la. Només dades públiques (PVP). */
export type OrderLine = {
  slug: string;
  nom: string;
  /** PVP unitari, IVA inclòs (€). MAI cost intern. */
  pvp: number;
  qty: number;
};

/** Dades mínimes de la comanda per iniciar el pagament. */
export type OrderDraft = {
  /** Identificador local de la comanda (provisional fins que hi hagi backend). */
  reference: string;
  lines: OrderLine[];
  /** Subtotal de productes (€, IVA inclòs). */
  subtotal: number;
  /** Cost d'enviament (€, IVA inclòs). */
  shipping: number;
  /** Total a pagar (€, IVA inclòs). */
  total: number;
  /** Moneda ISO 4217. */
  currency: "EUR";
};

export type PaymentStatus =
  /** STUB: no hi ha passarel·la connectada encara. */
  | "pendent_integracio"
  /** Pagament confirmat per la passarel·la (futur). */
  | "pagat"
  /** Pagament rebutjat o cancel·lat (futur). */
  | "rebutjat"
  /** Error tècnic en iniciar el pagament. */
  | "error";

export type PaymentResult = {
  status: PaymentStatus;
  /** Referència de la comanda. */
  reference: string;
  /**
   * URL a la qual ha de redirigir el client. Amb un provider real seria la URL
   * de la passarel·la; amb l'STUB és null (el flux navega a confirmació amb
   * un flag des del component).
   */
  redirectUrl: string | null;
  /** Missatge intern (no es mostra cru a l'usuari). */
  message?: string;
};

/** Contracte que ha de complir qualsevol passarel·la (Redsys, Stripe, etc.). */
export interface PaymentProvider {
  initiatePayment(order: OrderDraft): Promise<PaymentResult>;
}

/**
 * STUB de passarel·la. No cobra res: marca la comanda com a pendent
 * d'integració. El component de checkout decideix navegar a la pàgina de
 * confirmació amb `?estat=pendent`.
 */
export const stubPaymentProvider: PaymentProvider = {
  async initiatePayment(order: OrderDraft): Promise<PaymentResult> {
    return {
      status: "pendent_integracio",
      reference: order.reference,
      redirectUrl: null,
      message:
        "Passarel·la de pagament no connectada (STUB). Pendent de credencials Redsys + backend.",
    };
  },
};

/**
 * Punt d'entrada únic del flux de pagament. Avui delega a l'STUB; el dia que
 * hi hagi Redsys, només cal canviar el provider per defecte aquí (o injectar-lo).
 */
export function initiatePayment(order: OrderDraft): Promise<PaymentResult> {
  return stubPaymentProvider.initiatePayment(order);
}
