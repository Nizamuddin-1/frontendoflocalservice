// ─── Wallet endpoints ─────────────────────────────────────────────────────────
// Real HTTP calls to the backend consumer wallet/transaction APIs.
import { config } from '@/src/config/env';
import { apiClient, mockDelay } from '../client';
import { TRANSACTIONS } from '@/src/services/mock';
import type { Transaction } from '@/src/types';

const SEED_BALANCE = 3613;

/** Backend wallet shape. */
interface BackendWallet {
  balance: number;
  holdBalance: number;
  totalAdded: number;
  totalCashback: number;
}

/** Backend transaction shape. */
interface BackendTx {
  _id: string;
  title: string;
  subtitle: string;
  amount: number;
  type: string;
  status: string;
  date: string;
  time: string;
  icon: string;
  iconColor: string;
  bookingRef?: string;
}

function mapTx(t: BackendTx): Transaction {
  return {
    id: t._id,
    title: t.title,
    subtitle: t.subtitle,
    amount: t.amount,
    type: t.type as Transaction['type'],
    status: t.status as Transaction['status'],
    date: t.date,
    time: t.time,
    icon: t.icon,
    iconColor: t.iconColor,
    bookingRef: t.bookingRef,
  };
}

export const walletApi = {
  async getBalance(): Promise<number> {
    if (config.useMock) return mockDelay(SEED_BALANCE);
    const data = await apiClient.get<BackendWallet>('/consumer/wallet');
    return data.balance;
  },

  async getTransactions(): Promise<Transaction[]> {
    if (config.useMock) return mockDelay(TRANSACTIONS);
    const data = await apiClient.get<BackendTx[]>('/consumer/transactions');
    return data.map(mapTx);
  },

  async addMoney(amount: number): Promise<{ balance: number }> {
    if (config.useMock) return mockDelay({ balance: SEED_BALANCE + amount });
    const data = await apiClient.post<BackendWallet>('/consumer/wallet/add', { amount, paymentMethod: 'upi' });
    return { balance: data.balance };
  },
};

export default walletApi;
