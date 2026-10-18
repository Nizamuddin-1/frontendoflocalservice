/**
 * ProfileScreen.tsx — LocalFix Consumer App
 *
 * Phase 3 (modularization): the inline components (HeroAvatar, LoyaltyBar,
 * MenuItemRow, MenuSectionCard, EditProfileModal), the DEFAULT_TOGGLES state,
 * design tokens, types, mock data and the shared StyleSheet were extracted to
 * src/. This screen now composes the profile feature components. UI & behavior
 * unchanged.
 *   • Components / styles / tokens / DEFAULT_TOGGLES → @/src/components/profile
 *   • Mock data                                       → @/src/services/mock
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Animated,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  C,
  F,
  styles,
  DEFAULT_TOGGLES,
  HeroAvatar,
  LoyaltyBar,
  MenuSectionCard,
  EditProfileModal,
} from "@/src/components/profile";
import type { ToggleKey } from "@/src/components/profile";
import { MENU_SECTIONS } from "@/src/services/mock";
import { useAppSelector, useAppDispatch } from "@/src/redux/store";
import { fetchProfile } from "@/src/redux/actions/appActions";

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((s) => s.consumer.profile);
  const [toggles, setToggles] = useState(DEFAULT_TOGGLES);
  const [showEdit, setShowEdit] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleToggle = (key: ToggleKey) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Header fade-in on scroll
  const headerBgOpacity = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.screen}>
      {/* ── Status bar dark since hero is now white ── */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Floating Nav ── */}
      <View style={styles.floatingNav} pointerEvents="box-none">
        <Animated.View style={[styles.floatingNavBg, { opacity: headerBgOpacity }]} />
        <TouchableOpacity style={styles.navBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={22} color={C.navy} />
        </TouchableOpacity>
        <Text style={[styles.navTitle, { fontFamily: F.displaySemi }]}>Profile</Text>
        <TouchableOpacity
          style={styles.navBtn}
          onPress={() => setShowEdit(true)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="create-outline" size={20} color={C.navy} />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
            <Text style={{ fontFamily: F.bodyReg, color: C.slateLight }}>Loading profile...</Text>
          </View>
        ) : (
          <>
            {/* ── Hero Section ── */}
            <View style={styles.hero}>
          {/* Decorative elements — toned for light bg */}
          <View style={styles.heroCircle1} />
          <View style={styles.heroCircle2} />
          <View style={styles.heroCircle3} />
          {/* Grid lines */}
          <View style={styles.heroGridLine1} />
          <View style={styles.heroGridLine2} />

          {/* Avatar */}
          <View style={styles.heroContent}>
            <HeroAvatar name={user?.name ?? "User"} tier={user?.tier ?? ""} />

            {/* Name & Info */}
            <Text style={[styles.heroName, { fontFamily: F.displayBold }]}>{user?.name ?? "User"}</Text>
            <View style={styles.heroMetaRow}>
              <Ionicons name="location-outline" size={13} color={C.slate} />
              <Text style={[styles.heroMeta, { fontFamily: F.bodyReg }]}>{user?.location ?? ""}</Text>
            </View>
            <View style={styles.heroMetaRow}>
              <Ionicons name="calendar-outline" size={13} color={C.slate} />
              <Text style={[styles.heroMeta, { fontFamily: F.bodyReg }]}>Member since {user?.memberSince ?? ""}</Text>
            </View>

            {/* Verification chips */}
            <View style={styles.heroChipsRow}>
              <View style={[styles.heroChip, { borderColor: "rgba(16,185,129,0.35)", backgroundColor: C.greenBg }]}>
                <Ionicons name="shield-checkmark" size={11} color={C.green} />
                <Text style={[styles.heroChipText, { fontFamily: F.bodySemi, color: C.green }]}>Verified</Text>
              </View>
              <View style={[styles.heroChip, { borderColor: "rgba(212,168,83,0.45)", backgroundColor: C.amberBg }]}>
                <MaterialCommunityIcons name="crown" size={11} color={C.amber} />
                <Text style={[styles.heroChipText, { fontFamily: F.bodySemi, color: C.amber }]}>Gold Tier</Text>
              </View>
              <View style={[styles.heroChip, { borderColor: "rgba(37,99,235,0.3)", backgroundColor: C.blueLight }]}>
                <Ionicons name="star" size={11} color={C.blue} />
                <Text style={[styles.heroChipText, { fontFamily: F.bodySemi, color: C.blue }]}>Top User</Text>
              </View>
            </View>

            {/* Edit Profile Button */}
            <TouchableOpacity
              style={styles.heroEditBtn}
              onPress={() => setShowEdit(true)}
              activeOpacity={0.85}
            >
              <Ionicons name="create-outline" size={15} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={[styles.heroEditBtnText, { fontFamily: F.bodySemi }]}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

      

        {/* ── Quick Info Card ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontFamily: F.bodySemi }]}>Contact Details</Text>
          <View style={styles.infoCard}>
            {[
              { icon: "mail-outline",   label: "Email",  value: user?.email ?? "" },
              { icon: "call-outline",   label: "Phone",  value: user?.phone ?? "" },
            ].map((row, i, arr) => (
              <React.Fragment key={row.label}>
                <View style={styles.infoRow}>
                  <View style={[styles.infoIconWrap, { backgroundColor: C.blueLight }]}>
                    <Ionicons name={row.icon as any} size={16} color={C.blue} />
                  </View>
                  <View style={styles.infoTextBlock}>
                    <Text style={[styles.infoLabel, { fontFamily: F.bodyReg }]}>{row.label}</Text>
                    <Text style={[styles.infoValue, { fontFamily: F.bodySemi }]}>{row.value}</Text>
                  </View>
                  <TouchableOpacity style={styles.infoCopyBtn} activeOpacity={0.7}>
                    <Ionicons name="copy-outline" size={15} color={C.slateLight} />
                  </TouchableOpacity>
                </View>
                {i < arr.length - 1 && <View style={styles.infoDivider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* ── Menu Sections ── */}
        <View style={styles.section}>
          {MENU_SECTIONS.map((sec) => (
            <MenuSectionCard
              key={sec.title}
              section={sec}
              toggles={toggles}
              onToggle={handleToggle}
            />
          ))}
        </View>

        {/* ── App Version ── */}
        <View style={styles.appVersionRow}>
          <View style={styles.appVersionIconWrap}>
            <MaterialCommunityIcons name="tools" size={14} color={C.slateLight} />
          </View>
          <Text style={[styles.appVersionText, { fontFamily: F.bodyReg }]}>
            LocalFix v2.4.1 · Build 2024031401
          </Text>
        </View>

        <View style={{ height: 40 }} />
          </>
        )}
      </Animated.ScrollView>

      {/* ── Edit Profile Modal ── */}
      <EditProfileModal visible={showEdit} onClose={() => setShowEdit(false)} />
    </View>
  );
}
