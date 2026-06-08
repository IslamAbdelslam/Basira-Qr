// LocalStorage mock — isolated store per test suite, never touches real browser storage
function makeLocalStorageMock() {
  let store = {};
  return {
    getItem:    (k) => store[k] ?? null,
    setItem:    (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear:      () => { store = {}; },
  };
}

const storageTests = {
  'Storage — API Key': () => {
    const ls = makeLocalStorageMock();
    const orig = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: ls, configurable: true });

    Storage.storeApiKey('my-api-key-123');
    T.assertEqual('stores and retrieves API key', Storage.getApiKey(), 'my-api-key-123');

    Storage.storeApiKey('updated-key-456');
    T.assertEqual('overwrites existing key', Storage.getApiKey(), 'updated-key-456');

    Storage.removeApiKey();
    T.assertEqual('removes API key → null', Storage.getApiKey(), null);

    T.assertEqual('missing key → null', Storage.getApiKey(), null);

    Object.defineProperty(window, 'localStorage', { value: orig, configurable: true });
  },

  'Storage — Scan History: basic operations': () => {
    const ls = makeLocalStorageMock();
    const orig = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: ls, configurable: true });

    T.assertEqual('empty history is []', Storage.getScanHistory(), []);

    Storage.addScanResult({ url: 'https://a.com', securityLevel: 'SAFE' });
    const h1 = Storage.getScanHistory();
    T.assertEqual('history has 1 item', h1.length, 1);
    T.assertEqual('correct url stored', h1[0].url, 'https://a.com');
    T.assertEqual('correct level stored', h1[0].securityLevel, 'SAFE');
    T.assert('has numeric id', typeof h1[0].id === 'number');
    T.assert('has ISO timestamp', h1[0].timestamp.includes('T'));

    Storage.clearScanHistory();
    T.assertEqual('cleared history is []', Storage.getScanHistory(), []);

    Object.defineProperty(window, 'localStorage', { value: orig, configurable: true });
  },

  'Storage — Scan History: newest-first ordering': () => {
    const ls = makeLocalStorageMock();
    const orig = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: ls, configurable: true });

    Storage.addScanResult({ url: 'https://first.com',  securityLevel: 'SAFE' });
    Storage.addScanResult({ url: 'https://second.com', securityLevel: 'MALICIOUS' });
    Storage.addScanResult({ url: 'https://third.com',  securityLevel: 'SUSPICIOUS' });

    const h = Storage.getScanHistory();
    T.assertEqual('newest item is first', h[0].url, 'https://third.com');
    T.assertEqual('oldest item is last',  h[2].url, 'https://first.com');

    Object.defineProperty(window, 'localStorage', { value: orig, configurable: true });
  },

  'Storage — Scan History: capped at 20': () => {
    const ls = makeLocalStorageMock();
    const orig = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: ls, configurable: true });

    for (let i = 0; i < 25; i++) {
      Storage.addScanResult({ url: `https://site${i}.com`, securityLevel: 'UNKNOWN' });
    }
    const h = Storage.getScanHistory();
    T.assertEqual('history capped at 20', h.length, 20);
    // Oldest (site0..site4) should be dropped; newest (site24) should be first
    T.assertEqual('newest (site24) is first', h[0].url, 'https://site24.com');
    T.assertEqual('site5 is last (site0-4 dropped)', h[19].url, 'https://site5.com');

    Object.defineProperty(window, 'localStorage', { value: orig, configurable: true });
  },

  'Storage — Scan History: corrupted JSON handled gracefully': () => {
    const ls = makeLocalStorageMock();
    const orig = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: ls, configurable: true });

    // Inject corrupted JSON directly
    ls.setItem('scan_history', '{broken json{{');
    let history;
    try { history = Storage.getScanHistory(); } catch (e) { history = 'THREW'; }
    // Should not throw — graceful fallback expected
    T.assert('corrupted JSON does not crash app', history !== 'THREW');

    Object.defineProperty(window, 'localStorage', { value: orig, configurable: true });
  },

  'Storage — Settings': () => {
    const ls = makeLocalStorageMock();
    const orig = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: ls, configurable: true });

    Storage.storeSettings({ httpsWarning: false, urlScanning: true });
    T.assertEqual('stores and retrieves settings', Storage.getSettings(), { httpsWarning: false, urlScanning: true });

    Storage.storeSettings({ httpsWarning: true, urlScanning: false, extraProp: 'yes' });
    T.assertEqual('overwrites all settings', Storage.getSettings().httpsWarning, true);
    T.assertEqual('extra props preserved', Storage.getSettings().extraProp, 'yes');

    ls.removeItem('app_settings');
    T.assertEqual('missing settings → {}', Storage.getSettings(), {});

    Object.defineProperty(window, 'localStorage', { value: orig, configurable: true });
  },

  'Storage — Locale & Theme': () => {
    const ls = makeLocalStorageMock();
    const orig = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: ls, configurable: true });

    Storage.storeLocale('en');
    T.assertEqual('stores en locale', Storage.getLocale(), 'en');
    Storage.storeLocale('ar');
    T.assertEqual('overwrites with ar locale', Storage.getLocale(), 'ar');

    Storage.storeThemeMode('light');
    T.assertEqual('stores light mode', Storage.getThemeMode(), 'light');
    Storage.storeThemeMode('dark');
    T.assertEqual('overwrites with dark mode', Storage.getThemeMode(), 'dark');

    Storage.storeColorScheme('teal');
    T.assertEqual('stores teal scheme', Storage.getColorScheme(), 'teal');
    Storage.storeColorScheme('purple');
    T.assertEqual('overwrites with purple scheme', Storage.getColorScheme(), 'purple');

    Object.defineProperty(window, 'localStorage', { value: orig, configurable: true });
  },
};

window.storageTests = storageTests;
