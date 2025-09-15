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
}

export default StorageService;
