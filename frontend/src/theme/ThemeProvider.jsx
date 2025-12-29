import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ThemeContext = createContext(null);

const THEME_KEY = "ui.themeMode"; // "system" | "dark" | "light"
const ACCENT_KEY = "ui.accent"; // "yellow" | "blue" | "green" | ...

function getSystemTheme() {
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(
    () => localStorage.getItem(THEME_KEY) || "system"
  );
  const [accent, setAccent] = useState(
    () => localStorage.getItem(ACCENT_KEY) || "yellow"
  );

  const resolvedTheme = themeMode === "system" ? getSystemTheme() : themeMode;

  // Persist settings
  useEffect(() => localStorage.setItem(THEME_KEY, themeMode), [themeMode]);
  useEffect(() => localStorage.setItem(ACCENT_KEY, accent), [accent]);

  // React to system theme changes when in "system"
  useEffect(() => {
    if (themeMode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      document.documentElement.dataset.theme = getSystemTheme();
    };
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, [themeMode]);

  // Apply to <html data-theme="..."> and <html data-accent="...">
  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  useEffect(() => {
    document.documentElement.dataset.accent = accent;
  }, [accent]);

  const value = useMemo(
    () => ({
      themeMode,
      setThemeMode,
      resolvedTheme,
      accent,
      setAccent,
    }),
    [themeMode, resolvedTheme, accent]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
