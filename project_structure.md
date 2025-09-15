# SecureQR Scanner - Complete Project Setup Guide

## 🗂️ Project Structure

Create this exact folder structure in your project:

```
SecureQRScanner/
├── App.js                          # Main app entry point
├── package.json                    # Dependencies and scripts
├── app.json                        # Expo configuration
├── README.md                       # Project documentation
├── babel.config.js                 # Babel configuration
├── metro.config.js                 # Metro bundler config
├── .gitignore                      # Git ignore file
├── assets/                         # App icons and splash screens
│   ├── icon.png
│   ├── splash.png
│   ├── adaptive-icon.png
│   └── favicon.png
└── src/                           # Source code directory
    ├── screens/                   # App screens
    │   ├── SetupScreen.js
    │   ├── ScannerScreen.js
    │   ├── ResultsScreen.js
    │   └── SettingsScreen.js
    ├── services/                  # Business logic services
    │   ├── StorageService.js
    │   ├── VirusTotalService.js
    │   └── UrlValidator.js
    ├── contexts/                  # React Context providers
    │   └── AppContext.js
    ├── components/                # Reusable components (create as needed)
    │   └── common/
    ├── types/                     # TypeScript definitions (optional)
    │   └── index.ts
    └── utils/                     # Helper functions and constants
        ├── constants.js
        └── helpers.js
```

## 📁 Step-by-Step Setup Instructions

### Step 1: Create the Project
```bash
npx create-expo-app SecureQRScanner --template blank
cd SecureQRScanner
```

### Step 2: Install Dependencies
```bash
npm install @react-native-async-storage/async-storage@1.18.2
npm install @react-navigation/native@^6.1.7
npm install @react-navigation/stack@^6.3.17
npm install axios@^1.4.0
npm install expo-barcode-scanner@~12.5.3
npm install expo-camera@~13.4.4
npm install expo-linking@~5.0.2
npm install expo-secure-store@~12.3.1
npm install react-native-gesture-handler@~2.12.0
npm install react-native-safe-area-context@4.6.3
npm install react-native-screens@~3.22.0
```

### Step 3: Create Source Directory Structure
```bash
mkdir -p src/screens
mkdir -p src/services  
mkdir -p src/contexts
mkdir -p src/components/common
mkdir -p src/utils
mkdir -p src/types
```

### Step 4: Create Configuration Files

Create these additional config files in the root directory:

**babel.config.js:**
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

**metro.config.js:**
```javascript
const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname);
module.exports = config;
```

**.gitignore:**
```
node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## 📋 File Contents Checklist

Copy the content from the artifacts into these files:

- [ ] **App.js** → Root directory (from "App.js - Main Application Entry")
- [ ] **package.json** → Root directory (from "package.json - Project Dependencies")  
- [ ] **app.json** → Root directory (from "app.json - Expo Configuration")
- [ ] **README.md** → Root directory (from "README.md - Project Documentation")
- [ ] **src/contexts/AppContext.js** → (from "AppContext.js - Global State Management")
- [ ] **src/services/StorageService.js** → Extract from "Services - Core Business Logic" 
- [ ] **src/services/VirusTotalService.js** → Extract from "Services - Core Business Logic"
- [ ] **src/services/UrlValidator.js** → Extract from "Services - Core Business Logic"
- [ ] **src/screens/SetupScreen.js** → (from "SetupScreen.js - Initial API Key Setup")
- [ ] **src/screens/ScannerScreen.js** → (from "ScannerScreen.js - QR Code Scanner")
- [ ] **src/screens/ResultsScreen.js** → (from "ResultsScreen.js - Security Analysis Results")  
- [ ] **src/screens/SettingsScreen.js** → (from "SettingsScreen.js - App Settings and Configuration")

## 🔧 Import Fixes Required

After copying files, you'll need to fix some import paths:

**In App.js, update these imports:**
```javascript
import SetupScreen from './src/screens/SetupScreen';
import ScannerScreen from './src/screens/ScannerScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import StorageService from './src/services/StorageService';
import { AppProvider } from './src/contexts/AppContext';
```

**Add missing import in App.js:**
```javascript
import { TouchableOpacity } from 'react-native';
```

## 📱 Asset Files Needed

You'll need to create/add these asset files to the `assets/` folder:

- **icon.png** (1024x1024) - App icon
- **splash.png** (1284x2778) - Splash screen  
- **adaptive-icon.png** (1024x1024) - Android adaptive icon
- **favicon.png** (48x48) - Web favicon

You can create simple placeholder images or generate them using online tools.

## 🚀 Running the Project

After setting up all files:

```bash
# Start the development server
expo start

# Run on Android
expo start --android

# Run on iOS (if you have Mac)
expo start --ios
```

## 🐛 Common Setup Issues & Fixes

1. **Metro bundler issues:**
   ```bash
   expo start -c  # Clear cache
   ```

2. **Dependency conflicts:**
   ```bash
   rm -rf node_modules
   npm install
   ```

3. **Missing permissions in app.json:**
   Make sure camera permissions are properly configured.

4. **Import errors:**
   Double-check all file paths match the structure above.

## 📝 Final Steps

1. **Get VirusTotal API Key:**
   - Go to [virustotal.com/gui/join-us](https://www.virustotal.com/gui/join-us)
   - Register for free account
   - Get your API key from profile settings

2. **Test the App:**
   - Install on Android device/emulator
   - Complete setup with your API key
   - Test QR code scanning functionality

3. **Build for Production:**
   ```bash
   # Install EAS CLI
   npm install -g @expo/cli
   
   # Configure build
   eas build:configure
   
   # Build APK
   eas build --platform android --profile preview
   ```

## 🎯 Quick Start Script

Create this as a shell script to automate setup:

```bash
#!/bin/bash
echo "Setting up SecureQR Scanner..."

# Create project
npx create-expo-app SecureQRScanner --template blank
cd SecureQRScanner

# Create directory structure
mkdir -p src/{screens,services,contexts,components/common,utils,types}

# Install dependencies
npm install @react-native-async-storage/async-storage@1.18.2 @react-navigation/native@^6.1.7 @react-navigation/stack@^6.3.17 axios@^1.4.0 expo-barcode-scanner@~12.5.3 expo-camera@~13.4.4 expo-linking@~5.0.2 expo-secure-store@~12.3.1 react-native-gesture-handler@~2.12.0 react-native-safe-area-context@4.6.3 react-native-screens@~3.22.0

echo "Project structure created! Now copy the file contents from the artifacts."
```

This gives you everything you need to recreate the complete project structure. Just follow the steps in order and copy the code from each artifact into the corresponding file!