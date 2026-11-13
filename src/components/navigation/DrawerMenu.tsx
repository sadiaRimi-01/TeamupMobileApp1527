import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  StatusBar,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { THEME } from "../../constants/theme";
import TeamUpLogo from "../common/TeamUpLogo";
import Button from "../common/Button";
import { authStore, AuthUser } from "../../services/authStore";

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

  const [user, setUser] = useState<AuthUser | null>(authStore.getUser());
  const [isAuth, setIsAuth] = useState<boolean>(authStore.isAuthenticated());

  useEffect(() => {
    setUser(authStore.getUser());
    setIsAuth(authStore.isAuthenticated());

    const unsub = authStore.subscribe(() => {
      setUser(authStore.getUser());
      setIsAuth(authStore.isAuthenticated());
    });
    return unsub;
  }, [visible]);

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

  // Private routes visible only when authenticated
  const privateScreens = [
    { path: "/projects", label: "Explore Projects", icon: "briefcase-outline" as const, badge: "Live" },
    { path: "/teams", label: "Find Teammates", icon: "people-circle-outline" as const, badge: "Smart Match" },
    { path: "/my-projects", label: "My Projects", icon: "layers-outline" as const, badge: "Running" },
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

  const handleSignOut = () => {
    authStore.clearSession();
    setUser(null);
    setIsAuth(false);
    Alert.alert("Signed Out", "You have signed out of your session.", [
      { text: "OK", onPress: () => router.replace("/") },
    ]);
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
          {/* Top Auth Section */}
          {isAuth && user ? (
            <View style={styles.userProfileCard}>
              <View style={styles.userProfileHeader}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {user.avatarInitials || user.name.substring(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userRole}>{user.role || "Team Member"}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.signOutBtn}
                onPress={handleSignOut}
              >
                <Ionicons name="log-out-outline" size={16} color="#EF4444" />
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.authBox}>
              <Text style={styles.authTitle}>Start Collaborating</Text>
              <Text style={styles.authSubtitle}>
                Sign in or create an account to unlock Explore Projects, Teammates, My Projects & Chat.
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
                    title="Register"
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
          )}

          {/* Private App Screens - Visible ONLY when logged in */}
          {isAuth ? (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeader}>COLLABORATION MODULES</Text>
                <View style={styles.unlockedBadge}>
                  <Ionicons name="checkmark-circle" size={12} color={THEME.successGreen} />
                  <Text style={styles.unlockedText}>Unlocked</Text>
                </View>
              </View>

              {privateScreens.map((item) => (
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
          ) : (
            <View style={styles.lockedSection}>
              <View style={styles.lockedHeader}>
                <Ionicons name="lock-closed" size={18} color={THEME.primary} />
                <Text style={styles.lockedTitle}>Private Modules</Text>
              </View>
              <Text style={styles.lockedDesc}>
                Explore Projects, Find Teammates, My Projects & Team Chat are protected. Please Sign In or Register to view them in the side menu.
              </Text>
            </View>
          )}

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
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    marginBottom: 20,
  },
  authTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.inkDark,
    marginBottom: 4,
  },
  authSubtitle: {
    fontSize: 12,
    color: THEME.textSecondary,
    lineHeight: 18,
    marginBottom: 14,
  },
  authButtons: {
    flexDirection: "row",
    gap: 10,
  },
  userProfileCard: {
    backgroundColor: THEME.white,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    marginBottom: 20,
  },
  userProfileHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  userAvatarText: {
    fontSize: 16,
    fontWeight: "900",
    color: THEME.white,
  },
  userName: {
    fontSize: 16,
    fontWeight: "900",
    color: THEME.inkDark,
  },
  userRole: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.secondary,
  },
  userEmail: {
    fontSize: 11,
    color: THEME.textMuted,
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FEE2E2",
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  signOutText: {
    color: "#EF4444",
    fontWeight: "800",
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "900",
    color: THEME.textMuted,
    letterSpacing: 0.8,
  },
  unlockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: THEME.pastelMint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  unlockedText: {
    fontSize: 10,
    fontWeight: "800",
    color: THEME.successGreen,
  },
  lockedSection: {
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    marginBottom: 24,
  },
  lockedHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  lockedTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.primary,
  },
  lockedDesc: {
    fontSize: 12,
    color: THEME.textMuted,
    lineHeight: 18,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: THEME.white,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    marginBottom: 8,
  },
  menuRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  menuRowLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.inkDark,
  },
  menuBadge: {
    backgroundColor: THEME.pastelViolet,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  menuBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: THEME.accentViolet,
  },
  landingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  landingRowLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.textPrimary,
  },
  footerNote: {
    alignItems: "center",
    marginTop: 10,
  },
  footerNoteText: {
    fontSize: 11,
    fontWeight: "600",
    color: THEME.textMuted,
  },
});
