import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { productHero } from "@/lib/products";
import { v2Path } from "@/lib/v2/config";
import { ArrowRight } from "./ui/V2Button";

/**
 * Targeta de col·lecció. La fan servir la portada i la pàgina de col·leccions,
 * perquè la mateixa cosa s'ha de veure igual als dos llocs.
 *
 * DIFERÈNCIA CLAU amb la v1: allà la targeta és un bloc de color arena amb el
 * nom al mig i la foto AMAGADA darrere un vel del 40% que només es retira en
 * passar-hi el ratolí — i en mòbil, per tant, mai. Un negoci que ven producte
 * visual no pot tapar el producte. Aquí la foto mana i el text va a sota, sobre
 * paper, on es llegeix sense haver de fosquejar la imatge.
 */
export default function V2CollectionCard({
  locale,
  slug,
  name,
  tagline,
  priority = false,
  className,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 88vw",
}: {
  locale: string;
  slug: string;
  name: string;
  tagline?: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <Link
      href={v2Path(locale, `colleccions/${slug}`)}
      className={clsx("group flex flex-col", className)}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-v2-linen">
        <Image
          src={productHero(slug)}
          alt={name}
          fill
          priority={priority}
          sizes={sizes}
          className="object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex flex-1 flex-col pt-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-v2-display text-v2-h3 text-v2-ink">{name}</h3>
          <span className="mt-1.5 text-v2-brass-2">
            <ArrowRight />
          </span>
        </div>
        {tagline && (
          <p className="mt-2.5 font-v2-sans text-v2-sm text-v2-ink-2">{tagline}</p>
        )}
      </div>
    </Link>
  );
}
