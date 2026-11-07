import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";
import Badge from "../common/Badge";
import { HOW_IT_WORKS_STEPS } from "../../constants/mockData";

export default function HowItWorksSection() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Badge label="PROCESS" variant="cyan" />
        <Text style={styles.title}>How TeamUp works in 4 simple steps</Text>
        <Text style={styles.subtitle}>
          From profile setup to shipping real-world projects with verifiable
          reputation.
        </Text>
      </View>

      <View style={styles.stepsWrapper}>
        {HOW_IT_WORKS_STEPS.map((step, index) => {
          const isLast = index === HOW_IT_WORKS_STEPS.length - 1;

          return (
            <View key={step.num} style={styles.stepItemRow}>
              {/* Left Timeline Line and Circle */}
              <View style={styles.timelineCol}>
                <View
                  style={[
                    styles.stepCircle,
                    { backgroundColor: step.accent },
                  ]}
                >
                  <Text style={styles.stepCircleNum}>{step.num}</Text>
                </View>

                {!isLast && <View style={styles.timelineLine} />}
              </View>

              {/* Step Card */}
              <View style={styles.stepCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={[styles.stepLabel, { color: step.accent }]}>
                    {step.stepLabel}
                  </Text>
                  <Ionicons
                    name={step.icon as any}
                    size={18}
                    color={step.accent}
                  />
                </View>

                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDesc}>{step.desc}</Text>
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
    marginBottom: 28,
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
  stepsWrapper: {
    paddingLeft: 4,
  },
  stepItemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  timelineCol: {
    alignItems: "center",
    width: 38,
    marginRight: 14,
  },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: THEME.inkDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  stepCircleNum: {
    color: THEME.white,
    fontWeight: "900",
    fontSize: 14,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 50,
    backgroundColor: "rgba(13, 12, 34, 0.1)",
    marginVertical: 4,
  },
  stepCard: {
    flex: 1,
    backgroundColor: THEME.canvasLight,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: THEME.cardBorderSubtle,
    marginBottom: 20,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0.8,
  },
  stepTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: THEME.inkDark,
    marginBottom: 6,
  },
  stepDesc: {
    fontSize: 13,
    lineHeight: 20,
    color: THEME.textSecondary,
  },
});

