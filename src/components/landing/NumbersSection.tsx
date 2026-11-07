import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { THEME } from "../../constants/theme";
import { NUMBERS_STATS } from "../../constants/mockData";

export default function NumbersSection() {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {NUMBERS_STATS.map((stat, index) => (
          <View key={index} style={styles.statBox}>
            <Text style={styles.statNumber}>{stat.number}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statSubtext}>{stat.subtext}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: THEME.canvasLight,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  statBox: {
    width: "48%",
    backgroundColor: THEME.white,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    shadowColor: THEME.inkDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "900",
    color: THEME.brandPink,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.inkDark,
    marginTop: 4,
    marginBottom: 4,
  },
  statSubtext: {
    fontSize: 11,
    lineHeight: 15,
    color: THEME.textSecondary,
  },
});

