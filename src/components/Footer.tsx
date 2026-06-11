import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";

export default async function Footer() {
  const t = await getTranslations("Footer");
  const locale = await getLocale();
  const prefix = locale === "ca" ? "" : `/${locale}`;

  const stores = [
    {
      city: "Girona",
      address: "C/ Rutlla, 11 · 17002",
      phone: "972 20 34 23",
    },
    {
      city: "Blanes",
      address: "Rambla Joaquim Ruyra, 59 · 17300",
      phone: "972 33 05 73",
    },
    {
      city: "Palamós",
      address: "C/ Miguel de Cervantes, 35",
      phone: "972 31 62 19",
    },
    {
      city: "Matalasseria",
      address: "C/ Rutlla, 20 · Girona",
      phone: "972 20 34 23",
    },
  ];

  return (
    <footer className="bg-ink text-canvas" aria-label="Peu de pàgina">
      <div className="max-w-layout mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href={prefix || "/"} className="block mb-4" aria-label="Cortinatges Esteba — inici">
              <span className="font-serif text-xl text-canvas block">Cortinatges Esteba</span>
              <span className="font-sans text-xs text-stone-warm tracking-widest uppercase">
                Des de 1961
              </span>
            </Link>
            <p className="font-sans text-body-sm text-stone-warm leading-relaxed mt-4">
              {t("tagline")}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://www.instagram.com/cortinatgesesteba/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-stone-warm hover:text-canvas transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 4.32a5.52 5.52 0 100 11.04 5.52 5.52 0 000-11.04zm0 9.1a3.58 3.58 0 110-7.16 3.58 3.58 0 010 7.16zm7.03-9.32a1.29 1.29 0 11-2.58 0 1.29 1.29 0 012.58 0z" />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/CortinatgesEsteba"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-stone-warm hover:text-canvas transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.08 24 18.09 24 12.07z" />
                </svg>
              </a>
            </div>
          </div>

          {stores.map((store) => (
            <div key={store.city}>
              <h3 className="font-sans text-body-sm font-medium text-canvas tracking-widest uppercase mb-4">
                {store.city}
              </h3>
              <address className="not-italic font-sans text-body-sm text-stone-warm leading-relaxed">
                <p>{store.address}</p>
                <p className="mt-2">
                  <a
                    href={`tel:${store.phone.replace(/\s/g, "")}`}
                    className="hover:text-canvas transition-colors"
                  >
                    {store.phone}
                  </a>
                </p>
              </address>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-ink-muted flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <p className="font-sans text-body-sm text-stone-warm">
            &copy; {new Date().getFullYear()} Cortinatges Esteba. {t("rights")}
          </p>
          <nav aria-label="Enllaços del peu">
            <ul className="flex flex-wrap gap-6" role="list">
              <li>
                <Link
                  href={`${prefix}/serveis`}
                  className="font-sans text-body-sm text-stone-warm hover:text-canvas transition-colors"
                >
                  {t("services")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${prefix}/demana-pressupost`}
                  className="font-sans text-body-sm text-stone-warm hover:text-canvas transition-colors"
                >
                  {t("budget")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${prefix}/vols-treballar-amb-nosaltres`}
                  className="font-sans text-body-sm text-stone-warm hover:text-canvas transition-colors"
                >
                  {t("jobs")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${prefix}/privacitat`}
                  className="font-sans text-body-sm text-stone-warm hover:text-canvas transition-colors"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${prefix}/cookies`}
                  className="font-sans text-body-sm text-stone-warm hover:text-canvas transition-colors"
                >
                  {t("cookies")}
                </Link>
              </li>
              <li>
                <Link
                  href={`${prefix}/avis-legal`}
                  className="font-sans text-body-sm text-stone-warm hover:text-canvas transition-colors"
                >
                  {t("legal")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
