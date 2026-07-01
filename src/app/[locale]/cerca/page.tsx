import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { searchItems } from "@/lib/shop-search";
import ShopResultsGrid from "@/components/shop/ShopResultsGrid";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string | string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const ts = await getTranslations({ locale, namespace: "Shop" });
  // Resultats de cerca: no s'indexen (contingut dinàmic per query).
  return { title: ts("searchTitle"), robots: { index: false, follow: true } };
}

// Cerca GLOBAL — busca per nom a tota la botiga (mobiliari + catifes + mantes).
// El cercador del header hi apunta amb ?q=. Abans només cercava a mobiliari.
export default async function CercaPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q) ?? "";
  const ts = await getTranslations("Shop");
  const prefix = locale === "ca" ? "" : `/${locale}`;
  const trimmed = q.trim();
  const items = searchItems(trimmed);

  return (
    <article className="bg-kave-bg font-grotesque text-kave-ink">
      <section className="pt-32 md:pt-36 pb-16 lg:pb-24 min-h-[60vh]">
        <div className="max-w-layout mx-auto px-5 lg:px-10">
          <header className="mb-8 max-w-2xl">
            <h1 className="font-display text-4xl md:text-5xl text-kave-ink mb-3 leading-[1.05]">
              {ts("searchTitle")}
            </h1>
            {trimmed && (
              <p className="text-base text-kave-muted">
                {ts("searchHint", { q: trimmed })} · {ts("searchResults", { count: items.length })}
              </p>
            )}
          </header>

          {!trimmed ? (
            // Sense query: no mostrem una graella buida. Convidem a cercar i
            // oferim dreceres a les categories principals. (Mantes ocult:
            // SHOW_MANTES = false.)
            <div className="py-16">
              <p className="text-lg text-kave-ink mb-6">{ts("searchPrompt")}</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`${prefix}/catifes`}
                  className="inline-flex items-center px-5 py-2.5 border border-kave-ink/30 text-sm text-kave-ink hover:border-kave-ink transition-colors"
                >
                  {ts("navCatifes")}
                </Link>
                <Link
                  href={`${prefix}/mobiliari`}
                  className="inline-flex items-center px-5 py-2.5 border border-kave-ink/30 text-sm text-kave-ink hover:border-kave-ink transition-colors"
                >
                  {ts("navMobles")}
                </Link>
              </div>
            </div>
          ) : items.length === 0 ? (
            <p className="py-20 text-center text-kave-muted">{ts("searchEmpty", { q: trimmed })}</p>
          ) : (
            <ShopResultsGrid items={items} prefix={prefix} />
          )}
        </div>
      </section>
    </article>
  );
}
