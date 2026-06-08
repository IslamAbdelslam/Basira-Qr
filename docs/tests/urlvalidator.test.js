// ─────────────────────────────────────────────
//  UrlValidator Tests
// ─────────────────────────────────────────────

const urlValidatorTests = {
  'UrlValidator — isValidUrl': () => {
    T.assert('valid http URL',    UrlValidator.isValidUrl('http://example.com'));
    T.assert('valid https URL',   UrlValidator.isValidUrl('https://example.com/path?q=1'));
    T.assert('invalid: bare str', !UrlValidator.isValidUrl('not a url'));
    T.assert('invalid: ftp://',   !UrlValidator.isValidUrl('ftp://example.com'));
    T.assert('invalid: empty',    !UrlValidator.isValidUrl(''));
    T.assert('invalid: bare domain', !UrlValidator.isValidUrl('example.com'));
    T.assert('invalid: ip no proto',  !UrlValidator.isValidUrl('192.168.1.1'));
  },

  'UrlValidator — isHttps': () => {
    T.assert('https URL → true',  UrlValidator.isHttps('https://example.com'));
    T.assert('http URL → false',  !UrlValidator.isHttps('http://example.com'));
    T.assert('empty → false',     !UrlValidator.isHttps(''));
  },

  'UrlValidator — extractDomain': () => {
    T.assertEqual('extracts hostname',   UrlValidator.extractDomain('https://example.com/path'), 'example.com');
    T.assertEqual('extracts subdomain',  UrlValidator.extractDomain('https://sub.domain.co.uk/'), 'sub.domain.co.uk');
    T.assertEqual('fallback on invalid', UrlValidator.extractDomain('not-a-url'), 'not-a-url');
  },

  'UrlValidator — sanitizeUrl': () => {
    T.assertEqual('trims whitespace', UrlValidator.sanitizeUrl('  https://example.com  '), 'https://example.com');
    T.assertEqual('no-op on clean',   UrlValidator.sanitizeUrl('https://a.com'), 'https://a.com');
  },
};

window.urlValidatorTests = urlValidatorTests;
