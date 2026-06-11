import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { CATIFES, catifaImage } from "@/lib/catifes";
import { MOBLES, mobleImage } from "@/lib/mobiliari";
import { MANTES, mantaImage } from "@/lib/decoracio";
import { SITE_URL } from "@/lib/site";

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

export default async function BotigaPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations("Botiga");
  const prefix = locale === "ca" ? "" : `/${locale}`;

  // Tarjetes de categoria amb foto representativa i nombre de productes.
  const categories = [
    {
      key: "catifes" as const,
      href: `${prefix}/catifes`,
      title: t("catifesTitle"),
      description: t("catifesDescription"),
      count: CATIFES.length,
      image: catifaImage("jambi"),
    },
    {
      key: "mobles" as const,
      href: `${prefix}/mobiliari`,
      title: t("moblesTitle"),
      description: t("moblesDescription"),
      count: MOBLES.length,
      image: mobleImage("toulouse"),
    },
    {
      key: "decoracio" as const,
      href: `${prefix}/decoracio`,
      title: t("decoracioTitle"),
      description: t("decoracioDescription"),
      count: MANTES.length,
      image: mantaImage("varanasi"),
    },
  ];

  return (
    <article>
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

          <ul className="grid gap-6 md:grid-cols-2 md:gap-8" role="list">
            {categories.map((c, i) => (
              <li key={c.key}>
                <Link
                  href={c.href}
                  className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep"
                  aria-label={`${c.title} — ${t("productCount", { count: c.count })}`}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-linen">
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      priority={i < 2}
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Vel fosc per legibilitat del text */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                      <p className="font-sans text-eyebrow text-canvas/80 uppercase mb-2">
                        {t("productCount", { count: c.count })}
                      </p>
                      <h2 className="font-serif text-display-md text-canvas mb-1">
                        {c.title}
                      </h2>
                      <span className="inline-flex items-center gap-2 font-sans text-body-sm text-canvas/90 group-hover:text-canvas transition-colors">
                        {t("explore")}
                        <svg
                          className="w-4 h-4 transition-transform group-hover:translate-x-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 font-sans text-body-sm text-ink-muted">
                    {c.description}
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
