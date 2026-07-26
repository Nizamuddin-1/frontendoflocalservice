// ─────────────────────────────────────────────────────────────────────────────
//  Environment / build config
//  Central place for the API base URL and feature flags. When useMock is true,
//  the API layer resolves to local mock data. When false, real HTTP requests
//  are made to the backend.
// ─────────────────────────────────────────────────────────────────────────────

export const config = {
  /** Base URL for the REST API. Override via EXPO_PUBLIC_API_URL env var. */
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000/api',

  /** When true, the API layer returns local mock data instead of hitting the network. */
  useMock: false,

  /** Simulated latency (ms) for mock responses, so loading states behave realistically. */
  mockLatencyMs: 350,
} as const;

export type AppConfig = typeof config;

export default config;
