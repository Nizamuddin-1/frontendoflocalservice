// ─────────────────────────────────────────────────────────────────────────────
//  Bookings feature — token aliases
//  Screen 3 (3_bookingScreen.tsx) used the cool blue palette. Values match the
//  unified theme except four keys, pinned here to screen 3's exact values so the
//  extracted components render byte-identical:
//    bg          #F0F2F8  → Colors.bgCool
//    blue        #1A73E8  → Colors.blueAlt   (unified `blue` is #2563EB)
//    green       #0AB87A  → Colors.greenAlt  (unified `green` is #10B981)
//    borderLight #EEF1F8  → literal          (unified `borderLight` is #EEF2FB)
// ─────────────────────────────────────────────────────────────────────────────

import { Colors, Fonts } from '@/src/theme';

export const C = {
  ...Colors,
  bg: Colors.bgCool,
  blue: Colors.blueAlt,
  green: Colors.greenAlt,
  borderLight: '#EEF1F8',
};

export const F = Fonts;
