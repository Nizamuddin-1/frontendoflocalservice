// ─────────────────────────────────────────────────────────────────────────────
//  Profile feature — shared StyleSheet
//  Lifted verbatim from 5_profileScreen.tsx (token refs resolve through ./tokens,
//  reproducing screen 5's exact palette). Shared by every profile component and
//  the screen itself.
// ─────────────────────────────────────────────────────────────────────────────

import { StyleSheet, Platform, Dimensions } from 'react-native';
import { C } from './tokens';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },

  scrollContent: {
    backgroundColor: C.bg,
  },

  // Floating Nav
  floatingNav: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 54 : 34,
    paddingBottom: 12,
    paddingHorizontal: 18,
  },
  floatingNavBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",          // matches white hero on scroll
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(10,22,40,0.07)", // subtle dark tint on white
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    fontSize: 18,
    color: C.navy,                        // dark text on white nav
    letterSpacing: -0.3,
  },

  // ── Hero — white background ───────────────────────────────────────────────
  hero: {
    backgroundColor: "#FFFFFF",           // ← changed to white
    paddingTop: Platform.OS === "ios" ? 110 : 90,
    paddingBottom: 32,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,     // subtle separator from bg
  },
  // Decorative circles — muted tints that work on white
  heroCircle1: {
    position: "absolute",
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: "rgba(37,99,235,0.05)",
    top: -100,
    right: -100,
  },
  heroCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(10,22,40,0.03)",
    bottom: -60,
    left: -60,
  },
  heroCircle3: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(212,168,83,0.06)",
    top: 60,
    left: 30,
  },
  heroGridLine1: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "rgba(10,22,40,0.04)",
    left: width * 0.33,
  },
  heroGridLine2: {
    position: "absolute",
    width: 1,
    height: "100%",
    backgroundColor: "rgba(10,22,40,0.04)",
    left: width * 0.66,
  },
  heroContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },

  // Avatar
  heroAvatarWrap: {
    width: 96,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarRingOuter: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1.5,
    borderColor: "rgba(212,168,83,0.35)",
  },
  avatarRingInner: {
    position: "absolute",
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 2,
    borderColor: "rgba(212,168,83,0.6)",
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.8)",
    shadowColor: C.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  avatarInitials: {
    fontSize: 26,
    color: "#FFF",
    letterSpacing: -0.5,
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",              // white border to stand out on white bg
  },
  tierBadge: {
    position: "absolute",
    top: -4,
    right: -2,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.gold,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 3,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",             // white border instead of dark
  },
  tierBadgeText: {
    fontSize: 8,
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },

  // Hero text — dark since bg is now white
  heroName: {
    fontSize: 26,
    color: C.navy,                       // ← dark
    letterSpacing: -0.6,
    marginBottom: 6,
    textAlign: "center",
  },
  heroMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 3,
  },
  heroMeta: {
    fontSize: 13,
    color: C.slate,                      // ← readable dark grey
  },
  heroChipsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    marginBottom: 18,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  heroChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    borderWidth: 1,
  },
  heroChipText: {
    fontSize: 11,
  },
  heroEditBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.navy,             // ← inverted: dark button on white hero
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 11,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 6,
  },
  heroEditBtnText: {
    fontSize: 14,
    color: "#FFFFFF",                    // ← white text on dark button
  },

  // Stats
  statsSection: {
    backgroundColor: "#FFFFFF",          // ← matches white hero seamlessly
    paddingBottom: 0,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: C.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 22,
    paddingHorizontal: 16,
    paddingBottom: 4,
    gap: 10,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: C.surface,
    borderRadius: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: C.borderLight,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 17,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: C.slateLight,
  },

  // Loyalty
  section: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  sectionLabel: {
    fontSize: 13,
    color: C.slate,
    marginBottom: 10,
    letterSpacing: 0.1,
  },
  loyaltyCard: {
    backgroundColor: C.navy,
    borderRadius: 20,
    padding: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(212,168,83,0.2)",
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 6,
  },
  loyaltyCircle: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(37,99,235,0.08)",
    right: -60,
    top: -60,
  },
  loyaltyTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  loyaltyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  loyaltyIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "rgba(212,168,83,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(212,168,83,0.25)",
  },
  loyaltyTitle: {
    fontSize: 15,
    color: "#FFF",
    letterSpacing: -0.2,
  },
  loyaltySub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.45)",
    marginTop: 2,
  },
  loyaltyPoints: {
    fontSize: 28,
    color: C.goldLight,
    letterSpacing: -1,
  },
  loyaltyBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.1)",
    overflow: "visible",
    marginBottom: 8,
  },
  loyaltyBarFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: C.gold,
  },
  loyaltyMilestone: {
    position: "absolute",
    top: -3,
    alignItems: "center",
  },
  loyaltyMilestoneDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: C.goldLight,
    borderWidth: 2,
    borderColor: C.navy,
  },
  loyaltyMilestoneLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.4)",
    marginTop: 3,
  },
  loyaltyBarLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  loyaltyBarLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.35)",
  },
  loyaltyBarLabelMid: {
    fontSize: 12,
    color: C.goldLight,
  },

  // Contact Info Card
  infoCard: {
    backgroundColor: C.surface,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.borderLight,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  infoIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  infoTextBlock: { flex: 1 },
  infoLabel: {
    fontSize: 11,
    color: C.slateLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: C.navy,
  },
  infoCopyBtn: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  infoDivider: {
    height: 1,
    backgroundColor: C.borderLight,
    marginLeft: 66,
  },

  // Menu
  menuSection: {
    marginBottom: 6,
  },
  menuSectionTitle: {
    fontSize: 12,
    color: C.slateLight,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },
  menuCard: {
    backgroundColor: C.surface,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.borderLight,
    shadowColor: C.navy,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 14,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 13,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  menuTextBlock: { flex: 1 },
  menuLabel: {
    fontSize: 14,
    color: C.navy,
    letterSpacing: -0.1,
  },
  menuSublabel: {
    fontSize: 12,
    color: C.slateLight,
    marginTop: 2,
  },
  menuBadge: {
    minWidth: 26,
    height: 22,
    borderRadius: 8,
    backgroundColor: C.blueLight,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 7,
  },
  menuBadgeText: {
    fontSize: 11,
    color: C.blue,
  },
  menuDivider: {
    height: 1,
    backgroundColor: C.borderLight,
    marginLeft: 69,
  },

  // App Version
  appVersionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
    marginTop: 8,
  },
  appVersionIconWrap: {
    opacity: 0.5,
  },
  appVersionText: {
    fontSize: 11,
    color: C.slateLight,
  },

  // Edit Profile Modal
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.52)",
    justifyContent: "flex-end",
    zIndex: 200,
  },
  modalSheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: Platform.OS === "ios" ? 44 : 28,
    maxHeight: "90%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.border,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    color: C.navy,
    letterSpacing: -0.4,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: C.bg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  modalAvatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 22,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: C.borderLight,
  },
  modalAvatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: C.blue,
    alignItems: "center",
    justifyContent: "center",
  },
  modalAvatarText: {
    fontSize: 22,
    color: "#FFF",
    letterSpacing: -0.5,
  },
  modalAvatarEditBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: C.blueLight,
    borderWidth: 1,
    borderColor: C.border,
  },
  modalAvatarEditText: {
    fontSize: 13,
    color: C.blue,
  },
  modalField: {
    marginBottom: 14,
  },
  modalFieldLabel: {
    fontSize: 12,
    color: C.slateLight,
    marginBottom: 7,
    letterSpacing: 0.2,
  },
  modalFieldInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.bg,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  modalInput: {
    flex: 1,
    fontSize: 14,
    color: C.navy,
  },
  modalSaveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: C.navy,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
  },
  modalSaveBtnText: {
    fontSize: 15,
    color: "#FFF",
  },
});
