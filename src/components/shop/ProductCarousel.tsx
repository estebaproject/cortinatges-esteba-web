"use client";

// Carrusel horitzontal de productes relacionats — clon de "Combínalo con" /
// "Te puede interesar" de Kave. Reutilitza KaveProductCard amb amplada fixa i
// scroll horitzontal. Genèric per a mobiliari, catifes i mantes.

import KaveProductCard, { type KaveProductCardProps } from "@/components/shop/KaveProductCard";

export type CarouselItem = Omit<KaveProductCardProps, "sizes" | "priority">;

export default function ProductCarousel({
  title,
  items,
}: {
  title: string;
  items: CarouselItem[];
}) {
  if (items.length === 0) return null;
  return (
    <section className="font-grotesque">
      <h2 className="font-display text-2xl md:text-3xl text-kave-ink mb-6">{title}</h2>
      <div className="-mx-5 lg:mx-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <ul className="flex gap-5 px-5 lg:px-0 min-w-max" role="list">
          {items.map((it) => (
            <li key={it.href} className="w-52 sm:w-60 shrink-0">
              <KaveProductCard {...it} sizes="240px" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
