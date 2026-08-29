import type { Metadata, Viewport } from "next";
import { Archivo, Fraunces, Hanken_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/routing";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/site";
import SiteHeader from "@/components/shop/SiteHeader";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { CartProvider } from "@/components/cart/CartProvider";
import "@/app/globals.css";

/**
 * UNA sola família per a tot el web: Archivo. Ni Narrow, ni Condensed, ni Wide.
 *
 * Abans n'hi havia dues i cap era la bona: Archivo NARROW per als titulars i
 * Roboto per al text. La Narrow no és la tipografia de la casa —és una versió
 * estreta que no s'ha fet servir mai— i la Roboto no hi pinta res.
 *
 * L'Archivo és el substitut GRATUÏT de la corporativa. Fa de bon suplent
 * perquè és una grotesca del mateix aire, i com que és variable porta tots els
 * pesos en un sol fitxer: titulars i text es distingeixen pel pes i la mida,
 * no per canviar de família.
 */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

// Tipografies del tema Kave (clon de la botiga). Es carreguen sempre però
// només s'apliquen dins les rutes de tenda (classes font-display/font-grotesque).
// Fraunces ≈ el serif editorial de Kave; Hanken Grotesk ≈ la seva grotesca.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Metadata" });

  const localeUrls: Record<string, string> = {
    ca: SITE_URL,
    es: `${SITE_URL}/es`,
    en: `${SITE_URL}/en`,
    fr: `${SITE_URL}/fr`,
  };

  return {
    title: {
      default: t("title"),
      template: `%s | ${SITE_NAME}`,
    },
    description: t("description"),
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: localeUrls[locale] ?? localeUrls["ca"],
      languages: {
        "ca": localeUrls["ca"],
        "es": localeUrls["es"],
        "en": localeUrls["en"],
        "fr": localeUrls["fr"],
        "x-default": localeUrls["ca"],
      },
    },
    openGraph: {
      type: "website",
      locale: locale,
      siteName: SITE_NAME,
      title: t("title"),
      description: t("description"),
      url: localeUrls[locale] ?? localeUrls["ca"],
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [DEFAULT_OG_IMAGE],
    },
  };
}

export const viewport: Viewport = {
  // HA D'ANAR SEMPRE IGUAL QUE `ink` de tailwind.config.ts. Aquest color no
  // pinta res dins de la pàgina: pinta el CHROME del navegador en mòbil (la
  // barra de Safari a iOS, la d'adreces a Android), i l'escriptori l'ignora.
  // Com que la capçalera de la botiga és `bg-ink` i toca aquella barra, si els
  // dos hex no coincideixen surten dos blaus enganxats — que és exactament el
  // que va passar en canviar la paleta: `ink` va passar a #283649 i això es va
  // quedar al #132C55 vell, ΔE 7,77 de costura.
  themeColor: "#283649",
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    foundingDate: "1961",
    // Aquesta descripció la llegeix Google directament (dades estructurades):
    // ha de dir què es fa, no explicar un relat.
    description:
      "Cortines, estors i tèxtil de la llar a mida des de 1961. Taller propi de confecció, presa de mides a domicili i instal·lació. Botigues a Girona, Blanes i Palamós.",
    url: SITE_URL,
    // El logo de debò, no la targeta per a xarxes. Fins ara aquí hi anava
    // DEFAULT_OG_IMAGE, que fa 1200x630: Google demana una imatge del LOGO i
    // recomana proporció quadrada, i el que li estàvem donant era una targeta
    // apaïsada amb la marca al mig i molt de blau al voltant. Ara hi va la
    // marca sola sobre blanc, 600x600.
    logo: `${SITE_URL}/images/logo-esteba-organitzacio.png`,
    sameAs: [
      "https://www.instagram.com/cortinatgesesteba/",
      "https://www.facebook.com/CortinatgesEsteba",
    ],
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 41.9794,
        longitude: 2.8214,
      },
      geoRadius: "80000",
    },
  };

  return (
    <html
      lang={locale}
      className={`${archivo.variable} ${fraunces.variable} ${hankenGrotesk.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="bg-canvas text-ink font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-ink focus:text-canvas focus:px-4 focus:py-2 focus:text-sm"
        >
          Salta al contingut
        </a>
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <SiteHeader />
            <main id="main-content">{children}</main>
            <Footer />
            <CookieBanner />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
