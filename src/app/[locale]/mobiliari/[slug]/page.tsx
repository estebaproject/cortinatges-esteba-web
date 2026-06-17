import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import {
  MOBLES,
  MOBLE_SLUGS,
  getMoble,
  mobleImage,
  type MobleCat,
} from "@/lib/mobiliari";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import {
  getMobleDetall,
  moblefPriceRange,
} from "@/lib/mobiliari-detall";
import { getMobleSpec, type SpecLocale } from "@/lib/mobiliari-specs";
import MoblePurchasePanel from "@/components/mobiliari/MoblePurchasePanel";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return MOBLE_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const moble = getMoble(slug);
  if (!moble) return {};
  const t = await getTranslations({ locale, namespace: "Mobiliari" });
  const prefix = locale === "ca" ? "" : `/${locale}`;
  const url = `${SITE_URL}${prefix}/mobiliari/${slug}`;
  const image = mobleImage(slug);
  const catLabel = t(`tipus.${moble.cat}` as Parameters<typeof t>[0]);
  const description = `${moble.nom} — ${catLabel}. ${t("madeBy")} ${t("madeByBrand")}. ${t("fromPrice")} ${moble.pvp} €.`;
  return {
    title: `${moble.nom} — ${t("eyebrow")}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${moble.nom} — ${t("eyebrow")}`,
      description,
      images: [{ url: image, width: 1200, height: 1200, alt: moble.nom }],
    },
  };
}

