# SecureQR Scanner

A secure QR code scanner that protects users from malicious links using VirusTotal API. This app acts as a guardian between users and potentially dangerous QR codes by scanning URLs through VirusTotal's security analysis before allowing access.

## Features

- 🔒 **Secure QR Code Scanning**: Scans QR codes and validates URLs before opening
- 🛡️ **VirusTotal Integration**: Uses VirusTotal API to check URLs for malicious content
- ⚠️ **HTTPS Warning**: Warns users about non-secure HTTP links
- 📊 **Detailed Security Reports**: Shows comprehensive security analysis results
- 🔑 **Secure API Key Storage**: Stores VirusTotal API key securely on device
- 📱 **Android Optimized**: Built specifically for Android with APK distribution

## How It Works

1. **Setup**: User enters their free VirusTotal API key
2. **Scan**: Point camera at QR code to scan
3. **Validate**: App checks if scanned content is a valid URL
4. **Analyze**: URL is sent to VirusTotal for security analysis
5. **Report**: User receives detailed security report with recommendations
6. **Action**: User can safely open the link or avoid it based on results

## Prerequisites

- Node.js (v16 or higher)
- Expo CLI
- Android Studio (for local development)
- VirusTotal API key (free from [virustotal.com](https://www.virustotal.com/gui/join-us))

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SecureQRScanner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on Android device/emulator**
   ```bash
   npm run android
   ```

## Building APK

### Using EAS Build (Recommended)

1. **Install EAS CLI**
   ```bash
   npm install -g @expo/eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure project**
   ```bash
   eas build:configure
   ```

4. **Build APK**
   ```bash
   npm run build:apk
   ```

### Local Build (Advanced)

1. **Generate development build**
   ```bash
   npx expo run:android
   ```

2. **Create APK manually**
   - Open Android Studio
   - Import the android folder
   - Build → Generate Signed Bundle/APK

## Configuration

### VirusTotal API Setup

1. Visit [VirusTotal](https://www.virustotal.com/gui/join-us)
2. Create a free account
3. Go to your profile and copy your API key
4. Enter the API key in the app during first launch

### App Configuration

The app is configured in `app.json`:
- Package name: `com.secureqr.scanner`
- Version: 1.0.0
- Permissions: Camera, Internet, Network State

## Project Structure

```
SecureQRScanner/
├── src/
│   ├── components/          # Reusable UI components
│   ├── contexts/           # React Context for state management
│   ├── screens/            # App screens
│   │   ├── SetupScreen.js     # API key setup
│   │   ├── ScannerScreen.js   # QR code scanner
│   │   ├── ResultsScreen.js   # Security results
│   │   └── SettingsScreen.js  # App settings
│   ├── services/           # Business logic services
│   │   ├── VirusTotalService.js  # VirusTotal API integration
│   │   ├── UrlValidator.js       # URL validation utilities
│   │   └── StorageService.js     # Secure storage management
│   └── utils/              # Helper utilities
├── assets/                 # App icons and images
├── App.js                  # Main app component
├── app.json               # Expo configuration
├── eas.json               # EAS build configuration
└── package.json           # Dependencies and scripts
```

## Security Features

- **Secure Storage**: API keys stored using Expo SecureStore
- **HTTPS Validation**: Warns about non-secure HTTP links
- **Input Sanitization**: Cleans URLs before processing
- **Privacy Focused**: No data collection beyond necessary API calls
- **Local Processing**: Scan history stored locally on device

## API Limits

VirusTotal free tier includes:
- 500 requests per day
- 4 requests per minute
- Perfect for personal use

## Troubleshooting

### Common Issues

1. **Camera Permission Denied**
   - Go to Android Settings → Apps → SecureQR Scanner → Permissions
   - Enable Camera permission

2. **API Key Invalid**
   - Verify API key is correct
   - Check VirusTotal account status
   - Ensure internet connection

3. **Build Errors**
   - Update Expo CLI: `npm install -g @expo/cli@latest`
   - Clear cache: `expo start -c`
   - Check Node.js version compatibility

### Development Issues

1. **Metro bundler issues**
   ```bash
   npx expo start -c
   ```

2. **Android build issues**
   ```bash
   cd android && ./gradlew clean
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review Expo documentation

## Acknowledgments

- VirusTotal for providing the security analysis API
- Expo team for the excellent development platform
- React Native community for the ecosystem

---

**⚠️ Important**: This app requires a valid VirusTotal API key to function. The free tier provides sufficient quota for personal use.