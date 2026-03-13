/**
 * BookingsScreen.tsx
 *
 * Fonts required:
 *   Recoleta-Bold.ttf, Recoleta-SemiBold.ttf, Recoleta-Regular.ttf
 *   Geist-Regular.ttf, Geist-Medium.ttf, Geist-SemiBold.ttf, Geist-Bold.ttf
 *
 *   react-native.config.js → assets: ['./assets/fonts']
 *   then: npx react-native-asset
 *
 * Icons:
 *   npm install react-native-vector-icons
 *   npm install --save-dev @types/react-native-vector-icons
 */

import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  SectionList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Animated,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const { width } = Dimensions.get("window");

// ─── Font Map ─────────────────────────────────────────────────────────────────
const F = {
  displayBold:    "Recoleta-Bold",
  displaySemi:    "Recoleta-SemiBold",
  displayReg:     "Recoleta-Regular",
  bodyRegular:    "Geist-Regular",
  bodyMedium:     "Geist-Medium",
  bodySemi:       "Geist-SemiBold",
  bodyBold:       "Geist-Bold",
};

// ─── Colors ───────────────────────────────────────────────────────────────────
const C = {
  bg:           "#F0F2F8",
  surface:      "#FFFFFF",
  navy:         "#0A1628",
  navyMid:      "#1C2E4A",
  blue:         "#1A73E8",
  green:        "#0AB87A",
  amber:        "#F59E0B",
  red:          "#EF4444",
  purple:       "#7C3AED",
  slate:        "#64748B",
  slateLight:   "#94A3B8",
  border:       "#E2E8F4",
  borderLight:  "#EEF1F8",
};

// ─── Types ────────────────────────────────────────────────────────────────────
type BookingStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

