import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ServicesGrid from "@/components/ServicesGrid";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Serveis" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function ServeisPage() {
  const t = await getTranslations("Serveis");

  return (
    <div className="pt-40 md:pt-48 bg-canvas">
      <header className="max-w-layout mx-auto px-6 lg:px-12 mb-14">
        <p className="font-sans text-body-sm text-accent-deep tracking-widest uppercase mb-4">
          {t("eyebrow")}
        </p>
        <h1 className="font-serif text-display-lg text-ink mb-5">{t("title")}</h1>
        <p className="font-sans text-body-lg text-ink-muted max-w-prose-editorial">
          {t("intro")}
        </p>
      </header>
      <ServicesGrid />
    </div>
  );
}
