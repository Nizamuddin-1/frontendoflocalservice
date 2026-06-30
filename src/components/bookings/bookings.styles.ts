// ─────────────────────────────────────────────────────────────────────────────
//  Bookings feature — shared StyleSheet
//  Lifted verbatim from 3_bookingScreen.tsx (token refs resolve through ./tokens,
//  reproducing screen 3's exact palette). Shared by every bookings component and
//  the screen itself.
// ─────────────────────────────────────────────────────────────────────────────

import { StyleSheet, Platform } from 'react-native';
import { C } from './tokens';

export const styles = StyleSheet.create({
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
