import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function DonatePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DonateContent />;
}

function DonateContent() {
  const t = useTranslations("DonatePage");

  const amounts = [
    { value: 25, description: t("feedOne") },
    { value: 50, description: t("feedTwo") },
    { value: 100, description: t("feedMonth") },
    { value: 250, description: t("feedYear") },
  ];

  const otherWays = [
    { title: t("plannedGiving"), desc: t("plannedGivingDesc"), icon: "📋" },
    {
      title: t("corporatePartners"),
      desc: t("corporatePartnersDesc"),
      icon: "🤝",
    },
    { title: t("inKind"), desc: t("inKindDesc"), icon: "📦" },
  ];

  return (
    <>
      <section className="bg-gradient-to-br from-primary to-primary-dark px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">{t("title")}</h1>
          <p className="mt-4 text-lg text-white/80">{t("subtitle")}</p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-card-border bg-card-bg p-8 shadow-lg">
            <div className="mb-8 flex justify-center gap-4">
              <button className="rounded-lg bg-primary px-6 py-2 font-semibold text-white">
                {t("oneTime")}
              </button>
              <button className="rounded-lg border border-card-border px-6 py-2 font-semibold text-foreground/60 transition-colors hover:border-primary hover:text-primary">
                {t("monthly")}
              </button>
            </div>

            <h3 className="mb-4 text-center text-lg font-semibold text-secondary-dark">
              {t("amount")}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              {amounts.map((amount) => (
                <button
                  key={amount.value}
                  className="rounded-xl border-2 border-card-border p-4 text-left transition-all hover:border-primary hover:shadow-md"
                >
                  <p className="text-2xl font-bold text-primary">
                    ${amount.value}
                  </p>
                  <p className="mt-1 text-sm text-foreground/60">
                    {amount.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-6">
              <input
                type="text"
                placeholder={t("customAmount")}
                className="w-full rounded-lg border border-card-border px-4 py-3 text-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <button className="mt-6 w-full rounded-lg bg-primary py-4 text-lg font-bold text-white transition-colors hover:bg-primary-dark">
              {t("donateButton")}
            </button>

            <p className="mt-4 text-center text-sm text-foreground/50">
              {t("taxDeductible")}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-secondary-dark">
            {t("otherWays")}
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {otherWays.map((way) => (
              <div
                key={way.title}
                className="rounded-xl border border-card-border bg-white p-6 shadow-sm"
              >
                <span className="text-4xl">{way.icon}</span>
                <h3 className="mt-4 text-xl font-semibold text-secondary-dark">
                  {way.title}
                </h3>
                <p className="mt-2 text-foreground/60">{way.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
