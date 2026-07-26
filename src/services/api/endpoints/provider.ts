// ─── Provider endpoints ───────────────────────────────────────────────────────
// Real HTTP calls to the backend provider APIs.
import { config } from '@/src/config/env';
import { apiClient, mockDelay } from '../client';
import type { Booking } from '@/src/types';

/** Mock provider stats for fallback. */
const MOCK_PROVIDER_STATS = {
  todayEarnings: 1200,
  weeklyEarnings: 8500,
  monthlyEarnings: 34200,
  jobsCompleted: 156,
  jobsInProgress: 2,
  pendingPayments: 1800,
  rating: 4.8,
  completionRate: 98,
};

/** Mock provider bookings for fallback. */
const MOCK_PROVIDER_BOOKINGS: Booking[] = [
  {
    id: 'pb1', serviceName: 'AC Deep Service', providerName: 'Rahul Sharma',
    category: 'AC & Cooling', mcIcon: 'air-conditioner', status: 'ongoing',
    date: 'Today', timeSlot: '2:00 PM - 3:30 PM',
    address: '42, Koramangala, Bengaluru', price: 599, isPaid: true,
    bookingRef: 'LF-20260701-001', accentColor: '#1B4FD8', proAvatar: 'RS',
  },
  {
    id: 'pb2', serviceName: 'MCB Panel Replacement', providerName: 'Priya Patel',
    category: 'Electrical', mcIcon: 'lightning-bolt', status: 'upcoming',
    date: 'Today', timeSlot: '4:00 PM - 5:00 PM',
    address: '78, Andheri West, Mumbai', price: 299, isPaid: false,
    bookingRef: 'LF-20260701-002', accentColor: '#B07D2E', proAvatar: 'PP',
  },
];

/** Backend provider stats shape. */
interface ProviderStats {
  todayEarnings: number;
  weeklyEarnings: number;
  monthlyEarnings: number;
  jobsCompleted: number;
  jobsInProgress: number;
  pendingPayments: number;
  rating: number;
  completionRate: number;
}

/** Backend booking shape from provider routes. */
interface BackendProviderBooking {
  _id: string;
  serviceName: string;
  customer: { name: string; initials: string; phone: string };
  status: string;
  providerStatus: string;
  scheduledAt: string;
  timeSlot: string;
  address: string;
  totalAmount: number;
  isPaid: boolean;
  bookingRef: string;
  mcIcon: string;
  color: string;
  bg: string;
  category: string;
  canTrack?: boolean;
  steps?: any[];
  photos?: string[];
  notes?: string;
}

function mapProviderBooking(b: BackendProviderBooking): Booking {
  return {
    id: b._id,
    serviceName: b.serviceName,
    providerName: b.customer?.name || '',
    category: b.category,
    mcIcon: b.mcIcon,
    status: b.status as Booking['status'],
    date: b.scheduledAt ? new Date(b.scheduledAt).toLocaleDateString() : '',
    timeSlot: b.timeSlot,
    address: b.address,
    price: b.totalAmount,
    isPaid: b.isPaid,
    bookingRef: b.bookingRef,
    accentColor: b.color,
    proAvatar: b.customer?.initials || '',
    canTrack: b.canTrack,
  };
}

export const providerApi = {
  async getStats(): Promise<ProviderStats> {
    if (config.useMock) return mockDelay(MOCK_PROVIDER_STATS);
    return apiClient.get<ProviderStats>('/provider/stats');
  },

  async getBookings(): Promise<Booking[]> {
    if (config.useMock) return mockDelay(MOCK_PROVIDER_BOOKINGS);
    const data = await apiClient.get<BackendProviderBooking[]>('/provider/bookings');
    return data.map(mapProviderBooking);
  },

  async updateBookingStatus(
    id: string,
    status: string,
  ): Promise<{ _id: string; status: string; providerStatus: string }> {
    if (config.useMock) return mockDelay({ _id: id, status, providerStatus: status });
    return apiClient.put(`/provider/bookings/${id}/status`, { status });
  },

  async toggleAvailability(): Promise<{ isAvailable: boolean }> {
    if (config.useMock) return mockDelay({ isAvailable: true });
    return apiClient.put('/provider/availability');
  },

  async getProfile(): Promise<any> {
    if (config.useMock) return mockDelay(null);
    return apiClient.get('/provider/profile');
  },
};

export default providerApi;
