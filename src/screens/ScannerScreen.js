import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../contexts/AppContext";
import { UrlValidator } from "../services/UrlValidator";
import VirusTotalService from "../services/VirusTotalService";

const { width, height } = Dimensions.get("window");

const ScannerScreen = ({ navigation }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { state, actions } = useApp();
  const vtService = useRef(new VirusTotalService());

  useEffect(() => {
    if (state.apiKey) {
      vtService.current.setApiKey(state.apiKey);
    }
  }, [state.apiKey]);

  const handleBarCodeScanned = async ({ type, data }) => {
    if (scanned || isProcessing) return;

    setScanned(true);
    setIsProcessing(true);

    try {
      console.log("📱 QR Code scanned:", { type, data });

      // Check if the scanned data is a URL
      if (!UrlValidator.isValidUrl(data)) {
        console.log("❌ Scanned content is not a valid URL");
        Alert.alert(
          "Not a URL",
          `Scanned content: ${data}\n\nThis QR code doesn't contain a URL.`,
          [{ text: "Scan Again", onPress: () => setScanned(false) }]
        );
        return;
      }

      const sanitizedUrl = UrlValidator.sanitizeUrl(data);
      const isHttps = UrlValidator.isHttps(sanitizedUrl);

      console.log("✅ Valid URL detected:", {
        original: data,
        sanitized: sanitizedUrl,
        isHttps: isHttps,
      });

      // Show processing indicator
      actions.setLoading(true);

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

      // Navigate to results
      navigation.navigate("Results", { scanResult });
    } catch (error) {
      console.error("Scan processing error:", error);
      Alert.alert(
        "Scan Error",
        error.message || "Failed to process the QR code. Please try again.",
        [{ text: "Try Again", onPress: () => resetScanner() }]
      );
    } finally {
      setIsProcessing(false);
      actions.setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setIsProcessing(false);
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
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>📷</Text>
        <Text style={styles.errorTitle}>Camera Permission Required</Text>
        <Text style={styles.errorMessage}>
          BasiraQr needs camera access to scan QR codes.
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={requestPermission}
        >
          <Text style={styles.retryButtonText}>Grant Permission</Text>
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
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => navigation.navigate("Settings")}
            >
              <Text style={styles.settingsButtonText}>⚙️ Settings</Text>
            </TouchableOpacity>
          </View>

          {/* Scanning area */}
          <View style={styles.scanningArea}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>

            {isProcessing && (
              <View style={styles.processingOverlay}>
                <ActivityIndicator size="large" color="#fff" />
                <Text style={styles.processingText}>
                  Checking URL security...
                </Text>
              </View>
            )}

            {scanned && !isProcessing && (
              <View style={styles.scanCompleteOverlay}>
                <Text style={styles.scanCompleteText}>✅ Scan Complete</Text>
                <Text style={styles.scanCompleteSubtext}>
                  Tap "Scan Again" to scan another QR code
                </Text>
              </View>
            )}
          </View>

          {/* Instructions */}
          <View style={styles.instructions}>
            {!scanned ? (
              <>
                <Text style={styles.instructionTitle}>🛡️ BasiraQr Active</Text>
                <Text style={styles.instructionText}>
                  Point your camera at a QR code to scan it safely
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.instructionTitle}>
                  {isProcessing ? "Processing..." : "Scan Complete"}
                </Text>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={resetScanner}
                >
                  <Text style={styles.cancelButtonText}>
                    {isProcessing ? "Cancel" : "Scan Again"}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* History indicator */}
          {state.scanHistory.length > 0 && (
            <View style={styles.historyIndicator}>
              <Text style={styles.historyText}>
                📊 {state.scanHistory.length} scans in history
              </Text>
            </View>
          )}
        </View>
      </CameraView>
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
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 20,
    paddingTop: 10,
  },
  settingsButton: {
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  settingsButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
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
    borderColor: "#2196F3",
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
  processingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  processingText: {
    color: "#fff",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  scanCompleteOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(76, 175, 80, 0.9)",
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
    backgroundColor: "#f44336",
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 48,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#2196F3",
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
