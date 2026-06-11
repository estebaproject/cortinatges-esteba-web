import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { CATIFES, catifaImage, type CatifaFamilia } from "@/lib/catifes";
import { SITE_URL } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Catifes" });
  const prefix = locale === "ca" ? "" : `/${locale}`;
  const url = `${SITE_URL}${prefix}/catifes`;
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

export default async function CatifesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("Catifes");
  const prefix = locale === "ca" ? "" : `/${locale}`;

  const familyLabel = (f: CatifaFamilia) =>
    t(`families.${f}` as Parameters<typeof t>[0]);

  const priceFmt = (pvp: number | null) =>
    pvp === null
      ? t("onDemand")
      : `${t("fromPrice")} ${pvp.toLocaleString(locale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} €`;

  // Dades estructurades: llista de productes (catifes) per a SEO local.
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("metaTitle"),
    itemListElement: CATIFES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.nom,
      url: `${SITE_URL}${prefix}/catifes/${c.slug}`,
    })),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Capçalera */}
      <section className="pt-40 md:pt-48 pb-section bg-canvas">
        <div className="max-w-layout mx-auto px-6 lg:px-12">
          <header className="mb-12 max-w-prose-editorial">
            <p className="font-sans text-eyebrow text-accent-deep uppercase mb-4">
              {t("eyebrow")}
            </p>
            <h1 className="font-serif text-display-lg text-ink mb-5 leading-snug">
              {t("headline")}
            </h1>
            <p className="font-sans text-body-lg text-ink-muted">{t("intro")}</p>
          </header>

          {/* Graella de catifes */}
          <ul
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
            role="list"
          >
            {CATIFES.map((c, i) => (
              <li key={c.slug}>
                <Link
                  href={`${prefix}/catifes/${c.slug}`}
                  className="group block"
                  aria-label={c.nom}
                >
                  <div className="relative aspect-square overflow-hidden bg-linen mb-3">
                    <Image
                      src={catifaImage(c.slug)}
                      alt={c.nom}
                      fill
                      priority={i < 4}
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-canvas/90 text-ink font-sans text-[10px] tracking-widest uppercase px-2 py-1">
                      {familyLabel(c.familia)}
                    </span>
                  </div>
                  <p className="font-serif text-body-lg text-ink group-hover:text-accent-deep transition-colors">
                    {c.nom}
                  </p>
                  <p className="font-sans text-body-sm text-ink-muted">
                    {priceFmt(c.pvpDesde)}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
