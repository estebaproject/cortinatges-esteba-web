"use client";

// Catàleg de catifes filtrable i organitzable (client-side). Rep la llista
// completa de catifes per props des del Server Component (page.tsx) i gestiona
// l'estat de filtres, cerca i ordenació sense recarregar.
// Redisseny minimalista: cards uniformes amb escena (1.jpg) + object-cover en
// aspect-[4/5], nom en sans, família com a línia subtil, "des de X €".

import { useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import {
  CATIFA_FAMILIES,
  catifaEscena,
  type Catifa,
  type CatifaFamilia,
} from "@/lib/catifes";

// --- Tipus i constants de filtratge -------------------------------------

/** Identificadors estables dels trams de preu (sobre pvpDesde, IVA inclòs). */
type PriceBucketId = "lt50" | "50_100" | "100_200" | "200_400" | "gt400";

type PriceBucket = {
  id: PriceBucketId;
  /** Mínim inclòs (€). */
  min: number;
  /** Màxim exclòs (€). null = sense límit superior. */
  max: number | null;
};

// Trams escollits a partir de la distribució real dels 76 PVP (de 18,95 € a
// 635,95 €): cobreixen bany/infantil econòmics, catàleg mitjà i chenille premium.
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

type Props = {
  /** Llista completa de catifes (dades públiques) servida des del server. */
  catifes: Catifa[];
  /** Prefix de locale per als enllaços ("" per ca, "/es" etc.). */
  prefix: string;
  /** Locale actiu, per formatar el preu. */
  locale: string;
};

export default function CatifesCatalog({ catifes, prefix, locale }: Props) {
  const t = useTranslations("Catifes");
  const tf = useTranslations("Filters");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // --- Hidratació inicial des de searchParams ----------------------------
  // Llegim ?familia=catalogo|in_out|kids_collection|bath_collection
  const initialFamilies = useMemo((): CatifaFamilia[] => {
    const raw = searchParams.get("familia");
    if (!raw) return [];
    const valid = raw
      .split(",")
      .map((s) => s.trim())
      .filter((s): s is CatifaFamilia =>
        (CATIFA_FAMILIES as readonly string[]).includes(s),
      );
    return valid;
  }, [searchParams]);

  // --- Estat de filtres ---------------------------------------------------
  const [query, setQuery] = useState("");
  const [selectedFamilies, setSelectedFamilies] = useState<CatifaFamilia[]>(initialFamilies);
  const [selectedBuckets, setSelectedBuckets] = useState<PriceBucketId[]>([]);
  const [onlyOnDemand, setOnlyOnDemand] = useState(false);
  const [minMeasures, setMinMeasures] = useState(false);
  const [sort, setSort] = useState<SortId>("name_asc");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sincronitzar URL quan canvien les famílies seleccionades.
  // Escriu ?familia=X o neteja el param si buit.
  const syncFamiliesURL = (families: CatifaFamilia[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (families.length > 0) {
      params.set("familia", families.join(","));
    } else {
      params.delete("familia");
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // --- Helpers d'etiquetes i format --------------------------------------
  const familyLabel = (f: CatifaFamilia) =>
    t(`families.${f}` as Parameters<typeof t>[0]);

  const bucketLabel = (id: PriceBucketId) =>
    tf(`price.${id}` as Parameters<typeof tf>[0]);

  const priceFmt = (pvp: number | null) =>
    pvp === null
      ? t("onDemand")
      : `${t("fromPrice")} ${pvp.toLocaleString(locale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} €`;

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

  // --- Llista filtrada i ordenada ----------------------------------------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const result = catifes.filter((c) => {
      // Cerca per nom
      if (q && !c.nom.toLowerCase().includes(q)) return false;

      // Família (multiselecció; buit = totes)
      if (selectedFamilies.length > 0 && !selectedFamilies.includes(c.familia))
        return false;

      // Nombre de mides
      if (minMeasures && c.nMedides < MEASURES_THRESHOLD) return false;

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

    const sorted = [...result].sort((a, b) => {
      if (sort === "name_asc") return a.nom.localeCompare(b.nom, locale);
      // Preu: les "per encàrrec" (null) sempre al final, en tots dos ordres.
      const pa = a.pvpDesde;
      const pb = b.pvpDesde;
      if (pa === null && pb === null) return a.nom.localeCompare(b.nom, locale);
      if (pa === null) return 1;
      if (pb === null) return -1;
      return sort === "price_asc" ? pa - pb : pb - pa;
    });

    return sorted;
  }, [
    catifes,
    query,
    selectedFamilies,
    selectedBuckets,
    onlyOnDemand,
    minMeasures,
    sort,
    locale,
  ]);

  // --- Estat de chips actius ---------------------------------------------
  const hasActiveFilters =
    query.trim() !== "" ||
    selectedFamilies.length > 0 ||
    selectedBuckets.length > 0 ||
    onlyOnDemand ||
    minMeasures;

  const clearAll = () => {
    setQuery("");
    setSelectedFamilies([]);
    setSelectedBuckets([]);
    setOnlyOnDemand(false);
    setMinMeasures(false);
    syncFamiliesURL([]);
  };

  const activeFilterCount =
    selectedFamilies.length +
    selectedBuckets.length +
    (onlyOnDemand ? 1 : 0) +
    (minMeasures ? 1 : 0) +
    (query.trim() ? 1 : 0);

  // --- Subcomponents reutilitzats ----------------------------------------

  // Checkbox estilitzat (família, tram de preu, mides).
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
    <label className="flex items-center gap-2.5 cursor-pointer group py-1">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 shrink-0 rounded-none border border-sand-dark text-ink accent-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
      />
      <span className="font-sans text-body-sm text-ink-muted group-hover:text-ink transition-colors">
        {label}
      </span>
    </label>
  );

  // Bloc complet de filtres (compartit entre sidebar desktop i panell mòbil).
  const FiltersBody = (
    <div className="space-y-8">
      {/* Cerca */}
      <div>
        <label
          htmlFor="catifes-search"
          className="block font-sans text-body-sm font-medium text-ink mb-2.5"
        >
          {tf("search")}
        </label>
        <input
          id="catifes-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tf("searchPlaceholder")}
          className="w-full px-3 py-2.5 bg-canvas border-b border-sand-dark/40 font-sans text-body-sm text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:border-ink transition-colors"
        />
      </div>

      {/* Família */}
      <fieldset className="border-t border-sand-dark/30 pt-6">
        <legend className="font-sans text-body-sm font-medium text-ink mb-2.5">
          {tf("family")}
        </legend>
        <div>
          {CATIFA_FAMILIES.map((f) => (
            <FilterCheck
              key={f}
              name="family"
              checked={selectedFamilies.includes(f)}
              onChange={() => toggleFamily(f)}
              label={familyLabel(f)}
            />
          ))}
        </div>
      </fieldset>

      {/* Preu */}
      <fieldset className="border-t border-sand-dark/30 pt-6">
        <legend className="font-sans text-body-sm font-medium text-ink mb-2.5">
          {tf("priceLabel")}
        </legend>
        <div>
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
        </div>
      </fieldset>

      {/* Mides */}
      <fieldset className="border-t border-sand-dark/30 pt-6">
        <legend className="font-sans text-body-sm font-medium text-ink mb-2.5">
          {tf("measures")}
        </legend>
        <div>
          <FilterCheck
            name="measures"
            checked={minMeasures}
            onChange={() => setMinMeasures((v) => !v)}
            label={tf("measuresMin", { count: MEASURES_THRESHOLD })}
          />
        </div>
      </fieldset>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="font-sans text-body-sm text-accent-deep underline underline-offset-4 hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
        >
          {tf("clear")}
        </button>
      )}
    </div>
  );

  // Chip de filtre actiu amb botó per treure'l.
  const Chip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 border border-sand-dark/40 text-ink font-sans text-body-sm px-3 py-1.5 hover:border-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
    >
      <span>{label}</span>
      <span aria-hidden="true" className="text-ink-muted">
        ×
      </span>
      <span className="sr-only">{tf("removeFilter")}</span>
    </button>
  );

  return (
    <div className="lg:grid lg:grid-cols-[16rem_1fr] lg:gap-10">
      {/* --- Sidebar de filtres (desktop) --- */}
      <aside className="hidden lg:block">
        <div className="sticky top-32">
          <h2 className="font-sans text-body-md font-medium text-ink mb-6 pb-4 border-b border-sand-dark/30">
            {tf("title")}
          </h2>
          {FiltersBody}
        </div>
      </aside>

      {/* --- Columna de resultats --- */}
      <div>
        {/* Barra superior: botó mòbil + comptador + ordenar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          {/* Botó filtres (mòbil) */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 border border-ink text-ink font-sans text-body-sm font-medium hover:bg-ink hover:text-canvas transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            aria-haspopup="dialog"
            aria-expanded={mobileOpen}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M6 12h12m-9 5.25h6"
              />
            </svg>
            {tf("filter")}
            {activeFilterCount > 0 && (
              <span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1.5 bg-ink text-canvas text-xs rounded-full group-hover:bg-canvas group-hover:text-ink transition-colors">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Comptador de resultats */}
          <p
            className="font-sans text-body-sm text-ink-muted"
            role="status"
            aria-live="polite"
          >
            {tf("results", { count: filtered.length })}
          </p>

          {/* Ordenar */}
          <div className="flex items-center gap-2 ml-auto">
            <label
              htmlFor="catifes-sort"
              className="font-sans text-body-sm text-ink-muted"
            >
              {tf("sort")}
            </label>
            <select
              id="catifes-sort"
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

        {/* Chips de filtres actius */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {query.trim() && (
              <Chip
                label={`${tf("search")}: ${query.trim()}`}
                onRemove={() => setQuery("")}
              />
            )}
            {selectedFamilies.map((f) => (
              <Chip
                key={`fam-${f}`}
                label={familyLabel(f)}
                onRemove={() => toggleFamily(f)}
              />
            ))}
            {selectedBuckets.map((id) => (
              <Chip
                key={`price-${id}`}
                label={bucketLabel(id)}
                onRemove={() => toggleBucket(id)}
              />
            ))}
            {onlyOnDemand && (
              <Chip
                label={t("onDemand")}
                onRemove={() => setOnlyOnDemand(false)}
              />
            )}
            {minMeasures && (
              <Chip
                label={tf("measuresMin", { count: MEASURES_THRESHOLD })}
                onRemove={() => setMinMeasures(false)}
              />
            )}
            <button
              type="button"
              onClick={clearAll}
              className="font-sans text-body-sm text-accent-deep underline underline-offset-4 hover:text-ink transition-colors ml-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
            >
              {tf("clear")}
            </button>
          </div>
        )}

        {/* Graella de catifes — cards uniformes (escena + object-cover) */}
        {filtered.length > 0 ? (
          <ul
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10"
            role="list"
          >
            {filtered.map((c, i) => (
              <li key={c.slug}>
                <Link
                  href={`${prefix}/catifes/${c.slug}`}
                  className="group block"
                  aria-label={c.nom}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-canvas-warm mb-3">
                    <Image
                      src={catifaEscena(c.slug)}
                      alt={c.nom}
                      fill
                      priority={i < 4}
                      sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="font-sans text-body-md font-medium text-ink group-hover:text-accent-deep transition-colors">
                    {c.nom}
                  </p>
                  <p className="font-sans text-body-sm text-ink-faint mt-0.5">
                    {familyLabel(c.familia)}
                  </p>
                  <p className="font-sans text-body-sm text-ink-muted mt-1">
                    {priceFmt(c.pvpDesde)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-20 text-center">
            <p className="font-serif text-display-md text-ink mb-3">
              {tf("emptyTitle")}
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

      {/* --- Panell de filtres (mòbil) --- */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={tf("title")}
        >
          {/* Fons */}
          <button
            type="button"
            aria-label={tf("close")}
            onClick={() => setMobileOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />
          {/* Calaix */}
          <div className="absolute inset-y-0 left-0 w-[88%] max-w-sm bg-canvas overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-sand-dark/30">
              <h2 className="font-sans text-body-md font-medium text-ink">
                {tf("title")}
              </h2>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label={tf("close")}
                className="p-2 -mr-2 text-ink-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
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
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {FiltersBody}

            <div className="mt-8 pt-6 border-t border-sand-dark/30">
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "w-full px-6 py-3.5 bg-ink text-canvas font-sans text-body-md font-semibold tracking-wide",
                  "hover:bg-accent-deep transition-colors",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
                )}
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
