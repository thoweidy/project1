(function () {
  "use strict";

  var CONFIG = {
    defaultLocale: "en",
    locales: {
      en: { label: "English", flag: "🇺🇸" },
      es: { label: "Español", flag: "🇪🇸" },
      hy: { label: "Հայերեն", flag: "🇦🇲" },
      ru: { label: "Русский", flag: "🇷🇺" },
      zh: { label: "中文", flag: "🇨🇳" },
    },
    storageKey: "angelfood-lang",
    // Set this to where your locale JSON files are hosted.
    // If using GitHub Pages: https://<user>.github.io/<repo>/widget/locales
    // Falls back to same-origin /widget/locales if not set via data attribute.
    baseUrl: null,
  };

  var currentLocale = CONFIG.defaultLocale;
  var translations = {};
  var originalTexts = new Map();
  var isTranslating = false;

  // ---------------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------------

  function getStoredLocale() {
    try {
      return localStorage.getItem(CONFIG.storageKey);
    } catch (_) {
      return null;
    }
  }

  function storeLocale(locale) {
    try {
      localStorage.setItem(CONFIG.storageKey, locale);
    } catch (_) {
      // storage unavailable
    }
  }

  function resolveBaseUrl() {
    if (CONFIG.baseUrl) return CONFIG.baseUrl;

    var script = document.querySelector(
      'script[data-angelfood-translations-url]'
    );
    if (script) {
      return script.getAttribute("data-angelfood-translations-url");
    }

    var scripts = document.querySelectorAll("script[src]");
    for (var i = 0; i < scripts.length; i++) {
      var src = scripts[i].getAttribute("src");
      if (src && src.indexOf("translator.js") !== -1) {
        return src.replace(/translator\.js.*$/, "locales");
      }
    }

    return "/widget/locales";
  }

  // ---------------------------------------------------------------------------
  // Translation loading
  // ---------------------------------------------------------------------------

  function loadTranslations(locale, callback) {
    if (locale === CONFIG.defaultLocale) {
      translations = {};
      callback();
      return;
    }

    var url = resolveBaseUrl().replace(/\/+$/, "") + "/" + locale + ".json";
    var cacheBust = "?v=" + Date.now();

    fetch(url + cacheBust)
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        translations = flattenObject(data);
        callback();
      })
      .catch(function (err) {
        console.warn("[AngelFood i18n] Could not load " + locale + ":", err);
        callback();
      });
  }

  function flattenObject(obj, prefix) {
    var result = {};
    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) continue;
      var val = obj[key];
      var newKey = prefix ? prefix + "." + key : key;
      if (typeof val === "object" && val !== null && !Array.isArray(val)) {
        var nested = flattenObject(val, newKey);
        for (var nk in nested) result[nk] = nested[nk];
      } else {
        result[newKey] = val;
      }
    }
    return result;
  }

  // ---------------------------------------------------------------------------
  // DOM text replacement
  // ---------------------------------------------------------------------------

  function getTranslatableNodes() {
    var walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function (node) {
          if (!node.nodeValue || !node.nodeValue.trim()) {
            return NodeFilter.FILTER_REJECT;
          }
          var parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          var tag = parent.tagName;
          if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") {
            return NodeFilter.FILTER_REJECT;
          }
          // Skip the translator widget itself
          if (parent.closest("#angelfood-translator")) {
            return NodeFilter.FILTER_REJECT;
          }
          return NodeFilter.FILTER_ACCEPT;
        },
      }
    );

    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }

  function buildLookup() {
    var byEnglish = {};
    for (var key in translations) {
      if (!translations.hasOwnProperty(key)) continue;
      var parts = key.split(".");
      var englishKey = parts[parts.length - 1];
      byEnglish[key] = translations[key];
    }
    return byEnglish;
  }

  function applyTranslations() {
    if (isTranslating) return;
    isTranslating = true;

    if (currentLocale === CONFIG.defaultLocale) {
      restoreOriginals();
      isTranslating = false;
      return;
    }

    // First pass: find elements with data-i18n attributes
    var i18nElements = document.querySelectorAll("[data-i18n]");
    for (var i = 0; i < i18nElements.length; i++) {
      var el = i18nElements[i];
      var key = el.getAttribute("data-i18n");
      if (!originalTexts.has(el)) {
        originalTexts.set(el, el.textContent);
      }
      if (translations[key]) {
        el.textContent = translations[key];
      }
    }

    // Second pass: find elements with data-i18n-placeholder
    var placeholderEls = document.querySelectorAll("[data-i18n-placeholder]");
    for (var j = 0; j < placeholderEls.length; j++) {
      var pEl = placeholderEls[j];
      var pKey = pEl.getAttribute("data-i18n-placeholder");
      if (!originalTexts.has("placeholder-" + j)) {
        originalTexts.set("placeholder-" + j, pEl.placeholder);
      }
      if (translations[pKey]) {
        pEl.placeholder = translations[pKey];
      }
    }

    // Third pass: text-content matching for elements WITHOUT data-i18n
    var textMap = {};
    for (var tKey in translations) {
      if (!translations.hasOwnProperty(tKey)) continue;
      // The key format is "original English" -> "translation"
      // We look for keys that start with underscore-less path
      textMap[tKey] = translations[tKey];
    }

    var nodes = getTranslatableNodes();
    for (var n = 0; n < nodes.length; n++) {
      var textNode = nodes[n];
      var trimmed = textNode.nodeValue.trim();
      if (!trimmed) continue;

      if (!originalTexts.has(textNode)) {
        originalTexts.set(textNode, textNode.nodeValue);
      }

      // Look for exact match in the text-match dictionary
      if (translations["_text." + trimmed]) {
        textNode.nodeValue = textNode.nodeValue.replace(
          trimmed,
          translations["_text." + trimmed]
        );
      }
    }

    isTranslating = false;
  }

  function restoreOriginals() {
    originalTexts.forEach(function (original, nodeOrKey) {
      if (typeof nodeOrKey === "string" && nodeOrKey.startsWith("placeholder-")) {
        // Skip — placeholder restore handled separately
        return;
      }
      if (nodeOrKey instanceof Node) {
        if (nodeOrKey.nodeType === Node.TEXT_NODE) {
          nodeOrKey.nodeValue = original;
        } else {
          nodeOrKey.textContent = original;
        }
      } else if (nodeOrKey instanceof Element) {
        nodeOrKey.textContent = original;
      }
    });

    var placeholderEls = document.querySelectorAll("[data-i18n-placeholder]");
    for (var j = 0; j < placeholderEls.length; j++) {
      var pKey = "placeholder-" + j;
      if (originalTexts.has(pKey)) {
        placeholderEls[j].placeholder = originalTexts.get(pKey);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Language picker UI
  // ---------------------------------------------------------------------------

  function createWidget() {
    var container = document.createElement("div");
    container.id = "angelfood-translator";

    var style = document.createElement("style");
    style.textContent = [
      "#angelfood-translator {",
      "  position: fixed;",
      "  bottom: 24px;",
      "  right: 24px;",
      "  z-index: 999999;",
      "  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;",
      "}",
      "#af-lang-toggle {",
      "  width: 52px;",
      "  height: 52px;",
      "  border-radius: 50%;",
      "  border: 2px solid #e63946;",
      "  background: #fff;",
      "  cursor: pointer;",
      "  font-size: 24px;",
      "  display: flex;",
      "  align-items: center;",
      "  justify-content: center;",
      "  box-shadow: 0 4px 12px rgba(0,0,0,0.15);",
      "  transition: transform 0.2s, box-shadow 0.2s;",
      "}",
      "#af-lang-toggle:hover {",
      "  transform: scale(1.08);",
      "  box-shadow: 0 6px 20px rgba(0,0,0,0.2);",
      "}",
      "#af-lang-menu {",
      "  display: none;",
      "  position: absolute;",
      "  bottom: 62px;",
      "  right: 0;",
      "  background: #fff;",
      "  border-radius: 12px;",
      "  box-shadow: 0 8px 30px rgba(0,0,0,0.18);",
      "  overflow: hidden;",
      "  min-width: 180px;",
      "  border: 1px solid #e5e7eb;",
      "}",
      "#af-lang-menu.af-open { display: block; }",
      "#af-lang-menu-header {",
      "  padding: 12px 16px;",
      "  font-size: 12px;",
      "  font-weight: 600;",
      "  color: #6b7280;",
      "  text-transform: uppercase;",
      "  letter-spacing: 0.05em;",
      "  border-bottom: 1px solid #f3f4f6;",
      "}",
      ".af-lang-option {",
      "  display: flex;",
      "  align-items: center;",
      "  gap: 10px;",
      "  padding: 10px 16px;",
      "  cursor: pointer;",
      "  font-size: 15px;",
      "  color: #1f2937;",
      "  transition: background 0.15s;",
      "  border: none;",
      "  background: none;",
      "  width: 100%;",
      "  text-align: left;",
      "}",
      ".af-lang-option:hover { background: #f9fafb; }",
      ".af-lang-option.af-active {",
      "  background: #fef2f2;",
      "  color: #e63946;",
      "  font-weight: 600;",
      "}",
      ".af-lang-option .af-flag { font-size: 20px; }",
      ".af-lang-option .af-check {",
      "  margin-left: auto;",
      "  font-size: 14px;",
      "}",
    ].join("\n");

    document.head.appendChild(style);

    var toggle = document.createElement("button");
    toggle.id = "af-lang-toggle";
    toggle.innerHTML = "🌐";
    toggle.setAttribute("aria-label", "Select language");
    toggle.setAttribute("title", "Select language");

    var menu = document.createElement("div");
    menu.id = "af-lang-menu";
    menu.setAttribute("role", "menu");

    var header = document.createElement("div");
    header.id = "af-lang-menu-header";
    header.textContent = "Select Language";
    menu.appendChild(header);

    var localeKeys = Object.keys(CONFIG.locales);
    for (var i = 0; i < localeKeys.length; i++) {
      var code = localeKeys[i];
      var info = CONFIG.locales[code];

      var btn = document.createElement("button");
      btn.className = "af-lang-option";
      if (code === currentLocale) btn.className += " af-active";
      btn.setAttribute("role", "menuitem");
      btn.setAttribute("data-locale", code);

      btn.innerHTML =
        '<span class="af-flag">' + info.flag + "</span>" +
        "<span>" + info.label + "</span>" +
        '<span class="af-check">' + (code === currentLocale ? "✓" : "") + "</span>";

      btn.addEventListener("click", (function (locale) {
        return function () {
          switchLocale(locale);
        };
      })(code));

      menu.appendChild(btn);
    }

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      menu.classList.toggle("af-open");
    });

    document.addEventListener("click", function () {
      menu.classList.remove("af-open");
    });

    menu.addEventListener("click", function (e) {
      e.stopPropagation();
    });

    container.appendChild(menu);
    container.appendChild(toggle);
    document.body.appendChild(container);
  }

  function updateWidgetState() {
    var options = document.querySelectorAll(".af-lang-option");
    for (var i = 0; i < options.length; i++) {
      var opt = options[i];
      var locale = opt.getAttribute("data-locale");
      if (locale === currentLocale) {
        opt.classList.add("af-active");
        opt.querySelector(".af-check").textContent = "✓";
      } else {
        opt.classList.remove("af-active");
        opt.querySelector(".af-check").textContent = "";
      }
    }

    var menu = document.getElementById("af-lang-menu");
    if (menu) menu.classList.remove("af-open");
  }

  // ---------------------------------------------------------------------------
  // Main
  // ---------------------------------------------------------------------------

  function switchLocale(locale) {
    if (locale === currentLocale) return;

    currentLocale = locale;
    storeLocale(locale);

    document.documentElement.setAttribute("lang", locale);

    loadTranslations(locale, function () {
      applyTranslations();
      updateWidgetState();
    });
  }

  function observeDom() {
    if (typeof MutationObserver === "undefined") return;

    var debounceTimer;
    var observer = new MutationObserver(function () {
      if (currentLocale === CONFIG.defaultLocale) return;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        applyTranslations();
      }, 200);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function init() {
    var stored = getStoredLocale();
    if (stored && CONFIG.locales[stored]) {
      currentLocale = stored;
    }

    createWidget();

    if (currentLocale !== CONFIG.defaultLocale) {
      loadTranslations(currentLocale, function () {
        applyTranslations();
        updateWidgetState();
      });
    }

    observeDom();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
