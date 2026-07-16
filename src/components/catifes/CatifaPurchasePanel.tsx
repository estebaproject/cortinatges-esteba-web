"use client";

// Panell de compra de la fitxa de catifa — tema Kave.
// Mostra el bloc de PREU (reactiu a la mesura escollida, amb rebaixa real si la
// mesura té pvpAbans), el badge "Per encàrrec" si escau, el selector de mesures,
// el termini d'entrega (requisit legal, visible ABANS de comprar), un selector de
// quantitat i el botó negre "Afegir a la cistella" que empeny la mesura escollida
// al cistell (CartProvider) amb slug compost "{slug}#{mida}".
//
// NOMÉS dades públiques (nom, mesura, PVP amb IVA). MAI cost intern.

import { useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/components/cart/CartProvider";
import { formatMidaLabel, type CatifaMida } from "@/lib/catifes-detall";
import { discountPct, formatEur } from "@/lib/discount";

type Props = {
  /** Slug base de la catifa ("adore"). */
  slug: string;
  /** Nom propi del model (no es tradueix). */
  nom: string;
  /** Mesures disponibles amb el seu PVP. */
  mides: CatifaMida[];
  /** Termini d'entrega (text legal). Sempre visible. */
  termini: string;
  /** true => mostra el badge "Per encàrrec". */
  perEncarrec: boolean;
  /** Imatge per a la línia del cistell. */
  image: string;
  /** Ruta relativa a la fitxa, sense prefix de locale ("/catifes/adore"). */
  href: string;
  /** Referència/color escollit al bloc superior (null si la catifa no en té). */
  colorCode?: string | null;
  /** Mides NO disponibles per al color escollit (es deshabiliten al selector). */
  unavailableSizes?: string[];
};

export default function CatifaPurchasePanel({
  slug,
  nom,
  mides,
  termini,
  perEncarrec,
  image,
  href,
  colorCode,
  unavailableSizes = [],
}: Props) {
  const t = useTranslations("Producte");
  const tCart = useTranslations("Cart");
  const ts = useTranslations("Shop");
  const tc = useTranslations("Catifes");
  const locale = useLocale();
  const { add } = useCart();

  const unavailable = useMemo(() => new Set(unavailableSizes), [unavailableSizes]);
  // Mides realment disponibles per al color escollit.
  const availMides = useMemo(() => mides.filter((m) => !unavailable.has(m.mida)), [mides, unavailable]);

  const single = availMides.length === 1;
  // Per defecte, cap mesura seleccionada (l'usuari tria conscientment), tret que
  // només n'hi hagi una.
  const [selected, setSelected] = useState<string | null>(single ? availMides[0].mida : null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Si la mida escollida deixa d'estar disponible (canvi de color), es descarta.
  const selectedMida = useMemo(
    () => mides.find((m) => m.mida === selected && !unavailable.has(m.mida)) ?? null,
    [mides, selected, unavailable],
  );

  const minPvp = useMemo(
    () => Math.min(...(availMides.length ? availMides : mides).map((m) => m.pvp)),
    [availMides, mides],
  );

  // Preu a mostrar: si hi ha mesura escollida, la seva; si no (multi sense
  // tria), un "des de" amb el mínim i sense badge de descompte (seria ambigu).
  const showFrom = !selectedMida && !single;
  const displayPvp = selectedMida ? selectedMida.pvp : minPvp;
  const displayAbans = selectedMida ? selectedMida.pvpAbans : undefined;
  const pct = discountPct(displayPvp, displayAbans);

  const handleAdd = () => {
    if (!selectedMida) return;
    const midaLabel = formatMidaLabel(selectedMida.mida);
    // El color/referencia escollit fa la linia de cistella unica i visible.
    const colorSuffix = colorCode ? ` · ${colorCode}` : "";
    const colorKey = colorCode ? `#${colorCode}` : "";
    add(
      {
        // Slug compost: cada mesura (i color) és una línia independent al cistell.
        slug: `${slug}#${selectedMida.mida}${colorKey}`,
        href,
        // El nom inclou la mesura i el color perquè el cistell i el missatge de
        // WhatsApp (que només mostren `nom`) reflecteixin què s'ha comprat.
        nom: `${nom} — ${midaLabel}${colorSuffix}`,
        pvp: selectedMida.pvp,
        image,
      },
      qty,
    );
    setAdded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAdded(false), 2200);
  };

  return (
    <div className="font-grotesque">
      {/* Bloc de preu */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 flex-wrap">
          <span
            className={`text-3xl font-semibold tabular-nums ${pct !== null ? "text-kave-red" : "text-kave-ink"}`}
          >
            {showFrom ? `${tc("fromPrice")} ` : ""}
            {formatEur(displayPvp, locale)}
          </span>
          {pct !== null && (
            <span className="text-lg font-medium text-kave-red">-{pct}%</span>
          )}
        </div>
        {pct !== null && displayAbans !== undefined && (
          <p className="text-sm text-kave-muted mt-1">
            {ts("before")}{" "}
            <span className="line-through">{formatEur(displayAbans, locale)}</span>
          </p>
        )}
      </div>

      {/* Badge "Per encàrrec" */}
      {perEncarrec && (
        <p className="inline-flex items-center gap-1.5 mb-6 px-3 py-1 bg-kave-surface border border-kave-line text-sm text-kave-muted">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
          {t("perEncarrec")}
        </p>
      )}

      {/* Selector de mesures */}
      <fieldset className="mb-6">
        <legend className="text-sm font-medium text-kave-ink mb-3">
          {t("selectMeasure")}
        </legend>
        <div className="space-y-2">
          {mides.map((m) => {
            const off = unavailable.has(m.mida);
            const isSelected = selectedMida?.mida === m.mida;
            const mPct = discountPct(m.pvp, m.pvpAbans);
            return (
              <label
                key={m.mida}
                className={`flex items-center justify-between gap-4 px-4 py-3 border transition-colors ${
                  off
                    ? "border-kave-line opacity-40 cursor-not-allowed"
                    : isSelected
                      ? "border-kave-ink bg-kave-surface cursor-pointer"
                      : "border-kave-line hover:border-kave-ink/50 cursor-pointer"
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`mida-${slug}`}
                    value={m.mida}
                    checked={isSelected}
                    disabled={off}
                    onChange={() => setSelected(m.mida)}
                    className="accent-kave-ink"
                  />
                  <span className="text-[0.95rem] text-kave-ink">
                    {formatMidaLabel(m.mida)}
                    {off && <span className="text-xs text-kave-muted"> · no disp.</span>}
                  </span>
                </span>
                <span className="flex items-baseline gap-2 shrink-0 tabular-nums">
                  {mPct !== null && m.pvpAbans !== undefined && (
                    <span className="text-sm text-kave-muted line-through">
                      {formatEur(m.pvpAbans, locale)}
                    </span>
                  )}
                  <span className={`text-[0.95rem] font-semibold ${mPct !== null ? "text-kave-red" : "text-kave-ink"}`}>
                    {formatEur(m.pvp, locale)}
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Termini d'entrega — requisit legal: visible ABANS de comprar */}
      <div className="mb-6 flex items-start gap-2.5">
        <svg className="w-4 h-4 mt-0.5 shrink-0 text-kave-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <p className="text-sm text-kave-muted">
          <span className="text-kave-ink font-medium">{t("deliveryTime")}: </span>
          {termini}
        </p>
      </div>

      {/* Quantitat + Afegir */}
      <div className="flex items-stretch gap-3">
        <div className="relative">
          <label htmlFor={`qty-${slug}`} className="sr-only">{ts("quantity")}</label>
          <select
            id={`qty-${slug}`}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="h-full appearance-none border border-kave-ink/30 bg-kave-bg pl-4 pr-9 text-sm text-kave-ink focus:outline-none focus:border-kave-ink transition-colors"
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-kave-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
          </svg>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectedMida}
          aria-label={
            selectedMida
              ? tCart("addAria", { nom: `${nom} — ${formatMidaLabel(selectedMida.mida)}` })
              : t("selectMeasure")
          }
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-kave-ink text-white text-sm font-semibold tracking-wide hover:bg-kave-ink/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-kave-ink"
        >
          {t("addToCart")}
        </button>
      </div>

      {/* Confirmació accessible */}
      <p
        role="status"
        aria-live="polite"
        className={`mt-3 text-sm text-kave-ink transition-opacity ${added ? "opacity-100" : "opacity-0"}`}
      >
        {added ? tCart("added") : " "}
      </p>
    </div>
  );
}
