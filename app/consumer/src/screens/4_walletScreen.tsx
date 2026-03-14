/**
 * WalletScreen.tsx — LocalFix Consumer App
 *
 * Changes from previous version:
 *  • Screen background is white (#FFFFFF)
 *  • SpendSummary card redesigned as consumer transaction stats card
 *  • Transaction list filter changed to: Today, Yesterday, This Month (time-based)
 *  • All original logic preserved
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
  cardTop:     "#0F1F45",
  cardMid:     "#162847",

  bg:          "#FFFFFF",          // ← white screen background
  surface:     "#FFFFFF",
  surfaceAlt:  "#F8F9FB",
  navy:        "#0A1628",
  navyMid:     "#1C2E4A",
  blue:        "#2563EB",
  blueLight:   "#3B82F6",
  blueTint:    "#EFF6FF",
  green:       "#10B981",
  greenTint:   "#ECFDF5",
  amber:       "#F59E0B",
  amberTint:   "#FFFBEB",
  red:         "#EF4444",
  redTint:     "#FEF2F2",
  purple:      "#7C3AED",
  teal:        "#0D9488",
  tealTint:    "#F0FDFA",

  slate:       "#64748B",
  slateLight:  "#94A3B8",
  border:      "#E2E8F4",
  borderLight: "#EEF2FB",

  gold:        "#D4A853",
  goldLight:   "#F0C96B",

  // stat card accent colours
  terra:       "#C0522B",
  terraTint:   "#FDF1EC",
  cobalt:      "#1B4FD8",
  cobaltTint:  "#E9EFFC",
  sage:        "#3D7A60",
  sageTint:    "#E6F4EC",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type TxType   = "credit" | "debit" | "refund" | "cashback";
type TxStatus = "success" | "pending" | "failed";

interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: TxType;
  status: TxStatus;
  date: string;          // "Today" | "Yesterday" | "11 Mar" etc.
  time: string;
  icon: string;
  iconColor: string;
  bookingRef?: string;
}

interface Offer {
  id: string;
  title: string;
  subtitle: string;
  discount: string;
  code: string;
  expiry: string;
  color: string;
  icon: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const TRANSACTIONS: Transaction[] = [
  {
    id: "t1",
    title: "Added via UPI",
    subtitle: "Google Pay • XXXX4521",
    amount: 2000,
    type: "credit",
    status: "success",
    date: "Today",
    time: "11:34 AM",
    icon: "bank-transfer-in",
    iconColor: C.green,
  },
  {
    id: "t2",
    title: "AC Deep Service & Gas Refill",
    subtitle: "Agra Air Solutions • LF-2024-0891",
    amount: 1199,
    type: "debit",
    status: "success",
    date: "Today",
    time: "2:10 PM",
    icon: "air-conditioner",
    iconColor: C.blue,
    bookingRef: "LF-2024-0891",
  },
  {
    id: "t3",
    title: "Cashback Reward",
    subtitle: "5% cashback on AC service",
    amount: 60,
    type: "cashback",
    status: "success",
    date: "Today",
    time: "2:11 PM",
    icon: "gift-outline",
    iconColor: C.gold,
  },
  {
    id: "t4",
    title: "Deep Home Cleaning",
    subtitle: "CleanPro Home Care • LF-2024-0880",
    amount: 1499,
    type: "debit",
    status: "success",
    date: "Yesterday",
    time: "11:00 AM",
    icon: "spray-bottle",
    iconColor: C.purple,
    bookingRef: "LF-2024-0880",
  },
  {
    id: "t5",
    title: "Refund Processed",
    subtitle: "Bathroom Fixture • LF-2024-0865",
    amount: 599,
    type: "refund",
    status: "success",
    date: "Yesterday",
    time: "9:45 AM",
    icon: "cash-refund",
    iconColor: C.teal,
    bookingRef: "LF-2024-0865",
  },
  {
    id: "t6",
    title: "Added via Net Banking",
    subtitle: "SBI • XXXX8890",
    amount: 3000,
    type: "credit",
    status: "success",
    date: "This Month",
    time: "4:20 PM",
    icon: "bank-outline",
    iconColor: C.green,
  },
  {
    id: "t7",
    title: "Interior Wall Painting",
    subtitle: "PaintMaster Pro • LF-2024-0871",
    amount: 8500,
    type: "debit",
    status: "success",
    date: "This Month",
    time: "9:00 AM",
    icon: "format-paint",
    iconColor: C.red,
    bookingRef: "LF-2024-0871",
  },
  {
    id: "t8",
    title: "Wiring & MCB Replacement",
    subtitle: "SparkFix Electricals • LF-2024-0893",
    amount: 649,
    type: "debit",
    status: "pending",
    date: "This Month",
    time: "9:00 AM",
    icon: "lightning-bolt",
    iconColor: C.amber,
    bookingRef: "LF-2024-0893",
  },
];

const OFFERS: Offer[] = [
  {
    id: "o1",
    title: "Flat ₹150 Off",
    subtitle: "On your next AC or Electrical booking",
    discount: "₹150",
    code: "LOCALFIX150",
    expiry: "Expires 31 Mar",
    color: C.blue,
    icon: "lightning-bolt",
  },
  {
    id: "o2",
    title: "10% Cashback",
    subtitle: "Add ₹1000+ to wallet & get cashback",
    discount: "10%",
    code: "WALLET10",
    expiry: "Expires 20 Mar",
    color: C.green,
    icon: "wallet-outline",
  },
  {
    id: "o3",
    title: "Free Inspection",
    subtitle: "On first Plumbing or Carpentry booking",
    discount: "FREE",
    code: "FIRSTFIX",
    expiry: "Limited period",
    color: C.purple,
    icon: "wrench-outline",
  },
];

const ADD_AMOUNTS = [200, 500, 1000, 2000, 5000];

// ─── Time-based filter tabs ───────────────────────────────────────────────────
const TX_TIME_TABS = [
  { key: "all",       label: "All"        },
  { key: "Today",     label: "Today"      },
  { key: "Yesterday", label: "Yesterday"  },
  { key: "This Month",label: "This Month" },
];

// ─── TX Config ────────────────────────────────────────────────────────────────
const TX_TYPE_CONFIG: Record<TxType, { sign: string; color: string; tint: string }> = {
  credit:   { sign: "+", color: C.green,  tint: C.greenTint  },
  debit:    { sign: "−", color: C.red,    tint: C.redTint    },
  refund:   { sign: "+", color: C.teal,   tint: C.tealTint   },
  cashback: { sign: "+", color: C.gold,   tint: C.amberTint  },
};

const TX_STATUS_CONFIG: Record<TxStatus, { label: string; color: string; bg: string }> = {
  success: { label: "Success", color: "#15803D", bg: "#DCFCE7" },
  pending: { label: "Pending", color: "#92400E", bg: "#FEF9C3" },
  failed:  { label: "Failed",  color: "#991B1B", bg: "#FEE2E2" },
};

// ─── Animated Counter ─────────────────────────────────────────────────────────
const AnimatedBalance = ({ target }: { target: number }) => {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    Animated.timing(anim, {
      toValue: target,
      duration: 1200,
      useNativeDriver: false,
    }).start();
    anim.addListener(({ value }) => setDisplay(Math.floor(value)));
    return () => anim.removeAllListeners();
  }, [target]);

  return (
    <Text style={[styles.balanceAmount, { fontFamily: F.displayBold }]}>
      ₹{display.toLocaleString("en-IN")}
    </Text>
  );
};

// ─── Add Money Sheet ──────────────────────────────────────────────────────────
const AddMoneySheet = ({
  visible, onClose, onConfirm,
}: {
  visible: boolean; onClose: () => void; onConfirm: (amt: number) => void;
}) => {
  const slideAnim = useRef(new Animated.Value(400)).current;
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 4 }),
        Animated.timing(fadeAnim,  { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, { toValue: 400, duration: 220, useNativeDriver: true }),
        Animated.timing(fadeAnim,  { toValue: 0,   duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.sheetOverlay, { opacity: fadeAnim }]}>
      <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} activeOpacity={1} />
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.sheetHandle} />

        <Text style={[styles.sheetTitle, { fontFamily: F.displaySemi }]}>Add Money to Wallet</Text>
        <Text style={[styles.sheetSub,   { fontFamily: F.bodyReg    }]}>Choose an amount to add</Text>

        <View style={styles.amountGrid}>
          {ADD_AMOUNTS.map((amt) => (
            <TouchableOpacity
              key={amt}
              style={[styles.amountPill, selected === amt && styles.amountPillActive]}
              onPress={() => setSelected(amt)}
              activeOpacity={0.75}
            >
              <Text style={[
                styles.amountPillText,
                { fontFamily: F.bodySemi },
                selected === amt && { color: "#FFF" },
              ]}>
                ₹{amt.toLocaleString()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sheetSection, { fontFamily: F.bodySemi }]}>Pay via</Text>
        <View style={styles.payMethods}>
          {[
            { label: "UPI",         icon: "cellphone-nfc", color: "#4CAF50" },
            { label: "Card",        icon: "credit-card",   color: C.blue    },
            { label: "Net Banking", icon: "bank-outline",  color: C.purple  },
          ].map((m) => (
            <TouchableOpacity key={m.label} style={styles.payMethod} activeOpacity={0.75}>
              <View style={[styles.payMethodIcon, { backgroundColor: m.color + "18" }]}>
                <MaterialCommunityIcons name={m.icon as any} size={20} color={m.color} />
              </View>
              <Text style={[styles.payMethodLabel, { fontFamily: F.bodyMed }]}>{m.label}</Text>
              <Ionicons name="chevron-forward" size={14} color={C.slateLight} style={{ marginLeft: "auto" }} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.confirmBtn, !selected && { opacity: 0.45 }]}
          activeOpacity={selected ? 0.85 : 1}
          onPress={() => selected && onConfirm(selected)}
        >
          <Ionicons name="wallet-outline" size={18} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={[styles.confirmBtnText, { fontFamily: F.bodySemi }]}>
            {selected ? `Add ₹${selected.toLocaleString()} to Wallet` : "Select an Amount"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
};

// ─── Consumer Transaction Stats Card (replaces SpendSummary) ─────────────────
const SpendSummary = () => {
  // ── all original logic preserved ──
  const total   = TRANSACTIONS.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0);
  const added   = TRANSACTIONS.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const refunds = TRANSACTIONS.filter(t => t.type === "refund").reduce((s, t) => s + t.amount, 0);
  const deficit = total - added;

  // derived consumer stats
  const servicesBooked = TRANSACTIONS.filter(t => t.type === "debit" && t.bookingRef).length;
  const cashbackTotal  = TRANSACTIONS.filter(t => t.type === "cashback").reduce((s, t) => s + t.amount, 0);

  const progressAnim = useRef(new Animated.Value(0)).current;
  const pct = Math.min(added > 0 ? total / added : 1, 1);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: pct,
      duration: 1000,
      delay: 300,
      useNativeDriver: false,
    }).start();
  }, []);

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const STAT_TILES = [
    {
      label: "Services Booked",
      value: String(servicesBooked),
      icon: "briefcase-check-outline",
      color: C.cobalt,
      tint: C.cobaltTint,
    },
    {
      label: "Total Spent",
      value: "₹" + total.toLocaleString("en-IN"),
      icon: "cash-minus",
      color: C.terra,
      tint: C.terraTint,
    },
    {
      label: "Cashback Earned",
      value: "₹" + cashbackTotal.toLocaleString("en-IN"),
      icon: "cash-refund",
      color: C.sage,
      tint: C.sageTint,
    },
  ];

  return (
    <View style={styles.summaryCard}>
      {/* subtle warm orb */}
      <View style={styles.summaryBlob} />

      {/* ── Top row: brand + MAR badge ── */}
      <View style={styles.summaryTopRow}>
        <View style={styles.summaryBrandRow}>
          <View style={styles.summaryBrandIcon}>
            <MaterialCommunityIcons name="chart-donut" size={13} color={C.gold} />
          </View>
          <Text style={[styles.summaryBrandText, { fontFamily: F.bodyBold }]}>Spend Snapshot</Text>
        </View>
        <View style={styles.summaryMonthBadge}>
          <Ionicons name="calendar-outline" size={10} color={C.slate} />
          <Text style={[styles.summaryMonthBadgeText, { fontFamily: F.bodySemi }]}>{"  MAR 2024"}</Text>
        </View>
      </View>

      {/* ── Hero: eyebrow + big total ── */}
      <Text style={[styles.summaryEyebrow, { fontFamily: F.bodyReg }]}>Total Spent This Month</Text>
      <View style={styles.summaryHeroRow}>
        <Text style={[styles.summaryHeroAmount, { fontFamily: F.displayBold }]}>
          ₹{total.toLocaleString("en-IN")}
        </Text>
      </View>

      {/* ── Cashback pill ── */}
      <View style={styles.summaryCashbackPill}>
        <MaterialCommunityIcons name="cash-refund" size={11} color={C.gold} />
        <Text style={[styles.summaryCashbackText, { fontFamily: F.bodySemi }]}>
          {"  ₹" + cashbackTotal.toLocaleString("en-IN") + " cashback earned this month"}
        </Text>
      </View>

      {/* ── Divider ── */}
      <View style={styles.summaryDivider} />

      {/* ── Bottom 3-col mini stats strip ── */}
      <View style={styles.summaryStatsStrip}>
        {[
          { label: "Services",   value: String(servicesBooked) },
          { label: "Spent",      value: "₹" + total.toLocaleString("en-IN") },
          { label: "Cashback",   value: "₹" + cashbackTotal.toLocaleString("en-IN") },
        ].map((s, i) => (
          <React.Fragment key={s.label}>
            <View style={styles.summaryStat}>
              <Text style={[styles.summaryStatVal, { fontFamily: F.displaySemi }]}>{s.value}</Text>
              <Text style={[styles.summaryStatLabel, { fontFamily: F.bodyReg }]}>{s.label}</Text>
            </View>
            {i < 2 && <View style={styles.summaryStatSep} />}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

// ─── Offer Card ───────────────────────────────────────────────────────────────
const OfferCard = ({ offer }: { offer: Offer }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <View style={[styles.offerCard, { borderLeftColor: offer.color }]}>
      <View style={[styles.offerCircle, { backgroundColor: offer.color + "14" }]} />
      <View style={styles.offerLeft}>
        <View style={[styles.offerIconWrap, { backgroundColor: offer.color + "1A" }]}>
          <MaterialCommunityIcons name={offer.icon as any} size={20} color={offer.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.offerTitle,    { fontFamily: F.displaySemi, color: offer.color }]}>{offer.title}</Text>
          <Text style={[styles.offerSubtitle, { fontFamily: F.bodyReg }]}>{offer.subtitle}</Text>
          <Text style={[styles.offerExpiry,   { fontFamily: F.bodyReg }]}>{offer.expiry}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.offerCodeBtn, { borderColor: offer.color + "55", backgroundColor: offer.color + "0D" }]}
        onPress={handleCopy}
        activeOpacity={0.75}
      >
        <Text style={[styles.offerCode, { fontFamily: F.bodySemi, color: offer.color }]}>
          {copied ? "Copied!" : offer.code}
        </Text>
        {!copied && <Ionicons name="copy-outline"  size={12} color={offer.color} style={{ marginLeft: 4 }} />}
        {copied  && <Ionicons name="checkmark"     size={12} color={offer.color} style={{ marginLeft: 4 }} />}
      </TouchableOpacity>
    </View>
  );
};

