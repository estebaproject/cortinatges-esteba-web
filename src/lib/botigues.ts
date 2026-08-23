/**
 * Les quatre botigues, en un sol lloc.
 *
 * Fins ara `STORE_KEYS` estava copiada a /contacte i a /botigues, i les dades
 * de Google no existien enlloc. Ara viuen aquí i les fan servir totes dues
 * pàgines, el formulari de cita i el mapa.
 *
 * COMPTE amb Girona: hi ha DOS locals a menys de cent metres, la botiga del
 * carrer Rutlla 11 i la matalasseria del 20. Si al formulari de cita només
 * digués "Girona", les cites arribarien sense saber a quin dels dos van.
 */

/**
 * Mapa de Google My Maps amb els punts de venda.
 *
 * Viu al compte de Google del client: si hi afegeix o hi treu botigues, aquí
 * no s'ha de tocar res. Es fa servir a /contacte i a /botigues, i per això
 * l'identificador és aquí i no repetit a les dues pàgines.
 *
 * ESTAT: ara mateix el mapa té TRES punts (Girona, Blanes i Palamós). Hi
 * falta la matalasseria del carrer Rutlla, 20. Comprovat llegint el KML del
 * mapa, no mirant-lo: no és que estigui solapada amb la de Girona, és que no
 * hi és.
 */
export const MY_MAPS_ID = "1ukTsFISg2UNqXmBvFaZ-ZiY038YDb3E";

export const STORE_KEYS = ["girona", "blanes", "palamos", "matalasseria"] as const;
export type StoreKey = (typeof STORE_KEYS)[number];

/**
 * Cerca literal per a Google Maps i, quan el tinguem, el Place ID.
 *
 * El `placeId` és el que obre el panell de ressenyes i, sobretot, el que
 * permet l'enllaç d'ESCRIURE'N una. Es treu gratis del Place ID Finder de
 * Google, sense compte de facturació. Mentre estigui buit, el web ensenya
 * només l'enllaç a la fitxa: no s'inventa cap URL que porti enlloc.
 */
export const GOOGLE: Record<StoreKey, { cerca: string; placeId?: string }> = {
  girona: { cerca: "Cortinatges Esteba, Carrer de la Rutlla 11, 17002 Girona" },
  blanes: { cerca: "Cortinatges Esteba, Rambla Joaquim Ruyra 59, 17300 Blanes" },
  palamos: { cerca: "Cortinatges Esteba, Carrer Miguel de Cervantes 35, 17230 Palamós" },
  matalasseria: { cerca: "Cortinatges Esteba Matalasseria, Carrer de la Rutlla 20, 17002 Girona" },
};

/** Fitxa de la botiga a Google Maps. Esquema oficial, sense clau d'API. */
export function urlGoogleMaps(key: StoreKey): string {
  const g = GOOGLE[key];
  if (g.placeId) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(g.cerca)}&query_place_id=${g.placeId}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(g.cerca)}`;
}

/**
 * Enllaç directe a escriure una ressenya. Retorna null si encara no tenim el
 * Place ID: val més no ensenyar el botó que ensenyar-ne un que falla.
 */
export function urlEscriuRessenya(key: StoreKey): string | null {
  const id = GOOGLE[key].placeId;
  return id ? `https://search.google.com/local/writereview?placeid=${id}` : null;
}
