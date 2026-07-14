// ─────────────────────────────────────────────
//  Basira QR · E2E Translation Tests
// ─────────────────────────────────────────────

function loadIframe(url) {
  return new Promise((resolve) => {
    const iframe = document.createElement('iframe');
    iframe.style.width = '800px';
    iframe.style.height = '600px';
    iframe.style.position = 'fixed';
    iframe.style.bottom = '-9999px'; // hide visually but keep layout active
    iframe.style.left = '0';
    iframe.src = url;
    iframe.onload = () => resolve(iframe);
    document.body.appendChild(iframe);
  });
}

const e2eTests = {
  'E2E — Landing Page (Arabic index.html)': async () => {
    const iframe = await loadIframe('../index.html');
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    T.assertEqual('index.html language is Arabic (ar)', doc.documentElement.lang, 'ar');
    T.assertEqual('index.html direction is RTL (rtl)', doc.documentElement.dir, 'rtl');

    const switchLink = doc.querySelector('.lang-switch');
    T.assert('index.html has a language switcher link', !!switchLink);
    if (switchLink) {
      T.assertEqual('language switcher points to index.en.html', switchLink.getAttribute('href'), './index.en.html');
    }

    document.body.removeChild(iframe);
  },

  'E2E — Landing Page (English index.en.html)': async () => {
    const iframe = await loadIframe('../index.en.html');
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    T.assertEqual('index.en.html language is English (en)', doc.documentElement.lang, 'en');
    T.assertEqual('index.en.html direction is LTR (ltr)', doc.documentElement.dir, 'ltr');

    const switchLink = doc.querySelector('.lang-switch');
    T.assert('index.en.html has a language switcher link', !!switchLink);
    if (switchLink) {
      T.assertEqual('language switcher points to index.html', switchLink.getAttribute('href'), './index.html');
    }

    document.body.removeChild(iframe);
  },

  'E2E — App Welcome Screen Toggles & Live Rendering': async () => {
    // Clear setup states so welcome tab is displayed
    window.localStorage.removeItem('api_key');
    window.localStorage.removeItem('basira_locale');

    const iframe = await loadIframe('../app.html');
    // Give some time for scripts to bootstrap
    await new Promise(r => setTimeout(r, 400));
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    // Check default layout language (Option A: should match navigator.language)
    const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    const expectedDefault = browserLang.startsWith('ar') ? 'ar' : 'en';

    T.assertEqual('App starts in browser language locale by default', doc.documentElement.lang, expectedDefault);

    const welcomeScreen = doc.getElementById('setup-tab-welcome');
    T.assert('app.html shows welcome screen because API key is absent', welcomeScreen && !welcomeScreen.classList.contains('hidden'));

    const langBtns = doc.querySelectorAll('#setup-tab-welcome .lang-btn');
    T.assertEqual('Welcome screen has 2 language toggle buttons', langBtns.length, 2);

    const enBtn = doc.querySelector('#setup-tab-welcome .lang-btn[data-lang="en"]');
    const arBtn = doc.querySelector('#setup-tab-welcome .lang-btn[data-lang="ar"]');
    T.assert('English switcher button exists', !!enBtn);
    T.assert('Arabic switcher button exists', !!arBtn);

    if (enBtn && arBtn) {
      // Toggle to English
      enBtn.click();
      await new Promise(r => setTimeout(r, 200));

      T.assertEqual('switching to en updates HTML language attribute', doc.documentElement.lang, 'en');
      T.assertEqual('switching to en updates HTML direction to ltr', doc.documentElement.dir, 'ltr');

      const titleEl = doc.querySelector('#setup-tab-welcome .setup-title');
      T.assertEqual('title text translated to English', titleEl.textContent.trim(), 'Welcome to BasiraQr');

      // Toggle to Arabic
      arBtn.click();
      await new Promise(r => setTimeout(r, 200));

      T.assertEqual('switching to ar updates HTML language attribute', doc.documentElement.lang, 'ar');
      T.assertEqual('switching to ar updates HTML direction to rtl', doc.documentElement.dir, 'rtl');
      T.assertEqual('title text translated back to Arabic', titleEl.textContent.trim(), 'مرحباً بك في بصيرة كيو آر');
    }

    document.body.removeChild(iframe);
  }
};

window.e2eTests = e2eTests;
