"use client";

// Panell de compra de la fitxa de manta — tema Kave.
// Mostra el bloc de PREU (reactiu a la mesura escollida, amb rebaixa real si la
// mesura té pvpAbans), el selector de mesures (només si n'hi ha més d'una), el
// termini d'entrega (requisit legal, visible ABANS de comprar), un selector de
// quantitat i el botó negre "Afegir a la cistella".
//
// Cada manta sol tenir una única mesura, així que ve preseleccionada.
//
// NOMÉS dades públiques (nom, mesura, PVP amb IVA). MAI cost intern.
// Clon de MoblePurchasePanel adaptat a mantes (variants keyed per mida).

import { useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/components/cart/CartProvider";
import { formatMantaMidaLabel, type MantaVariant } from "@/lib/mantes-detall";
import { discountPct, formatEur } from "@/lib/discount";

type Props = {
  /** Slug base de la manta ("agra"). */
  slug: string;
  /** Nom propi del model (no es tradueix). */
  nom: string;
  /** Mesures disponibles amb el seu PVP. */
  variants: MantaVariant[];
  /** Termini d'entrega (text legal). Sempre visible. */
  termini: string;
  /** Imatge per a la línia del cistell. */
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
  const ts = useTranslations("Shop");
  const tm = useTranslations("Mantes");
  const locale = useLocale();
  const { add } = useCart();

  // Cada manta sol tenir una única mesura => ve preseleccionada. Si en tingués
  // més, l'usuari hauria de triar conscientment (selected = null).
  const single = variants.length === 1;
  const [selected, setSelected] = useState<string | null>(
    single ? variants[0].mida : null,
  );
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedVariant = useMemo(
    () => variants.find((v) => v.mida === selected) ?? null,
    [variants, selected],
  );

  const minPvp = useMemo(() => Math.min(...variants.map((v) => v.pvp)), [variants]);

  // Preu a mostrar: si hi ha mesura escollida, la seva; si no (multi sense tria),
  // un "des de" amb el mínim i sense badge de descompte (seria ambigu).
  const showFrom = !selectedVariant && !single;
  const displayPvp = selectedVariant ? selectedVariant.pvp : minPvp;
  const displayAbans = selectedVariant ? selectedVariant.pvpAbans : undefined;
  const pct = discountPct(displayPvp, displayAbans);

  const handleAdd = () => {
    if (!selectedVariant) return;
    const midaLabel = formatMantaMidaLabel(selectedVariant.mida);
    add(
      {
        // Slug compost: cada mesura és una línia independent al cistell.
        slug: `${slug}#${selectedVariant.mida}`,
        href,
        // El nom inclou la mesura perquè el cistell i el missatge de WhatsApp
        // (que només mostren `nom`) reflecteixin què s'ha comprat.
        nom: `${nom} — ${midaLabel}`,
        pvp: selectedVariant.pvp,
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
            {showFrom ? `${tm("fromPrice")} ` : ""}
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

      {/* Selector de mesures (només si n'hi ha més d'una) */}
      {!single && (
        <fieldset className="mb-6">
          <legend className="text-sm font-medium text-kave-ink mb-3">
            {t("selectMeasure")}
          </legend>
          <div className="space-y-2">
            {variants.map((v) => {
              const isSelected = v.mida === selected;
              const vPct = discountPct(v.pvp, v.pvpAbans);
              return (
                <label
                  key={v.mida}
                  className={`flex items-center justify-between gap-4 px-4 py-3 border cursor-pointer transition-colors ${
                    isSelected ? "border-kave-ink bg-kave-surface" : "border-kave-line hover:border-kave-ink/50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`mida-${slug}`}
                      value={v.mida}
                      checked={isSelected}
                      onChange={() => setSelected(v.mida)}
                      className="accent-kave-ink"
                    />
                    <span className="text-[0.95rem] text-kave-ink">
                      {formatMantaMidaLabel(v.mida)}
                    </span>
                  </span>
                  <span className="flex items-baseline gap-2 shrink-0 tabular-nums">
                    {vPct !== null && v.pvpAbans !== undefined && (
                      <span className="text-sm text-kave-muted line-through">
                        {formatEur(v.pvpAbans, locale)}
                      </span>
                    )}
                    <span className={`text-[0.95rem] font-semibold ${vPct !== null ? "text-kave-red" : "text-kave-ink"}`}>
                      {formatEur(v.pvp, locale)}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Termini d'entrega — requisit legal */}
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
          disabled={!selectedVariant}
          aria-label={
            selectedVariant
              ? tCart("addAria", { nom: `${nom} — ${formatMantaMidaLabel(selectedVariant.mida)}` })
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
        className={`mt-3 text-sm text-kave-tag transition-opacity ${added ? "opacity-100" : "opacity-0"}`}
      >
        {added ? tCart("added") : " "}
      </p>
    </div>
  );
}
