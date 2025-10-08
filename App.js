import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Alert } from "react-native";

// Screens
import SetupScreen from "./src/screens/SetupScreen";
import ScannerScreen from "./src/screens/ScannerScreen";
import ResultsScreen from "./src/screens/ResultsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

// Services
import StorageService from "./src/services/StorageService";

// Contexts
import { AppProvider } from "./src/contexts/AppContext";
import { ThemeProvider } from "./src/contexts/ThemeContext";
import { LocaleProvider } from "./src/contexts/LocaleContext";

const Stack = createStackNavigator();

export default function App() {
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkSetupStatus();
  }, []);

  const checkSetupStatus = async () => {
    try {
      const apiKey = await StorageService.getApiKey();
      setIsSetupComplete(!!apiKey);
    } catch (error) {
      console.error("Error checking setup status:", error);
      Alert.alert("Error", "Failed to check app setup status");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // You can add a splash screen component here
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LocaleProvider>
          <AppProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <Stack.Navigator
                initialRouteName={isSetupComplete ? "Scanner" : "Setup"}
                screenOptions={{
                  headerStyle: {
                    backgroundColor: "#6366F1",
                  },
                  headerTintColor: "#fff",
                  headerTitleStyle: {
                    fontWeight: "bold",
                  },
                }}
              >
                <Stack.Screen
                  name="Setup"
                  component={SetupScreen}
                  options={{
                    title: "BasiraQr Setup",
                    headerLeft: null,
                  }}
                />
                <Stack.Screen
                  name="Scanner"
                  component={ScannerScreen}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="Results"
                  component={ResultsScreen}
                  options={{ title: "Scan Results" }}
                />
                <Stack.Screen
                  name="Settings"
                  component={SettingsScreen}
                  options={{ title: "Settings" }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </AppProvider>
        </LocaleProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
