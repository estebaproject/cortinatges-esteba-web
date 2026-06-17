"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SliderProps = {
  /** Cada slide ja ve renderitzat; el Slider només l'embolcalla com a <li>. */
  items: React.ReactNode[];
  /** Amplada de cada slide (classes Tailwind). Controla quants se'n veuen alhora. */
  slideClassName?: string;
  ariaLabel?: string;
  className?: string;
};

/**
 * Carrusel horitzontal accessible: scroll-snap natiu (swipe a mòbil) + fletxes
 * a desktop. No mostra tots els elements de cop — en mostra una tira i la resta
 * es descobreix lliscant. Les fletxes s'amaguen quan no hi ha més recorregut.
 */
export default function Slider({
  items,
  slideClassName = "",
  ariaLabel,
  className = "",
}: SliderProps) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanPrev(scrollLeft > 4);
    setCanNext(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows, items.length]);

  const scroll = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: "smooth" });
  };

  const Arrow = ({ dir, show }: { dir: 1 | -1; show: boolean }) => (
    <button
      type="button"
      onClick={() => scroll(dir)}
      aria-label={dir === -1 ? "Anterior" : "Següent"}
      className={`absolute top-1/2 -translate-y-1/2 z-10 hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-canvas/90 text-ink shadow-md ring-1 ring-ink/10 hover:bg-canvas transition-opacity ${
        dir === -1 ? "left-2" : "right-2"
      } ${show ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d={dir === -1 ? "M15.75 19.5L8.25 12l7.5-7.5" : "M8.25 4.5l7.5 7.5-7.5 7.5"} />
      </svg>
    </button>
  );

  return (
    <div className={`relative ${className}`}>
      <Arrow dir={-1} show={canPrev} />
      <ul
        ref={trackRef}
        role="list"
        aria-label={ariaLabel}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, i) => (
          <li key={i} className={`snap-start shrink-0 ${slideClassName}`}>
            {item}
          </li>
        ))}
      </ul>
      <Arrow dir={1} show={canNext} />
    </div>
  );
}
