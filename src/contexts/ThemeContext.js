import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Appearance } from "react-native";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme();
  const [mode, setMode] = useState("system"); // 'system' | 'light' | 'dark'
  const [system, setSystem] = useState(colorScheme || "light");

  useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme: next }) => {
      setSystem(next || "light");
    });
    return () => sub?.remove?.();
  }, []);

  const isDark = mode === "dark" || (mode === "system" && system === "dark");

  const theme = useMemo(
    () => ({
      dark: isDark,
      colors: {
        background: isDark ? "#121212" : "#f5f5f5",
        card: isDark ? "#1e1e1e" : "#fff",
        text: isDark ? "#eee" : "#333",
        mutedText: isDark ? "#aaa" : "#666",
        primary: "#2196F3",
        warning: "#ffc107",
        danger: "#F44336",
        success: "#4CAF50",
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
