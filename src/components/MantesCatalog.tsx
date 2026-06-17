"use client";

// Catàleg de mantes filtrable i organitzable (client-side). Rep la llista
// completa de mantes per props des del Server Component (page.tsx) i gestiona
// cerca i ordenació sense recarregar.
// Disseny minimalista idèntic al de mobiliari/catifes: cards uniformes amb hero
// (1.jpg) + object-cover en aspect-[4/5], nom en sans, "des de X €". Amb només
// 8 mantes no cal filtre per categoria; cerca + ordre per nom/preu basten.
// Mai cost intern; mai botó de compra (només catàleg + ficha).

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { mantaImage, type Manta } from "@/lib/mantes";

type SortId = "name_asc" | "price_asc" | "price_desc";

type Props = {
  /** Llista completa de mantes (dades públiques) servida des del server. */
  mantes: Manta[];
  /** Prefix de locale per als enllaços ("" per ca, "/es" etc.). */
  prefix: string;
  /** Locale actiu, per formatar el preu. */
  locale: string;
};

export default function MantesCatalog({ mantes, prefix, locale }: Props) {
  const t = useTranslations("Mantes");
  const tf = useTranslations("Filters");

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortId>("name_asc");

  const priceFmt = (pvp: number) =>
    `${t("fromPrice")} ${pvp.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} €`;

  // --- Llista filtrada i ordenada ----------------------------------------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const result = mantes.filter((m) => {
      if (q && !m.nom.toLowerCase().includes(q)) return false;
      return true;
    });

    const sorted = [...result].sort((a, b) => {
      if (sort === "name_asc") return a.nom.localeCompare(b.nom, locale);
      return sort === "price_asc" ? a.pvp - b.pvp : b.pvp - a.pvp;
    });

    return sorted;
  }, [mantes, query, sort, locale]);

  const hasActiveFilters = query.trim() !== "";

  const clearAll = () => setQuery("");

  return (
    <div>
      {/* Barra superior: cerca + comptador + ordenar */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        {/* Cerca */}
        <div className="w-full sm:w-auto sm:min-w-64">
          <label htmlFor="mantes-search" className="sr-only">
            {tf("search")}
          </label>
          <input
            id="mantes-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tf("searchPlaceholder")}
            className="w-full px-3 py-2.5 bg-canvas border-b border-sand-dark/40 font-sans text-body-sm text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:border-ink transition-colors"
          />
        </div>

        {/* Comptador de resultats */}
        <p
          className="font-sans text-body-sm text-ink-muted"
          role="status"
          aria-live="polite"
        >
          {t("results", { count: filtered.length })}
        </p>

        {/* Ordenar */}
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
            className="px-3 py-2 bg-canvas border-b border-sand-dark/40 font-sans text-body-sm text-ink focus-visible:outline-none focus-visible:border-ink transition-colors"
          >
            <option value="name_asc">{tf("sortNameAsc")}</option>
            <option value="price_asc">{tf("sortPriceAsc")}</option>
            <option value="price_desc">{tf("sortPriceDesc")}</option>
          </select>
        </div>
      </div>

      {/* Chip de cerca activa */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => setQuery("")}
            className="inline-flex items-center gap-1.5 border border-sand-dark/40 text-ink font-sans text-body-sm px-3 py-1.5 hover:border-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
          >
            <span>{`${tf("search")}: ${query.trim()}`}</span>
            <span aria-hidden="true" className="text-ink-muted">
              ×
            </span>
            <span className="sr-only">{tf("removeFilter")}</span>
          </button>
        </div>
      )}

      {/* Graella de mantes — cards uniformes (hero + object-cover) */}
      {filtered.length > 0 ? (
        <ul
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10"
          role="list"
        >
          {filtered.map((m, i) => (
            <li key={m.slug}>
              <Link
                href={`${prefix}/mantes/${m.slug}`}
                className="group block"
                aria-label={m.nom}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-canvas-warm mb-3">
                  <Image
                    src={mantaImage(m.slug)}
                    alt={m.nom}
                    fill
                    priority={i < 4}
                    sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <p className="font-sans text-body-md font-medium text-ink group-hover:text-accent-deep transition-colors">
                  {m.nom}
                </p>
                <p className="font-sans text-body-sm text-ink-muted mt-1">
                  {priceFmt(m.pvp)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-20 text-center">
          <p className="font-serif text-display-md text-ink mb-3">
            {t("emptyTitle")}
          </p>
          <p className="font-sans text-body-md text-ink-muted mb-6">
            {tf("emptyBody")}
          </p>
          <button
            type="button"
            onClick={clearAll}
            className="font-sans text-body-sm text-accent-deep underline underline-offset-4 hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
          >
            {tf("clear")}
          </button>
        </div>
      )}
    </div>
  );
}
