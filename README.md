# Angelfood.org — Internationalized Website

A Next.js application with full internationalization (i18n) support for Project Angel Food, built with [next-intl](https://next-intl.dev).

## Quick Start

```bash
npm install
npm run dev
```

Visit:
- English: [http://localhost:3000](http://localhost:3000) (default)
- Spanish: [http://localhost:3000/es](http://localhost:3000/es)

## Project Structure

```
├── messages/                  # Translation files
│   ├── en.json                # English translations
│   └── es.json                # Spanish translations
├── src/
│   ├── i18n/
│   │   ├── routing.ts         # Locale routing config (supported locales, default)
│   │   ├── request.ts         # Server-side locale resolution
│   │   └── navigation.ts      # Locale-aware Link, useRouter, etc.
│   ├── middleware.ts           # Detects user locale from browser/URL
│   ├── components/
│   │   ├── Header.tsx          # Navigation with language switcher
│   │   ├── Footer.tsx          # Translated footer
│   │   └── LanguageSwitcher.tsx# Toggle between languages
│   └── app/
│       └── [locale]/           # All pages live under dynamic locale segment
│           ├── layout.tsx      # Root layout with locale provider
│           ├── page.tsx        # Home page
│           ├── about/page.tsx  # About page
│           ├── programs/page.tsx # Programs page
│           └── donate/page.tsx # Donate page
```

## How Translation Works

### 1. Translation files (`messages/*.json`)

All translatable text lives in JSON files under `messages/`. Each file is named by its locale code (e.g., `en.json`, `es.json`).

Translations are organized by namespace (page or component):

```json
{
  "HomePage": {
    "heroTitle": "Cooking and Delivering Healthy Meals...",
    "heroCta": "Donate Now"
  },
  "Navigation": {
    "home": "Home",
    "about": "About Us"
  }
}
```

### 2. Using translations in components

**Server Components** (recommended for pages):
```tsx
import { useTranslations } from "next-intl";

function MyPage() {
  const t = useTranslations("HomePage");
  return <h1>{t("heroTitle")}</h1>;
}
```

**Client Components** (for interactive elements):
```tsx
"use client";
import { useTranslations } from "next-intl";

function MyButton() {
  const t = useTranslations("Common");
  return <button>{t("learnMore")}</button>;
}
```

### 3. Locale-aware navigation

Use the custom `Link` from `@/i18n/navigation` instead of Next.js's `Link`:

```tsx
import { Link } from "@/i18n/navigation";

<Link href="/about">About Us</Link>
```

This automatically adds the correct locale prefix to URLs.

## Adding a New Language

1. **Create a translation file**: Copy `messages/en.json` to `messages/[locale].json` (e.g., `messages/fr.json` for French)

2. **Translate all strings** in the new file

3. **Register the locale** in `src/i18n/routing.ts`:
   ```ts
   export const routing = defineRouting({
     locales: ["en", "es", "fr"],  // Add new locale here
     defaultLocale: "en",
   });
   ```

4. **Update the language switcher** in `src/components/LanguageSwitcher.tsx` if you want to support more than two languages

5. **Build and test**: Run `npm run build` to verify all routes generate correctly

## Adding New Translatable Content

1. Add the new key to **every** locale file in `messages/`:
   ```json
   {
     "NewSection": {
       "title": "New Section Title",
       "description": "Description text here"
     }
   }
   ```

2. Use it in your component:
   ```tsx
   const t = useTranslations("NewSection");
   return <h2>{t("title")}</h2>;
   ```

## Dynamic Values in Translations

Use ICU message format for dynamic content:

```json
{
  "Footer": {
    "copyright": "© {year} Project Angel Food. All rights reserved."
  }
}
```

```tsx
t("copyright", { year: new Date().getFullYear() })
```

## URL Structure

| Locale  | URL Pattern         | Example              |
|---------|--------------------|-----------------------|
| English | `/` (default)      | `/about`, `/donate`   |
| Spanish | `/es/...`          | `/es/about`, `/es/donate` |

The default locale (English) does **not** show a prefix in the URL, configured via `localePrefix: "as-needed"` in `routing.ts`.

## Tech Stack

- **Next.js 16** (App Router)
- **next-intl** for internationalization
- **Tailwind CSS** for styling
- **TypeScript** for type safety
