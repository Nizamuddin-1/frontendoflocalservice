// ─────────────────────────────────────────────
//  ServeNow Provider — Design Tokens (TypeScript)
// ─────────────────────────────────────────────

import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

export type StyleValue = ViewStyle | TextStyle | ImageStyle;

// ── Colors ────────────────────────────────────

export const Colors = {
  ink:      '#0B0F1A',
  ink2:     '#3D4358',
  ink3:     '#7B82A0',
  ink4:     '#B4B9CE',
  surface:  '#F5F6FA',
  card:     '#FFFFFF',
  border:   'rgba(11,15,26,0.07)',
  border2:  'rgba(11,15,26,0.13)',

  accent:   '#2A5BFF',
  accent2:  '#EEF2FF',
  accent3:  '#1A3FCC',

  emerald:  '#0EA871',
  emerald2: '#E5F9F1',
  emerald3: '#0B7A52',

  amber:    '#E8920A',
  amber2:   '#FEF4E2',
  amber3:   '#A0640A',

  rose:     '#E53E5C',
  rose2:    '#FDE8EC',
  rose3:    '#A0243E',

  purple2:  '#EEEDFE',
  purple3:  '#3C3489',

  star:     '#FFB800',
  white:    '#FFFFFF',
  black:    '#000000',
} as const;

export type ColorKey = keyof typeof Colors;

// ── Typography ────────────────────────────────

export const FontSize = {
  xs:   10,
  sm:   11,
  base: 13,
  md:   14,
  lg:   15,
  xl:   16,
  '2xl': 18,
  '3xl': 20,
  '4xl': 22,
  '5xl': 28,
} as const;

export const FontWeight = {
  regular:  '400' as const,
  medium:   '500' as const,
  semibold: '600' as const,
  bold:     '700' as const,
};

// ── Spacing ───────────────────────────────────

export const Spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  '2xl': 24,
  '3xl': 32,
} as const;

// ── Border Radii ──────────────────────────────

export const Radii = {
  sm:   8,
  md:   11,
  lg:   14,
  xl:   16,
  '2xl': 18,
  '3xl': 20,
  full: 100,
} as const;

// ── Shadows ───────────────────────────────────

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

// ── Status Chip Color Map ─────────────────────

import type { BookingStatus } from '../types';

export const ChipColors: Record<BookingStatus, { bg: string; text: string }> = {
  new:       { bg: Colors.accent2,  text: Colors.accent3  },
  active:    { bg: Colors.amber2,   text: Colors.amber3   },
  pending:   { bg: Colors.purple2,  text: Colors.purple3  },
  done:      { bg: Colors.surface,  text: Colors.ink4     },
  cancelled: { bg: Colors.rose2,    text: Colors.rose3    },
};
