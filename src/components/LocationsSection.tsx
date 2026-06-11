import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";

const TOWN_KEYS = ["girona", "blanes", "palamos"] as const;

export default async function LocationsSection() {
  const t = await getTranslations("Locations");
  const tv = await getTranslations("CtaVisita");
  const locale = await getLocale();
  const prefix = locale === "ca" ? "" : `/${locale}`;

  const towns = TOWN_KEYS.map((k) =>
    t(`stores.${k}.city` as Parameters<typeof t>[0]),
  ).join(" · ");

  return (
    <section className="py-section bg-canvas-warm text-center" aria-label={t("ariaLabel")}>
      <div className="max-w-layout mx-auto px-6 lg:px-12">
        <p className="font-sans text-eyebrow text-accent-deep uppercase mb-4">
          {t("eyebrow")}
        </p>
        <h2 className="font-serif text-display-md text-ink max-w-2xl mx-auto mb-6">
          {t("headline")}
        </h2>
        <p className="font-serif text-display-md text-ink-muted mb-10">{towns}</p>
        <Link
          href={`${prefix}/botigues`}
          className="inline-flex items-center gap-2 px-8 py-4 bg-accent-deep text-canvas font-sans text-xs font-medium tracking-widest uppercase hover:bg-ink transition-colors"
        >
          {tv("ctaSecondary")}
        </Link>
      </div>
    </section>
  );
}
