import Image from "next/image";
import { V2_INSTAGRAM } from "@/lib/v2/config";
import { getV2T } from "@/lib/v2/i18n";
import { ArrowRight, ButtonLink } from "../ui/V2Button";
import { InstagramIcon } from "../ui/icons";
import { Container, Reveal, Section, SectionHead } from "../ui/primitives";
import V2Reels from "./V2Reels";

/**
 * Prova social: instal·lacions reals i el perfil del taller.
 *
 * Fotos de la galeria de producte que ja hi ha al projecte, muntades en mosaic
 * asimètric. Serveixen per al que la portada actual no fa enlloc: ensenyar
 * feina acabada a casa d'algú, que és l'única prova que val en aquest ofici.
 *
 * PENDENT DE CLIENT: aquí hi haurien d'anar fotos de projectes reals amb el nom
 * de la població, i ressenyes de Google amb nom i puntuació. El mosaic està
 * pensat perquè aquestes fotos es puguin substituir una a una.
 */

// La primera peça ocupa 2×2 en desktop i tot l'ample en mòbil. Amb quatre
// columnes i quatre quadrats al costat, el mosaic tanca en un rectangle net
// sense forats: és el que evita que un mur de fotos sembli un accident.
const MOSAIC = [
  {
    src: "/images/products/tradicional/2.jpg",
    className: "col-span-2 aspect-[4/3] md:row-span-2 md:aspect-auto",
  },
  { src: "/images/products/panell-japones/2.jpg", className: "aspect-square" },
  { src: "/images/products/nit-i-dia/2.jpg", className: "aspect-square" },
  { src: "/images/products/prisada/3.jpg", className: "aspect-square" },
  { src: "/images/products/estor-enrotllable/3.jpg", className: "aspect-square" },
];

export default async function V2Proof({ locale }: { locale: string }) {
  const t = await getV2T(locale, "V2.home.proof");

  return (
    <Section tone="paper" id="feina-feta">
      <Container>
        <SectionHead eyebrow={t("eyebrow")} title={t("headline")} lead={t("lead")} />

        <Reveal className="mt-14">
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4" role="list">
            {MOSAIC.map((item, i) => (
              <li key={item.src} className={item.className}>
                <div className="relative h-full w-full overflow-hidden bg-v2-linen">
                  <Image
                    src={item.src}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover transition-transform duration-[900ms] ease-editorial hover:scale-[1.03]"
                    priority={i === 0}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Instagram */}
        <Reveal className="mt-20">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="font-v2-display text-v2-h3 text-v2-ink">
                {t("instagramTitle")}
              </h3>
              <p className="mt-1.5 font-v2-sans text-v2-sm text-v2-ink-3">
                {t("handle")}
              </p>
            </div>
            <ButtonLink
              href={V2_INSTAGRAM}
              external
              variant="secondary"
              className="group w-fit"
              icon={<InstagramIcon className="h-4 w-4" />}
            >
              {t("instagramCta")}
              <ArrowRight />
            </ButtonLink>
          </div>

          <V2Reels label={t("instagramTitle")} />
        </Reveal>
      </Container>
    </Section>
  );
}
