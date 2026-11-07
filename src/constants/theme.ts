import { Platform } from "react-native";

export const THEME = {
  // Java TeamUp Brand Palette (Dribbble-inspired light-first design tokens)
  brandPink: "#EA4C89",
  brandPinkHover: "#F06292",
  brandPinkDark: "#D23775",
  inkDark: "#0D0C22",
  canvasLight: "#F8F7F4",

  // Pastel Card Tints
  pastelViolet: "#F3F0FF",
  pastelMint: "#EBFBF5",
  pastelSunny: "#FFFAEC",
  pastelSky: "#F0F8FF",
  pastelPink: "#FFF0F5",

  // Accent saturated colors
  accentViolet: "#7C5CFF",
  accentCyan: "#22D3EE",
  highlightWarm: "#FF8A5B",
  accentMint: "#3DDBB0",
  accentSunny: "#FFD166",
  accentSky: "#6EC1FF",
  successGreen: "#10B981",
  errorRed: "#EF4444",

  // UI Neutrals
  white: "#FFFFFF",
  cardBorder: "rgba(13, 12, 34, 0.08)",
  cardBorderSubtle: "rgba(13, 12, 34, 0.05)",
  borderDark: "rgba(255, 255, 255, 0.12)",
  textPrimary: "#0D0C22",
  textSecondary: "#565566",
  textMuted: "#9E9EAE",
  textLight: "#FFFFFF",
  textLightMuted: "rgba(255, 255, 255, 0.72)",

  // Shadow tokens
  shadowSm: {
    shadowColor: "#0D0C22",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  shadowMd: {
    shadowColor: "#0D0C22",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  shadowPink: {
    shadowColor: "#EA4C89",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  },
};

export const COLORS = {
  primary: THEME.brandPink,
  primaryDark: THEME.brandPinkDark,
  secondary: THEME.accentViolet,
  accent: THEME.accentCyan,

  background: THEME.canvasLight,
  white: THEME.white,

  text: THEME.textPrimary,
  textSecondary: THEME.textSecondary,
  textMuted: THEME.textMuted,

  border: "rgba(13, 12, 34, 0.08)",

  success: THEME.successGreen,
  warning: THEME.accentSunny,
  danger: THEME.errorRed,

  card: THEME.white,

  // Java TeamUp palette exposed
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
    backgroundElement: "#1E1E34",
    backgroundSelected: "#2A2A44",
    textSecondary: "#A5A5BA",
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
