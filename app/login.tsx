import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { COLORS } from "../constants/colors";
import { ApiService } from "../src/services/api";
import { authStore } from "../src/services/authStore";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight || 28) : 0
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(
        "Missing Information",
        "Please enter your email and password."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await ApiService.login(email.trim(), password);

      if (res && res.success && res.token && res.user) {
        authStore.setSession(res.token, res.user);
        Alert.alert(
          "Login Successful! 🎉",
          `Welcome back, ${res.user?.name || "Member"}! (${res.user?.role})`,
          [
            {
              text: "Explore Projects",
              onPress: () => router.push("/projects"),
            },
          ]
        );
      } else {
        Alert.alert(
          "Notice",
          res.message || "Invalid credentials or backend server is not responding."
        );
      }
    } catch (err: any) {
      Alert.alert("Connection Error", "Backend server is currently offline.");
    } finally {
      setLoading(false);
    }
  };

  const fillQuickTest = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { paddingTop: topPadding + 20 }]}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>
        Team<Text style={styles.accent}>Up</Text>
      </Text>

      <Text style={styles.title}>Welcome Back</Text>

      <Text style={styles.subtitle}>
        Login to continue collaborating & managing tasks.
      </Text>

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
        placeholder="Password"
        placeholderTextColor={COLORS.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      {/* Quick Test Demo Credentials */}
      <View style={styles.quickBox}>
        <Text style={styles.quickTitle}>Quick Seed Accounts (1-Tap Fill):</Text>
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={styles.quickPill}
            onPress={() => fillQuickTest("sarah@teamup.com", "password123")}
          >
            <Text style={styles.quickPillText}>Sarah Lin (Leader)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickPill}
            onPress={() => fillQuickTest("david@teamup.com", "password123")}
          >
            <Text style={styles.quickPillText}>David Chen (Member)</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.register}>
          Don't have an account? <Text style={styles.accent}>Register</Text>
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
    marginBottom: 25,
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
    marginTop: 20,
  },

  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    marginTop: 8,
    marginBottom: 25,
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
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 20,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
  },

  quickBox: {
    backgroundColor: "#F3F4F6",
    padding: 12,
    borderRadius: 10,
    marginBottom: 24,
  },

  quickTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 8,
  },

  quickRow: {
    flexDirection: "row",
    gap: 8,
  },

  quickPill: {
    backgroundColor: COLORS.white,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  quickPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.primary,
  },

  register: {
    textAlign: "center",
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
});
