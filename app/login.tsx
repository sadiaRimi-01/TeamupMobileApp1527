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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { router } from "expo-router";

import { COLORS } from "../constants/colors";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const topPadding = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight || 28) : 0
  );

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert(
        "Missing Information",
        "Please enter your email and password."
      );

      return;
    }

    Alert.alert(
      "Frontend Demo",
      "Backend authentication will be connected later."
    );
  };

  return (
    <View style={[styles.container, { paddingTop: topPadding + 20 }]}>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.back}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.logo}>
        Team<Text style={styles.accent}>Up</Text>
      </Text>

      <Text style={styles.title}>Welcome Back</Text>

      <Text style={styles.subtitle}>
        Login to continue collaborating.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/register")}
      >
        <Text style={styles.register}>
          Don't have an account?{" "}
          <Text style={styles.accent}>Register</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 24,
    justifyContent: "center",
  },

  back: {
    color: COLORS.primary,
    fontWeight: "700",
    marginBottom: 35,
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
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.text,
    marginTop: 35,
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
  },

  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 5,
    marginBottom: 25,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: "800",
    fontSize: 16,
  },

  register: {
    textAlign: "center",
    color: COLORS.textSecondary,
  },
});