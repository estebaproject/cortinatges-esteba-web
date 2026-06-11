import Image from "next/image";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";

export default async function ContentRows() {
  const t = await getTranslations("HomeSections");
  const locale = await getLocale();
  const prefix = locale === "ca" ? "" : `/${locale}`;

  const rows = [
    { key: "tipus", title: t("tipusTitle"), body: t("tipusBody"), image: "/images/tradicional_8.jpg" },
    { key: "roba", title: t("robaTitle"), body: t("robaBody"), image: "/images/roba_de_casa.jpg" },
    { key: "descans", title: t("descansTitle"), body: t("descansBody"), image: "/images/img_descans.webp" },
  ];

  return (
    <section className="py-section bg-canvas">
      <div className="max-w-layout mx-auto px-6 lg:px-12 flex flex-col gap-12 lg:gap-16">
        {rows.map((row, i) => (
          <article
            key={row.key}
            className={`grid md:grid-cols-2 gap-8 lg:gap-12 items-center ${
              i % 2 === 1 ? "md:[&>figure]:order-2" : ""
            }`}
          >
            <figure className="relative aspect-[4/3] overflow-hidden bg-linen">
              <Image
                src={row.image}
                alt={row.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </figure>
            <div className="max-w-prose-editorial">
              <h2 className="font-serif text-display-md text-ink tracking-wide uppercase mb-5">
                {row.title}
              </h2>
              <p className="font-sans text-body-lg text-ink-muted mb-6">{row.body}</p>
              <Link
                href={`${prefix}/contacte`}
                className="inline-flex items-center gap-2 font-sans text-body-md text-accent-deep font-medium hover:gap-3 transition-all"
              >
                {t("consulta")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
