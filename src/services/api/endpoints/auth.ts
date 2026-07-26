// ─── Auth endpoints ───────────────────────────────────────────────────────────
// Real HTTP calls to the backend auth API.
import { config } from '@/src/config/env';
import { apiClient, mockDelay, setStoredToken, setStoredRefreshToken, clearStoredTokens } from '../client';
import { USER } from '@/src/services/mock';
import type { UserProfile } from '@/src/types';

export interface AuthLoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
    location: string;
    tier: string;
    loyaltyPoints: number;
  };
}

export interface AuthSession {
  user: UserProfile;
  token: string;
}

function mapBackendUser(raw: AuthLoginResponse['user']): UserProfile {
  return {
    name: raw.name,
    email: raw.email,
    phone: raw.phone,
    location: raw.location || '',
    memberSince: 'Jan 2024',
    avatar: raw.avatar || '',
    tier: raw.tier || 'Silver',
    totalSpent: 0,
    bookings: 0,
    savedAddresses: 0,
    loyaltyPoints: raw.loyaltyPoints || 0,
  };
}

export const authApi = {
  async login(email: string, password: string): Promise<AuthSession> {
    if (config.useMock) {
      return mockDelay({ user: { ...USER, email: email || USER.email }, token: 'mock-token' });
    }

    const result = await apiClient.post<AuthLoginResponse>('/auth/login', { email, password });

    // Persist tokens for subsequent requests
    await setStoredToken(result.accessToken);
    await setStoredRefreshToken(result.refreshToken);

    return {
      user: mapBackendUser(result.user),
      token: result.accessToken,
    };
  },

  async me(token: string): Promise<UserProfile> {
    if (config.useMock) return mockDelay(USER);

    const raw = await apiClient.get<AuthLoginResponse['user'] & { wallet?: any; providerProfile?: any }>('/auth/me', { token });
    return mapBackendUser(raw);
  },

  async logout(token: string): Promise<void> {
    if (config.useMock) return mockDelay(undefined);

    try {
      await apiClient.post<void>('/auth/logout', {}, { token });
    } finally {
      await clearStoredTokens();
    }
  },
};

export default authApi;
