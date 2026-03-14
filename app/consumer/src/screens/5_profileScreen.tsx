/**
 * ProfileScreen.tsx — LocalFix Consumer App
 *
 * Fonts required:
 *   Recoleta-Bold.ttf  Recoleta-SemiBold.ttf  Recoleta-Regular.ttf
 *   Geist-Regular.ttf  Geist-Medium.ttf  Geist-SemiBold.ttf  Geist-Bold.ttf
 *
 *   react-native.config.js → assets: ['./assets/fonts']
 *   then: npx react-native-asset
 *
 * Dependencies:
 *   npm install react-native-vector-icons
 *   npm install --save-dev @types/react-native-vector-icons
 */

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  Platform,
  Switch,
  TextInput,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

// ─── Font Map ─────────────────────────────────────────────────────────────────
const F = {
  displayBold: "Recoleta-Bold",
  displaySemi: "Recoleta-SemiBold",
  displayReg:  "Recoleta-Regular",
  bodyReg:     "Geist-Regular",
  bodyMed:     "Geist-Medium",
  bodySemi:    "Geist-SemiBold",
  bodyBold:    "Geist-Bold",
};

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  // Hero
  heroTop:     "#0A1628",
  heroMid:     "#0F1F45",
  heroBot:     "#162847",

  bg:          "#F0F3FB",
  surface:     "#FFFFFF",
  navy:        "#0A1628",
  navyMid:     "#1C2E4A",
  blue:        "#2563EB",
  blueLight:   "#EFF6FF",
  green:       "#10B981",
  greenBg:     "#ECFDF5",
  amber:       "#F59E0B",
  amberBg:     "#FFFBEB",
  red:         "#EF4444",
  redBg:       "#FEF2F2",
  purple:      "#7C3AED",
  purpleBg:    "#F5F3FF",
  teal:        "#0D9488",
  tealBg:      "#F0FDFA",
  orange:      "#EA580C",
  orangeBg:    "#FFF7ED",

  slate:       "#64748B",
  slateLight:  "#94A3B8",
  border:      "#E2E8F4",
  borderLight: "#EEF2FB",

  gold:        "#D4A853",
  goldLight:   "#F0C96B",
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  id: string;
  label: string;
  sublabel?: string;
  icon: string;           // Ionicons name
  iconBg: string;
  iconColor: string;
  type: "navigate" | "toggle" | "badge" | "danger";
  badgeCount?: number;
  badgeText?: string;
  toggleKey?: keyof typeof DEFAULT_TOGGLES;
  destructive?: boolean;
}

const DEFAULT_TOGGLES = {
  notifications:  true,
  smsAlerts:      true,
  locationAccess: true,
  faceId:         false,
  darkMode:       false,
  dataSync:       true,
};

// ─── User Data ────────────────────────────────────────────────────────────────
const USER = {
  name:       "Arjun Mehta",
  email:      "arjun.mehta@gmail.com",
  phone:      "+91 98765 43210",
  location:   "Civil Lines, Agra, UP",
  memberSince:"Jan 2023",
  avatar:     "AM",
  tier:       "Gold Member",
  totalSpent: 24850,
  bookings:   18,
  savedAddresses: 3,
  loyaltyPoints: 1240,
};

const STATS = [
  { label: "Bookings",   value: "18",   icon: "receipt-outline",      color: C.blue   },
  { label: "Saved",      value: "₹2.4k", icon: "wallet-outline",      color: C.green  },
  { label: "Points",     value: "1,240", icon: "star-outline",        color: C.amber  },
  { label: "Addresses",  value: "3",    icon: "location-outline",     color: C.purple },
];

const MENU_SECTIONS: MenuSection[] = [
  {
    title: "Account",
    items: [
      {
        id: "personal",
        label: "Personal Information",
        sublabel: "Name, email, phone",
        icon: "person-outline",
        iconBg: C.blueLight,
        iconColor: C.blue,
        type: "navigate",
      },
      {
        id: "addresses",
        label: "Saved Addresses",
        sublabel: "3 addresses saved",
        icon: "location-outline",
        iconBg: C.purpleBg,
        iconColor: C.purple,
        type: "badge",
        badgeCount: 3,
      }, 
        {
        id: "refer",
        label: "Refer & Earn",
        sublabel: "Earn ₹100 per referral",
        icon: "gift-outline",
        iconBg: "#FFF0F5",
        iconColor: "#E11D74",
        type: "badge",
        badgeText: "₹100",
      },
    ],
  },
  {
    title: "Danger Zone",
    items: [
      {
        id: "logout",
        label: "Log Out",
        icon: "log-out-outline",
        iconBg: C.amberBg,
        iconColor: C.amber,
        type: "danger",
      },
      {
        id: "deleteAccount",
        label: "Delete Account",
        sublabel: "Permanently remove your data",
        icon: "trash-outline",
        iconBg: C.redBg,
        iconColor: C.red,
        type: "danger",
        destructive: true,
      },
    ],
  },
];

