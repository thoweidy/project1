import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <HomeContent />;
}

function HomeContent() {
  const t = useTranslations("HomePage");

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary-dark to-secondary px-4 py-20 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            {t("heroSubtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/donate"
              className="rounded-lg bg-primary px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-primary-dark"
            >
              {t("heroCta")}
            </Link>
            <Link
              href="/about"
              className="rounded-lg border-2 border-white px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t("heroSecondaryCta")}
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-secondary-dark">
            {t("missionTitle")}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-foreground/70">
            {t("missionText")}
          </p>
        </div>
      </section>

      {/* Impact Section */}
      <section className="bg-muted px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-secondary-dark">
            {t("impactTitle")}
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-8 lg:grid-cols-4">
            <ImpactStat number="2,500+" label={t("clientsServed")} />
            <ImpactStat number="900,000+" label={t("mealsDelivered")} />
            <ImpactStat number="7,000+" label={t("volunteersEngaged")} />
            <ImpactStat number="15+" label={t("illnessesServed")} />
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold text-secondary-dark">
            {t("programsTitle")}
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <ProgramCard
              icon="🍽️"
              title={t("medicallyTailored")}
              description={t("medicallyTailoredDesc")}
            />
            <ProgramCard
              icon="🚗"
              title={t("homeDelivery")}
              description={t("homeDeliveryDesc")}
            />
            <ProgramCard
              icon="🥗"
              title={t("nutritionServices")}
              description={t("nutritionServicesDesc")}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold">{t("ctaTitle")}</h2>
          <p className="mt-4 text-lg text-white/80">{t("ctaText")}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/donate"
              className="rounded-lg bg-white px-8 py-3 text-lg font-semibold text-primary transition-colors hover:bg-white/90"
            >
              {t("ctaDonate")}
            </Link>
            <Link
              href="/about"
              className="rounded-lg border-2 border-white px-8 py-3 text-lg font-semibold text-white transition-colors hover:bg-white/10"
            >
              {t("ctaVolunteer")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function ImpactStat({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-4xl font-bold text-primary">{number}</p>
      <p className="mt-2 text-sm font-medium text-foreground/60">{label}</p>
    </div>
  );
}

function ProgramCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-card-border bg-card-bg p-6 shadow-sm transition-shadow hover:shadow-md">
      <span className="text-4xl">{icon}</span>
      <h3 className="mt-4 text-xl font-semibold text-secondary-dark">
        {title}
      </h3>
      <p className="mt-2 text-foreground/60">{description}</p>
    </div>
  );
}
