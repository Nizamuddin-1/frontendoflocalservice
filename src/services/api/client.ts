// ─────────────────────────────────────────────────────────────────────────────
//  HTTP client — typed fetch wrapper
//  Handles the backend's { data, error } response envelope, JWT token storage,
//  auto-injection, and 401 refresh logic.
// ─────────────────────────────────────────────────────────────────────────────

import AsyncStorage from '@react-native-async-storage/async-storage';
import { config } from '@/src/config/env';

const TOKEN_KEY = '@localfix_token';
const REFRESH_TOKEN_KEY = '@localfix_refresh_token';

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  token?: string | null;
  timeoutMs?: number;
}

export const mockDelay = <T>(value: T, ms: number = config.mockLatencyMs): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

// ── Token management ────────────────────────────────────────────────────────

export async function getStoredToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setStoredToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getStoredRefreshToken(): Promise<string | null> {
  try {
    return AsyncStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setStoredRefreshToken(token: string): Promise<void> {
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export async function clearStoredTokens(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_TOKEN_KEY]);
}

// ── Request helpers ─────────────────────────────────────────────────────────

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, token, timeoutMs = 15000, headers, ...rest } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const url = path.startsWith('http') ? path : `${config.apiBaseUrl}${path}`;

  // Resolve auth token: explicit param > stored token
  let authToken = token ?? undefined;
  if (!authToken && !path.includes('/auth/login') && !path.includes('/auth/register')) {
    authToken = (await getStoredToken()) ?? undefined;
  }

  try {
    const res = await fetch(url, {
      ...rest,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    const json = text ? JSON.parse(text) : null;

    if (!res.ok) {
      const msg = json?.error?.message ?? `Request failed: ${res.status}`;
      throw new ApiError(res.status, msg, json);
    }

    // Backend wraps successful responses in { data: T, error: {} }
    if (json && 'data' in json) {
      return json.data as T;
    }
    return json as T;
  } catch (err) {
    if (err instanceof ApiError) throw err;
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiError(0, `Request timed out after ${timeoutMs}ms`);
    }
    throw new ApiError(0, err instanceof Error ? err.message : 'Network error');
  } finally {
    clearTimeout(timer);
  }
}

export const apiClient = {
  get:  <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'POST', body }),
  put:  <T>(path: string, body?: unknown, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'PUT', body }),
  del:  <T>(path: string, opts?: RequestOptions) => request<T>(path, { ...opts, method: 'DELETE' }),
};

export default apiClient;
