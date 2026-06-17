import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/lib/site";
import {
  MOBLE_CAT_HUB,
  countMobleByCategoria,
  moblePhotoForCategoria,
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

// Categories de moble per al hub. Una card per categoria real del catàleg
// (cadira, butaca, pouf, moble). El href pre-filtra el catàleg amb ?cat=.
// MOBLE_CAT_HUB és la font única de l'ordre i les categories.

export default async function BotigaPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("Botiga");
  const tMobles = await getTranslations("Mobiliari");
  const prefix = locale === "ca" ? "" : `/${locale}`;

  // --- Categories de mobles ------------------------------------------------
  const mobleGroups = MOBLE_CAT_HUB.map((cat) => ({
    key: cat,
    label: tMobles(`tipus.${cat}` as Parameters<typeof tMobles>[0]),
    count: countMobleByCategoria(cat),
    image: moblePhotoForCategoria(cat),
    href: `${prefix}/mobiliari?cat=${cat}`,
  }));

  return (
    <article>
      <section className="pt-40 md:pt-48 pb-section bg-canvas">
        <div className="max-w-layout mx-auto px-6 lg:px-12">

          {/* Hero curt — llenguatge minimalista, alineat amb /mobiliari */}
          <header className="mb-14 max-w-prose-editorial">
            <p className="font-sans text-body-sm text-ink-muted mb-3">
              {t("eyebrow")}
            </p>
            <h1 className="font-serif text-display-md text-ink mb-4 leading-tight">
              {t("headline")}
            </h1>
            <p className="font-sans text-body-md text-ink-muted">{t("intro")}</p>
          </header>

          {/* --- Secció Mobiliari --- */}
          <section aria-labelledby="hub-mobles-heading">
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
                    <div className="relative aspect-[4/5] overflow-hidden bg-canvas-warm mb-3 p-5">
                      <Image
                        src={grp.image}
                        alt={grp.label}
                        fill
                        priority={i < 4}
                        sizes="(min-width: 1024px) 16.66vw, (min-width: 640px) 33vw, 50vw"
                        className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                    <p className="font-sans text-body-md font-medium text-ink group-hover:text-accent-deep transition-colors">
                      {grp.label}
                    </p>
                    <p className="font-sans text-body-sm text-ink-muted mt-0.5">
                      {t("productCount", { count: grp.count })}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

        </div>
      </section>
    </article>
  );
}
