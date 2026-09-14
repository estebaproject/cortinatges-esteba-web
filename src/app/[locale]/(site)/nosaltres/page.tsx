import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import BrandsStrip from "@/components/BrandsStrip";
import CtaVisita from "@/components/CtaVisita";
import { localizedAlternatesFor, openGraphFor } from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localizedAlternatesFor("/nosaltres", locale),
    openGraph: openGraphFor("/nosaltres", locale, t("metaTitle"), t("metaDescription")),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("About");
  const values = t.raw("values") as { title: string; desc: string }[];

  return (
    <div className="bg-canvas">
      {/* Intro centrada */}
      <section className="pt-40 md:pt-48 pb-12 md:pb-16">
        <div className="max-w-layout mx-auto px-6 lg:px-12 text-center">
          <p className="font-sans text-eyebrow text-accent-deep uppercase mb-4">
            {t("eyebrow")}
          </p>
          <h1 className="font-serif text-display-lg text-ink max-w-3xl mx-auto mb-6">
            {t("title")}
          </h1>
          {/* Es parteix pels dos punts, que és on la frase fa la pausa:
              la promesa a dalt i què vol dir a baix. Com al tancament, el
              tall es calcula i no s'escriu al diccionari, perquè els quatre
              idiomes tenen els mateixos dos punts. Si un no en tingués, es
              pinta sencera. */}
          <p className="font-sans text-body-lg text-ink-muted max-w-prose-editorial mx-auto">
            {(() => {
              const l = t("lead");
              const i = l.indexOf(": ");
              if (i < 0) return l;
              return (
                <>
                  {l.slice(0, i + 1)}
                  <br />
                  {l.slice(i + 2)}
                </>
              );
            })()}
          </p>
        </div>
      </section>

      {/* Imatge en banda + història */}
      <section className="pb-section">
        <div className="max-w-layout mx-auto px-6 lg:px-12">
          {/* La foto va A LA COLUMNA DEL TEXT, no a l'ample de la maqueta.
              Abans era una banda de 1184×507 a sobre d'una columna de prosa de
              660px: dues amplades diferents una damunt de l'altra, i l'ull ho
              llegeix com dues maquetes enganxades. Compartint mesura, la foto
              il·lustra la història en comptes de competir-hi.

              I de passada es recupera la foto. L'original fa 1400×1050 (4/3);
              retallat a 21/9 en quedaven 600px d'alçada dels 1050 —el 43% del
              pla, llençat—, que és per què la costurera sortia escapçada. A
              3/2 el retall baixa a l'11%.

              LA FOTO I LA PROSA COMPARTEIXEN UN SOL CONTENIDOR, i això no és
              per estalviar un div. `max-w-prose-editorial` són 68ch, i `ch`
              es resol contra la mida de lletra DE L'ELEMENT: posat en dos
              germans, el de la prosa el calcula amb `text-body-lg` i el de la
              foto amb la mida base, i surten 660px contra 623px. Casi alineat
              és pitjor que gens alineat —es veu el desnivell i sembla un
              error. Amb un únic pare que porti la mida de lletra, els 68ch es
              calculen una sola vegada i les dues vores cauen al mateix lloc.

              `sizes` a 680px i no 1200: a 660px de render i pantalla retina
              calen ~1320px i l'original en té 1400. Just, però hi cap. */}
          <div className="max-w-prose-editorial mx-auto font-sans text-body-lg">
            <div className="relative aspect-[3/2] overflow-hidden bg-linen mb-14">
              <Image
                src="/images/serveis/confeccio.jpg"
                alt={t("title")}
                fill
                priority
                sizes="(min-width: 768px) 680px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-5 text-ink-muted">
              <p>{t("story1")}</p>
              <p>{t("story2")}</p>
              <p>{t("story3")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Valors */}
      <section className="pb-section">
        <div className="max-w-layout mx-auto px-6 lg:px-12">
          <h2 className="font-serif text-display-md text-ink text-center mb-12 uppercase">
            {t("valuesTitle")}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" role="list">
            {values.map((v, i) => (
              <li key={i} className="border-t border-linen-dark pt-5">
                <h3 className="font-serif text-xl text-ink mb-2">{v.title}</h3>
                <p className="font-sans text-body-md text-ink-muted leading-relaxed">
                  {v.desc}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BrandsStrip />
      <CtaVisita />
    </div>
  );
}
