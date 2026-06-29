import type { Metadata } from "next";
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
  formatMidaLabel,
} from "@/lib/catifes-detall";
import { formatEur } from "@/lib/discount";
import CatifaPurchasePanel from "@/components/catifes/CatifaPurchasePanel";
import ProductGallery from "@/components/shop/ProductGallery";
import KaveAboutProduct, { type AboutSection } from "@/components/shop/KaveAboutProduct";
import ProductCarousel from "@/components/shop/ProductCarousel";

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
  const ts = await getTranslations("Shop");
  const tp = await getTranslations("Producte");
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
  // Fallback quan no hi ha detall: el "des de" del registre base (o "per
  // encàrrec" si tampoc en té).
  const fromPriceValue = range?.min ?? catifa.pvpDesde;
  const priceLabel =
    fromPriceValue === null
      ? t("onDemand")
      : `${t("fromPrice")} ${formatEur(fromPriceValue, locale)}`;

  // Carrusels de relacionades: "Combina'l amb" (mateixa família) i "Et pot
  // interessar" (altres famílies). Només catifes amb preu, perquè KaveProductCard
  // (via ProductCarousel) exigeix un pvp numèric; mai mostrem un preu fals.
  const combina = CATIFES.filter(
    (c) => c.slug !== slug && c.familia === catifa.familia && c.pvpDesde !== null,
  ).slice(0, 8);
  const interessar = CATIFES.filter(
    (c) => c.slug !== slug && c.familia !== catifa.familia && c.pvpDesde !== null,
  ).slice(0, 8);
  const toItem = (c: (typeof CATIFES)[number]) => ({
    href: `${prefix}/catifes/${c.slug}`,
    image: catifaEscena(c.slug),
    title: c.nom,
    subtitle: familyLabel(c.familia),
    pvp: c.pvpDesde as number,
    pvpAbans: c.pvpAbans,
    pricePrefix: t("fromPrice"),
    fit: "cover" as const,
  });

  // Bloc "Sobre el producte": bullets + seccions desplegables (slide-over).
  const aboutIntro: string[] = [
    `${familyLabel(catifa.familia)} · ${catifa.marca}`,
    ...(detall ? [detall.termini] : []),
  ];
  const aboutSections: AboutSection[] = [
    detall && detall.mides.length > 0 && {
      id: "dimensions",
      title: ts("accDimensions"),
      rows: [
        {
          label: t("measuresAvailable"),
          value: detall.mides.map((m) => formatMidaLabel(m.mida)).join(" · "),
        },
      ],
    },
    detall && {
      id: "delivery",
      title: ts("accDelivery"),
      rows: [{ label: tp("deliveryTime"), value: detall.termini }],
    },
    {
      id: "more",
      title: ts("accMoreDetails"),
      rows: [
        { label: ts("category"), value: familyLabel(catifa.familia) },
        { label: t("madeBy"), value: catifa.marca },
      ],
    },
  ].filter(Boolean) as AboutSection[];

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
    <article className="bg-kave-bg font-grotesque text-kave-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <section className="pt-32 md:pt-36 pb-16 lg:pb-24">
        <div className="max-w-layout mx-auto px-5 lg:px-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-kave-muted mb-8" aria-label="Breadcrumb">
            <Link href={`${prefix}/botiga`} className="hover:text-kave-ink transition-colors">
              {ts("navBotiga")}
            </Link>
            <span aria-hidden>/</span>
            <Link href={`${prefix}/catifes`} className="hover:text-kave-ink transition-colors">
              {ts("navCatifes")}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-kave-ink">{catifa.nom}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-14 items-start">
            {/* Galeria de producte (escena + producte + detall). Gestiona els
                seus propis fons; la composem dins de la columna esquerra. */}
            <ProductGallery slides={slides} thumbsLabel={tGallery("thumbsLabel")} />

            {/* Columna dreta */}
            <div className="lg:sticky lg:top-32 self-start">
              <p className="text-sm text-kave-muted mb-2">{familyLabel(catifa.familia)}</p>
              <h1 className="font-display text-3xl md:text-4xl text-kave-ink mb-6 leading-tight">
                {catifa.nom}
              </h1>

              {/* Compra directa: selector de mesura + PVP per mesura (amb rebaixa
                  real si la mesura té pvpAbans) + termini d'entrega (requisit
                  legal, visible ABANS de comprar) + badge "Per encàrrec" + afegir
                  a la cistella. Nomes si tenim detall comercial amb mesures. */}
              {detall && detall.mides.length > 0 ? (
                <CatifaPurchasePanel
                  slug={catifa.slug}
                  nom={catifa.nom}
                  mides={detall.mides}
                  termini={detall.termini}
                  perEncarrec={detall.perEncarrec}
                  image={productImage}
                  href={`/catifes/${catifa.slug}`}
                />
              ) : (
                <div>
                  <p className="text-3xl font-semibold text-kave-ink mb-6">{priceLabel}</p>
                  <Link
                    href={`${prefix}/demana-pressupost`}
                    className="inline-flex items-center justify-center px-8 py-3.5 bg-kave-ink text-white text-sm font-semibold hover:bg-kave-ink/90 transition-colors"
                  >
                    {t("requestBudget")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sobre el producte (banda verd sàlvia + acordeó/slide-over) */}
      <KaveAboutProduct intro={aboutIntro} sections={aboutSections} />

      {/* Carrusels de relacionades */}
      <div className="max-w-layout mx-auto px-5 lg:px-10 py-16 lg:py-24 space-y-16">
        <ProductCarousel title={ts("combineWith")} items={combina.map(toItem)} />
        <ProductCarousel title={ts("youMayLike")} items={interessar.map(toItem)} />
      </div>
    </article>
  );
}
