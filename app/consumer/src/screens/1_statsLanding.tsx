/**
 * HomeScreen.tsx — LocalFix Consumer App
 * ─────────────────────────────────────────────────────────────────────────────
 * Updated: Removed search bar, added bottom navigation for Home, Services,
 * Bookings, Wallet, and Profile screens
 *
 * Phase 3 (modularization): the inline components, design tokens, types and
 * mock data that used to live in this file were extracted to src/. This screen
 * now composes shared components and imports the unified theme + mock data.
 * UI & behavior are unchanged.
 *   • Components → @/src/components/shared
 *   • Tokens     → @/src/theme            (Colors as C, Fonts as F)
 *   • Mock data  → @/src/services/mock
 *
 * Pixel note: the original screen-local `canvas` and `terraLight` tokens were
 * both #FFFFFF. They are mapped here to the exact-value theme tokens
 * `canvasLight` / `white` so rendering stays identical (the unified `canvas`
 * is a warm cream and unified `terraLight` is a peach).
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
  SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import BookingsScreen from "./3_bookingScreen";
import ServicesScreen from "./2_servicesScreen";
import WalletScreen from "./4_walletScreen";
import ProfileScreen from "./5_profileScreen";

import { Colors as C, Fonts as F } from "@/src/theme";
import { servicesApi } from "@/src/services/api";
import { useAppSelector, useAppDispatch } from "@/src/redux/store";
import { fetchWallet, fetchProfile } from "@/src/redux/actions/appActions";
import {
  PromoCard,
  ServiceTile,
  TrustStrip,
  BottomNavigation,
} from "@/src/components/shared";
import type { TabType } from "@/src/components/shared";

const { width } = Dimensions.get("window");

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.consumer.profile);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [promoIndex, setPromoIndex] = useState(0);

  const userName = user?.name || "Welcome";
  const userLocation = user?.location || "Select location";
  const userInitials = user?.name
    ? user.name
        .split(" ")
        .filter(Boolean)
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "LF";
  const [promos, setPromos] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const scrollY = useRef(new Animated.Value(0)).current;
  const promoRef = useRef<ScrollView>(null);

  // Header background animation
  const headerBg = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: ["rgba(255,253,249,0.98)", "rgba(255,253,249,0.98)"],
    extrapolate: "clamp",
  });
  const headerElevation = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 0.1],
    extrapolate: "clamp",
  });

  // Fetch Data
  useEffect(() => {
    dispatch(fetchProfile());
    let mounted = true;
    Promise.all([
      servicesApi.listPromos(),
      servicesApi.listCategories(),
    ]).then(([fetchedPromos, fetchedCategories]) => {
      if (mounted) {
        setPromos(fetchedPromos || []);
        setCategories(fetchedCategories || []);
        setLoading(false);
      }
    }).catch((err) => {
      console.error(err);
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  // Auto-advance promo carousel
  useEffect(() => {
    if (promos.length === 0) return;
    const id = setInterval(() => {
      setPromoIndex(i => {
        const next = (i + 1) % promos.length;
        promoRef.current?.scrollTo({ x: next * (width - 32), animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [promos.length]);

  // ✅ UPDATED: renderContent now handles 'services' case
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            {/* Floating sticky header */}
            <Animated.View
              style={[
                styles.floatingHeader,
                { backgroundColor: headerBg, shadowOpacity: headerElevation },
              ]}
            >
              <View style={styles.headerInner}>
                {/* Location */}
                <TouchableOpacity style={styles.locationChip} activeOpacity={0.75}>
                  <Ionicons name="location-sharp" size={13} color={C.terra} />
                  <Text style={[styles.locationText, { fontFamily: F.bodySemi }]} numberOfLines={1}>{userLocation}</Text>
                  <Ionicons name="chevron-down" size={11} color={C.inkLight} />
                </TouchableOpacity>

                {/* Right actions */}
                <View style={styles.headerRight}>
                  <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.75}>
                    <Ionicons name="notifications-outline" size={20} color={C.inkMid} />
                    <View style={styles.notifBadge} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.avatarBtn} activeOpacity={0.8} onPress={() => setActiveTab('profile')}>
                    <Text style={[styles.avatarText, { fontFamily: F.displaySemi }]}>{userInitials}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>

            {/* Main Scroll */}
            <Animated.ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                { useNativeDriver: false }
              )}
              scrollEventThrottle={16}
            >
              {/* Spacer for floating header */}
              <View style={{ height: Platform.OS === "ios" ? 98 : 78 }} />

              {/* GREETING */}
              <View style={styles.greetSection}>
                <View style={styles.greetLeft}>
                  <Text style={[styles.greetEyebrow, { fontFamily: F.bodyBold }]}>
                    GOOD MORNING ·{" "}
                    {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }).toUpperCase()}
                  </Text>
                  <Text style={[styles.greetName, { fontFamily: F.displayBold }]}>
                    {userName}
                  </Text>

                </View>
              </View>


              {/* PROMO CAROUSEL */}
              <View style={styles.promoSection}>
                <View style={[styles.sectionHeader, { paddingHorizontal: 16 }]}>
                  <View>
                    <Text style={[styles.sectionEyebrow, { fontFamily: F.bodyBold }]}>EXCLUSIVE</Text>
                    <Text style={[styles.sectionTitle, { fontFamily: F.displaySemi }]}>Offers & Deals</Text>
                  </View>
                  {/* Indicator dots */}
                  <View style={styles.promoDots}>
                    {promos.map((_, i) => (
                      <Animated.View
                        key={i}
                        style={[
                          styles.promoDot,
                          promoIndex === i ? styles.promoDotActive : {},
                        ]}
                      />
                    ))}
                  </View>
                </View>

                <ScrollView
                  ref={promoRef}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  onMomentumScrollEnd={e => {
                    setPromoIndex(Math.round(e.nativeEvent.contentOffset.x / (width - 32)));
                  }}
                  contentContainerStyle={styles.promoScrollContent}
                >
                  {loading ? (
                    <Text style={{ padding: 20, fontFamily: F.bodyReg }}>Loading Promos...</Text>
                  ) : promos.map(p => (
                    <View key={p._id || p.id} style={{ width: width - 44 }}>
                      <PromoCard promo={p} />
                    </View>
                  ))}
                </ScrollView>
              </View>

              {/* SERVICES GRID */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={[styles.sectionEyebrow, { fontFamily: F.bodyBold }]}>BROWSE</Text>
                    <Text style={[styles.sectionTitle, { fontFamily: F.displaySemi }]}>Our Services</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.seeAllChip}
                    activeOpacity={0.75}
                    onPress={() => setActiveTab('services')}
                  >
                    <Text style={[styles.seeAllText, { fontFamily: F.bodySemi }]}>All</Text>
                    <Ionicons name="arrow-forward" size={12} color={C.terra} />
                  </TouchableOpacity>
                </View>

                <View style={styles.servicesGrid}>
                  {loading ? (
                    <Text style={{ padding: 20, fontFamily: F.bodyReg }}>Loading Services...</Text>
                  ) : categories.map((c, i) => <ServiceTile key={c._id || c.id} item={c} index={i} />)}
                </View>
              </View>

              {/* TRUST STRIP */}
              <View style={styles.trustSection}>
                <TrustStrip />
              </View>

              {/* REFER & EARN BANNER */}
              <View style={styles.section}>
                <View style={styles.referCard}>
                  {/* BG orb */}
                  <View style={styles.referOrb} />

                  <View style={[styles.referIconWrap]}>
                    <MaterialCommunityIcons name="account-multiple-plus" size={28} color={C.goldBright} />
                  </View>

                  <View style={styles.referInfo}>
                    <Text style={[styles.referTitle, { fontFamily: F.displaySemi }]}>
                      Invite friends, earn ₹100 each
                    </Text>
                    <Text style={[styles.referSub, { fontFamily: F.bodyReg }]}>
                      They get ₹50 off their first booking too
                    </Text>
                  </View>

                  <TouchableOpacity style={styles.referBtn} activeOpacity={0.85}>
                    <Ionicons name="share-social-outline" size={14} color="#FFF" />
                    <Text style={[styles.referBtnText, { fontFamily: F.bodySemi }]}>Refer Now</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{ height: 52 }} />
            </Animated.ScrollView>
          </>
        );

      // ✅ NEW: Services tab case
      case 'services':
        return <ServicesScreen />;

      case 'bookings':
        return <BookingsScreen />;

      case 'wallet':
        return <WalletScreen />;

      case 'profile':
        return <ProfileScreen />;

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={C.canvasLight} translucent />

      {/* Main Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
}

// ─── Styles (screen layout only — component styles now live with each shared component) ──
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.canvasLight, // was C.canvas (#FFFFFF on screen 1)
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Floating Header
  floatingHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99,
    paddingTop: Platform.OS === "ios" ? 52 : 32,
    paddingBottom: 10,
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  locationChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: C.surface,
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: C.ruleLight,
  },
  locationText: {
    fontSize: 13,
    color: C.inkMid,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.ruleLight,
  },
  notifBadge: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: C.terra,
    borderWidth: 1.5,
    borderColor: C.surface,
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.ink,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 13,
    color: "#FFF",
    letterSpacing: -0.2,
  },

  // Greeting
  greetSection: {
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  greetLeft: {
    gap: 3,
  },
  greetEyebrow: {
    fontSize: 10,
    color: C.terra,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  greetName: {
    fontSize: 32,
    color: C.ink,
    letterSpacing: -0.9,
    lineHeight: 38,
  },
  greetSub: {
    fontSize: 14,
    color: C.inkLight,
    marginTop: 3,
  },

  // Hero Card section wrapper
  heroSection: {
    paddingHorizontal: 16,
    marginBottom: 28,
  },

  // Section wrapper
  section: {
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 14,
  },
  sectionEyebrow: {
    fontSize: 10,
    color: C.terra,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 22,
    color: C.ink,
    letterSpacing: -0.5,
  },
  seeAllChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: C.white, // was C.terraLight (#fff on screen 1)
    borderRadius: 9,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: C.terra + "30",
  },
  seeAllText: {
    fontSize: 12,
    color: C.terra,
  },

  // Promo carousel container
  promoSection: {
    marginBottom: 28,
  },
  promoScrollContent: {
    gap: 12,
    paddingLeft: 16,
    paddingRight: 8,
  },
  promoDots: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  promoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.rule,
  },
  promoDotActive: {
    width: 18,
    backgroundColor: C.terra,
    borderRadius: 3,
  },

  // Services Grid
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 0,
    rowGap: 18,
  },

  // Trust Strip section wrapper
  trustSection: {
    paddingHorizontal: 16,
    marginBottom: 28,
  },

  // Refer & Earn
  referCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: C.ink,
    borderRadius: 22,
    padding: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    shadowColor: C.ink,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  referOrb: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(192,82,43,0.08)",
    top: -60,
    right: -40,
  },
  referIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: "rgba(240,201,107,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(240,201,107,0.25)",
    flexShrink: 0,
  },
  referInfo: {
    flex: 1,
    gap: 3,
  },
  referTitle: {
    fontSize: 15,
    color: "#FFF",
    letterSpacing: -0.3,
  },
  referSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.42)",
    lineHeight: 15,
  },
  referBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.terra,
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 11,
    flexShrink: 0,
  },
  referBtnText: {
    fontSize: 12,
    color: "#FFF",
  },
});
