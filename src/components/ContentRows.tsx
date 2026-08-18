import Image from "next/image";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { publicPath } from "@/lib/site";

// Coixí i separació retallats, com a la resta de seccions de la portada:
// `py-section` són 96px a dalt i 96 a baix, i entre files n'hi havia 48 o 64
// més. Amb tres files, gairebé 300px de blanc en una secció que ja era la
// segona més llarga de la pàgina.
export default async function ContentRows() {
  const t = await getTranslations("HomeSections");
  const locale = await getLocale();


  const rows = [
    { key: "tipus", title: t("tipusTitle"), body: t("tipusBody"), image: "/images/tradicional_8.jpg" },
    { key: "roba", title: t("robaTitle"), body: t("robaBody"), image: "/images/roba_de_casa.jpg" },
    { key: "descans", title: t("descansTitle"), body: t("descansBody"), image: "/images/img_descans.webp" },
  ];

  return (
    <section className="py-12 md:py-16 bg-canvas">
      <div className="max-w-layout mx-auto px-6 lg:px-12 flex flex-col gap-10 lg:gap-12">
        {/* Foto i text a la MATEIXA alçada, perquè la fila es llegeixi com un
            bloc i no com dues coses una al costat de l'altra.
            Abans la foto feia 426px i el text 193: la meitat de baix de la fila
            era només foto, i l'ull havia de recórrer 233px buits per arribar a
            la següent. Mesurat, això feia que en només el 40% de les posicions
            de scroll es veiés una fila sencera — dues de cada tres vegades que
            paraves, estaves veient el final d'una i el principi de l'altra.
            Ara la fila té un terra de 280px i la foto l'omple amb `h-full`, o
            sigui que les dues columnes acaben on mateix.
            En mòbil, que va en una sola columna, el que compacta és la
            proporció de la foto: de 4/3 (257px) a 16/10 (214px). */}
        {rows.map((row, i) => (
          <article
            key={row.key}
            className={`grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch md:min-h-[280px] ${
              i % 2 === 1 ? "md:[&>figure]:order-2" : ""
            }`}
          >
            <figure className="relative aspect-[16/10] md:aspect-auto md:h-full overflow-hidden bg-linen">
              <Image
                src={row.image}
                alt={row.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </figure>
            <div className="max-w-prose-editorial">
              <h2 className="font-serif text-display-md text-ink tracking-wide uppercase mb-5">
                {row.title}
              </h2>
              <p className="font-sans text-body-lg text-ink-muted mb-6">{row.body}</p>
              <Link
                href={publicPath("/contacte", locale)}
                className="inline-flex items-center gap-2 font-sans text-body-md text-accent-deep font-medium hover:gap-3 transition-all"
              >
                {t("consulta")}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                </svg>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
