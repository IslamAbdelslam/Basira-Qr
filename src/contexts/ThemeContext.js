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
        background: isDark ? "#0F172A" : "#F8FAFC",
        card: isDark ? "#1E293B" : "#FFFFFF",
        surface: isDark ? "#334155" : "#F1F5F9",
        
        // Text
        text: isDark ? "#F1F5F9" : "#1E293B",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        textMuted: isDark ? "#64748B" : "#94A3B8",
        
        // Brand - Modern Indigo/Purple
        primary: "#6366F1",
        primaryDark: "#4F46E5",
        primaryLight: "#818CF8",
        accent: "#8B5CF6",
        
        // Status
        success: "#10B981",
        successLight: "#34D399",
        warning: "#F59E0B",
        warningLight: "#FBBF24",
        danger: "#EF4444",
        dangerLight: "#F87171",
        info: "#3B82F6",
        infoLight: "#60A5FA",
        
        // UI Elements
        border: isDark ? "#334155" : "#E2E8F0",
        divider: isDark ? "#334155" : "#F1F5F9",
        overlay: isDark ? "rgba(15, 23, 42, 0.9)" : "rgba(30, 41, 59, 0.8)",
        
        // Camera overlay
        cameraOverlay: "rgba(15, 23, 42, 0.6)",
        scanFrame: "#6366F1",
        scanFrameGlow: "#8B5CF6",
        
        // Additional
        shadow: isDark ? "#000" : "#64748B",
        disabled: isDark ? "#475569" : "#CBD5E1",
        
        // Gradients (for future use)
        gradientStart: "#6366F1",
        gradientEnd: "#8B5CF6",
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