// ─── Animated Header Avatar ───────────────────────────────────────────────────
const HeroAvatar = ({ name, tier }: { name: string; tier: string }) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.06, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <View style={styles.heroAvatarWrap}>
      {/* Outer pulse ring */}
      <Animated.View style={[styles.avatarRingOuter, { transform: [{ scale: pulseAnim }] }]} />
      {/* Inner ring */}
      <View style={styles.avatarRingInner} />
      {/* Avatar */}
      <View style={styles.avatarCircle}>
        <Text style={[styles.avatarInitials, { fontFamily: F.displayBold }]}>{initials}</Text>
      </View>
      {/* Edit Badge */}
      <TouchableOpacity style={styles.avatarEditBadge} activeOpacity={0.8}>
        <Ionicons name="camera" size={12} color="#FFF" />
      </TouchableOpacity>
      {/* Gold tier badge */}
      <View style={styles.tierBadge}>
        <MaterialCommunityIcons name="crown" size={9} color={C.heroTop} />
        <Text style={[styles.tierBadgeText, { fontFamily: F.bodyBold }]}>{tier}</Text>
      </View>
    </View>
  );
};

// ─── Loyalty Points Bar ───────────────────────────────────────────────────────
const LoyaltyBar = ({ points }: { points: number }) => {
  const barAnim = useRef(new Animated.Value(0)).current;
  const nextMilestone = 1500;
  const pct = Math.min((points / nextMilestone) * 100, 100);

  useEffect(() => {
    Animated.timing(barAnim, { toValue: pct, duration: 1400, useNativeDriver: false }).start();
  }, []);

  const barWidth = barAnim.interpolate({ inputRange: [0, 100], outputRange: ["0%", "100%"] });

  return (
    <View style={styles.loyaltyCard}>
      {/* BG decoration */}
      <View style={styles.loyaltyCircle} />

      <View style={styles.loyaltyTop}>
        <View style={styles.loyaltyLeft}>
          <View style={styles.loyaltyIconWrap}>
            <MaterialCommunityIcons name="lightning-bolt" size={18} color={C.goldLight} />
          </View>
          <View>
            <Text style={[styles.loyaltyTitle, { fontFamily: F.displaySemi }]}>Loyalty Points</Text>
            <Text style={[styles.loyaltySub,   { fontFamily: F.bodyReg    }]}>
              {nextMilestone - points} pts to Platinum
            </Text>
          </View>
        </View>
        <Text style={[styles.loyaltyPoints, { fontFamily: F.displayBold }]}>
          {points.toLocaleString()}
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.loyaltyBarTrack}>
        <Animated.View style={[styles.loyaltyBarFill, { width: barWidth }]} />
        {/* Milestone marker */}
        <View style={[styles.loyaltyMilestone, { left: "50%" }]}>
          <View style={styles.loyaltyMilestoneDot} />
          <Text style={[styles.loyaltyMilestoneLabel, { fontFamily: F.bodyReg }]}>750</Text>
        </View>
      </View>

      <View style={styles.loyaltyBarLabels}>
        <Text style={[styles.loyaltyBarLabel, { fontFamily: F.bodyReg }]}>0</Text>
        <Text style={[styles.loyaltyBarLabelMid, { fontFamily: F.bodySemi }]}>
          {points.toLocaleString()} pts
        </Text>
        <Text style={[styles.loyaltyBarLabel, { fontFamily: F.bodyReg }]}>{nextMilestone}</Text>
      </View>
    </View>
  );
};

 

