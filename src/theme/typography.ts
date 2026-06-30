// ─────────────────────────────────────────────────────────────────────────────
//  Unified Typography
//  Phase 6: the custom fonts (Recoleta / Geist) were never present — no .ttf
//  files, no useFonts() loader — so every `fontFamily: F.xxx` silently fell back
//  to the system font at runtime. Per the Phase 6 decision, all Recoleta/Geist
//  references are removed and the aliases now map to the PLATFORM SYSTEM FONT.
//
//  Weight note: the screens express weight ONLY through `fontFamily` (they relied
//  on the font files to carry weight). A system font can't encode weight in a
//  cross-platform fontFamily string, so:
//    • Android → uses the weighted `sans-serif*` family names (preserves hierarchy)
//    • iOS / web → uses the system default family; weight should be applied via
//      the `FontWeight` tokens (see `fontWeightFor`) at call sites.
//  This keeps the app on system fonts with NO custom assets, and preserves the
//  display/body + weight intent as far as each platform allows. To restore the
//  exact original look later, add real font files + a useFonts() loader and point
//  these aliases back at the family names.
// ─────────────────────────────────────────────────────────────────────────────

import { Platform } from 'react-native';
import type { TextStyle } from 'react-native';

// Android exposes weighted system family names; iOS/web use the default family
// (undefined) and lean on fontWeight. Helps preserve the bold/medium hierarchy.
const sys = (androidFamily: string): string | undefined =>
  Platform.select({ android: androidFamily, default: undefined });

// ── Font families (now system) ───────────────────────────────────────────────
export const Fonts = {
  displayBold: sys('sans-serif'),          // headings (was Recoleta-Bold)
  displaySemi: sys('sans-serif-medium'),   // was Recoleta-SemiBold
  displayReg:  sys('sans-serif'),          // was Recoleta-Regular
  bodyReg:     sys('sans-serif'),          // was Geist-Regular
  bodyMed:     sys('sans-serif-medium'),   // was Geist-Medium
  bodySemi:    sys('sans-serif-medium'),   // was Geist-SemiBold
  bodyBold:    sys('sans-serif'),          // was Geist-Bold

  // aliases used by the booking screen (screen 3)
  bodyRegular: sys('sans-serif'),
  bodyMedium:  sys('sans-serif-medium'),
} as const;

export type FontKey = keyof typeof Fonts;

// ── Font sizes (provider scale) ──────────────────────────────────────────────
export const FontSize = {
  xs:    10,
  sm:    11,
  base:  13,
  md:    14,
  lg:    15,
  xl:    16,
  '2xl': 18,
  '3xl': 20,
  '4xl': 22,
  '5xl': 28,
} as const;

export type FontSizeKey = keyof typeof FontSize;

// ── Font weights (provider scale) ────────────────────────────────────────────
export const FontWeight = {
  regular:  '400' as const,
  medium:   '500' as const,
  semibold: '600' as const,
  bold:     '700' as const,
};

export type FontWeightKey = keyof typeof FontWeight;

// Maps each font alias to a numeric weight, so call sites can apply weight via
// `fontWeight` (the cross-platform way) alongside the system `fontFamily`.
export const fontWeightFor: Record<FontKey, TextStyle['fontWeight']> = {
  displayBold: '700',
  displaySemi: '600',
  displayReg:  '400',
  bodyReg:     '400',
  bodyMed:     '500',
  bodySemi:    '600',
  bodyBold:    '700',
  bodyRegular: '400',
  bodyMedium:  '500',
};

export default Fonts;
