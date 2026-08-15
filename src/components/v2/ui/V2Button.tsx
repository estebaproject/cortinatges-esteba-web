import Link from "next/link";
import clsx from "clsx";
import type { ReactNode } from "react";

/**
 * Botó del prototip v2.
 *
 * Un sol component per a les tres jerarquies. A la web actual cada crida a
 * l'acció es maqueta a mà (n'hi ha vuit variants diferents de la mateixa cosa),
 * i el resultat és que el botó principal no es distingeix del secundari.
 *
 * Alçada mínima de 48px a totes les variants: és el mínim tàctil còmode i,
 * en un negoci on la conversió és una trucada des del mòbil, no és un detall.
 */

type Variant = "primary" | "secondary" | "ghost" | "onDark" | "whatsapp";
type Size = "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-v2-ink text-v2-paper hover:bg-v2-brass-2 border border-transparent",
  secondary:
    "bg-transparent text-v2-ink border border-v2-ink/25 hover:border-v2-ink hover:bg-v2-ink hover:text-v2-paper",
  ghost:
    "bg-transparent text-v2-ink border border-transparent hover:text-v2-brass-2 px-0",
  onDark:
    "bg-v2-paper text-v2-ink border border-transparent hover:bg-v2-brass hover:text-v2-paper",
  whatsapp:
    "bg-v2-green text-white border border-transparent hover:brightness-95",
};

const SIZE: Record<Size, string> = {
  md: "min-h-[48px] px-6 text-v2-sm",
  lg: "min-h-[56px] px-8 text-v2-body",
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: ReactNode;
  "aria-label"?: string;
};

function classes(variant: Variant, size: Size, className?: string) {
  return clsx(
    "inline-flex items-center justify-center gap-2.5 font-v2-sans font-semibold tracking-wide",
    "transition-colors duration-300 ease-editorial",
    VARIANT[variant],
    variant === "ghost" ? "min-h-[48px] text-v2-sm" : SIZE[size],
    className,
  );
}

export function ButtonLink({
  href,
  external = false,
  variant = "primary",
  size = "md",
  className,
  icon,
  children,
  ...rest
}: CommonProps & { href: string; external?: boolean }) {
  const cls = classes(variant, size, className);

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls} {...rest}>
        {icon}
        {children}
      </a>
    );
  }

  // `tel:` i `mailto:` no poden passar per <Link>: no són rutes de l'app.
  if (href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("#")) {
    return (
      <a href={href} className={cls} {...rest}>
        {icon}
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} {...rest}>
      {icon}
      {children}
    </Link>
  );
}

/** Fletxa que es desplaça en hover. Marca la direcció sense dir "clica aquí". */
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      className={clsx("h-4 w-4 transition-transform duration-300 group-hover:translate-x-1", className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
