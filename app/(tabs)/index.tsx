// ─────────────────────────────────────────────────────────────────────────────
//  Entry route — Unified Auth & Role Navigation
//  Renders UnifiedAuthScreen when unauthenticated (and not guest),
//  or conditionally mounts HomeScreen (consumer) or AppNavigator (provider)
//  when authenticated or in guest browsing mode.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from "react-native";

import { useRole, getSavedRole } from "@/src/context/RoleContext";
import { useAppSelector, useAppDispatch } from "@/src/redux/store";
import { authLoginSuccess } from "@/src/redux/actions/appActions";
import { authApi } from "@/src/services/api/endpoints/auth";
import { getStoredToken, clearStoredTokens } from "@/src/services/api/client";
import { isManualLoggedInSession, isLoggedOutInSession } from "@/src/services/devAutoLogin";

import UnifiedAuthScreen from "@/src/screens/auth/UnifiedAuthScreen";
import HomeScreen from "../consumer/src/screens/1_statsLanding";
import AppNavigator from "../provider/src/navigation/AppNavigator";

export default function Root() {
  const dispatch = useAppDispatch();
  const { role, setRole, toggleRole, isGuest } = useRole();
  const { isLoggedIn } = useAppSelector((s) => s.consumer.auth);

  const [checkingSession, setCheckingSession] = useState(true);

  // Check saved session & role on app launch
  useEffect(() => {
    let mounted = true;

    async function restoreSession() {
      try {
        const [savedRole, storedToken] = await Promise.all([
          getSavedRole(),
          getStoredToken(),
        ]);

        if (savedRole && mounted) {
          setRole(savedRole);
        }

        if (storedToken && !isLoggedIn && !isManualLoggedInSession() && !isLoggedOutInSession()) {
          try {
            const profile = await authApi.me(storedToken);
            if (mounted && profile && !isManualLoggedInSession() && !isLoggedOutInSession()) {
              dispatch(authLoginSuccess({ user: profile, token: storedToken }));
            }
          } catch {
            // Expired or invalid token
            await clearStoredTokens();
          }
        }
      } catch (err) {
        console.warn("[Root Navigation] Session restoration error:", err);
      } finally {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    }

    restoreSession();

    return () => {
      mounted = false;
    };
  }, []);

  // Brief initial splash loader
  if (checkingSession) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  // Unauthenticated and not in guest browsing mode -> show Unified Auth Screen
  if (!isLoggedIn && !isGuest) {
    return <UnifiedAuthScreen />;
  }

  // Authenticated (or Guest) -> Render active role's application
  return (
    <View style={styles.fill}>
      {role === "consumer" ? <HomeScreen /> : <AppNavigator />}

      {__DEV__ && (
        <TouchableOpacity
          style={styles.devToggle}
          onPress={toggleRole}
          activeOpacity={0.8}
          accessibilityLabel="Toggle consumer/provider role (dev only)"
        >
          <Text style={styles.devToggleText}>
            {role === "consumer" ? "▶ Provider" : "◀ Consumer"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0A0F1D",
    alignItems: "center",
    justifyContent: "center",
  },
  devToggle: {
    position: "absolute",
    right: 12,
    top: Platform.OS === "ios" ? 58 : 38,
    backgroundColor: "rgba(11,15,26,0.82)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    zIndex: 9999,
  },
  devToggleText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
