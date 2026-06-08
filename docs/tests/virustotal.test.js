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
    T.assertEqual('positives = 6 (5 malicious + 1 suspicious)', report.positives, 6);
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

  'VirusTotalService — parseReport: suspicious-only (was incorrectly SAFE before fix)': () => {
    const data = {
      data: {
        id: 'sus123',
        attributes: {
          stats: { malicious: 0, undetected: 68, harmless: 5, suspicious: 2 },
          results: {},
          status: 'completed',
        },
      },
    };
    const report = VirusTotalService.parseReport(data);
    T.assertEqual('positives = 2 (suspicious counted)', report.positives, 2);
    T.assertEqual('total = 75', report.total, 75);
    // Zero-tolerance: even 1 flag → MALICIOUS (not SAFE, not SUSPICIOUS)
    const level = VirusTotalService.determineSecurityLevel(report);
    T.assertEqual('1 suspicious flag → MALICIOUS (zero tolerance)', level, 'MALICIOUS');
  },

  // ── parseReport: edge cases ────────────────
  'VirusTotalService — parseReport: missing stats object': () => {
    const data = {
      data: {
        id: 'edge1',
        attributes: { results: {}, status: 'completed' }, // no stats key at all
      },
    };
    const report = VirusTotalService.parseReport(data);
    T.assertEqual('missing stats → positives=0', report.positives, 0);
    T.assertEqual('missing stats → total=0',     report.total, 0);
    T.assertEqual('responseCode still 1',        report.responseCode, 1);
  },

  'VirusTotalService — parseReport: missing date field': () => {
    const data = {
      data: {
        id: 'edge2',
        attributes: {
          stats: { malicious: 1, undetected: 50, harmless: 0, suspicious: 0 },
          results: {},
          // no 'date' field
        },
      },
    };
    const report = VirusTotalService.parseReport(data);
    T.assert('missing date → fallback to now (is string)', typeof report.scanDate === 'string');
    T.assert('missing date → fallback contains T', report.scanDate.includes('T'));
  },

  'VirusTotalService — determineSecurityLevel: boundaries': () => {
    // Zero-tolerance: any positive ≥ 1 → MALICIOUS
    T.assertEqual('0 total → UNKNOWN',        VirusTotalService.determineSecurityLevel({ positives: 0, total: 0, responseCode: 1 }), 'UNKNOWN');
    T.assertEqual('responseCode=0 → UNKNOWN', VirusTotalService.determineSecurityLevel({ positives: 0, total: 70, responseCode: 0 }), 'UNKNOWN');
    T.assertEqual('0/70 → SAFE',              VirusTotalService.determineSecurityLevel({ positives: 0, total: 70, responseCode: 1 }), 'SAFE');
    T.assertEqual('1/70 → MALICIOUS (zero tolerance)',  VirusTotalService.determineSecurityLevel({ positives: 1,  total: 70, responseCode: 1 }), 'MALICIOUS');
    T.assertEqual('2/70 → MALICIOUS',         VirusTotalService.determineSecurityLevel({ positives: 2,  total: 70, responseCode: 1 }), 'MALICIOUS');
    T.assertEqual('7/70 → MALICIOUS',         VirusTotalService.determineSecurityLevel({ positives: 7,  total: 70, responseCode: 1 }), 'MALICIOUS');
    T.assertEqual('70/70 → MALICIOUS',        VirusTotalService.determineSecurityLevel({ positives: 70, total: 70, responseCode: 1 }), 'MALICIOUS');
    T.assertEqual('1/1 → MALICIOUS',          VirusTotalService.determineSecurityLevel({ positives: 1,  total: 1,  responseCode: 1 }), 'MALICIOUS');
    T.assertEqual('0/1 → SAFE',               VirusTotalService.determineSecurityLevel({ positives: 0,  total: 1,  responseCode: 1 }), 'SAFE');
    T.assertEqual('positives=1 total=0 → UNKNOWN (div/0 guard)', VirusTotalService.determineSecurityLevel({ positives: 1, total: 0, responseCode: 1 }), 'UNKNOWN');
  },

  // ── formatScans: edge cases ─────────────────
  'VirusTotalService — formatScans: edge cases': () => {
    // Empty scans object
    const empty = VirusTotalService.formatScans({});
    T.assertEqual('empty scans → {}', JSON.stringify(empty), '{}');

    // Engine with null category
    const nullCat = VirusTotalService.formatScans({
      EngineX: { category: null, result: null },
    });
    T.assertEqual('null category → detected:false', nullCat.EngineX.detected, false);

    // Engine with 'type-unsupported' category (VT special)
    const unsupported = VirusTotalService.formatScans({
      EngineY: { category: 'type-unsupported', result: null },
    });
    T.assertEqual('type-unsupported → detected:false', unsupported.EngineY.detected, false);
  },
};

window.virusTotalTests = virusTotalTests;
