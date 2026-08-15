import type { Metadata, Viewport } from "next";
import { Fraunces, Hanken_Grotesk } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { V2_LOCALES, isV2Locale } from "@/lib/v2/config";
import { getV2Messages, getV2T } from "@/lib/v2/i18n";
import V2Header from "@/components/v2/V2Header";
import V2Footer from "@/components/v2/V2Footer";
import V2MobileBar from "@/components/v2/V2MobileBar";
import V2RevealRoot from "@/components/v2/ui/V2RevealRoot";
import "../v2.css";

/**
 * Arrel del PROTOTIP v2.
 *
 * Next.js permet MÉS D'UN root layout mentre cap d'ells sigui pare de l'altre.
 * Aquí funciona perquè el projecte no té `src/app/layout.tsx`: el root de la web
 * actual és `src/app/[locale]/layout.tsx`, i aquest n'és un de germà. Per tant
 * la v2 pinta el seu propi <html>, les seves tipografies i el seu <body> sense
 * heretar res —ni una classe— de la web publicada.
 */

// Fraunces amb els eixos SOFT i WONK: són els que li donen el caràcter de serif
// editorial. Sense demanar-los explícitament, next/font només carrega el pes i
// la família es queda en una serif qualsevol.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK"],
});

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return V2_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getV2T(locale, "V2.meta");

  return {
    title: {
      default: t("homeTitle"),
      template: t("titleTemplate"),
    },
    description: t("homeDescription"),
    // El prototip NO s'ha d'indexar mai. Va aquí, al layout arrel de /v2, per
    // no dependre que cadascuna de les pàgines se'n recordi.
    robots: { index: false, follow: false, nocache: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#131E33",
  width: "device-width",
  initialScale: 1,
};

export default async function V2Layout({ children, params }: Props) {
  const { locale } = await params;
  if (!isV2Locale(locale)) notFound();

  const messages = await getV2Messages(locale);
  const t = await getV2T(locale, "V2.nav");

  return (
    <html lang={locale} className={`${fraunces.variable} ${hanken.variable}`}>
      <body className="bg-v2-paper text-v2-ink font-v2-sans antialiased">
        <a
          href="#v2-main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-v2-ink focus:text-v2-paper focus:px-4 focus:py-2 focus:text-v2-sm"
        >
          {t("skip")}
        </a>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <V2RevealRoot />
          <V2Header locale={locale} />
          {/* pb-20 md:pb-0 deixa lloc a la barra fixa de mòbil perquè no tapi
              l'últim bloc del peu. */}
          <main id="v2-main" className="pb-20 md:pb-0">
            {children}
          </main>
          <V2Footer locale={locale} />
          <V2MobileBar locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
