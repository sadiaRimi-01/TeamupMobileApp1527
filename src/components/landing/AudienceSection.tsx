import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../../constants/theme";
import Badge from "../common/Badge";
import { PERSONA_TABS } from "../../constants/mockData";

export default function AudienceSection() {
  const [activeTabId, setActiveTabId] = useState<string>("students");

  const activePersona =
    PERSONA_TABS.find((p) => p.id === activeTabId) || PERSONA_TABS[0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Badge label="COMMUNITY" variant="violet" />
        <Text style={styles.title}>Built for every kind of builder</Text>
        <Text style={styles.subtitle}>
          Whether you're forming a university capstone or launching an MVP pod.
        </Text>
      </View>

      {/* Tab Switcher */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsScroll}
      >
        {PERSONA_TABS.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.8}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => setActiveTabId(tab.id)}
            >
              <Text
                style={[styles.tabButtonText, isActive && styles.activeTabText]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Persona Showcase Card */}
      <View style={styles.personaCard}>
        <View style={styles.personaCardTop}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: activePersona.gradient[0] },
            ]}
          >
            <Text style={styles.avatarText}>{activePersona.avatarInitials}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.personaName}>{activePersona.name}</Text>
            <Text style={styles.personaRole}>{activePersona.persona}</Text>
          </View>

          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={14} color={THEME.brandPink} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </View>

        <View style={styles.benefitBox}>
          <Text style={styles.benefitLabel}>WHY TEAMUP WORKS FOR THEM:</Text>
          <Text style={styles.benefitText}>{activePersona.benefit}</Text>
        </View>

        <View style={styles.quoteBox}>
          <Ionicons
            name="chatbox-ellipses-outline"
            size={18}
            color={THEME.brandPink}
            style={{ marginBottom: 6 }}
          />
          <Text style={styles.quoteText}>{activePersona.quote}</Text>
        </View>

        <View style={styles.skillsFooter}>
          <Text style={styles.skillsFooterLabel}>Common Tech Stacks:</Text>
          <View style={styles.skillsWrap}>
            {activePersona.skills.map((s) => (
              <View key={s} style={styles.skillPill}>
                <Text style={styles.skillPillText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>
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
    marginBottom: 20,
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
  tabsScroll: {
    gap: 8,
    paddingBottom: 16,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: THEME.white,
    borderWidth: 1.2,
    borderColor: THEME.cardBorder,
  },
  activeTabButton: {
    backgroundColor: THEME.brandPink,
    borderColor: THEME.brandPink,
    shadowColor: THEME.brandPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.textSecondary,
  },
  activeTabText: {
    color: THEME.white,
  },
  personaCard: {
    backgroundColor: THEME.white,
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    shadowColor: THEME.inkDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  personaCardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: THEME.white,
    fontSize: 15,
    fontWeight: "900",
  },
  personaName: {
    fontSize: 17,
    fontWeight: "900",
    color: THEME.inkDark,
  },
  personaRole: {
    fontSize: 12,
    color: THEME.textSecondary,
    fontWeight: "600",
    marginTop: 1,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: THEME.pastelPink,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: "800",
    color: THEME.brandPink,
  },
  benefitBox: {
    backgroundColor: THEME.pastelViolet,
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
  },
  benefitLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: THEME.accentViolet,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  benefitText: {
    fontSize: 13,
    lineHeight: 19,
    color: THEME.inkDark,
    fontWeight: "600",
  },
  quoteBox: {
    borderLeftWidth: 3,
    borderLeftColor: THEME.brandPink,
    paddingLeft: 12,
    paddingVertical: 4,
    marginBottom: 16,
  },
  quoteText: {
    fontSize: 13,
    lineHeight: 20,
    fontStyle: "italic",
    color: THEME.textSecondary,
  },
  skillsFooter: {
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorder,
    paddingTop: 14,
  },
  skillsFooterLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: THEME.textMuted,
    marginBottom: 8,
  },
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillPill: {
    backgroundColor: THEME.canvasLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  skillPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.textPrimary,
  },
});
