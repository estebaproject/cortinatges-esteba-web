import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import CitaForm from "@/components/CitaForm";
import { HORARI } from "@/lib/lead";
import { localizedAlternatesFor, openGraphFor } from "@/lib/site";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FormCita" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localizedAlternatesFor("/concerta-cita", locale),
    openGraph: openGraphFor("/concerta-cita", locale, t("metaTitle"), t("metaDescription")),
  };
}

/**
 * Cita presencial. La pàgina que substitueix el Calendly del WordPress.
 *
 * L'horari es diu ABANS del formulari, no després: qui no pot venir en cap
 * d'aquestes franges val més que ho sàpiga sense haver omplert res.
 */
export default async function ConcertaCitaPage() {
  const t = await getTranslations("FormCita");

  return (
    <section className="pt-40 md:pt-48 pb-section bg-canvas">
      <div className="max-w-layout mx-auto px-6 lg:px-12">
        <header className="mb-10">
          <h1 className="font-serif text-display-lg text-ink mb-5">{t("title")}</h1>
          <p className="font-sans text-body-lg text-ink-muted max-w-prose-editorial">
            {t("intro")}
          </p>
        </header>

        <div className="mb-12 border-l-2 border-sand pl-5 max-w-prose-editorial">
          <p className="font-sans text-body-sm text-ink-muted tracking-widest uppercase mb-2">
            {t("horariTitol")}
          </p>
          <p className="font-sans text-body-md text-ink">
            {t("horariFeiners", { mati: HORARI.mati, tarda: HORARI.tarda })}
          </p>
          <p className="font-sans text-body-md text-ink">
            {t("horariDissabte", { mati: HORARI.mati })}
          </p>
        </div>

        <CitaForm />
      </div>
    </section>
  );
}
