import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SITE_URL } from "@/lib/site";
import { onSaleItems } from "@/lib/shop-search";
import ShopResultsGrid from "@/components/shop/ShopResultsGrid";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const ts = await getTranslations({ locale, namespace: "Shop" });
  const prefix = locale === "ca" ? "" : `/${locale}`;
  const url = `${SITE_URL}${prefix}/rebaixes`;
  return {
    title: ts("saleTag"),
    description: ts("salePageIntro"),
    alternates: { canonical: url },
    openGraph: { type: "website", url, title: ts("saleTag"), description: ts("salePageIntro") },
  };
}

// Pàgina de Rebaixes UNIFICADA — agrega les ofertes reals de mobiliari, catifes
// i mantes (pvpAbans > pvp). Abans el link "Rebaixes" del menú només duia a
// mobiliari; ara cobreix tota la botiga.
export default async function RebaixesPage({ params }: Props) {
  const { locale } = await params;
  const ts = await getTranslations("Shop");
  const prefix = locale === "ca" ? "" : `/${locale}`;
  const items = onSaleItems();

  return (
    <article className="bg-kave-bg font-grotesque text-kave-ink">
      <section className="pt-32 md:pt-36 pb-16 lg:pb-24">
        <div className="max-w-layout mx-auto px-5 lg:px-10">
          <header className="mb-10 max-w-2xl">
            <h1 className="font-display text-4xl md:text-5xl text-kave-ink mb-4 leading-[1.05]">
              {ts("saleTag")}
            </h1>
            <p className="text-base text-kave-muted">{ts("salePageIntro")}</p>
          </header>

          {items.length > 0 ? (
            <ShopResultsGrid items={items} prefix={prefix} showSale />
          ) : (
            <p className="py-20 text-center text-kave-muted">{ts("saleEmpty")}</p>
          )}
        </div>
      </section>
    </article>
  );
}
