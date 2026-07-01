// ─────────────────────────────────────────────────────────────────────────────
//  Provider Reducer — handles provider-side state:
//    dashboard, provider bookings, active job, availability, provider profile
// ─────────────────────────────────────────────────────────────────────────────

import {
  PROVIDER_DASHBOARD_FETCH_REQUEST, PROVIDER_DASHBOARD_FETCH_SUCCESS,
  PROVIDER_DASHBOARD_FETCH_FAILURE, PROVIDER_DASHBOARD_SET_FILTER,
  PROVIDER_BOOKINGS_FETCH_REQUEST, PROVIDER_BOOKINGS_FETCH_SUCCESS,
  PROVIDER_BOOKINGS_FETCH_FAILURE,
  PROVIDER_BOOKING_UPDATE_REQUEST, PROVIDER_BOOKING_UPDATE_SUCCESS,
  PROVIDER_BOOKING_UPDATE_FAILURE,
  ACTIVE_JOB_SET, ACTIVE_JOB_CLEAR, ACTIVE_JOB_UPDATE_PHOTOS, ACTIVE_JOB_UPDATE_NOTES,
  PROVIDER_AVAILABILITY_TOGGLE,
  PROFILE_FETCH_REQUEST, PROFILE_FETCH_SUCCESS, PROFILE_FETCH_FAILURE,
  PROFILE_UPDATE_REQUEST, PROFILE_UPDATE_SUCCESS, PROFILE_UPDATE_FAILURE,
} from '../actions/actionTypes';
import { DASHBOARD_STATS, DASHBOARD_JOBS, BOOKINGS, JOB_STEPS, PROVIDER_PROFILE } from '@/app/provider/src/hooks/mockData';

// ── Types ────────────────────────────────────────────────────────────────────

interface ProviderBooking {
  id: string;
  requestNo: string;
  status: string;
  serviceType: string;
  iconBg: string;
  customer: {
    id: string;
    name: string;
    initials: string;
    rating: number;
    totalOrders: number;
    phone: string;
  };
  services: { id: string; name: string; quantity: number; price: number }[];
  location: {
    address: string;
    city: string;
    distanceKm: number;
    etaMins: number;
  };
  scheduledAt: string;
  durationMins: number;
  payment: string;
  totalAmount: number;
}

interface DashboardStats {
  todayJobs: number;
  monthEarnings: number;
  avgRating: number;
  completionRate: number;
  jobsDone: number;
  monthGrowth: number;
}

interface DashboardJob {
  id: string;
  initials: string;
  avatarBg: string;
  avatarText: string;
  name: string;
  jobType: string;
  status: string;
  timeLabel: string;
  amount: number;
  screen?: string;
}

export interface JobStep {
  id: number;
  label: string;
  detail: string;
  state: 'done' | 'current' | 'pending';
}

interface ProviderProfile {
  id: string;
  name: string;
  initials: string;
  category: string;
  rating: number;
  reviewCount: number;
  jobsDone: number;
  completionRate: number;
  totalEarned: number;
  isAvailable: boolean;
  phone: string;
  email: string;
  address: string;
  serviceCategories: string[];
  bank: {
    bankName: string;
    maskedNo: string;
    verified: boolean;
  };
  documents: {
    type: string;
    label: string;
    status: string;
  }[];
}

interface DashboardState {
  stats: DashboardStats;
  jobs: DashboardJob[];
  activeFilter: string;
  isLoading: boolean;
  error: string | null;
}

interface ProviderBookingsState {
  list: ProviderBooking[];
  selectedBooking: ProviderBooking | null;
  isLoading: boolean;
  error: string | null;
}

interface ActiveJobState {
  booking: ProviderBooking | null;
  steps: JobStep[];
  uploadedPhotos: boolean[];
  notes: string;
  progress: number;
  isLoading: boolean;
  error: string | null;
}

interface AvailabilityState {
  isAvailable: boolean;
  isLoading: boolean;
}

interface ProviderProfileState {
  data: ProviderProfile | null;
  isLoading: boolean;
  error: string | null;
}

export interface ProviderState {
  dashboard: DashboardState;
  providerBookings: ProviderBookingsState;
  activeJob: ActiveJobState;
  availability: AvailabilityState;
  profile: ProviderProfileState;
}

// ── Initial state ────────────────────────────────────────────────────────────

