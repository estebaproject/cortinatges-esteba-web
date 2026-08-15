"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { PRODUCT_OPTIONS, HONEYPOT_FIELD, LIMITS } from "@/lib/lead";
import { useLeadSubmit } from "@/components/forms/useLeadSubmit";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppIcon } from "./ui/icons";

/**
 * Formulari de pressupost del prototip.
 *
 * REUTILITZA el backend que ja existeix: `useLeadSubmit` i /api/lead, amb el
 * seu esquer antispam, la trampa de temps i l'enviament per Resend. No s'hi
 * duplica ni una línia de lògica — el que canvia és ON està i quina pinta té.
 *
 * DIFERÈNCIA DE FONS amb la v1: allà el formulari viu a una pàgina a part i la
 * portada només hi enllaça. Cada salt de pàgina es menja una part dels que
 * anaven a escriure. Aquí el formulari ÉS el tancament de la portada.
 *
 * Els camps obligatoris els marca el servidor (nom, telèfon, correu, producte i
 * consentiment); la resta és opcional a propòsit, perquè qui encara no ha
 * mesurat res no s'ha d'encallar.
 */
export default function V2LeadForm({
  privacyHref,
  tone = "light",
}: {
  privacyHref: string;
  tone?: "light" | "dark";
}) {
  const t = useTranslations("V2.form");
  const tp = useTranslations("FormBudget.products");
  const tw = useTranslations("Whatsapp");
  const { state, submit, honeypot, setHoneypot } = useLeadSubmit("budget");
  const id = useId();

  const [form, setForm] = useState({
    nom: "",
    telefon: "",
    email: "",
    producte: "",
    missatge: "",
    consent: false,
  });

  const dark = tone === "dark";
  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  if (state === "ok") {
    return (
      <div
        role="status"
        className={`border p-8 ${dark ? "border-v2-paper/25 bg-v2-paper/5" : "border-v2-bone bg-v2-paper"}`}
      >
        <p className={`font-v2-display text-v2-h3 ${dark ? "text-v2-paper" : "text-v2-ink"}`}>
          {t("successTitle")}
        </p>
        <p className={`mt-3 font-v2-sans text-v2-body ${dark ? "text-v2-paper/70" : "text-v2-ink-2"}`}>
          {t("successBody")}
        </p>
      </div>
    );
  }

  const fieldBase = `w-full min-h-[52px] border px-4 font-v2-sans text-v2-body outline-none transition-colors ${
    dark
      ? "border-v2-paper/25 bg-transparent text-v2-paper placeholder:text-v2-paper/35 focus:border-v2-brass"
      : "border-v2-bone bg-white text-v2-ink placeholder:text-v2-ink-3/70 focus:border-v2-brass"
  }`;
  const labelBase = `mb-2 block font-v2-sans text-v2-xs font-semibold uppercase tracking-wider ${
    dark ? "text-v2-paper/60" : "text-v2-ink-2"
  }`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit({
          nom: form.nom,
          telefon: form.telefon,
          email: form.email,
          producte: form.producte,
          missatge: form.missatge,
          consent: form.consent,
        });
      }}
      className="flex flex-col gap-5"
    >
      {/* Esquer antispam. Fora de pantalla i amagat als lectors de pantalla:
          només l'omplen els bots que llegeixen l'HTML. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor={`${id}-hp`}>Empresa</label>
        <input
          id={`${id}-hp`}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-nom`} className={labelBase}>
            {t("name")}
          </label>
          <input
            id={`${id}-nom`}
            className={fieldBase}
            type="text"
            required
            maxLength={LIMITS.nom}
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            value={form.nom}
            onChange={(e) => set("nom", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor={`${id}-tel`} className={labelBase}>
            {t("phone")}
          </label>
          <input
            id={`${id}-tel`}
            className={fieldBase}
            type="tel"
            required
            maxLength={LIMITS.telefon}
            autoComplete="tel"
            inputMode="tel"
            placeholder={t("phonePlaceholder")}
            value={form.telefon}
            onChange={(e) => set("telefon", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-mail`} className={labelBase}>
            {t("email")}
          </label>
          <input
            id={`${id}-mail`}
            className={fieldBase}
            type="email"
            required
            maxLength={LIMITS.email}
            autoComplete="email"
            inputMode="email"
            placeholder={t("emailPlaceholder")}
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>

        <div>
          <label htmlFor={`${id}-prod`} className={labelBase}>
            {t("product")}
          </label>
          <select
            id={`${id}-prod`}
            className={fieldBase}
            required
            value={form.producte}
            onChange={(e) => set("producte", e.target.value)}
          >
            <option value="" disabled>
              {t("productPlaceholder")}
            </option>
            {PRODUCT_OPTIONS.map((opt) => (
              <option key={opt} value={opt} className="text-v2-ink">
                {tp(opt)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-msg`} className={labelBase}>
          {t("message")}{" "}
          <span className="font-normal normal-case tracking-normal opacity-60">
            ({t("optional")})
          </span>
        </label>
        <textarea
          id={`${id}-msg`}
          className={`${fieldBase} min-h-[120px] py-3`}
          rows={4}
          maxLength={LIMITS.missatge}
          placeholder={t("messagePlaceholder")}
          value={form.missatge}
          onChange={(e) => set("missatge", e.target.value)}
        />
      </div>

      <div className="flex items-start gap-3">
        <input
          id={`${id}-consent`}
          type="checkbox"
          required
          checked={form.consent}
          onChange={(e) => set("consent", e.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 accent-v2-brass"
        />
        <label
          htmlFor={`${id}-consent`}
          className={`font-v2-sans text-v2-sm ${dark ? "text-v2-paper/70" : "text-v2-ink-2"}`}
        >
          {t.rich("consent", {
            link: (chunks) => (
              <a
                href={privacyHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-4 hover:text-v2-brass"
              >
                {chunks}
              </a>
            ),
          })}
        </label>
      </div>

      <p className={`font-v2-sans text-v2-xs ${dark ? "text-v2-paper/45" : "text-v2-ink-3"}`}>
        {t("consentNote")}
      </p>

      {state === "error" && (
        <div
          role="alert"
          className={`border p-5 ${dark ? "border-v2-clay/60 bg-v2-clay/10" : "border-v2-clay/40 bg-v2-clay/5"}`}
        >
          <p className={`font-v2-sans text-v2-sm font-semibold ${dark ? "text-v2-paper" : "text-v2-ink"}`}>
            {t("errorTitle")}
          </p>
          <p className={`mt-1.5 font-v2-sans text-v2-sm ${dark ? "text-v2-paper/70" : "text-v2-ink-2"}`}>
            {t("errorBody")}
          </p>
          <a
            href={whatsappUrl(tw("budgetIntro"))}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-[48px] items-center gap-2 bg-v2-green px-5 font-v2-sans text-v2-sm font-semibold text-white"
          >
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className={`mt-2 inline-flex min-h-[56px] items-center justify-center px-8 font-v2-sans text-v2-body font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
          dark
            ? "bg-v2-paper text-v2-ink hover:bg-v2-brass hover:text-v2-paper"
            : "bg-v2-ink text-v2-paper hover:bg-v2-brass-2"
        }`}
      >
        {state === "sending" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
