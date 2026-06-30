// ─── Consumer Transaction Stats Card (SpendSummary) ──────────────────────────
// Extracted from 4_walletScreen.tsx (wallet feature). Copied verbatim; data
// (TRANSACTIONS) now sourced from the mock layer.
import React, { useRef, useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { C, F } from './tokens';
import { styles } from './wallet.styles';
import { TRANSACTIONS } from '@/src/services/mock';

export const SpendSummary: React.FC = () => {
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

export default SpendSummary;
