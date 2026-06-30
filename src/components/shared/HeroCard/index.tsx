// ─────────────────────────────────────────────────────────────────────────────
//  HeroCard — loyalty / rewards hero card
//  Extracted from app/consumer/src/screens/1_statsLanding.tsx
//  Data now sourced from the mock layer (LOYALTY, RECENT_BOOKINGS) instead of
//  screen-local constants. The unused progress-bar animation from the original
//  (computed but never rendered) was dropped. Tokens rewired to the unified theme.
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors as C, Fonts as F } from '../../../theme';
import { LOYALTY, RECENT_BOOKINGS } from '../../../services/mock';
import { CountUp } from '../CountUp';

export interface HeroCardProps {
  /** Kept for compatibility with the home screen; not used by the current layout. */
  onAddMoney?: () => void;
}

const totalSpent = RECENT_BOOKINGS.reduce((sum, b) => sum + b.price, 0);

export const HeroCard: React.FC<HeroCardProps> = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, speed: 10, bounciness: 6, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[styles.heroCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
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
        <View style={[styles.heroBrandPill, { flexDirection: 'row', alignItems: 'center', gap: 4 }]}>
          <Ionicons name={LOYALTY.tierIcon as any} size={10} color={C.goldDeep} />
          <Text style={[styles.heroBrandPillText, { fontFamily: F.bodyBold }]}>
            {LOYALTY.tierLabel} MEMBER
          </Text>
        </View>
      </View>

      {/* ── Points display ── */}
      <View style={styles.heroBalanceBlock}>
        <Text style={[styles.heroBalLabel, { fontFamily: F.bodyReg }]}>Your Loyalty Points</Text>
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6 }}>
          <Text style={[styles.heroBalAmount, { fontFamily: F.displayBold }]}>
            <CountUp to={LOYALTY.points} />
          </Text>
          <Text style={[styles.heroBalLabel, { fontFamily: F.bodyMed, marginBottom: 14, fontSize: 14 }]}>
            pts
          </Text>
        </View>

        {/* Cashback pill */}
        <View style={styles.heroCashbackRow}>
          <MaterialCommunityIcons name="cash-refund" size={11} color={C.goldDeep} />
          <Text style={[styles.heroCashbackText, { fontFamily: F.bodySemi }]}>
            {'  ₹' + LOYALTY.cashbackEarned + ' cashback earned this month'}
          </Text>
        </View>
      </View>

      {/* ── Bottom mini stats strip ── */}
      <View style={[styles.heroDivider, { marginTop: 16 }]} />
      <View style={styles.heroStatsStrip}>
        {[
          { icon: 'receipt-outline', label: 'Services',   value: String(RECENT_BOOKINGS.length) },
          { icon: 'currency-inr',    label: 'Spent',      value: '₹' + totalSpent.toLocaleString('en-IN') },
          { icon: 'trending-up',     label: 'Pts Earned', value: '1,240' },
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

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.ruleLight,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 6,
  },
  heroOrb1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(176,125,46,0.06)',
    top: -120,
    right: -80,
  },
  heroOrb2: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(192,82,43,0.04)',
    bottom: -60,
    left: -50,
  },
  heroOrb3: {
    position: 'absolute',
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(176,125,46,0.07)',
    top: 20,
    right: 60,
  },
  heroOrb4: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(61,122,96,0.06)',
    bottom: 40,
    right: 20,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  heroBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  heroBrandIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: C.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.gold + '40',
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
    borderColor: C.gold + '50',
  },
  heroBrandPillText: {
    fontSize: 9,
    color: C.goldDeep,
    letterSpacing: 0.8,
  },
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.goldLight,
    alignSelf: 'flex-start',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: C.gold + '30',
  },
  heroCashbackText: {
    fontSize: 11,
    color: C.goldDeep,
  },
  heroDivider: {
    height: 1,
    backgroundColor: C.ruleLight,
    marginBottom: 16,
  },
  heroStatsStrip: {
    flexDirection: 'row',
    backgroundColor: C.tag, // was C.chip (#ECE7DF)
    borderRadius: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: C.ruleLight,
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
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
});

export default HeroCard;
