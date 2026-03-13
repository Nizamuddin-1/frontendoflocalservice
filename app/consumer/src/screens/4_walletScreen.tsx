/**
 * WalletScreen.tsx — LocalFix Consumer App
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
  FlatList,
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
  cardBot:     "#1C3566",
  cardAccent:  "#2563EB",

  bg:          "#F0F3FB",
  surface:     "#FFFFFF",
  navy:        "#0A1628",
  navyMid:     "#1C2E4A",
  blue:        "#2563EB",
  blueLight:   "#3B82F6",
  green:       "#10B981",
  greenLight:  "#34D399",
  amber:       "#F59E0B",
  red:         "#EF4444",
  purple:      "#7C3AED",
  teal:        "#0D9488",

  slate:       "#64748B",
  slateLight:  "#94A3B8",
  border:      "#E2E8F4",
  borderLight: "#EEF2FB",

  gold:        "#D4A853",
  goldLight:   "#F0C96B",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type TxType = "credit" | "debit" | "refund" | "cashback";
type TxStatus = "success" | "pending" | "failed";

interface Transaction {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: TxType;
  status: TxStatus;
  date: string;
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
    date: "11 Mar",
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
    date: "8 Mar",
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
    date: "5 Mar",
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
    date: "7 Mar",
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
    date: "17 Mar",
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

const TX_FILTER_TABS = [
  { key: "all",      label: "All"      },
  { key: "credit",   label: "Added"    },
  { key: "debit",    label: "Spent"    },
  { key: "refund",   label: "Refunds"  },
  { key: "cashback", label: "Cashback" },
];

// ─── TX Config ────────────────────────────────────────────────────────────────
const TX_TYPE_CONFIG: Record<TxType, { sign: string; color: string }> = {
  credit:   { sign: "+", color: C.green },
  debit:    { sign: "−", color: C.red   },
  refund:   { sign: "+", color: C.teal  },
  cashback: { sign: "+", color: C.gold  },
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

// ─── Wallet Card ──────────────────────────────────────────────────────────────
const WalletCard = ({ balance, cashback, onAdd }: {
  balance: number; cashback: number; onAdd: () => void;
}) => {
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <View style={styles.walletCard}>
      <View style={styles.cardCircle1} />
      <View style={styles.cardCircle2} />
      <View style={styles.cardCircle3} />

      <View style={styles.cardTopRow}>
        <View style={styles.cardBrandRow}>
          <View style={styles.cardLogoBox}>
            <MaterialCommunityIcons name="wallet" size={16} color={C.goldLight} />
          </View>
          <Text style={[styles.cardBrand, { fontFamily: F.displaySemi }]}>LocalFix Pay</Text>
        </View>
        <TouchableOpacity
          onPress={() => setBalanceVisible(!balanceVisible)}
          style={styles.visibilityBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={balanceVisible ? "eye-outline" : "eye-off-outline"}
            size={18}
            color="rgba(255,255,255,0.6)"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cardBalanceBlock}>
        <Text style={[styles.balanceLabel, { fontFamily: F.bodyReg }]}>Available Balance</Text>
        {balanceVisible ? (
          <AnimatedBalance target={balance} />
        ) : (
          <Text style={[styles.balanceAmount, { fontFamily: F.displayBold }]}>₹ • • • • •</Text>
        )}
      </View>

      <View style={styles.cashbackPill}>
        <MaterialCommunityIcons name="gift" size={13} color={C.goldLight} />
        <Text style={[styles.cashbackPillText, { fontFamily: F.bodySemi }]}>
          {" "}₹{cashback} cashback earned
        </Text>
      </View>

      <View style={styles.cardActionsRow}>
        <TouchableOpacity style={styles.cardActionBtn} activeOpacity={0.8} onPress={onAdd}>
          <View style={styles.cardActionIconWrap}>
            <Ionicons name="add" size={18} color={C.cardTop} />
          </View>
          <Text style={[styles.cardActionLabel, { fontFamily: F.bodySemi }]}>Add Money</Text>
        </TouchableOpacity>

        <View style={styles.cardActionDivider} />

        <TouchableOpacity style={styles.cardActionBtn} activeOpacity={0.8}>
          <View style={styles.cardActionIconWrap}>
            <Ionicons name="arrow-up" size={18} color={C.cardTop} />
          </View>
          <Text style={[styles.cardActionLabel, { fontFamily: F.bodySemi }]}>Withdraw</Text>
        </TouchableOpacity>

        <View style={styles.cardActionDivider} />

        <TouchableOpacity style={styles.cardActionBtn} activeOpacity={0.8}>
          <View style={styles.cardActionIconWrap}>
            <Ionicons name="share-social" size={18} color={C.cardTop} />
          </View>
          <Text style={[styles.cardActionLabel, { fontFamily: F.bodySemi }]}>Refer & Earn</Text>
        </TouchableOpacity>

        <View style={styles.cardActionDivider} />

        <TouchableOpacity style={styles.cardActionBtn} activeOpacity={0.8}>
          <View style={styles.cardActionIconWrap}>
            <Ionicons name="shield-checkmark" size={18} color={C.cardTop} />
          </View>
          <Text style={[styles.cardActionLabel, { fontFamily: F.bodySemi }]}>Security</Text>
        </TouchableOpacity>
      </View>
    </View>
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

// ─── Spend Summary ────────────────────────────────────────────────────────────
const SpendSummary = () => {
  const total   = TRANSACTIONS.filter(t => t.type === "debit").reduce((s, t) => s + t.amount, 0);
  const added   = TRANSACTIONS.filter(t => t.type === "credit").reduce((s, t) => s + t.amount, 0);
  const refunds = TRANSACTIONS.filter(t => t.type === "refund").reduce((s, t) => s + t.amount, 0);

  const summaryBoxes = [
    { label: "SPENT",    value: total,   color: C.blue,  dotColor: C.blue  },
    { label: "ADDED",    value: added,   color: C.green, dotColor: C.green },
    { label: "REFUNDED", value: refunds, color: C.teal,  dotColor: C.teal  },
  ];

  const deficit = total - added;

  return (
    <View style={styles.summaryCard}>
      {/* Decorative blob */}
      <View style={styles.summaryBlob} />

      {/* ── Header ── */}
      <View style={styles.summaryHeader}>
        <View>
          <View style={styles.summaryMonthBadge}>
            <Ionicons name="calendar-outline" size={11} color={C.blue} />
            <Text style={[styles.summaryMonthBadgeText, { fontFamily: F.bodySemi }]}>
              {"  MAR 2024"}
            </Text>
          </View>
          <Text style={[styles.summaryTitle, { fontFamily: F.displaySemi }]}>This Month</Text>
          <Text style={[styles.summarySub,   { fontFamily: F.bodyReg    }]}>Spending overview</Text>
        </View>
        <TouchableOpacity style={styles.summaryMore}>
          <Text style={[styles.summaryMoreText, { fontFamily: F.bodySemi }]}>Details</Text>
          <Ionicons name="arrow-forward" size={13} color={C.blue} />
        </TouchableOpacity>
      </View>

      {/* ── Three summary boxes ── */}
      <View style={styles.summaryBoxRow}>
        {summaryBoxes.map((box) => (
          <View key={box.label} style={[styles.summaryBox, { borderTopColor: box.color }]}>
            <View style={[styles.summaryBoxDot, { backgroundColor: box.dotColor }]} />
            <Text style={[styles.summaryBoxLabel, { fontFamily: F.bodyBold }]}>{box.label}</Text>
            <Text style={[styles.summaryBoxValue, { fontFamily: F.displaySemi, color: C.navy }]}>
              ₹{box.value.toLocaleString()}
            </Text>
          </View>
        ))}
      </View>

      {/* ── Divider ── */}
      <View style={styles.summaryDivider} />

      {/* ── Insight footer ── */}
      <View style={styles.summaryInsight}>
        <View style={styles.summaryInsightIconWrap}>
          <MaterialCommunityIcons name="lightbulb-outline" size={16} color={C.gold} />
        </View>
        <Text style={[styles.summaryInsightText, { fontFamily: F.bodyReg }]}>
          {deficit > 0 ? (
            <>
              Add{" "}
              <Text style={{ fontFamily: F.bodySemi, color: C.navy }}>
                ₹{deficit.toLocaleString()}
              </Text>{" "}
              more to fully cover expenses with wallet balance.
            </>
          ) : (
            <>
              Your wallet balance{" "}
              <Text style={{ fontFamily: F.bodySemi, color: C.green }}>covers all expenses</Text>{" "}
              this month.
            </>
          )}
        </Text>
      </View>
    </View>
  );
};

