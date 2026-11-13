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

export interface TeamMemberProgress {
  id: string;
  name: string;
  role: string;
  initials: string;
  progressPct: number;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  done: boolean;
}

export interface CandidateApplicant {
  id: string;
  name: string;
  role: string;
  initials: string;
  matchPct: string;
  status: "pending" | "accepted" | "declined";
}

export interface RunningProject {
  id: string;
  title: string;
  category: string;
  description: string;
  myRole: string;
  isLead: boolean;
  status: "Active" | "Recruiting" | "Completed";
  progressPct: number;
  nextMilestone: string;
  skills: string[];
  members: TeamMemberProgress[];
  milestones: ProjectMilestone[];
  applicants: CandidateApplicant[];
}

const INITIAL_RUNNING_PROJECTS: RunningProject[] = [
  {
    id: "p_run_1",
    title: "CampusConnect",
    category: "Campus life",
    description:
      "Centralized campus social hub discovering events, study hubs, and peer workshops in real-time.",
    myRole: "Project Lead & Full-Stack Developer",
    isLead: true,
    status: "Active",
    progressPct: 68,
    nextMilestone: "Finalize event API contract with backend team (Due Nov 28)",
    skills: ["React Native", "TypeScript", "Node.js", "MongoDB"],
    members: [
      { id: "m1", name: "Alex Morgan", role: "Project Lead", initials: "AM", progressPct: 85 },
      { id: "m2", name: "Priya Shah", role: "UX Designer", initials: "PS", progressPct: 90 },
      { id: "m3", name: "Daniel Kim", role: "Backend Dev", initials: "DK", progressPct: 70 },
      { id: "m4", name: "Sofia Martinez", role: "Frontend Dev", initials: "SM", progressPct: 75 },
    ],
    milestones: [
      { id: "ms1", title: "Finalize event API contract with backend team", dueDate: "Nov 28", done: false },
      { id: "ms2", title: "Build event discovery cards and filter chips", dueDate: "Dec 02", done: false },
      { id: "ms3", title: "Accessibility and screen reader audit", dueDate: "Dec 08", done: false },
      { id: "ms4", title: "Set up MongoDB schemas & indexes", dueDate: "Nov 12", done: true },
      { id: "ms5", title: "Design high-fidelity mobile mockups in Figma", dueDate: "Nov 15", done: true },
    ],
    applicants: [
      { id: "c1", name: "Ethan Chen", role: "QA Engineer", initials: "EC", matchPct: "88%", status: "pending" },
      { id: "c2", name: "Aisha Rahman", role: "Product Designer", initials: "AR", matchPct: "79%", status: "pending" },
    ],
  },
  {
    id: "p_run_2",
    title: "AI-Powered Smart Campus Navigation",
    category: "Mobile & AI",
    description:
      "Cross-platform indoor routing mobile application with graph pathfinding algorithms and beacon telemetry.",
    myRole: "Lead System Architect",
    isLead: true,
    status: "Active",
    progressPct: 54,
    nextMilestone: "Integrate A* shortest path algorithm with beacon telemetry",
    skills: ["React Native", "Python", "Node.js", "FastAPI"],
    members: [
      { id: "m5", name: "Sarah Lin", role: "Lead Architect", initials: "SL", progressPct: 70 },
      { id: "m6", name: "Tanvir Ahmed", role: "AI Specialist", initials: "TA", progressPct: 60 },
      { id: "m7", name: "David Chen", role: "Mobile Engineer", initials: "DC", progressPct: 50 },
    ],
    milestones: [
      { id: "ms6", title: "Deploy graph routing microservice", dueDate: "Dec 01", done: false },
      { id: "ms7", title: "Calibrate indoor Bluetooth beacon RSSI", dueDate: "Dec 10", done: false },
      { id: "ms8", title: "Configure JWT authentication & role middleware", dueDate: "Nov 14", done: true },
    ],
    applicants: [
      { id: "c3", name: "Marcus Vance", role: "DevOps Engineer", initials: "MV", matchPct: "92%", status: "pending" },
    ],
  },
  {
    id: "p_run_3",
    title: "GreenRoute",
    category: "Sustainability",
    description:
      "Make low-carbon campus travel easier with shared routes, micro-mobility, and real-time transit insights.",
    myRole: "Frontend Developer (Joined)",
    isLead: false,
    status: "Recruiting",
    progressPct: 42,
    nextMilestone: "Complete route optimization UI and offline caching",
    skills: ["React Native", "Mapbox", "TypeScript"],
    members: [
      { id: "m8", name: "Maya Patel", role: "Project Lead", initials: "MP", progressPct: 60 },
      { id: "m9", name: "David Chen", role: "Frontend Dev", initials: "DC", progressPct: 45 },
    ],
    milestones: [
      { id: "ms9", title: "Integrate carbon savings calculator", dueDate: "Dec 05", done: false },
      { id: "ms10", title: "Implement offline route caching", dueDate: "Dec 12", done: false },
      { id: "ms11", title: "Design map markers and dark mode layout", dueDate: "Nov 18", done: true },
    ],
    applicants: [],
  },
];

