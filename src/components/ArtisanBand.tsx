import { getTranslations } from "next-intl/server";

export default async function ArtisanBand() {
  const t = await getTranslations("HomeGrid");

  // Aquesta franja feia `py-section`: 96px a dalt i 96 a baix, 192px d'aire per
  // a 66-96px de text. Dos terços de la franja eren padding buit, i en un mòbil
  // això són 336px en català i 366 en castellà i francès — entre el 40 i el 43%
  // de la pantalla per a dues frases.
  // Ara el coixí és de 48px en mòbil i 64 en escriptori, i el titular baixa de
  // 26px a 20: el missatge d'ofici hi és, però com a nota informativa i no com
  // a proclama a mitja pantalla.
  return (
    <section className="py-12 md:py-16 bg-ink text-canvas">
      <div className="max-w-layout mx-auto px-6 lg:px-12 text-center">
        <p className="font-serif text-lg md:text-xl text-canvas max-w-3xl mx-auto leading-snug mb-3">
          {t("artisan1")}
        </p>
        <p className="font-sans text-body-lg text-canvas/70 max-w-prose-editorial mx-auto">
          {t("artisan2")}
        </p>
      </div>
    </section>
  );
}
