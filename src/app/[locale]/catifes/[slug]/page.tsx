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
import AddToCartButton from "@/components/cart/AddToCartButton";
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

  const priceLabel =
    catifa.pvpDesde === null
      ? t("onDemand")
      : `${t("fromPrice")} ${catifa.pvpDesde.toLocaleString(locale, {
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
    ...(catifa.pvpDesde !== null
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
              <p className="font-sans text-eyebrow text-accent-deep uppercase mb-4">
                {familyLabel(catifa.familia)}
              </p>
              <h1 className="font-serif text-display-lg text-ink mb-4">{catifa.nom}</h1>
              <p className="font-serif text-display-md text-ink mb-8">{priceLabel}</p>

              <dl className="border-t border-linen divide-y divide-linen mb-8">
                <div className="flex justify-between py-4">
                  <dt className="font-sans text-body-sm text-ink-muted uppercase tracking-widest">
                    {t("family")}
                  </dt>
                  <dd className="font-sans text-body-md text-ink">
                    {familyLabel(catifa.familia)}
                  </dd>
                </div>
                {catifa.nMedides > 0 && (
                  <div className="flex justify-between py-4">
                    <dt className="font-sans text-body-sm text-ink-muted uppercase tracking-widest">
                      {t("measuresAvailable")}
                    </dt>
                    <dd className="font-sans text-body-md text-ink">{measuresLabel}</dd>
                  </div>
                )}
                <div className="flex justify-between py-4">
                  <dt className="font-sans text-body-sm text-ink-muted uppercase tracking-widest">
                    {t("madeBy")}
                  </dt>
                  <dd className="font-serif text-body-md text-ink-faint italic">
                    {catifa.marca}
                  </dd>
                </div>
              </dl>

              {/* Compra directa (només si té PVP). Botó client que afegeix al cistell. */}
              {catifa.pvpDesde !== null && (
                <div className="mb-6">
                  <AddToCartButton
                    slug={catifa.slug}
                    href={`/catifes/${catifa.slug}`}
                    nom={catifa.nom}
                    pvp={catifa.pvpDesde}
                    image={productImage}
                  />
                </div>
              )}

              <div className="border border-linen p-8 bg-canvas-warm">
                <p className="font-serif text-display-md text-ink mb-3">
                  {t("ctaBlockHeadline")}
                </p>
                <p className="font-sans text-body-sm text-ink-muted mb-6">
                  {t("ctaBlockBody")}
                </p>
                <Link
                  href={`${prefix}/demana-pressupost`}
                  className="flex items-center justify-center w-full px-6 py-4 bg-ink text-canvas font-sans text-body-md font-semibold hover:bg-accent-deep transition-colors"
                >
                  {t("requestBudget")}
                </Link>
              </div>
            </div>
          </div>

          {/* Catifes relacionades */}
          {related.length > 0 && (
            <section className="mt-section border-t border-linen pt-section">
              <div className="flex items-end justify-between mb-10">
                <h2 className="font-serif text-display-md text-ink">{t("eyebrow")}</h2>
                <Link
                  href={`${prefix}/catifes`}
                  className="font-sans text-body-sm text-accent-deep font-medium hover:text-ink transition-colors"
                >
                  {t("backToCatifes")}
                </Link>
              </div>
              <ul className="grid grid-cols-2 lg:grid-cols-4 gap-6" role="list">
                {related.map((c) => (
                  <li key={c.slug}>
                    <Link
                      href={`${prefix}/catifes/${c.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-square overflow-hidden bg-linen mb-3">
                        <Image
                          src={catifaImage(c.slug)}
                          alt={c.nom}
                          fill
                          sizes="(min-width: 1024px) 25vw, 50vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <p className="font-serif text-body-lg text-ink group-hover:text-accent-deep transition-colors">
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
