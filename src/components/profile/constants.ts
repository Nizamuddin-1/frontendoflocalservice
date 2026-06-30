// ─────────────────────────────────────────────────────────────────────────────
//  Profile feature — settings toggle state
//  DEFAULT_TOGGLES was a screen-local const in 5_profileScreen.tsx; it is the
//  initial state for the settings switches. Copied verbatim.
// ─────────────────────────────────────────────────────────────────────────────

export const DEFAULT_TOGGLES = {
  notifications:  true,
  smsAlerts:      true,
  locationAccess: true,
  faceId:         false,
  darkMode:       false,
  dataSync:       true,
};

export type Toggles = typeof DEFAULT_TOGGLES;
export type ToggleKey = keyof Toggles;
