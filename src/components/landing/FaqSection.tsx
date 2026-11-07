import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";
import Badge from "../common/Badge";
import { FAQ_ITEMS } from "../../constants/mockData";

export default function FaqSection() {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    faq1: true,
  });

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Badge label="FAQ" variant="cyan" />
        <Text style={styles.title}>Frequently Asked Questions</Text>
        <Text style={styles.subtitle}>
          Everything you need to know about getting started on TeamUp.
        </Text>
      </View>

      <View style={styles.accordionWrap}>
        {FAQ_ITEMS.map((faq) => {
          const isOpen = !!openIds[faq.id];

          return (
            <View key={faq.id} style={styles.faqCard}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.faqHeader}
                onPress={() => toggleFaq(faq.id)}
              >
                <Text style={styles.questionText}>{faq.question}</Text>
                <View
                  style={[
                    styles.chevronWrap,
                    isOpen && { backgroundColor: THEME.pastelPink },
                  ]}
                >
                  <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={isOpen ? THEME.brandPink : THEME.textSecondary}
                  />
                </View>
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.answerBox}>
                  <Text style={styles.answerText}>{faq.answer}</Text>
                </View>
              )}
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
  accordionWrap: {
    gap: 12,
  },
  faqCard: {
    backgroundColor: THEME.canvasLight,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: THEME.cardBorderSubtle,
    overflow: "hidden",
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
    color: THEME.inkDark,
    paddingRight: 10,
    lineHeight: 20,
  },
  chevronWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(13, 12, 34, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  answerBox: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 2,
    borderTopWidth: 1,
    borderTopColor: "rgba(13, 12, 34, 0.04)",
  },
  answerText: {
    fontSize: 13,
    lineHeight: 21,
    color: THEME.textSecondary,
  },
});

