// ─── Badge ────────────────────────────────────────────────────────────────────
// Extracted from 2_servicesScreen.tsx. BADGE_META (presentation config) was a
// screen-local const; it lives here with the component that uses it.
import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { C, F } from './tokens';
import { styles } from './services.styles';
import type { BadgeType } from '@/src/types';

const BADGE_META: Record<BadgeType, { color: string; bg: string; icon: string }> = {
  "EDITOR PICK": { color: C.gold,   bg: C.goldLight,  icon: "bookmark" },
  "MOST BOOKED": { color: C.terra,  bg: C.terraLight, icon: "flame"    },
  "FLASH DEAL":  { color: C.cobalt, bg: C.cobaltBg,   icon: "flash"    },
  "NEW LAUNCH":  { color: C.plum,   bg: C.plumBg,     icon: "sparkles" },
  "PREMIUM":     { color: C.gold,   bg: C.goldLight,  icon: "star"     },
};

export interface BadgeProps {
  type?: BadgeType;
}

export const Badge: React.FC<BadgeProps> = ({ type }) => {
  if (!type) return null;
  const m = BADGE_META[type];
  return (
    <View style={[styles.badge, { backgroundColor: m.bg, borderColor: m.color + "30" }]}>
      <Ionicons name={m.icon as any} size={8} color={m.color} style={{ marginRight: 3 }} />
      <Text style={[styles.badgeText, { fontFamily: F.bodyBold, color: m.color }]}>{type}</Text>
    </View>
  );
};

export default Badge;
