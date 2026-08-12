// ─────────────────────────────────────────────────────────────────────────────
//  Action Creators & Async Thunks — all actions in one file
//  Updated to call real backend APIs via the service layer.
// ─────────────────────────────────────────────────────────────────────────────

import { authApi, bookingsApi, walletApi, servicesApi, providerApi } from '@/src/services/api';
import { USER } from '@/src/services/mock';
import type { BookingStatus } from '@/src/types';
import * as ActionTypes from './actionTypes';

type Role = 'consumer' | 'provider';

// ─────────────────────────────────────────────────────────────────────────────
//  AUTH actions
// ─────────────────────────────────────────────────────────────────────────────

export const authLoginRequest = () => ({ type: ActionTypes.AUTH_LOGIN_REQUEST });
export const authLoginSuccess = (payload: { user: any; token: string }) => ({
  type: ActionTypes.AUTH_LOGIN_SUCCESS,
  payload,
});
export const authLoginFailure = (error: string) => ({
  type: ActionTypes.AUTH_LOGIN_FAILURE,
  payload: error,
});
export const authLogout = () => ({ type: ActionTypes.AUTH_LOGOUT });
export const authSetRole = (role: Role) => ({
  type: ActionTypes.AUTH_SET_ROLE,
  payload: role,
});

export const login = (email: string, password: string) => async (dispatch: any) => {
  dispatch(authLoginRequest());
  try {
    const { user, token } = await authApi.login(email, password);
    dispatch(authLoginSuccess({ user, token }));
  } catch (e) {
    dispatch(authLoginFailure(e instanceof Error ? e.message : 'Login failed'));
  }
};

