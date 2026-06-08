// ─────────────────────────────────────────────
//  Basira QR · Theme Module
// ─────────────────────────────────────────────

const colorSchemes = {
  indigo: { primary:'#6366F1', dark:'#4F46E5', light:'#818CF8', accent:'#8B5CF6' },
  teal:   { primary:'#14B8A6', dark:'#0D9488', light:'#2DD4BF', accent:'#06B6D4' },
  orange: { primary:'#F97316', dark:'#EA580C', light:'#FB923C', accent:'#EF4444' },
  purple: { primary:'#A855F7', dark:'#9333EA', light:'#C084FC', accent:'#D946EF' },
  blue:   { primary:'#2196F3', dark:'#1976D2', light:'#42A5F5', accent:'#03A9F4' },
  green:  { primary:'#10B981', dark:'#059669', light:'#34D399', accent:'#14B8A6' },
};

const Theme = {
  mode: 'system',      // 'light' | 'dark' | 'system'
  scheme: 'indigo',

  init() {
    this.mode   = Storage.getThemeMode()   || 'system';
    this.scheme = Storage.getColorScheme() || 'indigo';
    this.apply();

    // Listen to system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (this.mode === 'system') this.apply();
    });
  },

  isDark() {
    if (this.mode === 'dark') return true;
    if (this.mode === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  },

  apply() {
    const root = document.documentElement;
    const dark = this.isDark();
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    root.setAttribute('data-scheme', this.scheme);
    const c = colorSchemes[this.scheme] || colorSchemes.indigo;
    root.style.setProperty('--color-primary',       c.primary);
    root.style.setProperty('--color-primary-dark',  c.dark);
    root.style.setProperty('--color-primary-light', c.light);
    root.style.setProperty('--color-accent',        c.accent);

    // Update theme-color meta
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = dark ? '#0F172A' : c.primary;
  },

  setMode(mode) {
    this.mode = mode;
    Storage.storeThemeMode(mode);
    this.apply();
  },

  setScheme(scheme) {
    this.scheme = scheme;
    Storage.storeColorScheme(scheme);
    this.apply();
  },

  getSchemes() { return Object.keys(colorSchemes); },
  getSchemeColor(name) { return (colorSchemes[name] || colorSchemes.indigo).primary; },
};

window.Theme = Theme;
window.colorSchemes = colorSchemes;
