// ─────────────────────────────────────────────
//  Screen 1 — Home (Professional Redesign)
//  Styled to match Consumer Home visual language
// ─────────────────────────────────────────────

import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';

import { useAppSelector, useAppDispatch } from '@/src/redux/store';
import {
  fetchProviderBookings,
  fetchProviderProfile,
  declineProviderBooking,
} from '@/src/redux/actions/appActions';
import type { RootStackParamList } from '../types';

type HomeNavProp = StackNavigationProp<RootStackParamList, 'MainTabs'>;
interface Props {
  navigation: HomeNavProp;
}

// Design tokens matching Consumer Home screen
const C = {
  bg: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceSubtle: '#F8FAFC',
  ink: '#0F1923',
  inkLight: '#6B7A8D',
  slateLight: '#94A3B8',
  slate: '#64748B',
  terra: '#C0522B',
  navy: '#0A1628',
  border: '#E2E8F4',
  borderLight: '#EDE8E2',
  blue: '#2563EB',
  blueBg: '#EFF6FF',
  green: '#10B981',
  greenBg: '#ECFDF5',
  greenText: '#059669',
  amber: '#F59E0B',
  amberBg: '#FFFBEB',
  amberText: '#D97706',
  red: '#EF4444',
  redBg: '#FEF2F2',
  rose: '#E11D48',
  roseBg: '#FFF1F2',
};

