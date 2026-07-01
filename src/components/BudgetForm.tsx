"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { whatsappUrl } from "@/lib/whatsapp";

const EMAIL = "info@cortinatgesesteba.com";

export default function BudgetForm() {
  const t = useTranslations("FormBudget");
  const [form, setForm] = useState({ nom: "", telefon: "", email: "", observacions: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `Hola! Voldria demanar pressupost.\n\n${t("nom")}: ${form.nom}\n${t("telefon")}: ${form.telefon}\n${t("email")}: ${form.email}\n${t("observacions")}: ${form.observacions}`;
    window.open(whatsappUrl(msg), "_blank", "noopener");
  };

  const field = "w-full border border-linen-dark bg-canvas px-4 py-3 font-sans text-body-md text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep focus:border-accent-deep transition-colors";
  const label = "block font-sans text-body-sm text-ink-muted tracking-wide uppercase mb-2";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
      <div>
        <label htmlFor="nom" className={label}>{t("nom")}</label>
        <input id="nom" type="text" required value={form.nom} onChange={set("nom")} className={field} />
      </div>
      <div>
        <label htmlFor="telefon" className={label}>{t("telefon")}</label>
        <input id="telefon" type="tel" required value={form.telefon} onChange={set("telefon")} className={field} />
      </div>
      <div>
        <label htmlFor="email" className={label}>{t("email")}</label>
        <input id="email" type="email" value={form.email} onChange={set("email")} className={field} />
      </div>
      <div>
        <label htmlFor="observacions" className={label}>{t("observacions")}</label>
        <textarea id="observacions" rows={4} value={form.observacions} onChange={set("observacions")} className={field} />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center px-8 py-4 bg-accent-deep text-canvas font-sans text-xs font-medium tracking-widest uppercase hover:bg-ink transition-colors"
      >
        {t("submit")}
      </button>
      <p className="font-sans text-body-sm text-ink-muted">
        {t("or")}{" "}
        <a href={`mailto:${EMAIL}`} className="text-accent-deep hover:text-ink underline">
          {EMAIL}
        </a>
      </p>
    </form>
  );
}