interface Booking {
  id: string;
  serviceName: string;
  providerName: string;
  category: string;
  mcIcon: string;
  status: BookingStatus;
  date: string;
  timeSlot: string;
  address: string;
  price: number;
  isPaid: boolean;
  bookingRef: string;
  accentColor: string;
  rating?: number;
  canReschedule?: boolean;
  canCancel?: boolean;
  canReview?: boolean;
  canTrack?: boolean;
  proAvatar: string; // initials fallback
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const ALL_BOOKINGS: Booking[] = [
  {
    id: "b1",
    serviceName: "AC Deep Service & Gas Refill",
    providerName: "Agra Air Solutions",
    category: "AC Repair",
    mcIcon: "air-conditioner",
    status: "ongoing",
    date: "Today, 14 Mar",
    timeSlot: "2:00 PM – 4:00 PM",
    address: "47, Civil Lines, Agra",
    price: 1199,
    isPaid: true,
    bookingRef: "LF-2024-0891",
    accentColor: "#1A73E8",
    canTrack: true,
    proAvatar: "AA",
  },
  {
    id: "b2",
    serviceName: "Full Home Plumbing Checkup",
    providerName: "Apex Plumbing Services",
    category: "Plumbing",
    mcIcon: "pipe-wrench",
    status: "upcoming",
    date: "Sat, 16 Mar",
    timeSlot: "10:00 AM – 12:00 PM",
    address: "12, Taj Nagari Phase 2, Agra",
    price: 799,
    isPaid: false,
    bookingRef: "LF-2024-0892",
    accentColor: "#0AB87A",
    canReschedule: true,
    canCancel: true,
    proAvatar: "AP",
  },
  {
    id: "b3",
    serviceName: "Wiring & MCB Replacement",
    providerName: "SparkFix Electricals",
    category: "Electrical",
    mcIcon: "lightning-bolt",
    status: "upcoming",
    date: "Sun, 17 Mar",
    timeSlot: "9:00 AM – 11:00 AM",
    address: "88, Sector 7, Agra",
    price: 649,
    isPaid: false,
    bookingRef: "LF-2024-0893",
    accentColor: "#F59E0B",
    canReschedule: true,
    canCancel: true,
    proAvatar: "SF",
  },
  {
    id: "b4",
    serviceName: "Deep Home Cleaning",
    providerName: "CleanPro Home Care",
    category: "Cleaning",
    mcIcon: "spray-bottle",
    status: "completed",
    date: "Mon, 11 Mar",
    timeSlot: "11:00 AM – 3:00 PM",
    address: "47, Civil Lines, Agra",
    price: 1499,
    isPaid: true,
    bookingRef: "LF-2024-0880",
    accentColor: "#7C3AED",
    rating: 5,
    canReview: false,
    proAvatar: "CP",
  },
  {
    id: "b5",
    serviceName: "Interior Wall Painting – 2BHK",
    providerName: "PaintMaster Pro",
    category: "Painting",
    mcIcon: "format-paint",
    status: "completed",
    date: "Thu, 7 Mar",
    timeSlot: "9:00 AM – 6:00 PM",
    address: "12, Taj Nagari Phase 2, Agra",
    price: 8500,
    isPaid: true,
    bookingRef: "LF-2024-0871",
    accentColor: "#EF4444",
    rating: undefined,
    canReview: true,
    proAvatar: "PM",
  },
  {
    id: "b6",
    serviceName: "Bathroom Fixture Installation",
    providerName: "Apex Plumbing Services",
    category: "Plumbing",
    mcIcon: "pipe-wrench",
    status: "cancelled",
    date: "Tue, 5 Mar",
    timeSlot: "3:00 PM – 5:00 PM",
    address: "88, Sector 7, Agra",
    price: 599,
    isPaid: false,
    bookingRef: "LF-2024-0865",
    accentColor: "#64748B",
    proAvatar: "AP",
  },
];

const TABS: { key: BookingStatus | "all"; label: string }[] = [
  { key: "all",       label: "All"       },
  { key: "ongoing",   label: "Active"    },
  { key: "upcoming",  label: "Upcoming"  },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

// ─── Status Config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<BookingStatus, {
  label: string; bg: string; text: string; icon: string; dot: string;
}> = {
  ongoing:   { label: "Active",     bg: "#DCFCE7", text: "#15803D", icon: "radio-button-on",  dot: "#0AB87A" },
  upcoming:  { label: "Upcoming",   bg: "#DBEAFE", text: "#1D4ED8", icon: "time-outline",      dot: "#1A73E8" },
  completed: { label: "Completed",  bg: "#F0FDF4", text: "#166534", icon: "checkmark-circle",  dot: "#0AB87A" },
  cancelled: { label: "Cancelled",  bg: "#FEF2F2", text: "#991B1B", icon: "close-circle",      dot: "#EF4444" },
};

// ─── Star Rating Display ──────────────────────────────────────────────────────
const StarRow = ({ rating }: { rating: number }) => (
  <View style={{ flexDirection: "row", gap: 2 }}>
    {[1,2,3,4,5].map((i) => (
      <Ionicons
        key={i}
        name={i <= rating ? "star" : "star-outline"}
        size={13}
        color={i <= rating ? "#F59E0B" : "#CBD5E1"}
      />
    ))}
  </View>
);

// ─── Provider Avatar ──────────────────────────────────────────────────────────
const Avatar = ({ initials, color, size = 44 }: { initials: string; color: string; size?: number }) => (
  <View style={[styles.avatar, {
    width: size, height: size, borderRadius: size / 2,
    backgroundColor: color + "22",
    borderColor: color + "55",
  }]}>
    <Text style={[styles.avatarText, { color, fontFamily: F.displaySemi, fontSize: size * 0.34 }]}>
      {initials}
    </Text>
  </View>
);

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: BookingStatus }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
      <View style={[styles.statusDot, { backgroundColor: cfg.dot }]} />
      <Text style={[styles.statusText, { color: cfg.text, fontFamily: F.bodySemi }]}>{cfg.label}</Text>
    </View>
  );
};

