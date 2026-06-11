import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import Link from "next/link";

export default async function CtaVisita() {
  const t = await getTranslations("CtaVisita");
  const locale = await getLocale();
  const prefix = locale === "ca" ? "" : `/${locale}`;

  return (
    <section
      className="py-section bg-accent-deep relative overflow-hidden"
      aria-label={t("ariaLabel")}
    >
      <div
        className="absolute inset-0 opacity-5"
        aria-hidden="true"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 40px, currentColor 40px, currentColor 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, currentColor 40px, currentColor 41px)",
        }}
      />

      <div className="relative z-10 max-w-layout mx-auto px-6 lg:px-12 text-center">
        <p className="font-sans text-body-sm text-accent-light tracking-widest uppercase mb-6">
          {t("eyebrow")}
        </p>

        <h2 className="font-serif text-display-lg text-canvas mb-6 max-w-2xl mx-auto">
          {t("headline")}
        </h2>

        <p className="font-sans text-body-lg text-canvas/70 mb-10 max-w-prose-editorial mx-auto">
          {t("body")}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href={`${prefix}/contacte`}
            className="inline-flex items-center justify-center px-10 py-4 bg-canvas text-ink font-sans text-body-md font-medium hover:bg-accent-light hover:text-ink transition-colors"
          >
            {t("ctaPrimary")}
          </Link>
          <Link
            href={`${prefix}/botigues`}
            className="inline-flex items-center justify-center px-10 py-4 border border-canvas/40 text-canvas font-sans text-body-md hover:border-canvas hover:bg-canvas/10 transition-colors"
          >
            {t("ctaSecondary")}
          </Link>
        </div>

        <p className="mt-8 font-sans text-body-sm text-canvas/50">
          {t("disclaimer")}
        </p>
      </div>
    </section>
  );
}
