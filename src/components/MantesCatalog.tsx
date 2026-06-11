"use client";

// Catàleg de mantes (decoració) — categoria petita (4 productes), per això
// NO duu el sidebar de filtres pesat de catifes/mobiliari: només graella +
// selector d'ordenació. Rep la llista completa per props des del Server
// Component (page.tsx). Mateix disseny de cards que CatifesCatalog/MoblesCatalog
// (foto + nom + mida + "des de X €").

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { type Manta, mantaImage } from "@/lib/decoracio";

type SortId = "name_asc" | "price_asc" | "price_desc";

type Props = {
  /** Llista completa de mantes (dades públiques) servida des del server. */
  mantes: Manta[];
  /** Prefix de locale per als enllaços ("" per ca, "/es" etc.). */
  prefix: string;
  /** Locale actiu, per formatar el preu i ordenar per nom. */
  locale: string;
};

export default function MantesCatalog({ mantes, prefix, locale }: Props) {
  const t = useTranslations("Decoracio");
  const tf = useTranslations("Filters");

  const [sort, setSort] = useState<SortId>("name_asc");

  const priceFmt = (pvp: number) =>
    `${t("fromPrice")} ${pvp.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} €`;

  const sorted = useMemo(() => {
    return [...mantes].sort((a, b) => {
      if (sort === "name_asc") return a.nom.localeCompare(b.nom, locale);
      return sort === "price_asc"
        ? a.pvpDesde - b.pvpDesde
        : b.pvpDesde - a.pvpDesde;
    });
  }, [mantes, sort, locale]);

  return (
    <div>
      {/* Barra superior: comptador + ordenar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <p
          className="font-sans text-body-sm text-ink-muted"
          role="status"
          aria-live="polite"
        >
          {t("results", { count: sorted.length })}
        </p>

        <div className="flex items-center gap-2 ml-auto">
          <label
            htmlFor="mantes-sort"
            className="font-sans text-body-sm text-ink-muted"
          >
            {tf("sort")}
          </label>
          <select
            id="mantes-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortId)}
            className="px-3 py-2 bg-canvas border border-sand-dark font-sans text-body-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent-deep"
          >
            <option value="name_asc">{tf("sortNameAsc")}</option>
            <option value="price_asc">{tf("sortPriceAsc")}</option>
            <option value="price_desc">{tf("sortPriceDesc")}</option>
          </select>
        </div>
      </div>

      {/* Graella de mantes (mateix disseny de cards) */}
      <ul
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        role="list"
      >
        {sorted.map((m, i) => (
          <li key={m.slug}>
            <Link
              href={`${prefix}/decoracio/${m.slug}`}
              className="group block"
              aria-label={m.nom}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-linen mb-3 p-2">
                <Image
                  src={mantaImage(m.slug)}
                  alt={m.nom}
                  fill
                  priority={i < 4}
                  sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 bg-canvas/90 text-ink font-sans text-[10px] tracking-widest uppercase px-2 py-1">
                  {m.mida}
                </span>
              </div>
              <p className="font-serif text-body-lg text-ink group-hover:text-accent-deep transition-colors">
                {m.nom}
              </p>
              <p className="font-sans text-body-sm text-ink-muted">
                {priceFmt(m.pvpDesde)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
