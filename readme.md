# BasiraQr

A secure, modern QR code scanner that checks URLs with VirusTotal before opening. Supports HTTPS warnings, URL scanning toggle, friendly offline behavior, theming, and bilingual UI (EN/AR).

[Website](docs/index.html) · [Privacy](docs/privacy.html) · [Usage](docs/usage.html) · [FAQ](docs/faq.html) · [Changelog](docs/changelog.html)

## Features
- URL scanning with VirusTotal (v3 API)
- HTTPS warning for HTTP links
- Toggle URL scanning on/off
- Offline-safe flow (no VT calls if no internet)
- Theme + color schemes (default: indigo)
- Localization: English and Arabic

## Quick Start (Development)
```bash
npm install
npm run start
# or
npm run android
```

## Setup VirusTotal API key
1) Get a free key at `https://www.virustotal.com/gui/join-us`.
2) In the app, open Settings → VirusTotal Integration → Change API Key.
3) Paste the key. The app validates it before saving.

## Build (Android)
- Preview/dev APK:
```bash
eas build --platform android --profile preview
```
- Production AAB (recommended for Play Store):
```bash
eas build --platform android --profile production
```

## Size Optimization
- Uses AAB for Play delivery (smaller download size)
- Proguard + resource shrinking enabled
- Assets optimized (use `npx expo optimize` to re-run)
- Remove unused deps/permissions when possible

## Permissions
- Camera, Internet, Access Network State

## Website & Docs
- GitHub Pages served from `docs/` on `main` branch
- Default language Arabic (RTL), English alternative pages
- Dark mode default, indigo theme

## Tech
- Expo SDK 54, React Native 0.81, React 19
- NetInfo for connectivity
- SecureStore + AsyncStorage

## License
MIT © 2025
