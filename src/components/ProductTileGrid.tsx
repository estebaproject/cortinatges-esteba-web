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

  // Aquí hi havia un bloc d'eslògan entre el hero i la graella: "Des de 1961",
  // la frase "trobaràs molt més que cortines" i una ratlla daurada. Fora. Era
  // palla de plantilla: no deia res que el client pugui fer servir i endarreria
  // l'arribada als productes, que és l'única cosa que ha vingut a buscar.
  //
  // A més portava un h1, i el hero ja en té un altre: la portada en tenia DOS.
  // Ara només queda el del hero.
  //
  // El `tagline` torna a VEURE'S. Feia de sola aria-label: el llegia un lector
  // de pantalla i ningú més. I diu just el que aquesta secció necessita que es
  // digui abans d'ensenyar onze categories — que aquí hi ha més que cortines —
  // perquè si no, qui ve buscant cortines no mira les catifes ni els matalassos.
  //
  // Va en `<p>`, no en encapçalament. El bloc que hi havia abans en aquest lloc
  // portava un h1 i el hero ja en té un: la portada n'arribava a tenir DOS.
  // Com a paràgraf fa la mateixa feina i no toca l'esquema de títols.
  // Es queda també com a aria-label, que no fa mal a ningú.
  return (
    <section className="bg-canvas" aria-label={`${tg("tagline")} ${tg("taglineB")}`}>
      {/* Sense coixí superior a propòsit: el `pt-12 md:pt-16` que ja hi ha a
          l'embolcall de la portada (page.tsx) fa aquesta feina. Posant-ne un
          aquí també, quedaven 112px de blanc buit entre la franja d'obertura i
          la primera targeta — i ara allà no hi ha res que l'ompli. */}
      <div id="productes" className="max-w-layout mx-auto px-6 lg:px-12 pb-section scroll-mt-32">
        {/* DUES FRASES, DUES CAIXES. Abans era una sola cadena i el salt de
            línia queia allà on tocava per amplada: partia "Redecora casa /
            teva", deixant mitja frase penjada al final de la primera línia.
            Amb un `inline-block` per frase, el navegador prefereix trencar
            ENTRE elles i la segona comença a la línia de sota.

            No és un `<br>` a posta: un salt dur obligaria les dues frases a
            files separades sempre, també quan hi caben totes dues, i en mòbil
            estret cada frase seguiria partint-se com vulgui igualment. Amb
            `inline-block` la segona frase baixa quan no hi cap al costat, i
            si ella sola tampoc hi cap —320px— es parteix per dins amb
            normalitat. El text no es toca en cap dels dos casos.

            L'`aria-label` de la secció torna a unir-les amb un espai: per a un
            lector de pantalla segueixen sent una frase seguida. */}
        <p className="font-serif text-xl md:text-2xl text-ink text-center max-w-3xl mx-auto leading-snug mb-8 md:mb-10">
          <span className="inline-block">{tg("tagline")}</span>{" "}
          <span className="inline-block">{tg("taglineB")}</span>
        </p>
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
