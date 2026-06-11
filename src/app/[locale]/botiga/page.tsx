import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { MANTES, mantaEscena } from "@/lib/decoracio";
import { SITE_URL } from "@/lib/site";
import {
  CATIFA_FAMILIES,
  MOBLE_TIPUS_HUB,
  countCatifaByFamilia,
  countMobleByTipus,
  firstCatifaImageForFamilia,
  mobleEscenaForTipus,
} from "@/lib/shop-families";

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
    openGraph: {
      type: "website",
      url,
      title: t("metaTitle"),
      description: t("metaDescription"),
    },
  };
}

// Agrupació editorial de tipus de moble per al hub:
// Un tipus pot aparèixer en múltiples grups (ex: taules de menjador i cafè
// s'agrupen com a "Taules"). Cada grup té un label-key, una foto
// representativa i un href amb ?tipus= per pre-filtrar el catàleg.
//
// Nota: els tipus que aquí es llisten han d'existir a MOBLE_TIPUS_HUB
// o a TIPUS_ORDER; si un tipus no té mobles al catàleg el comptador
// serà 0 i la card igualment es mostra (pot tenir 0 productes).
const MOBLE_GROUPS = [
  {
    key: "cadires" as const,
    tipusList: ["cadira"] as const,
    tipusParam: "cadira",
  },
  {
    key: "butaques" as const,
    tipusList: ["butaca"] as const,
    tipusParam: "butaca",
  },
  {
    key: "taules" as const,
    tipusList: ["taula-menjador", "taula-cafe", "taula-centre", "taula-auxiliar", "tauleta-nit"] as const,
    tipusParam: "taula-menjador,taula-cafe,taula-centre,taula-auxiliar,tauleta-nit",
  },
  {
    key: "aparadors" as const,
    tipusList: ["aparador", "consola", "moble"] as const,
    tipusParam: "aparador,consola,moble",
  },
  {
    key: "llits" as const,
    tipusList: ["llit"] as const,
    tipusParam: "llit",
  },
  {
    key: "sofas" as const,
    tipusList: ["sofa"] as const,
    tipusParam: "sofa",
  },
] as const;

