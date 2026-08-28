import { getTranslations } from "next-intl/server";
import { getLocale } from "next-intl/server";
import Link from "next/link";
import { publicPath } from "@/lib/site";

export default async function CtaVisita() {
  const t = await getTranslations("CtaVisita");
  const locale = await getLocale();


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
        {/* En beige, no en `accent-light`. Aquell és el gris blavós #67768E, i
            sobre el blau donava 3,00:1 quan en calen 4,5 — ja fallava abans
            del canvi de paleta, i amb el blau nou hauria baixat a 2,66. En
            beige dona 5,29 i, de passada, queda igual que l'altre eyebrow
            sobre fons blau. */}
        <p className="font-sans text-body-sm text-sand tracking-widest uppercase mb-6">
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
            href={publicPath("/concerta-cita", locale)}
            /* En passar-hi per sobre es torna BEIGE, no gris blavós. Amb
               `accent-light` (#67768E) el text en tinta es quedava en 2,66:1
               —3,00 amb el blau vell, o sigui que ja fallava— i el botó es
               feia il·legible justament quan hi tens el ratolí a sobre. Un
               estat de hover també ha de complir el contrast. En beige són
               7,32, i és el color de botó de la resta del lloc. */
            className="inline-flex items-center justify-center px-10 py-4 bg-canvas text-ink font-sans text-body-md font-medium hover:bg-sand transition-colors"
          >
            {t("ctaPrimary")}
          </Link>
          <Link
            href={publicPath("/botigues", locale)}
            className="inline-flex items-center justify-center px-10 py-4 border border-canvas/40 text-canvas font-sans text-body-md hover:border-canvas hover:bg-canvas/10 transition-colors"
          >
            {t("ctaSecondary")}
          </Link>
        </div>

        {/* /60 i no /50. Amb el blau nou, el blanc al 50% cau a 4,34:1 i es
            queda per sota dels 4,5 que calen; al 60% puja a 5,52. És l'ÚNICA
            parella de tot el lloc que el canvi de paleta hauria trencat. */}
        <p className="mt-8 font-sans text-body-sm text-canvas/60">
          {t("disclaimer")}
        </p>
      </div>
    </section>
  );
}
