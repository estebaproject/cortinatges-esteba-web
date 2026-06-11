"use client";

// Indicador de cistell per al Header: icona + badge amb el count en viu.
// Enllaça a la pàgina del cistell (/cistell). Reacciona en directe als canvis
// del CartProvider. El prefix de locale segueix el patró del projecte.

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "./CartProvider";

export default function CartIndicator() {
  const t = useTranslations("Cart");
  const locale = useLocale();
  const { count, hydrated } = useCart();
  const prefix = locale === "ca" ? "" : `/${locale}`;

  // Abans d'hidratar mostrem 0 perquè SSR i client coincideixin.
  const visibleCount = hydrated ? count : 0;

  return (
    <Link
      href={`${prefix}/cistell`}
      aria-label={
        visibleCount > 0
          ? t("indicatorWithCount", { count: visibleCount })
          : t("indicatorEmpty")
      }
      className="relative inline-flex items-center justify-center w-11 h-11 text-ink hover:text-accent-deep transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>
      {visibleCount > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 min-w-5 h-5 px-1 inline-flex items-center justify-center rounded-full bg-accent-deep text-canvas font-sans text-[11px] font-semibold leading-none"
        >
          {visibleCount > 99 ? "99+" : visibleCount}
        </span>
      )}
    </Link>
  );
}
