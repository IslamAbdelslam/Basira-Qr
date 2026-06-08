const urlValidatorTests = {
  'UrlValidator — isValidUrl: valid URLs': () => {
    T.assert('valid http URL',               UrlValidator.isValidUrl('http://example.com'));
    T.assert('valid https URL',              UrlValidator.isValidUrl('https://example.com/path?q=1'));
    T.assert('URL with port',               UrlValidator.isValidUrl('https://example.com:8080'));
    T.assert('URL with query string',       UrlValidator.isValidUrl('https://example.com/page?a=1&b=2'));
    T.assert('URL with fragment',           UrlValidator.isValidUrl('https://example.com/page#section'));
    T.assert('URL with path and params',    UrlValidator.isValidUrl('https://sub.domain.co.uk/path/to/page?x=1'));
    T.assert('IP address with http',        UrlValidator.isValidUrl('http://192.168.1.1'));
    T.assert('localhost with http',         UrlValidator.isValidUrl('http://localhost'));
  },

  'UrlValidator — isValidUrl: invalid / dangerous URLs': () => {
    T.assert('invalid: bare string',        !UrlValidator.isValidUrl('not a url'));
    T.assert('invalid: ftp://',             !UrlValidator.isValidUrl('ftp://example.com'));
    T.assert('invalid: empty string',       !UrlValidator.isValidUrl(''));
    T.assert('invalid: bare domain',        !UrlValidator.isValidUrl('example.com'));
    T.assert('invalid: IP no protocol',     !UrlValidator.isValidUrl('192.168.1.1'));
    T.assert('SECURITY: javascript: URI',   !UrlValidator.isValidUrl('javascript:alert(1)'));
    T.assert('SECURITY: data: URI',         !UrlValidator.isValidUrl('data:text/html,<h1>hi</h1>'));
    T.assert('SECURITY: vbscript:',         !UrlValidator.isValidUrl('vbscript:msgbox(1)'));
    T.assert('invalid: null-like string',   !UrlValidator.isValidUrl('null'));
    T.assert('invalid: undefined string',   !UrlValidator.isValidUrl('undefined'));
  },

  'UrlValidator — isHttps': () => {
    T.assert('https URL → true',            UrlValidator.isHttps('https://example.com'));
    T.assert('https with path → true',      UrlValidator.isHttps('https://a.com/b/c?d=1'));
    T.assert('http URL → false',            !UrlValidator.isHttps('http://example.com'));
    T.assert('empty → false',              !UrlValidator.isHttps(''));
    T.assert('HTTPS uppercase → false',    !UrlValidator.isHttps('HTTPS://example.com')); // case sensitive
  },

  'UrlValidator — extractDomain': () => {
    T.assertEqual('extracts hostname',        UrlValidator.extractDomain('https://example.com/path'), 'example.com');
    T.assertEqual('extracts subdomain',       UrlValidator.extractDomain('https://sub.domain.co.uk/'), 'sub.domain.co.uk');
    // URL.hostname returns host WITHOUT port — port is in URL.host
    T.assertEqual('hostname strips port',     UrlValidator.extractDomain('https://example.com:8080/path'), 'example.com');
    T.assertEqual('fallback on invalid',      UrlValidator.extractDomain('not-a-url'), 'not-a-url');
    T.assertEqual('extracts from http',       UrlValidator.extractDomain('http://example.com'), 'example.com');
  },

  'UrlValidator — sanitizeUrl': () => {
    T.assertEqual('trims leading whitespace',  UrlValidator.sanitizeUrl('  https://example.com'), 'https://example.com');
    T.assertEqual('trims trailing whitespace', UrlValidator.sanitizeUrl('https://example.com  '), 'https://example.com');
    T.assertEqual('trims both sides',          UrlValidator.sanitizeUrl('  https://a.com  '), 'https://a.com');
    T.assertEqual('no-op on clean URL',        UrlValidator.sanitizeUrl('https://a.com'), 'https://a.com');
    T.assertEqual('empty string stays empty',  UrlValidator.sanitizeUrl(''), '');
  },
};

window.urlValidatorTests = urlValidatorTests;

