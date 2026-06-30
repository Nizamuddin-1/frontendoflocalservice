// ─────────────────────────────────────────────────────────────────────────────
//  authStore — auth session + role
//  The `_layout.tsx` placeholder (`// Later: const { isLoggedIn } = useAuthStore()`)
//  is realized here. `role` mirrors Phase 4's RoleContext values so this store can
//  eventually become the single source of truth for role too.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand';
import { authApi } from '@/src/services/api';
import type { UserProfile } from '@/src/types';

export type Role = 'consumer' | 'provider';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  role: Role;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setRole: (role: Role) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  role: 'consumer',
  isLoggedIn: false,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { user, token } = await authApi.login(email, password);
      set({ user, token, isLoggedIn: true, loading: false });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : 'Login failed' });
    }
  },

  logout: async () => {
    const { token } = get();
    try {
      if (token) await authApi.logout(token);
    } finally {
      set({ user: null, token: null, isLoggedIn: false });
    }
  },

  setRole: (role) => set({ role }),
}));

export default useAuthStore;
