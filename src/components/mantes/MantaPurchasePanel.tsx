"use client";

// Panell de compra de la fitxa de manta (client). Mostra TOTA la informacio
// necessaria per comprar: la mesura amb el seu PVP (IVA inclos), el termini
// d'entrega (requisit legal: visible ABANS de comprar) i un boto "Afegir a la
// cistella" que empeny la mesura escollida al cistell existent (CartProvider)
// amb slug compost "{slug}#{mida}".
//
// Cada manta te una unica mesura, aixi que ja ve preseleccionada.
//
// NOMES dades publiques (nom, mesura, PVP amb IVA). MAI cost intern.
//
// Clon minim de CatifaPurchasePanel.

import { useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/components/cart/CartProvider";
import { formatMantaMidaLabel, type MantaVariant } from "@/lib/mantes-detall";

type Props = {
  /** Slug base de la manta ("agra"). */
  slug: string;
  /** Nom propi del model (no es tradueix). */
  nom: string;
  /** Mesures disponibles amb el seu PVP. */
  variants: MantaVariant[];
  /** Termini d'entrega (text legal). Sempre visible. */
  termini: string;
  /** Imatge per a la linia del cistell. */
  image: string;
  /** Ruta relativa a la fitxa, sense prefix de locale ("/mantes/agra"). */
  href: string;
};

export default function MantaPurchasePanel({
  slug,
  nom,
  variants,
  termini,
  image,
  href,
}: Props) {
  const t = useTranslations("Producte");
  const tCart = useTranslations("Cart");
  const locale = useLocale();
  const { add } = useCart();

  // Cada manta te una unica mesura => ve preseleccionada. Si en tingues mes,
  // l'usuari hauria de triar conscientment (selected = null).
  const [selected, setSelected] = useState<string | null>(
    variants.length === 1 ? variants[0].mida : null,
  );
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fmtPrice = (n: number) =>
    `${n.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} €`;

  const selectedVariant = useMemo(
    () => variants.find((v) => v.mida === selected) ?? null,
    [variants, selected],
  );

  const handleAdd = () => {
    if (!selectedVariant) return;
    const midaLabel = formatMantaMidaLabel(selectedVariant.mida);
    add({
      // Slug compost: cada mesura es una linia independent al cistell.
      slug: `${slug}#${selectedVariant.mida}`,
      href,
      // El nom inclou la mesura perque el cistell i el missatge de WhatsApp
      // (que nomes mostren `nom`) reflecteixin que s'ha comprat.
      nom: `${nom} — ${midaLabel}`,
      pvp: selectedVariant.pvp,
      image,
    });
    setAdded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div>
      {/* Selector de mesures */}
      <fieldset className="mb-6">
        <legend className="font-sans text-body-sm font-medium text-ink mb-3">
          {variants.length === 1 ? t("measures") : t("selectMeasure")}
        </legend>
        <div className="space-y-2">
          {variants.map((v) => {
            const isSelected = v.mida === selected;
            return (
              <label
                key={v.mida}
                className={`flex items-center justify-between gap-4 px-4 py-3 border cursor-pointer transition-colors ${
                  isSelected
                    ? "border-ink bg-canvas-warm"
                    : "border-sand-dark/25 hover:border-ink/50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`mida-${slug}`}
                    value={v.mida}
                    checked={isSelected}
                    onChange={() => setSelected(v.mida)}
                    className="accent-ink"
                  />
                  <span className="font-sans text-body-md text-ink">
                    {formatMantaMidaLabel(v.mida)}
                  </span>
                </span>
                <span className="font-sans text-body-md text-ink font-semibold tabular-nums">
                  {fmtPrice(v.pvp)}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Termini d'entrega — requisit legal: visible ABANS de comprar */}
      <div className="mb-6 flex items-start gap-2.5">
        <svg
          className="w-4 h-4 mt-0.5 shrink-0 text-ink-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
        <p className="font-sans text-body-sm text-ink-muted">
          <span className="text-ink font-medium">{t("deliveryTime")}: </span>
          {termini}
        </p>
      </div>

      {/* Afegir a la cistella */}
      <button
        type="button"
        onClick={handleAdd}
        disabled={!selectedVariant}
        aria-label={
          selectedVariant
            ? tCart("addAria", {
                nom: `${nom} — ${formatMantaMidaLabel(selectedVariant.mida)}`,
              })
            : t("selectMeasure")
        }
        className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-ink text-canvas font-sans text-body-md font-semibold tracking-wide hover:bg-accent-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
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
        {t("addToCart")}
      </button>

      {/* Confirmacio accessible */}
      <p
        role="status"
        aria-live="polite"
        className={`mt-3 font-sans text-body-sm text-accent-deep transition-opacity ${
          added ? "opacity-100" : "opacity-0"
        }`}
      >
        {added ? tCart("added") : " "}
      </p>
    </div>
  );
}
