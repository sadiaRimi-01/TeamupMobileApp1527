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
import { ApiService } from "../src/services/api";
import { authStore } from "../src/services/authStore";

export interface TaskItem {
  id: string;
  title: string;
  project: string;
  assignee: string;
  assigneeInitials: string;
  status: "todo" | "in_progress" | "done";
  priority: "High" | "Medium" | "Normal";
  deadline: string;
}

const INITIAL_TASKS: TaskItem[] = [
  {
    id: "t1",
    title: "Implement JWT Authentication & User Roles",
    project: "Smart Campus App",
    assignee: "Sarah Lin",
    assigneeInitials: "SL",
    status: "in_progress",
    priority: "High",
    deadline: "Tomorrow",
  },
  {
    id: "t2",
    title: "Design Figma UI Kit & Micro-interactions",
    project: "TeamUp Mobile",
    assignee: "David Chen",
    assigneeInitials: "DC",
    status: "done",
    priority: "Medium",
    deadline: "Nov 10",
  },
  {
    id: "t3",
    title: "Setup MongoDB Schemas & Indexing",
    project: "Smart Campus App",
    assignee: "Priya Patel",
    assigneeInitials: "PP",
    status: "todo",
    priority: "High",
    deadline: "Nov 14",
  },
  {
    id: "t4",
    title: "Integrate Real-time WebSocket Messaging",
    project: "Doctor Booking App",
    assignee: "Marcus Vance",
    assigneeInitials: "MV",
    status: "in_progress",
    priority: "Medium",
    deadline: "Nov 18",
  },
  {
    id: "t5",
    title: "Conduct End-to-End Sprint Retrospective",
    project: "TeamUp Mobile",
    assignee: "Tanvir Ahmed",
    assigneeInitials: "TA",
    status: "todo",
    priority: "Normal",
    deadline: "Nov 25",
  },
];

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight || 28) : 0
  );

  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState<"all" | "todo" | "in_progress" | "done">("all");

  // New Task Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"High" | "Medium" | "Normal">("High");
  const [newTaskDeadline, setNewTaskDeadline] = useState("Tomorrow");
  const [submitting, setSubmitting] = useState(false);

  const fetchLiveTasks = async () => {
    try {
      const token = authStore.getToken();
      const res = await ApiService.getTasks(token || undefined);

      if (res && res.success && Array.isArray(res.tasks) && res.tasks.length > 0) {
        const mapped: TaskItem[] = res.tasks.map((t: any) => ({
          id: t._id || t.id,
          title: t.title,
          project: t.project?.title || "TeamUp Workspace",
          assignee: t.assignee?.name || authStore.getUser()?.name || "Sarah Lin",
          assigneeInitials: t.assignee?.avatarInitials || "SL",
          status: t.status || "todo",
          priority: t.priority || "Normal",
          deadline: t.deadline || "TBD",
        }));

        const combined = [...mapped];
        INITIAL_TASKS.forEach((sample) => {
          if (!combined.some((item) => item.title.toLowerCase() === sample.title.toLowerCase())) {
            combined.push(sample);
          }
        });
        setTasks(combined);
      }
    } catch {
      // Keep initial
    }
  };

  useEffect(() => {
    fetchLiveTasks();
  }, []);

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === "all") return true;
    return t.status === activeTab;
  });

  const toggleTaskStatus = async (id: string) => {
    const currentTask = tasks.find((t) => t.id === id);
    if (!currentTask) return;

    const nextStatus: "todo" | "in_progress" | "done" =
      currentTask.status === "todo"
        ? "in_progress"
        : currentTask.status === "in_progress"
        ? "done"
        : "todo";

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );

    // Persist to backend if token available or seed token
    try {
      let token = authStore.getToken();
      if (!token) {
        const loginRes = await ApiService.login("sarah@teamup.com", "password123");
        if (loginRes.success && loginRes.token && loginRes.user) {
          authStore.setSession(loginRes.token, loginRes.user);
          token = loginRes.token;
        }
      }
      if (token && id.length > 10) {
        await ApiService.updateTask(token, id, { status: nextStatus });
      }
    } catch {
      // Ignored
    }
  };

  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) {
      Alert.alert("Missing Information", "Please enter a task title.");
      return;
    }

    setSubmitting(true);
    try {
      let token = authStore.getToken();
      if (!token) {
        const loginRes = await ApiService.login("sarah@teamup.com", "password123");
        if (loginRes.success && loginRes.token && loginRes.user) {
          authStore.setSession(loginRes.token, loginRes.user);
          token = loginRes.token;
        }
      }

      if (!token) {
        Alert.alert("Authentication Required", "Please log in to add tasks.");
        setIsModalOpen(false);
        router.push("/login");
        return;
      }

      const res = await ApiService.createTask(token, {
        title: newTaskTitle.trim(),
        priority: newTaskPriority,
        deadline: newTaskDeadline.trim() || "TBD",
      });

      if (res && res.success && res.task) {
        const created: TaskItem = {
          id: res.task._id || `t_${Date.now()}`,
          title: res.task.title,
          project: res.task.project?.title || "TeamUp Workspace",
          assignee: authStore.getUser()?.name || "Sarah Lin",
          assigneeInitials: authStore.getUser()?.avatarInitials || "SL",
          status: "todo",
          priority: res.task.priority || newTaskPriority,
          deadline: res.task.deadline || newTaskDeadline,
        };

        setTasks((prev) => [created, ...prev]);
        setIsModalOpen(false);
        setNewTaskTitle("");

        Alert.alert(
          "Task Created! 🚀",
          "Your task has been saved in MongoDB! Refresh MongoDB Compass to see it in the 'tasks' collection."
        );
      } else {
        Alert.alert("Error", res.message || "Failed to create task in MongoDB.");
      }
    } catch (err: any) {
      Alert.alert("Connection Error", err.message || "Could not reach backend.");
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case "High":
        return { bg: "#FEE2E2", text: "#EF4444" };
      case "Medium":
        return { bg: "#FEF3C7", text: "#D97706" };
      default:
        return { bg: THEME.pastelSky, text: "#0284C7" };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Safe Area */}
      <View style={[styles.header, { paddingTop: topPadding + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={THEME.inkDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Board (Kanban)</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setIsModalOpen(true)}
        >
          <Ionicons name="add" size={22} color={THEME.white} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {[
          { key: "all", label: "All Tasks" },
          { key: "todo", label: "To Do" },
          { key: "in_progress", label: "In Progress" },
          { key: "done", label: "Completed" },
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

      {/* Task List */}
      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {filteredTasks.map((t) => {
          const priority = getPriorityStyle(t.priority);
          const isDone = t.status === "done";

          return (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.8}
              style={styles.taskCard}
              onPress={() => toggleTaskStatus(t.id)}
            >
              <View style={styles.cardTop}>
                <View style={[styles.priorityBadge, { backgroundColor: priority.bg }]}>
                  <Text style={[styles.priorityText, { color: priority.text }]}>
                    {t.priority} Priority
                  </Text>
                </View>

                <View style={styles.statusIndicator}>
                  <Ionicons
                    name={
                      t.status === "done"
                        ? "checkmark-circle"
                        : t.status === "in_progress"
                        ? "time"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={
                      t.status === "done"
                        ? THEME.successGreen
                        : t.status === "in_progress"
                        ? THEME.brandPink
                        : THEME.textMuted
                    }
                  />
                  <Text style={styles.statusLabel}>
                    {t.status === "done"
                      ? "Completed"
                      : t.status === "in_progress"
                      ? "In Progress"
                      : "Pending"}
                  </Text>
                </View>
              </View>

              <Text style={[styles.taskTitle, isDone && styles.taskDoneText]}>
                {t.title}
              </Text>
              <Text style={styles.projectName}>{t.project}</Text>

              <View style={styles.cardFooter}>
                <View style={styles.assigneeRow}>
                  <View style={styles.assigneeAvatar}>
                    <Text style={styles.assigneeInitials}>{t.assigneeInitials}</Text>
                  </View>
                  <Text style={styles.assigneeName}>{t.assignee}</Text>
                </View>

                <View style={styles.deadlineRow}>
                  <Ionicons name="calendar-outline" size={13} color={THEME.textSecondary} />
                  <Text style={styles.deadlineText}>{t.deadline}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* New Task Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Project Task</Text>
              <TouchableOpacity onPress={() => setIsModalOpen(false)}>
                <Ionicons name="close" size={24} color={THEME.inkDark} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Task Title *</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Implement Socket.io Real-time Chat"
              placeholderTextColor={THEME.textMuted}
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
            />

            <Text style={styles.inputLabel}>Priority</Text>
            <View style={styles.priorityRow}>
              {(["High", "Medium", "Normal"] as const).map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityBtn,
                    newTaskPriority === p && styles.priorityBtnActive,
                  ]}
                  onPress={() => setNewTaskPriority(p)}
                >
                  <Text
                    style={[
                      styles.priorityBtnText,
                      newTaskPriority === p && styles.priorityBtnTextActive,
                    ]}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Deadline</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. Tomorrow, Nov 20, 2026"
              placeholderTextColor={THEME.textMuted}
              value={newTaskDeadline}
              onChangeText={setNewTaskDeadline}
            />

            <TouchableOpacity
              style={styles.modalSubmitBtn}
              onPress={handleCreateTask}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color={THEME.white} />
              ) : (
                <Text style={styles.modalSubmitText}>Save to MongoDB 🚀</Text>
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
  addBtn: {
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
    gap: 12,
    paddingBottom: 30,
  },
  taskCard: {
    backgroundColor: THEME.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    shadowColor: THEME.inkDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: "800",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.textSecondary,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.inkDark,
    marginBottom: 4,
    lineHeight: 21,
  },
  taskDoneText: {
    textDecorationLine: "line-through",
    color: THEME.textMuted,
  },
  projectName: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.brandPink,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorderSubtle,
    paddingTop: 10,
  },
  assigneeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  assigneeAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: THEME.accentLavender,
    justifyContent: "center",
    alignItems: "center",
  },
  assigneeInitials: {
    fontSize: 10,
    fontWeight: "800",
    color: THEME.brandPurple,
  },
  assigneeName: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.inkDark,
  },
  deadlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  deadlineText: {
    fontSize: 11,
    fontWeight: "600",
    color: THEME.textSecondary,
  },

  // Modal Styles
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
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
  priorityRow: {
    flexDirection: "row",
    gap: 10,
  },
  priorityBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    alignItems: "center",
    backgroundColor: THEME.canvasLight,
  },
  priorityBtnActive: {
    backgroundColor: THEME.brandPink,
    borderColor: THEME.brandPink,
  },
  priorityBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.textSecondary,
  },
  priorityBtnTextActive: {
    color: THEME.white,
  },
  modalSubmitBtn: {
    backgroundColor: THEME.brandPink,
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
});
