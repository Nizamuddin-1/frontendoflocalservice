// ─────────────────────────────────────────────────────────────────────────────
//  Dev-Only Auto-Login Service
//  Provides automatic authentication on app launch for local testing.
//  Strictly DEV-ONLY; all operations are bypassed in production.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react';
import { config } from '@/src/config/env';
import { DEV_USERS } from '@/src/config/devAuth';
import { authApi } from './api/endpoints/auth';
import { getStoredToken } from './api/client';
import { authLoginSuccess, authLoginFailure } from '@/src/redux/actions/appActions';
import { useAppDispatch, useAppSelector } from '@/src/redux/store';
import { useRole, type Role } from '@/src/context/RoleContext';

/**
 * In-memory flags tracking explicit user actions during the current app session.
 * If user explicitly logged out or manually logged in, dev auto-login is permanently
 * suppressed to prevent overwriting user sessions.
 */
let hasLoggedOutInSession = false;
let hasManualLoggedInSession = false;

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

export function markManualLoginInSession(): void {
  hasManualLoggedInSession = true;
  console.log('[DevAutoLogin] Manual login detected. Dev auto-login permanently disabled.');
}

export function isManualLoggedInSession(): boolean {
  return hasManualLoggedInSession;
}

export function resetManualLoginInSession(): void {
  hasManualLoggedInSession = false;
}

/**
 * Attempt to log in with pre-seeded dev test credentials for the given role.
 * Will abort if any real user session or manual login is active.
 */
export async function loginWithDevAccount(role: Role, dispatch: any): Promise<boolean> {
  const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

  if (!isDev || !config.devAutoLogin) {
    return false;
  }

  if (hasLoggedOutInSession) {
    console.log('[DevAutoLogin] Skipping auto-login: user explicitly logged out in this session.');
    return false;
  }

  if (hasManualLoggedInSession) {
    console.log('[DevAutoLogin] Skipping auto-login: manual login active in this session.');
    return false;
  }

  // Guard against overwriting an existing saved session
  const existingToken = await getStoredToken();
  if (existingToken) {
    console.log('[DevAutoLogin] Stored token detected. Skipping dev test credentials injection.');
    return false;
  }

  const credentials = DEV_USERS[role];
  if (!credentials) {
    console.warn(`[DevAutoLogin] No test credentials found for role: ${role}`);
    return false;
  }

  try {
    console.log(`[DevAutoLogin] Authenticating as dev ${role} (${credentials.email})...`);
    const session = await authApi.login(credentials.email, credentials.password);
    
    // Double check that user hasn't logged in manually while request was in-flight
    if (hasManualLoggedInSession || hasLoggedOutInSession) {
      console.log('[DevAutoLogin] In-flight dev auto-login cancelled due to session state change.');
      return false;
    }

    dispatch(authLoginSuccess(session));
    console.log(`[DevAutoLogin] ✓ Successfully logged in as dev ${role} (${credentials.name})`);
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
 * Only triggers on cold launch if no user is authenticated or manually logged in.
 */
export function DevAutoLogin(): null {
  const dispatch = useAppDispatch();
  const { role } = useRole();
  const { isLoggedIn } = useAppSelector((s) => s.consumer.auth);
  const initializedRef = useRef<boolean>(false);

  useEffect(() => {
    const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';
    if (!isDev || !config.devAutoLogin || hasLoggedOutInSession || hasManualLoggedInSession || isLoggedIn) {
      return;
    }

    // Only attempt on initial app launch once
    if (!initializedRef.current) {
      initializedRef.current = true;
      loginWithDevAccount(role, dispatch);
    }
  }, [role, dispatch, isLoggedIn]);

  return null;
}