// ─── Action Button ────────────────────────────────────────────────────────────
const ActionBtn = ({
  label, icon, variant = "outline", onPress,
}: {
  label: string; icon: string; variant?: "primary" | "outline" | "ghost"; onPress?: () => void;
}) => {
  const isPrimary = variant === "primary";
  const isGhost   = variant === "ghost";
  return (
    <TouchableOpacity
      style={[
        styles.actionBtn,
        isPrimary && styles.actionBtnPrimary,
        isGhost   && styles.actionBtnGhost,
      ]}
      activeOpacity={0.75}
      onPress={onPress}
    >
      <Ionicons
        name={icon as any}
        size={14}
        color={isPrimary ? "#FFF" : isGhost ? C.slate : C.navy}
        style={{ marginRight: 5 }}
      />
      <Text style={[
        styles.actionBtnText,
        { fontFamily: F.bodySemi },
        isPrimary && { color: "#FFF" },
        isGhost   && { color: C.slate },
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

// ─── Booking Card ─────────────────────────────────────────────────────────────
const BookingCard = ({ booking }: { booking: Booking }) => {
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

// ─── Summary Stats ────────────────────────────────────────────────────────────
const SummaryStats = () => {
  const stats = [
    { label: "Total",     value: ALL_BOOKINGS.length,                                      icon: "receipt-outline",      color: C.blue   },
    { label: "Active",    value: ALL_BOOKINGS.filter(b => b.status === "ongoing").length,   icon: "radio-button-on",      color: C.green  },
    { label: "Upcoming",  value: ALL_BOOKINGS.filter(b => b.status === "upcoming").length,  icon: "time-outline",         color: C.amber  },
    { label: "Done",      value: ALL_BOOKINGS.filter(b => b.status === "completed").length, icon: "checkmark-circle",     color: C.purple },
  ];
  return (
    <View style={styles.statsRow}>
      {stats.map((s) => (
        <View key={s.label} style={styles.statCard}>
          <View style={[styles.statIconWrap, { backgroundColor: s.color + "18" }]}>
            <Ionicons name={s.icon as any} size={16} color={s.color} />
          </View>
          <Text style={[styles.statValue, { fontFamily: F.displayBold, color: s.color }]}>{s.value}</Text>
          <Text style={[styles.statLabel, { fontFamily: F.bodyRegular }]}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function BookingsScreen() {
  const [activeTab, setActiveTab] = useState<BookingStatus | "all">("all");

  const filtered = activeTab === "all"
    ? ALL_BOOKINGS
    : ALL_BOOKINGS.filter((b) => b.status === activeTab);

  // Group by status for SectionList
  const sections =
    activeTab === "all"
      ? [
          { title: "🟢  Active Now",  data: filtered.filter(b => b.status === "ongoing")   },
          { title: "🔵  Upcoming",    data: filtered.filter(b => b.status === "upcoming")  },
          { title: "✅  Completed",   data: filtered.filter(b => b.status === "completed") },
          { title: "❌  Cancelled",   data: filtered.filter(b => b.status === "cancelled") },
        ].filter((s) => s.data.length > 0)
      : [{ title: "", data: filtered }];

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />

      {/* ── Header ── */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.headerTitle, { fontFamily: F.displayBold }]}>My Bookings</Text>
            <Text style={[styles.headerSub,   { fontFamily: F.bodyRegular }]}>
              {ALL_BOOKINGS.length} total bookings
            </Text>
          </View>
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.75}>
            <Ionicons name="options-outline" size={20} color={C.navy} />
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <SummaryStats />

        {/* Tab Bar */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.75}
              >
                <Text style={[
                  styles.tabText,
                  { fontFamily: active ? F.bodySemi : F.bodyMedium },
                  active && styles.tabTextActive,
                ]}>
                  {tab.label}
                </Text>
                {active && <View style={styles.tabUnderline} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── List ── */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <BookingCard booking={item} />}
        renderSectionHeader={({ section: { title } }) =>
          title ? (
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionHeaderText, { fontFamily: F.bodySemi }]}>{title}</Text>
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="receipt-outline" size={40} color={C.slateLight} />
            </View>
            <Text style={[styles.emptyTitle, { fontFamily: F.displaySemi }]}>No bookings here</Text>
            <Text style={[styles.emptySub,   { fontFamily: F.bodyRegular  }]}>
              Your {activeTab !== "all" ? activeTab : ""} bookings will appear here
            </Text>
            <TouchableOpacity style={styles.emptyBtn} activeOpacity={0.85}>
              <Ionicons name="add-circle-outline" size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={[styles.emptyBtnText, { fontFamily: F.bodySemi }]}>Book a Service</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
}

// ─── StyleSheet ───────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // Header
  header: {
    backgroundColor: C.surface,
    paddingTop: Platform.OS === "ios" ? 56 : 36,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 6,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 28,
    color: C.navy,
    letterSpacing: -0.6,
  },
  headerSub: {
    fontSize: 13,
    color: C.slateLight,
    marginTop: 2,
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: C.border,
  },

  // Stats
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 10,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: C.bg,
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  statIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    color: C.slateLight,
    marginTop: 1,
  },

  // Tabs
  tabsContent: {
    paddingHorizontal: 16,
    paddingBottom: 0,
    gap: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 4,
    position: "relative",
    alignItems: "center",
  },
  tabActive: {},
  tabText: {
    fontSize: 14,
    color: C.slateLight,
  },
  tabTextActive: {
    color: C.navy,
  },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: C.blue,
  },

  // Section Header
  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionHeaderText: {
    fontSize: 13,
    color: C.slate,
    letterSpacing: 0.1,
  },

  // List
  listContent: {
    paddingBottom: 40,
  },

  // Card
  card: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: C.surface,
    borderRadius: 22,
    overflow: "hidden",
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
    borderWidth: 1,
    borderColor: C.borderLight,
  },

  // Accent Strip
  accentStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  accentCat: {
    fontSize: 11,
    color: "rgba(255,255,255,0.92)",
    letterSpacing: 0.3,
  },
  accentRef: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
  },

  // Card Main
  cardMain: {
    padding: 16,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },
  cardTitleBlock: {
    flex: 1,
  },
  cardServiceName: {
    fontSize: 15,
    color: C.navy,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  cardProviderName: {
    fontSize: 12,
    color: C.slateLight,
    marginTop: 3,
  },
  cardDivider: {
    height: 1,
    backgroundColor: C.borderLight,
    marginBottom: 14,
  },

  // Avatar
  avatar: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  avatarText: {},

  // Status Badge
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
  },

  // Info Grid
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    width: "47%",
  },
  infoLabel: {
    fontSize: 10,
    color: C.slateLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 13,
    color: C.navy,
  },

  // Price Row
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: C.bg,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.borderLight,
  },
  priceLabel: {
    fontSize: 11,
    color: C.slateLight,
    marginBottom: 3,
  },
  priceValue: {
    fontSize: 22,
    color: C.navy,
    letterSpacing: -0.8,
  },
  payBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  payBadgeText: {
    fontSize: 12,
  },

  // Rating Row
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  ratingLabel: {
    fontSize: 12,
    color: C.slateLight,
  },

  // Expand
  expandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingTop: 4,
  },
  expandHint: {
    fontSize: 12,
    color: C.slateLight,
  },

  // Expanded Section
  expandedSection: {
    borderTopWidth: 1,
    borderTopColor: C.borderLight,
    padding: 16,
    backgroundColor: "#FAFBFE",
  },
  expandSectionTitle: {
    fontSize: 13,
    color: C.navy,
    marginBottom: 14,
  },

  // Timeline
  timelineBlock: {
    marginBottom: 16,
  },
  timelineStep: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 0,
  },
  timelineLeft: {
    alignItems: "center",
    width: 24,
    marginRight: 12,
  },
  timelineDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  timelinePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.blue,
  },
  timelineLine: {
    width: 2,
    height: 28,
    borderRadius: 1,
    marginTop: 2,
  },
  timelineLabel: {
    fontSize: 13,
    paddingTop: 2,
    paddingBottom: 20,
  },

  // Cancelled
  cancelledBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  cancelledText: {
    flex: 1,
    fontSize: 12,
    color: "#991B1B",
    lineHeight: 18,
  },

  // Review Prompt
  reviewPrompt: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFBEB",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  reviewPromptLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  reviewPromptTitle: {
    fontSize: 13,
    color: C.navy,
  },
  reviewPromptSub: {
    fontSize: 11,
    color: C.slateLight,
    marginTop: 1,
  },
  reviewBtn: {
    backgroundColor: C.amber,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  reviewBtnText: {
    fontSize: 12,
    color: "#FFF",
  },

  // Actions
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 11,
    backgroundColor: C.surface,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  actionBtnPrimary: {
    backgroundColor: C.navy,
    borderColor: C.navy,
  },
  actionBtnGhost: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  actionBtnText: {
    fontSize: 12,
    color: C.navy,
  },

  // Empty State
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    paddingHorizontal: 40,
    gap: 10,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: C.border,
    marginBottom: 6,
  },
  emptyTitle: {
    fontSize: 20,
    color: C.navy,
    textAlign: "center",
  },
  emptySub: {
    fontSize: 14,
    color: C.slateLight,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.navy,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 13,
    marginTop: 8,
  },
  emptyBtnText: {
    fontSize: 14,
    color: "#FFF",
  },
});