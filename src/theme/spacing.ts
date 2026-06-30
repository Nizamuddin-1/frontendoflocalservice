// ─────────────────────────────────────────────────────────────────────────────
//  Spacing, Border Radii & Shadows
//  Moved from provider/src/theme. These numeric scales were the only formal
//  spacing system in the codebase (consumer screens used ad-hoc inline values),
//  so they become the app-wide standard.
// ─────────────────────────────────────────────────────────────────────────────

import type { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export type StyleValue = ViewStyle | TextStyle | ImageStyle;

// ── Spacing ──────────────────────────────────────────────────────────────────
export const Spacing = {
  xs:    4,
  sm:    8,
  md:    12,
  lg:    16,
  xl:    20,
  '2xl': 24,
  '3xl': 32,
} as const;

export type SpacingKey = keyof typeof Spacing;

// ── Border radii ─────────────────────────────────────────────────────────────
export const Radii = {
  sm:    8,
  md:    11,
  lg:    14,
  xl:    16,
  '2xl': 18,
  '3xl': 20,
  full:  100,
} as const;

export type RadiiKey = keyof typeof Radii;

// ── Shadows / Elevation ──────────────────────────────────────────────────────
export const Shadows = {
  sm: {
    shadowColor:   '#0B0F1A',
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius:  8,
    elevation:     2,
  },
  md: {
    shadowColor:   '#0B0F1A',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius:  16,
    elevation:     4,
  },
  lg: {
    shadowColor:   '#0B0F1A',
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius:  24,
    elevation:     8,
  },
} as const;

export type ShadowKey = keyof typeof Shadows;
