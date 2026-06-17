"use client";

// Catàleg de mobiliari filtrable i organitzable (client-side). Rep la llista
// completa de mobles per props des del Server Component (page.tsx) i gestiona
// l'estat de filtres, cerca i ordenació sense recarregar.
// Disseny minimalista: cards uniformes amb hero (1.jpg) en aspect-[4/5]. A
// diferència de catifes, el moble usa object-contain sobre bg-canvas-warm amb
// padding: les fotos varien molt de proporció (estanteries verticals, sofàs
// amples) i amb cover es retallarien malament. Contain mostra la peça SENCERA
// sense deformar; tot el grid queda uniforme. Nom en sans, categoria com a
// línia subtil, "des de X €". Mai cost intern; mai botó de compra.

import { useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import {
  MOBLE_CATS,
  mobleImage,
  type Moble,
  type MobleCat,
} from "@/lib/mobiliari";

// --- Tipus i constants de filtratge -------------------------------------

/** Identificadors estables dels trams de preu (sobre pvp, IVA inclòs). */
type PriceBucketId = "lt150" | "150_350" | "350_600" | "600_1000" | "gt1000";

type PriceBucket = {
  id: PriceBucketId;
  /** Mínim inclòs (€). */
  min: number;
  /** Màxim exclòs (€). null = sense límit superior. */
  max: number | null;
};

// Trams escollits a partir de la distribució real dels 44 PVP (de 63,95 € a
// 1.954,95 €): cobreixen seients econòmics, mobles mitjans i peces premium.
const PRICE_BUCKETS: PriceBucket[] = [
  { id: "lt150", min: 0, max: 150 },
  { id: "150_350", min: 150, max: 350 },
  { id: "350_600", min: 350, max: 600 },
  { id: "600_1000", min: 600, max: 1000 },
  { id: "gt1000", min: 1000, max: null },
];

type SortId = "name_asc" | "price_asc" | "price_desc";

type Props = {
  /** Llista completa de mobles (dades públiques) servida des del server. */
  mobles: Moble[];
  /** Prefix de locale per als enllaços ("" per ca, "/es" etc.). */
  prefix: string;
  /** Locale actiu, per formatar el preu. */
  locale: string;
};

export default function MobiliariCatalog({ mobles, prefix, locale }: Props) {
  const t = useTranslations("Mobiliari");
  const tf = useTranslations("Filters");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // --- Hidratació inicial des de searchParams ----------------------------
  // Llegim ?cat=cadira|butaca|pouf|moble
  const initialCats = useMemo((): MobleCat[] => {
    const raw = searchParams.get("cat");
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter((s): s is MobleCat =>
        (MOBLE_CATS as readonly string[]).includes(s),
      );
  }, [searchParams]);

  // --- Estat de filtres ---------------------------------------------------
  const [query, setQuery] = useState("");
  const [selectedCats, setSelectedCats] = useState<MobleCat[]>(initialCats);
  const [selectedBuckets, setSelectedBuckets] = useState<PriceBucketId[]>([]);
  const [sort, setSort] = useState<SortId>("name_asc");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sincronitzar URL quan canvien les categories seleccionades.
  const syncCatsURL = (cats: MobleCat[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (cats.length > 0) {
      params.set("cat", cats.join(","));
    } else {
      params.delete("cat");
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // --- Helpers d'etiquetes i format --------------------------------------
  const catLabel = (c: MobleCat) =>
    t(`tipus.${c}` as Parameters<typeof t>[0]);

  const bucketLabel = (id: PriceBucketId) =>
    tf(`priceMobles.${id}` as Parameters<typeof tf>[0]);

  const priceFmt = (pvp: number) =>
    `${t("fromPrice")} ${pvp.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} €`;

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

  // --- Llista filtrada i ordenada ----------------------------------------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    const result = mobles.filter((m) => {
      // Cerca per nom
      if (q && !m.nom.toLowerCase().includes(q)) return false;

      // Categoria (multiselecció; buit = totes)
      if (selectedCats.length > 0 && !selectedCats.includes(m.cat)) return false;

      // Preu (trams; buit = tots)
      if (selectedBuckets.length > 0 && !bucketMatches(m.pvp, selectedBuckets))
        return false;

      return true;
    });

    const sorted = [...result].sort((a, b) => {
      if (sort === "name_asc") return a.nom.localeCompare(b.nom, locale);
      return sort === "price_asc" ? a.pvp - b.pvp : b.pvp - a.pvp;
    });

    return sorted;
  }, [mobles, query, selectedCats, selectedBuckets, sort, locale]);

  // --- Estat de chips actius ---------------------------------------------
  const hasActiveFilters =
    query.trim() !== "" ||
    selectedCats.length > 0 ||
    selectedBuckets.length > 0;

  const clearAll = () => {
    setQuery("");
    setSelectedCats([]);
    setSelectedBuckets([]);
    syncCatsURL([]);
  };

  const activeFilterCount =
    selectedCats.length + selectedBuckets.length + (query.trim() ? 1 : 0);

  // --- Subcomponents reutilitzats ----------------------------------------

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
          htmlFor="mobles-search"
          className="block font-sans text-body-sm font-medium text-ink mb-2.5"
        >
          {tf("search")}
        </label>
        <input
          id="mobles-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tf("searchPlaceholder")}
          className="w-full px-3 py-2.5 bg-canvas border-b border-sand-dark/40 font-sans text-body-sm text-ink placeholder:text-ink-faint focus-visible:outline-none focus-visible:border-ink transition-colors"
        />
      </div>

      {/* Categoria */}
      <fieldset className="border-t border-sand-dark/30 pt-6">
        <legend className="font-sans text-body-sm font-medium text-ink mb-2.5">
          {t("typeLabel")}
        </legend>
        <div>
          {MOBLE_CATS.map((c) => (
            <FilterCheck
              key={c}
              name="cat"
              checked={selectedCats.includes(c)}
              onChange={() => toggleCat(c)}
              label={catLabel(c)}
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
              <span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1.5 bg-ink text-canvas text-xs rounded-full">
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
            {t("results", { count: filtered.length })}
          </p>

          {/* Ordenar */}
          <div className="flex items-center gap-2 ml-auto">
            <label
              htmlFor="mobles-sort"
              className="font-sans text-body-sm text-ink-muted"
            >
              {tf("sort")}
            </label>
            <select
              id="mobles-sort"
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
            {selectedCats.map((c) => (
              <Chip
                key={`cat-${c}`}
                label={catLabel(c)}
                onRemove={() => toggleCat(c)}
              />
            ))}
            {selectedBuckets.map((id) => (
              <Chip
                key={`price-${id}`}
                label={bucketLabel(id)}
                onRemove={() => toggleBucket(id)}
              />
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="font-sans text-body-sm text-accent-deep underline underline-offset-4 hover:text-ink transition-colors ml-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
            >
              {tf("clear")}
            </button>
          </div>
        )}

        {/* Graella de mobles — cards uniformes (hero + object-contain) */}
        {filtered.length > 0 ? (
          <ul
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-10"
            role="list"
          >
            {filtered.map((m, i) => (
              <li key={m.slug}>
                <Link
                  href={`${prefix}/mobiliari/${m.slug}`}
                  className="group block"
                  aria-label={m.nom}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-canvas-warm mb-3 p-5">
                    <Image
                      src={mobleImage(m.slug)}
                      alt={m.nom}
                      fill
                      priority={i < 4}
                      sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <p className="font-sans text-body-md font-medium text-ink group-hover:text-accent-deep transition-colors">
                    {m.nom}
                  </p>
                  <p className="font-sans text-body-sm text-ink-faint mt-0.5">
                    {catLabel(m.cat)}
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
                {t("showResults", { count: filtered.length })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