const initialState: ProviderState = {
  dashboard: {
    stats: DASHBOARD_STATS,
    jobs: DASHBOARD_JOBS,
    activeFilter: 'All Jobs',
    isLoading: false,
    error: null,
  },
  providerBookings: {
    list: BOOKINGS,
    selectedBooking: null,
    isLoading: false,
    error: null,
  },
  activeJob: {
    booking: null,
    steps: JOB_STEPS,
    uploadedPhotos: [true, true, false, false],
    notes: '',
    progress: 0,
    isLoading: false,
    error: null,
  },
  availability: {
    isAvailable: true,
    isLoading: false,
  },
  profile: {
    data: PROVIDER_PROFILE,
    isLoading: false,
    error: null,
  },
};

// ── Reducer ──────────────────────────────────────────────────────────────────

type Action = { type: string; payload?: any };

export default function providerReducer(
  state: ProviderState = initialState,
  action: Action
): ProviderState {
  switch (action.type) {
    // ── DASHBOARD ─────────────────────────────────────
    case PROVIDER_DASHBOARD_FETCH_REQUEST:
      return {
        ...state,
        dashboard: { ...state.dashboard, isLoading: true, error: null },
      };
    case PROVIDER_DASHBOARD_FETCH_SUCCESS:
      return {
        ...state,
        dashboard: {
          ...state.dashboard,
          stats: action.payload.stats,
          jobs: action.payload.jobs,
          isLoading: false,
          error: null,
        },
      };
    case PROVIDER_DASHBOARD_FETCH_FAILURE:
      return {
        ...state,
        dashboard: { ...state.dashboard, isLoading: false, error: action.payload },
      };
    case PROVIDER_DASHBOARD_SET_FILTER:
      return {
        ...state,
        dashboard: { ...state.dashboard, activeFilter: action.payload },
      };

    // ── PROVIDER BOOKINGS ─────────────────────────────
    case PROVIDER_BOOKINGS_FETCH_REQUEST:
      return {
        ...state,
        providerBookings: { ...state.providerBookings, isLoading: true, error: null },
      };
    case PROVIDER_BOOKINGS_FETCH_SUCCESS:
      return {
        ...state,
        providerBookings: {
          ...state.providerBookings,
          list: action.payload,
          isLoading: false,
          error: null,
        },
      };
    case PROVIDER_BOOKINGS_FETCH_FAILURE:
      return {
        ...state,
        providerBookings: { ...state.providerBookings, isLoading: false, error: action.payload },
      };
    case PROVIDER_BOOKING_UPDATE_REQUEST:
      return { ...state };
    case PROVIDER_BOOKING_UPDATE_SUCCESS:
      return {
        ...state,
        providerBookings: {
          ...state.providerBookings,
          list: state.providerBookings.list.map((b) =>
            b.id === action.payload.id ? { ...b, ...action.payload } : b
          ),
          selectedBooking:
            state.providerBookings.selectedBooking?.id === action.payload.id
              ? { ...state.providerBookings.selectedBooking, ...action.payload }
              : state.providerBookings.selectedBooking,
        },
      };
    case PROVIDER_BOOKING_UPDATE_FAILURE:
      return { ...state };

    // ── ACTIVE JOB ────────────────────────────────────
    case ACTIVE_JOB_SET:
      return {
        ...state,
        activeJob: {
          ...state.activeJob,
          booking: action.payload,
        },
      };
    case ACTIVE_JOB_CLEAR:
      return {
        ...state,
        activeJob: { ...initialState.activeJob },
      };
    case ACTIVE_JOB_UPDATE_PHOTOS:
      return {
        ...state,
        activeJob: { ...state.activeJob, uploadedPhotos: action.payload },
      };
    case ACTIVE_JOB_UPDATE_NOTES:
      return {
        ...state,
        activeJob: { ...state.activeJob, notes: action.payload },
      };

    // ── AVAILABILITY ──────────────────────────────────
    case PROVIDER_AVAILABILITY_TOGGLE:
      return {
        ...state,
        availability: {
          ...state.availability,
          isAvailable: !state.availability.isAvailable,
        },
      };

    // ── PROVIDER PROFILE ──────────────────────────────
    case PROFILE_FETCH_REQUEST:
      return {
        ...state,
        profile: { ...state.profile, isLoading: true, error: null },
      };
    case PROFILE_FETCH_SUCCESS:
      return {
        ...state,
        profile: { ...state.profile, data: action.payload, isLoading: false, error: null },
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
        profile: { ...state.profile, data: action.payload },
      };
    case PROFILE_UPDATE_FAILURE:
      return { ...state };

    default:
      return state;
  }
}
