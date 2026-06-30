// ─────────────────────────────────────────────────────────────────────────────
//  Services feature — shared StyleSheet
//  Lifted verbatim from 2_servicesScreen.tsx (token refs now resolve through
//  ./tokens, which reproduces screen 2's exact palette). Shared by every
//  services component and the screen itself.
// ─────────────────────────────────────────────────────────────────────────────

import { StyleSheet, Platform, Dimensions } from 'react-native';
import { C } from './tokens';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.canvas },

  // ── Header ──
  header: {
    backgroundColor: C.surface,
    paddingTop: Platform.OS === "ios" ? 54 : 34,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    zIndex: 10,
  },
  headerRow1: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 18,
    marginBottom: 12,
  },
  headerEyebrow: { fontSize: 10, color: C.terra, letterSpacing: 1.8, marginBottom: 2 },
  headerTitle:   { fontSize: 32, color: C.ink, letterSpacing: -0.8 },
  headerRight:   { flexDirection: "row", alignItems: "center", gap: 8, paddingBottom: 4 },
  headerIconBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: C.canvas, alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: C.ruleLight,
  },
  notifBadge: {
    position: "absolute", top: 8, right: 8,
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: C.terra, borderWidth: 1.5, borderColor: C.surface,
  },
  avatarBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: C.ink, alignItems: "center", justifyContent: "center" },
  avatarBtnText: { fontSize: 13, color: "#FFF", letterSpacing: -0.3 },

  // Location
  locationBar: {
    flexDirection: "row", alignItems: "center",
    marginHorizontal: 18, marginBottom: 12,
    backgroundColor: C.canvas, borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 9,
    borderWidth: 1, borderColor: C.rule,
  },
  locationIconWrap: { marginRight: 6 },
  locationText: { fontSize: 13, color: C.inkMid },
  locationSub:  { fontSize: 12, color: C.inkFaint },

  // ── IMPROVED Search bar ──
  searchRow: { flexDirection: "row", gap: 10, paddingHorizontal: 18, marginBottom: 12 },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
    backgroundColor: "#FFFFFF",           // pure white background
    borderRadius: 16,
    paddingRight: 12,
    paddingVertical: 0,
    borderWidth: 1.5,
    borderColor: C.ruleLight,
    // subtle elevation
    shadowColor: C.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  searchBarFocused: {
    borderColor: C.terra,
    shadowOpacity: 0.10,
  },
  searchIconWrap: {
    width: 46,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: C.ruleLight,
    marginRight: 10,
    borderRadius: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: C.ink,
    paddingVertical: 13,
  },
  searchClearBtn: {
    marginLeft: 6,
    padding: 2,
  },
  filterBtn: {
    width: 48, height: 48,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: C.ruleLight,
    shadowColor: C.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  filterDot: {
    position: "absolute", top: 9, right: 9,
    width: 7, height: 7, borderRadius: 3.5,
    backgroundColor: C.terra, borderWidth: 1.5, borderColor: "#FFFFFF",
  },

  // Category pills
  catsRow: { paddingHorizontal: 18, paddingBottom: 14, paddingTop: 2, gap: 8 },
  catPill: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingLeft: 7, paddingRight: 12, paddingVertical: 7,
    borderRadius: 50, backgroundColor: C.surface,
    borderWidth: 1.5, marginRight: 4,
  },
  catPillIcon:  { width: 26, height: 26, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  catPillLabel: { fontSize: 13 },
  catPillCount: { fontSize: 11, color: C.inkFaint, marginLeft: 2 },

  // Trust Strip
  trustStrip: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: C.surface,
    marginHorizontal: 16, marginTop: 14, marginBottom: 4,
    borderRadius: 18, paddingVertical: 12, paddingHorizontal: 8,
    borderWidth: 1, borderColor: C.ruleLight,
    shadowColor: C.ink, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
  },
  trustItem:     { flex: 1, flexDirection: "row", alignItems: "center", gap: 5, overflow: "hidden" },
  trustIconWrap: { width: 28, height: 28, borderRadius: 9, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  trustTextWrap: { flex: 1, minWidth: 0 },
  trustValue:    { fontSize: 13, letterSpacing: -0.3 },
  trustLabel:    { fontSize: 9, color: C.inkFaint, marginTop: 1 },
  trustDivider:  { width: 1, height: 28, backgroundColor: C.ruleLight, marginHorizontal: 3, flexShrink: 0 },

  // Results bar
  resultsBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
  resultsText:    { fontSize: 20, color: C.ink, letterSpacing: -0.4 },
  resultsTextSub: { fontSize: 14, color: C.inkFaint },
  sortChip: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 50, backgroundColor: C.surface,
    borderWidth: 1.5, borderColor: C.rule,
  },
  sortChipActive: { backgroundColor: C.ink, borderColor: C.ink },
  sortChipText:   { fontSize: 12, color: C.inkLight },
  scrollContent:  { paddingTop: 0, paddingBottom: 20 },

  // ── Service Card ──
  card: {
    marginHorizontal: 16, marginBottom: 16,
    backgroundColor: C.surface,
    borderRadius: 22, flexDirection: "row",
    overflow: "hidden",
    shadowColor: C.ink, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 16, elevation: 5,
    borderWidth: 1, borderColor: C.ruleLight,
  },

  // Left accent strip
  cardAccentStrip: {
    width: 72,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 7,
    overflow: "hidden",
  },
  cardStripGhost: { position: "absolute", bottom: -10, left: -14 },
  cardStripLabel: { transform: [{ rotate: "-90deg" }], width: 80 },
  cardStripLabelText: {
    fontSize: 8, color: "rgba(255,255,255,0.60)",
    letterSpacing: 1.2, textAlign: "center",
  },
  // ── NEW: white icon box on the accent strip ──
  cardStripIconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.20,
    shadowRadius: 6,
    elevation: 6,
  },
  cardStripJobsBadge: {
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.20)",
    borderRadius: 10,
    paddingHorizontal: 6, paddingVertical: 5,
    width: "100%",
  },
  cardStripJobsNum: { fontSize: 13, color: "#FFF", letterSpacing: -0.3 },
  cardStripJobsSub: { fontSize: 8, color: "rgba(255,255,255,0.6)" },

  // Card content
  cardContent:   { flex: 1, padding: 14 },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  badge: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 7, borderWidth: 1 },
  badgeText: { fontSize: 8, letterSpacing: 0.6 },
  wishlistBtn: {
    width: 32, height: 32, borderRadius: 9,
    backgroundColor: C.canvas, alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: C.rule,
  },
  providerChip:       { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 7 },
  providerInitialsBox:{ width: 26, height: 26, borderRadius: 8, borderWidth: 1.5, alignItems: "center", justifyContent: "center" },
  providerInitialsText:{ fontSize: 10, letterSpacing: -0.3 },
  providerName: { fontSize: 12, color: C.inkLight, flex: 1 },
  serviceName:  { fontSize: 16, color: C.ink, letterSpacing: -0.4, lineHeight: 22, marginBottom: 5 },
  serviceDesc:  { fontSize: 12, color: C.inkLight, lineHeight: 17, marginBottom: 9 },
  metaRow:      { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 9 },
  metaRatingNum:   { fontSize: 12, color: C.ink },
  metaRatingCount: { fontSize: 11, color: C.inkFaint },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: C.inkFaint },
  metaETA: { fontSize: 11, color: C.inkLight },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginBottom: 10 },
  tagPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 50, backgroundColor: C.tag },
  tagText: { fontSize: 10, color: C.inkLight },
  discPill: { flexDirection: "row", alignItems: "center", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 50, backgroundColor: C.sageBg, borderWidth: 1, borderColor: "#A7F3D0" },
  discText: { fontSize: 10, color: C.sage },
  cardRule:  { height: 1, backgroundColor: C.ruleLight, marginBottom: 10 },
  cardFooter:{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  priceOriginal: { fontSize: 10, color: C.inkFaint, textDecorationLine: "line-through" },
  priceValue:    { fontSize: 19, color: C.ink, letterSpacing: -0.6 },
  priceUnit:     { fontSize: 10, color: C.inkFaint },
  ctaGroup: { flexDirection: "row", alignItems: "center", gap: 7 },
  detailBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.canvas, borderWidth: 1, borderColor: C.rule, alignItems: "center", justifyContent: "center" },
  bookBtn:   { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12 },
  bookBtnText:{ fontSize: 13, color: "#FFF" },

  // Empty state
  emptyWrap: { alignItems: "center", paddingTop: 56, paddingHorizontal: 40, gap: 10 },
  emptyIconBox: { width: 84, height: 84, borderRadius: 24, backgroundColor: C.surface, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: C.rule, marginBottom: 6 },
  emptyTitle:    { fontSize: 22, color: C.ink, letterSpacing: -0.4 },
  emptyBody:     { fontSize: 14, color: C.inkFaint, textAlign: "center", lineHeight: 20 },
  emptyReset:    { flexDirection: "row", alignItems: "center", paddingHorizontal: 18, paddingVertical: 11, borderRadius: 13, backgroundColor: C.terraLight, borderWidth: 1.5, borderColor: C.terra + "44", marginTop: 6 },
  emptyResetText:{ fontSize: 13, color: C.terra },

  // ── Book Now / Variation Sheet ──
  sheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,15,20,0.55)",
    zIndex: 200,
  },
  bookSheet: {
    position: "absolute",
    bottom: 0, left: 0, right: 0,
    backgroundColor: C.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 44 : 28,
    maxHeight: height * 0.88,
    zIndex: 201,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 24,
  },
  sheetHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: C.rule, alignSelf: "center", marginTop: 14, marginBottom: 18 },

  bookSheetHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 18, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: C.ruleLight },
  bookSheetHeaderIcon: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  bookSheetTitle:    { fontSize: 16, color: C.ink, letterSpacing: -0.3 },
  bookSheetProvider: { fontSize: 12, color: C.inkLight, marginTop: 1 },
  bookSheetCloseBtn: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.canvas, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: C.rule },

  bookSheetSectionLabel: { fontSize: 11, color: C.inkLight, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 },

  varScroll: { maxHeight: height * 0.46 },

  varCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: C.canvas,
    borderRadius: 16,
    padding: 13,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: C.ruleLight,
  },

  varRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  varRadioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#FFF" },

  varIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", flexShrink: 0 },

  varLabel:  { fontSize: 14, color: C.ink, letterSpacing: -0.2 },
  varDesc:   { fontSize: 11, color: C.inkLight, lineHeight: 15, marginTop: 2 },
  varDuration:{ fontSize: 10, color: C.inkFaint },

  varPopularBadge: { borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2 },
  varPopularText:  { fontSize: 8, color: "#FFF", letterSpacing: 0.5 },

  varPriceBlock:    { alignItems: "flex-end", flexShrink: 0, minWidth: 56 },
  varOriginalPrice: { fontSize: 10, color: C.inkFaint, textDecorationLine: "line-through" },
  varPrice:         { fontSize: 16, color: C.ink, letterSpacing: -0.4 },
  varDiscBadge:     { borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2, marginTop: 2 },
  varDiscText:      { fontSize: 9, color: C.sage },

  bookSheetIncludesRow: { flexDirection: "row", alignItems: "center", backgroundColor: C.sageBg, borderRadius: 10, padding: 10, marginTop: 4, marginBottom: 14 },
  bookSheetIncludesText:{ fontSize: 11, color: C.sage, flex: 1 },

  bookSheetFooter: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingTop: 14, borderTopWidth: 1, borderTopColor: C.ruleLight,
  },
  bookSheetFooterLabel: { fontSize: 11, color: C.inkLight, marginBottom: 3 },
  bookSheetFooterPrice: { fontSize: 26, color: C.ink, letterSpacing: -0.8 },
  bookSheetFooterDisc:  { fontSize: 12, color: C.sage },
  bookSheetCTA: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 22, paddingVertical: 14,
    borderRadius: 16,
  },
  bookSheetCTAText: { fontSize: 14, color: "#FFF" },

  // ── Filter Sheet ──
  filterSheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingBottom: Platform.OS === "ios" ? 44 : 28,
    maxHeight: "84%",
  },
  sheetHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 22 },
  sheetTitle:     { fontSize: 22, color: C.ink, letterSpacing: -0.4 },
  sheetResetBtn:  { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 7, borderRadius: 10, backgroundColor: C.terraLight, borderWidth: 1, borderColor: C.terra + "33" },
  sheetResetText: { fontSize: 12, color: C.terra },
  sheetCloseBtn:  { width: 34, height: 34, borderRadius: 10, backgroundColor: C.canvas, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: C.rule },
  sheetSectionLabel: { fontSize: 11, color: C.inkLight, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12 },
  sheetSortRow:   { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24 },
  sheetSortChip:  { flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, backgroundColor: C.canvas, borderWidth: 1.5, borderColor: C.rule },
  sheetSortChipActive: { backgroundColor: C.ink, borderColor: C.ink },
  sheetSortChipText:   { fontSize: 13, color: C.inkLight },
  sheetRatingRow: { flexDirection: "row", gap: 8, marginBottom: 24, flexWrap: "wrap" },
  sheetRatingChip:{ flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, backgroundColor: C.canvas, borderWidth: 1.5, borderColor: C.rule },
  sheetRatingChipActive: { backgroundColor: C.ink, borderColor: C.ink },
  sheetRatingChipText:   { fontSize: 13, color: C.inkLight },
  sheetPriceRow:  { flexDirection: "row", gap: 8, marginBottom: 24, flexWrap: "wrap" },
  sheetPriceChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12, backgroundColor: C.canvas, borderWidth: 1.5, borderColor: C.rule },
  sheetPriceChipActive: { backgroundColor: C.terra, borderColor: C.terra },
  sheetPriceChipText:   { fontSize: 13, color: C.inkLight },
  sheetToggleRow: { flexDirection: "row", alignItems: "center", backgroundColor: C.canvas, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: C.ruleLight },
  sheetToggleIcon:{ width: 38, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center", marginRight: 12 },
  sheetToggleText:{ flex: 1 },
  sheetToggleLabel:{ fontSize: 14, color: C.ink },
  sheetToggleSub: { fontSize: 11, color: C.inkFaint, marginTop: 2 },
  toggleTrack:    { width: 42, height: 24, borderRadius: 12, padding: 2, justifyContent: "center" },
  toggleThumb:    { width: 20, height: 20, borderRadius: 10 },
  sheetApplyBtn:  { flexDirection: "row", alignItems: "center", justifyContent: "center", backgroundColor: C.ink, borderRadius: 16, paddingVertical: 16, marginTop: 14 },
  sheetApplyText: { fontSize: 15, color: "#FFF" },
});
