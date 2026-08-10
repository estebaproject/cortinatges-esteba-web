"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { publicPath } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";
import { HONEYPOT_FIELD } from "@/lib/lead";

export const fieldClass =
  "w-full border border-linen-dark bg-canvas px-4 py-3 font-sans text-body-md text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep focus:border-accent-deep transition-colors";
export const labelClass =
  "block font-sans text-body-sm text-ink-muted tracking-wide uppercase mb-2";

/**
 * Camp esquer (honeypot). Ha de ser INVISIBLE per a l'usuari però omplible per
 * a un bot: per això no es fa servir `display:none` ni `hidden`, que molts bots
 * ja detecten. Queda fora de pantalla i exclòs del focus i dels lectors.
 */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden">
      <label htmlFor={HONEYPOT_FIELD}>Empresa</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

/** Casella de consentiment: obligatòria i DESMARCADA per defecte. */
export function ConsentField({
  namespace,
  checked,
  onChange,
}: {
  namespace: "FormBudget" | "FormJobs";
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const t = useTranslations(namespace);
  const locale = useLocale();

  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          required
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-accent-deep"
        />
        <span className="font-sans text-body-sm text-ink-muted">
          {t.rich("consent", {
            link: (chunks) => (
              <Link
                href={publicPath("/privacitat", locale)}
                className="text-accent-deep underline hover:text-ink"
              >
                {chunks}
              </Link>
            ),
          })}
        </span>
      </label>
      <p className="font-sans text-body-sm text-ink-faint pl-7">{t("consentNote")}</p>
    </div>
  );
}

/** Botó de WhatsApp. Conserva el número i el missatge pregenerat d'abans. */
export function WhatsappButton({
  namespace,
  message,
}: {
  namespace: "FormBudget" | "FormJobs";
  message: string;
}) {
  const t = useTranslations(namespace);
  return (
    <a
      href={whatsappUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-sans text-xs font-semibold tracking-widest uppercase hover:brightness-95 transition-all"
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 018.413 3.488 11.824 11.824 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 001.518 5.26l-.999 3.648 3.97-1.042z" />
      </svg>
      {t("whatsapp")}
    </a>
  );
}

/** Pantalla de confirmació: substitueix el formulari quan s'ha enviat bé. */
export function SuccessPanel({
  namespace,
  message,
}: {
  namespace: "FormBudget" | "FormJobs";
  message: string;
}) {
  const t = useTranslations(namespace);
  return (
    <div className="max-w-xl border border-linen bg-canvas-warm p-8" role="status" aria-live="polite">
      <p className="font-serif text-display-md text-ink mb-3">{t("successTitle")}</p>
      <p className="font-sans text-body-md text-ink-muted mb-7">{t("successBody")}</p>
      <WhatsappButton namespace={namespace} message={message} />
    </div>
  );
}

/** Avís d'error. NO substitueix el formulari: les dades s'han de conservar. */
export function ErrorPanel({
  namespace,
  message,
}: {
  namespace: "FormBudget" | "FormJobs";
  message: string;
}) {
  const t = useTranslations(namespace);
  return (
    <div
      className="border border-accent-deep/40 bg-canvas-warm p-6 flex flex-col gap-4"
      role="alert"
      aria-live="assertive"
    >
      <div>
        <p className="font-sans text-body-md text-ink font-medium mb-1">{t("errorTitle")}</p>
        <p className="font-sans text-body-sm text-ink-muted">{t("errorBody")}</p>
      </div>
      <div>
        <WhatsappButton namespace={namespace} message={message} />
      </div>
    </div>
  );
}
