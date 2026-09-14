import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import {
  PRODUCTS,
  PRODUCT_SLUGS,
  getProduct,
  productImages,
} from "@/lib/products";
import { whatsappUrl } from "@/lib/whatsapp";
import {
  SITE_URL,
  SITE_NAME,
  collectionHref,
  localizedAlternatesFor,
  publicPath,
  publicUrl,
} from "@/lib/site";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return PRODUCT_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!getProduct(slug)) return {};
  const tp = await getTranslations({ locale, namespace: "Products" });
  const name = tp(`${slug}.name` as Parameters<typeof tp>[0]);
  const tagline = tp(`${slug}.tagline` as Parameters<typeof tp>[0]);
  const url = publicUrl(collectionHref(slug), locale);
  const image = `/images/products/${slug}/1.jpg`;
  return {
    title: name,
    description: tagline,
    alternates: localizedAlternatesFor(collectionHref(slug), locale),
    openGraph: {
      type: "website",
      url,
      title: name,
      description: tagline,
      // SENSE `width` i `height` A POSTA. Aquí hi deia 1200x630, escrit a mà,
      // i no era veritat a cap de les 11 fitxes: mesurades una a una fan
      // 1400x940, 1400x880, 600x540, 900x600, 1400x1048, 1024x693, 795x645,
      // 768x1024, 927x1192, 924x1177 i 702x731. Coincidències amb 1200x630:
      // zero. QUATRE són verticals declarades com a apaisades.
      //
      // És el mateix error que src/lib/site.ts ja documenta haver arreglat per
      // a la imatge per defecte —«les xarxes es creuen el que se'ls diu: la
      // targeta sortia retallada o deformada»—, però aquella reparació només
      // va tocar el DEFAULT_OG_IMAGE i va deixar el defecte viu aquí, que és
      // on hi ha les úniques pàgines de producte que són al sitemap.
      //
      // NO S'HI POSA LA MIDA BONA, S'HI TREU LA MIDA. Aquests dos camps són
      // una pista opcional; quan no hi són, WhatsApp, Facebook i Telegram es
      // baixen la imatge i la mesuren ells, que és el que volem. Posar-hi el
      // número real de cada foto tornaria a ser un valor escrit a mà que
      // duplica una cosa que el fitxer ja defineix — exactament com hi hem
      // arribat. I mesurar-lo en temps d'execució tampoc serveix: aquestes
      // pàgines es regeneren per ISR al servidor, on el `public/` no és a disc.
      images: [{ url: image, alt: name }],
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description: tagline,
      images: [image],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const t = await getTranslations("ProductPage");
  const tp = await getTranslations("Products");
  const locale = await getLocale();
  // Rutes públiques reals (amb `pathnames`). Enllaçar la ruta interna faria
  // passar cada clic per una redirecció.
  const homePath = publicPath("/", locale);
  const collectionsAnchor = `${homePath}#productes`;

  const key = (k: string) => `${slug}.${k}` as Parameters<typeof tp>[0];
  const name = tp(key("name"));
  const tagline = tp(key("tagline"));
  const intro = tp(key("intro"));
  const paragraphs = tp.raw(key("paragraphs")) as string[];
  const featuresRaw = tp.has(key("features")) ? (tp.raw(key("features")) as string[]) : [];
  // "A tenir en compte": criteris de tria i advertiments que el WordPress
  // presentava en un bloc PROPI, separat dels avantatges. Sense aquest segon
  // bloc, tot cauria dins de `features` i es perdria la distinció entre
  // argument de venda i cosa a tenir present abans de decidir.
  const notesRaw = tp.has(key("notes")) ? (tp.raw(key("notes")) as string[]) : [];

  // LLISTES AGRUPADES AMB TÍTOL. `features` és una llista PLANA sota un sol
  // encapçalament, i hi ha fitxes on el gruix del catàleg ve classificat:
  // teixits, models, sistemes de comandament… Aplanar-ho vol dir barrejar
  // teixits amb motoritzacions en un reguitzell sense jerarquia.
  //
  // És OPCIONAL: les fitxes que no en tenen no canvien gens.
  //
  // Es filtra el que no tingui la forma esperada perquè, a diferència de
  // `features`, això és una estructura NIADA: una entrada mal escrita al JSON
  // de traduccions rebentaria el render de tota la pàgina en comptes de
  // deixar-se un ítem.
  type SpecGroup = { title: string; items: string[] };
  const specsRaw: SpecGroup[] = (
    tp.has(key("specs")) ? (tp.raw(key("specs")) as SpecGroup[]) : []
  ).filter(
    (g) =>
      g &&
      typeof g.title === "string" &&
      g.title.trim() !== "" &&
      Array.isArray(g.items) &&
      g.items.length > 0,
  );
  const images = productImages(product);
  const [hero, ...gallery] = images;

  // Missatge de WhatsApp TRADUÏT: abans anava en català als 4 idiomes.
  const tw = await getTranslations("Whatsapp");
  const budgetMessage =
    `${tw("productIntro")}\n\n${tw("product")}: ${name}\n${tw("town")}: `;
  const otherProducts = PRODUCTS.filter((p) => p.slug !== slug).slice(0, 4);

  const canonicalUrl = publicUrl(collectionHref(slug), locale);
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: `${intro} ${paragraphs.join(" ")}`.trim(),
    image: images.map((i) => `${SITE_URL}${i}`),
    // Traduïda: abans anava escrita en català i s'emetia IGUAL a les versions
    // castellana, anglesa i francesa. Eren 14 fitxes x 4 idiomes = 56 pàgines
    // declarant una categoria en un idioma que no era el de la pàgina.
    category: t("schemaCategory"),
    brand: { "@type": "Brand", name: SITE_NAME },
    // AQUÍ HI HAVIA `material: product.brands.join(", ")`, i era FALS.
    //
    // schema.org defineix `material` com «A material that something is made
    // from, e.g. leather, wool, cotton, paper», i la guia de Merchant Center
    // de Google diu literalment «Avoid using values that don't mention the
    // material». Nosaltres hi posàvem els PROVEÏDORS: quatre fitxes declaraven
    // que la cortina està feta de «Designers Guild» o l'estor de «Bandalux».
    //
    // Treure-ho no costa res, i està mesurat: Google només llegeix `material`
    // a les merchant listings, que exigeixen `offers`; i cap fitxa d'aquesta
    // secció emet offers, review ni aggregateRating, perquè són informatives i
    // no es ven res des d'aquí. O sigui que el camp ja era inert.
    //
    // NO ES TORNA A POSAR amb `brand` ni amb `manufacturer`: seria pitjor.
    // Ara dèiem malament DE QUÈ està feta la cortina; allò diria que la
    // fabrica Bandalux, quan la confeccionem nosaltres. I aquells dos camps
    // Google sí que els llegeix.
    //
    // LA LLISTA `brands` DE products.ts ES QUEDA: alimenta la franja visible
    // «Treballem amb:» de la barra lateral. Si algú l'esborra "netejant",
    // desapareix de 16 pàgines. I les cinc marques que no sortien enlloc del
    // text (Bandalux, Vertisol, Designers Guild, Romo i Aldeco) ara són a la
    // prosa de les seves fitxes, com ja hi eren Somfy i EPID.
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("breadcrumbHome"), item: `${SITE_URL}${homePath}` },
      { "@type": "ListItem", position: 2, name: t("breadcrumbCollections"), item: `${SITE_URL}${collectionsAnchor}` },
      { "@type": "ListItem", position: 3, name, item: canonicalUrl },
    ],
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={hero}
            alt={name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/25 to-transparent" />
        </div>
        <div className="relative z-10 max-w-layout mx-auto px-6 lg:px-12 w-full pb-12 md:pb-16">
          {/* LES MOLLES DE PA VISIBLES S'HAN TRET. Duplicaven la funció del bloc
              "Altres col·leccions" del peu de la fitxa, que ja porta a la mateixa
              graella. El BreadcrumbList de dades estructurades ES CONSERVA: la
              jerarquia segueix existint i Google en fa servir el rastre als
              resultats, que sí que és un resultat enriquit actiu (a diferència del
              Product, que no ho és perquè no hi ha offers). */}
          <h1 className="font-serif text-display-lg text-canvas max-w-3xl mb-4 uppercase">
            {name}
          </h1>
          <p className="font-sans text-body-lg text-canvas/85 max-w-prose-editorial">
            {tagline}
          </p>
        </div>
      </section>

      {/* Galeria — VA AQUÍ, just després de la portada i ABANS del text.
          Abans anava entre el text i "Altres col·leccions", i la pàgina
          obria amb quatre blocs de llistes. Amb la galeria a dalt, el
          primer que veu qui arriba és el producte; el text ve després,
          quan ja sap de què li parles. */}
      {gallery.length > 0 && (
        <section className="py-section bg-canvas" aria-label={t("galleryHeading")}>
          <div className="max-w-layout mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gallery.map((src, i) => (
                <div
                  key={src}
                  // 3:2 I NO 4:5. El marc vertical d'abans anava contra el
                  // material que hi ha: de les 23 fotos de galeria de les
                  // fitxes publicades, 12 són APAISADES, 5 quadrades i només 6
                  // verticals. Amb `object-cover` en un marc 4:5, les
                  // apaisades hi perdien entre el 49% i el 54% de l'ample:
                  // `vertical/4.jpg` (ràtio 1,76) ensenyava una llenca del que
                  // és una sala sencera.
                  //
                  // Amb 3:2 les 12 apaisades es recuperen gairebé senceres i
                  // les 6 verticals passen a retallar-se, però menys del que es
                  // retallaven les apaisades: cap baixa de 0,73, o sigui un 51%
                  // com a pitjor cas, contra el 54% que patia la pitjor
                  // apaisada. Es canvia el repartiment del dany a favor de la
                  // majoria, no s'elimina.
                  //
                  // NOMÉS ES TOCA AQUESTA GALERIA. El 4:5 segueix a la graella
                  // de la portada, als mobles i a les mantes, on el material SÍ
                  // que és vertical de sèrie. El 3:2 ja s'usa a /nosaltres.
                  className="relative aspect-[3/2] overflow-hidden bg-linen"
                >
                  <Image
                    src={src}
                    alt={`${name} — ${i + 2}`}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Descripció */}
      <section className="pb-section bg-canvas">
        <div className="max-w-layout mx-auto px-6 lg:px-12 grid lg:grid-cols-[2fr,1fr] gap-12 lg:gap-20">
          <div className="max-w-prose-editorial">
            <p className="font-serif text-display-md text-ink mb-8 leading-snug">
              {intro}
            </p>
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="font-sans text-body-lg text-ink-muted mb-6 last:mb-0"
              >
                {p}
              </p>
            ))}

            {/* Va ABANS de `features` a posta. L'ordre de lectura queda: què
                és (intro i paràgrafs) → què n'oferim (aquest catàleg) → per
                què nosaltres (`features`) → què tenir en compte (`notes`).
                A les fitxes que venen de decoresteba, aquest bloc ÉS el
                contingut: allà `features` gairebé no en té.

                Cada grup porta el seu `h2`, igual que `featuresHeading` i
                `notesHeading`, però amb el títol venint de les DADES i no
                d'una clau de traducció: els grups canvien de fitxa a fitxa
                (Teixits, Models, Sistemes, Arquitectura tèxtil…) i posar-los
                al namespace obligaria a declarar-los tots per a totes. */}
            {/* GRAELLA DE DUES COLUMNES, no una llista per grup.
                Abans cada ítem era un <li> amb una barreta vertical, apilats amb
                molt d'aire: onze ítems ocupaven una pantalla sencera i "Manual"
                tenia una línia pròpia amb adorn. Es llegia com un web de fa deu
                anys, i el client ho va dir així.

                LA FORMA LA MANA EL CONTINGUT, que ve en dues menes:
                  · etiqueta curta   "PVC", "Manual"          -> seguides, amb punt volat
                  · definició        "Adossada: un costat..."  -> línia pròpia, terme destacat

                Es detecta pel ": " de l'ítem. Un grup amb definicions les posa
                totes en línies; un grup d'etiquetes les posa totes seguides. No
                es barreja dins del mateix grup, que quedaria desendreçat.

                A mòbil la graella passa a una sola columna: 7,5rem d'etiqueta
                més el contingut no hi caben a 320px. */}
            {specsRaw.length > 0 && (
              <div className="mt-12">
                {specsRaw.map((grup, gi) => {
                  const teDefinicions = grup.items.some((i) => i.includes(": "));
                  return (
                    <div
                      key={gi}
                      className="grid grid-cols-1 sm:grid-cols-[7.5rem_1fr] gap-1 sm:gap-x-6 py-4 border-t border-linen last:border-b"
                    >
                      <h2 className="font-sans text-eyebrow text-ink-faint uppercase sm:pt-1">
                        {grup.title}
                      </h2>
                      <ul
                        className={
                          teDefinicions
                            ? "flex flex-col gap-1.5"
                            : "flex flex-wrap items-baseline"
                        }
                        role="list"
                      >
                        {grup.items.map((item, i) => {
                          const tall = item.indexOf(": ");
                          if (teDefinicions && tall > 0) {
                            return (
                              <li key={i} className="font-sans text-body-md text-ink-muted">
                                <span className="text-ink-deep font-medium">
                                  {item.slice(0, tall)}
                                </span>
                                <span className="text-sand mx-2" aria-hidden="true">
                                  &mdash;
                                </span>
                                {item.slice(tall + 2)}
                              </li>
                            );
                          }
                          // El separador va DAVANT i no darrere: si va darrere,
                          // en trencar-se la línia queda un punt volat penjat al
                          // final. Davant, el salt el deixa enganxat a l'ítem que
                          // encapçala, que és on es llegeix bé.
                          return (
                            <li key={i} className="font-sans text-body-md text-ink-deep">
                              {i > 0 && (
                                <span className="text-sand mx-2.5" aria-hidden="true">
                                  &middot;
                                </span>
                              )}
                              {item}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}

            {featuresRaw.length > 0 && (
              <div className="mt-12">
                <h2 className="font-sans text-eyebrow text-accent-deep uppercase mb-6">
                  {t("featuresHeading")}
                </h2>
                {/* AQUESTS ITEMS SON FRASES, NO ETIQUETES: es queden en llista i
                    NO passen a la graella de dues columnes de les especificacions.

                    Fora la barreta vertical de l'esquerra, que era l'adorn. Pero
                    la barreta feia una feina de veritat: la meitat dels items
                    ocupen dues linies a mobil ("Per a terrasses, cenadors o per
                    enllacar dos edificis"), i sense cap marca la segona linia es
                    llegeix igual que un item nou.

                    Qui separa ara els items es NOMES l'aire, i per aixo l'aire ha
                    de ser clarament mes gran DINS que ENTRE. Amb l'interlineat de
                    body-md (1.7 = 27px) i gap-4 (16px) la proporcio era 43/27 =
                    1,6: massa justa. Amb leading-snug (1.375 = 22px) puja a
                    38/22 = 1,7 i, de propina, el bloc encongeix en lloc de
                    creixer. 1,375 seria curt per a prosa seguida; per a frases
                    soltes de dues linies com aquestes va be. */}
                <ul className="flex flex-col gap-4" role="list">
                  {featuresRaw.map((f, i) => (
                    <li
                      key={i}
                      className="font-sans text-body-md leading-snug text-ink-muted"
                    >
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {notesRaw.length > 0 && (
              <div className="mt-12 border border-linen bg-canvas-warm p-5 sm:p-8">
                <h2 className="font-sans text-eyebrow text-accent-deep uppercase mb-6">
                  {t("notesHeading")}
                </h2>
                <ul className="flex flex-col gap-4" role="list">
                  {notesRaw.map((n, i) => (
                    <li key={i} className="font-sans text-body-md text-ink-muted">
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Aside accions */}
          <aside className="lg:sticky lg:top-28 self-start">
            <div className="border border-linen p-8 bg-canvas-warm">
              <p className="font-serif text-display-md text-ink mb-3">
                {t("ctaBlockHeadline")}
              </p>
              <p className="font-sans text-body-sm text-ink-muted mb-6">
                {t("ctaBlockBody")}
              </p>
              <a
                href={whatsappUrl(budgetMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#25D366] text-white font-sans text-body-md font-semibold hover:brightness-95 transition-all mb-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.518 5.26l-.999 3.648 3.97-1.042zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                {t("requestBudget")}
              </a>
              <Link
                href={publicPath("/contacte", locale)}
                className="flex items-center justify-center w-full px-6 py-4 border border-ink/20 text-ink font-sans text-body-md hover:bg-ink hover:text-canvas transition-colors"
              >
                {t("contactCta")}
              </Link>

              {product.brands && product.brands.length > 0 && (
                <div className="mt-8 pt-6 border-t border-linen">
                  <p className="font-sans text-body-sm text-ink-muted mb-3">
                    {t("brandsLabel")}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {product.brands.map((b) => (
                      <span key={b} className="font-serif text-body-md text-ink-faint italic">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>


      {/* Altres colleccions */}
      <section className="py-section bg-canvas-warm border-t border-linen">
        <div className="max-w-layout mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-10">
            <h2 className="font-serif text-display-md text-ink uppercase">
              {t("otherCollections")}
            </h2>
            <Link
              href={collectionsAnchor}
              className="font-sans text-body-sm text-accent-deep font-medium hover:text-ink transition-colors"
            >
              {t("backToCollections")}
            </Link>
          </div>
          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-6" role="list">
            {otherProducts.map((p) => (
              <li key={p.slug}>
                <Link href={publicPath(collectionHref(p.slug), locale)} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden bg-linen mb-3">
                    <Image
                      src={`/images/products/${p.slug}/1.jpg`}
                      alt={tp(`${p.slug}.name` as Parameters<typeof tp>[0])}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="font-serif text-body-lg text-ink group-hover:text-accent-deep transition-colors">
                    {tp(`${p.slug}.name` as Parameters<typeof tp>[0])}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </article>
  );
}
