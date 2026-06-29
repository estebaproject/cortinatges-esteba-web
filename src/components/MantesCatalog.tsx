"use client";

// Catàleg de mantes filtrable — clon de Kave Home (tema beige/negre).
// Mantes és més simple que mobiliari/catifes: NO té filtre per categoria. Manté
// la mateixa estructura visual de Kave:
//   1) barra "Filtres · N mantes · densitat de graella · ordenar",
//   2) graella de cards (KaveProductCard) amb rebaixes reals,
//   3) calaix de filtres (cerca + rebaixes) que s'obre sota demanda.
// Hidrata q / sale des de la URL perquè el cercador i el link "Rebaixes"
// funcionin. Mai mostra cost intern.

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { mantaImage, type Manta } from "@/lib/mantes";
import { isOnSale } from "@/lib/discount";
import KaveProductCard from "@/components/shop/KaveProductCard";

type SortId = "name_asc" | "price_asc" | "price_desc";
type Density = "compact" | "comfortable" | "large";

const DENSITY_GRID: Record<Density, string> = {
  compact: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  comfortable: "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4",
  large: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
};

type Props = {
  /** Llista completa de mantes (dades públiques) servida des del server. */
  mantes: Manta[];
  /** Prefix de locale per als enllaços ("" per ca, "/es" etc.). */
  prefix: string;
  /** Locale actiu, per ordenar/formatar. */
  locale: string;
};

