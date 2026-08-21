import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import Hero from "@/components/Hero";
import ProductTileGrid from "@/components/ProductTileGrid";
import ServicesGrid from "@/components/ServicesGrid";
import ContentRows from "@/components/ContentRows";
import ArtisanBand from "@/components/ArtisanBand";
import BrandsStrip from "@/components/BrandsStrip";
import ReelsSection from "@/components/ReelsSection";
import LocationsSection from "@/components/LocationsSection";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

/**
 * Portada.
 *
 * ORDRE: obertura → què fem → què venem → què més hi ha → qui som → marques → on som.
 *
 * Els quatre serveis es queden a dalt; el TITULAR D'OFICI baixa al final.
 * Anaven junts i era un mal matrimoni: el titular parlava de tres generacions
 * — discurs de marca, es llegeix bé al tancament — i empenyia avall les quatre
 * icones, que són informació pràctica i han de veure's en aterrar. Separats,
 * cadascun cau on li toca.
 *
 * Les tres seccions que en el seu dia van marxar i què n'ha estat:
 *
 * - `ArtisanBand`: TORNA. Se'n va anar perquè una de les seves dues frases era
 *   LITERALMENT la mateixa que `SectionOfici.paragraph2`. Però `SectionOfici`
 *   ja no es renderitza enlloc — d'aquella secció només se n'aprofiten l'eyebrow
 *   i el titular, prestats a `ServicesGrid` — o sigui que aquell paràgraf avui
 *   no es llegeix a cap pàgina i la repetició ja no existeix. Torna avall de
 *   tot, LLUNY del bloc d'ofici: si es posa just a sota, "atenció
 *   personalitzada" i "acompanyament complet" es diuen dues vegades seguides
 *   amb altres paraules, que és la mateixa pega d'abans amb un altre vestit.
 *
 * - `CtaVisita`: segueix fosa dins de `LocationsSection`, que és el tancament.
 *
 * - `EspaisSection`: segueix fora. La motorització té fitxa pròpia.
 */
export default async function HomePage() {
  return (
    <div>
      {/* La franja d'obertura porta el seu propi coixí superior, calculat sobre
          l'alçada real de la capçalera fixa a cada breakpoint. Per això va fora
          del `pt` de sota: si hi entrés, el coixí es comptaria dues vegades. */}
      <Hero />

      {/* Els QUATRE SERVEIS es queden aquí dalt, enganxats a la franja
          d'obertura. És el que ha d'entrar per l'ull en aterrar: que prenem
          mides a casa, que cosim al taller i que instal·lem nosaltres. Això
          és el que no dona una botiga en línia, i si cau sota la primera
          pantalla no ho llegeix ningú.

          El que SÍ que ha baixat és el titular d'ofici ("El nostre ofici",
          "Tres generacions. Un sol ofici."), que encapçalava aquest bloc i
          empenyia les icones 150px avall. Ara encapçala `ArtisanBand`, al
          final: qui som es llegeix bé al tancament; els serveis, no. */}
      <ServicesGrid compact />

      {/* I tot seguit el producte, que és el que s'ha vingut a veure. El coixí
          va aquí perquè entre la franja càlida de dalt i la graella blanca hi
          ha canvi de color, i sense aire el tall es llegeix com un error. */}
      <div className="pt-10 md:pt-12">
        <ProductTileGrid />
      </div>

      <ContentRows />

      {/* La franja d'ofici, al final del recorregut i just abans de les marques:
          "ho fem nosaltres des de 1961" i tot seguit amb qui ho fem. */}
      <ArtisanBand />

      {/* Les marques són una prova, no un argument: valen quan ja has vist el
          producte i just abans que et demanem que vinguis a la botiga. */}
      <BrandsStrip />

      {/* Els reels PUGEN de /nosaltres a la portada. Eren quatre vídeos
          propis, allotjats aquí (3,3 MB, `preload="none"`, i només es
          reprodueix el que està a la vista), en una pàgina on gairebé no entra
          ningú. Cap embed ni cap agregador: no hi ha scripts de Meta, ni
          cookies de tercers, ni cap quota mensual. El preu d'això és que els
          vídeos no s'actualitzen sols — s'han de pujar a mà quan vulgueu
          canviar-los. */}
      <ReelsSection />

      <LocationsSection />
    </div>
  );
}
