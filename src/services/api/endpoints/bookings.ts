// ─── Bookings endpoints ───────────────────────────────────────────────────────
// Mock-backed while config.useMock is true; real fetch path written but dormant.
import { config } from '@/src/config/env';
import { apiClient, mockDelay } from '../client';
import { ALL_BOOKINGS } from '@/src/services/mock';
import type { Booking } from '@/src/types';

export const bookingsApi = {
  async list(): Promise<Booking[]> {
    if (config.useMock) return mockDelay(ALL_BOOKINGS);
    return apiClient.get<Booking[]>('/bookings');
  },

  async get(id: string): Promise<Booking | undefined> {
    if (config.useMock) return mockDelay(ALL_BOOKINGS.find((b) => b.id === id));
    return apiClient.get<Booking>(`/bookings/${id}`);
  },

  async cancel(id: string): Promise<{ id: string; status: Booking['status'] }> {
    if (config.useMock) return mockDelay({ id, status: 'cancelled' });
    return apiClient.post<{ id: string; status: Booking['status'] }>(`/bookings/${id}/cancel`);
  },
};

export default bookingsApi;
