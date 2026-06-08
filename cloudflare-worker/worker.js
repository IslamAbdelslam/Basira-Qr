/**
 * Basira QR — Cloudflare Worker (VirusTotal CORS Proxy)
 *
 * Purpose : Proxies requests to the VirusTotal v3 API to avoid CORS issues
 *           in the browser PWA. The user's own x-apikey is forwarded unchanged.
 *
 * Security: Only accepts requests from allowed origins (your GitHub Pages domain).
 *           Rejects all other origins with 403 Forbidden.
 *           No API keys are stored in this Worker — the user supplies their own.
 *
 * Deploy  : See README.md for wrangler deploy instructions.
 */

// ── Origin Allowlist ─────────────────────────────────────────────────────────
// Add your GitHub Pages domain here. Requests from any other Origin are blocked.
const ALLOWED_ORIGINS = [
  'https://islamabdelslam.github.io',
  // Add 'http://localhost' or 'http://127.0.0.1' below during local development only:
  // 'http://localhost',
  // 'http://127.0.0.1',
];

const VIRUSTOTAL_BASE = 'https://www.virustotal.com/api/v3';

// ── CORS Headers (sent on every response) ────────────────────────────────────
function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'x-apikey, Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

// ── Main Handler ─────────────────────────────────────────────────────────────
export default {
  async fetch(request) {
    const origin = request.headers.get('Origin') || '';

    // Block requests not from allowed origins
    const isAllowed = ALLOWED_ORIGINS.some((o) => origin.startsWith(o));
    if (!isAllowed) {
      return new Response('Forbidden: origin not allowed', {
        status: 403,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    // Strip the worker prefix (/api/v3/...) and forward to VirusTotal
    const url = new URL(request.url);
    const vtPath = url.pathname.replace(/^\/api\/v3/, '');
    const vtUrl = `${VIRUSTOTAL_BASE}${vtPath}${url.search}`;

    // Forward request with user's own x-apikey header
    const vtRequest = new Request(vtUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      redirect: 'follow',
    });

    try {
      const vtResponse = await fetch(vtRequest);

      // Clone and add CORS headers to VT response
      const responseHeaders = new Headers(vtResponse.headers);
      Object.entries(corsHeaders(origin)).forEach(([k, v]) => responseHeaders.set(k, v));

      return new Response(vtResponse.body, {
        status: vtResponse.status,
        statusText: vtResponse.statusText,
        headers: responseHeaders,
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Proxy error', detail: err.message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    }
  },
};
