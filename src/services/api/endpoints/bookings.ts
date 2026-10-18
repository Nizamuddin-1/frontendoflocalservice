// ─── Bookings endpoints ───────────────────────────────────────────────────────
// Real HTTP calls to the backend consumer/provider booking APIs.
import { config } from '@/src/config/env';
import { apiClient, mockDelay } from '../client';
import { ALL_BOOKINGS } from '@/src/services/mock';
import type { Booking } from '@/src/types';

/** Backend booking response shape (subset we care about). */
interface BackendBooking {
  _id: string;
  serviceName: string;
  providerName: string;
  category: string;
  mcIcon: string;
  status: string;
  date: string;
  timeSlot: string;
  address: string;
  price: number;
  isPaid: boolean;
  bookingRef: string;
  accentColor: string;
  rating?: number;
  canReschedule?: boolean;
  canCancel?: boolean;
  canReview?: boolean;
  canTrack?: boolean;
  proAvatar: string;
}

function mapBooking(b: BackendBooking): Booking {
  return {
    id: b._id,
    serviceName: b.serviceName,
    providerName: b.providerName,
    category: b.category,
    mcIcon: b.mcIcon,
    status: b.status as Booking['status'],
    date: b.date,
    timeSlot: b.timeSlot,
    address: b.address,
    price: b.price,
    isPaid: b.isPaid,
    bookingRef: b.bookingRef,
    accentColor: b.accentColor,
    rating: b.rating,
    canReschedule: b.canReschedule,
    canCancel: b.canCancel,
    canReview: b.canReview,
    canTrack: b.canTrack,
    proAvatar: b.proAvatar,
  };
}

export const bookingsApi = {
  async list(): Promise<Booking[]> {
    if (config.useMock) return mockDelay(ALL_BOOKINGS);
    const data = await apiClient.get<BackendBooking[]>('/consumer/bookings');
    return data.map(mapBooking);
  },

  async get(id: string): Promise<Booking | undefined> {
    if (config.useMock) return mockDelay(ALL_BOOKINGS.find((b) => b.id === id));
    try {
      const data = await apiClient.get<BackendBooking>(`/consumer/bookings/${id}`);
      return mapBooking(data);
    } catch {
      return undefined;
    }
  },

  async create(data: {
    serviceId: string;
    variationId?: string;
    scheduledAt: string;
    address: string;
    city?: string;
  }): Promise<Booking> {
    if (config.useMock) {
      const mockBooking: Booking = {
        ...ALL_BOOKINGS[0],
        id: 'b_mock_' + Date.now(),
        address: data.address,
        date: new Date(data.scheduledAt).toLocaleDateString('en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }),
        status: 'upcoming',
      };
      return mockDelay(mockBooking);
    }
    const res = await apiClient.post<BackendBooking>('/consumer/bookings', data);
    return mapBooking(res);
  },

  async cancel(id: string): Promise<{ id: string; status: Booking['status'] }> {
    if (config.useMock) return mockDelay({ id, status: 'cancelled' });
    const data = await apiClient.put<{ _id: string; status: string }>(`/consumer/bookings/${id}/cancel`, { reason: 'Cancelled by user' });
    return { id: data._id, status: data.status as Booking['status'] };
  },
};

export default bookingsApi;
