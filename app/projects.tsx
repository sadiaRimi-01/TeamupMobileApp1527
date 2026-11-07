import React, { useState } from "react";
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
import { router } from "expo-router";
import { THEME } from "../src/constants/theme";

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  desc: string;
  requiredSkills: string[];
  members: string;
  leader: string;
  deadline: string;
  status: "Recruiting" | "In Progress";
}

const SAMPLE_PROJECTS: ProjectItem[] = [
  {
    id: "p1",
    title: "AI-Powered Smart Campus Navigation",
    category: "Mobile & AI",
    desc: "Building a React Native cross-platform indoor routing mobile application with graph pathfinding and Bluetooth beacons.",
    requiredSkills: ["React Native", "TypeScript", "Node.js", "Python"],
    members: "2 / 4 Members",
    leader: "Tanvir Ahmed",
    deadline: "Dec 15, 2026",
    status: "Recruiting",
  },
  {
    id: "p2",
    title: "Decentralized Academic Credential Ledger",
    category: "Full Stack & Cloud",
    desc: "A secure verification platform for university transcripts and certificate validation with cryptographic signing.",
    requiredSkills: ["Java", "Spring Boot", "PostgreSQL", "Docker"],
    members: "3 / 5 Members",
    leader: "Sarah Lin",
    deadline: "Nov 30, 2026",
    status: "Recruiting",
  },
  {
    id: "p3",
    title: "Healthcare Telemedicine & Doctor Booking",
    category: "UI/UX & Web",
    desc: "Clean tele-consultation scheduling system with real-time video, prescription generation, and pharmacy integration.",
    requiredSkills: ["UI/UX", "Figma", "React", "MongoDB"],
    members: "1 / 3 Members",
    leader: "David Chen",
    deadline: "Jan 10, 2027",
    status: "Recruiting",
  },
  {
    id: "p4",
    title: "Automated Crop Disease Diagnostic App",
    category: "Machine Learning",
    desc: "Mobile image diagnostic tool allowing farmers to snap leaf photographs and detect fungal diseases with 95% accuracy.",
    requiredSkills: ["Python", "PyTorch", "FastAPI", "React Native"],
    members: "2 / 3 Members",
    leader: "Dr. Hasan",
    deadline: "Dec 20, 2026",
    status: "Recruiting",
  },
];

export default function ProjectsScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight || 28) : 0
  );

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [appliedProjects, setAppliedProjects] = useState<Record<string, boolean>>({});

  const categories = ["All", "Mobile & AI", "Full Stack & Cloud", "UI/UX & Web", "Machine Learning"];

  const filteredProjects = SAMPLE_PROJECTS.filter((p) => {
    const matchCat = selectedCategory === "All" || p.category === selectedCategory;
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.requiredSkills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleApply = (id: string, title: string) => {
    setAppliedProjects((prev) => ({ ...prev, [id]: true }));
    Alert.alert("Application Submitted! 🚀", `Your application to join "${title}" has been sent to the Project Leader.`);
  };

  return (
    <View style={styles.container}>
      {/* Top Header with Safe Area Inset */}
      <View style={[styles.header, { paddingTop: topPadding + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={THEME.inkDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explore Projects</Text>
        <TouchableOpacity
          style={styles.postBtn}
          onPress={() =>
            Alert.alert("Post Project", "Create a new project posting to recruit qualified team members.")
          }
        >
          <Ionicons name="add" size={20} color={THEME.white} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={THEME.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by project name or skill (e.g. Java, AI)..."
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

      {/* Categories Horizontal Filter */}
      <View style={styles.catWrap}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catScroll}>
          {categories.map((cat) => {
            const isSel = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catPill, isSel && styles.catPillActive]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={[styles.catPillText, isSel && styles.catPillTextActive]}>{cat}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Projects List */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.resultsCount}>
          Showing {filteredProjects.length} open initiatives
        </Text>

        {filteredProjects.map((p) => {
          const isApplied = appliedProjects[p.id];

          return (
            <View key={p.id} style={styles.projectCard}>
              <View style={styles.cardTop}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{p.category}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>{p.status}</Text>
                </View>
              </View>

              <Text style={styles.projectTitle}>{p.title}</Text>
              <Text style={styles.projectDesc}>{p.desc}</Text>

              {/* Skills Tags */}
              <View style={styles.skillsRow}>
                {p.requiredSkills.map((s) => (
                  <View key={s} style={styles.skillPill}>
                    <Text style={styles.skillPillText}>{s}</Text>
                  </View>
                ))}
              </View>

              {/* Meta info */}
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="people-outline" size={14} color={THEME.textSecondary} />
                  <Text style={styles.metaText}>{p.members}</Text>
                </View>

                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={14} color={THEME.textSecondary} />
                  <Text style={styles.metaText}>{p.deadline}</Text>
                </View>
              </View>

              {/* Footer */}
              <View style={styles.cardFooter}>
                <View style={styles.leaderInfo}>
                  <View style={styles.leaderAvatar}>
                    <Text style={styles.leaderInitials}>{p.leader.substring(0, 2).toUpperCase()}</Text>
                  </View>
                  <Text style={styles.leaderName}>Lead: {p.leader}</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.applyBtn, isApplied && styles.appliedBtn]}
                  onPress={() => !isApplied && handleApply(p.id, p.title)}
                  disabled={isApplied}
                >
                  <Text style={[styles.applyBtnText, isApplied && styles.appliedBtnText]}>
                    {isApplied ? "Applied ✓" : "Apply to Join"}
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
  postBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.brandPink,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: THEME.brandPink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
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
  catWrap: {
    marginTop: 10,
  },
  catScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  catPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: THEME.white,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  catPillActive: {
    backgroundColor: THEME.brandPink,
    borderColor: THEME.brandPink,
  },
  catPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.textSecondary,
  },
  catPillTextActive: {
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
  projectCard: {
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
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: THEME.pastelViolet,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: THEME.accentViolet,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: THEME.pastelMint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: THEME.successGreen,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
    color: THEME.successGreen,
  },
  projectTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: THEME.inkDark,
    marginBottom: 6,
  },
  projectDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: THEME.textSecondary,
    marginBottom: 14,
  },
  skillsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 14,
  },
  skillPill: {
    backgroundColor: THEME.canvasLight,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  skillPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.textPrimary,
  },
  metaRow: {
    flexDirection: "row",
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorderSubtle,
    paddingTop: 12,
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.textSecondary,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leaderInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  leaderAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.brandPink,
    justifyContent: "center",
    alignItems: "center",
  },
  leaderInitials: {
    fontSize: 10,
    fontWeight: "900",
    color: THEME.white,
  },
  leaderName: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.inkDark,
  },
  applyBtn: {
    backgroundColor: THEME.brandPink,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 30,
    shadowColor: THEME.brandPink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  appliedBtn: {
    backgroundColor: THEME.pastelMint,
  },
  applyBtnText: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.white,
  },
  appliedBtnText: {
    color: THEME.successGreen,
  },
});
