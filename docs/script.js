// BasiraQr Docs Script - theme + language handling
(function () {
  const prefersDark = true; // default dark
  const themeKey = "basiraqr_theme";
  const langKey = "basiraqr_lang";

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(themeKey, theme);
  }

  function initTheme() {
    const saved = localStorage.getItem(themeKey);
    setTheme(saved || (prefersDark ? "dark" : "light"));
  }

  function onThemeToggle() {
    const current =
      document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(current === "dark" ? "light" : "dark");
  }

  function initLanguage(currentLang) {
    // Persist language choice
    if (currentLang) {
      localStorage.setItem(langKey, currentLang);
    }
    const saved = localStorage.getItem(langKey);
    return saved || currentLang || "ar";
  }

  function wireControls(lang) {
    const themeBtn = document.getElementById("theme-toggle");
    if (themeBtn) themeBtn.addEventListener("click", onThemeToggle);

    const langAr = document.getElementById("lang-ar");
    const langEn = document.getElementById("lang-en");
    if (langAr)
      langAr.addEventListener("click", () => {
        localStorage.setItem(langKey, "ar");
        if (
          !location.pathname.endsWith(".html") ||
          location.pathname.endsWith("/")
        ) {
          location.href = "index.html";
        } else {
          location.href = location.pathname.replace(".en.html", ".html");
        }
      });
    if (langEn)
      langEn.addEventListener("click", () => {
        localStorage.setItem(langKey, "en");
        if (location.pathname.endsWith(".html")) {
          const p = location.pathname;
          if (p.endsWith(".en.html")) return;
          location.href = p.replace(".html", ".en.html");
        } else {
          location.href = "index.en.html";
        }
      });

    // Highlight active nav
    const links = document.querySelectorAll(".nav-links a");
    links.forEach((a) => {
      if (
        a.getAttribute("href") &&
        location.pathname.endsWith(a.getAttribute("href"))
      ) {
        a.classList.add("chip");
      }
    });
  }

  // Initialize
  initTheme();
  const pageLang = document.documentElement.lang || "ar";
  initLanguage(pageLang);
  wireControls(pageLang);
})();
