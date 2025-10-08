import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  Linking,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useApp } from "../contexts/AppContext";
import { useLocale } from "../contexts/LocaleContext";
import { useThemeMode } from "../contexts/ThemeContext";
import VirusTotalService from "../services/VirusTotalService";

const SetupScreen = ({ navigation }) => {
  const [apiKey, setApiKey] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const { actions } = useApp();
  const { t } = useLocale();
  const { theme } = useThemeMode();

  const handleGetApiKey = () => {
    Linking.openURL("https://www.virustotal.com/gui/join-us");
  };

  const validateAndSaveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert(t('errors.error'), t('errors.enterValidKey'));
      return;
    }

    setIsValidating(true);

    try {
      const vtService = new VirusTotalService();
      const isValid = await vtService.validateApiKey(apiKey.trim());

      if (isValid) {
        await actions.setApiKey(apiKey.trim());
        Alert.alert(
          t('errors.success'),
          "API key validated successfully. You can now start scanning QR codes.",
          [{ text: t('common.ok'), onPress: () => navigation.replace("Scanner") }]
        );
      } else {
        Alert.alert(
          t('errors.invalidApiKey'),
          t('errors.invalidApiKeyMessage')
        );
      }
    } catch (error) {
      Alert.alert(
        t('errors.validationFailed'),
        t('errors.validationFailedMessage')
      );
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            {t('setup.welcome')}
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            {t('setup.protect')}
          </Text>
        </View>

        <View style={styles.content}>
          <View style={[
            styles.infoSection,
            {
              backgroundColor: theme.dark ? theme.colors.surface : '#e3f2fd',
            }
          ]}>
            <Text style={[
              styles.infoTitle,
              { color: theme.dark ? theme.colors.primary : '#1976D2' }
            ]}>
              🛡️ How it works:
            </Text>
            <Text style={[styles.infoText, { color: theme.colors.text }]}>
              • Scan QR codes safely{"\n"}
              • Check URLs with VirusTotal{"\n"}
              • Get security warnings{"\n"}
              • Browse with confidence
            </Text>
          </View>

          <View style={[
            styles.setupSection,
            { backgroundColor: theme.colors.card }
          ]}>
            <Text style={[styles.setupTitle, { color: theme.colors.text }]}>
              Setup Required
            </Text>
            <Text style={[styles.setupText, { color: theme.colors.textSecondary }]}>
              To get started, you need a free VirusTotal API key:
            </Text>

            <TouchableOpacity
              style={[styles.linkButton, { backgroundColor: theme.colors.success }]}
              onPress={handleGetApiKey}
            >
              <Text style={styles.linkButtonText}>
                {t('setup.getKey')}
              </Text>
            </TouchableOpacity>

            <View style={styles.inputSection}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                {t('setup.enterKey')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: theme.colors.border,
                    color: theme.colors.text,
                    backgroundColor: theme.colors.surface,
                  }
                ]}
                placeholder="Paste your VirusTotal API key here"
                placeholderTextColor={theme.colors.textMuted}
                value={apiKey}
                onChangeText={setApiKey}
                multiline
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.continueButton,
                { backgroundColor: theme.colors.primary },
                (!apiKey.trim() || isValidating) && { backgroundColor: theme.colors.disabled },
              ]}
              onPress={validateAndSaveApiKey}
              disabled={!apiKey.trim() || isValidating}
            >
              {isValidating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.continueButtonText}>
                  {t('setup.validateContinue')}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={[
            styles.privacySection,
            {
              backgroundColor: theme.dark ? theme.colors.surface : '#fff3cd',
              borderLeftColor: theme.colors.warning,
            }
          ]}>
            <Text style={[
              styles.privacyTitle,
              { color: theme.dark ? theme.colors.warning : '#856404' }
            ]}>
              🔒 {t('setup.privacyTitle')}
            </Text>
            <Text style={[
              styles.privacyText,
              { color: theme.dark ? theme.colors.textSecondary : '#856404' }
            ]}>
              {t('setup.privacy')}
            </Text>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  content: {
    flex: 1,
  },
  infoSection: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
  },
  setupSection: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  setupTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  setupText: {
    fontSize: 16,
    marginBottom: 15,
  },
  linkButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  linkButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 50,
    maxHeight: 100,
    textAlignVertical: "top",
  },
  continueButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  privacySection: {
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  privacyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  privacyText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default SetupScreen;
