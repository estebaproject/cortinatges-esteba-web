import Image from "next/image";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";
import { PRODUCTS, productHero } from "@/lib/products";

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
  const prefix = locale === "ca" ? "" : `/${locale}`;

  const productTiles: Tile[] = PRODUCTS.map((p) => ({
    key: p.slug,
    label: tp(`${p.slug}.name` as Parameters<typeof tp>[0]),
    href: `${prefix}/colleccions/${p.slug}`,
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
  const splitAt = Math.floor((allTiles.length + 1) / 2);

  const Tile = ({ tile, priority = false }: { tile: Tile; priority?: boolean }) => {
    const inner = tile.image ? (
      // Per defecte: bloc de color homogeni (arena) amb el nom. En hover apareix la foto.
      <div className="group relative aspect-[10/11] overflow-hidden bg-sand flex items-center justify-center text-center">
        <Image
          src={tile.image}
          alt={tile.label}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-[800ms] ease-editorial group-hover:scale-105"
        />
        {/* Tapa de color homogeni que es retira del tot en passar el rató (sense filtre) */}
        <div className="absolute inset-0 bg-sand group-hover:bg-sand/0 transition-colors duration-500" />
        <span className="relative z-10 font-serif text-lg md:text-xl text-ink group-hover:text-canvas group-hover:[text-shadow:0_2px_8px_rgba(0,0,0,0.55)] tracking-[0.12em] uppercase px-4 transition-colors duration-500">
          {tile.label}
        </span>
      </div>
    ) : (
      // Bloc sense foto (categories externes): arena sòlid amb etiqueta centrada
      <div className="group relative aspect-[10/11] overflow-hidden bg-sand hover:bg-sand-dark transition-colors duration-500 flex items-center justify-center text-center">
        <span className="font-serif text-lg md:text-xl text-ink tracking-[0.12em] uppercase px-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {allTiles.slice(0, splitAt).map((tile, i) => (
            <Tile key={tile.key} tile={tile} priority={i === 0} />
          ))}

          {/* Sell 60 anys — imatge real, centrat a la graella */}
          <div className="relative aspect-[10/11] bg-canvas">
            <Image
              src="/images/60_anys.webp"
              alt={`${tg("badgeYears")} ${tg("badgeAnys")} Cortinatges Esteba · 1961`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-contain p-1"
            />
          </div>

          {allTiles.slice(splitAt).map((tile) => (
            <Tile key={tile.key} tile={tile} />
          ))}
        </div>
      </div>
    </section>
  );
}
