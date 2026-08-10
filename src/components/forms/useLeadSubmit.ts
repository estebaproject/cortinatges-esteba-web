"use client";

import { useCallback, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";
import { HONEYPOT_FIELD, type LeadPayload, type LeadType } from "@/lib/lead";

export type LeadState = "idle" | "sending" | "ok" | "error";

/**
 * Lògica compartida pels dos formularis: estat d'enviament, esquer antispam i
 * marca de temps per a la trampa de temps del servidor.
 *
 * En cas d'error NO es buida res: el que ha escrit l'usuari es queda a la
 * pantalla. Fer-li reescriure el missatge després d'una fallada nostra és la
 * manera més segura de perdre el lead del tot.
 */
export function useLeadSubmit(type: LeadType) {
  const locale = useLocale();
  const pathname = usePathname();
  const [state, setState] = useState<LeadState>("idle");
  // Quan s'ha muntat el formulari. El servidor rebutja els enviaments que
  // arriben massa de pressa (bots).
  const renderedAt = useRef<number>(Date.now());
  const [honeypot, setHoneypot] = useState("");

  const submit = useCallback(
    async (dades: Omit<LeadPayload, "type" | "locale" | "page" | "renderedAt">) => {
      setState("sending");
      try {
        const res = await fetch("/api/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...dades,
            type,
            locale,
            page: pathname,
            renderedAt: renderedAt.current,
            [HONEYPOT_FIELD]: honeypot,
          }),
        });
        const json = (await res.json()) as { ok?: boolean };
        setState(res.ok && json.ok ? "ok" : "error");
      } catch {
        setState("error");
      }
    },
    [type, locale, pathname, honeypot],
  );

  return { state, submit, honeypot, setHoneypot, reset: () => setState("idle") };
}
