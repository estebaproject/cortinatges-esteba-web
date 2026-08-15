import Image from "next/image";
import { getV2T } from "@/lib/v2/i18n";
import { SHOP_PUBLISHED } from "@/lib/shop-visibility";
import { ArrowRight, ButtonLink } from "../ui/V2Button";
import { Container, Eyebrow, Reveal, Section } from "../ui/primitives";

/**
 * Entrada a la botiga online (catifes i mobiliari).
 *
 * VA DARRERE DE `SHOP_PUBLISHED`, la mateixa palanca que governa el robots.txt
 * i els noindex de tota la tenda (src/lib/shop-visibility.ts). Avui és `false`
 * a propòsit: la venda online migra a Shopify i el checkout d'aquí encara no
 * cobra. Enllaçar-la ara des de la portada seria portar gent a un carret que no
 * acaba enlloc — i contradir el disallow que ja hi ha posat.
 *
 * El bloc es queda escrit perquè el dia que la botiga es publiqui només calgui
 * canviar aquella constant, exactament com fa la capçalera actual.
 */
export default async function V2ShopTeaser({ locale }: { locale: string }) {
  if (!SHOP_PUBLISHED) return null;

  const t = await getV2T(locale, "V2.home.shop");
  const shopBase = locale === "ca" ? "" : `/${locale}`;

  return (
    <Section tone="linen">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Eyebrow className="mb-4">{t("eyebrow")}</Eyebrow>
            <h2 className="font-v2-display text-v2-h2 text-balance text-v2-ink">
              {t("headline")}
            </h2>
            <p className="mt-5 max-w-v2-prose font-v2-sans text-v2-lead text-v2-ink-2">
              {t("lead")}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={`${shopBase}/catifes`} variant="primary" className="group">
                {t("catifes")}
                <ArrowRight />
              </ButtonLink>
              <ButtonLink href={`${shopBase}/mobiliari`} variant="secondary" className="group">
                {t("mobiliari")}
                <ArrowRight />
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={120} className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[3/4] overflow-hidden bg-v2-paper">
              <Image
                src="/images/catifes/jambi/1.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 46vw"
                className="object-cover"
              />
            </div>
            <div className="relative mt-10 aspect-[3/4] overflow-hidden bg-v2-paper">
              <Image
                src="/images/mobiliari/scandinave-ii/1.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, 46vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}
