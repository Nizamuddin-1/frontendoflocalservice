// ─────────────────────────────────────────────────────────────────────────────
//  Environment / build config
//  Central place for the API base URL and feature flags. No backend exists yet,
//  so `useMock` is true — the API layer resolves to local mock data. When a real
//  backend lands, set useMock=false (or wire EXPO_PUBLIC_API_URL) and the store
//  and screen code stay unchanged.
// ─────────────────────────────────────────────────────────────────────────────

export const config = {
  /** Base URL for the REST API. Override via app.json `extra` / EXPO_PUBLIC_API_URL later. */
  apiBaseUrl: process.env.EXPO_PUBLIC_API_URL ?? 'https://api.localfix.example',

  /** When true, the API layer returns local mock data instead of hitting the network. */
  useMock: true,

  /** Simulated latency (ms) for mock responses, so loading states behave realistically. */
  mockLatencyMs: 350,
} as const;

export type AppConfig = typeof config;

export default config;
