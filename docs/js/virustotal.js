// ─────────────────────────────────────────────
//  Basira QR · VirusTotal Service (v3 API)
// ─────────────────────────────────────────────

const VirusTotalService = {
  // Cloudflare Worker proxy — eliminates CORS, user's x-apikey is passed through transparently.
  baseUrl: 'https://bsira-proxy.islamabdoulradi.workers.dev/api/v3',
  apiKey: null,

  setApiKey(key) { this.apiKey = key; },

  async _fetch(url, options = {}) {
    const res = await fetch(url, {
      ...options,
      headers: {
        'x-apikey': this.apiKey,
        ...(options.headers || {}),
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },

  async validateApiKey(key) {
    // Returns { valid: boolean, skipped: boolean }
    // skipped=true means we couldn't reach VT (network/timeout) — caller should warn the user.
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      const testUrl = 'http://www.google.com';
      const urlId = btoa(testUrl).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
      const res = await fetch(`${this.baseUrl}/urls/${urlId}`, {
        headers: { 'x-apikey': key },
        signal: controller.signal,
      });
      clearTimeout(timer);
      // 401 = explicitly rejected key (bad key), anything else = key accepted by VT
      return { valid: res.status !== 401, skipped: false };
    } catch {
      // Network error, CORS block, or timeout — can't verify; accept and warn caller
      return { valid: true, skipped: true };
    }
  },

  async scanUrl(url, retryCount = 0, maxRetries = 3) {
    if (!this.apiKey) throw new Error('API key not set');

    // 1. Submit URL
    const body = new URLSearchParams({ url });
    const submitRes = await fetch(`${this.baseUrl}/urls`, {
      method: 'POST',
      headers: { 'x-apikey': this.apiKey, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    });
    if (!submitRes.ok) throw new Error(`Submit failed: ${submitRes.status}`);
    const submitData = await submitRes.json();
    const analysisId = submitData.data.id;

    // 2. Poll analysis with progressive delay
    const delays = [1500, 3000, 5000, 8000]; // reduced: VT often has cached results within 1-2s
    const delay = delays[retryCount] || 10000;
    await new Promise(r => setTimeout(r, delay));

    const reportRes = await fetch(`${this.baseUrl}/analyses/${analysisId}`, {
      headers: { 'x-apikey': this.apiKey },
    });
    if (!reportRes.ok) throw new Error(`Report failed: ${reportRes.status}`);
    const reportData = await reportRes.json();

    const attributes = reportData.data.attributes;
    if (attributes.status === 'queued' || attributes.status === 'in-progress') {
      if (retryCount < maxRetries) return this.scanUrl(url, retryCount + 1, maxRetries);
      throw new Error('QUEUED');
    }

    return this.parseReport(reportData);
  },

  parseReport(data) {
    if (!data?.data) {
      return { positives: 0, total: 0, scanDate: new Date().toISOString(), permalink: '', scans: {}, responseCode: 0, message: 'URL not found' };
    }
    const attrs = data.data.attributes;
    const stats = attrs.stats || {};
    const scans = attrs.results || {};
    const positives = (stats.malicious || 0) + (stats.suspicious || 0); // both count as flagged
    const total = (stats.malicious || 0) + (stats.undetected || 0) + (stats.harmless || 0) + (stats.suspicious || 0);

    return {
      positives, total,
      scanDate: attrs.date ? new Date(attrs.date * 1000).toISOString() : new Date().toISOString(),
      permalink: `https://www.virustotal.com/gui/url/${data.data.id}`,
      scans: this.formatScans(scans),
      responseCode: 1,
      message: 'Analysis completed',
    };
  },

  formatScans(scans) {
    const out = {};
    for (const [engine, r] of Object.entries(scans)) {
      out[engine] = {
        detected: r.category === 'malicious' || r.category === 'suspicious',
        result: r.result || r.category,
      };
    }
    return out;
  },

  determineSecurityLevel(report) {
    if (report.responseCode === 0) return 'UNKNOWN';
    if (report.total === 0) return 'UNKNOWN';
    if (report.positives === 0) return 'SAFE';
    return 'MALICIOUS'; // zero tolerance: even 1 vendor flag = dangerous
  },
};

window.VirusTotalService = VirusTotalService;
