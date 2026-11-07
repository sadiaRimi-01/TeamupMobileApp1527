import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";

interface BadgeProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: "pink" | "violet" | "cyan" | "mint" | "dark" | "outline";
  showRadar?: boolean;
}

export default function Badge({
  label,
  icon,
  variant = "pink",
  showRadar = false,
}: BadgeProps) {
  const getColors = () => {
    switch (variant) {
      case "violet":
        return { bg: THEME.pastelViolet, text: THEME.accentViolet, border: "rgba(124, 92, 255, 0.2)" };
      case "cyan":
        return { bg: THEME.pastelSky, text: "#0891B2", border: "rgba(34, 211, 238, 0.2)" };
      case "mint":
        return { bg: THEME.pastelMint, text: "#059669", border: "rgba(61, 219, 176, 0.2)" };
      case "dark":
        return { bg: "rgba(255,255,255,0.12)", text: THEME.white, border: "rgba(255,255,255,0.2)" };
      case "outline":
        return { bg: THEME.white, text: THEME.textPrimary, border: THEME.cardBorder };
      case "pink":
      default:
        return { bg: THEME.pastelPink, text: THEME.brandPink, border: "rgba(234, 76, 137, 0.2)" };
    }
  };

  const c = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: c.bg, borderColor: c.border }]}>
      {showRadar && (
        <View style={styles.radarWrapper}>
          <View style={styles.radarOuter} />
          <View style={styles.radarCore} />
        </View>
      )}

      {icon && !showRadar && (
        <Ionicons name={icon} size={13} color={c.text} style={{ marginRight: 4 }} />
      )}

      <Text style={[styles.label, { color: c.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  radarWrapper: {
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  radarOuter: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "rgba(234, 76, 137, 0.25)",
  },
  radarCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.brandPink,
  },
});

