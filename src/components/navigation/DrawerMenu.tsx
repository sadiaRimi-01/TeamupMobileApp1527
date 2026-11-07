import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { THEME } from "../../constants/theme";
import TeamUpLogo from "../common/TeamUpLogo";
import Button from "../common/Button";

interface DrawerMenuProps {
  visible: boolean;
  onClose: () => void;
  onScrollToSection?: (sectionId: string) => void;
}

export default function DrawerMenu({
  visible,
  onClose,
  onScrollToSection,
}: DrawerMenuProps) {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight || 28) : 0
  );

  const landingLinks = [
    { id: "hero", label: "Overview", icon: "home-outline" as const },
    { id: "problem", label: "The Problem", icon: "alert-circle-outline" as const },
    { id: "how-it-works", label: "How It Works", icon: "layers-outline" as const },
    { id: "demo", label: "Smart Match Engine", icon: "sparkles-outline" as const },
    { id: "features", label: "Core Features", icon: "grid-outline" as const },
    { id: "audience", label: "Who It's For", icon: "people-outline" as const },
    { id: "compare", label: "Compare vs Old Way", icon: "git-compare-outline" as const },
    { id: "faq", label: "FAQ", icon: "help-circle-outline" as const },
  ];

  const appScreens = [
    { path: "/projects", label: "Explore Projects", icon: "briefcase-outline" as const, badge: "Live" },
    { path: "/teams", label: "Find Teammates", icon: "people-circle-outline" as const, badge: "Smart Match" },
    { path: "/tasks", label: "Task Board (Kanban)", icon: "checkbox-outline" as const },
    { path: "/chat", label: "Team Chat", icon: "chatbubbles-outline" as const },
    { path: "/profile", label: "My Profile & Reviews", icon: "person-outline" as const },
  ];

  const handleNavClick = (sectionId: string) => {
    onClose();
    if (onScrollToSection) {
      setTimeout(() => onScrollToSection(sectionId), 250);
    }
  };

  const handleRouteClick = (path: string) => {
    onClose();
    setTimeout(() => {
      router.push(path as any);
    }, 200);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={[styles.header, { paddingTop: topPadding + 10 }]}>
          <TeamUpLogo size={32} />
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={24} color={THEME.inkDark} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Quick Actions */}
          <View style={styles.authBox}>
            <Text style={styles.authTitle}>Start Collaborating</Text>
            <Text style={styles.authSubtitle}>
              Connect with skilled teammates and build your portfolio.
            </Text>
            <View style={styles.authButtons}>
              <View style={{ flex: 1 }}>
                <Button
                  title="Sign In"
                  variant="secondary"
                  size="md"
                  onPress={() => {
                    onClose();
                    router.push("/login");
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Button
                  title="Register Free"
                  variant="primary"
                  size="md"
                  onPress={() => {
                    onClose();
                    router.push("/register");
                  }}
                />
              </View>
            </View>
          </View>

          {/* Core App Screens */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>APP MODULES</Text>
            {appScreens.map((item) => (
              <TouchableOpacity
                key={item.path}
                style={styles.menuRow}
                onPress={() => handleRouteClick(item.path)}
              >
                <View style={styles.menuRowLeft}>
                  <View style={styles.iconCircle}>
                    <Ionicons name={item.icon} size={18} color={THEME.brandPink} />
                  </View>
                  <Text style={styles.menuRowLabel}>{item.label}</Text>
                </View>

                {item.badge ? (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{item.badge}</Text>
                  </View>
                ) : (
                  <Ionicons name="chevron-forward" size={18} color={THEME.textMuted} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Landing Sections */}
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>LANDING NAVIGATION</Text>
            {landingLinks.map((link) => (
              <TouchableOpacity
                key={link.id}
                style={styles.landingRow}
                onPress={() => handleNavClick(link.id)}
              >
                <Ionicons name={link.icon} size={18} color={THEME.textSecondary} />
                <Text style={styles.landingRowLabel}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer note */}
          <View style={styles.footerNote}>
            <Text style={styles.footerNoteText}>
              TeamUp Mobile v1.0.0 · Full Stack Platform
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.canvasLight,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
    backgroundColor: THEME.white,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: THEME.canvasLight,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  authBox: {
    backgroundColor: THEME.white,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    marginBottom: 24,
  },
  authTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: THEME.inkDark,
  },
  authSubtitle: {
    fontSize: 13,
    color: THEME.textSecondary,
    marginTop: 4,
    marginBottom: 16,
    lineHeight: 18,
  },
  authButtons: {
    flexDirection: "row",
    gap: 12,
  },
  section: {
    marginBottom: 26,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "900",
    color: THEME.textMuted,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: THEME.white,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: THEME.cardBorderSubtle,
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: THEME.pastelPink,
    justifyContent: "center",
    alignItems: "center",
  },
  menuRowLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: THEME.inkDark,
  },
  menuBadge: {
    backgroundColor: THEME.pastelViolet,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  menuBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: THEME.accentViolet,
  },
  landingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(13, 12, 34, 0.04)",
  },
  landingRowLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.textSecondary,
  },
  footerNote: {
    alignItems: "center",
    marginTop: 10,
  },
  footerNoteText: {
    fontSize: 12,
    color: THEME.textMuted,
  },
});

