// ─────────────────────────────────────────────────────────────────────────────
//  HTTP client — typed fetch wrapper
//  Dependency-free (React Native ships fetch). Provides JSON handling, base URL,
//  bearer-auth header injection, timeout, and a typed ApiError. Endpoint modules
//  build on this; while config.useMock is true they short-circuit to mock data
//  and this client is dormant but ready.
// ─────────────────────────────────────────────────────────────────────────────

import { config } from '@/src/config/env';

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
  /** Plain object — serialized to JSON automatically. */
  body?: unknown;
  /** Bearer token; when present an Authorization header is added. */
  token?: string | null;
  /** Abort the request after this many ms (default 15000). */
  timeoutMs?: number;
}

/** Simulated latency helper for the mock path. */
export const mockDelay = <T>(value: T, ms: number = config.mockLatencyMs): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, token, timeoutMs = 15000, headers, ...rest } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  const url = path.startsWith('http') ? path : `${config.apiBaseUrl}${path}`;

  try {
    const res = await fetch(url, {
      ...rest,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      throw new ApiError(res.status, `Request failed: ${res.status} ${res.statusText}`, data);
    }
    return data as T;
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
