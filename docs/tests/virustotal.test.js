// ─────────────────────────────────────────────
//  VirusTotalService Tests
// ─────────────────────────────────────────────

// Utility: temporarily replace window.fetch with a mock
function mockFetch(handler) {
  const orig = window.fetch;
  window.fetch = handler;
  return () => { window.fetch = orig; };
}

const virusTotalTests = {
  // ── validateApiKey ─────────────────────────
  'VirusTotalService — validateApiKey: 401 → invalid': async () => {
    const restore = mockFetch(async () => ({ ok: false, status: 401 }));
    const result = await VirusTotalService.validateApiKey('bad-key');
    T.assertEqual('valid = false', result.valid, false);
    T.assertEqual('skipped = false', result.skipped, false);
    restore();
  },

  'VirusTotalService — validateApiKey: 200 → valid': async () => {
    const restore = mockFetch(async () => ({ ok: true, status: 200 }));
    const result = await VirusTotalService.validateApiKey('good-key');
    T.assertEqual('valid = true', result.valid, true);
    T.assertEqual('skipped = false', result.skipped, false);
    restore();
  },

  'VirusTotalService — validateApiKey: 404 → valid (URL not in VT cache)': async () => {
    const restore = mockFetch(async () => ({ ok: false, status: 404 }));
    const result = await VirusTotalService.validateApiKey('good-key');
    T.assertEqual('valid = true', result.valid, true);
    T.assertEqual('skipped = false', result.skipped, false);
    restore();
  },

  'VirusTotalService — validateApiKey: 429 → valid (rate limited but key ok)': async () => {
    const restore = mockFetch(async () => ({ ok: false, status: 429 }));
    const result = await VirusTotalService.validateApiKey('good-key');
    T.assertEqual('valid = true', result.valid, true);
    T.assertEqual('skipped = false', result.skipped, false);
    restore();
  },

  'VirusTotalService — validateApiKey: network error → skipped': async () => {
    const restore = mockFetch(async () => { throw new TypeError('Failed to fetch'); });
    const result = await VirusTotalService.validateApiKey('any-key');
    T.assertEqual('valid = true (fallback)', result.valid, true);
    T.assertEqual('skipped = true (network error)', result.skipped, true);
    restore();
  },

  // ── parseReport ────────────────────────────
  'VirusTotalService — parseReport: null data → fallback': () => {
    const report = VirusTotalService.parseReport(null);
    T.assertEqual('positives = 0', report.positives, 0);
    T.assertEqual('total = 0', report.total, 0);
    T.assertEqual('responseCode = 0', report.responseCode, 0);
  },

  'VirusTotalService — parseReport: malicious report': () => {
    const data = {
      data: {
        id: 'abc123',
        attributes: {
          stats: { malicious: 5, undetected: 60, harmless: 10, suspicious: 1 },
          results: {
            EngineA: { category: 'malicious', result: 'Trojan.XYZ' },
            EngineB: { category: 'undetected', result: null },
          },
          date: 1700000000,
          status: 'completed',
        },
      },
    };
    const report = VirusTotalService.parseReport(data);
    T.assertEqual('positives = 5', report.positives, 5);
    T.assertEqual('total = 76', report.total, 76);
    T.assertEqual('responseCode = 1', report.responseCode, 1);
    T.assert('has permalink', report.permalink.includes('virustotal.com'));
    T.assert('has scanDate', typeof report.scanDate === 'string');
  },

  'VirusTotalService — parseReport: clean report (0 positives)': () => {
    const data = {
      data: {
        id: 'xyz',
        attributes: {
          stats: { malicious: 0, undetected: 70, harmless: 5, suspicious: 0 },
          results: {},
          status: 'completed',
        },
      },
    };
    const report = VirusTotalService.parseReport(data);
    T.assertEqual('positives = 0', report.positives, 0);
    T.assertEqual('total = 75', report.total, 75);
  },

  // ── determineSecurityLevel ─────────────────
  'VirusTotalService — determineSecurityLevel': () => {
    T.assertEqual('0 total → UNKNOWN',    VirusTotalService.determineSecurityLevel({ positives: 0, total: 0, responseCode: 1 }), 'UNKNOWN');
    T.assertEqual('responseCode=0 → UNKNOWN', VirusTotalService.determineSecurityLevel({ positives: 0, total: 70, responseCode: 0 }), 'UNKNOWN');
    T.assertEqual('0/70 → SAFE',          VirusTotalService.determineSecurityLevel({ positives: 0, total: 70, responseCode: 1 }), 'SAFE');
    T.assertEqual('1/70 (<10%) → SUSPICIOUS', VirusTotalService.determineSecurityLevel({ positives: 1, total: 70, responseCode: 1 }), 'SUSPICIOUS');
    T.assertEqual('7/70 (10%) → MALICIOUS',   VirusTotalService.determineSecurityLevel({ positives: 7, total: 70, responseCode: 1 }), 'MALICIOUS');
    T.assertEqual('70/70 → MALICIOUS',     VirusTotalService.determineSecurityLevel({ positives: 70, total: 70, responseCode: 1 }), 'MALICIOUS');
  },

  // ── formatScans ────────────────────────────
  'VirusTotalService — formatScans': () => {
    const scans = {
      EngineA: { category: 'malicious',  result: 'Trojan.Foo' },
      EngineB: { category: 'undetected', result: null },
      EngineC: { category: 'suspicious', result: 'Heuristic.Bar' },
      EngineD: { category: 'harmless',   result: null },
    };
    const fmt = VirusTotalService.formatScans(scans);
    T.assertEqual('malicious → detected:true',   fmt.EngineA.detected, true);
    T.assertEqual('undetected → detected:false',  fmt.EngineB.detected, false);
    T.assertEqual('suspicious → detected:true',   fmt.EngineC.detected, true);
    T.assertEqual('harmless → detected:false',    fmt.EngineD.detected, false);
    T.assertEqual('malicious result preserved',   fmt.EngineA.result, 'Trojan.Foo');
    T.assertEqual('null result fallback to cat',  fmt.EngineB.result, 'undetected');
  },
};

window.virusTotalTests = virusTotalTests;
