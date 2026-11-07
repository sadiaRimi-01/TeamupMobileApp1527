import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { THEME } from "../src/constants/theme";

interface NotificationItem {
  id: string;
  type: "invite" | "task" | "review" | "chat";
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "n1",
    type: "invite",
    title: "Team Invitation Received",
    desc: "Tanvir Ahmed invited you to join 'AI-Powered Smart Campus Navigation' as Mobile Lead.",
    time: "10 mins ago",
    unread: true,
    icon: "mail-unread-outline",
    color: THEME.brandPink,
  },
  {
    id: "n2",
    type: "task",
    title: "New Task Assigned",
    desc: "Sarah Lin assigned you to 'Implement JWT Authentication & User Roles'.",
    time: "1 hour ago",
    unread: true,
    icon: "checkbox-outline",
    color: THEME.accentViolet,
  },
  {
    id: "n3",
    type: "review",
    title: "5-Star Rating Received!",
    desc: "David Chen left a 5.0 rating and feedback on your completed HealthCare prototype milestone.",
    time: "Yesterday",
    unread: false,
    icon: "star",
    color: "#F59E0B",
  },
  {
    id: "n4",
    type: "chat",
    title: "New Team Message",
    desc: "Sarah Lin: 'Hey team! I just completed the Spring Boot REST API for project recruitment.'",
    time: "2 days ago",
    unread: false,
    icon: "chatbubble-ellipses-outline",
    color: THEME.accentCyan,
  },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight || 28) : 0
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPadding + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={THEME.inkDark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.backBtn}>
          <Ionicons name="checkmark-done-outline" size={20} color={THEME.brandPink} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS.map((item) => (
          <View
            key={item.id}
            style={[styles.notifCard, item.unread && styles.unreadCard]}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.color + "18" }]}>
              <Ionicons name={item.icon} size={20} color={item.color} />
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.topRow}>
                <Text style={styles.title}>{item.title}</Text>
                {item.unread && <View style={styles.unreadDot} />}
              </View>

              <Text style={styles.desc}>{item.desc}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        ))}
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
  listContent: {
    padding: 16,
    gap: 12,
  },
  notifCard: {
    flexDirection: "row",
    backgroundColor: THEME.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    gap: 12,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: THEME.brandPink,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: THEME.inkDark,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: THEME.brandPink,
  },
  desc: {
    fontSize: 13,
    lineHeight: 18,
    color: THEME.textSecondary,
    marginBottom: 6,
  },
  time: {
    fontSize: 11,
    color: THEME.textMuted,
    fontWeight: "600",
  },
});
