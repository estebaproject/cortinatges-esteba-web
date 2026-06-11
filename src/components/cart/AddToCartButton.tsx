"use client";

// Botó "Afegir al cistell" per a la ficha de producte (Server Component).
// Rep les dades públiques del producte per props i les empeny al cistell
// via useCart. Estil coherent amb el botó ESTEBA (bg-ink text-canvas).

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useCart } from "./CartProvider";

type Props = {
  slug: string;
  /**
   * Ruta RELATIVA a la fitxa del producte, SENSE prefix de locale i SENSE
   * sufix de color: "/catifes/adore", "/mobiliari/grenoble", "/decoracio/harbin".
   * La passa la pàgina que coneix la categoria i el slug base del model.
   */
  href: string;
  nom: string;
  /** PVP unitari, IVA inclòs (€). */
  pvp: number;
  image: string;
};

export default function AddToCartButton({ slug, href, nom, pvp, image }: Props) {
  const t = useTranslations("Cart");
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleAdd = () => {
    add({ slug, href, nom, pvp, image });
    setAdded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleAdd}
        aria-label={t("addAria", { nom })}
        className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-ink text-canvas font-sans text-body-md font-semibold tracking-wide hover:bg-accent-deep transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12A1.125 1.125 0 0 1 19.748 21H4.252a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 6.75h12.974c.576 0 1.059.435 1.119 1.007Z"
          />
        </svg>
        {t("add")}
      </button>

      {/* Confirmació accessible, anunciada per lectors de pantalla */}
      <p
        role="status"
        aria-live="polite"
        className={`mt-3 font-sans text-body-sm text-accent-deep transition-opacity ${
          added ? "opacity-100" : "opacity-0"
        }`}
      >
        {added ? t("added") : " "}
      </p>
    </div>
  );
}
