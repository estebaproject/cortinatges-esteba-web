import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import {
  HIDDEN_CATIFA_FAMILIES,
  catifaEscena,
  type Catifa,
  type CatifaFamilia,
} from "@/lib/catifes";
import {
  getVisibleCatifes,
  getVisibleCatifaSlugs,
  getCatifaBySlug,
  getCatifaImages,
  getCatifaDetallSource,
} from "@/lib/catifes-source";
import { SITE_URL, SITE_NAME, localizedAlternates } from "@/lib/site";
import {
  catifaPriceRange,
  formatMidaLabel,
} from "@/lib/catifes-detall";
import { formatEur } from "@/lib/discount";
import { productSku } from "@/lib/sku";
import CatifaBuyBlock from "@/components/catifes/CatifaBuyBlock";
import { getCatifaColors } from "@/lib/catifes-colors";
import KaveAboutProduct, { type AboutSection } from "@/components/shop/KaveAboutProduct";
import ProductCarousel from "@/components/shop/ProductCarousel";

// ISR: revalida cada hora perquè els canvis de la BD (ERP) es propaguin sense
// redeploy. La revalidació immediata la dispara /api/revalidate en "Publicar".
export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getVisibleCatifaSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const catifa = await getCatifaBySlug(slug);
  if (!catifa) return {};
  const t = await getTranslations({ locale, namespace: "Catifes" });
  const prefix = locale === "ca" ? "" : `/${locale}`;
  const url = `${SITE_URL}${prefix}/catifes/${slug}`;
  // ADR-7: OG usa imatge de producte quan existeix, fallback escena.
  const { productImage: ogImage } = await getCatifaImages(slug, catifa.nom);
  const familyLabel = t(`families.${catifa.familia}` as Parameters<typeof t>[0]);
  const description = `${catifa.nom} — ${familyLabel}. ${t("madeBy")} ${t("madeByBrand")}. ${
    catifa.pvpDesde !== null
      ? `${t("fromPrice")} ${catifa.pvpDesde} €.`
      : t("onDemand")
  }`;
  return {
    title: `${catifa.nom} — ${t("eyebrow")}`,
    description,
    alternates: localizedAlternates(locale, "catifes", slug),
    openGraph: {
      type: "website",
      url,
      title: `${catifa.nom} — ${t("eyebrow")}`,
      description,
      images: [{ url: ogImage, width: 1200, height: 1200, alt: catifa.nom }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${catifa.nom} — ${t("eyebrow")}`,
      description,
      images: [ogImage],
    },
  };
}

export default async function CatifaPage({ params }: Props) {
  const { slug } = await params;
  const catifa = await getCatifaBySlug(slug);
  if (!catifa) notFound();
  if (HIDDEN_CATIFA_FAMILIES.has(catifa.familia)) notFound();

  const t = await getTranslations("Catifes");
  const ts = await getTranslations("Shop");
  const tp = await getTranslations("Producte");
  const locale = await getLocale();
  const prefix = locale === "ca" ? "" : `/${locale}`;

  const familyLabel = (f: CatifaFamilia) =>
    t(`families.${f}` as Parameters<typeof t>[0]);

  // Galeria + imatge de producte (DB-first amb fallback estàtic). productImage
  // (producto ?? escena) alimenta el JSON-LD Product.image i l'add-to-cart;
  // slides = escena + producte + detall (omet inexistents).
  const tGallery = await getTranslations("Gallery");
  const { slides, productImage } = await getCatifaImages(slug, catifa.nom);

  // Detall comercial (mesures + PVP per mesura + termini). Font de la fitxa
  // vendible. Si no hi ha detall (no hauria de passar per a les live), caiem
  // amb elegancia al "des de" antic.
  const detall = await getCatifaDetallSource(slug);
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
  const visibleCatifes = await getVisibleCatifes();
  const combina = visibleCatifes.filter(
    (c) => c.slug !== slug && c.familia === catifa.familia && c.pvpDesde !== null,
  ).slice(0, 8);
  const interessar = visibleCatifes.filter(
    (c) => c.slug !== slug && c.familia !== catifa.familia && c.pvpDesde !== null,
  ).slice(0, 8);
  const toItem = (c: Catifa) => ({
    href: `${prefix}/catifes/${c.slug}`,
    image: catifaEscena(c.slug),
    title: c.nom,
    subtitle: familyLabel(c.familia),
    pvp: c.pvpDesde as number,
    pvpAbans: c.pvpAbans,
    pricePrefix: t("fromPrice"),
    fit: "cover" as const,
  });

  // SKU propi DERIVAT (no desat): prefix de catàleg + slug. Vegeu src/lib/sku.ts.
  const sku = productSku("catifa", slug);

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
        { label: ts("reference"), value: sku },
      ],
    },
  ].filter(Boolean) as AboutSection[];

  const canonicalUrl = `${SITE_URL}${prefix}/catifes/${slug}`;

  // Mateixa descripció que generateMetadata (reusada al JSON-LD Product).
  const schemaDescription = `${catifa.nom} — ${familyLabel(catifa.familia)}. ${t("madeBy")} ${t("madeByBrand")}. ${
    catifa.pvpDesde !== null
      ? `${t("fromPrice")} ${catifa.pvpDesde} €.`
      : t("onDemand")
  }`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: catifa.nom,
    description: schemaDescription,
    image: `${SITE_URL}${productImage}`,
    category: "Catifes a mida",
    sku,
    // mpn = referència del proveïdor quan existeixi (de moment buida).
    ...(catifa.supplierRef ? { mpn: catifa.supplierRef } : {}),
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

          <CatifaBuyBlock
            slug={catifa.slug}
            nom={catifa.nom}
            familyLabel={familyLabel(catifa.familia)}
            colors={getCatifaColors(catifa.slug)}
            slides={slides}
            thumbsLabel={tGallery("thumbsLabel")}
            mides={detall?.mides ?? []}
            termini={detall?.termini ?? null}
            perEncarrec={detall?.perEncarrec ?? false}
            productImage={productImage}
            href={`/catifes/${catifa.slug}`}
            priceLabel={priceLabel}
            budgetHref={`${prefix}/demana-pressupost`}
            requestBudget={t("requestBudget")}
          />
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
