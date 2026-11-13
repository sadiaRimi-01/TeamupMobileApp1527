import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { THEME } from "../src/constants/theme";
import { authStore, AuthUser } from "../src/services/authStore";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight || 28) : 0
  );

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(authStore.getUser());
  const [activeTab, setActiveTab] = useState<"skills" | "projects" | "reviews">("skills");

  useEffect(() => {
    setCurrentUser(authStore.getUser());
    const unsub = authStore.subscribe(() => {
      setCurrentUser(authStore.getUser());
    });
    return unsub;
  }, []);

  const handleSignOut = () => {
    authStore.clearSession();
    Alert.alert("Signed Out", "You have signed out of your session.", [
      { text: "OK", onPress: () => router.push("/login") },
    ]);
  };

  const reviews = [
    {
      id: "r1",
      reviewer: "Sarah Lin",
      role: "Backend Lead · Smart Campus App",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Outstanding frontend architecture! Built clean responsive screens and integrated APIs without any bottlenecks. Truly a pleasure to work with.",
      categories: { Communication: 5, Technical: 5, Responsibility: 5 },
    },
    {
      id: "r2",
      reviewer: "David Chen",
      role: "UI/UX Lead · HealthCare App",
      rating: 4.8,
      date: "1 month ago",
      comment:
        "Great attention to detail and proactive communication. Always kept team milestones on track.",
      categories: { Communication: 5, Technical: 4.8, Responsibility: 4.9 },
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header with Safe Area Inset */}
      <View style={[styles.header, { paddingTop: topPadding + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={THEME.inkDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Professional Profile</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => Alert.alert("Edit Profile", "Update your skills, bio and portfolio links.")}
        >
          <Ionicons name="create-outline" size={20} color={THEME.inkDark} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card Banner */}
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {currentUser?.avatarInitials || "ME"}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{currentUser?.name || "Rafi Al-Mamun"}</Text>
                <View style={styles.badge}>
                  <Ionicons name="shield-checkmark" size={12} color={THEME.brandPink} />
                  <Text style={styles.badgeText}>
                    {currentUser ? currentUser.role : "Pro Builder"}
                  </Text>
                </View>
              </View>

              <Text style={styles.role}>
                {currentUser
                  ? `${currentUser.email}`
                  : "Full-Stack Developer & UI Enthusiast"}
              </Text>
              <Text style={styles.university}>
                {currentUser?.university || "CS Undergraduate · BUET"}
              </Text>
            </View>
          </View>

          {/* Overall Rating Strip */}
          <View style={styles.ratingStrip}>
            <View style={styles.ratingCol}>
              <View style={styles.starRow}>
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text style={styles.ratingNumber}>
                  {currentUser?.rating || 4.9}
                </Text>
              </View>
              <Text style={styles.ratingSub}>Overall Rating</Text>
            </View>

            <View style={styles.vDivider} />

            <View style={styles.ratingCol}>
              <Text style={styles.statBig}>
                {currentUser?.reviewCount || 14}
              </Text>
              <Text style={styles.ratingSub}>Completed Projects</Text>
            </View>

            <View style={styles.vDivider} />

            <View style={styles.ratingCol}>
              <Text style={styles.statBig}>100%</Text>
              <Text style={styles.ratingSub}>On-Time Completion</Text>
            </View>
          </View>

          {/* Auth Action Strip */}
          <View style={{ marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: THEME.cardBorderSubtle }}>
            {currentUser ? (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#FEE2E2",
                  paddingVertical: 9,
                  borderRadius: 10,
                  gap: 6,
                }}
                onPress={handleSignOut}
              >
                <Ionicons name="log-out-outline" size={16} color="#EF4444" />
                <Text style={{ color: "#EF4444", fontWeight: "800", fontSize: 13 }}>
                  Sign Out ({currentUser.name})
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: THEME.brandPink,
                  paddingVertical: 9,
                  borderRadius: 10,
                  gap: 6,
                }}
                onPress={() => router.push("/login")}
              >
                <Ionicons name="log-in-outline" size={16} color={THEME.white} />
                <Text style={{ color: THEME.white, fontWeight: "800", fontSize: 13 }}>
                  Sign In / Register
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Tab switch */}
        <View style={styles.tabsRow}>
          {[
            { key: "skills", label: "Skills & Tech" },
            { key: "projects", label: "Projects (3)" },
            { key: "reviews", label: "Peer Reviews (14)" },
          ].map((tab) => {
            const isSel = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabBtn, isSel && styles.tabBtnActive]}
                onPress={() => setActiveTab(tab.key as any)}
              >
                <Text style={[styles.tabBtnText, isSel && styles.tabBtnTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Tab Content: Skills */}
        {activeTab === "skills" && (
          <View style={styles.tabContentCard}>
            <Text style={styles.cardSectionTitle}>Verified Technical Skills</Text>
            <View style={styles.skillsGrid}>
              {[
                { name: "Java Full-Stack", verified: true, level: "Expert" },
                { name: "React Native", verified: true, level: "Advanced" },
                { name: "Spring Boot", verified: true, level: "Expert" },
                { name: "Node.js & Express", verified: true, level: "Advanced" },
                { name: "MongoDB & PostgreSQL", verified: true, level: "Advanced" },
                { name: "UI/UX & Figma", verified: true, level: "Intermediate" },
              ].map((s) => (
                <View key={s.name} style={styles.skillItem}>
                  <View style={styles.skillHeader}>
                    <Text style={styles.skillName}>{s.name}</Text>
                    <Ionicons name="checkmark-circle" size={14} color={THEME.successGreen} />
                  </View>
                  <Text style={styles.skillLevel}>{s.level}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tab Content: Reviews */}
        {activeTab === "reviews" && (
          <View style={styles.reviewsList}>
            {reviews.map((rev) => (
              <View key={rev.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <View>
                    <Text style={styles.reviewerName}>{rev.reviewer}</Text>
                    <Text style={styles.reviewerRole}>{rev.role}</Text>
                  </View>

                  <View style={styles.starBox}>
                    <Ionicons name="star" size={13} color="#F59E0B" />
                    <Text style={styles.starScore}>{rev.rating}</Text>
                  </View>
                </View>

                <Text style={styles.reviewComment}>{rev.comment}</Text>

                <View style={styles.categoryScoresRow}>
                  {Object.entries(rev.categories).map(([k, v]) => (
                    <View key={k} style={styles.categoryScoreItem}>
                      <Text style={styles.categoryKey}>{k}:</Text>
                      <Text style={styles.categoryVal}>{v}★</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Tab Content: Projects */}
        {activeTab === "projects" && (
          <View style={styles.projectsTabContent}>
            {[
              {
                title: "TeamUp Android & Web Platform",
                role: "Lead Full-Stack Architect",
                status: "Active",
                desc: "Skill-based team formation engine with real-time chat and Kanban tasks.",
              },
              {
                title: "SmartCity IoT Simulator",
                role: "System Designer",
                status: "Completed",
                desc: "Distributed smart grid monitoring app with real-time sensor analytics.",
              },
            ].map((proj) => (
              <View key={proj.title} style={styles.projCard}>
                <View style={styles.projHeader}>
                  <Text style={styles.projTitle}>{proj.title}</Text>
                  <View style={styles.projStatusBadge}>
                    <Text style={styles.projStatusText}>{proj.status}</Text>
                  </View>
                </View>
                <Text style={styles.projRole}>{proj.role}</Text>
                <Text style={styles.projDesc}>{proj.desc}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: THEME.white,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.canvasLight,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: THEME.inkDark,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },
  profileCard: {
    backgroundColor: THEME.white,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    shadowColor: THEME.inkDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: THEME.brandPink,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: THEME.brandPink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "900",
    color: THEME.white,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "900",
    color: THEME.inkDark,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: THEME.pastelPink,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: THEME.brandPink,
  },
  role: {
    fontSize: 13,
    color: THEME.textSecondary,
    fontWeight: "600",
    marginTop: 2,
  },
  university: {
    fontSize: 12,
    color: THEME.textMuted,
    marginTop: 2,
  },
  ratingStrip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.canvasLight,
    paddingVertical: 14,
    borderRadius: 16,
    marginBottom: 14,
  },
  ratingCol: {
    flex: 1,
    alignItems: "center",
  },
  vDivider: {
    width: 1,
    height: 28,
    backgroundColor: THEME.cardBorder,
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingNumber: {
    fontSize: 18,
    fontWeight: "900",
    color: THEME.inkDark,
  },
  statBig: {
    fontSize: 18,
    fontWeight: "900",
    color: THEME.brandPink,
  },
  ratingSub: {
    fontSize: 10,
    color: THEME.textSecondary,
    fontWeight: "700",
    marginTop: 2,
  },
  socialRow: {
    flexDirection: "row",
    gap: 10,
  },
  socialBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: THEME.canvasLight,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  socialBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.textPrimary,
  },
  tabsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  tabBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: THEME.white,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  tabBtnActive: {
    backgroundColor: THEME.brandPink,
    borderColor: THEME.brandPink,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.textSecondary,
  },
  tabBtnTextActive: {
    color: THEME.white,
  },
  tabContentCard: {
    backgroundColor: THEME.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  cardSectionTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: THEME.inkDark,
    marginBottom: 12,
  },
  skillsGrid: {
    gap: 10,
  },
  skillItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: THEME.canvasLight,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  skillHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  skillName: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.inkDark,
  },
  skillLevel: {
    fontSize: 11,
    color: THEME.brandPink,
    fontWeight: "800",
  },
  reviewsList: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: THEME.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "800",
    color: THEME.inkDark,
  },
  reviewerRole: {
    fontSize: 11,
    color: THEME.textSecondary,
  },
  starBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  starScore: {
    fontSize: 11,
    fontWeight: "900",
    color: "#B45309",
  },
  reviewComment: {
    fontSize: 13,
    lineHeight: 19,
    color: THEME.textSecondary,
    marginBottom: 10,
  },
  categoryScoresRow: {
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorderSubtle,
    paddingTop: 8,
  },
  categoryScoreItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  categoryKey: {
    fontSize: 10,
    color: THEME.textMuted,
    fontWeight: "600",
  },
  categoryVal: {
    fontSize: 10,
    color: THEME.brandPink,
    fontWeight: "800",
  },
  projectsTabContent: {
    gap: 12,
  },
  projCard: {
    backgroundColor: THEME.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  projHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  projTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.inkDark,
  },
  projStatusBadge: {
    backgroundColor: THEME.pastelMint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  projStatusText: {
    fontSize: 10,
    fontWeight: "800",
    color: THEME.successGreen,
  },
  projRole: {
    fontSize: 12,
    color: THEME.brandPink,
    fontWeight: "700",
    marginBottom: 6,
  },
  projDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: THEME.textSecondary,
  },
});
