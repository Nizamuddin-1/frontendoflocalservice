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

export interface RegisterParams {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'consumer' | 'provider';
}

function mapBackendUser(raw: AuthLoginResponse['user']): UserProfile {
  return {
    id: raw.id,
    role: raw.role,
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
  async register(params: RegisterParams): Promise<AuthSession> {
    if (config.useMock) {
      return mockDelay({
        user: { ...USER, id: 'mock-user-id', name: params.name, email: params.email, phone: params.phone, role: params.role },
        token: 'mock-token',
      });
    }

    const result = await apiClient.post<AuthLoginResponse>('/auth/register', params);

    // Persist tokens for subsequent requests
    await setStoredToken(result.accessToken);
    await setStoredRefreshToken(result.refreshToken);

    return {
      user: mapBackendUser(result.user),
      token: result.accessToken,
    };
  },

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

  async updateProfile(
    data: Partial<{ name: string; phone: string; email: string; location: string; avatar: string }>,
    token?: string
  ): Promise<UserProfile> {
    if (config.useMock) {
      Object.assign(USER, data);
      return mockDelay({ ...USER });
    }

    const raw = await apiClient.put<AuthLoginResponse['user']>('/consumer/profile', data, { token });
    return mapBackendUser(raw);
  },
};

export default authApi;
