import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n.ts");

// Redireccions de la migració del WordPress. Només les URLs que CANVIEN de
// veritat: les 40 restants del sitemap antic es conserven idèntiques gràcies
// als `pathnames` de src/routing.ts.
//
// - Les 14 catalanes perden el prefix /ca (el català va sense prefix).
// - 4 més netegen el typo (`pressupuesto`) i les cicatrius de WPML (-es, -fr).
const WP_REDIRECTS: { source: string; destination: string }[] = [
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

  // PENDENT — VENECIANA: 4 URLs del WordPress que AVUI DONEN 404
  //   /ca/cortina-veneciana-ca · /es/cortina-veneciana-es
  //   /en/venetian-curtain     · /fr/rideau-store-venitien
  // No s'hi posa redirecció perquè la decisió és mantenir-les com a pàgina de
  // CATEGORIA (presenta alumini i fusta), no redirigir-les a una variant.
  // BLOQUEJANT PER AL CANVI DE DNS: fins que la pàgina de categoria existeixi,
  // aquestes 4 URLs indexades cauen en 404.
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
      ...WP_REDIRECTS.flatMap((r) => [
        { source: `${r.source}/`, destination: r.destination, permanent: true },
        { ...r, permanent: true },
      ]),
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
