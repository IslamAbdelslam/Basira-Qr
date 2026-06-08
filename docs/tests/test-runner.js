// ─────────────────────────────────────────────
//  Basira QR · Tiny Test Runner
// ─────────────────────────────────────────────
// No npm, no build step. Just open docs/tests/index.html in a browser.

const TestRunner = {
  _results: [],
  _currentSuite: '',

  suite(name) {
    this._currentSuite = name;
  },

  assert(description, condition) {
    const passed = !!condition;
    this._results.push({ suite: this._currentSuite, description, passed });
  },

  assertEqual(description, actual, expected) {
    const passed = JSON.stringify(actual) === JSON.stringify(expected);
    this._results.push({
      suite: this._currentSuite,
      description,
      passed,
      detail: passed ? null : `Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)}`,
    });
  },

  async run(tests) {
    for (const [name, fn] of Object.entries(tests)) {
      this._currentSuite = name;
      try { await fn(); } catch (e) {
        this._results.push({ suite: name, description: 'Uncaught error in suite', passed: false, detail: e.message });
      }
    }
    this._render();
  },

  _render() {
    const container = document.getElementById('results');
    if (!container) return;

    const suites = {};
    for (const r of this._results) {
      if (!suites[r.suite]) suites[r.suite] = [];
      suites[r.suite].push(r);
    }

    const total  = this._results.length;
    const passed = this._results.filter(r => r.passed).length;
    const failed = total - passed;

    let html = `<div class="summary ${failed === 0 ? 'all-pass' : 'has-fail'}">
      ${failed === 0 ? '✅' : '❌'} ${passed}/${total} tests passed
      ${failed > 0 ? `· <strong>${failed} failed</strong>` : ''}
    </div>`;

    for (const [suite, tests] of Object.entries(suites)) {
      const suitePass = tests.every(t => t.passed);
      html += `<div class="suite">
        <div class="suite-title ${suitePass ? 'pass' : 'fail'}">${suitePass ? '✅' : '❌'} ${suite}</div>
        ${tests.map(t => `
          <div class="test ${t.passed ? 'pass' : 'fail'}">
            ${t.passed ? '✓' : '✗'} ${t.description}
            ${t.detail ? `<div class="detail">${t.detail}</div>` : ''}
          </div>`).join('')}
      </div>`;
    }

    container.innerHTML = html;
  },
};

window.T = TestRunner;
