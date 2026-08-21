import Image from "next/image";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { publicPath } from "@/lib/site";

/**
 * Les tres files editorials de la portada, amb el format del WordPress vell,
 * que en això ho tenia millor que nosaltres.
 *
 * QUÈ CANVIA. Abans les dues columnes vivien dins del contenidor de la pàgina:
 * foto i text compartien els mateixos marges i la fila es llegia com dues
 * targetes de la mateixa mida, una al costat de l'altra. Ara la foto va A SANG
 * — arrenca al mateix caire de la pantalla, sense marge — i el text va dins
 * d'un bloc de color que arriba fins al caire contrari. La fila ocupa l'ample
 * sencer i es llegeix com UNA cosa, no com dues.
 *
 * ELS COLORS són els de la casa: `canvas-warm` i `sand`, alternats. El `sand`
 * (#CBBBA0) és exactament el to del bloc que feia servir el WordPress.
 *
 * ELS COSTATS s'alternen (foto esquerra, dreta, esquerra). El WordPress les
 * posava TOTES a l'esquerra i només alternava el color; alternar també el
 * costat evita tres files calcades i no perd res del format.
 *
 * EL MATALÀS és un retall sobre blanc, no una foto d'ambient, i només fa
 * 726x424: estirat a mitja pantalla es veuria reventat i sobre fons blanc no
 * s'hi distingiria el caire. Per això aquesta fila va amb `contain` sobre
 * BLANC — sobre `linen` es veia el caire blanc de la foto i semblava una
 * targeta enganxada; sobre blanc el fons del retall es fon i el matalàs sura — el retall es veu sencer i a la seva mida, i el bloc de color
 * segueix anant a sang com les altres dues. És l'única foto de tota la
 * biblioteca del WordPress que serveix per a "descans": no n'hi ha cap altra.
 */
export default async function ContentRows() {
  const t = await getTranslations("HomeSections");
  const locale = await getLocale();

  const rows = [
    {
      key: "tipus",
      title: t("tipusTitle"),
      body: t("tipusBody"),
      image: "/images/guia_cortines.jpg",
      fons: "bg-canvas-warm",
      retall: false,
    },
    {
      key: "roba",
      title: t("robaTitle"),
      body: t("robaBody"),
      image: "/images/roba_de_casa.jpg",
      fons: "bg-sand",
      retall: false,
    },
    {
      key: "descans",
      title: t("descansTitle"),
      body: t("descansBody"),
      image: "/images/img_descans.webp",
      fons: "bg-canvas-warm",
      retall: true,
    },
  ];

  return (
    <section className="bg-canvas">
      {rows.map((row, i) => {
        const fotoDreta = i % 2 === 1;
        return (
          <article key={row.key} className="grid md:grid-cols-2 items-stretch">
            <figure
              className={`relative m-0 aspect-[16/10] md:aspect-auto md:min-h-[440px] overflow-hidden ${
                row.retall ? "bg-canvas" : "bg-linen"
              } ${fotoDreta ? "md:order-2" : ""}`}
            >
              <Image
                src={row.image}
                alt={row.title}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className={row.retall ? "object-contain p-8 md:p-12" : "object-cover"}
              />
            </figure>

            <div
              className={`flex items-center ${row.fons} px-6 py-10 md:px-12 md:py-14 lg:px-16 ${
                fotoDreta ? "md:order-1" : ""
              }`}
            >
              <div className="w-full max-w-prose-editorial mx-auto">
                <h2 className="font-serif text-display-md text-ink tracking-wide uppercase mb-5">
                  {row.title}
                </h2>
                <p className="font-sans text-body-lg text-ink-muted mb-6">{row.body}</p>
                <Link
                  href={publicPath("/contacte", locale)}
                  className="inline-flex items-center gap-2 font-sans text-body-md text-accent-deep font-medium hover:gap-3 transition-all"
                >
                  {t("consulta")}
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
