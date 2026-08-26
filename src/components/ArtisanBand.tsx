import { getTranslations } from "next-intl/server";

export default async function ArtisanBand() {
  const t = await getTranslations("HomeGrid");
  // El titular d'ofici baixa aquí des de dalt de tot de la portada.
  const to = await getTranslations("SectionOfici");

  // FONS BLAU amb text BEIGE. Va estar en arena una temporada per no repetir
  // el blau del tancament; ara el peu passa a beige i el final fa blau (ofici)
  // → blanc (marques) → blau (crida) → beige (peu), que ja no repeteix.
  //
  // Contrast mesurat: beige sobre blau, 7,34:1 (AAA). El secundari al 80%
  // dona 5,21:1, que passa AA.
  //
  // Ara aquesta franja és TAMBÉ el bloc d'ofici: hi ha baixat l'eyebrow i el
  // titular "Tres generacions. Un sol ofici.", que abans encapçalaven els
  // quatre serveis de dalt de tot i els deixaven fora de la primera pantalla.
  // Aquí el discurs de qui som es llegeix quan toca: al final del recorregut.
  //
  // Aquesta franja feia `py-section`: 96px a dalt i 96 a baix, 192px d'aire per
  // a 66-96px de text. Dos terços de la franja eren padding buit, i en un mòbil
  // això són 336px en català i 366 en castellà i francès — entre el 40 i el 43%
  // de la pantalla per a dues frases.
  // Ara el coixí és de 48px en mòbil i 64 en escriptori, i el titular baixa de
  // 26px a 20: el missatge d'ofici hi és, però com a nota informativa i no com
  // a proclama a mitja pantalla.
  return (
    <section className="py-14 md:py-20 bg-ink text-sand">
      <div className="max-w-layout mx-auto px-6 lg:px-12 text-center">
        <p className="font-sans text-eyebrow text-sand/80 tracking-widest uppercase mb-3">
          {to("eyebrow")}
        </p>
        <h2 className="font-serif text-display-md text-sand mb-5 uppercase">{to("headline")}</h2>
        <p className="font-serif text-lg md:text-xl text-sand max-w-3xl mx-auto leading-snug mb-3">
          {t("artisan1")}
        </p>
        <p className="font-sans text-body-lg text-sand/80 max-w-prose-editorial mx-auto">
          {t("artisan2")}
        </p>
      </div>
    </section>
  );
}
