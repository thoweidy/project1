import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("Footer");
  const nav = useTranslations("Navigation");

  return (
    <footer className="bg-secondary-dark text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-bold">Project Angel Food</h3>
            <p className="mt-3 text-sm text-white/70">{t("tagline")}</p>
          </div>

          <div>
            <h4 className="font-semibold">{t("quickLinks")}</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-white/70 hover:text-white"
                >
                  {nav("home")}
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm text-white/70 hover:text-white"
                >
                  {nav("about")}
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="text-sm text-white/70 hover:text-white"
                >
                  {nav("programs")}
                </Link>
              </li>
              <li>
                <Link
                  href="/donate"
                  className="text-sm text-white/70 hover:text-white"
                >
                  {nav("donate")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold">{t("contact")}</h4>
            <div className="mt-3 space-y-2 text-sm text-white/70">
              <p>{t("address")}</p>
              <p>{t("phone")}</p>
              <p>{t("email")}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/20 pt-6 text-center text-sm text-white/50">
          <p>{t("copyright", { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}
