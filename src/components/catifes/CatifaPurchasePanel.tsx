"use client";

// Panell de compra de la fitxa de catifa (client). Mostra TOTA la informacio
// necessaria per comprar: cada mesura amb el seu PVP (IVA inclos), el termini
// d'entrega (requisit legal: visible ABANS de comprar), el badge "Per encarrec"
// si escau, i un boto "Afegir a la cistella" que empeny la mesura escollida al
// cistell existent (CartProvider) amb slug compost "{slug}#{mida}".
//
// NOMES dades publiques (nom, mesura, PVP amb IVA). MAI cost intern.

import { useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/components/cart/CartProvider";
import { formatMidaLabel, type CatifaMida } from "@/lib/catifes-detall";

type Props = {
  /** Slug base de la catifa ("adore"). */
  slug: string;
  /** Nom propi del model (no es tradueix). */
  nom: string;
  /** Mesures disponibles amb el seu PVP. */
  mides: CatifaMida[];
  /** Termini d'entrega (text legal). Sempre visible. */
  termini: string;
  /** true => mostra el badge "Per encarrec". */
  perEncarrec: boolean;
  /** Imatge per a la linia del cistell. */
  image: string;
  /** Ruta relativa a la fitxa, sense prefix de locale ("/catifes/adore"). */
  href: string;
};

export default function CatifaPurchasePanel({
  slug,
  nom,
  mides,
  termini,
  perEncarrec,
  image,
  href,
}: Props) {
  const t = useTranslations("Producte");
  const tCart = useTranslations("Cart");
  const locale = useLocale();
  const { add } = useCart();

  // Per defecte, cap mesura seleccionada: l'usuari ha de triar conscientment.
  const [selected, setSelected] = useState<string | null>(
    mides.length === 1 ? mides[0].mida : null,
  );
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fmtPrice = (n: number) =>
    `${n.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} €`;

  const selectedMida = useMemo(
    () => mides.find((m) => m.mida === selected) ?? null,
    [mides, selected],
  );

  const handleAdd = () => {
    if (!selectedMida) return;
    const midaLabel = formatMidaLabel(selectedMida.mida);
    add({
      // Slug compost: cada mesura es una linia independent al cistell.
      slug: `${slug}#${selectedMida.mida}`,
      href,
      // El nom inclou la mesura perque el cistell i el missatge de WhatsApp
      // (que nomes mostren `nom`) reflecteixin que s'ha comprat.
      nom: `${nom} — ${midaLabel}`,
      pvp: selectedMida.pvp,
      image,
    });
    setAdded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div>
      {/* Badge "Per encarrec" */}
      {perEncarrec && (
        <p className="inline-flex items-center gap-1.5 mb-4 px-3 py-1 bg-canvas-warm border border-sand-dark/30 font-sans text-body-sm text-ink-muted">
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
            />
          </svg>
          {t("perEncarrec")}
        </p>
      )}

      {/* Selector de mesures */}
      <fieldset className="mb-6">
        <legend className="font-sans text-body-sm font-medium text-ink mb-3">
          {t("selectMeasure")}
        </legend>
        <div className="space-y-2">
          {mides.map((m) => {
            const isSelected = m.mida === selected;
            return (
              <label
                key={m.mida}
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
                    value={m.mida}
                    checked={isSelected}
                    onChange={() => setSelected(m.mida)}
                    className="accent-ink"
                  />
                  <span className="font-sans text-body-md text-ink">
                    {formatMidaLabel(m.mida)}
                  </span>
                </span>
                <span className="font-sans text-body-md text-ink font-semibold tabular-nums">
                  {fmtPrice(m.pvp)}
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
        disabled={!selectedMida}
        aria-label={
          selectedMida
            ? tCart("addAria", {
                nom: `${nom} — ${formatMidaLabel(selectedMida.mida)}`,
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
