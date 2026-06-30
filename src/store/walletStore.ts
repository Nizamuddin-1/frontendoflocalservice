// ─────────────────────────────────────────────────────────────────────────────
//  walletStore — balance + transactions
//  Loads via the API layer (mock-backed today). `addMoney` mirrors the consumer
//  wallet screen's local handler so the screen can adopt this store later.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from 'zustand';
import { walletApi } from '@/src/services/api';
import type { Transaction } from '@/src/types';

interface WalletState {
  balance: number;
  transactions: Transaction[];
  loading: boolean;
  error: string | null;

  fetchWallet: () => Promise<void>;
  addMoney: (amount: number) => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  balance: 0,
  transactions: [],
  loading: false,
  error: null,

  fetchWallet: async () => {
    set({ loading: true, error: null });
    try {
      const [balance, transactions] = await Promise.all([
        walletApi.getBalance(),
        walletApi.getTransactions(),
      ]);
      set({ balance, transactions, loading: false });
    } catch (e) {
      set({ loading: false, error: e instanceof Error ? e.message : 'Failed to load wallet' });
    }
  },

  addMoney: async (amount) => {
    const { balance } = await walletApi.addMoney(amount);
    set({ balance });
  },
}));

export default useWalletStore;