export default async function BotigaPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("Botiga");
  const tCatifes = await getTranslations("Catifes");
  const tMobles = await getTranslations("Mobles");
  const prefix = locale === "ca" ? "" : `/${locale}`;

  // --- Famílies de catifes -----------------------------------------------
  const catifaFamilies = CATIFA_FAMILIES.map((familia) => ({
    familia,
    label: tCatifes(`families.${familia}` as Parameters<typeof tCatifes>[0]),
    count: countCatifaByFamilia(familia),
    image: firstCatifaImageForFamilia(familia),
    href: `${prefix}/catifes?familia=${familia}`,
  }));

  // --- Grups de mobles -----------------------------------------------------
  const mobleGroups = MOBLE_GROUPS.map((g) => {
    // Foto representativa: escena del primer moble del primer tipus del grup
    // que existeixi al catàleg (determinista per SSG).
    const count = g.tipusList.reduce(
      (acc, tp) => acc + countMobleByTipus(tp as Parameters<typeof countMobleByTipus>[0]),
      0,
    );
    const image = mobleEscenaForTipus(g.tipusList[0] as Parameters<typeof mobleEscenaForTipus>[0]);
    return {
      key: g.key,
      label: t(`tipusMobles.${g.key}` as Parameters<typeof t>[0]),
      count,
      image,
      href: `${prefix}/mobiliari?tipus=${g.tipusParam}`,
    };
  });

  return (
    <article>
      <section className="pt-40 md:pt-48 pb-section bg-canvas">
        <div className="max-w-layout mx-auto px-6 lg:px-12">

          {/* Hero curt */}
          <header className="mb-16 max-w-prose-editorial">
            <p className="font-sans text-eyebrow text-accent-deep uppercase mb-4">
              {t("eyebrow")}
            </p>
            <h1 className="font-serif text-display-lg text-ink mb-5 leading-snug">
              {t("headline")}
            </h1>
            <p className="font-sans text-body-lg text-ink-muted">{t("intro")}</p>
          </header>

          {/* --- Secció Catifes --- */}
          <section className="mb-16" aria-labelledby="hub-catifes-heading">
            <div className="flex items-baseline justify-between mb-6 border-b border-sand-dark/30 pb-4">
              <h2
                id="hub-catifes-heading"
                className="font-serif text-display-md text-ink"
              >
                {t("catifesTitle")}
              </h2>
              <Link
                href={`${prefix}/catifes`}
                className="font-sans text-body-sm text-accent-deep underline underline-offset-4 hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
              >
                {t("verTot")}
              </Link>
            </div>
            <ul
              className="grid grid-cols-2 sm:grid-cols-4 gap-5"
              role="list"
            >
              {catifaFamilies.map((fam, i) => (
                <li key={fam.familia}>
                  <Link
                    href={fam.href}
                    className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
                    aria-label={`${fam.label} — ${fam.count} ${t("productCountShort")}`}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-linen mb-3 p-2">
                      <Image
                        src={fam.image}
                        alt={fam.label}
                        fill
                        priority={i < 4}
                        sizes="(min-width: 640px) 25vw, 50vw"
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="font-serif text-body-md text-ink group-hover:text-accent-deep transition-colors">
                      {fam.label}
                    </p>
                    <p className="font-sans text-body-sm text-ink-muted">
                      {t("productCount", { count: fam.count })}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* --- Secció Mobiliari --- */}
          <section className="mb-16" aria-labelledby="hub-mobles-heading">
            <div className="flex items-baseline justify-between mb-6 border-b border-sand-dark/30 pb-4">
              <h2
                id="hub-mobles-heading"
                className="font-serif text-display-md text-ink"
              >
                {t("moblesTitle")}
              </h2>
              <Link
                href={`${prefix}/mobiliari`}
                className="font-sans text-body-sm text-accent-deep underline underline-offset-4 hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
              >
                {t("verTot")}
              </Link>
            </div>
            <ul
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5"
              role="list"
            >
              {mobleGroups.map((grp, i) => (
                <li key={grp.key}>
                  <Link
                    href={grp.href}
                    className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
                    aria-label={`${grp.label} — ${grp.count} ${t("productCountShort")}`}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-linen mb-3 p-2">
                      <Image
                        src={grp.image}
                        alt={grp.label}
                        fill
                        priority={i < 4}
                        sizes="(min-width: 1024px) 16.66vw, (min-width: 640px) 33vw, 50vw"
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <p className="font-serif text-body-md text-ink group-hover:text-accent-deep transition-colors">
                      {grp.label}
                    </p>
                    <p className="font-sans text-body-sm text-ink-muted">
                      {t("productCount", { count: grp.count })}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* --- Secció Decoració --- */}
          <section aria-labelledby="hub-decoracio-heading">
            <div className="flex items-baseline justify-between mb-6 border-b border-sand-dark/30 pb-4">
              <h2
                id="hub-decoracio-heading"
                className="font-serif text-display-md text-ink"
              >
                {t("decoracioTitle")}
              </h2>
              <Link
                href={`${prefix}/decoracio`}
                className="font-sans text-body-sm text-accent-deep underline underline-offset-4 hover:text-ink transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
              >
                {t("verTot")}
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
              {/* Card representativa de decoració → va directament a /decoracio */}
              <Link
                href={`${prefix}/decoracio`}
                className="group block col-span-2 sm:col-span-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
                aria-label={`${t("decoracioTitle")} — ${MANTES.length} ${t("productCountShort")}`}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-linen mb-3">
                  <Image
                    src={mantaEscena("varanasi")}
                    alt={t("decoracioTitle")}
                    fill
                    priority
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Vel */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-sans text-eyebrow text-canvas/80 uppercase mb-1">
                      {t("productCount", { count: MANTES.length })}
                    </p>
                    <p className="font-serif text-display-sm text-canvas">
                      {t("decoracioTitle")}
                    </p>
                  </div>
                </div>
                <p className="font-sans text-body-sm text-ink-muted">
                  {t("decoracioDescription")}
                </p>
              </Link>
            </div>
          </section>

        </div>
      </section>
    </article>
  );
}
