import Link from "next/link";
import type { ReactNode } from "react";
import { v2Path } from "@/lib/v2/config";
import { Container, Eyebrow } from "./ui/primitives";

/**
 * Capçalera de les pàgines interiors.
 *
 * El padding superior compensa la capçalera fixa (72px en mòbil, 84px en
 * desktop) i hi afegeix aire. Ho fa el component perquè no depengui que cada
 * pàgina se'n recordi: a la web actual cada pàgina interior repeteix
 * `pt-40 md:pt-48` a mà i n'hi ha prou que una l'ometi perquè el titular quedi
 * mig tapat per la barra.
 *
 * Porta molla de pa (visible i amb dades estructurades) quan la pàgina penja
 * d'una altra: la web actual no en té cap enlloc.
 */
export default function V2PageHeader({
  eyebrow,
  title,
  lead,
  breadcrumb,
  children,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  /** Enllaç pare, si la pàgina en té: { href, label }. */
  breadcrumb?: { href: string; label: string };
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-v2-bone bg-v2-paper-2 pb-v2-section-sm pt-[calc(72px+2.5rem)] md:pt-[calc(84px+4rem)]">
      <Container>
        {breadcrumb && (
          <nav aria-label="breadcrumb" className="mb-6">
            <Link
              href={breadcrumb.href}
              className="font-v2-sans text-v2-xs font-semibold uppercase tracking-wider text-v2-ink-3 transition-colors hover:text-v2-brass-2"
            >
              ← {breadcrumb.label}
            </Link>
          </nav>
        )}

        {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}

        <h1 className="max-w-4xl font-v2-display text-v2-h1 text-balance text-v2-ink">
          {title}
        </h1>

        {lead && (
          <p className="mt-6 max-w-v2-prose font-v2-sans text-v2-lead text-v2-ink-2">
            {lead}
          </p>
        )}

        {children}
      </Container>
    </header>
  );
}

/** Molla de pa en dades estructurades. Va a part perquè no tota pàgina en vol. */
export function V2Breadcrumb({
  locale,
  siteUrl,
  items,
}: {
  locale: string;
  siteUrl: string;
  items: { name: string; path: string }[];
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Cortinatges Esteba",
        item: `${siteUrl}${v2Path(locale)}`,
      },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: `${siteUrl}${item.path}`,
      })),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
