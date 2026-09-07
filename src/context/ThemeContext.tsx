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
  footerBg: string;
  border: string;
  /** Hairline above the composer — barely there in iOS light appearance. */
  borderSoft: string;
  text: string;
  muted: string;
  /** System blue for the back chevron, unread badge and video button. */
  accent: string;
  meBubble: string;
  meText: string;
  theirBubble: string;
  theirText: string;
  link: string;
  activeRow: string;
  typingDot: string;
  avatarBg: string;
  composerBg: string;
  composerBorder: string;
  /** Play/pause button and its tooltip. */
  controlBg: string;
};

const THEMES: Record<Theme, ThemeColors> = {
  dark: {
    appBg: "#000000",
    windowBg: "#000000",
    sidebarBg: "#141416",
    chatBg: "#000000",
    headerBg: "rgba(0,0,0,0.6)",
    footerBg: "rgba(0,0,0,0.6)",
    border: "rgba(255,255,255,0.06)",
    borderSoft: "rgba(255,255,255,0.06)",
    text: "#F5F5F7",
    muted: "#8E8E93",
    accent: "#0A84FF",
    meBubble: "#0A84FF",
    meText: "#FFFFFF",
    theirBubble: "#3A3A3C",
    theirText: "#F5F5F7",
    link: "#64D2FF",
    activeRow: "#0A84FF",
    typingDot: "#8E8E93",
    avatarBg: "#3A3A3C",
    composerBg: "#3A3A3C",
    composerBorder: "transparent",
    controlBg: "#3A3A3C",
  },
  // Sampled from iOS Messages in light appearance: white thread, #F6F6F7 nav
  // bar over a #D3D3D3 hairline, #E9E9EB received bubbles, white composer.
  light: {
    appBg: "#FFFFFF",
    windowBg: "#FFFFFF",
    sidebarBg: "#F6F6F6",
    chatBg: "#FFFFFF",
    headerBg: "rgba(246,246,247,0.86)",
    footerBg: "rgba(255,255,255,0.86)",
    border: "rgba(0,0,0,0.16)",
    borderSoft: "rgba(0,0,0,0.05)",
    text: "#1D1D1F",
    muted: "#8E8E93",
    accent: "#007AFF",
    meBubble: "#007AFF",
    meText: "#FFFFFF",
    theirBubble: "#E9E9EB",
    theirText: "#1D1D1F",
    link: "#007AFF",
    activeRow: "#007AFF",
    typingDot: "#8E8E93",
    avatarBg: "#A0A4AD",
    composerBg: "#FFFFFF",
    composerBorder: "rgba(0,0,0,0.14)",
    controlBg: "#E4E4E6",
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
