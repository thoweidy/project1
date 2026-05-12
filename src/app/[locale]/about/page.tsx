import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AboutContent />;
}

function AboutContent() {
  const t = useTranslations("AboutPage");

  const values = [
    { title: t("compassion"), desc: t("compassionDesc") },
    { title: t("excellence"), desc: t("excellenceDesc") },
    { title: t("community"), desc: t("communityDesc") },
    { title: t("inclusion"), desc: t("inclusionDesc") },
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-secondary-dark to-secondary px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">{t("title")}</h1>
          <p className="mt-4 text-lg text-white/80">{t("intro")}</p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-secondary-dark">
            {t("historyTitle")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-foreground/70">
            {t("historyText")}
          </p>
        </div>
      </section>

      <section className="bg-muted px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-secondary-dark">
            {t("valuesTitle")}
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border border-card-border bg-white p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-primary">
                  {value.title}
                </h3>
                <p className="mt-2 text-foreground/60">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-secondary-dark">
            {t("teamTitle")}
          </h2>
          <p className="mt-4 text-lg text-foreground/70">{t("teamText")}</p>
        </div>
      </section>
    </>
  );
}
