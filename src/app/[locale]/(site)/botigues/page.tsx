import type { Metadata } from "next";
import { getTranslations, getLocale } from "next-intl/server";
import { whatsappUrl } from "@/lib/whatsapp";
import { SITE_URL, DEFAULT_OG_IMAGE, ORGANITZACIO_ID, localizedAlternatesFor, openGraphFor } from "@/lib/site";
import Link from "next/link";
import StoresMap from "@/components/StoresMap";
import { urlEscriuRessenya, urlGoogleMaps, type StoreKey } from "@/lib/botigues";
import { publicPath } from "@/lib/site";

type Props = {
  params: Promise<{ locale: string }>;
};

const STORE_KEYS = ["girona", "blanes", "palamos", "matalasseria"] as const;

// Dades reals per a l'schema LocalBusiness (SEO local / Google Maps).
const STORES_DATA: { key: StoreKey; name: string; street: string; zip: string; city: string; phone: string }[] = [
  { key: "girona", name: "Cortinatges Esteba Girona", street: "C/ Rutlla, 11", zip: "17002", city: "Girona", phone: "+34972203423" },
  { key: "blanes", name: "Cortinatges Esteba Blanes", street: "Rambla Joaquim Ruyra, 59", zip: "17300", city: "Blanes", phone: "+34972330573" },
  { key: "palamos", name: "Cortinatges Esteba Palamós", street: "C/ Miguel de Cervantes, 35", zip: "17230", city: "Palamós", phone: "+34972316219" },
  { key: "matalasseria", name: "Cortinatges Esteba Matalasseria", street: "C/ Rutlla, 20", zip: "17002", city: "Girona", phone: "+34972203423" },
];

/**
 * Horari de les botigues en format schema.org. És el mateix per a totes
 * (comprovat als quatre idiomes el 14/09/2026); si algun dia una en canvia,
 * cal passar-lo a STORES_DATA per botiga.
 */
const HORARI_SCHEMA = [
  { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:30", closes: "13:30" },
  { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "16:30", closes: "20:00" },
  { "@type": "OpeningHoursSpecification", dayOfWeek: "Saturday", opens: "10:00", closes: "13:30" },
];

// Cada botiga amb el seu identificador, l'horari, el mapa i l'empresa de la
// qual depèn. Abans hi havia nom, telèfon i adreça, i parentOrganization era
// un text: Google no el podia lligar amb l'Organization de la resta del lloc.
const storesSchema = STORES_DATA.map((s) => ({
  "@context": "https://schema.org",
  "@type": "HomeGoodsStore",
  "@id": `${SITE_URL}/botigues#${s.key}`,
  name: s.name,
  parentOrganization: { "@id": ORGANITZACIO_ID },
  url: `${SITE_URL}/botigues`,
  image: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
  telephone: s.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: s.street,
    postalCode: s.zip,
    addressLocality: s.city,
    addressRegion: "Girona",
    addressCountry: "ES",
  },
  openingHoursSpecification: HORARI_SCHEMA,
  hasMap: urlGoogleMaps(s.key),
}));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Locations" });
  return {
    title: t("headline"),
    // Abans la descripció era el sobretítol, "Les nostres botigues": 20
    // caràcters. Ara diu què hi ha, on i per a què (metaDescription).
    description: t("metaDescription"),
    alternates: localizedAlternatesFor("/botigues", locale),
    openGraph: openGraphFor("/botigues", locale, t("headline"), t("metaDescription")),
  };
}

