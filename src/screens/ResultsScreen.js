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
import { useLocale } from "../contexts/LocaleContext";
import { useThemeMode } from "../contexts/ThemeContext";

const SecurityBadge = ({ level, theme }) => {
  const getBadgeStyle = (level) => {
    switch (level) {
      case "SAFE":
        return { backgroundColor: theme.colors.success, icon: "✅" };
      case "SUSPICIOUS":
        return { backgroundColor: theme.colors.warning, icon: "⚠️" };
      case "MALICIOUS":
        return { backgroundColor: theme.colors.danger, icon: "🚨" };
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
  const { t } = useLocale();
  const { theme } = useThemeMode();

  const getSecurityMessage = (level, positives, total) => {
    switch (level) {
      case "SAFE":
        return {
          title: t('results.safeToVisit'),
          message: t('results.safeMessage'),
          action: t('results.safeAction'),
        };
      case "SUSPICIOUS":
        return {
          title: t('results.suspiciousTitle'),
          message: t('results.suspiciousMessage', { positives, total }),
          action: t('results.suspiciousAction'),
        };
      case "MALICIOUS":
        return {
          title: t('results.maliciousTitle'),
          message: t('results.maliciousMessage', { positives, total }),
          action: t('results.maliciousAction'),
        };
      case "UNKNOWN":
        return {
          title: t('results.unknownTitle'),
          message: t('results.unknownMessage'),
          action: t('results.unknownAction'),
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
        t('errors.dangerousUrl'),
        t('errors.dangerousUrlMessage'),
        [
          { text: t('common.cancel'), style: "cancel" },
          {
            text: t('errors.openAnyway'),
            style: "destructive",
            onPress: () => Linking.openURL(scanResult.url),
          },
        ]
      );
    } else if (scanResult.securityLevel === "SUSPICIOUS") {
      Alert.alert(
        t('errors.suspiciousUrl'),
        t('errors.suspiciousUrlMessage'),
        [
          { text: t('common.cancel'), style: "cancel" },
          {
            text: t('errors.openCarefully'),
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
      const shareMessage = `${t('app.name')} ${t('results.title')}:
${t('results.urlInfo')}: ${scanResult.url}
Security Status: ${scanResult.securityLevel}
VirusTotal Score: ${scanResult.virusTotalReport.positives}/${scanResult.virusTotalReport.total}
HTTPS: ${scanResult.isHttps ? "Yes" : "No"}`;

      await Share.share({
        message: shareMessage,
        title: `${t('app.name')} ${t('results.title')}`,
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

  const dynamicStyles = createDynamicStyles(theme);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Security Status */}
        <View style={[styles.mainStatus, { backgroundColor: theme.colors.card }]}>
          <SecurityBadge level={scanResult.securityLevel} theme={theme} />
          <Text style={[styles.statusTitle, { color: theme.colors.text }]}>
            {securityInfo.title}
          </Text>
          <Text style={[styles.statusMessage, { color: theme.colors.textSecondary }]}>
            {securityInfo.message}
          </Text>
        </View>

        {/* URL Information */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('results.urlInfo')}
          </Text>
          <View style={[styles.urlContainer, { backgroundColor: theme.colors.surface, borderLeftColor: theme.colors.primary }]}>
            <Text style={[styles.urlText, { color: theme.colors.text }]} numberOfLines={3}>
              {scanResult.url}
            </Text>
            <View style={styles.urlDetails}>
              <View style={styles.urlDetailItem}>
                <Text style={[styles.urlDetailLabel, { color: theme.colors.textSecondary }]}>
                  {t('results.domain')}
                </Text>
                <Text style={[styles.urlDetailValue, { color: theme.colors.text }]}>
                  {scanResult.domain}
                </Text>
              </View>
              <View style={styles.urlDetailItem}>
                <Text style={[styles.urlDetailLabel, { color: theme.colors.textSecondary }]}>
                  {t('results.protocol')}
                </Text>
                <Text
                  style={[
                    styles.urlDetailValue,
                    { color: scanResult.isHttps ? theme.colors.success : theme.colors.warning },
                  ]}
                >
                  {scanResult.isHttps ? "🔒 HTTPS" : "⚠️ HTTP"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Security Analysis */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('results.securityAnalysis')}
          </Text>
          <View style={styles.analysisContainer}>
            <View style={styles.scoreContainer}>
              <Text style={[styles.scoreNumber, { color: theme.colors.text }]}>
                {scanResult.virusTotalReport.positives}/
                {scanResult.virusTotalReport.total}
              </Text>
              <Text style={[styles.scoreLabel, { color: theme.colors.textSecondary }]}>
                {t('results.vendorsFlagged')}
              </Text>
            </View>

            {!scanResult.isHttps && (
              <View style={[styles.warningContainer, { backgroundColor: '#fff3cd', borderLeftColor: theme.colors.warning }]}>
                <Text style={styles.warningText}>
                  {t('results.httpWarning')}
                </Text>
              </View>
            )}

            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              {securityInfo.action}
            </Text>
          </View>
        </View>

        {/* Detailed Report */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity
            style={styles.detailsToggle}
            onPress={() => setShowDetails(!showDetails)}
          >
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t('results.detailedReport')}
            </Text>
            <Text style={[styles.toggleIcon, { color: theme.colors.textSecondary }]}>
              {showDetails ? "▼" : "▶"}
            </Text>
          </TouchableOpacity>

          {showDetails && (
            <View style={[styles.detailsContainer, { borderTopColor: theme.colors.divider }]}>
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                  {t('results.scanDate')}
                </Text>
                <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                  {formatDate(scanResult.virusTotalReport.scanDate)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                  {t('results.responseCode')}
                </Text>
                <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                  {scanResult.virusTotalReport.responseCode}
                </Text>
              </View>

              {scanResult.virusTotalReport.message && (
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                    {t('results.vtMessage')}
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                    {scanResult.virusTotalReport.message}
                  </Text>
                </View>
              )}

              {scanResult.virusTotalReport.permalink && (
                <TouchableOpacity
                  style={[styles.permalinkButton, { backgroundColor: theme.colors.primary }]}
                  onPress={() =>
                    Linking.openURL(scanResult.virusTotalReport.permalink)
                  }
                >
                  <Text style={styles.permalinkText}>
                    {t('results.viewFullReport')}
                  </Text>
                </TouchableOpacity>
              )}

              {/* Vendor Results */}
              {Object.keys(scanResult.virusTotalReport.scans || {}).length > 0 && (
                <View style={styles.vendorResults}>
                  <Text style={[styles.vendorTitle, { color: theme.colors.text }]}>
                    {t('results.vendorResults')}
                  </Text>
                  {Object.entries(scanResult.virusTotalReport.scans)
                    .slice(0, 10)
                    .map(([vendor, result]) => (
                      <View key={vendor} style={[styles.vendorRow, { borderBottomColor: theme.colors.divider }]}>
                        <Text style={[styles.vendorName, { color: theme.colors.text }]}>
                          {vendor}
                        </Text>
                        <Text
                          style={[
                            styles.vendorResult,
                            { color: result.detected ? theme.colors.danger : theme.colors.success },
                          ]}
                        >
                          {result.detected
                            ? result.result || t('results.malicious')
                            : t('results.clean')}
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
              style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
              onPress={handleOpenUrl}
            >
              <Text style={styles.actionButtonText}>{t('results.openSafely')}</Text>
            </TouchableOpacity>
          ) : scanResult.securityLevel === "SUSPICIOUS" ? (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.warning }]}
              onPress={handleOpenUrl}
            >
              <Text style={styles.actionButtonText}>{t('results.openCaution')}</Text>
            </TouchableOpacity>
          ) : scanResult.securityLevel === "MALICIOUS" ? (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.colors.danger }]}
              onPress={handleOpenUrl}
            >
              <Text style={styles.actionButtonText}>{t('results.doNotOpen')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: "#9E9E9E" }]}
              onPress={handleOpenUrl}
            >
              <Text style={styles.actionButtonText}>{t('results.openOwnRisk')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton, { borderColor: theme.colors.primary }]}
            onPress={handleShareResults}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
              {t('results.share')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton, { borderColor: theme.colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
              {t('results.scanAnother')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createDynamicStyles = (theme) => StyleSheet.create({
  // Dynamic styles based on theme
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  mainStatus: {
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
    marginBottom: 10,
    textAlign: "center",
  },
  statusMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  section: {
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
    marginBottom: 15,
  },
  urlContainer: {
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  urlText: {
    fontSize: 16,
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
    fontWeight: "bold",
  },
  urlDetailValue: {
    fontSize: 14,
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
  },
  scoreLabel: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  warningContainer: {
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    marginBottom: 15,
    width: "100%",
  },
  warningText: {
    color: "#856404",
    fontSize: 14,
  },
  actionText: {
    fontSize: 16,
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
  },
  detailsContainer: {
    borderTopWidth: 1,
    paddingTop: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    flex: 2,
    textAlign: "right",
  },
  permalinkButton: {
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
    marginBottom: 10,
  },
  vendorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    borderBottomWidth: 1,
  },
  vendorName: {
    fontSize: 14,
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
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ResultsScreen;
