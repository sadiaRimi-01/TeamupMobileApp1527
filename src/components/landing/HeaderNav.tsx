import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { THEME } from "../../constants/theme";
import TeamUpLogo from "../common/TeamUpLogo";
import Button from "../common/Button";

interface HeaderNavProps {
  onMenuPress: () => void;
  onLoginPress?: () => void;
  onRegisterPress?: () => void;
}

export default function HeaderNav({
  onMenuPress,
  onLoginPress,
  onRegisterPress,
}: HeaderNavProps) {
  const handleLogin = onLoginPress || (() => router.push("/login"));
  const handleRegister = onRegisterPress || (() => router.push("/register"));

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.menuButton}
          onPress={onMenuPress}
        >
          <Ionicons name="menu-outline" size={24} color={THEME.inkDark} />
        </TouchableOpacity>

        <TeamUpLogo size={32} />
      </View>

      <View style={styles.right}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.loginTextBtn}
          onPress={handleLogin}
        >
          <Text style={styles.loginText}>Sign In</Text>
        </TouchableOpacity>

        <Button
          title="Join"
          size="sm"
          variant="primary"
          onPress={handleRegister}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: THEME.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: THEME.canvasLight,
    justifyContent: "center",
    alignItems: "center",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  loginTextBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  loginText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.textPrimary,
  },
});

