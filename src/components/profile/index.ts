// ─────────────────────────────────────────────────────────────────────────────
//  Profile feature components — barrel export
//  Extracted from 5_profileScreen.tsx (Phase 3, screen-scoped).
//      import { HeroAvatar, LoyaltyBar, MenuSectionCard, EditProfileModal,
//               DEFAULT_TOGGLES, styles, C, F } from '@/src/components/profile';
// ─────────────────────────────────────────────────────────────────────────────

export * from './tokens';            // C, F
export * from './constants';         // DEFAULT_TOGGLES, Toggles, ToggleKey
export { styles } from './profile.styles';

export * from './HeroAvatar';
export * from './LoyaltyBar';
export * from './MenuItemRow';
export * from './MenuSectionCard';
export * from './EditProfileModal';
