// ─── Wallet endpoints ─────────────────────────────────────────────────────────
// Mock-backed while config.useMock is true; real fetch path written but dormant.
import { config } from '@/src/config/env';
import { apiClient, mockDelay } from '../client';
import { TRANSACTIONS } from '@/src/services/mock';
import type { Transaction } from '@/src/types';

/** Seed balance mirrors the consumer wallet screen's initial useState(3613). */
const SEED_BALANCE = 3613;

export const walletApi = {
  async getBalance(): Promise<number> {
    if (config.useMock) return mockDelay(SEED_BALANCE);
    return apiClient.get<{ balance: number }>('/wallet/balance').then((r) => r.balance);
  },

  async getTransactions(): Promise<Transaction[]> {
    if (config.useMock) return mockDelay(TRANSACTIONS);
    return apiClient.get<Transaction[]>('/wallet/transactions');
  },

  async addMoney(amount: number): Promise<{ balance: number }> {
    if (config.useMock) return mockDelay({ balance: SEED_BALANCE + amount });
    return apiClient.post<{ balance: number }>('/wallet/add', { amount });
  },
};

export default walletApi;
