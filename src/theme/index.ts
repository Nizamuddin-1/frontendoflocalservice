// ─────────────────────────────────────────────────────────────────────────────
//  Theme — barrel export
//  Single import surface for the unified design system:
//      import { Colors, Fonts, FontSize, FontWeight, Spacing, Radii, Shadows }
//        from '@/src/theme';
// ─────────────────────────────────────────────────────────────────────────────

export * from './colors';     // Colors, ColorKey
export * from './typography'; // Fonts, FontSize, FontWeight (+ key types)
export * from './spacing';    // Spacing, Radii, Shadows, StyleValue (+ key types)
