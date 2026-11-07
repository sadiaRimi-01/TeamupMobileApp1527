import React, { useState } from "react";
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

interface TaskItem {
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

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === "all") return true;
    return t.status === activeTab;
  });

  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus =
            t.status === "todo" ? "in_progress" : t.status === "in_progress" ? "done" : "todo";
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
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
          onPress={() =>
            Alert.alert("New Task", "Assign a new task to team members with a deadline.")
          }
        >
          <Ionicons name="add" size={20} color={THEME.white} />
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
    padding: 18,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    shadowColor: THEME.inkDark,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
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
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: "800",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statusLabel: {
    fontSize: 11,
    color: THEME.textSecondary,
    fontWeight: "600",
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.inkDark,
    lineHeight: 20,
    marginBottom: 4,
  },
  taskDoneText: {
    textDecorationLine: "line-through",
    color: THEME.textMuted,
  },
  projectName: {
    fontSize: 12,
    color: THEME.textMuted,
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
    backgroundColor: THEME.accentViolet,
    justifyContent: "center",
    alignItems: "center",
  },
  assigneeInitials: {
    fontSize: 9,
    fontWeight: "900",
    color: THEME.white,
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
    color: THEME.textSecondary,
    fontWeight: "600",
  },
});
