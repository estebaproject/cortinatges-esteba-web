import Image from "next/image";
import { getV2T } from "@/lib/v2/i18n";
import { Container, Reveal, Section } from "../ui/primitives";

/**
 * Marques amb qui es treballa.
 *
 * Els vint-i-cinc logos ja són a /public/images/brands des del primer dia, però
 * a la web actual només surten a la pàgina "Nosaltres". Designers Guild, Romo,
 * Bandalux o Somfy són autoritat regalada: qui dubta entre tres botigues de
 * cortines decideix, en part, per quines cases li poden servir.
 *
 * Els logos van sobre targeta blanca perquè la majoria d'arxius porten fons
 * blanc: sobre el paper càlid del prototip es veurien com a rectangles bruts.
 */
const BRANDS = [
  { name: "Designers Guild", file: "designers_guild.jpg" },
  { name: "Romo", file: "romo.jpg" },
  { name: "Aldeco", file: "aldeco.jpg" },
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
  { name: "Nici", file: "nici.png" },
  { name: "Pepa Pastor", file: "pepa-pastor.jpg" },
  { name: "Piubell", file: "piubell.jpg" },
  { name: "Scenes", file: "scenes.jpg" },
  { name: "B·Sensible", file: "Visensible.png" },
  { name: "Yutes", file: "yutes.jpg" },
];

export default async function V2Brands({ locale }: { locale: string }) {
  const t = await getV2T(locale, "V2.home.brands");

  return (
    <Section tone="paper-2" size="sm" label={t("headline")}>
      <Container>
        <div className="max-w-v2-prose">
          <h2 className="font-v2-display text-v2-h3 text-v2-ink">{t("headline")}</h2>
          <p className="mt-3 font-v2-sans text-v2-sm text-v2-ink-2">{t("lead")}</p>
        </div>

        <Reveal className="mt-10">
          <ul
            className="grid grid-cols-3 gap-px bg-v2-bone sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8"
            role="list"
          >
            {BRANDS.map((brand) => (
              <li
                key={brand.file}
                className="flex items-center justify-center bg-white px-4 py-6"
              >
                <span className="relative block h-9 w-full">
                  <Image
                    src={`/images/brands/${brand.file}`}
                    alt={brand.name}
                    fill
                    sizes="140px"
                    className="object-contain opacity-70 transition-opacity duration-500 hover:opacity-100"
                  />
                </span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
