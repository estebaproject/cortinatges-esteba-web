import { redirect } from "next/navigation";
import { getLocale } from "next-intl/server";

// La graella de productes ja viu a la home (#productes). Aquesta ruta hi redirigeix
// per evitar duplicar el contingut; les fitxes /colleccions/[slug] segueixen actives.
export default async function CollectionsRedirect() {
  const locale = await getLocale();
  redirect(locale === "ca" ? "/#productes" : `/${locale}/#productes`);
}
