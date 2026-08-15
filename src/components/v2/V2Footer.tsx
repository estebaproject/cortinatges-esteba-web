import Link from "next/link";
import {
  V2_EMAIL,
  V2_FACEBOOK,
  V2_INSTAGRAM,
  V2_STORES,
  v2Path,
  v2Years,
} from "@/lib/v2/config";
import { publicPath } from "@/lib/site";
import { getV2T } from "@/lib/v2/i18n";
import { FacebookIcon, InstagramIcon } from "./ui/icons";
import { Container } from "./ui/primitives";

/**
 * Peu del prototip v2.
 *
 * Els enllaços LEGALS apunten a les pàgines de la web PUBLICADA (no a /v2): són
 * documents reals i vigents, i duplicar-los al prototip només serviria per
 * tenir dues versions del mateix text legal, que és el pitjor error possible en
 * una pàgina d'avís legal.
 */
export default async function V2Footer({ locale }: { locale: string }) {
  const t = await getV2T(locale, "V2.footer");
  const tn = await getV2T(locale, "V2.nav");

  const explore = [
    { href: v2Path(locale, "colleccions"), label: tn("collections") },
    { href: v2Path(locale, "serveis"), label: tn("services") },
    { href: v2Path(locale, "botigues"), label: tn("stores") },
    { href: v2Path(locale, "pressupost"), label: tn("cta") },
  ];

  const company = [
    { href: v2Path(locale, "el-taller"), label: tn("about") },
    { href: v2Path(locale, "contacte"), label: tn("contact") },
    { href: publicPath("/vols-treballar-amb-nosaltres", locale), label: t("jobs"), external: true },
    { href: `${locale === "ca" ? "" : `/${locale}`}/botiga`, label: tn("shop"), external: true },
  ];

  const legal = [
    { href: publicPath("/privacitat", locale), label: t("privacy") },
    { href: publicPath("/cookies", locale), label: t("cookies") },
    { href: publicPath("/avis-legal", locale), label: t("notice") },
  ];

  return (
    // El filet de llautó de dalt no és decoració: gairebé totes les pàgines
    // acaben amb un bloc de crida a l'acció també fosc, i sense aquesta línia
    // el peu i la crida es fonen en una sola taca de color de mig quilòmetre.
    <footer className="weave border-t-2 border-v2-brass/40 bg-v2-ink text-v2-paper">
      <Container className="py-v2-section-sm">
        <div className="grid gap-12 border-b border-v2-paper/12 pb-14 md:grid-cols-2 lg:grid-cols-4">
          {/* Marca */}
          <div className="lg:col-span-1">
            <p className="font-v2-display text-2xl font-semibold uppercase tracking-[0.2em]">
              Esteba
            </p>
            <p className="mt-1 font-v2-sans text-v2-xs uppercase tracking-[0.28em] text-v2-brass">
              Cortinatges · {v2Years()} anys
            </p>
            <p className="mt-6 max-w-v2-narrow font-v2-sans text-v2-sm text-v2-paper/65">
              {t("tagline")}
            </p>
            <div className="mt-7 flex items-center gap-3">
              <a
                href={V2_INSTAGRAM}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-11 w-11 items-center justify-center border border-v2-paper/20 text-v2-paper/70 transition-colors hover:border-v2-brass hover:text-v2-brass"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href={V2_FACEBOOK}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="inline-flex h-11 w-11 items-center justify-center border border-v2-paper/20 text-v2-paper/70 transition-colors hover:border-v2-brass hover:text-v2-brass"
              >
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          <FooterColumn title={t("explore")} links={explore} />
          <FooterColumn title={t("company")} links={company} />

          {/* Contacte: adreces i telèfons a la vista, no amagats en una pàgina */}
          <div>
            <h2 className="font-v2-sans text-v2-eyebrow font-semibold uppercase text-v2-paper/45">
              {t("contact")}
            </h2>
            <ul className="mt-6 space-y-4" role="list">
              {V2_STORES.slice(0, 3).map((store) => (
                <li key={store.key} className="font-v2-sans text-v2-sm">
                  <span className="block text-v2-paper/85">{store.city}</span>
                  <a
                    href={`tel:${store.phoneTel}`}
                    className="text-v2-paper/55 transition-colors hover:text-v2-brass"
                  >
                    {store.phoneDisplay}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${V2_EMAIL}`}
                  className="font-v2-sans text-v2-sm text-v2-paper/55 transition-colors hover:text-v2-brass"
                >
                  {V2_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-5 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-v2-sans text-v2-xs text-v2-paper/45">
            © {new Date().getFullYear()} Cortinatges Esteba S.L. — {t("rights")}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2" role="list">
            {legal.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="font-v2-sans text-v2-xs text-v2-paper/45 underline-offset-4 transition-colors hover:text-v2-paper hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
}) {
  return (
    <div>
      <h2 className="font-v2-sans text-v2-eyebrow font-semibold uppercase text-v2-paper/45">
        {title}
      </h2>
      <ul className="mt-6 space-y-3.5" role="list">
        {links.map((link) => (
          <li key={link.href}>
            {link.external ? (
              <a
                href={link.href}
                className="font-v2-sans text-v2-sm text-v2-paper/70 transition-colors hover:text-v2-brass"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="font-v2-sans text-v2-sm text-v2-paper/70 transition-colors hover:text-v2-brass"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
