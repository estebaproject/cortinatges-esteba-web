"use client";

// Wrapper client per a la fitxa d'un moble. Successor de MobleGallery.
// Combina ProductGallery (galeria genèrica) amb la lògica color↔add-to-cart
// pròpia de mobiliari. El bloc d'informació estàtica (eyebrow, títol, preu,
// fitxa tècnica) s'injecta com a `children` i el bloc CTA com a `footer`,
// igual que MobleGallery (contracte extern idèntic).
//
// Layout: 2 columnes a lg (galeria | info+CTA), una sola a mòbil.
// La imatge gran té alçada màxima ~55-60vh perquè els swatches quedin visibles
// a 1366×768 sense scroll (requisit spec Batch 2).

import { useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { type Moble, mobleImage, mobleSlides } from "@/lib/mobiliari";
import ProductGallery from "@/components/shop/ProductGallery";
import AddToCartButton from "@/components/cart/AddToCartButton";

type Props = {
  moble: Moble;
  /** Bloc superior d'informació estàtica (eyebrow, títol, preu, fitxa). */
  children: ReactNode;
  /** Bloc inferior estàtic (CTA "demana pressupost"), sota el botó de compra. */
  footer: ReactNode;
};

export default function MobleFicha({ moble, children, footer }: Props) {
  const t = useTranslations("Gallery");
  const tMobles = useTranslations("Mobles");

  const slides = mobleSlides(moble);

  // Color actiu: per defecte el primer color del moble.
  // Quan l'usuari clica un thumbnail de color, ProductGallery crida onColorChange
  // amb el colorSlug del slide actiu.
  const firstColorSlug = moble.colors[0]?.slug ?? "principal";
  const [activeColorSlug, setActiveColorSlug] = useState(firstColorSlug);

  // Sincronitzem el color actiu quan canvia el slide.
  function handleColorChange(colorSlug: string) {
    setActiveColorSlug(colorSlug);
  }

  // Dades del add-to-cart basades en el color actiu.
  const activeColor = moble.colors.find((c) => c.slug === activeColorSlug) ?? moble.colors[0];
  const colorNom = activeColor?.nom ?? "";
  const cartSlug = colorNom ? `${moble.slug}#${activeColorSlug}` : moble.slug;
  const cartNom = colorNom ? `${moble.nom} · ${colorNom}` : moble.nom;
  const cartImage = mobleImage(moble.slug, activeColorSlug);

  // Etiqueta del color actiu per al selector (aria-live gestionat per ProductGallery).
  const hasColorChoice = moble.colors.length > 1;

  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      {/* Columna galeria (foto gran + thumbnails de color) */}
      {/* max-h-[58vh] a la imatge gran conté l'alçada per garantir que els
          swatches de color siguin visibles sense scroll a 1366x768 (req. spec). */}
      <div>
        {hasColorChoice && (
          <p
            className="font-sans text-body-sm text-ink-muted uppercase tracking-widest mb-2"
            aria-hidden="true"
          >
            {tMobles("colorLabel")}
            {colorNom && (
              <span className="ml-2 text-ink normal-case tracking-normal font-normal">
                {colorNom}
              </span>
            )}
          </p>
        )}
        <ProductGallery
          slides={slides}
          thumbsLabel={t("thumbsLabel")}
          onColorChange={handleColorChange}
          mainImageClassName="max-h-[58vh]"
        />
      </div>

      {/* Columna info + compra (estàtica del server + CTA color-dependent) */}
      <div className="lg:sticky lg:top-28 self-start">
        {children}

        {/* Compra directa. Afegeix el color seleccionat al cistell. */}
        <div className="mb-6">
          <AddToCartButton
            slug={cartSlug}
            href={`/mobiliari/${moble.slug}`}
            nom={cartNom}
            pvp={moble.pvpDesde}
            image={cartImage}
          />
        </div>

        {footer}
      </div>
    </div>
  );
}
