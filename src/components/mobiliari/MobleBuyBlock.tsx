"use client";

// Bloc superior de la fitxa de moble (imatge + columna de compra) amb estat de
// COLOR compartit. En triar un swatch de color, canvia la foto principal i
// passa l'acabat escollit al panell de compra (que l'afegeix a la cistella).
// Els swatches són miniatures de la pròpia foto del color (res de codis hex):
// així cada mostra ensenya el producte real en aquell acabat.
//
// Si el moble no té detall vendible (cap variant de preu), es manté el CTA de
// pressupost però els swatches segueixen canviant la foto.

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { formatEur } from "@/lib/discount";
import type { MobleColor } from "@/lib/mobiliari-colors";
import type { MobleVariant } from "@/lib/mobiliari-detall";
import MoblePurchasePanel from "./MoblePurchasePanel";

type Props = {
  slug: string;
  nom: string;
  catLabel: string;
  imgFit: "contain" | "cover";
  defaultImage: string;
  colors: MobleColor[];
  variants: MobleVariant[];
  termini: string | null;
  basePvp: number;
  budgetHref: string;
  href: string;
};

export default function MobleBuyBlock({
  slug,
  nom,
  catLabel,
  imgFit,
  defaultImage,
  colors,
  variants,
  termini,
  basePvp,
  budgetHref,
  href,
}: Props) {
  const t = useTranslations("Mobiliari");
  const tp = useTranslations("Producte");
  const locale = useLocale();

  const hasColors = colors.length > 0;
  const [selected, setSelected] = useState(0);
  const selectedColor = hasColors ? colors[selected] : null;
  const mainImage = selectedColor ? selectedColor.image : defaultImage;
  // Les fotos de color són retalls sobre blanc → sempre "contain" (encara que
  // la foto hero per defecte del moble fos una escena "cover"). Sense color,
  // respectem el fit original de la foto principal.
  const fit = hasColors ? "contain" : imgFit;

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
      {/* Galeria — la foto principal canvia amb el color escollit. */}
      <div
        className={`relative aspect-[4/5] overflow-hidden bg-kave-surface ${fit === "cover" ? "" : "p-8 lg:p-12"}`}
      >
        <Image
          key={mainImage}
          src={mainImage}
          alt={selectedColor ? `${nom} — ${selectedColor.name}` : nom}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={fit === "cover" ? "object-cover" : "object-contain"}
        />
      </div>

      {/* Columna dreta */}
      <div className="lg:sticky lg:top-32 self-start">
        <p className="text-sm text-kave-muted mb-2">{catLabel}</p>
        <h1 className="font-display text-3xl md:text-4xl text-kave-ink mb-6 leading-tight">
          {nom}
        </h1>

        {/* Selector de color (miniatures de la foto de cada acabat) */}
        {hasColors && (
          <div className="mb-6">
            <p className="text-sm font-medium text-kave-ink mb-3">
              {tp("colorLabel")}:{" "}
              <span className="text-kave-muted font-normal">{selectedColor?.name}</span>
            </p>
            <div className="flex flex-wrap gap-2.5">
              {colors.map((c, i) => {
                const isSel = i === selected;
                return (
                  <button
                    key={c.image}
                    type="button"
                    onClick={() => setSelected(i)}
                    aria-pressed={isSel}
                    aria-label={c.name}
                    title={c.name}
                    className={`relative h-14 w-14 overflow-hidden rounded-md border transition-all ${
                      isSel
                        ? "border-kave-ink ring-2 ring-kave-ink ring-offset-2 ring-offset-kave-bg"
                        : "border-kave-line hover:border-kave-ink/50"
                    }`}
                  >
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {variants.length > 0 && termini ? (
          <MoblePurchasePanel
            slug={slug}
            nom={nom}
            variants={variants}
            termini={termini}
            image={mainImage}
            href={href}
            colorName={selectedColor?.name ?? null}
          />
        ) : (
          <div>
            <p className="text-3xl font-semibold text-kave-ink mb-6">
              {t("fromPrice")} {formatEur(basePvp, locale)}
            </p>
            <Link
              href={budgetHref}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-kave-ink text-white text-sm font-semibold hover:bg-kave-ink/90 transition-colors"
            >
              {t("requestBudget")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
