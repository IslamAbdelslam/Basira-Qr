// ─────────────────────────────────────────────
//  Basira QR · Main App
// ─────────────────────────────────────────────

const App = {
  state: {
    apiKey: null,
    scanHistory: [],
    settings: { httpsWarning: true, autoBlockMalicious: true, urlScanning: true },
    currentScanResult: null,
    isOnline: navigator.onLine,
    scannerRunning: false,
  },

  // ── Bootstrap ─────────────────────────────
  init() {
    let savedLocale = Storage.getLocale();
    if (!savedLocale) {
      const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
      savedLocale = browserLang.startsWith('ar') ? 'ar' : 'en';
    }
    i18n.setLocale(savedLocale);
    Theme.init();
    this.state.apiKey = Storage.getApiKey();
    const saved = Storage.getSettings();
    if (Object.keys(saved).length) Object.assign(this.state.settings, saved);
    this.state.scanHistory = Storage.getScanHistory();
    window.addEventListener('online',  () => { this.state.isOnline = true;  this._updateNetworkBanner(); });
    window.addEventListener('offline', () => { this.state.isOnline = false; this._updateNetworkBanner(); });
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
    // Always start on scanner; if no key, also go to key tab
    if (this.state.apiKey) {
      this.showScreen('scanner');
      this.startScanner();
    } else {
      this.showScreen('setup');  // key tab
    }
    this._updateBottomNavVisibility();
    this.renderSettings();
    this._updateHistoryBadge();
  },

  // ── Router ────────────────────────────────
  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(`screen-${name}`)?.classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.nav-btn[data-screen="${name}"]`)?.classList.add('active');
    if (name !== 'scanner' && this.state.scannerRunning) {
      Scanner.stop();
      this.state.scannerRunning = false;
    }
    if (name === 'settings') this.renderSettings();
    if (name === 'history')  this.renderHistory();
    if (name === 'setup')    this.renderSetupTab();
  },

  renderSetupTab() {
    // Update key display inside setup tab
    const el = document.getElementById('setup-tab-current-key');
    if (el) el.textContent = this.state.apiKey ? `••••${this.state.apiKey.slice(-6)}` : '';
    const changeSection = document.getElementById('setup-tab-change');
    const welcomeSection = document.getElementById('setup-tab-welcome');
    if (this.state.apiKey) {
      changeSection?.classList.remove('hidden');
      welcomeSection?.classList.add('hidden');
    } else {
      changeSection?.classList.add('hidden');
      welcomeSection?.classList.remove('hidden');
    }
  },

  // ── Setup Screen ──────────────────────────
  initSetup() {
    const form   = document.getElementById('setup-form');
    const input  = document.getElementById('api-key-input');
    const toggle = document.getElementById('toggle-key-visibility');
    const btn    = document.getElementById('validate-btn');

    toggle.addEventListener('click', () => {
      input.type = input.type === 'password' ? 'text' : 'password';
      toggle.textContent = input.type === 'password' ? '👁️' : '🙈';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const key = input.value.trim();
      if (!key) { this.showToast(i18n.t('errors.enterValidKey'), 'error'); return; }

      btn.disabled = true;
      btn.textContent = i18n.t('settings.validating');

      VirusTotalService.setApiKey(key);
      const { valid, skipped } = await VirusTotalService.validateApiKey(key);

      if (valid) {
        Storage.storeApiKey(key);
        this.state.apiKey = key;
        this._updateBottomNavVisibility();
        if (skipped) {
          this.showToast(i18n.t('errors.apiKeyUnverified'), 'warning');
        } else {
          this.showToast(i18n.t('errors.apiKeyUpdated'), 'success');
        }
        setTimeout(() => { this.showScreen('scanner'); this.startScanner(); }, 800);
      } else {
        this.showToast(i18n.t('errors.invalidApiKeyMessage'), 'error');
      }

      btn.disabled = false;
      btn.textContent = i18n.t('setup.validateContinue');
    });
  },

  // ── Scanner Screen ────────────────────────
  async startScanner() {
    const video = document.getElementById('scanner-video');
    const overlay = document.getElementById('processing-overlay');
    const statusText = document.getElementById('scanner-status');

    this._updateNetworkBanner();
    overlay.classList.add('hidden');
    statusText.textContent = i18n.t('scanner.active');

    try {
      await Scanner.start(video, async (data) => {
        this.state.scannerRunning = false;
        await this._handleQrResult(data);
      });
      this.state.scannerRunning = true;
    } catch (err) {
      const errEl   = document.getElementById('camera-error');
      const errMsg  = document.getElementById('camera-error-msg');
      const viewfinder = document.getElementById('scanner-viewfinder');
      viewfinder.classList.add('hidden');
      errEl.classList.remove('hidden');

      if (err.message === 'NEEDS_HTTPS') {
        errMsg.innerHTML = `
          <strong>📡 يلزم HTTPS للكاميرا</strong><br><br>
          افتح التطبيق من هذا الرابط الآمن على هاتفك:<br>
          <a href="https://islamabdelslam.github.io/Basira-Qr/"
             style="color:var(--color-primary);font-weight:700;word-break:break-all">
            islamabdelslam.github.io/Basira-Qr/
          </a><br><br>
          <small style="color:var(--text-3)">Camera requires HTTPS — local IP addresses don't work.</small>`;
      } else if (err.message === 'CAMERA_DENIED') {
        errMsg.innerHTML = `
          <strong>🔒 ${i18n.t('scanner.cameraRequired')}</strong><br><br>
          ${i18n.t('scanner.cameraMsg')}<br><br>
          <small style="color:var(--text-3)">Go to Chrome Settings → Site Settings → Camera → Allow this site.</small>`;
      } else {
        errMsg.innerHTML = `
          <strong>📷 ${i18n.t('errors.cameraNotSupported')}</strong><br><br>
          <small style="color:var(--text-3)">
            Make sure you opened the app over <b>HTTPS</b> (not HTTP).<br>
            URL: <code>${location.href}</code><br>
            Secure: <code>${window.isSecureContext}</code>
          </small>`;
      }
    }
  },

  async _handleQrResult(data) {
    const overlay = document.getElementById('processing-overlay');
    const stageText = document.getElementById('processing-stage');

    if (!UrlValidator.isValidUrl(data)) {
      this.showToast(`${i18n.t('errors.notUrl')}: ${data.substring(0, 60)}`, 'error');
      setTimeout(() => Scanner.resume(), 3000);
      this.state.scannerRunning = true;
      return;
    }

    const url = UrlValidator.sanitizeUrl(data);
    const isHttps = UrlValidator.isHttps(url);

    // Show processing overlay
    overlay.classList.remove('hidden');
    stageText.textContent = i18n.t('scanner.analyzingUrl');

    let report = { positives: 0, total: 0, responseCode: 0, scans: {}, permalink: '', message: 'Offline mode' };
    let securityLevel = 'UNKNOWN';

    if (this.state.isOnline && this.state.apiKey && this.state.settings.urlScanning) {
      try {
        VirusTotalService.setApiKey(this.state.apiKey);
        report = await VirusTotalService.scanUrl(url);
        securityLevel = VirusTotalService.determineSecurityLevel(report);
      } catch (err) {
        if (err.message === 'QUEUED') {
          this.showToast(i18n.t('scanner.loading'), 'warning');
        } else if (err.message.includes('CORS') || err.message.includes('Failed to fetch')) {
          this.showToast(i18n.t('errors.corsError'), 'warning');
        } else {
          this.showToast(err.message || i18n.t('errors.scanErrorMessage'), 'error');
        }
      }
    }

    overlay.classList.add('hidden');

    const result = { url, isHttps, virusTotalReport: report, securityLevel, domain: UrlValidator.extractDomain(url) };
    Storage.addScanResult(result);
    this.state.scanHistory = Storage.getScanHistory();
    this._updateHistoryBadge();

    this.state.currentScanResult = result;
    this.renderResults(result);
    this.showScreen('results');
  },

  _updateNetworkBanner() {
    const banner = document.getElementById('network-banner');
    if (!banner) return;
    if (!this.state.isOnline) {
      banner.textContent = i18n.t('scanner.noInternetBanner');
      banner.classList.remove('hidden');
    } else {
      banner.classList.add('hidden');
    }
  },

  _updateHistoryBadge() {
    const badge = document.getElementById('history-badge');
    if (badge) badge.textContent = this.state.scanHistory.length;
  },

  _updateBottomNavVisibility() {
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
      bottomNav.classList.toggle('hidden', !this.state.apiKey);
    }
  },

  // ── Results Screen ────────────────────────
  renderResults(r) {
    const levelMap = {
      SAFE:       { icon:'✅', color:'var(--color-success)', label: i18n.t('results.safeToVisit'),      msg: i18n.t('results.safeMessage'),       action: i18n.t('results.safeAction') },
      SUSPICIOUS: { icon:'⚠️', color:'var(--color-warning)', label: i18n.t('results.suspiciousTitle'),  msg: i18n.t('results.suspiciousMessage', { positives: r.virusTotalReport.positives, total: r.virusTotalReport.total }), action: i18n.t('results.suspiciousAction') },
      MALICIOUS:  { icon:'🚨', color:'var(--color-danger)',  label: i18n.t('results.maliciousTitle'),   msg: i18n.t('results.maliciousMessage',  { positives: r.virusTotalReport.positives, total: r.virusTotalReport.total }), action: i18n.t('results.maliciousAction') },
      UNKNOWN:    { icon:'❓', color:'#9E9E9E',              label: i18n.t('results.unknownTitle'),     msg: i18n.t('results.unknownMessage'),    action: i18n.t('results.unknownAction') },
    };
    const info = levelMap[r.securityLevel] || levelMap.UNKNOWN;

    // Badge
    const badge = document.getElementById('security-badge');
    badge.textContent = `${info.icon} ${info.label}`;
    badge.style.background = info.color;

    // Status text
    document.getElementById('result-status-msg').textContent = info.msg;
    document.getElementById('result-action-text').textContent = info.action;

    // URL info
    document.getElementById('result-url').textContent = r.url;
    document.getElementById('result-domain').textContent = r.domain;
    document.getElementById('result-protocol').textContent = r.isHttps ? '🔒 HTTPS' : '⚠️ HTTP';
    document.getElementById('result-protocol').style.color = r.isHttps ? 'var(--color-success)' : 'var(--color-warning)';

    // Score
    const vt = r.virusTotalReport;
    document.getElementById('result-score').textContent = `${vt.positives}/${vt.total}`;

    // HTTP warning
    const httpWarn = document.getElementById('result-http-warning');
    httpWarn.classList.toggle('hidden', r.isHttps);

    // Open button style
    const openBtn = document.getElementById('result-open-btn');
    const btnMap = { SAFE:'var(--color-success)', SUSPICIOUS:'var(--color-warning)', MALICIOUS:'var(--color-danger)', UNKNOWN:'#9E9E9E' };
    const btnLabelMap = { SAFE: i18n.t('results.openSafely'), SUSPICIOUS: i18n.t('results.openCaution'), MALICIOUS: i18n.t('results.doNotOpen'), UNKNOWN: i18n.t('results.openOwnRisk') };
    openBtn.style.background = btnMap[r.securityLevel] || '#9E9E9E';
    openBtn.textContent = btnLabelMap[r.securityLevel] || i18n.t('results.openOwnRisk');

    // Permalink
    const permaBtn = document.getElementById('result-permalink-btn');
    if (vt.permalink) { permaBtn.classList.remove('hidden'); permaBtn.onclick = () => window.open(vt.permalink, '_blank'); }
    else permaBtn.classList.add('hidden');

    // Vendor list (top 10)
    const vendorList = document.getElementById('vendor-list');
    const vendors = Object.entries(vt.scans || {}).slice(0, 10);
    vendorList.innerHTML = vendors.map(([v, res]) => `
      <div class="vendor-row">
        <span class="vendor-name">${v}</span>
        <span class="vendor-result ${res.detected ? 'detected' : 'clean'}">${res.detected ? (res.result || i18n.t('results.malicious')) : i18n.t('results.clean')}</span>
      </div>`).join('') || `<p class="text-muted" style="text-align:center;padding:10px">${i18n.t('results.unknownMessage')}</p>`;
  },

  // ── History Screen ────────────────────────
  renderHistory() {
    const list = document.getElementById('history-list');
    const history = Storage.getScanHistory();
    const levelIcon = { SAFE:'✅', SUSPICIOUS:'⚠️', MALICIOUS:'🚨', UNKNOWN:'❓' };

    if (!history.length) {
      list.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><p>${i18n.t('settings.scansCount', { count: 0 })}</p></div>`;
      return;
    }

    list.innerHTML = history.map(item => `
      <div class="history-card" onclick="App._viewHistoryItem(${item.id})">
        <div class="history-icon">${levelIcon[item.securityLevel] || '❓'}</div>
        <div class="history-info">
          <div class="history-domain">${item.domain}</div>
          <div class="history-meta">${item.securityLevel} · ${new Date(item.timestamp).toLocaleString()}</div>
        </div>
        <div class="history-arrow">›</div>
      </div>`).join('');
  },

  _viewHistoryItem(id) {
    const item = Storage.getScanHistory().find(i => i.id === id);
    if (!item) return;
    this.state.currentScanResult = item;
    this.renderResults(item);
    this.showScreen('results');
  },

  // ── Settings Screen ───────────────────────
  renderSettings() {
    // API key display
    const keyDisplay = document.getElementById('api-key-display');
    if (keyDisplay) {
      const key = this.state.apiKey;
      keyDisplay.textContent = key ? `••••${key.slice(-6)}` : i18n.t('settings.notSet');
    }

    // Scan count
    const countEl = document.getElementById('scan-count');
    if (countEl) countEl.textContent = i18n.t('settings.scansCount', { count: this.state.scanHistory.length });

    // Toggles
    this._setToggle('toggle-https-warning', this.state.settings.httpsWarning);
    this._setToggle('toggle-url-scanning',  this.state.settings.urlScanning);

    // Theme mode buttons
    document.querySelectorAll('.mode-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === Theme.mode);
    });

    // Color scheme swatches
    document.querySelectorAll('.scheme-swatch').forEach(s => {
      s.classList.toggle('active', s.dataset.scheme === Theme.scheme);
    });

    // Language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === i18n.getLocale());
    });
  },

  _setToggle(id, val) {
    const el = document.getElementById(id);
    if (el) el.checked = !!val;
  },

  // ── Global Actions ────────────────────────
  openUrl(url, level) {
    if (level === 'MALICIOUS') {
      this.showModal(
        i18n.t('errors.dangerousUrl'),
        i18n.t('errors.dangerousUrlMessage'),
        [{ label: i18n.t('common.cancel'), close: true },
         { label: i18n.t('errors.openAnyway'), danger: true, action: () => window.open(url, '_blank') }]
      );
    } else if (level === 'SUSPICIOUS') {
      this.showModal(
        i18n.t('errors.suspiciousUrl'),
        i18n.t('errors.suspiciousUrlMessage'),
        [{ label: i18n.t('common.cancel'), close: true },
         { label: i18n.t('errors.openCarefully'), action: () => window.open(url, '_blank') }]
      );
    } else {
      window.open(url, '_blank');
    }
  },

  shareResults() {
    const r = this.state.currentScanResult;
    if (!r) return;
    const text = `BasiraQr Scan Result:\nURL: ${r.url}\nStatus: ${r.securityLevel}\nScore: ${r.virusTotalReport.positives}/${r.virusTotalReport.total}`;
    if (navigator.share) {
      navigator.share({ title: 'BasiraQr Results', text });
    } else {
      navigator.clipboard.writeText(text).then(() => this.showToast('Copied to clipboard', 'success'));
    }
  },

  removeApiKey() {
    this.showModal(
      i18n.t('errors.removeApiKeyTitle'),
      i18n.t('errors.removeApiKeyMessage'),
      [{ label: i18n.t('common.cancel'), close: true },
       { label: i18n.t('settings.removeKey'), danger: true, action: () => {
           Storage.removeApiKey();
           this.state.apiKey = null;
           this._updateBottomNavVisibility();
           Scanner.stop();
           this.state.scannerRunning = false;
           this.showScreen('setup');
         }
       }]
    );
  },

  clearHistory() {
    this.showModal(
      i18n.t('errors.clearHistoryTitle'),
      i18n.t('errors.clearHistoryMessage'),
      [{ label: i18n.t('common.cancel'), close: true },
       { label: i18n.t('settings.clearHistory'), danger: true, action: () => {
           Storage.clearScanHistory();
           this.state.scanHistory = [];
           this._updateHistoryBadge();
           this.renderSettings();
           this.showToast(i18n.t('errors.successMessage'), 'success');
         }
       }]
    );
  },

  openChangeApiKey() {
    const modal = document.getElementById('change-key-modal');
    modal.classList.remove('hidden');
    document.getElementById('new-key-input').value = '';
  },

  closeChangeKeyModal() {
    document.getElementById('change-key-modal').classList.add('hidden');
  },

  async saveNewApiKey() {
    const input = document.getElementById('new-key-input');
    const key = input.value.trim();
    const btn = document.getElementById('save-key-btn');
    if (!key) { this.showToast(i18n.t('errors.enterValidKey'), 'error'); return; }

    btn.disabled = true;
    btn.textContent = i18n.t('settings.validating');
    VirusTotalService.setApiKey(key);
    const { valid, skipped } = await VirusTotalService.validateApiKey(key);

    if (valid) {
      Storage.storeApiKey(key);
      this.state.apiKey = key;
      this._updateBottomNavVisibility();
      this.closeChangeKeyModal();
      this.renderSettings();
      if (skipped) {
        this.showToast(i18n.t('errors.apiKeyUnverified'), 'warning');
      } else {
        this.showToast(i18n.t('errors.apiKeyUpdated'), 'success');
      }
    } else {
      this.showToast(i18n.t('errors.invalidApiKeyMessage'), 'error');
    }

    btn.disabled = false;
    btn.textContent = i18n.t('common.save');
  },

  setThemeMode(mode) {
    Theme.setMode(mode);
    this.renderSettings();
  },

  setColorScheme(scheme) {
    Theme.setScheme(scheme);
    this.renderSettings();
  },

  setLanguage(lang) {
    i18n.setLocale(lang);
    Storage.storeLocale(lang);
    // Re-render UI text
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      el.textContent = i18n.t(key);
    });
    this.renderSettings();
    this._updateNetworkBanner();
  },

  toggleSetting(key) {
    this.state.settings[key] = !this.state.settings[key];
    Storage.storeSettings(this.state.settings);
  },

  // ── Toast ─────────────────────────────────
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3500);
  },

  // ── Modal ─────────────────────────────────
  showModal(title, message, buttons = []) {
    const modal  = document.getElementById('modal-overlay');
    const mTitle = document.getElementById('modal-title');
    const mMsg   = document.getElementById('modal-message');
    const mBtns  = document.getElementById('modal-buttons');

    mTitle.textContent = title;
    mMsg.textContent   = message;
    mBtns.innerHTML    = '';

    buttons.forEach(b => {
      const btn = document.createElement('button');
      btn.textContent = b.label;
      btn.className = `modal-btn ${b.danger ? 'danger' : b.close ? 'secondary' : 'primary'}`;
      btn.onclick = () => {
        modal.classList.add('hidden');
        if (b.action) b.action();
      };
      mBtns.appendChild(btn);
    });

    modal.classList.remove('hidden');
  },

  closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
  },
};

// ── DOM Ready ──────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  App.initSetup();
  App.init();
  App._updateHistoryBadge();

  // Wire up nav buttons
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const screen = btn.dataset.screen;
      App.showScreen(screen);
      if (screen === 'scanner' && !App.state.scannerRunning) {
        App.startScanner();
      }
    });
  });

  // Results screen buttons
  document.getElementById('result-open-btn')?.addEventListener('click', () => {
    const r = App.state.currentScanResult;
    if (r) App.openUrl(r.url, r.securityLevel);
  });
  document.getElementById('result-share-btn')?.addEventListener('click', () => App.shareResults());
  document.getElementById('result-scan-another')?.addEventListener('click', () => {
    App.showScreen('scanner');
    Scanner.resume();
    App.state.scannerRunning = true;
  });
  document.getElementById('result-details-toggle')?.addEventListener('click', () => {
    const details = document.getElementById('vendor-details');
    const icon = document.getElementById('details-toggle-icon');
    details.classList.toggle('hidden');
    icon.textContent = details.classList.contains('hidden') ? '▶' : '▼';
  });

  // Settings toggles
  document.getElementById('toggle-https-warning')?.addEventListener('change', () => App.toggleSetting('httpsWarning'));
  document.getElementById('toggle-url-scanning')?.addEventListener('change', () => App.toggleSetting('urlScanning'));

  // Mode buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => App.setThemeMode(btn.dataset.mode));
  });

  // Color swatches
  document.querySelectorAll('.scheme-swatch').forEach(s => {
    s.addEventListener('click', () => App.setColorScheme(s.dataset.scheme));
  });

  // Language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => App.setLanguage(btn.dataset.lang));
  });

  // Settings actions
  document.getElementById('btn-remove-key')?.addEventListener('click', () => App.removeApiKey());
  document.getElementById('btn-change-key')?.addEventListener('click', () => App.openChangeApiKey());
  document.getElementById('btn-clear-history')?.addEventListener('click', () => App.clearHistory());
  document.getElementById('save-key-btn')?.addEventListener('click', () => App.saveNewApiKey());
  document.getElementById('close-change-key')?.addEventListener('click', () => App.closeChangeKeyModal());
  document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') App.closeModal();
  });

  // Grant camera permission button
  document.getElementById('grant-camera-btn')?.addEventListener('click', () => {
    document.getElementById('camera-error').classList.add('hidden');
    document.getElementById('scanner-viewfinder').classList.remove('hidden');
    App.startScanner();
  });
});

window.App = App;
