"use client";

// Galeria genèrica de producte reutilitzable per a catifes, mobiliari i decoració.
// Rep una llista tipada de slides (escena/producto/detall/color) i gestiona
// l'índex actiu internament. Crida onColorChange quan el slide actiu té colorSlug
// (ús exclusiu de mobiliari per sincronitzar el selector de color amb el carrito).
//
// Accessibilitat:
//   - Thumbnails = <button aria-pressed> reals.
//   - Nom del slide actiu anunciat per aria-live="polite".
//   - key={active} a <Image> força re-render en canviar de slide.

import { useState } from "react";
import Image from "next/image";
import { type GallerySlide } from "@/lib/catifes";

export type { GallerySlide };

export type ProductGalleryProps = {
  /** Llista ordenada de slides (escena primer, producte/color després). */
  slides: GallerySlide[];
  /** Índex inicial. Default: 0. */
  initialIndex?: number;
  /**
   * Callback per sincronitzar el color actiu amb el add-to-cart (mobiliari).
   * S'invoca quan el slide actiu canvia i té colorSlug.
   */
  onColorChange?: (colorSlug: string) => void;
  /** Etiqueta i18n del grup de thumbnails (a11y, aria-label). */
  thumbsLabel: string;
};

export default function ProductGallery({
  slides,
  initialIndex = 0,
  onColorChange,
  thumbsLabel,
}: ProductGalleryProps) {
  const [active, setActive] = useState(initialIndex);

  const current = slides[active] ?? slides[0];
  const hasThumbs = slides.length > 1;

  // Decideix el fit de la imatge gran:
  // - escena → object-cover (foto ambiental, el recorte és intencionat)
  // - producto/detall/color → object-contain (foto de producte, mai retallem)
  const isEscena =
    current?.fit === "cover" ||
    (current?.fit === undefined && current?.kind === "escena");
  const imageFit = isEscena ? "object-cover" : "object-contain";
  const imageBg = isEscena ? "bg-linen" : "bg-canvas";

  function handleSelect(index: number) {
    setActive(index);
    const slide = slides[index];
    if (slide?.colorSlug && onColorChange) {
      onColorChange(slide.colorSlug);
    }
  }

  return (
    <div>
      {/* Imatge gran */}
      <div className={`relative aspect-[4/3] overflow-hidden ${imageBg}`}>
        {current && (
          <Image
            key={active}
            src={current.src}
            alt={current.alt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className={`${imageFit} transition-opacity duration-200`}
          />
        )}
        {/* Anunci a11y del slide actiu */}
        <p className="sr-only" aria-live="polite" aria-atomic="true">
          {current?.alt}
        </p>
      </div>

      {/* Thumbnails — només si hi ha més d'un slide */}
      {hasThumbs && (
        <nav aria-label={thumbsLabel} className="mt-4">
          <ul className="flex flex-wrap gap-3" role="list">
            {slides.map((slide, i) => {
              const isActive = i === active;
              const thumbFit =
                slide.fit === "cover" || slide.kind === "escena"
                  ? "object-cover"
                  : "object-contain";
              return (
                <li key={`${slide.src}-${i}`}>
                  <button
                    type="button"
                    onClick={() => handleSelect(i)}
                    aria-pressed={isActive}
                    title={slide.alt}
                    className={[
                      "relative block w-16 h-16 overflow-hidden bg-linen transition-shadow",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep",
                      isActive
                        ? "ring-2 ring-ink ring-offset-2 ring-offset-canvas"
                        : "ring-1 ring-sand-dark hover:ring-ink",
                    ].join(" ")}
                  >
                    <Image
                      src={slide.src}
                      alt={slide.alt}
                      fill
                      sizes="64px"
                      className={`${thumbFit}`}
                    />
                    <span className="sr-only">{slide.alt}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