export const logout = () => async (dispatch: any, getState: any) => {
  const { auth } = getState().consumer;
  try {
    if (auth.token) await authApi.logout(auth.token);
  } finally {
    dispatch(authLogout());
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  BOOKINGS actions
// ─────────────────────────────────────────────────────────────────────────────

export const bookingsFetchRequest = () => ({ type: ActionTypes.BOOKINGS_FETCH_REQUEST });
export const bookingsFetchSuccess = (payload: any[]) => ({
  type: ActionTypes.BOOKINGS_FETCH_SUCCESS,
  payload,
});
export const bookingsFetchFailure = (error: string) => ({
  type: ActionTypes.BOOKINGS_FETCH_FAILURE,
  payload: error,
});
export const bookingSetFilter = (filter: BookingStatus | 'all') => ({
  type: ActionTypes.BOOKING_SET_FILTER,
  payload: filter,
});
export const bookingCreateRequest = () => ({ type: ActionTypes.BOOKING_CREATE_REQUEST });
export const bookingCreateSuccess = (payload: any) => ({
  type: ActionTypes.BOOKING_CREATE_SUCCESS,
  payload,
});
export const bookingCreateFailure = (error: string) => ({
  type: ActionTypes.BOOKING_CREATE_FAILURE,
  payload: error,
});
export const bookingCancelRequest = () => ({ type: ActionTypes.BOOKING_CANCEL_REQUEST });
export const bookingCancelSuccess = (payload: { id: string; status: BookingStatus }) => ({
  type: ActionTypes.BOOKING_CANCEL_SUCCESS,
  payload,
});
export const bookingCancelFailure = (error: string) => ({
  type: ActionTypes.BOOKING_CANCEL_FAILURE,
  payload: error,
});

export const fetchBookings = () => async (dispatch: any) => {
  dispatch(bookingsFetchRequest());
  try {
    const bookings = await bookingsApi.list();
    dispatch(bookingsFetchSuccess(bookings));
  } catch (e) {
    dispatch(bookingsFetchFailure(e instanceof Error ? e.message : 'Failed to load bookings'));
  }
};

export const cancelBooking = (id: string) => async (dispatch: any) => {
  dispatch(bookingCancelRequest());
  try {
    const { status } = await bookingsApi.cancel(id);
    dispatch(bookingCancelSuccess({ id, status }));
  } catch (e) {
    dispatch(bookingCancelFailure(e instanceof Error ? e.message : 'Failed to cancel booking'));
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  SERVICES actions
// ─────────────────────────────────────────────────────────────────────────────

export const servicesFetchRequest = () => ({ type: ActionTypes.SERVICES_FETCH_REQUEST });
export const servicesFetchSuccess = (payload: { services: any[], categories: any[] }) => ({
  type: ActionTypes.SERVICES_FETCH_SUCCESS,
  payload,
});
export const servicesFetchFailure = (error: string) => ({
  type: ActionTypes.SERVICES_FETCH_FAILURE,
  payload: error,
});
export const servicesSetCategory = (category: string) => ({
  type: ActionTypes.SERVICES_SET_CATEGORY,
  payload: category,
});
export const servicesSetSearch = (query: string) => ({
  type: ActionTypes.SERVICES_SET_SEARCH,
  payload: query,
});
export const servicesSetSort = (sortMode: any) => ({
  type: ActionTypes.SERVICES_SET_SORT,
  payload: sortMode,
});
export const servicesSetSelected = (service: any) => ({
  type: ActionTypes.SERVICES_SET_SELECTED,
  payload: service,
});

export const fetchServices = () => async (dispatch: any) => {
  dispatch(servicesFetchRequest());
  try {
    const [services, categories] = await Promise.all([
      servicesApi.listServices(),
      servicesApi.listCategories(),
    ]);
    dispatch(servicesFetchSuccess({ services, categories }));
  } catch (e) {
    dispatch(servicesFetchFailure(e instanceof Error ? e.message : 'Failed to load services'));
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  WALLET actions
// ─────────────────────────────────────────────────────────────────────────────

export const walletFetchRequest = () => ({ type: ActionTypes.WALLET_FETCH_REQUEST });
export const walletFetchSuccess = (payload: { balance: number; transactions: any[] }) => ({
  type: ActionTypes.WALLET_FETCH_SUCCESS,
  payload,
});
export const walletFetchFailure = (error: string) => ({
  type: ActionTypes.WALLET_FETCH_FAILURE,
  payload: error,
});
export const walletAddMoneyRequest = () => ({ type: ActionTypes.WALLET_ADD_MONEY_REQUEST });
export const walletAddMoneySuccess = (balance: number) => ({
  type: ActionTypes.WALLET_ADD_MONEY_SUCCESS,
  payload: balance,
});
export const walletAddMoneyFailure = (error: string) => ({
  type: ActionTypes.WALLET_ADD_MONEY_FAILURE,
  payload: error,
});

export const fetchWallet = () => async (dispatch: any) => {
  dispatch(walletFetchRequest());
  try {
    const [balance, transactions] = await Promise.all([
      walletApi.getBalance(),
      walletApi.getTransactions(),
    ]);
    dispatch(walletFetchSuccess({ balance, transactions }));
  } catch (e) {
    dispatch(walletFetchFailure(e instanceof Error ? e.message : 'Failed to load wallet'));
  }
};

export const addMoney = (amount: number) => async (dispatch: any) => {
  dispatch(walletAddMoneyRequest());
  try {
    const { balance } = await walletApi.addMoney(amount);
    dispatch(walletAddMoneySuccess(balance));
  } catch (e) {
    dispatch(walletAddMoneyFailure(e instanceof Error ? e.message : 'Failed to add money'));
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  PROFILE actions
// ─────────────────────────────────────────────────────────────────────────────

export const profileFetchRequest = () => ({ type: ActionTypes.PROFILE_FETCH_REQUEST });
export const profileFetchSuccess = (payload: any) => ({
  type: ActionTypes.PROFILE_FETCH_SUCCESS,
  payload,
});
export const profileFetchFailure = (error: string) => ({
  type: ActionTypes.PROFILE_FETCH_FAILURE,
  payload: error,
});
export const profileUpdateRequest = () => ({ type: ActionTypes.PROFILE_UPDATE_REQUEST });
export const profileUpdateSuccess = (payload: any) => ({
  type: ActionTypes.PROFILE_UPDATE_SUCCESS,
  payload,
});
export const profileUpdateFailure = (error: string) => ({
  type: ActionTypes.PROFILE_UPDATE_FAILURE,
  payload: error,
});

export const fetchProfile = () => async (dispatch: any, getState: any) => {
  dispatch(profileFetchRequest());
  try {
    const { auth } = getState().consumer;
    if (auth.token) {
      const profile = await authApi.me(auth.token);
      dispatch(profileFetchSuccess(profile));
    } else {
      // Fallback to mock data if no token
      dispatch(profileFetchSuccess(USER));
    }
  } catch (e) {
    // Fallback to mock on error
    dispatch(profileFetchSuccess(USER));
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  PROVIDER / OPS actions
// ─────────────────────────────────────────────────────────────────────────────

export const providerDashboardFetchRequest = () => ({
  type: ActionTypes.PROVIDER_DASHBOARD_FETCH_REQUEST,
});
export const providerDashboardFetchSuccess = (payload: { stats: any; jobs: any[] }) => ({
  type: ActionTypes.PROVIDER_DASHBOARD_FETCH_SUCCESS,
  payload,
});
export const providerDashboardFetchFailure = (error: string) => ({
  type: ActionTypes.PROVIDER_DASHBOARD_FETCH_FAILURE,
  payload: error,
});
export const providerDashboardSetFilter = (filter: string) => ({
  type: ActionTypes.PROVIDER_DASHBOARD_SET_FILTER,
  payload: filter,
});

export const providerBookingsFetchRequest = () => ({
  type: ActionTypes.PROVIDER_BOOKINGS_FETCH_REQUEST,
});
export const providerBookingsFetchSuccess = (payload: any[]) => ({
  type: ActionTypes.PROVIDER_BOOKINGS_FETCH_SUCCESS,
  payload,
});
export const providerBookingsFetchFailure = (error: string) => ({
  type: ActionTypes.PROVIDER_BOOKINGS_FETCH_FAILURE,
  payload: error,
});

export const providerBookingUpdateRequest = () => ({
  type: ActionTypes.PROVIDER_BOOKING_UPDATE_REQUEST,
});
export const providerBookingUpdateSuccess = (payload: any) => ({
  type: ActionTypes.PROVIDER_BOOKING_UPDATE_SUCCESS,
  payload,
});
export const providerBookingUpdateFailure = (error: string) => ({
  type: ActionTypes.PROVIDER_BOOKING_UPDATE_FAILURE,
  payload: error,
});

export const activeJobSet = (payload: any) => ({
  type: ActionTypes.ACTIVE_JOB_SET,
  payload,
});
export const activeJobClear = () => ({ type: ActionTypes.ACTIVE_JOB_CLEAR });
export const activeJobUpdatePhotos = (photos: boolean[]) => ({
  type: ActionTypes.ACTIVE_JOB_UPDATE_PHOTOS,
  payload: photos,
});
export const activeJobUpdateNotes = (notes: string) => ({
  type: ActionTypes.ACTIVE_JOB_UPDATE_NOTES,
  payload: notes,
});
export const providerAvailabilityToggle = () => ({
  type: ActionTypes.PROVIDER_AVAILABILITY_TOGGLE,
});

export const fetchProviderDashboard = () => async (dispatch: any) => {
  dispatch(providerDashboardFetchRequest());
  try {
    const [stats, jobs] = await Promise.all([
      providerApi.getStats(),
      providerApi.getDashboardJobs(),
    ]);
    dispatch(providerDashboardFetchSuccess({ stats, jobs }));
  } catch (e) {
    dispatch(providerDashboardFetchFailure(e instanceof Error ? e.message : 'Failed to load dashboard'));
  }
};

export const fetchProviderBookings = () => async (dispatch: any) => {
  dispatch(providerBookingsFetchRequest());
  try {
    const bookings = await providerApi.getBookings();
    dispatch(providerBookingsFetchSuccess(bookings));
  } catch (e) {
    dispatch(providerBookingsFetchFailure(e instanceof Error ? e.message : 'Failed to load bookings'));
  }
};

export const updateProviderBookingStatus = (id: string, status: string) => async (dispatch: any) => {
  dispatch(providerBookingUpdateRequest());
  try {
    const updated = await providerApi.updateBookingStatus(id, status);
    dispatch(providerBookingUpdateSuccess(updated));
  } catch (e) {
    dispatch(providerBookingUpdateFailure(e instanceof Error ? e.message : 'Failed to update booking'));
  }
};

export const toggleProviderAvailability = () => async (dispatch: any) => {
  try {
    await providerApi.toggleAvailability();
    dispatch(providerAvailabilityToggle());
  } catch {
    // silently fail
  }
};
