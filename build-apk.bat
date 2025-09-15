@echo off
echo 🚀 Building SecureQR Scanner APK...
echo.

echo 📋 Step 1: Installing EAS CLI...
npm install -g @expo/eas-cli

echo.
echo 🔐 Step 2: Logging into Expo...
eas login

echo.
echo ⚙️ Step 3: Configuring EAS Build...
eas build:configure

echo.
echo 🔨 Step 4: Building APK...
eas build --platform android --profile preview

echo.
echo ✅ Build complete! Check your Expo dashboard for the APK download link.
pause