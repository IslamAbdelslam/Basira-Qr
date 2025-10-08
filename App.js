import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Alert, TouchableOpacity, Text } from "react-native";

// Screens
import SetupScreen from "./src/screens/SetupScreen";
import ScannerScreen from "./src/screens/ScannerScreen";
import ResultsScreen from "./src/screens/ResultsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

// Services
import StorageService from "./src/services/StorageService";
import { AppProvider } from "./src/contexts/AppContext";

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
      <AppProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName={isSetupComplete ? "Scanner" : "Setup"}
            screenOptions={{
              headerStyle: {
                backgroundColor: "#2196F3",
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
              options={({ navigation }) => ({
                title: "BasiraQr ",
                headerRight: () => (
                  <TouchableOpacity
                    style={{ marginRight: 15 }}
                    onPress={() => navigation.navigate("Settings")}
                  >
                    <Text style={{ color: "#fff", fontSize: 16 }}>
                      Settings
                    </Text>
                  </TouchableOpacity>
                ),
              })}
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
    </SafeAreaProvider>
  );
}
