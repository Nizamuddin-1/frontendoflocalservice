// ─────────────────────────────────────────────────────────────────────────────
//  Action Types — all constants in one file
// ─────────────────────────────────────────────────────────────────────────────

// ── AUTH ─────────────────────────────────────────────────────────────────────
export const AUTH_LOGIN_REQUEST = 'AUTH_LOGIN_REQUEST' as const;
export const AUTH_LOGIN_SUCCESS = 'AUTH_LOGIN_SUCCESS' as const;
export const AUTH_LOGIN_FAILURE = 'AUTH_LOGIN_FAILURE' as const;
export const AUTH_LOGOUT = 'AUTH_LOGOUT' as const;
export const AUTH_SET_ROLE = 'AUTH_SET_ROLE' as const;

// ── BOOKINGS ─────────────────────────────────────────────────────────────────
export const BOOKINGS_FETCH_REQUEST = 'BOOKINGS_FETCH_REQUEST' as const;
export const BOOKINGS_FETCH_SUCCESS = 'BOOKINGS_FETCH_SUCCESS' as const;
export const BOOKINGS_FETCH_FAILURE = 'BOOKINGS_FETCH_FAILURE' as const;
export const BOOKING_SET_FILTER = 'BOOKING_SET_FILTER' as const;
export const BOOKING_CREATE_REQUEST = 'BOOKING_CREATE_REQUEST' as const;
export const BOOKING_CREATE_SUCCESS = 'BOOKING_CREATE_SUCCESS' as const;
export const BOOKING_CREATE_FAILURE = 'BOOKING_CREATE_FAILURE' as const;
export const BOOKING_CANCEL_REQUEST = 'BOOKING_CANCEL_REQUEST' as const;
export const BOOKING_CANCEL_SUCCESS = 'BOOKING_CANCEL_SUCCESS' as const;
export const BOOKING_CANCEL_FAILURE = 'BOOKING_CANCEL_FAILURE' as const;

// ── SERVICES ─────────────────────────────────────────────────────────────────
export const SERVICES_FETCH_REQUEST = 'SERVICES_FETCH_REQUEST' as const;
export const SERVICES_FETCH_SUCCESS = 'SERVICES_FETCH_SUCCESS' as const;
export const SERVICES_FETCH_FAILURE = 'SERVICES_FETCH_FAILURE' as const;
export const SERVICES_SET_CATEGORY = 'SERVICES_SET_CATEGORY' as const;
export const SERVICES_SET_SEARCH = 'SERVICES_SET_SEARCH' as const;
export const SERVICES_SET_SORT = 'SERVICES_SET_SORT' as const;
export const SERVICES_SET_SELECTED = 'SERVICES_SET_SELECTED' as const;

// ── WALLET ───────────────────────────────────────────────────────────────────
export const WALLET_FETCH_REQUEST = 'WALLET_FETCH_REQUEST' as const;
export const WALLET_FETCH_SUCCESS = 'WALLET_FETCH_SUCCESS' as const;
export const WALLET_FETCH_FAILURE = 'WALLET_FETCH_FAILURE' as const;
export const WALLET_ADD_MONEY_REQUEST = 'WALLET_ADD_MONEY_REQUEST' as const;
export const WALLET_ADD_MONEY_SUCCESS = 'WALLET_ADD_MONEY_SUCCESS' as const;
export const WALLET_ADD_MONEY_FAILURE = 'WALLET_ADD_MONEY_FAILURE' as const;

// ── PROFILE ──────────────────────────────────────────────────────────────────
export const PROFILE_FETCH_REQUEST = 'PROFILE_FETCH_REQUEST' as const;
export const PROFILE_FETCH_SUCCESS = 'PROFILE_FETCH_SUCCESS' as const;
export const PROFILE_FETCH_FAILURE = 'PROFILE_FETCH_FAILURE' as const;
export const PROFILE_UPDATE_REQUEST = 'PROFILE_UPDATE_REQUEST' as const;
export const PROFILE_UPDATE_SUCCESS = 'PROFILE_UPDATE_SUCCESS' as const;
export const PROFILE_UPDATE_FAILURE = 'PROFILE_UPDATE_FAILURE' as const;

// ── PROVIDER / OPS ───────────────────────────────────────────────────────────
export const PROVIDER_DASHBOARD_FETCH_REQUEST = 'PROVIDER_DASHBOARD_FETCH_REQUEST' as const;
export const PROVIDER_DASHBOARD_FETCH_SUCCESS = 'PROVIDER_DASHBOARD_FETCH_SUCCESS' as const;
export const PROVIDER_DASHBOARD_FETCH_FAILURE = 'PROVIDER_DASHBOARD_FETCH_FAILURE' as const;
export const PROVIDER_DASHBOARD_SET_FILTER = 'PROVIDER_DASHBOARD_SET_FILTER' as const;
export const PROVIDER_BOOKINGS_FETCH_REQUEST = 'PROVIDER_BOOKINGS_FETCH_REQUEST' as const;
export const PROVIDER_BOOKINGS_FETCH_SUCCESS = 'PROVIDER_BOOKINGS_FETCH_SUCCESS' as const;
export const PROVIDER_BOOKINGS_FETCH_FAILURE = 'PROVIDER_BOOKINGS_FETCH_FAILURE' as const;
export const PROVIDER_BOOKING_UPDATE_REQUEST = 'PROVIDER_BOOKING_UPDATE_REQUEST' as const;
export const PROVIDER_BOOKING_UPDATE_SUCCESS = 'PROVIDER_BOOKING_UPDATE_SUCCESS' as const;
export const PROVIDER_BOOKING_UPDATE_FAILURE = 'PROVIDER_BOOKING_UPDATE_FAILURE' as const;
export const ACTIVE_JOB_SET = 'ACTIVE_JOB_SET' as const;
export const ACTIVE_JOB_CLEAR = 'ACTIVE_JOB_CLEAR' as const;
export const ACTIVE_JOB_UPDATE_PHOTOS = 'ACTIVE_JOB_UPDATE_PHOTOS' as const;
export const ACTIVE_JOB_UPDATE_NOTES = 'ACTIVE_JOB_UPDATE_NOTES' as const;
export const PROVIDER_AVAILABILITY_TOGGLE = 'PROVIDER_AVAILABILITY_TOGGLE' as const;


