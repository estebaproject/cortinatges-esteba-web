import { V2_EMAIL, V2_STORES, V2_FOUNDED } from "@/lib/v2/config";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Dades estructurades de negoci local, UNA ENTITAT PER BOTIGA.
 *
 * A la web actual això només existeix a /botigues, i sense horaris ni
 * coordenades. Per a un negoci que viu de cerques com "cortines Girona", la
 * fitxa de Google Maps és la porta d'entrada: sense `openingHoursSpecification`
 * ni `geo`, Google s'ha de creure el que trobi pel seu compte.
 *
 * Va a la PORTADA perquè és la pàgina amb més autoritat del domini, i s'hi
 * declaren les tres botigues com a subseus de l'organització.
 */

const HOURS = [
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:30",
    closes: "13:30",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "16:30",
    closes: "20:00",
  },
  {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Saturday"],
    opens: "10:00",
    closes: "13:30",
  },
];

export default function V2LocalBusinessSchema({ url }: { url: string }) {
  const graph = V2_STORES.map((store) => ({
    "@context": "https://schema.org",
    "@type": "HomeGoodsStore",
    "@id": `${SITE_URL}/#store-${store.key}`,
    name: store.legalName,
    parentOrganization: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    foundingDate: String(V2_FOUNDED),
    url,
    telephone: store.phoneTel,
    email: V2_EMAIL,
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: store.street,
      postalCode: store.zip,
      addressLocality: store.city,
      addressRegion: "Girona",
      addressCountry: "ES",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: store.geo.lat,
      longitude: store.geo.lng,
    },
    openingHoursSpecification: HOURS,
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
