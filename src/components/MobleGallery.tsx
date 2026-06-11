"use client";

// Galeria de color d'un moble per a la ficha de producte (Server Component).
// Mostra la foto gran del color seleccionat i, si n'hi ha més d'un, swatches
// clicables (botons reals amb aria-pressed) per canviar de color. El botó
// "Afegir al cistell" empeny el color actiu com a línia pròpia del cistell.
//
// El bloc d'informació estàtica (eyebrow, títol, preu, fitxa tècnica, CTA) el
// renderitza el Server Component (page.tsx) i s'injecta com a `children` a la
// columna dreta, per mantenir SEO/labels al servidor. Només la part que depèn
// del color seleccionat (foto, swatches, afegir al cistell) viu al client.
//
// Accessibilitat: swatches = <button> reals amb aria-pressed; alt amb el nom
// del color; el nom del color seleccionat s'anuncia amb aria-live.

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { type Moble, mobleImage } from "@/lib/mobiliari";
import AddToCartButton from "@/components/cart/AddToCartButton";

type Props = {
  moble: Moble;
  /** Bloc superior d'informació estàtica (eyebrow, títol, preu, fitxa). */
  children: ReactNode;
  /** Bloc inferior estàtic (CTA "demana pressupost"), sota el botó de compra. */
  footer: ReactNode;
};

export default function MobleGallery({ moble, children, footer }: Props) {
  const t = useTranslations("Mobles");
  const [selected, setSelected] = useState(0);

  const colors = moble.colors;
  const active = colors[selected] ?? colors[0];
  const hasColorChoice = colors.length > 1;
  const colorNom = active.nom; // buit ("") als models d'un sol color sense nom

  // Foto gran del color actiu.
  const bigImage = mobleImage(moble.slug, active.slug);
  // alt amb el color quan en té: "Annecy" o "Grenoble · Blau".
  const bigAlt = colorNom ? `${moble.nom} · ${colorNom}` : moble.nom;

  // Línia del cistell del color seleccionat. Slug compost per color → cada
  // color és una línia distinta del cistell (mateix model, colors diferents).
  const cartSlug = colorNom ? `${moble.slug}#${active.slug}` : moble.slug;
  const cartNom = colorNom ? `${moble.nom} · ${colorNom}` : moble.nom;

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      {/* Columna foto gran + swatches (depèn del color → client) */}
      <div>
        <div className="relative aspect-square overflow-hidden bg-linen">
          <Image
            // key força el re-render de la imatge en canviar de color.
            key={active.slug}
            src={bigImage}
            alt={bigAlt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        {/* Selector de color: només si hi ha més d'un color */}
        {hasColorChoice && (
          <div className="mt-5">
            <div className="flex items-baseline justify-between mb-3">
              <p className="font-sans text-eyebrow text-accent-deep uppercase">
                {t("colorLabel")}
              </p>
              <p
                className="font-sans text-body-sm text-ink"
                role="status"
                aria-live="polite"
              >
                {colorNom}
              </p>
            </div>
            <ul
              className="flex flex-wrap gap-3"
              role="list"
              aria-label={t("colorLabel")}
            >
              {colors.map((c, i) => {
                const isActive = i === selected;
                return (
                  <li key={c.slug}>
                    <button
                      type="button"
                      onClick={() => setSelected(i)}
                      aria-pressed={isActive}
                      title={c.nom}
                      className={clsx(
                        "relative block w-16 h-16 overflow-hidden bg-linen transition-shadow",
                        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep",
                        isActive
                          ? "ring-2 ring-ink ring-offset-2 ring-offset-canvas"
                          : "ring-1 ring-sand-dark hover:ring-ink",
                      )}
                    >
                      <Image
                        src={mobleImage(moble.slug, c.slug)}
                        alt={`${moble.nom} · ${c.nom}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                      <span className="sr-only">{c.nom}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Columna informació: bloc estàtic del server + compra (color actiu) */}
      <div className="lg:sticky lg:top-28 self-start">
        {children}

        {/* Compra directa. Afegeix el COLOR seleccionat al cistell. */}
        <div className="mb-6">
          <AddToCartButton
            slug={cartSlug}
            href={`/mobiliari/${moble.slug}`}
            nom={cartNom}
            pvp={moble.pvpDesde}
            image={bigImage}
          />
        </div>

        {footer}
      </div>
    </div>
  );
}