// ─── Menu Item ────────────────────────────────────────────────────────────────
const MenuItemRow = ({
  item,
  toggles,
  onToggle,
  isLast,
}: {
  item: MenuItem;
  toggles: typeof DEFAULT_TOGGLES;
  onToggle: (key: keyof typeof DEFAULT_TOGGLES) => void;
  isLast: boolean;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const pressIn  = () => Animated.spring(scaleAnim, { toValue: 0.977, useNativeDriver: true, speed: 50 }).start();
  const pressOut = () => Animated.spring(scaleAnim, { toValue: 1,     useNativeDriver: true, speed: 50 }).start();

  const isDestructive = item.destructive;
  const isToggle      = item.type === "toggle";

  return (
    <>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          style={styles.menuItem}
          activeOpacity={isToggle ? 1 : 0.75}
          onPressIn={isToggle ? undefined : pressIn}
          onPressOut={isToggle ? undefined : pressOut}
          onPress={isToggle && item.toggleKey ? () => onToggle(item.toggleKey!) : undefined}
        >
          {/* Icon */}
          <View style={[styles.menuIconWrap, { backgroundColor: item.iconBg }]}>
            <Ionicons
              name={item.icon as any}
              size={19}
              color={isDestructive ? item.iconColor : item.iconColor}
            />
          </View>

          {/* Text */}
          <View style={styles.menuTextBlock}>
            <Text style={[
              styles.menuLabel,
              { fontFamily: F.bodySemi },
              isDestructive && { color: item.iconColor },
            ]}>
              {item.label}
            </Text>
            {item.sublabel && (
              <Text style={[styles.menuSublabel, { fontFamily: F.bodyReg }]}>{item.sublabel}</Text>
            )}
          </View>

          {/* Right element */}
          {isToggle && item.toggleKey ? (
            <Switch
              value={toggles[item.toggleKey]}
              onValueChange={() => onToggle(item.toggleKey!)}
              trackColor={{ false: C.border, true: C.blue + "99" }}
              thumbColor={toggles[item.toggleKey] ? C.blue : C.slateLight}
              style={{ transform: [{ scaleX: 0.88 }, { scaleY: 0.88 }] }}
            />
          ) : item.type === "badge" && item.badgeCount !== undefined ? (
            <View style={styles.menuBadge}>
              <Text style={[styles.menuBadgeText, { fontFamily: F.bodyBold }]}>
                {item.badgeCount}
              </Text>
            </View>
          ) : item.type === "badge" && item.badgeText ? (
            <View style={[styles.menuBadge, { backgroundColor: "#FFF0F5", borderColor: "#FBCFE8" }]}>
              <Text style={[styles.menuBadgeText, { fontFamily: F.bodyBold, color: "#E11D74" }]}>
                {item.badgeText}
              </Text>
            </View>
          ) : !isDestructive ? (
            <Ionicons name="chevron-forward" size={16} color={C.slateLight} />
          ) : null}
        </TouchableOpacity>
      </Animated.View>
      {!isLast && <View style={styles.menuDivider} />}
    </>
  );
};

// ─── Menu Section Card ────────────────────────────────────────────────────────
const MenuSectionCard = ({
  section,
  toggles,
  onToggle,
}: {
  section: MenuSection;
  toggles: typeof DEFAULT_TOGGLES;
  onToggle: (key: keyof typeof DEFAULT_TOGGLES) => void;
}) => (
  <View style={styles.menuSection}>
    <Text style={[styles.menuSectionTitle, { fontFamily: F.bodySemi }]}>{section.title}</Text>
    <View style={styles.menuCard}>
      {section.items.map((item, i) => (
        <MenuItemRow
          key={item.id}
          item={item}
          toggles={toggles}
          onToggle={onToggle}
          isLast={i === section.items.length - 1}
        />
      ))}
    </View>
  </View>
);

// ─── Edit Profile Modal ───────────────────────────────────────────────────────
const EditProfileModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const slideAnim = useRef(new Animated.Value(600)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 18, bounciness: 3 }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 600, duration: 240, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 0,   duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const fields = [
    { label: "Full Name",    value: USER.name,     icon: "person-outline"   },
    { label: "Email",        value: USER.email,    icon: "mail-outline"     },
    { label: "Phone",        value: USER.phone,    icon: "call-outline"     },
    { label: "City / Area",  value: USER.location, icon: "location-outline" },
  ];

  return (
    <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
      <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} activeOpacity={1} />
      <Animated.View style={[styles.modalSheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.modalHandle} />

        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={[styles.modalTitle, { fontFamily: F.displaySemi }]}>Edit Profile</Text>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={20} color={C.slate} />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.modalAvatarRow}>
          <View style={styles.modalAvatar}>
            <Text style={[styles.modalAvatarText, { fontFamily: F.displayBold }]}>AM</Text>
          </View>
          <TouchableOpacity style={styles.modalAvatarEditBtn} activeOpacity={0.8}>
            <Ionicons name="camera-outline" size={14} color={C.blue} />
            <Text style={[styles.modalAvatarEditText, { fontFamily: F.bodySemi }]}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Fields */}
        {fields.map((f) => (
          <View key={f.label} style={styles.modalField}>
            <Text style={[styles.modalFieldLabel, { fontFamily: F.bodyMed }]}>{f.label}</Text>
            <View style={styles.modalFieldInput}>
              <Ionicons name={f.icon as any} size={16} color={C.slateLight} style={{ marginRight: 10 }} />
              <TextInput
                defaultValue={f.value}
                style={[styles.modalInput, { fontFamily: F.bodyMed }]}
                placeholderTextColor={C.slateLight}
              />
            </View>
          </View>
        ))}

        {/* Save CTA */}
        <TouchableOpacity style={styles.modalSaveBtn} onPress={onClose} activeOpacity={0.85}>
          <Ionicons name="checkmark-circle" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={[styles.modalSaveBtnText, { fontFamily: F.bodySemi }]}>Save Changes</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const [toggles, setToggles] = useState(DEFAULT_TOGGLES);
  const [showEdit, setShowEdit] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleToggle = (key: keyof typeof DEFAULT_TOGGLES) => {
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
            <HeroAvatar name={USER.name} tier={USER.tier} />

            {/* Name & Info */}
            <Text style={[styles.heroName, { fontFamily: F.displayBold }]}>{USER.name}</Text>
            <View style={styles.heroMetaRow}>
              <Ionicons name="location-outline" size={13} color={C.slate} />
              <Text style={[styles.heroMeta, { fontFamily: F.bodyReg }]}>{USER.location}</Text>
            </View>
            <View style={styles.heroMetaRow}>
              <Ionicons name="calendar-outline" size={13} color={C.slate} />
              <Text style={[styles.heroMeta, { fontFamily: F.bodyReg }]}>Member since {USER.memberSince}</Text>
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

        {/* ── Loyalty Bar ── */}
        <View style={styles.section}>
          <LoyaltyBar points={USER.loyaltyPoints} />
        </View>

        {/* ── Quick Info Card ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { fontFamily: F.bodySemi }]}>Contact Details</Text>
          <View style={styles.infoCard}>
            {[
              { icon: "mail-outline",   label: "Email",  value: USER.email  },
              { icon: "call-outline",   label: "Phone",  value: USER.phone  },
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
      </Animated.ScrollView>

      {/* ── Edit Profile Modal ── */}
      <EditProfileModal visible={showEdit} onClose={() => setShowEdit(false)} />
    </View>
  );
}

