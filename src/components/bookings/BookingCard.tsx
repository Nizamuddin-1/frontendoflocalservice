// ─── Booking Card ─────────────────────────────────────────────────────────────
// Extracted from 3_bookingScreen.tsx (bookings feature). Composes Avatar,
// StatusBadge, StarRow and ActionBtn. Copied verbatim from the original screen.
import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { C, F } from './tokens';
import { styles } from './bookings.styles';
import { Avatar } from './Avatar';
import { StatusBadge } from './StatusBadge';
import { StarRow } from './StarRow';
import { ActionBtn } from './ActionBtn';
import type { Booking } from '@/src/types';

export interface BookingCardProps {
  booking: Booking;
}

export const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const [expanded, setExpanded] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;

  const pressIn  = () => Animated.spring(scale, { toValue: 0.975, useNativeDriver: true, speed: 50 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1,     useNativeDriver: true, speed: 50 }).start();

  const toggleExpand = () => {
    const toVal = expanded ? 0 : 1;
    setExpanded(!expanded);
    Animated.spring(expandAnim, { toValue: toVal, useNativeDriver: false, speed: 20, bounciness: 4 }).start();
  };

  const isOngoing   = booking.status === "ongoing";
  const isUpcoming  = booking.status === "upcoming";
  const isCompleted = booking.status === "completed";
  const isCancelled = booking.status === "cancelled";

  return (
    <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
      <TouchableOpacity activeOpacity={1} onPressIn={pressIn} onPressOut={pressOut} onPress={toggleExpand}>

        {/* ── Accent strip ── */}
        <View style={[styles.accentStrip, { backgroundColor: booking.accentColor }]}>
          <MaterialCommunityIcons name={booking.mcIcon as any} size={13} color="rgba(255,255,255,0.9)" />
          <Text style={[styles.accentCat, { fontFamily: F.bodySemi }]}>{booking.category}</Text>
          <View style={{ flex: 1 }} />
          <Text style={[styles.accentRef, { fontFamily: F.bodyMedium }]}>{booking.bookingRef}</Text>
        </View>

        {/* ── Card Main ── */}
        <View style={styles.cardMain}>

          {/* Row: Avatar + Title + Status */}
          <View style={styles.cardTopRow}>
            <Avatar initials={booking.proAvatar} color={booking.accentColor} size={48} />
            <View style={styles.cardTitleBlock}>
              <Text style={[styles.cardServiceName, { fontFamily: F.displaySemi }]} numberOfLines={2}>
                {booking.serviceName}
              </Text>
              <Text style={[styles.cardProviderName, { fontFamily: F.bodyMedium }]}>
                {booking.providerName}
              </Text>
            </View>
            <StatusBadge status={booking.status} />
          </View>

          {/* Divider */}
          <View style={styles.cardDivider} />

          {/* Info Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={14} color={C.slateLight} />
              <View style={{ marginLeft: 7 }}>
                <Text style={[styles.infoLabel, { fontFamily: F.bodyRegular }]}>Date</Text>
                <Text style={[styles.infoValue, { fontFamily: F.bodySemi }]}>{booking.date}</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={14} color={C.slateLight} />
              <View style={{ marginLeft: 7 }}>
                <Text style={[styles.infoLabel, { fontFamily: F.bodyRegular }]}>Time</Text>
                <Text style={[styles.infoValue, { fontFamily: F.bodySemi }]}>{booking.timeSlot}</Text>
              </View>
            </View>
            <View style={[styles.infoItem, { width: "100%" }]}>
              <Ionicons name="location-outline" size={14} color={C.slateLight} />
              <View style={{ marginLeft: 7, flex: 1 }}>
                <Text style={[styles.infoLabel, { fontFamily: F.bodyRegular }]}>Address</Text>
                <Text style={[styles.infoValue, { fontFamily: F.bodySemi }]} numberOfLines={1}>
                  {booking.address}
                </Text>
              </View>
            </View>
          </View>

          {/* Price + Payment Row */}
          <View style={styles.priceRow}>
            <View>
              <Text style={[styles.priceLabel, { fontFamily: F.bodyRegular }]}>Total Amount</Text>
              <Text style={[styles.priceValue, { fontFamily: F.displayBold }]}>
                ₹{booking.price.toLocaleString()}
              </Text>
            </View>
            <View style={[
              styles.payBadge,
              { backgroundColor: booking.isPaid ? "#DCFCE7" : "#FEF9C3" }
            ]}>
              <Ionicons
                name={booking.isPaid ? "shield-checkmark" : "alert-circle-outline"}
                size={12}
                color={booking.isPaid ? "#15803D" : "#92400E"}
              />
              <Text style={[
                styles.payBadgeText,
                { fontFamily: F.bodySemi, color: booking.isPaid ? "#15803D" : "#92400E", marginLeft: 4 }
              ]}>
                {booking.isPaid ? "Paid" : "Pay on Service"}
              </Text>
            </View>
          </View>

          {/* Completed: Star Rating */}
          {isCompleted && booking.rating && (
            <View style={styles.ratingRow}>
              <StarRow rating={booking.rating} />
              <Text style={[styles.ratingLabel, { fontFamily: F.bodyMedium }]}>Your rating</Text>
            </View>
          )}

          {/* Expand chevron */}
          <View style={styles.expandRow}>
            <Text style={[styles.expandHint, { fontFamily: F.bodyMedium }]}>
              {expanded ? "Hide details" : "View details"}
            </Text>
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={16}
              color={C.slateLight}
            />
          </View>
        </View>

        {/* ── Expanded Section ── */}
        {expanded && (
          <View style={styles.expandedSection}>

            {/* Timeline for ongoing */}
            {isOngoing && (
              <View style={styles.timelineBlock}>
                <Text style={[styles.expandSectionTitle, { fontFamily: F.bodySemi }]}>
                  Service Progress
                </Text>
                {[
                  { label: "Booking Confirmed",    done: true  },
                  { label: "Professional En Route", done: true  },
                  { label: "Service In Progress",   done: true, active: true },
                  { label: "Service Completed",     done: false },
                  { label: "Payment Processed",     done: false },
                ].map((step, i, arr) => (
                  <View key={i} style={styles.timelineStep}>
                    <View style={styles.timelineLeft}>
                      <View style={[
                        styles.timelineDot,
                        step.done    && { backgroundColor: C.green,  borderColor: C.green  },
                        step.active  && { backgroundColor: C.blue,   borderColor: C.blue   },
                        !step.done   && { backgroundColor: "#FFF",   borderColor: C.border },
                      ]}>
                        {step.done && !step.active && (
                          <Ionicons name="checkmark" size={8} color="#FFF" />
                        )}
                        {step.active && (
                          <View style={styles.timelinePulse} />
                        )}
                      </View>
                      {i < arr.length - 1 && (
                        <View style={[styles.timelineLine, { backgroundColor: step.done ? C.green : C.border }]} />
                      )}
                    </View>
                    <Text style={[
                      styles.timelineLabel,
                      { fontFamily: step.active ? F.bodySemi : F.bodyMedium },
                      { color: step.active ? C.blue : step.done ? C.navy : C.slateLight },
                    ]}>
                      {step.label}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Cancelled reason */}
            {isCancelled && (
              <View style={styles.cancelledBox}>
                <Ionicons name="information-circle-outline" size={16} color={C.red} />
                <Text style={[styles.cancelledText, { fontFamily: F.bodyMedium }]}>
                  Booking was cancelled. Refund processed within 3–5 business days if applicable.
                </Text>
              </View>
            )}

            {/* Completed review prompt */}
            {isCompleted && booking.canReview && (
              <View style={styles.reviewPrompt}>
                <View style={styles.reviewPromptLeft}>
                  <Ionicons name="star-half-outline" size={20} color={C.amber} />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={[styles.reviewPromptTitle, { fontFamily: F.bodySemi }]}>
                      How was the service?
                    </Text>
                    <Text style={[styles.reviewPromptSub, { fontFamily: F.bodyRegular }]}>
                      Share your experience
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.reviewBtn} activeOpacity={0.8}>
                  <Text style={[styles.reviewBtnText, { fontFamily: F.bodySemi }]}>Rate Now</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Actions */}
            <View style={styles.actionsRow}>
              {isOngoing && (
                <>
                  <ActionBtn label="Track Live" icon="navigate" variant="primary" />
                  <ActionBtn label="Call Pro"   icon="call-outline" variant="outline" />
                  <ActionBtn label="Support"    icon="chatbubble-ellipses-outline" variant="ghost" />
                </>
              )}
              {isUpcoming && (
                <>
                  <ActionBtn label="Reschedule" icon="calendar-outline"  variant="primary"  />
                  <ActionBtn label="Cancel"      icon="close-outline"     variant="outline"  />
                  <ActionBtn label="Contact"     icon="call-outline"      variant="ghost"    />
                </>
              )}
              {isCompleted && (
                <>
                  <ActionBtn label="Book Again"  icon="refresh-outline"            variant="primary" />
                  <ActionBtn label="Download"    icon="download-outline"           variant="outline" />
                  <ActionBtn label="Support"     icon="chatbubble-ellipses-outline" variant="ghost"  />
                </>
              )}
              {isCancelled && (
                <>
                  <ActionBtn label="Rebook"   icon="refresh-outline"  variant="primary" />
                  <ActionBtn label="Support"  icon="chatbubble-ellipses-outline" variant="ghost" />
                </>
              )}
            </View>
          </View>
        )}

      </TouchableOpacity>
    </Animated.View>
  );
};

export default BookingCard;
