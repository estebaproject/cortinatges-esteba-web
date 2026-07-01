"use client";

// Panell de compra de la fitxa de moble — tema Kave.
// Mostra el bloc de PREU (reactiu a la variant escollida, amb rebaixa real si
// la variant té pvpAbans), el selector de variants (només si n'hi ha més d'una),
// el termini d'entrega (requisit legal, visible ABANS de comprar), un selector
// de quantitat i el botó negre "Afegir a la cistella".
//
// NOMÉS dades públiques (nom, dimensió, PVP amb IVA). MAI cost intern.

import { useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/components/cart/CartProvider";
import { formatVariantLabel, type MobleVariant } from "@/lib/mobiliari-detall";
import { discountPct, formatEur } from "@/lib/discount";

type Props = {
  slug: string;
  nom: string;
  variants: MobleVariant[];
  termini: string;
  image: string;
  href: string;
  /** Acabat de color escollit al bloc superior (null si el moble no en té). */
  colorName?: string | null;
};

function variantKey(variant: MobleVariant, index: number): string {
  return variant.dim ? `${index}-${variant.dim}` : `${index}`;
}

export default function MoblePurchasePanel({
  slug,
  nom,
  variants,
  termini,
  image,
  href,
  colorName,
}: Props) {
  const t = useTranslations("Producte");
  const tCart = useTranslations("Cart");
  const ts = useTranslations("Shop");
  const tm = useTranslations("Mobiliari");
  const locale = useLocale();
  const { add } = useCart();

  const single = variants.length === 1;
  const [selected, setSelected] = useState<number | null>(single ? 0 : null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedVariant = useMemo(
    () => (selected === null ? null : (variants[selected] ?? null)),
    [variants, selected],
  );

  const minPvp = useMemo(() => Math.min(...variants.map((v) => v.pvp)), [variants]);

  // Preu a mostrar: si hi ha variant escollida, la seva; si no (multi sense
  // tria), un "des de" amb el mínim i sense badge de descompte (seria ambigu).
  const showFrom = !selectedVariant && !single;
  const displayPvp = selectedVariant ? selectedVariant.pvp : minPvp;
  const displayAbans = selectedVariant ? selectedVariant.pvpAbans : undefined;
  const pct = discountPct(displayPvp, displayAbans);

  const dimsAreAmbiguous = useMemo(() => {
    const dims = variants.map((v) => v.dim ?? "");
    return new Set(dims).size < variants.length || variants.some((v) => !v.dim);
  }, [variants]);

  const handleAdd = () => {
    if (selected === null || !selectedVariant) return;
    const label = formatVariantLabel(selectedVariant);
    // Si hi ha color escollit, l'afegim al nom (visible a la cistella) i a la
    // clau (perquè dos colors del mateix moble+mida siguin línies diferents).
    // La miniatura (image) ja és la foto del color, ve del bloc superior.
    const colorSuffix = colorName ? ` · ${colorName}` : "";
    const colorKey = colorName ? `#${colorName}` : "";
    add(
      {
        slug: `${slug}#${variantKey(selectedVariant, selected)}${colorKey}`,
        href,
        nom: `${nom} — ${label}${colorSuffix}`,
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

      {/* Selector de variants (només si n'hi ha més d'una) */}
      {!single && (
        <fieldset className="mb-6">
          <legend className="text-sm font-medium text-kave-ink mb-3">
            {t("selectVariant")}
          </legend>
          <div className="space-y-2">
            {variants.map((v, i) => {
              const isSelected = i === selected;
              const label = formatVariantLabel(v);
              const showSubtitle = dimsAreAmbiguous && v.dim !== null;
              const vPct = discountPct(v.pvp, v.pvpAbans);
              return (
                <label
                  key={variantKey(v, i)}
                  className={`flex items-center justify-between gap-4 px-4 py-3 border cursor-pointer transition-colors ${
                    isSelected ? "border-kave-ink bg-kave-surface" : "border-kave-line hover:border-kave-ink/50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`variant-${slug}`}
                      value={i}
                      checked={isSelected}
                      onChange={() => setSelected(i)}
                      className="accent-kave-ink mt-0.5 self-start"
                    />
                    <span className="flex flex-col">
                      <span className="text-[0.95rem] text-kave-ink">{label}</span>
                      {showSubtitle && (
                        <span className="text-sm text-kave-muted">{v.nom}</span>
                      )}
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
              ? tCart("addAria", { nom: `${nom} — ${formatVariantLabel(selectedVariant)}` })
              : t("selectVariant")
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
