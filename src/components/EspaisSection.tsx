import Image from "next/image";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { publicPath } from "@/lib/site";

export default async function EspaisSection() {
  const t = await getTranslations("HomeSections");
  const tn = await getTranslations("Navigation");
  const locale = await getLocale();


  return (
    <section className="relative overflow-hidden bg-ink text-canvas" aria-label={t("espaisTitle")}>
      <div className="absolute inset-0 opacity-25" aria-hidden="true">
        <Image
          src="/images/MOTORITZACIO.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <div className="relative max-w-layout mx-auto px-6 lg:px-12 py-section text-center">
        <p className="font-sans text-eyebrow text-sand uppercase mb-4">
          {t("espaisTitle")}
        </p>
        <p className="font-serif text-display-md text-canvas max-w-3xl mx-auto mb-8 leading-snug">
          {t("espaisBody")}
        </p>
        <Link
          href={publicPath("/colleccions/motoritzacio", locale)}
          className="inline-flex items-center px-8 py-3.5 bg-sand text-ink font-sans text-xs font-medium tracking-widest uppercase hover:bg-sand-dark transition-colors"
        >
          {tn("collections")}
        </Link>
      </div>
    </section>
  );
}
