import Image from "next/image";
import { getTranslations } from "next-intl/server";

/**
 * Secció "El nostre ofici" de la portada.
 *
 * Igual que el Hero: el namespace `SectionOfici` de messages/*.json ja portava
 * els 3 paràgrafs i les 3 xifres redactats i traduïts als 4 idiomes des del
 * commit inicial, sense que cap component els pintés. La història de l'empresa
 * —60 anys, 3 botigues, 3 generacions— no arribava enlloc del web.
 */

const STATS = [
  { value: "60", key: "stat1" },
  { value: "3", key: "stat2" },
  { value: "3", key: "stat3" },
] as const;

export default async function SectionOfici() {
  const t = await getTranslations("SectionOfici");

  return (
    <section className="py-section bg-canvas-warm" aria-label={t("ariaLabel")}>
      <div className="max-w-layout mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative aspect-[4/3] overflow-hidden bg-linen">
          <Image
            src="/images/60_anys.webp"
            alt={t("imageAlt")}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="max-w-prose-editorial">
          <p className="font-sans text-body-sm text-accent-deep tracking-widest uppercase mb-4">
            {t("eyebrow")}
          </p>
          <h2 className="font-serif text-display-md text-ink mb-8">
            {t("headline")}
          </h2>
          <p className="font-sans text-body-lg text-ink-muted mb-5">{t("paragraph1")}</p>
          <p className="font-sans text-body-lg text-ink-muted mb-5">{t("paragraph2")}</p>
          <p className="font-sans text-body-lg text-ink-muted">{t("paragraph3")}</p>

          <dl className="grid grid-cols-3 gap-6 mt-12 pt-10 border-t border-linen-dark">
            {STATS.map((s) => (
              <div key={s.key}>
                <dt className="sr-only">{t(s.key)}</dt>
                <dd>
                  <span className="block font-serif text-display-md text-ink leading-none mb-2">
                    {s.value}
                  </span>
                  <span className="block font-sans text-body-sm text-ink-muted">
                    {t(s.key)}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
