"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PRODUCT_OPTIONS } from "@/lib/lead";
import { useLeadSubmit } from "@/components/forms/useLeadSubmit";
import {
  ConsentField,
  ErrorPanel,
  Honeypot,
  SuccessPanel,
  WhatsappButton,
  fieldClass,
  labelClass,
} from "@/components/forms/LeadFormParts";

/**
 * Formulari de pressupost. Rèplica del que hi havia al WordPress
 * (/ca/contacte/): nom, telèfon, correu, tipus de producte, mides i missatge.
 *
 * DIFERÈNCIA VOLGUDA respecte al WordPress: les mides són OPCIONALES. Al
 * WordPress eren obligatòries i frenaven qui encara no ha mesurat.
 *
 * L'enviament ara va pel SERVIDOR (/api/lead → Resend → info@). Abans el botó
 * d'enviar obria WhatsApp i prou; per això WhatsApp passa a ser un botó
 * secundari explícit, amb el mateix missatge pregenerat de sempre.
 */
export default function BudgetForm() {
  const t = useTranslations("FormBudget");
  const tw = useTranslations("Whatsapp");
  const { state, submit, honeypot, setHoneypot } = useLeadSubmit("budget");

  const [form, setForm] = useState({
    nom: "",
    telefon: "",
    email: "",
    producte: "",
    mides: "",
    missatge: "",
  });
  const [consent, setConsent] = useState(false);

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm({ ...form, [k]: e.target.value });

  // Missatge pregenerat de WhatsApp: aprofita el que l'usuari ja hagi escrit.
  const waMessage =
    `${tw("budgetIntro")}\n\n` +
    `${t("nom")}: ${form.nom}\n${t("telefon")}: ${form.telefon}\n` +
    `${t("email")}: ${form.email}\n` +
    (form.producte ? `${tw("product")}: ${t(`products.${form.producte}` as never)}\n` : "") +
    (form.mides ? `${t("mides")}: ${form.mides}\n` : "") +
    (form.missatge ? `${t("missatge")}: ${form.missatge}` : "");

  if (state === "ok") {
    return <SuccessPanel namespace="FormBudget" message={waMessage} />;
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
        <label htmlFor="producte" className={labelClass}>{t("producte")}</label>
        <select id="producte" required value={form.producte} onChange={set("producte")} className={fieldClass}>
          <option value="">{t("productePlaceholder")}</option>
          {PRODUCT_OPTIONS.map((clau) => (
            <option key={clau} value={clau}>
              {t(`products.${clau}` as never)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="mides" className={labelClass}>
          {t("mides")}{" "}
          <span className="normal-case tracking-normal text-ink-faint">({t("opcional")})</span>
        </label>
        <input id="mides" type="text" value={form.mides} onChange={set("mides")} className={fieldClass} />
        <p className="font-sans text-body-sm text-ink-faint mt-2">{t("midesHint")}</p>
      </div>

      <div>
        <label htmlFor="missatge" className={labelClass}>
          {t("missatge")}{" "}
          <span className="normal-case tracking-normal text-ink-faint">({t("opcional")})</span>
        </label>
        <textarea id="missatge" rows={4} value={form.missatge} onChange={set("missatge")} className={fieldClass} />
      </div>

      <ConsentField namespace="FormBudget" checked={consent} onChange={setConsent} />

      {state === "error" && <ErrorPanel namespace="FormBudget" message={waMessage} />}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          disabled={enviant}
          className="inline-flex items-center justify-center px-8 py-4 bg-accent-deep text-canvas font-sans text-xs font-medium tracking-widest uppercase hover:bg-ink transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {enviant ? t("submitting") : t("submit")}
        </button>
        <WhatsappButton namespace="FormBudget" message={waMessage} />
      </div>
    </form>
  );
}
