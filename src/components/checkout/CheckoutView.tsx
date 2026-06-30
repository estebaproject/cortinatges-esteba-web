"use client";

// Vista de checkout (client) de la botiga ESTEBA.
//
// Compleix la informació precontractual obligatoria ABANS del pagament
// (DOCUMENTS/legal/flujo-checkout.md):
//   - Resum de comanda amb PVP (IVA inclòs) per línia + subtotal. MAI cost.
//   - Cost d'enviament + TOTAL amb IVA (src/lib/shipping.ts — xifres PLACEHOLDER).
//   - Termini d'entrega visible abans de pagar.
//   - Identitat i contacte del venedor.
//   - Checkboxes obligatoris NO premarcats (C1 condicions, C2 privacitat).
//     C3 (exclusió desistiment) queda estructurat però desactivat: ara només
//     es ven mobiliari en stock. S'activa si el cistell porta producte per encàrrec.
// El botó de pagament està bloquejat fins que el formulari és vàlid i els
// checkboxes obligatoris estan marcats. El pagament és un STUB (src/lib/payment.ts).

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useCart } from "@/components/cart/CartProvider";
import { calculateShipping } from "@/lib/shipping";
import { initiatePayment, type OrderDraft } from "@/lib/payment";
import { persistOrder } from "@/lib/order";
import {
  buildConsentSnapshot,
  persistConsentSnapshot,
  type ConsentType,
} from "@/lib/consent";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

const ORDER_SNAPSHOT_KEY = "esteba-order-snapshot";

type FormState = {
  nom: string;
  cognoms: string;
  email: string;
  telefon: string;
  adreca: string;
  poblacio: string;
  cp: string;
  pais: string;
};

const EMPTY_FORM: FormState = {
  nom: "",
  cognoms: "",
  email: "",
  telefon: "",
  adreca: "",
  poblacio: "",
  cp: "",
  pais: "",
};

