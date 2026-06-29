"use client";

// Catàleg de mobiliari filtrable — clon de Kave Home (tema beige/negre).
// Estructura idèntica a la pàgina de llistat de Kave:
//   1) fila horitzontal de categories (CategoryCarousel) que actua de filtre,
//   2) barra "Filtres · N productes · densitat de graella · ordenar",
//   3) graella de cards (KaveProductCard) amb rebaixes reals,
//   4) calaix de filtres (cerca + categoria + preu) que s'obre sota demanda.
// Hidrata cat / q / sale des de la URL perquè el cercador del header i el link
// "Rebaixes" funcionin. Mai mostra cost intern.

import { useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import {
  MOBLE_CATS,
  mobleImage,
  mobleImageForCat,
  mobleImgFit,
  countMobleByCat,
  type Moble,
  type MobleCat,
} from "@/lib/mobiliari";
import { isOnSale } from "@/lib/discount";
import KaveProductCard from "@/components/shop/KaveProductCard";
import CategoryCarousel from "@/components/shop/CategoryCarousel";

// --- Trams de preu (sobre pvp, IVA inclòs) -------------------------------
type PriceBucketId = "lt150" | "150_350" | "350_600" | "600_1000" | "gt1000";
type PriceBucket = { id: PriceBucketId; min: number; max: number | null };

const PRICE_BUCKETS: PriceBucket[] = [
  { id: "lt150", min: 0, max: 150 },
  { id: "150_350", min: 150, max: 350 },
  { id: "350_600", min: 350, max: 600 },
  { id: "600_1000", min: 600, max: 1000 },
  { id: "gt1000", min: 1000, max: null },
];

type SortId = "name_asc" | "price_asc" | "price_desc";
type Density = "compact" | "comfortable" | "large";

const DENSITY_GRID: Record<Density, string> = {
  compact: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  comfortable: "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4",
  large: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
};

type Props = {
  mobles: Moble[];
  prefix: string;
  locale: string;
};

export default function MobiliariCatalog({ mobles, prefix, locale }: Props) {
  const t = useTranslations("Mobiliari");
  const tf = useTranslations("Filters");
  const ts = useTranslations("Shop");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // --- Hidratació des de la URL ------------------------------------------
  const initialCats = useMemo((): MobleCat[] => {
    const raw = searchParams.get("cat");
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter((s): s is MobleCat => (MOBLE_CATS as readonly string[]).includes(s));
  }, [searchParams]);

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [selectedCats, setSelectedCats] = useState<MobleCat[]>(initialCats);
  const [selectedBuckets, setSelectedBuckets] = useState<PriceBucketId[]>([]);
  const [saleOnly, setSaleOnly] = useState(() => searchParams.get("sale") === "1");
  const [sort, setSort] = useState<SortId>("name_asc");
  const [density, setDensity] = useState<Density>("comfortable");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const syncCatsURL = (cats: MobleCat[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cats.length > 0) params.set("cat", cats.join(","));
    else params.delete("cat");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // --- Etiquetes ----------------------------------------------------------
  const catLabel = (c: MobleCat) => t(`tipus.${c}` as Parameters<typeof t>[0]);
  const bucketLabel = (id: PriceBucketId) =>
    tf(`priceMobles.${id}` as Parameters<typeof tf>[0]);

  // --- Toggles ------------------------------------------------------------
  const toggleCat = (c: MobleCat) => {
    const next = selectedCats.includes(c)
      ? selectedCats.filter((x) => x !== c)
      : [...selectedCats, c];
    setSelectedCats(next);
    syncCatsURL(next);
  };

  const toggleBucket = (id: PriceBucketId) =>
    setSelectedBuckets((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const bucketMatches = (pvp: number, ids: PriceBucketId[]) =>
    ids.some((id) => {
      const b = PRICE_BUCKETS.find((x) => x.id === id);
      if (!b) return false;
      return pvp >= b.min && (b.max === null || pvp < b.max);
    });

  // --- Llista filtrada ----------------------------------------------------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = mobles.filter((m) => {
      if (q && !m.nom.toLowerCase().includes(q)) return false;
      if (selectedCats.length > 0 && !selectedCats.includes(m.cat)) return false;
      if (selectedBuckets.length > 0 && !bucketMatches(m.pvp, selectedBuckets)) return false;
      if (saleOnly && !isOnSale(m.pvp, m.pvpAbans)) return false;
      return true;
    });
    return [...result].sort((a, b) => {
      if (sort === "name_asc") return a.nom.localeCompare(b.nom, locale);
      return sort === "price_asc" ? a.pvp - b.pvp : b.pvp - a.pvp;
    });
  }, [mobles, query, selectedCats, selectedBuckets, saleOnly, sort, locale]);

  const hasActiveFilters =
    query.trim() !== "" ||
    selectedCats.length > 0 ||
    selectedBuckets.length > 0 ||
    saleOnly;

  const activeFilterCount =
    selectedCats.length + selectedBuckets.length + (query.trim() ? 1 : 0) + (saleOnly ? 1 : 0);

  const clearAll = () => {
    setQuery("");
    setSelectedCats([]);
    setSelectedBuckets([]);
    setSaleOnly(false);
    syncCatsURL([]);
  };

  // Categories amb productes (es descarten les buides, ex. "pouf").
  const carouselItems = MOBLE_CATS.filter((c) => countMobleByCat(c) > 0).map((c) => ({
    key: c,
    label: catLabel(c),
    image: mobleImageForCat(c),
    active: selectedCats.includes(c),
  }));

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
        <label htmlFor="mobles-search" className="block text-sm font-medium text-kave-ink mb-2">
          {tf("search")}
        </label>
        <input
          id="mobles-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tf("searchPlaceholder")}
          className="w-full px-0 py-2 bg-transparent border-b border-kave-ink/30 text-sm text-kave-ink placeholder:text-kave-ink/40 focus:outline-none focus:border-kave-ink transition-colors"
        />
      </div>

      <fieldset className="border-t border-kave-line pt-5">
        <legend className="text-sm font-medium text-kave-ink mb-1.5">{t("typeLabel")}</legend>
        {MOBLE_CATS.filter((c) => countMobleByCat(c) > 0).map((c) => (
          <FilterCheck
            key={c}
            name="cat"
            checked={selectedCats.includes(c)}
            onChange={() => toggleCat(c)}
            label={catLabel(c)}
          />
        ))}
      </fieldset>

      <fieldset className="border-t border-kave-line pt-5">
        <legend className="text-sm font-medium text-kave-ink mb-1.5">{tf("priceLabel")}</legend>
        {PRICE_BUCKETS.map((b) => (
          <FilterCheck
            key={b.id}
            name="price"
            checked={selectedBuckets.includes(b.id)}
            onChange={() => toggleBucket(b.id)}
            label={bucketLabel(b.id)}
          />
        ))}
      </fieldset>

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
      {/* 1) Fila de categories */}
      <div className="mb-8">
        <CategoryCarousel items={carouselItems} onSelect={(k) => toggleCat(k as MobleCat)} />
      </div>

      {/* 2) Barra de filtres / comptador / densitat / ordre */}
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
            <label htmlFor="mobles-sort" className="sr-only">{tf("sort")}</label>
            <select
              id="mobles-sort"
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
          {selectedCats.map((c) => (
            <Chip key={`cat-${c}`} label={catLabel(c)} onRemove={() => toggleCat(c)} />
          ))}
          {selectedBuckets.map((id) => (
            <Chip key={`price-${id}`} label={bucketLabel(id)} onRemove={() => toggleBucket(id)} />
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-kave-ink underline underline-offset-4 hover:text-kave-tag transition-colors ml-1"
          >
            {tf("clear")}
          </button>
        </div>
      )}

      {/* 3) Graella */}
      {filtered.length > 0 ? (
        <ul className={clsx("grid gap-x-5 gap-y-10 mt-8", DENSITY_GRID[density])} role="list">
          {filtered.map((m, i) => (
            <li key={m.slug}>
              <KaveProductCard
                href={`${prefix}/mobiliari/${m.slug}`}
                image={mobleImage(m.slug)}
                title={m.nom}
                subtitle={catLabel(m.cat)}
                pvp={m.pvp}
                pvpAbans={m.pvpAbans}
                pricePrefix={m.cat === "moble" ? t("fromPrice") : undefined}
                fit={mobleImgFit(m.slug)}
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

      {/* 4) Calaix de filtres */}
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
                {t("showResults", { count: filtered.length })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
