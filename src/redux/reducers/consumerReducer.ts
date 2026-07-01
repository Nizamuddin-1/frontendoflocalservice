// ─────────────────────────────────────────────────────────────────────────────
//  Consumer Reducer — handles all consumer-side state:
//    auth, bookings, services, wallet, profile
// ─────────────────────────────────────────────────────────────────────────────

import type { Booking, BookingStatus, Service, Transaction, UserProfile, SortMode } from '@/src/types';
import { SERVICES, CATEGORIES } from '@/src/services/mock';

type Role = 'consumer' | 'provider';
import {
  AUTH_LOGIN_REQUEST, AUTH_LOGIN_SUCCESS, AUTH_LOGIN_FAILURE, AUTH_LOGOUT, AUTH_SET_ROLE,
  BOOKINGS_FETCH_REQUEST, BOOKINGS_FETCH_SUCCESS, BOOKINGS_FETCH_FAILURE,
  BOOKING_SET_FILTER,
  BOOKING_CREATE_REQUEST, BOOKING_CREATE_SUCCESS, BOOKING_CREATE_FAILURE,
  BOOKING_CANCEL_REQUEST, BOOKING_CANCEL_SUCCESS, BOOKING_CANCEL_FAILURE,
  SERVICES_FETCH_REQUEST, SERVICES_FETCH_SUCCESS, SERVICES_FETCH_FAILURE,
  SERVICES_SET_CATEGORY, SERVICES_SET_SEARCH, SERVICES_SET_SORT, SERVICES_SET_SELECTED,
  WALLET_FETCH_REQUEST, WALLET_FETCH_SUCCESS, WALLET_FETCH_FAILURE,
  WALLET_ADD_MONEY_REQUEST, WALLET_ADD_MONEY_SUCCESS, WALLET_ADD_MONEY_FAILURE,
  PROFILE_FETCH_REQUEST, PROFILE_FETCH_SUCCESS, PROFILE_FETCH_FAILURE,
  PROFILE_UPDATE_REQUEST, PROFILE_UPDATE_SUCCESS, PROFILE_UPDATE_FAILURE,
} from '../actions/actionTypes';

// ── State shape ──────────────────────────────────────────────────────────────

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  role: Role;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
}

interface BookingsState {
  list: Booking[];
  filter: BookingStatus | 'all';
  isLoading: boolean;
  error: string | null;
}

interface ServicesState {
  list: Service[];
  categories: typeof CATEGORIES;
  selectedService: Service | null;
  activeCategory: string;
  searchQuery: string;
  sortMode: SortMode;
  isLoading: boolean;
  error: string | null;
}

