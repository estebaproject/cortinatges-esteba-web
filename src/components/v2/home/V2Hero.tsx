import Image from "next/image";
import {
  V2_PHONE_DISPLAY,
  V2_PHONE_TEL,
  v2Path,
} from "@/lib/v2/config";
import { getV2T } from "@/lib/v2/i18n";
import { ArrowRight, ButtonLink } from "../ui/V2Button";
import { PhoneIcon } from "../ui/icons";

/**
 * Obertura de la portada.
 *
 * Tres decisions concretes respecte de la web actual:
 *
 * · EL VEL NO TAPA LA FOTO. A la v1 el degradat puja des de baix fins al 72% de
 *   l'alçada i tenyeix la imatge sencera. Aquí el vel és un degradat LATERAL:
 *   protegeix el text a l'esquerra i deixa el producte net a la dreta, que és
 *   el que la gent ha vingut a veure.
 * · HI HA UN TELÈFON. El CTA secundari de la v1 és una àncora a #productes:
 *   fa baixar la pàgina, no genera cap contacte.
 * · UN SOL <h1>. A la v1 n'hi ha dos a la mateixa pàgina (aquí i a la graella
 *   de productes).
 */
export default async function V2Hero({ locale }: { locale: string }) {
  const t = await getV2T(locale, "V2.home.hero");
  const tc = await getV2T(locale, "V2.cta");

  return (
    <section
      className="relative flex min-h-[88svh] items-end overflow-hidden"
      aria-label={t("ariaLabel")}
    >
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Mòbil: vel de baix a dalt (el text hi ocupa tot l'ample). */}
        <div className="absolute inset-0 bg-gradient-to-t from-v2-ink/90 via-v2-ink/45 to-transparent md:hidden" />

        {/* Desktop: vel LATERAL. El terç dret queda net.
            Va amb un linear-gradient literal i NO amb `from-/via-/to-` de
            Tailwind: en combinar `to-transparent` amb la parada `to-72%`,
            Tailwind genera `background-image: none` i el vel desapareix del tot.
            Es va veure a la captura, no al codi: el titular quedava blanc sobre
            una foto claríssima. */}
        <div className="absolute inset-0 hidden bg-[linear-gradient(to_right,rgba(19,30,51,0.92)_0%,rgba(19,30,51,0.66)_34%,rgba(19,30,51,0)_72%)] md:block" />

        {/* Vel superior. La capçalera va transparent damunt la foto i aquesta
            imatge és una sala amb finestrals: text blanc sobre blanc. Aquesta
            franja garanteix contrast al capçal sigui quina sigui la foto —i el
            dia que el client en canviï una, seguirà garantint-lo. */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-v2-ink/75 via-v2-ink/35 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-v2-layout px-6 pb-16 pt-32 md:px-10 md:pb-24 lg:px-14">
        <div className="max-w-3xl">
          <p className="font-v2-sans text-v2-eyebrow font-semibold uppercase text-v2-brass">
            {t("eyebrow")}
          </p>

          <h1 className="mt-6 font-v2-display text-v2-hero text-balance text-v2-paper">
            {t("headline")}
          </h1>

          <p className="mt-7 max-w-v2-prose font-v2-sans text-v2-lead text-v2-paper/80">
            {t("lead")}
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink
              href={v2Path(locale, "pressupost")}
              variant="onDark"
              size="lg"
              className="group"
            >
              {tc("budget")}
              <ArrowRight />
            </ButtonLink>

            <a
              href={`tel:${V2_PHONE_TEL}`}
              className="inline-flex min-h-[56px] items-center justify-center gap-2.5 border border-v2-paper/35 px-8 font-v2-sans text-v2-body font-semibold text-v2-paper transition-colors duration-300 hover:border-v2-paper hover:bg-v2-paper/10"
            >
              <PhoneIcon className="h-5 w-5" />
              {V2_PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>

      {/* Filet de llautó al peu de la imatge: tanca l'obertura i marca on
          comença el contingut, sense necessitat d'una fletxa animada. */}
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-v2-brass" aria-hidden="true" />
    </section>
  );
}
