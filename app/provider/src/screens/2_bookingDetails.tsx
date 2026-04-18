// ─────────────────────────────────────────────
//  Screen 2 — Booking Details (Redesigned)
// ─────────────────────────────────────────────

import React, { useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp }           from '@react-navigation/native';
import { Colors, FontSize, FontWeight, Spacing, Radii, Shadows } from '../theme';
import { PrimaryButton, DangerButton, StatusChip } from '../components';
import { BOOKINGS } from '../hooks/mockData';
import type { RootStackParamList, ServiceItem } from '../types';

type NavProp    = StackNavigationProp<RootStackParamList, 'BookingDetails'>;
type RouteProp2 = RouteProp<RootStackParamList, 'BookingDetails'>;
interface Props { navigation: NavProp; route: RouteProp2 }

// ── Palette ───────────────────────────────────
const ACCENT   = '#6366F1';
const NAVY     = '#0F172A';
const MUTED    = '#64748B';
const BORDER   = '#E2E8F0';
const SURFACE  = '#F8FAFC';

// ── Service Row ───────────────────────────────
const ServiceRow: React.FC<{ item: ServiceItem; isLast?: boolean }> = ({ item, isLast }) => (
  <View style={[s.serviceRow, isLast && { borderBottomWidth: 0 }]}>
    <View style={s.serviceLeft}>
      <View style={s.serviceCheck}>
        <Feather name="check" size={11} color="#fff" />
      </View>
      <View style={{ marginLeft: 10 }}>
        <Text style={s.serviceName}>{item.name}</Text>
        {item.quantity > 1 && <Text style={s.serviceQty}>× {item.quantity} units</Text>}
      </View>
    </View>
    <Text style={s.servicePrice}>₹{(item.price * item.quantity).toLocaleString()}</Text>
  </View>
);

