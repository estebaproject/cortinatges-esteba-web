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
 * LES BOTIGUES QUE SURTEN AL MAPA: Girona, Blanes i Palamós.
 *
 * La matalasseria del carrer Rutlla, 20 NO hi surt, i és una decisió del client
 * (26 d'agost del 2026), no un oblit: és a cent metres de la botiga de Girona i
 * els dos pins quedarien encavalcats. /contacte i /botigues sí que llisten les
 * QUATRE botigues en text, amb adreça i telèfon. Només el mapa en té tres.
 *
 * Abans el mapa era un Google My Maps incrustat, amb l'identificador aquí. Es
 * va treure el 14/09/2026: portava una franja negra amb el nom del compte que
 * l'havia fet, botons de compartir i de pantalla completa que Google no deixa
 * amagar, i carregava cookies de Google. Ara el mapa el dibuixa el web
 * (src/components/StoresMap.tsx) i Google no es toca fins que algú clica un pin.
 */
export const BOTIGUES_AL_MAPA = ["girona", "blanes", "palamos"] as const;

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
 * Ruta fins a la botiga, a Google Maps. És el que obre cada pin del mapa.
 *
 * Esquema oficial d'URL de Google Maps (`/maps/dir/?api=1`): no demana clau
 * d'API, i obre directament el mode d'indicacions amb la botiga com a destí.
 * Al mòbil, si hi ha l'app de Google Maps instal·lada, s'obre allà. L'origen
 * no es posa: Google fa servir la ubicació de qui ho mira, si l'ha donat.
 */
export function urlIndicacions(key: StoreKey): string {
  const g = GOOGLE[key];
  const desti = `destination=${encodeURIComponent(g.cerca)}`;
  const lloc = g.placeId ? `&destination_place_id=${g.placeId}` : "";
  return `https://www.google.com/maps/dir/?api=1&${desti}${lloc}`;
}

/**
 * Enllaç directe a escriure una ressenya. Retorna null si encara no tenim el
 * Place ID: val més no ensenyar el botó que ensenyar-ne un que falla.
 */
export function urlEscriuRessenya(key: StoreKey): string | null {
  const id = GOOGLE[key].placeId;
  return id ? `https://search.google.com/local/writereview?placeid=${id}` : null;
}
