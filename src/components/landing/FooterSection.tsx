import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { THEME } from "../../constants/theme";
import TeamUpLogo from "../common/TeamUpLogo";

interface FooterSectionProps {
  onScrollToSection?: (sectionId: string) => void;
}

export default function FooterSection({
  onScrollToSection,
}: FooterSectionProps) {
  const links = [
    { id: "hero", label: "Overview" },
    { id: "how-it-works", label: "How It Works" },
    { id: "demo", label: "Matching Engine" },
    { id: "features", label: "Features" },
    { id: "compare", label: "Comparison" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <TeamUpLogo size={36} isDarkTheme={true} />
        <Text style={styles.desc}>
          TeamUp connects students, developers, and designers by verified
          skills. Build stronger teams, manage project tasks, and ship
          confidently.
        </Text>
      </View>

      {/* Navigation Pills */}
      <View style={styles.linksGrid}>
        {links.map((link) => (
          <TouchableOpacity
            key={link.id}
            style={styles.linkItem}
            onPress={() => onScrollToSection && onScrollToSection(link.id)}
          >
            <Text style={styles.linkText}>{link.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tech Stack Badge */}
      <View style={styles.techStackCard}>
        <View style={styles.techStackHeader}>
          <Ionicons name="hardware-chip-outline" size={14} color={THEME.brandPink} />
          <Text style={styles.techStackTitle}>PROJECT ARCHITECTURE</Text>
        </View>
        <Text style={styles.techStackItems}>
          React Native · Node.js & Express · MongoDB · JWT Auth · FCM
        </Text>
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.copyright}>
          © 2026 TeamUp · All rights reserved.
        </Text>
        <View style={styles.socialIconsRow}>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-github" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-linkedin" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <Ionicons name="logo-discord" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME.inkDark,
    paddingVertical: 36,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  top: {
    marginBottom: 24,
  },
  desc: {
    fontSize: 13,
    lineHeight: 20,
    color: "rgba(255,255,255,0.65)",
    marginTop: 14,
  },
  linksGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingVertical: 18,
  },
  linkItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  linkText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },
  techStackCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    padding: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  techStackHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  techStackTitle: {
    fontSize: 10,
    fontWeight: "900",
    color: THEME.brandPink,
    letterSpacing: 1,
  },
  techStackItems: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
  },
  copyright: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
  },
  socialIconsRow: {
    flexDirection: "row",
    gap: 12,
  },
  socialIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
});

