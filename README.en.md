# BasiraQr

<div align="center">
  <img src="assets/icon.png" alt="BasiraQr Logo" width="120" height="120">
  
  **A secure QR code scanner that protects users from malicious links using VirusTotal API**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Expo](https://img.shields.io/badge/Expo-54.0.12-blue.svg)](https://expo.dev/)
  [![React Native](https://img.shields.io/badge/React%20Native-0.81.4-61DAFB.svg)](https://reactnative.dev/)
</div>

## 🛡️ Overview

BasiraQr is a modern, secure QR code scanner that integrates with VirusTotal's threat intelligence platform to analyze URLs before opening them. Built with React Native and Expo, it provides a seamless user experience with comprehensive security features, bilingual support, and offline capabilities.

## ✨ Key Features

### 🔒 Security & Privacy
- **Real-time URL Analysis**: Integration with VirusTotal API v3 for comprehensive threat detection
- **HTTPS Warnings**: Automatic alerts for insecure HTTP connections
- **Secure Storage**: API keys and sensitive data stored securely using Expo SecureStore
- **Privacy-First**: No tracking, all data processed locally or through secure APIs

### 🌍 Internationalization
- **Bilingual Support**: Full English and Arabic localization with RTL layout support
- **Dynamic Language Switching**: Change language without app restart
- **Cultural Adaptation**: Proper text rendering and UI adjustments for different languages

### ⚡ Performance & User Experience
- **Optimized Bundle Size**: 40-60% smaller APK through advanced optimization techniques
- **Smart Offline Mode**: Graceful handling when internet connectivity is unavailable
- **Theme Support**: Multiple color schemes with dark/light mode options
- **Scan History**: Track and manage your last 20 scanned URLs

### 🎯 Core Functionality
- **High-Performance Scanning**: Optimized camera integration for quick QR code detection
- **URL Validation**: Intelligent URL detection, sanitization, and validation
- **Network Awareness**: Automatic connectivity detection with smart fallback behavior
- **Configurable Settings**: Toggle scanning features and customize user preferences

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Expo CLI or EAS CLI
- Android Studio (for Android development)
- Free VirusTotal API key

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/BasiraQr.git
cd BasiraQr

# Install dependencies
npm install

# Start development server
npm start
```

### Development
```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS (requires macOS)
npm run ios
```

## 🔧 Configuration

### VirusTotal API Setup
1. Obtain a free API key from [VirusTotal](https://www.virustotal.com/gui/join-us)
2. Launch the application
3. Navigate to **Settings → VirusTotal Integration → Change API Key**
4. Enter your API key (validated automatically before saving)

## 📦 Building for Production

### Android Builds
```bash
# Development build
npm run build:dev

# Preview APK
npm run build:apk

# Production build
npm run build:android
```

### Build Profiles
- **Development**: For testing and development
- **Preview**: Optimized APK for testing
- **Production**: Release-ready build with full optimizations

## 🏗️ Architecture & Technology Stack

### Core Technologies
- **Framework**: React Native 0.81.4 with Expo SDK 54.0.12
- **Language**: JavaScript (ES6+) with React 19.1.0
- **State Management**: React Context API with useReducer
- **Navigation**: React Navigation v6
- **Storage**: Expo SecureStore + AsyncStorage

### Security & Networking
- **Threat Intelligence**: VirusTotal API v3 integration
- **Network Monitoring**: React Native NetInfo for connectivity detection
- **HTTP Client**: Axios for secure API communications
- **Data Validation**: Custom URL validation and sanitization

### Performance Optimizations
- **Code Splitting**: Metro bundler with tree shaking
- **Asset Optimization**: Compressed images and resources
- **Build Optimization**: ProGuard, resource shrinking, and architecture-specific builds
- **Memory Management**: Optimized component lifecycle and state management

## 📱 Platform Support

### Android
- **Minimum Version**: Android 5.0 (API level 21)
- **Target Version**: Android 14 (API level 34)
- **Architecture**: ARM64, ARMv7, x86_64
- **Permissions**: Camera, Internet, Network State

### iOS (Planned)
- **Minimum Version**: iOS 13.0
- **Target Version**: iOS 17.0
- **Status**: In development

## 🔒 Security Considerations

### Data Protection
- API keys stored securely using device keychain/keystore
- No sensitive data transmitted without encryption
- Local processing of non-sensitive operations
- Minimal data collection and retention

### Network Security
- HTTPS-only API communications
- Certificate pinning for critical endpoints
- Request/response validation
- Timeout and retry mechanisms

## 📊 Performance Metrics

- **APK Size**: ~80-95MB (optimized from 170-200MB)
- **Scan Speed**: 0.5-1 seconds average
- **Memory Usage**: <60MB typical
- **Battery Impact**: Minimal background usage
- **Startup Time**: <1.5 seconds cold start

## 🤝 Contributing

We welcome contributions!

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <strong>Built with ❤️ for user security and privacy</strong>
</div>
