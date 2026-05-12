# Angelfood.org Translation Widget

A free, lightweight translation widget for [angelfood.org](https://www.angelfood.org) that adds multi-language support without requiring Webflow's paid Localization add-on.

## How It Works

The widget is a single JavaScript file you add to your Webflow site. It:

1. Adds a floating **language picker** button (bottom-right corner)
2. When a visitor selects a language, it **replaces text on the page** with translations
3. **Remembers** the visitor's language choice via localStorage
4. Watches for dynamically loaded content and translates it too

## Supported Languages

| Language | Code | Status |
|----------|------|--------|
| English  | `en` | Default (original site content) |
| Spanish  | `es` | Ready |
| Russian  | `ru` | Ready |
| Chinese  | `zh` | Ready |
| Armenian | `hy` | Starter (needs professional review) |

## Setup: Adding to Your Webflow Site

### Step 1: Host the translation files

The translation files need to be publicly accessible. The easiest option is **GitHub Pages**:

1. In this repository, go to **Settings > Pages**
2. Set source to **Deploy from a branch**, choose `main`, folder `/ (root)`
3. Save. Your files will be available at: `https://thoweidy.github.io/project1/widget/locales/`

### Step 2: Add the script to Webflow

1. Open your Webflow project dashboard
2. Go to **Site Settings** (gear icon) > **Custom Code**
3. In the **Footer Code** section (Before `</body>` tag), paste:

```html
<script
  src="https://thoweidy.github.io/project1/widget/translator.js"
  data-angelfood-translations-url="https://thoweidy.github.io/project1/widget/locales">
</script>
```

4. Click **Save Changes**
5. **Publish** your site

That's it. A language picker globe button will appear on every page.

### Alternative: Self-host the files

If you prefer to host the files yourself (e.g., on your own server or CDN):

1. Upload the `widget/` folder to your server
2. Update the `src` and `data-angelfood-translations-url` URLs accordingly

## How to Edit Translations

### Editing existing translations

1. Open the translation file in `widget/locales/` (e.g., `es.json` for Spanish)
2. Find the English text you want to change (the key after `_text.`)
3. Edit the translated value
4. Commit and push — GitHub Pages will update automatically

### Translation file format

Each file maps English text to its translation using the `_text.` prefix:

```json
{
  "_text.donate": "donar",
  "_text.VOLUNTEER": "VOLUNTARIADO",
  "_text.Our Services": "Nuestros Servicios",
  "_text.read more": "leer más"
}
```

The key is `_text.` followed by the **exact English text** as it appears on the page. The value is the translation.

### Adding new text to translate

1. Visit angelfood.org and find the English text you want to translate
2. Copy the text exactly as it appears (including capitalization)
3. Add it to each language file:

```json
{
  "_text.The exact English text here": "La traducción aquí"
}
```

### Adding a new language

1. Create a new file in `widget/locales/` (e.g., `ko.json` for Korean)
2. Follow the same `_text.` format
3. Edit `widget/translator.js` and add the language to the `CONFIG.locales` object:

```js
locales: {
  en: { label: "English", flag: "🇺🇸" },
  es: { label: "Español", flag: "🇪🇸" },
  ko: { label: "한국어", flag: "🇰🇷" },  // new
  // ...
},
```

## Advanced: Using data-i18n Attributes

For more reliable translations on specific elements, you can add `data-i18n` attributes in Webflow:

1. In the Webflow Designer, select an element
2. Go to **Element Settings** (gear icon) > **Custom Attributes**
3. Add attribute: `data-i18n` with a value matching a key in your translation file

This is optional — the widget works without it by matching text content directly.

## Project Structure

```
widget/
├── translator.js          # The translation widget script
└── locales/
    ├── es.json            # Spanish translations
    ├── hy.json            # Armenian translations
    ├── ru.json            # Russian translations
    └── zh.json            # Chinese translations
```

## Notes

- The widget does **not** change URLs (no `/es/` prefix). It translates content client-side.
- Translation happens instantly — there's no page reload.
- The visitor's language choice persists across page visits.
- The widget ignores `<script>`, `<style>`, and its own UI elements.
- A `MutationObserver` handles dynamically loaded content (e.g., Webflow CMS items).
- The Armenian translations are a starter set and should be reviewed by a native speaker.
