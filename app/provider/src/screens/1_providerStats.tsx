// ─────────────────────────────────────────────
//  Screen 1 — Home (Redesigned)
// ─────────────────────────────────────────────

import React, { useRef, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Animated, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, FontSize, FontWeight, Spacing, Radii, Shadows } from '../theme';
import { useAppSelector, useAppDispatch } from '@/src/redux/store';
import { fetchProviderBookings, fetchProfile } from '@/src/redux/actions/appActions';
import type { RootStackParamList } from '../types';

type HomeNavProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;
interface Props { navigation: HomeNavProp }

const ACCENT = '#6366F1';

export default function HomeScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const { providerBookings, profile } = useAppSelector((s) => s.provider);
  const BOOKINGS = providerBookings.list;
  const PROVIDER_PROFILE = profile.data;

  // ── Entrance animations ──────────────────────
  const heroFade  = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(28)).current;
  const cardFade  = useRef(new Animated.Value(0)).current;
  const pulse     = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    dispatch(fetchProviderBookings() as any);
    dispatch(fetchProfile() as any);

    Animated.parallel([
      Animated.timing(heroFade,  { toValue: 1, duration: 320, useNativeDriver: true }),
      Animated.timing(cardFade,  { toValue: 1, duration: 400, delay: 160, useNativeDriver: true }),
      Animated.timing(cardSlide, { toValue: 0, duration: 400, delay: 160, useNativeDriver: true }),
    ]).start();

    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.5, duration: 800, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1.0, duration: 800, useNativeDriver: true }),
      ])
    );
    pulseAnim.start();
    return () => pulseAnim.stop();
  }, [dispatch]);

  const newBooking = BOOKINGS[0] ?? {
    id: '',
    serviceType: '',
    services: [{ quantity: 0 }],
    customer: { name: '' },
    location: { distanceKm: 0 },
    totalAmount: 0,
  };

  const handleViewBooking = useCallback(() => {
    if (newBooking.id) {
      navigation.push('BookingDetails', { bookingId: newBooking.id });
    }
  }, [navigation, newBooking.id]);

  if (profile.isLoading || providerBookings.isLoading) {
    return (
      <SafeAreaView style={[s.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={ACCENT} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Hero Header ─────────────────────── */}
        <Animated.View style={[s.hero, { opacity: heroFade }]}>

          {/* Top row */}
          <View style={s.heroTop}>
            <View>
              <Text style={s.greeting}>Good morning 👋</Text>
              <Text style={s.heroName}>{PROVIDER_PROFILE?.name ?? ''}</Text>
            </View>
            <View style={s.heroActions}>
              {/* Online badge */}
              <View style={s.onlineBadge}>
                <Animated.View style={[s.onlineDot, { transform: [{ scale: pulse }] }]} />
                <Text style={s.onlineTxt}>Online</Text>
              </View>
              {/* Bell */}
              <TouchableOpacity
                style={s.iconBtn}
                onPress={() => navigation.navigate('MainTabs')}
              >
                <Feather name="bell" size={18} color="#334155" />
                <View style={s.notifDot} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Status card */}
          <View style={s.statusCard}>
            <View>
              <Text style={s.statusCardLbl}>Today&apos;s Status</Text>
              <Text style={s.statusCardVal}>Available for Jobs</Text>
            </View>
            <View style={s.statusToggle}>
              <View style={s.toggleActive} />
            </View>
          </View>

        </Animated.View>

        {/* ── New Booking Card ────────────────── */}
        <Animated.View
          style={[
            s.bookingCard,
            { opacity: cardFade, transform: [{ translateY: cardSlide }] },
          ]}
        >
          {BOOKINGS.length > 0 ? (
            <>
              {/* Header strip */}
              <View style={s.cardStrip}>
                <View style={s.cardStripLeft}>
                  <View style={s.stripDot} />
                  <Text style={s.cardStripTxt}>New Booking Request</Text>
                </View>
                <View style={s.timePill}>
                  <Text style={s.timePillTxt}>Just now</Text>
                </View>
              </View>

              {/* Body */}
              <View style={s.cardBody}>
                <View style={s.serviceIconWrap}>
                  <Feather name="wind" size={26} color={ACCENT} />
                </View>
                <View style={s.cardBodyInfo}>
                  <Text style={s.cardTitle}>
                    {newBooking.serviceType} — {newBooking.services?.[0]?.quantity ?? 1} Units
                  </Text>
                  <View style={s.metaRow}>
                    <View style={s.metaItem}>
                      <Feather name="user" size={12} color="#64748B" />
                      <Text style={s.metaTxt}>{newBooking.customer?.name ?? 'Customer'}</Text>
                    </View>
                    <View style={s.metaDivider} />
                    <View style={s.metaItem}>
                      <Feather name="map-pin" size={12} color="#64748B" />
                      <Text style={s.metaTxt}>{newBooking.location?.distanceKm ?? 0} km away</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Divider */}
              <View style={s.divider} />

              {/* Footer */}
              <View style={s.cardFooter}>
                <View>
                  <Text style={s.payoutLbl}>Total Payout</Text>
                  <Text style={s.payoutAmt}>₹{(newBooking.totalAmount ?? 0).toLocaleString()}</Text>
                </View>
                <View style={s.footerBtns}>
                  <TouchableOpacity style={s.declineBtn}>
                    <Feather name="x" size={14} color="#EF4444" />
                    <Text style={s.declineTxt}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={s.acceptBtn} onPress={handleViewBooking}>
                    <Text style={s.acceptTxt}>View Details</Text>
                    <Feather name="arrow-right" size={14} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            <View style={{ padding: 40, alignItems: 'center' }}>
              <Feather name="inbox" size={32} color="#94A3B8" style={{ marginBottom: 10 }} />
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#334155' }}>No new requests</Text>
              <Text style={{ fontSize: 13, color: '#94A3B8', marginTop: 5 }}>You're all caught up for now!</Text>
            </View>
          )}
        </Animated.View>

        {/* ── Quick Actions ───────────────────── */}
        <Animated.View style={[s.quickActions, { opacity: cardFade }]}>
          <Text style={s.qaTitle}>Quick Actions</Text>
          <View style={s.qaGrid}>

            <TouchableOpacity
              style={s.qaCard}
              onPress={() => navigation.navigate('MainTabs')}
              activeOpacity={0.75}
            >
              <View style={[s.qaIcon, { backgroundColor: '#EEF2FF' }]}>
                <Feather name="grid" size={20} color={ACCENT} />
              </View>
              <Text style={s.qaLabel}>Dashboard</Text>
              <Text style={s.qaSub}>View all jobs</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.qaCard}
              onPress={() => navigation.navigate('MainTabs')}
              activeOpacity={0.75}
            >
              <View style={[s.qaIcon, { backgroundColor: '#F0FDF4' }]}>
                <Feather name="dollar-sign" size={20} color="#10B981" />
              </View>
              <Text style={s.qaLabel}>Earnings</Text>
              <Text style={s.qaSub}>This month</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.qaCard}
              onPress={() => navigation.navigate('MainTabs')}
              activeOpacity={0.75}
            >
              <View style={[s.qaIcon, { backgroundColor: '#FFFBEB' }]}>
                <Feather name="calendar" size={20} color="#F59E0B" />
              </View>
              <Text style={s.qaLabel}>Schedule</Text>
              <Text style={s.qaSub}>Upcoming jobs</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.qaCard}
              onPress={() => navigation.navigate('MainTabs')}
              activeOpacity={0.75}
            >
              <View style={[s.qaIcon, { backgroundColor: '#FFF1F2' }]}>
                <Feather name="star" size={20} color="#EF4444" />
              </View>
              <Text style={s.qaLabel}>Reviews</Text>
              <Text style={s.qaSub}>4.8 avg rating</Text>
            </TouchableOpacity>

          </View>
        </Animated.View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: '#FFFFFF' },
  scroll:        { flex: 1 },
  scrollContent: { paddingBottom: 8 },

  // ── Hero ────────────────────────────────────
  hero: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 50,            // ← top margin 50
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: { fontSize: 13, color: '#94A3B8', fontWeight: '500', marginBottom: 3 },
  heroName: { fontSize: 22, fontWeight: '800', color: '#0F172A', letterSpacing: -0.5 },

  heroActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  onlineBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: '#F0FDF4',
    borderRadius: 999, paddingVertical: 6, paddingHorizontal: 11,
    borderWidth: 1, borderColor: 'rgba(16,185,129,0.25)',
  },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  onlineTxt: { fontSize: 11, fontWeight: '700', color: '#10B981' },

  iconBtn: {
    width: 38, height: 38,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center', alignItems: 'center',
  },
  notifDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5, borderColor: '#fff',
  },

  // Status card
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statusCardLbl: { fontSize: 11, color: '#94A3B8', fontWeight: '500', marginBottom: 4 },
  statusCardVal: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  statusToggle: {
    width: 46, height: 26, borderRadius: 13,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    paddingHorizontal: 3,
    alignItems: 'flex-end',
  },
  toggleActive: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: '#fff',
  },

  // ── Booking card ────────────────────────────
  bookingCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E8FF',
  },
  cardStripLeft: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  stripDot:      { width: 8, height: 8, borderRadius: 4, backgroundColor: ACCENT },
  cardStripTxt:  { fontSize: 12, fontWeight: '700', color: '#4338CA', letterSpacing: 0.2 },
  timePill: {
    backgroundColor: '#fff',
    borderRadius: 999, paddingVertical: 3, paddingHorizontal: 9,
    borderWidth: 1, borderColor: '#C7D2FE',
  },
  timePillTxt: { fontSize: 11, fontWeight: '600', color: '#6366F1' },

  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    paddingBottom: 12,
  },
  serviceIconWrap: {
    width: 54, height: 54, borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  cardBodyInfo: { flex: 1 },
  cardTitle:    { fontSize: 15, fontWeight: '800', color: '#0F172A', marginBottom: 8, letterSpacing: -0.2 },
  metaRow:      { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaItem:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaTxt:      { fontSize: 12, color: '#64748B', fontWeight: '500' },
  metaDivider:  { width: 3, height: 3, borderRadius: 2, backgroundColor: '#CBD5E1' },

  divider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 16 },

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  payoutLbl: { fontSize: 11, color: '#94A3B8', marginBottom: 2 },
  payoutAmt: { fontSize: 24, fontWeight: '800', color: '#0F172A', letterSpacing: -0.8 },

  footerBtns: { flexDirection: 'row', gap: 8 },
  declineBtn: {
    height: 40, paddingHorizontal: 14,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', gap: 5,
    borderWidth: 1, borderColor: '#FECACA',
  },
  declineTxt: { fontSize: 13, fontWeight: '600', color: '#EF4444' },
  acceptBtn: {
    height: 40, paddingHorizontal: 16,
    backgroundColor: ACCENT,
    borderRadius: 12,
    flexDirection: 'row', alignItems: 'center', gap: 6,
  },
  acceptTxt: { fontSize: 13, fontWeight: '700', color: '#fff' },

  // ── Quick actions ────────────────────────────
  quickActions: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  qaTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A', letterSpacing: -0.3, marginBottom: 14 },
  qaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  qaCard: {
    width: '47.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qaIcon: {
    width: 44, height: 44, borderRadius: 13,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  qaLabel: { fontSize: 14, fontWeight: '700', color: '#0F172A', marginBottom: 2 },
  qaSub:   { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
});