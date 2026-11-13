import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { THEME } from "../src/constants/theme";
import { authStore } from "../src/services/authStore";

interface ChatMessage {
  id: string;
  sender: string;
  senderInitials: string;
  text: string;
  time: string;
  isMe: boolean;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    sender: "Sarah Lin",
    senderInitials: "SL",
    text: "Hey team! I just completed the Spring Boot REST API for project recruitment.",
    time: "10:14 AM",
    isMe: false,
  },
  {
    id: "m2",
    sender: "David Chen",
    senderInitials: "DC",
    text: "Awesome! I've updated the Figma mobile designs and pushed the updated color system.",
    time: "10:18 AM",
    isMe: false,
  },
  {
    id: "m3",
    sender: "You",
    senderInitials: "ME",
    text: "Great work everyone! I'll test the mobile app on Android right now.",
    time: "10:20 AM",
    isMe: true,
  },
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight || 28) : 0
  );

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isAuth, setIsAuth] = useState<boolean>(authStore.isAuthenticated());

  useEffect(() => {
    setIsAuth(authStore.isAuthenticated());
    const unsub = authStore.subscribe(() => {
      setIsAuth(authStore.isAuthenticated());
    });
    return unsub;
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: "You",
      senderInitials: "ME",
      text: inputText.trim(),
      time: "Just now",
      isMe: true,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
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
            "Team Chat" is a protected workspace. Please sign in or register to communicate with your project members in real-time.
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

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Smart Campus Team</Text>
          <Text style={styles.headerStatus}>3 members online</Text>
        </View>

        <TouchableOpacity style={styles.infoBtn}>
          <Ionicons name="ellipsis-vertical" size={20} color={THEME.inkDark} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        {/* Messages list */}
        <ScrollView
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                msg.isMe ? styles.myMessageRow : styles.otherMessageRow,
              ]}
            >
              {!msg.isMe && (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{msg.senderInitials}</Text>
                </View>
              )}

              <View
                style={[
                  styles.bubble,
                  msg.isMe ? styles.myBubble : styles.otherBubble,
                ]}
              >
                {!msg.isMe && <Text style={styles.senderName}>{msg.sender}</Text>}
                <Text
                  style={[
                    styles.messageText,
                    msg.isMe ? styles.myMessageText : styles.otherMessageText,
                  ]}
                >
                  {msg.text}
                </Text>
                <Text
                  style={[
                    styles.timeText,
                    msg.isMe ? styles.myTimeText : styles.otherTimeText,
                  ]}
                >
                  {msg.time}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message to your team..."
            placeholderTextColor={THEME.textMuted}
            value={inputText}
            onChangeText={setInputText}
          />
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={handleSend}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={17} color={THEME.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: THEME.inkDark,
  },
  headerStatus: {
    fontSize: 11,
    color: THEME.successGreen,
    fontWeight: "600",
  },
  infoBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  messagesList: {
    padding: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  myMessageRow: {
    justifyContent: "flex-end",
  },
  otherMessageRow: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.accentViolet,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: THEME.white,
    fontSize: 11,
    fontWeight: "900",
  },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myBubble: {
    backgroundColor: THEME.brandPink,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: THEME.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  senderName: {
    fontSize: 11,
    fontWeight: "800",
    color: THEME.brandPink,
    marginBottom: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  myMessageText: {
    color: THEME.white,
    fontWeight: "500",
  },
  otherMessageText: {
    color: THEME.inkDark,
  },
  timeText: {
    fontSize: 9,
    alignSelf: "flex-end",
    marginTop: 4,
  },
  myTimeText: {
    color: "rgba(255,255,255,0.7)",
  },
  otherTimeText: {
    color: THEME.textMuted,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.white,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: THEME.cardBorder,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: THEME.canvasLight,
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 44,
    fontSize: 13,
    color: THEME.inkDark,
    borderWidth: 1,
    borderColor: THEME.cardBorderSubtle,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: THEME.brandPink,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: THEME.brandPink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
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
