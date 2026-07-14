/**
 * Basira QR – PWA Install Banner
 * Shows a "Add to Home Screen" banner on first visit.
 * Dismissed state is stored in localStorage for 30 days.
 */
(function () {
  let deferredPrompt = null;
  const DISMISSED_KEY = 'basira_install_dismissed';
  const INSTALLED_KEY = 'basira_installed';

  // Don't show if already installed (standalone mode)
  if (window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true) {
    localStorage.setItem(INSTALLED_KEY, '1');
    return;
  }

  // Don't show if recently dismissed (30-day cooldown)
  const dismissed = parseInt(localStorage.getItem(DISMISSED_KEY) || '0');
  if (dismissed && Date.now() - dismissed < 30 * 24 * 60 * 60 * 1000) return;

  // Inject banner CSS
  const style = document.createElement('style');
  style.textContent = `
    #pwa-banner {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999;
      background: #1a1a26;
      border-top: 1px solid rgba(99,102,241,0.35);
      box-shadow: 0 -8px 40px rgba(0,0,0,0.5);
      padding: 16px 20px max(16px, env(safe-area-inset-bottom));
      display: flex; align-items: center; gap: 14px;
      transform: translateY(100%);
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      font-family: 'Tajawal','Inter',sans-serif;
    }
    #pwa-banner.show { transform: translateY(0); }
    #pwa-banner-icon {
      font-size: 36px; flex-shrink: 0;
      width: 52px; height: 52px; border-radius: 14px;
      background: rgba(99,102,241,0.15);
      display: flex; align-items: center; justify-content: center;
    }
    #pwa-banner-body { flex: 1; min-width: 0; }
    #pwa-banner-title {
      font-size: 15px; font-weight: 700; color: #F1F5F9;
      margin-bottom: 3px;
    }
    #pwa-banner-sub { font-size: 12px; color: #94A3B8; line-height: 1.4; }
    #pwa-banner-actions { display: flex; gap: 8px; flex-shrink: 0; }
    #pwa-install-btn {
      background: #6366F1; color: #fff; border: none; cursor: pointer;
      padding: 10px 18px; border-radius: 22px; font-size: 13px;
      font-weight: 700; font-family: inherit; white-space: nowrap;
      transition: background 0.2s, transform 0.1s;
    }
    #pwa-install-btn:hover { background: #4F46E5; transform: scale(1.04); }
    #pwa-dismiss-btn {
      background: transparent; color: #64748B; border: none; cursor: pointer;
      width: 32px; height: 32px; border-radius: 50%; font-size: 18px;
      display: flex; align-items: center; justify-content: center;
      transition: color 0.2s, background 0.2s;
    }
    #pwa-dismiss-btn:hover { background: rgba(255,255,255,0.08); color: #94A3B8; }
  `;
  document.head.appendChild(style);

  // Create banner HTML
  const banner = document.createElement('div');
  banner.id = 'pwa-banner';
  banner.setAttribute('role', 'alert');

  const isEn = document.documentElement.lang === 'en';
  banner.setAttribute('dir', isEn ? 'ltr' : 'rtl');
  if (isEn) {
    banner.innerHTML = `
      <div id="pwa-banner-icon">🛡️</div>
      <div id="pwa-banner-body">
        <div id="pwa-banner-title">Install Basira QR</div>
        <div id="pwa-banner-sub">Add it to your home screen for quick access without a browser</div>
      </div>
      <div id="pwa-banner-actions">
        <button id="pwa-install-btn">Install</button>
        <button id="pwa-dismiss-btn" aria-label="Dismiss">✕</button>
      </div>
    `;
  } else {
    banner.innerHTML = `
      <div id="pwa-banner-icon">🛡️</div>
      <div id="pwa-banner-body">
        <div id="pwa-banner-title">ثبّت بصيرة كيو آر</div>
        <div id="pwa-banner-sub">أضفه لشاشتك الرئيسية للوصول السريع بدون متصفح</div>
      </div>
      <div id="pwa-banner-actions">
        <button id="pwa-install-btn">تثبيت</button>
        <button id="pwa-dismiss-btn" aria-label="إغلاق">✕</button>
      </div>
    `;
  }

  function showBanner() {
    if (!document.body.contains(banner)) document.body.appendChild(banner);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => banner.classList.add('show'));
    });
  }

  function hideBanner() {
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 400);
  }

  // Catch the browser's install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // Show after 2 seconds so page loads first
    setTimeout(showBanner, 2000);
  });

  // Install button clicked
  document.addEventListener('click', async (e) => {
    if (e.target.id === 'pwa-install-btn') {
      if (!deferredPrompt) return;
      hideBanner();
      const result = await deferredPrompt.prompt();
      deferredPrompt = null;
      if (result?.outcome === 'accepted') {
        localStorage.setItem(INSTALLED_KEY, '1');
      }
    }
    if (e.target.id === 'pwa-dismiss-btn') {
      localStorage.setItem(DISMISSED_KEY, Date.now().toString());
      hideBanner();
    }
  });

  // Handle successful install
  window.addEventListener('appinstalled', () => {
    localStorage.setItem(INSTALLED_KEY, '1');
    hideBanner();
    deferredPrompt = null;
  });

  // Fallback for iOS (Safari doesn't support beforeinstallprompt)
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  if (isIOS && isSafari && !localStorage.getItem(INSTALLED_KEY)) {
    setTimeout(() => {
      const style2 = document.createElement('style');
      style2.textContent = `
        #pwa-banner-sub { color: #94A3B8 !important; }
        #pwa-install-btn { display: none; }
      `;
      document.head.appendChild(style2);
      banner.querySelector('#pwa-banner-sub').textContent = isEn
        ? 'Tap the Share icon 🔗 then "Add to Home Screen" to install the app'
        : 'اضغط على 🔗 Share ثم "Add to Home Screen" لتثبيت التطبيق';
      showBanner();
    }, 2000);
  }
})();
