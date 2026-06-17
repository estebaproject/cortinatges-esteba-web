// Regla de cost d'enviament de la botiga ESTEBA.
//
// ⚠️ PLACEHOLDER — XIFRES PENDENTS DE CONFIRMACIÓ PER ESTEBA.
// La tarifa plana i el llindar d'enviament gratuït són valors PROVISIONALS.
// Esteba ha de confirmar:
//   - Import de la tarifa plana (ara: 7 €).
//   - Llindar de gratuïtat (ara: 150 € de subtotal, IVA inclòs).
//   - Si cal suplement per gran dimensió / zona (art. 60 bis RDL 1/2007:
//     qualsevol import no mostrat ABANS del pagament NO és exigible).
//
// Tot en euros, IVA inclòs (la botiga només treballa amb PVP públic, MAI cost).

/** Tarifa plana d'enviament (€, IVA inclòs). PLACEHOLDER. */
export const FLAT_SHIPPING_RATE = 7;

/** Subtotal (€, IVA inclòs) a partir del qual l'enviament és gratuït. PLACEHOLDER. */
export const FREE_SHIPPING_THRESHOLD = 150;

export type ShippingResult = {
  /** Cost d'enviament aplicat (€, IVA inclòs). */
  cost: number;
  /** true si s'ha aplicat enviament gratuït. */
  isFree: boolean;
  /** Import que falta per arribar a l'enviament gratuït (0 si ja és gratis). */
  remainingForFree: number;
  /** Llindar de gratuïtat vigent (per mostrar a la UI). */
  threshold: number;
};

/**
 * Calcula el cost d'enviament a partir del subtotal del cistell.
 * Regla provisional: tarifa plana, gratuïta a partir del llindar.
 *
 * @param subtotal Subtotal del cistell (€, IVA inclòs).
 */
export function calculateShipping(subtotal: number): ShippingResult {
  // Un cistell buit no genera cost d'enviament.
  if (subtotal <= 0) {
    return {
      cost: 0,
      isFree: false,
      remainingForFree: FREE_SHIPPING_THRESHOLD,
      threshold: FREE_SHIPPING_THRESHOLD,
    };
  }

  const isFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  return {
    cost: isFree ? 0 : FLAT_SHIPPING_RATE,
    isFree,
    remainingForFree: isFree ? 0 : FREE_SHIPPING_THRESHOLD - subtotal,
    threshold: FREE_SHIPPING_THRESHOLD,
  };
}
