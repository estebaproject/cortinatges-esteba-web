import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ca", "es", "en", "fr"],
  defaultLocale: "ca",
  localePrefix: "as-needed",
});
