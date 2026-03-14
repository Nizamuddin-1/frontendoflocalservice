/**
 * HomeScreen.tsx — LocalFix Consumer App
 * ─────────────────────────────────────────────────────────────────────────────
 * Updated: Removed search bar, added bottom navigation for Home, Services,
 * Bookings, Wallet, and Profile screens
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
const { width } = Dimensions.get("window");

// ─── Font Aliases ─────────────────────────────────────────────────────────────
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
  canvas:      "#FFFFFF",
  surface:     "#FFFFFF",
  surfaceRaised:"#FFFFFF",
  ink:         "#0F1923",
  inkMid:      "#2E3B4E",
  inkLight:    "#6B7A8D",
  inkFaint:    "#A8B3BE",
  terra:       "#C0522B",
  terraDeep:   "#A83E20",
  terraMid:    "#D96840",
  terraLight:  "#fff",
  terraTint:   "#FDF1EC",
  gold:        "#B07D2E",
  goldLight:   "#FBF0D6",
  goldBright:  "#F0C96B",
  goldDeep:    "#8A5F1A",
  sage:        "#3D7A60",
  sageBg:      "#E6F4EC",
  cobalt:      "#1B4FD8",
  cobaltBg:    "#E9EFFC",
  cobaltMid:   "#3B6FE8",
  plum:        "#6B3FA0",
  plumBg:      "#F0EAFA",
  rust:        "#A0362A",
  rustBg:      "#FAEAE4",
  teal:        "#0D9488",
  tealBg:      "#CCFBF1",
  amber:       "#B45309",
  amberBg:     "#FEF3C7",
  heroTop:     "#0B1829",
  heroMid:     "#0F1F45",
  heroBot:     "#162847",
  rule:        "#DDD6CE",
  ruleLight:   "#EDE8E2",
  chip:        "#ECE7DF",
  chipText:    "#6B7A8D",
  green:       "#059669",
  greenBg:     "#D1FAE5",
  amber2:      "#D97706",
  amber2Bg:    "#FEF3C7",
  red:         "#DC2626",
  redBg:       "#FEE2E2",
};

// ─── Data Types ───────────────────────────────────────────────────────────────
interface StatItem {
  id: string;
  label: string;
  value: string;
  subValue?: string;
  icon: string;
  iconLib?: "ion" | "mc";
  color: string;
  bg: string;
  trend: string;
  trendPositive: boolean;
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  iconLib?: "ion" | "mc";
  color: string;
  bg: string;
  proCount: number;
}

interface Booking {
  id: string;
  service: string;
  provider: string;
  initials: string;
  date: string;
  time: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  price: number;
  rating?: number;
  color: string;
  bg: string;
  mcIcon: string;
  bookingRef: string;
}

interface Promo {
  id: string;
  tag: string;
  headline: string;
  body: string;
  cta: string;
  accent: string;
  darkBg: string;
  mcIcon: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const STATS: StatItem[] = [
  {
    id: "s1",
    label: "Bookings Done",
    value: "14",
    icon: "checkmark-circle",
    color: C.sage,
    bg: C.sageBg,
    trend: "+3 this month",
    trendPositive: true,
  },
  {
    id: "s2",
    label: "Total Saved",
    value: "₹2,340",
    icon: "pricetag",
    color: C.gold,
    bg: C.goldLight,
    trend: "via offers & wallet",
    trendPositive: true,
  },
  {
    id: "s3",
    label: "Wallet Balance",
    value: "₹3,613",
    icon: "wallet",
    color: C.cobalt,
    bg: C.cobaltBg,
    trend: "₹60 cashback earned",
    trendPositive: true,
  },
  {
    id: "s4",
    label: "Loyalty Points",
    value: "1,240 pts",
    icon: "star",
    color: C.terra,
    bg: C.terraLight,
    trend: "Redeem before Apr",
    trendPositive: false,
  },
  {
    id: "s5",
    label: "Avg Rating Given",
    value: "4.8",
    subValue: "/ 5.0",
    icon: "heart",
    color: C.plum,
    bg: C.plumBg,
    trend: "Top reviewer badge",
    trendPositive: true,
  },
  {
    id: "s6",
    label: "Active Offers",
    value: "3",
    icon: "gift",
    color: C.teal,
    bg: C.tealBg,
    trend: "1 expiring soon",
    trendPositive: false,
  },
];

const CATEGORIES: ServiceCategory[] = [
  { id: "ac",          name: "AC & Cooling",  icon: "snow",             color: C.cobalt, bg: C.cobaltBg,  proCount: 22 },
  { id: "plumbing",    name: "Plumbing",      icon: "water",            color: C.sage,   bg: C.sageBg,    proCount: 17 },
  { id: "electrical",  name: "Electrical",    icon: "flash",            color: C.gold,   bg: C.goldLight, proCount: 31 },
  { id: "cleaning",    name: "Cleaning",      icon: "sparkles",         color: C.plum,   bg: C.plumBg,    proCount: 14 },
  { id: "painting",    name: "Painting",      icon: "color-palette",    color: C.terra,  bg: C.terraLight,proCount: 9  },
  { id: "carpentry",   name: "Carpentry",     icon: "hammer",           color: C.rust,   bg: C.rustBg,    proCount: 11 },
  { id: "pest",        name: "Pest Control",  icon: "shield-checkmark", color: C.teal,   bg: C.tealBg,    proCount: 8  },
  { id: "salon",       name: "Salon",         icon: "cut",              color: C.plum,   bg: C.plumBg,    proCount: 13 },
];

const BOOKINGS: Booking[] = [
  {
    id: "b1",
    service: "AC Deep Service & Gas Refill",
    provider: "Agra Air Solutions",
    initials: "AA",
    date: "Today",
    time: "3:00 PM",
    status: "upcoming",
    price: 1199,
    color: C.cobalt,
    bg: C.cobaltBg,
    mcIcon: "air-conditioner",
    bookingRef: "LF-2024-0891",
  },
  {
    id: "b2",
    service: "Full Home Deep Cleaning",
    provider: "CleanPro Home Care",
    initials: "CP",
    date: "16 Mar",
    time: "10:00 AM",
    status: "ongoing",
    price: 1499,
    color: C.plum,
    bg: C.plumBg,
    mcIcon: "spray-bottle",
    bookingRef: "LF-2024-0880",
  },
  {
    id: "b3",
    service: "Interior Wall Painting",
    provider: "PaintMaster Pro",
    initials: "PM",
    date: "7 Mar",
    time: "9:00 AM",
    status: "completed",
    price: 8500,
    rating: 4.9,
    color: C.terra,
    bg: C.terraLight,
    mcIcon: "format-paint",
    bookingRef: "LF-2024-0871",
  },
];

const PROMOS: Promo[] = [
  {
    id: "p1",
    tag: "LIMITED TIME",
    headline: "Flat ₹150 Off",
    body: "On your first AC or Electrical booking. Use code at checkout.",
    cta: "Grab Deal",
    accent: C.cobaltMid,
    darkBg: "#0B1829",
    mcIcon: "lightning-bolt",
  },
  {
    id: "p2",
    tag: "WALLET OFFER",
    headline: "10% Cashback",
    body: "Add ₹1,000 or more to your LocalFix wallet and earn instant cashback.",
    cta: "Add Money",
    accent: C.sage,
    darkBg: "#0E1F18",
    mcIcon: "wallet-plus-outline",
  },
  {
    id: "p3",
    tag: "NEW USER",
    headline: "Free Inspection",
    body: "Book any Plumbing service and get a complimentary health checkup.",
    cta: "Book Now",
    accent: C.terra,
    darkBg: "#1F0F09",
    mcIcon: "wrench-outline",
  },
];

const STATUS_CONFIG = {
  upcoming:  { label: "Upcoming",  color: C.cobalt, bg: C.cobaltBg,  ionIcon: "time-outline"            },
  ongoing:   { label: "Ongoing",   color: C.sage,   bg: C.sageBg,    ionIcon: "radio-button-on-outline"  },
  completed: { label: "Completed", color: C.gold,   bg: C.goldLight, ionIcon: "checkmark-circle-outline" },
  cancelled: { label: "Cancelled", color: C.red,    bg: C.redBg,     ionIcon: "close-circle-outline"     },
};

// ─── Animated Number Count-Up ─────────────────────────────────────────────────
const CountUp = ({
  to,
  prefix = "",
  suffix = "",
  duration = 900,
  delay = 0,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  delay?: number;
}) => {
  const anim = useRef(new Animated.Value(0)).current;
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(anim, {
        toValue: to,
        duration,
        useNativeDriver: false,
      }).start();
    }, delay);
    const listener = anim.addListener(({ value }) => setDisplayed(Math.round(value)));
    return () => {
      clearTimeout(timer);
      anim.removeListener(listener);
    };
  }, [to]);

  return <>{`${prefix}${displayed.toLocaleString("en-IN")}${suffix}`}</>;
};

// ─── Pulsing Dot (for Ongoing status) ────────────────────────────────────────
const PulsingDot = ({ color }: { color: string }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, { toValue: 1.6, duration: 700, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1,   duration: 700, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0,   duration: 700, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={{ width: 10, height: 10, alignItems: "center", justifyContent: "center" }}>
      <Animated.View
        style={{
          position: "absolute",
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: color,
          opacity,
          transform: [{ scale }],
        }}
      />
      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color }} />
    </View>
  );
};

// ─── Total spent across all booked & paid services ───────────────────────────
const totalSpent = BOOKINGS.reduce((sum, b) => sum + b.price, 0);

// ─── Loyalty data ─────────────────────────────────────────────────────────────
const LOYALTY_POINTS   = 1240;
const POINTS_TO_REDEEM = 2000;
const CASHBACK_EARNED  = 60;
const TIER_LABEL       = "Silver";
const TIER_NEXT        = "Gold";
const TIER_ICON        = "medal-outline";
const REWARDS = [
  { id: "r1", label: "₹50 Off",       icon: "ticket-percent-outline", pts: 500,  color: C.terra,  bg: C.terraTint  },
  { id: "r2", label: "Free Visit",     icon: "home-outline",           pts: 800,  color: C.sage,   bg: C.sageBg     },
  { id: "r3", label: "Priority Slot",  icon: "flash-outline",          pts: 1000, color: C.cobalt, bg: C.cobaltBg   },
  { id: "r4", label: "₹200 Off",       icon: "gift-outline",           pts: 1500, color: C.plum,   bg: C.plumBg     },
];

// ─── Loyalty & Rewards Hero Card ──────────────────────────────────────────────
const HeroCard = ({ onAddMoney }: { onAddMoney: () => void }) => {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const progressPct = LOYALTY_POINTS / POINTS_TO_REDEEM;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1,           duration: 700, useNativeDriver: true  }),
      Animated.spring(slideAnim, { toValue: 0, speed: 10, bounciness: 6, useNativeDriver: true }),
      Animated.timing(progressAnim, { toValue: progressPct, duration: 1100, delay: 400, useNativeDriver: false }),
    ]).start();
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <Animated.View
      style={[
        styles.heroCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Decorative orbs */}
      <View style={styles.heroOrb1} />
      <View style={styles.heroOrb2} />
      <View style={styles.heroOrb3} />
      <View style={styles.heroOrb4} />

      {/* ── Top row: brand badge + tier pill ── */}
      <View style={styles.heroTopRow}>
        <View style={styles.heroBrand}>
          <View style={styles.heroBrandIcon}>
            <MaterialCommunityIcons name="shield-star" size={13} color={C.goldDeep} />
          </View>
          <Text style={[styles.heroBrandText, { fontFamily: F.bodyBold }]}>Services Rewards</Text>
        </View>
        <View style={[styles.heroBrandPill, { flexDirection: "row", alignItems: "center", gap: 4 }]}>
          <Ionicons name={TIER_ICON as any} size={10} color={C.goldDeep} />
          <Text style={[styles.heroBrandPillText, { fontFamily: F.bodyBold }]}>{TIER_LABEL} MEMBER</Text>
        </View>
      </View>

      {/* ── Points display ── */}
      <View style={styles.heroBalanceBlock}>
        <Text style={[styles.heroBalLabel, { fontFamily: F.bodyReg }]}>Your Loyalty Points</Text>
        <View style={{ flexDirection: "row", alignItems: "flex-end", gap: 6 }}>
          <Text style={[styles.heroBalAmount, { fontFamily: F.displayBold }]}>
            <CountUp to={LOYALTY_POINTS} />
          </Text>
          <Text style={[styles.heroBalLabel, { fontFamily: F.bodyMed, marginBottom: 14, fontSize: 14 }]}>
            pts
          </Text>
        </View>

        {/* Cashback pill */}
        <View style={styles.heroCashbackRow}>
          <MaterialCommunityIcons name="cash-refund" size={11} color={C.goldDeep} />
          <Text style={[styles.heroCashbackText, { fontFamily: F.bodySemi }]}>
            {"  ₹" + CASHBACK_EARNED + " cashback earned this month"}
          </Text>
        </View>
      </View>

      {/* ── Bottom mini stats strip ── */}
      <View style={[styles.heroDivider, { marginTop: 16 }]} />
      <View style={styles.heroStatsStrip}>
        {[
          { icon: "receipt-outline",  label: "Services",  value: String(BOOKINGS.length) },
          { icon: "currency-inr",     label: "Spent",     value: "₹" + totalSpent.toLocaleString("en-IN") },
          { icon: "trending-up",      label: "Pts Earned", value: "1,240" },
        ].map((s, i) => (
          <React.Fragment key={s.label}>
            <View style={styles.heroStat}>
              <MaterialCommunityIcons name={s.icon as any} size={12} color={C.inkFaint} />
              <Text style={[styles.heroStatVal, { fontFamily: F.displaySemi }]}>{s.value}</Text>
              <Text style={[styles.heroStatLabel, { fontFamily: F.bodyReg }]}>{s.label}</Text>
            </View>
            {i < 2 && <View style={styles.heroStatSep} />}
          </React.Fragment>
        ))}
      </View>

    </Animated.View>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ item, index }: { item: StatItem; index: number }) => {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const delay = 200 + index * 70;
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, speed: 14, bounciness: 4, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const onPressIn  = () => Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, speed: 60 }).start();
  const onPressOut = () => Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, speed: 50 }).start();

  return (
    <Animated.View
      style={[
        styles.statCard,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }, { scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity
        style={styles.statCardInner}
        activeOpacity={1}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
      >
        {/* Accent stripe */}
        <View style={[styles.statAccentStripe, { backgroundColor: item.color }]} />

        <View style={[styles.statIconWrap, { backgroundColor: item.bg }]}>
          <Ionicons name={item.icon as any} size={18} color={item.color} />
        </View>

        <Text style={[styles.statValue, { fontFamily: F.displayBold, color: item.color }]}>
          {item.value}
          {item.subValue && (
            <Text style={[styles.statSubValue, { fontFamily: F.displayReg, color: C.inkLight }]}>
              {item.subValue}
            </Text>
          )}
        </Text>
        <Text style={[styles.statLabel, { fontFamily: F.bodyMed }]}>{item.label}</Text>

        <View style={styles.statTrendRow}>
          <Ionicons
            name={item.trendPositive ? "trending-up" : "alert-circle-outline"}
            size={10}
            color={item.trendPositive ? C.sage : C.amber}
          />
          <Text
            style={[
              styles.statTrend,
              { fontFamily: F.bodyReg, color: item.trendPositive ? C.sage : C.amber },
            ]}
            numberOfLines={1}
          >
            {"  "}{item.trend}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Service Category Tile ────────────────────────────────────────────────────
const ServiceTile = ({ item, index }: { item: ServiceCategory; index: number }) => {
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const delay = 100 + index * 45;
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 380, delay, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, speed: 16, bounciness: 3, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const tileW = (width - 48 - 12) / 4;

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        width: tileW,
      }}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={() =>
          Animated.spring(scaleAnim, { toValue: 0.91, useNativeDriver: true, speed: 60 }).start()
        }
        onPressOut={() =>
          Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start()
        }
        style={styles.serviceTile}
      >
        <View
          style={[
            styles.serviceIconBox,
            { backgroundColor: item.bg, borderColor: item.color + "28" },
          ]}
        >
          <Ionicons name={item.icon as any} size={23} color={item.color} />
          <View style={[styles.serviceProBadge, { backgroundColor: item.color }]}>
            <Text style={[styles.serviceProCount, { fontFamily: F.bodyBold }]}>
              {item.proCount}
            </Text>
          </View>
        </View>
        <Text style={[styles.serviceName, { fontFamily: F.bodyMed }]} numberOfLines={2}>
          {item.name}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Promo Card ───────────────────────────────────────────────────────────────
const PromoCard = ({ promo }: { promo: Promo }) => (
  <View style={[styles.promoCard, { backgroundColor: promo.darkBg }]}>
    {/* Background orbs */}
    <View style={[styles.promoOrb1, { backgroundColor: promo.accent + "40" }]} />
    <View style={[styles.promoOrb2, { backgroundColor: promo.accent + "18" }]} />

    <View style={styles.promoContent}>
      <View style={[styles.promoTag, { backgroundColor: promo.accent + "30", borderColor: promo.accent + "50" }]}>
        <Text style={[styles.promoTagText, { fontFamily: F.bodyBold, color: promo.accent }]}>
          {promo.tag}
        </Text>
      </View>
      <Text style={[styles.promoHeadline, { fontFamily: F.displayBold }]}>{promo.headline}</Text>
      <Text style={[styles.promoBody, { fontFamily: F.bodyReg }]}>{promo.body}</Text>
      <TouchableOpacity
        style={[styles.promoCTA, { backgroundColor: promo.accent }]}
        activeOpacity={0.85}
      >
        <Text style={[styles.promoCTAText, { fontFamily: F.bodySemi }]}>{promo.cta}</Text>
        <Ionicons name="arrow-forward" size={13} color="#FFF" style={{ marginLeft: 5 }} />
      </TouchableOpacity>
    </View>

    <View style={[styles.promoIconWrap, { backgroundColor: promo.accent + "28", borderColor: promo.accent + "40" }]}>
      <MaterialCommunityIcons name={promo.mcIcon as any} size={40} color={promo.accent} />
    </View>
  </View>
);

// ─── Booking Card ─────────────────────────────────────────────────────────────
const BookingCard = ({ item, index }: { item: Booking; index: number }) => {
  const sc = STATUS_CONFIG[item.status];
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    const delay = 150 + index * 100;
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 420, delay, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, speed: 12, bounciness: 4, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bookingCard,
        { borderLeftColor: item.color, opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* Radial glow */}
      <View style={[styles.bookingGlow, { backgroundColor: item.color + "0F" }]} />

      {/* Main row */}
      <View style={styles.bookingMain}>
        {/* Icon */}
        <View style={[styles.bookingIconWrap, { backgroundColor: item.bg }]}>
          <MaterialCommunityIcons name={item.mcIcon as any} size={22} color={item.color} />
        </View>

        {/* Info */}
        <View style={{ flex: 1, gap: 4 }}>
          {/* Top: title + status */}
          <View style={styles.bookingTopRow}>
            <Text style={[styles.bookingTitle, { fontFamily: F.displaySemi }]} numberOfLines={1}>
              {item.service}
            </Text>
            <View style={[styles.bookingStatusPill, { backgroundColor: sc.bg }]}>
              {item.status === "ongoing" ? (
                <PulsingDot color={sc.color} />
              ) : (
                <Ionicons name={sc.ionIcon as any} size={10} color={sc.color} />
              )}
              <Text style={[styles.bookingStatusText, { fontFamily: F.bodySemi, color: sc.color }]}>
                {" "}{sc.label}
              </Text>
            </View>
          </View>

          {/* Provider row */}
          <View style={styles.bookingProviderRow}>
            <View style={[styles.bookingInitials, { backgroundColor: item.bg, borderColor: item.color + "40" }]}>
              <Text style={[styles.bookingInitialsText, { fontFamily: F.displaySemi, color: item.color }]}>
                {item.initials}
              </Text>
            </View>
            <Text style={[styles.bookingProvider, { fontFamily: F.bodyMed }]} numberOfLines={1}>
              {item.provider}
            </Text>
          </View>

          {/* Meta row */}
          <View style={styles.bookingMetaRow}>
            <Ionicons name="calendar-outline" size={11} color={C.inkLight} />
            <Text style={[styles.bookingMeta, { fontFamily: F.bodyReg }]}> {item.date}</Text>
            <View style={styles.metaDivider} />
            <Ionicons name="time-outline" size={11} color={C.inkLight} />
            <Text style={[styles.bookingMeta, { fontFamily: F.bodyReg }]}> {item.time}</Text>
            <View style={styles.metaDivider} />
            <Text style={[styles.bookingRef, { fontFamily: F.bodyReg }]}>{item.bookingRef}</Text>
          </View>

          {/* Rating (if completed) */}
          {item.status === "completed" && item.rating && (
            <View style={styles.bookingRatingRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <Ionicons
                  key={star}
                  name={star <= Math.floor(item.rating!) ? "star" : "star-outline"}
                  size={11}
                  color={C.gold}
                />
              ))}
              <Text style={[styles.bookingRatingVal, { fontFamily: F.bodySemi }]}>
                {" "}{item.rating}
              </Text>
            </View>
          )}
        </View>

        {/* Price */}
        <Text style={[styles.bookingPrice, { fontFamily: F.displaySemi, color: item.color }]}>
          ₹{item.price.toLocaleString()}
        </Text>
      </View>

      {/* Footer actions */}
      <View style={[styles.bookingFooter, { borderTopColor: C.ruleLight }]}>
        <TouchableOpacity style={styles.footerSecBtn} activeOpacity={0.75}>
          <Ionicons name="chatbubble-ellipses-outline" size={13} color={C.inkMid} />
          <Text style={[styles.footerSecBtnText, { fontFamily: F.bodySemi }]}>Chat</Text>
        </TouchableOpacity>

        <View style={styles.footerDivider} />

        <TouchableOpacity style={styles.footerSecBtn} activeOpacity={0.75}>
          <Ionicons name="document-text-outline" size={13} color={C.inkMid} />
          <Text style={[styles.footerSecBtnText, { fontFamily: F.bodySemi }]}>Details</Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        {item.status === "upcoming" && (
          <TouchableOpacity
            style={[styles.footerPriBtn, { backgroundColor: item.color }]}
            activeOpacity={0.85}
          >
            <Ionicons name="navigate" size={13} color="#FFF" />
            <Text style={[styles.footerPriBtnText, { fontFamily: F.bodySemi }]}>Track Pro</Text>
          </TouchableOpacity>
        )}
        {item.status === "ongoing" && (
          <TouchableOpacity
            style={[styles.footerPriBtn, { backgroundColor: item.color }]}
            activeOpacity={0.85}
          >
            <Ionicons name="radio-button-on" size={13} color="#FFF" />
            <Text style={[styles.footerPriBtnText, { fontFamily: F.bodySemi }]}>Live Track</Text>
          </TouchableOpacity>
        )}
        {item.status === "completed" && (
          <TouchableOpacity
            style={[styles.footerPriBtn, { backgroundColor: item.color }]}
            activeOpacity={0.85}
          >
            <Ionicons name="refresh" size={13} color="#FFF" />
            <Text style={[styles.footerPriBtnText, { fontFamily: F.bodySemi }]}>Rebook</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

// ─── Trust Strip ──────────────────────────────────────────────────────────────
const TrustStrip = () => (
  <View style={styles.trustStrip}>
    {[
      { icon: "shield-checkmark", label: "1,200+ Verified Pros", color: C.sage   },
      { icon: "star",             label: "4.7★ Avg Rating",      color: C.gold   },
      { icon: "flash",            label: "18 min Avg Response",  color: C.cobalt },
    ].map((t, i) => (
      <View key={t.label} style={styles.trustItem}>
        <View style={[styles.trustIcon, { backgroundColor: t.color + "18" }]}>
          <Ionicons name={t.icon as any} size={14} color={t.color} />
        </View>
        <Text style={[styles.trustLabel, { fontFamily: F.bodyMed }]} numberOfLines={1}>
          {t.label}
        </Text>
      </View>
    ))}
  </View>
);

// ─── Bottom Navigation Component ──────────────────────────────────────────────
// ✅ UPDATED: Added 'services' to the TabType union
type TabType = 'home' | 'services' | 'bookings' | 'wallet' | 'profile';

const BottomNavigation = ({ activeTab, onTabPress }: {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}) => {
  return (
    <View style={styles.bottomNav}>
      {/* ── Home ── */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabPress('home')}
        activeOpacity={0.7}
      >
        <View style={[styles.navIconWrapper, activeTab === 'home' && styles.navIconActive]}>
          <Ionicons
            name={activeTab === 'home' ? "home" : "home-outline"}
            size={22}
            color={activeTab === 'home' ? C.terra : C.inkLight}
          />
        </View>
        <Text style={[
          styles.navLabel,
          { fontFamily: F.bodySemi },
          activeTab === 'home' && styles.navLabelActive
        ]}>
          Home
        </Text>
      </TouchableOpacity>

      {/* ── Services (NEW — 2nd position, construct-outline icon) ── */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabPress('services')}
        activeOpacity={0.7}
      >
        <View style={[styles.navIconWrapper, activeTab === 'services' && styles.navIconActive]}>
          <Ionicons
            name={activeTab === 'services' ? "construct" : "construct-outline"}
            size={22}
            color={activeTab === 'services' ? C.terra : C.inkLight}
          />
        </View>
        <Text style={[
          styles.navLabel,
          { fontFamily: F.bodySemi },
          activeTab === 'services' && styles.navLabelActive
        ]}>
          Services
        </Text>
      </TouchableOpacity>

      {/* ── Bookings ── */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabPress('bookings')}
        activeOpacity={0.7}
      >
        <View style={[styles.navIconWrapper, activeTab === 'bookings' && styles.navIconActive]}>
          <Ionicons
            name={activeTab === 'bookings' ? "calendar" : "calendar-outline"}
            size={22}
            color={activeTab === 'bookings' ? C.terra : C.inkLight}
          />
        </View>
        <Text style={[
          styles.navLabel,
          { fontFamily: F.bodySemi },
          activeTab === 'bookings' && styles.navLabelActive
        ]}>
          Bookings
        </Text>
      </TouchableOpacity>

      {/* ── Wallet ── */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabPress('wallet')}
        activeOpacity={0.7}
      >
        <View style={[styles.navIconWrapper, activeTab === 'wallet' && styles.navIconActive]}>
          <Ionicons
            name={activeTab === 'wallet' ? "wallet" : "wallet-outline"}
            size={22}
            color={activeTab === 'wallet' ? C.terra : C.inkLight}
          />
        </View>
        <Text style={[
          styles.navLabel,
          { fontFamily: F.bodySemi },
          activeTab === 'wallet' && styles.navLabelActive
        ]}>
          Transactions
        </Text>
      </TouchableOpacity>

      {/* ── Profile ── */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onTabPress('profile')}
        activeOpacity={0.7}
      >
        <View style={[styles.navIconWrapper, activeTab === 'profile' && styles.navIconActive]}>
          <Ionicons
            name={activeTab === 'profile' ? "person" : "person-outline"}
            size={22}
            color={activeTab === 'profile' ? C.terra : C.inkLight}
          />
        </View>
        <Text style={[
          styles.navLabel,
          { fontFamily: F.bodySemi },
          activeTab === 'profile' && styles.navLabelActive
        ]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [promoIndex, setPromoIndex] = useState(0);

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

  // Auto-advance promo carousel
  useEffect(() => {
    const id = setInterval(() => {
      setPromoIndex(i => {
        const next = (i + 1) % PROMOS.length;
        promoRef.current?.scrollTo({ x: next * (width - 32), animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);

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
                  <Text style={[styles.locationText, { fontFamily: F.bodySemi }]}>Civil Lines, Agra</Text>
                  <Ionicons name="chevron-down" size={11} color={C.inkLight} />
                </TouchableOpacity>

                {/* Right actions */}
                <View style={styles.headerRight}>
                  <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.75}>
                    <Ionicons name="notifications-outline" size={20} color={C.inkMid} />
                    <View style={styles.notifBadge} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.avatarBtn} activeOpacity={0.8}>
                    <Text style={[styles.avatarText, { fontFamily: F.displaySemi }]}>AM</Text>
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
                    Arjun Malhotra
                  </Text>
                  <Text style={[styles.greetSub, { fontFamily: F.bodyReg }]}>
                    What do you need sorted today?
                  </Text>
                </View>
              </View>

              {/* HERO WALLET CARD */}
              <View style={styles.heroSection}>
                <HeroCard onAddMoney={() => setActiveTab('wallet')} />
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
                    {PROMOS.map((_, i) => (
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
                  {PROMOS.map(p => (
                    <View key={p.id} style={{ width: width - 44 }}>
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
                  {CATEGORIES.map((c, i) => <ServiceTile key={c.id} item={c} index={i} />)}
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
      <StatusBar barStyle="dark-content" backgroundColor={C.canvas} translucent />

      {/* Main Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabPress={setActiveTab} />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.canvas,
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

  // Hero Card
  heroSection: {
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    padding: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.ruleLight,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  heroOrb1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(176,125,46,0.06)",
    top: -120,
    right: -80,
  },
  heroOrb2: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(192,82,43,0.04)",
    bottom: -60,
    left: -50,
  },
  heroOrb3: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(176,125,46,0.07)",
    top: 20,
    right: 60,
  },
  heroOrb4: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(61,122,96,0.06)",
    bottom: 40,
    right: 20,
  },
  heroTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },
  heroBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  heroBrandIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: C.goldLight,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.gold + "40",
  },
  heroBrandText: {
    fontSize: 14,
    color: C.inkMid,
    letterSpacing: 0.1,
  },
  heroBrandPill: {
    backgroundColor: C.goldLight,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: C.gold + "50",
  },
  heroBrandPillText: {
    fontSize: 9,
    color: C.goldDeep,
    letterSpacing: 0.8,
  },
  heroEyeBtn: {},
  heroBalanceBlock: {
    marginBottom: 14,
  },
  heroBalLabel: {
    fontSize: 12,
    color: C.inkLight,
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  heroBalAmount: {
    fontSize: 48,
    color: C.ink,
    letterSpacing: -2,
    marginBottom: 10,
  },
  heroCashbackRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.goldLight,
    alignSelf: "flex-start",
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: C.gold + "30",
  },
  heroCashbackText: {
    fontSize: 11,
    color: C.goldDeep,
  },
  heroProgressSection: {
    marginTop: 18,
    marginBottom: 16,
  },
  heroProgressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  heroProgressLabel: {
    fontSize: 11,
    color: C.inkLight,
    flex: 1,
  },
  heroProgressPct: {
    fontSize: 11,
    color: C.terra,
    marginLeft: 8,
  },
  heroProgressTrack: {
    height: 7,
    backgroundColor: C.chip,
    borderRadius: 4,
    overflow: "hidden",
  },
  heroProgressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: C.terra,
  },
  heroRewardsTitle: {
    fontSize: 12,
    color: C.inkMid,
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  heroRewardChip: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 5,
    minWidth: 80,
  },
  heroRewardIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  heroRewardLabel: {
    fontSize: 11,
    textAlign: "center",
  },
  heroRewardPts: {
    fontSize: 10,
    textAlign: "center",
  },
  heroRewardBadge: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginTop: 2,
  },
  heroRewardBadgeText: {
    fontSize: 8,
    color: "#FFF",
    letterSpacing: 0.4,
  },
  heroDivider: {
    height: 1,
    backgroundColor: C.ruleLight,
    marginBottom: 16,
  },
  heroStatsStrip: {
    flexDirection: "row",
    backgroundColor: C.chip,
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: C.ruleLight,
  },
  heroStat: {
    flex: 1,
    alignItems: "center",
    gap: 5,
  },
  heroStatVal: {
    fontSize: 13,
    color: C.ink,
    letterSpacing: -0.3,
  },
  heroStatLabel: {
    fontSize: 10,
    color: C.inkLight,
  },
  heroStatSep: {
    width: 1,
    backgroundColor: C.ruleLight,
    marginVertical: 4,
  },
  heroActions: {
    flexDirection: "row",
    gap: 8,
  },
  heroAddBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 14,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  heroAddBtnText: {
    fontSize: 13,
    color: C.heroMid,
  },
  heroSecBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  heroSecBtnText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
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
    backgroundColor: C.terraLight,
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

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statCard: {
    width: (width - 42) / 2,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.ruleLight,
    shadowColor: C.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
    backgroundColor: C.surface,
  },
  statCardInner: {
    padding: 16,
    gap: 6,
  },
  statAccentStripe: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  statIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 22,
    letterSpacing: -0.6,
  },
  statSubValue: {
    fontSize: 14,
  },
  statLabel: {
    fontSize: 12,
    color: C.inkLight,
  },
  statTrendRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  statTrend: {
    fontSize: 10,
    flexShrink: 1,
  },

  // Promo
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
  promoCard: {
    borderRadius: 24,
    padding: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 22,
    elevation: 14,
  },
  promoOrb1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    top: -80,
    right: -40,
  },
  promoOrb2: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    bottom: -60,
    left: -30,
  },
  promoContent: {
    flex: 1,
    paddingRight: 12,
    gap: 6,
  },
  promoTag: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    marginBottom: 2,
  },
  promoTagText: {
    fontSize: 9,
    letterSpacing: 0.8,
  },
  promoHeadline: {
    fontSize: 26,
    color: "#FFF",
    letterSpacing: -0.6,
    lineHeight: 30,
  },
  promoBody: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    lineHeight: 17,
  },
  promoCTA: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderRadius: 11,
    paddingHorizontal: 14,
    paddingVertical: 9,
    marginTop: 4,
  },
  promoCTAText: {
    fontSize: 12,
    color: "#FFF",
  },
  promoIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    borderWidth: 1,
  },

  // Services Grid
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 0,
    rowGap: 18,
  },
  serviceTile: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 3,
  },
  serviceIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    position: "relative",
  },
  serviceProBadge: {
    position: "absolute",
    top: -5,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.canvas,
    paddingHorizontal: 3,
  },
  serviceProCount: {
    fontSize: 8,
    color: "#FFF",
  },
  serviceName: {
    fontSize: 11,
    color: C.inkMid,
    textAlign: "center",
    lineHeight: 15,
  },

  // Trust Strip
  trustSection: {
    paddingHorizontal: 16,
    marginBottom: 28,
  },
  trustStrip: {
    flexDirection: "row",
    backgroundColor: C.surface,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: C.ruleLight,
    shadowColor: C.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  trustItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    overflow: "hidden",
    paddingHorizontal: 4,
  },
  trustIcon: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  trustLabel: {
    fontSize: 10,
    color: C.inkMid,
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
  },

  // Booking Cards
  bookingCard: {
    backgroundColor: C.surface,
    borderRadius: 22,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: C.ruleLight,
    overflow: "hidden",
    shadowColor: C.ink,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 5,
  },
  bookingGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    top: -50,
    right: -30,
  },
  bookingMain: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    gap: 12,
  },
  bookingIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bookingTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  bookingTitle: {
    fontSize: 15,
    color: C.ink,
    letterSpacing: -0.3,
    flex: 1,
  },
  bookingStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 50,
    flexShrink: 0,
    gap: 4,
  },
  bookingStatusText: {
    fontSize: 10,
  },
  bookingProviderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  bookingInitials: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bookingInitialsText: {
    fontSize: 8,
    letterSpacing: -0.2,
  },
  bookingProvider: {
    fontSize: 12,
    color: C.inkLight,
    flex: 1,
  },
  bookingMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexWrap: "wrap",
  },
  bookingMeta: {
    fontSize: 11,
    color: C.inkLight,
  },
  metaDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: C.inkFaint,
    marginHorizontal: 1,
  },
  bookingRef: {
    fontSize: 10,
    color: C.inkFaint,
    letterSpacing: 0.2,
  },
  bookingRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  bookingRatingVal: {
    fontSize: 11,
    color: C.gold,
  },
  bookingPrice: {
    fontSize: 16,
    letterSpacing: -0.4,
    flexShrink: 0,
  },
  bookingFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderTopWidth: 1,
    gap: 6,
  },
  footerSecBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: C.canvas,
    borderWidth: 1,
    borderColor: C.rule,
  },
  footerSecBtnText: {
    fontSize: 12,
    color: C.inkMid,
  },
  footerDivider: {
    width: 1,
    height: 18,
    backgroundColor: C.ruleLight,
  },
  footerPriBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 11,
  },
  footerPriBtnText: {
    fontSize: 12,
    color: "#FFF",
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

  // ✅ Bottom Navigation — supports 5 tabs via flex: 1 on each navItem
  bottomNav: {
    flexDirection: "row",
    backgroundColor: C.surfaceRaised,
    paddingBottom: Platform.OS === "ios" ? 20 : 10,
    paddingTop: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  navIconWrapper: {
    padding: 6,
    borderRadius: 12,
  },
  navIconActive: {
    backgroundColor: C.terraLight,
  },
  navLabel: {
    fontSize: 10,   // ✅ Reduced from 11 → 10 to prevent crowding with 5 tabs
    color: C.inkLight,
  },
  navLabelActive: {
    color: C.terra,
  },

  // Placeholder Screens
  placeholderScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.canvas,
    paddingHorizontal: 32,
  },
  placeholderText: {
    fontSize: 24,
    color: C.ink,
    marginTop: 16,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: C.inkLight,
    textAlign: "center",
  },
});