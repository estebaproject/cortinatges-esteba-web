"use client";

// Bloc superior de la fitxa de moble (imatge + columna de compra) amb estat de
// COLOR/ACABAT compartit. Dos casos:
//
//  A) Color independent (cadires): el moble té una sola variant de preu i N
//     fotos de color. El swatch només canvia la foto i afegeix l'acabat a la
//     cistella. Origen dels colors: mobiliari-colors.ts.
//
//  B) L'acabat ÉS un eix de variant (col·leccions de fusta/marbre: pegasus,
//     columba, cubo): cada variant de preu ja porta l'acabat al seu nom. Aquí el
//     swatch MANA: en triar-lo, FILTRA la llista de variants a aquell acabat i
//     canvia la foto. Així no es duplica el color ni queda desconnectat.
//
// Els acabats del cas B es deriven de les pròpies variants (variantFinish), que
// és la font de veritat del que es pot comprar; la foto s'hi enganxa per nom.

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { formatEur } from "@/lib/discount";
import type { MobleColor } from "@/lib/mobiliari-colors";
import { variantFinish, type MobleVariant } from "@/lib/mobiliari-detall";
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

type Option = { key: string; label: string; image: string | null };

// Tokens significatius d'un nom d'acabat, per casar acabat ↔ foto de forma
// tolerant ("Bordeaux Marm.Natural" ↔ "Bordeaux Marmol Natural").
function tokens(s: string): string[] {
  return s.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length >= 4);
}

function photoForFinish(colors: MobleColor[], finish: string): string | null {
  const ft = tokens(finish);
  for (const c of colors) {
    if (tokens(c.name).some((t) => ft.includes(t))) return c.image;
  }
  return null;
}

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

  // Acabats distints presents a les variants (en ordre d'aparició).
  const variantFinishes = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const v of variants) {
      const f = variantFinish(v);
      if (f && !seen.has(f)) {
        seen.add(f);
        out.push(f);
      }
    }
    return out;
  }, [variants]);

  // Cas B només si hi ha ≥2 acabats a les variants I almenys un té foto (així
  // no afegim swatches a col·leccions que només varien de mida sense fotos).
  const finishIsAxis = useMemo(
    () => variantFinishes.length >= 2 && variantFinishes.some((f) => photoForFinish(colors, f)),
    [variantFinishes, colors],
  );

  const options: Option[] = useMemo(() => {
    if (finishIsAxis) {
      return variantFinishes.map((f) => ({ key: f, label: f, image: photoForFinish(colors, f) }));
    }
    return colors.map((c) => ({ key: c.name, label: c.name, image: c.image }));
  }, [finishIsAxis, variantFinishes, colors]);

  const hasOptions = options.length > 0;
  const [sel, setSel] = useState(0);
  const selected = hasOptions ? options[Math.min(sel, options.length - 1)] : null;
  const mainImage = selected?.image ?? defaultImage;
  // Les fotos de color/acabat són retalls sobre blanc → "contain". Si l'opció
  // no té foto, es mostra la foto per defecte amb el seu fit original.
  const fit = selected?.image ? "contain" : imgFit;

  // Cas B: la llista es filtra a l'acabat escollit. Cas A: totes les variants.
  const shownVariants = useMemo(() => {
    if (finishIsAxis && selected) return variants.filter((v) => variantFinish(v) === selected.key);
    return variants;
  }, [finishIsAxis, selected, variants]);

  // A la cistella només afegim el color com a sufix en el cas A (al cas B el nom
  // de la variant ja porta l'acabat, no el volem duplicat).
  const cartColorName = finishIsAxis ? null : selected?.label ?? null;

  return (
    <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
      {/* Galeria — la foto principal canvia amb el color/acabat escollit. */}
      <div
        className={`relative aspect-[4/5] overflow-hidden bg-kave-surface ${fit === "cover" ? "" : "p-8 lg:p-12"}`}
      >
        <Image
          key={mainImage}
          src={mainImage}
          alt={selected ? `${nom} — ${selected.label}` : nom}
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

        {/* Selector de color/acabat */}
        {hasOptions && (
          <div className="mb-6">
            <p className="text-sm font-medium text-kave-ink mb-3">
              {tp("colorLabel")}:{" "}
              <span className="text-kave-muted font-normal">{selected?.label}</span>
            </p>
            <div className="flex flex-wrap gap-2.5">
              {options.map((o, i) => {
                const isSel = i === sel;
                const ring = isSel
                  ? "border-kave-ink ring-2 ring-kave-ink ring-offset-2 ring-offset-kave-bg"
                  : "border-kave-line hover:border-kave-ink/50";
                return o.image ? (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => setSel(i)}
                    aria-pressed={isSel}
                    aria-label={o.label}
                    title={o.label}
                    className={`relative h-14 w-14 overflow-hidden rounded-md border transition-all ${ring}`}
                  >
                    <Image src={o.image} alt={o.label} fill sizes="56px" className="object-cover" />
                  </button>
                ) : (
                  <button
                    key={o.key}
                    type="button"
                    onClick={() => setSel(i)}
                    aria-pressed={isSel}
                    title={o.label}
                    className={`h-14 px-3.5 rounded-md border text-xs text-kave-ink flex items-center justify-center text-center leading-tight transition-all ${ring}`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {shownVariants.length > 0 && termini ? (
          <MoblePurchasePanel
            key={finishIsAxis ? selected?.key ?? "base" : "static"}
            slug={slug}
            nom={nom}
            variants={shownVariants}
            termini={termini}
            image={mainImage}
            href={href}
            colorName={cartColorName}
            hideFinish={finishIsAxis}
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
