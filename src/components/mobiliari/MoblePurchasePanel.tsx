"use client";

// Panell de compra de la fitxa de moble (client). Mostra TOTA la informacio
// necessaria per comprar: cada variant amb la seva dimensio + PVP (IVA inclos),
// el termini d'entrega (requisit legal: visible ABANS de comprar) i un boto
// "Afegir a la cistella" que empeny la variant escollida al cistell existent
// (CartProvider) amb slug compost "{slug}#{variantKey}".
//
// NOMES dades publiques (nom, dimensio, PVP amb IVA). MAI cost intern.
//
// Clon adaptat de CatifaPurchasePanel: aqui les "variants" son peces o acabats
// d'una familia (ex. Cubo te 4 mides; les cadires nomes 1 variant).

import { useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/components/cart/CartProvider";
import { formatVariantLabel, type MobleVariant } from "@/lib/mobiliari-detall";

type Props = {
  /** Slug base del moble ("cubo"). */
  slug: string;
  /** Nom propi del model (no es tradueix). */
  nom: string;
  /** Variants disponibles amb el seu PVP. */
  variants: MobleVariant[];
  /** Termini d'entrega (text legal). Sempre visible. */
  termini: string;
  /** Imatge per a la linia del cistell. */
  image: string;
  /** Ruta relativa a la fitxa, sense prefix de locale ("/mobiliari/cubo"). */
  href: string;
};

/**
 * Clau estable d'una variant per al slug compost del cistell. Fem servir
 * l'index perque diverses variants poden compartir dimensio (ex. Pegasus
 * Roble/Nogal a 120x40x76) i el slug ha de ser unic per linia.
 */
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
}: Props) {
  const t = useTranslations("Producte");
  const tCart = useTranslations("Cart");
  const locale = useLocale();
  const { add } = useCart();

  // Si nomes hi ha una variant, ja ve preseleccionada; si n'hi ha mes, l'usuari
  // ha de triar conscientment.
  const [selected, setSelected] = useState<number | null>(
    variants.length === 1 ? 0 : null,
  );
  const [added, setAdded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fmtPrice = (n: number) =>
    `${n.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} €`;

  const selectedVariant = useMemo(
    () => (selected === null ? null : (variants[selected] ?? null)),
    [variants, selected],
  );

  // true => totes les variants comparteixen una dimensio (o cap en te): el nom
  // descriptiu aporta la diferencia (acabat, color), aixi que el mostrem.
  const dimsAreAmbiguous = useMemo(() => {
    const dims = variants.map((v) => v.dim ?? "");
    return new Set(dims).size < variants.length || variants.some((v) => !v.dim);
  }, [variants]);

  const handleAdd = () => {
    if (selected === null || !selectedVariant) return;
    const label = formatVariantLabel(selectedVariant);
    add({
      // Slug compost: cada variant es una linia independent al cistell.
      slug: `${slug}#${variantKey(selectedVariant, selected)}`,
      href,
      // El nom inclou la variant perque el cistell i el missatge de WhatsApp
      // (que nomes mostren `nom`) reflecteixin que s'ha comprat.
      nom: `${nom} — ${label}`,
      pvp: selectedVariant.pvp,
      image,
    });
    setAdded(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAdded(false), 2200);
  };

  // Per a mobles, la mateixa peca pot tenir mes d'una opcio: si totes son la
  // mateixa familia amb una sola variant, parlem de "mesura"; si no, "variant".
  const legend = variants.length === 1 ? t("measures") : t("selectVariant");

  return (
    <div>
      {/* Selector de variants */}
      <fieldset className="mb-6">
        <legend className="font-sans text-body-sm font-medium text-ink mb-3">
          {legend}
        </legend>
        <div className="space-y-2">
          {variants.map((v, i) => {
            const isSelected = i === selected;
            const label = formatVariantLabel(v);
            // Mostrem el nom descriptiu com a subtitol quan la dimensio sola no
            // distingeix la variant (acabats/colors o variants sense dimensio).
            const showSubtitle = dimsAreAmbiguous && v.dim !== null;
            return (
              <label
                key={variantKey(v, i)}
                className={`flex items-center justify-between gap-4 px-4 py-3 border cursor-pointer transition-colors ${
                  isSelected
                    ? "border-ink bg-canvas-warm"
                    : "border-sand-dark/25 hover:border-ink/50"
                }`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`variant-${slug}`}
                    value={i}
                    checked={isSelected}
                    onChange={() => setSelected(i)}
                    className="accent-ink mt-0.5 self-start"
                  />
                  <span className="flex flex-col">
                    <span className="font-sans text-body-md text-ink">
                      {label}
                    </span>
                    {showSubtitle && (
                      <span className="font-sans text-body-sm text-ink-muted">
                        {v.nom}
                      </span>
                    )}
                  </span>
                </span>
                <span className="font-sans text-body-md text-ink font-semibold tabular-nums shrink-0">
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
                nom: `${nom} — ${formatVariantLabel(selectedVariant)}`,
              })
            : t("selectVariant")
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
