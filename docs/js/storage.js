// ─────────────────────────────────────────────
//  Basira QR · Storage Module (localStorage)
// ─────────────────────────────────────────────

const Storage = {
  _get(key) {
    try { return localStorage.getItem(key); } catch { return null; }
  },
  _set(key, val) {
    try { localStorage.setItem(key, val); } catch {}
  },
  _del(key) {
    try { localStorage.removeItem(key); } catch {}
  },

  // API Key
  storeApiKey(key)  { this._set('vt_api_key', key); },
  getApiKey()       { return this._get('vt_api_key'); },
  removeApiKey()    { this._del('vt_api_key'); },

  // Settings
  storeSettings(settings) { this._set('app_settings', JSON.stringify(settings)); },
  getSettings() {
    const raw = this._get('app_settings');
    if (!raw) return {};
    try { return JSON.parse(raw); } catch { return {}; }
  },

  // Locale
  storeLocale(locale) { this._set('app_locale', locale); },
  getLocale()         { return this._get('app_locale'); },

  // Theme
  storeThemeMode(mode)  { this._set('app_theme_mode', mode); },
  getThemeMode()        { return this._get('app_theme_mode'); },

  // Color Scheme
  storeColorScheme(scheme) { this._set('app_color_scheme', scheme); },
  getColorScheme()          { return this._get('app_color_scheme'); },

  // Scan History (up to 20 items)
  getScanHistory() {
    const raw = this._get('scan_history');
    if (!raw) return [];
    try { return JSON.parse(raw); } catch { return []; } // corrupted data → reset gracefully
  },
  addScanResult(result) {
    const history = this.getScanHistory();
    history.unshift({ ...result, id: Date.now(), timestamp: new Date().toISOString() });
    this._set('scan_history', JSON.stringify(history.slice(0, 20)));
  },
  clearScanHistory() { this._del('scan_history'); },
};

window.Storage = Storage;
