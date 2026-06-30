// ─── Auth endpoints ───────────────────────────────────────────────────────────
// Mock-backed while config.useMock is true; real fetch path written but dormant.
import { config } from '@/src/config/env';
import { apiClient, mockDelay } from '../client';
import { USER } from '@/src/services/mock';
import type { UserProfile } from '@/src/types';

export interface AuthSession {
  user: UserProfile;
  token: string;
}

export const authApi = {
  async login(email: string, _password: string): Promise<AuthSession> {
    if (config.useMock) {
      return mockDelay({ user: { ...USER, email: email || USER.email }, token: 'mock-token' });
    }
    return apiClient.post<AuthSession>('/auth/login', { email, password: _password });
  },

  async me(token: string): Promise<UserProfile> {
    if (config.useMock) return mockDelay(USER);
    return apiClient.get<UserProfile>('/auth/me', { token });
  },

  async logout(token: string): Promise<void> {
    if (config.useMock) return mockDelay(undefined);
    await apiClient.post<void>('/auth/logout', {}, { token });
  },
};

export default authApi;
