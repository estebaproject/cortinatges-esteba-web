import { createTranslator, type AbstractIntlMessages } from "next-intl";
import { cache } from "react";
import { V2_DEFAULT_LOCALE, isV2Locale } from "./config";

/**
 * Traduccions del PROTOTIP v2 — NOMÉS per a components de servidor.
 *
 * PER QUÈ NO `getTranslations()`:
 * `getTranslations()` llegeix la configuració de src/i18n.ts, que resol l'idioma
 * a partir del middleware de next-intl. La v2 està FORA d'aquell middleware a
 * propòsit (vegeu el matcher de src/middleware.ts), així que allà dins no hi ha
 * idioma de petició i `getTranslations()` cauria sempre al català.
 *
 * PER QUÈ ELS TEXTOS NOUS NO VAN A messages/{locale}.json:
 * next-intl serialitza TOT l'objecte `messages` cap al client. Si el copy de la
 * v2 visqués als fitxers actuals, viatjaria a cada pàgina de la web de
 * producció encara que allà no es faci servir mai. Viu a messages/v2/ i només
 * es carrega sota /v2.
 *
 * Les dades de FET (noms de producte, adreces, textos de servei) NO es dupliquen:
 * es llegeixen dels namespaces que ja existeixen, fusionats aquí sota la mateixa
 * arrel. Per això `messages/v2/*.json` només conté el que és nou de la v2.
 */
export const getV2Messages = cache(async (locale: string) => {
  const safe = isV2Locale(locale) ? locale : V2_DEFAULT_LOCALE;
  const [base, v2] = await Promise.all([
    import(`../../../messages/${safe}.json`),
    import(`../../../messages/v2/${safe}.json`),
  ]);
  return { ...base.default, V2: v2.default } as AbstractIntlMessages;
});

/**
 * Traductor d'un namespace. `namespace` accepta punts ("V2.home.hero"), igual
 * que `getTranslations()`.
 */
export async function getV2T(locale: string, namespace?: string) {
  const messages = await getV2Messages(locale);
  const safe = isV2Locale(locale) ? locale : V2_DEFAULT_LOCALE;
  return createTranslator({
    locale: safe,
    messages: messages as never,
    namespace: namespace as never,
    // Una clau que falti no ha de tombar la pàgina del prototip: es pinta la
    // pròpia clau, que a la pantalla es veu de seguida i és fàcil de trobar.
    onError: () => {},
    getMessageFallback: ({ key }) => key,
  });
}
