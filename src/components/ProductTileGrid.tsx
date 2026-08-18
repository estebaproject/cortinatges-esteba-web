import Image from "next/image";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { PRODUCTS, productHero } from "@/lib/products";
import { publicPath, collectionHref } from "@/lib/site";

const DECORESTEBA = "https://www.decoresteba.com";

type Tile = {
  key: string;
  label: string;
  href: string;
  image?: string;
  external?: boolean;
};

export default async function ProductTileGrid() {
  const tp = await getTranslations("Products");
  const tg = await getTranslations("HomeGrid");
  const th = await getTranslations("Hero");
  const locale = await getLocale();


  const productTiles: Tile[] = PRODUCTS.map((p) => ({
    key: p.slug,
    label: tp(`${p.slug}.name` as Parameters<typeof tp>[0]),
    href: publicPath(collectionHref(p.slug), locale),
    image: productHero(p.slug),
  }));

  const extraTiles: Tile[] = [
    { key: "tendals", label: tg("tendals"), href: DECORESTEBA, external: true, image: "/images/tendals.jpg" },
    { key: "pergoles", label: tg("pergoles"), href: DECORESTEBA, external: true, image: "/images/pergoles.jpg" },
    { key: "tapisseria", label: tg("tapisseria"), href: DECORESTEBA, external: true, image: "/images/tapisseria.jpg" },
  ];

  // Tots els blocs en ordre; el sell "60 anys" es col·loca al centre exacte
  // de la graella (a 3 columnes queda a la fila i columna del mig).
  const allTiles = [...productTiles, ...extraTiles];
  const splitAt = allTiles.length;

  const Tile = ({ tile, priority = false }: { tile: Tile; priority?: boolean }) => {
    const inner = tile.image ? (
      <div className="group">
        <div className="relative aspect-[4/5] overflow-hidden bg-linen">
          <Image
            src={tile.image}
            alt={tile.label}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-[800ms] ease-editorial group-hover:scale-105"
          />
        </div>
        <span className="block mt-3 font-serif text-sm md:text-base text-ink tracking-[0.1em] uppercase group-hover:text-accent-deep transition-colors">
          {tile.label}
        </span>
      </div>
    ) : (
      <div className="group">
        <div className="relative aspect-[4/5] overflow-hidden bg-sand group-hover:bg-sand-dark transition-colors duration-500" />
        <span className="block mt-3 font-serif text-sm md:text-base text-ink tracking-[0.1em] uppercase group-hover:text-accent-deep transition-colors">
          {tile.label}
        </span>
      </div>
    );
    return tile.external ? (
      <a href={tile.href} target="_blank" rel="noopener noreferrer" aria-label={tile.label}>
        {inner}
      </a>
    ) : (
      <Link href={tile.href} aria-label={tile.label}>
        {inner}
      </Link>
    );
  };

  // Aquí hi havia un bloc d'eslògan entre el hero i la graella: "Des de 1961",
  // la frase "trobaràs molt més que cortines" i una ratlla daurada. Fora. Era
  // palla de plantilla: no deia res que el client pugui fer servir i endarreria
  // l'arribada als productes, que és l'única cosa que ha vingut a buscar.
  //
  // A més portava un h1, i el hero ja en té un altre: la portada en tenia DOS.
  // Ara només queda el del hero.
  //
  // El `tagline` es manté com a aria-label de la secció: no es veu, però dona
  // nom al landmark per a qui navega amb lector de pantalla.
  return (
    <section className="bg-canvas" aria-label={tg("tagline")}>
      {/* El h1 de la portada. Va amagat a la vista però no als cercadors ni als
          lectors de pantalla.
          Vivia a la franja d'obertura, i en treure-la la pàgina s'hauria quedat
          SENSE cap h1 — la parrilla no en tenia, i el titular que hi havia
          abans d'ella el vam treure per repetit. Una portada sense h1 és un
          forat gratuït, tant per a Google com per a qui navega amb lector.
          El text és el mateix que ja hi havia i ja està traduït als quatre
          idiomes: no s'inventa res. */}
      <h1 className="sr-only">{th("headline")}</h1>
      {/* Sense coixí superior a propòsit: el `pt-12 md:pt-16` que ja hi ha a
          l'embolcall de la portada (page.tsx) fa aquesta feina. Posant-ne un
          aquí també, quedaven 112px de blanc buit entre la franja d'obertura i
          la primera targeta — i ara allà no hi ha res que l'ompli. */}
      <div id="productes" className="max-w-layout mx-auto px-6 lg:px-12 pb-section scroll-mt-32">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {allTiles.slice(0, splitAt).map((tile, i) => (
            <Tile key={tile.key} tile={tile} priority={i === 0} />
          ))}

          {allTiles.slice(splitAt).map((tile) => (
            <Tile key={tile.key} tile={tile} />
          ))}
        </div>
      </div>
    </section>
  );
}
