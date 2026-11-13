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
import { COLORS } from "../constants/colors";
import { ApiService, API_BASE_URL } from "../src/services/api";
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
  const [role, setRole] = useState<"Team Member" | "Project Leader">("Team Member");
  const [university, setUniversity] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if backend server is reachable on screen load
    ApiService.checkHealth().then((res) => {
      setBackendOnline(res.online);
    });
  }, []);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert(
        "Missing Information",
        "Please provide your full name, email, and password."
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
    const skillsList = skills
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : ["React Native", "TypeScript"];

    try {
      const res = await ApiService.register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
        university: university.trim() || "University Student",
        skills: skillsList,
      });

      if (res && res.success && res.token && res.user) {
        authStore.setSession(res.token, res.user);
        Alert.alert(
          "Account Created! 🎉",
          `Welcome to TeamUp, ${res.user.name || name}! Your data is saved into MongoDB.`,
          [
            {
              text: "Explore Projects",
              onPress: () => router.push("/projects"),
            },
          ]
        );
      } else {
        // If connection failed (e.g. NoRouteToHostException, host unreachable, offline)
        const errMsg = (res.message || "").toLowerCase();
        const isNetworkErr =
          errMsg.includes("fetch failed") ||
          errMsg.includes("unreachable") ||
          errMsg.includes("noroutetohost") ||
          errMsg.includes("network") ||
          errMsg.includes("timed out") ||
          errMsg.includes("connect");

        if (isNetworkErr) {
          // Graceful fallback: Activate session locally so user can test without being blocked
          const initials =
            name.trim().split(" ").length > 1
              ? (name.trim().split(" ")[0][0] + name.trim().split(" ")[1][0]).toUpperCase()
              : name.trim().substring(0, 2).toUpperCase();

          const fallbackUser = {
            id: `usr_${Date.now()}`,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            role,
            university: university.trim() || "University Student",
            skills: skillsList,
            rating: 5.0,
            reviewCount: 0,
            avatarInitials: initials,
          };

          authStore.setSession("local_offline_token", fallbackUser);

          Alert.alert(
            "Account Created (Local Session) 📱",
            `Welcome, ${name.trim()}!\n\nNote: PC-te backend server chalu nai ba firewall e port 5000 block ase.\n\nApmar account app e save hoyese jate apni sob features test korte paren.\n\nMongoDB te live save korte PC te 'npm run dev' chalu rakhun!`,
            [
              {
                text: "Continue to App",
                onPress: () => router.push("/projects"),
              },
            ]
          );
        } else {
          Alert.alert("Notice", res.message || "Registration failed.");
        }
      }
    } catch (err: any) {
      // Offline fallback
      const initials = name.trim().substring(0, 2).toUpperCase();
      authStore.setSession("local_offline_token", {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        university: university.trim() || "University Student",
        skills: skillsList,
        rating: 5.0,
        avatarInitials: initials,
      });

      Alert.alert(
        "Welcome to TeamUp! 📱",
        "Backend server offline thakleo apnar local session start hoyese. Apni sob screens test korte parben!",
        [{ text: "Continue", onPress: () => router.push("/projects") }]
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
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>
        Team<Text style={styles.accent}>Up</Text>
      </Text>

      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Join TeamUp, connect with top collaborators, and store your profile in MongoDB.
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
            : `Backend: ${backendOnline === false ? "Offline (Start 'npm run dev')" : "Connecting..."}`}
        </Text>
      </View>

      {/* Role Selector */}
      <View style={styles.roleContainer}>
        <Text style={styles.roleLabel}>I am joining as:</Text>
        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[styles.roleBtn, role === "Team Member" && styles.roleBtnActive]}
            onPress={() => setRole("Team Member")}
          >
            <Text style={[styles.roleBtnText, role === "Team Member" && styles.roleBtnTextActive]}>
              Team Member
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleBtn, role === "Project Leader" && styles.roleBtnActive]}
            onPress={() => setRole("Project Leader")}
          >
            <Text style={[styles.roleBtnText, role === "Project Leader" && styles.roleBtnTextActive]}>
              Project Leader
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Full name (e.g. Sadia Rimi)"
        placeholderTextColor={COLORS.textSecondary}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email address (e.g. user@buet.ac.bd)"
        placeholderTextColor={COLORS.textSecondary}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="University / College (e.g. BUET, DU, NSU)"
        placeholderTextColor={COLORS.textSecondary}
        value={university}
        onChangeText={setUniversity}
      />

      <TextInput
        style={styles.input}
        placeholder="Skills (comma-separated, e.g. Java, React, Figma)"
        placeholderTextColor={COLORS.textSecondary}
        value={skills}
        onChangeText={setSkills}
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

  back: {
    color: COLORS.primary,
    fontWeight: "700",
    marginBottom: 20,
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

  roleContainer: {
    marginBottom: 16,
  },

  roleLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 8,
  },

  roleRow: {
    flexDirection: "row",
    gap: 10,
  },

  roleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },

  roleBtnActive: {
    borderColor: COLORS.primary,
    backgroundColor: "#EEF2FF",
  },

  roleBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },

  roleBtnTextActive: {
    color: COLORS.primary,
    fontWeight: "800",
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 13,
    marginBottom: 12,
    color: COLORS.text,
    backgroundColor: "#F9FAFB",
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
