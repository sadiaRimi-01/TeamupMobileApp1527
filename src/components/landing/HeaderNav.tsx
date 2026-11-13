import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { THEME } from "../../constants/theme";
import TeamUpLogo from "../common/TeamUpLogo";
import Button from "../common/Button";
import { authStore, AuthUser } from "../../services/authStore";

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
  const insets = useSafeAreaInsets();
  const handleLogin = onLoginPress || (() => router.push("/login"));
  const handleRegister = onRegisterPress || (() => router.push("/register"));

  const [user, setUser] = useState<AuthUser | null>(authStore.getUser());
  const [isAuth, setIsAuth] = useState<boolean>(authStore.isAuthenticated());

  useEffect(() => {
    setUser(authStore.getUser());
    setIsAuth(authStore.isAuthenticated());

    const unsub = authStore.subscribe(() => {
      setUser(authStore.getUser());
      setIsAuth(authStore.isAuthenticated());
    });
    return unsub;
  }, []);

  const topPadding = Math.max(
    insets.top,
    Platform.OS === "android" ? (StatusBar.currentHeight || 28) : 0
  );

  return (
    <View style={[styles.safeWrapper, { paddingTop: topPadding }]}>
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
          {isAuth && user ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.userProfilePill}
              onPress={() => router.push("/profile")}
            >
              <View style={styles.userInitialCircle}>
                <Text style={styles.userInitialText}>
                  {user.avatarInitials || user.name.substring(0, 2).toUpperCase()}
                </Text>
              </View>
              <Text style={styles.userPillName} numberOfLines={1}>
                {user.name.split(" ")[0]}
              </Text>
            </TouchableOpacity>
          ) : (
            <>
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
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeWrapper: {
    backgroundColor: THEME.white,
    borderBottomWidth: 1,
    borderBottomColor: THEME.cardBorder,
    shadowColor: THEME.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 3,
    zIndex: 10,
  },
  container: {
    height: 60,
    backgroundColor: THEME.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
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
    gap: 10,
  },
  loginTextBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  loginText: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.inkDark,
  },
  userProfilePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#EEF2FF",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  userInitialCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: THEME.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  userInitialText: {
    color: THEME.white,
    fontSize: 11,
    fontWeight: "900",
  },
  userPillName: {
    color: THEME.primary,
    fontWeight: "800",
    fontSize: 13,
    maxWidth: 90,
  },
});
