import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";
import Badge from "../common/Badge";
import { PROBLEM_CARDS } from "../../constants/mockData";

export default function ProblemSection() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Badge label="THE PROBLEM" variant="violet" />
        <Text style={styles.title}>Why traditional team formation fails</Text>
        <Text style={styles.subtitle}>
          Students, developers, and designers lose days trapped in unorganized
          messaging groups, random campus posts, and ghosted DMs.
        </Text>
      </View>

      <View style={styles.cardsList}>
        {PROBLEM_CARDS.map((card) => (
          <View key={card.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={[styles.numBadge, { backgroundColor: card.accent + "18" }]}>
                <Text style={[styles.numText, { color: card.accent }]}>
                  {card.num}
                </Text>
              </View>

              <View style={styles.tagWrap}>
                <Text style={[styles.tagText, { color: card.accent }]}>
                  {card.tag}
                </Text>
              </View>

              <View style={[styles.iconWrap, { backgroundColor: card.accent + "15" }]}>
                <Ionicons
                  name={card.icon as any}
                  size={18}
                  color={card.accent}
                />
              </View>
            </View>

            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardDesc}>{card.desc}</Text>

            <View style={styles.metricBox}>
              <Text style={[styles.metricNumber, { color: card.accent }]}>
                {card.metric}
              </Text>
              <Text style={styles.metricLabel}>{card.metricLabel}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: THEME.canvasLight,
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
  cardsList: {
    gap: 16,
  },
  card: {
    backgroundColor: THEME.white,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    shadowColor: THEME.inkDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  numBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  numText: {
    fontSize: 13,
    fontWeight: "900",
  },
  tagWrap: {
    flex: 1,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: THEME.inkDark,
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    lineHeight: 20,
    color: THEME.textSecondary,
    marginBottom: 16,
  },
  metricBox: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 8,
    backgroundColor: THEME.canvasLight,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  metricNumber: {
    fontSize: 16,
    fontWeight: "900",
  },
  metricLabel: {
    fontSize: 12,
    color: THEME.textSecondary,
    fontWeight: "600",
  },
});

