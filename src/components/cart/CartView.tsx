"use client";

// Vista del cistell (client): llista de línies amb foto, nom, preu, selector
// de quantitat (+/-), eliminar, subtotal i botó "Tramitar la comanda".
// Estat buit amb enllaç a /catifes. Tot el càlcul ve del CartProvider.

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "./CartProvider";

export default function CartView() {
  const t = useTranslations("Cart");
  const locale = useLocale();
  const { lines, subtotal, count, hydrated, setQty, removeLine, clear } =
    useCart();
  const prefix = locale === "ca" ? "" : `/${locale}`;

  const fmtPrice = (n: number) =>
    `${n.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} €`;

  // Mentre no s'ha hidratat des de localStorage, mostrem un estat neutre
  // per evitar un parpelleig "buit → ple".
  if (!hydrated) {
    return (
      <p className="font-sans text-body-md text-ink-muted" role="status" aria-live="polite">
        {t("loading")}
      </p>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="border border-linen bg-canvas-warm p-10 md:p-16 text-center">
        <p className="font-serif text-display-md text-ink mb-3">
          {t("emptyTitle")}
        </p>
        <p className="font-sans text-body-md text-ink-muted mb-8 max-w-prose-editorial mx-auto">
          {t("emptyBody")}
        </p>
        <Link
          href={`${prefix}/catifes`}
          className="inline-flex items-center justify-center px-6 py-4 bg-ink text-canvas font-sans text-body-md font-semibold hover:bg-accent-deep transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {t("emptyCta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1fr_22rem] gap-10 lg:gap-16 items-start">
      {/* Llista de línies */}
      <ul className="border-t border-linen divide-y divide-linen" role="list">
        {lines.map((line) => {
          const lineTotal = line.pvp * line.qty;
          return (
            <li
              key={line.slug}
              className="flex gap-4 sm:gap-6 py-6 items-start"
            >
              <Link
                href={`${prefix}/catifes/${line.slug}`}
                className="relative w-20 h-20 sm:w-28 sm:h-28 shrink-0 overflow-hidden bg-linen"
                aria-label={line.nom}
              >
                <Image
                  src={line.image}
                  alt={line.nom}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  href={`${prefix}/catifes/${line.slug}`}
                  className="font-serif text-body-lg text-ink hover:text-accent-deep transition-colors"
                >
                  {line.nom}
                </Link>
                <p className="font-sans text-body-sm text-ink-muted mt-1">
                  {fmtPrice(line.pvp)}
                </p>

                {/* Selector de quantitat */}
                <div className="flex items-center gap-4 mt-4">
                  <div
                    className="inline-flex items-center border border-linen"
                    role="group"
                    aria-label={t("qtyAria", { nom: line.nom })}
                  >
                    <button
                      type="button"
                      onClick={() => setQty(line.slug, line.qty - 1)}
                      aria-label={t("decrease", { nom: line.nom })}
                      className="w-9 h-9 inline-flex items-center justify-center text-ink hover:bg-linen transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                      </svg>
                    </button>
                    <span
                      className="w-10 text-center font-sans text-body-md text-ink tabular-nums"
                      aria-live="polite"
                    >
                      {line.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(line.slug, line.qty + 1)}
                      aria-label={t("increase", { nom: line.nom })}
                      className="w-9 h-9 inline-flex items-center justify-center text-ink hover:bg-linen transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeLine(line.slug)}
                    aria-label={t("removeAria", { nom: line.nom })}
                    className="font-sans text-body-sm text-ink-muted hover:text-accent-deep underline transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                  >
                    {t("remove")}
                  </button>
                </div>
              </div>

              {/* Total de la línia */}
              <p className="font-sans text-body-md text-ink font-semibold tabular-nums shrink-0">
                {fmtPrice(lineTotal)}
              </p>
            </li>
          );
        })}
      </ul>

      {/* Resum */}
      <aside className="lg:sticky lg:top-28 border border-linen bg-canvas-warm p-6 sm:p-8">
        <h2 className="font-serif text-display-md text-ink mb-6">
          {t("summary")}
        </h2>
        <div className="flex justify-between items-baseline border-t border-linen pt-5 mb-2">
          <span className="font-sans text-body-md text-ink-muted">
            {t("subtotal")}
          </span>
          <span className="font-serif text-display-md text-ink tabular-nums">
            {fmtPrice(subtotal)}
          </span>
        </div>
        <p className="font-sans text-body-sm text-ink-faint mb-6">
          {t("taxNote")}
        </p>

        <Link
          href={`${prefix}/checkout`}
          className="flex items-center justify-center w-full px-6 py-4 bg-ink text-canvas font-sans text-body-md font-semibold hover:bg-accent-deep transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {t("checkout")}
        </Link>

        <div className="flex items-center justify-between mt-5">
          <Link
            href={`${prefix}/catifes`}
            className="font-sans text-body-sm text-accent-deep hover:text-ink transition-colors"
          >
            {t("continueShopping")}
          </Link>
          <button
            type="button"
            onClick={clear}
            aria-label={t("clearAria", { count })}
            className="font-sans text-body-sm text-ink-muted hover:text-accent-deep underline transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {t("clear")}
          </button>
        </div>
      </aside>
    </div>
  );
}
