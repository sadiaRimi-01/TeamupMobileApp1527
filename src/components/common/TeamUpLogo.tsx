import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";

interface TeamUpLogoProps {
  size?: number;
  showText?: boolean;
  isDarkTheme?: boolean;
  onPress?: () => void;
}

export default function TeamUpLogo({
  size = 36,
  showText = true,
  isDarkTheme = false,
  onPress,
}: TeamUpLogoProps) {
  const content = (
    <View style={styles.container}>
      <View
        style={[
          styles.badge,
          {
            width: size,
            height: size,
            borderRadius: Math.round(size * 0.35),
            backgroundColor: THEME.brandPink,
          },
        ]}
      >
        <Ionicons
          name="people"
          size={Math.round(size * 0.55)}
          color={THEME.white}
        />
      </View>

      {showText && (
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.brandText,
              {
                fontSize: Math.round(size * 0.58),
                color: isDarkTheme ? THEME.white : THEME.inkDark,
              },
            ]}
          >
            Team
            <Text style={{ color: THEME.brandPink }}>Up</Text>
          </Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    justifyContent: "center",
    alignItems: "center",
    shadowColor: THEME.brandPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandText: {
    fontWeight: "900",
    letterSpacing: -0.5,
  },
});

