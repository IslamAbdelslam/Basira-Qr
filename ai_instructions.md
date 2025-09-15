# AI Development Instructions
## OkiQr Implementation Guide

### 1. Development Environment Setup

#### 1.1 Prerequisites
```bash
# Install Node.js (v16+)
# Install Expo CLI
npm install -g @expo/cli

# Create new Expo project
npx create-expo-app SecureQRScanner --template blank-typescript
cd SecureQRScanner
```

#### 1.2 Required Dependencies
```bash
# Core dependencies
expo install expo-camera expo-barcode-scanner
expo install expo-secure-store expo-linking
npm install axios react-navigation
npm install @react-navigation/native @react-navigation/stack
npm install react-native-elements react-native-vector-icons

# Development dependencies  
npm install --save-dev @types/react @types/react-native
```

### 2. Project Structure

```
src/
├── components/
│   ├── Scanner/
│   ├── SecurityBadge/
│   ├── ResultsView/
│   └── common/
├── screens/
│   ├── SetupScreen.tsx
│   ├── ScannerScreen.tsx
│   ├── ResultsScreen.tsx
│   └── SettingsScreen.tsx
├── services/
│   ├── VirusTotalService.ts
│   ├── StorageService.ts
│   └── UrlValidator.ts
├── types/
│   └── index.ts
├── contexts/
│   └── AppContext.tsx
└── utils/
    ├── constants.ts
    └── helpers.ts
```

### 3. Implementation Priority Order

#### Phase 1: Core Foundation
1. **Setup basic navigation structure**
   - Implement React Navigation with Stack Navigator
   - Create basic screen components
   - Setup TypeScript interfaces

2. **Storage Service Implementation**
   ```typescript
   // Implement secure API key storage
   // Handle app configuration
   // Manage user preferences
   ```

3. **VirusTotal Service**
   ```typescript
   // API key validation
   // URL scanning functionality
   // Error handling and retry logic
   ```

#### Phase 2: QR Scanning
1. **Camera Integration**
   - Request camera permissions
   - Implement QR code scanning
   - Handle scan results

2. **URL Processing**
   - Extract URLs from QR codes
   - Validate URL format
   - Check HTTPS protocol

#### Phase 3: Security Analysis
1. **VirusTotal Integration**
   - Submit URLs for analysis
   - Parse security reports
   - Determine threat levels

2. **Results Display**
   - Security status indicators
   - Detailed scan information
   - User action recommendations

#### Phase 4: Polish & Enhancement
1. **UI/UX Improvements**
2. **Error Handling**
3. **Performance Optimization**
4. **Testing Implementation**

### 4. Key Implementation Guidelines

#### 4.1 State Management Pattern
```typescript
// Use React Context for global state
interface AppState {
  apiKey: string | null;
  isSetupComplete: boolean;
  scanHistory: ScanResult[];
}

// Implement reducer pattern for complex state updates
```

#### 4.2 Error Handling Strategy
```typescript
// Centralized error handling
class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string
  ) {
    super(message);
  }
}

// Use try-catch blocks with proper error categorization
```

#### 4.3 Security Best Practices
```typescript
// API key validation before storage
// Input sanitization for all user inputs
// HTTPS-only API communication
// No sensitive data in logs
```

### 5. Component Implementation Templates

#### 5.1 Scanner Screen Template
```typescript
import React, { useState, useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';

const ScannerScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  // Permission handling
  // Scan result processing
  // Navigation to results

  return (
    // Camera view with overlay
    // Scanning indicator
    // Navigation elements
  );
};
```

#### 5.2 Results Screen Template
```typescript
const ResultsScreen = ({ route }) => {
  const { scanResult } = route.params;
  
  // Security level determination
  // UI rendering based on threat level
  // Action button handling

  return (
    // URL display
    // Security badge
    // Scan statistics
    // Action buttons
  );
};
```

### 6. Service Implementation Patterns

#### 6.1 VirusTotal Service Template
```typescript
class VirusTotalService {
  private static instance: VirusTotalService;
  private apiKey: string;

  static getInstance(): VirusTotalService {
    if (!this.instance) {
      this.instance = new VirusTotalService();
    }
    return this.instance;
  }

  async validateApiKey(key: string): Promise<boolean> {
    // Make test API call
    // Validate response
    // Return boolean result
  }

  async scanUrl(url: string): Promise<VirusTotalReport> {
    // Submit URL for scanning
    // Poll for results
    // Parse and return report
  }
}
```

#### 6.2 Storage Service Pattern
```typescript
class StorageService {
  static async storeApiKey(key: string): Promise<void> {
    await SecureStore.setItemAsync('vt_api_key', key);
  }

  static async getApiKey(): Promise<string | null> {
    return await SecureStore.getItemAsync('vt_api_key');
  }

  // Additional storage methods
}
```

### 7. Testing Implementation

#### 7.1 Unit Test Structure
```typescript
// Test VirusTotal service methods
// Test URL validation functions
// Test storage operations
// Mock external dependencies
```

#### 7.2 Integration Test Scenarios
```typescript
// End-to-end scanning flow
// API error handling
// Permission handling
// Navigation flows
```

### 8. Build & Deployment Instructions

#### 8.1 Development Build
```bash
# Start development server
expo start

# Run on Android device/emulator
expo start --android
```

#### 8.2 Production Build
```bash
# Configure app.json for production
# Build APK
expo build:android

# Or use EAS Build (recommended)
eas build --platform android
```

### 9. Debugging Guidelines

#### 9.1 Common Issues & Solutions
- **Camera permission denied**: Implement proper permission flow
- **API quota exceeded**: Show user-friendly error message
- **Network issues**: Implement retry mechanism
- **QR code not detected**: Add manual input option

#### 9.2 Debug Tools
- Use Expo development tools
- Implement comprehensive logging
- Use React Developer Tools
- Network inspection for API calls

### 10. Code Quality Standards

#### 10.1 TypeScript Usage
- Strict type checking enabled
- Proper interface definitions
- No 'any' types without justification
- Generic types where appropriate

#### 10.2 Code Style
- ESLint configuration
- Prettier formatting
- Consistent naming conventions
- Proper component organization

#### 10.3 Performance Guidelines
- Minimize re-renders with React.memo
- Efficient state updates
- Proper cleanup in useEffect
- Optimized image handling

### 11. Security Implementation Checklist

- [ ] API keys stored securely
- [ ] HTTPS-only communication
- [ ] Input validation implemented
- [ ] No sensitive data in logs
- [ ] Proper error handling
- [ ] Permission handling
- [ ] Data sanitization

### 12. Final Implementation Notes

- Start with MVP functionality first
- Implement comprehensive error handling
- Focus on user experience
- Test thoroughly on real devices
- Document all API integrations
- Plan for API quota management
- Consider offline functionality
- Implement proper loading states