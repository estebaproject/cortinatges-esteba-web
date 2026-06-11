// Enllaç de WhatsApp amb missatge precarregat — CTA principal de conversió.
// Número i text definits pel client (Cortinatges Esteba).
export const WHATSAPP_NUMBER = "34972203423";

export const WHATSAPP_MESSAGE =
  "Hola! Voldria demanar pressupost:\n\nProducte: \nPoblació: ";

export function whatsappUrl(message: string = WHATSAPP_MESSAGE): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
