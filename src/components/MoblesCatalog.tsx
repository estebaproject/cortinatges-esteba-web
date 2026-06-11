"use client";

// Catàleg de mobles filtrable i organitzable (client-side). Rep la llista
// completa de mobles per props des del Server Component (page.tsx) i gestiona
// l'estat de filtres, cerca i ordenació sense recarregar. Mateix patró i
// disseny de cards que CatifesCatalog (foto + nom + badge tipus + "des de X €").
// Batch 3: cards object-contain (escena) + pre-filtrat per URL (?tipus=).

import { useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import { type Moble, type TipusMoble, mobleEscena } from "@/lib/mobiliari";

// --- Tipus i constants de filtratge -------------------------------------

/** Ordre estable dels tipus de moble per agrupar/filtrar a la UI. */
const TIPUS_ORDER: TipusMoble[] = [
  "cadira",
  "butaca",
  "pouf",
  "sofa",
  "taula-menjador",
  "taula-cafe",
  "taula-centre",
  "taula-auxiliar",
  "tauleta-nit",
  "aparador",
  "consola",
  "prestatgeria",
  "llit",
  "moble",
];

/** Identificadors estables dels trams de preu (sobre pvpDesde, IVA inclòs). */
type PriceBucketId = "lt150" | "150_350" | "350_600" | "600_1000" | "gt1000";

type PriceBucket = {
  id: PriceBucketId;
  /** Mínim inclòs (€). */
  min: number;
  /** Màxim exclòs (€). null = sense límit superior. */
  max: number | null;
};

// Trams escollits a partir de la distribució real dels 34 PVP (de 65,95 € a
// 1.954,95 €): cadires d'entrada, seients i taules mitjanes, taules de cafè /
// centre, mobles grans i taules de menjador / aparadors premium.
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

export default function MoblesCatalog({ mobles, prefix, locale }: Props) {
  const t = useTranslations("Mobles");
  const tf = useTranslations("Filters");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // --- Hidratació inicial des de searchParams ----------------------------
  // Llegim ?tipus=cadira,butaca (coma-separat) o ?tipus=cadira&tipus=butaca (repetit)
  const initialTipus = useMemo((): TipusMoble[] => {
    // Suportem múltiples valors: ?tipus=cadira,butaca o ?tipus=cadira&tipus=butaca
    const rawAll = searchParams.getAll("tipus");
    const flattened = rawAll.flatMap((r) => r.split(",").map((s) => s.trim()));
    return flattened.filter((s): s is TipusMoble =>
      (TIPUS_ORDER as readonly string[]).includes(s),
    );
  }, [searchParams]);

  // --- Estat de filtres ---------------------------------------------------
  const [query, setQuery] = useState("");
  const [selectedTipus, setSelectedTipus] = useState<TipusMoble[]>(initialTipus);
  const [selectedBuckets, setSelectedBuckets] = useState<PriceBucketId[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sort, setSort] = useState<SortId>("name_asc");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sincronitzar URL quan canvien els tipus seleccionats.
  const syncTipusURL = (tipus: TipusMoble[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("tipus");
    if (tipus.length > 0) {
      params.set("tipus", tipus.join(","));
    }
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Només els tipus realment presents al catàleg, en l'ordre estable.
  const availableTipus = useMemo(() => {
    const present = new Set(mobles.map((m) => m.tipus));
    return TIPUS_ORDER.filter((tp) => present.has(tp));
  }, [mobles]);

  // Tots els noms de color presents (només els que en tenen: multicolor i
  // monocolor amb nom). Els models d'un sol color sense nom no aporten res.
  // Ordre alfabètic estable segons el locale per a una UI consistent.
  const availableColors = useMemo(() => {
    const names = new Set<string>();
    for (const m of mobles) {
      for (const c of m.colors) {
        if (c.nom) names.add(c.nom);
      }
    }
    return [...names].sort((a, b) => a.localeCompare(b, locale));
  }, [mobles, locale]);

  // --- Helpers d'etiquetes i format --------------------------------------
  const tipusLabel = (tp: TipusMoble) =>
    t(`tipus.${tp}` as Parameters<typeof t>[0]);

  const bucketLabel = (id: PriceBucketId) =>
    tf(`priceMobles.${id}` as Parameters<typeof tf>[0]);

  const priceFmt = (pvp: number) =>
    `${t("fromPrice")} ${pvp.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} €`;

  // --- Toggles ------------------------------------------------------------
  const toggleTipus = (tp: TipusMoble) => {
    const next = selectedTipus.includes(tp)
      ? selectedTipus.filter((x) => x !== tp)
      : [...selectedTipus, tp];
    setSelectedTipus(next);
    syncTipusURL(next);
  };

  const toggleBucket = (id: PriceBucketId) =>
    setSelectedBuckets((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const toggleColor = (nom: string) =>
    setSelectedColors((prev) =>
      prev.includes(nom) ? prev.filter((x) => x !== nom) : [...prev, nom],
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

      // Tipus (multiselecció; buit = tots)
      if (selectedTipus.length > 0 && !selectedTipus.includes(m.tipus))
        return false;

      // Preu (trams; buit = tots)
      if (selectedBuckets.length > 0 && !bucketMatches(m.pvpDesde, selectedBuckets))
        return false;

      // Color (multiselecció; buit = tots). Matcheja si ALGUN dels colors
      // del moble coincideix amb algun dels seleccionats.
      if (
        selectedColors.length > 0 &&
        !m.colors.some((c) => c.nom && selectedColors.includes(c.nom))
      )
        return false;

      return true;
    });

    const sorted = [...result].sort((a, b) => {
      if (sort === "name_asc") return a.nom.localeCompare(b.nom, locale);
      return sort === "price_asc"
        ? a.pvpDesde - b.pvpDesde
        : b.pvpDesde - a.pvpDesde;
    });

    return sorted;
  }, [mobles, query, selectedTipus, selectedBuckets, selectedColors, sort, locale]);

  // --- Estat de chips actius ---------------------------------------------
  const hasActiveFilters =
    query.trim() !== "" ||
    selectedTipus.length > 0 ||
    selectedBuckets.length > 0 ||
    selectedColors.length > 0;

  const clearAll = () => {
    setQuery("");
    setSelectedTipus([]);
    setSelectedBuckets([]);
    setSelectedColors([]);
    syncTipusURL([]);
  };

  const activeFilterCount =
    selectedTipus.length +
    selectedBuckets.length +
    selectedColors.length +
    (query.trim() ? 1 : 0);

  // --- Subcomponents reutilitzats ----------------------------------------

  // Checkbox estilitzat (tipus, tram de preu).
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
          className="block font-sans text-eyebrow text-accent-deep uppercase mb-3"
        >
          {tf("search")}
        </label>
        <input
          id="mobles-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tf("searchPlaceholder")}
          className="w-full px-3 py-2.5 bg-canvas border border-sand-dark font-sans text-body-sm text-ink placeholder:text-ink-faint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent-deep"
        />
      </div>

      {/* Tipus */}
      <fieldset className="border-t border-sand-dark/40 pt-6">
        <legend className="font-sans text-eyebrow text-accent-deep uppercase mb-3">
          {t("typeLabel")}
        </legend>
        <div>
          {availableTipus.map((tp) => (
            <FilterCheck
              key={tp}
              name="tipus"
              checked={selectedTipus.includes(tp)}
              onChange={() => toggleTipus(tp)}
              label={tipusLabel(tp)}
            />
          ))}
        </div>
      </fieldset>

      {/* Preu */}
      <fieldset className="border-t border-sand-dark/40 pt-6">
        <legend className="font-sans text-eyebrow text-accent-deep uppercase mb-3">
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

      {/* Color (només si hi ha colors amb nom al catàleg) */}
      {availableColors.length > 0 && (
        <fieldset className="border-t border-sand-dark/40 pt-6">
          <legend className="font-sans text-eyebrow text-accent-deep uppercase mb-3">
            {tf("colorLabel")}
          </legend>
          <div>
            {availableColors.map((nom) => (
              <FilterCheck
                key={nom}
                name="color"
                checked={selectedColors.includes(nom)}
                onChange={() => toggleColor(nom)}
                label={nom}
              />
            ))}
          </div>
        </fieldset>
      )}

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
      className="inline-flex items-center gap-1.5 bg-linen text-ink font-sans text-body-sm px-3 py-1.5 hover:bg-sand transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
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
          <h2 className="font-serif text-display-md text-ink mb-6">
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
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-ink text-canvas font-sans text-body-sm font-semibold tracking-wide focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
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
              <span className="ml-1 inline-flex items-center justify-center min-w-5 h-5 px-1.5 bg-sand text-ink text-xs rounded-full">
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
              className="px-3 py-2 bg-canvas border border-sand-dark font-sans text-body-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-accent-deep"
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
            {selectedTipus.map((tp) => (
              <Chip
                key={`tipus-${tp}`}
                label={tipusLabel(tp)}
                onRemove={() => toggleTipus(tp)}
              />
            ))}
            {selectedBuckets.map((id) => (
              <Chip
                key={`price-${id}`}
                label={bucketLabel(id)}
                onRemove={() => toggleBucket(id)}
              />
            ))}
            {selectedColors.map((nom) => (
              <Chip
                key={`color-${nom}`}
                label={nom}
                onRemove={() => toggleColor(nom)}
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

        {/* Graella de mobles (mateix disseny de cards) */}
        {filtered.length > 0 ? (
          <ul
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            role="list"
          >
            {filtered.map((m, i) => (
              <li key={m.slug}>
                <Link
                  href={`${prefix}/mobiliari/${m.slug}`}
                  className="group block"
                  aria-label={m.nom}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-linen mb-3 p-2">
                    <Image
                      src={mobleEscena(m.slug)}
                      alt={m.nom}
                      fill
                      priority={i < 4}
                      sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-canvas/90 text-ink font-sans text-[10px] tracking-widest uppercase px-2 py-1">
                      {tipusLabel(m.tipus)}
                    </span>
                    {/* Indicador de variants de color (només multicolor) */}
                    {m.colors.length > 1 && (
                      <span className="absolute top-3 right-3 bg-ink/90 text-canvas font-sans text-[10px] tracking-widest uppercase px-2 py-1">
                        {t("colorsCount", { count: m.colors.length })}
                      </span>
                    )}
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
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-display-md text-ink">
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

            <div className="mt-8 pt-6 border-t border-sand-dark/40">
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
