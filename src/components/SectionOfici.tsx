import { getTranslations } from "next-intl/server";

/**
 * Secció "El nostre ofici" de la portada.
 *
 * Se n'han tret dues coses que envellien soles:
 *
 * 1. La imatge `60_anys.webp`: era el cartell de la felicitació dels 60 anys,
 *    del 2021. Estem al 2026 i allò ja no és una foto del taller, és una
 *    efemèride passada.
 * 2. El comptador de tres xifres (60 anys · 3 botigues · 3 generacions). El
 *    "60" s'havia de tocar a mà cada any o mentia, i les altres dues xifres ja
 *    es diuen millor en text: les generacions al titular i les botigues a la
 *    secció de botigues, amb adreça i telèfon.
 *
 * El bloc es queda NOMÉS amb text. No s'hi ha posat cap altra foto a propòsit:
 * les que hi ha del taller són les de la pàgina de serveis, i repetir-les aquí
 * seria omplir per omplir. Quan hi hagi una foto de debò del taller, aquest és
 * el lloc.
 */
export default async function SectionOfici() {
  const t = await getTranslations("SectionOfici");

  return (
    <section className="py-section bg-canvas-warm" aria-label={t("ariaLabel")}>
      {/* Sense la foto, la graella de dues columnes ja no té sentit: el text
          es queda en una sola columna centrada, amb l'amplada de lectura
          màxima perquè les línies no es facin inabastables en un monitor gran. */}
      <div className="max-w-layout mx-auto px-6 lg:px-12">
        <div className="max-w-prose-editorial mx-auto text-center">
          <p className="font-sans text-body-sm text-accent-deep tracking-widest uppercase mb-4">
            {t("eyebrow")}
          </p>
          <h2 className="font-serif text-display-md text-ink mb-8">
            {t("headline")}
          </h2>
          <p className="font-sans text-body-lg text-ink-muted mb-5">{t("paragraph1")}</p>
          <p className="font-sans text-body-lg text-ink-muted mb-5">{t("paragraph2")}</p>
          <p className="font-sans text-body-lg text-ink-muted">{t("paragraph3")}</p>
        </div>
      </div>
    </section>
  );
}
