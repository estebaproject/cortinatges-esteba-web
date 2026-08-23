"use client";

import { useEffect, useState } from "react";
import { CONSENT_EVENT } from "@/components/CookieBanner";

/**
 * Mapa amb tots els punts de venda, DARRERE DEL CONSENTIMENT DE COOKIES.
 *
 * Per què aquest embolcall i no un <iframe> directe:
 * els iframes de Google Maps carreguen scripts i cookies de Google en el
 * moment de renderitzar. A /contacte s'estaven carregant SEMPRE, abans que
 * l'usuari toqués el banner. En un lloc amb banner i política de cookies
 * publicada, això és exactament el que la política diu que no passa.
 *
 * Mentre no hi ha consentiment es mostra el que de debò necessita l'usuari
 * —ciutat i adreça de cada botiga— i el mapa apareix sol quan accepta les
 * cookies al banner que ja hi ha. No s'hi afegeix cap botó ni cap text nou:
 * qualsevol copy nou hauria d'estar redactat i traduït als 4 idiomes, i això
 * és feina del client, no del component.
 */

const CONSENT_KEY = "esteba-cookie-consent";

type Store = { city: string; address: string };

/**
 * Identificador d'un mapa fet a Google My Maps.
 *
 * PER QUÈ AIXÒ I NO UNA CERCA: l'embed de cerca
 * (`maps.google.com/maps?q=…&output=embed`) és una CERCA, i Google la resol
 * sempre a UNA fitxa. Provat amb tres consultes diferents: sortia només
 * Girona, per moltes botigues que hi hagi. Un mapa de My Maps porta els punts
 * que hi hagi posat el client, i no depèn de què li sembli a Google.
 *
 * No cal clau d'API ni compte de facturació: el mapa viu al compte de Google
 * del client i aquí només se n'incrusta l'identificador.
 */
export type MyMapsId = string;

export default function StoresMap({
  stores,
  query,
  mid,
  className = "",
}: {
  stores: Store[];
  /** Cerca de Google Maps. Només s'usa si NO hi ha `mid`. */
  query: string;
  /** Mapa de My Maps. Si hi és, mana ell: és l'únic que ensenya més d'un punt. */
  mid?: MyMapsId;
  className?: string;
}) {
  const [permes, setPermes] = useState(false);

  useEffect(() => {
    const llegeix = () => {
      try {
        setPermes(localStorage.getItem(CONSENT_KEY) === "accepted");
      } catch {
        // localStorage bloquejat (navegació privada): es queda a les adreces.
      }
    };
    llegeix();
    // DOS avisos, i fan falta tots dos:
    //
    // `CONSENT_EVENT` és el del banner d'aquesta mateixa pestanya. Abans aquí
    // només hi havia `storage`, que per especificació NOMÉS arriba als altres
    // documents: en acceptar les cookies el mapa no apareixia i calia
    // recarregar a mà. El comentari que hi havia deia que funcionava.
    //
    // `storage` es queda per al cas de debò: acceptar en una altra pestanya.
    window.addEventListener(CONSENT_EVENT, llegeix);
    window.addEventListener("storage", llegeix);
    return () => {
      window.removeEventListener(CONSENT_EVENT, llegeix);
      window.removeEventListener("storage", llegeix);
    };
  }, []);

  if (permes) {
    return (
      <div
        className={`relative aspect-[16/9] overflow-hidden border border-linen bg-linen ${className}`}
      >
        <iframe
          src={
            mid
              ? `https://www.google.com/maps/d/embed?mid=${encodeURIComponent(mid)}&ehbc=2E312F`
              : `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=9&output=embed`
          }
          className="absolute inset-0 h-full w-full"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={query}
        />
      </div>
    );
  }

  return (
    <div className={`border border-linen bg-canvas-warm p-8 ${className}`}>
      <ul
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5"
        role="list"
      >
        {stores.map((s) => (
          <li key={s.city + s.address}>
            <p className="font-serif text-body-lg text-ink">{s.city}</p>
            <p className="font-sans text-body-sm text-ink-muted">{s.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
