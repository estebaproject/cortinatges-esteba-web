import Image from "next/image";
import { getTranslations } from "next-intl/server";

// Logos reals de les marques col·laboradores (de la web actual).
const BRANDS = [
  { name: "Aldeco", file: "aldeco.jpg" },
  { name: "Designers Guild", file: "designers_guild.jpg" },
  { name: "Romo", file: "romo.jpg" },
  { name: "Bandalux", file: "bandalux.jpg" },
  { name: "Vertisol", file: "VERTISOL.png" },
  { name: "Froca", file: "froca.jpg" },
  { name: "Graccioza", file: "Graccioza.png" },
  { name: "Kas", file: "kas.jpg" },
  { name: "Sorema", file: "Sorema.jpg" },
  { name: "Bassols", file: "bassols.jpg" },
  { name: "Velfont", file: "velfont.jpg" },
  { name: "Coucke", file: "COUCKE.jpg" },
  { name: "Vivaraise", file: "vivaraise.jpg" },
  { name: "Winkler", file: "WINKLER.jpg" },
  { name: "Universal", file: "UNIVERSAL.png" },
  { name: "Astral", file: "astral.png" },
  { name: "Armura", file: "armura.jpg" },
  { name: "Klinun", file: "klinun.jpg" },
  { name: "Linen-Silk", file: "Linen-Silk.jpg" },
  { name: "Ma Salgueiro", file: "ma-salgueiro.jpg" },
  { name: "Nici", file: "nici.png" },
  { name: "Pepa Pastor", file: "pepa-pastor.jpg" },
  { name: "Piubell", file: "piubell.jpg" },
  { name: "Scenes", file: "scenes.jpg" },
  { name: "B·Sensible", file: "Visensible.png" },
  { name: "Yutes", file: "yutes.jpg" },
];

export default async function BrandsStrip() {
  const t = await getTranslations("HomeGrid");

  return (
    <section className="py-section bg-canvas border-t border-linen" aria-label={t("brandsHeading")}>
      <div className="max-w-layout mx-auto px-6 lg:px-12">
        <h2 className="text-center font-sans text-eyebrow text-ink-muted uppercase mb-12">
          {t("brandsHeading")}
        </h2>
        <ul
          className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-x-8 gap-y-10 items-center"
          role="list"
        >
          {BRANDS.map((brand) => (
            <li key={brand.file} className="flex items-center justify-center">
              <div className="relative h-11 w-full">
                <Image
                  src={`/images/brands/${brand.file}`}
                  alt={brand.name}
                  fill
                  sizes="140px"
                  className="object-contain"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
