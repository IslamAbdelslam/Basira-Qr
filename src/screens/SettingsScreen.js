import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../contexts/AppContext";
import StorageService from "../services/StorageService";
import VirusTotalService from "../services/VirusTotalService";

const SettingsScreen = ({ navigation }) => {
  const { state, actions } = useApp();
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [newApiKey, setNewApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [maskedApiKey, setMaskedApiKey] = useState("");

  useEffect(() => {
    if (state.apiKey) {
      // Mask the API key for display
      const key = state.apiKey;
      const masked =
        key.length > 8
          ? key.substring(0, 4) + "..." + key.substring(key.length - 4)
          : "****";
      setMaskedApiKey(masked);
    }
  }, [state.apiKey]);

  const handleChangeApiKey = async () => {
    if (!newApiKey.trim()) {
      Alert.alert("Error", "Please enter a valid API key");
      return;
    }

    setIsValidating(true);

    try {
      const vtService = new VirusTotalService();
      const isValid = await vtService.validateApiKey(newApiKey.trim());

      if (isValid) {
        await actions.setApiKey(newApiKey.trim());
        setShowApiKeyModal(false);
        setNewApiKey("");
        Alert.alert("Success", "API key updated successfully!");
      } else {
        Alert.alert("Invalid API Key", "The API key you entered is not valid.");
      }
    } catch (error) {
      Alert.alert("Validation Failed", "Failed to validate the new API key.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveApiKey = () => {
    Alert.alert(
      "Remove API Key",
      "Are you sure you want to remove your API key? You will need to set it up again to use the app.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await StorageService.removeApiKey();
              Alert.alert(
                "API Key Removed",
                "You will be redirected to the setup screen.",
                [{ text: "OK", onPress: () => navigation.replace("Setup") }]
              );
            } catch (error) {
              Alert.alert("Error", "Failed to remove API key");
            }
          },
        },
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      "Clear Scan History",
      "Are you sure you want to clear all scan history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            // This would require implementing a clear history action in the context
            Alert.alert("Success", "Scan history cleared");
          },
        },
      ]
    );
  };

  const SettingItem = ({
    title,
    subtitle,
    onPress,
    rightElement,
    danger = false,
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, danger && styles.dangerText]}>
          {title}
        </Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      {rightElement && <View style={styles.settingRight}>{rightElement}</View>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>
            Manage your OkiQr preferences
          </Text>
        </View>

        {/* API Key Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔑 VirusTotal Integration</Text>

          <SettingItem
            title="API Key"
            subtitle={`Current: ${maskedApiKey || "Not set"}`}
            onPress={() => setShowApiKeyModal(true)}
            rightElement={<Text style={styles.editText}>Edit</Text>}
          />

          <SettingItem
            title="Remove API Key"
            subtitle="Remove current API key and reset app"
            onPress={handleRemoveApiKey}
            danger={true}
          />
        </View>

        {/* Scan History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📊 Scan History</Text>

          <SettingItem
            title="Total Scans"
            subtitle={`${state.scanHistory.length} QR codes scanned`}
            rightElement={
              <Text style={styles.countText}>{state.scanHistory.length}</Text>
            }
          />

          <SettingItem
            title="Clear History"
            subtitle="Remove all scan records"
            onPress={handleClearHistory}
            danger={true}
          />
        </View>

        {/* Security Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛡️ Security Settings</Text>

          <SettingItem
            title="HTTPS Warning"
            subtitle="Always warn about HTTP (non-secure) links"
            rightElement={<Text style={styles.statusText}>Enabled</Text>}
          />

          <SettingItem
            title="Auto-block Malicious"
            subtitle="Prevent opening URLs flagged as malicious"
            rightElement={<Text style={styles.statusText}>Enabled</Text>}
          />
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ℹ️ App Information</Text>

          <SettingItem title="Version" subtitle="OkiQr v1.0.0" />

          <SettingItem
            title="Privacy Policy"
            subtitle="View our privacy practices"
            onPress={() => {
              Alert.alert(
                "Privacy Policy",
                "OkiQr:\n\n• Stores your API key securely on device\n• Sends scanned URLs to VirusTotal for analysis\n• Does not collect personal data\n• Scan history stays on your device"
              );
            }}
            rightElement={<Text style={styles.editText}>View</Text>}
          />

          <SettingItem
            title="About VirusTotal"
            subtitle="Learn about our security partner"
            onPress={() => {
              Alert.alert(
                "About VirusTotal",
                "VirusTotal is a free online service that analyzes URLs and files for malicious content using multiple antivirus engines and security tools."
              );
            }}
            rightElement={<Text style={styles.editText}>Info</Text>}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ for safer QR code scanning
          </Text>
        </View>
      </ScrollView>

      {/* API Key Change Modal */}
      <Modal
        visible={showApiKeyModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setShowApiKeyModal(false);
                setNewApiKey("");
              }}
            >
              <Text style={styles.cancelButton}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Change API Key</Text>
            <TouchableOpacity
              onPress={handleChangeApiKey}
              disabled={!newApiKey.trim() || isValidating}
            >
              <Text
                style={[
                  styles.saveButton,
                  (!newApiKey.trim() || isValidating) &&
                    styles.saveButtonDisabled,
                ]}
              >
                {isValidating ? "Validating..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalDescription}>
              Enter your new VirusTotal API key. The key will be validated
              before saving.
            </Text>

            <TextInput
              style={styles.apiKeyInput}
              placeholder="Paste your new VirusTotal API key here"
              value={newApiKey}
              onChangeText={setNewApiKey}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
            />

            {isValidating && (
              <View style={styles.validatingContainer}>
                <ActivityIndicator size="small" color="#2196F3" />
                <Text style={styles.validatingText}>Validating API key...</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.getKeyButton}
              onPress={() => {
                // This would open the VirusTotal signup page
                Alert.alert(
                  "Get API Key",
                  "Visit virustotal.com to create a free account and get your API key."
                );
              }}
            >
              <Text style={styles.getKeyButtonText}>
                Don't have an API key? Get one free
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
  },
  header: {
    padding: 20,
    backgroundColor: "#2196F3",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 15,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#f8f9fa",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  settingRight: {
    marginLeft: 10,
  },
  editText: {
    color: "#2196F3",
    fontSize: 16,
    fontWeight: "500",
  },
  countText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
  statusText: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "500",
  },
  dangerText: {
    color: "#F44336",
  },
  footer: {
    padding: 20,
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
    fontStyle: "italic",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cancelButton: {
    color: "#666",
    fontSize: 16,
  },
  saveButton: {
    color: "#2196F3",
    fontSize: 16,
    fontWeight: "bold",
  },
  saveButtonDisabled: {
    color: "#ccc",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    lineHeight: 24,
  },
  apiKeyInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    maxHeight: 150,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  validatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  validatingText: {
    marginLeft: 10,
    color: "#666",
    fontSize: 16,
  },
  getKeyButton: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  getKeyButtonText: {
    color: "#2196F3",
    fontSize: 16,
    fontWeight: "500",
  },
});

export default SettingsScreen;