export default async function StoresPage() {
  const t = await getTranslations("Locations");
  const tw = await getTranslations("Whatsapp");
  const tn = await getTranslations("Navigation");
  const locale = await getLocale();

  // L'HORARI, UNA SOLA VEGADA SI ÉS EL MATEIX. Les quatre botigues fan el
  // mateix horari (comprovat als quatre idiomes el 14/09/2026) i sortia
  // repetit a cada targeta. Es calcula, no es dona per fet: el dia que una
  // botiga en canviï, `horariComu` passa a null i cada targeta torna a portar
  // el seu, sense tocar res aquí.
  const horaris = STORE_KEYS.map((key) => t(`stores.${key}.schedule` as Parameters<typeof t>[0]));
  const horariComu = new Set(horaris).size === 1 ? horaris[0] : null;

  return (
    <section className="pt-40 md:pt-48 pb-section bg-canvas" aria-label={t("ariaLabel")}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storesSchema) }}
      />
      <div className="max-w-layout mx-auto px-6 lg:px-12">
        <header className="max-w-3xl mb-16">
          <p className="font-sans text-body-sm text-accent-deep tracking-widest uppercase mb-4">
            {t("eyebrow")}
          </p>
          <h1 className="font-serif text-display-lg text-ink">{t("headline")}</h1>
        </header>

        {/* El mapa de les tres botigues, dibuixat pel web (el perquè, a
            src/components/StoresMap.tsx). Cada pin obre la ruta a Google Maps. */}
        <StoresMap className="mb-16" />

        {horariComu && (
          <p className="mb-8 font-sans text-body-md text-ink">
            <span className="mr-3 font-sans text-xs font-semibold tracking-[0.18em] uppercase text-ink-muted">
              {t("horariTotes")}
            </span>
            {horariComu}
          </p>
        )}

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" role="list">
          {STORE_KEYS.map((key) => {
            const phone = t(`stores.${key}.phone` as Parameters<typeof t>[0]);
            return (
              <li
                key={key}
                className="border border-linen p-8 flex flex-col bg-canvas-warm"
              >
                <h2 className="font-serif text-display-md text-ink mb-4 uppercase">
                  {t(`stores.${key}.city` as Parameters<typeof t>[0])}
                </h2>
                <p className="font-sans text-body-md text-ink-muted mb-2">
                  {t(`stores.${key}.address` as Parameters<typeof t>[0])}
                </p>
                {t.has(`stores.${key}.note` as Parameters<typeof t>[0]) && (
                  <p className="font-sans text-body-sm text-ink-faint mb-2">
                    {t(`stores.${key}.note` as Parameters<typeof t>[0])}
                  </p>
                )}
                {!horariComu && (
                  <p className="font-sans text-body-sm text-ink-faint mb-6">
                    {t(`stores.${key}.schedule` as Parameters<typeof t>[0])}
                  </p>
                )}
                <div className="mt-auto flex flex-col gap-3">
                  <a
                    href={`tel:+34${phone.replace(/\s/g, "")}`}
                    className="font-sans text-body-md text-accent-deep font-medium hover:text-ink transition-colors"
                  >
                    {phone}
                  </a>
                  <a
                    href={whatsappUrl(
                      tw("storeInfo", { city: t(`stores.${key}.city` as Parameters<typeof t>[0]) }),
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#25D366] text-white font-sans text-body-sm font-semibold hover:brightness-95 transition-all"
                  >
                    WhatsApp
                  </a>
                  {/* La fitxa de Google de la botiga, que abans només era a
                      /contacte. NO és l'API de ressenyes: demana compte de
                      facturació i per a quatre botigues no compensa. El botó
                      d'ESCRIURE'N una només surt quan tenim el Place ID. */}
                  <div className="flex flex-wrap gap-x-5 gap-y-1">
                    <a
                      href={urlGoogleMaps(key)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center font-sans text-body-sm text-accent-deep hover:text-ink transition-colors underline underline-offset-4"
                    >
                      {t("veureGoogle")}
                    </a>
                    {urlEscriuRessenya(key) && (
                      <a
                        href={urlEscriuRessenya(key)!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[44px] items-center font-sans text-body-sm text-accent-deep hover:text-ink transition-colors underline underline-offset-4"
                      >
                        {t("escriuRessenya")}
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {/* Aquesta pàgina no tenia CAP crida. És el lloc més natural per a la
            cita: estàs mirant adreces i horaris, i el següent que vols saber
            és si t'atendran quan hi vagis. No hi va "Demana pressupost" a
            posta — qui mira botigues vol venir, no vol un preu per correu. */}
        <div className="mt-16 text-center">
          <Link
            href={publicPath("/concerta-cita", locale)}
            className="inline-flex min-h-[44px] items-center justify-center px-10 py-4 bg-ink text-canvas font-sans text-body-md font-medium tracking-widest uppercase hover:bg-ink-deep transition-colors"
          >
            {tn("cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
