import Image from "next/image";
import Link from "next/link";
import { V2_ROOMS, v2Path } from "@/lib/v2/config";
import { getV2T } from "@/lib/v2/i18n";
import { Container, Reveal, Section, SectionHead } from "../ui/primitives";

/**
 * Inspiració per estances.
 *
 * L'eix que la web actual NO té enlloc. Tot el lloc està ordenat pel nom tècnic
 * del producte —"panell japonès", "estor paquet"—, que és com ho anomena qui ho
 * fabrica. Qui compra pensa "què poso al menjador". Aquesta secció és el pont
 * entre les dues maneres de dir-ho, i cada estança porta a la fitxa que la
 * resol.
 *
 * En mòbil és un carrusel amb desplaçament tàctil i punts d'ancoratge, no una
 * pila vertical de cinc fotos gegants.
 */
export default async function V2Rooms({ locale }: { locale: string }) {
  const t = await getV2T(locale, "V2.home.rooms");

  return (
    <Section tone="paper-2" id="estances">
      <Container>
        <SectionHead eyebrow={t("eyebrow")} title={t("headline")} lead={t("lead")} />
      </Container>

      {/* El carrusel surt del contenidor a propòsit: en mòbil la primera
          targeta ha de tocar la vora esquerra i la següent ha d'assomar per la
          dreta, que és el que fa entendre que allò es pot arrossegar. */}
      <div className="mt-14 overflow-x-auto no-scrollbar">
        <ul
          className="flex snap-x snap-mandatory gap-4 px-6 md:px-10 lg:grid lg:grid-cols-5 lg:px-14"
          role="list"
        >
          {V2_ROOMS.map((room, i) => (
            <Reveal
              as="li"
              key={room.key}
              delay={i * 70}
              className="w-[72vw] shrink-0 snap-start sm:w-[46vw] lg:w-auto"
            >
              <Link
                href={v2Path(locale, `colleccions/${room.collection}`)}
                className="group block"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-v2-linen">
                  <Image
                    src={room.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 46vw, 72vw"
                    className="object-cover transition-transform duration-[900ms] ease-editorial group-hover:scale-[1.04]"
                  />
                  {/* Vel NOMÉS al peu i només fins on arriba el text. La foto
                      es veu sencera: és el producte. */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-v2-ink/85 to-transparent"
                    aria-hidden="true"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="font-v2-display text-xl text-v2-paper">
                      {t(`items.${room.key}.title`)}
                    </h3>
                    <p className="mt-1 font-v2-sans text-v2-xs text-v2-paper/75">
                      {t(`items.${room.key}.desc`)}
                    </p>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
