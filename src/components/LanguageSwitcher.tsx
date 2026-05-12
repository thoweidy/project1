"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const t = useTranslations("Navigation");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const targetLocale = locale === "en" ? "es" : "en";

  function handleSwitch() {
    router.replace(pathname, { locale: targetLocale });
  }

  return (
    <button
      onClick={handleSwitch}
      className="flex items-center gap-2 rounded-lg border border-card-border px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted"
      aria-label={`Switch to ${targetLocale === "en" ? "English" : "Spanish"}`}
    >
      <span className="text-base">{targetLocale === "en" ? "🇺🇸" : "🇪🇸"}</span>
      {t("switchLanguage")}
    </button>
  );
}
