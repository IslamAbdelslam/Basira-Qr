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
import { useLocale } from "../contexts/LocaleContext";
import { useThemeMode } from "../contexts/ThemeContext";
import StorageService from "../services/StorageService";
import VirusTotalService from "../services/VirusTotalService";

const SettingsScreen = ({ navigation }) => {
  const { state, actions } = useApp();
  const { t, locale, changeLocale } = useLocale();
  const { theme, mode, setMode } = useThemeMode();
  
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
      Alert.alert(t('errors.error'), t('errors.enterValidKey'));
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
        Alert.alert(t('errors.success'), t('errors.apiKeyUpdated'));
      } else {
        Alert.alert(t('errors.invalidApiKey'), t('errors.invalidApiKeyMessage'));
      }
    } catch (error) {
      Alert.alert(t('errors.validationFailed'), t('errors.validationFailedMessage'));
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveApiKey = () => {
    Alert.alert(
      t('errors.removeApiKeyTitle'),
      t('errors.removeApiKeyMessage'),
      [
        { text: t('common.cancel'), style: "cancel" },
        {
          text: t('settings.removeKey'),
          style: "destructive",
          onPress: async () => {
            try {
              await StorageService.removeApiKey();
              Alert.alert(
                t('errors.apiKeyRemoved'),
                t('errors.apiKeyRemovedMessage'),
                [{ text: t('common.ok'), onPress: () => navigation.replace("Setup") }]
              );
            } catch (error) {
              Alert.alert(t('errors.error'), t('errors.failedToRemove'));
            }
          },
        },
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      t('errors.clearHistoryTitle'),
      t('errors.clearHistoryMessage'),
      [
        { text: t('common.cancel'), style: "cancel" },
        {
          text: t('settings.clearHistory'),
          style: "destructive",
          onPress: () => {
            Alert.alert(t('errors.success'), t('errors.successMessage'));
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
      style={[styles.settingItem, { borderBottomColor: theme.colors.divider }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingContent}>
        <Text style={[
          styles.settingTitle,
          { color: danger ? theme.colors.danger : theme.colors.text }
        ]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement && <View style={styles.settingRight}>{rightElement}</View>}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
          <Text style={styles.headerTitle}>{t('settings.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('settings.subtitle')}
          </Text>
        </View>

        {/* Appearance Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, backgroundColor: theme.colors.surface }]}>
            {t('settings.appearance')}
          </Text>

          {/* Language Selector */}
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.divider }]}>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                {t('settings.language')}
              </Text>
              <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                {t('settings.languageSubtitle')}
              </Text>
            </View>
            <View style={styles.languageSelector}>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  locale === 'en' && { backgroundColor: theme.colors.primary },
                  { borderColor: theme.colors.border }
                ]}
                onPress={() => changeLocale('en')}
              >
                <Text style={[
                  styles.languageButtonText,
                  { color: locale === 'en' ? '#fff' : theme.colors.text }
                ]}>
                  {t('settings.english')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageButton,
                  locale === 'ar' && { backgroundColor: theme.colors.primary },
                  { borderColor: theme.colors.border }
                ]}
                onPress={() => changeLocale('ar')}
              >
                <Text style={[
                  styles.languageButtonText,
                  { color: locale === 'ar' ? '#fff' : theme.colors.text }
                ]}>
                  {t('settings.arabic')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Dark Mode Selector */}
          <View style={[styles.settingItem, { borderBottomColor: theme.colors.divider }]}>
            <View style={styles.settingContent}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                {t('settings.darkMode')}
              </Text>
              <Text style={[styles.settingSubtitle, { color: theme.colors.textSecondary }]}>
                {t('settings.darkModeSubtitle')}
              </Text>
            </View>
            <View style={styles.themeSelector}>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  mode === 'light' && { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => setMode('light')}
              >
                <Text style={[
                  styles.themeButtonText,
                  { color: mode === 'light' ? '#fff' : theme.colors.text }
                ]}>
                  ☀️
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  mode === 'system' && { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => setMode('system')}
              >
                <Text style={[
                  styles.themeButtonText,
                  { color: mode === 'system' ? '#fff' : theme.colors.text }
                ]}>
                  ⚙️
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.themeButton,
                  mode === 'dark' && { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => setMode('dark')}
              >
                <Text style={[
                  styles.themeButtonText,
                  { color: mode === 'dark' ? '#fff' : theme.colors.text }
                ]}>
                  🌙
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* API Key Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, backgroundColor: theme.colors.surface }]}>
            {t('settings.vtIntegration')}
          </Text>

          <SettingItem
            title={t('settings.apiKey')}
            subtitle={t('settings.currentKey', { key: maskedApiKey || t('settings.notSet') })}
            onPress={() => setShowApiKeyModal(true)}
            rightElement={<Text style={[styles.editText, { color: theme.colors.primary }]}>{t('common.edit')}</Text>}
          />

          <SettingItem
            title={t('settings.removeKey')}
            subtitle={t('settings.removeKeySubtitle')}
            onPress={handleRemoveApiKey}
            danger={true}
          />
        </View>

        {/* Scan History Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, backgroundColor: theme.colors.surface }]}>
            {t('settings.scanHistory')}
          </Text>

          <SettingItem
            title={t('settings.totalScans')}
            subtitle={t('settings.scansCount', { count: state.scanHistory.length })}
            rightElement={
              <Text style={[styles.countText, { color: theme.colors.textSecondary }]}>
                {state.scanHistory.length}
              </Text>
            }
          />

          <SettingItem
            title={t('settings.clearHistory')}
            subtitle={t('settings.clearHistorySubtitle')}
            onPress={handleClearHistory}
            danger={true}
          />
        </View>

        {/* Security Settings */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, backgroundColor: theme.colors.surface }]}>
            {t('settings.securitySettings')}
          </Text>

          <SettingItem
            title={t('settings.httpsWarning')}
            subtitle={t('settings.httpsWarningSubtitle')}
            rightElement={<Text style={[styles.statusText, { color: theme.colors.success }]}>{t('settings.enabled')}</Text>}
          />

          <SettingItem
            title={t('settings.autoBlock')}
            subtitle={t('settings.autoBlockSubtitle')}
            rightElement={<Text style={[styles.statusText, { color: theme.colors.success }]}>{t('settings.enabled')}</Text>}
          />
        </View>

        {/* App Info Section */}
        <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text, backgroundColor: theme.colors.surface }]}>
            {t('settings.appInfo')}
          </Text>

          <SettingItem 
            title={t('settings.version')} 
            subtitle={t('settings.versionNumber')} 
          />

          <SettingItem
            title={t('settings.privacyPolicy')}
            subtitle={t('settings.privacyPolicySubtitle')}
            onPress={() => {
              Alert.alert(
                t('errors.privacyPolicyTitle'),
                t('errors.privacyPolicyMessage')
              );
            }}
            rightElement={<Text style={[styles.editText, { color: theme.colors.primary }]}>{t('common.view')}</Text>}
          />

          <SettingItem
            title={t('settings.aboutVT')}
            subtitle={t('settings.aboutVTSubtitle')}
            onPress={() => {
              Alert.alert(
                t('errors.aboutVTTitle'),
                t('errors.aboutVTMessage')
              );
            }}
            rightElement={<Text style={[styles.editText, { color: theme.colors.primary }]}>{t('common.info')}</Text>}
          />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
            {t('settings.madeWith')}
          </Text>
        </View>
      </ScrollView>

      {/* API Key Change Modal */}
      <Modal
        visible={showApiKeyModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.colors.card }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.colors.divider }]}>
            <TouchableOpacity
              onPress={() => {
                setShowApiKeyModal(false);
                setNewApiKey("");
              }}
            >
              <Text style={[styles.cancelButton, { color: theme.colors.textSecondary }]}>
                {t('common.cancel')}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              {t('settings.changeApiKey')}
            </Text>
            <TouchableOpacity
              onPress={handleChangeApiKey}
              disabled={!newApiKey.trim() || isValidating}
            >
              <Text
                style={[
                  styles.saveButton,
                  { color: theme.colors.primary },
                  (!newApiKey.trim() || isValidating) && { color: theme.colors.disabled },
                ]}
              >
                {isValidating ? t('settings.validating') : t('common.save')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={[styles.modalDescription, { color: theme.colors.textSecondary }]}>
              {t('settings.enterNewKey')}
            </Text>

            <TextInput
              style={[
                styles.apiKeyInput,
                {
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                  backgroundColor: theme.colors.surface,
                }
              ]}
              placeholder={t('settings.pasteKey')}
              placeholderTextColor={theme.colors.textMuted}
              value={newApiKey}
              onChangeText={setNewApiKey}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
            />

            {isValidating && (
              <View style={styles.validatingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={[styles.validatingText, { color: theme.colors.textSecondary }]}>
                  {t('settings.validating')}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.getKeyButton,
                {
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                }
              ]}
              onPress={() => {
                Alert.alert(
                  t('errors.getApiKeyTitle'),
                  t('errors.getApiKeyMessage')
                );
              }}
            >
              <Text style={[styles.getKeyButtonText, { color: theme.colors.primary }]}>
                {t('settings.getKeyFree')}
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
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
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
    marginTop: 15,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  settingRight: {
    marginLeft: 10,
  },
  editText: {
    fontSize: 16,
    fontWeight: "500",
  },
  countText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  languageSelector: {
    flexDirection: "row",
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  themeSelector: {
    flexDirection: "row",
    gap: 8,
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  themeButtonText: {
    fontSize: 20,
  },
  footer: {
    padding: 20,
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    fontSize: 16,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  apiKeyInput: {
    borderWidth: 1,
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
    fontSize: 16,
  },
  getKeyButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  getKeyButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});

export default SettingsScreen;
