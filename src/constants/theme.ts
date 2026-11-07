import { Platform } from "react-native";

export const THEME = {
  // Royal Blue + Soft Lavender Palette (User-Requested Theme)
  primary: "#312E81",        // Deep Royal Blue
  secondary: "#4F46E5",      // Vibrant Royal Indigo
  accent: "#A78BFA",         // Soft Lavender
  background: "#FAFAFF",     // Soft Lavender-White Canvas
  canvasLight: "#FAFAFF",
  inkDark: "#312E81",        // Deep Royal Blue for Surface, Dark Cards & Footers

  // Core brand aliases mapped to Royal Blue / Indigo
  brandPink: "#4F46E5",      // Primary Interactive Brand Color
  brandPinkHover: "#6366F1",
  brandPinkDark: "#312E81",

  // Soft Lavender & Pastel Card Tints
  pastelPink: "#F5F3FF",     // Soft Lavender Card Tint
  pastelViolet: "#EDE9FE",   // Light Lavender Tint
  pastelMint: "#EEF2FF",     // Soft Royal Ice Tint
  pastelSunny: "#FEF3C7",    // Soft Warm Amber Tint
  pastelSky: "#F0F9FF",      // Clean Sky Tint

  // Accent saturated colors
  accentViolet: "#4F46E5",   // Royal Indigo
  accentCyan: "#06B6D4",     // Cyan
  highlightWarm: "#F59E0B",  // Warm Amber
  accentMint: "#10B981",     // Emerald Mint
  accentSunny: "#F59E0B",
  accentSky: "#38BDF8",
  successGreen: "#10B981",
  errorRed: "#EF4444",

  // UI Neutrals
  white: "#FFFFFF",
  cardBorder: "rgba(49, 46, 129, 0.08)",
  cardBorderSubtle: "rgba(49, 46, 129, 0.05)",
  borderDark: "rgba(255, 255, 255, 0.14)",
  textPrimary: "#1E1B4B",     // Deep Midnight Indigo Text
  textSecondary: "#4338CA",   // Medium Royal Indigo Text
  textMuted: "#6B7280",      // Neutral Slate
  textLight: "#FFFFFF",
  textLightMuted: "rgba(255, 255, 255, 0.78)",

  // Shadow tokens with Royal Indigo glow
  shadowSm: {
    shadowColor: "#312E81",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  shadowMd: {
    shadowColor: "#312E81",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  shadowPink: {
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 14,
    elevation: 6,
  },
};

export const COLORS = {
  primary: THEME.primary,         // #312E81
  primaryDark: "#1E1B4B",
  secondary: THEME.secondary,     // #4F46E5
  accent: THEME.accent,           // #A78BFA
  background: THEME.background,   // #FAFAFF
  white: THEME.white,

  text: THEME.textPrimary,
  textSecondary: THEME.textSecondary,
  textMuted: THEME.textMuted,

  border: "rgba(49, 46, 129, 0.08)",

  success: THEME.successGreen,
  warning: THEME.highlightWarm,
  danger: THEME.errorRed,

  card: THEME.white,

  // Royal Blue + Soft Lavender tokens exposed
  brandPink: THEME.brandPink,
  inkDark: THEME.inkDark,
  canvasLight: THEME.canvasLight,
  pastelViolet: THEME.pastelViolet,
  pastelMint: THEME.pastelMint,
  pastelSunny: THEME.pastelSunny,
  pastelSky: THEME.pastelSky,
  pastelPink: THEME.pastelPink,
  accentViolet: THEME.accentViolet,
  accentCyan: THEME.accentCyan,
  highlightWarm: THEME.highlightWarm,
  accentMint: THEME.accentMint,
};

export const Colors = {
  light: {
    text: THEME.textPrimary,
    background: THEME.canvasLight,
    backgroundElement: THEME.pastelViolet,
    backgroundSelected: THEME.pastelPink,
    textSecondary: THEME.textSecondary,
  },
  dark: {
    text: "#FFFFFF",
    background: THEME.inkDark,
    backgroundElement: "#1E1B4B",
    backgroundSelected: "#2E1065",
    textSecondary: "#C7D2FE",
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "var(--font-display)",
    serif: "var(--font-serif)",
    rounded: "var(--font-rounded)",
    mono: "var(--font-mono)",
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
