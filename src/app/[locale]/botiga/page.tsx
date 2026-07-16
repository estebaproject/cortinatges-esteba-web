import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SITE_URL, SHOW_MANTES } from "@/lib/site";
import { formatEur } from "@/lib/discount";
import {
  MOBLE_CATS,
  countMobleByCat,
  mobleImageForCat,
} from "@/lib/mobiliari";
import {
  VISIBLE_CATIFA_FAMILIES,
  countCatifaByFamilia,
  firstCatifaImageForFamilia,
} from "@/lib/shop-families";
import { MANTES, mantaImage } from "@/lib/mantes";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Botiga" });
  const prefix = locale === "ca" ? "" : `/${locale}`;
  const url = `${SITE_URL}${prefix}/botiga`;
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: t("metaTitle"), description: t("metaDescription") },
  };
}

// Hub de la botiga — clon de Kave. Tres seccions per categoria (Mobles, Catifes,
// Mantes) amb tiles + "Veure tot". Les rebaixes NO es mostren aquí: viuen només a
// la seva pàgina (/rebaixes). Les categories buides es descarten (abans hi havia
// un "Pouf" sense productes, amb la imatge trencada). Tema Kave (kave-*, font-*).

type Tile = {
  key: string;
  label: string;
  sub?: string;
  image: string;
  href: string;
  fit: "contain" | "cover";
};

function SectionHeader({ id, title, href, verTot }: { id: string; title: string; href: string; verTot: string }) {
  return (
    <div className="flex items-baseline justify-between mb-6 border-b border-kave-line pb-4">
      <h2 id={id} className="font-display text-2xl md:text-3xl text-kave-ink">
        {title}
      </h2>
      <Link href={href} className="inline-flex items-center gap-1 text-sm text-kave-ink hover:underline hover:decoration-kave-tag underline-offset-4 transition-colors group">
        {verTot}
        <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}

// Columnes segons el nombre de tiles: la graella s'ajusta al contingut perquè una
// secció amb 3 tiles ompli l'ample amb 3 columnes (i no deixi un forat a la dreta,
// com passava amb `lg:grid-cols-4` fix). Classes literals completes perquè el
// scanner de Tailwind les capti (res de concatenació dinàmica).
const COLS_BY_COUNT: Record<number, string> = {
  1: "grid-cols-1 max-w-md",
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
};

// `sizes` coherent amb les columnes reals de cada recompte (imatge nítida sense
// descarregar de més).
const SIZES_BY_COUNT: Record<number, string> = {
  1: "(min-width:640px) 28rem, 100vw",
  2: "50vw",
  3: "(min-width:640px) 33vw, 50vw",
  4: "(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw",
};

function TileRow({ tiles }: { tiles: Tile[] }) {
  const n = Math.min(tiles.length, 4);
  const cols = COLS_BY_COUNT[n] ?? COLS_BY_COUNT[4];
  const sizes = SIZES_BY_COUNT[n] ?? SIZES_BY_COUNT[4];
  return (
    <ul className={`grid ${cols} gap-x-5 gap-y-8`} role="list">
      {tiles.map((tl) => (
        <li key={tl.key}>
          <Link href={tl.href} className="group block">
            <div className="relative aspect-square overflow-hidden bg-white">
              <Image
                src={tl.image}
                alt={tl.label}
                fill
                sizes={sizes}
                className={`${tl.fit === "cover" ? "object-cover" : "object-contain p-4"} transition-transform duration-500 group-hover:scale-[1.03]`}
              />
            </div>
            <p className="mt-3 text-[0.95rem] font-semibold text-kave-ink group-hover:underline group-hover:decoration-kave-tag underline-offset-4 transition-colors">
              {tl.label}
            </p>
            {tl.sub && <p className="mt-0.5 text-sm text-kave-muted">{tl.sub}</p>}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function BotigaPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("Botiga");
  const tMobles = await getTranslations("Mobiliari");
  const tCatifes = await getTranslations("Catifes");
  const tMantes = await getTranslations("Mantes");
  const prefix = locale === "ca" ? "" : `/${locale}`;

  const count = (n: number) => t("productCount", { count: n });

  // --- Mobles: tiles per categoria amb productes (descarta buides) ---
  const mobleTiles: Tile[] = MOBLE_CATS.filter((c) => countMobleByCat(c) > 0).map((cat) => ({
    key: `moble-${cat}`,
    label: tMobles(`tipusPlural.${cat}` as Parameters<typeof tMobles>[0]),
    sub: count(countMobleByCat(cat)),
    image: mobleImageForCat(cat),
    href: `${prefix}/mobiliari?cat=${cat}`,
    fit: "contain",
  }));

  // --- Catifes: tiles per família ---
  const catifaTiles: Tile[] = VISIBLE_CATIFA_FAMILIES.filter((f) => countCatifaByFamilia(f) > 0).map((fam) => ({
    key: `catifa-${fam}`,
    label: tCatifes(`families.${fam}` as Parameters<typeof tCatifes>[0]),
    sub: count(countCatifaByFamilia(fam)),
    image: firstCatifaImageForFamilia(fam),
    href: `${prefix}/catifes?familia=${fam}`,
    fit: "cover",
  }));

  // --- Mantes: tiles de productes destacats amb preu ---
  const mantaTiles: Tile[] = SHOW_MANTES
    ? MANTES.slice(0, 4).map((m) => ({
        key: `manta-${m.slug}`,
        label: m.nom,
        sub: `${tMantes("fromPrice")} ${formatEur(m.pvp, locale)}`,
        image: mantaImage(m.slug),
        href: `${prefix}/mantes/${m.slug}`,
        fit: "cover" as const,
      }))
    : [];

  const sections = [
    { key: "mobles", title: t("moblesTitle"), href: `${prefix}/mobiliari`, tiles: mobleTiles },
    { key: "catifes", title: t("catifesTitle"), href: `${prefix}/catifes`, tiles: catifaTiles },
    { key: "mantes", title: tMantes("eyebrow"), href: `${prefix}/mantes`, tiles: mantaTiles },
  ].filter((s) => s.tiles.length > 0);

  return (
    <article className="bg-kave-bg font-grotesque text-kave-ink">
      <section className="pt-32 md:pt-36 pb-16 lg:pb-24">
        <div className="max-w-layout mx-auto px-5 lg:px-10">
          {/* Hero */}
          <header className="mb-12 max-w-2xl">
            <h1 className="font-display text-4xl md:text-5xl text-kave-ink mb-4 leading-[1.05]">
              {t("headline")}
            </h1>
            <p className="text-base text-kave-muted">{t("intro")}</p>
          </header>

          {/* Seccions per categoria */}
          <div className="space-y-16">
            {sections.map((s) => (
              <section key={s.key} aria-labelledby={`hub-${s.key}`}>
                <SectionHeader id={`hub-${s.key}`} title={s.title} href={s.href} verTot={t("verTot")} />
                <TileRow tiles={s.tiles} />
              </section>
            ))}
          </div>
        </div>
      </section>
    </article>
  );
}
