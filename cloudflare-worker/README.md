# Basira QR — Cloudflare Worker (CORS Proxy)

This Worker acts as a CORS proxy between the Basira QR PWA and the VirusTotal v3 API.
It forwards the user's own `x-apikey` header transparently — no API keys are stored in the Worker.

## Security

Requests are only accepted from **allowed origins** defined in `ALLOWED_ORIGINS` inside `worker.js`.
All other origins receive a `403 Forbidden` response, protecting your Worker's quota from abuse.

## Deploy Your Own Instance

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- A free [Cloudflare account](https://dash.cloudflare.com/sign-up)

### Steps

```bash
# 1. Install Wrangler CLI
npm install -g wrangler

# 2. Log in to Cloudflare
wrangler login

# 3. Navigate to this directory
cd cloudflare-worker/

# 4. Edit the ALLOWED_ORIGINS in worker.js to match your domain
#    Example: 'https://yourusername.github.io'

# 5. Deploy
wrangler deploy
```

After deploying, Cloudflare will give you a URL like:
```
https://basira-vt-proxy.<your-subdomain>.workers.dev
```

Update `baseUrl` in `docs/js/virustotal.js` to point to your new Worker URL.

## Local Development

To test locally, add your local origin to `ALLOWED_ORIGINS`:
```js
'http://localhost',
'http://127.0.0.1',
```

Then run:
```bash
wrangler dev
```