export default async function MoblePage({ params }: Props) {
  const { slug } = await params;
  const moble = getMoble(slug);
  if (!moble) notFound();

  const t = await getTranslations("Mobiliari");
  const locale = await getLocale();
  const prefix = locale === "ca" ? "" : `/${locale}`;

  const catLabel = (c: MobleCat) =>
    t(`tipus.${c}` as Parameters<typeof t>[0]);

  const image = mobleImage(slug);

  // Detall comercial (variants + PVP per variant + termini). Font de la fitxa
  // vendible. Si no hi ha detall (1 moble de 44: "arles-butaca"), caiem amb
  // elegancia al "des de" del registre base + CTA de pressupost.
  const detall = getMobleDetall(slug);
  const range = detall ? moblefPriceRange(detall) : null;

  // Especificacions tecniques (dimensions + material + acabats). Nomes info
  // publica del producte, mai cap cost. 42 mobles de 44 en tenen; els 2 sense
  // ("scandinave-ii", "mosa") retornen undefined i amaguem el bloc del tot.
  const spec = getMobleSpec(slug);
  // El text de material ja ve traduit als 4 idiomes; triem el de la pagina amb
  // fallback a "es" si l'idioma actual no fos un dels suportats.
  const materialText = spec
    ? spec.material[locale as SpecLocale] ?? spec.material.es
    : null;

  // El preu "des de" surt del rang real de variants quan tenim detall; si no,
  // del pvp base del registre.
  const fromPriceValue = range?.min ?? moble.pvp;
  const priceLabel = `${t("fromPrice")} ${fromPriceValue.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;

  const others = MOBLES.filter(
    (m) => m.slug !== slug && m.cat === moble.cat,
  ).slice(0, 4);
  const fallbackOthers = MOBLES.filter((m) => m.slug !== slug).slice(0, 4);
  const related = others.length > 0 ? others : fallbackOthers;

  const canonicalUrl = `${SITE_URL}${prefix}/mobiliari/${slug}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: moble.nom,
    image: `${SITE_URL}${image}`,
    category: "Mobiliari",
    brand: { "@type": "Brand", name: moble.marca },
    manufacturer: { "@type": "Organization", name: moble.marca },
    // offers: rang real de preus de totes les variants (AggregateOffer) quan
    // tenim detall; fallback a Offer simple amb el pvp base si no.
    ...(range
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "EUR",
            lowPrice: range.min,
            highPrice: range.max,
            offerCount: detall ? detall.variants.length : undefined,
            url: canonicalUrl,
            availability: "https://schema.org/MadeToOrder",
            seller: { "@type": "Organization", name: SITE_NAME },
          },
        }
      : {
          offers: {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: moble.pvp,
            url: canonicalUrl,
            availability: "https://schema.org/MadeToOrder",
            seller: { "@type": "Organization", name: SITE_NAME },
          },
        }),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}${prefix || "/"}` },
      { "@type": "ListItem", position: 2, name: t("eyebrow"), item: `${SITE_URL}${prefix}/mobiliari` },
      { "@type": "ListItem", position: 3, name: moble.nom, item: canonicalUrl },
    ],
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="pt-40 md:pt-48 pb-section bg-canvas">
        <div className="max-w-layout mx-auto px-6 lg:px-12">
          {/* Breadcrumb */}
          <nav
            className="flex items-center gap-2 font-sans text-body-sm text-ink-muted mb-8"
            aria-label="Breadcrumb"
          >
            <Link href={prefix || "/"} className="hover:text-ink transition-colors">
              {SITE_NAME}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={`${prefix}/mobiliari`} className="hover:text-ink transition-colors">
              {t("eyebrow")}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{moble.nom}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Foto gran: object-contain sobre bg-canvas-warm perquè el moble es
                vegi sencer (proporcions molt variables), sense retall ni
                deformació. */}
            <div className="relative aspect-[4/5] overflow-hidden bg-canvas-warm p-8 lg:p-10">
              <Image
                src={image}
                alt={moble.nom}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain"
              />
            </div>

            {/* Informació */}
            <div className="lg:sticky lg:top-28 self-start">
              <p className="font-sans text-body-sm text-ink-faint mb-3">
                {catLabel(moble.cat)}
              </p>
              <h1 className="font-serif text-display-md text-ink mb-3 leading-tight">
                {moble.nom}
              </h1>
              <p className="font-sans text-body-lg text-ink mb-10">{priceLabel}</p>

              <dl className="divide-y divide-sand-dark/25 border-t border-b border-sand-dark/25 mb-10">
                <div className="flex justify-between gap-6 py-3.5">
                  <dt className="font-sans text-body-sm text-ink-muted">
                    {t("typeLabel")}
                  </dt>
                  <dd className="font-sans text-body-sm text-ink">
                    {catLabel(moble.cat)}
                  </dd>
                </div>
                <div className="flex justify-between gap-6 py-3.5">
                  <dt className="font-sans text-body-sm text-ink-muted">
                    {t("madeBy")}
                  </dt>
                  <dd className="font-sans text-body-sm text-ink">{moble.marca}</dd>
                </div>
              </dl>

              {/* Compra directa: selector de variant + PVP per variant + termini
                  d'entrega (requisit legal, visible abans de comprar) + afegir a
                  la cistella. Nomes si tenim detall comercial amb variants. */}
              {detall && detall.variants.length > 0 && (
                <div className="mb-8">
                  <MoblePurchasePanel
                    slug={moble.slug}
                    nom={moble.nom}
                    variants={detall.variants}
                    termini={detall.termini}
                    image={image}
                    href={`/mobiliari/${moble.slug}`}
                  />
                </div>
              )}

              {/* Especificacions tecniques. Nomes si en tenim dades; si no
                  (scandinave-ii, mosa) el bloc no es renderitza i la fitxa
                  degrada netament. Look minimalista: <dl> amb hairlines,
                  coherent amb el bloc de tipus/marca de dalt. Mai mostra cost. */}
              {spec && (
                <div className="mb-10">
                  <p className="font-sans text-body-sm text-ink-faint mb-4">
                    {t("specsTitle")}
                  </p>
                  <dl className="divide-y divide-sand-dark/25 border-t border-b border-sand-dark/25">
                    <div className="flex justify-between gap-6 py-3.5">
                      <dt className="font-sans text-body-sm text-ink-muted shrink-0">
                        {t("dimensionsLabel")}
                      </dt>
                      <dd className="font-sans text-body-sm text-ink text-right">
                        {spec.dimensions}
                      </dd>
                    </div>
                    {materialText && (
                      <div className="flex justify-between gap-6 py-3.5">
                        <dt className="font-sans text-body-sm text-ink-muted shrink-0">
                          {t("materialLabel")}
                        </dt>
                        <dd className="font-sans text-body-sm text-ink text-right max-w-prose-editorial">
                          {materialText}
                        </dd>
                      </div>
                    )}
                    {spec.finishes.length > 0 && (
                      <div className="flex justify-between gap-6 py-3.5">
                        <dt className="font-sans text-body-sm text-ink-muted shrink-0">
                          {t("finishesLabel")}
                        </dt>
                        <dd className="font-sans text-body-sm text-ink text-right">
                          {spec.finishes.join(" · ")}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              )}

              <div className="pt-8 border-t border-sand-dark/25">
                <p className="font-serif text-display-md text-ink mb-2 leading-tight">
                  {t("ctaBlockHeadline")}
                </p>
                <p className="font-sans text-body-sm text-ink-muted mb-6 max-w-prose-editorial">
                  {t("ctaBlockBody")}
                </p>
                <Link
                  href={`${prefix}/demana-pressupost`}
                  className="inline-flex items-center justify-center px-8 py-4 bg-ink text-canvas font-sans text-body-md font-medium hover:bg-accent-deep transition-colors"
                >
                  {t("requestBudget")}
                </Link>
              </div>
            </div>
          </div>

          {/* Mobles relacionats */}
          {related.length > 0 && (
            <section className="mt-section border-t border-sand-dark/25 pt-section">
              <div className="flex items-end justify-between mb-10">
                <h2 className="font-serif text-display-md text-ink">{t("eyebrow")}</h2>
                <Link
                  href={`${prefix}/mobiliari`}
                  className="font-sans text-body-sm text-accent-deep font-medium hover:text-ink transition-colors"
                >
                  {t("backToMobles")}
                </Link>
              </div>
              <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10" role="list">
                {related.map((m) => (
                  <li key={m.slug}>
                    <Link
                      href={`${prefix}/mobiliari/${m.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-canvas-warm mb-3 p-5">
                        <Image
                          src={mobleImage(m.slug)}
                          alt={m.nom}
                          fill
                          sizes="(min-width: 1024px) 25vw, 50vw"
                          className="object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <p className="font-sans text-body-md font-medium text-ink group-hover:text-accent-deep transition-colors">
                        {m.nom}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </section>
    </article>
  );
}
