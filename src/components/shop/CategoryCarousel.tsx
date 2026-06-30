"use client";

// Carrusel horitzontal de categories — clon de la fila de categories de Kave.
// Genèric: rep ítems {key, label, image, active} i notifica la selecció.
// A mobiliari, seleccionar una categoria activa/desactiva el filtre corresponent.

import Image from "next/image";
import clsx from "clsx";

export type CategoryItem = {
  key: string;
  label: string;
  image: string;
  active?: boolean;
};

export default function CategoryCarousel({
  items,
  onSelect,
}: {
  items: CategoryItem[];
  onSelect: (key: string) => void;
}) {
  if (items.length === 0) return null;
  return (
    <div className="-mx-5 lg:mx-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <ul className="flex gap-4 px-5 lg:px-0 min-w-max" role="list">
        {items.map((it) => (
          <li key={it.key}>
            <button
              type="button"
              onClick={() => onSelect(it.key)}
              aria-pressed={it.active}
              className="group block w-28 sm:w-32 text-left focus-visible:outline-none"
            >
              <div
                className={clsx(
                  "relative aspect-square w-28 sm:w-32 overflow-hidden bg-kave-surface transition-shadow",
                  it.active ? "ring-1 ring-kave-ink ring-offset-2 ring-offset-kave-bg" : "group-hover:ring-1 group-hover:ring-kave-line",
                )}
              >
                <Image
                  src={it.image}
                  alt={it.label}
                  fill
                  sizes="128px"
                  className="object-contain p-3 transition-transform duration-500 group-hover:scale-[1.05]"
                />
              </div>
              <span
                className={clsx(
                  "mt-2 block text-sm font-grotesque underline-offset-4 transition-colors",
                  it.active
                    ? "text-kave-ink font-medium underline decoration-2 decoration-kave-tag"
                    : "text-kave-ink group-hover:underline group-hover:decoration-kave-tag",
                )}
              >
                {it.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
