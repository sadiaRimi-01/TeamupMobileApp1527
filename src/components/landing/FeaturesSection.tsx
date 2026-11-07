import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";
import Badge from "../common/Badge";
import { FEATURES_LIST } from "../../constants/mockData";

export default function FeaturesSection() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Badge label="FEATURES" variant="mint" />
        <Text style={styles.title}>
          Everything you need to ship projects together
        </Text>
        <Text style={styles.subtitle}>
          Engineered for full-lifecycle student and developer collaboration.
        </Text>
      </View>

      <View style={styles.grid}>
        {FEATURES_LIST.map((feat) => {
          const isDark = feat.isDarkCard;

          return (
            <View
              key={feat.id}
              style={[
                styles.featureCard,
                {
                  backgroundColor: feat.bgTint,
                  borderColor: isDark ? "rgba(255,255,255,0.12)" : THEME.cardBorder,
                },
                isDark && styles.darkCardShadow,
              ]}
            >
              <View style={styles.cardTopRow}>
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: isDark
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(255,255,255,0.85)",
                    },
                  ]}
                >
                  <Ionicons
                    name={feat.icon as any}
                    size={22}
                    color={feat.accentColor}
                  />
                </View>

                {feat.badge && (
                  <View
                    style={[
                      styles.cardBadge,
                      {
                        backgroundColor: isDark
                          ? "rgba(255,255,255,0.15)"
                          : "rgba(255,255,255,0.9)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.cardBadgeText,
                        { color: feat.accentColor },
                      ]}
                    >
                      {feat.badge}
                    </Text>
                  </View>
                )}
              </View>

              <Text
                style={[
                  styles.cardTitle,
                  { color: isDark ? THEME.white : THEME.inkDark },
                ]}
              >
                {feat.title}
              </Text>

              <Text
                style={[
                  styles.cardDesc,
                  {
                    color: isDark
                      ? "rgba(255,255,255,0.78)"
                      : THEME.textSecondary,
                  },
                ]}
              >
                {feat.desc}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: THEME.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: THEME.cardBorder,
  },
  header: {
    alignItems: "flex-start",
    marginBottom: 26,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: THEME.inkDark,
    lineHeight: 34,
    marginTop: 12,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: THEME.textSecondary,
    marginTop: 8,
  },
  grid: {
    gap: 16,
  },
  featureCard: {
    padding: 22,
    borderRadius: 22,
    borderWidth: 1,
    shadowColor: THEME.inkDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  darkCardShadow: {
    shadowColor: THEME.inkDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 5,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: THEME.inkDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  cardBadgeText: {
    fontSize: 11,
    fontWeight: "800",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 21,
  },
});

