import { getTranslations } from "next-intl/server";

export default async function ArtisanBand() {
  const t = await getTranslations("HomeGrid");
  // El titular d'ofici baixa aquí des de dalt de tot de la portada.
  const to = await getTranslations("SectionOfici");

  // FONS ARENA, no blau. Anava en blau i el tancament de la portada també
  // (`LocationsSection`, exactament el mateix #132C55): quedaven dos blocs
  // blaus idèntics amb només la tira blanca de marques entremig, i aquella
  // franja blanca prima entre dos blaus es llegia com un error de maquetació
  // més que com un ritme. Amb l'arena, el final de la portada fa arena →
  // blanc → blau: tres tons, i el blau es guarda per a la crida, que és
  // l'única cosa d'allà baix que demana una acció.
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
    <section className="py-14 md:py-20 bg-sand text-ink">
      <div className="max-w-layout mx-auto px-6 lg:px-12 text-center">
        <p className="font-sans text-eyebrow text-ink/70 tracking-widest uppercase mb-3">
          {to("eyebrow")}
        </p>
        <h2 className="font-serif text-display-md text-ink mb-5 uppercase">{to("headline")}</h2>
        <p className="font-serif text-lg md:text-xl text-ink max-w-3xl mx-auto leading-snug mb-3">
          {t("artisan1")}
        </p>
        <p className="font-sans text-body-lg text-ink/70 max-w-prose-editorial mx-auto">
          {t("artisan2")}
        </p>
      </div>
    </section>
  );
}
