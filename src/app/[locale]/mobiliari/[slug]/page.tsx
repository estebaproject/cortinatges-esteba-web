import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import {
  mobleImage,
  mobleImgFit,
  type Moble,
  type MobleCat,
} from "@/lib/mobiliari";
import { SITE_URL, SITE_NAME, localizedAlternates } from "@/lib/site";
import { moblefPriceRange } from "@/lib/mobiliari-detall";
import { type SpecLocale } from "@/lib/mobiliari-specs";
import { getMobleColors } from "@/lib/mobiliari-colors";
import {
  getMobles,
  getVisibleMobleSlugs,
  getMobleBySlug,
  getMobleDetallSource,
  getMobleSpecSource,
  getMobleColorsSource,
  getMobleHeroImage,
} from "@/lib/mobiliari-source";
import { productSku } from "@/lib/sku";
import MobleBuyBlock from "@/components/mobiliari/MobleBuyBlock";
import KaveAboutProduct, { type AboutSection } from "@/components/shop/KaveAboutProduct";
import ProductCarousel from "@/components/shop/ProductCarousel";

// ISR: revalida cada hora perquè els canvis de la BD (ERP) es propaguin sense
// redeploy. La revalidació immediata la dispara /api/revalidate en "Publicar".
export const revalidate = 3600;

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await getVisibleMobleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const moble = await getMobleBySlug(slug);
  if (!moble) return {};
  const t = await getTranslations({ locale, namespace: "Mobiliari" });
  const prefix = locale === "ca" ? "" : `/${locale}`;
  const url = `${SITE_URL}${prefix}/mobiliari/${slug}`;
  const image = await getMobleHeroImage(slug);
  const catLabel = t(`tipus.${moble.cat}` as Parameters<typeof t>[0]);
  const description = `${moble.nom} — ${catLabel}. ${t("madeBy")} ${t("madeByBrand")}. ${t("fromPrice")} ${moble.pvp} €.`;
  return {
    title: `${moble.nom} — ${t("eyebrow")}`,
    description,
    alternates: localizedAlternates(locale, "mobiliari", slug),
    openGraph: {
      type: "website",
      url,
      title: `${moble.nom} — ${t("eyebrow")}`,
      description,
      images: [{ url: image, width: 1200, height: 1200, alt: moble.nom }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${moble.nom} — ${t("eyebrow")}`,
      description,
      images: [image],
    },
  };
}

export default async function MoblePage({ params }: Props) {
  const { slug } = await params;
  const moble = await getMobleBySlug(slug);
  if (!moble) notFound();

  const t = await getTranslations("Mobiliari");
  const ts = await getTranslations("Shop");
  const tp = await getTranslations("Producte");
  const locale = await getLocale();
  const prefix = locale === "ca" ? "" : `/${locale}`;

  const catLabel = (c: MobleCat) =>
    t(`tipus.${c}` as Parameters<typeof t>[0]);

  // Foto hero (DB-first amb fallback estàtic). Alimenta la foto per defecte del
  // bloc de compra, l'OG i el JSON-LD Product.image.
  const image = await getMobleHeroImage(slug);

  // Detall comercial (variants + PVP per variant + termini). DB-first amb
  // fallback estàtic. Si no hi ha detall, caiem amb elegancia al "des de" del
  // registre base + CTA de pressupost.
  const detall = await getMobleDetallSource(slug);
  const range = detall ? moblefPriceRange(detall) : null;

  // Especificacions tecniques (dimensions + material + acabats). DB-first amb
  // fallback estàtic. Nomes info publica del producte, mai cap cost. Els mobles
  // sense dades ("scandinave-ii", "mosa") retornen undefined i amaguem el bloc.
  const spec = await getMobleSpecSource(slug);
  // El text de material ja ve traduit als 4 idiomes; triem el de la pagina amb
  // fallback a "es" si l'idioma actual no fos un dels suportats.
  const materialText = spec
    ? spec.material[locale as SpecLocale] ?? spec.material.es
    : null;

  // Variants de color amb foto (buit si el moble no en té). DB-first amb
  // fallback estàtic. Alimenta el selector de color del bloc superior (client
  // component), que canvia la foto principal i afegeix l'acabat a la cistella.
  const colors = await getMobleColorsSource(slug);

  // Productes per als carrusels: "Combina'l amb" (mateixa categoria) i
  // "Et pot interessar" (la resta). Llista DB-first amb fallback estàtic; les
  // fotos/colors de les cards són helpers estàtics deterministes (cosmètics).
  const mobles = await getMobles();
  const combina = mobles.filter((m) => m.slug !== slug && m.cat === moble.cat).slice(0, 8);
  const interessar = mobles.filter((m) => m.slug !== slug && m.cat !== moble.cat).slice(0, 8);
  const toItem = (m: Moble) => ({
    href: `${prefix}/mobiliari/${m.slug}`,
    image: mobleImage(m.slug),
    title: m.nom,
    subtitle: catLabel(m.cat),
    pvp: m.pvp,
    pvpAbans: m.pvpAbans,
    pricePrefix: m.cat === "moble" ? t("fromPrice") : undefined,
    fit: mobleImgFit(m.slug),
    colors: getMobleColors(m.slug).map((c) => c.image),
  });

  // object-fit de la foto principal (cover per a escenes; contain per a retalls).
  const imgFit = mobleImgFit(moble.slug);

  // SKU propi DERIVAT (no desat): prefix de catàleg + slug. Vegeu src/lib/sku.ts.
  const sku = productSku("moble", slug);

  // Bloc "Sobre el producte": bullets + seccions desplegables (slide-over).
  const aboutIntro: string[] = [
    `${catLabel(moble.cat)} · ${moble.marca}`,
    ...(materialText ? [materialText] : []),
    ...(detall ? [detall.termini] : []),
  ];
  const aboutSections: AboutSection[] = [
    spec && {
      id: "dimensions",
      title: ts("accDimensions"),
      rows: [{ label: t("dimensionsLabel"), value: spec.dimensions }],
    },
    spec && (materialText || spec.finishes.length > 0) && {
      id: "specs",
      title: ts("accSpecs"),
      rows: [
        ...(materialText ? [{ label: t("materialLabel"), value: materialText }] : []),
        ...(spec.finishes.length > 0
          ? [{ label: t("finishesLabel"), value: spec.finishes.join(" · ") }]
          : []),
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
        { label: t("typeLabel"), value: catLabel(moble.cat) },
        { label: t("madeBy"), value: moble.marca },
        { label: ts("reference"), value: sku },
      ],
    },
  ].filter(Boolean) as AboutSection[];

  const canonicalUrl = `${SITE_URL}${prefix}/mobiliari/${slug}`;

  // Mateixa descripció que generateMetadata (reusada al JSON-LD Product).
  const schemaDescription = `${moble.nom} — ${catLabel(moble.cat)}. ${t("madeBy")} ${t("madeByBrand")}. ${t("fromPrice")} ${moble.pvp} €.`;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: moble.nom,
    description: schemaDescription,
    image: `${SITE_URL}${image}`,
    category: "Mobiliari",
    sku,
    // mpn = referència del proveïdor quan existeixi (de moment buida).
    ...(moble.supplierRef ? { mpn: moble.supplierRef } : {}),
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
            <Link href={`${prefix}/mobiliari`} className="hover:text-kave-ink transition-colors">
              {ts("navMobles")}
            </Link>
            <span aria-hidden>/</span>
            <span className="text-kave-ink">{moble.nom}</span>
          </nav>

          <MobleBuyBlock
            slug={moble.slug}
            nom={moble.nom}
            catLabel={catLabel(moble.cat)}
            imgFit={imgFit}
            defaultImage={image}
            colors={colors}
            variants={detall?.variants ?? []}
            termini={detall?.termini ?? null}
            basePvp={moble.pvp}
            budgetHref={`${prefix}/demana-pressupost`}
            href={`/mobiliari/${moble.slug}`}
          />
        </div>
      </section>

      {/* Sobre el producte (banda verd sàlvia + acordeó/slide-over) */}
      <KaveAboutProduct intro={aboutIntro} sections={aboutSections} />

      {/* Carrusels de relacionats */}
      <div className="max-w-layout mx-auto px-5 lg:px-10 py-16 lg:py-24 space-y-16">
        <ProductCarousel title={ts("combineWith")} items={combina.map(toItem)} />
        <ProductCarousel title={ts("youMayLike")} items={interessar.map(toItem)} />
      </div>
    </article>
  );
}
