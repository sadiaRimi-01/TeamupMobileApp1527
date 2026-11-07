import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "dark" | "ghost" | "warm";
  size?: "sm" | "md" | "lg";
  iconName?: keyof typeof Ionicons.glyphMap;
  iconPosition?: "left" | "right";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  iconName,
  iconPosition = "right",
  loading = false,
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          container: styles.secondaryContainer,
          text: styles.secondaryText,
          iconColor: THEME.textPrimary,
        };
      case "dark":
        return {
          container: styles.darkContainer,
          text: styles.darkText,
          iconColor: THEME.white,
        };
      case "ghost":
        return {
          container: styles.ghostContainer,
          text: styles.ghostText,
          iconColor: THEME.textSecondary,
        };
      case "warm":
        return {
          container: styles.warmContainer,
          text: styles.warmText,
          iconColor: THEME.white,
        };
      case "primary":
      default:
        return {
          container: styles.primaryContainer,
          text: styles.primaryText,
          iconColor: THEME.white,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return {
          container: styles.sizeSm,
          text: styles.textSizeSm,
          iconSize: 15,
        };
      case "lg":
        return {
          container: styles.sizeLg,
          text: styles.textSizeLg,
          iconSize: 20,
        };
      case "md":
      default:
        return {
          container: styles.sizeMd,
          text: styles.textSizeMd,
          iconSize: 18,
        };
    }
  };

  const v = getVariantStyles();
  const s = getSizeStyles();

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.base,
        v.container,
        s.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.iconColor} size="small" />
      ) : (
        <View style={styles.content}>
          {iconName && iconPosition === "left" && (
            <Ionicons
              name={iconName}
              size={s.iconSize}
              color={v.iconColor}
              style={{ marginRight: 6 }}
            />
          )}

          <Text style={[styles.baseText, v.text, s.text]}>{title}</Text>

          {iconName && iconPosition === "right" && (
            <Ionicons
              name={iconName}
              size={s.iconSize}
              color={v.iconColor}
              style={{ marginLeft: 6 }}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.55,
  },
  baseText: {
    fontWeight: "800",
  },

  // Variants
  primaryContainer: {
    backgroundColor: THEME.brandPink,
    shadowColor: THEME.brandPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryText: {
    color: THEME.white,
  },

  secondaryContainer: {
    backgroundColor: THEME.white,
    borderWidth: 1.2,
    borderColor: THEME.cardBorder,
    shadowColor: THEME.inkDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  secondaryText: {
    color: THEME.textPrimary,
  },

  darkContainer: {
    backgroundColor: THEME.inkDark,
    shadowColor: THEME.inkDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  darkText: {
    color: THEME.white,
  },

  ghostContainer: {
    backgroundColor: "transparent",
  },
  ghostText: {
    color: THEME.textSecondary,
  },

  warmContainer: {
    backgroundColor: THEME.highlightWarm,
    shadowColor: THEME.highlightWarm,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
  warmText: {
    color: THEME.white,
  },

  // Sizes
  sizeSm: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  textSizeSm: {
    fontSize: 12,
  },

  sizeMd: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  textSizeMd: {
    fontSize: 14,
  },

  sizeLg: {
    paddingHorizontal: 26,
    paddingVertical: 16,
  },
  textSizeLg: {
    fontSize: 16,
  },
});

