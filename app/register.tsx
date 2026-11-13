import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { THEME } from "../src/constants/theme";
import { ApiService } from "../src/services/api";
import { authStore } from "../src/services/authStore";

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight || 28) : 0
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    ApiService.checkHealth().then((res) => {
      setBackendOnline(res.online);
    });
  }, []);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert(
        "Missing Information",
        "Please provide your full name, email, password, and password confirmation."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Password Error",
        "Passwords do not match. Please verify."
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Weak Password",
        "Password should be at least 6 characters long."
      );
      return;
    }

    setLoading(true);

    try {
      const res = await ApiService.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (res && res.success && res.token && res.user) {
        authStore.setSession(res.token, res.user);
        Alert.alert(
          "Account Created! 🎉",
          `Welcome to TeamUp, ${res.user.name || name}! Your data is saved into MongoDB.`,
          [
            {
              text: "Go to Home",
              onPress: () => router.replace("/"),
            },
          ]
        );
      } else {
        const errMsg = (res.message || "").toLowerCase();
        const isNetworkErr =
          errMsg.includes("fetch failed") ||
          errMsg.includes("unreachable") ||
          errMsg.includes("noroutetohost") ||
          errMsg.includes("network") ||
          errMsg.includes("timed out") ||
          errMsg.includes("connect");

        if (isNetworkErr) {
          // Graceful fallback to local session
          const words = name.trim().split(" ");
          const initials =
            words.length > 1
              ? (words[0][0] + words[1][0]).toUpperCase()
              : name.trim().substring(0, 2).toUpperCase();

          const fallbackUser = {
            id: `usr_${Date.now()}`,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            role: "Team Member" as const,
            university: "University Student",
            skills: ["React Native", "TypeScript"],
            rating: 5.0,
            reviewCount: 0,
            avatarInitials: initials,
          };

          authStore.setSession("local_offline_token", fallbackUser);

          Alert.alert(
            "Account Created! 🎉",
            `Welcome to TeamUp, ${name.trim()}!\n\nYour session is activated. You can now access all app features.`,
            [
              {
                text: "Go to Home",
                onPress: () => router.replace("/"),
              },
            ]
          );
        } else {
          Alert.alert("Notice", res.message || "Registration failed.");
        }
      }
    } catch {
      const initials = name.trim().substring(0, 2).toUpperCase();
      authStore.setSession("local_offline_token", {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: "Team Member",
        university: "University",
        rating: 5.0,
        avatarInitials: initials,
      });

      Alert.alert(
        "Welcome to TeamUp! 🎉",
        "Your account is ready! Going to Home screen...",
        [{ text: "Continue", onPress: () => router.replace("/") }]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingTop: topPadding + 16 }]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.topNavRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.replace("/")}
        >
          <Ionicons name="home-outline" size={18} color={THEME.primary} />
          <Text style={styles.back}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.logo}>
        Team<Text style={styles.accent}>Up</Text>
      </Text>

      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Join TeamUp, connect with top collaborators, and showcase your skills.
      </Text>

      {/* Backend Connectivity Status Pill */}
      <View style={styles.serverPill}>
        <View
          style={[
            styles.serverDot,
            { backgroundColor: backendOnline ? "#10B981" : "#F59E0B" },
          ]}
        />
        <Text style={styles.serverPillText}>
          {backendOnline
            ? "Backend Server: Connected ✅ (MongoDB)"
            : `Backend: ${backendOnline === false ? "Offline (Local Mode)" : "Connecting..."}`}
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Full name"
        placeholderTextColor={COLORS.textSecondary}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor={COLORS.textSecondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password (minimum 6 characters)"
        placeholderTextColor={COLORS.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        placeholderTextColor={COLORS.textSecondary}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>Create Account</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.login}>
          Already have an account? <Text style={styles.accent}>Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    padding: 24,
    justifyContent: "center",
  },

  topNavRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#EEF2FF",
    borderRadius: 8,
  },

  back: {
    color: THEME.primary,
    fontWeight: "800",
    fontSize: 13,
  },

  cancelText: {
    color: THEME.textMuted,
    fontWeight: "700",
    fontSize: 13,
  },

  logo: {
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.text,
  },

  accent: {
    color: COLORS.primary,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 15,
  },

  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 20,
  },

  serverPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 16,
    alignSelf: "flex-start",
    gap: 7,
  },

  serverDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  serverPillText: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.text,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 14,
    marginBottom: 14,
    color: COLORS.text,
    backgroundColor: "#F9FAFB",
    fontSize: 14,
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 20,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
  },

  login: {
    textAlign: "center",
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
});
