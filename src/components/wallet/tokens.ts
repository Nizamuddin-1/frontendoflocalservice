// ─────────────────────────────────────────────────────────────────────────────
//  Wallet feature — token aliases
//  Screen 4 (4_walletScreen.tsx) used the cool blue palette. Values match the
//  unified theme except the keys below, pinned here to screen 4's exact values
//  so the extracted components render byte-identical:
//    bg          #FFFFFF  → Colors.surface
//    gold        #D4A853  → Colors.goldWarm   (unified `gold` is #B07D2E)
//    goldLight   #F0C96B  → Colors.goldBright (unified `goldLight` is #FBF0D6)
//    greenTint   #ECFDF5  → Colors.greenBg
//    amberTint   #FFFBEB  → Colors.amberBg
//    redTint     #FEF2F2  → Colors.redBg
//    tealTint    #F0FDFA  → Colors.tealBg
//    cobaltTint  #E9EFFC  → Colors.cobaltBg
//    sageTint    #E6F4EC  → Colors.sageBg
// ─────────────────────────────────────────────────────────────────────────────

import { Colors, Fonts } from '@/src/theme';

export const C = {
  ...Colors,
  bg: Colors.surface,
  gold: Colors.goldWarm,
  goldLight: Colors.goldBright,
  greenTint: Colors.greenBg,
  amberTint: Colors.amberBg,
  redTint: Colors.redBg,
  tealTint: Colors.tealBg,
  cobaltTint: Colors.cobaltBg,
  sageTint: Colors.sageBg,
};

export const F = Fonts;
