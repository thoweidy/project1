# Angelfood.org Translation Widget

## Cursor Cloud specific instructions

### Overview

This is a **zero-dependency** static project — there is no package.json, no build step, and no compilation. The widget is a single vanilla JavaScript file (`widget/translator.js`) served alongside JSON translation files.

### Running the development server

Serve the repository root with any static HTTP server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/widget/test.html` in a browser.

### Testing

There are no automated tests or linting tools in this project. Testing is manual:

1. Start the static file server (see above).
2. Open `widget/test.html` in a browser.
3. Click the globe button (🌐) in the bottom-right corner.
4. Switch between languages and verify text is translated.

### Key files

| Path | Purpose |
|------|---------|
| `widget/translator.js` | Main widget script (vanilla JS IIFE) |
| `widget/test.html` | Local test page simulating the angelfood.org site |
| `widget/locales/*.json` | Translation files (es, ru, zh, hy) |

### Notes

- The widget relies on `fetch()` for loading JSON translation files, so you **must** use an HTTP server (not `file://` protocol).
- Auto-translation fallback uses the external MyMemory API (`api.mymemory.translated.net`); it works without internet but untranslated text simply won't get the auto-translate fallback.
- No hot-reload — after editing `translator.js` or locale JSON files, refresh the browser manually.
