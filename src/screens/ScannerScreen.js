import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../contexts/AppContext";
import { useLocale } from "../contexts/LocaleContext";
import { useThemeMode } from "../contexts/ThemeContext";
import { UrlValidator } from "../services/UrlValidator";
import VirusTotalService from "../services/VirusTotalService";
import ScanningLoader from "../components/ScanningLoader";
import Toast from "../components/Toast";

const { width, height } = Dimensions.get("window");

const ScannerScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanStage, setScanStage] = useState(null); // 'scanning' | 'analyzing' | 'queued'
  const [toast, setToast] = useState(null);
  
  const { state, actions } = useApp();
  const { t } = useLocale();
  const { theme } = useThemeMode();
  const vtService = useRef(new VirusTotalService());

  useEffect(() => {
    if (state.apiKey) {
      vtService.current.setApiKey(state.apiKey);
    }
  }, [state.apiKey]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || isProcessing) return;

    setScanned(true);
    setIsProcessing(true);
    setScanStage('scanning');

    try {
      console.log("📱 QR Code scanned:", { type, data });

      // Check if the scanned data is a URL
      if (!UrlValidator.isValidUrl(data)) {
        console.log("❌ Scanned content is not a valid URL");
        setScanStage(null);
        showToast(t('errors.notUrlMessage', { data: data.substring(0, 50) }), 'error');
        setTimeout(() => {
          resetScanner();
        }, 3000);
        return;
      }

      const sanitizedUrl = UrlValidator.sanitizeUrl(data);
      const isHttps = UrlValidator.isHttps(sanitizedUrl);

      console.log("✅ Valid URL detected:", {
        original: data,
        sanitized: sanitizedUrl,
        isHttps: isHttps,
      });

      // Show analyzing stage
      setScanStage('analyzing');

      // Scan with VirusTotal
      console.log("🛡️ Starting VirusTotal scan...");
      const report = await vtService.current.scanUrl(sanitizedUrl);
      const securityLevel = vtService.current.determineSecurityLevel(report);

      console.log("🔒 Security analysis complete:", {
        securityLevel,
        positives: report.positives,
        total: report.total,
      });

      // Create scan result
      const scanResult = {
        url: sanitizedUrl,
        isHttps,
        virusTotalReport: report,
        securityLevel,
        domain: UrlValidator.extractDomain(sanitizedUrl),
      };

      // Add to history
      actions.addScanResult(scanResult);

      // Clear loading state
      setScanStage(null);

      // Navigate to results
      navigation.navigate("Results", { scanResult });
    } catch (error) {
      console.error("Scan processing error:", error);
      setScanStage(null);
      
      if (error.message === "QUEUED") {
        showToast(t('scanner.queued'), 'warning');
        setTimeout(() => {
          resetScanner();
        }, 3000);
      } else {
        showToast(error.message || t('errors.scanErrorMessage'), 'error');
        setTimeout(() => {
          resetScanner();
        }, 3000);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setIsProcessing(false);
    setScanStage(null);
  };

  // Reset scanner when screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("🔄 Scanner screen focused - resetting scanner state");
      resetScanner();
    });

    return unsubscribe;
  }, [navigation]);

  // Reset scanner when component unmounts
  useEffect(() => {
    return () => {
      console.log("🧹 Scanner screen unmounting - cleaning up state");
      resetScanner();
    };
  }, []);

  if (!permission) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
          {t('scanner.requestingPermission')}
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={styles.errorText}>📷</Text>
        <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
          {t('scanner.cameraRequired')}
        </Text>
        <Text style={[styles.errorMessage, { color: theme.colors.textSecondary }]}>
          {t('scanner.cameraMsg')}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
          onPress={requestPermission}
        >
          <Text style={styles.retryButtonText}>{t('scanner.grantPermission')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View style={styles.overlay}>
          {/* Scanning area */}
          <View style={styles.scanningArea}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft, { borderColor: theme.colors.scanFrame }]} />
              <View style={[styles.corner, styles.topRight, { borderColor: theme.colors.scanFrame }]} />
              <View style={[styles.corner, styles.bottomLeft, { borderColor: theme.colors.scanFrame }]} />
              <View style={[styles.corner, styles.bottomRight, { borderColor: theme.colors.scanFrame }]} />
            </View>

            {scanned && !isProcessing && (
              <View style={[styles.scanCompleteOverlay, { backgroundColor: 'rgba(76, 175, 80, 0.9)' }]}>
                <Text style={styles.scanCompleteText}>✅ {t('scanner.complete')}</Text>
                <Text style={styles.scanCompleteSubtext}>
                  {t('scanner.tapScanAgain')}
                </Text>
              </View>
            )}
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            {!scanned ? (
              <>
                <Text style={styles.instructionTitle}>{t('scanner.active')}</Text>
                <Text style={styles.instructionText}>
                  {t('scanner.pointCamera')}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.instructionTitle}>
                  {isProcessing ? t('scanner.processing') : t('scanner.complete')}
                </Text>
                <TouchableOpacity
                  style={[styles.cancelButton, { backgroundColor: theme.colors.danger }]}
                  onPress={resetScanner}
                >
                  <Text style={styles.cancelButtonText}>
                    {isProcessing ? t('common.cancel') : t('common.scanAgain')}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* History indicator */}
          {state.scanHistory.length > 0 && (
            <View style={styles.historyIndicator}>
              <Text style={styles.historyText}>
                📊 {t('scanner.scansInHistory', { count: state.scanHistory.length })}
              </Text>
            </View>
          )}

          {/* Floating Settings Button - Top Right */}
          <TouchableOpacity
            style={[styles.floatingSettingsButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.floatingSettingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </CameraView>

      {/* Loading Overlay */}
      {scanStage && <ScanningLoader stage={scanStage} />}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          onHide={hideToast}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scanningArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 30,
    height: 30,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderBottomWidth: 0,
    borderRightWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderBottomWidth: 0,
    borderLeftWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  scanCompleteOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  scanCompleteText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  scanCompleteSubtext: {
    color: "#fff",
    fontSize: 14,
    textAlign: "center",
    opacity: 0.9,
  },
  instructions: {
    padding: 20,
    alignItems: "center",
  },
  instructionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  instructionText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  historyIndicator: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  historyText: {
    color: "#fff",
    fontSize: 12,
  },
  floatingSettingsButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  floatingSettingsIcon: {
    fontSize: 24,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorText: {
    fontSize: 48,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ScannerScreen;
