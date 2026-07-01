"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

const EMAIL = "info@cortinatgesesteba.com";

export default function JobsForm() {
  const t = useTranslations("FormJobs");
  const [form, setForm] = useState({ nom: "", telefon: "", email: "", comentaris: "" });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`${t("title")} — ${form.nom}`);
    const body = encodeURIComponent(
      `${t("nom")}: ${form.nom}\n${t("telefon")}: ${form.telefon}\n${t("email")}: ${form.email}\n${t("comentaris")}: ${form.comentaris}\n\n(${t("cv")})`,
    );
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
  };

  const field = "w-full border border-linen-dark bg-canvas px-4 py-3 font-sans text-body-md text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-deep focus:border-accent-deep transition-colors";
  const label = "block font-sans text-body-sm text-ink-muted tracking-wide uppercase mb-2";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
      <div>
        <label htmlFor="nom" className={label}>{t("nom")} *</label>
        <input id="nom" type="text" required value={form.nom} onChange={set("nom")} className={field} />
      </div>
      <div>
        <label htmlFor="telefon" className={label}>{t("telefon")} *</label>
        <input id="telefon" type="tel" required value={form.telefon} onChange={set("telefon")} className={field} />
      </div>
      <div>
        <label htmlFor="email" className={label}>{t("email")} *</label>
        <input id="email" type="email" required value={form.email} onChange={set("email")} className={field} />
      </div>
      <div>
        <label htmlFor="comentaris" className={label}>{t("comentaris")}</label>
        <textarea id="comentaris" rows={4} value={form.comentaris} onChange={set("comentaris")} className={field} />
      </div>
      <p className="font-sans text-body-sm text-ink-muted -mt-1">
        {t("cv")} — <a href={`mailto:${EMAIL}`} className="text-accent-deep underline">{EMAIL}</a>
      </p>
      <button
        type="submit"
        className="inline-flex items-center justify-center px-8 py-4 bg-accent-deep text-canvas font-sans text-xs font-medium tracking-widest uppercase hover:bg-ink transition-colors"
      >
        {t("submit")}
      </button>
    </form>
  );
}
