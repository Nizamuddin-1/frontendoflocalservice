 
import React, { useRef, ReactNode } from 'react';
import {
  View, Text, TouchableOpacity, Animated,
  StyleSheet, ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import {
  Colors, FontSize, FontWeight, Spacing,
  Radii, Shadows, ChipColors,
} from '../theme';
import type {
  StatCardProps, StatusChipProps, SectionHeaderProps,
  InfoRowProps, MapPreviewProps, PressableScaleProps,
  BookingStatus,
} from '../types';

// ── Pressable scale ───────────────────────────
export const PressableScale: React.FC<PressableScaleProps> = ({
  children, onPress, style, activeScale = 0.97,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const onIn  = () => Animated.spring(scale, { toValue: activeScale, useNativeDriver: true, speed: 40 }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1,           useNativeDriver: true, speed: 20 }).start();
  return (
    <TouchableOpacity onPress={onPress} onPressIn={onIn} onPressOut={onOut} activeOpacity={1}>
      <Animated.View style={[style as ViewStyle, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

// ── Stat Card ─────────────────────────────────
export const StatCard: React.FC<StatCardProps> = ({ value, label, valueColor }) => (
  <View style={sC.statCard}>
    <Text style={[sC.statValue, valueColor ? { color: valueColor } : {}]}>{value}</Text>
    <Text style={sC.statLabel}>{label}</Text>
  </View>
);
const sC = StyleSheet.create({
  statCard:  {
    flex: 1, backgroundColor: Colors.surface,
    borderRadius: Radii.lg, padding: 14,
    alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  statValue: { fontSize: 20, fontWeight: FontWeight.bold, color: Colors.ink, letterSpacing: -0.5 },
  statLabel: { fontSize: FontSize.xs, fontWeight: FontWeight.semibold, color: Colors.ink4, marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.5 },
});

// ── Status Chip ───────────────────────────────
export const StatusChip: React.FC<StatusChipProps> = ({ type, label }) => {
  const cs = ChipColors[type as BookingStatus] ?? ChipColors.new;
  const display = label.charAt(0).toUpperCase() + label.slice(1);
  return (
    <View style={[ch.chip, { backgroundColor: cs.bg }]}>
      <Text style={[ch.text, { color: cs.text }]}>{display}</Text>
    </View>
  );
};
const ch = StyleSheet.create({
  chip: { paddingVertical: 3, paddingHorizontal: 9, borderRadius: 6 },
  text: { fontSize: FontSize.xs, fontWeight: FontWeight.bold, letterSpacing: 0.3 },
});

// ── Section Header ────────────────────────────
export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, linkText, onLink }) => (
  <View style={sh.row}>
    <Text style={sh.title}>{title}</Text>
    {linkText && (
      <TouchableOpacity onPress={onLink} style={sh.link}>
        <Text style={sh.linkTxt}>{linkText}</Text>
        <Feather name="chevron-right" size={14} color={Colors.accent} />
      </TouchableOpacity>
    )}
  </View>
);
const sh = StyleSheet.create({
  row:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.lg, paddingTop: 22, paddingBottom: 12 },
  title:   { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.ink },
  link:    { flexDirection: 'row', alignItems: 'center', gap: 2 },
  linkTxt: { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.accent },
});

// ── Section Label ─────────────────────────────
export const SectionLabel: React.FC<{ children: ReactNode }> = ({ children }) => (
  <Text style={{ fontSize: FontSize.xs, fontWeight: FontWeight.bold, color: Colors.ink4, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>
    {children}
  </Text>
);

// ── Divider ───────────────────────────────────
export const Divider: React.FC<{ marginLeft?: number }> = ({ marginLeft = 0 }) => (
  <View style={{ height: 1, backgroundColor: Colors.border, marginLeft }} />
);

// ── Info Row ──────────────────────────────────
export const InfoRow: React.FC<InfoRowProps> = ({
  iconBg, iconChar, title, subtitle, badge, badgeColor, showArrow = true, onPress,
}) => (
  <TouchableOpacity style={ir.row} onPress={onPress} activeOpacity={0.65}>
    <View style={[ir.icon, { backgroundColor: iconBg }]}>
      <Text style={ir.iconChar}>{iconChar}</Text>
    </View>
    <View style={ir.body}>
      <Text style={ir.title}>{title}</Text>
      {subtitle && <Text style={ir.sub}>{subtitle}</Text>}
    </View>
    {badge && <Text style={[ir.badge, badgeColor ? { color: badgeColor } : {}]}>{badge}</Text>}
    {showArrow && <Feather name="chevron-right" size={16} color={Colors.ink4} />}
  </TouchableOpacity>
);
const ir = StyleSheet.create({
  row:      { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.lg, paddingVertical: 13 },
  icon:     { width: 38, height: 38, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
  iconChar: { fontSize: 17 },
  body:     { flex: 1 },
  title:    { fontSize: FontSize.md, fontWeight: FontWeight.semibold, color: Colors.ink },
  sub:      { fontSize: FontSize.sm, color: Colors.ink3, marginTop: 1 },
  badge:    { fontSize: FontSize.sm, fontWeight: FontWeight.semibold, color: Colors.ink3, marginRight: 4 },
});

// ── Map Preview ───────────────────────────────
export const MapPreview: React.FC<MapPreviewProps> = ({ address, distance }) => (
  <View style={mp.card}>
    <View style={mp.visual}>
      <View style={[mp.road, { top: '35%', left: 0, right: 0, height: 2 }]} />
      <View style={[mp.road, { top: '66%', left: 0, right: 0, height: 2 }]} />
      <View style={[mp.road, { left: '28%', top: 0, bottom: 0, width: 2 }]} />
      <View style={[mp.road, { left: '64%', top: 0, bottom: 0, width: 2 }]} />
      <View style={[mp.block, { width: 26, height: 20, top: 10, left: 36 }]} />
      <View style={[mp.block, { width: 20, height: 24, top: 10, left: 72 }]} />
      <View style={[mp.block, { width: 30, height: 14, bottom: 9, left: 38 }]} />
      <View style={[mp.block, { width: 22, height: 18, top: 8, right: 28 }]} />
      <View style={mp.pinWrap}>
        <View style={mp.pinHead}><View style={mp.pinInner} /></View>
        <View style={mp.pinTail} />
      </View>
    </View>
    <View style={mp.footer}>
      <Feather name="map-pin" size={13} color={Colors.accent} />
      <Text style={mp.address}>{address}</Text>
      <View style={mp.distBadge}>
        <Feather name="navigation" size={11} color={Colors.emerald3} />
        <Text style={mp.distance}>{distance}</Text>
      </View>
    </View>
  </View>
);
const mp = StyleSheet.create({
  card:     { backgroundColor: Colors.card, borderRadius: Radii.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  visual:   { height: 88, backgroundColor: '#EEF2F7', position: 'relative', overflow: 'hidden' },
  road:     { position: 'absolute', backgroundColor: 'rgba(255,255,255,0.9)' },
  block:    { position: 'absolute', backgroundColor: '#D5DCE8', borderRadius: 4 },
  pinWrap:  { position: 'absolute', left: '48%', top: '24%' },
  pinHead:  { width: 20, height: 20, backgroundColor: Colors.rose, borderRadius: 10, borderBottomRightRadius: 0, transform: [{ rotate: '-45deg' }], justifyContent: 'center', alignItems: 'center' },
  pinInner: { width: 8, height: 8, backgroundColor: '#fff', borderRadius: 4, transform: [{ rotate: '45deg' }] },
  pinTail:  { width: 2, height: 9, backgroundColor: Colors.rose, alignSelf: 'center' },
  footer:   { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 12 },
  address:  { fontSize: 12, fontWeight: FontWeight.semibold, color: Colors.ink, flex: 1 },
  distBadge:{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.emerald2, borderRadius: 6, paddingVertical: 3, paddingHorizontal: 8 },
  distance: { fontSize: 11, fontWeight: FontWeight.bold, color: Colors.emerald3 },
});

// ── Page Header ───────────────────────────────
interface PageHeaderProps {
  title: string; subtitle?: string;
  onBack?: () => void; rightElement?: ReactNode;
}
export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, onBack, rightElement }) => (
  <View style={ph.wrap}>
    {onBack && (
      <TouchableOpacity style={ph.back} onPress={onBack}>
        <Feather name="arrow-left" size={18} color={Colors.ink} />
      </TouchableOpacity>
    )}
    <View style={{ flex: 1 }}>
      <Text style={ph.title}>{title}</Text>
      {subtitle && <Text style={ph.sub}>{subtitle}</Text>}
    </View>
    {rightElement}
  </View>
);
const ph = StyleSheet.create({
  wrap:  { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: Spacing.lg, paddingVertical: 14, backgroundColor: Colors.card, borderBottomWidth: 1, borderBottomColor: Colors.border },
  back:  { width: 36, height: 36, backgroundColor: Colors.surface, borderRadius: Radii.md, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: FontSize.xl, fontWeight: FontWeight.bold, color: Colors.ink },
  sub:   { fontSize: FontSize.sm, color: Colors.ink3, marginTop: 1 },
});

// ── Customer Banner ───────────────────────────
interface CustBannerProps {
  initials: string; name: string;
  rating: number; bookings: number;
  onCallPress?: () => void;
}
export const CustomerBanner: React.FC<CustBannerProps> = ({
  initials, name, rating, bookings, onCallPress,
}) => (
  <View style={cb.card}>
    <View style={cb.avatar}><Text style={cb.avatarTxt}>{initials}</Text></View>
    <View style={{ flex: 1 }}>
      <Text style={cb.name}>{name}</Text>
      <View style={cb.meta}>
        <Feather name="star" size={12} color={Colors.star} />
        <Text style={cb.metaTxt}>{rating}  ·  {bookings} bookings</Text>
      </View>
    </View>
    <TouchableOpacity style={cb.callBtn} onPress={onCallPress}>
      <Feather name="phone" size={16} color={Colors.emerald3} />
    </TouchableOpacity>
  </View>
);
const cb = StyleSheet.create({
  card:     { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.surface, borderRadius: Radii.xl, padding: 14, borderWidth: 1, borderColor: Colors.border },
  avatar:   { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.accent, justifyContent: 'center', alignItems: 'center' },
  avatarTxt:{ fontSize: 17, fontWeight: FontWeight.bold, color: Colors.white },
  name:     { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.ink },
  meta:     { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  metaTxt:  { fontSize: FontSize.sm, color: Colors.ink3 },
  callBtn:  { width: 40, height: 40, backgroundColor: Colors.emerald2, borderRadius: Radii.md, justifyContent: 'center', alignItems: 'center' },
});

// ── Buttons ───────────────────────────────────
interface BtnProps { label: string; onPress?: () => void; style?: ViewStyle; icon?: ReactNode; disabled?: boolean }

export const PrimaryButton: React.FC<BtnProps> = ({ label, onPress, style, icon, disabled }) => (
  <TouchableOpacity style={[btn.primary, style, disabled && btn.disabled]} onPress={onPress} activeOpacity={0.85} disabled={disabled}>
    {icon}
    <Text style={btn.primaryTxt}>{label}</Text>
  </TouchableOpacity>
);
export const DangerButton: React.FC<BtnProps> = ({ label, onPress, style }) => (
  <TouchableOpacity style={[btn.danger, style]} onPress={onPress} activeOpacity={0.85}>
    <Text style={btn.dangerTxt}>{label}</Text>
  </TouchableOpacity>
);
export const SuccessButton: React.FC<BtnProps> = ({ label, onPress, style, icon }) => (
  <TouchableOpacity style={[btn.success, style]} onPress={onPress} activeOpacity={0.85}>
    {icon}
    <Text style={btn.successTxt}>{label}</Text>
  </TouchableOpacity>
);
const btn = StyleSheet.create({
  primary:    { height: 52, backgroundColor: Colors.accent,   borderRadius: Radii.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryTxt: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.white },
  danger:     { height: 52, backgroundColor: Colors.rose2,    borderRadius: Radii.lg, alignItems: 'center', justifyContent: 'center' },
  dangerTxt:  { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.rose3 },
  success:    { height: 52, backgroundColor: Colors.emerald,  borderRadius: Radii.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  successTxt: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.white },
  disabled:   { opacity: 0.5 },
});
