// ─────────────────────────────────────────────────────────────────────────────
//  BookingCard — home "recent bookings" card (animated)
//  Extracted from app/consumer/src/screens/1_statsLanding.tsx
//  Uses the `RecentBooking` shape (screen 1's local `Booking`).
//  NOTE: screen 3 (bookings list) has a separate, fuller booking card using the
//        `Booking` type; that one can be consolidated in a later pass.
//  Tokens rewired to the unified theme. `canvas` → `canvasLight` (#FFFFFF).
// ─────────────────────────────────────────────────────────────────────────────

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Colors as C, Fonts as F } from '../../../theme';
import type { RecentBooking, BookingStatus } from '../../../types';
import { PulsingDot } from '../PulsingDot';

// Home status pill config (was a screen-local const in 1_statsLanding.tsx).
const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; color: string; bg: string; ionIcon: string }
> = {
  upcoming:  { label: 'Upcoming',  color: C.cobalt, bg: C.cobaltBg,  ionIcon: 'time-outline'             },
  ongoing:   { label: 'Ongoing',   color: C.sage,   bg: C.sageBg,    ionIcon: 'radio-button-on-outline'  },
  completed: { label: 'Completed', color: C.gold,   bg: C.goldLight, ionIcon: 'checkmark-circle-outline' },
  cancelled: { label: 'Cancelled', color: C.red,    bg: C.redBg,     ionIcon: 'close-circle-outline'     },
};

export interface BookingCardProps {
  item: RecentBooking;
  index: number;
}

export const BookingCard: React.FC<BookingCardProps> = ({ item, index }) => {
  const sc = STATUS_CONFIG[item.status];
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    const delay = 150 + index * 100;
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 420, delay, useNativeDriver: true }),
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
      <View style={[styles.bookingGlow, { backgroundColor: item.color + '0F' }]} />

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
              {item.status === 'ongoing' ? (
                <PulsingDot color={sc.color} />
              ) : (
                <Ionicons name={sc.ionIcon as any} size={10} color={sc.color} />
              )}
              <Text style={[styles.bookingStatusText, { fontFamily: F.bodySemi, color: sc.color }]}>
                {' '}{sc.label}
              </Text>
            </View>
          </View>

          {/* Provider row */}
          <View style={styles.bookingProviderRow}>
            <View style={[styles.bookingInitials, { backgroundColor: item.bg, borderColor: item.color + '40' }]}>
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
          {item.status === 'completed' && item.rating && (
            <View style={styles.bookingRatingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= Math.floor(item.rating!) ? 'star' : 'star-outline'}
                  size={11}
                  color={C.gold}
                />
              ))}
              <Text style={[styles.bookingRatingVal, { fontFamily: F.bodySemi }]}>
                {' '}{item.rating}
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

        {item.status === 'upcoming' && (
          <TouchableOpacity style={[styles.footerPriBtn, { backgroundColor: item.color }]} activeOpacity={0.85}>
            <Ionicons name="navigate" size={13} color="#FFF" />
            <Text style={[styles.footerPriBtnText, { fontFamily: F.bodySemi }]}>Track Pro</Text>
          </TouchableOpacity>
        )}
        {item.status === 'ongoing' && (
          <TouchableOpacity style={[styles.footerPriBtn, { backgroundColor: item.color }]} activeOpacity={0.85}>
            <Ionicons name="radio-button-on" size={13} color="#FFF" />
            <Text style={[styles.footerPriBtnText, { fontFamily: F.bodySemi }]}>Live Track</Text>
          </TouchableOpacity>
        )}
        {item.status === 'completed' && (
          <TouchableOpacity style={[styles.footerPriBtn, { backgroundColor: item.color }]} activeOpacity={0.85}>
            <Ionicons name="refresh" size={13} color="#FFF" />
            <Text style={[styles.footerPriBtnText, { fontFamily: F.bodySemi }]}>Rebook</Text>
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bookingCard: {
    backgroundColor: C.surface,
    borderRadius: 22,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: C.ruleLight,
    overflow: 'hidden',
    shadowColor: C.ink,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 5,
  },
  bookingGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    top: -50,
    right: -30,
  },
  bookingMain: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
  },
  bookingIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bookingTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  bookingTitle: {
    fontSize: 15,
    color: C.ink,
    letterSpacing: -0.3,
    flex: 1,
  },
  bookingStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  bookingInitials: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
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
    flexDirection: 'row',
    alignItems: 'center',
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderTopWidth: 1,
    gap: 6,
  },
  footerSecBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: C.canvasLight, // was C.canvas (#FFFFFF on screen 1)
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 11,
  },
  footerPriBtnText: {
    fontSize: 12,
    color: '#FFF',
  },
});

export default BookingCard;
