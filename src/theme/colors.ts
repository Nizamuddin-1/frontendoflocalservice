// ─────────────────────────────────────────────────────────────────────────────
//  Unified Color Palette
//  Merged from:
//    • Consumer "warm editorial" tokens  → screens 1 (statsLanding) & 2 (services)
//    • Consumer "cool blue" tokens        → screens 3 (booking), 4 (wallet), 5 (profile)
//    • Provider design tokens             → provider/src/theme (accent / emerald / rose)
//
//  Where the source screens used the same key with different values, the most
//  common / brand-correct value is kept and the variant is exposed under a
//  descriptive alias (noted inline). No source value was dropped.
// ─────────────────────────────────────────────────────────────────────────────

export const Colors = {
  // ── Neutrals / Ink (consumer warm screens) ──────────────────────────────────
  ink:        '#0F1923',
  inkMid:     '#2E3B4E',
  inkLight:   '#6B7A8D',
  inkFaint:   '#A8B3BE',

  // ── Ink scale (provider) ─────────────────────────────────────────────────────
  ink2:       '#3D4358',
  ink3:       '#7B82A0',
  ink4:       '#B4B9CE',

  // ── Slate (consumer cool screens) ───────────────────────────────────────────
  slate:      '#64748B',
  slateLight: '#94A3B8',

  // ── Surfaces / Backgrounds ───────────────────────────────────────────────────
  canvas:         '#F7F3EE',  // warm editorial canvas (screen 2)
  canvasLight:    '#FFFFFF',  // warm canvas variant (screen 1)
  surface:        '#FFFFFF',
  surfaceWarm:    '#FFFDF9',  // screen 2 surface
  surfaceAlt:     '#F8F9FB',  // cool screens surfaceAlt
  surfaceAltWarm: '#EEE9E2',  // screen 2 surfaceAlt
  surfaceMuted:   '#F5F6FA',  // provider surface
  bgCool:         '#F0F2F8',  // screen 3 background
  bgCool2:        '#F0F3FB',  // screen 5 background

  // ── Borders / Rules ──────────────────────────────────────────────────────────
  border:      '#E2E8F4',
  borderLight: '#EEF2FB',
  rule:        '#DDD6CE',     // warm hairline
  ruleLight:   '#EDE8E2',
  tag:         '#ECE7DF',     // warm chip / tag background

  // ── Brand: Terra ─────────────────────────────────────────────────────────────
  terra:      '#C0522B',
  terraDeep:  '#A83E20',
  terraMid:   '#D96840',
  terraLight: '#FAE8DF',
  terraTint:  '#FDF1EC',

  // ── Brand: Gold ──────────────────────────────────────────────────────────────
  gold:       '#B07D2E',      // warm screens gold
  goldWarm:   '#D4A853',      // cool screens / provider-adjacent gold
  goldLight:  '#FBF0D6',
  goldBright: '#F0C96B',
  goldDeep:   '#8A5F1A',

  // ── Sage / Green ─────────────────────────────────────────────────────────────
  sage:     '#3D7A60',
  sageBg:   '#E6F4EC',
  green:    '#10B981',        // canonical success green (screens 4/5)
  greenAlt: '#0AB87A',        // screen 3 success green
  greenBg:  '#ECFDF5',

  // ── Cobalt / Blue ────────────────────────────────────────────────────────────
  cobalt:    '#1B4FD8',
  cobaltMid: '#3B6FE8',
  cobaltBg:  '#E9EFFC',
  blue:      '#2563EB',       // canonical blue (screens 4/5)
  blueAlt:   '#1A73E8',       // screen 3 blue
  blueLight: '#3B82F6',
  blueTint:  '#EFF6FF',

  // ── Plum / Purple ────────────────────────────────────────────────────────────
  plum:     '#6B3FA0',
  plumBg:   '#F0EAFA',
  purple:   '#7C3AED',
  purpleBg: '#F5F3FF',

  // ── Rust ─────────────────────────────────────────────────────────────────────
  rust:   '#A83E20',
  rustBg: '#FAEAE4',

  // ── Teal ─────────────────────────────────────────────────────────────────────
  teal:   '#0D9488',
  tealBg: '#F0FDFA',

  // ── Amber / Orange ───────────────────────────────────────────────────────────
  amber:    '#F59E0B',
  amberBg:  '#FFFBEB',
  orange:   '#EA580C',
  orangeBg: '#FFF7ED',

  // ── Red / Rose ───────────────────────────────────────────────────────────────
  red:   '#EF4444',
  redBg: '#FEF2F2',

  // ── Navy (cool hero blocks) ──────────────────────────────────────────────────
  navy:    '#0A1628',
  navyMid: '#1C2E4A',

  // ── Hero / Card gradient stops ───────────────────────────────────────────────
  heroTop: '#0A1628',
  heroMid: '#0F1F45',
  heroBot: '#162847',
  cardTop: '#0F1F45',
  cardMid: '#162847',

  // ── Provider accent system ───────────────────────────────────────────────────
  accent:   '#2A5BFF',
  accent2:  '#EEF2FF',
  accent3:  '#1A3FCC',
  emerald:  '#0EA871',
  emerald2: '#E5F9F1',
  emerald3: '#0B7A52',
  rose:     '#E53E5C',
  rose2:    '#FDE8EC',
  rose3:    '#A0243E',
  amber2:   '#FEF4E2',        // provider amber tint
  amber3:   '#A0640A',        // provider amber deep
  purple2:  '#EEEDFE',        // provider purple tint
  purple3:  '#3C3489',        // provider purple deep

  // ── Misc ─────────────────────────────────────────────────────────────────────
  star:  '#FFB800',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof Colors;

export default Colors;
