"use client";

import { useEffect, useRef } from "react";
import { V2_INSTAGRAM } from "@/lib/v2/config";

const REELS = [1, 2, 3, 4];

/**
 * Els quatre reels d'Instagram que el projecte JA té a /public/videos i que a
 * la web actual només surten a la pàgina "Nosaltres" — és a dir, allà on
 * gairebé ningú arriba. Són l'únic material en moviment de la casa i el que
 * millor demostra que hi ha un taller de veritat.
 *
 * Es reprodueixen només mentre es veuen: `preload="none"` i pausa en sortir de
 * pantalla, perquè quatre vídeos carregant alhora en una connexió mòbil
 * s'endurien la portada per davant.
 */
export default function V2Reels({ label }: { label: string }) {
  const ref = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const videos = Array.from(ref.current?.querySelectorAll("video") ?? []);
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        }
      },
      { threshold: 0.5 },
    );

    videos.forEach((v) => observer.observe(v));
    return () => observer.disconnect();
  }, []);

  return (
    <ul
      ref={ref}
      className="flex snap-x snap-mandatory gap-4 overflow-x-auto no-scrollbar md:grid md:grid-cols-4 md:overflow-visible"
      role="list"
      aria-label={label}
    >
      {REELS.map((n) => (
        <li key={n} className="w-[58vw] shrink-0 snap-start sm:w-[38vw] md:w-auto">
          <a
            href={V2_INSTAGRAM}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block aspect-[9/16] overflow-hidden bg-v2-ink"
            aria-label={`${label} — ${n}`}
          >
            <video
              className="h-full w-full object-cover"
              poster={`/videos/reel-${n}.jpg`}
              muted
              loop
              playsInline
              preload="none"
            >
              <source src={`/videos/reel-${n}.mp4`} type="video/mp4" />
            </video>
            <span
              className="absolute inset-0 bg-v2-ink/0 transition-colors duration-500 group-hover:bg-v2-ink/25"
              aria-hidden="true"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
