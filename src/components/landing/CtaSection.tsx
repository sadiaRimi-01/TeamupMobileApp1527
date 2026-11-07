import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { THEME } from "../../constants/theme";
import Button from "../common/Button";

export default function CtaSection() {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("Student");
  const [submitted, setSubmitted] = useState(false);

  const roles = ["Student", "Developer", "Designer", "Researcher", "Startup"];

  const handleJoin = () => {
    if (!email || !email.includes("@")) {
      Alert.alert(
        "Invalid Email",
        "Please enter a valid university or personal email address."
      );
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      Alert.alert(
        "Welcome to TeamUp! 🎉",
        `You have been registered for Early Access as a ${selectedRole}. Check your inbox soon!`
      );
    }, 200);
  };

  return (
    <View style={styles.container}>
      <View style={styles.darkCard}>
        {/* Decorative ambient blur light */}
        <View style={styles.ambientGlow} />

        <View style={styles.badge}>
          <Ionicons name="rocket-outline" size={13} color={THEME.brandPink} />
          <Text style={styles.badgeText}>GET STARTED TODAY</Text>
        </View>

        <Text style={styles.title}>
          Ready to build something{"\n"}
          <Text style={styles.pinkText}>amazing together?</Text>
        </Text>

        <Text style={styles.subtitle}>
          Join thousands of students and developers already building verified
          teams, shipping capstones, and winning hackathons.
        </Text>

        {/* Role Pills */}
        <View style={styles.rolePickerWrapper}>
          <Text style={styles.rolePickerLabel}>I AM A:</Text>
          <View style={styles.rolesRow}>
            {roles.map((r) => {
              const isSelected = selectedRole === r;
              return (
                <TouchableOpacity
                  key={r}
                  activeOpacity={0.8}
                  style={[styles.rolePill, isSelected && styles.rolePillActive]}
                  onPress={() => setSelectedRole(r)}
                >
                  <Text
                    style={[
                      styles.rolePillText,
                      isSelected && styles.rolePillTextActive,
                    ]}
                  >
                    {r}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Email form */}
        <View style={styles.formWrap}>
          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={18} color="#9E9EAE" />
            <TextInput
              style={styles.input}
              placeholder="Enter your university or personal email..."
              placeholderTextColor="#7A7A90"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <Button
            title={submitted ? "Joined Early Access ✓" : "Join Early Access →"}
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleJoin}
          />
        </View>

        <View style={styles.directLinksRow}>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.directLink}>Create full account instead</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 36,
    paddingHorizontal: 16,
    backgroundColor: THEME.canvasLight,
  },
  darkCard: {
    backgroundColor: THEME.inkDark,
    borderRadius: 24,
    padding: 24,
    overflow: "hidden",
    position: "relative",
    shadowColor: THEME.inkDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 6,
  },
  ambientGlow: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(234, 76, 137, 0.25)",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "900",
    color: THEME.brandPink,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: THEME.white,
    lineHeight: 36,
    letterSpacing: -0.6,
  },
  pinkText: {
    color: THEME.brandPink,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: "rgba(255,255,255,0.7)",
    marginTop: 12,
    marginBottom: 20,
  },
  rolePickerWrapper: {
    marginBottom: 16,
  },
  rolePickerLabel: {
    fontSize: 10,
    fontWeight: "900",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1,
    marginBottom: 8,
  },
  rolesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  rolePill: {
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  rolePillActive: {
    backgroundColor: THEME.brandPink,
    borderColor: THEME.brandPink,
  },
  rolePillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
  },
  rolePillTextActive: {
    color: THEME.white,
  },
  formWrap: {
    gap: 12,
    marginTop: 6,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    gap: 10,
  },
  input: {
    flex: 1,
    height: 48,
    color: THEME.white,
    fontSize: 14,
    fontWeight: "600",
  },
  directLinksRow: {
    alignItems: "center",
    marginTop: 16,
  },
  directLink: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});

