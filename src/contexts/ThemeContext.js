import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance } from "react-native";
import StorageService from "../services/StorageService";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme();
  const [mode, setModeState] = useState("system"); // 'system' | 'light' | 'dark'
  const [system, setSystem] = useState(colorScheme || "light");

  useEffect(() => {
    // Load saved theme mode
    StorageService.getThemeMode().then(savedMode => {
      if (savedMode) {
        setModeState(savedMode);
      }
    });

    const sub = Appearance.addChangeListener(({ colorScheme: next }) => {
      setSystem(next || "light");
    });
    return () => sub?.remove?.();
  }, []);

  const setMode = async (newMode) => {
    setModeState(newMode);
    await StorageService.storeThemeMode(newMode);
  };

  const isDark = mode === "dark" || (mode === "system" && system === "dark");

  const theme = useMemo(
    () => ({
      dark: isDark,
      colors: {
        // Backgrounds
        background: isDark ? "#121212" : "#f5f5f5",
        card: isDark ? "#1e1e1e" : "#fff",
        surface: isDark ? "#2a2a2a" : "#ffffff",
        
        // Text
        text: isDark ? "#eee" : "#333",
        textSecondary: isDark ? "#aaa" : "#666",
        textMuted: isDark ? "#888" : "#999",
        
        // Brand
        primary: "#2196F3",
        primaryDark: "#1976D2",
        
        // Status
        success: "#4CAF50",
        warning: "#FF9800",
        danger: "#F44336",
        info: "#2196F3",
        
        // UI Elements
        border: isDark ? "#333" : "#e0e0e0",
        divider: isDark ? "#2a2a2a" : "#f0f0f0",
        overlay: isDark ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0.7)",
        
        // Camera overlay
        cameraOverlay: "rgba(0,0,0,0.5)",
        scanFrame: "#2196F3",
        
        // Additional
        shadow: isDark ? "#000" : "#000",
        disabled: isDark ? "#555" : "#ccc",
      },
    }),
    [isDark]
  );

  const value = useMemo(() => ({ mode, setMode, theme }), [mode, theme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeMode must be used within ThemeProvider");
  return ctx;
};

export default ThemeContext;