// ─── Transaction Row ──────────────────────────────────────────────────────────
const TxRow = ({ tx }: { tx: Transaction }) => {
  const tc = TX_TYPE_CONFIG[tx.type];
  const sc = TX_STATUS_CONFIG[tx.status];

  return (
    <TouchableOpacity
      style={[styles.txRow, { borderLeftColor: tx.iconColor }]}
      activeOpacity={0.7}
    >
      <View style={[styles.txBgCircle, { backgroundColor: tx.iconColor + "12" }]} />
      <View style={styles.txLeft}>
        <View style={[styles.txIconWrap, { backgroundColor: tx.iconColor + "1A" }]}>
          <MaterialCommunityIcons name={tx.icon as any} size={20} color={tx.iconColor} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.txTitle, { fontFamily: F.displaySemi }]} numberOfLines={1}>{tx.title}</Text>
          <Text style={[styles.txSub,   { fontFamily: F.bodyReg }]} numberOfLines={1}>{tx.subtitle}</Text>
          <View style={styles.txMeta}>
            <Ionicons name="time-outline" size={11} color={C.slateLight} />
            <Text style={[styles.txDate, { fontFamily: F.bodyReg }]}>{" "}{tx.date} · {tx.time}</Text>
            {tx.status !== "success" && (
              <View style={[styles.txStatusChip, { backgroundColor: sc.bg }]}>
                <Text style={[styles.txStatusText, { color: sc.color, fontFamily: F.bodySemi }]}>{sc.label}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
      <View style={[styles.txAmountBadge, {
        borderColor: tc.color + "55",
        backgroundColor: tc.tint,
      }]}>
        <Text style={[styles.txAmountSign, { fontFamily: F.bodySemi, color: tc.color }]}>{tc.sign}</Text>
        <Text style={[styles.txAmount,     { fontFamily: F.displaySemi, color: tc.color }]}>
          ₹{tx.amount.toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function WalletScreen() {
  const [balance, setBalance]             = useState(3613);
  const [showAddSheet, setShowAddSheet]   = useState(false);
  const [txTimeFilter, setTxTimeFilter]   = useState("all");
  const [activeSection, setActiveSection] = useState<"transactions" | "offers">("transactions");

  // time-based filter: match against tx.date field
  const filteredTx = txTimeFilter === "all"
    ? TRANSACTIONS
    : TRANSACTIONS.filter(t => t.date === txTimeFilter);

  const handleAddMoney = (amt: number) => {
    setBalance(b => b + amt);
    setShowAddSheet(false);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[0]}
      >
        {/* ── Sticky Header ── */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { fontFamily: F.displaySemi }]}>My Transactions</Text>
           
        </View>

        {/* ── Consumer Transaction Stats Card ── */}
        <View style={styles.section}>
          <SpendSummary />
        </View>

        {/* ── Segment Toggle ── */}
        <View style={styles.section}>
          <View style={styles.segmentRow}>
            {(["transactions", "offers"] as const).map((seg) => (
              <TouchableOpacity
                key={seg}
                style={[styles.segmentBtn, activeSection === seg && styles.segmentBtnActive]}
                onPress={() => setActiveSection(seg)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={seg === "transactions" ? "receipt-outline" : "pricetag-outline"}
                  size={15}
                  color={activeSection === seg ? "#FFF" : C.slate}
                  style={{ marginRight: 6 }}
                />
                <Text style={[
                  styles.segmentText,
                  { fontFamily: F.bodySemi },
                  activeSection === seg && { color: "#FFF" },
                ]}>
                  {seg === "transactions" ? "Transactions" : "Offers & Rewards"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Transactions ── */}
        {activeSection === "transactions" && (
          <View style={styles.section}>

            {/* Time-based filter tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterTabsContent}
            >
              {TX_TIME_TABS.map((tab) => {
                const active = txTimeFilter === tab.key;
                const count  = tab.key === "all"
                  ? TRANSACTIONS.length
                  : TRANSACTIONS.filter(t => t.date === tab.key).length;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={[styles.filterTab, active && styles.filterTabActive]}
                    onPress={() => setTxTimeFilter(tab.key)}
                    activeOpacity={0.75}
                  >
                    <Text style={[
                      styles.filterTabText,
                      { fontFamily: active ? F.bodySemi : F.bodyMed },
                      active && { color: C.blue },
                    ]}>
                      {tab.label}
                    </Text>
                    <View style={[
                      styles.filterTabBadge,
                      { backgroundColor: active ? C.blue : C.border },
                    ]}>
                      <Text style={[
                        styles.filterTabBadgeText,
                        { fontFamily: F.bodyBold, color: active ? "#FFF" : C.slateLight },
                      ]}>
                        {count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {filteredTx.length === 0 ? (
              <View style={styles.txEmpty}>
                <MaterialCommunityIcons name="receipt" size={36} color={C.slateLight} />
                <Text style={[styles.txEmptyText, { fontFamily: F.bodyMed }]}>No transactions here</Text>
              </View>
            ) : (
              (() => {
                // group by date for section headers
                const grouped: { date: string; items: Transaction[] }[] = [];
                filteredTx.forEach(tx => {
                  const last = grouped[grouped.length - 1];
                  if (last && last.date === tx.date) {
                    last.items.push(tx);
                  } else {
                    grouped.push({ date: tx.date, items: [tx] });
                  }
                });
                return grouped.map(group => (
                  <View key={group.date}>
                    <View style={styles.dateSep}>
                      <View style={styles.dateSepLine} />
                      <View style={styles.dateSepChip}>
                        <Ionicons name="time-outline" size={11} color={C.blue} />
                        <Text style={[styles.dateSepText, { fontFamily: F.bodySemi }]}>
                          {" "}{group.date}
                        </Text>
                      </View>
                      <View style={styles.dateSepLine} />
                    </View>
                    {group.items.map(tx => <TxRow key={tx.id} tx={tx} />)}
                  </View>
                ));
              })()
            )}
          </View>
        )}

        {/* ── Offers & Rewards ── */}
        {activeSection === "offers" && (
          <View style={styles.section}>
            <View style={styles.cashbackBanner}>
              <View style={styles.cashbackBannerLeft}>
                <View style={styles.cashbackBannerIconWrap}>
                  <MaterialCommunityIcons name="star-four-points" size={22} color={C.goldLight} />
                </View>
                <View>
                  <Text style={[styles.cashbackBannerTitle, { fontFamily: F.displaySemi }]}>
                    ₹60 Cashback Earned
                  </Text>
                  <Text style={[styles.cashbackBannerSub, { fontFamily: F.bodyReg }]}>
                    From 1 completed booking this month
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.cashbackBannerBtn} activeOpacity={0.8}>
                <Text style={[styles.cashbackBannerBtnText, { fontFamily: F.bodySemi }]}>Redeem</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.offersHeading, { fontFamily: F.displaySemi }]}>Available Offers</Text>
            {OFFERS.map(offer => <OfferCard key={offer.id} offer={offer} />)}

            <View style={styles.referralCard}>
              <View style={styles.referralLeft}>
                <MaterialCommunityIcons name="account-multiple-plus" size={28} color={C.blue} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={[styles.referralTitle, { fontFamily: F.displaySemi }]}>Refer & Earn ₹100</Text>
                  <Text style={[styles.referralSub,   { fontFamily: F.bodyReg }]}>
                    Share your code — both get rewarded
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.referralBtn} activeOpacity={0.8}>
                <Ionicons name="share-social-outline" size={15} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={[styles.referralBtnText, { fontFamily: F.bodySemi }]}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ── Add Money Bottom Sheet ── */}
      <AddMoneySheet
        visible={showAddSheet}
        onClose={() => setShowAddSheet(false)}
        onConfirm={handleAddMoney}
      />
    </View>
  );
}

// ─── StyleSheet ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.cardTop,
  },
  scrollContent: {
    backgroundColor: C.bg,           // ← white
    paddingBottom: 20,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.bg,
    paddingTop: Platform.OS === "ios" ? 56 : 36,
    paddingBottom: 14,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  headerTitle: {
    fontSize: 20,
    color: C.navy,
    letterSpacing: -0.3,
  },
  headerAction: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
  },

  // ── Wallet Card ──
  cardWrapper: {
    backgroundColor: C.bg,
    paddingHorizontal: 16,
    paddingBottom: 28,
  },
  walletCard: {
    borderRadius: 26,
    backgroundColor: C.cardMid,
    padding: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 18,
  },
  cardCircle1: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "rgba(37,99,235,0.12)",
    top: -80,
    right: -80,
  },
  cardCircle2: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.04)",
    bottom: -40,
    left: -40,
  },
  cardCircle3: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(212,168,83,0.08)",
    top: 20,
    right: 30,
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  cardBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardLogoBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "rgba(212,168,83,0.18)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(212,168,83,0.3)",
  },
  cardBrand: {
    fontSize: 15,
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  visibilityBtn: {},
  cardBalanceBlock: {
    marginBottom: 14,
  },
  balanceLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  balanceAmount: {
    fontSize: 38,
    color: "#FFFFFF",
    letterSpacing: -1.5,
  },
  cashbackPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(212,168,83,0.15)",
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: "rgba(212,168,83,0.25)",
  },
  cashbackPillText: {
    fontSize: 11,
    color: C.goldLight,
  },
  cardActionsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
  },
  cardActionBtn: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  cardActionIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardActionLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
  },
  cardActionDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 4,
  },

  // ── Section ──
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },

  // ── Consumer Spend Stats Card — matches reference image ──
  summaryCard: {
    backgroundColor: "#FFFDF9",
    borderRadius: 24,
    padding: 20,
    shadowColor: "#B07D2E",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#EDE8DF",
    overflow: "hidden",
  },
  summaryBlob: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(176,125,46,0.05)",
    top: -80,
    right: -70,
  },
  // ── Top row ──
  summaryTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  summaryBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  summaryBrandIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "rgba(176,125,46,0.14)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(176,125,46,0.22)",
  },
  summaryBrandText: {
    fontSize: 13,
    color: "#2E3B4E",
    letterSpacing: 0.1,
  },
  summaryMonthBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0EDE6",
    borderRadius: 50,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#DDD6CE",
  },
  summaryMonthBadgeText: {
    fontSize: 10,
    color: "#6B7A8D",
    letterSpacing: 0.5,
  },
  // ── Hero amount ──
  summaryEyebrow: {
    fontSize: 12,
    color: "#94A3B8",
    letterSpacing: 0.2,
    marginBottom: 4,
  },
  summaryHeroRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  summaryHeroAmount: {
    fontSize: 42,
    color: "#0F1923",
    letterSpacing: -1.5,
    lineHeight: 48,
  },
  // ── Cashback pill ──
  summaryCashbackPill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(176,125,46,0.10)",
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "rgba(176,125,46,0.20)",
    marginBottom: 18,
  },
  summaryCashbackText: {
    fontSize: 11,
    color: "#8A5F1A",
  },
  // ── Divider ──
  summaryDivider: {
    height: 1,
    backgroundColor: "#EDE8DF",
    marginBottom: 14,
  },
  // ── Bottom stats strip ──
  summaryStatsStrip: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryStat: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  summaryStatVal: {
    fontSize: 14,
    color: "#0F1923",
    letterSpacing: -0.3,
  },
  summaryStatLabel: {
    fontSize: 10,
    color: "#94A3B8",
  },
  summaryStatSep: {
    width: 1,
    height: 28,
    backgroundColor: "#EDE8DF",
  },

  // ── Segment ──
  segmentRow: {
    flexDirection: "row",
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: C.border,
  },
  segmentBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 11,
    borderRadius: 13,
  },
  segmentBtnActive: {
    backgroundColor: C.navy,
  },
  segmentText: {
    fontSize: 13,
    color: C.slate,
  },

  // ── Time Filter Tabs ──
  filterTabsContent: {
    gap: 6,
    marginBottom: 14,
    paddingRight: 8,
  },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.border,
    gap: 6,
  },
  filterTabActive: {
    borderColor: C.blue,
    backgroundColor: C.blueTint,
  },
  filterTabText: {
    fontSize: 13,
    color: C.slateLight,
  },
  filterTabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  filterTabBadgeText: {
    fontSize: 9,
  },

  // ── Transaction Row ──
  txRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: C.borderLight,
    overflow: "hidden",
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  txBgCircle: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    right: -20,
    top: -30,
  },
  txLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: 12,
  },
  txIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  txTitle: {
    fontSize: 14,
    color: C.navy,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  txSub: {
    fontSize: 12,
    color: C.slate,
    marginBottom: 4,
  },
  txMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  txDate: {
    fontSize: 11,
    color: C.slateLight,
  },
  txStatusChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  txStatusText: {
    fontSize: 10,
  },
  txAmountBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 9,
    borderWidth: 1.5,
    borderStyle: "dashed",
    marginLeft: 10,
    alignSelf: "center",
  },
  txAmountSign: {
    fontSize: 13,
    marginRight: 1,
  },
  txAmount: {
    fontSize: 14,
    letterSpacing: -0.3,
  },
  txEmpty: {
    alignItems: "center",
    paddingVertical: 36,
    gap: 8,
  },
  txEmptyText: {
    fontSize: 14,
    color: C.slateLight,
  },

  // ── Date Separator ──
  dateSep: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  dateSepLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },
  dateSepChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.blueTint,
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: C.blue + "30",
  },
  dateSepText: {
    fontSize: 11,
    color: C.blue,
  },

  // ── Offers ──
  cashbackBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#0A1628",
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(212,168,83,0.2)",
  },
  cashbackBannerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  cashbackBannerIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(212,168,83,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(212,168,83,0.25)",
  },
  cashbackBannerTitle: {
    fontSize: 16,
    color: C.goldLight,
    letterSpacing: -0.3,
  },
  cashbackBannerSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.45)",
    marginTop: 2,
  },
  cashbackBannerBtn: {
    backgroundColor: C.goldLight,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  cashbackBannerBtnText: {
    fontSize: 12,
    color: C.navy,
  },
  offersHeading: {
    fontSize: 18,
    color: C.navy,
    letterSpacing: -0.3,
    marginBottom: 12,
  },
  offerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: C.borderLight,
    overflow: "hidden",
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  offerCircle: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    right: -20,
    top: -30,
  },
  offerLeft: {
    flexDirection: "row",
    alignItems: "flex-start",
    flex: 1,
    gap: 12,
  },
  offerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  offerTitle: {
    fontSize: 14,
    letterSpacing: -0.2,
    marginBottom: 3,
  },
  offerSubtitle: {
    fontSize: 12,
    color: C.slate,
    marginBottom: 3,
  },
  offerExpiry: {
    fontSize: 11,
    color: C.slateLight,
  },
  offerCodeBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 9,
    borderWidth: 1.5,
    borderStyle: "dashed",
    marginLeft: 10,
  },
  offerCode: {
    fontSize: 11,
    letterSpacing: 0.5,
  },

  // ── Referral ──
  referralCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EFF6FF",
    borderRadius: 18,
    padding: 18,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  referralLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  referralTitle: {
    fontSize: 16,
    color: C.navy,
    letterSpacing: -0.3,
  },
  referralSub: {
    fontSize: 12,
    color: C.slateLight,
    marginTop: 2,
  },
  referralBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.blue,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginLeft: 12,
  },
  referralBtnText: {
    fontSize: 13,
    color: "#FFF",
  },

  // ── Add Money Sheet ──
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    zIndex: 100,
  },
  sheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 40 : 28,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.border,
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 22,
    color: C.navy,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  sheetSub: {
    fontSize: 14,
    color: C.slateLight,
    marginBottom: 22,
  },
  amountGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 24,
  },
  amountPill: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 13,
    backgroundColor: C.surfaceAlt,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  amountPillActive: {
    backgroundColor: C.navy,
    borderColor: C.navy,
  },
  amountPillText: {
    fontSize: 14,
    color: C.navy,
  },
  sheetSection: {
    fontSize: 13,
    color: C.slateLight,
    marginBottom: 12,
    letterSpacing: 0.2,
  },
  payMethods: {
    backgroundColor: C.surfaceAlt,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 22,
  },
  payMethod: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
    gap: 12,
  },
  payMethodIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  payMethodLabel: {
    fontSize: 14,
    color: C.navy,
  },
  confirmBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.navy,
    borderRadius: 16,
    paddingVertical: 16,
  },
  confirmBtnText: {
    fontSize: 15,
    color: "#FFF",
  },
});