export default function CheckoutView() {
  const t = useTranslations("Checkout");
  const tCart = useTranslations("Cart");
  const locale = useLocale();
  const router = useRouter();
  const { lines, subtotal, hydrated } = useCart();
  const prefix = locale === "ca" ? "" : `/${locale}`;

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [accepts, setAccepts] = useState<Record<ConsentType, boolean>>({
    terms: false,
    privacy: false,
    withdrawal_exclusion: false,
    marketing: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState(false);

  const fmtPrice = (n: number) =>
    `${n.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} €`;

  const shipping = useMemo(() => calculateShipping(subtotal), [subtotal]);
  const total = subtotal + shipping.cost;

  // C3 només cal si el cistell conté algun producte per encàrrec. Ara mateix la
  // botiga només ven mobiliari en stock, així que no hi ha cap línia "per
  // encàrrec" i C3 resta desactivat. L'estructura queda preparada: el dia que
  // el carrito porti aquesta marca, n'hi ha prou amb derivar-la aquí.
  const hasMadeToOrder = false;

  // Validació bàsica del formulari.
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
  const phoneOk = /^[+\d][\d\s().-]{5,}$/.test(form.telefon.trim());
  const requiredFilled =
    form.nom.trim() !== "" &&
    form.cognoms.trim() !== "" &&
    form.adreca.trim() !== "" &&
    form.poblacio.trim() !== "" &&
    form.cp.trim() !== "" &&
    form.pais.trim() !== "";
  const formValid = requiredFilled && emailOk && phoneOk;

  const consentsOk =
    accepts.terms && accepts.privacy && (!hasMadeToOrder || accepts.withdrawal_exclusion);

  const canPay = hydrated && lines.length > 0 && formValid && consentsOk && !submitting;

  const update =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const toggle = (type: ConsentType) => () =>
    setAccepts((prev) => ({ ...prev, [type]: !prev[type] }));

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canPay) return;
    setOrderError(false);
    setSubmitting(true);

    const orderLines = lines.map((l) => ({
      slug: l.slug,
      nom: l.nom,
      pvp: l.pvp, // PVP públic, IVA inclòs. MAI cost.
      qty: l.qty,
      href: l.href, // per DERIVAR el SKU de variant a persistOrder.
    }));

    // Captura del consentiment (client-side; IP + prova servidor-side pendents).
    // El `numero` real l'assigna persistOrder; el snapshot client-side fa servir
    // una referència provisional només com a identificador del registre local.
    const consentRef = `ESTEBA-${Date.now().toString(36).toUpperCase()}`;
    const snapshot = buildConsentSnapshot(consentRef, {
      terms: accepts.terms,
      privacy: accepts.privacy,
      ...(hasMadeToOrder
        ? { withdrawal_exclusion: accepts.withdrawal_exclusion }
        : {}),
      marketing: accepts.marketing,
    });

    // 1) PERSISTÈNCIA a l'ERP (Supabase) ABANS del pagament. Genera id + numero
    //    al client i insereix cabecera + línies. Si falla, mostrem error i NO
    //    continuem (ni buidem el cistell): l'usuari pot reintentar.
    let numero: string;
    try {
      const persisted = await persistOrder({
        customer: form,
        lines: orderLines,
        subtotal,
        shipping: shipping.cost,
        total,
        consent: snapshot,
        idioma: locale,
      });
      numero = persisted.numero;
    } catch {
      setOrderError(true);
      setSubmitting(false);
      return;
    }

    // A partir d'aquí la comanda ja és a la BD amb el seu `numero` real.
    persistConsentSnapshot(snapshot);

    const order: OrderDraft = {
      reference: numero,
      lines: orderLines,
      subtotal,
      shipping: shipping.cost,
      total,
      currency: "EUR",
    };

    // Snapshot de la comanda perquè la pàgina de confirmació la pugui mostrar
    // després de buidar el cistell.
    try {
      sessionStorage.setItem(
        ORDER_SNAPSHOT_KEY,
        JSON.stringify({ order, customer: form, consent: snapshot }),
      );
    } catch {
      /* no-op: la confirmació es degrada a un missatge genèric. */
    }

    // 2) STUB de pagament. La comanda queda `pendent_pagament` a la BD.
    const result = await initiatePayment(order);

    // STUB: no hi ha passarel·la. Si un dia retorna redirectUrl (Redsys),
    // redirigim allà; mentrestant anem a confirmació amb el flag d'estat.
    if (result.redirectUrl) {
      window.location.href = result.redirectUrl;
      return;
    }
    router.push(`${prefix}/checkout/confirmacio?estat=${result.status}&ref=${numero}`);
  };

  if (!hydrated) {
    return (
      <p className="font-sans text-body-md text-ink-muted" role="status" aria-live="polite">
        {tCart("loading")}
      </p>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="border border-linen bg-canvas-warm p-10 md:p-16 text-center">
        <p className="font-serif text-display-md text-ink mb-3">{t("emptyTitle")}</p>
        <p className="font-sans text-body-md text-ink-muted mb-8 max-w-prose-editorial mx-auto">
          {t("emptyBody")}
        </p>
        <Link
          href={`${prefix}/mobiliari`}
          className="inline-flex items-center justify-center px-6 py-4 bg-ink text-canvas font-sans text-body-md font-semibold hover:bg-accent-deep transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {t("emptyCta")}
        </Link>
      </div>
    );
  }

  const inputClass =
    "w-full border border-linen bg-canvas px-4 py-3 font-sans text-body-md text-ink placeholder:text-ink-faint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ink";
  const labelClass = "block font-sans text-body-sm font-medium text-ink mb-2";

  return (
    <form
      onSubmit={handlePay}
      className="grid lg:grid-cols-[1fr_24rem] gap-10 lg:gap-16 items-start"
    >
      {/* Columna esquerra: dades del client + enviament + consentiments */}
      <div className="space-y-12">
        {/* Dades del client + enviament */}
        <section>
          <h2 className="font-serif text-display-md text-ink mb-6">
            {t("customerHeading")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="nom" className={labelClass}>
                {t("fieldNom")}
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                autoComplete="given-name"
                required
                value={form.nom}
                onChange={update("nom")}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="cognoms" className={labelClass}>
                {t("fieldCognoms")}
              </label>
              <input
                id="cognoms"
                name="cognoms"
                type="text"
                autoComplete="family-name"
                required
                value={form.cognoms}
                onChange={update("cognoms")}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                {t("fieldEmail")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={update("email")}
                className={inputClass}
                aria-invalid={form.email !== "" && !emailOk}
              />
              {form.email !== "" && !emailOk && (
                <p className="mt-1.5 font-sans text-body-sm text-accent-deep">
                  {t("errorEmail")}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="telefon" className={labelClass}>
                {t("fieldTelefon")}
              </label>
              <input
                id="telefon"
                name="telefon"
                type="tel"
                autoComplete="tel"
                required
                value={form.telefon}
                onChange={update("telefon")}
                className={inputClass}
                aria-invalid={form.telefon !== "" && !phoneOk}
              />
              {form.telefon !== "" && !phoneOk && (
                <p className="mt-1.5 font-sans text-body-sm text-accent-deep">
                  {t("errorTelefon")}
                </p>
              )}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="adreca" className={labelClass}>
                {t("fieldAdreca")}
              </label>
              <input
                id="adreca"
                name="adreca"
                type="text"
                autoComplete="street-address"
                required
                value={form.adreca}
                onChange={update("adreca")}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="poblacio" className={labelClass}>
                {t("fieldPoblacio")}
              </label>
              <input
                id="poblacio"
                name="poblacio"
                type="text"
                autoComplete="address-level2"
                required
                value={form.poblacio}
                onChange={update("poblacio")}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="cp" className={labelClass}>
                {t("fieldCp")}
              </label>
              <input
                id="cp"
                name="cp"
                type="text"
                inputMode="numeric"
                autoComplete="postal-code"
                required
                value={form.cp}
                onChange={update("cp")}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="pais" className={labelClass}>
                {t("fieldPais")}
              </label>
              <input
                id="pais"
                name="pais"
                type="text"
                autoComplete="country-name"
                required
                value={form.pais}
                onChange={update("pais")}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Identitat del venedor (informació precontractual: arts. 97.1.b/c) */}
        <section className="border border-linen bg-canvas-warm p-6">
          <h2 className="font-serif text-body-lg text-ink mb-3">
            {t("sellerHeading")}
          </h2>
          <p className="font-sans text-body-sm text-ink-muted leading-relaxed">
            {SITE_NAME}
            <br />
            {t("sellerContact", { email: CONTACT_EMAIL, phone: WHATSAPP_NUMBER })}
            <br />
            <Link
              href={`${prefix}/avis-legal`}
              className="text-accent-deep hover:text-ink underline transition-colors"
            >
              {t("sellerLegalLink")}
            </Link>
          </p>
        </section>

        {/* Consentiments legals — checkboxes obligatoris NO premarcats */}
        <section>
          <h2 className="font-serif text-display-md text-ink mb-6">
            {t("consentHeading")}
          </h2>
          <div className="space-y-4">
            {/* C1 — Condicions de venda / contractació + enviaments + devolucions */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={accepts.terms}
                onChange={toggle("terms")}
                required
                className="mt-1 accent-ink w-4 h-4 shrink-0"
              />
              <span className="font-sans text-body-sm text-ink leading-relaxed">
                {t.rich("consentTerms", {
                  terms: (chunks) => (
                    <Link
                      href={`${prefix}/avis-legal`}
                      className="text-accent-deep hover:text-ink underline transition-colors"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </span>
            </label>

            {/* C2 — Privacitat */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={accepts.privacy}
                onChange={toggle("privacy")}
                required
                className="mt-1 accent-ink w-4 h-4 shrink-0"
              />
              <span className="font-sans text-body-sm text-ink leading-relaxed">
                {t.rich("consentPrivacy", {
                  privacy: (chunks) => (
                    <Link
                      href={`${prefix}/privacitat`}
                      className="text-accent-deep hover:text-ink underline transition-colors"
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </span>
            </label>

            {/* C3 — Exclusió desistiment: només si hi ha producte per encàrrec.
                Ara desactivat (només mobiliari en stock). Estructura preparada. */}
            {hasMadeToOrder && (
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={accepts.withdrawal_exclusion}
                  onChange={toggle("withdrawal_exclusion")}
                  required
                  className="mt-1 accent-ink w-4 h-4 shrink-0"
                />
                <span className="font-sans text-body-sm text-ink leading-relaxed">
                  {t("consentWithdrawal")}
                </span>
              </label>
            )}

            {/* C4 — Màrqueting (opcional) */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={accepts.marketing}
                onChange={toggle("marketing")}
                className="mt-1 accent-ink w-4 h-4 shrink-0"
              />
              <span className="font-sans text-body-sm text-ink-muted leading-relaxed">
                {t("consentMarketing")}
              </span>
            </label>
          </div>
        </section>
      </div>

      {/* Columna dreta: resum de comanda + enviament + total + pagar */}
      <aside className="lg:sticky lg:top-28 border border-linen bg-canvas-warm p-6 sm:p-8">
        <h2 className="font-serif text-display-md text-ink mb-6">
          {t("summaryHeading")}
        </h2>

        {/* Resum de línies */}
        <ul className="border-t border-linen divide-y divide-linen mb-6" role="list">
          {lines.map((line) => (
            <li key={line.slug} className="flex justify-between gap-4 py-4">
              <div className="min-w-0">
                <p className="font-serif text-body-md text-ink truncate">{line.nom}</p>
                <p className="font-sans text-body-sm text-ink-muted mt-0.5 tabular-nums">
                  {line.qty} × {fmtPrice(line.pvp)}
                </p>
              </div>
              <p className="font-sans text-body-md text-ink font-semibold tabular-nums shrink-0">
                {fmtPrice(line.pvp * line.qty)}
              </p>
            </li>
          ))}
        </ul>

        {/* Subtotal + enviament + total */}
        <dl className="space-y-2 border-t border-linen pt-5">
          <div className="flex justify-between items-baseline">
            <dt className="font-sans text-body-md text-ink-muted">{t("subtotal")}</dt>
            <dd className="font-sans text-body-md text-ink tabular-nums">
              {fmtPrice(subtotal)}
            </dd>
          </div>
          <div className="flex justify-between items-baseline">
            <dt className="font-sans text-body-md text-ink-muted">{t("shipping")}</dt>
            <dd className="font-sans text-body-md text-ink tabular-nums">
              {shipping.isFree ? t("shippingFree") : fmtPrice(shipping.cost)}
            </dd>
          </div>
          {!shipping.isFree && shipping.remainingForFree > 0 && (
            <p className="font-sans text-body-sm text-ink-faint">
              {t("shippingRemaining", {
                amount: fmtPrice(shipping.remainingForFree),
              })}
            </p>
          )}
          <div className="flex justify-between items-baseline border-t border-linen pt-3 mt-1">
            <dt className="font-serif text-body-lg text-ink">{t("total")}</dt>
            <dd className="font-serif text-display-md text-ink tabular-nums">
              {fmtPrice(total)}
            </dd>
          </div>
        </dl>
        <p className="font-sans text-body-sm text-ink-faint mt-2">{t("taxNote")}</p>

        {/* Placeholder de xifres d'enviament: avís intern visible al client */}
        <p className="font-sans text-body-sm text-ink-faint mt-1">
          {t("shippingPlaceholderNote")}
        </p>

        {/* Termini d'entrega — requisit legal: visible ABANS de pagar */}
        <div className="mt-6 flex items-start gap-2.5 border-t border-linen pt-5">
          <svg
            className="w-4 h-4 mt-0.5 shrink-0 text-ink-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <p className="font-sans text-body-sm text-ink-muted">
            <span className="text-ink font-medium">{t("deliveryHeading")}: </span>
            {t("deliveryNote")}
          </p>
        </div>

        {/* Botó de pagament — etiquetatge inequívoc (art. 98.2) */}
        <button
          type="submit"
          disabled={!canPay}
          className="mt-6 flex items-center justify-center w-full px-6 py-4 bg-ink text-canvas font-sans text-body-md font-semibold tracking-wide hover:bg-accent-deep transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {submitting ? t("paying") : t("payButton")}
        </button>

        {!consentsOk && (
          <p className="mt-3 font-sans text-body-sm text-ink-faint" aria-live="polite">
            {t("consentRequiredHint")}
          </p>
        )}

        {orderError && (
          <p
            className="mt-3 font-sans text-body-sm text-accent-deep"
            role="alert"
            aria-live="assertive"
          >
            {t("orderError")}
          </p>
        )}

        {/* Avís STUB: el pagament encara no està connectat */}
        <p className="mt-4 font-sans text-body-sm text-ink-faint border-t border-linen pt-4">
          {t("paymentStubNote")}
        </p>

        <Link
          href={`${prefix}/cistell`}
          className="mt-5 inline-block font-sans text-body-sm text-accent-deep hover:text-ink transition-colors"
        >
          {t("backToCart")}
        </Link>
      </aside>
    </form>
  );
}
