import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import BrandsStrip from "@/components/BrandsStrip";
import ReelsSection from "@/components/ReelsSection";
import CtaVisita from "@/components/CtaVisita";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return { title: t("metaTitle"), description: t("metaDescription") };
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
          <p className="font-sans text-body-lg text-ink-muted max-w-prose-editorial mx-auto">
            {t("lead")}
          </p>
        </div>
      </section>

      {/* Imatge en banda + història */}
      <section className="pb-section">
        <div className="max-w-layout mx-auto px-6 lg:px-12">
          <div className="relative aspect-[3/2] md:aspect-[21/9] overflow-hidden bg-linen mb-14">
            <Image
              src="/images/serveis/confeccio.jpg"
              alt={t("title")}
              fill
              priority
              sizes="(min-width: 1024px) 1200px, 100vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-prose-editorial mx-auto space-y-5 font-sans text-body-lg text-ink-muted">
            <p>{t("story1")}</p>
            <p>{t("story2")}</p>
            <p>{t("story3")}</p>
          </div>
        </div>
      </section>

      {/* Valors */}
      <section className="pb-section">
        <div className="max-w-layout mx-auto px-6 lg:px-12">
          <h2 className="font-serif text-display-md text-ink text-center mb-12">
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
      <ReelsSection />
      <CtaVisita />
    </div>
  );
}
