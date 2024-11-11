import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Transaction, AssetType, Profile } from '../types/types';

interface UserStore {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  updateBalance: (amount: number) => void;
  updateAsset: (asset: AssetType, amount: number) => void;
  updateProfile: (profile: Omit<Profile, 'createdAt'>) => void;
  hasProfile: () => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      login: (username: string) => set({
        user: {
          id: Math.random().toString(36).substr(2, 9),
          username,
          balance: 10000,
          assets: {
            Au: 0,
            Ag: 0
          },
          transactions: [],
          profile: null
        }
      }),
      logout: () => set({ user: null }),
      addTransaction: (transaction) => set((state) => ({
        user: state.user ? {
          ...state.user,
          transactions: [
            ...state.user.transactions,
            {
              ...transaction,
              id: Math.random().toString(36).substr(2, 9),
              date: new Date()
            }
          ]
        } : null
      })),
      updateBalance: (amount) => set((state) => ({
        user: state.user ? {
          ...state.user,
          balance: state.user.balance + amount
        } : null
      })),
      updateAsset: (asset: AssetType, amount: number) => set((state) => ({
        user: state.user ? {
          ...state.user,
          assets: {
            ...state.user.assets,
            [asset]: (state.user.assets[asset] || 0) + amount
          }
        } : null
      })),
      updateProfile: (profileData) => set((state) => ({
        user: state.user ? {
          ...state.user,
          profile: {
            ...profileData,
            createdAt: new Date()
          }
        } : null
      })),
      hasProfile: () => {
        const state = get();
        return state.user?.profile !== null;
      }
    }),
    {
      name: 'user-storage'
    }
  )
);