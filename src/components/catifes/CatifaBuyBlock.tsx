"use client";

// Bloc superior de la fitxa de catifa (galeria + columna de compra) amb estat de
// COLOR/referencia compartit. En triar un swatch, la foto d'aquell color passa a
// ser la primera de la galeria i s'afegeix la referencia a la cistella. El preu
// depen de la MIDA (no del color); si el color no ve en alguna mida, aquella
// mida es deshabilita al selector (nomes 2 catifes tenen aquesta restriccio).
//
// Els swatches son la propia foto de cada referencia (el codi del fabricant no
// es "amigable", pero la FOTO es la informacio real).

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { CatifaColor } from "@/lib/catifes-colors";
import type { CatifaMida } from "@/lib/catifes-detall";
import type { GallerySlide } from "@/lib/catifes";
import ProductGallery from "@/components/shop/ProductGallery";
import CatifaPurchasePanel from "@/components/catifes/CatifaPurchasePanel";

type Props = {
  slug: string;
  nom: string;
  familyLabel: string;
  colors: CatifaColor[];
  slides: GallerySlide[];
  thumbsLabel: string;
  mides: CatifaMida[];
  termini: string | null;
  perEncarrec: boolean;
  productImage: string;
  href: string;
  priceLabel: string;
  budgetHref: string;
  requestBudget: string;
};

export default function CatifaBuyBlock({
  slug,
  nom,
  familyLabel,
  colors,
  slides,
  thumbsLabel,
  mides,
  termini,
  perEncarrec,
  productImage,
  href,
  priceLabel,
  budgetHref,
  requestBudget,
}: Props) {
  const tp = useTranslations("Producte");
  const hasColors = colors.length > 0;
  const [sel, setSel] = useState(0);
  const color = hasColors ? colors[Math.min(sel, colors.length - 1)] : null;

  // La foto del color escollit encapçala la galeria (remuntada per color).
  const displaySlides: GallerySlide[] = color
    ? [{ src: color.image, alt: `${nom} — ${color.code}`, kind: "producto", fit: "cover" }, ...slides]
    : slides;
  const cartImage = color ? color.image : productImage;

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
      <ProductGallery key={color?.code ?? "base"} slides={displaySlides} thumbsLabel={thumbsLabel} />

      <div className="lg:sticky lg:top-32 self-start">
        <p className="text-sm text-kave-muted mb-2">{familyLabel}</p>
        <h1 className="font-display text-3xl md:text-4xl text-kave-ink mb-6 leading-tight">
          {nom}
        </h1>

        {/* Selector de color/referencia */}
        {hasColors && (
          <div className="mb-6">
            <p className="text-sm font-medium text-kave-ink mb-3">
              {tp("colorLabel")}:{" "}
              <span className="text-kave-muted font-normal">{color?.code}</span>
            </p>
            <div className="flex flex-wrap gap-2.5">
              {colors.map((c, i) => {
                const isSel = i === sel;
                return (
                  <button
                    key={c.image}
                    type="button"
                    onClick={() => setSel(i)}
                    aria-pressed={isSel}
                    aria-label={c.code}
                    title={c.code}
                    className={`relative h-14 w-14 overflow-hidden rounded-md border transition-all ${
                      isSel
                        ? "border-kave-ink ring-2 ring-kave-ink ring-offset-2 ring-offset-kave-bg"
                        : "border-kave-line hover:border-kave-ink/50"
                    }`}
                  >
                    <Image src={c.image} alt={c.code} fill sizes="56px" className="object-cover" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {mides.length > 0 && termini ? (
          <CatifaPurchasePanel
            slug={slug}
            nom={nom}
            mides={mides}
            termini={termini}
            perEncarrec={perEncarrec}
            image={cartImage}
            href={href}
            colorCode={color?.code ?? null}
            unavailableSizes={color?.unavailable ?? []}
          />
        ) : (
          <div>
            <p className="text-3xl font-semibold text-kave-ink mb-6">{priceLabel}</p>
            <Link
              href={budgetHref}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-kave-ink text-white text-sm font-semibold hover:bg-kave-ink/90 transition-colors"
            >
              {requestBudget}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
