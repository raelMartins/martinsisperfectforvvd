"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "dark" | "light";

export type ThemeColors = {
  appBg: string;
  windowBg: string;
  sidebarBg: string;
  chatBg: string;
  headerBg: string;
  border: string;
  text: string;
  muted: string;
  meBubble: string;
  meText: string;
  theirBubble: string;
  theirText: string;
  link: string;
  activeRow: string;
  typingDot: string;
};

const THEMES: Record<Theme, ThemeColors> = {
  dark: {
    appBg: "#000000",
    windowBg: "#000000",
    sidebarBg: "#141416",
    chatBg: "#000000",
    headerBg: "rgba(0,0,0,0.6)",
    border: "rgba(255,255,255,0.08)",
    text: "#F5F5F7",
    muted: "#8E8E93",
    meBubble: "#0A84FF",
    meText: "#FFFFFF",
    theirBubble: "#3A3A3C",
    theirText: "#F5F5F7",
    link: "#64D2FF",
    activeRow: "#0A84FF",
    typingDot: "#8E8E93",
  },
  light: {
    appBg: "#F2F2F7",
    windowBg: "#FFFFFF",
    sidebarBg: "#F6F6F6",
    chatBg: "#F2F2F7",
    headerBg: "#FBFBFB",
    border: "rgba(0,0,0,0.1)",
    text: "#1D1D1F",
    muted: "#8E8E93",
    meBubble: "#007AFF",
    meText: "#FFFFFF",
    theirBubble: "#E5E5EA",
    theirText: "#1D1D1F",
    link: "#007AFF",
    activeRow: "#007AFF",
    typingDot: "#8E8E93",
  },
};

type ThemeContextValue = {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      colors: THEMES[theme],
      toggleTheme,
    }),
    [theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
