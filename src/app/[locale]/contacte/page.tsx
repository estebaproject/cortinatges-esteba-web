import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { whatsappUrl } from "@/lib/whatsapp";
import CopyEmail from "@/components/CopyEmail";
import StoresMap from "@/components/StoresMap";
import { STORE_KEYS, urlGoogleMaps, urlEscriuRessenya } from "@/lib/botigues";
import { localizedAlternatesFor, openGraphFor } from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
};

const EMAIL = "info@cortinatgesesteba.com";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "CtaVisita" });
  return {
    title: t("headline"),
    description: t("body"),
    alternates: localizedAlternatesFor("/contacte", locale),
    openGraph: openGraphFor("/contacte", locale, t("headline"), t("body")),
  };
}

export default async function ContactPage() {
  const t = await getTranslations("CtaVisita");
  const tl = await getTranslations("Locations");
  const tn = await getTranslations("Navigation");
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
            </div>
          </div>

          {/* Dreta: botigues */}
          <div>
            <p className="font-sans text-body-sm text-ink-muted tracking-widest uppercase mb-6">
              {tl("eyebrow")}
            </p>
            <ul className="flex flex-col divide-y divide-linen" role="list">
              {STORE_KEYS.map((key) => {
                const phone = tl(`stores.${key}.phone` as Parameters<typeof tl>[0]);
                const city = tl(`stores.${key}.city` as Parameters<typeof tl>[0]);
                const address = tl(`stores.${key}.address` as Parameters<typeof tl>[0]);
                return (
                  <li key={key} className="py-6 first:pt-0">
                    <h2 className="font-serif text-display-md text-ink mb-1">{city}</h2>
                    <p className="font-sans text-body-md text-ink-muted mb-1">{address}</p>
                    {/* Nota opcional (només la Matalasseria en té). */}
                    {tl.has(`stores.${key}.note` as Parameters<typeof tl>[0]) && (
                      <p className="font-sans text-body-sm text-ink-faint mb-1">
                        {tl(`stores.${key}.note` as Parameters<typeof tl>[0])}
                      </p>
                    )}
                    <p className="font-sans text-body-sm text-ink-faint mb-2">
                      {tl(`stores.${key}.schedule` as Parameters<typeof tl>[0])}
                    </p>
                    <a
                      href={`tel:+34${phone.replace(/\s/g, "")}`}
                      className="font-sans text-body-md text-accent-deep font-medium hover:text-ink transition-colors"
                    >
                      {phone}
                    </a>
                    {/* Enllaços a la fitxa de Google, un per botiga.
                        NO fem servir l'API de ressenyes: exigeix compte de
                        FACTURACIÓ encara que no en surtis del tram gratuït, i
                        el camp `reviews` puja la crida al SKU més car. Per a
                        quatre botigues locals no compensa. Un enllaç fa la
                        mateixa feina, sense clau, sense cost i sense caducar.

                        El botó d'ESCRIURE ressenya només surt quan tenim el
                        Place ID d'aquella botiga: val més no ensenyar-lo que
                        ensenyar-ne un que no porta enlloc. */}
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                      <a
                        href={urlGoogleMaps(key)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-sans text-body-sm text-accent-deep hover:text-ink transition-colors underline underline-offset-4"
                      >
                        {tl("veureGoogle")}
                      </a>
                      {urlEscriuRessenya(key) && (
                        <a
                          href={urlEscriuRessenya(key)!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans text-body-sm text-accent-deep hover:text-ink transition-colors underline underline-offset-4"
                        >
                          {tl("escriuRessenya")}
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* UN mapa per a les quatre botigues, no un per botiga.
                Abans n'hi havia QUATRE, un dins de cada element de la llista:
                quatre iframes de Google a la mateixa pàgina, i cada botiga
                semblava un apartat solt en lloc de quatre punts d'una mateixa
                casa.

                LIMITACIÓ CONEGUDA, i no és nostra: aquest embed és una CERCA
                (`?q=…&output=embed`), i Google la resol sempre a UNA fitxa —
                la de Girona. Provat amb tres consultes diferents. Per a veure
                els quatre punts alhora cal o bé un mapa de Google My Maps amb
                els quatre pins (gratuït, però l'ha de crear el client al seu
                compte i passar-nos l'identificador), o bé un mapa propi amb
                tessel·les obertes. Mentrestant, cada botiga té el seu enllaç
                a Google just a sobre, que hi porta directament. */}
            <StoresMap
              className="mt-10"
              query="Cortinatges Esteba"
              stores={STORE_KEYS.map((key) => ({
                city: tl(`stores.${key}.city` as Parameters<typeof tl>[0]),
                address: tl(`stores.${key}.address` as Parameters<typeof tl>[0]),
              }))}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
