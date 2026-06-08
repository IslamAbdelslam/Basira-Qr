// ─────────────────────────────────────────────
//  Storage Tests (with localStorage mock)
// ─────────────────────────────────────────────

// LocalStorage mock that runs in any environment
function makeLocalStorageMock() {
  let store = {};
  return {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { store = {}; },
  };
}

const storageTests = {
  'Storage — API Key': () => {
    const ls = makeLocalStorageMock();
    // Patch localStorage for the duration of this suite
    const orig = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: ls, configurable: true });

    Storage.storeApiKey('my-api-key-123');
    T.assertEqual('stores and retrieves API key', Storage.getApiKey(), 'my-api-key-123');

    Storage.removeApiKey();
    T.assertEqual('removes API key', Storage.getApiKey(), null);

    Object.defineProperty(window, 'localStorage', { value: orig, configurable: true });
  },

  'Storage — Scan History': () => {
    const ls = makeLocalStorageMock();
    const orig = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: ls, configurable: true });

    // Empty state
    T.assertEqual('empty history is []', Storage.getScanHistory(), []);

    // Add one item
    Storage.addScanResult({ url: 'https://a.com', securityLevel: 'SAFE' });
    const h1 = Storage.getScanHistory();
    T.assertEqual('history has 1 item', h1.length, 1);
    T.assertEqual('correct url stored', h1[0].url, 'https://a.com');
    T.assert('has id', typeof h1[0].id === 'number');
    T.assert('has timestamp', typeof h1[0].timestamp === 'string');

    // Cap at 20
    for (let i = 0; i < 25; i++) {
      Storage.addScanResult({ url: `https://site${i}.com`, securityLevel: 'UNKNOWN' });
    }
    T.assertEqual('history capped at 20', Storage.getScanHistory().length, 20);

    // Clear
    Storage.clearScanHistory();
    T.assertEqual('cleared history is []', Storage.getScanHistory(), []);

    Object.defineProperty(window, 'localStorage', { value: orig, configurable: true });
  },

  'Storage — Settings': () => {
    const ls = makeLocalStorageMock();
    const orig = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: ls, configurable: true });

    Storage.storeSettings({ httpsWarning: false, urlScanning: true });
    T.assertEqual('stores and retrieves settings', Storage.getSettings(), { httpsWarning: false, urlScanning: true });

    // Empty settings returns {}
    ls.removeItem('app_settings');
    T.assertEqual('missing settings → {}', Storage.getSettings(), {});

    Object.defineProperty(window, 'localStorage', { value: orig, configurable: true });
  },

  'Storage — Locale & Theme': () => {
    const ls = makeLocalStorageMock();
    const orig = window.localStorage;
    Object.defineProperty(window, 'localStorage', { value: ls, configurable: true });

    Storage.storeLocale('en');
    T.assertEqual('stores locale', Storage.getLocale(), 'en');

    Storage.storeThemeMode('light');
    T.assertEqual('stores theme mode', Storage.getThemeMode(), 'light');

    Storage.storeColorScheme('teal');
    T.assertEqual('stores color scheme', Storage.getColorScheme(), 'teal');

    Object.defineProperty(window, 'localStorage', { value: orig, configurable: true });
  },
};

window.storageTests = storageTests;
