// ─────────────────────────────────────────────────────────────────────────────
//  Environment / build config
//  Central place for the API base URL and feature flags. When useMock is true,
//  the API layer resolves to local mock data. When false, real HTTP requests
//  are made to the backend.
// ─────────────────────────────────────────────────────────────────────────────

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

export const config = {
  /** Base URL for the REST API. Override via EXPO_PUBLIC_API_URL env var. */
  apiBaseUrl: 'http://10.200.82.121:4000/api',

  /** When true, the API layer returns local mock data instead of hitting the network. */
  useMock: false,

  /** Simulated latency (ms) for mock responses, so loading states behave realistically. */
  mockLatencyMs: 350,

  /** DEV-ONLY: automatically authenticate on app launch */
  devAutoLogin: isDev && process.env.EXPO_PUBLIC_DEV_AUTO_LOGIN === 'true',

  /** DEV-ONLY: role to auto-login as ('consumer' | 'provider') */
  devAutoLoginRole: ((process.env.EXPO_PUBLIC_DEV_AUTO_LOGIN_ROLE === 'provider' ? 'provider' : 'consumer') as 'consumer' | 'provider'),
} as const;

export type AppConfig = typeof config;

export default config;