export default function HomeScreen({ navigation }: Props) {
  const dispatch = useAppDispatch();
  const providerState = useAppSelector((s) => s.provider);
  const providerBookings = providerState?.providerBookings ?? {
    list: [],
    isLoading: false,
    error: null,
  };
  const profile = providerState?.profile ?? { data: null, isLoading: false, error: null };

  const BOOKINGS = Array.isArray(providerBookings.list) ? providerBookings.list : [];
  const PROVIDER_PROFILE = profile.data;

  // ── Entrance animations ──────────────────────
  // Initialized to 1 so the screen is never stuck at 0 opacity
  const heroFade = useRef(new Animated.Value(1)).current;
  const cardSlide = useRef(new Animated.Value(0)).current;
  const cardFade = useRef(new Animated.Value(1)).current;
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    dispatch(fetchProviderBookings() as any);
    dispatch(fetchProviderProfile() as any);

    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(fetchProviderBookings() as any);
      dispatch(fetchProviderProfile() as any);
    });

    // Smooth pulse animation for the live online status indicator
    const pulseAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.5, duration: 800, useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 1.0, duration: 800, useNativeDriver: false }),
      ])
    );
    pulseAnim.start();

    return () => {
      pulseAnim.stop();
      unsubscribe();
    };
  }, [dispatch, navigation, pulse]);

  const newBooking =
    BOOKINGS.find((b: any) => b?.status === 'new' || b?.status === 'upcoming') ??
    BOOKINGS[0] ?? {
      id: '',
      serviceType: '',
      services: [{ quantity: 1 }],
      customer: { name: 'Customer' },
      location: { distanceKm: 0 },
      totalAmount: 0,
    };

  const handleViewBooking = useCallback(() => {
    if (newBooking?.id) {
      navigation.push('BookingDetails', { bookingId: newBooking.id });
    }
  }, [navigation, newBooking?.id]);

  const handleDecline = useCallback(async () => {
    if (newBooking?.id) {
      await dispatch(declineProviderBooking(newBooking.id) as any);
    }
  }, [dispatch, newBooking?.id]);

  const isInitialLoading =
    (profile.isLoading || providerBookings.isLoading) &&
    !PROVIDER_PROFILE &&
    BOOKINGS.length === 0;
  const hasError =
    (profile.error || providerBookings.error) && !PROVIDER_PROFILE && BOOKINGS.length === 0;
  const errorMessage = profile.error || providerBookings.error || 'Failed to load home data';

  const handleRetry = useCallback(() => {
    dispatch(fetchProviderBookings() as any);
    dispatch(fetchProviderProfile() as any);
  }, [dispatch]);

  const formattedDate = new Date()
    .toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
    .toUpperCase();

  if (isInitialLoading) {
    return (
      <SafeAreaView style={[s.safe, s.centerContainer]}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ActivityIndicator size="large" color={C.navy} />
        <Text style={s.loadingText}>Loading provider overview...</Text>
      </SafeAreaView>
    );
  }

  if (hasError) {
    return (
      <SafeAreaView style={[s.safe, s.centerContainer]}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <View style={s.errorContainer}>
          <View style={s.errorIconWrap}>
            <Ionicons name="alert-circle-outline" size={40} color={C.red} />
          </View>
          <Text style={s.errorTitle}>Unable to load data</Text>
          <Text style={s.errorText}>{errorMessage}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={handleRetry} activeOpacity={0.85}>
            <Ionicons name="refresh-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={s.retryTxt}>Retry</Text>
          </TouchableOpacity>
        </View>
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
          {/* Top greeting row */}
          <View style={s.heroTop}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={s.dateEyebrow}>TODAY · {formattedDate}</Text>
              <Text style={s.greeting}>Good day,</Text>
              <Text style={s.heroName} numberOfLines={1}>
                {PROVIDER_PROFILE?.name || 'Professional'}
              </Text>
            </View>

            <View style={s.heroActions}>
              {/* Online indicator badge */}
              <View style={s.onlineBadge}>
                <Animated.View style={[s.onlineDot, { transform: [{ scale: pulse }] }]} />
                <Text style={s.onlineTxt}>Online</Text>
              </View>

              {/* Notification button */}
              <TouchableOpacity
                style={s.iconBtn}
                onPress={() => (navigation as any).navigate('Dashboard')}
                activeOpacity={0.75}
                accessibilityLabel="Notifications"
              >
                <Ionicons name="notifications-outline" size={20} color={C.ink} />
                <View style={s.notifDot} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Operational Availability Status card */}
          <View style={s.statusCard}>
            <View>
              <Text style={s.statusCardLbl}>TODAY&apos;S STATUS</Text>
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
              {/* Header strip banner */}
              <View style={s.cardStrip}>
                <View style={s.cardStripLeft}>
                  <Ionicons name="flash" size={14} color={C.blue} />
                  <Text style={s.cardStripTxt}>New Booking Request</Text>
                </View>
                <View style={s.timePill}>
                  <Text style={s.timePillTxt}>Just now</Text>
                </View>
              </View>

              {/* Card Body */}
              <View style={s.cardBody}>
                <View style={s.serviceIconWrap}>
                  <Ionicons name="construct-outline" size={26} color={C.blue} />
                </View>
                <View style={s.cardBodyInfo}>
                  <Text style={s.cardTitle}>
                    {newBooking.serviceType} — {newBooking.services?.[0]?.quantity ?? 1} Units
                  </Text>
                  <View style={s.metaRow}>
                    <View style={s.metaItem}>
                      <Ionicons name="person-outline" size={13} color={C.slate} style={{ marginRight: 4 }} />
                      <Text style={s.metaTxt}>{newBooking.customer?.name ?? 'Customer'}</Text>
                    </View>
                    <View style={s.metaDivider} />
                    <View style={s.metaItem}>
                      <Ionicons name="location-outline" size={13} color={C.slate} style={{ marginRight: 4 }} />
                      <Text style={s.metaTxt}>{newBooking.location?.distanceKm ?? 0} km away</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Subtle divider */}
              <View style={s.divider} />

              {/* Footer with Payout and Actions */}
              <View style={s.cardFooter}>
                <View>
                  <Text style={s.payoutLbl}>Total Payout</Text>
                  <Text style={s.payoutAmt}>
                    ₹{(newBooking.totalAmount ?? 0).toLocaleString()}
                  </Text>
                </View>
                <View style={s.footerBtns}>
                  <TouchableOpacity
                    style={s.declineBtn}
                    onPress={handleDecline}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="close" size={16} color={C.red} />
                    <Text style={s.declineTxt}>Decline</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={s.acceptBtn}
                    onPress={handleViewBooking}
                    activeOpacity={0.85}
                  >
                    <Text style={s.acceptTxt}>View Details</Text>
                    <Ionicons name="arrow-forward" size={15} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          ) : (
            <View style={s.emptyQueueWrap}>
              <View style={s.emptyIconCircle}>
                <Ionicons name="mail-unread-outline" size={34} color={C.slateLight} />
              </View>
              <Text style={s.emptyQueueTitle}>No new requests</Text>
              <Text style={s.emptyQueueSub}>You&apos;re all caught up for now!</Text>
            </View>
          )}
        </Animated.View>

        {/* ── Quick Actions Grid ───────────────────── */}
        <Animated.View style={[s.quickActions, { opacity: cardFade }]}>
          <Text style={s.qaTitle}>Quick Actions</Text>
          <View style={s.qaGrid}>
            {/* Action 1: Dashboard */}
            <TouchableOpacity
              style={s.qaCard}
              onPress={() => (navigation as any).navigate('Dashboard')}
              activeOpacity={0.75}
            >
              <View style={[s.qaIcon, { backgroundColor: C.blueBg }]}>
                <Ionicons name="grid-outline" size={22} color={C.blue} />
              </View>
              <Text style={s.qaLabel}>Dashboard</Text>
              <Text style={s.qaSub}>View all jobs</Text>
            </TouchableOpacity>

            {/* Action 2: Earnings */}
            <TouchableOpacity
              style={s.qaCard}
              onPress={() => (navigation as any).navigate('Dashboard')}
              activeOpacity={0.75}
            >
              <View style={[s.qaIcon, { backgroundColor: C.greenBg }]}>
                <Ionicons name="wallet-outline" size={22} color={C.greenText} />
              </View>
              <Text style={s.qaLabel}>Earnings</Text>
              <Text style={s.qaSub}>This month</Text>
            </TouchableOpacity>

            {/* Action 3: Schedule */}
            <TouchableOpacity
              style={s.qaCard}
              onPress={() => (navigation as any).navigate('Dashboard')}
              activeOpacity={0.75}
            >
              <View style={[s.qaIcon, { backgroundColor: C.amberBg }]}>
                <Ionicons name="calendar-outline" size={22} color={C.amberText} />
              </View>
              <Text style={s.qaLabel}>Schedule</Text>
              <Text style={s.qaSub}>Upcoming jobs</Text>
            </TouchableOpacity>

            {/* Action 4: Reviews */}
            <TouchableOpacity
              style={s.qaCard}
              onPress={() => (navigation as any).navigate('Profile')}
              activeOpacity={0.75}
            >
              <View style={[s.qaIcon, { backgroundColor: C.roseBg }]}>
                <Ionicons name="star-outline" size={22} color={C.rose} />
              </View>
              <Text style={s.qaLabel}>Reviews</Text>
              <Text style={s.qaSub}>4.8 avg rating</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        <View style={{ height: 36 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 13,
    color: C.slateLight,
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  errorIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: C.redBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  errorTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: C.ink,
  },
  errorText: {
    fontSize: 13,
    color: C.red,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  retryBtn: {
    marginTop: 10,
    backgroundColor: C.navy,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 12,
  },
  retryTxt: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },

  // ── Hero Header ─────────────────────────────
  hero: {
    backgroundColor: C.surface,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  dateEyebrow: {
    fontSize: 10,
    color: C.terra,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginBottom: 4,
  },
  greeting: {
    fontSize: 13,
    color: C.slateLight,
    fontWeight: '500',
    marginBottom: 1,
  },
  heroName: {
    fontSize: 26,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.6,
  },
  heroActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 4,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: C.greenBg,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.25)',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.green,
  },
  onlineTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: C.greenText,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.red,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },

  // ── Status Card ──
  statusCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.surfaceSubtle,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  statusCardLbl: {
    fontSize: 10,
    color: C.slateLight,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  statusCardVal: {
    fontSize: 15,
    fontWeight: '700',
    color: C.ink,
  },
  statusToggle: {
    width: 46,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.green,
    justifyContent: 'center',
    paddingHorizontal: 3,
    alignItems: 'flex-end',
  },
  toggleActive: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },

  // ── Featured Booking Card ────────────────────
  bookingCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: C.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    shadowColor: C.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  cardStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.blueBg,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
  },
  cardStripLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardStripTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: C.blue,
    letterSpacing: 0.2,
  },
  timePill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  timePillTxt: {
    fontSize: 11,
    fontWeight: '600',
    color: C.blue,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    paddingBottom: 14,
  },
  serviceIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: C.blueBg,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  cardBodyInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.ink,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaTxt: {
    fontSize: 12,
    color: C.slate,
    fontWeight: '500',
  },
  metaDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: C.slateLight,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  payoutLbl: {
    fontSize: 11,
    color: C.slateLight,
    marginBottom: 2,
  },
  payoutAmt: {
    fontSize: 24,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.6,
  },
  footerBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  declineBtn: {
    height: 42,
    paddingHorizontal: 14,
    backgroundColor: C.redBg,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  declineTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: C.red,
  },
  acceptBtn: {
    height: 42,
    paddingHorizontal: 16,
    backgroundColor: C.navy,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  acceptTxt: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyQueueWrap: {
    padding: 38,
    alignItems: 'center',
  },
  emptyIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: C.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: 10,
  },
  emptyQueueTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.ink,
  },
  emptyQueueSub: {
    fontSize: 13,
    color: C.slateLight,
    marginTop: 4,
  },

  // ── Quick Actions ───────────────────────────
  quickActions: {
    marginHorizontal: 16,
    marginTop: 26,
  },
  qaTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: C.ink,
    letterSpacing: -0.4,
    marginBottom: 14,
  },
  qaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  qaCard: {
    width: '48%',
    backgroundColor: C.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: C.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  qaIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  qaLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: C.ink,
    marginBottom: 2,
  },
  qaSub: {
    fontSize: 12,
    color: C.slateLight,
    fontWeight: '500',
  },
});