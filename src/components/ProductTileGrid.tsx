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

  return (
    <section className="bg-canvas" aria-label={tg("tagline")}>
      {/* Eslògan */}
      <div className="max-w-layout mx-auto px-6 lg:px-12 pt-6 pb-10 md:pt-8 md:pb-12 text-center animate-fade-up">
        <p className="font-sans text-eyebrow text-accent-deep uppercase mb-4">
          Des de 1961
        </p>
        <h1 className="font-serif text-display-md text-ink max-w-2xl mx-auto leading-snug">
          {tg("tagline")}
        </h1>
        <span className="block mx-auto mt-6 w-16 h-px bg-sand-dark" aria-hidden="true" />
      </div>

      {/* Graella de blocs arena */}
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
