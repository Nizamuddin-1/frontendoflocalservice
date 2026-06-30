// ─────────────────────────────────────────────────────────────────────────────
//  Mock Data — barrel export
//  Single import surface for all extracted consumer mock data:
//      import { SERVICES, ALL_BOOKINGS, TRANSACTIONS } from '@/src/services/mock';
//
//  bookings.ts  → RECENT_BOOKINGS, ALL_BOOKINGS, BOOKING_TABS
//  services.ts  → SERVICE_CATEGORIES, CATEGORIES, SORT_OPTIONS, SERVICES, TRUST_FEATURES
//  dashboard.ts → HOME_STATS, PROMOS, LOYALTY, REWARDS, TRANSACTIONS, OFFERS,
//                 ADD_AMOUNTS, TX_TIME_TABS, USER, PROFILE_STATS, MENU_SECTIONS
// ─────────────────────────────────────────────────────────────────────────────

export * from './bookings';
export * from './services';
export * from './dashboard';
