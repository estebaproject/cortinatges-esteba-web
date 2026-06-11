import { getTranslations } from "next-intl/server";

export default async function ArtisanBand() {
  const t = await getTranslations("HomeGrid");

  return (
    <section className="py-section bg-ink text-canvas">
      <div className="max-w-layout mx-auto px-6 lg:px-12 text-center">
        <p className="font-serif text-display-md text-canvas max-w-3xl mx-auto leading-snug mb-6">
          {t("artisan1")}
        </p>
        <p className="font-sans text-body-lg text-canvas/70 max-w-prose-editorial mx-auto">
          {t("artisan2")}
        </p>
      </div>
    </section>
  );
}
