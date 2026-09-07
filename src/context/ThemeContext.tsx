"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "dark" | "light";

/**
 * Every token points at a registered custom property declared in globals.css.
 * Components read these instead of literal hex so a theme swap is animated by
 * CSS rather than re-rendered as an instant color change.
 */
export const COLORS = {
  appBg: "var(--app-bg)",
  chatBg: "var(--chat-bg)",
  headerBg: "var(--header-bg)",
  footerBg: "var(--footer-bg)",
  separator: "var(--separator)",
  separatorSoft: "var(--separator-soft)",
  text: "var(--text)",
  muted: "var(--muted)",
  accent: "var(--accent)",
  meBubble: "var(--me-bubble)",
  meText: "var(--me-text)",
  theirBubble: "var(--their-bubble)",
  theirText: "var(--their-text)",
  link: "var(--link)",
  linkUnderline: "var(--link-underline)",
  composerBg: "var(--composer-bg)",
  composerBorder: "var(--composer-border)",
  controlBg: "var(--control-bg)",
  avatarBg: "var(--avatar-bg)",
  typingDot: "var(--typing-dot)",
} as const;

export type ThemeColors = typeof COLORS;

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

  // The palette lives on the document element so `color-scheme`, the page
  // background and the scrollbar follow the theme too.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      colors: COLORS,
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
