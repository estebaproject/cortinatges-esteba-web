"use client";

// Catàleg de catifes filtrable — clon de Kave Home (tema beige/negre).
// Estructura idèntica a la pàgina de llistat de Kave i a MobiliariCatalog:
//   1) fila horitzontal de famílies (CategoryCarousel) que actua de filtre,
//   2) barra "Filtres · N catifes · densitat de graella · ordenar",
//   3) graella de cards (CatifaCard → KaveProductCard) amb rebaixes reals,
//   4) calaix de filtres (cerca + família + preu + mides) que s'obre sota demanda.
// Hidrata familia / q / sale des de la URL perquè el cercador del header i el
// link "Rebaixes" funcionin. Mai mostra cost intern.

import { useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import {
  VISIBLE_CATIFA_FAMILIES,
  catifaEscena,
  catifaFilterFamilies,
  catifaImgFit,
  type Catifa,
  type CatifaFamilia,
} from "@/lib/catifes";
import { isOnSale } from "@/lib/discount";
import CatifaCard from "@/components/catifes/CatifaCard";
import CategoryCarousel from "@/components/shop/CategoryCarousel";

// --- Trams de preu (sobre pvpDesde, IVA inclòs) --------------------------
type PriceBucketId = "lt50" | "50_100" | "100_200" | "200_400" | "gt400";
type PriceBucket = { id: PriceBucketId; min: number; max: number | null };

// Trams escollits a partir de la distribució real dels PVP "des de" (de 18,95 €
// a 1.213,95 €): cobreixen bany/infantil econòmics, catàleg mitjà i premium.
const PRICE_BUCKETS: PriceBucket[] = [
  { id: "lt50", min: 0, max: 50 },
  { id: "50_100", min: 50, max: 100 },
  { id: "100_200", min: 100, max: 200 },
  { id: "200_400", min: 200, max: 400 },
  { id: "gt400", min: 400, max: null },
];

/** Llindar fix per al filtre opcional "≥ N mides". */
const MEASURES_THRESHOLD = 5;

type SortId = "name_asc" | "price_asc" | "price_desc";
type Density = "compact" | "comfortable" | "large";

const DENSITY_GRID: Record<Density, string> = {
  compact: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  comfortable: "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4",
  large: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3",
};

type Props = {
  catifes: Catifa[];
  prefix: string;
  locale: string;
};

export default function CatifesCatalog({ catifes, prefix, locale }: Props) {
  const t = useTranslations("Catifes");
  const tf = useTranslations("Filters");
  const ts = useTranslations("Shop");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // --- Hidratació des de la URL ------------------------------------------
  const initialFamilies = useMemo((): CatifaFamilia[] => {
    const raw = searchParams.get("familia");
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter((s): s is CatifaFamilia =>
        (VISIBLE_CATIFA_FAMILIES as readonly string[]).includes(s),
      );
  }, [searchParams]);

  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [selectedFamilies, setSelectedFamilies] = useState<CatifaFamilia[]>(initialFamilies);
  const [selectedBuckets, setSelectedBuckets] = useState<PriceBucketId[]>([]);
  const [onlyOnDemand, setOnlyOnDemand] = useState(false);
  const [minMeasures, setMinMeasures] = useState(false);
  const [saleOnly, setSaleOnly] = useState(() => searchParams.get("sale") === "1");
  const [sort, setSort] = useState<SortId>("name_asc");
  const [density, setDensity] = useState<Density>("comfortable");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const syncFamiliesURL = (families: CatifaFamilia[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (families.length > 0) params.set("familia", families.join(","));
    else params.delete("familia");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // --- Etiquetes ----------------------------------------------------------
  const familyLabel = (f: CatifaFamilia) =>
    t(`families.${f}` as Parameters<typeof t>[0]);
  const bucketLabel = (id: PriceBucketId) =>
    tf(`price.${id}` as Parameters<typeof tf>[0]);

  // --- Toggles ------------------------------------------------------------
  const toggleFamily = (f: CatifaFamilia) => {
    const next = selectedFamilies.includes(f)
      ? selectedFamilies.filter((x) => x !== f)
      : [...selectedFamilies, f];
    setSelectedFamilies(next);
    syncFamiliesURL(next);
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
    const result = catifes.filter((c) => {
      if (q && !c.nom.toLowerCase().includes(q)) return false;
      // Match per família DE FILTRE: les "in_out" (Exterior) també surten sota
      // "catalogo" (Interior) perquè són dual-use. Vegeu catifaFilterFamilies.
      if (
        selectedFamilies.length > 0 &&
        !catifaFilterFamilies(c).some((f) => selectedFamilies.includes(f))
      )
        return false;
      if (minMeasures && c.nMedides < MEASURES_THRESHOLD) return false;
      // Rebaixa real (només catifes amb preu i pvpAbans > pvpDesde).
      if (saleOnly && !(c.pvpDesde !== null && isOnSale(c.pvpDesde, c.pvpAbans)))
        return false;
      // Preu: "per encàrrec" (null) i trams són filtres compatibles (OR entre
      // ells). Si no hi ha cap actiu, no filtra per preu.
      const priceActive = onlyOnDemand || selectedBuckets.length > 0;
      if (priceActive) {
        const matchesOnDemand = onlyOnDemand && c.pvpDesde === null;
        const matchesBucket =
          c.pvpDesde !== null &&
          selectedBuckets.length > 0 &&
          bucketMatches(c.pvpDesde, selectedBuckets);
        if (!matchesOnDemand && !matchesBucket) return false;
      }
      return true;
    });

    return [...result].sort((a, b) => {
      if (sort === "name_asc") return a.nom.localeCompare(b.nom, locale);
      // Preu: les "per encàrrec" (null) sempre al final, en tots dos ordres.
      const pa = a.pvpDesde;
      const pb = b.pvpDesde;
      if (pa === null && pb === null) return a.nom.localeCompare(b.nom, locale);
      if (pa === null) return 1;
      if (pb === null) return -1;
      return sort === "price_asc" ? pa - pb : pb - pa;
    });
  }, [
    catifes,
    query,
    selectedFamilies,
    selectedBuckets,
    onlyOnDemand,
    minMeasures,
    saleOnly,
    sort,
    locale,
  ]);

  const hasActiveFilters =
    query.trim() !== "" ||
    selectedFamilies.length > 0 ||
    selectedBuckets.length > 0 ||
    onlyOnDemand ||
    minMeasures ||
    saleOnly;

  const activeFilterCount =
    selectedFamilies.length +
    selectedBuckets.length +
    (onlyOnDemand ? 1 : 0) +
    (minMeasures ? 1 : 0) +
    (saleOnly ? 1 : 0) +
    (query.trim() ? 1 : 0);

  const clearAll = () => {
    setQuery("");
    setSelectedFamilies([]);
    setSelectedBuckets([]);
    setOnlyOnDemand(false);
    setMinMeasures(false);
    setSaleOnly(false);
    syncFamiliesURL([]);
  };

  // Famílies amb una imatge representativa (escena de la primera catifa de cada
  // família). Es descarten les famílies sense cap catifa.
  const carouselItems = VISIBLE_CATIFA_FAMILIES.map((f) => {
    const first = catifes.find((c) => c.familia === f);
    return first
      ? {
          key: f,
          label: familyLabel(f),
          image: catifaEscena(first.slug),
          active: selectedFamilies.includes(f),
        }
      : null;
  }).filter((x): x is NonNullable<typeof x> => x !== null);

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
        <label htmlFor="catifes-search" className="block text-sm font-medium text-kave-ink mb-2">
          {tf("search")}
        </label>
        <input
          id="catifes-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tf("searchPlaceholder")}
          className="w-full px-0 py-2 bg-transparent border-b border-kave-ink/30 text-sm text-kave-ink placeholder:text-kave-ink/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kave-ink focus:border-kave-ink transition-colors"
        />
      </div>

      <fieldset className="border-t border-kave-line pt-5">
        <legend className="text-sm font-medium text-kave-ink mb-1.5">{tf("family")}</legend>
        {VISIBLE_CATIFA_FAMILIES.map((f) => (
          <FilterCheck
            key={f}
            name="family"
            checked={selectedFamilies.includes(f)}
            onChange={() => toggleFamily(f)}
            label={familyLabel(f)}
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
        <FilterCheck
          name="price"
          checked={onlyOnDemand}
          onChange={() => setOnlyOnDemand((v) => !v)}
          label={t("onDemand")}
        />
      </fieldset>

      <fieldset className="border-t border-kave-line pt-5">
        <legend className="text-sm font-medium text-kave-ink mb-1.5">{tf("measures")}</legend>
        <FilterCheck
          name="measures"
          checked={minMeasures}
          onChange={() => setMinMeasures((v) => !v)}
          label={tf("measuresMin", { count: MEASURES_THRESHOLD })}
        />
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
          className="text-sm text-kave-ink underline underline-offset-4 decoration-kave-tag hover:decoration-2 transition-all"
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
      {/* 1) Fila de famílies */}
      <div className="mb-8">
        <CategoryCarousel items={carouselItems} onSelect={(k) => toggleFamily(k as CatifaFamilia)} />
      </div>

      {/* 2) Barra de filtres / comptador / densitat / ordre */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-y border-kave-line py-3">
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-2 text-sm font-medium tracking-wide text-kave-ink hover:underline hover:decoration-kave-tag underline-offset-4"
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
            {tf("results", { count: filtered.length })}
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
            <label htmlFor="catifes-sort" className="sr-only">{tf("sort")}</label>
            <select
              id="catifes-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortId)}
              className="bg-transparent border-b border-kave-ink/30 py-1 text-sm text-kave-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kave-ink focus:border-kave-ink transition-colors"
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
          {selectedFamilies.map((f) => (
            <Chip key={`fam-${f}`} label={familyLabel(f)} onRemove={() => toggleFamily(f)} />
          ))}
          {selectedBuckets.map((id) => (
            <Chip key={`price-${id}`} label={bucketLabel(id)} onRemove={() => toggleBucket(id)} />
          ))}
          {onlyOnDemand && <Chip label={t("onDemand")} onRemove={() => setOnlyOnDemand(false)} />}
          {minMeasures && (
            <Chip
              label={tf("measuresMin", { count: MEASURES_THRESHOLD })}
              onRemove={() => setMinMeasures(false)}
            />
          )}
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-kave-ink underline underline-offset-4 decoration-kave-tag hover:decoration-2 transition-all ml-1"
          >
            {tf("clear")}
          </button>
        </div>
      )}

      {/* 3) Graella */}
      {filtered.length > 0 ? (
        <ul className={clsx("grid gap-x-5 gap-y-10 mt-8", DENSITY_GRID[density])} role="list">
          {filtered.map((c) => (
            <li key={c.slug}>
              <CatifaCard
                href={`${prefix}/catifes/${c.slug}`}
                image={catifaEscena(c.slug)}
                title={c.nom}
                subtitle={familyLabel(c.familia)}
                pvpDesde={c.pvpDesde}
                pvpAbans={c.pvpAbans}
                fit={catifaImgFit(c.slug)}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="py-24 text-center">
          <p className="font-display text-2xl text-kave-ink mb-3">{tf("emptyTitle")}</p>
          <p className="text-sm text-kave-muted mb-6">{tf("emptyBody")}</p>
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-kave-ink underline underline-offset-4 decoration-kave-tag hover:decoration-2 transition-all"
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
                {tf("showResults", { count: filtered.length })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
