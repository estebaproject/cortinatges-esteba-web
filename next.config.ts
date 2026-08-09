import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

// Redireccions de la migració del WordPress. Només les URLs que CANVIEN de
// veritat: les 38 restants del sitemap antic es conserven idèntiques gràcies
// als `pathnames` de src/routing.ts.
//
// - Les 14 catalanes perden el prefix /ca (el català va sense prefix).
// - 4 més netegen el typo (`pressupuesto`) i les cicatrius de WPML (-es, -fr).
// - 12 pàgines legals que no surten al sitemap del WordPress però estan vives.
//
// `permanent` és true per defecte (308). Només s'hi posa `false` (307) quan la
// redirecció és un pedaç que s'ha de repuntar: vegeu el bloc de la veneciana.
const WP_REDIRECTS: {
  source: string;
  destination: string;
  permanent?: boolean;
}[] = [
  { source: "/ca", destination: "/" },
  { source: "/ca/serveis", destination: "/serveis" },
  { source: "/ca/contacte", destination: "/contacte" },
  { source: "/ca/demana-pressupost", destination: "/demana-pressupost" },
  { source: "/ca/vols-treballar-amb-nosaltres", destination: "/vols-treballar-amb-nosaltres" },
  { source: "/ca/cortina-tradicional-ca", destination: "/cortina-tradicional" },
  { source: "/ca/estor-paquet", destination: "/estor-paquet" },
  { source: "/ca/estor-enrotllable", destination: "/estor-enrotllable" },
  { source: "/ca/panell-japones", destination: "/panell-japones" },
  { source: "/ca/cortina-prisada", destination: "/cortina-prisada" },
  { source: "/ca/cortina-vertical-ca", destination: "/cortina-vertical" },
  { source: "/ca/cortina-nit-i-dia", destination: "/cortina-nit-i-dia" },
  { source: "/ca/cortina-motoritzacio-i-domotica", destination: "/cortina-motoritzacio-i-domotica" },
  { source: "/ca/mosquitera-ca", destination: "/mosquitera" },
  { source: "/es/pide-pressupuesto", destination: "/es/pide-presupuesto" },
  { source: "/es/cortina-vertical-es", destination: "/es/cortina-vertical" },
  { source: "/es/mosquitera-es", destination: "/es/mosquitera" },
  { source: "/fr/contact-fr", destination: "/fr/contact" },

  // --- Pàgines legals -------------------------------------------------------
  // ATENCIÓ: aquestes 12 URLs NO surten a /page-sitemap.xml del WordPress (Yoast
  // en treu les legals), però estan VIVES i responen 200. Es van descobrir
  // rastrejant els enllaços del peu, no el sitemap. Sense aquestes regles,
  // la política de privacitat enllaçada des de fora deixaria de resoldre.
  { source: "/ca/avis-legal", destination: "/avis-legal" },
  { source: "/en/legal-warning", destination: "/en/legal-notice" },
  { source: "/fr/avis-juridique", destination: "/fr/mentions-legales" },
  // (/es/aviso-legal ja coincideix amb el slug nou: no cal redirecció.)
  { source: "/ca/politica-de-proteccio-de-dades", destination: "/privacitat" },
  { source: "/es/politica-de-proteccion-de-datos", destination: "/es/privacidad" },
  { source: "/en/data-protection-policy", destination: "/en/privacy" },
  { source: "/fr/politique-de-protection-des-donnees", destination: "/fr/confidentialite" },
  { source: "/ca/politica-de-cookies", destination: "/cookies" },
  { source: "/es/politica-de-cookies-es", destination: "/es/cookies" },
  { source: "/en/cookies-policy", destination: "/en/cookies" },
  { source: "/fr/politique-d-utilisation-des-cookies", destination: "/fr/cookies" },

  // ⚠️ TEMPORAL — VENECIANA ⚠️  (afegit per no bloquejar el canvi de DNS)
  //
  // QUÈ FA: envia les 4 URLs de veneciana indexades al WordPress cap a la fitxa
  // de veneciana d'ALUMINI, perquè sense això donaven 404 en els 4 idiomes.
  //
  // PER QUÈ ÉS TEMPORAL: la decisió de producte és que /cortina-veneciana sigui
  // una pàgina de CATEGORIA que presenti alumini i fusta i enllaci a totes dues,
  // NO una redirecció a una variant. Això és un pedaç mentre no hi ha el copy.
  //
  // PER QUÈ SÓN TEMPORALS I NO PERMANENTS (`permanent: false`, i per tant les
  // úniques regles d'aquest fitxer que no ho són): els navegadors cachegen les
  // redireccions permanents de forma indefinida. Si aquestes fossin 301/308,
  // qui hi passés avui es quedaria el salt cap a la fitxa d'alumini guardat al
  // navegador i SEGUIRIA aterrant-hi encara que el servidor ja apuntés a la
  // pàgina de categoria. A més Google hauria de desfer una consolidació que
  // acaba de fer. Amb una temporal no es consolida res ara, i el dia que hi
  // hagi la categoria es consolida net i d'una sola vegada.
  //
  // COM ES REPUNTA quan arribi el copy de la pàgina de categoria:
  //   1. Afegir "/colleccions/veneciana" a `pathnames` de src/routing.ts amb els
  //      slugs: ca /cortina-veneciana · es /cortina-veneciana ·
  //      en /venetian-curtain · fr /rideau-store-venitien
  //   2. ESBORRAR aquest bloc sencer i deixar NOMÉS aquestes dues regles, ara sí
  //      DEFINITIVES i PERMANENTS (sense `permanent: false`, com la resta del
  //      fitxer), perquè amb els pathnames posats /en i /fr ja resolen soles:
  //        { source: "/ca/cortina-veneciana-ca", destination: "/cortina-veneciana" }
  //        { source: "/es/cortina-veneciana-es", destination: "/es/cortina-veneciana" }
  { source: "/ca/cortina-veneciana-ca", destination: "/veneciana-alumini", permanent: false },
  { source: "/es/cortina-veneciana-es", destination: "/es/veneciana-aluminio", permanent: false },
  { source: "/en/venetian-curtain", destination: "/en/aluminium-venetian-blind", permanent: false },
  { source: "/fr/rideau-store-venitien", destination: "/fr/store-venitien-aluminium", permanent: false },
];

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 2678400,
  },

  // Desactiva la normalització automàtica de barra final perquè les URLs del
  // WordPress (que SEMPRE porten barra) resolguin en UN SOL salt i no en dos.
  // A canvi, la normalització la fem nosaltres a l'última regla de redirects().
  skipTrailingSlashRedirect: true,

  async redirects() {
    return [
      // 1) Regles específiques del WordPress, amb i sense barra final.
      //    Han d'anar PRIMER: la primera coincidència guanya.
      //    `permanent` per defecte true; les entrades que el declaren manen
      //    (la veneciana el posa a false perquè és un pedaç repuntable).
      ...WP_REDIRECTS.flatMap((r) => {
        const permanent = r.permanent ?? true;
        return [
          { source: `${r.source}/`, destination: r.destination, permanent },
          { source: r.source, destination: r.destination, permanent },
        ];
      }),
      // 2) Normalitzador genèric de barra final per a tota la resta.
      //    `:path+` (un o més segments), NO `:path*`: amb l'asterisc l'arrel "/"
      //    coincideix amb ella mateixa i la portada retorna un 308 sense destí.
      { source: "/:path+/", destination: "/:path+", permanent: true },
    ];
  },

  // El `X-Robots-Tag: noindex` dels entorns que no són producció NO viu aquí:
  // `headers()` s'avalua en temps de build i quedaria cuit al deploy. Viu a
  // src/middleware.ts, que s'executa a cada petició. Vegeu-hi el comentari.
};

export default withNextIntl(nextConfig);
