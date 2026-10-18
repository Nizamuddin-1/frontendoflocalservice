// ─────────────────────────────────────────────────────────────────────────────
//  Dev-Only Auto-Login Service
//  Provides automatic authentication on app launch for local testing.
//  Strictly DEV-ONLY; all operations are bypassed in production.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';
import { config } from '@/src/config/env';
import { DEV_USERS } from '@/src/config/devAuth';
import { authApi } from './api/endpoints/auth';
import { authLoginSuccess, authLoginFailure } from '@/src/redux/actions/appActions';
import { useAppDispatch } from '@/src/redux/store';
import { useRole, type Role } from '@/src/context/RoleContext';

/**
 * In-memory flag tracking whether the user has explicitly logged out during
 * the current app process session. Once true, auto-login will not re-trigger
 * until a full app restart.
 */
let hasLoggedOutInSession = false;

export function markLoggedOutInSession(): void {
  hasLoggedOutInSession = true;
  console.log('[DevAutoLogin] User logged out in current session. Auto-login suppressed.');
}

export function isLoggedOutInSession(): boolean {
  return hasLoggedOutInSession;
}

export function resetLoggedOutInSession(): void {
  hasLoggedOutInSession = false;
}

/**
 * Attempt to log in with pre-seeded dev test credentials for the given role.
 */
export async function loginWithDevAccount(role: Role, dispatch: any): Promise<boolean> {
  const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

  if (!isDev || !config.devAutoLogin) {
    return false;
  }

  if (hasLoggedOutInSession) {
    console.log('[DevAutoLogin] Skipping auto-login because user explicitly logged out in this session.');
    return false;
  }

  const credentials = DEV_USERS[role];
  if (!credentials) {
    console.warn(`[DevAutoLogin] No test credentials found for role: ${role}`);
    return false;
  }

  try {
    console.log(`[DevAutoLogin] Authenticating as ${role} (${credentials.email})...`);
    const session = await authApi.login(credentials.email, credentials.password);
    dispatch(authLoginSuccess(session));
    console.log(`[DevAutoLogin] ✓ Successfully logged in as ${role} (${credentials.name})`);
    return true;
  } catch (error: any) {
    const errorMsg = error?.message || 'Dev auto-login request failed';
    console.warn(`[DevAutoLogin] ⚠️ Auto-login failed: ${errorMsg}`);
    dispatch(authLoginFailure(errorMsg));
    return false;
  }
}

/**
 * Headless component that mounts inside RoleProvider to manage dev auto-login.
 * Authenticates on app launch and seamlessly re-authenticates when switching roles
 * via the dev toggle button, unless the user has explicitly logged out.
 */
export function DevAutoLogin(): null {
  const dispatch = useAppDispatch();
  const { role } = useRole();
  const activeRoleRef = useRef<Role | null>(null);

  useEffect(() => {
    const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';
    if (!isDev || !config.devAutoLogin || hasLoggedOutInSession) {
      return;
    }

    // Only authenticate if role has changed or first run
    if (activeRoleRef.current !== role) {
      activeRoleRef.current = role;
      loginWithDevAccount(role, dispatch);
    }
  }, [role, dispatch]);

  return null;
}
