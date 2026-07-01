import type { Metadata, Viewport } from "next";
import { Archivo_Narrow, Roboto, Fraunces, Hanken_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/routing";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "@/lib/site";
import SiteHeader from "@/components/shop/SiteHeader";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import CookieBanner from "@/components/CookieBanner";
import { CartProvider } from "@/components/cart/CartProvider";
import "@/app/globals.css";

const archivoNarrow = Archivo_Narrow({
  subsets: ["latin"],
  variable: "--font-archivo-narrow",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
  weight: ["400", "500", "700"],
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
  themeColor: "#132C55",
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
    description:
      "Cortinatges i decoració d'interiors a la Costa Brava des de 1961. Tres generacions d'artesans tèxtils amb botigues a Girona, Blanes i Palamós.",
    url: SITE_URL,
    logo: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
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
      className={`${archivoNarrow.variable} ${roboto.variable} ${fraunces.variable} ${hankenGrotesk.variable}`}
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
            <WhatsAppFloat />
            <CookieBanner />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
