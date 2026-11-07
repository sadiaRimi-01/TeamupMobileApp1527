import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";
import Badge from "../common/Badge";
import { COMPARISON_ROWS } from "../../constants/mockData";

export default function CompareSection() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Badge label="THE ADVANTAGE" variant="pink" />
        <Text style={styles.title}>TeamUp vs The Old Way</Text>
        <Text style={styles.subtitle}>
          Compare why structured skill-matching outperforms noisy messaging
          groups and scattered boards.
        </Text>
      </View>

      <View style={styles.tableCard}>
        {/* Table Head */}
        <View style={styles.tableHead}>
          <Text style={[styles.headColText, { flex: 1.4 }]}>FEATURE</Text>
          <View style={styles.tuColHead}>
            <Text style={styles.tuColText}>TeamUp</Text>
          </View>
          <Text style={[styles.headColText, { flex: 0.9, textAlign: "center" }]}>
            Old Way
          </Text>
        </View>

        {/* Rows */}
        {COMPARISON_ROWS.map((row, index) => {
          const isLast = index === COMPARISON_ROWS.length - 1;

          return (
            <View
              key={row.feature}
              style={[styles.tableRow, isLast && { borderBottomWidth: 0 }]}
            >
              <Text style={styles.featureName}>{row.feature}</Text>

              {/* TeamUp Column */}
              <View style={styles.tuCol}>
                <View style={styles.checkCircle}>
                  <Ionicons name="checkmark" size={14} color={THEME.white} />
                </View>
              </View>

              {/* Old Way Column */}
              <View style={styles.oldCol}>
                <View style={styles.crossCircle}>
                  <Ionicons name="close" size={14} color={THEME.textMuted} />
                </View>
              </View>
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
    marginBottom: 24,
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
  tableCard: {
    backgroundColor: THEME.canvasLight,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    overflow: "hidden",
  },
  tableHead: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(13, 12, 34, 0.04)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
  },
  headColText: {
    fontSize: 11,
    fontWeight: "900",
    color: THEME.textMuted,
    letterSpacing: 0.8,
  },
  tuColHead: {
    flex: 1,
    alignItems: "center",
  },
  tuColText: {
    fontSize: 12,
    fontWeight: "900",
    color: THEME.brandPink,
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorderSubtle,
  },
  featureName: {
    flex: 1.4,
    fontSize: 13,
    fontWeight: "700",
    color: THEME.inkDark,
    lineHeight: 18,
  },
  tuCol: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: THEME.brandPink,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: THEME.brandPink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  oldCol: {
    flex: 0.9,
    alignItems: "center",
    justifyContent: "center",
  },
  crossCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(13, 12, 34, 0.06)",
    justifyContent: "center",
    alignItems: "center",
  },
});

