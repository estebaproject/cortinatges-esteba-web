import type { SVGProps } from "react";

/**
 * Icones del prototip v2. En línia i amb `currentColor`: cap petició de xarxa i
 * hereten el color del text, així que funcionen igual sobre paper i sobre fosc.
 */

type Props = SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export function PhoneIcon(props: Props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z" />
    </svg>
  );
}

export function WhatsAppIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.16-1.35a9.9 9.9 0 0 0 4.88 1.27h.01c5.5 0 9.96-4.46 9.96-9.96A9.9 9.9 0 0 0 19.1 4.9 9.9 9.9 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.24 8.24 0 0 1 12.79-10.2 8.19 8.19 0 0 1 2.42 5.85c0 4.55-3.7 8.2-8.23 8.2Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12s-.64.8-.79.97c-.14.16-.29.19-.54.06a6.75 6.75 0 0 1-1.99-1.23 7.5 7.5 0 0 1-1.38-1.71c-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.23.25-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.6.18 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}

export function MailIcon(props: Props) {
  return (
    <svg {...stroke} {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
      <path d="m3 6 9 6.5L21 6" />
    </svg>
  );
}

export function PinIcon(props: Props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M20 10.5c0 5.5-8 11.5-8 11.5s-8-6-8-11.5a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10.5" r="2.8" />
    </svg>
  );
}

export function ClockIcon(props: Props) {
  return (
    <svg {...stroke} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 1.9" />
    </svg>
  );
}

export function ChevronDown(props: Props) {
  return (
    <svg {...stroke} {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </svg>
  );
}

export function PlusIcon(props: Props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MenuIcon(props: Props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />
    </svg>
  );
}

export function CloseIcon(props: Props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function InstagramIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 1.62c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.21-.94.47-1.35.88-.41.41-.67.8-.88 1.35-.16.41-.35 1.03-.4 2.17-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.14.24 1.76.4 2.17.21.55.47.94.88 1.35.41.41.8.67 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.21.94-.47 1.35-.88.41-.41.67-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.17a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4-1.24-.06-1.59-.07-4.74-.07Zm0 2.76a5.46 5.46 0 1 1 0 10.92 5.46 5.46 0 0 1 0-10.92Zm0 9a3.54 3.54 0 1 0 0-7.08 3.54 3.54 0 0 0 0 7.08Zm6.95-9.22a1.28 1.28 0 1 1-2.55 0 1.28 1.28 0 0 1 2.55 0Z" />
    </svg>
  );
}

export function FacebookIcon(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11.01 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.08 24 18.09 24 12.07Z" />
    </svg>
  );
}

// --- Icones del procés (una per pas) ---------------------------------------

export function RulerIcon(props: Props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
      <path d="m14.5 12.5 2-2M11.5 9.5l2-2M8.5 6.5l2-2M17.5 15.5l2-2" />
    </svg>
  );
}

export function DocIcon(props: Props) {
  return (
    <svg {...stroke} {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </svg>
  );
}

export function ScissorsIcon(props: Props) {
  return (
    <svg {...stroke} {...props}>
      <circle cx="6" cy="6" r="2.6" />
      <circle cx="6" cy="18" r="2.6" />
      <path d="M20 4 8.2 15.8M14.6 14.5 20 20M8.2 8.2 12 12" />
    </svg>
  );
}

export function DrillIcon(props: Props) {
  return (
    <svg {...stroke} {...props}>
      <rect x="3" y="8.5" width="8" height="5.5" rx="1.5" />
      <path d="M11 10.2h3v4h-3M14 12.2h6M6 14v2.5A1.5 1.5 0 0 0 7.5 18H9v-4" />
    </svg>
  );
}
