import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProgramsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProgramsContent />;
}

function ProgramsContent() {
  const t = useTranslations("ProgramsPage");

  const programs = [
    {
      icon: "🍽️",
      title: t("mtmTitle"),
      description: t("mtmDesc"),
    },
    {
      icon: "🚗",
      title: t("deliveryTitle"),
      description: t("deliveryDesc"),
    },
    {
      icon: "🥗",
      title: t("nutritionTitle"),
      description: t("nutritionDesc"),
    },
    {
      icon: "🛒",
      title: t("groceryTitle"),
      description: t("groceryDesc"),
    },
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-secondary-dark to-secondary px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">{t("title")}</h1>
          <p className="mt-4 text-lg text-white/80">{t("subtitle")}</p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            {programs.map((program) => (
              <div
                key={program.title}
                className="rounded-xl border border-card-border bg-card-bg p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="text-5xl">{program.icon}</span>
                <h2 className="mt-4 text-2xl font-bold text-secondary-dark">
                  {program.title}
                </h2>
                <p className="mt-3 leading-relaxed text-foreground/60">
                  {program.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-secondary-dark">
            {t("eligibilityTitle")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-foreground/70">
            {t("eligibilityText")}
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-secondary-dark">
            {t("applyTitle")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-foreground/70">
            {t("applyText")}
          </p>
        </div>
      </section>
    </>
  );
}
