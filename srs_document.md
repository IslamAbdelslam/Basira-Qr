# Software Requirements Specification (SRS)
## OkiQr - QR Code Security Guardian

### 1. Introduction

#### 1.1 Purpose
This document specifies the requirements for OkiQr, a mobile application designed to protect users from malicious URLs found in QR codes by leveraging VirusTotal's API for threat detection.

#### 1.2 Scope
OkiQr is a React Native mobile application that scans QR codes, validates URLs against VirusTotal's database, and provides security recommendations before allowing users to access the links.

#### 1.3 Target Audience
- General mobile users concerned about QR code security
- Business professionals frequently scanning QR codes
- Security-conscious individuals

### 2. Overall Description

#### 2.1 Product Perspective
OkiQr acts as a security layer between users and potentially malicious QR codes by:
- Intercepting QR code scans
- Validating URLs through VirusTotal API
- Providing security assessments
- Controlling access to verified links

#### 2.2 Product Functions
- QR code scanning and decoding
- VirusTotal API integration for URL validation
- Security report generation
- Safe browsing facilitation
- API key management

#### 2.3 User Characteristics
- Basic smartphone users with varying technical expertise
- Users who regularly encounter QR codes in daily activities
- Privacy and security-conscious individuals

### 3. Functional Requirements

#### 3.1 Authentication & Setup (FR1)
- **FR1.1**: App shall prompt for VirusTotal API key on first launch
- **FR1.2**: App shall validate API key authenticity via VirusTotal API
- **FR1.3**: App shall securely store valid API key locally
- **FR1.4**: App shall provide API key management options

#### 3.2 QR Code Scanning (FR2)
- **FR2.1**: App shall access device camera for QR code scanning
- **FR2.2**: App shall decode QR codes in real-time
- **FR2.3**: App shall support standard QR code formats
- **FR2.4**: App shall handle non-URL QR codes appropriately

#### 3.3 URL Security Validation (FR3)
- **FR3.1**: App shall verify URLs use HTTPS protocol
- **FR3.2**: App shall submit URLs to VirusTotal API for analysis
- **FR3.3**: App shall parse and interpret VirusTotal security reports
- **FR3.4**: App shall handle API quota limitations gracefully

#### 3.4 Security Reporting (FR4)
- **FR4.1**: App shall display security assessment results
- **FR4.2**: App shall provide clear threat level indicators
- **FR4.3**: App shall show detailed scan statistics
- **FR4.4**: App shall recommend appropriate user actions

#### 3.5 Safe Browsing (FR5)
- **FR5.1**: App shall open verified safe URLs in default browser
- **FR5.2**: App shall prevent access to flagged malicious URLs
- **FR5.3**: App shall provide override options with warnings

### 4. Non-Functional Requirements

#### 4.1 Performance
- **NFR1.1**: QR code scanning response time < 2 seconds
- **NFR1.2**: VirusTotal API response handling < 5 seconds
- **NFR1.3**: App launch time < 3 seconds

#### 4.2 Security
- **NFR2.1**: API keys stored using secure storage mechanisms
- **NFR2.2**: HTTPS-only communication with VirusTotal
- **NFR2.3**: No logging of sensitive user data

#### 4.3 Usability
- **NFR3.1**: Intuitive interface requiring minimal user training
- **NFR3.2**: Clear visual indicators for security status
- **NFR3.3**: Accessible design following platform guidelines

#### 4.4 Compatibility
- **NFR4.1**: Android 8.0+ support
- **NFR4.2**: React Native 0.70+ compatibility
- **NFR4.3**: Expo SDK compatibility

#### 4.5 Reliability
- **NFR5.1**: 99% uptime for core scanning functionality
- **NFR5.2**: Graceful handling of network connectivity issues
- **NFR5.3**: Proper error messaging and recovery

### 5. External Interface Requirements

#### 5.1 User Interfaces
- Clean, minimalist scanning interface
- Clear security status displays
- Settings and configuration screens
- API key management interface

#### 5.2 Hardware Interfaces
- Device camera access for QR scanning
- Network connectivity for API communication

#### 5.3 Software Interfaces
- VirusTotal Public API v3
- Device default web browser
- React Native camera libraries
- Expo secure storage

#### 5.4 Communication Interfaces
- HTTPS communication with VirusTotal API
- Standard HTTP/HTTPS for accessing validated URLs

### 6. System Features

#### 6.1 Priority Features (MVP)
1. QR code scanning functionality
2. VirusTotal API integration
3. Basic security assessment
4. Safe link opening

#### 6.2 Secondary Features
1. Scan history
2. Detailed security reports
3. Custom security thresholds
4. Batch scanning support

### 7. Constraints

#### 7.1 Technical Constraints
- VirusTotal API quota limitations
- React Native framework limitations
- Android platform requirements

#### 7.2 Business Constraints
- Free VirusTotal API tier limitations
- Development timeline constraints
- Single platform focus (Android)

### 8. Assumptions and Dependencies

#### 8.1 Assumptions
- Users can obtain VirusTotal API keys
- Stable internet connectivity for API calls
- Standard QR code formats in use

#### 8.2 Dependencies
- VirusTotal API availability
- React Native ecosystem stability
- Expo development platform
- Android camera API functionality