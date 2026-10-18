// ─── Badge ────────────────────────────────────────────────────────────────────
// Extracted from 2_servicesScreen.tsx. BADGE_META (presentation config) was a
// screen-local const; it lives here with the component that uses it.
import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { C, F } from './tokens';
import { styles } from './services.styles';
import type { BadgeType } from '@/src/types';

interface BadgeConfig {
  color: string;
  bg: string;
  icon: string;
}

const DEFAULT_BADGE: BadgeConfig = {
  color: C.cobalt,
  bg: C.cobaltBg,
  icon: 'pricetag',
};

const BADGE_META: Record<string, BadgeConfig> = {
  'EDITOR PICK':   { color: C.gold,   bg: C.goldLight,  icon: 'bookmark' },
  "EDITOR'S PICK": { color: C.gold,   bg: C.goldLight,  icon: 'bookmark' },
  'MOST BOOKED':   { color: C.terra,  bg: C.terraLight, icon: 'flame' },
  'POPULAR':       { color: C.terra,  bg: C.terraLight, icon: 'flame' },
  'BEST SELLER':   { color: C.gold,   bg: C.goldLight,  icon: 'trophy' },
  'BESTSELLER':    { color: C.gold,   bg: C.goldLight,  icon: 'trophy' },
  'FLASH DEAL':    { color: C.cobalt, bg: C.cobaltBg,   icon: 'flash' },
  'EXPRESS':       { color: C.amber,  bg: C.amberBg,    icon: 'flash' },
  'NEW LAUNCH':    { color: C.plum,   bg: C.plumBg,     icon: 'sparkles' },
  'NEW':           { color: C.plum,   bg: C.plumBg,     icon: 'sparkles' },
  'PREMIUM':       { color: C.gold,   bg: C.goldLight,  icon: 'star' },
  'SAFETY':        { color: C.sage,   bg: C.sageBg,     icon: 'shield-checkmark' },
  'VERIFIED':      { color: C.sage,   bg: C.sageBg,     icon: 'shield-checkmark' },
  'TOP RATED':     { color: C.gold,   bg: C.goldLight,  icon: 'star' },
};

export interface BadgeProps {
  type?: BadgeType | string | null;
}

export const Badge: React.FC<BadgeProps> = ({ type }) => {
  if (!type || typeof type !== 'string' || !type.trim()) return null;

  const key = type.trim().toUpperCase();
  const m = BADGE_META[key] || DEFAULT_BADGE;

  return (
    <View style={[styles.badge, { backgroundColor: m.bg, borderColor: m.color + "30" }]}>
      <Ionicons name={m.icon as any} size={8} color={m.color} style={{ marginRight: 3 }} />
      <Text style={[styles.badgeText, { fontFamily: F.bodyBold, color: m.color }]}>
        {type.toUpperCase()}
      </Text>
    </View>
  );
};

export default Badge;
