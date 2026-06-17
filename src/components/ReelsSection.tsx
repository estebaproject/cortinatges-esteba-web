"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import Slider from "@/components/Slider";

const INSTAGRAM_URL = "https://www.instagram.com/cortinatgesesteba/";
const HANDLE = "@cortinatgesesteba";
const REELS = [1, 2, 3, 4];

export default function ReelsSection() {
  const t = useTranslations("HomeGrid");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const videos = Array.from(
      containerRef.current?.querySelectorAll("video") ?? [],
    ) as HTMLVideoElement[];

    // Reprodueix només els reels visibles; pausa la resta (rendiment + bateria).
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        }
      },
      { threshold: 0.5 },
    );

    videos.forEach((v) => observer.observe(v));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-section bg-canvas-warm" aria-label={t("instagramHeading")}>
      <div className="max-w-layout mx-auto px-6 lg:px-12">
        <div className="text-center mb-10">
          <h2 className="font-serif text-display-md text-ink mb-2">
            {t("instagramHeading")}
          </h2>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-body-md text-ink-muted hover:text-ink transition-colors"
          >
            {HANDLE}
          </a>
        </div>

        <div ref={containerRef}>
          <Slider
            ariaLabel={t("instagramHeading")}
            slideClassName="w-44 sm:w-52"
            items={REELS.map((n) => (
              <a
                key={n}
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-[9/16] overflow-hidden bg-ink"
                aria-label={`Reel ${n} — Instagram`}
              >
                <video
                  className="w-full h-full object-cover"
                  poster={`/videos/reel-${n}.jpg`}
                  muted
                  loop
                  playsInline
                  preload="none"
                >
                  <source src={`/videos/reel-${n}.mp4`} type="video/mp4" />
                </video>
                <span className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors duration-500" />
              </a>
            ))}
          />
        </div>

        <div className="text-center mt-10">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-ink text-canvas font-sans text-xs font-medium tracking-widest uppercase hover:bg-ink-deep transition-colors"
          >
            {t("instagramCta")}
          </a>
        </div>
      </div>
    </section>
  );
}
