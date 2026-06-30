// ─────────────────────────────────────────────────────────────────────────────
//  bookingsStore — bookings list + status filter
//  Loads via the API layer (mock-backed today). Mirrors the consumer bookings
//  screen's shape so it can adopt this store with minimal change later.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand';
import { bookingsApi } from '@/src/services/api';
import type { Booking, BookingStatus } from '@/src/types';

export type BookingFilter = BookingStatus | 'all';

interface BookingsState {
  bookings: Booking[];
  filter: BookingFilter;
  loading: boolean;
  error: string | null;

  fetchBookings: () => Promise<void>;
  setFilter: (filter: BookingFilter) => void;
  cancelBooking: (id: string) => Promise<void>;
  /** Derived: bookings matching the active filter. */
  visibleBookings: () => Booking[];
}

export const useBookingsStore = create<BookingsState>((set, get) => ({
  bookings: [],
  filter: 'all',
  loading: false,
  error: null,

  fetchBookings: async () => {
    set({ loading: true, error: null });
    try {
      const bookings = await bookingsApi.list();
      set({ bookings, loading: false });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : 'Failed to load bookings' });
    }
  },

  setFilter: (filter) => set({ filter }),

  cancelBooking: async (id) => {
    const { status } = await bookingsApi.cancel(id);
    set((s) => ({
      bookings: s.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
    }));
  },

  visibleBookings: () => {
    const { bookings, filter } = get();
    return filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);
  },
}));

export default useBookingsStore;
