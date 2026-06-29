"use client";

// Bloc "Sobre el producte" — clon de Kave: banda de color (verd sàlvia) amb una
// llista de fets a l'esquerra i un acordeó a la dreta. En clicar una fila s'obre
// un panell lateral (slide-over) amb el detall (parelles etiqueta/valor).

import { useState } from "react";
import { useTranslations } from "next-intl";

export type AboutSection = {
  id: string;
  title: string;
  rows: { label: string; value: string }[];
};

export default function KaveAboutProduct({
  intro,
  sections,
}: {
  /** Punts clau del producte (bullets). */
  intro: string[];
  /** Seccions desplegables; cada una obre un slide-over amb les seves files. */
  sections: AboutSection[];
}) {
  const ts = useTranslations("Shop");
  const [openId, setOpenId] = useState<string | null>(null);
  const open = sections.find((s) => s.id === openId) ?? null;

  return (
    <section className="bg-kave-sage font-grotesque text-kave-ink">
      <div className="max-w-layout mx-auto px-5 lg:px-10 py-14 lg:py-20 grid lg:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <h2 className="font-display text-3xl md:text-4xl mb-6 leading-tight">
            {ts("aboutProduct")}
          </h2>
          {intro.length > 0 && (
            <ul className="space-y-2.5 text-[0.95rem] text-kave-ink/90 list-disc pl-5">
              {intro.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>
          )}
        </div>

        {sections.length > 0 && (
          <div className="border-t border-kave-ink/15">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setOpenId(s.id)}
                className="w-full flex items-center justify-between gap-4 py-4 text-left border-b border-kave-ink/15 group"
                aria-haspopup="dialog"
              >
                <span className="text-[0.95rem] font-medium">{s.title}</span>
                <svg className="w-4 h-4 text-kave-ink/60 group-hover:text-kave-ink transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Slide-over */}
      {open && (
        <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label={open.title}>
          <button
            type="button"
            aria-label={ts("accDelivery")}
            onClick={() => setOpenId(null)}
            className="absolute inset-0 bg-kave-ink/40"
          />
          <div className="absolute inset-y-0 right-0 w-[92%] max-w-md bg-kave-bg overflow-y-auto p-6 lg:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-display text-2xl text-kave-ink">{open.title}</h3>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                aria-label="✕"
                className="p-2 -mr-2 text-kave-muted hover:text-kave-ink"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <dl className="divide-y divide-kave-line border-t border-kave-line">
              {open.rows.map((r, i) => (
                <div key={i} className="grid grid-cols-2 gap-4 py-4">
                  <dt className="text-sm font-medium text-kave-ink">{r.label}</dt>
                  <dd className="text-sm text-kave-muted">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </section>
  );
}
