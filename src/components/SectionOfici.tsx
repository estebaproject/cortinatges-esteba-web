import { getTranslations } from "next-intl/server";

/**
 * Secció "El nostre ofici" de la portada.
 *
 * Aquesta secció s'ha menjat la franja blava (`ArtisanBand`) que anava just a
 * sobre. No era una fusió de textos sinó una neteja: de les dues frases de la
 * franja, una era EXACTAMENT la mateixa que `paragraph2` d'aquí
 * ("Apostem per una atenció personalitzada…") i l'altra deia el mateix que
 * `paragraph1` amb altres paraules ("des de 1961"). Dues seccions seguides
 * repetint-se.
 *
 * El que sí que valia la pena de la franja era el pes visual: era l'únic bloc
 * de color d'aquella part de la portada. Per això aquesta secció passa de fons
 * càlid a blau i es queda el paper que feia la franja, sense repetir res.
 *
 * Abans també tenia una foto (el cartell dels 60 anys, del 2021) i un comptador
 * de tres xifres; tots dos fora. Quan hi hagi una foto de debò del taller,
 * aquest és el lloc.
 */
export default async function SectionOfici() {
  const t = await getTranslations("SectionOfici");

  return (
    <section className="py-section bg-ink text-canvas" aria-label={t("ariaLabel")}>
      <div className="max-w-layout mx-auto px-6 lg:px-12">
        <div className="max-w-prose-editorial mx-auto text-center">
          <p className="font-sans text-body-sm text-sand tracking-widest uppercase mb-4">
            {t("eyebrow")}
          </p>
          <h2 className="font-serif text-display-md text-canvas mb-8 uppercase">
            {t("headline")}
          </h2>
          {/* El text va al 80% de blanc, no al 100%: sobre blau, el blanc pur a
              mida de paràgraf enlluerna. El titular sí que va sencer, que és qui
              ha de manar. */}
          <p className="font-sans text-body-lg text-canvas/80 mb-5">{t("paragraph1")}</p>
          <p className="font-sans text-body-lg text-canvas/80 mb-5">{t("paragraph2")}</p>
          <p className="font-sans text-body-lg text-canvas/80">{t("paragraph3")}</p>
        </div>
      </div>
    </section>
  );
}
