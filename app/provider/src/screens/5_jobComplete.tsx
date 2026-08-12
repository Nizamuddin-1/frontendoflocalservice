// ─────────────────────────────────────────────
//  Screen 5 — Job Complete
// ─────────────────────────────────────────────

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Animated, StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp }           from '@react-navigation/native';
import { Colors, FontSize, FontWeight, Spacing, Radii, Shadows } from '../theme';
import { PrimaryButton } from '../components';
import { JOB_PAYOUT } from '../hooks/mockData';
import { useAppDispatch } from '@/src/redux/store';
import { updateProviderBookingStatus } from '@/src/redux/actions/appActions';
import type { RootStackParamList, PayoutRow } from '../types';

type NavProp    = StackNavigationProp<RootStackParamList, 'JobComplete'>;
type RouteProp2 = RouteProp<RootStackParamList, 'JobComplete'>;
interface Props { navigation: NavProp; route: RouteProp2 }

const STAR_LABELS: Record<number, string> = {
  1: 'Poor experience',
  2: 'Below average',
  3: 'Average',
  4: 'Good customer',
  5: 'Excellent customer!',
};

export default function JobCompleteScreen({ navigation, route }: Props) {
  const dispatch = useAppDispatch();
  const [rating, setRating] = useState<number>(0);

  const iconScale    = useRef(new Animated.Value(0.2)).current;
  const iconOpacity  = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(24)).current;
  const contentFade  = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Submit job completion to API
    dispatch(updateProviderBookingStatus(route.params.bookingId, 'done') as any);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(iconScale,   { toValue: 1, tension: 55, friction: 6, useNativeDriver: true }),
        Animated.timing(iconOpacity, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(contentFade,  { toValue: 1, duration: 360, useNativeDriver: true }),
        Animated.timing(contentSlide, { toValue: 0, duration: 360, useNativeDriver: true }),
      ]),
    ]).start();
  }, [dispatch, route.params.bookingId]);

  const handleRate = useCallback((n: number) => setRating(n), []);
  const payout = route.params.payoutAmount;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* ── Success Icon ─────────────────── */}
        <Animated.View style={[s.iconWrap, { transform: [{ scale: iconScale }], opacity: iconOpacity }]}>
          <View style={s.iconCircle}>
            <Feather name="check" size={38} color={Colors.emerald} />
          </View>
          <View style={s.iconRing} />
        </Animated.View>

        <Animated.View style={{ alignItems: 'center', opacity: iconOpacity }}>
          <Text style={s.title}>Job Completed! 🎉</Text>
          <Text style={s.subtitle}>Great work! Your payment is being processed.</Text>
        </Animated.View>

        {/* ── Payout Card ──────────────────── */}
        <Animated.View style={[s.payoutCard, Shadows.sm, { opacity: contentFade, transform: [{ translateY: contentSlide }] }]}>
          {/* Card header */}
          <View style={s.payoutHeader}>
            <Feather name="dollar-sign" size={15} color={Colors.emerald3} />
            <Text style={s.payoutHeaderTxt}>Earnings Breakdown</Text>
          </View>

          {JOB_PAYOUT.rows.map((row: PayoutRow, i: number) => (
            <View key={i} style={s.payoutRow}>
              <Text style={s.payoutKey}>{row.label}</Text>
              <Text style={[s.payoutVal, row.color ? { color: row.color } : {}]}>{row.value}</Text>
            </View>
          ))}

          {/* Total */}
          <View style={s.payoutTotal}>
            <View>
              <Text style={s.payoutTotalLabel}>Net Payout</Text>
              <Text style={s.payoutTotalSub}>After platform fee & tip</Text>
            </View>
            <Text style={s.payoutTotalVal}>₹{payout.toLocaleString()}</Text>
          </View>
        </Animated.View>

        {/* ── Rating Card ──────────────────── */}
        <Animated.View style={[s.ratingCard, Shadows.sm, { opacity: contentFade, transform: [{ translateY: contentSlide }] }]}>
          <View style={s.ratingHeader}>
            <Feather name="star" size={15} color={Colors.star} />
            <Text style={s.ratingHeaderTxt}>Rate This Customer</Text>
          </View>
          <Text style={s.ratingPrompt}>How was your experience with this customer?</Text>
          <View style={s.starsRow}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity key={n} onPress={() => handleRate(n)} activeOpacity={0.7} style={s.starBtn}>
                <Feather
                  name="star"
                  size={28}
                  color={n <= rating ? Colors.star : Colors.border2}
                  // @ts-ignore - fill is not in types but works on Android/iOS
                  fill={n <= rating ? Colors.star : 'transparent'}
                />
              </TouchableOpacity>
            ))}
          </View>
          {rating > 0 && (
            <View style={s.ratingFeedback}>
              <Text style={s.ratingFeedbackTxt}>{STAR_LABELS[rating]}</Text>
            </View>
          )}
        </Animated.View>

        {/* ── CTAs ─────────────────────────── */}
        <Animated.View style={[s.ctaWrap, { opacity: contentFade, transform: [{ translateY: contentSlide }] }]}>
          <PrimaryButton
            label="Back to Home"
            icon={<Feather name="home" size={16} color="#fff" />}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] })}
          />
          <TouchableOpacity style={s.secBtn} onPress={() => navigation.navigate('MainTabs')}>
            <Text style={s.secBtnTxt}>View Earnings History</Text>
            <Feather name="arrow-right" size={14} color={Colors.accent} />
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flexGrow: 1, alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: 36, gap: 16 },

  // Icon
  iconWrap:    { position: 'relative', width: 88, height: 88, justifyContent: 'center', alignItems: 'center' },
  iconCircle:  { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.emerald2, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'rgba(5,150,105,0.2)' },
  iconRing:    { position: 'absolute', width: 88, height: 88, borderRadius: 44, borderWidth: 1, borderColor: 'rgba(5,150,105,0.15)' },

  title:    { fontSize: 22, fontWeight: FontWeight.bold, color: Colors.ink, letterSpacing: -0.5, textAlign: 'center', marginTop: 4, marginBottom: 6 },
  subtitle: { fontSize: FontSize.md, color: Colors.ink3, textAlign: 'center', lineHeight: 22 },

  // Payout card
  payoutCard: {
    backgroundColor: '#fff',
    borderRadius: Radii.xl,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  payoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.emerald2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(5,150,105,0.15)',
  },
  payoutHeaderTxt: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.emerald3, letterSpacing: 0.3 },
  payoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  payoutKey: { fontSize: FontSize.md, color: Colors.ink3 },
  payoutVal: { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.ink },
  payoutTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  payoutTotalLabel: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.ink },
  payoutTotalSub:   { fontSize: FontSize.xs, color: Colors.ink3, marginTop: 2 },
  payoutTotalVal:   { fontSize: 24, fontWeight: FontWeight.bold, color: Colors.emerald, letterSpacing: -0.5 },

  // Rating card
  ratingCard: {
    backgroundColor: '#fff',
    borderRadius: Radii.xl,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  ratingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.amber2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(217,119,6,0.15)',
  },
  ratingHeaderTxt: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.amber3 },
  ratingPrompt:    { fontSize: FontSize.sm, color: Colors.ink3, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 10 },
  starsRow:        { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingBottom: 14 },
  starBtn:         { padding: 4 },
  ratingFeedback:  { backgroundColor: Colors.amber2, marginHorizontal: 16, marginBottom: 14, borderRadius: Radii.md, paddingVertical: 8, paddingHorizontal: 12, alignItems: 'center' },
  ratingFeedbackTxt:{ fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.amber3 },

  // CTAs
  ctaWrap: { width: '100%', gap: 10 },
  secBtn:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, paddingVertical: 8 },
  secBtnTxt: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.accent },
});
