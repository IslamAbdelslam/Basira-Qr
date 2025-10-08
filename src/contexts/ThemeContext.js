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
  const [colorSchemeType, setColorSchemeTypeState] = useState("indigo"); // 'indigo' | 'teal' | 'orange' | 'purple' | 'blue'

  useEffect(() => {
    // Load saved theme mode and color scheme
    Promise.all([
      StorageService.getThemeMode(),
      StorageService.getColorScheme()
    ]).then(([savedMode, savedScheme]) => {
      if (savedMode) {
        setModeState(savedMode);
      }
      if (savedScheme) {
        setColorSchemeTypeState(savedScheme);
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

  const setColorScheme = async (newScheme) => {
    setColorSchemeTypeState(newScheme);
    await StorageService.storeColorScheme(newScheme);
  };

  const isDark = mode === "dark" || (mode === "system" && system === "dark");

  // Color scheme definitions
  const colorSchemes = {
    indigo: {
      primary: "#6366F1",
      primaryDark: "#4F46E5",
      primaryLight: "#818CF8",
      accent: "#8B5CF6",
      scanFrame: "#6366F1",
      scanFrameGlow: "#8B5CF6",
      gradientStart: "#6366F1",
      gradientEnd: "#8B5CF6",
    },
    teal: {
      primary: "#14B8A6",
      primaryDark: "#0D9488",
      primaryLight: "#2DD4BF",
      accent: "#06B6D4",
      scanFrame: "#14B8A6",
      scanFrameGlow: "#06B6D4",
      gradientStart: "#14B8A6",
      gradientEnd: "#06B6D4",
    },
    orange: {
      primary: "#F97316",
      primaryDark: "#EA580C",
      primaryLight: "#FB923C",
      accent: "#EF4444",
      scanFrame: "#F97316",
      scanFrameGlow: "#EF4444",
      gradientStart: "#F97316",
      gradientEnd: "#EF4444",
    },
    purple: {
      primary: "#A855F7",
      primaryDark: "#9333EA",
      primaryLight: "#C084FC",
      accent: "#D946EF",
      scanFrame: "#A855F7",
      scanFrameGlow: "#D946EF",
      gradientStart: "#A855F7",
      gradientEnd: "#D946EF",
    },
    blue: {
      primary: "#2196F3",
      primaryDark: "#1976D2",
      primaryLight: "#42A5F5",
      accent: "#03A9F4",
      scanFrame: "#2196F3",
      scanFrameGlow: "#03A9F4",
      gradientStart: "#2196F3",
      gradientEnd: "#03A9F4",
    },
    green: {
      primary: "#10B981",
      primaryDark: "#059669",
      primaryLight: "#34D399",
      accent: "#14B8A6",
      scanFrame: "#10B981",
      scanFrameGlow: "#14B8A6",
      gradientStart: "#10B981",
      gradientEnd: "#14B8A6",
    },
  };

  const currentScheme = colorSchemes[colorSchemeType] || colorSchemes.indigo;

  const theme = useMemo(
    () => ({
      dark: isDark,
      colorScheme: colorSchemeType,
      colors: {
        // Backgrounds
        background: isDark ? "#0F172A" : "#F8FAFC",
        card: isDark ? "#1E293B" : "#FFFFFF",
        surface: isDark ? "#334155" : "#F1F5F9",
        
        // Text
        text: isDark ? "#F1F5F9" : "#1E293B",
        textSecondary: isDark ? "#94A3B8" : "#64748B",
        textMuted: isDark ? "#64748B" : "#94A3B8",
        
        // Brand - Dynamic based on selected scheme
        primary: currentScheme.primary,
        primaryDark: currentScheme.primaryDark,
        primaryLight: currentScheme.primaryLight,
        accent: currentScheme.accent,
        
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
        scanFrame: currentScheme.scanFrame,
        scanFrameGlow: currentScheme.scanFrameGlow,
        
        // Additional
        shadow: isDark ? "#000" : "#64748B",
        disabled: isDark ? "#475569" : "#CBD5E1",
        
        // Gradients
        gradientStart: currentScheme.gradientStart,
        gradientEnd: currentScheme.gradientEnd,
      },
    }),
    [isDark, colorSchemeType, currentScheme]
  );

  const value = useMemo(() => ({ 
    mode, 
    setMode, 
    colorScheme: colorSchemeType, 
    setColorScheme, 
    theme,
    availableSchemes: Object.keys(colorSchemes),
  }), [mode, colorSchemeType, theme]);

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
