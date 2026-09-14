import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import Link from "next/link";
import { whatsappUrl } from "@/lib/whatsapp";
import CopyEmail from "@/components/CopyEmail";
import { STORE_KEYS } from "@/lib/botigues";
import { localizedAlternatesFor, openGraphFor, publicPath } from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
};

const EMAIL = "info@cortinatgesesteba.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CtaVisita" });
  // La descripció NO és `body`. `body` fa 316 caràcters i Google en mostra
  // ~155: es tallava justament a "un servei d'assessorament...", o sigui que
  // l'única frase del web que diu que la visita a domicili té un preu
  // desapareixia precisament al lloc on el client la llegeix primer.
  // `metaDescription` diu les dues coses —pressupost sense cost, visita amb
  // preu que es descompta— dins del límit, i val igual per a l'OpenGraph.
  return {
    title: t("headline"),
    description: t("metaDescription"),
    alternates: localizedAlternatesFor("/contacte", locale),
    openGraph: openGraphFor("/contacte", locale, t("headline"), t("metaDescription")),
  };
}

export default async function ContactPage() {
  const t = await getTranslations("CtaVisita");
  const tl = await getTranslations("Locations");
  const tn = await getTranslations("Navigation");
  const locale = await getLocale();
  const tw = await getTranslations("Whatsapp");

  return (
    <section className="pt-40 md:pt-48 pb-section bg-canvas" aria-label={t("ariaLabel")}>
      <div className="max-w-layout mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Esquerra: missatge + accions */}
          <div className="max-w-prose-editorial">
            <p className="font-sans text-body-sm text-accent-deep tracking-widest uppercase mb-4">
              {tn("contact")}
            </p>
            <h1 className="font-serif text-display-lg text-ink mb-6">
              {t("headline")}
            </h1>
            <p className="font-sans text-body-lg text-ink-muted mb-10">{t("body")}</p>

            <div className="flex flex-col gap-3">
              <a
                href={whatsappUrl(tw("budgetIntro"))}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-sans text-body-md font-semibold hover:brightness-95 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.518 5.26l-.999 3.648 3.97-1.042zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                WhatsApp
              </a>
              <CopyEmail
                email={EMAIL}
                className="inline-flex items-center justify-center px-8 py-4 border border-ink/20 text-ink font-sans text-body-md hover:bg-ink hover:text-canvas transition-colors cursor-pointer"
              />
              {/* La cita, com un canal MÉS i no com un botó gran: aquesta
                  pàgina és la llista de maneres d'arribar a vosaltres, i venir
                  en persona n'és una. Va tercera perquè és la que triga més:
                  WhatsApp és immediat, el correu quasi, i la cita té dia. */}
              <Link
                href={publicPath("/concerta-cita", locale)}
                className="inline-flex min-h-[44px] items-center justify-center px-8 py-4 border border-ink/20 text-ink font-sans text-body-md hover:bg-ink hover:text-canvas transition-colors"
              >
                {tn("cta")}
              </Link>
            </div>
          </div>

          {/* Dreta: les botigues, EN VERSIÓ CURTA.
              Fins al 14/09/2026 aquí hi havia la llista sencera —adreça, horari,
              telèfon, enllaç a Google— i el mapa, exactament el mateix que a
              /botigues. Dues pàgines explicant el mateix, i totes dues al menú.
              Ara cada pàgina fa una feina: aquesta és "com parlar amb
              nosaltres" i /botigues és "on som". Aquí es queda el que serveix
              per contactar —la ciutat i el telèfon per trucar amb un toc— i
              un enllaç cap a horaris, adreces i mapa. */}
          <div>
            <p className="font-sans text-body-sm text-ink-muted tracking-widest uppercase mb-6">
              {tl("eyebrow")}
            </p>
            <ul className="flex flex-col divide-y divide-linen border-y border-linen" role="list">
              {STORE_KEYS.map((key) => {
                const phone = tl(`stores.${key}.phone` as Parameters<typeof tl>[0]);
                const city = tl(`stores.${key}.city` as Parameters<typeof tl>[0]);
                return (
                  <li key={key} className="grid grid-cols-[1fr_auto] items-baseline gap-x-6 py-5">
                    <div>
                      <h2 className="font-sans text-xs font-semibold tracking-[0.18em] uppercase text-ink">{city}</h2>
                      {/* Nota opcional (només la Matalasseria en té): és la que
                          distingeix els dos locals de Girona, que comparteixen
                          telèfon. */}
                      {tl.has(`stores.${key}.note` as Parameters<typeof tl>[0]) && (
                        <p className="mt-1 font-sans text-body-sm text-ink-faint">
                          {tl(`stores.${key}.note` as Parameters<typeof tl>[0])}
                        </p>
                      )}
                    </div>
                    <a
                      href={`tel:+34${phone.replace(/s/g, "")}`}
                      className="inline-flex min-h-[44px] items-center -my-2 font-sans text-body-lg text-accent-deep font-medium hover:text-ink transition-colors"
                    >
                      {phone}
                    </a>
                  </li>
                );
              })}
            </ul>
            <Link
              href={publicPath("/botigues", locale)}
              className="mt-6 inline-flex min-h-[44px] items-center font-sans text-body-md text-accent-deep hover:text-ink transition-colors underline underline-offset-4"
            >
              {tl("veureHorarisMapa")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
