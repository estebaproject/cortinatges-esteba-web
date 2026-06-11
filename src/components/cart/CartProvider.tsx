"use client";

// Estat del cistell (carret) client-side per a la botiga ESTEBA.
// Fase 1: només localStorage, sense backend ni pagament. Només dades
// públiques (nom, PVP amb IVA inclòs, foto). MAI cost intern.
// Mateix patró de persistència que CookieBanner (try/catch + localStorage).

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "esteba-cart";

/** Una línia del cistell. Només dades públiques del producte. */
export type CartLine = {
  /** Slug del producte (catifa). Identificador únic de la línia. */
  slug: string;
  /** Nom propi del model (no es tradueix). */
  nom: string;
  /** Preu públic unitari, IVA inclòs (€). */
  pvp: number;
  /** Ruta de la foto (catifaImage(slug)). */
  image: string;
  /** Quantitat (>= 1). */
  qty: number;
};

type CartContextValue = {
  lines: CartLine[];
  /** Suma de quantitats de totes les línies. */
  count: number;
  /** Suma de pvp · qty de totes les línies (€, IVA inclòs). */
  subtotal: number;
  /** Indica si ja s'ha llegit el localStorage (evita parpelleig al muntar). */
  hydrated: boolean;
  /** Afegeix un producte; si ja hi és, incrementa la quantitat. */
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  /** Elimina la línia sencera pel seu slug. */
  removeLine: (slug: string) => void;
  /** Fixa la quantitat d'una línia. Si <= 0, elimina la línia. */
  setQty: (slug: string, qty: number) => void;
  /** Buida el cistell. */
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function isCartLine(value: unknown): value is CartLine {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.slug === "string" &&
    typeof v.nom === "string" &&
    typeof v.pvp === "number" &&
    typeof v.image === "string" &&
    typeof v.qty === "number"
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  // Evita escriure al localStorage abans d'haver llegit l'estat inicial.
  const canPersist = useRef(false);

  // Hidratació: llegeix l'estat desat un sol cop al muntar (només client).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const valid = parsed
            .filter(isCartLine)
            .map((l) => ({ ...l, qty: Math.max(1, Math.floor(l.qty)) }));
          setLines(valid);
        }
      }
    } catch {
      /* localStorage no disponible o JSON corrupte: comencem buit */
    } finally {
      canPersist.current = true;
      setHydrated(true);
    }
  }, []);

  // Persistència: desa cada canvi (un cop hidratat).
  useEffect(() => {
    if (!canPersist.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* no-op: quota o mode privat */
    }
  }, [lines]);

  // Sincronització entre pestanyes: reacciona a canvis de localStorage.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        const parsed: unknown = e.newValue ? JSON.parse(e.newValue) : [];
        setLines(Array.isArray(parsed) ? parsed.filter(isCartLine) : []);
      } catch {
        /* no-op */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback<CartContextValue["add"]>((line, qty = 1) => {
    const inc = Math.max(1, Math.floor(qty));
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === line.slug);
      if (existing) {
        return prev.map((l) =>
          l.slug === line.slug ? { ...l, qty: l.qty + inc } : l,
        );
      }
      return [...prev, { ...line, qty: inc }];
    });
  }, []);

  const removeLine = useCallback<CartContextValue["removeLine"]>((slug) => {
    setLines((prev) => prev.filter((l) => l.slug !== slug));
  }, []);

  const setQty = useCallback<CartContextValue["setQty"]>((slug, qty) => {
    const next = Math.floor(qty);
    setLines((prev) =>
      next <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) => (l.slug === slug ? { ...l, qty: next } : l)),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = useMemo(
    () => lines.reduce((sum, l) => sum + l.qty, 0),
    [lines],
  );
  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.pvp * l.qty, 0),
    [lines],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count,
      subtotal,
      hydrated,
      add,
      removeLine,
      setQty,
      clear,
    }),
    [lines, count, subtotal, hydrated, add, removeLine, setQty, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Accedeix a l'estat del cistell. Ha d'estar dins de <CartProvider>. */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart s'ha d'utilitzar dins de <CartProvider>");
  }
  return ctx;
}
