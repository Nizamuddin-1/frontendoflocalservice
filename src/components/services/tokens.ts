// ─────────────────────────────────────────────────────────────────────────────
//  Services feature — token aliases
//  Screen 2 (2_servicesScreen.tsx) used the warm editorial palette. Its values
//  match the unified theme EXACTLY except `surface`, which was #FFFDF9 (a warm
//  off-white) vs the unified #FFFFFF. We override just that one key so the
//  extracted components render byte-identical to the original screen.
// ─────────────────────────────────────────────────────────────────────────────

import { Colors, Fonts } from '@/src/theme';

export const C = {
  ...Colors,
  surface: Colors.surfaceWarm, // screen 2 `surface` was #FFFDF9
};

export const F = Fonts;
