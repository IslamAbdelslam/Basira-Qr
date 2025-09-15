# Quick Start Guide - OkiQr

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Run on Android
```bash
npm run android
```

### 4. Get VirusTotal API Key
1. Visit: https://www.virustotal.com/gui/join-us
2. Create free account
3. Copy your API key from profile
4. Enter in app when prompted

## 📱 App Flow

1. **First Launch**: Enter VirusTotal API key
2. **Scan QR Code**: Point camera at QR code
3. **Security Check**: App analyzes URL with VirusTotal
4. **View Results**: See security report and recommendations
5. **Open Safely**: Open link in browser if safe

## 🔧 Build APK

### Option 1: EAS Build (Cloud)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Build APK
npm run build:apk
```

### Option 2: Local Build
```bash
# Generate development build
npx expo run:android
```

## 🛠️ Troubleshooting

### Camera Not Working
- Check Android permissions
- Restart the app
- Try different camera app first

### API Key Issues
- Verify key is correct
- Check internet connection
- Ensure VirusTotal account is active

### Build Errors
- Update Expo CLI: `npm install -g @expo/cli@latest`
- Clear cache: `expo start -c`
- Check Node.js version (16+)

## 📋 Features Checklist

- ✅ QR Code Scanning
- ✅ VirusTotal Integration
- ✅ HTTPS Warning
- ✅ Security Reports
- ✅ Secure Storage
- ✅ Android APK Build
- ✅ Modern UI/UX

## 🎯 Ready to Use!

Your OkiQr is now ready to protect you from malicious QR codes!
