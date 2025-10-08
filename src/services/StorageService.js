import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

class StorageService {
  // Secure storage for sensitive data
  static async storeApiKey(key) {
    await SecureStore.setItemAsync("vt_api_key", key);
  }

  static async getApiKey() {
    return await SecureStore.getItemAsync("vt_api_key");
  }

  static async removeApiKey() {
    await SecureStore.deleteItemAsync("vt_api_key");
  }

  // Regular storage for non-sensitive data
  static async storeSettings(settings) {
    await AsyncStorage.setItem("app_settings", JSON.stringify(settings));
  }

  static async getSettings() {
    const settings = await AsyncStorage.getItem("app_settings");
    return settings ? JSON.parse(settings) : {};
  }

  // Locale storage
  static async storeLocale(locale) {
    await AsyncStorage.setItem("app_locale", locale);
  }

  static async getLocale() {
    return await AsyncStorage.getItem("app_locale");
  }

  // Theme storage
  static async storeThemeMode(mode) {
    await AsyncStorage.setItem("app_theme_mode", mode);
  }

  static async getThemeMode() {
    return await AsyncStorage.getItem("app_theme_mode");
  }

  // Color scheme storage
  static async storeColorScheme(scheme) {
    await AsyncStorage.setItem("app_color_scheme", scheme);
  }

  static async getColorScheme() {
    return await AsyncStorage.getItem("app_color_scheme");
  }
}

export default StorageService;
