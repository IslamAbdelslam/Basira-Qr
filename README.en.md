# Basira QR 🛡️

Secure QR code scanner powered by VirusTotal — Progressive Web App (PWA).

---

## 🌐 Live Links

**Landing Page:** [islamabdelslam.github.io/Basira-Qr](https://islamabdelslam.github.io/Basira-Qr/)
**App:** [islamabdelslam.github.io/Basira-Qr/app.html](https://islamabdelslam.github.io/Basira-Qr/app.html)

---

## ✨ Features

- 📷 Real-time QR code scanning via camera
- 🔐 Automatic URL security checks via VirusTotal
- 🌍 Arabic & English support (RTL/LTR)
- 📱 Works offline (PWA — installable)
- 🎨 Multiple themes and color schemes
- 🛡️ API key never leaves your device — stored locally only

---

## 📲 Install as App (Add to Home Screen)

1. Open the app URL in **Chrome** or **Safari** on your phone
2. Tap the browser menu → **"Add to Home Screen"**
3. The app now behaves like a native installed app

---

## 🔑 VirusTotal API Key

The app needs a free VirusTotal API key to scan URLs:
👉 [virustotal.com/gui/join-us](https://www.virustotal.com/gui/join-us)

Your key is stored **only on your device** and never sent to any third party.

---

## 🏗️ Project Structure

```
docs/               ← PWA app + landing page (served via GitHub Pages)
  index.html        ← Landing/intro page
  app.html          ← Full PWA scanner app
  js/               ← JavaScript modules
  css/              ← Styles
  tests/            ← Browser test suite (open index.html in browser)
cloudflare-worker/  ← CORS proxy Worker source
  worker.js         ← Worker with Origin allowlist
  README.md         ← Self-hosting guide
```

---

## 🧪 Tests

Open `docs/tests/index.html` directly in any browser — no server or npm required.

---

## ☁️ Cloudflare Worker

The app uses a Cloudflare Worker to bypass browser CORS restrictions for the VirusTotal API.
To self-host your own Worker: see [`cloudflare-worker/README.md`](./cloudflare-worker/README.md)

---

## 📄 License

[MIT License](./LICENSE)