export default function MantesCatalog({ mantes, prefix, locale }: Props) {
  const t = useTranslations("Mantes");
  const tf = useTranslations("Filters");
  const ts = useTranslations("Shop");
  const searchParams = useSearchParams();

  // --- Hidratació des de la URL (lectura única) --------------------------
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [saleOnly, setSaleOnly] = useState(() => searchParams.get("sale") === "1");
  const [sort, setSort] = useState<SortId>("name_asc");
  const [density, setDensity] = useState<Density>("comfortable");
  const [drawerOpen, setDrawerOpen] = useState(false);

  // --- Llista filtrada i ordenada ----------------------------------------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = mantes.filter((m) => {
      if (q && !m.nom.toLowerCase().includes(q)) return false;
      if (saleOnly && !isOnSale(m.pvp, m.pvpAbans)) return false;
      return true;
    });
    return [...result].sort((a, b) => {
      if (sort === "name_asc") return a.nom.localeCompare(b.nom, locale);
      return sort === "price_asc" ? a.pvp - b.pvp : b.pvp - a.pvp;
    });
  }, [mantes, query, saleOnly, sort, locale]);

  const hasActiveFilters = query.trim() !== "" || saleOnly;
  const activeFilterCount = (query.trim() ? 1 : 0) + (saleOnly ? 1 : 0);

  const clearAll = () => {
    setQuery("");
    setSaleOnly(false);
  };

  // --- Subcomponents ------------------------------------------------------
  const FilterCheck = ({
    checked,
    onChange,
    label,
    name,
  }: {
    checked: boolean;
    onChange: () => void;
    label: string;
    name: string;
  }) => (
    <label className="flex items-center gap-2.5 cursor-pointer group py-1.5">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 rounded-none border border-kave-ink/40 accent-kave-ink"
      />
      <span className="font-grotesque text-sm text-kave-muted group-hover:text-kave-ink transition-colors">
        {label}
      </span>
    </label>
  );

  const FiltersBody = (
    <div className="space-y-7 font-grotesque">
      <div>
        <label htmlFor="mantes-search" className="block text-sm font-medium text-kave-ink mb-2">
          {tf("search")}
        </label>
        <input
          id="mantes-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tf("searchPlaceholder")}
          className="w-full px-0 py-2 bg-transparent border-b border-kave-ink/30 text-sm text-kave-ink placeholder:text-kave-ink/40 focus:outline-none focus:border-kave-ink transition-colors"
        />
      </div>

      <fieldset className="border-t border-kave-line pt-5">
        <FilterCheck
          name="sale"
          checked={saleOnly}
          onChange={() => setSaleOnly((v) => !v)}
          label={ts("saleTag")}
        />
      </fieldset>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="text-sm text-kave-ink underline underline-offset-4 hover:text-kave-tag transition-colors"
        >
          {tf("clear")}
        </button>
      )}
    </div>
  );

  const Chip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 border border-kave-line text-kave-ink font-grotesque text-sm px-3 py-1.5 hover:border-kave-ink transition-colors"
    >
      <span>{label}</span>
      <span aria-hidden className="text-kave-muted">×</span>
      <span className="sr-only">{tf("removeFilter")}</span>
    </button>
  );

  // Icones de densitat (3 nivells, com Kave).
  const densityButtons: { id: Density; cols: number }[] = [
    { id: "large", cols: 2 },
    { id: "comfortable", cols: 3 },
    { id: "compact", cols: 4 },
  ];

  return (
    <div className="font-grotesque text-kave-ink">
      {/* 1) Barra de filtres / comptador / densitat / ordre */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-kave-line py-3">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-kave-ink hover:text-kave-tag transition-colors"
          aria-haspopup="dialog"
          aria-expanded={drawerOpen}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M6 12h12m-9 5.25h6" />
          </svg>
          <span className="uppercase">{ts("filtersTrigger")}</span>
          {activeFilterCount > 0 && (
            <span className="ml-0.5 inline-flex items-center justify-center min-w-5 h-5 px-1.5 bg-kave-ink text-white text-xs rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-4 ml-auto">
          <p className="text-sm text-kave-muted" role="status" aria-live="polite">
            {t("results", { count: filtered.length })}
          </p>

          {/* Densitat de graella (desktop) */}
          <div className="hidden lg:flex items-center gap-1" role="group" aria-label={ts("gridLabel")}>
            {densityButtons.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setDensity(d.id)}
                aria-pressed={density === d.id}
                aria-label={
                  d.id === "compact" ? ts("gridCompact") : d.id === "large" ? ts("gridLarge") : ts("gridComfortable")
                }
                className={clsx(
                  "p-1.5 transition-colors",
                  density === d.id ? "text-kave-ink" : "text-kave-faint hover:text-kave-muted",
                )}
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
                  {Array.from({ length: d.cols }).map((_, i) => (
                    <rect key={i} x={(i * 16) / d.cols + 0.6} y={1} width={16 / d.cols - 1.2} height={14} rx={0.5} />
                  ))}
                </svg>
              </button>
            ))}
          </div>

          {/* Ordenar */}
          <div className="flex items-center gap-2">
            <label htmlFor="mantes-sort" className="sr-only">{tf("sort")}</label>
            <select
              id="mantes-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortId)}
              className="bg-transparent border-b border-kave-ink/30 py-1 text-sm text-kave-ink focus:outline-none focus:border-kave-ink transition-colors"
            >
              <option value="name_asc">{tf("sortNameAsc")}</option>
              <option value="price_asc">{tf("sortPriceAsc")}</option>
              <option value="price_desc">{tf("sortPriceDesc")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Chips actius */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-5">
          {saleOnly && <Chip label={ts("saleTag")} onRemove={() => setSaleOnly(false)} />}
          {query.trim() && (
            <Chip label={`${tf("search")}: ${query.trim()}`} onRemove={() => setQuery("")} />
          )}
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-kave-ink underline underline-offset-4 hover:text-kave-tag transition-colors ml-1"
          >
            {tf("clear")}
          </button>
        </div>
      )}

      {/* 2) Graella */}
      {filtered.length > 0 ? (
        <ul className={clsx("grid gap-x-5 gap-y-10 mt-8", DENSITY_GRID[density])} role="list">
          {filtered.map((m, i) => (
            <li key={m.slug}>
              <KaveProductCard
                href={`${prefix}/mantes/${m.slug}`}
                image={mantaImage(m.slug)}
                title={m.nom}
                subtitle={t("eyebrow")}
                pvp={m.pvp}
                pvpAbans={m.pvpAbans}
                pricePrefix={t("fromPrice")}
                fit="cover"
                priority={i < 4}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-24 text-center">
          <p className="font-display text-2xl text-kave-ink mb-3">{t("emptyTitle")}</p>
          <p className="text-sm text-kave-muted mb-6">{tf("emptyBody")}</p>
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-kave-ink underline underline-offset-4 hover:text-kave-tag transition-colors"
          >
            {tf("clear")}
          </button>
        </div>
      )}

      {/* 3) Calaix de filtres */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label={tf("title")}>
          <button
            type="button"
            aria-label={tf("close")}
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-kave-ink/40"
          />
          <div className="absolute inset-y-0 left-0 w-[88%] max-w-sm bg-kave-bg overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-kave-line">
              <h2 className="font-display text-xl text-kave-ink">{tf("title")}</h2>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                aria-label={tf("close")}
                className="p-2 -mr-2 text-kave-muted hover:text-kave-ink"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {FiltersBody}

            <div className="mt-8 pt-6 border-t border-kave-line">
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="w-full px-6 py-3.5 bg-kave-ink text-white font-grotesque text-sm font-semibold tracking-wide hover:bg-kave-ink/90 transition-colors"
              >
                {tf("close")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
