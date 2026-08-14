// Enllaç de WhatsApp amb missatge precarregat — CTA principal de conversió.
// Número i text definits pel client (Cortinatges Esteba).
export const WHATSAPP_NUMBER = "34972203423";

/**
 * El missatge SEMPRE s'ha de passar traduït des de qui crida.
 *
 * Abans hi havia un missatge per defecte escrit en català aquí mateix, i el
 * resultat era que un client anglès o francès que premia WhatsApp enviava
 * "Hola! Voldria demanar pressupost: Producte… Població…". Les etiquetes del
 * missatge viuen ara al namespace `Whatsapp` de messages/*.json.
 */
export function whatsappUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
