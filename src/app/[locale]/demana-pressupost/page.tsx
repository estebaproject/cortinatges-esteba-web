import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import BudgetForm from "@/components/BudgetForm";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FormBudget" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function DemanaPressupostPage() {
  const t = await getTranslations("FormBudget");

  return (
    <section className="pt-40 md:pt-48 pb-section bg-canvas">
      <div className="max-w-layout mx-auto px-6 lg:px-12">
        <header className="mb-12">
          <h1 className="font-serif text-display-lg text-ink mb-5">{t("title")}</h1>
          <p className="font-sans text-body-lg text-ink-muted max-w-prose-editorial">
            {t("intro")}
          </p>
        </header>
        <BudgetForm />
      </div>
    </section>
  );
}
