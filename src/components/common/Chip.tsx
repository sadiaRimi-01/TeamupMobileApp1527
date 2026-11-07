import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { THEME } from "../../constants/theme";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  size?: "sm" | "md";
}

export default function Chip({
  label,
  selected = false,
  onPress,
  size = "md",
}: ChipProps) {
  const isSm = size === "sm";

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={!onPress}
      style={[
        styles.chip,
        isSm ? styles.chipSm : styles.chipMd,
        selected ? styles.selectedChip : styles.unselectedChip,
      ]}
    >
      <Text
        style={[
          styles.text,
          isSm ? styles.textSm : styles.textMd,
          selected ? styles.selectedText : styles.unselectedText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  chipMd: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipSm: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  unselectedChip: {
    backgroundColor: THEME.white,
    borderWidth: 1.2,
    borderColor: THEME.cardBorder,
  },
  selectedChip: {
    backgroundColor: THEME.brandPink,
    borderWidth: 1.2,
    borderColor: THEME.brandPink,
    shadowColor: THEME.brandPink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 3,
  },
  text: {
    fontWeight: "700",
  },
  textMd: {
    fontSize: 13,
  },
  textSm: {
    fontSize: 11,
  },
  unselectedText: {
    color: THEME.textSecondary,
  },
  selectedText: {
    color: THEME.white,
  },
});

