"use client";

// Pàgina de confirmació del checkout (client) de la botiga ESTEBA.
//
// Es mostra després de prémer "Pagar". Com que el pagament és un STUB
// (src/lib/payment.ts), aquí NO hi ha cap cobrament real: mostrem un missatge
// que la comanda ha quedat REGISTRADA però PENDENT de connexió de pagament.
//
// Llegeix el snapshot de la comanda desat a sessionStorage pel checkout (perquè
// el cistell ja s'haurà buidat) i el mostra. Buida el cistell en muntar.
//
// FALTA PER A PRODUCCIÓ (requereix backend):
//   - L'email de confirmació en suport durador (art. 98.7) l'ha d'enviar el
//     servidor després de la confirmació real de pagament (Redsys), no el client.

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import type { OrderDraft } from "@/lib/payment";

const ORDER_SNAPSHOT_KEY = "esteba-order-snapshot";

type Snapshot = {
  order: OrderDraft;
  customer: { nom: string; cognoms: string; email: string };
};

export default function ConfirmacioView() {
  const t = useTranslations("Checkout");
  const locale = useLocale();
  const params = useSearchParams();
  const { clear } = useCart();
  const prefix = locale === "ca" ? "" : `/${locale}`;

  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [ready, setReady] = useState(false);

  const estat = params.get("estat") ?? "";
  const refFromUrl = params.get("ref") ?? "";

  // En muntar: recupera el snapshot i buida el cistell (la comanda ja és en curs).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ORDER_SNAPSHOT_KEY);
      if (raw) setSnapshot(JSON.parse(raw) as Snapshot);
    } catch {
      /* no-op: degradem a missatge genèric */
    }
    clear();
    setReady(true);
  }, [clear]);

  const fmtPrice = (n: number) =>
    `${n.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} €`;

  const reference = snapshot?.order.reference ?? refFromUrl;
  const isPending = estat === "pendent_integracio" || estat === "";

  const lines = useMemo(() => snapshot?.order.lines ?? [], [snapshot]);

  if (!ready) {
    return (
      <p className="font-sans text-body-md text-ink-muted" role="status" aria-live="polite">
        {t("confLoading")}
      </p>
    );
  }

  return (
    <div className="max-w-prose-editorial">
      {/* Missatge principal */}
      <div className="border border-linen bg-canvas-warm p-8 md:p-10 mb-10">
        <p className="font-serif text-display-md text-ink mb-3">
          {t("confTitle")}
        </p>
        {reference && (
          <p className="font-sans text-body-md text-ink-muted mb-2">
            {t("confReference", { ref: reference })}
          </p>
        )}
        <p className="font-sans text-body-md text-ink-muted leading-relaxed">
          {isPending ? t("confPendingBody") : t("confGenericBody")}
        </p>
        {snapshot?.customer.email && (
          <p className="font-sans text-body-sm text-ink-faint mt-3">
            {t("confEmailNote", { email: snapshot.customer.email })}
          </p>
        )}
      </div>

      {/* Resum de la comanda (si tenim snapshot) */}
      {lines.length > 0 && snapshot && (
        <section className="mb-10">
          <h2 className="font-serif text-body-lg text-ink mb-4">
            {t("confSummaryHeading")}
          </h2>
          <ul className="border-t border-linen divide-y divide-linen" role="list">
            {lines.map((line) => (
              <li key={line.slug} className="flex justify-between gap-4 py-3">
                <span className="font-sans text-body-md text-ink min-w-0 truncate">
                  {line.nom} <span className="text-ink-muted">× {line.qty}</span>
                </span>
                <span className="font-sans text-body-md text-ink font-semibold tabular-nums shrink-0">
                  {fmtPrice(line.pvp * line.qty)}
                </span>
              </li>
            ))}
          </ul>
          <dl className="space-y-1.5 border-t border-linen pt-4 mt-1">
            <div className="flex justify-between">
              <dt className="font-sans text-body-md text-ink-muted">{t("subtotal")}</dt>
              <dd className="font-sans text-body-md text-ink tabular-nums">
                {fmtPrice(snapshot.order.subtotal)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-sans text-body-md text-ink-muted">{t("shipping")}</dt>
              <dd className="font-sans text-body-md text-ink tabular-nums">
                {snapshot.order.shipping === 0
                  ? t("shippingFree")
                  : fmtPrice(snapshot.order.shipping)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-linen pt-2 mt-1">
              <dt className="font-serif text-body-lg text-ink">{t("total")}</dt>
              <dd className="font-serif text-body-lg text-ink tabular-nums">
                {fmtPrice(snapshot.order.total)}
              </dd>
            </div>
          </dl>
          <p className="font-sans text-body-sm text-ink-faint mt-2">{t("taxNote")}</p>
        </section>
      )}

      <Link
        href={`${prefix}/mobiliari`}
        className="inline-flex items-center justify-center px-6 py-4 bg-ink text-canvas font-sans text-body-md font-semibold hover:bg-accent-deep transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        {t("confContinue")}
      </Link>
    </div>
  );
}