// ─── StyleSheet ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },

  scrollContent: {
    backgroundColor: C.bg,
  },

  // Floating Nav
  floatingNav: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 54 : 34,
    paddingBottom: 12,
    paddingHorizontal: 18,
  },
  floatingNavBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",          // matches white hero on scroll
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(10,22,40,0.07)", // subtle dark tint on white
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    fontSize: 18,
    color: C.navy,                        // dark text on white nav
    letterSpacing: -0.3,
  },

  // ── Hero — white background ───────────────────────────────────────────────
  hero: {
    backgroundColor: "#FFFFFF",           // ← changed to white
    paddingTop: Platform.OS === "ios" ? 110 : 90,
    paddingBottom: 32,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,     // subtle separator from bg
  },
  // Decorative circles — muted tints that work on white
  heroCircle1: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(37,99,235,0.05)",
    top: -100,
    right: -100,
  },
  heroCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(10,22,40,0.03)",
    bottom: -60,
    left: -60,
  },
  heroCircle3: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(212,168,83,0.06)",
    top: 60,
    left: 30,
  },
  heroGridLine1: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "rgba(10,22,40,0.04)",
    left: width * 0.33,
  },
  heroGridLine2: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "rgba(10,22,40,0.04)",
    left: width * 0.66,
  },
  heroContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },

  // Avatar
  heroAvatarWrap: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarRingOuter: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    borderColor: "rgba(212,168,83,0.35)",
  },
  avatarRingInner: {
    position: "absolute",
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2,
    borderColor: "rgba(212,168,83,0.6)",
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.8)",
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarInitials: {
    fontSize: 26,
    color: "#FFF",
    letterSpacing: -0.5,
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",              // white border to stand out on white bg
  },
  tierBadge: {
    position: "absolute",
    top: -4,
    right: -2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.gold,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 3,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",             // white border instead of dark
  },
  tierBadgeText: {
    fontSize: 8,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  // Hero text — dark since bg is now white
  heroName: {
    fontSize: 26,
    color: C.navy,                       // ← dark
    letterSpacing: -0.6,
    marginBottom: 6,
    textAlign: "center",
  },
  heroMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 3,
  },
  heroMeta: {
    fontSize: 13,
    color: C.slate,                      // ← readable dark grey
  },
  heroChipsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    marginBottom: 18,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  heroChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    borderWidth: 1,
  },
  heroChipText: {
    fontSize: 11,
  },
  heroEditBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.navy,             // ← inverted: dark button on white hero
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 11,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  heroEditBtnText: {
    fontSize: 14,
    color: "#FFFFFF",                    // ← white text on dark button
  },

  // Stats
  statsSection: {
    backgroundColor: "#FFFFFF",          // ← matches white hero seamlessly
    paddingBottom: 0,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: C.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 22,
    paddingHorizontal: 16,
    paddingBottom: 4,
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: C.surface,
    borderRadius: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: C.borderLight,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 17,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: C.slateLight,
  },

  // Loyalty
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 13,
    color: C.slate,
    marginBottom: 10,
    letterSpacing: 0.1,
  },
  loyaltyCard: {
    backgroundColor: C.navy,
    borderRadius: 20,
    padding: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(212,168,83,0.2)",
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  loyaltyCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(37,99,235,0.08)",
    right: -60,
    top: -60,
  },
  loyaltyTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  loyaltyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  loyaltyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "rgba(212,168,83,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(212,168,83,0.25)",
  },
  loyaltyTitle: {
    fontSize: 15,
    color: "#FFF",
    letterSpacing: -0.2,
  },
  loyaltySub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.45)",
    marginTop: 2,
  },
  loyaltyPoints: {
    fontSize: 28,
    color: C.goldLight,
    letterSpacing: -1,
  },
  loyaltyBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "visible",
    marginBottom: 8,
  },
  loyaltyBarFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: C.gold,
  },
  loyaltyMilestone: {
    position: "absolute",
    top: -3,
    alignItems: "center",
  },
  loyaltyMilestoneDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: C.goldLight,
    borderWidth: 2,
    borderColor: C.navy,
  },
  loyaltyMilestoneLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.4)",
    marginTop: 3,
  },
  loyaltyBarLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  loyaltyBarLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
  },
  loyaltyBarLabelMid: {
    fontSize: 12,
    color: C.goldLight,
  },

  // Contact Info Card
  infoCard: {
    backgroundColor: C.surface,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.borderLight,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  infoIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  infoTextBlock: { flex: 1 },
  infoLabel: {
    fontSize: 11,
    color: C.slateLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: C.navy,
  },
  infoCopyBtn: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  infoDivider: {
    height: 1,
    backgroundColor: C.borderLight,
    marginLeft: 66,
  },

  // Menu
  menuSection: {
    marginBottom: 6,
  },
  menuSectionTitle: {
    fontSize: 12,
    color: C.slateLight,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: C.surface,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.borderLight,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 14,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 13,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextBlock: { flex: 1 },
  menuLabel: {
    fontSize: 14,
    color: C.navy,
    letterSpacing: -0.1,
  },
  menuSublabel: {
    fontSize: 12,
    color: C.slateLight,
    marginTop: 2,
  },
  menuBadge: {
    minWidth: 26,
    height: 22,
    borderRadius: 8,
    backgroundColor: C.blueLight,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 7,
  },
  menuBadgeText: {
    fontSize: 11,
    color: C.blue,
  },
  menuDivider: {
    height: 1,
    backgroundColor: C.borderLight,
    marginLeft: 69,
  },

  // App Version
  appVersionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    marginTop: 8,
  },
  appVersionIconWrap: {
    opacity: 0.5,
  },
  appVersionText: {
    fontSize: 11,
    color: C.slateLight,
  },

  // Edit Profile Modal
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.52)",
    justifyContent: "flex-end",
    zIndex: 200,
  },
  modalSheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 44 : 28,
    maxHeight: "90%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.border,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    color: C.navy,
    letterSpacing: -0.4,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  modalAvatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 22,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  modalAvatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  modalAvatarText: {
    fontSize: 22,
    color: "#FFF",
    letterSpacing: -0.5,
  },
  modalAvatarEditBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: C.blueLight,
    borderWidth: 1,
    borderColor: C.border,
  },
  modalAvatarEditText: {
    fontSize: 13,
    color: C.blue,
  },
  modalField: {
    marginBottom: 14,
  },
  modalFieldLabel: {
    fontSize: 12,
    color: C.slateLight,
    marginBottom: 7,
    letterSpacing: 0.2,
  },
  modalFieldInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bg,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  modalInput: {
    flex: 1,
    fontSize: 14,
    color: C.navy,
  },
  modalSaveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.navy,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  modalSaveBtnText: {
    fontSize: 15,
    color: "#FFF",
  },
});