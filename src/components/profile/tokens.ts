// ─────────────────────────────────────────────────────────────────────────────
//  Profile feature — token aliases
//  Screen 5 (5_profileScreen.tsx) used the cool blue palette. Values match the
//  unified theme except the keys below, pinned to screen 5's exact values so the
//  extracted components render byte-identical:
//    bg          #F0F3FB  → Colors.bgCool2
//    blueLight   #EFF6FF  → Colors.blueTint  (unified `blueLight` is #3B82F6)
//    gold        #D4A853  → Colors.goldWarm  (unified `gold` is #B07D2E)
//    goldLight   #F0C96B  → Colors.goldBright (unified `goldLight` is #FBF0D6)
// ─────────────────────────────────────────────────────────────────────────────

import { Colors, Fonts } from '@/src/theme';

export const C = {
  ...Colors,
  bg: Colors.bgCool2,
  blueLight: Colors.blueTint,
  gold: Colors.goldWarm,
  goldLight: Colors.goldBright,
};

export const F = Fonts;
