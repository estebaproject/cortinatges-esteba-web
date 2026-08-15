import { v2Years } from "@/lib/v2/config";
import { getV2T } from "@/lib/v2/i18n";
import { Container } from "../ui/primitives";

/**
 * Barra de confiança, just sota l'obertura.
 *
 * Respon les quatre objeccions que porta qualsevol que busqui "cortines a
 * mida": fa temps que hi són? ho fan ells? on són? em costarà diners preguntar?
 *
 * La xifra d'anys es CALCULA a partir de 1961. La web actual diu "60 anys"
 * perquè el text es va redactar el 2021 i des de llavors no s'ha tocat: avui
 * regala cinc anys d'ofici cada vegada que algú la llegeix.
 */
export default async function V2TrustBar({ locale }: { locale: string }) {
  const t = await getV2T(locale, "V2.home.trust");

  const items = [
    { value: t("yearsValue", { years: v2Years() }), label: t("yearsLabel") },
    { value: t("workshopValue"), label: t("workshopLabel") },
    { value: t("storesValue"), label: t("storesLabel") },
    { value: t("quoteValue"), label: t("quoteLabel") },
  ];

  return (
    <section className="border-b border-v2-bone bg-v2-paper-2">
      <Container>
        <ul
          className="grid grid-cols-2 divide-v2-bone lg:grid-cols-4 lg:divide-x"
          role="list"
        >
          {items.map((item, i) => (
            <li
              key={item.label}
              className={`px-1 py-7 lg:px-8 ${i < 2 ? "border-b border-v2-bone lg:border-b-0" : ""} ${i % 2 === 0 ? "border-r border-v2-bone lg:border-r-0" : ""}`}
            >
              <p className="font-v2-display text-v2-h3 text-v2-ink">{item.value}</p>
              <p className="mt-1.5 font-v2-sans text-v2-sm text-v2-ink-2">{item.label}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
