// ─────────────────────────────────────────────────────────────────────────────
//  DEV-ONLY Test Credentials
//  Used exclusively for automated login during local development.
//  Protected by dev checks; never used in production.
// ─────────────────────────────────────────────────────────────────────────────

export interface DevCredentials {
  email: string;
  password: string;
  role: 'consumer' | 'provider';
  name: string;
}

export const DEV_USERS: Record<'consumer' | 'provider', DevCredentials> = {
  consumer: {
    email: 'nizamuddin@test.com',
    password: 'Test@1234',
    role: 'consumer',
    name: 'Nizamuddin',
  },
  provider: {
    email: 'shamsuddin@test.com',
    password: 'Test@1234',
    role: 'provider',
    name: 'Shamsuddin',
  },
};
