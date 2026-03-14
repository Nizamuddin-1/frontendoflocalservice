/**
 * ServicesScreen.tsx — LocalFix Consumer App  (v3 — Editorial Warm)
 *
 * Changes from v2:
 *  1. Search bar — white background, elevated card style, Ionicons search icon
 *  2. Service card accent strip — white rounded icon box with MC icon in accent color
 *  3. Book Now → opens a bottom sheet with service variations/packages for that service
 *     (zero logic changes — all filtering/sorting/data untouched)
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  TextInput,
  Modal,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width, height } = Dimensions.get("window");

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

// ─── Design Tokens  (warm editorial palette) ─────────────────────────────────
const C = {
  canvas:      "#F7F3EE",
  surface:     "#FFFDF9",
  surfaceAlt:  "#EEE9E2",
  ink:         "#0F1923",
  inkMid:      "#2E3B4E",
  inkLight:    "#6B7A8D",
  inkFaint:    "#A8B3BE",
  terra:       "#C0522B",
  terraLight:  "#FAE8DF",
  terraMid:    "#E07252",
  gold:        "#B07D2E",
  goldLight:   "#FBF0D6",
  goldBright:  "#F0C96B",
  sage:        "#3D7A60",
  sageBg:      "#E6F4EC",
  cobalt:      "#1B4FD8",
  cobaltBg:    "#E9EFFC",
  plum:        "#6B3FA0",
  plumBg:      "#F0EAFA",
  rust:        "#A83E20",
  rule:        "#DDD6CE",
  ruleLight:   "#EDE8E2",
  tag:         "#ECE7DF",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type SortMode = "popular" | "price" | "rating" | "newest";
type BadgeType = "EDITOR PICK" | "MOST BOOKED" | "FLASH DEAL" | "NEW LAUNCH" | "PREMIUM";

interface ServiceVariation {
  id: string;
  label: string;
  desc: string;
  price: number;
  originalPrice?: number;
  popular?: boolean;
  mcIcon: string;
  duration: string;
}

interface Service {
  id: string;
  name: string;
  provider: string;
  providerInitials: string;
  categoryId: string;
  categoryLabel: string;
  mcIcon: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice?: number;
  badge?: BadgeType;
  tags: string[];
  eta: string;
  verified: boolean;
  accentColor: string;
  accentBg: string;
  jobCount: number;
  shortDesc: string;
  variations: ServiceVariation[];
}

interface Category {
  id: string;
  label: string;
  ionIcon: string;
  color: string;
  bg: string;
  count: number;
}

interface Feature {
  icon: string;
  label: string;
  value: string;
  color: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────
const CATEGORIES: Category[] = [
  { id: "all",        label: "All",          ionIcon: "grid",              color: C.ink,    bg: C.surfaceAlt, count: 0  },
  { id: "ac",         label: "AC & Cooling", ionIcon: "snow",              color: C.cobalt, bg: C.cobaltBg,  count: 22 },
  { id: "plumbing",   label: "Plumbing",     ionIcon: "water",             color: C.sage,   bg: C.sageBg,    count: 17 },
  { id: "electrical", label: "Electrical",   ionIcon: "flash",             color: C.gold,   bg: C.goldLight, count: 29 },
  { id: "cleaning",   label: "Cleaning",     ionIcon: "sparkles",          color: C.plum,   bg: C.plumBg,    count: 14 },
  { id: "painting",   label: "Painting",     ionIcon: "color-palette",     color: C.terra,  bg: C.terraLight,count: 8  },
  { id: "carpentry",  label: "Carpentry",    ionIcon: "hammer",            color: C.rust,   bg: "#FAEAE4",   count: 11 },
  { id: "pest",       label: "Pest Control", ionIcon: "shield-checkmark",  color: C.sage,   bg: C.sageBg,    count: 7  },
  { id: "salon",      label: "Salon",        ionIcon: "cut",               color: C.plum,   bg: C.plumBg,    count: 9  },
];

const BADGE_META: Record<BadgeType, { color: string; bg: string; icon: string }> = {
  "EDITOR PICK":  { color: C.gold,   bg: C.goldLight,  icon: "bookmark"   },
  "MOST BOOKED":  { color: C.terra,  bg: C.terraLight, icon: "flame"      },
  "FLASH DEAL":   { color: C.cobalt, bg: C.cobaltBg,   icon: "flash"      },
  "NEW LAUNCH":   { color: C.plum,   bg: C.plumBg,     icon: "sparkles"   },
  "PREMIUM":      { color: C.gold,   bg: C.goldLight,  icon: "star"       },
};

const SORT_OPTIONS: { key: SortMode; label: string; icon: string }[] = [
  { key: "popular", label: "Popular",  icon: "flame-outline"    },
  { key: "rating",  label: "Rating",   icon: "trophy-outline"   },
  { key: "price",   label: "Price",    icon: "pricetag-outline" },
  { key: "newest",  label: "Newest",   icon: "time-outline"     },
];

const SERVICES: Service[] = [
  {
    id: "1",
    name: "AC Deep Service & Gas Refill",
    provider: "Agra Air Solutions",
    providerInitials: "AA",
    categoryId: "ac",
    categoryLabel: "AC & Cooling",
    mcIcon: "air-conditioner",
    rating: 4.7,
    reviews: 1234,
    price: 599,
    originalPrice: 799,
    badge: "MOST BOOKED",
    tags: ["Same-day", "2-yr Warranty", "Certified"],
    eta: "~15 min",
    verified: true,
    accentColor: C.cobalt,
    accentBg: C.cobaltBg,
    jobCount: 3840,
    shortDesc: "Full gas top-up, coil cleaning & deep maintenance by certified technicians.",
    variations: [
      { id: "v1", label: "Basic Service",        desc: "Filter clean + visual check",               price: 299,  mcIcon: "air-conditioner",      duration: "45 min" },
      { id: "v2", label: "Deep Service",         desc: "Coil clean, drainage, full tune-up",        price: 599,  originalPrice: 799, popular: true, mcIcon: "air-conditioner", duration: "90 min" },
      { id: "v3", label: "Gas Refill Only",      desc: "Refrigerant top-up (R-22 / R-32)",          price: 850,  mcIcon: "gas-cylinder",         duration: "30 min" },
      { id: "v4", label: "Service + Gas Refill", desc: "Complete deep service with gas top-up",     price: 1299, originalPrice: 1599, mcIcon: "air-conditioner", duration: "2 hrs" },
      { id: "v5", label: "PCB / Capacitor Fix",  desc: "Electronic component diagnosis & repair",   price: 350,  mcIcon: "chip",                 duration: "60 min" },
    ],
  },
  {
    id: "2",
    name: "Home Plumbing Inspection & Repair",
    provider: "Apex Plumbing Services",
    providerInitials: "AP",
    categoryId: "plumbing",
    categoryLabel: "Plumbing",
    mcIcon: "pipe-wrench",
    rating: 4.5,
    reviews: 892,
    price: 399,
    badge: "EDITOR PICK",
    tags: ["Emergency", "Licensed", "24/7"],
    eta: "~20 min",
    verified: true,
    accentColor: C.sage,
    accentBg: C.sageBg,
    jobCount: 2210,
    shortDesc: "Comprehensive leak detection, pipe repair and full plumbing health check.",
    variations: [
      { id: "v1", label: "Health Inspection",    desc: "Full pipe & tap health check",              price: 199,  mcIcon: "pipe",                 duration: "30 min" },
      { id: "v2", label: "Leakage Repair",       desc: "Fix leaking joints, pipes or taps",         price: 399,  popular: true, mcIcon: "pipe-wrench", duration: "60 min" },
      { id: "v3", label: "Tap Replacement",      desc: "Replace one tap / faucet (part extra)",     price: 249,  mcIcon: "water-pump",           duration: "30 min" },
      { id: "v4", label: "Blocked Drain Clear",  desc: "High-pressure drain unclogging",            price: 499,  mcIcon: "water",                duration: "45 min" },
      { id: "v5", label: "Full Bathroom Fix",    desc: "Taps, shower, drain & commode check",       price: 899,  originalPrice: 1099, mcIcon: "shower", duration: "2 hrs" },
    ],
  },
  {
    id: "3",
    name: "Wiring & MCB Panel Replacement",
    provider: "SparkFix Electricals",
    providerInitials: "SF",
    categoryId: "electrical",
    categoryLabel: "Electrical",
    mcIcon: "lightning-bolt",
    rating: 4.8,
    reviews: 2103,
    price: 299,
    originalPrice: 399,
    badge: "FLASH DEAL",
    tags: ["ISI Certified", "Insured", "Safe"],
    eta: "~10 min",
    verified: true,
    accentColor: C.gold,
    accentBg: C.goldLight,
    jobCount: 5620,
    shortDesc: "Safe rewiring, MCB upgrades and electrical hazard diagnostics.",
    variations: [
      { id: "v1", label: "Basic Inspection",     desc: "Safety check + fault report",               price: 149,  mcIcon: "flash-outline",        duration: "30 min" },
      { id: "v2", label: "Switch / Socket Fix",  desc: "Repair or replace up to 3 switches",        price: 299,  popular: true, originalPrice: 399, mcIcon: "power-plug", duration: "45 min" },
      { id: "v3", label: "MCB Replacement",      desc: "Single MCB swap with ISI parts",            price: 450,  mcIcon: "electric-switch",      duration: "60 min" },
      { id: "v4", label: "Full Panel Upgrade",   desc: "Complete distribution board replacement",   price: 1800, originalPrice: 2200, mcIcon: "home-lightning-bolt", duration: "3 hrs" },
      { id: "v5", label: "Ceiling Fan Wiring",   desc: "Install / rewire one ceiling fan",          price: 199,  mcIcon: "fan",                  duration: "30 min" },
    ],
  },
  {
    id: "4",
    name: "Deep Home Cleaning — 2BHK",
    provider: "CleanPro Home Care",
    providerInitials: "CP",
    categoryId: "cleaning",
    categoryLabel: "Cleaning",
    mcIcon: "spray-bottle",
    rating: 4.3,
    reviews: 567,
    price: 799,
    badge: "NEW LAUNCH",
    tags: ["Eco Products", "Trained Staff", "Insured"],
    eta: "~30 min",
    verified: false,
    accentColor: C.plum,
    accentBg: C.plumBg,
    jobCount: 980,
    shortDesc: "Floor-to-ceiling deep clean using hospital-grade eco-safe products.",
    variations: [
      { id: "v1", label: "1 BHK Deep Clean",     desc: "Kitchen + 1 room + bathroom",               price: 499,  mcIcon: "broom",                duration: "2 hrs" },
      { id: "v2", label: "2 BHK Deep Clean",     desc: "Kitchen + 2 rooms + 2 bathrooms",           price: 799,  popular: true, mcIcon: "spray-bottle", duration: "3.5 hrs" },
      { id: "v3", label: "3 BHK Deep Clean",     desc: "Full home including balconies",             price: 1099, mcIcon: "home-outline",         duration: "5 hrs" },
      { id: "v4", label: "Kitchen Only",         desc: "Chimney, tiles, appliance surfaces",        price: 349,  mcIcon: "chef-hat",             duration: "90 min" },
      { id: "v5", label: "Bathroom Sanitise",    desc: "Deep scrub + anti-bacterial treatment",     price: 249,  originalPrice: 299, mcIcon: "shower-head", duration: "45 min" },
    ],
  },
  {
    id: "5",
    name: "Interior Wall Painting — Per Room",
    provider: "PaintMaster Pro",
    providerInitials: "PM",
    categoryId: "painting",
    categoryLabel: "Painting",
    mcIcon: "format-paint",
    rating: 4.6,
    reviews: 445,
    price: 1499,
    originalPrice: 1999,
    badge: "PREMIUM",
    tags: ["Free Estimate", "Premium Paint", "3-yr Warranty"],
    eta: "~45 min",
    verified: true,
    accentColor: C.terra,
    accentBg: C.terraLight,
    jobCount: 1340,
    shortDesc: "Premium interior painting with top-brand paints and precision finishing.",
    variations: [
      { id: "v1", label: "Economy Paint",        desc: "Asian Paints Tractor Emulsion",             price: 899,  mcIcon: "format-paint",         duration: "1 day" },
      { id: "v2", label: "Premium Emulsion",     desc: "Royale / Apex Ultima, 1 coat",              price: 1499, popular: true, originalPrice: 1999, mcIcon: "format-paint", duration: "1 day" },
      { id: "v3", label: "Texture Finish",       desc: "Artistic texture wall design",              price: 2499, mcIcon: "texture",              duration: "2 days" },
      { id: "v4", label: "Waterproofing Coat",   desc: "Anti-damp base before painting",            price: 799,  mcIcon: "water-off",            duration: "4 hrs" },
      { id: "v5", label: "Full Home (2BHK)",     desc: "All rooms, premium paint, 3-yr warranty",   price: 18999,originalPrice: 24999, mcIcon: "home-outline", duration: "3 days" },
    ],
  },
  {
    id: "6",
    name: "Custom Furniture & Woodwork",
    provider: "WoodCraft Carpentry",
    providerInitials: "WC",
    categoryId: "carpentry",
    categoryLabel: "Carpentry",
    mcIcon: "saw-blade",
    rating: 4.4,
    reviews: 310,
    price: 999,
    tags: ["Custom Work", "Teak Wood", "Warranty"],
    eta: "~60 min",
    verified: true,
    accentColor: C.rust,
    accentBg: "#FAEAE4",
    jobCount: 760,
    shortDesc: "Bespoke furniture design, modular wardrobes and solid wood repairs.",
    variations: [
      { id: "v1", label: "Repair / Polish",      desc: "Fix scratches, loose joints, re-polish",    price: 499,  mcIcon: "hammer-screwdriver",   duration: "2 hrs" },
      { id: "v2", label: "Wardrobe Assembly",    desc: "Flat-pack or custom wardrobe fitting",      price: 999,  popular: true, mcIcon: "wardrobe", duration: "3 hrs" },
      { id: "v3", label: "Bed Frame Build",      desc: "King / Queen frame assembly & fitting",     price: 799,  mcIcon: "bed",                  duration: "2 hrs" },
      { id: "v4", label: "Kitchen Cabinet Fit",  desc: "Modular kitchen unit installation",         price: 2499, originalPrice: 2999, mcIcon: "kitchen-open", duration: "1 day" },
      { id: "v5", label: "Custom Shelf Unit",    desc: "Wall-mounted custom shelving",              price: 1299, mcIcon: "bookshelf",            duration: "4 hrs" },
    ],
  },
  {
    id: "7",
    name: "Pest Control & Extermination",
    provider: "SafeShield Pest Control",
    providerInitials: "SS",
    categoryId: "pest",
    categoryLabel: "Pest Control",
    mcIcon: "shield-bug",
    rating: 4.5,
    reviews: 678,
    price: 449,
    originalPrice: 599,
    badge: "MOST BOOKED",
    tags: ["Child-Safe", "Odorless", "Re-treatment Guarantee"],
    eta: "~25 min",
    verified: true,
    accentColor: C.sage,
    accentBg: C.sageBg,
    jobCount: 2140,
    shortDesc: "Targeted extermination for cockroaches, termites, rodents and more.",
    variations: [
      { id: "v1", label: "Cockroach Treatment",  desc: "Gel + spray for kitchen & bathroom",        price: 299,  mcIcon: "bug",                  duration: "45 min" },
      { id: "v2", label: "General Pest Control", desc: "All common pests, 1 BHK–3 BHK",            price: 449,  popular: true, originalPrice: 599, mcIcon: "shield-bug", duration: "90 min" },
      { id: "v3", label: "Termite Treatment",    desc: "Drill, fill & spray anti-termite",          price: 1499, mcIcon: "shield-outline",       duration: "3 hrs" },
      { id: "v4", label: "Rodent Control",       desc: "Bait + trap + entry sealing",               price: 699,  mcIcon: "mouse",                duration: "60 min" },
      { id: "v5", label: "Mosquito Fogging",     desc: "Outdoor/indoor fogging treatment",          price: 399,  originalPrice: 499, mcIcon: "smoke", duration: "30 min" },
    ],
  },
  {
    id: "8",
    name: "Full Salon At-Home Package",
    provider: "GlamTouch Beauty Studio",
    providerInitials: "GT",
    categoryId: "salon",
    categoryLabel: "Salon",
    mcIcon: "content-cut",
    rating: 4.6,
    reviews: 823,
    price: 699,
    originalPrice: 999,
    badge: "NEW LAUNCH",
    tags: ["Unisex", "Premium Products", "Doorstep"],
    eta: "~35 min",
    verified: true,
    accentColor: C.plum,
    accentBg: C.plumBg,
    jobCount: 1560,
    shortDesc: "Haircut, facial, waxing & nail art — professional salon experience at home.",
    variations: [
      { id: "v1", label: "Haircut Only",         desc: "Cut + basic styling (men or women)",        price: 199,  mcIcon: "content-cut",          duration: "30 min" },
      { id: "v2", label: "Full Grooming",        desc: "Haircut + facial + cleanup",                price: 499,  popular: true, mcIcon: "face-man-shimmer", duration: "90 min" },
      { id: "v3", label: "Bridal Package",       desc: "Mehendi, waxing, facial, hair styling",     price: 2999, originalPrice: 3999, mcIcon: "crown", duration: "4 hrs" },
      { id: "v4", label: "Waxing — Full Body",   desc: "Rica or chocolate wax, full body",          price: 799,  originalPrice: 999, mcIcon: "spa", duration: "90 min" },
      { id: "v5", label: "Manicure + Pedicure",  desc: "Nail filing, cuticle, polish",              price: 349,  mcIcon: "hand-back-right-outline", duration: "60 min" },
    ],
  },
];

const TRUST_FEATURES: Feature[] = [
  { icon: "shield-checkmark", label: "Verified Pros",  value: "1,200+", color: C.sage   },
  { icon: "star",             label: "Avg Rating",     value: "4.7",    color: C.gold   },
  { icon: "checkmark-circle", label: "Jobs Done",      value: "52k+",   color: C.terra  },
  { icon: "time",             label: "Avg Response",   value: "18 min", color: C.cobalt },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const Stars = ({ rating, size = 11 }: { rating: number; size?: number }) => (
  <View style={{ flexDirection: "row", gap: 1.5 }}>
    {[1,2,3,4,5].map((i) => (
      <Ionicons
        key={i}
        name={i <= Math.floor(rating) ? "star" : i - 0.5 <= rating ? "star-half" : "star-outline"}
        size={size}
        color={i <= Math.floor(rating) ? "#D4A853" : "#D4CCBF"}
      />
    ))}
  </View>
);

// ─── Trust Strip ──────────────────────────────────────────────────────────────
const TrustStrip = () => (
  <View style={styles.trustStrip}>
    {TRUST_FEATURES.map((f, i) => (
      <React.Fragment key={f.label}>
        <View style={styles.trustItem}>
          <View style={[styles.trustIconWrap, { backgroundColor: f.color + "18" }]}>
            <Ionicons name={f.icon as any} size={14} color={f.color} />
          </View>
          <View style={styles.trustTextWrap}>
            <Text style={[styles.trustValue, { fontFamily: F.displaySemi, color: f.color }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
              {f.value}
            </Text>
            <Text style={[styles.trustLabel, { fontFamily: F.bodyReg }]} numberOfLines={1}>{f.label}</Text>
          </View>
        </View>
        {i < TRUST_FEATURES.length - 1 && <View style={styles.trustDivider} />}
      </React.Fragment>
    ))}
  </View>
);

// ─── Category Pill ────────────────────────────────────────────────────────────
const CatPill = ({ cat, active, onPress }: { cat: Category; active: boolean; onPress: () => void }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const tap = () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 0.92, useNativeDriver: true, speed: 60 }),
      Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, speed: 50 }),
    ]).start();
    onPress();
  };
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.catPill, active ? { backgroundColor: C.ink, borderColor: C.ink } : { borderColor: C.rule }]}
        onPress={tap}
        activeOpacity={0.85}
      >
        <View style={[styles.catPillIcon, { backgroundColor: active ? "rgba(255,255,255,0.14)" : cat.bg }]}>
          <Ionicons name={cat.ionIcon as any} size={13} color={active ? "#FFF" : cat.color} />
        </View>
        <Text style={[styles.catPillLabel, { fontFamily: active ? F.bodySemi : F.bodyMed, color: active ? "#FFF" : C.inkMid }]}>
          {cat.label}
        </Text>
        {cat.count > 0 && !active && (
          <Text style={[styles.catPillCount, { fontFamily: F.bodyReg }]}>{cat.count}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ type }: { type?: BadgeType }) => {
  if (!type) return null;
  const m = BADGE_META[type];
  return (
    <View style={[styles.badge, { backgroundColor: m.bg, borderColor: m.color + "30" }]}>
      <Ionicons name={m.icon as any} size={8} color={m.color} style={{ marginRight: 3 }} />
      <Text style={[styles.badgeText, { fontFamily: F.bodyBold, color: m.color }]}>{type}</Text>
    </View>
  );
};

// ─── Book Now Bottom Sheet ────────────────────────────────────────────────────
const BookingSheet = ({ service, visible, onClose }: { service: Service | null; visible: boolean; onClose: () => void }) => {
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const [selectedVar, setSelectedVar] = useState<string | null>(null);

  useEffect(() => {
    if (visible && service) {
      // Auto-select popular variant
      const popular = service.variations.find(v => v.popular);
      setSelectedVar(popular?.id ?? service.variations[0]?.id ?? null);
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 14, bounciness: 3 }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: height, duration: 280, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, service]);

  if (!service) return null;

  const chosen = service.variations.find(v => v.id === selectedVar);
  const discPct = chosen?.originalPrice
    ? Math.round(((chosen.originalPrice - chosen.price) / chosen.originalPrice) * 100)
    : null;

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose} statusBarTranslucent>
      {/* Backdrop */}
      <Animated.View style={[styles.sheetOverlay, { opacity: fadeAnim }]}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} activeOpacity={1} />
      </Animated.View>

      {/* Sheet */}
      <Animated.View style={[styles.bookSheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* Handle */}
        <View style={styles.sheetHandle} />

        {/* Header */}
        <View style={styles.bookSheetHeader}>
          <View style={[styles.bookSheetHeaderIcon, { backgroundColor: service.accentBg }]}>
            <MaterialCommunityIcons name={service.mcIcon as any} size={20} color={service.accentColor} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.bookSheetTitle, { fontFamily: F.displayBold }]} numberOfLines={1}>
              {service.name}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
              <Text style={[styles.bookSheetProvider, { fontFamily: F.bodyMed }]}>{service.provider}</Text>
              {service.verified && <Ionicons name="shield-checkmark" size={11} color={C.sage} />}
            </View>
          </View>
          <TouchableOpacity style={styles.bookSheetCloseBtn} onPress={onClose} activeOpacity={0.75}>
            <Ionicons name="close" size={18} color={C.inkLight} />
          </TouchableOpacity>
        </View>

        {/* Section label */}
        <Text style={[styles.bookSheetSectionLabel, { fontFamily: F.bodyBold }]}>Choose a Package</Text>

        {/* Variations list */}
        <ScrollView showsVerticalScrollIndicator={false} style={styles.varScroll} contentContainerStyle={{ paddingBottom: 8 }}>
          {service.variations.map((v) => {
            const isSelected = selectedVar === v.id;
            const vDisc = v.originalPrice
              ? Math.round(((v.originalPrice - v.price) / v.originalPrice) * 100)
              : null;
            return (
              <TouchableOpacity
                key={v.id}
                style={[
                  styles.varCard,
                  isSelected && { borderColor: service.accentColor, borderWidth: 2, backgroundColor: service.accentBg + "60" },
                ]}
                onPress={() => setSelectedVar(v.id)}
                activeOpacity={0.85}
              >
                {/* Selected indicator */}
                <View style={[
                  styles.varRadio,
                  isSelected
                    ? { backgroundColor: service.accentColor, borderColor: service.accentColor }
                    : { borderColor: C.rule, backgroundColor: C.surface },
                ]}>
                  {isSelected && <View style={styles.varRadioDot} />}
                </View>

                {/* Icon */}
                <View style={[styles.varIconBox, { backgroundColor: isSelected ? service.accentColor + "20" : C.tag }]}>
                  <MaterialCommunityIcons name={v.mcIcon as any} size={18} color={isSelected ? service.accentColor : C.inkLight} />
                </View>

                {/* Info */}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <Text style={[styles.varLabel, { fontFamily: F.displaySemi, color: isSelected ? service.accentColor : C.ink }]}>
                      {v.label}
                    </Text>
                    {v.popular && (
                      <View style={[styles.varPopularBadge, { backgroundColor: service.accentColor }]}>
                        <Text style={[styles.varPopularText, { fontFamily: F.bodyBold }]}>POPULAR</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[styles.varDesc, { fontFamily: F.bodyReg }]} numberOfLines={2}>{v.desc}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <Ionicons name="time-outline" size={11} color={C.inkFaint} />
                    <Text style={[styles.varDuration, { fontFamily: F.bodyReg }]}>{v.duration}</Text>
                  </View>
                </View>

                {/* Price */}
                <View style={styles.varPriceBlock}>
                  {v.originalPrice && (
                    <Text style={[styles.varOriginalPrice, { fontFamily: F.bodyReg }]}>₹{v.originalPrice}</Text>
                  )}
                  <Text style={[styles.varPrice, { fontFamily: F.displayBold, color: isSelected ? service.accentColor : C.ink }]}>
                    ₹{v.price}
                  </Text>
                  {vDisc && (
                    <View style={[styles.varDiscBadge, { backgroundColor: C.sageBg }]}>
                      <Text style={[styles.varDiscText, { fontFamily: F.bodyBold }]}>{vDisc}% off</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* What's included note */}
        <View style={styles.bookSheetIncludesRow}>
          <Ionicons name="checkmark-circle" size={14} color={C.sage} style={{ marginRight: 6 }} />
          <Text style={[styles.bookSheetIncludesText, { fontFamily: F.bodyReg }]}>
            Includes visit charges · Spare parts billed separately
          </Text>
        </View>

        {/* Footer CTA */}
        <View style={styles.bookSheetFooter}>
          <View>
            <Text style={[styles.bookSheetFooterLabel, { fontFamily: F.bodyReg }]}>Selected package</Text>
            <View style={{ flexDirection: "row", alignItems: "baseline", gap: 4 }}>
              <Text style={[styles.bookSheetFooterPrice, { fontFamily: F.displayBold }]}>
                ₹{chosen?.price ?? service.price}
              </Text>
              {discPct && (
                <Text style={[styles.bookSheetFooterDisc, { fontFamily: F.bodySemi }]}>{discPct}% off</Text>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={[styles.bookSheetCTA, { backgroundColor: service.accentColor }]}
            activeOpacity={0.88}
            onPress={onClose}
          >
            <Ionicons name="calendar-outline" size={16} color="#FFF" style={{ marginRight: 8 }} />
            <Text style={[styles.bookSheetCTAText, { fontFamily: F.bodySemi }]}>Confirm Booking</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

// ─── Service Card ─────────────────────────────────────────────────────────────
const ServiceCard = ({
  item,
  index,
  onBook,
}: {
  item: Service;
  index: number;
  onBook: (service: Service) => void;
}) => {
  const entryY = useRef(new Animated.Value(32)).current;
  const entryO = useRef(new Animated.Value(0)).current;
  const pressS = useRef(new Animated.Value(1)).current;
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entryO, { toValue: 1, duration: 420, delay: index * 70, useNativeDriver: true }),
      Animated.spring(entryY, { toValue: 0, delay: index * 70, speed: 13, bounciness: 4, useNativeDriver: true }),
    ]).start();
  }, []);

  const pressIn  = () => Animated.spring(pressS, { toValue: 0.972, useNativeDriver: true, speed: 60 }).start();
  const pressOut = () => Animated.spring(pressS, { toValue: 1,     useNativeDriver: true, speed: 60 }).start();

  const disc = item.originalPrice
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : null;

  return (
    <Animated.View style={[styles.card, { opacity: entryO, transform: [{ translateY: entryY }, { scale: pressS }] }]}>
      <TouchableOpacity activeOpacity={1} onPressIn={pressIn} onPressOut={pressOut}>

        {/* ── Left accent strip with WHITE ICON BOX ── */}
        <View style={[styles.cardAccentStrip, { backgroundColor: item.accentColor }]}>
          {/* Subtle ghost watermark behind everything */}
          <MaterialCommunityIcons
            name={item.mcIcon as any}
            size={80}
            color="rgba(255,255,255,0.10)"
            style={styles.cardStripGhost}
          />

          {/* Category label — vertical */}
          <View style={styles.cardStripLabel}>
            <Text style={[styles.cardStripLabelText, { fontFamily: F.bodyBold }]} numberOfLines={1}>
              {item.categoryLabel.toUpperCase()}
            </Text>
          </View>

          {/* ── WHITE ICON BOX (the new highlighted element) ── */}
          <View style={styles.cardStripIconBox}>
            <MaterialCommunityIcons name={item.mcIcon as any} size={26} color={item.accentColor} />
          </View>

          {/* Jobs count badge at bottom */}
          <View style={styles.cardStripJobsBadge}>
            <Text style={[styles.cardStripJobsNum, { fontFamily: F.displaySemi }]}>
              {item.jobCount >= 1000 ? `${(item.jobCount / 1000).toFixed(1)}k` : item.jobCount}
            </Text>
            <Text style={[styles.cardStripJobsSub, { fontFamily: F.bodyReg }]}>jobs</Text>
          </View>
        </View>

        {/* ── Main content ── */}
        <View style={styles.cardContent}>
          <View style={styles.cardHeaderRow}>
            <Badge type={item.badge} />
            <TouchableOpacity
              style={[styles.wishlistBtn, liked && { backgroundColor: "#FEF2F2", borderColor: "#FECACA" }]}
              onPress={() => setLiked(!liked)}
              activeOpacity={0.7}
            >
              <Ionicons name={liked ? "heart" : "heart-outline"} size={16} color={liked ? "#EF4444" : C.inkFaint} />
            </TouchableOpacity>
          </View>

          <View style={styles.providerChip}>
            <View style={[styles.providerInitialsBox, { backgroundColor: item.accentBg, borderColor: item.accentColor + "33" }]}>
              <Text style={[styles.providerInitialsText, { color: item.accentColor, fontFamily: F.displaySemi }]}>
                {item.providerInitials}
              </Text>
            </View>
            <Text style={[styles.providerName, { fontFamily: F.bodyMed }]} numberOfLines={1}>{item.provider}</Text>
            {item.verified && <Ionicons name="shield-checkmark" size={12} color={C.sage} style={{ marginLeft: 3 }} />}
          </View>

          <Text style={[styles.serviceName, { fontFamily: F.displayBold }]} numberOfLines={2}>{item.name}</Text>
          <Text style={[styles.serviceDesc, { fontFamily: F.bodyReg }]} numberOfLines={2}>{item.shortDesc}</Text>

          <View style={styles.metaRow}>
            <Stars rating={item.rating} />
            <Text style={[styles.metaRatingNum, { fontFamily: F.bodyBold }]}>{item.rating}</Text>
            <Text style={[styles.metaRatingCount, { fontFamily: F.bodyReg }]}>({item.reviews.toLocaleString()})</Text>
            <View style={styles.metaDot} />
            <Ionicons name="time-outline" size={12} color={C.inkLight} />
            <Text style={[styles.metaETA, { fontFamily: F.bodyMed }]}>{item.eta}</Text>
          </View>

          <View style={styles.tagsRow}>
            {item.tags.slice(0, 3).map((t) => (
              <View key={t} style={styles.tagPill}>
                <Text style={[styles.tagText, { fontFamily: F.bodyMed }]}>{t}</Text>
              </View>
            ))}
            {disc && (
              <View style={styles.discPill}>
                <Ionicons name="pricetag" size={9} color={C.sage} style={{ marginRight: 3 }} />
                <Text style={[styles.discText, { fontFamily: F.bodyBold }]}>{disc}% off</Text>
              </View>
            )}
          </View>

          <View style={styles.cardRule} />

          <View style={styles.cardFooter}>
            <View>
              {item.originalPrice && (
                <Text style={[styles.priceOriginal, { fontFamily: F.bodyReg }]}>₹{item.originalPrice}</Text>
              )}
              <View style={{ flexDirection: "row", alignItems: "baseline", gap: 3 }}>
                <Text style={[styles.priceValue, { fontFamily: F.displayBold }]}>₹{item.price}</Text>
                <Text style={[styles.priceUnit, { fontFamily: F.bodyReg }]}>onwards</Text>
              </View>
            </View>
            <View style={styles.ctaGroup}>
              <TouchableOpacity style={styles.detailBtn} activeOpacity={0.75}>
                <Ionicons name="information-circle-outline" size={17} color={C.inkMid} />
              </TouchableOpacity>
              {/* ── BOOK NOW → opens variation sheet ── */}
              <TouchableOpacity
                style={[styles.bookBtn, { backgroundColor: item.accentColor }]}
                activeOpacity={0.85}
                onPress={() => onBook(item)}
              >
                <Text style={[styles.bookBtnText, { fontFamily: F.bodySemi }]}>Book Now</Text>
                <Ionicons name="arrow-forward" size={14} color="#FFF" style={{ marginLeft: 5 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

// ─── Filter Bottom Sheet ──────────────────────────────────────────────────────
const FilterSheet = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const slide = useRef(new Animated.Value(520)).current;
  const fade  = useRef(new Animated.Value(0)).current;
  const [sort, setSort]           = useState<SortMode>("popular");
  const [minRating, setMinRating] = useState(0);
  const [verified, setVerified]   = useState(false);
  const [sameDay, setSameDay]     = useState(false);
  const [maxPrice, setMaxPrice]   = useState(5000);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slide, { toValue: 0, useNativeDriver: true, speed: 16, bounciness: 2 }),
        Animated.timing(fade,  { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slide, { toValue: 520, duration: 250, useNativeDriver: true }),
        Animated.timing(fade,  { toValue: 0,   duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  const priceMarkers = [500, 1000, 2000, 3500, 5000];

  return (
    <Animated.View style={[styles.sheetOverlay, { opacity: fade }]}>
      <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} activeOpacity={1} />
      <Animated.View style={[styles.filterSheet, { transform: [{ translateY: slide }] }]}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetHeaderRow}>
          <Text style={[styles.sheetTitle, { fontFamily: F.displaySemi }]}>Refine Results</Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={styles.sheetResetBtn}
              onPress={() => { setSort("popular"); setMinRating(0); setVerified(false); setSameDay(false); setMaxPrice(5000); }}
              activeOpacity={0.75}
            >
              <Ionicons name="refresh-outline" size={13} color={C.terra} style={{ marginRight: 4 }} />
              <Text style={[styles.sheetResetText, { fontFamily: F.bodySemi }]}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.sheetCloseBtn} onPress={onClose} activeOpacity={0.75}>
              <Ionicons name="close" size={17} color={C.inkLight} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <Text style={[styles.sheetSectionLabel, { fontFamily: F.bodySemi }]}>Sort by</Text>
          <View style={styles.sheetSortRow}>
            {SORT_OPTIONS.map((opt) => {
              const active = sort === opt.key;
              return (
                <TouchableOpacity key={opt.key} style={[styles.sheetSortChip, active && styles.sheetSortChipActive]} onPress={() => setSort(opt.key)} activeOpacity={0.75}>
                  <Ionicons name={opt.icon as any} size={13} color={active ? "#FFF" : C.inkLight} style={{ marginRight: 5 }} />
                  <Text style={[styles.sheetSortChipText, { fontFamily: active ? F.bodySemi : F.bodyMed }, active && { color: "#FFF" }]}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.sheetSectionLabel, { fontFamily: F.bodySemi }]}>Minimum Rating</Text>
          <View style={styles.sheetRatingRow}>
            {[0, 3, 3.5, 4, 4.5].map((r) => {
              const active = minRating === r;
              return (
                <TouchableOpacity key={r} style={[styles.sheetRatingChip, active && styles.sheetRatingChipActive]} onPress={() => setMinRating(r)} activeOpacity={0.75}>
                  {r > 0 && <Ionicons name="star" size={11} color={active ? "#FFF" : "#D4A853"} style={{ marginRight: 3 }} />}
                  <Text style={[styles.sheetRatingChipText, { fontFamily: active ? F.bodySemi : F.bodyMed }, active && { color: "#FFF" }]}>{r === 0 ? "Any" : `${r}+`}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={[styles.sheetSectionLabel, { fontFamily: F.bodySemi }]}>Max Price</Text>
          <View style={styles.sheetPriceRow}>
            {priceMarkers.map((p) => {
              const active = maxPrice === p;
              return (
                <TouchableOpacity key={p} style={[styles.sheetPriceChip, active && styles.sheetPriceChipActive]} onPress={() => setMaxPrice(p)} activeOpacity={0.75}>
                  <Text style={[styles.sheetPriceChipText, { fontFamily: active ? F.bodySemi : F.bodyMed }, active && { color: "#FFF" }]}>₹{p >= 1000 ? `${p / 1000}k` : p}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {[
            { key: "verified", label: "Verified Providers Only", sub: "Background-checked & licensed", icon: "shield-checkmark-outline", color: C.sage,   val: verified, set: () => setVerified(!verified) },
            { key: "sameday",  label: "Same-Day Availability",   sub: "Book and get service today",    icon: "flash-outline",            color: C.cobalt, val: sameDay,  set: () => setSameDay(!sameDay)   },
          ].map((row) => (
            <TouchableOpacity key={row.key} style={styles.sheetToggleRow} onPress={row.set} activeOpacity={0.8}>
              <View style={[styles.sheetToggleIcon, { backgroundColor: row.color + "18" }]}>
                <Ionicons name={row.icon as any} size={16} color={row.color} />
              </View>
              <View style={styles.sheetToggleText}>
                <Text style={[styles.sheetToggleLabel, { fontFamily: F.bodySemi }]}>{row.label}</Text>
                <Text style={[styles.sheetToggleSub,   { fontFamily: F.bodyReg  }]}>{row.sub}</Text>
              </View>
              <View style={[styles.toggleTrack, { backgroundColor: row.val ? row.color + "35" : C.ruleLight }]}>
                <View style={[styles.toggleThumb, { backgroundColor: row.val ? row.color : C.inkFaint, alignSelf: row.val ? "flex-end" : "flex-start" }]} />
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ height: 10 }} />
        </ScrollView>

        <TouchableOpacity style={styles.sheetApplyBtn} onPress={onClose} activeOpacity={0.85}>
          <Ionicons name="checkmark-done-circle" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={[styles.sheetApplyText, { fontFamily: F.bodySemi }]}>Apply Filters</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ServicesScreen() {
  const [activeCat,    setActiveCat]    = useState("all");
  const [query,        setQuery]        = useState("");
  const [sortMode,     setSortMode]     = useState<SortMode>("popular");
  const [showFilter,   setShowFilter]   = useState(false);
  const [searchFocus,  setSearchFocus]  = useState(false);
  const [bookingService, setBookingService] = useState<Service | null>(null);
  const [showBooking,  setShowBooking]  = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerShadow = scrollY.interpolate({ inputRange: [0, 50], outputRange: [0, 0.08], extrapolate: "clamp" });
  const headerElev   = scrollY.interpolate({ inputRange: [0, 50], outputRange: [0, 6],    extrapolate: "clamp" });

  const handleBook = useCallback((service: Service) => {
    setBookingService(service);
    setShowBooking(true);
  }, []);

  const handleCloseBooking = useCallback(() => {
    setShowBooking(false);
    // slight delay before clearing so animation plays out
    setTimeout(() => setBookingService(null), 320);
  }, []);

  const filtered = SERVICES
    .filter((s) => {
      const catOk  = activeCat === "all" || s.categoryId === activeCat;
      const termOk = s.name.toLowerCase().includes(query.toLowerCase()) || s.provider.toLowerCase().includes(query.toLowerCase());
      return catOk && termOk;
    })
    .sort((a, b) => {
      if (sortMode === "rating")  return b.rating - a.rating;
      if (sortMode === "price")   return a.price  - b.price;
      if (sortMode === "newest")  return Number(b.id) - Number(a.id);
      return b.reviews - a.reviews;
    });

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />

      {/* ── Sticky Header ── */}
      <Animated.View style={[styles.header, { shadowOpacity: headerShadow, elevation: headerElev }]}>

        {/* Row 1: Title + actions */}
        <View style={styles.headerRow1}>
          <View>
            <Text style={[styles.headerEyebrow, { fontFamily: F.bodyMed }]}>EXPLORE</Text>
            <Text style={[styles.headerTitle, { fontFamily: F.displayBold }]}>Services</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
              <Ionicons name="notifications-outline" size={20} color={C.inkMid} />
              <View style={styles.notifBadge} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarBtn} activeOpacity={0.8}>
              <Text style={[styles.avatarBtnText, { fontFamily: F.displaySemi }]}>AM</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Row 2: Location */}
        <TouchableOpacity style={styles.locationBar} activeOpacity={0.7}>
          <View style={styles.locationIconWrap}>
            <Ionicons name="location-sharp" size={14} color={C.terra} />
          </View>
          <Text style={[styles.locationText, { fontFamily: F.bodySemi }]}>Civil Lines, Agra</Text>
          <Text style={[styles.locationSub, { fontFamily: F.bodyReg }]}>  ·  Change area</Text>
          <Ionicons name="chevron-down" size={13} color={C.inkLight} style={{ marginLeft: "auto" }} />
        </TouchableOpacity>

        {/* ── Row 3: IMPROVED Search bar + filter button ── */}
        <View style={styles.searchRow}>
          <View style={[styles.searchBar, searchFocus && styles.searchBarFocused]}>
            {/* Ionicons search icon — filled style when focused */}
            <View style={[styles.searchIconWrap, searchFocus && { backgroundColor: C.terraLight }]}>
              <Ionicons
                name={searchFocus ? "search" : "search-outline"}
                size={17}
                color={searchFocus ? C.terra : C.inkLight}
              />
            </View>
            <TextInput
              style={[styles.searchInput, { fontFamily: F.bodyMed }]}
              placeholder="Search services or providers…"
              placeholderTextColor={C.inkFaint}
              value={query}
              onChangeText={setQuery}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
            />
            {query.length > 0 && (
              <TouchableOpacity
                style={styles.searchClearBtn}
                onPress={() => setQuery("")}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close-circle" size={16} color={C.inkFaint} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setShowFilter(true)}
            activeOpacity={0.75}
          >
            <Ionicons name="options" size={19} color={C.ink} />
            <View style={styles.filterDot} />
          </TouchableOpacity>
        </View>

        {/* Row 4: Category chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catsRow}>
          {CATEGORIES.map((cat) => (
            <CatPill key={cat.id} cat={cat} active={activeCat === cat.id} onPress={() => setActiveCat(cat.id)} />
          ))}
        </ScrollView>
      </Animated.View>

      {/* ── Main scroll ── */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
      >
        {activeCat === "all" && !query && <TrustStrip />}

        {/* Results bar */}
        <View style={styles.resultsBar}>
          <Text style={[styles.resultsText, { fontFamily: F.displaySemi }]}>
            {filtered.length}
            <Text style={[styles.resultsTextSub, { fontFamily: F.bodyReg }]}>{" "}result{filtered.length !== 1 ? "s" : ""}</Text>
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
            {SORT_OPTIONS.map((opt) => {
              const active = sortMode === opt.key;
              return (
                <TouchableOpacity key={opt.key} style={[styles.sortChip, active && styles.sortChipActive]} onPress={() => setSortMode(opt.key)} activeOpacity={0.75}>
                  <Ionicons name={opt.icon as any} size={11} color={active ? "#FFF" : C.inkLight} style={{ marginRight: 4 }} />
                  <Text style={[styles.sortChipText, { fontFamily: active ? F.bodySemi : F.bodyMed }, active && { color: "#FFF" }]}>{opt.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Cards */}
        {filtered.length === 0 ? (
          <View style={styles.emptyWrap}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="search-circle-outline" size={48} color={C.inkFaint} />
            </View>
            <Text style={[styles.emptyTitle, { fontFamily: F.displaySemi }]}>Nothing here</Text>
            <Text style={[styles.emptyBody,  { fontFamily: F.bodyReg   }]}>Try a different category or clear your search</Text>
            <TouchableOpacity style={styles.emptyReset} onPress={() => { setActiveCat("all"); setQuery(""); }} activeOpacity={0.8}>
              <Ionicons name="refresh-outline" size={14} color={C.terra} style={{ marginRight: 6 }} />
              <Text style={[styles.emptyResetText, { fontFamily: F.bodySemi }]}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map((item, i) => (
            <ServiceCard key={item.id} item={item} index={i} onBook={handleBook} />
          ))
        )}
        <View style={{ height: 36 }} />
      </Animated.ScrollView>

      {/* Filter sheet */}
      <FilterSheet visible={showFilter} onClose={() => setShowFilter(false)} />

      {/* Booking / Variation sheet */}
      <BookingSheet service={bookingService} visible={showBooking} onClose={handleCloseBooking} />
    </View>
  );
}

// ─── StyleSheet ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.canvas },

  // ── Header ──
  header: {
    backgroundColor: C.surface,
    paddingTop: Platform.OS === "ios" ? 54 : 34,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    zIndex: 10,
  },
  headerRow1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  headerEyebrow: { fontSize: 10, color: C.terra, letterSpacing: 1.8, marginBottom: 2 },
  headerTitle:   { fontSize: 32, color: C.ink, letterSpacing: -0.8 },
  headerRight:   { flexDirection: "row", alignItems: "center", gap: 8, paddingBottom: 4 },
  headerIconBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: C.canvas, alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: C.ruleLight,
  },
  notifBadge: {
    position: "absolute", top: 8, right: 8,
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: C.terra, borderWidth: 1.5, borderColor: C.surface,
  },
  avatarBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.ink, alignItems: "center", justifyContent: "center" },
  avatarBtnText: { fontSize: 13, color: "#FFF", letterSpacing: -0.3 },

  // Location
  locationBar: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: 18, marginBottom: 12,
    backgroundColor: C.canvas, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 9,
    borderWidth: 1, borderColor: C.rule,
  },
  locationIconWrap: { marginRight: 6 },
  locationText: { fontSize: 13, color: C.inkMid },
  locationSub:  { fontSize: 12, color: C.inkFaint },

  // ── IMPROVED Search bar ──
  searchRow: { flexDirection: "row", gap: 10, paddingHorizontal: 18, marginBottom: 12 },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
    backgroundColor: "#FFFFFF",           // pure white background
    borderRadius: 16,
    paddingRight: 12,
    paddingVertical: 0,
    borderWidth: 1.5,
    borderColor: C.ruleLight,
    // subtle elevation
    shadowColor: C.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  searchBarFocused: {
    borderColor: C.terra,
    shadowOpacity: 0.10,
  },
  searchIconWrap: {
    width: 46,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: C.ruleLight,
    marginRight: 10,
    borderRadius: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: C.ink,
    paddingVertical: 13,
  },
  searchClearBtn: {
    marginLeft: 6,
    padding: 2,
  },
  filterBtn: {
    width: 48, height: 48,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: C.ruleLight,
    shadowColor: C.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  filterDot: {
    position: "absolute", top: 9, right: 9,
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: C.terra, borderWidth: 1.5, borderColor: "#FFFFFF",
  },

  // Category pills
  catsRow: { paddingHorizontal: 18, paddingBottom: 14, paddingTop: 2, gap: 8 },
  catPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingLeft: 7, paddingRight: 12, paddingVertical: 7,
    borderRadius: 50, backgroundColor: C.surface,
    borderWidth: 1.5, marginRight: 4,
  },
  catPillIcon:  { width: 26, height: 26, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  catPillLabel: { fontSize: 13 },
  catPillCount: { fontSize: 11, color: C.inkFaint, marginLeft: 2 },

  // Trust Strip
  trustStrip: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: C.surface,
    marginHorizontal: 16, marginTop: 14, marginBottom: 4,
    borderRadius: 18, paddingVertical: 12, paddingHorizontal: 8,
    borderWidth: 1, borderColor: C.ruleLight,
    shadowColor: C.ink, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  trustItem:     { flex: 1, flexDirection: "row", alignItems: "center", gap: 5, overflow: "hidden" },
  trustIconWrap: { width: 28, height: 28, borderRadius: 9, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  trustTextWrap: { flex: 1, minWidth: 0 },
  trustValue:    { fontSize: 13, letterSpacing: -0.3 },
  trustLabel:    { fontSize: 9, color: C.inkFaint, marginTop: 1 },
  trustDivider:  { width: 1, height: 28, backgroundColor: C.ruleLight, marginHorizontal: 3, flexShrink: 0 },

  // Results bar
  resultsBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  resultsText:    { fontSize: 20, color: C.ink, letterSpacing: -0.4 },
  resultsTextSub: { fontSize: 14, color: C.inkFaint },
  sortChip: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 50, backgroundColor: C.surface,
    borderWidth: 1.5, borderColor: C.rule,
  },
  sortChipActive: { backgroundColor: C.ink, borderColor: C.ink },
  sortChipText:   { fontSize: 12, color: C.inkLight },
  scrollContent:  { paddingTop: 0, paddingBottom: 20 },

  // ── Service Card ──
  card: {
    marginHorizontal: 16, marginBottom: 16,
    backgroundColor: C.surface,
    borderRadius: 22, flexDirection: "row",
    overflow: "hidden",
    shadowColor: C.ink, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 5,
    borderWidth: 1, borderColor: C.ruleLight,
  },

  // Left accent strip
  cardAccentStrip: {
    width: 72,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 7,
    overflow: "hidden",
  },
  cardStripGhost: { position: "absolute", bottom: -10, left: -14 },
  cardStripLabel: { transform: [{ rotate: "-90deg" }], width: 80 },
  cardStripLabelText: {
    fontSize: 8, color: "rgba(255,255,255,0.60)",
    letterSpacing: 1.2, textAlign: "center",
  },
  // ── NEW: white icon box on the accent strip ──
  cardStripIconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.20,
    shadowRadius: 6,
    elevation: 6,
  },
  cardStripJobsBadge: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.20)",
    borderRadius: 10,
    paddingHorizontal: 6, paddingVertical: 5,
    width: "100%",
  },
  cardStripJobsNum: { fontSize: 13, color: "#FFF", letterSpacing: -0.3 },
  cardStripJobsSub: { fontSize: 8, color: "rgba(255,255,255,0.6)" },

  // Card content
  cardContent:   { flex: 1, padding: 14 },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  badge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7, borderWidth: 1 },
  badgeText: { fontSize: 8, letterSpacing: 0.6 },
  wishlistBtn: {
    width: 32, height: 32, borderRadius: 9,
    backgroundColor: C.canvas, alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: C.rule,
  },
  providerChip:       { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 7 },
  providerInitialsBox:{ width: 26, height: 26, borderRadius: 8, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  providerInitialsText:{ fontSize: 10, letterSpacing: -0.3 },
  providerName: { fontSize: 12, color: C.inkLight, flex: 1 },
  serviceName:  { fontSize: 16, color: C.ink, letterSpacing: -0.4, lineHeight: 22, marginBottom: 5 },
  serviceDesc:  { fontSize: 12, color: C.inkLight, lineHeight: 17, marginBottom: 9 },
  metaRow:      { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 9 },
  metaRatingNum:   { fontSize: 12, color: C.ink },
  metaRatingCount: { fontSize: 11, color: C.inkFaint },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: C.inkFaint },
  metaETA: { fontSize: 11, color: C.inkLight },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginBottom: 10 },
  tagPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 50, backgroundColor: C.tag },
  tagText: { fontSize: 10, color: C.inkLight },
  discPill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 50, backgroundColor: C.sageBg, borderWidth: 1, borderColor: "#A7F3D0" },
  discText: { fontSize: 10, color: C.sage },
  cardRule:  { height: 1, backgroundColor: C.ruleLight, marginBottom: 10 },
  cardFooter:{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  priceOriginal: { fontSize: 10, color: C.inkFaint, textDecorationLine: "line-through" },
  priceValue:    { fontSize: 19, color: C.ink, letterSpacing: -0.6 },
  priceUnit:     { fontSize: 10, color: C.inkFaint },
  ctaGroup: { flexDirection: "row", alignItems: "center", gap: 7 },
  detailBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.canvas, borderWidth: 1, borderColor: C.rule, alignItems: "center", justifyContent: "center" },
  bookBtn:   { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  bookBtnText:{ fontSize: 13, color: "#FFF" },

  // Empty state
  emptyWrap: { alignItems: "center", paddingTop: 56, paddingHorizontal: 40, gap: 10 },
  emptyIconBox: { width: 84, height: 84, borderRadius: 24, backgroundColor: C.surface, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: C.rule, marginBottom: 6 },
  emptyTitle:    { fontSize: 22, color: C.ink, letterSpacing: -0.4 },
  emptyBody:     { fontSize: 14, color: C.inkFaint, textAlign: "center", lineHeight: 20 },
  emptyReset:    { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 11, borderRadius: 13, backgroundColor: C.terraLight, borderWidth: 1.5, borderColor: C.terra + "44", marginTop: 6 },
  emptyResetText:{ fontSize: 13, color: C.terra },

  // ── Book Now / Variation Sheet ──
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,15,20,0.55)",
    zIndex: 200,
  },
  bookSheet: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    backgroundColor: C.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 44 : 28,
    maxHeight: height * 0.88,
    zIndex: 201,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 24,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.rule, alignSelf: "center", marginTop: 14, marginBottom: 18 },

  bookSheetHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 18, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: C.ruleLight },
  bookSheetHeaderIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  bookSheetTitle:    { fontSize: 16, color: C.ink, letterSpacing: -0.3 },
  bookSheetProvider: { fontSize: 12, color: C.inkLight, marginTop: 1 },
  bookSheetCloseBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.canvas, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: C.rule },

  bookSheetSectionLabel: { fontSize: 11, color: C.inkLight, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 },

  varScroll: { maxHeight: height * 0.46 },

  varCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: C.canvas,
    borderRadius: 16,
    padding: 13,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: C.ruleLight,
  },

  varRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  varRadioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#FFF" },

  varIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", flexShrink: 0 },

  varLabel:  { fontSize: 14, color: C.ink, letterSpacing: -0.2 },
  varDesc:   { fontSize: 11, color: C.inkLight, lineHeight: 15, marginTop: 2 },
  varDuration:{ fontSize: 10, color: C.inkFaint },

  varPopularBadge: { borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 },
  varPopularText:  { fontSize: 8, color: "#FFF", letterSpacing: 0.5 },

  varPriceBlock:    { alignItems: "flex-end", flexShrink: 0, minWidth: 56 },
  varOriginalPrice: { fontSize: 10, color: C.inkFaint, textDecorationLine: "line-through" },
  varPrice:         { fontSize: 16, color: C.ink, letterSpacing: -0.4 },
  varDiscBadge:     { borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2, marginTop: 2 },
  varDiscText:      { fontSize: 9, color: C.sage },

  bookSheetIncludesRow: { flexDirection: "row", alignItems: "center", backgroundColor: C.sageBg, borderRadius: 10, padding: 10, marginTop: 4, marginBottom: 14 },
  bookSheetIncludesText:{ fontSize: 11, color: C.sage, flex: 1 },

  bookSheetFooter: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingTop: 14, borderTopWidth: 1, borderTopColor: C.ruleLight,
  },
  bookSheetFooterLabel: { fontSize: 11, color: C.inkLight, marginBottom: 3 },
  bookSheetFooterPrice: { fontSize: 26, color: C.ink, letterSpacing: -0.8 },
  bookSheetFooterDisc:  { fontSize: 12, color: C.sage },
  bookSheetCTA: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 22, paddingVertical: 14,
    borderRadius: 16,
  },
  bookSheetCTAText: { fontSize: 14, color: "#FFF" },

  // ── Filter Sheet ──
  filterSheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingBottom: Platform.OS === "ios" ? 44 : 28,
    maxHeight: "84%",
  },
  sheetHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 22 },
  sheetTitle:     { fontSize: 22, color: C.ink, letterSpacing: -0.4 },
  sheetResetBtn:  { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, backgroundColor: C.terraLight, borderWidth: 1, borderColor: C.terra + "33" },
  sheetResetText: { fontSize: 12, color: C.terra },
  sheetCloseBtn:  { width: 34, height: 34, borderRadius: 10, backgroundColor: C.canvas, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: C.rule },
  sheetSectionLabel: { fontSize: 11, color: C.inkLight, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 },
  sheetSortRow:   { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  sheetSortChip:  { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, backgroundColor: C.canvas, borderWidth: 1.5, borderColor: C.rule },
  sheetSortChipActive: { backgroundColor: C.ink, borderColor: C.ink },
  sheetSortChipText:   { fontSize: 13, color: C.inkLight },
  sheetRatingRow: { flexDirection: "row", gap: 8, marginBottom: 24, flexWrap: "wrap" },
  sheetRatingChip:{ flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, backgroundColor: C.canvas, borderWidth: 1.5, borderColor: C.rule },
  sheetRatingChipActive: { backgroundColor: C.ink, borderColor: C.ink },
  sheetRatingChipText:   { fontSize: 13, color: C.inkLight },
  sheetPriceRow:  { flexDirection: "row", gap: 8, marginBottom: 24, flexWrap: "wrap" },
  sheetPriceChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, backgroundColor: C.canvas, borderWidth: 1.5, borderColor: C.rule },
  sheetPriceChipActive: { backgroundColor: C.terra, borderColor: C.terra },
  sheetPriceChipText:   { fontSize: 13, color: C.inkLight },
  sheetToggleRow: { flexDirection: "row", alignItems: "center", backgroundColor: C.canvas, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: C.ruleLight },
  sheetToggleIcon:{ width: 38, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center", marginRight: 12 },
  sheetToggleText:{ flex: 1 },
  sheetToggleLabel:{ fontSize: 14, color: C.ink },
  sheetToggleSub: { fontSize: 11, color: C.inkFaint, marginTop: 2 },
  toggleTrack:    { width: 42, height: 24, borderRadius: 12, padding: 2, justifyContent: "center" },
  toggleThumb:    { width: 20, height: 20, borderRadius: 10 },
  sheetApplyBtn:  { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: C.ink, borderRadius: 16, paddingVertical: 16, marginTop: 14 },
  sheetApplyText: { fontSize: 15, color: "#FFF" },
});