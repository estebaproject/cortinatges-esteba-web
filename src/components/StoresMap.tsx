"use client";

import { useEffect, useState } from "react";

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

export default function StoresMap({
  stores,
  query,
  className = "",
}: {
  stores: Store[];
  /** Cerca que es passa a Google Maps (p. ex. "Cortinatges Esteba"). */
  query: string;
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
    // El banner desa el consentiment sense recarregar la pàgina: escoltem el
    // canvi perquè el mapa aparegui a l'instant i no calgui refrescar.
    window.addEventListener("storage", llegeix);
    return () => window.removeEventListener("storage", llegeix);
  }, []);

  if (permes) {
    return (
      <div
        className={`relative aspect-[16/9] overflow-hidden border border-linen bg-linen ${className}`}
      >
        <iframe
          src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=9&output=embed`}
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