interface WalletState {
  balance: number;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

interface ProfileState {
  user: UserProfile | null;
  addresses: string[];
  favorites: string[];
  isLoading: boolean;
  error: string | null;
}

export interface ConsumerState {
  auth: AuthState;
  bookings: BookingsState;
  services: ServicesState;
  wallet: WalletState;
  profile: ProfileState;
}

// ── Initial state ────────────────────────────────────────────────────────────

const initialState: ConsumerState = {
  auth: {
    user: null,
    token: null,
    role: 'consumer',
    isLoggedIn: false,
    isLoading: false,
    error: null,
  },
  bookings: {
    list: [],
    filter: 'all',
    isLoading: false,
    error: null,
  },
  services: {
    list: SERVICES,
    categories: CATEGORIES,
    selectedService: null,
    activeCategory: 'all',
    searchQuery: '',
    sortMode: 'popular' as SortMode,
    isLoading: false,
    error: null,
  },
  wallet: {
    balance: 0,
    transactions: [],
    isLoading: false,
    error: null,
  },
  profile: {
    user: null,
    addresses: [],
    favorites: [],
    isLoading: false,
    error: null,
  },
};

// ── Reducer ──────────────────────────────────────────────────────────────────

type Action = { type: string; payload?: any };

export default function consumerReducer(
  state: ConsumerState = initialState,
  action: Action
): ConsumerState {
  switch (action.type) {
    // ── AUTH ──────────────────────────────────────────
    case AUTH_LOGIN_REQUEST:
      return {
        ...state,
        auth: { ...state.auth, isLoading: true, error: null },
      };
    case AUTH_LOGIN_SUCCESS:
      return {
        ...state,
        auth: {
          ...state.auth,
          user: action.payload.user,
          token: action.payload.token,
          isLoggedIn: true,
          isLoading: false,
          error: null,
        },
      };
    case AUTH_LOGIN_FAILURE:
      return {
        ...state,
        auth: { ...state.auth, isLoading: false, error: action.payload },
      };
    case AUTH_LOGOUT:
      return {
        ...state,
        auth: { ...initialState.auth },
      };
    case AUTH_SET_ROLE:
      return {
        ...state,
        auth: { ...state.auth, role: action.payload },
      };

    // ── BOOKINGS ──────────────────────────────────────
    case BOOKINGS_FETCH_REQUEST:
      return {
        ...state,
        bookings: { ...state.bookings, isLoading: true, error: null },
      };
    case BOOKINGS_FETCH_SUCCESS:
      return {
        ...state,
        bookings: { ...state.bookings, list: action.payload, isLoading: false, error: null },
      };
    case BOOKINGS_FETCH_FAILURE:
      return {
        ...state,
        bookings: { ...state.bookings, isLoading: false, error: action.payload },
      };
    case BOOKING_SET_FILTER:
      return {
        ...state,
        bookings: { ...state.bookings, filter: action.payload },
      };
    case BOOKING_CREATE_REQUEST:
      return {
        ...state,
        bookings: { ...state.bookings, isLoading: true, error: null },
      };
    case BOOKING_CREATE_SUCCESS:
      return {
        ...state,
        bookings: {
          ...state.bookings,
          list: [action.payload, ...state.bookings.list],
          isLoading: false,
          error: null,
        },
      };
    case BOOKING_CREATE_FAILURE:
      return {
        ...state,
        bookings: { ...state.bookings, isLoading: false, error: action.payload },
      };
    case BOOKING_CANCEL_REQUEST:
      return { ...state };
    case BOOKING_CANCEL_SUCCESS:
      return {
        ...state,
        bookings: {
          ...state.bookings,
          list: state.bookings.list.map((b) =>
            b.id === action.payload.id ? { ...b, status: action.payload.status } : b
          ),
        },
      };
    case BOOKING_CANCEL_FAILURE:
      return { ...state };

    // ── SERVICES ──────────────────────────────────────
    case SERVICES_FETCH_REQUEST:
      return {
        ...state,
        services: { ...state.services, isLoading: true, error: null },
      };
    case SERVICES_FETCH_SUCCESS:
      return {
        ...state,
        services: { ...state.services, list: action.payload, isLoading: false, error: null },
      };
    case SERVICES_FETCH_FAILURE:
      return {
        ...state,
        services: { ...state.services, isLoading: false, error: action.payload },
      };
    case SERVICES_SET_CATEGORY:
      return {
        ...state,
        services: { ...state.services, activeCategory: action.payload },
      };
    case SERVICES_SET_SEARCH:
      return {
        ...state,
        services: { ...state.services, searchQuery: action.payload },
      };
    case SERVICES_SET_SORT:
      return {
        ...state,
        services: { ...state.services, sortMode: action.payload },
      };
    case SERVICES_SET_SELECTED:
      return {
        ...state,
        services: { ...state.services, selectedService: action.payload },
      };

    // ── WALLET ────────────────────────────────────────
    case WALLET_FETCH_REQUEST:
      return {
        ...state,
        wallet: { ...state.wallet, isLoading: true, error: null },
      };
    case WALLET_FETCH_SUCCESS:
      return {
        ...state,
        wallet: {
          ...state.wallet,
          balance: action.payload.balance,
          transactions: action.payload.transactions,
          isLoading: false,
          error: null,
        },
      };
    case WALLET_FETCH_FAILURE:
      return {
        ...state,
        wallet: { ...state.wallet, isLoading: false, error: action.payload },
      };
    case WALLET_ADD_MONEY_REQUEST:
      return { ...state };
    case WALLET_ADD_MONEY_SUCCESS:
      return {
        ...state,
        wallet: { ...state.wallet, balance: action.payload },
      };
    case WALLET_ADD_MONEY_FAILURE:
      return { ...state };

    // ── PROFILE ───────────────────────────────────────
    case PROFILE_FETCH_REQUEST:
      return {
        ...state,
        profile: { ...state.profile, isLoading: true, error: null },
      };
    case PROFILE_FETCH_SUCCESS:
      return {
        ...state,
        profile: { ...state.profile, user: action.payload, isLoading: false, error: null },
      };
    case PROFILE_FETCH_FAILURE:
      return {
        ...state,
        profile: { ...state.profile, isLoading: false, error: action.payload },
      };
    case PROFILE_UPDATE_REQUEST:
      return { ...state };
    case PROFILE_UPDATE_SUCCESS:
      return {
        ...state,
        profile: { ...state.profile, user: action.payload },
      };
    case PROFILE_UPDATE_FAILURE:
      return { ...state };

    default:
      return state;
  }
}
