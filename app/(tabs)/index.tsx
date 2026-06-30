// ─────────────────────────────────────────────────────────────────────────────
//  Entry route — role switch (Phase 4, minimal)
//  Renders the consumer app (HomeScreen + its own bottom-tab switching) or the
//  provider app (AppNavigator) based on the active role. Previously this file
//  rendered only HomeScreen, leaving the provider app unreachable.
//
//  The screen internals are unchanged — this only chooses which sub-app mounts.
//  A small dev-only toggle (visible when __DEV__) lets you flip roles without
//  auth wired up yet. Remove/replace it once real auth drives the role.
// ─────────────────────────────────────────────────────────────────────────────

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform } from "react-native";

import { useRole } from "@/src/context/RoleContext";
import HomeScreen from "../consumer/src/screens/1_statsLanding";
import AppNavigator from "../provider/src/navigation/AppNavigator";

export default function Root() {
  const { role, toggleRole } = useRole();

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
