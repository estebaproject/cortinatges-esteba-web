import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import {
  CATIFES,
  CATIFA_SLUGS,
  getCatifa,
  catifaImage,
  catifaEscena,
  catifaProducto,
  catifaSlides,
  type CatifaFamilia,
} from "@/lib/catifes";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import {
  getCatifaDetall,
  catifaPriceRange,
} from "@/lib/catifes-detall";
import CatifaPurchasePanel from "@/components/catifes/CatifaPurchasePanel";
import ProductGallery from "@/components/shop/ProductGallery";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return CATIFA_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const catifa = getCatifa(slug);
  if (!catifa) return {};
  const t = await getTranslations({ locale, namespace: "Catifes" });
  const prefix = locale === "ca" ? "" : `/${locale}`;
  const url = `${SITE_URL}${prefix}/catifes/${slug}`;
  // ADR-7: OG usa imatge de producte quan existeix, fallback escena.
  const ogImage = catifaProducto(slug) ?? catifaImage(slug);
  const familyLabel = t(`families.${catifa.familia}` as Parameters<typeof t>[0]);
  const description = `${catifa.nom} — ${familyLabel}. ${t("madeBy")} ${t("madeByBrand")}. ${
    catifa.pvpDesde !== null
      ? `${t("fromPrice")} ${catifa.pvpDesde} €.`
      : t("onDemand")
  }`;
  return {
    title: `${catifa.nom} — ${t("eyebrow")}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title: `${catifa.nom} — ${t("eyebrow")}`,
      description,
      images: [{ url: ogImage, width: 1200, height: 1200, alt: catifa.nom }],
    },
  };
}

export default async function CatifaPage({ params }: Props) {
  const { slug } = await params;
  const catifa = getCatifa(slug);
  if (!catifa) notFound();

  const t = await getTranslations("Catifes");
  const locale = await getLocale();
  const prefix = locale === "ca" ? "" : `/${locale}`;

  const familyLabel = (f: CatifaFamilia) =>
    t(`families.${f}` as Parameters<typeof t>[0]);

  // Imatge per al JSON-LD Product.image i add-to-cart: producte si existeix.
  const productImage = catifaProducto(slug) ?? catifaEscena(slug);
  // Slides per a la galeria: escena + producte + detall (omets inexistents).
  const tGallery = await getTranslations("Gallery");
  const slides = catifaSlides(slug, catifa.nom);

  // Detall comercial (mesures + PVP per mesura + termini). Font de la fitxa
  // vendible. Si no hi ha detall (no hauria de passar per a les live), caiem
  // amb elegancia al "des de" antic.
  const detall = getCatifaDetall(slug);
  const range = detall ? catifaPriceRange(detall) : null;

  // El preu "des de" ara surt del rang real de mesures (no del pvpDesde antic).
  const fromPriceValue = range?.min ?? catifa.pvpDesde;
  const priceLabel =
    fromPriceValue === null
      ? t("onDemand")
      : `${t("fromPrice")} ${fromPriceValue.toLocaleString(locale, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} €`;
  const measuresLabel =
    catifa.nMedides === 1 ? t("measuresOne", { count: 1 }) : t("measuresOther", { count: catifa.nMedides });

  const others = CATIFES.filter(
    (c) => c.slug !== slug && c.familia === catifa.familia,
  ).slice(0, 4);
  const fallbackOthers = CATIFES.filter((c) => c.slug !== slug).slice(0, 4);
  const related = others.length > 0 ? others : fallbackOthers;

  const canonicalUrl = `${SITE_URL}${prefix}/catifes/${slug}`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: catifa.nom,
    image: `${SITE_URL}${productImage}`,
    category: "Catifes a mida",
    brand: { "@type": "Brand", name: catifa.marca },
    manufacturer: { "@type": "Organization", name: catifa.marca },
    // offers: rang real de preus de totes les mesures (AggregateOffer) quan
    // tenim detall; fallback a Offer simple amb pvpDesde si no.
    ...(range
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "EUR",
            lowPrice: range.min,
            highPrice: range.max,
            offerCount: detall ? detall.mides.length : undefined,
            url: canonicalUrl,
            availability: detall?.perEncarrec
              ? "https://schema.org/MadeToOrder"
              : "https://schema.org/InStock",
            seller: { "@type": "Organization", name: SITE_NAME },
          },
        }
      : catifa.pvpDesde !== null
        ? {
            offers: {
              "@type": "Offer",
              priceCurrency: "EUR",
              price: catifa.pvpDesde,
              url: canonicalUrl,
              availability: "https://schema.org/MadeToOrder",
              seller: { "@type": "Organization", name: SITE_NAME },
            },
          }
        : {}),
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: `${SITE_URL}${prefix || "/"}` },
      { "@type": "ListItem", position: 2, name: t("eyebrow"), item: `${SITE_URL}${prefix}/catifes` },
      { "@type": "ListItem", position: 3, name: catifa.nom, item: canonicalUrl },
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
            <Link href={`${prefix}/catifes`} className="hover:text-ink transition-colors">
              {t("eyebrow")}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{catifa.nom}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Galeria de producte: escena + producte + detall */}
            <ProductGallery
              slides={slides}
              thumbsLabel={tGallery("thumbsLabel")}
            />

            {/* Informació */}
            <div className="lg:sticky lg:top-28 self-start">
              <p className="font-sans text-body-sm text-ink-faint mb-3">
                {familyLabel(catifa.familia)}
              </p>
              <h1 className="font-serif text-display-md text-ink mb-3 leading-tight">
                {catifa.nom}
              </h1>
              <p className="font-sans text-body-lg text-ink mb-10">{priceLabel}</p>

              <dl className="divide-y divide-sand-dark/25 border-t border-b border-sand-dark/25 mb-10">
                <div className="flex justify-between gap-6 py-3.5">
                  <dt className="font-sans text-body-sm text-ink-muted">
                    {t("madeBy")}
                  </dt>
                  <dd className="font-sans text-body-sm text-ink">{catifa.marca}</dd>
                </div>
              </dl>

              {/* Compra directa: selector de mesura + PVP per mesura + termini
                  d'entrega (requisit legal, visible abans de comprar) + badge
                  "Per encarrec" + afegir a la cistella. Nomes si tenim detall
                  comercial amb mesures. */}
              {detall && detall.mides.length > 0 ? (
                <div className="mb-8">
                  <CatifaPurchasePanel
                    slug={catifa.slug}
                    nom={catifa.nom}
                    mides={detall.mides}
                    termini={detall.termini}
                    perEncarrec={detall.perEncarrec}
                    image={productImage}
                    href={`/catifes/${catifa.slug}`}
                  />
                </div>
              ) : (
                catifa.nMedides > 0 && (
                  <p className="mb-8 font-sans text-body-sm text-ink-muted">
                    {measuresLabel}
                  </p>
                )
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

          {/* Catifes relacionades */}
          {related.length > 0 && (
            <section className="mt-section border-t border-sand-dark/25 pt-section">
              <div className="flex items-end justify-between mb-10">
                <h2 className="font-serif text-display-md text-ink">{t("eyebrow")}</h2>
                <Link
                  href={`${prefix}/catifes`}
                  className="font-sans text-body-sm text-accent-deep font-medium hover:text-ink transition-colors"
                >
                  {t("backToCatifes")}
                </Link>
              </div>
              <ul className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-10" role="list">
                {related.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`${prefix}/catifes/${c.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-canvas-warm mb-3">
                        <Image
                          src={catifaEscena(c.slug)}
                          alt={c.nom}
                          fill
                          sizes="(min-width: 1024px) 25vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                      <p className="font-sans text-body-md font-medium text-ink group-hover:text-accent-deep transition-colors">
                        {c.nom}
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
