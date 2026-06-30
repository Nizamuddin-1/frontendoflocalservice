// ─────────────────────────────────────────────────────────────────────────────
//  API layer — barrel export
//      import { authApi, bookingsApi, walletApi, apiClient } from '@/src/services/api';
// ─────────────────────────────────────────────────────────────────────────────

export { apiClient, ApiError, mockDelay } from './client';
export type { RequestOptions } from './client';

export { authApi } from './endpoints/auth';
export type { AuthSession } from './endpoints/auth';
export { bookingsApi } from './endpoints/bookings';
export { walletApi } from './endpoints/wallet';
