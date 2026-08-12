// ─── Provider endpoints ───────────────────────────────────────────────────────
// Real HTTP calls to the backend provider APIs.
import { apiClient } from '../client';
import type { Booking as ProviderBooking, DashboardJob } from '@/app/provider/src/types';

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
  monthEarnings?: number;
  avgRating?: number;
  monthGrowth?: number;
  jobsDone?: number;
}

/** Backend booking shape from provider routes. */
interface BackendProviderBooking {
  _id: string;
  serviceName: string;
  customer: { name: string; initials: string; phone: string; rating?: number; totalOrders?: number };
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
  services?: { _id: string; name: string; quantity: number; price: number }[];
  durationMins?: number;
  distanceKm?: number;
}

function mapProviderBooking(b: BackendProviderBooking): ProviderBooking {
  return {
    id: b._id,
    requestNo: b.bookingRef || b._id.substring(0, 8),
    status: (b.providerStatus || b.status || 'new') as any,
    serviceType: b.serviceName,
    iconBg: b.bg || '#EEF2FF',
    customer: {
      id: 'cust_1',
      name: b.customer?.name || 'Customer',
      initials: b.customer?.initials || 'C',
      rating: b.customer?.rating || 4.5,
      totalOrders: b.customer?.totalOrders || 1,
      phone: b.customer?.phone || '',
    },
    services: b.services?.map(s => ({
      id: s._id,
      name: s.name,
      quantity: s.quantity || 1,
      price: s.price || b.totalAmount || 0
    })) || [{ id: '1', name: b.serviceName, quantity: 1, price: b.totalAmount }],
    location: {
      address: b.address,
      city: '',
      distanceKm: b.distanceKm || 2.5,
      etaMins: 10,
    },
    scheduledAt: b.scheduledAt,
    durationMins: b.durationMins || 60,
    payment: b.isPaid ? 'prepaid' : 'cash',
    totalAmount: b.totalAmount,
  };
}

function mapDashboardJob(b: BackendProviderBooking): DashboardJob {
  const dateObj = new Date(b.scheduledAt);
  const timeStr = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  
  return {
    id: b._id,
    initials: b.customer?.initials || 'C',
    avatarBg: b.bg || '#EEF2FF',
    avatarText: b.color || '#6366F1',
    name: b.customer?.name || 'Customer',
    jobType: b.serviceName,
    status: (b.providerStatus || b.status || 'new') as any,
    timeLabel: `Today · ${timeStr} · 2.5 km`,
    amount: b.totalAmount,
    screen: 'BookingDetails', // default screen for new/active jobs
  };
}

export const providerApi = {
  async getStats(): Promise<any> {
    const stats = await apiClient.get<ProviderStats>('/provider/stats');
    // Map to expected DashboardStats shape
    return {
      todayJobs: stats.jobsInProgress || 0,
      monthEarnings: stats.monthEarnings || stats.monthlyEarnings || 0,
      avgRating: stats.avgRating || stats.rating || 0,
      completionRate: stats.completionRate || 0,
      jobsDone: stats.jobsDone || stats.jobsCompleted || 0,
      monthGrowth: stats.monthGrowth || 0,
    };
  },

  async getDashboardJobs(): Promise<DashboardJob[]> {
    const data = await apiClient.get<BackendProviderBooking[]>('/provider/bookings');
    return data.map(mapDashboardJob);
  },

  async getBookings(): Promise<ProviderBooking[]> {
    const data = await apiClient.get<BackendProviderBooking[]>('/provider/bookings');
    return data.map(mapProviderBooking);
  },

  async updateBookingStatus(
    id: string,
    status: string,
  ): Promise<{ _id: string; status: string; providerStatus: string }> {
    return apiClient.put(`/provider/bookings/${id}/status`, { status });
  },

  async toggleAvailability(): Promise<{ isAvailable: boolean }> {
    return apiClient.put('/provider/availability');
  },

  async getProfile(): Promise<any> {
    return apiClient.get('/provider/profile');
  },
};

export default providerApi;
