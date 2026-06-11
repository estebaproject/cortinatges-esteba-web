import Link from "next/link";

export default function NotFound() {
  return (
    <section className="pt-40 md:pt-48 pb-section bg-canvas min-h-[60vh] flex items-center">
      <div className="max-w-layout mx-auto px-6 lg:px-12 text-center">
        <p className="font-serif text-display-xl text-ink mb-4">404</p>
        <p className="font-sans text-body-lg text-ink-muted mb-10 max-w-prose-editorial mx-auto">
          Aquesta pàgina no existeix o s&apos;ha mogut.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-8 py-4 bg-accent-deep text-canvas font-sans text-xs font-medium tracking-widest uppercase hover:bg-ink transition-colors"
        >
          Torna a l&apos;inici
        </Link>
      </div>
    </section>
  );
}