export default function MyProjectsScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight || 28) : 0
  );

  const [user, setUser] = useState<AuthUser | null>(authStore.getUser());
  const [isAuth, setIsAuth] = useState<boolean>(authStore.isAuthenticated());
  const [activeTab, setActiveTab] = useState<"all" | "lead" | "joined" | "completed">("all");
  const [projects, setProjects] = useState<RunningProject[]>(INITIAL_RUNNING_PROJECTS);

  // Sub-modals
  const [selectedProject, setSelectedProject] = useState<RunningProject | null>(null);
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);

  // Progress update state
  const [editProgress, setEditProgress] = useState("68");
  const [editNextMilestone, setEditNextMilestone] = useState("");

  useEffect(() => {
    setUser(authStore.getUser());
    setIsAuth(authStore.isAuthenticated());

    const unsub = authStore.subscribe(() => {
      setUser(authStore.getUser());
      setIsAuth(authStore.isAuthenticated());
    });
    return unsub;
  }, []);

  // Filter projects by active tab
  const filteredProjects = projects.filter((p) => {
    if (activeTab === "lead") return p.isLead;
    if (activeTab === "joined") return !p.isLead;
    if (activeTab === "completed") return p.status === "Completed";
    return true;
  });

  // Action 1: Toggle a milestone checkbox
  const toggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          const updatedMs = p.milestones.map((m) =>
            m.id === milestoneId ? { ...m, done: !m.done } : m
          );
          const doneCount = updatedMs.filter((m) => m.done).length;
          const newPct = Math.round((doneCount / updatedMs.length) * 100);
          return { ...p, milestones: updatedMs, progressPct: newPct };
        }
        return p;
      })
    );

    if (selectedProject && selectedProject.id === projectId) {
      setSelectedProject((prev) => {
        if (!prev) return null;
        const updatedMs = prev.milestones.map((m) =>
          m.id === milestoneId ? { ...m, done: !m.done } : m
        );
        const doneCount = updatedMs.filter((m) => m.done).length;
        const newPct = Math.round((doneCount / updatedMs.length) * 100);
        return { ...prev, milestones: updatedMs, progressPct: newPct };
      });
    }
  };

  // Action 2: Update Overall Progress modal
  const handleSaveProgress = () => {
    if (!selectedProject) return;
    const num = Math.min(100, Math.max(0, parseInt(editProgress, 10) || 0));

    setProjects((prev) =>
      prev.map((p) =>
        p.id === selectedProject.id
          ? {
              ...p,
              progressPct: num,
              nextMilestone: editNextMilestone.trim() || p.nextMilestone,
              status: num === 100 ? "Completed" : "Active",
            }
          : p
      )
    );

    setIsProgressModalOpen(false);
    Alert.alert("Progress Updated! ⚡", `"${selectedProject.title}" is now at ${num}% completion.`);
  };

  // Action 3: Accept / Decline Applicant
  const handleApplicantDecision = (applicantId: string, decision: "accepted" | "declined") => {
    if (!selectedProject) return;

    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === selectedProject.id) {
          const updatedApps = p.applicants.map((a) =>
            a.id === applicantId ? { ...a, status: decision } : a
          );
          return { ...p, applicants: updatedApps };
        }
        return p;
      })
    );

    setSelectedProject((prev) => {
      if (!prev) return null;
      const updatedApps = prev.applicants.map((a) =>
        a.id === applicantId ? { ...a, status: decision } : a
      );
      return { ...prev, applicants: updatedApps };
    });

    Alert.alert(
      decision === "accepted" ? "Member Accepted! 🎉" : "Application Declined",
      `The candidate's status has been updated in the project team.`
    );
  };

  // Auth Guard: If not logged in, prompt user to sign in
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
            "My Projects" is a protected workspace. Please sign in or register to view your active projects, team progress, and milestones.
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
      {/* Top Header */}
      <View style={[styles.header, { paddingTop: topPadding + 8 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.iconCircleBtn}
            onPress={() => router.replace("/")}
          >
            <Ionicons name="home-outline" size={20} color={THEME.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconCircleBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={THEME.inkDark} />
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitle}>My Projects</Text>

        <TouchableOpacity
          style={styles.postBtn}
          onPress={() => router.push("/projects")}
        >
          <Ionicons name="add" size={22} color={THEME.white} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsRow}>
        {[
          { key: "all", label: "All Projects" },
          { key: "lead", label: "Leading" },
          { key: "joined", label: "Joined" },
          { key: "completed", label: "Completed" },
        ].map((tab) => {
          const isSel = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabPill, isSel && styles.tabPillActive]}
              onPress={() => setActiveTab(tab.key as any)}
            >
              <Text style={[styles.tabText, isSel && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Projects List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionNotice}>
          Showing {filteredProjects.length} collaborative initiatives
        </Text>

        {filteredProjects.map((p) => {
          const isDone = p.progressPct === 100 || p.status === "Completed";

          return (
            <View key={p.id} style={styles.projectCard}>
              {/* Card Header */}
              <View style={styles.cardTopRow}>
                <View style={styles.catBadge}>
                  <Text style={styles.catBadgeText}>{p.category}</Text>
                </View>

                <View style={[styles.statusBadge, isDone && { backgroundColor: THEME.pastelMint }]}>
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: isDone ? THEME.successGreen : THEME.primary },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: isDone ? THEME.successGreen : THEME.primary },
                    ]}
                  >
                    {p.status}
                  </Text>
                </View>
              </View>

              {/* Title & Description */}
              <Text style={styles.projectTitle}>{p.title}</Text>
              <Text style={styles.projectDesc}>{p.description}</Text>

              {/* My Role Pill */}
              <View style={styles.roleRow}>
                <Ionicons name="person-circle-outline" size={14} color={THEME.secondary} />
                <Text style={styles.roleText}>Role: {p.myRole}</Text>
              </View>

              {/* Progress Bar Strip */}
              <View style={styles.progressContainer}>
                <View style={styles.progressLabelRow}>
                  <Text style={styles.progressLabel}>Overall Sprint Progress</Text>
                  <Text style={styles.progressPercent}>{p.progressPct}%</Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${p.progressPct}%`,
                        backgroundColor: isDone ? THEME.successGreen : THEME.primary,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Next Milestone */}
              <View style={styles.milestoneBox}>
                <Ionicons name="flag-outline" size={14} color={THEME.primary} />
                <Text style={styles.milestoneText} numberOfLines={2}>
                  {p.nextMilestone}
                </Text>
              </View>

              {/* Team Members & Individual Progress */}
              <View style={styles.membersSection}>
                <Text style={styles.membersHeader}>
                  Team Members & Progress ({p.members.length})
                </Text>
                <View style={styles.membersGrid}>
                  {p.members.map((m) => (
                    <View key={m.id} style={styles.memberItem}>
                      <View style={styles.memberTop}>
                        <View style={styles.memberAvatar}>
                          <Text style={styles.memberAvatarText}>{m.initials}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.memberName} numberOfLines={1}>
                            {m.name}
                          </Text>
                          <Text style={styles.memberRole} numberOfLines={1}>
                            {m.role}
                          </Text>
                        </View>
                        <Text style={styles.memberPct}>{m.progressPct}%</Text>
                      </View>
                      <View style={styles.miniProgressTrack}>
                        <View
                          style={[
                            styles.miniProgressFill,
                            { width: `${m.progressPct}%` },
                          ]}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Action Buttons Strip */}
              <View style={styles.actionsGrid}>
                <TouchableOpacity
                  style={styles.actionBtnPrimary}
                  onPress={() => {
                    setSelectedProject(p);
                    setEditProgress(String(p.progressPct));
                    setEditNextMilestone(p.nextMilestone);
                    setIsProgressModalOpen(true);
                  }}
                >
                  <Ionicons name="speedometer-outline" size={14} color={THEME.white} />
                  <Text style={styles.actionBtnPrimaryText}>Update Progress</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtnSecondary}
                  onPress={() => {
                    setSelectedProject(p);
                    setIsMilestoneModalOpen(true);
                  }}
                >
                  <Ionicons name="list-outline" size={14} color={THEME.primary} />
                  <Text style={styles.actionBtnSecondaryText}>Milestones</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.actionsGridSecondary}>
                <TouchableOpacity
                  style={styles.actionBtnOutline}
                  onPress={() => {
                    setSelectedProject(p);
                    setIsManageModalOpen(true);
                  }}
                >
                  <Ionicons name="people-outline" size={14} color={THEME.primary} />
                  <Text style={styles.actionBtnOutlineText}>
                    Manage Team ({p.applicants.length} Applicants)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionBtnChat}
                  onPress={() => router.push("/chat")}
                >
                  <Ionicons name="chatbubbles-outline" size={14} color={THEME.secondary} />
                  <Text style={styles.actionBtnChatText}>Team Chat</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Modal 1: Update Progress Modal */}
      <Modal
        visible={isProgressModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsProgressModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Update Progress</Text>
              <TouchableOpacity onPress={() => setIsProgressModalOpen(false)}>
                <Ionicons name="close" size={24} color={THEME.inkDark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>
              Overall Project Progress (0 - 100%) *
            </Text>
            <TextInput
              style={styles.modalInput}
              value={editProgress}
              onChangeText={setEditProgress}
              keyboardType="number-pad"
              placeholder="e.g. 75"
            />

            <Text style={styles.inputLabel}>Next Milestone Target *</Text>
            <TextInput
              style={[styles.modalInput, { height: 60, textAlignVertical: "top" }]}
              value={editNextMilestone}
              onChangeText={setEditNextMilestone}
              placeholder="Describe upcoming deliverables..."
              multiline
            />

            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={handleSaveProgress}
            >
              <Text style={styles.modalSubmitText}>Save Progress ⚡</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal 2: Milestone Checklist Modal */}
      <Modal
        visible={isMilestoneModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsMilestoneModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sprint Milestones</Text>
              <TouchableOpacity onPress={() => setIsMilestoneModalOpen(false)}>
                <Ionicons name="close" size={24} color={THEME.inkDark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 350 }}>
              {selectedProject?.milestones.map((ms) => (
                <TouchableOpacity
                  key={ms.id}
                  style={styles.milestoneCheckRow}
                  onPress={() => toggleMilestone(selectedProject.id, ms.id)}
                >
                  <Ionicons
                    name={ms.done ? "checkbox" : "square-outline"}
                    size={22}
                    color={ms.done ? THEME.successGreen : THEME.primary}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        styles.milestoneCheckTitle,
                        ms.done && styles.milestoneCheckTitleDone,
                      ]}
                    >
                      {ms.title}
                    </Text>
                    <Text style={styles.milestoneDueDate}>Due: {ms.dueDate}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={() => setIsMilestoneModalOpen(false)}
            >
              <Text style={styles.modalSubmitText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal 3: Manage Team & Applicants Modal */}
      <Modal
        visible={isManageModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsManageModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Team & Applicants</Text>
              <TouchableOpacity onPress={() => setIsManageModalOpen(false)}>
                <Ionicons name="close" size={24} color={THEME.inkDark} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 380 }}>
              <Text style={styles.subHeader}>Pending Applicants</Text>
              {selectedProject?.applicants && selectedProject.applicants.length > 0 ? (
                selectedProject.applicants.map((a) => (
                  <View key={a.id} style={styles.applicantCard}>
                    <View style={styles.applicantTop}>
                      <View style={styles.applicantAvatar}>
                        <Text style={styles.applicantAvatarText}>{a.initials}</Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.applicantName}>{a.name}</Text>
                        <Text style={styles.applicantRole}>{a.role}</Text>
                      </View>
                      <Text style={styles.applicantMatch}>{a.matchPct} Match</Text>
                    </View>

                    <View style={styles.applicantActions}>
                      {a.status === "pending" ? (
                        <>
                          <TouchableOpacity
                            style={styles.acceptBtn}
                            onPress={() => handleApplicantDecision(a.id, "accepted")}
                          >
                            <Text style={styles.acceptBtnText}>Accept</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.declineBtn}
                            onPress={() => handleApplicantDecision(a.id, "declined")}
                          >
                            <Text style={styles.declineBtnText}>Decline</Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "800",
                            color: a.status === "accepted" ? THEME.successGreen : "#EF4444",
                          }}
                        >
                          Status: {a.status.toUpperCase()}
                        </Text>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No pending applicants right now.</Text>
              )}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={() => setIsManageModalOpen(false)}
            >
              <Text style={styles.modalSubmitText}>Close</Text>
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconCircleBtn: {
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
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tabPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: THEME.white,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  tabPillActive: {
    backgroundColor: THEME.brandPink,
    borderColor: THEME.brandPink,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.textSecondary,
  },
  tabTextActive: {
    color: THEME.white,
  },
  listContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  sectionNotice: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.textMuted,
    marginBottom: -4,
  },
  projectCard: {
    backgroundColor: THEME.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  catBadge: {
    backgroundColor: THEME.pastelViolet,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  catBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: THEME.accentViolet,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: THEME.inkDark,
    marginBottom: 6,
  },
  projectDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: THEME.textSecondary,
    marginBottom: 12,
  },
  roleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F8FAFC",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 14,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.secondary,
  },
  progressContainer: {
    marginBottom: 14,
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.inkDark,
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: "900",
    color: THEME.primary,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 8,
    borderRadius: 4,
  },
  milestoneBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EEF2FF",
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  milestoneText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "700",
    color: THEME.primary,
    lineHeight: 16,
  },
  membersSection: {
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorderSubtle,
    paddingTop: 12,
    marginBottom: 16,
  },
  membersHeader: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.textPrimary,
    marginBottom: 10,
  },
  membersGrid: {
    gap: 8,
  },
  memberItem: {
    backgroundColor: "#F9FAFB",
    padding: 8,
    borderRadius: 10,
  },
  memberTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  memberAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  memberAvatarText: {
    fontSize: 10,
    fontWeight: "900",
    color: THEME.white,
  },
  memberName: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.inkDark,
  },
  memberRole: {
    fontSize: 10,
    color: THEME.textMuted,
  },
  memberPct: {
    fontSize: 11,
    fontWeight: "800",
    color: THEME.secondary,
  },
  miniProgressTrack: {
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    overflow: "hidden",
  },
  miniProgressFill: {
    height: 4,
    backgroundColor: THEME.secondary,
    borderRadius: 2,
  },
  actionsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: THEME.primary,
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionBtnPrimaryText: {
    color: THEME.white,
    fontWeight: "800",
    fontSize: 12,
  },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#EEF2FF",
    paddingVertical: 10,
    borderRadius: 10,
  },
  actionBtnSecondaryText: {
    color: THEME.primary,
    fontWeight: "800",
    fontSize: 12,
  },
  actionsGridSecondary: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtnOutline: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    backgroundColor: THEME.white,
    paddingVertical: 9,
    borderRadius: 10,
  },
  actionBtnOutlineText: {
    color: THEME.primary,
    fontWeight: "700",
    fontSize: 12,
  },
  actionBtnChat: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#F5F3FF",
    paddingVertical: 9,
    borderRadius: 10,
  },
  actionBtnChatText: {
    color: THEME.secondary,
    fontWeight: "800",
    fontSize: 12,
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

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    backgroundColor: THEME.white,
    borderRadius: 20,
    padding: 20,
    elevation: 6,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: THEME.inkDark,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.textPrimary,
    marginTop: 10,
    marginBottom: 5,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: THEME.inkDark,
    backgroundColor: THEME.canvasLight,
  },
  modalSubmitBtn: {
    backgroundColor: THEME.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 18,
  },
  modalSubmitText: {
    color: THEME.white,
    fontWeight: "800",
    fontSize: 15,
  },
  milestoneCheckRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  milestoneCheckTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: THEME.inkDark,
  },
  milestoneCheckTitleDone: {
    textDecorationLine: "line-through",
    color: THEME.textMuted,
  },
  milestoneDueDate: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 2,
  },
  subHeader: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.inkDark,
    marginBottom: 10,
  },
  applicantCard: {
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  applicantTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  applicantAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  applicantAvatarText: {
    fontSize: 11,
    fontWeight: "900",
    color: THEME.white,
  },
  applicantName: {
    fontSize: 13,
    fontWeight: "800",
    color: THEME.inkDark,
  },
  applicantRole: {
    fontSize: 11,
    color: THEME.textMuted,
  },
  applicantMatch: {
    fontSize: 11,
    fontWeight: "800",
    color: THEME.successGreen,
  },
  applicantActions: {
    flexDirection: "row",
    gap: 8,
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: THEME.successGreen,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptBtnText: {
    color: THEME.white,
    fontWeight: "800",
    fontSize: 12,
  },
  declineBtn: {
    flex: 1,
    backgroundColor: "#EF4444",
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: "center",
  },
  declineBtnText: {
    color: THEME.white,
    fontWeight: "800",
    fontSize: 12,
  },
  emptyText: {
    fontSize: 12,
    color: THEME.textMuted,
    textAlign: "center",
    paddingVertical: 20,
  },
});

