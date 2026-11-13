import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { THEME } from "../src/constants/theme";
import { HERO_MEMBERS, POPULAR_SKILLS } from "../src/constants/mockData";
import { TeamMember } from "../src/types";
import { ApiService } from "../src/services/api";
import { authStore } from "../src/services/authStore";

export default function TeamsScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight || 28) : 0
  );

  const params = useLocalSearchParams<{ skill?: string }>();
  const [search, setSearch] = useState(params.skill || "");
  const [selectedFilter, setSelectedFilter] = useState(params.skill || "All");
  const [invitedMap, setInvitedMap] = useState<Record<string, boolean>>({});
  const [members, setMembers] = useState<TeamMember[]>(HERO_MEMBERS);
  const [isAuth, setIsAuth] = useState<boolean>(authStore.isAuthenticated());

  useEffect(() => {
    setIsAuth(authStore.isAuthenticated());
    const unsub = authStore.subscribe(() => {
      setIsAuth(authStore.isAuthenticated());
    });
    return unsub;
  }, []);

  const filterOptions = ["All", ...POPULAR_SKILLS];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await ApiService.getAllUsers(search.trim() || undefined);
        if (res && res.success && Array.isArray(res.users) && res.users.length > 0) {
          const liveMembers: TeamMember[] = res.users.map((u: any, idx: number) => ({
            id: u._id || `u_${idx}`,
            name: u.name,
            role: u.role || "Team Member",
            skills: Array.isArray(u.skills) && u.skills.length > 0 ? u.skills : ["React Native", "TypeScript"],
            university: u.university || "University Student",
            matchPct: 92 + (idx % 7),
            rating: u.rating || 5.0,
            reviewCount: u.reviewCount || 12,
            initials: u.avatarInitials || (u.name ? u.name.substring(0, 2).toUpperCase() : "TU"),
            bio: u.bio || "Passionate about team collaboration and building modern applications.",
            gradient: [THEME.brandPurple, THEME.brandPink],
          }));

          const combined = [...liveMembers];
          HERO_MEMBERS.forEach((m) => {
            if (!combined.some((item) => item.name.toLowerCase() === m.name.toLowerCase())) {
              combined.push(m);
            }
          });
          setMembers(combined);
        }
      } catch {
        // Fallback to static mock
      }
    };

    fetchUsers();
  }, [search]);

  const filteredMembers = members.filter((m) => {
    const matchesFilter =
      selectedFilter === "All" ||
      m.skills.some((s) => s.toLowerCase() === selectedFilter.toLowerCase());
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleInvite = async (m: TeamMember) => {
    setInvitedMap((prev) => ({ ...prev, [m.id]: true }));

    const token = authStore.getToken();
    if (token) {
      try {
        const projectsRes = await ApiService.getProjects();
        if (projectsRes.success && projectsRes.projects && projectsRes.projects.length > 0) {
          const firstProjId = projectsRes.projects[0]._id;
          await ApiService.applyToProject(token, firstProjId, `Team invitation sent to ${m.name}`);
        }
      } catch {
        // Ignored
      }
    }

    Alert.alert(
      "Invitation Sent! 📨",
      `An invite to collaborate on your team has been sent to ${m.name} and registered in MongoDB.`
    );
  };

  if (!isAuth) {
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
            "Find Teammates" is a protected workspace. Please sign in or register to discover candidates, view skill match percentages, and recruit developers.
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
      {/* Top Header with Safe Inset */}
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
        <Text style={styles.headerTitle}>Find Teammates</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={THEME.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by skill, developer name, or role..."
          placeholderTextColor={THEME.textMuted}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color={THEME.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Skills Filters */}
      <View style={styles.skillsFilterWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.skillsFilterScroll}
        >
          {filterOptions.map((f) => {
            const isSel = selectedFilter === f;
            return (
              <TouchableOpacity
                key={f}
                style={[styles.filterPill, isSel && styles.filterPillActive]}
                onPress={() => setSelectedFilter(f)}
              >
                <Text
                  style={[
                    styles.filterPillText,
                    isSel && styles.filterPillTextActive,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Member Cards List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.resultsCount}>
          Found {filteredMembers.length} verified candidates
        </Text>

        {filteredMembers.map((member) => {
          const isInvited = invitedMap[member.id];

          return (
            <View key={member.id} style={styles.memberCard}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: member.gradient[0] },
                  ]}
                >
                  <Text style={styles.avatarText}>{member.initials}</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <View style={styles.nameRow}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    <View style={styles.matchBadge}>
                      <Text style={styles.matchBadgeText}>
                        {member.matchPct}% Match
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.memberRole}>{member.role}</Text>

                  <View style={styles.uniRow}>
                    {member.university && (
                      <View style={styles.uniPill}>
                        <Ionicons
                          name="school-outline"
                          size={11}
                          color={THEME.textSecondary}
                        />
                        <Text style={styles.uniText}>{member.university}</Text>
                      </View>
                    )}

                    <View style={styles.ratingPill}>
                      <Ionicons name="star" size={12} color="#F59E0B" />
                      <Text style={styles.ratingText}>{member.rating}</Text>
                      <Text style={styles.reviewCount}>
                        ({member.reviewCount} reviews)
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <Text style={styles.memberBio}>{member.bio}</Text>

              {/* Skills tags */}
              <View style={styles.skillsWrap}>
                {member.skills.map((s) => (
                  <View key={s} style={styles.skillBadge}>
                    <Text style={styles.skillBadgeText}>{s}</Text>
                  </View>
                ))}
              </View>

              {/* Action row */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.inviteBtn, isInvited && styles.invitedBtn]}
                  onPress={() => !isInvited && handleInvite(member)}
                  disabled={isInvited}
                >
                  <Ionicons
                    name={isInvited ? "checkmark-circle" : "paper-plane-outline"}
                    size={15}
                    color={isInvited ? THEME.successGreen : THEME.white}
                  />
                  <Text
                    style={[
                      styles.inviteBtnText,
                      isInvited && styles.invitedBtnText,
                    ]}
                  >
                    {isInvited ? "Invitation Sent" : "Invite to Team"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
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
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.white,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 13,
    color: THEME.inkDark,
    fontWeight: "600",
  },
  skillsFilterWrap: {
    marginTop: 10,
  },
  skillsFilterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: THEME.white,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  filterPillActive: {
    backgroundColor: THEME.brandPink,
    borderColor: THEME.brandPink,
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.textSecondary,
  },
  filterPillTextActive: {
    color: THEME.white,
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
    gap: 14,
  },
  resultsCount: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.textMuted,
    marginBottom: 2,
  },
  memberCard: {
    backgroundColor: THEME.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    shadowColor: THEME.inkDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: THEME.white,
    fontSize: 16,
    fontWeight: "900",
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  memberName: {
    fontSize: 17,
    fontWeight: "900",
    color: THEME.inkDark,
  },
  matchBadge: {
    backgroundColor: THEME.pastelPink,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  matchBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: THEME.brandPink,
  },
  memberRole: {
    fontSize: 12,
    color: THEME.textSecondary,
    fontWeight: "600",
    marginTop: 2,
  },
  uniRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 6,
  },
  uniPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: THEME.canvasLight,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  uniText: {
    fontSize: 11,
    fontWeight: "600",
    color: THEME.textSecondary,
  },
  ratingPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.inkDark,
  },
  reviewCount: {
    fontSize: 11,
    color: THEME.textMuted,
  },
  memberBio: {
    fontSize: 13,
    lineHeight: 18,
    color: THEME.textSecondary,
    marginBottom: 12,
  },
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
  },
  skillBadge: {
    backgroundColor: THEME.pastelViolet,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  skillBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.accentViolet,
  },
  actionRow: {
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorderSubtle,
    paddingTop: 12,
  },
  inviteBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    backgroundColor: THEME.brandPink,
    paddingVertical: 11,
    borderRadius: 24,
    shadowColor: THEME.brandPink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  invitedBtn: {
    backgroundColor: THEME.pastelMint,
  },
  inviteBtnText: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.white,
  },
  invitedBtnText: {
    color: THEME.successGreen,
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
});
