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
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { THEME } from "../src/constants/theme";
import { authStore, AuthUser } from "../src/services/authStore";
import { ApiService } from "../src/services/api";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight || 28) : 0
  );

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(authStore.getUser());
  const [activeTab, setActiveTab] = useState<"skills" | "invitations" | "projects" | "reviews">("skills");
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loadingInvites, setLoadingInvites] = useState(false);

  // Edit Profile Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editUniversity, setEditUniversity] = useState("");
  const [editSkills, setEditSkills] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    setCurrentUser(authStore.getUser());
    const unsub = authStore.subscribe(() => {
      setCurrentUser(authStore.getUser());
    });
    return unsub;
  }, []);

  const fetchInvitations = async () => {
    const token = authStore.getToken();
    if (!token) return;
    setLoadingInvites(true);
    try {
      const res = await ApiService.getMyInvitations(token);
      if (res && res.success && Array.isArray(res.invitations)) {
        setInvitations(res.invitations.filter((i: any) => i.status === "Pending"));
      }
    } catch {
      // Fallback
    } finally {
      setLoadingInvites(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [currentUser]);

  const openEditModal = () => {
    if (currentUser) {
      setEditName(currentUser.name || "");
      setEditEmail(currentUser.email || "");
      setEditPassword("");
      setEditUniversity(currentUser.university || "BUET");
      setEditSkills(
        Array.isArray(currentUser.skills) ? currentUser.skills.join(", ") : ""
      );
    }
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim() || !editEmail.trim()) {
      Alert.alert("Missing Fields", "Name and email are required.");
      return;
    }

    setSavingProfile(true);
    try {
      const token = authStore.getToken();
      if (!token) {
        Alert.alert("Error", "Please sign in to update your profile.");
        return;
      }

      const skillsArray = editSkills.split(",").map((s) => s.trim()).filter(Boolean);

      const res = await ApiService.updateProfile(token, {
        name: editName.trim(),
        email: editEmail.trim(),
        password: editPassword.trim() || undefined,
        university: editUniversity.trim(),
        skills: skillsArray,
      });

      if (res && res.success && res.user) {
        authStore.setSession(token, {
          ...currentUser!,
          name: res.user.name,
          email: res.user.email,
          university: res.user.university,
          skills: res.user.skills,
          avatarInitials: res.user.avatarInitials,
        });
        setCurrentUser(authStore.getUser());
        setIsEditModalOpen(false);
        Alert.alert(
          "Profile Updated! ✅",
          "Your profile details have been saved in MongoDB and updated in the app."
        );
      } else {
        Alert.alert("Update Failed", res.message || "Failed to update profile in database.");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message || "Network request failed.");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleInvitationAction = async (inviteId: string, action: "accept" | "decline") => {
    const token = authStore.getToken();
    if (!token) return;

    try {
      if (action === "accept") {
        await ApiService.updateApplicationStatus(token, inviteId, "Accepted");
        setInvitations((prev) => prev.filter((i) => i._id !== inviteId));
        Alert.alert("Invitation Accepted! 🎉", "You are now a team member of this project!");
      } else {
        await ApiService.deleteApplication(token, inviteId);
        setInvitations((prev) => prev.filter((i) => i._id !== inviteId));
        Alert.alert("Invitation Cancelled", "The team invitation has been declined.");
      }
    } catch {
      Alert.alert("Notice", "Updated invitation status.");
    }
  };

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

  if (!currentUser && !authStore.isAuthenticated()) {
    return (
      <View style={[styles.guardContainer, { paddingTop: topPadding + 20 }]}>
        <View style={styles.topNavRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.replace("/")}
          >
            <Ionicons name="home-outline" size={18} color={THEME.primary} />
            <Text style={styles.backBtnText}>Home</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.guardCard}>
          <View style={styles.guardIconBox}>
            <Ionicons name="lock-closed" size={36} color={THEME.primary} />
          </View>
          <Text style={styles.guardTitle}>Private Route</Text>
          <Text style={styles.guardSubtitle}>
            "My Profile" is a protected workspace. Please sign in or register to view your verified skills, project history, and peer reviews.
          </Text>

          <TouchableOpacity
            style={styles.guardPrimaryBtn}
            onPress={() => router.push("/login")}
          >
            <Text style={styles.guardPrimaryBtnText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.guardSecondaryBtn}
            onPress={() => router.push("/register")}
          >
            <Text style={styles.guardSecondaryBtnText}>Create Free Account</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Safe Area Inset */}
      <View style={[styles.header, { paddingTop: topPadding + 8 }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.replace("/")}
          >
            <Ionicons name="home-outline" size={20} color={THEME.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color={THEME.inkDark} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Professional Profile</Text>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={openEditModal}
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
            {
              key: "invitations",
              label:
                invitations.length > 0
                  ? `Invitations (${invitations.length})`
                  : "Invitations",
            },
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
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <Text style={styles.cardSectionTitle}>My Technical Skills</Text>
              <TouchableOpacity onPress={openEditModal}>
                <Text style={{ fontSize: 12, fontWeight: "800", color: THEME.secondary }}>+ Edit Skills</Text>
              </TouchableOpacity>
            </View>

            {currentUser?.skills && currentUser.skills.length > 0 ? (
              <View style={styles.skillsGrid}>
                {currentUser.skills.map((skillName, idx) => (
                  <View key={`${skillName}_${idx}`} style={styles.skillItem}>
                    <View style={styles.skillHeader}>
                      <Text style={styles.skillName}>{skillName}</Text>
                      <Ionicons name="checkmark-circle" size={14} color={THEME.successGreen} />
                    </View>
                    <Text style={styles.skillLevel}>Verified</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={{ paddingVertical: 24, alignItems: "center" }}>
                <Ionicons name="bulb-outline" size={32} color={THEME.textMuted} />
                <Text style={{ fontSize: 13, color: THEME.textMuted, marginTop: 8, textAlign: "center" }}>
                  No skills added yet. Tap "+ Edit Skills" above to add your technical skills!
                </Text>
              </View>
            )}
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

        {/* Tab Content: Invitations */}
        {activeTab === "invitations" && (
          <View style={styles.invitationsTabContent}>
            {loadingInvites ? (
              <ActivityIndicator size="small" color={THEME.primary} style={{ marginVertical: 20 }} />
            ) : invitations.length > 0 ? (
              invitations.map((inv) => (
                <View key={inv._id} style={styles.inviteCard}>
                  <View style={styles.inviteTop}>
                    <View style={styles.inviteIconCircle}>
                      <Ionicons name="mail-unread-outline" size={20} color={THEME.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.inviteProjTitle}>{inv.project?.title || "Team Collaboration"}</Text>
                      <Text style={styles.inviteCategory}>{inv.project?.category || "Project"}</Text>
                    </View>
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingBadgeText}>Pending</Text>
                    </View>
                  </View>

                  <Text style={styles.inviteNote}>
                    {inv.coverNote || "You have been invited to join this project team."}
                  </Text>

                  {inv.inviter?.name && (
                    <Text style={styles.inviterText}>
                      Invited by: <Text style={{ fontWeight: "800", color: THEME.inkDark }}>{inv.inviter.name}</Text>
                    </Text>
                  )}

                  <View style={styles.inviteActionRow}>
                    <TouchableOpacity
                      style={styles.acceptInviteBtn}
                      onPress={() => handleInvitationAction(inv._id, "accept")}
                    >
                      <Ionicons name="checkmark-circle-outline" size={16} color={THEME.white} />
                      <Text style={styles.acceptInviteBtnText}>Accept & Join</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.declineInviteBtn}
                      onPress={() => handleInvitationAction(inv._id, "decline")}
                    >
                      <Ionicons name="close-circle-outline" size={16} color="#EF4444" />
                      <Text style={styles.declineInviteBtnText}>Decline</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyInviteBox}>
                <Ionicons name="mail-open-outline" size={40} color={THEME.textMuted} />
                <Text style={styles.emptyInviteTitle}>No Pending Invitations</Text>
                <Text style={styles.emptyInviteSub}>
                  When a project leader invites you to their team, it will appear here with options to Accept or Decline.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalOpen(false)}>
                <Ionicons name="close" size={24} color={THEME.inkDark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 420 }} showsVerticalScrollIndicator={false}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Your full name"
                  placeholderTextColor={THEME.textMuted}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholder="your.email@university.edu"
                  placeholderTextColor={THEME.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Password (Leave blank to keep current)</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={editPassword}
                  onChangeText={setEditPassword}
                  placeholder="Enter new password"
                  placeholderTextColor={THEME.textMuted}
                  secureTextEntry
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>University / Institution</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={editUniversity}
                  onChangeText={setEditUniversity}
                  placeholder="e.g. BUET, DU, NSU"
                  placeholderTextColor={THEME.textMuted}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Skills (Comma-separated)</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={editSkills}
                  onChangeText={setEditSkills}
                  placeholder="e.g. Java, React Native, Python, UI/UX"
                  placeholderTextColor={THEME.textMuted}
                />
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.saveProfileBtn, savingProfile && { opacity: 0.7 }]}
              onPress={handleSaveProfile}
              disabled={savingProfile}
            >
              {savingProfile ? (
                <ActivityIndicator color={THEME.white} />
              ) : (
                <Text style={styles.saveProfileBtnText}>Save Changes to MongoDB</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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

  // Guard styles
  guardContainer: {
    flex: 1,
    backgroundColor: THEME.canvasLight,
    padding: 24,
    justifyContent: "center",
  },
  topNavRow: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.primary,
  },
  guardCard: {
    backgroundColor: THEME.white,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  guardIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  guardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: THEME.inkDark,
    marginBottom: 8,
  },
  guardSubtitle: {
    fontSize: 13,
    color: THEME.textSecondary,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 24,
  },
  guardPrimaryBtn: {
    backgroundColor: THEME.primary,
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  guardPrimaryBtnText: {
    color: THEME.white,
    fontWeight: "800",
    fontSize: 15,
  },
  guardSecondaryBtn: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: THEME.cardBorder,
  },
  guardSecondaryBtnText: {
    color: THEME.primary,
    fontWeight: "800",
    fontSize: 14,
  },

  // Invitations Tab Styles
  invitationsTabContent: {
    gap: 12,
  },
  inviteCard: {
    backgroundColor: THEME.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  inviteTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  inviteIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  inviteProjTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.inkDark,
  },
  inviteCategory: {
    fontSize: 11,
    color: THEME.secondary,
    fontWeight: "700",
  },
  pendingBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pendingBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#D97706",
  },
  inviteNote: {
    fontSize: 12,
    lineHeight: 18,
    color: THEME.textSecondary,
    marginBottom: 8,
  },
  inviterText: {
    fontSize: 12,
    color: THEME.textMuted,
    marginBottom: 12,
  },
  inviteActionRow: {
    flexDirection: "row",
    gap: 10,
  },
  acceptInviteBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: THEME.primary,
    paddingVertical: 10,
    borderRadius: 10,
  },
  acceptInviteBtnText: {
    color: THEME.white,
    fontWeight: "800",
    fontSize: 13,
  },
  declineInviteBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#FEE2E2",
    paddingVertical: 10,
    borderRadius: 10,
  },
  declineInviteBtnText: {
    color: "#EF4444",
    fontWeight: "800",
    fontSize: 13,
  },
  emptyInviteBox: {
    backgroundColor: THEME.white,
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  emptyInviteTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: THEME.inkDark,
    marginTop: 10,
    marginBottom: 6,
  },
  emptyInviteSub: {
    fontSize: 12,
    color: THEME.textMuted,
    textAlign: "center",
    lineHeight: 18,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(13, 12, 34, 0.6)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: THEME.white,
    borderRadius: 24,
    padding: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorderSubtle,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: THEME.inkDark,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.inkDark,
    marginBottom: 6,
  },
  fieldInput: {
    backgroundColor: THEME.canvasLight,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: THEME.inkDark,
  },
  saveProfileBtn: {
    backgroundColor: THEME.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 12,
  },
  saveProfileBtnText: {
    color: THEME.white,
    fontWeight: "800",
    fontSize: 14,
  },
});