export default function BookingDetailsScreen({ navigation, route }: Props) {
  const booking = useMemo(
    () => BOOKINGS.find((b) => b.id === route.params.bookingId) ?? BOOKINGS[0],
    [route.params.bookingId]
  );

  const scheduledDate = new Date(booking.scheduledAt);
  const dateLabel     = scheduledDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const timeLabel     = scheduledDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const durationHrs   = booking.durationMins / 60;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Page Header ───────────────────────── */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={18} color={NAVY} />
        </TouchableOpacity>
        <View style={s.headerCenter}>
          <Text style={s.headerTitle}>Booking Details</Text>
          <Text style={s.headerSub}>Request #{booking.requestNo}</Text>
        </View>
        <StatusChip type={booking.status} label={booking.status} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Customer Card ──────────────────── */}
        <View style={s.customerCard}>
          {/* Avatar + Name */}
          <View style={s.customerTop}>
            <View style={s.avatar}>
              <Text style={s.avatarTxt}>{booking.customer.initials}</Text>
            </View>
            <View style={s.customerInfo}>
              <Text style={s.customerName}>{booking.customer.name}</Text>
              <View style={s.ratingRow}>
                <Feather name="star" size={12} color="#F59E0B" />
                <Text style={s.ratingTxt}>{booking.customer.rating} rating</Text>
                <View style={s.dot} />
                <Text style={s.ordersTxt}>{booking.customer.totalOrders} bookings</Text>
              </View>
            </View>
            {/* Contact icon */}
            <TouchableOpacity style={s.callBtn}>
              <Feather name="phone" size={16} color={ACCENT} />
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={s.cardDivider} />

          {/* Address row */}
          <View style={s.addressRow}>
            <View style={s.addressIconWrap}>
              <Feather name="map-pin" size={14} color={ACCENT} />
            </View>
            <Text style={s.addressTxt} numberOfLines={2}>
              {booking.location.address}
            </Text>
            <View style={s.distancePill}>
              <Text style={s.distancePillTxt}>{booking.location.distanceKm} km</Text>
            </View>
          </View>
        </View>

        {/* ── Booking Info Strip ─────────────── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Booking Info</Text>
        </View>

        <View style={s.infoStrip}>
          {/* Date & Time */}
          <View style={s.infoItem}>
            <View style={[s.infoIconWrap, { backgroundColor: '#EEF2FF' }]}>
              <Feather name="calendar" size={15} color={ACCENT} />
            </View>
            <Text style={s.infoVal}>{dateLabel}</Text>
            <Text style={s.infoSub}>{timeLabel}</Text>
          </View>

          <View style={s.infoDivider} />

          {/* Duration */}
          <View style={s.infoItem}>
            <View style={[s.infoIconWrap, { backgroundColor: '#FFF7ED' }]}>
              <Feather name="clock" size={15} color="#F97316" />
            </View>
            <Text style={s.infoVal}>{durationHrs} hrs</Text>
            <Text style={s.infoSub}>Duration</Text>
          </View>

          <View style={s.infoDivider} />

          {/* Distance */}
          <View style={s.infoItem}>
            <View style={[s.infoIconWrap, { backgroundColor: '#F0FDF4' }]}>
              <Feather name="navigation" size={15} color="#10B981" />
            </View>
            <Text style={s.infoVal}>{booking.location.distanceKm} km</Text>
            <Text style={s.infoSub}>{booking.location.etaMins} min ETA</Text>
          </View>
        </View>

        {/* ── Services ──────────────────────── */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Services Requested</Text>
        </View>

        <View style={s.servicesCard}>
          {booking.services.map((item, idx) => (
            <ServiceRow
              key={item.id}
              item={item}
              isLast={idx === booking.services.length - 1}
            />
          ))}
        </View>

        {/* ── Payout Banner ─────────────────── */}
        <View style={s.payoutBanner}>
          <View style={s.payoutLeft}>
            <Text style={s.payoutLbl}>Your Total Payout</Text>
            <Text style={s.payoutAmt}>₹{booking.totalAmount.toLocaleString()}</Text>
          </View>
          <View style={s.payoutRight}>
            <View style={s.payoutIconCircle}>
              <Feather name="trending-up" size={20} color="#fff" />
            </View>
            <Text style={s.payoutRightTxt}>Paid on completion</Text>
          </View>
        </View>

      </ScrollView>

      {/* ── Action Bar ────────────────────────── */}
      <View style={s.actionBar}>
        <DangerButton
          label="Decline"
          style={{ flex: 1 }}
          onPress={() => navigation.goBack()}
        />
        <PrimaryButton
          label="Accept Job"
          style={{ flex: 2 }}
          icon={<Feather name="check" size={16} color="#fff" />}
          onPress={() => navigation.replace('ActiveJob', { bookingId: booking.id })}
        />
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: '#FFFFFF' },
  scroll:  { flex: 1 },
  content: { paddingBottom: 24 },

  // ── Header ──────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    backgroundColor: '#fff',
  },
  backBtn: {
    width: 38, height: 38,
    borderRadius: 12,
    backgroundColor: SURFACE,
    borderWidth: 1, borderColor: BORDER,
    justifyContent: 'center', alignItems: 'center',
    marginRight: 10,
  },
  headerCenter: { flex: 1 },
  headerTitle:  { fontSize: 16, fontWeight: '800', color: NAVY, letterSpacing: -0.3 },
  headerSub:    { fontSize: 12, color: MUTED, fontWeight: '500', marginTop: 1 },

  // ── Customer Card ────────────────────────────
  customerCard: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  customerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  avatar: {
    width: 48, height: 48, borderRadius: 15,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  avatarTxt:    { fontSize: 16, fontWeight: '800', color: ACCENT },
  customerInfo: { flex: 1 },
  customerName: { fontSize: 16, fontWeight: '800', color: NAVY, marginBottom: 4 },
  ratingRow:    { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingTxt:    { fontSize: 12, color: MUTED, fontWeight: '500' },
  dot:          { width: 3, height: 3, borderRadius: 2, backgroundColor: '#CBD5E1' },
  ordersTxt:    { fontSize: 12, color: MUTED, fontWeight: '500' },
  callBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#EEF2FF',
    borderWidth: 1, borderColor: '#C7D2FE',
    justifyContent: 'center', alignItems: 'center',
  },

  cardDivider: { height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 16 },

  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
  },
  addressIconWrap: {
    width: 32, height: 32, borderRadius: 9,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center', alignItems: 'center',
    flexShrink: 0,
  },
  addressTxt: { flex: 1, fontSize: 13, color: MUTED, fontWeight: '500', lineHeight: 18 },
  distancePill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 999, paddingVertical: 4, paddingHorizontal: 9,
    borderWidth: 1, borderColor: BORDER,
  },
  distancePillTxt: { fontSize: 11, fontWeight: '700', color: NAVY },

  // ── Section Header ───────────────────────────
  sectionHeader: { paddingHorizontal: 16, marginTop: 24, marginBottom: 12 },
  sectionTitle:  { fontSize: 15, fontWeight: '800', color: NAVY, letterSpacing: -0.2 },

  // ── Info Strip ───────────────────────────────
  infoStrip: {
    flexDirection: 'row',
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    gap: 6,
  },
  infoIconWrap: {
    width: 36, height: 36, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 2,
  },
  infoVal:     { fontSize: 13, fontWeight: '800', color: NAVY, letterSpacing: -0.2 },
  infoSub:     { fontSize: 11, color: MUTED, fontWeight: '500' },
  infoDivider: { width: 1, backgroundColor: BORDER, marginVertical: 14 },

  // ── Services Card ────────────────────────────
  servicesCard: {
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  serviceLeft:  { flexDirection: 'row', alignItems: 'center', flex: 1 },
  serviceCheck: {
    width: 20, height: 20, borderRadius: 6,
    backgroundColor: '#10B981',
    justifyContent: 'center', alignItems: 'center',
  },
  serviceName:  { fontSize: 14, fontWeight: '700', color: NAVY },
  serviceQty:   { fontSize: 12, color: MUTED, marginTop: 2 },
  servicePrice: { fontSize: 14, fontWeight: '800', color: NAVY },

  // ── Payout Banner ────────────────────────────
  payoutBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: NAVY,
    borderRadius: 20,
    padding: 18,
  },
  payoutLeft:       {},
  payoutLbl:        { fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: '500', marginBottom: 5 },
  payoutAmt:        { fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -1 },
  payoutRight:      { alignItems: 'center', gap: 6 },
  payoutIconCircle: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: ACCENT,
    justifyContent: 'center', alignItems: 'center',
  },
  payoutRightTxt: { fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: '500' },

  // ── Action Bar ───────────────────────────────
  actionBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
});