// ─── Offer Card ───────────────────────────────────────────────────────────────
const OfferCard = ({ offer }: { offer: Offer }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={[styles.offerCard, { borderLeftColor: offer.color }]}>
      <View style={[styles.offerCircle, { backgroundColor: offer.color + "14" }]} />

      <View style={styles.offerLeft}>
        <View style={[styles.offerIconWrap, { backgroundColor: offer.color + "1A" }]}>
          <MaterialCommunityIcons name={offer.icon as any} size={20} color={offer.color} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.offerTitle,    { fontFamily: F.displaySemi, color: offer.color }]}>
            {offer.title}
          </Text>
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
        {!copied && <Ionicons name="copy-outline" size={12} color={offer.color} style={{ marginLeft: 4 }} />}
        {copied  && <Ionicons name="checkmark"    size={12} color={offer.color} style={{ marginLeft: 4 }} />}
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
          <Text style={[styles.txTitle, { fontFamily: F.displaySemi }]} numberOfLines={1}>
            {tx.title}
          </Text>
          <Text style={[styles.txSub, { fontFamily: F.bodyReg }]} numberOfLines={1}>
            {tx.subtitle}
          </Text>
          <View style={styles.txMeta}>
            <Ionicons name="time-outline" size={11} color={C.slateLight} />
            <Text style={[styles.txDate, { fontFamily: F.bodyReg }]}>
              {" "}{tx.date} · {tx.time}
            </Text>
            {tx.status !== "success" && (
              <View style={[styles.txStatusChip, { backgroundColor: sc.bg }]}>
                <Text style={[styles.txStatusText, { color: sc.color, fontFamily: F.bodySemi }]}>
                  {sc.label}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View style={[styles.txAmountBadge, {
        borderColor: tx.iconColor + "55",
        backgroundColor: tx.iconColor + "0D",
      }]}>
        <Text style={[styles.txAmountSign, { fontFamily: F.bodySemi, color: tc.color }]}>
          {tc.sign}
        </Text>
        <Text style={[styles.txAmount, { fontFamily: F.displaySemi, color: tc.color }]}>
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
  const [txFilter, setTxFilter]           = useState("all");
  const [activeSection, setActiveSection] = useState<"transactions" | "offers">("transactions");

  const filteredTx = txFilter === "all"
    ? TRANSACTIONS
    : TRANSACTIONS.filter((t) => t.type === txFilter);

  const handleAddMoney = (amt: number) => {
    setBalance((b) => b + amt);
    setShowAddSheet(false);
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor={C.cardTop} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        stickyHeaderIndices={[0]}
      >
        {/* ── Sticky Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="chevron-back" size={22} color="#FFF" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { fontFamily: F.displaySemi }]}>My Wallet</Text>
          <TouchableOpacity style={styles.headerAction} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* ── Wallet Card ── */}
        <View style={styles.cardWrapper}>
          <WalletCard
            balance={balance}
            cashback={60}
            onAdd={() => setShowAddSheet(true)}
          />
        </View>

        {/* ── Spend Summary ── */}
        <View style={styles.section}>
          <SpendSummary />
        </View>

        {/* ── Quick Add Row ── */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: F.displaySemi }]}>Quick Add</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 10, paddingRight: 4 }}
          >
            {ADD_AMOUNTS.map((amt) => (
              <TouchableOpacity
                key={amt}
                style={styles.quickAddPill}
                onPress={() => setShowAddSheet(true)}
                activeOpacity={0.75}
              >
                <Ionicons name="add-circle-outline" size={14} color={C.blue} style={{ marginRight: 5 }} />
                <Text style={[styles.quickAddText, { fontFamily: F.bodySemi }]}>₹{amt.toLocaleString()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterTabsContent}
            >
              {TX_FILTER_TABS.map((tab) => {
                const active = txFilter === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={[styles.filterTab, active && styles.filterTabActive]}
                    onPress={() => setTxFilter(tab.key)}
                    activeOpacity={0.75}
                  >
                    <Text style={[
                      styles.filterTabText,
                      { fontFamily: active ? F.bodySemi : F.bodyMed },
                      active && { color: C.blue },
                    ]}>
                      {tab.label}
                    </Text>
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
              filteredTx.map((tx, i) => (
                <View key={tx.id}>
                  {(i === 0 || filteredTx[i - 1].date !== tx.date) && (
                    <View style={styles.dateSep}>
                      <View style={styles.dateSepLine} />
                      <Text style={[styles.dateSepText, { fontFamily: F.bodyMed }]}>{tx.date}</Text>
                      <View style={styles.dateSepLine} />
                    </View>
                  )}
                  <TxRow tx={tx} />
                </View>
              ))
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
            {OFFERS.map((offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}

            <View style={styles.referralCard}>
              <View style={styles.referralLeft}>
                <MaterialCommunityIcons name="account-multiple-plus" size={28} color={C.blue} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={[styles.referralTitle, { fontFamily: F.displaySemi }]}>
                    Refer & Earn ₹100
                  </Text>
                  <Text style={[styles.referralSub, { fontFamily: F.bodyReg }]}>
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
    backgroundColor: C.bg,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.cardTop,
    paddingTop: Platform.OS === "ios" ? 56 : 36,
    paddingBottom: 14,
    paddingHorizontal: 18,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  headerAction: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Wallet Card ──
  cardWrapper: {
    backgroundColor: C.cardTop,
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
  sectionTitle: {
    fontSize: 18,
    color: C.navy,
    letterSpacing: -0.3,
    marginBottom: 12,
  },

  // ── Spend Summary Card (redesigned) ──
  summaryCard: {
    backgroundColor: C.surface,
    borderRadius: 24,
    padding: 20,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09,
    shadowRadius: 18,
    elevation: 5,
    borderWidth: 1,
    borderColor: C.borderLight,
    overflow: "hidden",
    position: "relative",
  },
  summaryBlob: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(37,99,235,0.05)",
    top: -70,
    right: -60,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  summaryMonthBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(37,99,235,0.08)",
    borderRadius: 50,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(37,99,235,0.15)",
    marginBottom: 6,
  },
  summaryMonthBadgeText: {
    fontSize: 10,
    color: C.blue,
    letterSpacing: 0.6,
  },
  summaryTitle: {
    fontSize: 20,
    color: C.navy,
    letterSpacing: -0.4,
  },
  summarySub: {
    fontSize: 12,
    color: C.slateLight,
    marginTop: 2,
  },
  summaryMore: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(37,99,235,0.07)",
    borderRadius: 9,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: "rgba(37,99,235,0.15)",
  },
  summaryMoreText: {
    fontSize: 12,
    color: C.blue,
  },
  summaryBoxRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: C.bg,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: C.borderLight,
    borderTopWidth: 3,
    gap: 3,
    overflow: "hidden",
  },
  summaryBoxDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginBottom: 2,
  },
  summaryBoxLabel: {
    fontSize: 9,
    color: C.slateLight,
    letterSpacing: 0.5,
  },
  summaryBoxValue: {
    fontSize: 14,
    letterSpacing: -0.4,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: C.borderLight,
    marginVertical: 16,
  },
  summaryInsight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(212,168,83,0.07)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(212,168,83,0.18)",
  },
  summaryInsightIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: "rgba(212,168,83,0.14)",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  summaryInsightText: {
    flex: 1,
    fontSize: 12,
    color: C.slate,
    lineHeight: 17,
  },

  // ── Quick Add ──
  quickAddPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.border,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  quickAddText: {
    fontSize: 14,
    color: C.navy,
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

  // ── Filter Tabs ──
  filterTabsContent: {
    gap: 6,
    marginBottom: 14,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.border,
    marginRight: 6,
  },
  filterTabActive: {
    borderColor: C.blue,
    backgroundColor: "#EFF6FF",
  },
  filterTabText: {
    fontSize: 13,
    color: C.slateLight,
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
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
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
    paddingVertical: 32,
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
    paddingHorizontal: 4,
    paddingVertical: 6,
    gap: 10,
  },
  dateSepLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },
  dateSepText: {
    fontSize: 11,
    color: C.slateLight,
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
    backgroundColor: C.bg,
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
    backgroundColor: C.bg,
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