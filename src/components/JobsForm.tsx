"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { CONTACT_EMAIL } from "@/lib/site";
import { useLeadSubmit } from "@/components/forms/useLeadSubmit";
import {
  ConsentField,
  ErrorPanel,
  Honeypot,
  SuccessPanel,
  fieldClass,
  labelClass,
} from "@/components/forms/LeadFormParts";

/**
 * Formulari de "vols treballar amb nosaltres". Mateixos camps que abans; l'únic
 * canvi és que l'enviament va pel SERVIDOR (/api/lead → Resend → info@) en
 * comptes d'obrir un `mailto:`, que fallava en silenci a qualsevol navegador
 * sense client de correu configurat.
 *
 * El CV se segueix demanant per correu a part: no hi ha pujada de fitxers, ni
 * al WordPress ni aquí. Per això l'enllaç `mailto:` d'aquesta nota es manté.
 */
export default function JobsForm() {
  const t = useTranslations("FormJobs");
  const { state, submit, honeypot, setHoneypot } = useLeadSubmit("jobs");

  const [form, setForm] = useState({ nom: "", telefon: "", email: "", missatge: "" });
  const [consent, setConsent] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [k]: e.target.value });

  const waMessage =
    `Hola! ${t("title")}.\n\n` +
    `${t("nom")}: ${form.nom}\n${t("telefon")}: ${form.telefon}\n` +
    `${t("email")}: ${form.email}\n` +
    (form.missatge ? `${t("comentaris")}: ${form.missatge}` : "");

  if (state === "ok") {
    return <SuccessPanel namespace="FormJobs" message={waMessage} />;
  }

  const enviant = state === "sending";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit({ ...form, consent });
      }}
      className="relative flex flex-col gap-5 max-w-xl"
    >
      <Honeypot value={honeypot} onChange={setHoneypot} />

      <div>
        <label htmlFor="nom" className={labelClass}>{t("nom")}</label>
        <input id="nom" type="text" required autoComplete="name" value={form.nom} onChange={set("nom")} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="telefon" className={labelClass}>{t("telefon")}</label>
        <input id="telefon" type="tel" required autoComplete="tel" value={form.telefon} onChange={set("telefon")} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>{t("email")}</label>
        <input id="email" type="email" required autoComplete="email" value={form.email} onChange={set("email")} className={fieldClass} />
      </div>

      <div>
        <label htmlFor="missatge" className={labelClass}>
          {t("comentaris")}{" "}
          <span className="normal-case tracking-normal text-ink-faint">({t("opcional")})</span>
        </label>
        <textarea id="missatge" rows={4} value={form.missatge} onChange={set("missatge")} className={fieldClass} />
      </div>

      <p className="font-sans text-body-sm text-ink-muted -mt-1">
        {t("cv")} —{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent-deep underline">
          {CONTACT_EMAIL}
        </a>
      </p>

      <ConsentField namespace="FormJobs" checked={consent} onChange={setConsent} />

      {state === "error" && <ErrorPanel namespace="FormJobs" message={waMessage} />}

      <button
        type="submit"
        disabled={enviant}
        className="inline-flex items-center justify-center px-8 py-4 bg-accent-deep text-canvas font-sans text-xs font-medium tracking-widest uppercase hover:bg-ink transition-colors disabled:opacity-60 disabled:cursor-not-allowed self-start"
      >
        {enviant ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
