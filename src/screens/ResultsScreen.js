import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Share,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SecurityBadge = ({ level }) => {
  const getBadgeStyle = (level) => {
    switch (level) {
      case "SAFE":
        return { backgroundColor: "#4CAF50", icon: "✅" };
      case "SUSPICIOUS":
        return { backgroundColor: "#FF9800", icon: "⚠️" };
      case "MALICIOUS":
        return { backgroundColor: "#F44336", icon: "🚨" };
      case "UNKNOWN":
        return { backgroundColor: "#9E9E9E", icon: "❓" };
      default:
        return { backgroundColor: "#9E9E9E", icon: "❓" };
    }
  };

  const { backgroundColor, icon } = getBadgeStyle(level);

  return (
    <View style={[styles.securityBadge, { backgroundColor }]}>
      <Text style={styles.badgeIcon}>{icon}</Text>
      <Text style={styles.badgeText}>{level}</Text>
    </View>
  );
};

const ResultsScreen = ({ route, navigation }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { scanResult } = route.params;

  const getSecurityMessage = (level, positives, total) => {
    switch (level) {
      case "SAFE":
        return {
          title: "Safe to Visit",
          message: `This URL appears safe. No security vendors flagged it as malicious.`,
          action: "You can safely open this link.",
        };
      case "SUSPICIOUS":
        return {
          title: "Potentially Suspicious",
          message: `${positives} out of ${total} security vendors flagged this URL. Exercise caution.`,
          action:
            "Consider avoiding this link or verify its authenticity first.",
        };
      case "MALICIOUS":
        return {
          title: "Dangerous URL",
          message: `${positives} out of ${total} security vendors flagged this as malicious.`,
          action:
            "Do not visit this link. It may harm your device or steal your data.",
        };
      case "UNKNOWN":
        return {
          title: "Unknown URL",
          message: "This URL was not found in VirusTotal's database.",
          action: "Proceed with caution. Consider the source before visiting.",
        };
      default:
        return {
          title: "Analysis Error",
          message: "Unable to determine security status.",
          action: "Exercise caution when visiting this link.",
        };
    }
  };

  const securityInfo = getSecurityMessage(
    scanResult.securityLevel,
    scanResult.virusTotalReport.positives,
    scanResult.virusTotalReport.total
  );

  const handleOpenUrl = () => {
    if (scanResult.securityLevel === "MALICIOUS") {
      Alert.alert(
        "Dangerous URL",
        "This URL has been flagged as malicious. Are you sure you want to open it?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Anyway",
            style: "destructive",
            onPress: () => Linking.openURL(scanResult.url),
          },
        ]
      );
    } else if (scanResult.securityLevel === "SUSPICIOUS") {
      Alert.alert(
        "Suspicious URL",
        "This URL has been flagged by some security vendors. Proceed with caution.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Open Carefully",
            onPress: () => Linking.openURL(scanResult.url),
          },
        ]
      );
    } else {
      Linking.openURL(scanResult.url);
    }
  };

  const handleShareResults = async () => {
    try {
      const shareMessage = `BasiraQr Scan Results:
URL: ${scanResult.url}
Security Status: ${scanResult.securityLevel}
VirusTotal Score: ${scanResult.virusTotalReport.positives}/${
        scanResult.virusTotalReport.total
      }
HTTPS: ${scanResult.isHttps ? "Yes" : "No"}`;

      await Share.share({
        message: shareMessage,
        title: "BasiraQr Scan Results",
      });
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return "N/A";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Security Status */}
        <View style={styles.mainStatus}>
          <SecurityBadge level={scanResult.securityLevel} />
          <Text style={styles.statusTitle}>{securityInfo.title}</Text>
          <Text style={styles.statusMessage}>{securityInfo.message}</Text>
        </View>

        {/* URL Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📍 URL Information</Text>
          <View style={styles.urlContainer}>
            <Text style={styles.urlText} numberOfLines={3}>
              {scanResult.url}
            </Text>
            <View style={styles.urlDetails}>
              <View style={styles.urlDetailItem}>
                <Text style={styles.urlDetailLabel}>Domain:</Text>
                <Text style={styles.urlDetailValue}>{scanResult.domain}</Text>
              </View>
              <View style={styles.urlDetailItem}>
                <Text style={styles.urlDetailLabel}>Protocol:</Text>
                <Text
                  style={[
                    styles.urlDetailValue,
                    { color: scanResult.isHttps ? "#4CAF50" : "#FF9800" },
                  ]}
                >
                  {scanResult.isHttps ? "🔒 HTTPS" : "⚠️ HTTP"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Security Analysis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛡️ Security Analysis</Text>
          <View style={styles.analysisContainer}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreNumber}>
                {scanResult.virusTotalReport.positives}/
                {scanResult.virusTotalReport.total}
              </Text>
              <Text style={styles.scoreLabel}>
                Security vendors flagged this URL
              </Text>
            </View>

            {!scanResult.isHttps && (
              <View style={styles.warningContainer}>
                <Text style={styles.warningText}>
                  ⚠️ This URL uses HTTP instead of HTTPS, making it less secure
                </Text>
              </View>
            )}

            <Text style={styles.actionText}>{securityInfo.action}</Text>
          </View>
        </View>

        {/* Detailed Report */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.detailsToggle}
            onPress={() => setShowDetails(!showDetails)}
          >
            <Text style={styles.sectionTitle}>📊 Detailed Report</Text>
            <Text style={styles.toggleIcon}>{showDetails ? "▼" : "▶"}</Text>
          </TouchableOpacity>

          {showDetails && (
            <View style={styles.detailsContainer}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Scan Date:</Text>
                <Text style={styles.detailValue}>
                  {formatDate(scanResult.virusTotalReport.scanDate)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Response Code:</Text>
                <Text style={styles.detailValue}>
                  {scanResult.virusTotalReport.responseCode}
                </Text>
              </View>

              {scanResult.virusTotalReport.message && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>VirusTotal Message:</Text>
                  <Text style={styles.detailValue}>
                    {scanResult.virusTotalReport.message}
                  </Text>
                </View>
              )}

              {scanResult.virusTotalReport.permalink && (
                <TouchableOpacity
                  style={styles.permalinkButton}
                  onPress={() =>
                    Linking.openURL(scanResult.virusTotalReport.permalink)
                  }
                >
                  <Text style={styles.permalinkText}>
                    View Full Report on VirusTotal
                  </Text>
                </TouchableOpacity>
              )}

              {/* Vendor Results */}
              {Object.keys(scanResult.virusTotalReport.scans || {}).length >
                0 && (
                <View style={styles.vendorResults}>
                  <Text style={styles.vendorTitle}>
                    Security Vendor Results:
                  </Text>
                  {Object.entries(scanResult.virusTotalReport.scans)
                    .slice(0, 10) // Show first 10 vendors
                    .map(([vendor, result]) => (
                      <View key={vendor} style={styles.vendorRow}>
                        <Text style={styles.vendorName}>{vendor}</Text>
                        <Text
                          style={[
                            styles.vendorResult,
                            { color: result.detected ? "#F44336" : "#4CAF50" },
                          ]}
                        >
                          {result.detected
                            ? result.result || "Malicious"
                            : "Clean"}
                        </Text>
                      </View>
                    ))}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {scanResult.securityLevel === "SAFE" ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.safeButton]}
              onPress={handleOpenUrl}
            >
              <Text style={styles.actionButtonText}>🌐 Open Safely</Text>
            </TouchableOpacity>
          ) : scanResult.securityLevel === "SUSPICIOUS" ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.cautionButton]}
              onPress={handleOpenUrl}
            >
              <Text style={styles.actionButtonText}>⚠️ Open with Caution</Text>
            </TouchableOpacity>
          ) : scanResult.securityLevel === "MALICIOUS" ? (
            <TouchableOpacity
              style={[styles.actionButton, styles.dangerButton]}
              onPress={handleOpenUrl}
            >
              <Text style={styles.actionButtonText}>🚨 Do Not Open</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.unknownButton]}
              onPress={handleOpenUrl}
            >
              <Text style={styles.actionButtonText}>❓ Open at Own Risk</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleShareResults}
          >
            <Text style={styles.secondaryButtonText}>📤 Share Results</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.secondaryButtonText}>🔄 Scan Another</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  mainStatus: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 15,
  },
  badgeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  badgeText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  statusMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  urlContainer: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2196F3",
  },
  urlText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
    fontFamily: "monospace",
  },
  urlDetails: {
    marginTop: 10,
  },
  urlDetailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  urlDetailLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "bold",
  },
  urlDetailValue: {
    fontSize: 14,
    color: "#333",
  },
  analysisContainer: {
    alignItems: "center",
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  scoreNumber: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#333",
  },
  scoreLabel: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  warningContainer: {
    backgroundColor: "#fff3cd",
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
    marginBottom: 15,
    width: "100%",
  },
  warningText: {
    color: "#856404",
    fontSize: 14,
  },
  actionText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    lineHeight: 24,
    fontStyle: "italic",
  },
  detailsToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  toggleIcon: {
    fontSize: 18,
    color: "#666",
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "bold",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: "#333",
    flex: 2,
    textAlign: "right",
  },
  permalinkButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  permalinkText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  vendorResults: {
    marginTop: 15,
  },
  vendorTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  vendorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  vendorName: {
    fontSize: 14,
    color: "#333",
    flex: 1,
  },
  vendorResult: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
  },
  actionButtons: {
    marginTop: 10,
    marginBottom: 20,
  },
  actionButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  safeButton: {
    backgroundColor: "#4CAF50",
  },
  cautionButton: {
    backgroundColor: "#FF9800",
  },
  dangerButton: {
    backgroundColor: "#F44336",
  },
  unknownButton: {
    backgroundColor: "#9E9E9E",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#2196F3",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButtonText: {
    color: "#2196F3",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ResultsScreen;
